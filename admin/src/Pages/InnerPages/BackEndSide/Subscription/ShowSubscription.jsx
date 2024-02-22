import React, { useEffect, useState } from "react";
import {
    DataGrid,
    GridToolbar,
} from "@mui/x-data-grid";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import DeleteIcon from "@mui/icons-material/Delete";
import ClearIcon from "@mui/icons-material/Clear";
import EditIcon from "@mui/icons-material/Edit";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { editSubscription } from "../../../../Redux/Actions/BackendActions/SubscriptionActions";



let url = process.env.REACT_APP_API_URL

const ShowSubscription = () => {
    const [subscriptionData, setSubscriptionData] = useState([]);
    const [subscriptionName, setSubscriptionName] = useState("");
    const [selectedRows, setSelectedRows] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [isLoading, setIsLoading] = useState(true)


    const Navigate = useNavigate();
    const dispatch = useDispatch();

    const localeText = {
        noRowsLabel: "No Data Found 😔",
    };

    const columns = [
        {
            field: "_id",
            width: 240,
            headerName: "Id",
        },
        {
            field: "title",
            headerName: "Title",
            width: 150,
            filterable: true,
            sortable: true,
            filterType: "multiselect",
        },
        {
            field: "name",
            headerName: "Name",
            width: 150,
            filterable: true,
            sortable: true,
            filterType: "multiselect",
        },
        {
            field: "meals",
            headerName: "Meals",
            width: 100,
            filterable: true,
            sortable: true,
            filterType: "multiselect",
        },
        {
            field: "bites",
            headerName: "Bites",
            width: 100,
            filterable: true,
            sortable: true,
            filterType: "multiselect",
        },
        {
            field: "discountPrice",
            headerName: "Discount Price",
            width: 100,
            filterable: true,
            sortable: true,
            filterType: "multiselect",
        },
        {
            field: "originalPrice",
            headerName: "Original Price",
            width: 100,
            filterable: true,
            sortable: true,
            filterType: "multiselect",
        },
        {
            field: "validity",
            headerName: "Validity",
            width: 100,
            filterable: true,
            sortable: true,
            filterType: "multiselect",
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
                        onChange={() => handleSubscriptionStatus(params.row, !params.value)}
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
            width: 120,
            renderCell: (params) => (
                <div className="form-check form-switch">
                    <input
                        type="checkbox"
                        className="form-check-input"
                        id={`customSwitch-${params.id}`}
                        onChange={() => handleSubscriptionFeature(params.row, !params.value)}
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
            width: 100,
            renderCell: (params) => (
                <Stack direction="row">
                    <IconButton
                        aria-label="delete"
                        onClick={() => handleSubscriptionDelete(params.row._id)}
                    >
                        <i class="fas fa-trash-alt font-size-16 font-Icon-Del"></i>
                    </IconButton>
                    <IconButton
                        aria-label="edit"
                        onClick={() => handleSubscriptionUpdate(params.row)}
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

    useEffect(() => {
        async function getSubscription() {
            try {
                const adminToken = localStorage.getItem('token');
                const res = await axios.get(`${url}/subscription/get`,
                    {
                        headers: {
                            Authorization: `${adminToken}`,
                        },
                    }
                )
                setSubscriptionData(res?.data?.subscription || [])
                setIsLoading(false)
            } catch (error) {
                setIsLoading(false)
            }
        }
        getSubscription()
    }, [])

    const handleSubscriptionDelete = (id) => {
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
                const adminToken = localStorage.getItem('token');
                axios
                    .delete(`${url}/subscription/delete/${id}`,
                        {
                            headers: {
                                Authorization: `${adminToken}`,
                            },
                        })
                    .then(() => {
                        setSubscriptionData(subscriptionData.filter((d) => d?._id !== id));
                        Swal.fire("Success!", "Subscription has been deleted!", "success");
                    })
                    .catch((err) => {
                        console.log(err);
                        Swal.fire("Error!", "Subscription has not been deleted!", "error");
                    });
            }
        });
    };

    const handleMultipleSubscriptionDelete = () => {
        let idsToDelete = selectedRows;

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
                const adminToken = localStorage.getItem('token');
                axios
                    .delete(`${url}/subscription/deletes`, {
                        data: { ids: idsToDelete },
                        headers: {
                            Authorization: `${adminToken}`,
                        },

                    })
                    .then(() => {
                        setSubscriptionData(
                            subscriptionData?.filter((d) => !idsToDelete?.includes(d?._id))
                        );
                        Swal.fire("Success!", "Subscription has been deleted!", "success");
                    })
                    .catch((err) => {
                        console.log(err);
                        Swal.fire("Error!", "Subscription has not been deleted!", "error");
                    });
            }
        });
    };

    const handleSubscriptionUpdate = (subscription) => {
        dispatch(editSubscription(subscription))
        Navigate("/admin/editSubscription");
    };

    const handleSubscriptionStatus = async (subscription, newStatus) => {
        try {
            const adminToken = localStorage.getItem('token');
            await axios.put(
                `${url}/subscription/update/status/${subscription?._id}`,
                {
                    status: newStatus,
                },
                {
                    headers: {
                        Authorization: `${adminToken}`,
                    },
                }
            );

            const updatedSubscriptionData = subscriptionData.map((c) =>
                c._id === subscription._id ? { ...c, status: newStatus } : c
            );
            setSubscriptionData(updatedSubscriptionData || []);
        } catch (error) {
            console.log(error);
        }
    };

    const handleSubscriptionFeature = async (subscription, newStatus) => {
        try {
            const adminToken = localStorage.getItem('token');
            await axios.put(
                `${url}/subscription/update/feature/${subscription?._id}`,
                {
                    feature: newStatus,
                },
                {
                    headers: {
                        Authorization: `${adminToken}`,
                    },
                }
            );

            const updatedSubscriptionData = subscriptionData.map((c) =>
                c._id === subscription._id ? { ...c, feature: newStatus } : c
            );
            setSubscriptionData(updatedSubscriptionData || []);
        } catch (error) {
            console.log(error);
        }
    };

    const handleFilter = () => {
        const filteredSubscriptionList = subscriptionData?.filter((subscription) => {
            const formattedSubscriptionName = (subscription?.name || "")
                .toUpperCase()
                .replace(/\s/g, "");
            let isSubscriptionName = true;
            if (subscriptionName) {
                isSubscriptionName = formattedSubscriptionName.includes(
                    subscriptionName.toUpperCase().replace(/\s/g, "")
                );
            }

            return isSubscriptionName;
        });

        // Apply search query filtering
        const filteredData = filteredSubscriptionList.filter((subscription) => {
            const formattedSearchQuery = searchQuery.toUpperCase().replace(/\s/g, "");
            const rowValues = Object.values(subscription);
            for (let i = 0; i < rowValues.length; i++) {
                const formattedRowValue = String(rowValues[i])
                    .toUpperCase()
                    .replace(/\s/g, "");
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
                                Subscription List
                            </div>
                            <div className="d-flex flex-wrap gap-2 mt-2">
                                <button
                                    onClick={() => Navigate("/admin/addSubscription")}
                                    className="btn btn-primary waves-effect waves-light"
                                >
                                    Add Subscription <i className="fas fa-arrow-right ms-2"></i>
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
                                                <div>{selectedRows.length} Subscriptions selected</div>
                                                <DeleteIcon
                                                    style={{ color: "red" }}
                                                    className="cursor-pointer"
                                                    onClick={() => handleMultipleSubscriptionDelete()}
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
        </>
    );
};

export default ShowSubscription;
