import React, { useState } from "react";
import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Select from "react-select";
import AlertBox from "../../../../Components/AlertComp/AlertBox";

let url = process.env.REACT_APP_API_URL;

const EditCity = () => {

    const adminToken = localStorage.getItem('token');

    const Navigate = useNavigate();

    const selectedCityData = useSelector((city) => city?.CityDataChange?.payload);

    const [cityName, setCityName] = useState(selectedCityData?.name);
    const [selectedCountry, setSelectedCountry] = useState("");
    const [countryOptions, setCountryOptions] = useState([]);
    const [selectedState, setSelectedState] = useState("");
    const [stateOptions, setStateOptions] = useState([]);

    const [cityData, setCityData] = useState([])

    const [cityAddStatus, setCityAddStatus] = useState("");
    const [statusMessage, setStatusMessage] = useState("");

    useEffect(() => {
        async function getCity() {
            try {
                const res = await axios.get(`${url}/city/single/get/${selectedCityData?._id}`,
                    {
                        headers: {
                            Authorization: `${adminToken}`,
                        },
                    });
                setCityData(res?.data?.city || {});
            } catch (error) {
                console.log(error)
            }
        }
        getCity();
    }, [selectedCityData]);


    useEffect(() => {
        setCityName(cityData?.name);

        const selectedState = {
            value: cityData?.state,
            label: cityData?.state
        };
        setSelectedState(selectedState);

        const selectedCountry = {
            value: cityData?.country,
            label: cityData?.country
        };
        setSelectedCountry(selectedCountry);

    }, [cityData])

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (cityName !== "") {
            const formData = {
                name: cityName,
                country: selectedCountry?.value,
                state: selectedState?.value
            }

            try {
                let response = await axios.put(
                    `${url}/city/update/byAdmin/${selectedCityData?._id}`,
                    formData,
                    {
                        headers: {
                            Authorization: `${adminToken}`,
                        },
                    }
                );
                if (response.data.type === "success") {
                    setCityAddStatus(response.data.type);
                    let alertBox = document.getElementById("alert-box");
                    alertBox.classList.add("alert-wrapper");
                    setStatusMessage(response.data.message);
                    setTimeout(() => {
                        Navigate("/admin/showCity");
                    }, 900);
                } else {
                    setCityAddStatus(response.data.type);
                    let alertBox = document.getElementById("alert-box");
                    alertBox.classList.add("alert-wrapper");
                    setStatusMessage(response.data.message);
                }
            } catch (error) {
                setCityAddStatus("error");
                let alertBox = document.getElementById("alert-box");
                alertBox.classList.add("alert-wrapper");
                setStatusMessage("City not Update !");
            }
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            setCityAddStatus("");
            setStatusMessage("");
            let alertBox = document?.getElementById("alert-box");
            alertBox?.classList?.remove("alert-wrapper");
        }, 1500);

        return () => clearTimeout(timer);
    }, [cityAddStatus, statusMessage]);

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


        fetchCountryData()
        fetchStateData()

    }, [selectedCountry, selectedState]);

    const handleCountryChange = (selectedOptions) => {
        setSelectedCountry(selectedOptions);
        setSelectedState("")
    };

    const handleStateChange = (selectedOptions) => {
        setSelectedState(selectedOptions);
    };


    return (
        <>
            <div className="main-content dark">
                <div className="page-content">
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-12">
                                <div className="page-title-box d-flex align-items-center justify-content-between">
                                    <h4 className="mb-0">Edit City</h4>
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
                                                    City Name:
                                                </label>
                                                <div className="col-md-10">
                                                    <input
                                                        required
                                                        className="form-control"
                                                        type="text"
                                                        id="example-text-input"
                                                        value={cityName}
                                                        onChange={(e) => {
                                                            setCityName(e.target.value);
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
                                                                Navigate("/admin/showCity")
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
                <AlertBox status={cityAddStatus} statusMessage={statusMessage} />
            </div>
        </>
    );
};

export default EditCity;
