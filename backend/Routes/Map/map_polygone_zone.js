const express = require('express')
const route = express.Router()
const multer = require('multer')
const MapZone = require('../../Models/Map/mapZone')
const MapPolyGoneZone = require('../../Models/Map/mapPolygoneZone')
const fs = require('fs');
const restaurantMiddleWare = require('../../Middleware/restaurantMiddleWares')
const adminMiddleWare = require('../../Middleware/adminMiddleWares')
const checkAdminOrRestaurant = require('../../Middleware/checkAdminOrRestaurant')


// Create Map Zone
route.post('/add/byRestaurantOrAdmin', checkAdminOrRestaurant, async (req, res) => {

    try {

        const { role, id } = req.admin
        const ids = req.query.id

        let restaurantId

        if (role === "admin") {
            restaurantId = ids;
        } else {
            restaurantId = id
        }

        const { mapZone, coordinates, color } = req.body;

        const existingZone = await MapZone.findOne({ _id: mapZone, restaurant: restaurantId });

        if (!existingZone) {
            return res.status(202).json({ type: "warning", message: "Zone is not exists!" });
        }

        const newMapPolygoneZone = new MapPolyGoneZone({
            mapZone,
            coordinates,
            color,
        });

        await newMapPolygoneZone.save()
        return res.status(200).json({ type: 'success', message: 'Map Polygone Zone added successfully!' });

    } catch (error) {
        console.log(error)
        return res.status(500).json({ type: 'error', message: 'Server Error!', errorMessage: error.message });
    }
});

//  get all Map Polygone Zone for particular zone
route.get('/getAll/byZone/:id', checkAdminOrRestaurant, async (req, res) => {
    const MapZoneId = req.params.id
    try {
        const mapPolyGoneZone = await MapPolyGoneZone.find({ mapZone: MapZoneId }).populate({
            path: 'mapZone',
            select: "-status"
        })

        if (!mapPolyGoneZone) {
            return res.status(404).json({ type: "warning", message: "No Map Polygone Zone found!", mapPolyGoneZone: [] })
        }

        else {
            const result = mapPolyGoneZone.map(zone => ({
                ...zone.toObject(),
            }));
            // const result = {
            //     _id: mapZone?._id,
            //     zone: mapZone?.zone,
            //     latitude: mapZone?.latitude,
            //     longitude: mapZone?.longitude,
            //     restaurant: {
            //         _id: checkRestaurant._id,
            //         name: checkRestaurant.name,
            //     },
            // }
            res.status(200).json({ type: "success", message: "Map Polygone Zone found successfully!", mapPolyGoneZone: result || [] })
        };
    } catch (error) {
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error })
        console.log(error)
    }
});

//  get all Map Polygone Zone 
route.get('/getAll', checkAdminOrRestaurant, async (req, res) => {

    try {
        const mapPolyGoneZone = await MapPolyGoneZone.find().populate({
            path: 'mapZone',
            select: "-status"
        })

        if (!mapPolyGoneZone) {
            return res.status(404).json({ type: "warning", message: "No Map Polygone Zone found!", mapPolyGoneZone: [] })
        }

        else {
            const result = mapPolyGoneZone.map(zone => ({
                ...zone.toObject(),
            }));
            // const result = {
            //     _id: mapZone?._id,
            //     zone: mapZone?.zone,
            //     latitude: mapZone?.latitude,
            //     longitude: mapZone?.longitude,
            //     restaurant: {
            //         _id: checkRestaurant._id,
            //         name: checkRestaurant.name,
            //     },
            // }
            res.status(200).json({ type: "success", message: "Map Polygone Zone found successfully!", mapPolyGoneZone: result || [] })
        };
    } catch (error) {
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error })
        console.log(error)
    }
});

// Update Map Polygone Zone by id
route.post('/update/byRestaurantOrAdmin/:id', checkAdminOrRestaurant, async (req, res) => {

    const mapZoneId = req.params.id


    try {
        const { mapZone, coordinates, color } = req.body;

        const existingPolygone = await MapPolyGoneZone.findOne({ mapZone: mapZoneId });

        if (!existingPolygone) {
            return res.status(202).json({ type: "warning", message: "Polygone is not exists!" });
        } else {
            existingPolygone.color = color
            existingPolygone.coordinates = coordinates
        }

        await existingPolygone.save()
        return res.status(200).json({ type: 'success', message: 'Map Polygone Zone update successfully!' });

    } catch (error) {
        console.log(error)
        return res.status(500).json({ type: 'error', message: 'Server Error!', errorMessage: error.message });
    }
});

// Delete a specific Polygone by Zone ID
route.delete('/single/delete/:id', checkAdminOrRestaurant, async (req, res) => {
    const zoneId = req.params.id;

    try {
        // const mapZone = await  MapPolyGoneZone.findOneAndDelete({ _id: polygoneId });
        const mapPolyGoneZone = await MapPolyGoneZone.findOne({ mapZone: zoneId });
        if (!mapPolyGoneZone) {
            res.status(404).json({ type: "error", message: "Polygone not found!" });
        } else {

            await MapPolyGoneZone.findOneAndDelete({ mapZone: zoneId });
            res.status(200).json({ type: "success", message: "Polygone deleted successfully!" });
        }
    } catch (error) {
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error });
    }
});

// Get All zones with polygone
route.get('/viewAllMaps', checkAdminOrRestaurant, async (req, res) => {
    try {
        const mapPolygoneZones = await MapPolyGoneZone.find({}, 'coordinates color'); // Assuming you want only 'coordinates' and 'color' fields

        res.status(200).json({ type: "success", message: "Map Polygone Zone found successfully!", mapPolyGoneZone: mapPolygoneZones || [] })

    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Something went wrong' });
    }
});

module.exports = route;