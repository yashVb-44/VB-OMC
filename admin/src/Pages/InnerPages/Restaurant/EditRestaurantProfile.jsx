import React, { useRef, useState } from "react";
import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import 'react-quill/dist/quill.snow.css';
import { useSelector } from "react-redux";
import AlertBox from "../../../Components/AlertComp/AlertBox";
import defualtImage from "../../../resources/assets/images/add-image.png";

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

const EditRestaurantProfile = ({ id }) => {

    const adminToken = localStorage.getItem('token');
    const Navigate = useNavigate()
    const [restaurantData, setRestaurantData] = useState({})
    const [loading, setLoading] = useState(false);
    const [buttonDisabled, setButtonDisabled] = useState(false);

    useEffect(() => {
        async function getRestaurant() {
            try {
                const res = await axios.get(`${url}/restaurant/single/get/${id}`,
                    {
                        headers: {
                            Authorization: `${adminToken}`,
                        },
                    });
                setRestaurantData(res?.data?.restaurant || {});
            } catch (error) {
                console.log(error)
            }
        }
        getRestaurant();
    }, [id]);


    useEffect(() => {
        setRestaurantName(restaurantData?.name);
        setEmail(restaurantData?.email);
        setmobileNo(restaurantData?.mobileNo);
        setpassword(restaurantData?.password);
        setAddress(restaurantData?.address);
        setCountry(restaurantData?.country);
        setState(restaurantData?.state);
        setCity(restaurantData?.city);
        setZipcode(restaurantData?.zipcode);
        setArea(restaurantData?.area);
        setStreet(restaurantData?.street);
        setNo(restaurantData?.no);
        setLat(restaurantData?.lat)
        setLng(restaurantData?.lng)

        setOpenTime(restaurantData?.open_time)
        setCloseTime(restaurantData?.close_time)
        setDetailsOne(restaurantData?.bankdetailsOne)
        setDetailsTwo(restaurantData?.bankdetailsTwo)

        setPreviewRestaurantImage(restaurantData?.image)
        setPreviewRestaurantLogo(restaurantData?.logo)
        setPreviewRestaurantPdf(restaurantData?.other)

    }, [restaurantData])

    const [restaurantName, setRestaurantName] = useState("");
    const [restaurantImage, setRestaurantImage] = useState();
    const [restaurantLogo, setRestaurantLogo] = useState("")
    const [restaurantPdf, setRestaurantPdf] = useState("")
    const [email, setEmail] = useState("")
    const [mobileNo, setmobileNo] = useState("")
    const [password, setpassword] = useState("")

    const [no, setNo] = useState("")
    const [address, setAddress] = useState("")
    const [lat, setLat] = useState("")
    const [lng, setLng] = useState("")
    const [zipcode, setZipcode] = useState("")
    const [city, setCity] = useState("")
    const [state, setState] = useState("")
    const [country, setCountry] = useState("")
    const [area, setArea] = useState("")
    const [street, setStreet] = useState("")
    const [libraries] = useState(['places'])

    const [openTime, setOpenTime] = useState("")
    const [closeTime, setCloseTime] = useState("")
    const [detailsOne, setDetailsOne] = useState("")
    const [detailsTwo, setDetailsTwo] = useState("")

    const [restaurantAddStatus, setRestaurantAddStatus] = useState();
    const [statusMessage, setStatusMessage] = useState("");
    const [previewRestaurantImage, setPreviewRestaurantImage] = useState("")
    const [previewRestaurantLogo, setPreviewRestaurantLogo] = useState("")
    const [previewRestaurantPdf, setPreviewRestaurantPdf] = useState("")


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
                                <div className="page-title-box d-flex align-items-center justify-content-between">
                                    <h4 className="mb-0">Edit Restaurant</h4>
                                    {loading && <div className="loader">Loading...</div>}
                                </div>
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
                                                    Restaurant Name:
                                                </label>
                                                <div className="col-md-10">
                                                    <input
                                                        required
                                                        className="form-control"
                                                        type="text"
                                                        id="example-text-input"
                                                        value={restaurantName}
                                                        onChange={(e) => {
                                                            setRestaurantName(e.target.value);
                                                        }}
                                                    />
                                                </div>
                                            </div>

                                            <div className="mb-3 row">
                                                <label
                                                    htmlFor="example-text-input"
                                                    className="col-md-2 col-form-label"
                                                >
                                                    Restaurant Email:
                                                </label>
                                                <div className="col-md-10">
                                                    <input
                                                        required
                                                        className="form-control"
                                                        type="email"
                                                        // id="example-text-input"
                                                        value={email}
                                                        onChange={(e) => {
                                                            setEmail(e.target.value);
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                            <div className="mb-3 row">
                                                <label
                                                    htmlFor="example-text-input"
                                                    className="col-md-2 col-form-label"
                                                >
                                                    Restaurant Mobile No:
                                                </label>
                                                <div className="col-md-10">
                                                    <input
                                                        required
                                                        className="form-control"
                                                        type="tel"
                                                        pattern="[0-9]{10}"
                                                        id="example-text-input"
                                                        value={mobileNo}
                                                        onChange={(e) => {
                                                            setmobileNo(e.target.value);
                                                        }}
                                                    />
                                                </div>
                                            </div>
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
                                                <label
                                                    htmlFor="example-text-input"
                                                    className="col-md-2 col-form-label"
                                                >
                                                    Restaurant No:
                                                </label>
                                                <div className="col-md-10">
                                                    <input
                                                        required
                                                        className="form-control"
                                                        type="text"

                                                        value={no}
                                                        onChange={(e) => {
                                                            setNo(e.target.value);
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                            {/* <div className="mb-3 row">
                                                <label
                                                    htmlFor="example-text-input"
                                                    className="col-md-2 col-form-label"
                                                >
                                                    Restaurant Password:
                                                </label>
                                                <div className="col-md-10">
                                                    <input
                                                        required
                                                        className="form-control"
                                                        type="password"
                                                        // id="example-text-input"
                                                        value={password}
                                                        onChange={(e) => {
                                                            setpassword(e.target.value);
                                                        }}
                                                    />
                                                </div>
                                            </div> */}
                                            <div className="mb-3 row">
                                                <label
                                                    htmlFor="example-text-input"
                                                    className="col-md-2 col-form-label"
                                                >
                                                    Full Address:
                                                </label>
                                                <div className="col-md-10">
                                                    <textarea
                                                        required
                                                        className="form-control"
                                                        type="text"
                                                        id="example-text-input"
                                                        value={address}
                                                        onChange={(e) => {
                                                            setAddress(e.target.value);
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                            <div className="mb-3 row">
                                                <label
                                                    htmlFor="example-text-input"
                                                    className="col-md-2 col-form-label"
                                                >
                                                    Country:
                                                </label>
                                                <div className="col-md-10">
                                                    <input
                                                        required
                                                        className="form-control"
                                                        type="text"

                                                        value={country}
                                                        onChange={(e) => {
                                                            setCountry(e.target.value);
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                            <div className="mb-3 row">
                                                <label
                                                    htmlFor="example-text-input"
                                                    className="col-md-2 col-form-label"
                                                >
                                                    State:
                                                </label>
                                                <div className="col-md-10">
                                                    <input
                                                        required
                                                        className="form-control"
                                                        type="text"
                                                        id="example-text-input"
                                                        value={state}
                                                        onChange={(e) => {
                                                            setState(e.target.value);
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                            <div className="mb-3 row">
                                                <label
                                                    htmlFor="example-text-input"
                                                    className="col-md-2 col-form-label"
                                                >
                                                    City:
                                                </label>
                                                <div className="col-md-10">
                                                    <input
                                                        required
                                                        className="form-control"
                                                        type="text"
                                                        id="example-text-input"
                                                        value={city}
                                                        onChange={(e) => {
                                                            setCity(e.target.value);
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                            <div className="mb-3 row">
                                                <label
                                                    htmlFor="example-text-input"
                                                    className="col-md-2 col-form-label"
                                                >
                                                    Zip code:
                                                </label>
                                                <div className="col-md-10">
                                                    <input
                                                        required
                                                        className="form-control"
                                                        type="text"
                                                        id="example-text-input"
                                                        value={zipcode}
                                                        onChange={(e) => {
                                                            setZipcode(e.target.value);
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                            <div className="mb-3 row">
                                                <label
                                                    htmlFor="example-text-input"
                                                    className="col-md-2 col-form-label"
                                                >
                                                    Area:
                                                </label>
                                                <div className="col-md-10">
                                                    <input
                                                        className="form-control"
                                                        type="text"

                                                        value={area}
                                                        onChange={(e) => {
                                                            setArea(e.target.value);
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                            <div className="mb-3 row">
                                                <label
                                                    htmlFor="example-text-input"
                                                    className="col-md-2 col-form-label"
                                                >
                                                    Street Name:
                                                </label>
                                                <div className="col-md-10">
                                                    <input
                                                        className="form-control"
                                                        type="text"

                                                        value={street}
                                                        onChange={(e) => {
                                                            setStreet(e.target.value);
                                                        }}
                                                    />
                                                </div>
                                            </div>

                                            <div className="mb-3 row">
                                                <label
                                                    htmlFor="example-text-input"
                                                    className="col-md-2 col-form-label"
                                                >
                                                    Bank Details 1:
                                                </label>
                                                <div className="col-md-10">
                                                    <input
                                                        className="form-control"
                                                        type="input"

                                                        value={detailsOne}
                                                        onChange={(e) => {
                                                            setDetailsOne(e.target.value);
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                            <div className="mb-3 row">
                                                <label
                                                    htmlFor="example-text-input"
                                                    className="col-md-2 col-form-label"
                                                >
                                                    Bank Details 2:
                                                </label>
                                                <div className="col-md-10">
                                                    <input
                                                        className="form-control"
                                                        type="input"

                                                        value={detailsTwo}
                                                        onChange={(e) => {
                                                            setDetailsTwo(e.target.value);
                                                        }}
                                                    />
                                                </div>
                                            </div>

                                            <div className="mb-3 row">
                                                <label
                                                    htmlFor="example-text-input"
                                                    className="col-md-2 col-form-label"
                                                >
                                                    Restaurant Image:
                                                    <div className="imageSize">(Recommended Resolution: W-1000 x H-1000 or Square Image)</div>
                                                </label>
                                                <div className="col-md-10">
                                                    <input
                                                        className="form-control"
                                                        type="file"
                                                        onChange={(e) => {
                                                            setRestaurantImage(e.target.files[0])
                                                        }}
                                                        accept=".png .jpg .jpeg"
                                                    // id="example-text-input"
                                                    />
                                                    <div className="fileupload_img col-md-10 mt-3">
                                                        <img
                                                            type="image"
                                                            src={
                                                                restaurantImage
                                                                    ? URL.createObjectURL(restaurantImage)
                                                                    : `${previewRestaurantImage}`
                                                            }
                                                            alt="restaurant image"
                                                            height={100}
                                                            width={100}
                                                            accept=".png .jpg .jpeg"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="mb-3 row">
                                                <label
                                                    htmlFor="example-text-input"
                                                    className="col-md-2 col-form-label"
                                                >
                                                    Restaurant Logo:
                                                    <div className="imageSize">(Recommended Resolution: W-1000 x H-1000 or Square Image)</div>
                                                </label>
                                                <div className="col-md-10">
                                                    <input
                                                        className="form-control"
                                                        type="file"
                                                        onChange={(e) => {
                                                            setRestaurantLogo(e.target.files[0])
                                                        }}
                                                        accept=".png .jpg .jpeg"
                                                    // id="example-text-input"
                                                    />
                                                    <div className="fileupload_img col-md-10 mt-3">
                                                        <img
                                                            type="image"
                                                            src={
                                                                restaurantLogo
                                                                    ? URL.createObjectURL(restaurantLogo)
                                                                    : `${previewRestaurantLogo}`
                                                            }
                                                            alt="restaurant image"
                                                            height={100}
                                                            width={100}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="mb-3 row">
                                                <label
                                                    htmlFor="example-text-input"
                                                    className="col-md-2 col-form-label"
                                                >
                                                    Other document:
                                                    <div className="imageSize">(Recommended Resolution: W-1000 x H-1000 or Square Image)</div>
                                                </label>
                                                <div className="col-md-10">
                                                    <input
                                                        className="form-control"
                                                        type="file"
                                                        onChange={(e) => {
                                                            const selectedFile = e.target.files[0];
                                                            if (selectedFile && selectedFile.size > 10000000) {
                                                                alert('File size is too large. Maximum size allowed is 10MB.');
                                                                e.target.value = '';
                                                                return;
                                                            }
                                                            setRestaurantPdf(selectedFile)
                                                        }}
                                                        // id="example-text-input"
                                                        accept=".pdf"
                                                    />
                                                    <div className="fileupload_img col-md-10 mt-3">
                                                        {restaurantPdf && (
                                                            <embed
                                                                type="application/pdf"
                                                                src={restaurantPdf ? URL.createObjectURL(restaurantPdf) : `${previewRestaurantPdf}`}
                                                                width="100%"
                                                                height="200px"
                                                            />
                                                        )}
                                                    </div>
                                                    <div className="fileupload_img col-md-10 mt-3">
                                                        {previewRestaurantPdf && !restaurantPdf && (
                                                            <embed
                                                                type="application/pdf"
                                                                src={`${previewRestaurantPdf}`}
                                                                width="100%"
                                                                height="200px"
                                                            />
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="mb-3 row">
                                                <div className="col-md-10 offset-md-2">
                                                    <div className="row mb-10">
                                                        <div className="col ms-auto">
                                                            <div className="d-flex flex-reverse flex-wrap gap-2">
                                                                {/* <a
                                                                    className="btn btn-danger"
                                                                    onClick={() => Navigate("/admin/showRestaurant")}
                                                                >
                                                                    {" "}
                                                                    <i className="fas fa-window-close"></i> Cancel{" "}
                                                                </a> */}
                                                                <button
                                                                    className="btn btn-success"
                                                                    type="submit"
                                                                    disabled={buttonDisabled}
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

export default EditRestaurantProfile
