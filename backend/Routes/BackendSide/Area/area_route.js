const express = require('express')
const route = express.Router()
const multer = require('multer')
const Area = require('../../../Models/BackendSide/area_model')
const fs = require('fs');
const axios = require('axios')


// add state by admin
route.post('/add', async (req, res) => {
    const { name, country, state, city } = req.body;

    try {
        const existingArea = await Area.findOne({ name, country, state, city });

        if (existingArea) {
            return res.status(200).json({ type: "warning", message: "Area already exists!" });
        }

        const area = new Area({
            name,
            country,
            state,
            city
        });

        await area.save();
        res.status(200).json({ type: "success", message: "Area add successfully!" });
    } catch (error) {
        console.log(error)
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error });
    }
});

// get all area 
route.get('/list/get', async (req, res) => {
    try {
        const area = await Area.find().sort({ createdAt: -1 });

        if (area) {

            const result = area.map(area => ({
                _id: area?._id,
                name: area?.name,
                state: area?.state,
                country: area?.country,
                city: area?.city,
                feature: area?.feature,
                status: area?.status
            }))
            return res.status(201).json({ type: "success", message: "Area found successfully!", area: result || [] })
        }
        else {
            return res.status(404).json({ type: "warning", message: "No Area Found!", area: [] })
        }

    } catch (error) {
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error })
        console.log(error)
    }
});

// get all area (for frotend side list)
route.get('/list/getAll', async (req, res) => {
    try {
        const area = await Area.find().sort({ createdAt: -1 });

        if (area) {

            const result = area.map(area => ({
                name: area?.name,
            }))
            return res.status(201).json({ type: "success", message: "Area found successfully!", area: result || [] })
        }
        else {
            return res.status(404).json({ type: "warning", message: " No Area Found!", area: [] })
        }

    } catch (error) {
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error })
        console.log(error)
    }
});

// route to get all areas for a specific state
route.get('/list/get/byCity', async (req, res) => {
    try {
        const { city } = req.query;

        if (!city) {
            return res.status(404).json({ type: "warning", message: "Please provide valid City!", area: [] })
        }

        // Find areas in the specified city from MongoDB
        const areas = await Area.find({ city }, { __v: 0 });
        if (areas) {

            const result = areas.map(area => ({
                _id: area?._id,
                name: area?.name,
            }))
            return res.status(201).json({ type: "success", message: "Area found successfully!", area: result || [] })
        }
        else {
            return res.status(404).json({ type: "warning", message: "No Area Found!", area: [] })
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error })
    }
});

// Get Particular area by id
route.get('/single/get/:id', async (req, res) => {
    const areaId = req.params.id
    try {
        const area = await Area.findById(areaId)

        if (area) {

            const result = {
                _id: area?._id,
                name: area?.name,
                state: area?.state,
                country: area?.country,
                city: area?.city,
                feature: area?.feature,
                status: area?.status
            }
            return res.status(201).json({ type: "success", message: "Area found successfully!", area: result })
        }
        else {
            return res.status(404).json({ type: "warning", message: "No Area Found!", area: [] })
        }

    } catch (error) {
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error })
        console.log(error)
    }
});

// route to get all areas for a specific state (for frotend side list)
route.get('/get/byCity', async (req, res) => {
    try {
        const { city } = req.query;

        if (!city) {
            return res.status(404).json({ type: "warning", message: "Please provide valid City!", area: [] })
        }

        // Find areas in the specified city from MongoDB
        const areas = await Area.find({ city }, { __v: 0 });
        if (areas) {

            const result = areas.map(area => ({
                name: area?.name,
            }))
            return res.status(201).json({ type: "success", message: "Area found successfully!", area: result || [] })
        }
        else {
            return res.status(404).json({ type: "warning", message: "No Area Found!", area: [] })
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error })
    }
});

// Delete all areas
route.delete('/delete/all', async (req, res) => {
    try {
        const areas = await Area.find();
        await Area.deleteMany();
        res.status(200).json({ type: "success", message: "All Area deleted successfully!" });
    } catch (error) {
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error });
    }
});

// Delete a specific area by ID
route.delete('/delete/:id', async (req, res) => {
    const areaId = req.params.id;
    try {
        const area = await Area.findById(areaId);
        if (!area) {
            res.status(404).json({ type: "error", message: "Area not found!" });
        } else {
            await Area.findByIdAndDelete(areaId);
            res.status(200).json({ type: "success", message: "Area deleted successfully!" });
        }
    } catch (error) {
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error });
    }
});

// Delete multiple areas by IDs
route.delete('/deletes', async (req, res) => {
    try {
        const { ids } = req.body;
        const areas = await Area.find({ _id: { $in: ids } });

        await Area.deleteMany({ _id: { $in: ids } });
        res.status(200).json({ type: "success", message: "All Area deleted successfully!" });
    } catch (error) {
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error });
    }
});

// update only Area status 
route.put("/update/status/:id", async (req, res) => {

    const AreaId = await req.params.id

    try {
        const { status } = req.body
        const newArea = await Area.findByIdAndUpdate(AreaId)
        newArea.status = await status

        await newArea.save()
        res.status(200).json({ type: "success", message: "Area Status update successfully!" })

    } catch (error) {
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error })
    }

})

// update only Area feature 
route.put("/update/feature/:id", async (req, res) => {

    const AreaId = await req.params.id

    try {
        const { feature } = req.body
        const newArea = await Area.findByIdAndUpdate(AreaId)
        newArea.feature = await feature

        await newArea.save()
        res.status(200).json({ type: "success", message: "Area Status update successfully!" })

    } catch (error) {
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error })
    }

})

// Update a specific area by ID
route.put('/update/byAdmin/:id', async (req, res) => {
    const areaId = req.params.id;
    const { name, country, state, city } = req.body;

    try {
        const existingArea = await Area.findOne({ name, country, state, city, _id: { $ne: areaId } });

        if (existingArea) {
            return res.status(200).json({ type: "warning", message: "Area already exists for this city!" });
        }

        const area = await Area.findById(areaId);

        if (!area) {
            return res.status(404).json({ type: "warning", message: "Area does not exist!" });
        }

        area.name = name;
        area.country = country;
        area.state = state;
        area.city = city;

        await area.save();
        res.status(200).json({ type: "success", message: "Area updated successfully!" });
    } catch (error) {
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error });
        console.log(error)
    }
});


module.exports = route
