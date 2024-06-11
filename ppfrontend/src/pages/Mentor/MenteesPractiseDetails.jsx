import React, { useState, useContext, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import AuthCon from "../../context/AuthPro";
import MentorCon from "../../context/MentorPro";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import Spinner from 'react-bootstrap/Spinner';
import ListGroup from 'react-bootstrap/ListGroup';

function MyPractise() {
	const { auth } = useContext(AuthCon);
	const [prac, setPrac] = useState({});
	const [load, setLoad] = useState(true);
	const baseURL = process.env.BASE_URL;

	async function fetchPracDet() {
		try {
			const response = await fetch(`${baseURL}/student/getPracDet`, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					"Authorization": `Bearer ${auth}`,
				},
			});
			const res = await response.json();
			setPrac({ ...res.data });
			setLoad(false);
		} catch (error) {
			console.error('Error fetching practice details:', error);
		}
	}

	useEffect(() => {
		if (auth) fetchPracDet();
	}, [auth]);

	return (
		<div className='container-fluid d-flex mb-3'>
			{load ? (
				<div className='w-100 d-flex justify-content-center align-items-center'>
					<Spinner animation="border" role="status">
						<span className="visually-hidden">Loading...</span>
					</Spinner>
				</div>
			) : (
				<div className='row w-100'>
					{Object.keys(prac).map((platform, i) => (
						<div key={i} className='ms-3 col-4'>
							<ListGroup>
								<ListGroup.Item active>{platform}</ListGroup.Item>
								{Object.entries(prac[platform]).map(([key, value], j) => (
									<ListGroup.Item key={j}>{key}: {String(value)}</ListGroup.Item>
								))}
							</ListGroup>
						</div>
					))}
				</div>
			)}
		</div>
	);
}

const Tests = ({ schedule }) => {
	const processData = (data) => {
		const rows = [];
		for (const rollno in data) {
			const assessments = data[rollno];
			if (Object.keys(assessments).length === 0) {
				rows.push({ rollno, assessment: '', marks: {} });
			} else {
				for (const assessment in assessments) {
					rows.push({ rollno, assessment, marks: assessments[assessment] });
				}
			}
		}
		return rows;
	};

	const [dataTableValue, setDataTableValue] = useState([]);

	useEffect(() => {
		if (schedule) setDataTableValue(processData(schedule));
	}, [schedule]);

	const rollnoBodyTemplate = (rowData) => {
		const rowSpan = Object.keys(schedule[rowData.rollno] || {}).length || 1;
		return (
			<span rowSpan={rowSpan}>{rowData.rollno}</span>
		);
	};

	const marksBodyTemplate = (rowData, col) => {
		return rowData.marks[col.field] !== undefined ? rowData.marks[col.field] : '-';
	};

	return (
		<div>
			{Array.isArray(dataTableValue) && (
				<DataTable value={dataTableValue} showGridlines stripedRows paginator rows={20} rowsPerPageOptions={[50, 70, 100]}
					rowGroupMode="rowspan" groupRowsBy="rollno" filterDisplay="row">
					<Column filter filterMatchMode="contains" showFilterMenu={false} field="rollno" header="Roll No" body={rollnoBodyTemplate} />
					<Column filter filterMatchMode="contains" showFilterMenu={false} field="assessment" header="Assessment" />
					<Column filter filterMatchMode="contains" showFilterMenu={false} field="aptitude" header="Aptitude" body={rowData => marksBodyTemplate(rowData, { field: 'aptitude' })} />
					<Column filter filterMatchMode="contains" showFilterMenu={false} field="coding" header="Coding" body={rowData => marksBodyTemplate(rowData, { field: 'coding' })} />
					<Column filter filterMatchMode="contains" showFilterMenu={false} field="others" header="Others" body={rowData => marksBodyTemplate(rowData, { field: 'others' })} />
				</DataTable>
			)}
		</div>
	);
};

export default function MenteesPractiseDetails() {
	const { user, students, year } = useContext(MentorCon);
	const [schedule, setSchedule] = useState([]);
	const { auth } = useContext(AuthCon);
	const baseURL = process.env.BASE_URL;

	async function fetchSchedule() {
		const response = await fetch(`${baseURL}/mentor/getSchedule/${year.curr}`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ rollno: Object.keys(students) })
		});
		const res = await response.json();
		console.log(res.data.tests);
		setSchedule(res.data.tests);
	}

	useEffect(() => {
		if (students) fetchSchedule();
	}, [students]);

	return (
		user !== null && (
			<div className="bodyBG">
				<div className="container-fluid">
					<div className="d-flex">
						<div>
							<Sidebar />
						</div>
						<div className="ms-3 flex-fill">
							<p className="fs-2 fw-bolder m-0">Mentees Practise Details</p>
							<Tests schedule={schedule} />
						</div>
					</div>
				</div>
			</div>
		)
	);
}
