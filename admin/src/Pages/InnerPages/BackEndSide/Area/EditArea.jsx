import React, { useState } from "react";
import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Select from "react-select";
import AlertBox from "../../../../Components/AlertComp/AlertBox";

let url = process.env.REACT_APP_API_URL;

const EditArea = () => {

    const adminToken = localStorage.getItem('token');

    const Navigate = useNavigate();

    const selectedAreaData = useSelector((area) => area?.AreaDataChange?.payload);

    const [areaName, setAreaName] = useState(selectedAreaData?.name);
    const [selectedCountry, setSelectedCountry] = useState("");
    const [countryOptions, setCountryOptions] = useState([]);
    const [selectedState, setSelectedState] = useState("");
    const [stateOptions, setStateOptions] = useState([]);
    const [selectedCity, setSelectedCity] = useState("");
    const [cityOptions, setCityOptions] = useState([]);

    const [areaData, setAreaData] = useState([])

    const [areaAddStatus, setAreaAddStatus] = useState("");
    const [statusMessage, setStatusMessage] = useState("");

    useEffect(() => {
        async function getArea() {
            try {
                const res = await axios.get(`${url}/area/single/get/${selectedAreaData?._id}`,
                    {
                        headers: {
                            Authorization: `${adminToken}`,
                        },
                    });
                setAreaData(res?.data?.area || {});
            } catch (error) {
                console.log(error)
            }
        }
        getArea();
    }, [selectedAreaData]);


    useEffect(() => {
        setAreaName(areaData?.name);

        const selectedState = {
            value: areaData?.state,
            label: areaData?.state
        };
        setSelectedState(selectedState);

        const selectedCountry = {
            value: areaData?.country,
            label: areaData?.country
        };
        setSelectedCountry(selectedCountry);

        const selectedCity = {
            value: areaData?.city,
            label: areaData?.city
        };
        setSelectedCity(selectedCity);

    }, [areaData])

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (areaName !== "") {
            const formData = {
                name: areaName,
                country: selectedCountry?.value,
                state: selectedState?.value,
                city: selectedCity?.value,
            }

            try {
                let response = await axios.put(
                    `${url}/area/update/byAdmin/${selectedAreaData?._id}`,
                    formData,
                    {
                        headers: {
                            Authorization: `${adminToken}`,
                        },
                    }
                );
                if (response.data.type === "success") {
                    setAreaAddStatus(response.data.type);
                    let alertBox = document.getElementById("alert-box");
                    alertBox.classList.add("alert-wrapper");
                    setStatusMessage(response.data.message);
                    setTimeout(() => {
                        Navigate("/admin/showArea");
                    }, 900);
                } else {
                    setAreaAddStatus(response.data.type);
                    let alertBox = document.getElementById("alert-box");
                    alertBox.classList.add("alert-wrapper");
                    setStatusMessage(response.data.message);
                }
            } catch (error) {
                setAreaAddStatus("error");
                let alertBox = document.getElementById("alert-box");
                alertBox.classList.add("alert-wrapper");
                setStatusMessage("Area not Update !");
            }
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            setAreaAddStatus("");
            setStatusMessage("");
            let alertBox = document?.getElementById("alert-box");
            alertBox?.classList?.remove("alert-wrapper");
        }, 1500);

        return () => clearTimeout(timer);
    }, [areaAddStatus, statusMessage]);

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

        // Fetch state data from your API
        async function fetchStateData() {
            try {
                const response = await axios.get(`${url}/state/list/get/front/byCountry?country=${selectedCountry?.value}`,
                    {
                        headers: {
                            Authorization: `${adminToken}`,
                        },
                    });
                const options = response?.data?.state?.map((option) => ({
                    value: option.name,
                    label: option.name,
                }));
                setStateOptions(options);
            } catch (error) {
                console.error('Failed to fetch states:', error);
            }
        }

        // Fetch city data from your API
        async function fetchCityData() {
            try {
                const response = await axios.get(`${url}/city/list/get/front/byCountryAndState?country=${selectedCountry?.value}&state=${selectedState?.value}`,
                    {
                        headers: {
                            Authorization: `${adminToken}`,
                        },
                    });
                const options = response?.data?.city?.map((option) => ({
                    value: option.name,
                    label: option.name,
                }));
                setCityOptions(options);
            } catch (error) {
                console.error('Failed to fetch citys:', error);
            }
        }



        fetchCountryData()
        fetchStateData()
        fetchCityData()

    }, [selectedCountry, selectedState, selectedCity]);

    const handleCountryChange = (selectedOptions) => {
        setSelectedCountry(selectedOptions);
        setSelectedState("")
        setSelectedCity("")
    };

    const handleStateChange = (selectedOptions) => {
        setSelectedState(selectedOptions);
        setSelectedCity("")
    };

    const handleCityChange = (selectedOptions) => {
        setSelectedCity(selectedOptions);
    };


    return (
        <>
            <div className="main-content dark">
                <div className="page-content">
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-12">
                                <div className="page-title-box d-flex align-items-center justify-content-between">
                                    <h4 className="mb-0">Edit Area</h4>
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
                                                    State:
                                                </label>
                                                <div className="col-md-10">
                                                    <Select
                                                        required
                                                        value={selectedState}
                                                        onChange={handleStateChange}
                                                        options={stateOptions}
                                                        placeholder="Select State"
                                                        className="w-full md:w-20rem"
                                                    />
                                                </div>
                                            </div>
                                            <div className="mb-3 row">
                                                <label
                                                    htmlFor="example-text-input"
                                                    className="col-md-2 col-form-label"
                                                >
                                                    City:
                                                </label>
                                                <div className="col-md-10">
                                                    <Select
                                                        required
                                                        value={selectedCity}
                                                        onChange={handleCityChange}
                                                        options={cityOptions}
                                                        placeholder="Select City"
                                                        className="w-full md:w-20rem"
                                                    />
                                                </div>
                                            </div>
                                            <div className="mb-3 row">
                                                <label
                                                    htmlFor="example-text-input"
                                                    className="col-md-2 col-form-label"
                                                >
                                                    Area Name:
                                                </label>
                                                <div className="col-md-10">
                                                    <input
                                                        required
                                                        className="form-control"
                                                        type="text"
                                                        id="example-text-input"
                                                        value={areaName}
                                                        onChange={(e) => {
                                                            setAreaName(e.target.value);
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
                                                                Navigate("/admin/showArea")
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
                <AlertBox status={areaAddStatus} statusMessage={statusMessage} />
            </div>
        </>
    );
};

export default EditArea;
