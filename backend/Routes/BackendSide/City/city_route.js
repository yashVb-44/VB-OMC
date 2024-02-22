const express = require('express')
const route = express.Router()
const multer = require('multer')
const City = require('../../../Models/BackendSide/city_model')
const fs = require('fs');
const axios = require('axios')


// add state by admin
route.post('/add', async (req, res) => {
    const { name, country, state } = req.body;

    try {
        const existingCity = await City.findOne({ name, country, state });

        if (existingCity) {
            return res.status(200).json({ type: "warning", message: "City already exists!" });
        }

        const city = new City({
            name,
            country,
            state
        });

        await city.save();
        res.status(200).json({ type: "success", message: "City add successfully!" });
    } catch (error) {
        console.log(error)
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error });
    }
});

// route to fetch and save city names and states
// route.get('/saveCities', async (req, res) => {
//     try {
//         // Fetch data for states from Geonames API
//         const statesResponse = await axios.get('http://api.geonames.org/childrenJSON?geonameId=1269750&username=yashvb');

//         // Extract state names from the API response
//         const statesData = statesResponse.data.geonames;

//         // Fetch city data for each state
//         const citiesData = [];
//         for (const state of statesData) {
//             const cityResponse = await axios.get(`http://api.geonames.org/childrenJSON?geonameId=${state.geonameId}&username=yashvb`);
//             const stateName = state.name;

//             if (cityResponse.data.geonames && Array.isArray(cityResponse.data.geonames)) {
//                 cityResponse.data.geonames.forEach((city) => {
//                     if (city.name) {
//                         citiesData.push({ name: city.name, state: stateName });
//                     }
//                 });
//             }
//         }

//         // Save city names and states to MongoDB
//         await City.insertMany(citiesData);

//         res.json({ message: 'City names and states saved successfully' });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// });



// get all city 
route.get('/list/get', async (req, res) => {
    try {
        const city = await City.find().sort({ createdAt: -1 });

        if (city) {

            const result = city.map(city => ({
                _id: city?._id,
                name: city?.name,
                state: city?.state,
                country: city?.country,
                feature: city?.feature,
                status: city?.status
            }))
            return res.status(201).json({ type: "success", message: "City found successfully!", city: result || [] })
        }
        else {
            return res.status(404).json({ type: "warning", message: "No City Found!", city: [] })
        }

    } catch (error) {
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error })
        console.log(error)
    }
});

// get all city (for frotend side list)
route.get('/list/getAll', async (req, res) => {
    try {
        const city = await City.find().sort({ createdAt: -1 });

        if (city) {

            const result = city.map(city => ({
                name: city?.name,
            }))
            return res.status(201).json({ type: "success", message: "City found successfully!", city: result || [] })
        }
        else {
            return res.status(404).json({ type: "warning", message: " No City Found!", city: [] })
        }

    } catch (error) {
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error })
        console.log(error)
    }
});

// route to get all cities for a specific country and state
route.get('/list/get/byCountryAndState', async (req, res) => {
    try {
        const { state, country } = req.query;

        if (!country) {
            return res.status(404).json({ type: "warning", message: "Please provide valid Country!", city: [] })
        }

        if (!state) {
            return res.status(404).json({ type: "warning", message: "Please provide valid State!", city: [] })
        }

        // Find cities in the specified state from MongoDB
        const cities = await City.find({ state, country }, { __v: 0 });
        if (cities) {

            const result = cities.map(city => ({
                _id: city?._id,
                name: city?.name,
            }))
            return res.status(201).json({ type: "success", message: "City found successfully!", city: result || [] })
        }
        else {
            return res.status(404).json({ type: "warning", message: "No City Found!", city: [] })
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error })
    }
});

// route to get all state for a specific country and state (frontend side dropdown)
route.get('/list/get/front/byCountryAndState', async (req, res) => {
    try {
        const { country, state } = req.query;

        if (!country) {
            return res.status(404).json({ type: "warning", message: "Please provide valid Country!", city: [] })
        }

        if (!state) {
            return res.status(404).json({ type: "warning", message: "Please provide valid State!", city: [] })
        }

        // Find states in the specified state from MongoDB
        const citys = await City.find({ state, country, status: true });
        if (citys) {

            const result = citys.map(city => ({
                _id: city?._id,
                name: city?.name,
            }))
            return res.status(201).json({ type: "success", message: "City found successfully!", city: result || [] })
        }
        else {
            return res.status(404).json({ type: "warning", message: "No City Found!", city: [] })
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error })
    }
});

// Get Particular city by id
route.get('/single/get/:id', async (req, res) => {
    const cityId = req.params.id
    try {
        const city = await City.findById(cityId)

        if (city) {

            const result = {
                _id: city?._id,
                name: city?.name,
                state: city?.state,
                country: city?.country,
                feature: city?.feature,
                status: city?.status
            }
            return res.status(201).json({ type: "success", message: "City found successfully!", city: result })
        }
        else {
            return res.status(404).json({ type: "warning", message: "No City Found!", city: [] })
        }

    } catch (error) {
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error })
        console.log(error)
    }
});

// route to get all cities for a specific state (for frotend side list)
route.get('/get/byState', async (req, res) => {
    try {
        const { state } = req.query;

        if (!state) {
            return res.status(404).json({ type: "warning", message: " Please provide valid State!", city: [] })
        }

        // Find cities in the specified state from MongoDB
        const cities = await City.find({ state }, { __v: 0 });
        if (cities) {

            const result = cities.map(city => ({
                name: city?.name,
            }))
            return res.status(201).json({ type: "success", message: " City found successfully!", city: result || [] })
        }
        else {
            return res.status(404).json({ type: "warning", message: " No City Found!", city: [] })
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error })
    }
});

// Delete all citys
route.delete('/delete/all', async (req, res) => {
    try {
        const citys = await City.find();

        await City.deleteMany();
        res.status(200).json({ type: "success", message: "All City deleted successfully!" });
    } catch (error) {
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error });
    }
});

// Delete a specific city by ID
route.delete('/delete/:id', async (req, res) => {
    const cityId = req.params.id;
    try {
        const city = await City.findById(cityId);
        if (!city) {
            res.status(404).json({ type: "error", message: "City not found!" });
        } else {

            await City.findByIdAndDelete(cityId);
            res.status(200).json({ type: "success", message: "City deleted successfully!" });
        }
    } catch (error) {
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error });
    }
});

// Delete multiple citys by IDs
route.delete('/deletes', async (req, res) => {
    try {
        const { ids } = req.body;
        const citys = await City.find({ _id: { $in: ids } });

        await City.deleteMany({ _id: { $in: ids } });
        res.status(200).json({ type: "success", message: "All City deleted successfully!" });
    } catch (error) {
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error });
    }
});

// update only City status 
route.put("/update/status/:id", async (req, res) => {

    const CityId = await req.params.id

    try {
        const { status } = req.body
        const newCity = await City.findByIdAndUpdate(CityId)
        newCity.status = await status

        await newCity.save()
        res.status(200).json({ type: "success", message: "City Status update successfully!" })

    } catch (error) {
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error })
    }

})

// update only City feature 
route.put("/update/feature/:id", async (req, res) => {

    const CityId = await req.params.id

    try {
        const { feature } = req.body
        const newCity = await City.findByIdAndUpdate(CityId)
        newCity.feature = await feature

        await newCity.save()
        res.status(200).json({ type: "success", message: "City Status update successfully!" })

    } catch (error) {
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error })
    }

})

// Update a specific city by ID
route.put('/update/byAdmin/:id', async (req, res) => {
    const cityId = req.params.id;
    const { name, country, state } = req.body;

    try {
        const existingCity = await City.findOne({ name, country, state, _id: { $ne: cityId } });

        if (existingCity) {
            return res.status(200).json({ type: "warning", message: "City already exists for this State!" });
        }

        const city = await City.findById(cityId);

        if (!city) {
            return res.status(404).json({ type: "warning", message: "City does not exist!" });
        }

        city.name = name;
        city.country = country;
        city.state = state;

        await city.save();
        res.status(200).json({ type: "success", message: "City updated successfully!" });
    } catch (error) {
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error });
        console.log(error)
    }
});


module.exports = route
