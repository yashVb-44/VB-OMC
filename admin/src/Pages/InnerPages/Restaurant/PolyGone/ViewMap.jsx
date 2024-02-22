import React from 'react'
import { GoogleMap, LoadScript, Marker, Polygon, PolygonF, useLoadScript } from '@react-google-maps/api'

function ViewMap({ points, setModalView, color, latitude, longitude }) {

    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: process.env.REACT_APP_GOOGLEAPI,
    });

    if (loadError) return 'Error loading maps';
    if (!isLoaded) return 'Loading maps';


    return (
        <div className="main-content dark">
            <div className="page-content">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-12">
                            <div className="card-body">
                                {
                                    points.length > 1
                                        ?
                                        <GoogleMap
                                            mapContainerClassName='appmap'
                                            center={points[0]}
                                            zoom={18}
                                            onLoad={(map) => {
                                                const bounds = new window.google.maps.LatLngBounds();

                                                points.forEach((point) => {
                                                    bounds.extend(
                                                        new window.google.maps.LatLng(point.lat, point.lng)
                                                    );
                                                });

                                                map.fitBounds(bounds);
                                            }}
                                        >
                                            <PolygonF
                                                path={points}
                                                options={{
                                                    fillColor: color,
                                                    strokeColor: '#2196F3',
                                                    fillOpacity: 0.5,
                                                    strokeWeight: 2
                                                }}
                                            />
                                            <Marker
                                                position={{ lat: Number(latitude), lng: Number(longitude) }}
                                            />

                                        </GoogleMap>
                                        :
                                        null
                                }
                                <div className="mt-3 row">
                                    <div className="col-md-10 offset-md-12">
                                        <div className="row mb-10">
                                            <div className="col ms-auto">
                                                <div className="d-flex flex-reverse flex-wrap gap-2">
                                                    <a
                                                        className="btn btn-danger"
                                                        onClick={() => setModalView(false)}
                                                    >
                                                        {" "}
                                                        <i className="fas fa-window-close"></i> Close{" "}
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
    )
}

export default ViewMap