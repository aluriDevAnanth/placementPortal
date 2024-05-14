import React, { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar";
import AuthCon from "../../context/AuthPro";
import MentorCon from "../../context/MentorPro";
import { useContext } from "react";
import Accordion from 'react-bootstrap/Accordion';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

export default function MenteesTrainingAttendance() {
	const { auth } = useContext(AuthCon);
	const { user, students } = useContext(MentorCon)
	const [att, setAtt] = useState()
	const [totalAtt, setTotalAtt] = useState()

	const fetchAtt = async () => {
		const rollno = Object.keys(students);
		if (rollno.length > 0) {
			const response = await fetch("http://localhost:3000/api/mentor/getAtt", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"Authorization": `Bearer ${auth}`,
				},
				body: JSON.stringify({ rollno }),
			});
			const res = await response.json();
			setAtt(res.data.att);
		}
	};

	const calculateOverallAttendancePercentage = (attendanceData) => {
		let a = {}
		Object.keys(attendanceData).map((q, i) => {
			let totalDays = 0; let presentDays = 0;

			totalDays += attendanceData[q].length;
			presentDays = attendanceData[q].filter(item => item.attendence === 'present').length;
			a[q] = (totalDays > 0 ? (presentDays / totalDays) * 100 : 0).toFixed(2);
		})
		return a;
	};

	useEffect(() => {
		if (students) fetchAtt();
	}, [students])

	useEffect(() => {
		if (att) { const q = calculateOverallAttendancePercentage(att); setTotalAtt(q); }
	}, [att])

	return (
		user !== null && (
			<div className="bodyBG">
				<div className="container-fluid">
					<div className="d-flex">
						<div className="">
							<Sidebar />
						</div>
						<div className="ms-3 flex-fill bg-white p-3 rounded-3">
							<p className="fs-2 fw-bolder m-0"> Mentees Training Attendance</p>
							{students && att && totalAtt && <Accordion alwaysOpen>
								{Object.values(students).map((q, i) => {
									return <Accordion.Item key={i} eventKey={i}>
										<Accordion.Header>{q.name}  <span className={`ms-2 fs-5 fw-bold ${q.rollno >= 80 ? 'text-success' : 'text-danger'}`}>{totalAtt[q.rollno]} total Attendence</span> </Accordion.Header>
										<Accordion.Body>
											<DataTable className="text-center" size={"small"} sortMode="multiple" sortField="name" sortOrder={-1} removableSort showGridlines stripedRows paginator rows={25} rowsPerPageOptions={[50]} value={att[q.rollno]?.slice().reverse()} filterDisplay="row">
												<Column field="testno" header="#" filter sortable filterMatchMode="contains" body={(data, props) => <div className="fw-bold text-center"> Day {props.rowIndex + 1} </div>}> </Column>
												<Column className="fw-bold text-center" field="date" header="Aptitude" filter sortable filterMatchMode="contains"></Column>
												<Column field="attendence" header="Coding" filter sortable filterMatchMode="contains" body={(data, props) => <div className={`fw-bold text-center ${data.attendence === 'present' ? 'text-success' : 'text-danger'}`}>  {data.attendence} </div>}></Column>
											</DataTable>
										</Accordion.Body>
									</Accordion.Item>
								})}
							</Accordion>}
						</div>

					</div>
				</div>
			</div>
		)
	);
}
