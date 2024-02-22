const express = require('express')
const route = express.Router()
const multer = require('multer')
const { Meal, Customization } = require('../../../Models/BackendSide/meal_model');
const fs = require('fs');
const path = require('path');

// Set up multer storage and limits
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "imageUploads/backend/variation");
    },
    filename: (req, file, cb) => {
        const extension = file.originalname.split(".").pop();
        cb(null, `${Date.now()}_${Math.random().toString(36).substr(2, 9)}.${extension}`);
    },
});
const upload = multer({ storage });


// Create customizations
route.post("/add/:mealId", upload.array("images", 10), async (req, res) => {
    try {
        const {
            name,
            type,
            isCustimizeMandatory,
            segmentName,
            bites
        } = req.body;

        const mealId = req.params.mealId;

        const customizationSegments = Array.isArray(segmentName)
            ? segmentName.map((segment, index) => ({
                name: segmentName[index],
                bites: bites[index],
            }))
            : [
                {
                    name: segmentName,
                    bites: bites,
                },
            ];

        const meal = await Meal.findById(mealId);
        if (!meal) {
            return res.status(404).json({ type: "error", message: "Meal not found!" });
        }

        const newCustomization = new Customization({
            name: name,
            type: type,
            isCustimizeMandatory: isCustimizeMandatory,
            segment: customizationSegments
        });

        await newCustomization.save();

        meal.Customization.push(newCustomization._id);
        await meal.save();

        res.status(200).json({ type: "success", message: "Customization added successfully!" });
    } catch (error) {

        console.log("Failed to add customization:", error);
        res.status(500).json({ type: "error", message: "Failed to add customization" });
    }
});

// get all customization
route.get('/get/all', async (req, res) => {
    try {
        const customization = await Customization.find().sort({ createdAt: -1 });
        if (customization) {
            const result = customization.map(customization => {
                return {
                    ...customization.toObject(),
                }
            })
            return res.status(201).json({ type: "success", message: " Customization found successfully!", customization: result || [] })
        }
    } catch (error) {
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error })
    }
});

// find customization by id
route.get('/get/:id', async (req, res) => {

    const customizationId = req.params.id

    try {
        const customization = await Customization.findById(customizationId)
        if (customization) {
            const result = {
                ...customization.toObject(),
                _id: customization._id,
            }
            return res.status(200).json({ type: "success", message: "Customization found successfully!", customization: result || [] })
        }
        else {
            res.status(404).json({ type: "warning", message: "Customization not found !" })
        }
    } catch (error) {
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error })
        console.log(error)
    }
});

// Delete all customizations
route.delete('/delete/all', async (req, res) => {
    try {

        const customizations = await Customization.find();

        for (const customization of customizations) {

            // Remove the customization from associated meals
            const meals = await Meal.find({ Customization: customization._id });
            for (const meal of meals) {
                const index = meal.Customization.indexOf(customization._id);
                if (index !== -1) {
                    meal.Customization.splice(index, 1);
                    await meal.save();
                }
            }
        }

        await Customization.deleteMany();

        res.status(200).json({ type: "success", message: "All Customizations deleted successfully!" });
    } catch (error) {
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error.message });
    }
});

// Delete customization by ID
route.delete('/delete/:id', async (req, res) => {
    const customizationId = req.params.id;
    try {
        const customization = await Customization.findById(customizationId);
        if (!customization) {
            return res.status(404).json({ type: "error", message: "Customization not found!" });
        }

        // Remove the customization from associated meals
        const meals = await Meal.find({ Customization: customizationId });
        for (const meal of meals) {
            const index = meal.Customization.indexOf(customizationId);
            if (index !== -1) {
                meal.Customization.splice(index, 1);
                await meal.save();
            }
        }

        await Customization.findByIdAndDelete(customizationId);
        res.status(200).json({ type: "success", message: "Customization deleted successfully!" });
    } catch (error) {
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error });
    }
});

// Delete multiple customizations by IDs
route.delete('/deletes', async (req, res) => {
    const { ids } = req.body;
    try {
        const customizations = await Customization.find({ _id: { $in: ids } });

        for (const customization of customizations) {

            // Remove the customization from associated meals
            const meals = await Meal.find({ Customization: customization._id });
            for (const meal of meals) {
                const index = meal.Customization.indexOf(customization._id);
                if (index !== -1) {
                    meal.Customization.splice(index, 1);
                    await meal.save();
                }
            }
        }

        await Customization.deleteMany({ _id: { $in: ids } });

        res.status(200).json({ type: "success", message: "Customizations deleted successfully!" });
    } catch (error) {
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error.message });
    }
});

// update only status 
route.put("/update/status/:id", async (req, res) => {

    const customizationId = await req.params.id

    try {
        const { status } = req.body
        const newCustomization = await Customization.findByIdAndUpdate(customizationId)
        newCustomization.status = await status

        await newCustomization.save()
        res.status(200).json({ type: "success", message: "Customization Status update successfully!" })

    } catch (error) {
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error })
    }

})

// update only segment status
route.put("/update/segment/status/:customizationId/:segmentId", async (req, res) => {
    const customizationId = req.params.customizationId;
    const segmentId = req.params.segmentId;

    try {
        const { Segment_Status } = req.body;

        // Find the customization by ID
        const customization = await Customization.findById(customizationId);
        if (!customization) {
            return res.status(404).json({ type: "error", message: "Customization not found!" });
        }

        // Find the segment in the segment array with the given segmentId
        const segmentToUpdate = customization.segment.find((segment) => segment._id.toString() === segmentId);
        if (!segmentToUpdate) {
            return res.status(404).json({ type: "error", message: "Segment not found in the customization!" });
        }

        // Update the Segment_Status of the segment
        segmentToUpdate.Segment_Status = Segment_Status;

        // Save the updated customization
        await customization.save();

        res.status(200).json({ type: "success", message: "Segment Status update successfully!" });
    } catch (error) {
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error });
    }
});

// delete a particular segment
route.delete("/delete/segment/:customizationId/:segmentId", async (req, res) => {
    const customizationId = req.params.customizationId;
    const segmentId = req.params.segmentId;

    try {
        // Find the customization by ID
        const customization = await Customization.findById(customizationId);
        if (!customization) {
            return res.status(404).json({ type: "error", message: "Customization not found!" });
        }

        // Filter out the segment to delete from the segment array
        const updatedSegments = customization.segment.filter((segment) => segment._id.toString() !== segmentId);

        // Check if the segment exists in the array
        if (customization.segment.length === updatedSegments.length) {
            return res.status(404).json({ type: "error", message: "Segment not found in the customization!" });
        }

        // Update the segment array with the filtered segments
        customization.segment = updatedSegments;

        // Save the updated customization
        await customization.save();

        res.status(200).json({ type: "success", message: "Segment deleted successfully!" });
    } catch (error) {
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error });
    }
});

// Delete multiple segments from a customization
route.delete("/deletes/segments/:customizationId", async (req, res) => {
    const customizationId = req.params.customizationId;
    const { segmentIds } = req.body;

    try {
        // Find the customization by ID
        const customization = await Customization.findById(customizationId);
        if (!customization) {
            return res.status(404).json({ type: "error", message: "Customization not found!" });
        }

        // Filter out the segments to delete from the segment array
        customization.segment = customization.segment.filter((segment) => !segmentIds.includes(segment._id.toString()));

        // Save the updated customization
        await customization.save();

        res.status(200).json({ type: "success", message: "Segments deleted successfully!" });
    } catch (error) {
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error });
    }
});

// Update customization by id
route.put('/update/:customizationId', async (req, res) => {
    try {
        const { name, type, isCustimizeMandatory } = req.body;
        const customizationId = req.params.customizationId;

        // Find the customization by ID
        const customization = await Customization.findById(customizationId);
        if (!customization) {
            return res.status(404).json({ type: "error", message: "Customization not found!" });
        }

        customization.name = name;
        customization.type = type;
        customization.isCustimizeMandatory = isCustimizeMandatory;
        // Save the updated customization to the database
        await customization.save();

        res.status(200).json({ type: "success", message: "Customization updated successfully!" });
    } catch (error) {
        console.error('Failed to update customization:', error);
        res.status(500).json({ error: 'Failed to update customization' });
    }
});

// Update all fields within a customization segment by ID
route.put("/update/segment/:customizationId/:segmentId", async (req, res) => {
    try {
        const customizationId = req.params.customizationId;
        const segmentId = req.params.segmentId;
        const { name, bites } = req.body;

        const customization = await Customization.findById(customizationId);
        if (!customization) {
            return res.status(404).json({ type: "error", message: "Customization not found!" });
        }

        const segmentIndex = customization.segment.findIndex((segment) => segment._id.toString() === segmentId);
        if (segmentIndex === -1) {
            return res.status(404).json({ type: "error", message: "Customization segment not found!" });
        }

        // Update all fields within the customization segment data
        customization.segment[segmentIndex].name = name;
        customization.segment[segmentIndex].bites = bites;

        // Save the updated customization to the database
        await customization.save();

        res.status(200).json({ type: "success", message: "All fields updated successfully!" });
    } catch (error) {
        console.error("Failed to update customization segment:", error);
        res.status(500).json({ type: "error", message: "Failed to update customization segment", errorMessage: error.message });
    }
});

// Add a new segment to a customization
route.post("/add/segment/:customizationId", async (req, res) => {

    try {
        const customizationId = req.params.customizationId;
        const { segmentName, bites } = req.body;

        const customization = await Customization.findById(customizationId);

        if (!customization) {
            return res.status(404).json({ type: "error", message: "Customization not found!" });
        }

        // Create a new segment object
        const newSegment = {
            name: segmentName,
            bites: bites
        };

        // Add the new segment to the segment array
        customization.segment.unshift(newSegment);

        // Save the updated customization to the database
        await customization.save();

        res.status(201).json({ type: "success", message: "Segment added successfully!", segment: newSegment });
    } catch (error) {
        res.status(500).json({ type: "error", message: "Failed to add segment" });
    }
});

// find all the customization for particular meals
route.get('/get/byMealId/:mealID', async (req, res) => {

    try {
        const mealID = req.params.mealID;
        // Find the meal by its ID
        const meal = await Meal.findById(mealID);

        if (!meal) {
            return res.status(404).json({ type: "error", message: 'Meal not found' });
        }

        // Find the associated customizations
        const customizations = await Customization.find({ _id: { $in: meal.Customization } });

        if (customizations) {

            const result = customizations.map(customization => ({
                ...customization.toObject(),
                isCustimizeMandatory: customization?.isCustimizeMandatory === true ? "Yes" : "No",
            }));
            return res.status(200).json({ type: "success", message: "Customization get successfully!", customizations: result || [] });
        }
        else {
            return res.status(404).json({ type: "warning", message: "No Customization Found!", meal: [] })
        }


    } catch (error) {
        res.status(500).json({ type: "error", message: "Server error" });
    }
});

// Route to get all Customization Segment for a particular customization
route.get('/get/segments/byCustomizationId/:customizationID', async (req, res) => {
    try {
        const customizationID = req.params.customizationID;

        // Find the customization by its ID
        const customization = await Customization.findById(customizationID);

        if (!customization) {
            return res.status(404).json({ type: "error", message: 'Meal Customization not found' });
        }

        // Get the segment from the found customization
        const segments = customization.segment;

        res.status(200).json({ type: "success", message: "Customization Segments get successfully!", customizationSegment: segments || [] });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});




module.exports = route
