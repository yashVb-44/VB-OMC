const express = require('express');
const route = express.Router();
const geolib = require('geolib');
const MapPolygoneZone = require('../../Models/Map/mapPolygoneZone');

// Route to check if a given point (latitude, longitude) is inside any polygon
route.get('/checkPointInPolygons', async (req, res) => {
    try {
        const { lat, lng } = req.query;

        if (!lat || !lng) {
            return res.status(400).json({ error: 'Latitude, longitude are required.' });
        }

        const point = { latitude: parseFloat(lat), longitude: parseFloat(lng) };
        // const point = { latitude: 40.73663600697492, longitude: -74.00808658910869 }

        const polygons = await MapPolygoneZone.find().lean();

        if (!polygons || polygons.length === 0) {
            return res.status(404).json({ error: 'No polygons found for the specified Map Zone ID' });
        }

        let isInsideAnyPolygon = false;

        for (const polygon of polygons) {
            const coordinates = JSON?.parse(polygon.coordinates).map(coord => ({
                latitude: parseFloat(coord.lat),
                longitude: parseFloat(coord.lng)
            }));

            // const point = { latitude: 51.5125, longitude: 7.485 };
            // const polygonssss = [
            //     { latitude: 40.73663600697492, longitude: -74.00808658910869 },
            //     { latitude: 40.699945935504616, longitude: -74.01529636694072 }, { latitude: 40.729091473940414, longitude: -73.97169437719462 }, { latitude: 40.75328298354466, longitude: -73.98474064184306 },
            //     { latitude: 40.753543059491186, longitude: -74.00808658910869 }, { latitude: 40.73403454049611, longitude: -74.00842991186259 }
            // ];

            if (geolib.isPointInPolygon(point, coordinates)) {
                isInsideAnyPolygon = true;
                break;
            }

        }

        if (isInsideAnyPolygon) {
            res.json({ result: 'Point is inside at least one polygon' });
        } else {
            res.json({ result: 'Point is outside all polygons' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = route;
