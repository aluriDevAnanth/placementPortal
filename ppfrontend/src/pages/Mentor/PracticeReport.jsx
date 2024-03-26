import React from "react";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import AuthCon from "../../context/AuthPro";
import MentorCon from "../../context/MentorPro";
import { useContext } from "react";

export default function PracticeReport() {
	const { user, students } = useContext(MentorCon);
	const { auth } = useContext(AuthCon);
	const mystyle = {
		backgroundColor: "#696747",
		color: "white",
	};

	return (
		user !== null && (
			<div className="bodyBG">

				<div className="container-fluid">
					<div className="d-flex">
						<div className="">
							<Sidebar />
						</div>
						{students !== null ? (
							<div className="flex-fill ms-3 border-primary me-3">
								<ul className="list-group">
									{students.map((q, i) => {
										return (
											<li key={i} className="list-group-item">
												<p className="d-inline-flex gap-1">
													<button
														className="btn"
														type="button"
														data-bs-toggle="collapse"
														data-bs-target={`#collapse_${q.rollno}`}
														aria-expanded="false"
														aria-controls={`collapse_${q.rollno}`}
														style={mystyle}
													>
														{q.rollno} - {q.name}
													</button>
												</p>
												<div
													className="collapse shadow"
													id={`collapse_${q.rollno}`}
												>
													<nav className="">
														<div
															className="nav nav-tabs column-gap-1"
															id="nav-tab"
															role="tablist"
														>
															<button
																className="nav-link active"
																id="nav-home-tab"
																data-bs-toggle="tab"
																data-bs-target={`#technical_${q.rollno}`}
																type="button"
																role="tab"
																aria-controls={`technical_${q.rollno}`}
																aria-selected="true"
																style={mystyle}
															>
																Technical
															</button>
															<button
																className="nav-link"
																id="nav-profile-tab"
																data-bs-toggle="tab"
																data-bs-target={`#domain_${q.rollno}`}
																type="button"
																role="tab"
																aria-controls={`domain_${q.rollno}`}
																aria-selected="false"
																style={mystyle}
															>
																Domain
															</button>
															<button
																className="nav-link"
																id="nav-contact-tab"
																data-bs-toggle="tab"
																data-bs-target={`#aptitude_${q.rollno}`}
																type="button"
																role="tab"
																aria-controls="nav-contact"
																aria-selected="false"
																style={mystyle}
															>
																Aptitude
															</button>
														</div>
													</nav>
													<div
														className="tab-content container me-5 border-dark p-3"
														id="nav-tabContent"
													>
														<div
															className="tab-pane fade show active"
															id={`technical_${q.rollno}`}
															role="tabpanel"
															aria-labelledby="nav-home-tab"
															tabIndex="0"
														>
															<p className="fs-4">Technical</p>
															<table className="shadow table table-striped table-bordered">
																<tbody>
																	<tr className="text-center text-light" style={mystyle}>
																		<th>Week</th>
																		<th>Date</th>
																		<th>Performance</th>
																	</tr>
																</tbody>
															</table>
														</div>
														<div
															className="tab-pane fade"
															id={`domain_${q.rollno}`}
															role="tabpanel"
															aria-labelledby="nav-profile-tab"
															tabIndex="0"
														>
															<p className="fs-4">Domain</p>
															<table className="shadow table table-striped table-bordered">
																<tbody>
																	<tr className="text-center text-light" style={mystyle}>
																		<th>Week</th>
																		<th>Date</th>
																		<th>Performance</th>
																	</tr>
																</tbody>
															</table>
														</div>
														<div
															className="tab-pane fade"
															id={`aptitude_${q.rollno}`}
															role="tabpanel"
															aria-labelledby="nav-contact-tab"
															tabIndex="0"
														>
															<p className="fs-4">Aptitude</p>
															<table className="shadow table table-striped table-bordered">
																<tbody>
																	<tr className="text-center text-light" style={mystyle}>
																		<th>Week</th>
																		<th>Date</th>
																		<th>Performance</th>
																	</tr>
																</tbody>
															</table>
														</div>
													</div>
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
