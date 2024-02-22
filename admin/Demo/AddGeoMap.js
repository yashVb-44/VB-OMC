import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import GeoMaps from './GeoMaps';
import { useLoadScript } from '@react-google-maps/api';

function AddGeoMap() {
  let btnRef = useRef();

  let { name } = useParams()
  const [mapLocation, setLocation] = useState();
  const history = useNavigate();
  const [mapInfo, setMapInfo] = useState([])

  const [color, setColor] = useState('Grey')
  let _color = ['Red', 'Green', 'Yellow', 'Blue', 'Pink', 'Orange']

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        const response1 = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${name}&key=${process.env.REACT_APP_GOOGLEAPI}`);
        const data1 = await response1.json();

        if (isMounted) {
          setLocation(data1.results[0].geometry.location);
        }

        const response2 = await axios.post("http://localhost:8000/api/getMapInfo", { name: name });
        if (isMounted) {
          setMapInfo(response2.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [name]);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLEAPI,
  });



  const center = mapLocation;
  const [state, setState] = useState([])
  const { paths } = state


  const new_path = JSON.stringify(state.paths)



  const saveMap = async () => {
    await axios.post("http://localhost:8000/api/addMap", { parentId: mapInfo[0]?.id, coordinates: new_path, color: color })
      .then(response => {
        if (response) {
          alert(`${response.data.msg}`)
        }
        else {
          alert("Something went wrong")
        }
      })
      .catch(err => {
        console.log(err)
      })

    if (btnRef.current) {
      btnRef.current.setAttribute("disabled", "disabled")
    }
  }

  const handleColorChange = (e) => setColor(e.target.value)

  if (loadError) return 'Error loading maps';
  if (!isLoaded) return 'Loading maps';


  return (
    <div>
      <select value={color} onChange={handleColorChange}>
        <option>Select</option>
        {
          _color.map((item, index) =>
            <option key={index}>{item}</option>
          )
        }
      </select>

      <GeoMaps
        apiKey={process.env.REACT_APP_GOOGLEAPI}
        center={center}
        paths={paths}
        point={paths => setState({ paths })}
        color={color}
        setColor={setColor}
      />
      <br /><br /><br /><br />
      {
        paths && paths.length > 1
          ?
          <button ref={btnRef} onClick={saveMap}>Save Map</button>
          :
          null
      }
      <button onClick={() => history("/")}>Go Back</button>

    </div>
  )
}

export default AddGeoMap