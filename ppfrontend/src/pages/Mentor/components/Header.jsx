import React, { useContext } from 'react'
import logo from '/img/bigIcon.png';
import { Link, useNavigate } from 'react-router-dom'
import AuthCon from '../../../context/AuthPro'
import MentorPro from '../../../context/MentorPro'
import Cookies from 'js-cookie';

export default function Header() {
	const { user, setAuth, setUser } = useContext(AuthCon);
	const { year, setYear } = useContext(MentorPro);
	const navi = useNavigate()

	function handleLogout(e) {
		Cookies.remove('token');
		setAuth(null)
		setUser(null)
		navi('/')
	}

	const chgnYear = (e) => {
		setYear(prevYear => {
			return { ...prevYear, curr: e.target.value };
		});
	}

	return (
		user !== null ? <nav className="navbar navbar-expand-lg navbg mb-4" style={{ backgroundColor: "#EEEBDD !important" }}>
			<div className="container-fluid">
				<Link className="navbar-brand" to="/">
					<img src={logo} alt="PlacementPortal" width="157" height="57" />
				</Link>
				<button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
					<span className="navbar-toggler-icon"></span>
				</button>
				<div className='ms-auto d-flex'>
					<div className='me-3'>
						<div className="dropdown">
							{year && <button className="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false" style={{ backgroundColor: "#696747" }} >
								Select Batch: {year.curr}
							</button>}
							<ul className="dropdown-menu">
								{year && year.years.map(q => {
									return <li key={q}><button className={`dropdown-item ${(q === '2018' && window.location.pathname === '/attendence') ? 'disabled' : ''} `} value={q} onClick={chgnYear}>{q}</button></li>
								})}

							</ul>
						</div>
					</div>
					<div className="collapse navbar-collapse me-4" id="navbarSupportedContent">
						<div className="dropdown ">
							<button className="btn dropdown-toggle rounded-3 text-white" style={{ backgroundColor: "#696747" }} type="button" data-bs-toggle="dropdown" aria-expanded="false">
								{user.name}
							</button>
							<ul className="dropdown-menu">
								<li><Link className="dropdown-item" to="/settings">Settings</Link></li>
								<li><button onClick={handleLogout} className="dropdown-item" >Logout</button></li>
							</ul>
						</div>
					</div>
				</div>
			</div>
		</nav> : <></>
	)
}
