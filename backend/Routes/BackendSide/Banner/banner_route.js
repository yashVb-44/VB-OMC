const express = require('express')
const route = express.Router()
const multer = require('multer')
const Banner = require('../../../Models/BackendSide/banner_model')
const fs = require('fs');


// Set up multer middleware to handle file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './imageUploads/backend/banner')
    },
    filename: function (req, file, cb) {
        cb(null, file?.originalname)
    }
})
const upload = multer({ storage: storage })

// Create Banner
route.post('/add', upload.single('image'), async (req, res) => {
    try {
        const { sequence, name, meal } = req.body;

        const existingBanner = await Banner.findOne(req.body);
        const existingSequence = await Banner.findOne({ sequence });
        const existingBannerName = await Banner.findOne({ name });

        if (existingBanner) {
            try {
                fs.unlinkSync(req.file?.path);
            } catch (error) {

            }
            return res.status(202).json({ type: "warning", message: "Banner already exists!" });
        } else if (existingBannerName) {
            try {
                fs.unlinkSync(req.file?.path);
            } catch (error) {

            }
            return res.status(202).json({ type: "warning", message: "Banner with the same name already exists!" });
        } else if (existingSequence) {
            try {
                fs.unlinkSync(req.file?.path);
            } catch (error) {

            }
            return res.status(202).json({ type: "warning", message: "Sequence already exists! Please add a different sequence." });
        } else {
            const banner = new Banner({
                name: name,
                sequence: sequence,
                meal: meal,
            });

            if (req?.file) {
                const originalFilename = req.file.originalname;
                const extension = originalFilename.substring(originalFilename.lastIndexOf('.'));
                const imageFilename = `${req.body.name.replace(/[#$%]/g, '').replace(/\s/g, '_')}${extension}`;
                const imagePath = 'imageUploads/backend/banner/' + imageFilename;

                fs.renameSync(req?.file?.path, imagePath);

                const image = imagePath
                banner.image = image;
            }

            await banner.save();
            res.status(200).json({ type: "success", message: "Banner added successfully!" });
        }
    } catch (error) {
        if (req?.file) {
            try {
                fs.unlinkSync(req?.file?.path);
            } catch (error) {

            }
        }
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error });
        // console.log(error)
    }
});

// get all banner
route.get('/get', async (req, res) => {
    try {
        const banner = await Banner.find().populate('meal', 'name').sort({ createdAt: -1 });

        if (banner) {

            const result = banner.map(banner => ({
                _id: banner._id,
                name: banner.name,
                image: `${process.env.IMAGE_URL}/${banner.image?.replace(/\\/g, '/')}`,
                sequence: banner.sequence,
                feature: banner.feature,
                status: banner.status,
                meal: banner.meal?._id,
                MealName: banner.meal?.name
            }));

            res.status(201).json({ type: "success", message: "Banner found successfully!", banner: result || [] })
        }
        else {
            res.status(404).json({ type: "warning", message: "No Banner Found!", banner: [], banners: [] })
        }

    } catch (error) {
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error })

    }
});

// get banner by id
route.get('/get/:id', async (req, res) => {
    const bannerId = req.params.id
    try {
        const banner = await Banner.findById(bannerId).populate({
            path: 'meal',
            select: 'name',
        })
        if (!banner) {
            res.status(404).json({ type: "warning", message: "No Banner found!", banner: [] })
        }
        else {
            const result = {
                _id: banner._id,
                name: banner.name,
                image: `${process.env.IMAGE_URL}/${banner.image?.replace(/\\/g, '/')}`,
                sequence: banner.sequence,
                Meal: {
                    _id: banner.meal?._id,
                    name: banner.meal?.name,
                },
            }
            res.status(201).json({ type: "success", message: " Banner found successfully!", banner: result })
        };
    } catch (error) {
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error })
        console.log(error)
    }
});

// get all banner for mobile
route.get('/mob/get', async (req, res) => {
    try {
        const banner = await Banner.find({ status: true, feature: true }).sort({ sequence: 1 });
        if (!banner) {
            res.status(200).json({ type: "warning", message: "No Banner found!", banner: [] })
        }
        else {
            const result = banner.map(banner => ({
                _id: banner._id,
                name: banner.name,
                image: `${process.env.IMAGE_URL}/${banner.image?.replace(/\\/g, '/')}`,
                sequence: banner.sequence,
                feature: banner.feature,
                status: banner.status,
                meal: banner.meal?._id,
                MealName: banner.meal?.name
            }));
            res.status(201).json({ type: "success", message: " Banner found successfully!", banner: result || [] })
        }
    } catch (error) {
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error })
    }
});

// Delete all banners
route.delete('/delete', async (req, res) => {
    try {
        const banners = await Banner.find();

        if (banners.length > 0) {
            for (const banner of banners) {
                if (banner.image && fs.existsSync(banner.image)) {
                    try {
                        fs.unlinkSync(banner.image);
                    } catch (error) {

                    }
                }
            }
        }

        await Banner.deleteMany();
        res.status(200).json({ type: "success", message: "All Banners deleted successfully!" });
    } catch (error) {
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error });
    }
});

// Delete a specific banner by ID
route.delete('/delete/:id', async (req, res) => {
    const bannerId = req.params.id;
    try {
        const banner = await Banner.findById(bannerId);
        if (!banner) {
            res.status(404).json({ type: "error", message: "Banner not found!" });
        } else {
            try {
                if (banner.image && fs.existsSync(banner.image)) {
                    fs.unlinkSync(banner.image);
                }
            } catch (error) {

            }

            await Banner.findByIdAndDelete(bannerId);
            res.status(200).json({ type: "success", message: "Banner deleted successfully!" });
        }
    } catch (error) {
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error });
    }
});

// Delete multiple banners by IDs
route.delete('/deletes', async (req, res) => {
    try {
        const { ids } = req.body;
        const banners = await Banner.find({ _id: { $in: ids } });

        for (const banner of banners) {
            if (banner.image && fs.existsSync(banner.image)) {
                try {
                    fs.unlinkSync(banner.image);
                } catch (error) {

                }
            }
        }

        await Banner.deleteMany({ _id: { $in: ids } });
        res.status(200).json({ type: "success", message: "All Banners deleted successfully!" });
    } catch (error) {
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error });
    }
});

// update only Bannerstatus 
route.put("/update/status/:id", async (req, res) => {

    const BannerId = await req.params.id

    try {
        const { status } = req.body
        const newBanner = await Banner.findByIdAndUpdate(BannerId)
        newBanner.status = await status

        await newBanner.save()
        res.status(200).json({ type: "success", message: "Banner Status update successfully!" })

    } catch (error) {
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error })
    }

})

// update only Banner Feature 
route.put("/update/feature/:id", async (req, res) => {

    const BannerId = await req.params.id

    try {
        const { feature } = req.body
        const newBanner = await Banner.findByIdAndUpdate(BannerId)
        newBanner.feature = await feature

        await newBanner.save()
        res.status(200).json({ type: "success", message: "Banner Feature update successfully!" })

    } catch (error) {
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error })
    }

})

// Update a specific banner by ID
route.put('/update/:id', upload.single('image'), async (req, res) => {
    const bannerId = req.params.id;
    const { name, sequence, meal } = req.body;

    try {
        const existingBanner = await Banner.findOne({ name, _id: { $ne: bannerId } });
        const existingBannerSequence = await Banner.findOne({ sequence, _id: { $ne: bannerId } });

        if (existingBanner) {
            try {
                fs.unlinkSync(req.file?.path);
            } catch (error) {

            }
            return res.status(


            ).json({ type: "warning", message: "Banner already exists!" });
        }

        if (existingBannerSequence) {
            try {
                fs.unlinkSync(req.file?.path);
            } catch (error) {

            }
            return res.status(202).json({ type: "warning", message: "Sequence already exists! Please add a different sequence." });
        }

        const banner = await Banner.findById(bannerId);

        if (!banner) {
            try {
                fs.unlinkSync(req.file?.path);
            } catch (error) {

            }
            return res.status(404).json({ type: "warning", message: "Banner does not exist!" });
        }


        if (meal === undefined || meal === "") {
        }
        else {
            banner.meal = await meal
        }

        banner.name = name;
        banner.sequence = sequence;


        if (req.file) {

            if (banner.image && fs.existsSync(banner.image.path)) {
                try {
                    fs.unlinkSync(banner.image.path);
                } catch (error) {

                }
            }

            // Update the image details
            const originalFilename = req.file.originalname;
            const extension = originalFilename.substring(originalFilename.lastIndexOf('.'));
            const imageFilename = `${name.replace(/[#$%]/g, '').replace(/\s/g, '_')}${extension}`;
            const imagePath = 'imageUploads/backend/banner/' + imageFilename;

            fs.renameSync(req?.file?.path, imagePath);

            banner.image = imagePath;
        }

        await banner.save();
        res.status(200).json({ type: "success", message: "Banner updated successfully!" });
    } catch (error) {
        if (req.file) {
            try {
                fs.unlinkSync(req?.file?.path);
            } catch (error) {

            }
        }
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error });
    }
});




module.exports = route