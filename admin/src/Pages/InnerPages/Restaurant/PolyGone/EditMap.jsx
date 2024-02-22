import React from "react";
import {
    GoogleMap,
    LoadScript,
    Polygon,
    PolygonF,
    useLoadScript,
} from "@react-google-maps/api";
import { useCallback } from "react";
import { useRef } from "react";
import axios from "axios";
import { useState } from "react";

let url = process.env.REACT_APP_API_URL;
const adminToken = localStorage.getItem("token");

const libraries = ["geometry"];

function EditMap({
    apiKey,
    paths,
    point,
    center,
    setPoint,
    close,
    id,
    color,
    setColor,
}) {
    const polygonRef = useRef(null);
    const listenersRef = useRef([]);

    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: apiKey,
        libraries,
    });

    const [editColor, setEditColor] = useState(color);
    let colorArray = ["Red", "Green", "Yellow", "Blue", "Pink", "Orange"];

    const handleColorChange = (event) => {
        setEditColor(event.target.value);
    };

    var new_path = JSON.stringify(point);
    // Call setPath with new edited path
    const onEdit = useCallback(() => {
        if (polygonRef.current) {
            const nextPath = polygonRef.current
                .getPath()
                .getArray()
                .map((latLng) => {
                    return { lat: latLng.lat(), lng: latLng.lng() };
                });
            setPoint(nextPath);
            setEditColor(editColor);
            setColor(editColor);
        }
    }, [setPoint, color]);

    // Bind refs to current Polygon and listeners
    const onLoad = useCallback(
        (polygon) => {
            setPoint(paths);
            polygonRef.current = polygon;
            const path = polygon.getPath();
            listenersRef.current.push(
                path.addListener("set_at", onEdit),
                path.addListener("insert_at", onEdit),
                path.addListener("remove_at", onEdit)
            );
        },
        [onEdit, paths, setPoint]
    );
    // Clean up refs
    const onUnmount = useCallback(() => {
        listenersRef.current.forEach((lis) => lis.remove());
        polygonRef.current = null;
    }, []);

    // console.log('editColor',editColor)

    const refreshPage = () => {
        window.location.reload();
    };

    const updateMap = async () => {
        await axios
            .post(`${url}/mapZone/polygone/update/byRestaurantOrAdmin/${id}`, {
                parentId: id,
                coordinates: new_path,
                color: editColor,
            }, {
                headers: {
                    Authorization: `${adminToken}`,
                    'Content-Type': 'application/json',
                },
            })
            .then((response) => {
                if (response?.data?.type === "success") {
                    alert("Map Updated successfully");
                    refreshPage();
                }
            })
            .catch((err) => {
                console.log(err);
            });
    };

    if (loadError) return "Error loading maps";
    if (!isLoaded) return "Loading maps";

    return (
        <div className="main-content dark">
            <div className="page-content">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-12">
                            <div className="card-body">
                                <div class="mb-3 row">
                                    <div class="col-md-5">
                                        <select class="form-select" value={editColor} onChange={handleColorChange} >
                                            <option>Select</option>
                                            {colorArray?.map((item, index) => (
                                                <option key={index}>{item}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {paths.length > 1 ? (
                                    <GoogleMap mapContainerClassName="appmap" center={center} zoom={12} onLoad={(map) => {
                                        const bounds = new window.google.maps.LatLngBounds();

                                        point.forEach((point) => {
                                            bounds.extend(
                                                new window.google.maps.LatLng(point.lat, point.lng)
                                            );
                                        });

                                        map.fitBounds(bounds);
                                    }}>
                                        <PolygonF
                                            path={point}
                                            editable
                                            onMouseUp={onEdit}
                                            onLoad={onLoad}
                                            onUnmount={onUnmount}
                                            options={{
                                                fillColor: editColor ? editColor : color,
                                                strokeColor: `#0a6ebd`,
                                                fillOpacity: 0.5,
                                                strokeWeight: 2,
                                            }}
                                        />
                                    </GoogleMap>
                                ) : (
                                    <h2>No Geofence added</h2>
                                )}

                                <div className="mt-3 row">
                                    <div className="col-md-10 offset-md-12">
                                        <div className="row mb-10">
                                            <div className="col ms-auto">
                                                <div className="d-flex flex-reverse flex-wrap gap-2">
                                                    <a
                                                        className="btn btn-danger"
                                                        onClick={close}
                                                    >
                                                        {" "}
                                                        <i className="fas fa-window-close"></i> Cancel{" "}
                                                    </a>
                                                    <a
                                                        className="btn btn-success"
                                                        onClick={updateMap}
                                                    >
                                                        {" "}
                                                        <i className="fas fa-save"></i> Save{" "}
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EditMap;
