import axios from "axios";
import React, { useEffect, useState } from "react";


let url = process.env.REACT_APP_API_URL

const AddCustomizationByTable = ({ handleCloseModal, customizations, setCustomizations, mealId }) => {

    const adminToken = localStorage.getItem('token');

    const [customizationName, setCustomizationName] = useState("");
    const [isCustimizeMandatory, setIsCustimizeMandatory] = useState(false)
    const [customizationType, setCustomizationType] = useState("radio")
    const [loading, setLoading] = useState(false);
    const [buttonDisabled, setButtonDisabled] = useState(false);

    const [customizationInputs, setCustomizationInputs] = useState([
        {
            index: 1, name: "", required: false, type: "radio", bite: 0
        }
    ]);


    const handleAddCustomizationInput = () => {
        const newCustomizationInput = {
            index: customizationInputs.length + 1,
            name: "",
            type: "",
            bite: 0
        };
        setCustomizationInputs([...customizationInputs, newCustomizationInput]);
    };

    const handleRemoveCustomizationInput = (index) => {
        const updatedCustomizationInputs = customizationInputs.filter(
            (customizationInput) => customizationInput.index !== index
        );
        setCustomizationInputs(updatedCustomizationInputs.map((customizationInput, i) => ({ ...customizationInput, index: i + 1 })));
    };

    const handleAddCustomization = async (e) => {
        e.preventDefault();
        setLoading(true)
        setButtonDisabled(true)

        const formData = new FormData();
        formData.append("name", customizationName);
        formData.append('type', customizationType);
        formData.append('isCustimizeMandatory', isCustimizeMandatory);
        customizationInputs.forEach((segment) => {
            formData.append('segmentName', segment?.name);
            formData.append('bites', segment?.bite);
        });

        try {
            const response = await axios.post(`${url}/meal/customization/add/${mealId}`, formData,
                {
                    headers: {
                        Authorization: `${adminToken}`,
                    },
                });
            if (response.data.type === "success") {
                setCustomizations([...customizations, response?.data?.customization]);
                setCustomizationName("");
                setCustomizationInputs([{
                    index: 1, name: "", required: false, type: "radio", bite: 0
                }]);
                handleCloseModal();
            } else {
                console.error("Failed to add customization:", response.data.message);
            }
        } catch (error) {
            console.error("Failed to add customization:", error);
        } finally {
            setLoading(false)
            setButtonDisabled(false)
        }


        handleCloseModal();
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
                                        <h4 className="mb-0">Add Customization</h4>
                                        {loading && <div className="loader">Loading...</div>}
                                        <i
                                            className="fas fa-window-close"
                                            style={{ cursor: "pointer", color: "red" }}
                                            onClick={handleCloseModal}
                                        ></i>
                                    </div>
                                    <form onSubmit={handleAddCustomization}>
                                        <div className="mb-3 row">
                                            <label
                                                htmlFor="example-text-input"
                                                className="col-md-2 col-form-label"
                                            >
                                                Customization Title:
                                            </label>
                                            <div className="col-md-10">
                                                <input
                                                    required
                                                    className="form-control"
                                                    type="text"
                                                    id="example-text-input"
                                                    value={customizationName}
                                                    onChange={(e) => {
                                                        setCustomizationName(e.target.value);
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


                                        {customizationInputs.map((customizationInput, index) => (
                                            <div className="mb-3 row" key={customizationInput.index}>
                                                <label
                                                    htmlFor="example-text-input"
                                                    className="col-md-2 col-form-label"
                                                    style={{ fontWeight: "bold", textDecoration: "underline" }}
                                                >
                                                    Segment  {customizationInput.index}:
                                                </label>
                                                <div className="col-md-4">
                                                    Name
                                                    <input
                                                        min="0"
                                                        required
                                                        className="form-control"
                                                        type="text"
                                                        id="example-number-input"
                                                        value={customizationInput.name}
                                                        onChange={(e) => {
                                                            const updatedCustomizationInputs = [...customizationInputs];
                                                            updatedCustomizationInputs[index].name = e.target.value;
                                                            setCustomizationInputs(updatedCustomizationInputs);
                                                        }}
                                                    />
                                                </div>
                                                <div className="col-md-4">
                                                    Bites
                                                    <input
                                                        min="0"
                                                        required
                                                        className="form-control"
                                                        type="number"
                                                        id="example-number-input"
                                                        value={customizationInput.bite}
                                                        onChange={(e) => {
                                                            const updatedCustomizationInputs = [...customizationInputs];
                                                            updatedCustomizationInputs[index].bite = e.target.value;
                                                            setCustomizationInputs(updatedCustomizationInputs);
                                                        }}
                                                    />
                                                </div>

                                                {customizationInputs.length > 1 && (
                                                    <div className="col-md-1">
                                                        <i
                                                            className="fa fa-times mt-4"
                                                            style={{ fontSize: "34px", cursor: "pointer", color: "red" }}
                                                            onClick={() => handleRemoveCustomizationInput(customizationInput.index)}
                                                        ></i>
                                                    </div>
                                                )}
                                                {index === customizationInputs.length - 1 && (
                                                    <>
                                                        <div className="col-md-1">
                                                            <i
                                                                className="fa fa-plus mt-4"
                                                                style={{ fontSize: "32px", cursor: "pointer", color: "#5b73e8" }}
                                                                onClick={handleAddCustomizationInput}
                                                            ></i>
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        ))}

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

export default AddCustomizationByTable;
