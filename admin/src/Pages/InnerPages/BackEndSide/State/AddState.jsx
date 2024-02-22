import React, { useState } from "react";
import defualtImage from "../../../../resources/assets/images/add-image.png";
import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import AlertBox from "../../../../Components/AlertComp/AlertBox";

let url = process.env.REACT_APP_API_URL

const AddState = () => {

    const adminToken = localStorage.getItem('token');


    const Navigate = useNavigate();
    const [stateName, setStateName] = useState("");
    const [selectedCountry, setSelectedCountry] = useState("");
    const [countryOptions, setCountryOptions] = useState([]);
    const [statusMessage, setStatusMessage] = useState("");
    const [stateAddStatus, setStateAddStatus] = useState();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (stateName !== "") {
            const formData = {
                name: stateName,
                country: selectedCountry?.value
            }

            try {
                const adminToken = localStorage.getItem('token');

                let response = await axios.post(
                    `${url}/state/add`,
                    formData,
                    {
                        headers: {
                            Authorization: `${adminToken}`,
                        },
                    }
                );
                if (response.data.type === "success") {
                    setStateAddStatus(response.data.type);
                    let alertBox = document.getElementById("alert-box");
                    alertBox.classList.add("alert-wrapper");
                    setStatusMessage(response.data.message);
                    setTimeout(() => {
                        Navigate("/admin/showState");
                    }, 900);
                } else {
                    setStateAddStatus(response.data.type);
                    let alertBox = document.getElementById("alert-box");
                    alertBox.classList.add("alert-wrapper");
                    setStatusMessage(response.data.message);
                }
            } catch (error) {
                setStateAddStatus("error");
                let alertBox = document.getElementById("alert-box");
                alertBox.classList.add("alert-wrapper");
                setStatusMessage("State not Add !");
            }
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            setStateAddStatus("");
            setStatusMessage("");
            let alertBox = document?.getElementById("alert-box");
            alertBox?.classList?.remove("alert-wrapper");
        }, 1500);

        return () => clearTimeout(timer);
    }, [stateAddStatus, statusMessage]);


    useEffect(() => {
        // Fetch country data from your API
        async function fetchCountryData() {
            try {
                const response = await axios.get(`${url}/country/list/getAll`,
                    {
                        headers: {
                            Authorization: `${adminToken}`,
                        },
                    });
                const options = response?.data?.country?.map((option) => ({
                    value: option.name,
                    label: option.name,
                }));
                setCountryOptions(options);
            } catch (error) {
                console.error('Failed to fetch countrys:', error);
            }
        }


        fetchCountryData()

    }, [selectedCountry]);

    const handleCountryChange = (selectedOptions) => {
        setSelectedCountry(selectedOptions);
    };

    return (
        <>
            <div className="main-content dark">
                <div className="page-content">
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-12">
                                <div className="page-title-box d-flex align-items-center justify-content-between">
                                    <h4 className="mb-0">Add State</h4>
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
                                                    Country:
                                                </label>
                                                <div className="col-md-10">
                                                    <Select
                                                        required
                                                        value={selectedCountry}
                                                        onChange={handleCountryChange}
                                                        options={countryOptions}
                                                        placeholder="Select Country"
                                                        className="w-full md:w-20rem"
                                                    />
                                                </div>
                                            </div>
                                            <div className="mb-3 row">
                                                <label
                                                    htmlFor="example-text-input"
                                                    className="col-md-2 col-form-label"
                                                >
                                                    State Name:
                                                </label>
                                                <div className="col-md-10">
                                                    <input
                                                        required
                                                        className="form-control"
                                                        type="text"
                                                        id="example-text-input"
                                                        value={stateName}
                                                        onChange={(e) => {
                                                            setStateName(e.target.value);
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                            <div className="row mb-10">
                                                <div className="col ms-auto">
                                                    <div className="d-flex flex-reverse flex-wrap gap-2">
                                                        <a
                                                            className="btn btn-danger"
                                                            onClick={() => Navigate("/admin/showState")}
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
                <AlertBox status={stateAddStatus} statusMessage={statusMessage} />
            </div>
        </>
    );
};

export default AddState;
