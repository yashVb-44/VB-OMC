import React, { useState, useEffect } from 'react';
import { GoogleMap, DrawingManager, Polygon, useJsApiLoader } from '@react-google-maps/api';

const libraries = ['drawing'];
const mapContainerStyle = {
    width: '800px',
    height: '600px',
};
const center = { lat: 40.756795, lng: -73.954298 }; // Replace with your desired center coordinates
const zoom = 11;


function Map() {

    const [polygonPaths, setPolygonPaths] = useState([]);

    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: 'AIzaSyB744Cm87fQdMcweUbn26vqZfC7IYlVTTI', // Replace with your actual API key
        libraries,
    });

    const handlePolygonComplete = (polygon) => {
        setPolygonPaths(polygon.getPath().getArray());
    };

    return (
        <div style={{ margin: "100px" }}>
            {isLoaded ? (
                <GoogleMap
                    mapContainerStyle={mapContainerStyle}
                    center={center}
                    zoom={zoom}
                >
                    <DrawingManager
                        drawingMode={window.google.maps.drawing.OverlayType.POLYGON}
                        onPolygonComplete={handlePolygonComplete}
                        defaultOptions={{
                            drawingControl: true,
                            drawingControlOptions: {
                                position: window.google.maps.ControlPosition.TOP_CENTER,
                                drawingModes: [window.google.maps.drawing.OverlayType.POLYGON],
                            },
                            polygonOptions: {
                                editable: true,
                                fillColor: '#199ee0',
                                fillOpacity: 0.2,
                                strokeWeight: 2,
                                strokeColor: '#113460',
                            },
                        }}
                    />
                    {polygonPaths.length > 0 && (
                        <Polygon paths={polygonPaths} />
                    )}
                </GoogleMap>
            ) : (
                <div>Loading...</div>
            )}
        </div>
    );
}

export default Map;
