import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import GeoMaps from "./GeoMaps";
import { useLoadScript } from "@react-google-maps/api";
import { useSelector } from "react-redux";
import { addPolygoneOnMap } from "../../../../Redux/Actions/BackendActions/MapPolygoneActions";

let url = process.env.REACT_APP_API_URL;
const adminToken = localStorage.getItem("token");
const libraries = ["places"];


function AddGeoMap({ id, role }) {
  let btnRef = useRef();

  const selectedMapZoneData = useSelector(
    (state) => state?.MapPolyGoneDataChange?.payload
  );

  const selectedRestaurantId = useSelector((state) => state?.ShowMapPolygoneZoneDataChange?.payload)

  let { zone } = useParams();
  const [mapLocation, setLocation] = useState();
  const [restaurantData, setRestaurantData] = useState();
  const [latitude, setLatitude] = useState("");
  const [longitude, setlongitude] = useState("");
  const navigate = useNavigate();
  const [mapInfo, setMapInfo] = useState();

  const [color, setColor] = useState("Grey");
  let _color = ["Red", "Green", "Yellow", "Blue", "Pink", "Orange"];

  useEffect(() => {
    async function getRestaurant() {
      try {
        const adminToken = localStorage.getItem("token");
        const res = await axios.get(`${url}/restaurant/single/get/${role === "restaurant" ? id : selectedRestaurantId}`, {
          headers: {
            Authorization: `${adminToken}`,
          },
        });
        setRestaurantData(res?.data?.restaurant);
      } catch (error) { }
    }
    getRestaurant();
  }, [id]);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      await setLatitude(restaurantData?.lat);
      await setlongitude(restaurantData?.lng);

      try {
        const response1 = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${process.env.REACT_APP_GOOGLEAPI}`
        );
        const data1 = await response1.json();

        if (isMounted) {
          setLocation(data1.results[0].geometry.location);
        }

        const response2 = await axios.get(
          `${url}/mapZone/single/get/${selectedMapZoneData}?id=${selectedRestaurantId}`,
          {
            headers: {
              Authorization: `${adminToken}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (isMounted) {
          setMapInfo(response2.data?.mapZone);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [zone, latitude, longitude, restaurantData]);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLEAPI,
    libraries: libraries,
  });

  const center = mapLocation;
  const [state, setState] = useState([]);
  const { paths } = state;

  const new_path = JSON.stringify(state.paths);

  const saveMap = async () => {
    await axios
      .post(
        `${url}/mapZone/polygone/add/byRestaurantOrAdmin?id=${selectedRestaurantId}`,
        { mapZone: mapInfo?._id, coordinates: new_path, color: color },
        {
          headers: {
            Authorization: `${adminToken}`,
          },
        }
      )
      .then((response) => {
        if (response) {
          alert(`${response.data.message}`);
        } else {
          alert("Something went wrong");
        }
      })
      .catch((err) => {
        console.log(err);
      });

    if (btnRef.current) {
      btnRef.current.setAttribute("disabled", "disabled");
    }
  };

  const handleColorChange = (e) => setColor(e.target.value);

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
                    <select class="form-select" value={color} onChange={handleColorChange}>
                      <option>Select Color</option>
                      {_color.map((item, index) => (
                        <option key={index}>{item}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <GeoMaps
                  apiKey={process.env.REACT_APP_GOOGLEAPI}
                  center={center}
                  paths={paths}
                  point={(paths) => setState({ paths })}
                  color={color}
                  setColor={setColor}
                />
              </div>
              <div className="mt-3 row">
                <div className="col-md-10 offset-md-12">
                  <div className="row mb-10">
                    <div className="col ms-auto">
                      <div className="d-flex flex-reverse flex-wrap gap-2">
                        <a
                          className="btn btn-danger"
                          onClick={() => navigate("/admin/deliveryZone")}
                        >
                          {" "}
                          <i className="fas fa-window-close"></i> Go Back{" "}
                        </a>
                        {paths && paths.length > 1 ? (
                          <button ref={btnRef}
                            onClick={saveMap}
                            className="btn btn-success"
                          >
                            {" "}
                            <i className="fas fa-save"></i> Save{" "}
                          </button>
                        ) : null}
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

export default AddGeoMap;
