const express = require('express')
const route = express.Router()
const multer = require('multer')
const Country = require('../../../Models/BackendSide/country_model')
const State = require('../../../Models/BackendSide/state_model')
const fs = require('fs');
const axios = require('axios')


// add state by admin
route.post('/add', async (req, res) => {
    const { name, country } = req.body;

    try {
        const existingState = await State.findOne({ name, country });

        if (existingState) {
            return res.status(200).json({ type: "warning", message: "State already exists for this country!" });
        }

        const state = new State({
            name,
            country
        });

        await state.save();
        res.status(200).json({ type: "success", message: "State add successfully!" });
    } catch (error) {
        console.log(error)
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error });
    }
});

// get all state
route.get('/list/get', async (req, res) => {
    try {
        const state = await State.find().sort({ createdAt: -1 });

        if (state) {

            const result = state.map(state => ({
                _id: state?._id,
                name: state?.name,
                country: state?.country,
                status: state?.status,
                feature: state?.feature
            }))
            res.status(201).json({ type: "success", message: "State found successfully!", state: state || [] })
        }
        else {
            res.status(404).json({ type: "warning", message: "No State Found!", state: [] })
        }

    } catch (error) {
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error })
        console.log(error)
    }
});

// get all state (for frotend side list)
route.get('/get', async (req, res) => {
    try {
        const state = await State.find().sort({ createdAt: -1 });

        if (state) {

            const result = state.map(state => ({
                name: state?.name,
            }))
            res.status(201).json({ type: "success", message: "State found successfully!", state: result || [] })
        }
        else {
            res.status(404).json({ type: "warning", message: "No State Found!", state: [] })
        }

    } catch (error) {
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error })
        console.log(error)
    }
});

// route to get all state for a specific country
route.get('/list/get/byCountry', async (req, res) => {
    try {
        const { country } = req.query;

        if (!country) {
            return res.status(404).json({ type: "warning", message: "Please provide valid Country!", state: [] })
        }

        // Find states in the specified country from MongoDB
        const states = await State.find({ country }, { __v: 0 });
        if (states) {

            const result = states.map(state => ({
                _id: state?._id,
                name: state?.name,
                country: state?.country,
                status: state?.status,
                feature: state?.feature
            }))
            return res.status(201).json({ type: "success", message: "State found successfully!", state: result || [] })
        }
        else {
            return res.status(404).json({ type: "warning", message: "No State Found!", city: [] })
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error })
    }
});

// route to get all state for a specific country (frontend side dropdown)
route.get('/list/get/front/byCountry', async (req, res) => {
    try {
        const { country } = req.query;

        if (!country) {
            return res.status(404).json({ type: "warning", message: "Please provide valid Country!", state: [] })
        }

        // Find states in the specified country from MongoDB
        const states = await State.find({ country, status: true });
        if (states) {

            const result = states.map(state => ({
                _id: state?._id,
                name: state?.name,
            }))
            return res.status(201).json({ type: "success", message: "State found successfully!", state: result || [] })
        }
        else {
            return res.status(404).json({ type: "warning", message: "No State Found!", city: [] })
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error })
    }
});

// get Single State
route.get('/get/:id', async (req, res) => {
    const stateId = req.params.id
    try {
        const state = await State.findById(stateId).sort({ createdAt: -1 });

        if (state) {

            const result = {
                name: state?.name,
                country: state?.country,
            }
            res.status(201).json({ type: "success", message: "State found successfully!", state: result || [] })
        }
        else {
            res.status(404).json({ type: "warning", message: "No State Found!", state: [] })
        }

    } catch (error) {
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error })
        console.log(error)
    }
});

// Delete all states
route.delete('/delete/all', async (req, res) => {
    try {
        const states = await State.find();

        await State.deleteMany();
        res.status(200).json({ type: "success", message: "All State deleted successfully!" });
    } catch (error) {
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error });
    }
});

// Delete a specific state by ID
route.delete('/delete/:id', async (req, res) => {
    const stateId = req.params.id;
    try {
        const state = await State.findById(stateId);
        if (!state) {
            res.status(404).json({ type: "error", message: "State not found!" });
        } else {
            await State.findByIdAndDelete(stateId);
            res.status(200).json({ type: "success", message: "State deleted successfully!" });
        }
    } catch (error) {
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error });
    }
});

// Delete multiple states by IDs
route.delete('/deletes', async (req, res) => {
    try {
        const { ids } = req.body;
        const states = await State.find({ _id: { $in: ids } });
        await State.deleteMany({ _id: { $in: ids } });
        res.status(200).json({ type: "success", message: "All State deleted successfully!" });
    } catch (error) {
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error });
    }
});

// update only State status 
route.put("/update/status/:id", async (req, res) => {

    const StateId = await req.params.id

    try {
        const { status } = req.body
        const newState = await State.findByIdAndUpdate(StateId)
        newState.status = await status

        await newState.save()
        res.status(200).json({ type: "success", message: "State Status update successfully!" })

    } catch (error) {
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error })
    }

})

// update only State feature 
route.put("/update/feature/:id", async (req, res) => {

    const StateId = await req.params.id

    try {
        const { feature } = req.body
        const newState = await State.findByIdAndUpdate(StateId)
        newState.feature = await feature

        await newState.save()
        res.status(200).json({ type: "success", message: "State Feature update successfully!" })

    } catch (error) {
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error })
    }

})

// Update a specific state by ID
route.put('/update/:id', async (req, res) => {
    const stateId = req.params.id;
    const { name, country } = req.body;

    try {
        const existingState = await State.findOne({ name, country, _id: { $ne: stateId } });

        if (existingState) {
            return res.status(200).json({ type: "warning", message: "State already exists for this country!" });
        }

        const state = await State.findById(stateId);

        if (!state) {
            return res.status(404).json({ type: "warning", message: "State does not exist!" });
        }

        state.name = name;
        state.country = country;

        await state.save();
        res.status(200).json({ type: "success", message: "State updated successfully!" });
    } catch (error) {
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error });
        console.log(error)
    }
});


module.exports = route