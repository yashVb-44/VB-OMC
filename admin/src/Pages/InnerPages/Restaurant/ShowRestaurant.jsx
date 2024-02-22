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
import { editRestaurant } from "../../../Redux/Actions/AdminActions/RestaurantActions";
import { showMapPolygoneZone } from "../../../Redux/Actions/BackendActions/ShowMapPolygoneZoneActions";

import Modal from "react-modal";
import ImageModel from "../../../Components/ImageComp/ImageModel";



let url = process.env.REACT_APP_API_URL

const ShowRestaurant = () => {
    const [restaurantData, setRestaurantData] = useState([]);
    const [restaurantName, setRestaurantName] = useState("");
    const [selectedRows, setSelectedRows] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [isLoading, setIsLoading] = useState(true)

    // for big image
    const [selectedImage, setSelectedImage] = useState("");
    const [isModalOpenforImage, setIsModalOpenforImage] = useState(false);

    const handleImageClick = (imageURL) => {
        setSelectedImage(imageURL);
        setIsModalOpenforImage(true);
    };

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
            renderCell: (params) => (
                <div
                    onClick={() => handleRestaurantUpdate(params.row)}
                    style={{ cursor: "pointer" }}
                >
                    {params?.row?._id}
                </div>
            )
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
            field: "image",
            headerName: "Image",
            width: 100,
            renderCell: (params) => (
                <img
                    src={params?.row?.image}
                    alt="Restaurant Image"
                    height={35}
                    width={35}
                    style={{ borderRadius: '50%', cursor: "pointer" }}
                    onClick={() => handleImageClick(params?.row?.image)}
                />
            ),
            sortable: false,
            filterable: false,
        },
        {
            field: "mobileNo",
            headerName: "Mobile No",
            width: 150,
            filterable: true,
            sortable: true,
            filterType: "multiselect",
        },
        {
            field: "email",
            headerName: "Email",
            width: 180,
            filterable: true,
            sortable: true,
            filterType: "multiselect",
        },
        {
            field: "country",
            headerName: "Country",
            width: 120,
            filterable: true,
            sortable: true,
            filterType: "multiselect",
        },
        {
            field: "state",
            headerName: "State",
            width: 120,
            filterable: true,
            sortable: true,
            filterType: "multiselect",
        },
        {
            field: "city",
            headerName: "City",
            width: 120,
            filterable: true,
            sortable: true,
            filterType: "multiselect",
        },
        {
            field: "Date",
            headerName: "Date",
            width: 120,
            filterable: true,
            sortable: true,
            filterType: "multiselect",
        },
        {
            field: "status",
            headerName: "Status",
            width: 120,
            filterable: true,
            sortable: true,
            filterType: "multiselect",
            renderCell: (params) => (
                <div className="statusContainer"
                    style={
                        { color: params?.row?.status === "Pending" ? "gray" : params?.row?.status === "OnBord" ? "green" : "red" }
                    }>
                    {params?.row?.status}
                </div>
            ),
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
                        onChange={() => handleRestaurantFeature(params.row, !params.value)}
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
        // {
        //     field: "block",
        //     headerName: "Block",
        //     width: 90,
        //     renderCell: (params) => (
        //         <div className="form-check form-switch-user">
        //             <input
        //                 type="checkbox"
        //                 className="form-check-input"
        //                 id={`customSwitch-${params.id}`}
        //                 onChange={() => handleRestaurantAuth(params.row, !params.value)}
        //                 checked={params.value}
        //                 onClick={(event) => event.stopPropagation()}
        //             />
        //             <label
        //                 className="form-check-label"
        //                 htmlFor={`customSwitch-${params.id}`}
        //                 style={{ color: params.value ? "red" : "grey" }}
        //             >
        //                 {params.value ? "Block" : "UnBlock"}
        //             </label>
        //         </div>
        //     ),
        //     filterable: false,
        //     sortable: true,
        //     hide: false,
        // },
        {
            field: "action",
            headerName: "Action",
            width: 100,
            renderCell: (params) => (
                <Stack direction="row">
                    <IconButton
                        aria-label="delete"
                        onClick={() => handleRestaurantDelete(params.row._id)}
                    >
                        <i className="fas fa-trash-alt font-size-16 font-Icon-Del"></i>
                    </IconButton>
                    <IconButton
                        aria-label="edit"
                        onClick={() => handleRestaurantUpdate(params.row)}
                    >
                        <i className="fas fa-pencil-alt font-size-16 font-Icon-Up"></i>
                    </IconButton>
                </Stack>
            ),
            filterable: false,
            sortable: false,
            hide: false,
        },
        {
            field: "DeliveryZone",
            headerName: "Delivery Zone",
            width: 110,
            renderCell: (params) => (
                <Stack direction="row">
                    <IconButton
                        aria-label="view"
                        onClick={() => handleDeliveryZoneView(params.row)}
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

    useEffect(() => {
        async function getRestaurant() {
            try {
                const adminToken = localStorage.getItem('token');
                const res = await axios.get(`${url}/restaurant/list/get`,
                    {
                        headers: {
                            Authorization: `${adminToken}`,
                        },
                    }
                )
                setRestaurantData(res?.data?.restaurant || [])
                setIsLoading(false)
            } catch (error) {
                setIsLoading(false)
            }
        }
        getRestaurant()
    }, [])


    const handleRestaurantFeature = async (restaurant, newStatus) => {
        try {
            await axios.put(
                `${url}/restaurant/update/feature/status/${restaurant?._id}`,
                {
                    feature: newStatus,
                }
            );

            const updatedRestaurantData = restaurantData.map((c) =>
                c._id === restaurant._id ? { ...c, feature: newStatus } : c
            );
            setRestaurantData(updatedRestaurantData);
        } catch (error) {
            console.log(error);
        }
    };

    const handleDeliveryZoneView = (restaurant) => {
        dispatch(showMapPolygoneZone(restaurant?._id))
        Navigate('/admin/deliveryZone')
    };

    // const handleRestaurantAuth = async (restaurant, newStatus) => {
    //     try {
    //         await axios.put(
    //             `${url}/restaurant/update/auth/status/${restaurant?._id}`,
    //             {
    //                 block: newStatus,
    //             }
    //         );

    //         const updatedRestaurantData = restaurantData.map((c) =>
    //             c._id === restaurant._id ? { ...c, block: newStatus } : c
    //         );
    //         setRestaurantData(updatedRestaurantData);
    //     } catch (error) {
    //         console.log(error);
    //     }
    // };


    const handleRestaurantDelete = (id) => {
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
                    .delete(`${url}/restaurant/single/delete/${id}`,
                        {
                            headers: {
                                Authorization: `${adminToken}`,
                            },
                        })
                    .then(() => {
                        setRestaurantData(restaurantData.filter((d) => d?._id !== id));
                        Swal.fire("Success!", "Restaurant has been deleted!", "success");
                    })
                    .catch((err) => {
                        console.log(err);
                        Swal.fire("Error!", "Restaurant has not been deleted!", "error");
                    });
            }
        });
    };

    const handleMultipleRestaurantDelete = () => {
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
                    .delete(`${url}/restaurant/multiple/deletes`, {
                        data: { ids: idsToDelete },
                        headers: {
                            Authorization: `${adminToken}`,
                        },

                    })
                    .then(() => {
                        setRestaurantData(
                            restaurantData?.filter((d) => !idsToDelete?.includes(d?._id))
                        );
                        Swal.fire("Success!", "Restaurant has been deleted!", "success");
                    })
                    .catch((err) => {
                        console.log(err);
                        Swal.fire("Error!", "Restaurant has not been deleted!", "error");
                    });
            }
        });
    };

    const handleRestaurantUpdate = (restaurant) => {
        dispatch(editRestaurant(restaurant))
        Navigate("/admin/editRestaurant");
    };

    // const handleRestaurantStatus = async (restaurant, newStatus) => {
    //     try {
    //         const adminToken = localStorage.getItem('token');
    //         await axios.put(
    //             `${url}/restaurant/update/status/${restaurant?._id}`,
    //             {
    //                 Restaurant_Status: newStatus,
    //             },
    //             {
    //                 headers: {
    //                     Authorization: `${adminToken}`,
    //                 },
    //             }
    //         );

    //         const updatedRestaurantData = restaurantData.map((c) =>
    //             c._id === restaurant._id ? { ...c, Restaurant_Status: newStatus } : c
    //         );
    //         setRestaurantData(updatedRestaurantData || []);
    //     } catch (error) {
    //         console.log(error);
    //     }
    // };

    const handleFilter = () => {
        const filteredRestaurantList = restaurantData?.filter((restaurant) => {
            const formattedRestaurantName = (restaurant?.name || "")
                .toUpperCase()
                .replace(/\s/g, "");
            let isRestaurantName = true;
            if (restaurantName) {
                isRestaurantName = formattedRestaurantName.includes(
                    restaurantName.toUpperCase().replace(/\s/g, "")
                );
            }

            return isRestaurantName;
        });

        // Apply search query filtering
        const filteredData = filteredRestaurantList.filter((restaurant) => {
            const formattedSearchQuery = searchQuery.toUpperCase().replace(/\s/g, "");
            const rowValues = Object.values(restaurant);
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
                                Restaurant List
                            </div>
                            <div className="d-flex flex-wrap gap-2 mt-2">
                                <button
                                    onClick={() => Navigate("/admin/createRestaurant")}
                                    className="btn btn-primary waves-effect waves-light"
                                >
                                    Add Restaurant <i className="fas fa-arrow-right ms-2"></i>
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
                                                <div>{selectedRows.length} Restaurants selected</div>
                                                <DeleteIcon
                                                    style={{ color: "red" }}
                                                    className="cursor-pointer"
                                                    onClick={() => handleMultipleRestaurantDelete()}
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

export default ShowRestaurant;
