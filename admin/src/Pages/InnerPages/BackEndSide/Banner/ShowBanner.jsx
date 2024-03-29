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
import { editBanner } from "../../../../Redux/Actions/BackendActions/BannerActions";
import Modal from "react-modal";
import ImageModel from "../../../../Components/ImageComp/ImageModel";



let url = process.env.REACT_APP_API_URL

const ShowBanner = () => {
    const [bannerData, setBannerData] = useState([]);
    const [bannerName, setBannerName] = useState("");
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
            field: "MealName",
            headerName: "Meal",
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
                    alt="Banner Image"
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
            field: "sequence",
            headerName: "Sequence",
            width: 100,
            filterable: true,
            sortable: true,
            filterType: "multiselect",
        },
        // {
        //     field: "Banner_Link",
        //     headerName: "Link",
        //     width: 300,
        //     filterable: true,
        //     sortable: false,
        //     filterType: "multiselect",
        //     renderCell: (params) => (
        //         <a
        //             style={{ color: "blue", textTransform: "lowercase" }}
        //         >
        //             {params?.row?.Banner_link !== "undefined" ? <a href={params?.row?.Banner_link?.toLowerCase()}> {params?.row?.Banner_link}</a> : <div style={{ color: "black", textTransform: "capitalize" }}>Please add Link</div>}
        //         </a>
        //     ),
        // },
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
                        onChange={() => handleBannerStatus(params.row, !params.value)}
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
                        onChange={() => handleBannerFeature(params.row, !params.value)}
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
                        onClick={() => handleBannerDelete(params.row._id)}
                    >
                        <i class="fas fa-trash-alt font-size-16 font-Icon-Del"></i>
                    </IconButton>
                    <IconButton
                        aria-label="edit"
                        onClick={() => handleBannerUpdate(params.row)}
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
        async function getBanner() {
            try {
                const adminToken = localStorage.getItem('token');
                const res = await axios.get(`${url}/banner/get`,
                    {
                        headers: {
                            Authorization: `${adminToken}`,
                        },
                    }
                )
                setBannerData(res?.data?.banner || [])
                setIsLoading(false)
            } catch (error) {
                setIsLoading(false)
            }
        }
        getBanner()
    }, [])

    const handleBannerDelete = (id) => {
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
                    .delete(`${url}/banner/delete/${id}`,
                        {
                            headers: {
                                Authorization: `${adminToken}`,
                            },
                        })
                    .then(() => {
                        setBannerData(bannerData.filter((d) => d?._id !== id));
                        Swal.fire("Success!", "Banner has been deleted!", "success");
                    })
                    .catch((err) => {
                        console.log(err);
                        Swal.fire("Error!", "Banner has not been deleted!", "error");
                    });
            }
        });
    };

    const handleMultipleBannerDelete = () => {
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
                    .delete(`${url}/banner/deletes`, {
                        data: { ids: idsToDelete },
                        headers: {
                            Authorization: `${adminToken}`,
                        },

                    })
                    .then(() => {
                        setBannerData(
                            bannerData?.filter((d) => !idsToDelete?.includes(d?._id))
                        );
                        Swal.fire("Success!", "Banner has been deleted!", "success");
                    })
                    .catch((err) => {
                        console.log(err);
                        Swal.fire("Error!", "Banner has not been deleted!", "error");
                    });
            }
        });
    };

    const handleBannerUpdate = (banner) => {
        dispatch(editBanner(banner))
        Navigate("/admin/editBanner");
    };

    const handleBannerStatus = async (banner, newStatus) => {
        try {
            const adminToken = localStorage.getItem('token');
            await axios.put(
                `${url}/banner/update/status/${banner?._id}`,
                {
                    status: newStatus,
                },
                {
                    headers: {
                        Authorization: `${adminToken}`,
                    },
                }
            );

            const updatedBannerData = bannerData.map((c) =>
                c._id === banner._id ? { ...c, status: newStatus } : c
            );
            setBannerData(updatedBannerData || []);
        } catch (error) {
            console.log(error);
        }
    };

    const handleBannerFeature = async (banner, newStatus) => {
        try {
            const adminToken = localStorage.getItem('token');
            await axios.put(
                `${url}/banner/update/feature/${banner?._id}`,
                {
                    feature: newStatus,
                },
                {
                    headers: {
                        Authorization: `${adminToken}`,
                    },
                }
            );

            const updatedBannerData = bannerData.map((c) =>
                c._id === banner._id ? { ...c, feature: newStatus } : c
            );
            setBannerData(updatedBannerData || []);
        } catch (error) {
            console.log(error);
        }
    };

    const handleFilter = () => {
        const filteredBannerList = bannerData?.filter((banner) => {
            const formattedBannerName = (banner?.name || "")
                .toUpperCase()
                .replace(/\s/g, "");
            let isBannerName = true;
            if (bannerName) {
                isBannerName = formattedBannerName.includes(
                    bannerName.toUpperCase().replace(/\s/g, "")
                );
            }

            return isBannerName;
        });

        // Apply search query filtering
        const filteredData = filteredBannerList.filter((banner) => {
            const formattedSearchQuery = searchQuery.toUpperCase().replace(/\s/g, "");
            const rowValues = Object.values(banner);
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
                                Banner List
                            </div>
                            <div className="d-flex flex-wrap gap-2 mt-2">
                                <button
                                    onClick={() => Navigate("/admin/addBanner")}
                                    className="btn btn-primary waves-effect waves-light"
                                >
                                    Add Banner <i className="fas fa-arrow-right ms-2"></i>
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
                                                <div>{selectedRows.length} Banners selected</div>
                                                <DeleteIcon
                                                    style={{ color: "red" }}
                                                    className="cursor-pointer"
                                                    onClick={() => handleMultipleBannerDelete()}
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

export default ShowBanner;
