import React, { useContext, useState, useRef } from 'react'
import logo from '/img/3.png';
import Cookies from 'js-cookie';
import AuthCon from '../../context/AuthPro';
import { useNavigate } from 'react-router-dom';
import Spinner from 'react-bootstrap/Spinner';
import { Toast } from 'primereact/toast';

export default function Login() {
    const { setAuth, setUser } = useContext(AuthCon)
    const [err, setErr] = useState('')
    const [show, setShow] = useState(1)
    const [otp, setOTP] = useState()
    const [email, setEmail] = useState()
    const [load, setLoad] = useState(false)
    const navi = useNavigate()
    const toast = useRef(null);
    const baseURL = process.env.BASE_URL

    const handlelogin = async (e) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        let q = {};

        for (let [key, value] of formData.entries()) {
            q[key] = value;
        }

        const { username, password } = q;

        const response = await fetch(`${baseURL}/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, password }),
        });
        const res = await response.json();
        //console.log(res);
        if (res.success) {
            Cookies.set('token', res.jwt, { expires: 3 })
            setAuth(Cookies.get("token"))
            location.reload();
        } else {
            setErr(res.error)
        }

    };

    function handlechngpwd() {
        const id = document.getElementById('floatingInput').value
        setShow(2)
        //console.log(id)
    }

    async function handleForgotPassword(e) {
        e.preventDefault();
        setLoad(true)
        const formData = new FormData(e.currentTarget);
        let q = {};

        for (let [key, value] of formData.entries()) {
            q[key] = value;
        }

        const { email1 } = q;
        //console.log(q);
        setEmail(email1)

        const response = await fetch(`${baseURL}/sendOTP`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username: email }),
        });

        const res = await response.json();
        if (res.success) {
            console.log(res.data.otp);
            setOTP(res.data.otp)
        }
        setLoad(false)
    }

    async function subOTP(e) {
        e.preventDefault();
        setLoad(true)
        const formData = new FormData(e.currentTarget);
        let q = {};

        for (let [key, value] of formData.entries()) {
            q[key] = value;
        }

        const { otp1, pass, cpass } = q;

        if (pass !== cpass) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Password do not match', life: 6000 });
            return;
        }
        if (otp === otp1) {
            const response = await fetch(`${baseURL}/changePass`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username: email, pass }),
            });

            const res = await response.json();
            await toast.current.show({ severity: 'success', summary: 'Success', detail: 'Password Changed', life: 6000 });
            location.reload();
            //console.log(res);
        } else {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Wrong OTP', life: 6000 });
            return;
        }
    }

    return (
        <div className='container-fluid bgimg'>
            <Toast ref={toast} />
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
                    {show == 2 && <div >
                        {!load && !otp ? <form onSubmit={handleForgotPassword}>
                            <div className="form-floating mb-3">
                                <input name='email1' className="form-control" id="floatingInput" placeholder="name@example.com" />
                                <label htmlFor="floatingInput">Enter Email or rollno for OTP</label>
                            </div>
                            <div className='d-flex'>
                                <div>  <button type="submit" className="btn btn-primary me-5">Submit</button>   </div>
                                {err !== '' && <div className="alert alert-danger" role="alert">  {err}  </div>}
                            </div>

                        </form> : <div className='d-flex justify-content-center'>
                            {!otp && <Spinner animation="border" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </Spinner>}
                        </div>}
                        {otp && <div>
                            <form onSubmit={subOTP}>
                                <div className="form-floating mb-3">
                                    <input name='otp1' className="form-control" id="floatingInput" />
                                    <label htmlFor="floatingInput">Enter OTP</label>
                                </div>
                                <div className="form-floating mb-3">
                                    <input name='pass' className="form-control" id="floatingInput" />
                                    <label htmlFor="floatingInput">Enter Password</label>
                                </div>
                                <div className="form-floating mb-3">
                                    <input name='cpass' className="form-control" id="floatingInput" />
                                    <label htmlFor="floatingInput">Enter Confirm Password</label>
                                </div>
                                <div className='d-flex'>
                                    <div>  <button type="submit" className="btn btn-primary me-5">Submit</button>   </div>
                                    {err !== '' && <div className="alert alert-danger" role="alert">  {err}  </div>}
                                </div>
                            </form>
                        </div>}
                    </div>
                    }
                </div>
            </div>


        </div>
    )
}
