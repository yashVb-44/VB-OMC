import React, { useEffect, useState } from "react";
import { DataGrid, GridToolbar, GridPagination, GridToolbarExport } from "@mui/x-data-grid";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import DeleteIcon from "@mui/icons-material/Delete";
import ClearIcon from "@mui/icons-material/Clear";
import EditIcon from "@mui/icons-material/Edit";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Modal from "react-modal";
import EditCustomizationSegment from "./EditCustomizationSegment";
import AddCustomizationSegment from "./AddCustomizationSegment";


let url = process.env.REACT_APP_API_URL
let getRowId = (row) => row._id

const ShowCustomizationSegment = () => {

    const adminToken = localStorage.getItem('token');
    const Navigate = useNavigate()
    const dispatch = useDispatch()
    const selectedCustomizationData = useSelector((state) => state?.CustomizationSegmentDataChange?.payload)
    let customizationId = selectedCustomizationData?._id

    const [segmentData, setsegmentData] = useState([]);
    const [segmentName, setsegmentName] = useState("");
    const [selectedRows, setSelectedRows] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [isLoading, setIsLoading] = useState(true)

    // for selected segment data
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAddSegmentModalOpen, setIsAddSegmentModalOpen] = useState(false)
    const [selectedSegmentData, setSelectedSegmentData] = useState()

    useEffect(() => {
        Modal.setAppElement(document.body);
    }, []);

    const handleOpenModal = (data, customizationId) => {
        setSelectedSegmentData(data?.row)
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    useEffect(() => {
        async function getCustomization() {
            try {
                const res = await axios.get(`${url}/meal/customization/get/segments/byCustomizationId/${selectedCustomizationData?._id}`,
                    {
                        headers: {
                            Authorization: `${adminToken}`,
                        },
                    });
                setsegmentData(res?.data?.customizationSegment || [])
                setIsLoading(false)
            } catch (error) {
                setIsLoading(false)
            }
        }
        getCustomization();
    }, []);

    console.log(segmentData, "data")

    const localeText = {
        noRowsLabel: "No Data Found 😔",
    };

    const columns = [
        {
            field: "_id",
            width: 220,
            headerName: "Id",
            renderCell: (params) => (
                <div
                    onClick={() => handleOpenModal(params, customizationId)}
                    style={{ cursor: "pointer" }}
                >
                    {params?.row?._id}
                </div>
            )
        },
        {
            field: "name",
            headerName: "Name",
            width: 160,
            filterable: true,
            sortable: true,
            filterType: "multiselect",
        },
        {
            field: "bites",
            headerName: "Bites",
            width: 160,
            filterable: true,
            sortable: true,
            filterType: "multiselect",
        },
        {
            field: "status",
            headerName: "Status",
            width: 160,
            renderCell: (params) => (
                <div className="form-check form-switch">
                    <input
                        type="checkbox"
                        className="form-check-input"
                        id={`customSwitch-${params.id}`}
                        onChange={() => handleCustomizationSegmentStatus(params.row, !params.value)}
                        checked={params.value}
                        onClick={(event) => event.stopPropagation()}
                    />
                    <label
                        className="form-check-label"
                        htmlFor={`customSwitch-${params.id}`}
                        style={{ color: params.value ? "green" : "grey" }}
                    >
                        {params.value ? "Enable" : "Disable"}
                    </label>
                </div>
            ),
            filterable: true,
            sortable: true,
            filterType: "dropdown",
            hide: false,
        },
        {
            field: "action",
            headerName: "Action",
            width: 160,
            renderCell: (params) => (
                <Stack direction="row">
                    <IconButton
                        aria-label="delete"
                        onClick={() => handleSegmentDelete(params.row._id)}
                    >
                        <i class="fas fa-trash-alt font-size-16 font-Icon-Del"></i>
                    </IconButton>
                    <IconButton
                        aria-label="edit"
                        onClick={() => handleOpenModal(params, customizationId)}
                    >
                        <i class="fas fa-pencil-alt font-size-16 font-Icon-Up"></i>
                    </IconButton>
                </Stack>
            ),
            filterable: false,
            sortable: false,
            hide: false,
        },
    ];

    const handleSegmentDelete = (segmentId) => {
        Swal.fire({
            title: "Are you sure?",
            text: "Once deleted, you will not be able to recover this segment!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
        }).then((result) => {
            if (result.isConfirmed) {
                axios
                    .delete(`${url}/meal/customization/delete/segment/${selectedCustomizationData?._id}/${segmentId}`,
                        {
                            headers: {
                                Authorization: `${adminToken}`,
                            },
                        })
                    .then(() => {
                        // Fetch the updated customization data after deletion
                        axios
                            .get(`${url}/meal/customization/get/${selectedCustomizationData?._id}`,
                                {
                                    headers: {
                                        Authorization: `${adminToken}`,
                                    },
                                })
                            .then((response) => {
                                const updatedCustomizationData = response?.data?.customization?.segment;
                                setsegmentData(updatedCustomizationData || []);
                                Swal.fire("Success!", "Segment has been deleted!", "success");
                            })
                            .catch((err) => {
                                console.log(err);
                                Swal.fire("Error!", "Segment has not been deleted!", "error");
                            });
                    })
                    .catch((err) => {
                        console.log(err);
                        Swal.fire("Error!", "Segment has not been deleted!", "error");
                    });
            }
        });
    };

    const handleMultiplecustomizationDelete = () => {
        let idsToDelete = selectedRows.map((row) => row);

        Swal.fire({
            title: "Are you sure?",
            text: "Once deleted, you will not be able to recover this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
        }).then((result) => {
            if (result.isConfirmed) {
                axios
                    .delete(`${url}/meal/customization/deletes/segments/${selectedCustomizationData?._id}`, {
                        data: {
                            segmentIds: idsToDelete,
                        },
                        headers: {
                            Authorization: `${adminToken}`,
                        },
                    })
                    .then(() => {
                        // Fetch the updated customization data after deletion
                        axios
                            .get(`${url}/meal/customization/get/${selectedCustomizationData?._id}`,
                                {
                                    headers: {
                                        Authorization: `${adminToken}`,
                                    },
                                })
                            .then((response) => {
                                const updatedCustomizationData = response?.data?.customization?.segment;
                                setsegmentData(updatedCustomizationData || []);
                                Swal.fire("Success!", "Segments have been deleted!", "success");
                            })
                            .catch((err) => {
                                console.log(err);
                                Swal.fire("Error!", "Segments have not been deleted!", "error");
                            });
                    })
                    .catch((err) => {
                        console.log(err);
                        Swal.fire("Error!", "Segments have not been deleted!", "error");
                    });
            }
        });
    };


    const handleSegmentUpdate = (segmentId, updatedSegmentData) => {
        // Find the index of the updated segment in the segmentData array
        const segmentIndex = segmentData.findIndex((segment) => segment._id === segmentId);
        if (segmentIndex !== -1) {
            // Create a copy of segmentData to update the specific segment
            const updatedSegmentDataList = [...segmentData];
            updatedSegmentDataList[segmentIndex] = { ...updatedSegmentDataList[segmentIndex], ...updatedSegmentData };
            setsegmentData(updatedSegmentDataList || []);
        }
    };

    const handleCustomizationSegmentStatus = async (segment, newStatus) => {
        try {
            await axios.put(
                `${url}/meal/customization/update/segment/status/${selectedCustomizationData?._id}/${segment?._id}`,
                {
                    status: newStatus,
                },
                {
                    headers: {
                        Authorization: `${adminToken}`,
                    },
                }
            );

            const updatedCustomizationSegmentData = segmentData?.map((c) =>
                c._id === segment._id ? { ...c, status: newStatus } : c
            );
            setsegmentData(updatedCustomizationSegmentData || []);
        } catch (error) {
            console.log(error);
        }
    };

    const handleFilter = () => {
        const filteredcustomizationList = segmentData?.filter((customization) => {
            const formattedsegmentName = (customization?.name || "").toUpperCase().replace(/\s/g, "");
            let issegmentName = true;
            if (segmentName) {
                issegmentName = formattedsegmentName.includes(segmentName.toUpperCase().replace(/\s/g, ""));
            }

            return issegmentName;
        });

        // Apply search query filtering
        const filteredData = filteredcustomizationList?.filter((customization) => {
            const formattedSearchQuery = searchQuery.toUpperCase().replace(/\s/g, "");
            const rowValues = Object.values(customization);
            for (let i = 0; i < rowValues.length; i++) {
                const formattedRowValue = String(rowValues[i]).toUpperCase().replace(/\s/g, "");
                if (formattedRowValue.includes(formattedSearchQuery)) {
                    return true;
                }
            }
            return false;
        });

        return filteredData;
    };

    const handleCellClick = (params, event) => {
        // Prevent row selection when clicking on the switch
        if (event.target.type !== "checkbox") {
            event.stopPropagation();
        }
    };

    const handleOpenAddSegmentModal = () => {
        setIsAddSegmentModalOpen(true);
    };

    const handleCloseAddSegmentModal = () => {
        setIsAddSegmentModalOpen(false);
        async function getCustomization() {
            try {
                const res = await axios.get(`${url}/meal/customization/get/segments/byCustomizationId/${selectedCustomizationData?._id}`,
                    {
                        headers: {
                            Authorization: `${adminToken}`,
                        },
                    });
                setsegmentData(res?.data?.customizationSegment || [])
                setIsLoading(false)
            } catch (error) {
                setIsLoading(false)
            }
        }
        getCustomization();
    };


    return (
        <>
            <div className="main-content">
                <div className="page-content">
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-2 table-heading">
                                Customization Segments List
                            </div>
                            <div className="d-flex flex-wrap gap-2 mt-2">
                                <button onClick={handleOpenAddSegmentModal} className="btn btn-primary waves-effect waves-light">
                                    Add Segment <i className="fas fa-arrow-right ms-2"></i>
                                </button>
                            </div>
                            <div className="searchContainer mb-3">
                                <div className="searchBarcontainer">
                                    <input
                                        type="text"
                                        placeholder="Search"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="searchBar"

                                    />
                                    <ClearIcon className="cancelSearch" onClick={() => setSearchQuery("")} />
                                </div>
                            </div>
                            <div className="col-12">
                                <div className="">
                                    <div className="datagrid-container">
                                        <DataGrid
                                            style={{ textTransform: "capitalize" }}
                                            rows={handleFilter()}
                                            columns={columns}
                                            checkboxSelection
                                            disableSelectionOnClick
                                            getRowId={getRowId}
                                            filterPanelDefaultOpen
                                            filterPanelPosition="top"
                                            slots={{
                                                toolbar: (props) => (
                                                    <div>
                                                        <GridToolbar />
                                                    </div>
                                                ),
                                            }}
                                            localeText={localeText}
                                            loading={isLoading}
                                            onCellClick={handleCellClick}
                                            onRowSelectionModelChange={(e) => setSelectedRows(e)}
                                            initialState={{
                                                pagination: { paginationModel: { pageSize: 10 } },
                                            }}
                                            pageSizeOptions={[10, 25, 50, 100]}
                                        />
                                        {selectedRows.length > 0 && (
                                            <div className="row-data">
                                                <div>{selectedRows.length} Customizations Segment selected</div>
                                                <DeleteIcon
                                                    style={{ color: "red" }}
                                                    className="cursor-pointer"
                                                    onClick={() => handleMultiplecustomizationDelete()}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Modal
                className="main-content dark"
                isOpen={isModalOpen}
                onRequestClose={handleCloseModal}
            >
                <EditCustomizationSegment
                    handleCloseModal={handleCloseModal}
                    selectedSegmentData={selectedSegmentData}
                    customizationId={customizationId}
                    handleSegmentUpdate={handleSegmentUpdate}
                />
            </Modal>
            <Modal
                className="main-content dark"
                isOpen={isAddSegmentModalOpen}
                onRequestClose={handleCloseAddSegmentModal}
            >
                <AddCustomizationSegment
                    handleCloseModal={handleCloseAddSegmentModal}
                    customizationId={customizationId}
                />
            </Modal>
        </>
    );
};

export default ShowCustomizationSegment;
