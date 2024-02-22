import React, { useState, useEffect } from "react";
import defualtImage from "../../../../resources/assets/images/add-image.png";
import axios from "axios";

const url = process.env.REACT_APP_API_URL

const EditCustomization = ({ handleCloseModal, selectedCustomization, handleCustomizationUpdate }) => {
    const mandatory = selectedCustomization?.isCustimizeMandatory === "Yes" ? true : false
    const adminToken = localStorage.getItem('token');
    const [customizationTitle, setCustomizationTitle] = useState(selectedCustomization?.name || "");
    const [isCustimizeMandatory, setIsCustimizeMandatory] = useState(mandatory)
    const [customizationType, setCustomizationType] = useState(selectedCustomization?.type)
    const [loading, setLoading] = useState(false);
    const [buttonDisabled, setButtonDisabled] = useState(false);


    useEffect(() => {
        setCustomizationTitle(selectedCustomization?.name || "");
    }, []);


    const handleUpdateCustomization = async (e) => {
        e.preventDefault();
        setLoading(true)
        setButtonDisabled(true)

        if (!customizationTitle) {
            console.log("Please provide customization Name");
            return;
        }

        try {
            const formData = {
                name: customizationTitle,
                type: customizationType,
                isCustimizeMandatory: isCustimizeMandatory
            }

            const response = await axios.put(
                `${url}/meal/customization/update/${selectedCustomization._id}`,
                formData,
                {
                    headers: {
                        Authorization: `${adminToken}`,
                    },
                }
            );

            const updatedCustomization = response?.data?.type
            console.log(updatedCustomization);
            handleCustomizationUpdate();

            handleCloseModal();
        } catch (error) {
            console.error("Error updating customization:", error);
        }
        finally {
            setLoading(false)
            setButtonDisabled(false)
        }
    };

    const CustimizeMandatory = [
        { name: "No", value: false },
        { name: "Yes", value: true }
    ]

    const CustimizeType = [
        { name: "Single", value: "radio" },
        { name: "Multiple", value: "checkBox" }
    ]

    return (
        <div className="main-content-model dark">
            <div className="page-content">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-12">
                            <div className="card model-card">
                                <div className="card-body">
                                    <div className="page-title-box d-flex align-items-center justify-content-between">
                                        <h4 className="mb-0">Edit Customization</h4>
                                        {loading && <div className="loader">Loading...</div>}
                                        <i
                                            className="fas fa-window-close"
                                            style={{ cursor: "pointer", color: "red" }}
                                            onClick={handleCloseModal}
                                        ></i>
                                    </div>
                                    <form onSubmit={handleUpdateCustomization}>
                                        <div className="mb-3 row">
                                            <label htmlFor="example-text-input" className="col-md-2 col-form-label">
                                                Customization Title:
                                            </label>
                                            <div className="col-md-10">
                                                <input
                                                    required
                                                    className="form-control"
                                                    type="text"
                                                    id="example-text-input"
                                                    value={customizationTitle}
                                                    onChange={(e) => {
                                                        setCustomizationTitle(e.target.value);
                                                    }}
                                                />
                                            </div>
                                        </div>
                                        <div className="mb-3 row">
                                            <label
                                                htmlFor="example-text-input"
                                                className="col-md-2 col-form-label"
                                            >
                                                Customization Required:
                                            </label>
                                            <div className="col-md-10">
                                                <select
                                                    required
                                                    className="form-select"
                                                    id="subcategory-select"
                                                    value={isCustimizeMandatory}
                                                    onChange={(e) => {
                                                        setIsCustimizeMandatory(e.target.value);
                                                    }}
                                                >
                                                    {CustimizeMandatory.map((value) => (
                                                        <option key={value?.name} value={value?.value}>
                                                            {value?.name}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>

                                        <div className="mb-3 row">
                                            <label
                                                htmlFor="example-text-input"
                                                className="col-md-2 col-form-label"
                                            >
                                                Customization Type:
                                            </label>
                                            <div className="col-md-10">
                                                <select
                                                    required
                                                    className="form-select"
                                                    id="subcategory-select"
                                                    value={customizationType}
                                                    onChange={(e) => {
                                                        setCustomizationType(e.target.value);
                                                    }}
                                                >
                                                    {CustimizeType.map((value) => (
                                                        <option key={value?.name} value={value?.value}>
                                                            {value?.name}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>

                                        <div className="d-flex flex-reverse flex-wrap gap-2">
                                            <a className="btn btn-danger" onClick={handleCloseModal}>
                                                <i className="fas fa-window-close"></i> Cancel{" "}
                                            </a>
                                            <button className="btn btn-success" type="submit" disabled={buttonDisabled}>
                                                <i className="fas fa-save"></i> Save{" "}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditCustomization;
