import React, { useCallback, useRef, useState } from 'react'

import { GoogleMap, LoadScript, DrawingManagerF, Marker, Polygon, useLoadScript, PolygonF } from '@react-google-maps/api'


export default function GeoMaps({ apiKey, center, paths = [], point, color }) {

    const [path, setPath] = useState(paths)
    const [isDraw, setIsDraw] = useState(true)
    const [state, setState] = useState({
        drawingMode: 'polygon'
    })

    const libraries = ['drawing'];
    const options = {
        drawingControl: true,
        drawingControlOptions: {
            drawingMode: ['Polygon']
        },
        polygonOptions: {
            fillColor: '#2196F3',
            strokeColor: '#2196F3',
            fillOpacity: 0.5,
            strokeWeight: 2,
            clickable: true,
            editable: true,
            draggable: true,
            zindex: 1
        }
    }

    const onPolygonComplete = React.useCallback(
        function onPolygonComplete(poly) {
            const polyArray = poly.getPath().getArray();
            let paths = [];
            polyArray.forEach(function (path) {
                paths.push({ lat: path.lat(), lng: path.lng() });
            })
            setPath(paths);
            setIsDraw(false)
            point(paths);
            poly.setMap(null);
        },
        [point]
    )

    //define refs for Polygon instance and listeners
    const polygonRef = useRef(null);
    const listenerRef = useRef([]);

    //call setpath with new edited paths
    const onEdit = useCallback(() => {
        if (polygonRef.current) {
            const nextPath = polygonRef.current.getPath().getArray().map(latlng => {
                return { lat: latlng.lat(), lng: latlng.lng() };
            })
            setPath(nextPath);
            point(nextPath)
        }
    }, [setPath, point]);

    const onLoad = useCallback(
        polygon => {
            polygonRef.current = polygon;
            const path = polygon.getPath()
            listenerRef.current.push(
                path.addListener("set_at", onEdit),
                path.addListener("insert_at", onEdit),
                path.addListener("remove_at", onEdit),

            )
        }, [onEdit]
    )

    const onUnmount = useCallback(() => {
        listenerRef.current.forEach(lis => lis.remove())
        polygonRef.current = null;
    }, [])

    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: apiKey,
        libraries: libraries,
    });

    if (loadError) return 'Error loading maps';
    if (!isLoaded) return 'Loading maps';

    return (
        <div className='App'>
            {/* <LoadScript
                id="script-loader"
                googleMapsApiKey={apiKey}
                libraries={libraries}
                language="en"
                region="us"

            > */}
            <GoogleMap
                mapContainerClassName="appmap"
                center={center}
                zoom={12}
            >
                {
                    isDraw
                        ?
                        (<DrawingManagerF
                            drawingMode={state.drawingMode}
                            options={options}
                            editable
                            draggable
                            onPolygonComplete={onPolygonComplete}
                            onMouseUp={onEdit}
                            onDragEnd={onEdit}
                        />)
                        :
                        (
                            <PolygonF
                                options={{
                                    fillColor: color ? color : '#2196F3',
                                    strokeColor: '#2196F3',
                                    fillOpacity: 0.5,
                                    strokeWeight: 2
                                }}
                                editable
                                path={path}
                                onLoad={onLoad}
                                onUnmount={onUnmount}
                                onMouseUp={onEdit}
                                onDragEnd={onEdit}
                            />
                        )
                }

                <Marker position={center} />

            </GoogleMap>

            {/* </LoadScript> */}

        </div>
    )
}
