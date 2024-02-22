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
import { editWarningLabels } from "../../../../Redux/Actions/BackendActions/WarningLabelsActions";
import Modal from "react-modal";
import ImageModel from "../../../../Components/ImageComp/ImageModel";


let url = process.env.REACT_APP_API_URL

const ShowWarningLabels = () => {

    const adminToken = localStorage.getItem('token');

    const [WarningLabelsData, setWarningLabelsData] = useState([]);
    const [WarningLabelsName, setWarningLabelsName] = useState("");
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
            width: 220,
            headerName: "Id",
        },
        {
            field: "name",
            headerName: "Name",
            width: 220,
            filterable: true,
            sortable: true,
            filterType: "multiselect",
        },
        {
            field: "image",
            headerName: "Image",
            width: 120,
            renderCell: (params) => (
                <img
                    src={params?.row?.image}
                    alt="WarningLabels Image"
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
            headerName: "status",
            width: 120,
            renderCell: (params) => (
                <div className="form-check form-switch">
                    <input
                        type="checkbox"
                        className="form-check-input"
                        id={`customSwitch-${params.id}`}
                        onChange={() => handleWarningLabelsStatus(params.row, !params.value)}
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
                        onChange={() => handleWarningLabelsFeatureStatus(params.row, !params.value)}
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
            width: 120,
            renderCell: (params) => (
                <Stack direction="row">
                    <IconButton
                        aria-label="delete"
                        onClick={() => handleWarningLabelsDelete(params.row._id)}
                    >
                        <i class="fas fa-trash-alt font-size-16 font-Icon-Del"></i>
                    </IconButton>
                    <IconButton
                        aria-label="edit"
                        onClick={() => handleWarningLabelsUpdate(params.row)}
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
        async function getWarningLabels() {

            try {
                const res = await axios.get(`${url}/warningLabels/list/get`,
                    {
                        headers: {
                            Authorization: `${adminToken}`,
                        },
                    }
                );

                setWarningLabelsData(res?.data?.warningLabel || []);
                setIsLoading(false)
            } catch (error) {
                setIsLoading(false)
            }
        }
        getWarningLabels();
    }, []);


    const handleWarningLabelsDelete = (id) => {
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
                    .delete(`${url}/warningLabels/delete/${id}`,
                        {
                            headers: {
                                Authorization: `${adminToken}`,
                            },
                        })
                    .then(() => {
                        setWarningLabelsData(WarningLabelsData.filter((d) => d?._id !== id));
                        Swal.fire("Success!", "WarningLabels has been deleted!", "success");
                    })
                    .catch((err) => {
                        console.log(err);
                        Swal.fire("Error!", "WarningLabels has not been deleted!", "error");
                    });
            }
        });
    };


    const handleMultipleWarningLabelsDelete = () => {
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
                    .delete(`${url}/warningLabels/deletes`, {
                        data: { ids: idsToDelete },
                        headers: {
                            Authorization: `${adminToken}`,
                        }
                    })
                    .then(() => {
                        setWarningLabelsData(WarningLabelsData?.filter((d) => !idsToDelete?.includes(d?._id)));
                        Swal.fire("Success!", "WarningLabels has been deleted!", "success");
                    })
                    .catch((err) => {
                        console.log(err);
                        Swal.fire("Error!", "WarningLabels has not been deleted!", "error");
                    });
            }
        });
    };

    const handleWarningLabelsUpdate = (WarningLabels) => {
        dispatch(editWarningLabels(WarningLabels))
        Navigate('/admin/editWarningLabels')
    };


    const handleWarningLabelsStatus = async (WarningLabels, newStatus) => {
        try {

            await axios.put(
                `${url}/warningLabels/update/status/${WarningLabels?._id}`,
                {
                    status: newStatus,
                },
                {
                    headers: {
                        Authorization: `${adminToken}`,
                    },
                }
            );

            const updatedWarningLabelsData = WarningLabelsData.map((c) =>
                c._id === WarningLabels._id ? { ...c, status: newStatus } : c
            );
            setWarningLabelsData(updatedWarningLabelsData);
        } catch (error) {
            console.log(error);
        }
    };

    const handleWarningLabelsFeatureStatus = async (WarningLabels, newStatus) => {
        try {

            await axios.put(
                `${url}/warningLabels/update/feature/${WarningLabels?._id}`,
                {
                    feature: newStatus,
                },
                {
                    headers: {
                        Authorization: `${adminToken}`,
                    },
                }
            );

            const updatedWarningLabelsData = WarningLabelsData.map((c) =>
                c._id === WarningLabels._id ? { ...c, feature: newStatus } : c
            );
            setWarningLabelsData(updatedWarningLabelsData);
        } catch (error) {
            console.log(error);
        }
    };

    const handleFilter = () => {
        const filteredWarningLabelsList = WarningLabelsData?.filter((WarningLabels) => {
            const formattedWarningLabelsName = (WarningLabels?.name || "").toUpperCase().replace(/\s/g, "");
            let isWarningLabelsName = true;
            if (WarningLabelsName) {
                isWarningLabelsName = formattedWarningLabelsName.includes(WarningLabelsName.toUpperCase().replace(/\s/g, ""));
            }

            return isWarningLabelsName;
        });

        // Apply search query filtering
        const filteredData = filteredWarningLabelsList.filter((WarningLabels) => {
            const formattedSearchQuery = searchQuery.toUpperCase().replace(/\s/g, "");
            const rowValues = Object.values(WarningLabels);
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
                                Warning-Labels List
                            </div>
                            <div className="d-flex flex-wrap gap-2 mt-2">
                                <button onClick={() => Navigate("/admin/addWarningLabels")} className="btn btn-primary waves-effect waves-light">
                                    Add Warning-Labels <i className="fas fa-arrow-right ms-2"></i>
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
                                                <div>{selectedRows.length} Warning-Labels selected</div>
                                                <DeleteIcon
                                                    style={{ color: "red" }}
                                                    className="cursor-pointer"
                                                    onClick={() => handleMultipleWarningLabelsDelete()}
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

export default ShowWarningLabels;
