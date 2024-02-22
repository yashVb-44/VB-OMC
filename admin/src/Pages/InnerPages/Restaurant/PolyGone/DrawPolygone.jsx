import React, { useEffect, useState } from "react";
// import { Button, Table } from 'react-bootstrap';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Map1 from "./Map1";
import { useDispatch, useSelector } from "react-redux";
import { addPolygoneOnMap } from "../../../../Redux/Actions/BackendActions/MapPolygoneActions";

let url = process.env.REACT_APP_API_URL;
const adminToken = localStorage.getItem("token");

export default function DrawPolygone({ id, role }) {
    const navigate = useNavigate();
    const [zone, setZone] = useState("");
    const [allMaps, setAllMaps] = useState([]);
    const [restaurantData, setRestaurantData] = useState();

    const dispatch = useDispatch()

    const selectedRestaurantId = useSelector((state) => state?.ShowMapPolygoneZoneDataChange?.payload)

    let message = "";

    const [latitude, setLatitude] = useState("");
    const [longitude, setlongitude] = useState("");

    useEffect(() => {
        async function getRestaurant() {
            try {
                const adminToken = localStorage.getItem('token');
                const res = await axios.get(`${url}/restaurant/single/get/${role === "restaurant" ? id : selectedRestaurantId}`,
                    {
                        headers: {
                            Authorization: `${adminToken}`,
                        },
                    }
                )
                setRestaurantData(res?.data?.restaurant)
                setLatitude(restaurantData?.lat)
                setlongitude(restaurantData?.lng)
            } catch (error) {
            }
        }
        getRestaurant()
    }, [restaurantData])


    const addZone = async () => {

        try {
            const adminToken = localStorage.getItem('token');

            const fromData = {
                zone: zone,
                latitude: latitude,
                longitude: longitude
            }

            const response = await axios.post(
                `${url}/mapZone/add/byRestaurantOrAdmin?id=${selectedRestaurantId}`, fromData,
                {
                    headers: {
                        Authorization: `${adminToken}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            if (response.data.type === "success") {
                message = response.data.message;
                let mapZoneId = response.data.id;
                dispatch(addPolygoneOnMap(mapZoneId))
                navigate(`/admin/addMapPolygone/${zone}`);
            } else if (response.data.type === "warning") {
                message = response.data.message;
                alert(response.data.message)
            } else {
                alert("Zone Not Add!")
            }
        } catch (error) {
            alert("Zone Not Add!")
            console.error(error);
        }

    };

    const getAllMaps = () => {
        axios
            .get(`${url}/mapZone/getAll/byRestaurantOrAdmin?id=${selectedRestaurantId}`, {
                headers: {
                    Authorization: `${adminToken}`,
                    'Content-Type': 'application/json',
                },
            })
            .then((response) => {
                if (response) {
                    setAllMaps(response?.data?.mapZone);
                }
            })
            .catch((err) => console.log(err));
    };

    useEffect(() => {
        let unmounted = false;
        setTimeout(() => {
            getAllMaps();
        }, 1000);
        return () => {
            unmounted = true;
            setAllMaps([]);
        };
    }, []);

    useEffect(() => {
        getAllMaps();
    }, [allMaps]);


    return (
        <>
            <div className="main-content dark">
                <div className="page-content">
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-12">
                                <div className="page-title-box d-flex align-items-center justify-content-between">
                                    <h4 className="mb-0">Delivery Zones</h4>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-12">
                                <div className="card">
                                    <div className="card-body">
                                        <div className="mb-3 row">
                                            <div className="col-md-8 mt-2">
                                                <input
                                                    required
                                                    className="form-control"
                                                    type="text"
                                                    id="example-text-input"
                                                    value={zone}
                                                    placeholder="Enter your zone name here..."
                                                    onChange={(e) => setZone(e.target.value)}
                                                />
                                            </div>
                                            <label
                                                htmlFor="example-text-input"
                                                className="col-md-2 col-form-label"
                                            >
                                                <button
                                                    className="btn btn-primary"
                                                    onClick={addZone}
                                                    disabled={zone === "" ? true : false}
                                                >
                                                    {" "}
                                                    <i className="fas fa-plus-circle"></i> Add{" "}
                                                </button>
                                            </label>
                                        </div>
                                        <div>
                                            <table className="w-90 table  table-bordered table-hover">
                                                <thead >
                                                    <tr>
                                                        <th>No.</th>
                                                        <th>Zone</th>
                                                        {/* <th>LATITUDE</th>
                                                            <th>LONGITUDE</th> */}
                                                        <th>Actions</th>
                                                    </tr>
                                                </thead>

                                                <tbody>
                                                    {allMaps?.map((map, index) => (
                                                        <Map1
                                                            key={index}
                                                            id={map._id}
                                                            zone={map.zone}
                                                            index={index}
                                                            map={map}
                                                        />
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
