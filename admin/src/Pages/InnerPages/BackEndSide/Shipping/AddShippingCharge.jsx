import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AlertBox from "../../../../Components/AlertComp/AlertBox";
import Select from "react-select";
import { City, State } from "country-state-city";

let url = process.env.REACT_APP_API_URL;

const AddShippingCharge = () => {
    const adminToken = localStorage.getItem('token');
    const Navigate = useNavigate();

    const [shippingChargeType, setShippingChargeType] = useState("everywhere");
    const [userType, setUserType] = useState("0");
    const [shippingChargeAddStatus, setShippingChargeAddStatus] = useState("");
    const [statusMessage, setStatusMessage] = useState("");
    const [selectedState, setSelectedState] = useState("");
    const [selectedCity, setSelectedCity] = useState("");
    const [w0, setw0] = useState(0)
    const [w1, setw1] = useState(0)
    const [w2, setw2] = useState(0)
    const [w3, setw3] = useState(0)
    const [w4, setw4] = useState(0)
    const [w5, setw5] = useState(0)
    const [w6, setw6] = useState(0)
    const [w7, setw7] = useState(0)
    const [w8, setw8] = useState(0)
    const [w9, setw9] = useState(0)
    const [w10, setw10] = useState(0)
    const [w11, setw11] = useState(0)
    const [w12, setw12] = useState(0)
    const [w13, setw13] = useState(0)
    const [w14, setw14] = useState(0)
    const [w15, setw15] = useState(0)
    const [w16, setw16] = useState(0)
    const [w17, setw17] = useState(0)
    const [w18, setw18] = useState(0)
    const [w19, setw19] = useState(0)
    const [w20, setw20] = useState(0)


    const handleSubmit = async (e) => {
        e.preventDefault();

        if (shippingChargeType !== "") {

            try {
                let response = await axios.post(
                    `${url}/shippingCharge/add`,
                    {
                        w0, w1, w2, w3, w4, w5, w6, w7, w8, w9,
                        w10, w11, w12, w13, w14, w15, w16, w17, w18, w19, w20,
                        userType: userType,
                        type: shippingChargeType,
                        state: selectedState?.name,
                        city: selectedCity?.name
                    },
                    {
                        headers: {
                            Authorization: `${adminToken}`,
                        },
                    }
                );
                if (response?.data?.type === "success") {
                    setShippingChargeAddStatus(response.data.type);
                    let alertBox = document.getElementById('alert-box');
                    alertBox.classList.add('alert-wrapper');
                    setStatusMessage(response.data.message);
                    setTimeout(() => {
                        Navigate('/admin/showShippingCharge');
                    }, 900);
                } else {
                    setShippingChargeAddStatus(response.data.type);
                    let alertBox = document.getElementById('alert-box');
                    alertBox.classList.add('alert-wrapper');
                    setStatusMessage(response.data.message);
                }
            } catch (error) {
                console.log(error)
                setShippingChargeAddStatus("error");
                let alertBox = document.getElementById('alert-box');
                alertBox.classList.add('alert-wrapper');
                setStatusMessage("Shipping charges not Add !");
            }
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            setShippingChargeAddStatus("");
            setStatusMessage("");
            let alertBox = document?.getElementById('alert-box')
            alertBox?.classList?.remove('alert-wrapper')
        }, 1500);

        return () => clearTimeout(timer);
    }, [shippingChargeAddStatus, statusMessage]);

    return (
        <>
            <div className="main-content dark">
                <div className="page-content">
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-12">
                                <div className="page-title-box d-flex align-items-center justify-content-between">
                                    <h4 className="mb-0">Add Shipping Charges</h4>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-12">
                                <div className="card">
                                    <div className="card-body">
                                        <form onSubmit={handleSubmit}>
                                            <div className="mb-3 row">
                                                <label className="col-md-2 col-form-label">Type :</label>
                                                <div className="col-md-10">
                                                    <select
                                                        required
                                                        className="form-select"
                                                        value={shippingChargeType}
                                                        onChange={(e) => setShippingChargeType(e.target.value)}
                                                    >
                                                        <option value="everywhere">Everywhere</option>
                                                        <option value="specific">Specific</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="mb-3 row">
                                                <label className="col-md-2 col-form-label">User Type :</label>
                                                <div className="col-md-10">
                                                    <select
                                                        required
                                                        className="form-select"
                                                        value={userType}
                                                        onChange={(e) => setUserType(e.target.value)}
                                                    >
                                                        <option value="0">User</option>
                                                        <option value="1">Premium Bulk Buyer</option>
                                                        <option value="2">Bulk Buyer </option>
                                                        <option value="3">Premium Reseller</option>
                                                        <option value="4">Reseller</option>
                                                    </select>
                                                </div>
                                            </div>

                                            {
                                                shippingChargeType === "specific" &&
                                                <>
                                                    <div className="mb-3 row">
                                                        <label className="col-md-2 col-form-label">State :</label>
                                                        <div className="col-md-10">
                                                            <Select
                                                                className="select"
                                                                required
                                                                placeholder="Select State"
                                                                options={State?.getStatesOfCountry('IN')}
                                                                getOptionLabel={(options) => {
                                                                    return options["name"];
                                                                }}
                                                                getOptionValue={(options) => {
                                                                    return options["name"];
                                                                }}
                                                                value={selectedState}
                                                                onChange={(item) => {
                                                                    setSelectedState(item);
                                                                }}
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="mb-3 row">
                                                        <label className="col-md-2 col-form-label">City :</label>
                                                        <div className="col-md-10">
                                                            <Select
                                                                className="select"
                                                                required
                                                                placeholder="Select City"
                                                                options={City.getCitiesOfState(
                                                                    selectedState?.countryCode,
                                                                    selectedState?.isoCode
                                                                )}
                                                                getOptionLabel={(options) => {
                                                                    return options["name"];
                                                                }}
                                                                getOptionValue={(options) => {
                                                                    return options["name"];
                                                                }}
                                                                value={selectedCity}
                                                                onChange={(item) => {
                                                                    setSelectedCity(item);
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                </>
                                            }

                                            <div className="mb-3 row" >
                                                <label className="col-md-2 col-form-label">{`Weight Charge :`}</label>
                                                <div className="col-md-2">
                                                    <label className="mt-2">Weight 0-1 Kg Charge</label>
                                                    <input
                                                        min={0}
                                                        required
                                                        className="form-control"
                                                        type="number"
                                                        value={w0}
                                                        onChange={(e) => setw0(e.target.value)}
                                                    />
                                                </div>
                                                <div className="col-md-2">
                                                    <label className="mt-2">Weight 1-2 Kg Charge</label>
                                                    <input
                                                        min={0}
                                                        required
                                                        className="form-control"
                                                        type="number"
                                                        value={w1}
                                                        onChange={(e) => setw1(e.target.value)}
                                                    />
                                                </div>
                                                <div className="col-md-2">
                                                    <label className="mt-2">Weight 2-3 Kg Charge</label>
                                                    <input
                                                        min={0}
                                                        required
                                                        className="form-control"
                                                        type="number"
                                                        value={w2}
                                                        onChange={(e) => setw2(e.target.value)}
                                                    />
                                                </div>
                                                <div className="col-md-2">
                                                    <label className="mt-2">Weight 3-4 Kg Charge</label>
                                                    <input
                                                        min={0}
                                                        required
                                                        className="form-control"
                                                        type="number"
                                                        value={w3}
                                                        onChange={(e) => setw3(e.target.value)}
                                                    />
                                                </div>
                                                <div className="col-md-2">
                                                    <label className="mt-2">Weight 4-5 Kg Charge</label>
                                                    <input
                                                        min={0}
                                                        required
                                                        className="form-control"
                                                        type="number"
                                                        value={w4}
                                                        onChange={(e) => setw4(e.target.value)}
                                                    />
                                                </div>
                                                <div className="col-md-2">
                                                </div>
                                                <div className="col-md-2">
                                                    <label className="mt-2">Weight 5-6 Kg Charge</label>
                                                    <input
                                                        min={0}
                                                        required
                                                        className="form-control"
                                                        type="number"
                                                        value={w5}
                                                        onChange={(e) => setw5(e.target.value)}
                                                    />
                                                </div>
                                                <div className="col-md-2">
                                                    <label className="mt-2">Weight 6-7 Kg Charge</label>
                                                    <input
                                                        min={0}
                                                        required
                                                        className="form-control"
                                                        type="number"
                                                        value={w6}
                                                        onChange={(e) => setw6(e.target.value)}
                                                    />
                                                </div>
                                                <div className="col-md-2">
                                                    <label className="mt-2">Weight 7-8 Kg Charge</label>
                                                    <input
                                                        min={0}
                                                        required
                                                        className="form-control"
                                                        type="number"
                                                        value={w7}
                                                        onChange={(e) => setw7(e.target.value)}
                                                    />
                                                </div>
                                                <div className="col-md-2">
                                                    <label className="mt-2">Weight 8-9 Kg Charge</label>
                                                    <input
                                                        min={0}
                                                        required
                                                        className="form-control"
                                                        type="number"
                                                        value={w8}
                                                        onChange={(e) => setw8(e.target.value)}
                                                    />
                                                </div>
                                                <div className="col-md-2">
                                                    <label className="mt-2">Weight 9-10 Kg Charge</label>
                                                    <input
                                                        min={0}
                                                        required
                                                        className="form-control"
                                                        type="number"
                                                        value={w9}
                                                        onChange={(e) => setw9(e.target.value)}
                                                    />
                                                </div>
                                                <div className="col-md-2">
                                                </div>
                                                <div className="col-md-2">
                                                    <label className="mt-2">Weight 10-11 Kg Charge</label>
                                                    <input
                                                        min={0}
                                                        required
                                                        className="form-control"
                                                        type="number"
                                                        value={w10}
                                                        onChange={(e) => setw10(e.target.value)}
                                                    />
                                                </div>
                                                <div className="col-md-2">
                                                    <label className="mt-2">Weight 11-12 Kg Charge</label>
                                                    <input
                                                        min={0}
                                                        required
                                                        className="form-control"
                                                        type="number"
                                                        value={w11}
                                                        onChange={(e) => setw11(e.target.value)}
                                                    />
                                                </div>
                                                <div className="col-md-2">
                                                    <label className="mt-2">Weight 12-13 Kg Charge</label>
                                                    <input
                                                        min={0}
                                                        required
                                                        className="form-control"
                                                        type="number"
                                                        value={w12}
                                                        onChange={(e) => setw12(e.target.value)}
                                                    />
                                                </div>
                                                <div className="col-md-2">
                                                    <label className="mt-2">Weight 13-14 Kg Charge</label>
                                                    <input
                                                        min={0}
                                                        required
                                                        className="form-control"
                                                        type="number"
                                                        value={w13}
                                                        onChange={(e) => setw13(e.target.value)}
                                                    />
                                                </div>
                                                <div className="col-md-2">
                                                    <label className="mt-2">Weight 14-15 Kg Charge</label>
                                                    <input
                                                        min={0}
                                                        required
                                                        className="form-control"
                                                        type="number"
                                                        value={w14}
                                                        onChange={(e) => setw14(e.target.value)}
                                                    />
                                                </div>
                                                <div className="col-md-2">
                                                </div>
                                                <div className="col-md-2">
                                                    <label className="mt-2">Weight 15-16 Kg Charge</label>
                                                    <input
                                                        min={0}
                                                        required
                                                        className="form-control"
                                                        type="number"
                                                        value={w15}
                                                        onChange={(e) => setw15(e.target.value)}
                                                    />
                                                </div>
                                                <div className="col-md-2">
                                                    <label className="mt-2">Weight 16-17 Kg Charge</label>
                                                    <input
                                                        min={0}
                                                        required
                                                        className="form-control"
                                                        type="number"
                                                        value={w16}
                                                        onChange={(e) => setw16(e.target.value)}
                                                    />
                                                </div>
                                                <div className="col-md-2">
                                                    <label className="mt-2">Weight 17-18 Kg Charge</label>
                                                    <input
                                                        min={0}
                                                        required
                                                        className="form-control"
                                                        type="number"
                                                        value={w17}
                                                        onChange={(e) => setw17(e.target.value)}
                                                    />
                                                </div>
                                                <div className="col-md-2">
                                                    <label className="mt-2">Weight 18-19 Kg Charge</label>
                                                    <input
                                                        min={0}
                                                        required
                                                        className="form-control"
                                                        type="number"
                                                        value={w18}
                                                        onChange={(e) => setw18(e.target.value)}
                                                    />
                                                </div>
                                                <div className="col-md-2">
                                                    <label className="mt-2">Weight 19-20 Kg Charge</label>
                                                    <input
                                                        min={0}
                                                        required
                                                        className="form-control"
                                                        type="number"
                                                        value={w19}
                                                        onChange={(e) => setw19(e.target.value)}
                                                    />
                                                </div>
                                                <div className="col-md-2">
                                                </div>
                                                <div className="col-md-2">
                                                    <label className="mt-2">Weight above 20 Kg Charge</label>
                                                    <input
                                                        min={0}
                                                        required
                                                        className="form-control"
                                                        type="number"
                                                        value={w20}
                                                        onChange={(e) => setw20(e.target.value)}
                                                    />
                                                </div>
                                            </div>

                                            <div className="row mb-10">
                                                <div className="col ms-auto">
                                                    <div className="d-flex flex-reverse flex-wrap gap-2">
                                                        <a className="btn btn-danger" onClick={() => Navigate('/admin/showShippingCharge')}>
                                                            <i className="fas fa-window-close"></i> Cancel
                                                        </a>
                                                        <button className="btn btn-success" type="submit">
                                                            <i className="fas fa-save"></i> Save
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
                <AlertBox status={shippingChargeAddStatus} statusMessage={statusMessage} />
            </div>
        </>
    );
};

export default AddShippingCharge;
