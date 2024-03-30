import React, { useContext, useState } from 'react'
import logo from '/img/3.png';
import Cookies from 'js-cookie';
import AuthCon from '../../context/AuthPro';
import { useNavigate } from 'react-router-dom';

export default function Login() {
    const { setAuth, setUser } = useContext(AuthCon)
    const [err, setErr] = useState('')
    const [show, setShow] = useState(1)
    const navi = useNavigate()

    const handlelogin = async (e) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        let q = {};

        for (let [key, value] of formData.entries()) {
            q[key] = value;
        }

        const { username, password } = q;

        const response = await fetch('http://localhost:3000/api/login', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, password }),
        });
        const res = await response.json();
        console.log(res);
        if (res.success) {
            setUser(res.user);
            Cookies.set('token', res.jwt, { expires: 3 })
            setAuth(Cookies.get("token"))
            navi('/');
        } else {
            setErr(res.error)
        }

    };

    function handlechngpwd() {
        const id = document.getElementById('floatingInput').value
        setShow(2)
        console.log(id)
    }

    async function handleForgotPassword(e) {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        let q = {};

        for (let [key, value] of formData.entries()) {
            q[key] = value;
        }

        const { email } = q; console.log(q);

        const response = await fetch('http://localhost:3000/api/sendOTP', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username: email }),
        });

        const res = await response.json();
        console.log(res);

    }

    return (
        <div className='container-fluid bgimg'>
            <div className="col-6 col-sm-1 col-md-1">
                <img src={logo} className="" style={{ width: "250px !important" }} alt="Responsive image" />
            </div>
            <div className='container vh-100 d-flex justify-content-center align-items-center'>
                <div className="bg-white p-4 rounded-3" style={{ width: '40rem', position: "relative", top: '-80px' }}>
                    <p className='fs-3 fw-bold mb-3'>Corporate Relations & Career Services</p>
                    {show == 1 && <form onSubmit={handlelogin}>
                        <div className="form-floating mb-3">
                            <input name='username' className="form-control" id="floatingInput" placeholder="name@example.com" />
                            <label htmlFor="floatingInput">Application Number/ Registration Number</label>
                        </div>
                        <div className="form-floating mb-3">
                            <input name='password' type="password" className="form-control" id="floatingPassword" placeholder="Password" />
                            <label htmlFor="floatingPassword">Password</label>
                        </div>
                        <div className='d-flex'>
                            <div>
                                <button type="submit" className="btn btn-primary me-3">Submit</button>
                            </div>
                            <div>
                                <button onClick={handlechngpwd} className="btn text-light me-5" style={{ backgroundColor: '#337ab7' }}>Forgot Password</button>
                            </div>
                            {err !== '' && <div className="alert alert-danger" role="alert">
                                {err}
                            </div>}
                        </div>

                    </form>}
                    {show == 2 && <form onSubmit={handleForgotPassword}>
                        <div className="form-floating mb-3">
                            <input name='email' className="form-control" id="floatingInput" placeholder="name@example.com" />
                            <label htmlFor="floatingInput">Enter Email for OTP</label>
                        </div>
                        <div className='d-flex'>
                            <div>
                                <button type="submit" className="btn btn-primary me-5">Submit</button>
                            </div>
                            {err !== '' && <div className="alert alert-danger" role="alert">
                                {err}
                            </div>}
                        </div>

                    </form>}
                </div>
            </div>


        </div>
    )
}
