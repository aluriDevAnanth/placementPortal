import React, { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar";
import AuthCon from "../../context/AuthPro";
import MentorCon from "../../context/MentorPro";
import { useContext } from "react";

export default function Attendence() {
	const { auth } = useContext(AuthCon);
	const { user, students } = useContext(MentorCon)
	const [att, setAtt] = useState({})

	const mystyle = {
		backgroundColor: "#696747",
		color: "white",
	};

	const fetchAtt = async (rollno) => {
		console.log(1);
		if (rollno.length > 0) {
			const response = await fetch("http://localhost:3000/api/mentor/getAtt", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"Authorization": `Bearer ${auth}`,
				},
				body: JSON.stringify({ rollno }),
			});
			const data = await response.json();
			setAtt({ ...data.data });
			// console.log(data);
		}
	};


	const rollnoAtt = async () => {
		try {
			const rollno = await students.map(q => q.rollno);
			fetchAtt(rollno)
		} catch (error) {
			console.error("Error fetching attendance:", error.message);
		}
	};

	useEffect(() => {
		rollnoAtt()
	}, [students])

	const calculateAttendancePercentage = (data) => {
		let filteredData = data;
		const totalDays = filteredData.length;
		const presentDays = filteredData.filter(item => item.attendence === 'present').length;

		return (presentDays / totalDays) * 100;
	};

	let per; let c;

	return (
		user !== null && (
			<div className="bodyBG">
				<div className="container-fluid">
					<div className="d-flex">
						<div className="">
							<Sidebar />
						</div>
						{students ? (
							<div className="flex-fill ms-3 border-primary me-3">
								<ul className="list-group">
									{students.map((q, i) => {
										return (
											<li key={i} className="list-group-item">
												<p className="d-inline-flex gap-1">
													<button className="btn" type="button" data-bs-toggle="collapse" data-bs-target={`#collapse_${q.rollno}`} aria-expanded="false" aria-controls={`collapse_${q.rollno}`} style={mystyle}>{q.rollno} - {q.name}
													</button>
												</p>
												<p className="fw-bold">
													Latest week attendence ---Technical - xx% | Domain - x% | Aptitude - N/A%
												</p>
												<div className="collapse shadow" id={`collapse_${q.rollno}`} >
													<nav className="">
														<div className="nav nav-tabs column-gap-1" id="nav-tab" role="tablist">

															<button className="nav-link active" id="nav-home-tab" data-bs-toggle="tab" data-bs-target={`#technical_${q.rollno}`} type="button" role="tab" aria-controls={`technical_${q.rollno}`} aria-selected="true" style={mystyle}> Technical </button>

															<button className="nav-link" id="nav-profile-tab" data-bs-toggle="tab" data-bs-target={`#domain_${q.rollno}`} type="button" role="tab" aria-controls={`domain_${q.rollno}`} aria-selected="false" style={mystyle}>Domain</button>

															<button className="nav-link" id="nav-contact-tab" data-bs-toggle="tab" data-bs-target={`#aptitude_${q.rollno}`} type="button" role="tab" aria-controls="nav-contact" aria-selected="false" style={mystyle} >
																Aptitude
															</button>

														</div>
													</nav>
													{Object.keys(att).length > 0 && <div
														className="tab-content container me-5 border-dark p-3"
														id="nav-tabContent"
													>
														<div className="tab-pane fade show active" id={`technical_${q.rollno}`} role="tabpanel" aria-labelledby="nav-home-tab" tabIndex="0">
															<p className="fs-4 fw-bold">Technical</p>
															<p className="fs-6 fw-bold">{`${q.rollno}'s`} Attendence: xx.xx %</p>

															<table className="shadow table table-bordered  table-hover">
																<tbody>
																	<tr className="text-center text-light" style={mystyle}>
																		<th>Week</th>
																		<th>Weekly Attendence</th>
																		<th>Date</th>
																		<th>Attendence</th>
																	</tr>
																	{Object.keys(att).length > 0 && Object.keys(att[q.rollno]['technical']).reverse().map((qq, index) => {
																		const weekData = att[q.rollno]['technical'][qq].reverse();
																		{
																			per = calculateAttendancePercentage(weekData).toFixed(2)
																			if (per <= 49) {
																				c = 'text-danger';
																			} else if (per <= 74) {
																				c = 'text-warning';
																			} else {
																				c = 'text-success';
																			}

																		}
																		return weekData.map((q, subIndex) => (
																			<tr key={q._id} className="text-center text-light" style={mystyle}>

																				{subIndex === 0 && (
																					<>
																						<td rowSpan={weekData.length}>{q.week}</td>
																						<td rowSpan={weekData.length}>{q.week} Attendance <span className={`${c} fw-bolder`}>{per}%</span></td>
																					</>
																				)}
																				<td>{q.date}</td>
																				<td>{q.attendence}</td>
																			</tr>
																		));
																	})}


																</tbody>
															</table>
														</div>
														<div className="tab-pane fade" id={`domain_${q.rollno}`} role="tabpanel" aria-labelledby="nav-profile-tab" tabIndex="0" >
															<p className="fs-4">Domain</p>
															<table className="shadow table table-bordered  table-hover">
																<tbody>
																	<tr className="text-center text-light" style={mystyle}>
																		<th>Week</th>
																		<th>Weekly Attendence</th>
																		<th>Date</th>
																		<th>Attendence</th>
																	</tr>
																	{
																		Object.keys(att).length > 0 ? (
																			Object.keys(att[q.rollno]['domain']).reverse().map((qq, index) => {
																				const weekData = att[q.rollno]['domain'][qq].reverse();
																				{
																					per = calculateAttendancePercentage(weekData).toFixed(2)
																					if (per <= 49) {
																						c = 'text-danger';
																					} else if (per <= 74) {
																						c = 'text-warning';
																					} else {
																						c = 'text-success';
																					}

																				}
																				return weekData.map((q, subIndex) => (
																					<tr key={q._id} className="text-center text-light" style={mystyle}>
																						{subIndex === 0 && (
																							<>
																								<td rowSpan={weekData.length}>{q.week}</td>
																								<td rowSpan={weekData.length}>{q.week} Attendance <span className={`${c} fw-bolder`}>{per}%</span></td>
																							</>
																						)}
																						<td>{q.date}</td>
																						<td>{q.attendence}</td>
																					</tr>
																				));
																			})
																		) : <></>
																	}

																</tbody>
															</table>
														</div>
														<div className="tab-pane fade" id={`aptitude_${q.rollno}`} role="tabpanel" aria-labelledby="nav-contact-tab" tabIndex="0">
															<p className="fs-4">Aptitude</p>
															<table className="shadow table table-striped table-bordered  table-hover">
																<tbody>
																	<tr className="text-center text-light" style={mystyle}>
																		<th>Week</th>
																		<th>Date</th>
																		<th>Performance</th>
																	</tr>
																</tbody>
															</table>
														</div>
													</div>}
												</div>
											</li>
										);
									})}
								</ul>
							</div>
						) : (
							<></>
						)}
					</div>
				</div>
			</div>
		)
	);
}
