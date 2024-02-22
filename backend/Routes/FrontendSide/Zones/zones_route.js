const express = require('express')
const route = express.Router()
const multer = require('multer')
const Zones = require('../../../Models/FrontendSide/zones_model')
const fs = require('fs');



// Set up multer middleware to handle file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './imageUploads/frontend/zones')
    },
    filename: function (req, file, cb) {
        cb(null, file?.originalname)
    }
})
const upload = multer({ storage: storage })


// Create Zones
route.post('/add/byAdmin', upload.single('image'), async (req, res) => {
    try {
        const { name } = req.body;

        const existingZones = await Zones.findOne({ name });


        if (existingZones) {
            try {
                if (req?.file) {
                    fs.unlinkSync(req?.file?.path);
                }
            } catch (cleanupError) {
                console.error(cleanupError);
            }
            return res.status(202).json({ type: "warning", message: "Zone is already exists!" });
        }

        const tourType = new Zones({
            name
        });

        if (req.file) {
            const extension = req.file.originalname.substring(req.file.originalname.lastIndexOf('.'));
            const random = Math.random() * 100;
            const imageFilename = `${name.replace(/\s/g, '_')}_${Date.now()}_${random}${extension}`;
            const imagePath = `imageUploads/frontend/zones/${imageFilename}`;

            fs.renameSync(req.file.path, imagePath);
            tourType.image = imagePath;

        }

        await tourType.save()
        return res.status(200).json({ type: 'success', message: 'Zone added successfully!' });

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

// get all zones
route.get('/list/get', async (req, res) => {
    try {
        const zones = await Zones.find().sort({ createdAt: -1 });

        if (zones) {

            const result = zones.map(zones => ({
                _id: zones?._id,
                name: zones?.name,
                image: `${process.env.IMAGE_URL}/${zones.image?.replace(/\\/g, '/')}`,
                feature: zones?.feature
            }))
            res.status(201).json({ type: "success", message: " Zone found successfully!", zones: result || [] })
        }
        else {
            res.status(404).json({ type: "warning", message: " No Zone Found!", zones: [] })
        }

    } catch (error) {
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error })
        console.log(error)
    }
});

// get all zones (for frotend side list)
route.get('/list/getAll', async (req, res) => {
    try {
        const zones = await Zones.find().sort({ createdAt: -1 });

        if (zones) {

            const result = zones.map(zones => ({
                name: zones?.name,
            }))
            res.status(201).json({ type: "success", message: " Zone found successfully!", zones: result || [] })
        }
        else {
            res.status(404).json({ type: "warning", message: " No Zone Found!", zones: [] })
        }

    } catch (error) {
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error })
        console.log(error)
    }
});

// get zones with server-side pagination
// route.get('/list/get', async (req, res) => {

//     try {
//         const page = parseInt(req.query.page) || 1;
//         const pageSize = parseInt(req.query.limit) || 10;

//         const totalZonesCount = await Zones.countDocuments();
//         const totalPages = Math.ceil(totalZonesCount / pageSize);

//         const zones = await Zones.find()
//             .sort({ createdAt: -1 })
//             .skip((page - 1) * pageSize)
//             .limit(pageSize);

//         if (zones.length > 0) {
//             const result = zones.map((amenity) => ({
//                 id: amenity?._id,
//                 name: amenity?.name,
//                 image: `${process.env.IMAGE_URL}/${amenity.image?.replace(/\\/g, '/')}`,
//             }));

//             res.status(200).json({
//                 type: 'success',
//                 message: 'Zone found successfully!',
//                 zones: result || [],
//                 total: totalZonesCount,
//                 totalPages: totalPages,
//                 currentPage: page,
//                 limit: pageSize

//             });
//         } else {
//             res.status(404).json({ type: 'warning', message: 'No Zone Found!', zones: [] });
//         }
//     } catch (error) {
//         res.status(500).json({ type: 'error', message: 'Server Error!', errorMessage: error });
//         console.log(error);
//     }
// });


// get zones by id
route.get('/single/get/:id', async (req, res) => {
    const zonesId = req.params.id
    try {
        const zones = await Zones.findById(zonesId)
        if (!zones) {
            res.status(404).json({ type: "warning", message: "No Zone found!", zones: [] })
        }
        else {
            const result = {
                _id: zones?._id,
                name: zones?.name,
                image: `${process.env.IMAGE_URL}/${zones.image?.replace(/\\/g, '/')}`,
            }
            res.status(201).json({ type: "success", message: " Zone found successfully!", zones: result })
        };
    } catch (error) {
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error })
        console.log(error)
    }
});

// get all zones for mobile
// route.get('/mob/get', async (req, res) => {
//     try {
//         const zones = await Zones.find({ Zones_Status: true }).sort({ Zones_Sequence: -1 });
//         if (!zones) {
//             res.status(200).json({ type: "warning", message: "No Zone found!", zones: [] })
//         }
//         else {
//             const result = zones.map(zones => ({
//                 zones_id: zones._id,
//                 zones_Image: `${process.env.IMAGE_URL}/${zones.image?.replace(/\\/g, '/')}` || "",
//                 zones_sequence: zones.Zones_Sequence,
//                 categoryId: zones.CategoryId
//             }));
//             res.status(201).json({ type: "success", message: " Zone found successfully!", zones: result || [] })
//         }
//     } catch (error) {
//         res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error })
//     }
// });

// Delete all zoness
route.delete('/delete/all', async (req, res) => {
    try {
        const zoness = await Zones.find();

        if (zoness.length > 0) {
            for (const zones of zoness) {
                if (zones.image && fs.existsSync(zones.image)) {
                    try {
                        fs.unlinkSync(zones.image);
                    } catch (error) {

                    }
                }
            }
        }

        await Zones.deleteMany();
        res.status(200).json({ type: "success", message: "All Zone deleted successfully!" });
    } catch (error) {
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error });
    }
});

// Delete a specific zones by ID
route.delete('/delete/:id', async (req, res) => {
    const zonesId = req.params.id;
    try {
        const zones = await Zones.findById(zonesId);
        if (!zones) {
            res.status(404).json({ type: "error", message: "Zone not found!" });
        } else {
            try {
                if (zones.image && fs.existsSync(zones.image)) {
                    fs.unlinkSync(zones.image);
                }
            } catch (error) {

            }

            await Zones.findByIdAndDelete(zonesId);
            res.status(200).json({ type: "success", message: "Zone deleted successfully!" });
        }
    } catch (error) {
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error });
    }
});

// Delete multiple zoness by IDs
route.delete('/deletes', async (req, res) => {
    try {
        const { ids } = req.body;
        const zoness = await Zones.find({ _id: { $in: ids } });

        for (const zones of zoness) {
            if (zones.image && fs.existsSync(zones.image)) {
                try {
                    fs.unlinkSync(zones.image);
                } catch (error) {

                }
            }
        }

        await Zones.deleteMany({ _id: { $in: ids } });
        res.status(200).json({ type: "success", message: "All Zone deleted successfully!" });
    } catch (error) {
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error });
    }
});

// update only Zones feature 
route.put("/update/feature/:id", async (req, res) => {

    const ZonesId = await req.params.id

    try {
        const { feature } = req.body
        const newZones = await Zones.findByIdAndUpdate(ZonesId)
        newZones.feature = await feature

        await newZones.save()
        res.status(200).json({ type: "success", message: "Zone Status update successfully!" })

    } catch (error) {
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error })
    }

})

// Update a specific zones by ID
route.put('/update/byAdmin/:id', upload.single('image'), async (req, res) => {
    const zonesId = req.params.id;
    const { name } = req.body;

    try {
        const existingZones = await Zones.findOne({ name, _id: { $ne: zonesId } });

        if (existingZones) {
            try {
                fs.unlinkSync(req.file?.path);
            } catch (error) {

            }
            return res.status(200).json({ type: "warning", message: "Zone already exists!" });
        }

        const zones = await Zones.findById(zonesId);

        if (!zones) {
            try {
                fs.unlinkSync(req.file?.path);
            } catch (error) {

            }
            return res.status(404).json({ type: "warning", message: "Zone does not exist!" });
        }

        zones.name = name;


        if (req.file) {

            const extension = req.file.originalname.substring(req.file.originalname.lastIndexOf('.'));
            const random = Math.random() * 100;
            const imageFilename = `${name.replace(/\s/g, '_')}_${Date.now()}_${random}${extension}`;
            const imagePath = `imageUploads/frontend/zones/${imageFilename}`;

            fs.renameSync(req.file.path, imagePath);

            zones.image = imagePath;
        }

        await zones.save();
        res.status(200).json({ type: "success", message: "Zone updated successfully!" });
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