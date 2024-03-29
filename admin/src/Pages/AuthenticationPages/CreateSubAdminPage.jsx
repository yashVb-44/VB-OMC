import axios from 'axios';
import React, { useEffect, useState } from 'react'
import AlertBox from '../../Components/AlertComp/AlertBox';
import { useNavigate } from 'react-router-dom';

let url = process.env.REACT_APP_API_URL

const CreateSubAdminPage = () => {

    const adminToken = localStorage.getItem('token');
    const Navigate = useNavigate()

    const [settingsData, setSettingsData] = useState({})
    const [username, setUsername] = useState("")
    const [name, setName] = useState("")
    const [password, setPassword] = useState("")
    const [role, setRole] = useState("role_1")
    const [error, setError] = useState("")

    const [subAdminAddStatus, setSubAdminAddStatus] = useState();
    const [statusMessage, setStatusMessage] = useState("");


    useEffect(() => {
        async function getSettings() {
            try {
                const res = await axios.get(`${url}/app/settings/get`,
                    {
                        headers: {
                            Authorization: `${adminToken}`,
                        },
                    });
                setSettingsData(res?.data?.Settings);
            } catch (error) {
                console.log(error)
            }
        }
        getSettings()
    }, [settingsData])

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(`${url}/subAdmin/create/byAdmin`,
                { username, password, name, role }
                , {
                    headers: {
                        Authorization: `${adminToken}`,
                    },
                });

            if (response.data.type === "success") {
                setSubAdminAddStatus(response.data.type);
                setStatusMessage(response.data.message);
                Navigate('/admin');
                closeError()

            } else if (response.data.type === "error") {
                setSubAdminAddStatus(response.data.type);
                setError(response?.data?.message)
                setStatusMessage(response.data.message);
                closeError()
            }

        } catch (error) {
            let alertBox = document.getElementById('alert-box')
            alertBox.classList.add('alert-wrapper')
            setError("SubAdmin not Add !");
            setSubAdminAddStatus("error");
            setStatusMessage("SubAdmin not Add !");
            closeError()
        }
    }

    function closeError() {
        setTimeout(() => {
            setError("")
        }, 1500);
    }

    useEffect(() => {
        const timer = setTimeout(() => {
            setSubAdminAddStatus("");
            setStatusMessage("");
            let alertBox = document?.getElementById('alert-box')
            alertBox?.classList?.remove('alert-wrapper')
        }, 1500);

        return () => clearTimeout(timer);
    }, [setSubAdminAddStatus, statusMessage]);


    return (
        <>
            <div className="authentication-bg">
                <div className="account-pages  pt-sm-1">
                    <div className="container">
                        <div className="row align-items-center justify-content-center">
                            <div className="col-md-8 col-lg-6 col-xl-5">
                                <div className="card">
                                    <a className=" d-block auth-logo">
                                        <img src={settingsData?.app_logo} alt="" height={80} className="logo logo-dark" />
                                        <img src={settingsData?.app_logo} alt="" height={80} className="logo logo-light" />
                                    </a>
                                    <div className="card-body p-4">

                                        <div className="text-center mt-2">
                                            <h5 className="text-primary">Register Account</h5>
                                            <p className="text-muted">Create Sub Admin account now.</p>
                                        </div>
                                        <div className="p-2 mt-4">
                                            <form onSubmit={handleSubmit}>

                                                <div style={{ color: "red", fontSize: "13px" }}>{error ? '*' + error : ""}</div>

                                                <div className="mb-3">
                                                    <label className="form-label" htmlFor="useremail">Name</label>
                                                    <input required type="text" className="form-control" onChange={(e) => setName(e.target.value)} id="useremail" placeholder="Enter Name" />
                                                </div>

                                                <div className="mb-3">
                                                    <label className="form-label" htmlFor="username">Role</label>
                                                    <select className="form-select" onChange={(e) => setRole(e.target.value)}>
                                                        <option value={"role_1"}>Marketing</option>
                                                        <option value={"role_2"}>Packaging</option>
                                                        <option value={"role_3"}>Customer Support</option>
                                                    </select>
                                                </div>

                                                <div className="mb-3">
                                                    <label className="form-label" htmlFor="username">Username</label>
                                                    <input required type="text" className="form-control" id="username" onChange={(e) => setUsername(e.target.value)} placeholder="Enter username" />
                                                </div>

                                                <div className="mb-3">
                                                    <label className="form-label" htmlFor="userpassword">Password</label>
                                                    <input required type="password" className="form-control" id="userpassword" onChange={(e) => setPassword(e.target.value)} placeholder="Enter password" />
                                                </div>

                                                <div className="mt-3 text-end">
                                                    <button className="btn btn-danger w-sm waves-effect waves-light" onClick={() => Navigate("/showSubAdmin")}>Cancel</button>
                                                    <button className="btn btn-primary w-sm waves-effect waves-light" style={{ marginLeft: "5px" }} type="submit">Register</button>
                                                </div>

                                                <div class="mt-4 text-center">
                                                    <p class="text-muted mb-0">Back to Home?
                                                        <a onClick={() => Navigate("/")}
                                                            style={{ cursor: "pointer" }}
                                                            class="fw-me dium text-primary"> Home</a></p>
                                                </div>

                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <AlertBox status={subAdminAddStatus} statusMessage={statusMessage} />
                </div>
            </div>

        </>
    )
}

export default CreateSubAdminPage
