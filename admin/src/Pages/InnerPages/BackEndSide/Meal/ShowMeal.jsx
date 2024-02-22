import React, { useEffect, useState } from "react";
import { DataGrid, GridToolbar, GridPagination, GridToolbarExport } from "@mui/x-data-grid";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import DeleteIcon from "@mui/icons-material/Delete";
import ClearIcon from "@mui/icons-material/Clear";
import axios from "axios";
import Swal from "sweetalert2";

import { useNavigate } from "react-router-dom";
import { editMeal } from "../../../../Redux/Actions/BackendActions/MealActions";
import { useDispatch } from "react-redux";
import { TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import ImageModel from "../../../../Components/ImageComp/ImageModel";
import Modal from "react-modal";
import { showCustomization } from "../../../../Redux/Actions/BackendActions/CustomizationAction";


let url = process.env.REACT_APP_API_URL

const ShowMeal = ({ role, id }) => {

    const adminToken = localStorage.getItem('token');
    const dispatch = useDispatch()

    const [mealData, setMealData] = useState([]);
    const [mealName, setMealName] = useState("");
    const [selectedRows, setSelectedRows] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [isLoading, setIsLoading] = useState(true)
    const [startDateFilter, setStartDateFilter] = useState('');
    const [endDateFilter, setEndDateFilter] = useState('');
    const [minAmountFilter, setMinAmountFilter] = useState('');
    const [maxAmountFilter, setMaxAmountFilter] = useState('');
    const [mealTypeFilter, setMealTypeFilter] = useState('')

    const localeText = {
        noRowsLabel: "No Data Found 😔",
    };

    const Navigate = useNavigate()

    // for big image
    const [selectedImage, setSelectedImage] = useState("");
    const [isModalOpenforImage, setIsModalOpenforImage] = useState(false);

    const handleImageClick = (imageURL) => {
        setSelectedImage(imageURL);
        setIsModalOpenforImage(true);
    };

    let columns = []

    if (role === "admin") {
        columns = [
            {
                field: "_id",
                width: 210,
                headerName: "Id",
                renderCell: (params) => (
                    <div
                        onClick={() => handleMealUpdate(params.row._id)}
                        style={{ cursor: "pointer" }}
                    >
                        {params?.row?._id}
                    </div>
                )
            },
            {
                field: "name",
                width: 120,
                headerName: "Name",
            },
            {
                field: "cover",
                headerName: "Image",
                width: 80,
                renderCell: (params) => (
                    <img
                        src={`${params?.row?.cover}`}
                        alt="Meal Image"
                        height={35}
                        width={35}
                        style={{ borderRadius: '50%', cursor: "pointer" }}
                        onClick={() => handleImageClick(params?.row?.cover)}
                    />
                ),
                sortable: false,
                filterable: false,
            },
            {
                field: "restaurant",
                headerName: "Restaurant",
                width: 130,
                filterable: true,
                sortable: true,
                filterType: "multiselect",
            },
            {
                field: "meals",
                headerName: "Meals",
                width: 130,
                filterable: true,
                sortable: true,
                filterType: "multiselect",
            },
            {
                field: "bites",
                headerName: "Bites",
                width: 130,
                filterable: true,
                sortable: true,
                filterType: "multiselect",
            },
            // {
            //     field: "Time",
            //     headerName: "Time",
            //     width: 120,
            //     filterable: true,
            //     sortable: true,
            //     filterType: "multiselect",
            // },
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
                            onChange={() => handleMealFeatureStatus(params.row, !params.value)}
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
                field: "status",
                headerName: "Status",
                width: 120,
                renderCell: (params) => (
                    <div className="form-check form-switch">
                        <input
                            type="checkbox"
                            className="form-check-input"
                            id={`customSwitch-${params.id}`}
                            onChange={() => handleMealStatus(params.row, !params.value)}
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
                field: "isCustimizeMandatory",
                headerName: "Customization Required",
                width: 120,
                filterable: false,
                sortable: true,
                hide: false,
            },
            {
                field: "action",
                headerName: "Action",
                width: 80,
                renderCell: (params) => (
                    <Stack direction="row">
                        <IconButton
                            aria-label="delete"
                            onClick={() => handleMealDelete(params.row._id)}
                        >
                            <i class="fas fa-trash-alt font-size-16 font-Icon-Del"></i>
                        </IconButton>
                        <IconButton
                            aria-label="update"
                            onClick={() => handleMealUpdate(params.row._id, params.row.Track_id)}
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
                field: "Customization",
                headerName: "Customization",
                width: 110,
                renderCell: (params) => (
                    <Stack direction="row">
                        <IconButton
                            aria-label="view"
                            onClick={() => handleCustomizationView(params.row)}
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
    } else {
        columns = [
            {
                field: "_id",
                width: 210,
                headerName: "Id",
                renderCell: (params) => (
                    <div
                        onClick={() => handleMealUpdate(params.row._id)}
                        style={{ cursor: "pointer" }}
                    >
                        {params?.row?._id}
                    </div>
                )
            },
            {
                field: "name",
                width: 120,
                headerName: "Name",
            },
            {
                field: "cover",
                headerName: "Image",
                width: 80,
                renderCell: (params) => (
                    <img
                        src={`${params?.row?.cover}`}
                        alt="Meal Image"
                        height={35}
                        width={35}
                        style={{ borderRadius: '50%', cursor: "pointer" }}
                        onClick={() => handleImageClick(params?.row?.cover)}
                    />
                ),
                sortable: false,
                filterable: false,
            },
            {
                field: "meals",
                headerName: "Meals",
                width: 130,
                filterable: true,
                sortable: true,
                filterType: "multiselect",
            },
            {
                field: "bites",
                headerName: "Bites",
                width: 130,
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
                            onChange={() => handleMealStatus(params.row, !params.value)}
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
                field: "isCustimizeMandatory",
                headerName: "Customization Required",
                width: 120,
                filterable: false,
                sortable: true,
                hide: false,
            },
            {
                field: "action",
                headerName: "Action",
                width: 80,
                renderCell: (params) => (
                    <Stack direction="row">
                        <IconButton
                            aria-label="delete"
                            onClick={() => handleMealDelete(params.row._id)}
                        >
                            <i class="fas fa-trash-alt font-size-16 font-Icon-Del"></i>
                        </IconButton>
                        <IconButton
                            aria-label="update"
                            onClick={() => handleMealUpdate(params.row._id, params.row.Track_id)}
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
                field: "Customization",
                headerName: "Customization",
                width: 110,
                renderCell: (params) => (
                    <Stack direction="row">
                        <IconButton
                            aria-label="view"
                            onClick={() => handleCustomizationView(params.row)}
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
    }


    useEffect(() => {
        async function getMeal() {
            try {
                if (role === "restaurant") {
                    const res = await axios.get(`${url}/meal/list/get/forRestaurant/${id}`,
                        {
                            headers: {
                                Authorization: `${adminToken}`,
                            },
                        }
                    );
                    setMealData(res?.data?.meal || []);
                }
                else {
                    const res = await axios.get(`${url}/meal/list/get/forAdmin`,
                        {
                            headers: {
                                Authorization: `${adminToken}`,
                            },
                        }
                    );
                    setMealData(res?.data?.meal || []);
                }
                setIsLoading(false)
            } catch (error) {
                setIsLoading(false)
            }
        }
        getMeal();
    }, [startDateFilter, endDateFilter]);

    const handleMealUpdate = (id) => {
        dispatch(editMeal(id))
        Navigate('/admin/editMeal')
    }

    const handleMealDelete = (id) => {
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
                    .delete(`${url}/meal/single/delete/${id}`,
                        {
                            headers: {
                                Authorization: `${adminToken}`,
                            },
                        })
                    .then(() => {
                        setMealData(mealData.filter((d) => d?._id !== id) || []);
                        Swal.fire("Success!", "Meal-Meal has been deleted!", "success");
                    })
                    .catch((err) => {
                        console.log(err);
                        Swal.fire("Error!", "Meal-Meal has not been deleted!", "error");
                    });
            }
        });
    };


    const handleMultipleMealDelete = () => {
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
                    .delete(`${url}/meal/multiple/deletes`, {
                        data: { ids: idsToDelete },
                        headers: {
                            Authorization: `${adminToken}`,
                        },
                    })
                    .then(() => {
                        setMealData(mealData?.filter((d) => !idsToDelete?.includes(d?._id)) || []);
                        Swal.fire("Success!", "Meal-Meal has been deleted!", "success");
                    })
                    .catch((err) => {
                        console.log(err);
                        Swal.fire("Error!", "Meal-Meal has not been deleted!", "error");
                    });
            }
        });
    };

    const handleMealFeatureStatus = async (meals, newStatus) => {
        try {

            await axios.put(
                `${url}/meal/update/feature/${meals?._id}`,
                {
                    feature: newStatus,
                },
                {
                    headers: {
                        Authorization: `${adminToken}`,
                    },
                }
            );

            const updatedMealData = mealData.map((c) =>
                c._id === meals._id ? { ...c, feature: newStatus } : c
            );
            setMealData(updatedMealData);
        } catch (error) {
            console.log(error);
        }
    };

    const handleMealStatus = async (meals, newStatus) => {
        try {

            await axios.put(
                `${url}/meal/update/status/${meals?._id}`,
                {
                    status: newStatus,
                },
                {
                    headers: {
                        Authorization: `${adminToken}`,
                    },
                }
            );

            const updatedMealData = mealData.map((c) =>
                c._id === meals._id ? { ...c, status: newStatus } : c
            );
            setMealData(updatedMealData);
        } catch (error) {
            console.log(error);
        }
    };

    const handleFilter = () => {

        const filteredMealList = mealData?.filter((meal) => {
            const formattedMealName = (meal?.name || "").toUpperCase().replace(/\s/g, "");
            let isMealName = true;
            if (mealName) {
                isMealName = formattedMealName.includes(mealName.toUpperCase().replace(/\s/g, ""));
            }
            return isMealName;
        });

        // Apply date filtering
        let filteredByDate = filteredMealList;
        if (startDateFilter || endDateFilter) {
            filteredByDate = filteredMealList?.filter((meal) => {
                let mealDate = meal?.Date;
                const [day, month, year] = mealDate?.split('/');
                const newDate = new Date(year, month - 1, day);
                newDate.setHours(0, 0, 0, 0);

                let isDateInRange = true;
                if (startDateFilter && endDateFilter) {
                    const startDate = new Date(startDateFilter);
                    startDate.setHours(0, 0, 0, 0);

                    const endDate = new Date(endDateFilter);
                    endDate.setHours(0, 0, 0, 0);

                    isDateInRange = newDate >= startDate && newDate <= endDate;
                } else if (startDateFilter) {
                    const startDate = new Date(startDateFilter);
                    startDate.setHours(0, 0, 0, 0);
                    isDateInRange = newDate >= startDate;
                } else if (endDateFilter) {
                    const endDate = new Date(endDateFilter);
                    endDate.setHours(0, 0, 0, 0);
                    isDateInRange = newDate <= endDate;
                }
                return isDateInRange;
            });
        }

        // Apply meal type filtering
        let filteredByMealType = filteredByDate;
        if (mealTypeFilter) {
            filteredByMealType = filteredByDate?.filter((meal) =>
                meal?.MealType?.toUpperCase() === mealTypeFilter.toUpperCase()
            );
        }

        // Apply meal amount filtering
        // let filteredByAmount = filteredByDate;
        // if (minAmountFilter || maxAmountFilter) {
        //     filteredByAmount = filteredByDate?.filter((meal) => {
        //         const mealAmount = parseFloat(meal?.FinalPrice);
        //         let isAmountInRange = true;
        //         if (minAmountFilter && maxAmountFilter) {
        //             const minAmount = parseFloat(minAmountFilter);
        //             const maxAmount = parseFloat(maxAmountFilter);
        //             isAmountInRange = mealAmount >= minAmount && mealAmount <= maxAmount;
        //         } else if (minAmountFilter) {
        //             const minAmount = parseFloat(minAmountFilter);
        //             isAmountInRange = mealAmount >= minAmount;
        //         } else if (maxAmountFilter) {
        //             const maxAmount = parseFloat(maxAmountFilter);
        //             isAmountInRange = mealAmount <= maxAmount;
        //         }
        //         return isAmountInRange;
        //     });
        // }



        // Apply search query filtering
        const filteredData = filteredByMealType?.filter((meal) => {
            const formattedSearchQuery = searchQuery.toUpperCase().replace(/\s/g, "");
            const rowValues = Object.values(meal);
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

    const handleCustomizationView = (product) => {
        dispatch(showCustomization(product))
        Navigate('/admin/showCustomization')
    };




    const getRowId = (row) => row._id;

    const handleCellClick = (params, event) => {
        if (event.target.type !== "checkbox") {
            event.stopPropagation();
        }
    };

    const handleClearFilters = () => {
        setStartDateFilter('');
        setEndDateFilter('');
        setMinAmountFilter('');
        setMaxAmountFilter('');
        setMealTypeFilter('')
    };

    const handleNavigate = () => {
        if (role === "restaurant") {
            Navigate("/admin/addMeal")
        }
    }

    return (
        <>
            <div className="main-content">
                <div className="page-content">
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-2 table-heading">
                                Meal List
                            </div>
                            <div className="d-flex flex-wrap gap-2 mt-2">
                                <button onClick={() => Navigate(`/admin/${role === 'restaurant' ? 'addRestaurantMeal' : 'addMeal'}`)} className="btn btn-primary waves-effect waves-light">
                                    Add Meal <i className="fas fa-arrow-right ms-2"></i>
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

                                {/* <TextField
                                    label='Start Date'
                                    type='date'
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    style={{ margin: '5px', width: "135px" }}
                                    value={startDateFilter}
                                    onChange={(e) => setStartDateFilter(e.target.value)}
                                />
                                <TextField
                                    label='End Date'
                                    type='date'
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    style={{ margin: '5px', width: "135px" }}
                                    value={endDateFilter}
                                    onChange={(e) => setEndDateFilter(e.target.value)}
                                />
                                <FormControl style={{ margin: '2px', width: "135px" }} variant="outlined" className="dropdown">
                                    <InputLabel>Meal Type</InputLabel>
                                    <Select
                                        value={mealTypeFilter}
                                        onChange={(e) => setMealTypeFilter(e.target.value)}
                                        label="Meal Type"
                                    >
                                        <MenuItem value="">All</MenuItem>
                                        <MenuItem value="Pending">Pending</MenuItem>
                                        <MenuItem value="Accepted">Accepted</MenuItem>
                                        <MenuItem value="Rejected">Rejected</MenuItem>
                                        <MenuItem value="Processing">Processing</MenuItem>
                                        <MenuItem value="Ready to Ship">Ready to Ship</MenuItem>
                                        <MenuItem value="Shipped">Shipped</MenuItem>
                                        <MenuItem value="Completed">Completed</MenuItem>
                                        <MenuItem value="Cancelled">Cancelled</MenuItem>
                                        <MenuItem value="Returned">Returned</MenuItem>
                                    </Select>
                                </FormControl>

                                <a className="btn btn-danger waves-effect waves-light" style={{ margin: '12px' }} onClick={() => handleClearFilters()}>
                                    Clear Filters
                                </a> */}

                                {/* <div className="card"> */}
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
                                        loading={isLoading}
                                        localeText={localeText}
                                        onCellClick={handleCellClick}
                                        onRowSelectionModelChange={(e) => setSelectedRows(e)}
                                        initialState={{
                                            pagination: { paginationModel: { pageSize: 10 } },
                                        }}
                                        pageSizeOptions={[10, 25, 50, 100]}
                                    />
                                    {selectedRows.length > 0 && (
                                        <div className="row-data">
                                            <div>{selectedRows.length} Meals selected</div>
                                            <DeleteIcon
                                                style={{ color: "red" }}
                                                className="cursor-pointer"
                                                onClick={() => handleMultipleMealDelete()}
                                            />
                                        </div>
                                    )}
                                </div>
                                {/* </div> */}
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

export default ShowMeal;
