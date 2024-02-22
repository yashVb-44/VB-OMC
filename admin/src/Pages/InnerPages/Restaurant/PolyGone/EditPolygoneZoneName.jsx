import React, { useEffect, useState } from 'react';
import axios from 'axios';
let url = process.env.REACT_APP_API_URL

const EditPolygoneZoneMame = ({ handleCloseModal, zone, id, handleZoneUpdate }) => {
    const adminToken = localStorage.getItem('token');
    const [zoneName, setZoneName] = useState(zone || '');
    const [loading, setLoading] = useState(false);
    const [buttonDisabled, setButtonDisabled] = useState(false);


    const handleUpdateZone = async (e) => {
        e.preventDefault();
        setLoading(true)
        setButtonDisabled(true)

        try {
            // Send the updated zone data to the server
            const response = await axios.post(
                `${url}/mapZone/name/update/byRestaurantOrAdmin/${id}`,
                {
                    name: zoneName,
                },
                {
                    headers: {
                        Authorization: `${adminToken}`,
                    },
                }
            );

            if (response?.data?.type === 'success') {
                // handleZoneUpdate(selectedZoneData?._id, { name: zoneName, bites: bites });
                handleCloseModal();
            } else if (response?.data?.type === "warning") {
                alert(response?.data?.message)
                console.log('Error updating zone name:', response?.data?.message);
            } else {
                alert("Somthing went wrong!")
            }
        } catch (error) {
            console.log('Error updating zone name:', error);
        }
        finally {
            setLoading(false)
            setButtonDisabled(false)
        }
    };

    return (
        <>
            <div className="main-content-model dark">
                <div className="page-content">
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-12">
                                <div className="card-body">
                                    <div style={{ border: "1px dashed grey", padding: "20px" }}>
                                        <div className="page-title-box d-flex align-items-center justify-content-between">
                                            <h4 className="mb-0" style={{ borderBottom: "1px solid black" }}>Edit Zone Name</h4>
                                            {loading && <div className="loader">Loading...</div>}
                                            <i
                                                className="fas fa-window-close"
                                                style={{ cursor: "pointer", color: "red" }}
                                                onClick={handleCloseModal}
                                            ></i>
                                        </div>
                                        <form onSubmit={handleUpdateZone}>
                                            <div className="mb-3 row">
                                                <label
                                                    htmlFor="example-text-input"
                                                    className="col-md-2 col-form-label"
                                                >
                                                    Zone Name:
                                                </label>
                                                <div className="col-md-10">
                                                    <input
                                                        required
                                                        className="form-control"
                                                        type="text"
                                                        id="example-number-input"
                                                        value={zoneName}
                                                        onChange={(e) => {
                                                            setZoneName(e.target.value)
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-3">
                                                <button type="submit" className="btn btn-primary" disabled={buttonDisabled}>
                                                    Update Zone Name
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

        </>
    );
};

export default EditPolygoneZoneMame;
