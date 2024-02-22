const express = require("express");
const route = express.Router();
const multer = require("multer");
const Restaurant = require("../../../Models/Admin/restaurant_model");
const WarningLabels = require("../../../Models/BackendSide/warning_label_model");
const {
    Meal,
    Customization,
} = require("../../../Models/BackendSide/meal_model");
const fs = require("fs");
const path = require("path");

// Set up multer middleware to handle file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (file.fieldname === "gallary") {
            cb(null, "./imageUploads/backend/meal/gallary");
        } else if (file.fieldname === "cover") {
            cb(null, "./imageUploads/backend/meal/cover");
        } else {
            cb(new Error("Invalid fieldname"));
        }
    },
    filename: function (req, file, cb) {
        const originalFilename = file.originalname;
        const extension = originalFilename.substring(
            originalFilename.lastIndexOf(".")
        );
        const random = Math.random() * 100;
        const filename = `${originalFilename}_${Date.now()}_${random}${extension}`;
        cb(null, filename);
    },
});

const upload = multer({ storage: storage });

// create meal by restaurant
// route.post('/add/byRestaurant', upload.fields([{ name: 'image' }, { name: 'gallary' }, { name: 'cover' }]), async (req, res) => {
//     try {

//         const {
//             name,
//             price,
//             discount_price,
//             days,
//             night,
//             start_date,
//             end_date,
//             restaurant,
//             amenities,
//             overview,
//             inclusive,
//             exclusive,
//             itinerary,
//             terms_and_condition,
//             tour_type,
//             state,
//             city,
//         } = req.body;

//         const amenitiesName = amenities.split(',');

//         const meal = new Meal({
//             name,
//             price,
//             discount_price,
//             days,
//             night,
//             start_date,
//             end_date,
//             restaurant,
//             amenities: amenitiesName,
//             overview,
//             inclusive,
//             exclusive,
//             itinerary,
//             terms_and_condition,
//             tour_type,
//             state,
//             city,
//         });

//         await meal.save();

//         if (req.files['image']) {
//             const imageFile = req.files['image'][0];
//             const originalFilename = imageFile.originalname;
//             const extension = originalFilename.substring(originalFilename.lastIndexOf('.'));
//             const random = Math.random() * 100;
//             const imageFilename = `${name.slice(0, 4).replace(/\s/g, '_')}_${random}${extension}`;
//             const imagePath = 'imageUploads/backend/meal/cover/' + imageFilename;

//             try {
//                 fs.renameSync(imageFile.path, imagePath);
//             } catch (error) {
//                 console.error(error);
//             }

//             meal.image = imagePath;
//         }

//         if (req.files['images']) {
//             const galleryImages = req.files['images'].map((imageFile) => {
//                 const originalFilename = imageFile.originalname;
//                 const extension = originalFilename.substring(originalFilename.lastIndexOf('.'));
//                 const random = Math.random() * 100;
//                 return `imageUploads/backend/meal/gallary/${name.slice(0, 4).replace(/\s/g, '_')}_${random}${extension}`;
//             });

//             try {
//                 req.files['images'].forEach((imageFile, index) => {
//                     fs.renameSync(imageFile.path, galleryImages[index]);
//                 });
//             } catch (error) {
//                 console.error(error);
//             }

//             meal.images = galleryImages;
//         }

//         await meal.save();

//         res.status(200).json({ type: 'success', message: 'Meal added successfully!' });

//     } catch (error) {
//         // Handle errors and cleanup resources if necessary
//         console.error(error);

//         try {
//             if (req.files['image']) {
//                 fs.unlinkSync(req.files['image'][0].path);
//             }

//             if (req.files['images']) {
//                 req.files['images'].forEach((imageFile) => {
//                     fs.unlinkSync(imageFile.path);
//                 });
//             }

//         } catch (cleanupError) {
//             console.error(cleanupError);
//         }

//         res.status(500).json({ type: 'error', message: 'Server Error!', errorMessage: error.message || 'Unexpected error occurred' });
//     }
// });

// Route to add a tour package by a restaurant
route.post(
    "/add/byRestaurant",
    upload.fields([{ name: "gallary" }, { name: "cover" }]),
    async (req, res) => {
        try {
            const {
                name,
                description,
                meals,
                bites,
                restaurant,
                isCustimizeMandatory,
                warningLabels,
            } = req.body;

            const warning = warningLabels.split(",");

            const meal = new Meal({
                name,
                description,
                meals,
                bites,
                restaurant,
                isCustimizeMandatory,
                warningLabels: warning,
            });

            await meal.save();

            // Handle image upload

            if (req.files["cover"]) {
                const imageFile = req.files["cover"][0];
                const imagePath =
                    "imageUploads/backend/meal/cover/" + imageFile.filename;
                meal.cover = imagePath;
            }

            // Handle gallery images upload
            if (req.files["gallary"]) {
                const galleryImages = req.files["gallary"].map(async (imageFile) => {
                    const originalFilename = imageFile.originalname;
                    const extension = originalFilename.substring(
                        originalFilename.lastIndexOf(".")
                    );
                    const random = Math.random() * 100;
                    const newFilename = `${name
                        .slice(0, 4)
                        .replace(/\s/g, "_")}_${random}${extension}`;
                    const newPath = path.join(
                        "imageUploads",
                        "backend",
                        "meal",
                        "gallary",
                        newFilename
                    );

                    await fs.promises.rename(imageFile.path, newPath);
                    return newPath;
                });

                meal.gallary = await Promise.all(galleryImages);
            }

            await meal.save();

            res
                .status(200)
                .json({
                    type: "success",
                    message: "Meal added successfully!",
                    mealId: meal?._id,
                });
        } catch (error) {
            try {
                if (req.files) {
                    Object.values(req.files).forEach((fileArray) => {
                        fileArray.forEach((file) => {
                            fs.unlinkSync(file.path);
                        });
                    });
                }
            } catch (cleanupError) {
                console.error(cleanupError);
            }
            console.log(error);
            res
                .status(500)
                .json({
                    type: "error",
                    message: "Server Error!",
                    errorMessage: error.message || "Unexpected error occurred",
                });
        }
    }
);

// get all meal
route.get("/list/get/forAdmin", async (req, res) => {
    try {
        const meal = await Meal.find()
            .select(
                "name cover updatedAt restaurant bites meals status feature isCustimizeMandatory warningLabels"
            )
            .populate({
                path: "Customization",
            })
            .populate({
                path: "restaurant",
                select: "name _id",
            })
            .sort({ updatedAt: -1 });

        if (meal) {
            const result = meal.map((meal) => ({
                ...meal.toObject(),
                restaurant: meal?.restaurant?.name,
                cover: `${process.env.IMAGE_URL}/${meal.cover?.replace(/\\/g, "/")}`,
                Date: new Date(meal?.updatedAt)?.toLocaleDateString("en-IN"),
                Time: new Date(meal?.updatedAt)?.toLocaleTimeString("en-IN", {
                    hour12: true,
                }),
                isCustimizeMandatory:
                    meal?.isCustimizeMandatory === true ? "Yes" : "No",
                // CustimizeMandatoryStatus: meal?.isCustimizeMandatory
            }));
            res
                .status(201)
                .json({
                    type: "success",
                    message: "Meal found successfully!",
                    meal: result || [],
                });
        } else {
            res
                .status(404)
                .json({ type: "warning", message: "No Meal Found!", meal: [] });
        }
    } catch (error) {
        res
            .status(500)
            .json({ type: "error", message: "Server Error!", errorMessage: error });
        console.log(error);
    }
});

// get all active meal
route.get("/active/list/get/forAdmin", async (req, res) => {
    try {
        const meal = await Meal.find({ status: true }).select("name");

        if (meal) {
            const result = meal.map((meal) => ({
                ...meal.toObject(),
            }));
            res
                .status(201)
                .json({
                    type: "success",
                    message: "Meal found successfully!",
                    meal: result || [],
                });
        } else {
            res
                .status(404)
                .json({ type: "warning", message: "No Meal Found!", meal: [] });
        }
    } catch (error) {
        res
            .status(500)
            .json({ type: "error", message: "Server Error!", errorMessage: error });
        console.log(error);
    }
});

// get all active meal for user
route.get("/active/list/get/forUser", async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const page = parseInt(req.query.page) || 1;

        const skip = (page - 1) * limit;

        const mealCount = await Meal.countDocuments({ status: true });

        const totalPages = Math.ceil(mealCount / limit);

        const meal = await Meal.find({ status: true })
            .select("name cover")
            .populate({
                path: "restaurant",
                select: "name logo",
            })
            .skip(skip)
            .limit(limit);

        if (meal?.length >= 1) {
            const result = meal.map((meal) => ({
                ...meal.toObject(),
                restaurant: {
                    id: meal?.restaurant?._id,
                    name: meal?.restaurant?.name,
                    logo: `${process.env.IMAGE_URL}/${meal?.restaurant?.logo?.replace(
                        /\\/g,
                        "/"
                    )}`,
                },
                cover: `${process.env.IMAGE_URL}/${meal.cover?.replace(/\\/g, "/")}`,
            }));
            res
                .status(201)
                .json({
                    type: "success",
                    message: "Meal found successfully!",
                    meal: result || [],
                    totalCount: mealCount,
                    totalPages: totalPages,
                    currentPage: page
                });
        } else {
            res
                .status(404)
                .json({ type: "warning", message: "No Meal Found!", meal: [] });
        }
    } catch (error) {
        res
            .status(500)
            .json({ type: "error", message: "Server Error!", errorMessage: error });
        console.log(error);
    }
});

// get all meal of restaurant
route.get("/list/get/forRestaurant/:id", async (req, res) => {
    let id = req.params.id;
    try {
        const meal = await Meal.find({ restaurant: id })
            .populate({
                path: "restaurant",
                select: "name _id",
            })
            .sort({ updatedAt: -1 });

        if (meal) {
            const result = meal.map((meal) => ({
                ...meal.toObject(),
                cover: `${process.env.IMAGE_URL}/${meal.cover?.replace(/\\/g, "/")}`,
                restaurant: meal?.restaurant?._id,
                restaurantName: meal?.restaurant?.name,
                Date: new Date(meal?.updatedAt)?.toLocaleDateString("en-IN"),
                Time: new Date(meal?.updatedAt)?.toLocaleTimeString("en-IN", {
                    hour12: true,
                }),
            }));
            res
                .status(201)
                .json({
                    type: "success",
                    message: " Meal found successfully!",
                    meal: result || [],
                });
        } else {
            res
                .status(404)
                .json({ type: "warning", message: " No Meal Found!", meal: [] });
        }
    } catch (error) {
        res
            .status(500)
            .json({ type: "error", message: "Server Error!", errorMessage: error });
        console.log(error);
    }
});

// get single meal by User
route.get("/single/getByUser/:id", async (req, res) => {
    const mealId = req.params.id;
    try {
        const meal = await Meal.findById(mealId).populate({
            path: "restaurant",
            select: "name _id logo",
        }).populate({
            path: "Customization",
            // select: "name _id",
        }).select("-feature -status -updatedAt -createdAt")

        if (meal) {

            // Fetch warning labels separately
            const warningLabels = await WarningLabels.find({ name: { $in: meal.warningLabels } });

            const result = {
                ...meal.toObject(),
                cover: `${process.env.IMAGE_URL}/${meal.cover?.replace(/\\/g, "/")}`,
                gallary: meal?.gallary?.map((image) => {
                    return `${process.env.IMAGE_URL}/${image.replace(/\\/g, "/")}`;
                }),
                restaurant: {
                    id: meal?.restaurant?._id,
                    name: meal?.restaurant?.name,
                    logo: `${process.env.IMAGE_URL}/${meal?.restaurant?.logo?.replace(
                        /\\/g,
                        "/"
                    )}`,
                },
                warningLabels: warningLabels.map((label) => ({
                    name: label.name,
                    image: `${process.env.IMAGE_URL}/${label.image?.replace(/\\/g, "/")}`,
                })),
            };
            res
                .status(201)
                .json({
                    type: "success",
                    message: "Meal found successfully!",
                    meal: result || [],
                });
        } else {
            res
                .status(404)
                .json({ type: "warning", message: "No Meal Found!", meal: [] });
        }
    } catch (error) {
        res
            .status(500)
            .json({ type: "error", message: "Server Error!", errorMessage: error });
        console.log(error);
    }
});

// get single meal by admin
route.get("/single/get/:id", async (req, res) => {
    const tourId = req.params.id;
    try {
        const meal = await Meal.findById(tourId).populate({
            path: "restaurant",
            select: "name _id",
        });
        if (meal) {
            const result = {
                ...meal.toObject(),
                cover: `${process.env.IMAGE_URL}/${meal.cover?.replace(/\\/g, "/")}`,
                gallary: meal?.gallary?.map((image) => {
                    return `${process.env.IMAGE_URL}/${image.replace(/\\/g, "/")}`;
                }),
                restaurant: {
                    _id: meal.restaurant._id,
                    name: meal.restaurant.name,
                },
            };
            res
                .status(201)
                .json({
                    type: "success",
                    message: "Meal found successfully!",
                    meal: result || [],
                });
        } else {
            res
                .status(404)
                .json({ type: "warning", message: "No Meal Found!", meal: [] });
        }
    } catch (error) {
        res
            .status(500)
            .json({ type: "error", message: "Server Error!", errorMessage: error });
        console.log(error);
    }
});

// Delete all meal
route.delete("/deletes/all", async (req, res) => {
    try {
        const tours = await Meal.find();

        if (tours.length > 0) {
            for (const tour of tours) {
                if (tour.cover && fs.existsSync(tour.cover)) {
                    try {
                        fs.unlinkSync(tour.cover);
                    } catch (error) { }
                }
                if (tour.gallary && Array.isArray(tour.gallary)) {
                    for (const image of tour.gallary) {
                        try {
                            if (fs.existsSync(image)) {
                                fs.unlinkSync(image);
                            }
                        } catch (error) { }
                    }
                }
            }
        }

        await Meal.deleteMany();
        res
            .status(200)
            .json({
                type: "success",
                message: "All Tour-Packages deleted successfully!",
            });
    } catch (error) {
        res
            .status(500)
            .json({ type: "error", message: "Server Error!", errorMessage: error });
    }
});

// Delete a specific meal by ID
route.delete("/single/delete/:id", async (req, res) => {
    const tourId = req.params.id;
    try {
        const tour = await Meal.findById(tourId);
        if (!tour) {
            res
                .status(404)
                .json({ type: "error", message: "Tour-Package  not found!" });
        } else {
            try {
                if (tour.cover && fs.existsSync(tour.cover)) {
                    try {
                        fs.unlinkSync(tour.cover);
                    } catch (error) { }
                }
                if (tour.gallary && Array.isArray(tour.gallary)) {
                    for (const image of tour.gallary) {
                        try {
                            if (fs.existsSync(image)) {
                                fs.unlinkSync(image);
                            }
                        } catch (error) { }
                    }
                }
            } catch (error) { }

            await Meal.findByIdAndDelete(tourId);
            res
                .status(200)
                .json({
                    type: "success",
                    message: "Tour-Package deleted successfully!",
                });
        }
    } catch (error) {
        res
            .status(500)
            .json({ type: "error", message: "Server Error!", errorMessage: error });
    }
});

// Delete multiple meal by IDs
route.delete("/multiple/deletes", async (req, res) => {
    try {
        const { ids } = req.body;
        const tours = await Meal.find({ _id: { $in: ids } });

        for (const tour of tours) {
            if (tour.cover && fs.existsSync(tour.cover)) {
                try {
                    fs.unlinkSync(tour.cover);
                } catch (error) { }
            }
            if (tour.gallary && Array.isArray(tour.gallary)) {
                for (const image of tour.gallary) {
                    try {
                        if (fs.existsSync(image)) {
                            fs.unlinkSync(image);
                        }
                    } catch (error) { }
                }
            }
        }

        await Meal.deleteMany({ _id: { $in: ids } });
        res
            .status(200)
            .json({
                type: "success",
                message: "All Tour-Packages deleted successfully!",
            });
    } catch (error) {
        res
            .status(500)
            .json({ type: "error", message: "Server Error!", errorMessage: error });
    }
});

// update only meal status
route.put("/update/status/:id", async (req, res) => {
    const TourId = await req.params.id;

    try {
        const { status } = req.body;
        const newTour = await Meal.findByIdAndUpdate(TourId);
        newTour.status = await status;

        await newTour.save();
        res
            .status(200)
            .json({
                type: "success",
                message: "Tour-Package Status update successfully!",
            });
    } catch (error) {
        res
            .status(500)
            .json({ type: "error", message: "Server Error!", errorMessage: error });
    }
});

// update only meal feature
route.put("/update/feature/:id", async (req, res) => {
    const TourId = await req.params.id;

    try {
        const { feature } = req.body;
        const newTour = await Meal.findByIdAndUpdate(TourId);
        newTour.feature = await feature;

        await newTour.save();
        res
            .status(200)
            .json({
                type: "success",
                message: "Tour-Package Feature update successfully!",
            });
    } catch (error) {
        res
            .status(500)
            .json({ type: "error", message: "Server Error!", errorMessage: error });
    }
});

// update meal
route.put(
    "/update/:id",
    upload.fields([
        { name: "image" },
        { name: "gallary" },
        { name: "cover" },
        { name: "pdf" },
    ]),
    async (req, res) => {
        try {
            const { id } = req.params;

            const {
                name,
                description,
                meals,
                bites,
                restaurant,
                isCustimizeMandatory,
                warningLabels,
            } = req.body;

            const warning = warningLabels.split(",");

            const updatedMeal = {
                name,
                description,
                meals,
                bites,
                restaurant,
                isCustimizeMandatory,
                warningLabels: warning,
            };

            if (req.files["cover"]) {
                const imageFile = req.files["cover"][0];
                const imagePath =
                    "imageUploads/backend/meal/cover/" + imageFile.filename;
                updatedMeal.cover = imagePath;
            }

            // Handle gallery images upload
            if (req.files["gallary"]) {
                const galleryImages = req.files["gallary"].map(async (imageFile) => {
                    const originalFilename = imageFile.originalname;
                    const extension = originalFilename.substring(
                        originalFilename.lastIndexOf(".")
                    );
                    const random = Math.random() * 100;
                    const newFilename = `${name
                        .slice(0, 4)
                        .replace(/\s/g, "_")}_${random}${extension}`;
                    const newPath = path.join(
                        "imageUploads",
                        "backend",
                        "meal",
                        "gallary",
                        newFilename
                    );

                    await fs.promises.rename(imageFile.path, newPath);
                    return newPath;
                });

                updatedMeal.gallary = await Promise.all(galleryImages);
            }

            // Update the meal
            await Meal.findByIdAndUpdate(id, updatedMeal);

            res
                .status(200)
                .json({ type: "success", message: "Meal updated successfully!" });
        } catch (error) {
            try {
                if (req.files) {
                    Object.values(req.files).forEach((fileArray) => {
                        fileArray.forEach((file) => {
                            fs.unlinkSync(file.path);
                        });
                    });
                }
            } catch (cleanupError) {
                console.error(cleanupError);
            }
            console.log(error);
            res
                .status(500)
                .json({
                    type: "error",
                    message: "Server Error!",
                    message: error.message || "Unexpected error occurred",
                });
        }
    }
);

module.exports = route;
