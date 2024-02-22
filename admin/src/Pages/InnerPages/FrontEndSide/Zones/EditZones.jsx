import React, { useState } from "react";
import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import AlertBox from "../../../../Components/AlertComp/AlertBox";

let url = process.env.REACT_APP_API_URL;

const EditZone = () => {
    const Navigate = useNavigate();
    const selectedZoneData = useSelector((state) => state?.ZoneDataChange?.payload);

    const [zoneName, setZoneName] = useState(selectedZoneData?.name);
    const [zoneImage, setZoneImage] = useState(null);

    const [previewImage, setPreviewImage] = useState(selectedZoneData?.image);
    const [zoneAddStatus, setZoneAddStatus] = useState("");
    const [statusMessage, setStatusMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (zoneName !== "") {
            const formData = new FormData();
            formData.append("name", zoneName);
            formData.append("image", zoneImage);

            try {
                const adminToken = localStorage.getItem("token");
                let response = await axios.put(
                    `${url}/zone/update/byAdmin/${selectedZoneData?._id}`,
                    formData,
                    {
                        headers: {
                            Authorization: `${adminToken}`,
                        },
                    }
                );
                if (response.data.type === "success") {
                    setZoneAddStatus(response.data.type);
                    let alertBox = document.getElementById("alert-box");
                    alertBox.classList.add("alert-wrapper");
                    setStatusMessage(response.data.message);
                    setTimeout(() => {
                        Navigate("/admin/showZone");
                    }, 900);
                } else {
                    setZoneAddStatus(response.data.type);
                    let alertBox = document.getElementById("alert-box");
                    alertBox.classList.add("alert-wrapper");
                    setStatusMessage(response.data.message);
                }
            } catch (error) {
                setZoneAddStatus("error");
                let alertBox = document.getElementById("alert-box");
                alertBox.classList.add("alert-wrapper");
                setStatusMessage("Zone not Update !");
            }
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            setZoneAddStatus("");
            setStatusMessage("");
            let alertBox = document?.getElementById("alert-box");
            alertBox?.classList?.remove("alert-wrapper");
        }, 1500);

        return () => clearTimeout(timer);
    }, [zoneAddStatus, statusMessage]);

    return (
        <>
            <div className="main-content dark">
                <div className="page-content">
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-12">
                                <div className="page-title-box d-flex align-items-center justify-content-between">
                                    <h4 className="mb-0">Edit Zone</h4>
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
                                                    Zone Name:
                                                </label>
                                                <div className="col-md-10">
                                                    <input
                                                        required
                                                        className="form-control"
                                                        type="text"
                                                        id="example-text-input"
                                                        value={zoneName}
                                                        onChange={(e) => {
                                                            setZoneName(e.target.value);
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                            <div className="mb-3 row">
                                                <label
                                                    htmlFor="example-text-input"
                                                    className="col-md-2 col-form-label"
                                                >
                                                    Zone Image:
                                                    <div className="imageSize">(Recommended Resolution: W-1000 x H-1000 or Square Image)</div>
                                                </label>
                                                <div className="col-md-10">
                                                    <input
                                                        className="form-control"
                                                        type="file"
                                                        onChange={(e) => {
                                                            setZoneImage(e.target.files[0]);
                                                            setPreviewImage(
                                                                URL.createObjectURL(
                                                                    e.target.files[0]
                                                                )
                                                            );
                                                        }}
                                                        id="example-text-input"
                                                    />
                                                    <div className="fileupload_img col-md-10 mt-3">
                                                        <img
                                                            type="image"
                                                            src={
                                                                previewImage ||
                                                                `${url}/${selectedZoneData?.Zone_Image}`
                                                            }
                                                            alt="zone image"
                                                            height={100}
                                                            width={100}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row mb-10">
                                                <div className="col ms-auto">
                                                    <div className="d-flex flex-reverse flex-wrap gap-2">
                                                        <a
                                                            className="btn btn-danger"
                                                            onClick={() =>
                                                                Navigate("/admin/showZone")
                                                            }
                                                        >
                                                            {" "}
                                                            <i className="fas fa-window-close"></i>{" "}
                                                            Cancel{" "}
                                                        </a>
                                                        <button
                                                            className="btn btn-success"
                                                            type="submit"
                                                        >
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
                <AlertBox status={zoneAddStatus} statusMessage={statusMessage} />
            </div>
        </>
    );
};

export default EditZone;
