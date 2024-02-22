const express = require('express')
const route = express.Router()
const multer = require('multer')
const TourTypes = require('../../../Models/FrontendSide/tour_types_model')
const fs = require('fs');



// Set up multer middleware to handle file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './imageUploads/frontend/tourTypes')
    },
    filename: function (req, file, cb) {
        cb(null, file?.originalname)
    }
})
const upload = multer({ storage: storage })


// Create TourTypes
route.post('/add/byAdmin', upload.single('image'), async (req, res) => {
    try {
        const { name } = req.body;

        const existingTourTypes = await TourTypes.findOne({ name });


        if (existingTourTypes) {
            try {
                if (req?.file) {
                    fs.unlinkSync(req?.file?.path);
                }
            } catch (cleanupError) {
                console.error(cleanupError);
            }
            return res.status(202).json({ type: "warning", message: "Tour-Type is already exists!" });
        }

        const tourType = new TourTypes({
            name
        });

        if (req.file) {
            const extension = req.file.originalname.substring(req.file.originalname.lastIndexOf('.'));
            const random = Math.random() * 100;
            const imageFilename = `${name.replace(/\s/g, '_')}_${Date.now()}_${random}${extension}`;
            const imagePath = `imageUploads/frontend/tourTypes/${imageFilename}`;

            fs.renameSync(req.file.path, imagePath);
            tourType.image = imagePath;

        }

        await tourType.save()
        return res.status(200).json({ type: 'success', message: 'Tour-Type added successfully!' });

    } catch (error) {
        try {
            if (req?.file) {
                fs.unlinkSync(req?.file?.path);
            }
        } catch (error) {

        }
        console.log(error)
        return res.status(500).json({ type: 'error', message: 'Server Error!', errorMessage: error.message });
    }
});

// get all tourTypes
route.get('/list/get', async (req, res) => {
    try {
        const tourTypes = await TourTypes.find().sort({ createdAt: -1 });

        if (tourTypes) {

            const result = tourTypes.map(tourTypes => ({
                _id: tourTypes?._id,
                name: tourTypes?.name,
                image: `${process.env.IMAGE_URL}/${tourTypes.image?.replace(/\\/g, '/')}`,
                feature: tourTypes?.feature
            }))
            res.status(201).json({ type: "success", message: " Tour-Type found successfully!", tourTypes: result || [] })
        }
        else {
            res.status(404).json({ type: "warning", message: " No Tour-Type Found!", tourTypes: [] })
        }

    } catch (error) {
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error })
        console.log(error)
    }
});

// get all tourTypes (for frotend side list)
route.get('/list/getAll', async (req, res) => {
    try {
        const tourTypes = await TourTypes.find().sort({ createdAt: -1 });

        if (tourTypes) {

            const result = tourTypes.map(tourTypes => ({
                name: tourTypes?.name,
            }))
            res.status(201).json({ type: "success", message: " Tour-Type found successfully!", tourTypes: result || [] })
        }
        else {
            res.status(404).json({ type: "warning", message: " No Tour-Type Found!", tourTypes: [] })
        }

    } catch (error) {
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error })
        console.log(error)
    }
});

// get tourTypes with server-side pagination
// route.get('/list/get', async (req, res) => {

//     try {
//         const page = parseInt(req.query.page) || 1;
//         const pageSize = parseInt(req.query.limit) || 10;

//         const totalTourTypesCount = await TourTypes.countDocuments();
//         const totalPages = Math.ceil(totalTourTypesCount / pageSize);

//         const tourTypes = await TourTypes.find()
//             .sort({ createdAt: -1 })
//             .skip((page - 1) * pageSize)
//             .limit(pageSize);

//         if (tourTypes.length > 0) {
//             const result = tourTypes.map((amenity) => ({
//                 id: amenity?._id,
//                 name: amenity?.name,
//                 image: `${process.env.IMAGE_URL}/${amenity.image?.replace(/\\/g, '/')}`,
//             }));

//             res.status(200).json({
//                 type: 'success',
//                 message: 'Tour-Type found successfully!',
//                 tourTypes: result || [],
//                 total: totalTourTypesCount,
//                 totalPages: totalPages,
//                 currentPage: page,
//                 limit: pageSize

//             });
//         } else {
//             res.status(404).json({ type: 'warning', message: 'No Tour-Type Found!', tourTypes: [] });
//         }
//     } catch (error) {
//         res.status(500).json({ type: 'error', message: 'Server Error!', errorMessage: error });
//         console.log(error);
//     }
// });


// get tourTypes by id
route.get('/single/get/:id', async (req, res) => {
    const tourTypesId = req.params.id
    try {
        const tourTypes = await TourTypes.findById(tourTypesId)
        if (!tourTypes) {
            res.status(404).json({ type: "warning", message: "No Tour-Type found!", tourTypes: [] })
        }
        else {
            const result = {
                _id: tourTypes?._id,
                name: tourTypes?.name,
                image: `${process.env.IMAGE_URL}/${tourTypes.image?.replace(/\\/g, '/')}`,
            }
            res.status(201).json({ type: "success", message: " Tour-Type found successfully!", tourTypes: result })
        };
    } catch (error) {
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error })
        console.log(error)
    }
});

// get all tourTypes for mobile
// route.get('/mob/get', async (req, res) => {
//     try {
//         const tourTypes = await TourTypes.find({ TourTypes_Status: true }).sort({ TourTypes_Sequence: -1 });
//         if (!tourTypes) {
//             res.status(200).json({ type: "warning", message: "No Tour-Type found!", tourTypes: [] })
//         }
//         else {
//             const result = tourTypes.map(tourTypes => ({
//                 tourTypes_id: tourTypes._id,
//                 tourTypes_Image: `${process.env.IMAGE_URL}/${tourTypes.image?.replace(/\\/g, '/')}` || "",
//                 tourTypes_sequence: tourTypes.TourTypes_Sequence,
//                 categoryId: tourTypes.CategoryId
//             }));
//             res.status(201).json({ type: "success", message: " Tour-Type found successfully!", tourTypes: result || [] })
//         }
//     } catch (error) {
//         res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error })
//     }
// });

// Delete all tourTypess
route.delete('/delete/all', async (req, res) => {
    try {
        const tourTypess = await TourTypes.find();

        if (tourTypess.length > 0) {
            for (const tourTypes of tourTypess) {
                if (tourTypes.image && fs.existsSync(tourTypes.image)) {
                    try {
                        fs.unlinkSync(tourTypes.image);
                    } catch (error) {

                    }
                }
            }
        }

        await TourTypes.deleteMany();
        res.status(200).json({ type: "success", message: "All Tour-Type deleted successfully!" });
    } catch (error) {
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error });
    }
});

// Delete a specific tourTypes by ID
route.delete('/delete/:id', async (req, res) => {
    const tourTypesId = req.params.id;
    try {
        const tourTypes = await TourTypes.findById(tourTypesId);
        if (!tourTypes) {
            res.status(404).json({ type: "error", message: "Tour-Type not found!" });
        } else {
            try {
                if (tourTypes.image && fs.existsSync(tourTypes.image)) {
                    fs.unlinkSync(tourTypes.image);
                }
            } catch (error) {

            }

            await TourTypes.findByIdAndDelete(tourTypesId);
            res.status(200).json({ type: "success", message: "Tour-Type deleted successfully!" });
        }
    } catch (error) {
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error });
    }
});

// Delete multiple tourTypess by IDs
route.delete('/deletes', async (req, res) => {
    try {
        const { ids } = req.body;
        const tourTypess = await TourTypes.find({ _id: { $in: ids } });

        for (const tourTypes of tourTypess) {
            if (tourTypes.image && fs.existsSync(tourTypes.image)) {
                try {
                    fs.unlinkSync(tourTypes.image);
                } catch (error) {

                }
            }
        }

        await TourTypes.deleteMany({ _id: { $in: ids } });
        res.status(200).json({ type: "success", message: "All Tour-Type deleted successfully!" });
    } catch (error) {
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error });
    }
});

// update only TourTypes feature 
route.put("/update/feature/:id", async (req, res) => {

    const TourTypesId = await req.params.id

    try {
        const { feature } = req.body
        const newTourTypes = await TourTypes.findByIdAndUpdate(TourTypesId)
        newTourTypes.feature = await feature

        await newTourTypes.save()
        res.status(200).json({ type: "success", message: "Tour-Type Status update successfully!" })

    } catch (error) {
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error })
    }

})

// Update a specific tourTypes by ID
route.put('/update/byAdmin/:id', upload.single('image'), async (req, res) => {
    const tourTypesId = req.params.id;
    const { name } = req.body;

    try {
        const existingTourTypes = await TourTypes.findOne({ name, _id: { $ne: tourTypesId } });

        if (existingTourTypes) {
            try {
                fs.unlinkSync(req.file?.path);
            } catch (error) {

            }
            return res.status(200).json({ type: "warning", message: "Tour-Type already exists!" });
        }

        const tourTypes = await TourTypes.findById(tourTypesId);

        if (!tourTypes) {
            try {
                fs.unlinkSync(req.file?.path);
            } catch (error) {

            }
            return res.status(404).json({ type: "warning", message: "Tour-Type does not exist!" });
        }

        tourTypes.name = name;


        if (req.file) {

            const extension = req.file.originalname.substring(req.file.originalname.lastIndexOf('.'));
            const random = Math.random() * 100;
            const imageFilename = `${name.replace(/\s/g, '_')}_${Date.now()}_${random}${extension}`;
            const imagePath = `imageUploads/frontend/tourTypes/${imageFilename}`;

            fs.renameSync(req.file.path, imagePath);

            tourTypes.image = imagePath;
        }

        await tourTypes.save();
        res.status(200).json({ type: "success", message: "Tour-Type updated successfully!" });
    } catch (error) {
        if (req.file) {
            try {
                fs.unlinkSync(req?.file?.path);
            } catch (error) {

            }
        }
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error });
        console.log(error)
    }
});




module.exports = route