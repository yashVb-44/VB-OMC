import React, { useState } from "react";
import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import AlertBox from "../../../../Components/AlertComp/AlertBox";

let url = process.env.REACT_APP_API_URL;

const EditTourType = () => {
    const Navigate = useNavigate();
    const selectedTourTypeData = useSelector((state) => state?.TourTypeDataChange?.payload);

    const [tourTypeName, setTourTypeName] = useState(selectedTourTypeData?.name);
    const [tourTypeImage, setTourTypeImage] = useState(null);

    const [previewImage, setPreviewImage] = useState(selectedTourTypeData?.image);
    const [tourTypeAddStatus, setTourTypeAddStatus] = useState("");
    const [statusMessage, setStatusMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (tourTypeName !== "") {
            const formData = new FormData();
            formData.append("name", tourTypeName);
            formData.append("image", tourTypeImage);

            try {
                const adminToken = localStorage.getItem("token");
                let response = await axios.put(
                    `${url}/tourType/update/byAdmin/${selectedTourTypeData?._id}`,
                    formData,
                    {
                        headers: {
                            Authorization: `${adminToken}`,
                        },
                    }
                );
                if (response.data.type === "success") {
                    setTourTypeAddStatus(response.data.type);
                    let alertBox = document.getElementById("alert-box");
                    alertBox.classList.add("alert-wrapper");
                    setStatusMessage(response.data.message);
                    setTimeout(() => {
                        Navigate("/admin/showTourType");
                    }, 900);
                } else {
                    setTourTypeAddStatus(response.data.type);
                    let alertBox = document.getElementById("alert-box");
                    alertBox.classList.add("alert-wrapper");
                    setStatusMessage(response.data.message);
                }
            } catch (error) {
                setTourTypeAddStatus("error");
                let alertBox = document.getElementById("alert-box");
                alertBox.classList.add("alert-wrapper");
                setStatusMessage("TourType not Update !");
            }
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            setTourTypeAddStatus("");
            setStatusMessage("");
            let alertBox = document?.getElementById("alert-box");
            alertBox?.classList?.remove("alert-wrapper");
        }, 1500);

        return () => clearTimeout(timer);
    }, [tourTypeAddStatus, statusMessage]);

    return (
        <>
            <div className="main-content dark">
                <div className="page-content">
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-12">
                                <div className="page-title-box d-flex align-items-center justify-content-between">
                                    <h4 className="mb-0">Edit Tour-Type</h4>
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
                                                    Tour-Type Name:
                                                </label>
                                                <div className="col-md-10">
                                                    <input
                                                        required
                                                        className="form-control"
                                                        type="text"
                                                        id="example-text-input"
                                                        value={tourTypeName}
                                                        onChange={(e) => {
                                                            setTourTypeName(e.target.value);
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                            <div className="mb-3 row">
                                                <label
                                                    htmlFor="example-text-input"
                                                    className="col-md-2 col-form-label"
                                                >
                                                    Tour-Type Image:
                                                    <div className="imageSize">(Recommended Resolution: W-1000 x H-1000 or Square Image)</div>
                                                </label>
                                                <div className="col-md-10">
                                                    <input
                                                        className="form-control"
                                                        type="file"
                                                        onChange={(e) => {
                                                            setTourTypeImage(e.target.files[0]);
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
                                                                `${url}/${selectedTourTypeData?.TourType_Image}`
                                                            }
                                                            alt="tourType image"
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
                                                                Navigate("/admin/showTourType")
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
                <AlertBox status={tourTypeAddStatus} statusMessage={statusMessage} />
            </div>
        </>
    );
};

export default EditTourType;
