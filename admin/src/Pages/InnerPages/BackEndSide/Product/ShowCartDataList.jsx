import React, { useEffect, useState } from "react";
import { DataGrid, GridToolbar, GridPagination, GridToolbarExport } from "@mui/x-data-grid";
import ClearIcon from "@mui/icons-material/Clear";
import axios from "axios";


let url = process.env.REACT_APP_API_URL

const ShowCartDataList = () => {

    const adminToken = localStorage.getItem('token');

    const [cartData, setCartData] = useState([]);
    const [cartName, setCartName] = useState("");
    const [selectedRows, setSelectedRows] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [isLoading, setIsLoading] = useState(true)


    const localeText = {
        noRowsLabel: "No Data Found 😔",
    };

    const columns = [
        {
            field: "_id",
            width: 200,
            headerName: "Id",
        },
        {
            field: "userName",
            headerName: "User Name",
            width: 150,
            filterable: true,
            sortable: true,
            filterType: "multiselect",
        },
        {
            field: "userMobileNo",
            headerName: "Mobile No",
            width: 150,
            filterable: true,
            sortable: true,
            filterType: "multiselect",
        },
        {
            field: "productName",
            headerName: "Product Name",
            width: 250,
            filterable: true,
            sortable: true,
            filterType: "multiselect",
        },
        {
            field: "variationName",
            headerName: "Color",
            width: 150,
            filterable: true,
            sortable: true,
            filterType: "multiselect",
        },
        {
            field: "sizeName",
            headerName: "Size",
            width: 150,
            filterable: true,
            sortable: true,
            filterType: "multiselect",
        },
        {
            field: "Date",
            headerName: "Date",
            width: 150,
            filterable: true,
            sortable: true,
            filterType: "multiselect",
        },
    ];

    useEffect(() => {
        async function getCart() {

            try {
                const res = await axios.get(`${url}/cart/items/byadmin/get`,
                    {
                        headers: {
                            Authorization: `${adminToken}`,
                        },
                    }
                );

                setCartData(res?.data?.cartItems || []);
                setIsLoading(false)
            } catch (error) {
                setIsLoading(false)
            }
        }
        getCart();
    }, []);



    const handleFilter = () => {
        const filteredCartList = cartData?.filter((cart) => {
            const formattedCartName = (cart?.name || "").toUpperCase().replace(/\s/g, "");
            let isCartName = true;
            if (cartName) {
                isCartName = formattedCartName.includes(cartName.toUpperCase().replace(/\s/g, ""));
            }

            return isCartName;
        });

        // Apply search query filtering
        const filteredData = filteredCartList.filter((cart) => {
            const formattedSearchQuery = searchQuery.toUpperCase().replace(/\s/g, "");
            const rowValues = Object.values(cart);
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
                                Users Cart Data
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

export default ShowCartDataList;
