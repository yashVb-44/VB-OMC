const express = require('express')
const route = express.Router()
const multer = require('multer')
const WarningLabel = require('../../../Models/BackendSide/warning_label_model')
const fs = require('fs');



// Set up multer middleware to handle file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './imageUploads/backend/warningLabel')
    },
    filename: function (req, file, cb) {
        cb(null, file?.originalname)
    }
})
const upload = multer({ storage: storage })


// Create WarningLabel
route.post('/add/byAdmin', upload.single('image'), async (req, res) => {
    try {
        const { name } = req.body;

        const existingWarningLabel = await WarningLabel.findOne({ name });


        if (existingWarningLabel) {
            try {
                if (req?.file) {
                    fs.unlinkSync(req?.file?.path);
                }
            } catch (cleanupError) {
                console.error(cleanupError);
            }
            return res.status(202).json({ type: "warning", message: "WarningLabel is already exists!" });
        }

        const warninglabel = new WarningLabel({
            name
        });

        if (req.file) {
            const extension = req.file.originalname.substring(req.file.originalname.lastIndexOf('.'));
            const random = Math.random() * 100;
            const imageFilename = `${name.replace(/\s/g, '_')}_${Date.now()}_${random}${extension}`;
            const imagePath = `imageUploads/backend/warningLabel/${imageFilename}`;

            fs.renameSync(req.file.path, imagePath);
            warninglabel.image = imagePath;

        }

        await warninglabel.save()
        return res.status(200).json({ type: 'success', message: 'Warning-Label added successfully!' });

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

// get all warningLabel
route.get('/list/get', async (req, res) => {
    try {
        const warningLabel = await WarningLabel.find().sort({ createdAt: -1 });

        if (warningLabel) {

            const result = warningLabel.map(warningLabel => ({
                _id: warningLabel?._id,
                name: warningLabel?.name,
                image: `${process.env.IMAGE_URL}/${warningLabel.image?.replace(/\\/g, '/')}`,
                feature: warningLabel?.feature,
                status: warningLabel?.status
            }))
            res.status(201).json({ type: "success", message: " Warning-Label found successfully!", warningLabel: result || [] })
        }
        else {
            res.status(404).json({ type: "warning", message: " No Warning-Label Found!", warningLabel: [] })
        }

    } catch (error) {
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error })
        console.log(error)
    }
});

// get all warningLabel (for frotend side list)
route.get('/list/getAll', async (req, res) => {
    try {
        const warningLabel = await WarningLabel.find({ status: true }).sort({ createdAt: -1 });

        if (warningLabel) {

            const result = warningLabel.map(warningLabel => ({
                name: warningLabel?.name,
            }))
            res.status(201).json({ type: "success", message: " Warning-Label found successfully!", warningLabel: result || [] })
        }
        else {
            res.status(404).json({ type: "warning", message: " No Warning-Label Found!", warningLabel: [] })
        }

    } catch (error) {
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error })
        console.log(error)
    }
});

// get warningLabel with server-side pagination
// route.get('/list/get', async (req, res) => {

//     try {
//         const page = parseInt(req.query.page) || 1;
//         const pageSize = parseInt(req.query.limit) || 10;

//         const totalWarningLabelCount = await WarningLabel.countDocuments();
//         const totalPages = Math.ceil(totalWarningLabelCount / pageSize);

//         const warningLabel = await WarningLabel.find()
//             .sort({ createdAt: -1 })
//             .skip((page - 1) * pageSize)
//             .limit(pageSize);

//         if (warningLabel.length > 0) {
//             const result = warningLabel.map((amenity) => ({
//                 id: amenity?._id,
//                 name: amenity?.name,
//                 image: `${process.env.IMAGE_URL}/${amenity.image?.replace(/\\/g, '/')}`,
//             }));

//             res.status(200).json({
//                 type: 'success',
//                 message: 'WarningLabel found successfully!',
//                 warningLabel: result || [],
//                 total: totalWarningLabelCount,
//                 totalPages: totalPages,
//                 currentPage: page,
//                 limit: pageSize

//             });
//         } else {
//             res.status(404).json({ type: 'warning', message: 'No WarningLabel Found!', warningLabel: [] });
//         }
//     } catch (error) {
//         res.status(500).json({ type: 'error', message: 'Server Error!', errorMessage: error });
//         console.log(error);
//     }
// });


// get warningLabel by id
route.get('/single/get/:id', async (req, res) => {
    const warningLabelId = req.params.id
    try {
        const warningLabel = await WarningLabel.findById(warningLabelId)
        if (!warningLabel) {
            res.status(404).json({ type: "warning", message: "No Warning-Label found!", warningLabel: [] })
        }
        else {
            const result = {
                _id: warningLabel?._id,
                name: warningLabel?.name,
                image: `${process.env.IMAGE_URL}/${warningLabel.image?.replace(/\\/g, '/')}`,
            }
            res.status(201).json({ type: "success", message: " Warning-Label found successfully!", warningLabel: result })
        };
    } catch (error) {
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error })
        console.log(error)
    }
});

// get all warningLabel for mobile
// route.get('/mob/get', async (req, res) => {
//     try {
//         const warningLabel = await WarningLabel.find({ WarningLabel_Status: true }).sort({ WarningLabel_Sequence: -1 });
//         if (!warningLabel) {
//             res.status(200).json({ type: "warning", message: "No WarningLabel found!", warningLabel: [] })
//         }
//         else {
//             const result = warningLabel.map(warningLabel => ({
//                 warningLabel_id: warningLabel._id,
//                 warningLabel_Image: `${process.env.IMAGE_URL}/${warningLabel.image?.replace(/\\/g, '/')}` || "",
//                 warningLabel_sequence: warningLabel.WarningLabel_Sequence,
//                 warningLabelId: warningLabel.WarningLabelId
//             }));
//             res.status(201).json({ type: "success", message: " WarningLabel found successfully!", warningLabel: result || [] })
//         }
//     } catch (error) {
//         res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error })
//     }
// });

// Delete all warningLabels
route.delete('/delete/all', async (req, res) => {
    try {
        const warningLabels = await WarningLabel.find();

        if (warningLabels.length > 0) {
            for (const warningLabel of warningLabels) {
                if (warningLabel.image && fs.existsSync(warningLabel.image)) {
                    try {
                        fs.unlinkSync(warningLabel.image);
                    } catch (error) {

                    }
                }
            }
        }

        await WarningLabel.deleteMany();
        res.status(200).json({ type: "success", message: "All Warning-Label deleted successfully!" });
    } catch (error) {
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error });
    }
});

// Delete a specific warningLabel by ID
route.delete('/delete/:id', async (req, res) => {

    const warningLabelId = req.params.id;

    try {
        const warningLabel = await WarningLabel.findById(warningLabelId);
        if (!warningLabel) {
            res.status(404).json({ type: "error", message: "Warning-Label not found!" });
        } else {
            try {
                if (warningLabel.image && fs.existsSync(warningLabel.image)) {
                    fs.unlinkSync(warningLabel.image);
                }
            } catch (error) {

            }

            await WarningLabel.findByIdAndDelete(warningLabelId);
            res.status(200).json({ type: "success", message: "Warning-Label deleted successfully!" });
        }
    } catch (error) {
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error });
    }
});

// Delete multiple warningLabels by IDs
route.delete('/deletes', async (req, res) => {
    try {
        const { ids } = req.body;
        const warningLabels = await WarningLabel.find({ _id: { $in: ids } });

        for (const warningLabel of warningLabels) {
            if (warningLabel.image && fs.existsSync(warningLabel.image)) {
                try {
                    fs.unlinkSync(warningLabel.image);
                } catch (error) {

                }
            }
        }

        await WarningLabel.deleteMany({ _id: { $in: ids } });
        res.status(200).json({ type: "success", message: "All Warning-Label deleted successfully!" });
    } catch (error) {
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error });
    }
});

// update only WarningLabel status 
route.put("/update/status/:id", async (req, res) => {

    const WarningLabelId = await req.params.id

    try {
        const { status } = req.body
        const newWarningLabel = await WarningLabel.findByIdAndUpdate(WarningLabelId)
        newWarningLabel.status = await status

        await newWarningLabel.save()
        res.status(200).json({ type: "success", message: "Warning-Label Status update successfully!" })

    } catch (error) {
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error })
    }

})

// update only WarningLabel feature 
route.put("/update/feature/:id", async (req, res) => {

    const WarningLabelId = await req.params.id

    try {
        const { feature } = req.body
        const newWarningLabel = await WarningLabel.findByIdAndUpdate(WarningLabelId)
        newWarningLabel.feature = await feature

        await newWarningLabel.save()
        res.status(200).json({ type: "success", message: "Warning-Label Status update successfully!" })

    } catch (error) {
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error })
    }

})

// Update a specific warningLabel by ID
route.put('/update/byAdmin/:id', upload.single('image'), async (req, res) => {
    const warningLabelId = req.params.id;
    const { name } = req.body;

    try {
        const existingWarningLabel = await WarningLabel.findOne({ name, _id: { $ne: warningLabelId } });

        if (existingWarningLabel) {
            try {
                fs.unlinkSync(req.file?.path);
            } catch (error) {

            }
            return res.status(200).json({ type: "warning", message: "Warning-Label already exists!" });
        }

        const warningLabel = await WarningLabel.findById(warningLabelId);

        if (!warningLabel) {
            try {
                fs.unlinkSync(req.file?.path);
            } catch (error) {

            }
            return res.status(404).json({ type: "warning", message: "Warning-Label does not exist!" });
        }

        warningLabel.name = name;


        if (req.file) {

            const extension = req.file.originalname.substring(req.file.originalname.lastIndexOf('.'));
            const random = Math.random() * 100;
            const imageFilename = `${name.replace(/\s/g, '_')}_${Date.now()}_${random}${extension}`;
            const imagePath = `imageUploads/backend/warningLabel/${imageFilename}`;

            fs.renameSync(req.file.path, imagePath);

            warningLabel.image = imagePath;
        }

        await warningLabel.save();
        res.status(200).json({ type: "success", message: "Warning-Label updated successfully!" });
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