const express = require('express')
const route = express.Router()
const multer = require('multer')
const MapZone = require('../../Models/Map/mapZone')
const Restaurant = require('../../Models/Admin/restaurant_model')
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

        const { zone, latitude, longitude } = req.body;

        const existingZone = await MapZone.findOne({ zone, restaurant: restaurantId });

        if (existingZone) {
            return res.status(202).json({ type: "warning", message: "Zone is already exists!" });
        }

        const newMapZone = new MapZone({
            zone,
            latitude,
            longitude,
            restaurant: restaurantId
        });


        await newMapZone.save()
        return res.status(200).json({ type: 'success', message: 'Map Zone added successfully!', id: newMapZone?._id });

    } catch (error) {
        console.log(error)
        return res.status(500).json({ type: 'error', message: 'Server Error!', errorMessage: error.message });
    }
});

//  get single Map Zone
route.get('/single/get/:id', checkAdminOrRestaurant, async (req, res) => {

    const mapZoneId = req.params.id

    try {

        const { role, id } = req.admin
        const ids = req.query.id
        let restaurantId

        if (role === "admin") {
            restaurantId = ids;
        } else {
            restaurantId = id
        }


        const mapZone = await MapZone.findById(mapZoneId).populate({
            path: 'restaurant',
            select: "name"
        })

        if (!mapZone) {
            return res.status(404).json({ type: "warning", message: "No Map Zone found!", mapZone: {} })
        }

        const checkRestaurant = await Restaurant.findById(mapZone.restaurant?._id);


        // Check if the authenticated restaurant is authorized for the requested map zone
        if (!checkRestaurant || checkRestaurant._id.toString() !== restaurantId?.toString()) {
            return res.status(403).json({ type: "error", message: "Unauthorized. You are not allowed to access this Map Zone." });
        }

        else {
            const result = {
                _id: mapZone?._id,
                zone: mapZone?.zone,
                latitude: mapZone?.latitude,
                longitude: mapZone?.longitude,
                restaurant: {
                    _id: checkRestaurant._id,
                    name: checkRestaurant.name,
                },
            }

            res.status(200).json({ type: "success", message: "Map Zone found successfully!", mapZone: result || [] })
        };
    } catch (error) {
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error })
        // console.log(error)
    }
});

//  get all Map Zone for particular restaurant
route.get('/getAll/byRestaurantOrAdmin', checkAdminOrRestaurant, async (req, res) => {

    try {

        const { role, id } = req.admin
        const ids = req.query.id
        let restaurantId

        if (role === "admin") {
            restaurantId = ids;
        } else {
            restaurantId = id
        }

        const mapZone = await MapZone.find({ restaurant: restaurantId }).populate({
            path: 'restaurant',
            select: "name"
        })

        if (!mapZone) {
            return res.status(404).json({ type: "warning", message: "No Map Zone found!", mapZone: [] })
        } else {
            const result = mapZone.map(zone => ({
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
            res.status(200).json({ type: "success", message: "Map Zone found successfully!", mapZone: result || [] })
        };
    } catch (error) {
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error })
        console.log(error)
    }
});

// Delete a specific Map Zone by ID
route.delete('/single/delete/:id', checkAdminOrRestaurant, async (req, res) => {
    const mapZoneId = req.params.id;
    try {
        const mapZone = await MapZone.findById(mapZoneId);
        if (!mapZone) {
            res.status(404).json({ type: "warning", message: "Map Zone not found!" });
        } else {

            await MapZone.findByIdAndDelete(mapZoneId);
            res.status(200).json({ type: "success", message: "Map Zone deleted successfully!" });
        }
    } catch (error) {
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error });
    }
});

// Update Map Polygone Zone name by id
route.post('/name/update/byRestaurantOrAdmin/:id', checkAdminOrRestaurant, async (req, res) => {

    const mapZoneId = req.params.id

    try {
        const { name } = req.body;

        const existingMapZone = await MapZone.findOne({ zone: name, _id: { $ne: mapZoneId } });

        if (existingMapZone) {
            return res.status(202).json({ type: "warning", message: "Map Zone with this name already exists!" });
        }

        const isMapZone = await MapZone.findById(mapZoneId)

        if (!isMapZone) {
            return res.status(202).json({ type: "warning", message: "Map Zone is not exists!" });
        }

        isMapZone.zone = name

        await isMapZone.save()

        return res.status(200).json({ type: 'success', message: 'Map zone name update successfully!' });

    } catch (error) {
        console.log(error)
        return res.status(500).json({ type: 'error', message: 'Server Error!', errorMessage: error.message });
    }
});



module.exports = route;