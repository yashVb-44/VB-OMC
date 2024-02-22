import React, { useRef, useState } from "react";
import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import 'react-quill/dist/quill.snow.css';
import { useSelector } from "react-redux";
import AlertBox from "../../../Components/AlertComp/AlertBox";


import { GoogleMap, LoadScript, Autocomplete, Marker, useLoadScript } from '@react-google-maps/api';

let url = process.env.REACT_APP_API_URL
const googleMapsApiKeys = `AIzaSyB744Cm87fQdMcweUbn26vqZfC7IYlVTTI`

const containerStyle = {
    width: '100%',
    height: '300px'
};

const center = {
    lat: 37.7749,
    lng: -122.4194
};

const CheckLocation = ({ id }) => {

    const adminToken = localStorage.getItem('token');
    const Navigate = useNavigate()
    const [loading, setLoading] = useState(false);




    const [lat, setLat] = useState("")
    const [lng, setLng] = useState("")
    const [libraries] = useState(['places'])


    const [restaurantAddStatus, setRestaurantAddStatus] = useState();
    const [statusMessage, setStatusMessage] = useState("");



    const handleSubmit = async (e) => {
        e.preventDefault();
        setButtonDisabled(true)
        setLoading(true)

        if (restaurantName !== "") {

            const formData = new FormData();
            formData.append("name", restaurantName);
            formData.append("image", restaurantImage);
            formData.append("logo", restaurantLogo);
            formData.append("other", restaurantPdf);
            formData.append("email", email);
            formData.append("password", password);
            formData.append("mobileNo", mobileNo);
            formData.append("no", no);
            formData.append("address", address);
            formData.append("country", country);
            formData.append("state", state);
            formData.append("city", city);
            formData.append("zipcode", zipcode);
            formData.append("area", area);
            formData.append("street", street);
            formData.append("lat", lat);
            formData.append("lng", lng);
            formData.append("open_time", openTime);
            formData.append("close_time", closeTime);
            formData.append("bankdetailsOne", detailsOne);
            formData.append("bankdetailsTwo", detailsTwo);

            try {
                let response = await axios.put(
                    `${url}/restaurant/profile/update/byRestaurant`,
                    formData,
                    {
                        headers: {
                            Authorization: `${adminToken}`,
                        },
                    }
                );

                if (response.data.type === "success") {
                    setRestaurantAddStatus(response.data.type);

                    let alertBox = document.getElementById("alert-box");
                    alertBox.classList.add("alert-wrapper");
                    setStatusMessage(response.data.message);

                    //  for create variations
                    setTimeout(() => {
                        // Navigate("/admin/showRestaurant");
                    }, 900);

                } else {
                    setRestaurantAddStatus(response.data.type);
                    let alertBox = document.getElementById("alert-box");
                    alertBox.classList.add("alert-wrapper");
                    setStatusMessage(response.data.message);
                }
            } catch (error) {
                setRestaurantAddStatus("error");
                let alertBox = document.getElementById("alert-box");
                alertBox.classList.add("alert-wrapper");
                setStatusMessage("Restaurant not Update !");
            } finally {
                setButtonDisabled(false)
                setLoading(false)
            }

        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            setRestaurantAddStatus("");
            setStatusMessage("");
            let alertBox = document?.getElementById("alert-box");
            alertBox?.classList?.remove("alert-wrapper");
        }, 1500);

        return () => clearTimeout(timer);
    }, [restaurantAddStatus, statusMessage]);


    // for show google map
    const [marker, setMarker] = useState(null);
    const [place, setPlace] = useState(null);
    const mapRef = useRef(null);
    const autocompleteRef = useRef(null);

    const handleLoad = map => {
        mapRef.current = map;
    };

    const handleAutocompleteLoad = autocomplete => {
        autocompleteRef.current = autocomplete;
    };

    const handlePlaceChanged = () => {
        try {
            const place = autocompleteRef?.current?.getPlace();
            handleLocationChange(place?.geometry.location.lat(), place?.geometry.location.lng(), place?.formatted_address);
        } catch (error) {
            console.error('Error getting place', error);
        }
    };

    const handleMapClick = (event) => {
        // Clear search-related state variables
        setPlace(null);
        setAddress('');
        setZipcode('');
        setStreet('');
        setArea('');
        setNo('')
        autocompleteRef.current.value = '';

        handleLocationChange(event.latLng.lat(), event.latLng.lng());
    };

    const handleLocationChange = (lat, lng, address) => {
        setMarker({ lat, lng });
        setLat(lat);
        setLng(lng);
        mapRef?.current.panTo({ lat, lng });
        mapRef?.current.setZoom(16);

        // Reverse geocode to get address information
        const geocoder = new window.google.maps.Geocoder();
        geocoder.geocode({ location: { lat, lng } }, (results, status) => {
            if (status === 'OK') {
                const place = results[0];
                setAddress(address || place.formatted_address);

                for (let component of place.address_components) {
                    if (component?.types.includes('country')) {
                        setCountry(component?.long_name);
                    } else if (component?.types.includes('postal_code')) {
                        setZipcode(component?.long_name);
                    } else if (component?.types.includes('locality')) {
                        setCity(component?.long_name);
                    } else if (component?.types.includes('administrative_area_level_1')) {
                        setState(component?.long_name);
                    } else if (component?.types.includes('neighborhood')) {
                        setArea(component?.long_name);
                    } else if (component?.types.includes('route')) {
                        setStreet(component?.long_name);
                    }
                }
            } else {
                console.error('Error geocoding:', status);
            }
        });
    };

    const { isLoaded } = useLoadScript({
        googleMapsApiKey: googleMapsApiKeys,
        libraries: libraries,
    });

    if (!isLoaded) {
        return null;
    }



    return (
        <>
            <div className="main-content dark">
                <div className="page-content">
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-12">
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-12">
                                <div className="card">
                                    <div className="card-body">
                                        <form onSubmit={handleSubmit}>

                                            <div className="mb-3 row">
                                                <label
                                                    htmlFor="example-text-input"
                                                    className="col-md-2 col-form-label"
                                                >
                                                    Google:
                                                </label>
                                                <div className="col-md-9">
                                                    <GoogleMap
                                                        mapContainerStyle={containerStyle}
                                                        center={center}
                                                        zoom={10}
                                                        onLoad={handleLoad}
                                                        onClick={handleMapClick}
                                                    >
                                                        {marker && <Marker position={marker} />}
                                                        <Autocomplete
                                                            onLoad={handleAutocompleteLoad}
                                                            onPlaceChanged={handlePlaceChanged}
                                                        >
                                                            <input
                                                                type="text"
                                                                placeholder="Search for a place"
                                                                style={{
                                                                    boxSizing: `border-box`,
                                                                    border: `1px solid transparent`,
                                                                    width: `240px`,
                                                                    height: `32px`,
                                                                    padding: `0px 12px`,
                                                                    borderRadius: `3px`,
                                                                    boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
                                                                    fontSize: `14px`,
                                                                    outline: `none`,
                                                                    textOverflow: `ellipses`,
                                                                    position: "absolute",
                                                                    left: "50%",
                                                                    marginLeft: "-150px",
                                                                    marginTop: "10px",
                                                                }}
                                                            />
                                                        </Autocomplete>
                                                    </GoogleMap>
                                                </div>
                                            </div>

                                            <div className="mb-3 row">
                                                <div className="col-md-10 offset-md-2">
                                                    <div className="row mb-10">
                                                        <div className="col ms-auto">
                                                            <div className="d-flex flex-reverse flex-wrap gap-2">

                                                                <button
                                                                    className="btn btn-success"
                                                                    type="submit"
                                                                // disabled={buttonDisabled}
                                                                >
                                                                    {" "}
                                                                    <i className="fas fa-save"></i> Save{" "}
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <AlertBox status={restaurantAddStatus} statusMessage={statusMessage} />
            </div>
        </>
    )
}

export default CheckLocation
