import React, { useState } from "react";
import defualtImage from "../../../../resources/assets/images/add-image.png";
import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AlertBox from "../../../../Components/AlertComp/AlertBox"

let url = process.env.REACT_APP_API_URL

const WarningLabel = () => {

    const Navigate = useNavigate()
    const [warningLabelsName, setWarningLabelsName] = useState("");
    const [warningLabelsImage, setWarningLabelsImage] = useState("");

    const [warningLabelsAddStatus, setWarningLabelsAddStatus] = useState();
    const [statusMessage, setStatusMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [buttonDisabled, setButtonDisabled] = useState(false);


    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);
        setButtonDisabled(true)

        if (warningLabelsName !== "" && warningLabelsImage !== "") {
            const formData = new FormData();
            formData.append("name", warningLabelsName);
            formData.append("image", warningLabelsImage);

            try {
                const adminToken = localStorage.getItem('token');
                let response = await axios.post(
                    `${url}/warningLabels/add/byAdmin`,
                    formData,
                    {
                        headers: {
                            Authorization: `${adminToken}`,
                        },
                    }
                );
                if (response.data.type === "success") {
                    setWarningLabelsAddStatus(response.data.type);
                    let alertBox = document.getElementById('alert-box')
                    alertBox.classList.add('alert-wrapper')
                    setStatusMessage(response.data.message);
                    setTimeout(() => {
                        Navigate('/admin/showWarningLabels');
                    }, 900);
                } else {
                    setWarningLabelsAddStatus(response.data.type);
                    let alertBox = document.getElementById('alert-box')
                    alertBox.classList.add('alert-wrapper')
                    setStatusMessage(response.data.message);
                }
            } catch (error) {
                setWarningLabelsAddStatus("error");
                let alertBox = document.getElementById('alert-box')
                alertBox.classList.add('alert-wrapper')
                setStatusMessage("Warning-Labels not Add !");
            } finally {
                setLoading(false);
                setButtonDisabled(false)
            }
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            setWarningLabelsAddStatus("");
            setStatusMessage("");
            let alertBox = document?.getElementById('alert-box')
            alertBox?.classList?.remove('alert-wrapper')
        }, 1500);

        return () => clearTimeout(timer);
    }, [warningLabelsAddStatus, statusMessage]);


    return (
        <>
            <div className="main-content dark">
                <div className="page-content">
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-12">
                                <div className="page-title-box d-flex align-items-center justify-content-between">
                                    <h4 className="mb-0">Add Warning-Labels</h4>
                                    {loading && <div className="loader">Loading...</div>}
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-12">
                                <div className="card">
                                    <div className="card-body">
                                        <form onSubmit={handleSubmit}>
                                            <div className="mb-3 row">
                                                <label
                                                    htmlFor="example-text-input"
                                                    className="col-md-2 col-form-label"
                                                >
                                                    Warning-Labels Name:
                                                </label>
                                                <div className="col-md-10">
                                                    <input
                                                        required
                                                        className="form-control"
                                                        type="text"
                                                        id="example-text-input"
                                                        value={warningLabelsName}
                                                        onChange={(e) => {
                                                            setWarningLabelsName(e.target.value);
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                            <div className="mb-3 row">
                                                <label
                                                    htmlFor="example-text-input"
                                                    className="col-md-2 col-form-label"
                                                >
                                                    Warning-Labels Image:
                                                    <div className="imageSize">(Recommended Resolution: W-1000 x H-1000 or Square Image)</div>
                                                </label>
                                                <div className="col-md-10">
                                                    <input
                                                        required
                                                        className="form-control"
                                                        type="file"
                                                        onChange={(e) => {
                                                            setWarningLabelsImage(e.target.files[0])
                                                        }}
                                                        id="example-text-input"
                                                    />
                                                    <div className="fileupload_img col-md-10 mt-3">
                                                        <img
                                                            type="image"
                                                            src={
                                                                warningLabelsImage
                                                                    ? URL.createObjectURL(warningLabelsImage)
                                                                    : defualtImage
                                                            }
                                                            alt="warningLabels image"
                                                            height={100}
                                                            width={100}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row mb-10">
                                                <div className="col ms-auto">
                                                    <div className="d-flex flex-reverse flex-wrap gap-2">
                                                        <a className="btn btn-danger" onClick={() => Navigate('/admin/showWarningLabels')}>
                                                            {" "}
                                                            <i className="fas fa-window-close"></i> Cancel{" "}
                                                        </a>
                                                        <button className="btn btn-success" type="submit" disabled={buttonDisabled}>
                                                            {" "}
                                                            <i className="fas fa-save"></i> Save{" "}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <AlertBox status={warningLabelsAddStatus} statusMessage={statusMessage} />
            </div>
        </>
    );
};

export default WarningLabel;
