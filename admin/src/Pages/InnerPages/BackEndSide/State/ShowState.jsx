import React, { useEffect, useState } from "react";
import { DataGrid, GridToolbar, GridPagination, GridToolbarExport } from "@mui/x-data-grid";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import DeleteIcon from "@mui/icons-material/Delete";
import ClearIcon from "@mui/icons-material/Clear";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { editState, showCity } from "../../../../Redux/Actions/BackendActions/StateActions";
import Modal from "react-modal";
import ImageModel from "../../../../Components/ImageComp/ImageModel";


let url = process.env.REACT_APP_API_URL

const ShowState = () => {

    const adminToken = localStorage.getItem('token');

    const [StateData, setStateData] = useState([]);
    const [StateName, setStateName] = useState("");
    const [selectedRows, setSelectedRows] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [isLoading, setIsLoading] = useState(true)

    // for big image
    const [selectedImage, setSelectedImage] = useState("");
    const [isModalOpenforImage, setIsModalOpenforImage] = useState(false);

    const Navigate = useNavigate()
    const dispatch = useDispatch()

    const localeText = {
        noRowsLabel: "No Data Found 😔",
    };

    const columns = [
        {
            field: "_id",
            width: 300,
            headerName: "Id",
            renderCell: (params) => (
                <div
                    onClick={() => handleCityView(params.row)}
                    style={{ cursor: "pointer" }}
                >
                    {params?.row?._id}
                </div>
            )
        },
        {
            field: "country",
            headerName: "Country",
            width: 225,
            filterable: true,
            sortable: true,
            filterType: "multiselect",
        },
        {
            field: "name",
            headerName: "Name",
            width: 225,
            filterable: true,
            sortable: true,
            filterType: "multiselect",
        },
        {
            field: "status",
            headerName: "Status",
            width: 220,
            renderCell: (params) => (
                <div className="form-check form-switch">
                    <input
                        type="checkbox"
                        className="form-check-input"
                        id={`customSwitch-${params.id}`}
                        onChange={() => handleStateStatus(params.row, !params.value)}
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
            field: "feature",
            headerName: "Feature",
            width: 220,
            renderCell: (params) => (
                <div className="form-check form-switch">
                    <input
                        type="checkbox"
                        className="form-check-input"
                        id={`customSwitch-${params.id}`}
                        onChange={() => handleStateFeatureStatus(params.row, !params.value)}
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
                        onClick={() => handleStateDelete(params.row._id)}
                    >
                        <i class="fas fa-trash-alt font-size-16 font-Icon-Del"></i>
                    </IconButton>
                    <IconButton
                        aria-label="edit"
                        onClick={() => handleStateUpdate(params.row)}
                    >
                        <i class="fas fa-pencil-alt font-size-16 font-Icon-Up"></i>
                    </IconButton>
                </Stack>
            ),
            filterable: false,
            sortable: false,
            hide: false,
        },
        // {
        //     field: "City",
        //     headerName: "City",
        //     width: 90,
        //     renderCell: (params) => (
        //         <Stack direction="row">
        //             <IconButton
        //                 aria-label="view"
        //                 onClick={() => handleCityView(params.row)}
        //             >
        //                 <i className="fas fa-eye font-Icon-view" />
        //             </IconButton>
        //         </Stack>
        //     ),
        //     filterable: false,
        //     sortable: false,
        //     hide: false,
        // },
    ];

    useEffect(() => {
        async function getState() {

            try {
                const res = await axios.get(`${url}/state/list/get`,
                    {
                        headers: {
                            Authorization: `${adminToken}`,
                        },
                    }
                );

                setStateData(res?.data?.state || []);
                setIsLoading(false)
            } catch (error) {
                setIsLoading(false)
            }
        }
        getState();
    }, []);

    const handleCityView = (city) => {
        dispatch(showCity(city))
        Navigate('/admin/showCity')
    };


    const handleStateDelete = (id) => {
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
                    .delete(`${url}/state/delete/${id}`,
                        {
                            headers: {
                                Authorization: `${adminToken}`,
                            },
                        })
                    .then(() => {
                        setStateData(StateData.filter((d) => d?._id !== id));
                        Swal.fire("Success!", "State has been deleted!", "success");
                    })
                    .catch((err) => {
                        console.log(err);
                        Swal.fire("Error!", "State has not been deleted!", "error");
                    });
            }
        });
    };


    const handleMultipleStateDelete = () => {
        let idsToDelete = selectedRows

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
                    .delete(`${url}/state/deletes`, {
                        data: { ids: idsToDelete },
                        headers: {
                            Authorization: `${adminToken}`,
                        }
                    })
                    .then(() => {
                        setStateData(StateData?.filter((d) => !idsToDelete?.includes(d?._id)));
                        Swal.fire("Success!", "State has been deleted!", "success");
                    })
                    .catch((err) => {
                        console.log(err);
                        Swal.fire("Error!", "State has not been deleted!", "error");
                    });
            }
        });
    };

    const handleStateUpdate = (State) => {
        dispatch(editState(State))
        Navigate('/admin/editState')
    };

    const handleStateStatus = async (State, newStatus) => {
        try {

            await axios.put(
                `${url}/State/update/status/${State?._id}`,
                {
                    status: newStatus,
                },
                {
                    headers: {
                        Authorization: `${adminToken}`,
                    },
                }
            );

            const updatedStateData = StateData.map((c) =>
                c._id === State._id ? { ...c, status: newStatus } : c
            );
            setStateData(updatedStateData);
        } catch (error) {
            console.log(error);
        }
    };

    const handleStateFeatureStatus = async (State, newStatus) => {
        try {

            await axios.put(
                `${url}/State/update/feature/${State?._id}`,
                {
                    feature: newStatus,
                },
                {
                    headers: {
                        Authorization: `${adminToken}`,
                    },
                }
            );

            const updatedStateData = StateData.map((c) =>
                c._id === State._id ? { ...c, feature: newStatus } : c
            );
            setStateData(updatedStateData);
        } catch (error) {
            console.log(error);
        }
    };

    const handleFilter = () => {
        const filteredStateList = StateData?.filter((State) => {
            const formattedStateName = (State?.name || "").toUpperCase().replace(/\s/g, "");
            let isStateName = true;
            if (StateName) {
                isStateName = formattedStateName.includes(StateName.toUpperCase().replace(/\s/g, ""));
            }

            return isStateName;
        });

        // Apply search query filtering
        const filteredData = filteredStateList.filter((State) => {
            const formattedSearchQuery = searchQuery.toUpperCase().replace(/\s/g, "");
            const rowValues = Object.values(State);
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
        if (event.target.type !== "checkbox") {
            event.stopPropagation();
        }
    };

    return (
        <>
            <div className="main-content">
                <div className="page-content">
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-2 table-heading">
                                State List
                            </div>
                            <div className="d-flex flex-wrap gap-2 mt-2">
                                <button
                                    onClick={() => Navigate("/admin/addState")}
                                    className="btn btn-primary waves-effect waves-light"
                                >
                                    Add State <i className="fas fa-arrow-right ms-2"></i>
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
                                                <div>{selectedRows.length} State selected</div>
                                                <DeleteIcon
                                                    style={{ color: "red" }}
                                                    className="cursor-pointer"
                                                    onClick={() => handleMultipleStateDelete()}
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
                isOpen={isModalOpenforImage}
            >

                <ImageModel
                    isOpen={isModalOpenforImage}
                    onClose={() => setIsModalOpenforImage(false)}
                    imageURL={selectedImage}
                />
            </Modal>
        </>
    );
};

export default ShowState;
