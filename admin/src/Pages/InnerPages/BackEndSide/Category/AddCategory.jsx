import React, { useState } from "react";
import defualtImage from "../../../../resources/assets/images/add-image.png";
import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AlertBox from "../../../../Components/AlertComp/AlertBox"

let url = process.env.REACT_APP_API_URL

const AddCategory = () => {

    const Navigate = useNavigate()
    const [categoryName, setCategoryName] = useState("");
    const [categoryImage, setCategoryImage] = useState("");

    const [categoryAddStatus, setCategoryAddStatus] = useState();
    const [statusMessage, setStatusMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [buttonDisabled, setButtonDisabled] = useState(false);


    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);
        setButtonDisabled(true)

        if (categoryName !== "" && categoryImage !== "") {
            const formData = new FormData();
            formData.append("name", categoryName);
            formData.append("image", categoryImage);

            try {
                const adminToken = localStorage.getItem('token');
                let response = await axios.post(
                    `${url}/category/add/byAdmin`,
                    formData,
                    {
                        headers: {
                            Authorization: `${adminToken}`,
                        },
                    }
                );
                if (response.data.type === "success") {
                    setCategoryAddStatus(response.data.type);
                    let alertBox = document.getElementById('alert-box')
                    alertBox.classList.add('alert-wrapper')
                    setStatusMessage(response.data.message);
                    setTimeout(() => {
                        Navigate('/admin/showCategory');
                    }, 900);
                } else {
                    setCategoryAddStatus(response.data.type);
                    let alertBox = document.getElementById('alert-box')
                    alertBox.classList.add('alert-wrapper')
                    setStatusMessage(response.data.message);
                }
            } catch (error) {
                setCategoryAddStatus("error");
                let alertBox = document.getElementById('alert-box')
                alertBox.classList.add('alert-wrapper')
                setStatusMessage("Category not Add !");
            } finally {
                setLoading(false);
                setButtonDisabled(false)
            }
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            setCategoryAddStatus("");
            setStatusMessage("");
            let alertBox = document?.getElementById('alert-box')
            alertBox?.classList?.remove('alert-wrapper')
        }, 1500);

        return () => clearTimeout(timer);
    }, [categoryAddStatus, statusMessage]);


    return (
        <>
            <div className="main-content dark">
                <div className="page-content">
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-12">
                                <div className="page-title-box d-flex align-items-center justify-content-between">
                                    <h4 className="mb-0">Add Category</h4>
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
                                                    Category Name:
                                                </label>
                                                <div className="col-md-10">
                                                    <input
                                                        required
                                                        className="form-control"
                                                        type="text"
                                                        id="example-text-input"
                                                        value={categoryName}
                                                        onChange={(e) => {
                                                            setCategoryName(e.target.value);
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                            <div className="mb-3 row">
                                                <label
                                                    htmlFor="example-text-input"
                                                    className="col-md-2 col-form-label"
                                                >
                                                    Category Image:
                                                    <div className="imageSize">(Recommended Resolution: W-1000 x H-1000 or Square Image)</div>
                                                </label>
                                                <div className="col-md-10">
                                                    <input
                                                        required
                                                        className="form-control"
                                                        type="file"
                                                        onChange={(e) => {
                                                            setCategoryImage(e.target.files[0])
                                                        }}
                                                        id="example-text-input"
                                                    />
                                                    <div className="fileupload_img col-md-10 mt-3">
                                                        <img
                                                            type="image"
                                                            src={
                                                                categoryImage
                                                                    ? URL.createObjectURL(categoryImage)
                                                                    : defualtImage
                                                            }
                                                            alt="category image"
                                                            height={100}
                                                            width={100}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row mb-10">
                                                <div className="col ms-auto">
                                                    <div className="d-flex flex-reverse flex-wrap gap-2">
                                                        <a className="btn btn-danger" onClick={() => Navigate('/admin/showCategory')}>
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
                <AlertBox status={categoryAddStatus} statusMessage={statusMessage} />
            </div>
        </>
    );
};

export default AddCategory;
