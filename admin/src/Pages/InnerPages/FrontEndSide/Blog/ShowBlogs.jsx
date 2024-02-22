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
import { useDispatch } from "react-redux";
import { editBlogs } from "../../../../Redux/Actions/FronendActions/BlogActons";
import Modal from "react-modal";
import ImageModel from "../../../../Components/ImageComp/ImageModel";


let url = process.env.REACT_APP_API_URL

const ShowBlogs = () => {

    const adminToken = localStorage.getItem('token');

    const [blogsData, setBlogsData] = useState([]);
    const [title, setBlogsName] = useState("");
    const [desc, setdesc] = useState("")
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
        },
        {
            field: "title",
            headerName: "Title",
            width: 225,
            filterable: true,
            sortable: true,
            filterType: "multiselect",
        },
        {
            field: "image",
            headerName: "Image",
            width: 150,
            renderCell: (params) => (
                <img
                    src={params?.row?.image}
                    alt="Blogs Image"
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
            field: "status",
            headerName: "Status",
            width: 220,
            renderCell: (params) => (
                <div className="form-check form-switch">
                    <input
                        type="checkbox"
                        className="form-check-input"
                        id={`customSwitch-${params.id}`}
                        onChange={() => handleBlogsStatus(params.row, !params.value)}
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
            width: 200,
            renderCell: (params) => (
                <Stack direction="row">
                    <IconButton
                        aria-label="delete"
                        onClick={() => handleBlogsDelete(params.row._id)}
                    >
                        <i class="fas fa-trash-alt font-size-16 font-Icon-Del"></i>
                    </IconButton>
                    <IconButton
                        aria-label="edit"
                        onClick={() => handleBlogsUpdate(params.row)}
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
        async function getBlogs() {

            try {
                const res = await axios.get(`${url}/blogs/get`,
                    {
                        headers: {
                            Authorization: `${adminToken}`,
                        },
                    }
                );

                setBlogsData(res?.data?.blogs_data || []);
                setIsLoading(false)
            } catch (error) {
                setIsLoading(false)
            }
        }
        getBlogs();
    }, []);


    const handleBlogsDelete = (id) => {
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
                    .delete(`${url}/blogs/delete/${id}`,
                        {
                            headers: {
                                Authorization: `${adminToken}`,
                            },
                        })
                    .then(() => {
                        setBlogsData(blogsData.filter((d) => d?._id !== id));
                        Swal.fire("Success!", "Blogs has been deleted!", "success");
                    })
                    .catch((err) => {
                        console.log(err);
                        Swal.fire("Error!", "Blogs has not been deleted!", "error");
                    });
            }
        });
    };


    const handleMultipleBlogsDelete = () => {
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
                    .delete(`${url}/blogs/deletes`, {
                        data: { ids: idsToDelete },
                        headers: {
                            Authorization: `${adminToken}`,
                        }
                    })
                    .then(() => {
                        setBlogsData(blogsData?.filter((d) => !idsToDelete?.includes(d?._id)));
                        Swal.fire("Success!", "Blogs has been deleted!", "success");
                    })
                    .catch((err) => {
                        console.log(err);
                        Swal.fire("Error!", "Blogs has not been deleted!", "error");
                    });
            }
        });
    };

    const handleBlogsUpdate = (blogs) => {
        dispatch(editBlogs(blogs))
        Navigate('/admin/editBlogs')
    };

    const handleBlogsStatus = async (blogs, newStatus) => {
        try {

            await axios.put(
                `${url}/blogs/update/status/${blogs?._id}`,
                {
                    status: newStatus,
                },
                {
                    headers: {
                        Authorization: `${adminToken}`,
                    },
                }
            );

            const updatedBlogsData = blogsData.map((c) =>
                c._id === blogs._id ? { ...c, status: newStatus } : c
            );
            setBlogsData(updatedBlogsData);
        } catch (error) {
            console.log(error);
        }
    };

    const handleBlogsFeatureStatus = async (blogs, newStatus) => {
        try {

            await axios.put(
                `${url}/blogs/update/feature/${blogs?._id}`,
                {
                    Blogs_Feature: newStatus,
                },
                {
                    headers: {
                        Authorization: `${adminToken}`,
                    },
                }
            );

            const updatedBlogsData = blogsData.map((c) =>
                c._id === blogs._id ? { ...c, Blogs_Feature: newStatus } : c
            );
            setBlogsData(updatedBlogsData);
        } catch (error) {
            console.log(error);
        }
    };

    const handleFilter = () => {
        const filteredBlogsList = blogsData?.filter((blogs) => {
            const formattedBlogsName = (blogs?.name || "").toUpperCase().replace(/\s/g, "");
            let isBlogsName = true;
            if (title) {
                isBlogsName = formattedBlogsName.includes(title.toUpperCase().replace(/\s/g, ""));
            }

            return isBlogsName;
        });

        // Apply search query filtering
        const filteredData = filteredBlogsList.filter((blogs) => {
            const formattedSearchQuery = searchQuery.toUpperCase().replace(/\s/g, "");
            const rowValues = Object.values(blogs);
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
                                Blogs List
                            </div>
                            <div className="d-flex flex-wrap gap-2 mt-2">
                                <button onClick={() => Navigate("/admin/addBlogs")} className="btn btn-primary waves-effect waves-light">
                                    Add Blogs <i className="fas fa-arrow-right ms-2"></i>
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
                                                <div>{selectedRows.length} Blogs selected</div>
                                                <DeleteIcon
                                                    style={{ color: "red" }}
                                                    className="cursor-pointer"
                                                    onClick={() => handleMultipleBlogsDelete()}
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

export default ShowBlogs;