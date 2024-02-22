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

import { showCustomizationSegment, editCustomization } from '../../../../Redux/Actions/BackendActions/CustomizationAction'
import EditCustomization from "./EditCustomization";
import AddCustomizationByTable from "./AddCustomizationByTable";


let url = process.env.REACT_APP_API_URL


const ShowCustomization = () => {

    const adminToken = localStorage.getItem('token');
    const Navigate = useNavigate()
    const selectedCustomizationData = useSelector((state) => state?.CustomizationDataChange?.payload)
    const dispatch = useDispatch()

    const [customizationData, setcustomizationData] = useState([]);
    const [customizationName, setcustomizationName] = useState("");
    const [selectedRows, setSelectedRows] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [isLoading, setIsLoading] = useState(true)

    // edit customization
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCustomization, setSelectedCustomization] = useState()

    // add customization
    const [customizations, setCustomizations] = useState([]);
    const [customizationAddModel, setCustomizationAddModel] = useState(false)

    useEffect(() => {
        Modal.setAppElement(document.body);
    }, []);

    const handleOpenModal = (data, customizationId) => {
        setSelectedCustomization(data?.row)
        setIsModalOpen(true);
    };

    const handleOpenAddCustomizationModel = () => {
        setCustomizationAddModel(true)
    }

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleCloseAddCustomizationModel = async () => {
        setCustomizationAddModel(false)
        const res = await axios.get(`${url}/meal/customization/get/byMealId/${selectedCustomizationData?._id}`,
            {
                headers: {
                    Authorization: `${adminToken}`,
                },
            });
        let updateData = res?.data?.customizations
        setcustomizationData(updateData)
    }

    useEffect(() => {
        async function getCustomization() {
            try {
                const res = await axios.get(`${url}/meal/customization/get/byMealId/${selectedCustomizationData?._id}`,
                    {
                        headers: {
                            Authorization: `${adminToken}`,
                        },
                    });
                setcustomizationData(res?.data?.customizations)
                setIsLoading(false)
            } catch (error) {
                setIsLoading(false)
            }
        }
        getCustomization();
    }, []);

    const localeText = {
        noRowsLabel: "No Data Found 😔",
    };

    const columns = [
        {
            field: "_id",
            width: 210,
            headerName: "Id",
            renderCell: (params) => (
                <div
                    onClick={() => handleSegmentView(params.row)}
                    style={{ cursor: "pointer" }}
                >
                    {params?.row?._id}
                </div>
            )
        },
        {
            field: "name",
            headerName: "Name",
            width: 120,
            filterable: true,
            sortable: true,
            filterType: "multiselect",
        },
        {
            field: "type",
            headerName: "Type",
            width: 90,
            filterable: true,
            sortable: true,
            filterType: "multiselect",
        },
        {
            field: "isCustimizeMandatory",
            headerName: "Customization Required",
            width: 120,
            filterable: false,
            sortable: true,
            hide: false,
        },
        {
            field: "status",
            headerName: "Status",
            width: 120,
            renderCell: (params) => (
                <div className="form-check form-switch">
                    <input
                        type="checkbox"
                        className="form-check-input"
                        id={`customSwitch-${params.id}`}
                        onChange={() => handleCustomizationStatus(params.row, !params.value)}
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
            filterable: false,
            sortable: true,
            hide: false,
        },
        {
            field: "action",
            headerName: "Action",
            width: 90,
            renderCell: (params) => (
                <Stack direction="row">
                    <IconButton
                        aria-label="delete"
                        onClick={() => handlecustomizationDelete(params.row._id)}
                    >
                        <i class="fas fa-trash-alt font-size-16 font-Icon-Del"></i>
                    </IconButton>
                    <IconButton
                        aria-label="edit"
                        onClick={() => handleOpenModal(params)}
                    >
                        <i class="fas fa-pencil-alt font-size-16 font-Icon-Up"></i>
                    </IconButton>
                </Stack>
            ),
            filterable: false,
            sortable: false,
            hide: false,
        },
        {
            field: "Segments",
            headerName: "Segments",
            width: 90,
            renderCell: (params) => (
                <Stack direction="row">
                    <IconButton
                        aria-label="delete"
                        onClick={() => handleSegmentView(params.row)}
                    >
                        <i className="fas fa-eye font-Icon-view" />
                    </IconButton>
                </Stack>
            ),
            filterable: false,
            sortable: false,
            hide: false,
        },
    ];

    const handlecustomizationDelete = (id) => {
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
                    .delete(`${url}/meal/customization/delete/${id}`,
                        {
                            headers: {
                                Authorization: `${adminToken}`,
                            },
                        })
                    .then(() => {
                        setcustomizationData(customizationData?.filter((d) => d?._id !== id));
                        Swal.fire("Success!", "customization has been deleted!", "success");
                    })
                    .catch((err) => {
                        console.log(err);
                        Swal.fire("Error!", "customization has not been deleted!", "error");
                    });
            }
        });
    };


    const handleMultiplecustomizationDelete = () => {
        let idsToDelete = selectedRows
        console.log(idsToDelete, "selecyt")

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
                    .delete(`${url}/meal/customization/deletes`, {
                        data: { ids: idsToDelete },
                        headers: {
                            Authorization: `${adminToken}`,
                        },
                    })
                    .then(() => {
                        setcustomizationData(customizationData?.filter((d) => !idsToDelete?.includes(d?._id)));
                        Swal.fire("Success!", "customization has been deleted!", "success");
                    })
                    .catch((err) => {
                        console.log(err);
                        Swal.fire("Error!", "customization has not been deleted!", "error");
                    });
            }
        });
    };

    const handleCustomizationUpdate = async () => {
        const res = await axios.get(`${url}/meal/customization/get/byMealId/${selectedCustomizationData?._id}`,
            {
                headers: {
                    Authorization: `${adminToken}`,
                },
            });
        const updatedData = res?.data?.customizations || []
        setcustomizationData(updatedData)
    };

    const handleSegmentView = (segment) => {
        dispatch(showCustomizationSegment(segment))
        Navigate('/admin/showCustomizationSegment')
    };

    const handleCustomizationStatus = async (customization, newStatus) => {
        try {
            await axios.put(
                `${url}/meal/customization/update/status/${customization?._id}`,
                {
                    status: newStatus,
                },
                {
                    headers: {
                        Authorization: `${adminToken}`,
                    },
                }
            );

            const updatedCustomizationData = customizationData?.map((c) =>
                c._id === customization._id ? { ...c, status: newStatus } : c
            );
            setcustomizationData(updatedCustomizationData);
        } catch (error) {
            console.log(error);
        }
    };

    const handleFilter = () => {
        const filteredcustomizationList = customizationData?.filter((customization) => {
            const formattedcustomizationName = (customization?.name || "").toUpperCase().replace(/\s/g, "");
            let iscustomizationName = true;
            if (customizationName) {
                iscustomizationName = formattedcustomizationName.includes(customizationName.toUpperCase().replace(/\s/g, ""));
            }

            return iscustomizationName;
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
    const getRowId = (row) => row._id;

    const handleCellClick = (params, event) => {
        // Prevent row selection when clicking on the switch
        if (event.target.type !== "checkbox") {
            event.stopPropagation();
        }
    };

    // for add customization

    const mealId = selectedCustomizationData?._id

    return (
        <>
            <div className="main-content">
                <div className="page-content">
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-2 table-heading">
                                Customization List
                            </div>
                            <div className="d-flex flex-wrap gap-2 mt-2">
                                <button onClick={() => handleOpenAddCustomizationModel()} className="btn btn-primary waves-effect waves-light">
                                    Add Customization <i className="fas fa-arrow-right ms-2"></i>
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
                                                <div>{selectedRows.length} Custimization selected</div>
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
                <EditCustomization
                    handleCloseModal={handleCloseModal}
                    selectedCustomization={selectedCustomization}
                    handleCustomizationUpdate={handleCustomizationUpdate}
                />
            </Modal>
            <Modal
                className="main-content dark"
                isOpen={customizationAddModel}
                onRequestClose={handleCloseAddCustomizationModel}
            >
                <AddCustomizationByTable
                    handleCloseModal={handleCloseAddCustomizationModel}
                    customizations={customizations}
                    setCustomizations={setCustomizations}
                    mealId={mealId}
                />
            </Modal>

        </>
    );
};

export default ShowCustomization;
