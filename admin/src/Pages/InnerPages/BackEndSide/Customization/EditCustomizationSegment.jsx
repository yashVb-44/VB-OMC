import React, { useEffect, useState } from 'react';
import axios from 'axios';
let url = process.env.REACT_APP_API_URL

const EditCustomizationSegment = ({ handleCloseModal, selectedSegmentData, customizationId, handleSegmentUpdate }) => {
    const adminToken = localStorage.getItem('token');
    const [segmentName, setSegmentName] = useState(selectedSegmentData?.name || '');
    const [bites, setBites] = useState(selectedSegmentData?.bites || 0);
    const [loading, setLoading] = useState(false);
    const [buttonDisabled, setButtonDisabled] = useState(false);


    const handleUpdateSegment = async (e) => {
        e.preventDefault();
        setLoading(true)
        setButtonDisabled(true)

        try {
            // Send the updated segment data to the server
            const response = await axios.put(
                `${url}/meal/customization/update/segment/${customizationId}/${selectedSegmentData?._id}`,
                {
                    name: segmentName,
                    bites: bites
                },
                {
                    headers: {
                        Authorization: `${adminToken}`,
                    },
                }
            );

            if (response?.data?.type === 'success') {
                handleSegmentUpdate(selectedSegmentData?._id, { name: segmentName, bites: bites });
                handleCloseModal();
            } else {
                console.log('Error updating segment:', response?.data?.message);
            }
        } catch (error) {
            console.log('Error updating segment:', error);
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
                                <div className="card model-card">
                                    <div className="card-body">
                                        <div className="page-title-box d-flex align-items-center justify-content-between">
                                            <h4 className="mb-0">Edit Customization Segment</h4>
                                            {loading && <div className="loader">Loading...</div>}
                                            <i
                                                className="fas fa-window-close"
                                                style={{ cursor: "pointer", color: "red" }}
                                                onClick={handleCloseModal}
                                            ></i>
                                        </div>
                                        <form onSubmit={handleUpdateSegment}>
                                            <div className="mb-3 row">
                                                <label htmlFor="example-text-input" className="col-md-1 col-form-label mt-3">
                                                    Segment:
                                                </label>
                                                <div className="col-md-4">
                                                    Name
                                                    <input
                                                        min="0"
                                                        required
                                                        className="form-control"
                                                        type="text"
                                                        id="example-number-input"
                                                        value={segmentName}
                                                        onChange={(e) => {
                                                            setSegmentName(e.target.value)
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
                                                        value={bites}
                                                        onChange={(e) => {
                                                            setBites(e.target.value)
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-2">
                                                <button type="submit" className="btn btn-primary" disabled={buttonDisabled}>
                                                    Update Segment
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

export default EditCustomizationSegment;
