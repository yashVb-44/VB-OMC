import React, { useEffect, useState } from 'react';
import axios from 'axios';
let url = process.env.REACT_APP_API_URL;

const AddCustomizationSegment = ({ customizationId, handleCloseModal, handleSegmentAdd }) => {
    const adminToken = localStorage.getItem('token');


    const [segmentName, setSegmentName] = useState('');
    const [bites, setBites] = useState(0)

    const [loading, setLoading] = useState(false);
    const [buttonDisabled, setButtonDisabled] = useState(false);

    const handleAddSegment = async (e) => {
        e.preventDefault();
        setLoading(true)
        setButtonDisabled(true)

        try {
            // Send the new segment data to the server
            const response = await axios.post(`${url}/meal/customization/add/segment/${customizationId}`, {
                segmentName: segmentName,
                bites: bites
            }, {
                headers: {
                    Authorization: `${adminToken}`,
                },
            });

            if (response?.data?.type === 'success') {
                // handleSegmentAdd(response.data.segment);
                handleCloseModal();
            } else {
                console.log('Error adding segment:', response?.data?.message);
            }
        } catch (error) {
            // Handle any other errors that may occur during the API call
            console.log('Error adding segment:', error);
        } finally {
            setLoading(false)
            setButtonDisabled(false)
        }
    };

    return (
        <div className="main-content-model dark">
            <div className="page-content">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-12">
                            <div className="card model-card">
                                <div className="card-body">
                                    <div className="page-title-box d-flex align-items-center justify-content-between">
                                        <h4 className="mb-0">Add New Segment</h4>
                                        {loading && <div className="loader">Loading...</div>}
                                        <i
                                            className="fas fa-window-close"
                                            style={{ cursor: 'pointer', color: 'red' }}
                                            onClick={handleCloseModal}
                                        ></i>
                                    </div>
                                    <form onSubmit={handleAddSegment}>
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
                                                Add Segment
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

export default AddCustomizationSegment;
