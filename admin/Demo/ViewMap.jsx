import React from 'react'
import { GoogleMap, LoadScript, Marker, Polygon, PolygonF, useLoadScript } from '@react-google-maps/api'

function ViewMap({ points, setModalView, color, latitude, longitude }) {

    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: process.env.REACT_APP_GOOGLEAPI,
    });

    if (loadError) return 'Error loading maps';
    if (!isLoaded) return 'Loading maps';

    return (
        <div className="App">
            {/* <LoadScript
                id="script-loader"
                googleMapsApiKey={process.env.REACT_APP_GOOGLEAPI}
                language="en"
                region="us"
            > */}
            {
                points.length > 1
                    ?
                    <GoogleMap
                        mapContainerClassName='appmap'
                        center={points[0]}
                        zoom={12}
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

            {/* </LoadScript> */}

            <button onClick={() => setModalView(false)}>Close</button>
        </div>
    )
}

export default ViewMap