import React, { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar";
import AuthCon from "../../context/AuthPro";
import MentorCon from "../../context/MentorPro";
import { useContext } from "react";
import Accordion from 'react-bootstrap/Accordion';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Table from 'react-bootstrap/Table';

export default function MenteesTrainingAttendance() {
	const { auth } = useContext(AuthCon);
	const { user, students } = useContext(MentorCon)
	const [att, setAtt] = useState()
	const [totalAtt, setTotalAtt] = useState()
	const [eventAtt, setEventAtt] = useState();
	const baseURL = process.env.BASE_URL

	const fetchAtt = async () => {
		const rollno = Object.keys(students);
		if (rollno.length > 0) {
			const response = await fetch(`${baseURL}/mentor/getAtt`, {
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
		if (students) { fetchAtt(); fetchEventAtt(); }
	}, [students])

	useEffect(() => {
		if (att) { const q = calculateOverallAttendancePercentage(att); setTotalAtt(q); }
	}, [att])

	const fetchEventAtt = async () => {
		let rollno = Object.keys(students);
		try {
			const response = await fetch(`${baseURL}/mentor/getEventAtt`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"Authorization": `Bearer ${auth}`,
				}, body: JSON.stringify({ rollno })
			});
			const res = await response.json();
			setEventAtt(res.data.att);
		} catch (error) {
			console.error('Error fetching attendance:', error);
		}
	};

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
										<Accordion.Header>{q.name}   </Accordion.Header>
										<Accordion.Body>
											<Tabs defaultActiveKey="general" id="uncontrolled-tab-example"  >
												<Tab className="p-3" eventKey="general" title="General">
													<DataTable className="text-center" size={"small"} sortMode="multiple" sortField="name" sortOrder={-1} removableSort showGridlines stripedRows paginator rows={25} rowsPerPageOptions={[50]} value={att[q.rollno]?.slice().reverse()} filterDisplay="row">
														<Column field="testno" header="#" filter sortable filterMatchMode="contains" body={(data, props) => <div className="fw-bold text-center"> Day {props.rowIndex + 1} </div>}> </Column>
														<Column className="fw-bold text-center" field="date" header="Aptitude" filter sortable filterMatchMode="contains"></Column>
														<Column field="attendence" header="Coding" filter sortable filterMatchMode="contains" body={(data, props) => <div className={`fw-bold text-center ${data.attendence === 'present' ? 'text-success' : 'text-danger'}`}>  {data.attendence} </div>}></Column>
													</DataTable>
												</Tab>
												{eventAtt && <Tab className="p-3" eventKey="event" title="Events">
													{console.log(eventAtt, q.rollno)}
													<Accordion>
														{eventAtt[q.rollno].map(event => {
															let i = 0;
															const t = Object.keys(event.attendance).length;
															Object.keys(event.attendance).map(datee => {
																if (event.attendance[datee].includes(q.rollno)) i = i + 1;
															})
															return <Accordion.Item eventKey={event.name}>
																<Accordion.Header>{event?.name} - {((i / t) * 100).toFixed(2)} Precentage</Accordion.Header>
																<Accordion.Body>
																	<div className="row">
																		<p className="p-6 col">des: {event.des}</p>
																		<p className="p-6 col">startTime: {event.startTime}</p>
																		<p className="p-6 col">endTime: {event.endTime}</p>
																		<p className="p-6 col">rec : {event.rec}</p>
																	</div>
																	<Table striped bordered hover>
																		<thead>
																			<tr>
																				<th>Date</th>
																				<th>Attendance</th>
																			</tr>
																		</thead>
																		<tbody>
																			{event.attendance && Object.keys(event.attendance).map(datee => (
																				<tr key={datee}>
																					<td>{datee}</td>
																					<td>{event.attendance[datee].includes(q.rollno) ? 'Present' : 'Absent'}</td>
																				</tr>
																			))}
																		</tbody>
																	</Table>
																</Accordion.Body>
															</Accordion.Item>
														})}
													</Accordion>
												</Tab>}
											</Tabs>
										</Accordion.Body>
									</Accordion.Item>
								})}
							</Accordion>}
						</div>

					</div >
				</div >
			</div >
		)
	);
}
