import React, { useState, useContext, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import AuthCon from "../../context/AuthPro";
import MentorCon from "../../context/MentorPro";
import Accordion from 'react-bootstrap/Accordion';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import Spinner from 'react-bootstrap/Spinner';
import ListGroup from 'react-bootstrap/ListGroup';

function MyPractise() {
	const { auth } = useContext(AuthCon);
	const [prac, setPrac] = useState({});
	const [load, setLoad] = useState(true);

	async function fetchPracDet() {
		try {
			const response = await fetch(`http://localhost:3000/api/student/getPracDet`, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					"Authorization": `Bearer ${auth}`,
				},
			});
			const res = await response.json();
			console.log(11, res);
			setPrac({ ...res.data });
			setLoad(false)
		} catch (error) {
			console.error('Error fetching practice details:', error);
		}
	}

	useEffect(() => {
		if (auth) {
			fetchPracDet();
		}
	}, [auth]);

	return (
		<div className='container-fluid d-flex mb-3'>
			{load ? <div className='w-100 d-flex justify-content-center align-items-center'> <Spinner animation="border" role="status">
				<span className="visually-hidden">Loading...</span>
			</Spinner></div> : <div className='row w-100'>
				{Object.keys(prac).map((platform, i) => (
					<div key={i} className='ms-3 col-4'>
						<ListGroup >
							<ListGroup.Item active>{platform}</ListGroup.Item>
							{Object.entries(prac[platform]).map(([key, value], j) => (
								<ListGroup.Item key={j}>{key}: {String(value)}</ListGroup.Item>
							))}
						</ListGroup>
					</div>
				))}
			</div>}

		</div>
	);
}

export default function MenteesPractiseDetails() {
	const { user, students, year } = useContext(MentorCon);
	const [schedule, setSchedule] = useState()
	const { auth } = useContext(AuthCon);
	const mystyle = {
		backgroundColor: "#696747",
		color: "white",
	};

	async function fetchSchedule() {
		const response = await fetch(`http://localhost:3000/api/mentor/getSchedule/${year.curr}`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		});

		const res = await response.json();
		//console.log(res)
		setSchedule(res.data)
	}

	useEffect(() => {
		fetchSchedule()
	}, [])

	return (
		user !== null && (
			<div className="bodyBG">

				<div className="container-fluid">
					<div className="d-flex">
						<div className="">
							<Sidebar />
						</div>
						<div className="ms-3 flex-fill">
							<p className="fs-2 fw-bolder m-0"> Mentees Practise Details</p>
							<Accordion alwaysOpen  >
								{students && Object.values(students).map((q, i) => {
									return <Accordion.Item key={i} eventKey={i}>
										<Accordion.Header>{q.name}</Accordion.Header>
										<Accordion.Body>
											<MyPractise />
											<DataTable emptyMessage="No Assessment found." sortMode="multiple" sortField="name" sortOrder={-1} removableSort showGridlines stripedRows paginator rows={10} rowsPerPageOptions={[25, 50]} size={'small'} value={schedule} filterDisplay="row">
												<Column className="text-center" field="testno" header="Tests" filter sortable filterMatchMode="contains"></Column>
												<Column className="text-center" field="testno1" header="Aptitude" filter sortable filterMatchMode="contains"></Column>
												<Column className="text-center" field="testno2" header="Coding" filter sortable filterMatchMode="contains"></Column>
												<Column className="text-center" field="testno3" header="Others" filter sortable filterMatchMode="contains"></Column>
												<Column className="text-center" field="date" header="Date" filter sortable filterMatchMode="contains"></Column>
											</DataTable>
										</Accordion.Body>
									</Accordion.Item>
								})}
							</Accordion>
						</div>
					</div>
				</div>
			</div>
		)
	);
}
