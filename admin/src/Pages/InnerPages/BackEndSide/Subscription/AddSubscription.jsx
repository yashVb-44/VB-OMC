import React, { useState } from "react";
import defualtImage from "../../../../resources/assets/images/add-image.png";
import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import AlertBox from "../../../../Components/AlertComp/AlertBox";

let url = process.env.REACT_APP_API_URL

const AddSubscription = () => {

    const adminToken = localStorage.getItem('token');


    const Navigate = useNavigate();
    const [subscriptionTitle, setSubscriptionTitle] = useState("")
    const [subscriptionName, setSubscriptionName] = useState("");
    const [meals, setMeals] = useState(1);
    const [bites, setBites] = useState(1)
    const [discPrice, setDiscPrice] = useState(0)
    const [oriPrice, setOriPrice] = useState(0)
    const [validity, setValidity] = useState(0)
    const [statusMessage, setStatusMessage] = useState("");
    const [subscriptionAddStatus, setSubscriptionAddStatus] = useState();


    const handleSubmit = async (e) => {
        e.preventDefault();

        if (subscriptionName !== "") {
            let formData = {
                "name": subscriptionName,
                "title": subscriptionTitle,
                "discountPrice": discPrice,
                "originalPrice": oriPrice,
                "validity": validity,
                "meals": meals,
                "bites": bites
            }



            try {
                const adminToken = localStorage.getItem('token');

                let response = await axios.post(
                    `${url}/subscription/add`,
                    formData,
                    {
                        headers: {
                            Authorization: `${adminToken}`,
                        },
                    }
                );
                if (response.data.type === "success") {
                    setSubscriptionAddStatus(response.data.type);
                    let alertBox = document.getElementById("alert-box");
                    alertBox.classList.add("alert-wrapper");
                    setStatusMessage(response.data.message);
                    setTimeout(() => {
                        Navigate("/admin/showSubscription");
                    }, 900);
                } else {
                    setSubscriptionAddStatus(response.data.type);
                    let alertBox = document.getElementById("alert-box");
                    alertBox.classList.add("alert-wrapper");
                    setStatusMessage(response.data.message);
                }
            } catch (error) {
                setSubscriptionAddStatus("error");
                let alertBox = document.getElementById("alert-box");
                alertBox.classList.add("alert-wrapper");
                setStatusMessage("Subscription not Add !");
            }
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            setSubscriptionAddStatus("");
            setStatusMessage("");
            let alertBox = document?.getElementById("alert-box");
            alertBox?.classList?.remove("alert-wrapper");
        }, 1500);

        return () => clearTimeout(timer);
    }, [subscriptionAddStatus, statusMessage]);


    return (
        <>
            <div className="main-content dark">
                <div className="page-content">
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-12">
                                <div className="page-title-box d-flex align-items-center justify-content-between">
                                    <h4 className="mb-0">Add Subscription</h4>
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
                                                    Subscription Title:
                                                </label>
                                                <div className="col-md-10">
                                                    <input
                                                        required
                                                        className="form-control"
                                                        type="text"
                                                        id="example-text-input"
                                                        value={subscriptionTitle}
                                                        onChange={(e) => {
                                                            setSubscriptionTitle(e.target.value);
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                            <div className="mb-3 row">
                                                <label
                                                    htmlFor="example-text-input"
                                                    className="col-md-2 col-form-label"
                                                >
                                                    Subscription Name:
                                                </label>
                                                <div className="col-md-10">
                                                    <input
                                                        required
                                                        className="form-control"
                                                        type="text"
                                                        id="example-text-input"
                                                        value={subscriptionName}
                                                        onChange={(e) => {
                                                            setSubscriptionName(e.target.value);
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                            <div className="mb-3 row">
                                                <label
                                                    htmlFor="example-text-input"
                                                    className="col-md-2 col-form-label"
                                                >
                                                    Meals:
                                                </label>
                                                <div className="col-md-10">
                                                    <input
                                                        min={1}
                                                        required
                                                        className="form-control"
                                                        type="number"
                                                        value={meals}
                                                        onChange={(e) => setMeals(e.target.value)}
                                                        id="example-number-input"
                                                    />
                                                </div>
                                            </div>
                                            <div className="mb-3 row">
                                                <label
                                                    htmlFor="example-text-input"
                                                    className="col-md-2 col-form-label"
                                                >
                                                    Bites:
                                                </label>
                                                <div className="col-md-10">
                                                    <input
                                                        min={1}
                                                        required
                                                        className="form-control"
                                                        type="number"
                                                        value={bites}
                                                        onChange={(e) => setBites(e.target.value)}
                                                        id="example-number-input"
                                                    />
                                                </div>
                                            </div>
                                            <div className="mb-3 row">
                                                <label
                                                    htmlFor="example-text-input"
                                                    className="col-md-2 col-form-label"
                                                >
                                                    Original Price:
                                                </label>
                                                <div className="col-md-10">
                                                    <input
                                                        min={0}
                                                        required
                                                        className="form-control"
                                                        type="number"
                                                        value={oriPrice}
                                                        onChange={(e) => setOriPrice(e.target.value)}
                                                        id="example-number-input"
                                                    />
                                                </div>
                                            </div>
                                            <div className="mb-3 row">
                                                <label
                                                    htmlFor="example-text-input"
                                                    className="col-md-2 col-form-label"
                                                >
                                                    Discount Price:
                                                </label>
                                                <div className="col-md-10">
                                                    <input
                                                        min={0}
                                                        required
                                                        className="form-control"
                                                        type="number"
                                                        value={discPrice}
                                                        onChange={(e) => setDiscPrice(e.target.value)}
                                                        id="example-number-input"
                                                    />
                                                </div>
                                            </div>
                                            <div className="mb-3 row">
                                                <label
                                                    htmlFor="example-text-input"
                                                    className="col-md-2 col-form-label"
                                                >
                                                    Validity:
                                                    <div className="imageSize">( Note:- Validity in days )</div>
                                                </label>
                                                <div className="col-md-10">
                                                    <input
                                                        required
                                                        className="form-control"
                                                        type="Number"
                                                        value={validity}
                                                        onChange={(e) => setValidity(e.target.value)}
                                                        id="example-date-input"
                                                    />
                                                </div>
                                            </div>

                                            <div className="row mb-10">
                                                <div className="col ms-auto">
                                                    <div className="d-flex flex-reverse flex-wrap gap-2">
                                                        <a
                                                            className="btn btn-danger"
                                                            onClick={() => Navigate("/admin/showSubscription")}
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
                <AlertBox status={subscriptionAddStatus} statusMessage={statusMessage} />
            </div>
        </>
    );
};

export default AddSubscription;
