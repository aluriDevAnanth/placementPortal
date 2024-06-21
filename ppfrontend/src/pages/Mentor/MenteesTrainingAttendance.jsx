import React, { useEffect, useState, useRef } from "react";
import Sidebar from "./components/Sidebar";
import AuthCon from "../../context/AuthPro";
import MentorCon from "../../context/MentorPro";
import { useContext } from "react";
import Accordion from 'react-bootstrap/Accordion';
import { DataTable } from 'primereact/datatable';
import { Toast } from 'primereact/toast';
import { Column } from 'primereact/column';
import Table from 'react-bootstrap/Table';

function AttTable({ students, totalEventAtt, eventAtt }) {
	const toast = useRef(null);
	const [expandedRows, setExpandedRows] = useState(null);
	console.log();
	let disObj = Object.values(students).map(q => {
		const percentage = (totalEventAtt[q.rollno] * 100).toFixed(2);
		return {
			name: q.name,
			rollno: q.rollno,
			per: isNaN(percentage) ? '0.00' : percentage
		};
	});

	const allowExpansion = (rowData) => {
		return true
	};

	const onRowExpand = (event) => {
		toast.current.show({ severity: 'info', summary: 'Product Expanded', detail: event.data.name, life: 3000 });
	};

	const onRowCollapse = (event) => {
		toast.current.show({ severity: 'success', summary: 'Product Collapsed', detail: event.data.name, life: 3000 });
	};

	const rowExpansionTemplate = (data) => {
		return (
			<div className="p-3 border rounded-3 border-3 m-2">
				<p className='fs-5 fw-bold'>Attendence for {data.name}</p>
				<Accordion>
					{eventAtt[data.rollno].length > 0 ? eventAtt[data.rollno].map(event => {
						let i = 0;
						const t = Object.keys(event.attendance).length;
						Object.keys(event.attendance).map(datee => {
							if (event.attendance[datee].includes(data.rollno)) i = i + 1;
						})
						return <Accordion.Item key={event.name} eventKey={event.name}>
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
												<td>{event.attendance[datee].includes(data.rollno) ? 'Present' : 'Absent'}</td>
											</tr>
										))}
									</tbody>
								</Table>
							</Accordion.Body>
						</Accordion.Item>
					}) : <p>This Student not in any event or student attendence is 0%</p>}
				</Accordion>
			</div>
		);
	};

	return <>
		<Toast ref={toast} />
		<DataTable className="w-100" value={disObj} expandedRows={expandedRows} onRowToggle={(e) => setExpandedRows(e.data)}
			onRowExpand={onRowExpand} onRowCollapse={onRowCollapse} rowExpansionTemplate={rowExpansionTemplate} reorderableColumns resizableColumns size='small' showGridlines stripedRows paginator rows={20} rowsPerPageOptions={[30, 50, 100, 200]} filterDisplay="row" emptyMessage="No Students found." removableSort sortField="name" sortOrder={1}>
			<Column expander={allowExpansion} style={{ width: '5rem' }} />
			<Column sortable filter filterMatchMode="contains" className='text-center' showFilterMenu={false} field="name" header="Name" />
			<Column sortable filter filterMatchMode="contains" className='text-center' showFilterMenu={false} field="per" header="Toatl attendence" />
		</DataTable>
	</>
}

function Att({ students, att, totalAtt }) {
	const { auth } = useContext(AuthCon);
	const { year } = useContext(MentorCon);
	const [eventAtt, setEventAtt] = useState();
	const [totalEventAtt, setTotalEventAtt] = useState(0);
	const baseURL = process.env.BASE_URL

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

	useEffect(() => {
		if (eventAtt && Object.keys(eventAtt).length > 0) {
			let tt = {}
			Object.values(students).map(s => {
				let tot = 0;
				let presentCount = 0;
				eventAtt[s.rollno].map(event => {
					tot = tot + Object.keys(event.attendance).length;
					Object.keys(event.attendance).forEach(date => {
						if (event.attendance[date].includes(s.rollno)) presentCount++;
					});
					tt[s.rollno] = presentCount / tot;
				});
			})
			setTotalEventAtt(tt);
		}
		console.log(students, att, totalAtt);
	}, [eventAtt]);

	useEffect(() => {
		if (students) { fetchEventAtt(); }

	}, [students])

	return (
		<div className="container-fluid d-flex">
			{students && totalEventAtt && eventAtt && <AttTable students={students} totalEventAtt={totalEventAtt} eventAtt={eventAtt} />}
		</div>
	)
}

export default function MenteesTrainingAttendance() {
	const { auth } = useContext(AuthCon);
	const { user, students } = useContext(MentorCon)
	const [att, setAtt] = useState()
	const [totalAtt, setTotalAtt] = useState()
	const [eventAtt, setEventAtt] = useState();
	const baseURL = process.env.BASE_URL
	const [totalEventAtt, setTotalEventAtt] = useState(0);

	useEffect(() => {
		if (eventAtt && Object.keys(eventAtt).length > 0) {
			let tt = {}
			Object.values(students).map(s => {
				let tot = 0;
				let presentCount = 0;
				eventAtt[s.rollno].map(event => {
					tot = tot + Object.keys(event.attendance).length;
					Object.keys(event.attendance).forEach(date => {
						if (event.attendance[date].includes(s.rollno)) presentCount++;
					});
					tt[s.rollno] = presentCount / tot;
				});
			})
			setTotalEventAtt(tt);
		}
	}, [eventAtt]);

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
							{students && att && totalAtt && <Att students={students} att={att} totalAtt={totalAtt} />}
						</div>

					</div >
				</div >
			</div >
		)
	);
}
