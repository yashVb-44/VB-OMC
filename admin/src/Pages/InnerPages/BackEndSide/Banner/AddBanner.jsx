import React, { useState } from "react";
import defualtImage from "../../../../resources/assets/images/add-image.png";
import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import AlertBox from "../../../../Components/AlertComp/AlertBox";

let url = process.env.REACT_APP_API_URL

const AddBanner = () => {

    const adminToken = localStorage.getItem('token');


    const Navigate = useNavigate();
    const [bannerName, setBannerName] = useState("");
    const [bannerImage, setBannerImage] = useState("");
    const [sequence, setSequence] = useState(1);
    // const [bannerLink, setBannerLink] = useState("");
    const [mealOptions, setMealOptions] = useState([]);
    const [selectedMeals, setSelectedMeals] = useState("");
    const [statusMessage, setStatusMessage] = useState("");
    const [bannerAddStatus, setBannerAddStatus] = useState();

    // get all meal
    useEffect(() => {
        async function fetchMealData() {
            try {
                const response = await axios.get(`${url}/meal/active/list/get/forAdmin`,
                    {
                        headers: {
                            Authorization: `${adminToken}`,
                        },
                    });
                const options = response?.data?.meal?.map((option) => ({
                    value: option._id,
                    label: option.name,
                }));
                setMealOptions(options);
            } catch (error) {
                console.error('Failed to fetch meals:', error);
            }
        }
        fetchMealData()

    }, [selectedMeals])

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (bannerName !== "" && bannerImage !== "") {
            const formData = new FormData();
            formData.append("name", bannerName);
            formData.append("image", bannerImage);
            // formData.append("Banner_Link", bannerLink);
            formData.append("sequence", sequence);
            formData.append("meal", selectedMeals?.value)


            try {
                const adminToken = localStorage.getItem('token');

                let response = await axios.post(
                    `${url}/banner/add`,
                    formData,
                    {
                        headers: {
                            Authorization: `${adminToken}`,
                        },
                    }
                );
                if (response.data.type === "success") {
                    setBannerAddStatus(response.data.type);
                    let alertBox = document.getElementById("alert-box");
                    alertBox.classList.add("alert-wrapper");
                    setStatusMessage(response.data.message);
                    setTimeout(() => {
                        Navigate("/admin/showBanner");
                    }, 900);
                } else {
                    setBannerAddStatus(response.data.type);
                    let alertBox = document.getElementById("alert-box");
                    alertBox.classList.add("alert-wrapper");
                    setStatusMessage(response.data.message);
                }
            } catch (error) {
                setBannerAddStatus("error");
                let alertBox = document.getElementById("alert-box");
                alertBox.classList.add("alert-wrapper");
                setStatusMessage("Banner not Add !");
            }
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            setBannerAddStatus("");
            setStatusMessage("");
            let alertBox = document?.getElementById("alert-box");
            alertBox?.classList?.remove("alert-wrapper");
        }, 1500);

        return () => clearTimeout(timer);
    }, [bannerAddStatus, statusMessage]);



    const customStyles = {
        singleValue: (provided) => ({
            ...provided,
            color: 'black',
        }),
        option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isFocused ? 'white' : 'white',
            color: state.isSelected ? 'black' : 'black',
            ':hover': {
                backgroundColor: '#e6f7ff',
            },
        }),
    };

    return (
        <>
            <div className="main-content dark">
                <div className="page-content">
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-12">
                                <div className="page-title-box d-flex align-items-center justify-content-between">
                                    <h4 className="mb-0">Add Banner</h4>
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
                                                    Banner Name:
                                                </label>
                                                <div className="col-md-10">
                                                    <input
                                                        required
                                                        className="form-control"
                                                        type="text"
                                                        id="example-text-input"
                                                        value={bannerName}
                                                        onChange={(e) => {
                                                            setBannerName(e.target.value);
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                            <div className="mb-3 row">
                                                <label
                                                    htmlFor="example-text-input"
                                                    className="col-md-2 col-form-label"
                                                >
                                                    Banner Sequence:
                                                </label>
                                                <div className="col-md-10">
                                                    <input
                                                        min="1"
                                                        required
                                                        className="form-control"
                                                        type="number"
                                                        value={sequence}
                                                        onChange={(e) => setSequence(e.target.value)}
                                                        id="example-number-input"
                                                    />
                                                </div>
                                            </div>
                                            <div className="mb-3 row">
                                                <label
                                                    htmlFor="example-text-input"
                                                    className="col-md-2 col-form-label"
                                                >
                                                    Meal Name:
                                                </label>
                                                <div className="col-md-10">
                                                    <Select
                                                        required
                                                        value={selectedMeals}
                                                        onChange={(e) => {
                                                            setSelectedMeals(e);
                                                        }}
                                                        options={mealOptions}
                                                        styles={customStyles}
                                                    />
                                                </div>
                                            </div>
                                            <div className="mb-3 row">
                                                <label
                                                    htmlFor="example-text-input"
                                                    className="col-md-2 col-form-label"
                                                >
                                                    Banner Image:
                                                    <div className="imageSize">(Recommended Resolution: W-856 x H-400)</div>
                                                </label>
                                                <div className="col-md-10">
                                                    <input
                                                        required
                                                        className="form-control"
                                                        type="file"
                                                        onChange={(e) => {
                                                            setBannerImage(e.target.files[0]);
                                                        }}
                                                        id="example-text-input"
                                                    />
                                                    <div className="fileupload_img col-md-10 mt-3 mb-2">
                                                        <img
                                                            type="image"
                                                            src={
                                                                bannerImage
                                                                    ? URL.createObjectURL(bannerImage)
                                                                    : defualtImage
                                                            }
                                                            alt="banner image"
                                                            height={100}
                                                            width={100}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            {/* <div className="mb-3 row">
                                                <label
                                                    htmlFor="example-text-input"
                                                    className="col-md-2 col-form-label"
                                                >
                                                    Banner Link:
                                                </label>
                                                <div className="col-md-10">
                                                    <input
                                                        className="form-control"
                                                        type="url"
                                                        value={bannerLink}
                                                        onChange={(e) => setBannerLink(e.target.value)}
                                                        id="example-url-input"
                                                    />
                                                </div>
                                            </div> */}
                                            <div className="row mb-10">
                                                <div className="col ms-auto">
                                                    <div className="d-flex flex-reverse flex-wrap gap-2">
                                                        <a
                                                            className="btn btn-danger"
                                                            onClick={() => Navigate("/admin/showBanner")}
                                                        >
                                                            {" "}
                                                            <i className="fas fa-window-close"></i> Cancel{" "}
                                                        </a>
                                                        <button className="btn btn-success" type="submit">
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
                <AlertBox status={bannerAddStatus} statusMessage={statusMessage} />
            </div>
        </>
    );
};

export default AddBanner;
