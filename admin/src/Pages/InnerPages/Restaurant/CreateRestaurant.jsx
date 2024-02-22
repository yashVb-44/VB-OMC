import React, { useRef, useState } from "react";
import defualtImage from "../../../resources/assets/images/add-image.png";
import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AlertBox from "../../../Components/AlertComp/AlertBox"
import { GoogleMap, LoadScript, Autocomplete, Marker, useLoadScript, Polygon } from '@react-google-maps/api';

let url = process.env.REACT_APP_API_URL
const googleMapsApiKeys = `AIzaSyB744Cm87fQdMcweUbn26vqZfC7IYlVTTI`

const containerStyle = {
    width: '100%',
    height: '300px'
};

const center = {
    lat: 51.5,
    lng: -0.1
};

const CreateRestaurant = () => {

    const Navigate = useNavigate()
    const [restaurantName, setRestaurantName] = useState("");
    const [restaurantImage, setRestaurantImage] = useState("");
    const [restaurantLogo, setRestaurantLogo] = useState("")
    const [restaurantPdf, setRestaurantPdf] = useState("")
    const [email, setEmail] = useState("")
    const [mobileNo, setmobileNo] = useState("")
    const [password, setpassword] = useState("")

    const [openTime, setOpenTime] = useState("")
    const [closeTime, setCloseTime] = useState("")
    const [detailsOne, setDetailsOne] = useState("")
    const [detailsTwo, setDetailsTwo] = useState("")

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

    const [restaurantAddStatus, setRestaurantAddStatus] = useState();
    const [statusMessage, setStatusMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [buttonDisabled, setButtonDisabled] = useState(false);

    const [resturantFormData, setResturantFormData] = useState({
        days: {
            monday: { open_time: '', close_time: '', closed: false },
            tuesday: { open_time: '', close_time: '', closed: false },
            wednesday: { open_time: '', close_time: '', closed: false },
            thursday: { open_time: '', close_time: '', closed: false },
            friday: { open_time: '', close_time: '', closed: false },
            saturday: { open_time: '', close_time: '', closed: false },
            sunday: { open_time: '', close_time: '', closed: false },
        },
    })

    const handleDayChange = (day, field, value) => {
        setResturantFormData((prevData) => ({
            ...prevData,
            days: {
                ...prevData.days,
                [day]: {
                    ...prevData.days[day],
                    [field]: value,
                },
            },
        }));
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);
        setButtonDisabled(true)

        if (restaurantName !== "" && restaurantImage !== "") {
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
            formData.append("days", JSON.stringify(resturantFormData.days));

            try {
                const adminToken = localStorage.getItem('token');
                let response = await axios.post(
                    `${url}/restaurant/add/byAdmin`,
                    formData,
                    {
                        headers: {
                            Authorization: `${adminToken}`,
                            'Content-Type': 'multipart/form-data',
                        },
                    }
                );
                if (response.data.type === "success") {
                    setRestaurantAddStatus(response.data.type);
                    let alertBox = document.getElementById('alert-box')
                    alertBox.classList.add('alert-wrapper')
                    setStatusMessage(response.data.message);
                    setTimeout(() => {
                        Navigate('/admin/showRestaurant');
                    }, 900);
                } else {
                    setRestaurantAddStatus(response.data.type);
                    let alertBox = document.getElementById('alert-box')
                    alertBox.classList.add('alert-wrapper')
                    setStatusMessage(response.data.message);
                }
            } catch (error) {
                setRestaurantAddStatus("error");
                let alertBox = document.getElementById('alert-box')
                alertBox.classList.add('alert-wrapper')
                setStatusMessage("Restaurant not Add !");
            } finally {
                setLoading(false);
                setButtonDisabled(false)
            }
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            setRestaurantAddStatus("");
            setStatusMessage("");
            let alertBox = document?.getElementById('alert-box')
            alertBox?.classList?.remove('alert-wrapper')
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
                                    <h4 className="mb-0">Add Restaurant</h4>
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
                                                        // 
                                                        value={email}
                                                        onChange={(e) => {
                                                            setEmail(e.target.value);
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                            <div className="mb-3 row">
                                                <label
                                                    htmlFor="example-text-mobile_no"
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
                                                        id="example-text-mobile_no"
                                                        value={mobileNo}
                                                        onChange={(e) => {
                                                            setmobileNo(e.target.value);
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                            <div className="mb-3 row">
                                                <label
                                                    className="col-md-2 col-form-label"
                                                >
                                                    Restaurant Password:
                                                </label>
                                                <div className="col-md-10">
                                                    <input
                                                        required
                                                        className="form-control"
                                                        type="password"
                                                        // 
                                                        value={password}
                                                        onChange={(e) => {
                                                            setpassword(e.target.value);
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

                                                        {/* Define your polygon coordinates here */}
                                                        <Polygon
                                                            path={[
                                                                { lat: 51.5, lng: -0.1 },
                                                                { lat: 51.51, lng: -0.12 },
                                                                { lat: 51.52, lng: -0.1 },
                                                            ]}
                                                            options={{
                                                                fillColor: 'blue',
                                                                fillOpacity: 0.9,
                                                                strokeColor: 'blue',
                                                                strokeOpacity: 1,
                                                                strokeWeight: 1,
                                                            }}
                                                        />


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
                                                        required
                                                        className="form-control"
                                                        type="file"
                                                        onChange={(e) => {
                                                            setRestaurantImage(e.target.files[0])
                                                        }}

                                                    />
                                                    <div className="fileupload_img col-md-10 mt-3">
                                                        <img
                                                            type="image"
                                                            src={
                                                                restaurantImage
                                                                    ? URL.createObjectURL(restaurantImage)
                                                                    : defualtImage
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
                                                    Restaurant Logo:
                                                    <div className="imageSize">(Recommended Resolution: W-1000 x H-1000 or Square Image)</div>
                                                </label>
                                                <div className="col-md-10">
                                                    <input
                                                        required
                                                        className="form-control"
                                                        type="file"
                                                        onChange={(e) => {
                                                            setRestaurantLogo(e.target.files[0])
                                                        }}

                                                    />
                                                    <div className="fileupload_img col-md-10 mt-3">
                                                        <img
                                                            type="image"
                                                            src={
                                                                restaurantLogo
                                                                    ? URL.createObjectURL(restaurantLogo)
                                                                    : defualtImage
                                                            }
                                                            alt="restaurant logo"
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
                                                    <div className="imageSize">(Recommended Resolution:
                                                        W-971 X H-1500,
                                                        W-1295 X H-2000,
                                                        W-1618 X H-2500 )</div>
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
                                                        {/* Display a preview of the selected PDF if needed */}
                                                        {restaurantPdf && (
                                                            <embed
                                                                type="application/pdf"
                                                                src={URL.createObjectURL(restaurantPdf)}
                                                                width="100%"
                                                                height="200px"
                                                            />
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            {Object.keys(resturantFormData.days).map((day) => (
                                                <div key={day} className="mb-3 row">
                                                    <label
                                                        htmlFor="example-text-input"
                                                        className="col-md-2 col-form-label"
                                                    >
                                                        {day.charAt(0).toUpperCase() + day.slice(1)}:
                                                    </label>
                                                    <div className="col-md-4">
                                                        Open Time
                                                        <input
                                                            className="form-control"
                                                            type="time"
                                                            id="example-number-input"
                                                            name={`days.${day}.open_time`}
                                                            value={resturantFormData.days[day].open_time}
                                                            onChange={(e) => handleDayChange(day, 'open_time', e.target.value)}
                                                        />
                                                    </div>
                                                    <div className="col-md-4">
                                                        Close Time
                                                        <input
                                                            className="form-control"
                                                            type="time"
                                                            name={`days.${day}.close_time`}
                                                            value={resturantFormData.days[day].close_time}
                                                            onChange={(e) => handleDayChange(day, 'close_time', e.target.value)}
                                                        />
                                                    </div>
                                                    <div className="col-md-2">
                                                        <br></br>
                                                        Closed -
                                                        <input
                                                            class="form-check-input"
                                                            id="formrow-customCheck"
                                                            style={{ marginLeft: "8px" }}
                                                            type="checkbox"
                                                            name={`days.${day}.closed`}
                                                            checked={resturantFormData.days[day].closed}
                                                            onChange={(e) => handleDayChange(day, 'closed', e.target.checked)}
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                            <div className="row mb-10">
                                                <div className="col ms-auto">
                                                    <div className="d-flex flex-reverse flex-wrap gap-2">
                                                        <a className="btn btn-danger" onClick={() => Navigate('/admin/showRestaurant')}>
                                                            {" "}
                                                            <i className="fas fa-window-close"></i> Cancel{" "}
                                                        </a>
                                                        <button className="btn btn-success" type="submit" disabled={buttonDisabled}>
                                                            {" "}
                                                            <i className="fas fa-save"></i> Save{" "}
                                                        </button>
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
    );
};

export default CreateRestaurant;
