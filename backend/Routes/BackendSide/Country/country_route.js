const express = require('express')
const route = express.Router()
const multer = require('multer')
const Country = require('../../../Models/BackendSide/country_model')
const fs = require('fs');
const axios = require('axios')


// add country by admin
route.post('/add', async (req, res) => {
    const { name } = req.body;

    try {
        const existingCountry = await Country.findOne({ name });

        if (existingCountry) {
            return res.status(200).json({ type: "warning", message: "Country already exists!" });
        }

        const country = new Country({
            name
        });

        await country.save();
        res.status(200).json({ type: "success", message: "Country add successfully!" });
    } catch (error) {
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error });
    }
});

// get all country 
route.get('/list/get', async (req, res) => {
    try {
        const country = await Country.find().sort({ createdAt: -1 });

        if (country) {

            const result = country.map(country => ({
                _id: country?._id,
                name: country?.name,
                status: country?.status,
                feature: country?.feature
            }))
            return res.status(201).json({ type: "success", message: "Country found successfully!", country: result || [] })
        }
        else {
            return res.status(404).json({ type: "warning", message: "No Country Found!", country: [] })
        }

    } catch (error) {
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error })
        console.log(error)
    }
});

// get all country (for frontend side list)
route.get('/list/getAll', async (req, res) => {
    try {
        const country = await Country.find({ status: true }).sort({ createdAt: -1 });

        if (country) {

            const result = country.map(country => ({
                name: country?.name,
            }))
            return res.status(201).json({ type: "success", message: "Country found successfully!", country: result || [] })
        }
        else {
            return res.status(404).json({ type: "warning", message: "No Country Found!", country: [] })
        }

    } catch (error) {
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error })
        console.log(error)
    }
});

// Delete all countrys
route.delete('/delete/all', async (req, res) => {
    try {
        const countrys = await Country.find();
        await Country.deleteMany();
        res.status(200).json({ type: "success", message: "All Country deleted successfully!" });
    } catch (error) {
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error });
    }
});

// Delete a specific country by ID
route.delete('/delete/:id', async (req, res) => {
    const countryId = req.params.id;
    try {
        const country = await Country.findById(countryId);
        if (!country) {
            res.status(404).json({ type: "error", message: "Country not found!" });
        } else {
            await Country.findByIdAndDelete(countryId);
            res.status(200).json({ type: "success", message: "Country deleted successfully!" });
        }
    } catch (error) {
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error });
    }
});

// Delete multiple countrys by IDs
route.delete('/deletes', async (req, res) => {
    try {
        const { ids } = req.body;
        const countrys = await Country.find({ _id: { $in: ids } });

        await Country.deleteMany({ _id: { $in: ids } });
        res.status(200).json({ type: "success", message: "All Country deleted successfully!" });
    } catch (error) {
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error });
    }
});

// update only Country status 
route.put("/update/status/:id", async (req, res) => {

    const CountryId = await req.params.id

    try {
        const { status } = req.body
        const newCountry = await Country.findByIdAndUpdate(CountryId)
        newCountry.status = await status

        await newCountry.save()
        res.status(200).json({ type: "success", message: "Country Status update successfully!" })

    } catch (error) {
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error })
    }

})

// update only Country feature 
route.put("/update/feature/:id", async (req, res) => {

    const CountryId = await req.params.id

    try {
        const { feature } = req.body
        const newCountry = await Country.findByIdAndUpdate(CountryId)
        newCountry.feature = await feature

        await newCountry.save()
        res.status(200).json({ type: "success", message: "Country Feature update successfully!" })

    } catch (error) {
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error })
    }

})

// Update a specific country by ID
route.put('/update/:id', async (req, res) => {
    const countryId = req.params.id;
    const { name } = req.body;

    try {
        const existingCountry = await Country.findOne({ name, _id: { $ne: countryId } });

        if (existingCountry) {
            return res.status(200).json({ type: "warning", message: "Country already exists!" });
        }

        const country = await Country.findById(countryId);

        if (!country) {
            return res.status(404).json({ type: "warning", message: "Country does not exist!" });
        }

        country.name = name;

        await country.save();
        res.status(200).json({ type: "success", message: "Country updated successfully!" });
    } catch (error) {
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error });
        console.log(error)
    }
});


module.exports = route
