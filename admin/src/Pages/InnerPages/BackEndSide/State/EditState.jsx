import React, { useState } from "react";
import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Select from "react-select";
import AlertBox from "../../../../Components/AlertComp/AlertBox";

let url = process.env.REACT_APP_API_URL;

const EditState = () => {

    const adminToken = localStorage.getItem('token');

    const Navigate = useNavigate();
    const selectedStateData = useSelector((state) => state?.StateDataChange?.payload);

    const [stateData, setStateData] = useState({})
    const [stateName, setStateName] = useState(selectedStateData?.name);
    const [selectedCountry, setSelectedCountry] = useState("");
    const [countryOptions, setCountryOptions] = useState([]);

    const [stateAddStatus, setStateAddStatus] = useState("");
    const [statusMessage, setStatusMessage] = useState("");

    useEffect(() => {
        async function getState() {
            try {
                const res = await axios.get(`${url}/state/get/${selectedStateData?._id}`,
                    {
                        headers: {
                            Authorization: `${adminToken}`,
                        },
                    });

                setStateData(res?.data?.state || {});
            } catch (error) {
                console.log(error)
            }
        }
        getState();
    }, [selectedStateData]);


    useEffect(() => {
        console.log(stateData, "data")
        setStateName(stateData?.name)

        const selectedCountry = {
            value: stateData?.country,
            label: stateData?.country,
        };
        setSelectedCountry(selectedCountry);


    }, [stateData])

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (stateName !== "") {
            const formData = {
                name: stateName,
                country: selectedCountry?.value
            }

            try {
                const adminToken = localStorage.getItem("token");
                let response = await axios.put(
                    `${url}/state/update/${selectedStateData?._id}`,
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
                setStatusMessage("State not Update !");
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
                                    <h4 className="mb-0">Edit State</h4>
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
                                                            onClick={() =>
                                                                Navigate("/admin/showState")
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
                <AlertBox status={stateAddStatus} statusMessage={statusMessage} />
            </div>
        </>
    );
};

export default EditState;
