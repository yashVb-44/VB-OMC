import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import AlertBox from '../../../Components/AlertComp/AlertBox';

let url = process.env.REACT_APP_API_URL

const EditRestaurantDaysTime = ({ id }) => {

    const adminToken = localStorage.getItem('token');
    const Navigate = useNavigate()
    const [restaurantData, setRestaurantData] = useState({})
    const [loading, setLoading] = useState(false);
    const [buttonDisabled, setButtonDisabled] = useState(false);
    const [restaurantAddStatus, setRestaurantAddStatus] = useState();
    const [statusMessage, setStatusMessage] = useState("");


    const [resturantFormData, setResturantFormData] = useState({
        days: {
            monday: { open_time: '', close_time: '', closed: false },
            tuesday: { open_time: '', close_time: '', closed: false },
            wednesday: { open_time: '', close_time: '', closed: false },
            thursday: { open_time: '', close_time: '', closed: false },
            friday: { open_time: '', close_time: '', closed: false },
            saturday: { open_time: '', close_time: '', closed: false },
            sunday: { open_time: '', close_time: '', closed: false },
        },
    })


    useEffect(() => {
        async function getRestaurant() {
            try {
                const res = await axios.get(`${url}/restaurant/single/get/${id}`,
                    {
                        headers: {
                            Authorization: `${adminToken}`,
                        },
                    });
                setRestaurantData(res?.data?.restaurant || {});
            } catch (error) {
                console.log(error)
            }
        }
        getRestaurant();
    }, []);


    useEffect(() => {

        // Check if restaurantData.days is available before setting resturantFormData
        if (restaurantData.days) {
            setResturantFormData({
                ...resturantFormData,
                days: { ...restaurantData.days }
            });
        }

    }, [restaurantData])

    const handleDayChange = (day, field, value) => {
        setResturantFormData((prevData) => ({
            ...prevData,
            days: {
                ...prevData.days,
                [day]: {
                    ...prevData.days[day],
                    [field]: value,
                },
            },
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setButtonDisabled(true)
        setLoading(true)

        const formData = new FormData();
        formData.append("days", JSON.stringify(resturantFormData.days));

        try {
            let response = await axios.put(
                `${url}/restaurant/dayTime/update/byRestaurnat/${id}`,
                formData,
                {
                    headers: {
                        Authorization: `${adminToken}`,
                    },
                }
            );

            if (response.data.type === "success") {
                setRestaurantAddStatus(response.data.type);

                let alertBox = document.getElementById("alert-box");
                alertBox.classList.add("alert-wrapper");
                setStatusMessage(response.data.message);

                //  for create variations
                setTimeout(() => {
                    Navigate("/admin/");
                }, 900);

            } else {
                setRestaurantAddStatus(response.data.type);
                let alertBox = document.getElementById("alert-box");
                alertBox.classList.add("alert-wrapper");
                setStatusMessage(response.data.message);
            }
        } catch (error) {
            setRestaurantAddStatus("error");
            let alertBox = document.getElementById("alert-box");
            alertBox.classList.add("alert-wrapper");
            setStatusMessage("Restaurant not Update !");
        } finally {
            setButtonDisabled(false)
            setLoading(false)
        }

    };

    return (
        <>
            <div className="main-content dark">
                <div className="page-content">
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-12">
                                <div className="page-title-box d-flex align-items-center justify-content-between">
                                    <h4 className="mb-0">Restaurant Day/Time</h4>
                                    {loading && <div className="loader">Loading...</div>}
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-12">
                                <div className="card">
                                    <div className="card-body">
                                        <form onSubmit={handleSubmit}>
                                            {Object.entries(resturantFormData.days).map(([day, dayData]) => (
                                                <div key={day} className="mb-3 row">
                                                    <label
                                                        htmlFor="example-text-input"
                                                        className="col-md-2 col-form-label"
                                                    >
                                                        {day.charAt(0).toUpperCase() + day.slice(1)}:
                                                    </label>
                                                    <div className="col-md-4">
                                                        Open Time
                                                        <input
                                                            className="form-control"
                                                            type="time"
                                                            name={`days.${day}.open_time`}
                                                            value={dayData && dayData.open_time ? dayData.open_time : ''}
                                                            onChange={(e) => handleDayChange(day, 'open_time', e.target.value)}
                                                        />
                                                    </div>
                                                    <div className="col-md-4">
                                                        Close Time
                                                        <input
                                                            className="form-control"
                                                            type="time"
                                                            name={`days.${day}.close_time`}
                                                            value={dayData.close_time || ''}
                                                            onChange={(e) => handleDayChange(day, 'close_time', e.target.value)}
                                                        />
                                                    </div>
                                                    <div className="col-md-2">
                                                        <br></br>
                                                        Closed -
                                                        <input
                                                            style={{ marginLeft: "8px" }}
                                                            class="form-check-input"
                                                            id="formrow-customCheck"
                                                            type="checkbox"
                                                            name={`days.${day}.closed`}
                                                            checked={dayData.closed}
                                                            onChange={(e) => handleDayChange(day, 'closed', e.target.checked)}
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                            <div className="mb-3 row">
                                                <div className="col-md-10 offset-md-2">
                                                    <div className="row mb-10">
                                                        <div className="col ms-auto">
                                                            <div className="d-flex flex-reverse flex-wrap gap-2">
                                                                {/* <a
                                                                    className="btn btn-danger"
                                                                    onClick={() => Navigate("/admin/showRestaurant")}
                                                                >
                                                                    {" "}
                                                                    <i className="fas fa-window-close"></i> Cancel{" "}
                                                                </a> */}
                                                                <button
                                                                    className="btn btn-success"
                                                                    type="submit"
                                                                    disabled={buttonDisabled}
                                                                >
                                                                    {" "}
                                                                    <i className="fas fa-save"></i> Save{" "}
                                                                </button>
                                                            </div>
                                                        </div>
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
                <AlertBox status={restaurantAddStatus} statusMessage={statusMessage} />
            </div>
        </>
    )
}

export default EditRestaurantDaysTime
