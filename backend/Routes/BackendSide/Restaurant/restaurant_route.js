const express = require('express')
const route = express.Router()
const multer = require('multer')
const Restaurant = require('../../../Models/Admin/restaurant_model')
const adminMiddleWare = require('../../../Middleware/adminMiddleWares')
const restaurantMiddleWare = require('../../../Middleware/restaurantMiddleWares')
const bcrypt = require('bcrypt');
const fs = require('fs');
const jwt = require('jsonwebtoken');

let secretKey = process.env.JWT_TOKEN;


// Set up multer middleware to handle file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (file.fieldname === 'image') {
            cb(null, './imageUploads/backend/restaurant/image');
        } else if (file.fieldname === 'logo') {
            cb(null, './imageUploads/backend/restaurant/logo');
        } else if (file.fieldname === 'other') {
            cb(null, './imageUploads/backend/restaurant/other');
        }
    },
    filename: function (req, file, cb) {
        const originalFilename = file.originalname;
        const extension = originalFilename.substring(originalFilename.lastIndexOf('.'));
        const random = Math.random() * 100;
        const filename = `${originalFilename}_${Date.now()}_${random}${extension}`;
        cb(null, filename);
    }
})
const upload = multer({ storage: storage })

// Create Restaurant
route.post('/add/byAdmin', adminMiddleWare, upload.fields([{ name: 'image' }, { name: 'logo' }, { name: 'other' }]), async (req, res) => {
    try {
        const { name, email, password, mobileNo, no, address, country, state, city, zipcode, lat, lng, area, street, open_time, close_time, bankdetailsOne, bankdetailsTwo, days } = req.body;
        const existingRestaurantEmail = await Restaurant.findOne({ email });
        const existingRestaurantMobile = await Restaurant.findOne({ mobileNo });
        const parsedDays = JSON.parse(days);


        if (existingRestaurantEmail) {
            try {
                if (req.files) {
                    Object.values(req.files).forEach(fileArray => {
                        fileArray.forEach(file => {
                            fs.unlinkSync(file.path);
                        });
                    });
                }
            } catch (cleanupError) {
                console.error(cleanupError);
            }
            return res.status(202).json({ type: "warning", message: "Restaurant with the same email id already exists!" });
        } else if (existingRestaurantMobile) {
            try {
                if (req.files) {
                    Object.values(req.files).forEach(fileArray => {
                        fileArray.forEach(file => {
                            fs.unlinkSync(file.path);
                        });
                    });
                }
            } catch (cleanupError) {
                console.error(cleanupError);
            }
            return res.status(202).json({ type: "warning", message: "Restaurant with the same mobile no already exists!" });
        } else {
            const hashedPassword = await bcrypt.hash(password, 10);
            const restaurant = new Restaurant({
                name,
                email,
                password: hashedPassword,
                mobileNo,
                no,
                country,
                address,
                state,
                city,
                zipcode,
                lat,
                lng,
                area,
                street,
                open_time,
                close_time,
                bankdetailsOne,
                bankdetailsTwo,
                days: parsedDays
            });

            if (req.files['image']) {
                const imageFile = req.files['image'][0];
                const imagePath = 'imageUploads/backend/restaurant/image/' + imageFile.filename;
                restaurant.image = imagePath;
            }

            if (req.files['logo']) {
                const profileFile = req.files['logo'][0];
                const profilePath = 'imageUploads/backend/restaurant/logo/' + profileFile.filename;
                restaurant.logo = profilePath;
            }

            if (req.files['other']) {
                const otherFile = req.files['other'][0];
                const otherPath = 'imageUploads/backend/restaurant/other/' + otherFile.filename;
                restaurant.other = otherPath;
            }

            await restaurant.save();
            res.status(200).json({ type: "success", message: "Restaurant added successfully!" });
        }
    } catch (error) {
        try {
            if (req.files) {
                Object.values(req.files).forEach(fileArray => {
                    fileArray.forEach(file => {
                        fs.unlinkSync(file.path);
                    });
                });
            }
        } catch (cleanupError) {
            console.error(cleanupError);
        }
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error });
        console.log(error)
    }
});

// get all restaurants
route.get('/list/get', async (req, res) => {
    try {
        // const restaurant = await Restaurant.find().select('_id name image state city mobileNo email createdAt feature block open_time close_time').sort({ createdAt: -1 });
        const restaurant = await Restaurant.find().sort({ createdAt: -1 });

        if (restaurant) {

            const result = restaurant.map(restaurant => ({
                ...restaurant.toObject(),
                image: `${process.env.IMAGE_URL}/${restaurant.image?.replace(/\\/g, '/')}`,
                Date: new Date(restaurant?.createdAt)?.toLocaleDateString('en-IN'),
                Time: new Date(restaurant?.createdAt)?.toLocaleTimeString('en-IN', { hour12: true }),
            }));

            res.status(201).json({ type: "success", message: " Restaurant found successfully!", restaurant: result || [] })
        }
        else {
            res.status(404).json({ type: "warning", message: " No Restaurant Found!", restaurant: [], restaurants: [] })
        }

    } catch (error) {
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error })
        console.log(error)
    }
});

// get all restaurants
route.get('/list/getAll', async (req, res) => {
    try {
        const restaurant = await Restaurant.find({ status: "OnBord" }).select('name').sort({ createdAt: -1 });

        if (restaurant) {

            const result = restaurant.map(restaurant => ({
                ...restaurant.toObject(),
            }));

            res.status(201).json({ type: "success", message: " Restaurant found successfully!", restaurant: result || [] })
        }
        else {
            res.status(404).json({ type: "warning", message: " No Restaurant Found!", restaurant: [], restaurants: [] })
        }

    } catch (error) {
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error })
        console.log(error)
    }
});

// get restaurant by id
route.get('/single/get/:id', async (req, res) => {
    const restaurantId = req.params.id
    try {
        const restaurant = await Restaurant.findById(restaurantId).select('-password')

        if (!restaurant) {
            res.status(404).json({ type: "warning", message: "No Restaurant found!", restaurant: [] })
        }
        else {

            const result = {
                ...restaurant.toObject(),
                image: `${process.env.IMAGE_URL}/${restaurant.image?.replace(/\\/g, '/')}`,
                logo: `${process.env.IMAGE_URL}/${restaurant.logo?.replace(/\\/g, '/')}`,
                other: `${process.env.IMAGE_URL}/${restaurant.other?.replace(/\\/g, '/')}`,
            };

            res.status(201).json({ type: "success", message: " Restaurant found successfully!", restaurant: result })
        };
    } catch (error) {
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error })
        console.log(error)
    }
});

// get all restaurant for mobile
// route.get('/mob/get', async (req, res) => {
//     try {
//         const restaurant = await Restaurant.find({ Restaurant_Status: true }).sort({ Restaurant_Sequence: -1 });
//         if (!restaurant) {
//             res.status(200).json({ type: "warning", message: "No Restaurant found!", restaurant: [] })
//         }
//         else {
//             const result = restaurant.map(restaurant => ({
//                 restaurant_id: restaurant._id,
//                 restaurant_Image: `${process.env.IMAGE_URL}/${restaurant.image?.replace(/\\/g, '/')}` || "",
//                 restaurant_sequence: restaurant.Restaurant_Sequence,
//                 categoryId: restaurant.CategoryId
//             }));
//             res.status(201).json({ type: "success", message: " Restaurant found successfully!", restaurant: result || [] })
//         }
//     } catch (error) {
//         res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error })
//     }
// });

// Delete all restaurants
route.delete('/deletes/all', async (req, res) => {
    try {
        const restaurants = await Restaurant.find();

        if (restaurants.length > 0) {
            for (const restaurant of restaurants) {
                if (restaurant.image && fs.existsSync(restaurant.image)) {
                    try {
                        fs.unlinkSync(restaurant.image);
                    } catch (error) {

                    }
                }
                if (restaurant.logo && fs.existsSync(restaurant.logo)) {
                    try {
                        fs.unlinkSync(restaurant.logo);
                    } catch (error) {

                    }
                }
                if (restaurant.other && fs.existsSync(restaurant.other)) {
                    try {
                        fs.unlinkSync(restaurant.other);
                    } catch (error) {

                    }
                }
            }
        }

        await Restaurant.deleteMany();
        res.status(200).json({ type: "success", message: "All Restaurants deleted successfully!" });
    } catch (error) {
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error });
    }
});

// Delete a specific restaurant by ID
route.delete('/single/delete/:id', async (req, res) => {
    const restaurantId = req.params.id;
    try {
        const restaurant = await Restaurant.findById(restaurantId);
        if (!restaurant) {
            res.status(404).json({ type: "error", message: "Restaurant not found!" });
        } else {
            try {
                if (restaurant.image && fs.existsSync(restaurant.image)) {
                    try {
                        fs.unlinkSync(restaurant.image);
                    } catch (error) {

                    }
                }
                if (restaurant.logo && fs.existsSync(restaurant.logo)) {
                    try {
                        fs.unlinkSync(restaurant.logo);
                    } catch (error) {

                    }
                }
                if (restaurant.other && fs.existsSync(restaurant.other)) {
                    try {
                        fs.unlinkSync(restaurant.other);
                    } catch (error) {

                    }
                }
            } catch (error) {

            }

            await Restaurant.findByIdAndDelete(restaurantId);
            res.status(200).json({ type: "success", message: "Restaurant deleted successfully!" });
        }
    } catch (error) {
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error });
    }
});

// Delete multiple restaurants by IDs
route.delete('/multiple/deletes', async (req, res) => {
    try {
        const { ids } = req.body;
        const restaurants = await Restaurant.find({ _id: { $in: ids } });

        for (const restaurant of restaurants) {
            if (restaurant.image && fs.existsSync(restaurant.image)) {
                try {
                    fs.unlinkSync(restaurant.image);
                } catch (error) {

                }
            }
            if (restaurant.logo && fs.existsSync(restaurant.logo)) {
                try {
                    fs.unlinkSync(restaurant.logo);
                } catch (error) {

                }
            }
            if (restaurant.other && fs.existsSync(restaurant.other)) {
                try {
                    fs.unlinkSync(restaurant.other);
                } catch (error) {

                }
            }
        }

        await Restaurant.deleteMany({ _id: { $in: ids } });
        res.status(200).json({ type: "success", message: "All Restaurants deleted successfully!" });
    } catch (error) {
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error });
    }
});

// update only Restaurant Auth status (block or unblock) 
// route.put("/update/auth/status/:id", async (req, res) => {

//     const RestaurantId = await req.params.id

//     try {
//         const { block } = req.body
//         const newRestaurant = await Restaurant.findByIdAndUpdate(RestaurantId)
//         newRestaurant.block = await block

//         await newRestaurant.save()
//         res.status(200).json({ type: "success", message: "Restaurant Auth Status update successfully!" })

//     } catch (error) {
//         res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error })
//     }

// })

// update only Restaurant feature status  
route.put("/update/feature/status/:id", async (req, res) => {

    const RestaurantId = await req.params.id

    try {
        const { feature } = req.body
        const newRestaurant = await Restaurant.findByIdAndUpdate(RestaurantId)
        newRestaurant.feature = await feature

        await newRestaurant.save()
        res.status(200).json({ type: "success", message: "Restaurant Feature Status update successfully!" })

    } catch (error) {
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error })
    }

})

// Update a specific restaurant by ID
// route.put('/update/byAdmin/:id', upload.single('image'), async (req, res) => {
//     const restaurantId = req.params.id;
//     const { name, email, password, mobileNo } = req.body;

//     try {

//         const existingRestaurantEmail = await Restaurant.findOne({ email, _id: { $ne: restaurantId } });
//         const existingRestaurantmobileNo = await Restaurant.findOne({ mobileNo, _id: { $ne: restaurantId } });

//         if (existingRestaurantEmail) {
//             try {
//                 fs.unlinkSync(req.file?.path);
//             } catch (error) {

//             }
//             return res.status(200).json({ type: "warning", message: "Restaurant email already exists!" });
//         }

//         if (existingRestaurantmobileNo) {
//             try {
//                 fs.unlinkSync(req.file?.path);
//             } catch (error) {

//             }
//             return res.status(202).json({ type: "warning", message: "Mobile No already exists! Please add a different Mobile No." });
//         }

//         const restaurant = await Restaurant.findById(restaurantId);

//         if (!restaurant) {
//             try {
//                 fs.unlinkSync(req.file?.path);
//             } catch (error) {

//             }
//             return res.status(404).json({ type: "warning", message: "Restaurant does not exist!" });
//         }


//         if (password === undefined || password === "") {
//         }
//         else {
//             const hashedPassword = await bcrypt.hash(password, 10);
//             restaurant.password = hashedPassword
//         }

//         restaurant.name = name;
//         restaurant.email = email;
//         restaurant.mobileNo = mobileNo;


//         if (req.file) {

//             if (restaurant.image && fs.existsSync(restaurant.image.path)) {
//                 try {
//                     fs.unlinkSync(restaurant.image.path);
//                 } catch (error) {

//                 }
//             }

//             // Update the image details
//             const originalFilename = req.file.originalname;
//             const extension = originalFilename.substring(originalFilename.lastIndexOf('.'));
//             const random = Math.random() * 100;
//             const imageFilename = `${name.replace(/[#$%]/g, '').replace(/\s/g, '_')}_${Date.now()}_${random}${extension}`;
//             const imagePath = 'imageUploads/backend/restaurant/' + imageFilename;

//             fs.renameSync(req?.file?.path, imagePath);

//             restaurant.image = imagePath;
//         }

//         await restaurant.save();
//         res.status(200).json({ type: "success", message: "Restaurant updated successfully!" });
//     } catch (error) {
//         if (req.file) {
//             try {
//                 fs.unlinkSync(req?.file?.path);
//             } catch (error) {

//             }
//         }
//         res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error });
//         console.log(error)
//     }
// });

// Update a specific restaurant by ID
route.put('/update/byAdmin/:id', upload.fields([
    { name: 'image' },
    { name: 'logo' },
    { name: 'other' }
]), async (req, res) => {
    const restaurantId = req.params.id;
    const { name, email, password, mobileNo, no, address, country, state, city, zipcode, lat, lng, area, street, open_time, close_time, bankdetailsOne, bankdetailsTwo, status, days } = req.body;
    const parsedDays = JSON.parse(days);
    try {
        const existingRestaurantEmail = await Restaurant.findOne({ email, _id: { $ne: restaurantId } });
        const existingRestaurantMobileNo = await Restaurant.findOne({ mobileNo, _id: { $ne: restaurantId } });

        if (existingRestaurantEmail) {
            try {
                if (req.files) {
                    Object.values(req.files).forEach(fileArray => {
                        fileArray.forEach(file => {
                            fs.unlinkSync(file.path);
                        });
                    });
                }
            } catch (cleanupError) {
                console.error(cleanupError);
            }
            return res.status(200).json({ type: "warning", message: "Restaurant with this email already exists!" });
        }

        if (existingRestaurantMobileNo) {
            try {
                if (req.files) {
                    Object.values(req.files).forEach(fileArray => {
                        fileArray.forEach(file => {
                            fs.unlinkSync(file.path);
                        });
                    });
                }
            } catch (cleanupError) {
                console.error(cleanupError);
            }
            return res.status(202).json({ type: "warning", message: "Mobile No already exists! Please add a different Mobile No." });
        }

        const restaurant = await Restaurant.findById(restaurantId);

        if (!restaurant) {
            try {
                if (req.files) {
                    Object.values(req.files).forEach(fileArray => {
                        fileArray.forEach(file => {
                            fs.unlinkSync(file.path);
                        });
                    });
                }
            } catch (cleanupError) {
                console.error(cleanupError);
            }
            return res.status(404).json({ type: "warning", message: "Restaurant does not exist!" });
        }

        if (password !== undefined && password !== "") {
            const hashedPassword = await bcrypt.hash(password, 10);
            restaurant.password = hashedPassword;
        }

        restaurant.name = name;
        restaurant.email = email;
        restaurant.mobileNo = mobileNo;
        restaurant.no = no;
        restaurant.address = address;
        restaurant.country = country;
        restaurant.area = area === "" || area === undefined ? "" : area;
        restaurant.street = street === "" || street === undefined ? "" : street;
        restaurant.state = state;
        restaurant.city = city;
        restaurant.zipcode = zipcode;
        restaurant.lat = lat
        restaurant.lng = lng
        restaurant.open_time = open_time
        restaurant.close_time = close_time
        restaurant.bankdetailsOne = bankdetailsOne === "" || bankdetailsOne === undefined ? "" : bankdetailsOne
        restaurant.bankdetailsTwo = bankdetailsTwo === "" || bankdetailsOne === undefined ? "" : bankdetailsTwo
        restaurant.status = status
        restaurant.days = parsedDays


        // Handle file uploads
        if (req.files) {
            if (req.files['image']) {
                const file = req.files['image'][0];
                const filePath = `imageUploads/backend/restaurant/image/${file.filename}`;
                if (restaurant.image && fs.existsSync(restaurant.image)) {
                    fs.unlinkSync(restaurant.image);
                }
                fs.renameSync(file.path, filePath);
                restaurant.image = filePath;
            }

            if (req.files['logo']) {
                const file = req.files['logo'][0];
                const filePath = `imageUploads/backend/restaurant/logo/${file.filename}`;
                if (restaurant.logo && fs.existsSync(restaurant.logo)) {
                    fs.unlinkSync(restaurant.logo);
                }
                fs.renameSync(file.path, filePath);
                restaurant.logo = filePath;
            }

            if (req.files['other']) {
                const file = req.files['other'][0];
                const filePath = `imageUploads/backend/restaurant/other/${file.filename}`;
                if (restaurant.other && fs.existsSync(restaurant.other)) {
                    fs.unlinkSync(restaurant.other);
                }
                fs.renameSync(file.path, filePath);
                restaurant.other = filePath;
            }


        }

        await restaurant.save();
        res.status(200).json({ type: "success", message: "Restaurant updated successfully!" });
    } catch (error) {
        try {
            if (req.files) {
                Object.values(req.files).forEach(fileArray => {
                    fileArray.forEach(file => {
                        fs.unlinkSync(file.path);
                    });
                });
            }
        } catch (cleanupError) {
            console.error(cleanupError);
        }

        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error });
        console.log(error);
    }
});

// Update a Restaurant Porfile by restaurant itself 
route.put('/profile/update/byRestaurant', restaurantMiddleWare, upload.fields([
    { name: 'image' },
    { name: 'logo' },
    { name: 'other' }
]), async (req, res) => {
    const restaurantId = req.user.id;
    const { name, email, password, mobileNo, no, address, country, state, city, zipcode, lat, lng, area, street, open_time, close_time, bankdetailsOne, bankdetailsTwo } = req.body;

    try {
        const existingRestaurantEmail = await Restaurant.findOne({ email, _id: { $ne: restaurantId } });
        const existingRestaurantMobileNo = await Restaurant.findOne({ mobileNo, _id: { $ne: restaurantId } });

        if (existingRestaurantEmail) {
            try {
                if (req.files) {
                    Object.values(req.files).forEach(fileArray => {
                        fileArray.forEach(file => {
                            fs.unlinkSync(file.path);
                        });
                    });
                }
            } catch (cleanupError) {
                console.error(cleanupError);
            }
            return res.status(200).json({ type: "warning", message: "Restaurant with this email already exists!" });
        }

        if (existingRestaurantMobileNo) {
            try {
                if (req.files) {
                    Object.values(req.files).forEach(fileArray => {
                        fileArray.forEach(file => {
                            fs.unlinkSync(file.path);
                        });
                    });
                }
            } catch (cleanupError) {
                console.error(cleanupError);
            }
            return res.status(202).json({ type: "warning", message: "Mobile No already exists! Please add a different Mobile No." });
        }

        const restaurant = await Restaurant.findById(restaurantId);

        if (!restaurant) {
            try {
                if (req.files) {
                    Object.values(req.files).forEach(fileArray => {
                        fileArray.forEach(file => {
                            fs.unlinkSync(file.path);
                        });
                    });
                }
            } catch (cleanupError) {
                console.error(cleanupError);
            }
            return res.status(404).json({ type: "warning", message: "Restaurant does not exist!" });
        }

        if (password !== undefined && password !== "") {
            const hashedPassword = await bcrypt.hash(password, 10);
            restaurant.password = hashedPassword;
        }

        restaurant.name = name;
        restaurant.email = email;
        restaurant.mobileNo = mobileNo;
        restaurant.no = no;
        restaurant.address = address;
        restaurant.country = country;
        restaurant.area = area === "" || area === undefined ? "" : area;
        restaurant.street = street === "" || street === undefined ? "" : street;
        restaurant.state = state;
        restaurant.city = city;
        restaurant.zipcode = zipcode;
        restaurant.lat = lat
        restaurant.lng = lng
        restaurant.open_time = open_time
        restaurant.close_time = close_time
        restaurant.bankdetailsOne = bankdetailsOne === "" || bankdetailsOne === undefined ? "" : bankdetailsOne
        restaurant.bankdetailsTwo = bankdetailsTwo === "" || bankdetailsOne === undefined ? "" : bankdetailsTwo


        // Handle file uploads
        if (req.files) {
            if (req.files['image']) {
                const file = req.files['image'][0];
                const filePath = `imageUploads/backend/restaurant/image/${file.filename}`;
                if (restaurant.image && fs.existsSync(restaurant.image)) {
                    fs.unlinkSync(restaurant.image);
                }
                fs.renameSync(file.path, filePath);
                restaurant.image = filePath;
            }

            if (req.files['logo']) {
                const file = req.files['logo'][0];
                const filePath = `imageUploads/backend/restaurant/logo/${file.filename}`;
                if (restaurant.logo && fs.existsSync(restaurant.logo)) {
                    fs.unlinkSync(restaurant.logo);
                }
                fs.renameSync(file.path, filePath);
                restaurant.logo = filePath;
            }

            if (req.files['other']) {
                const file = req.files['other'][0];
                const filePath = `imageUploads/backend/restaurant/other/${file.filename}`;
                if (restaurant.other && fs.existsSync(restaurant.other)) {
                    fs.unlinkSync(restaurant.other);
                }
                fs.renameSync(file.path, filePath);
                restaurant.other = filePath;
            }


        }

        await restaurant.save();
        res.status(200).json({ type: "success", message: "Restaurant updated successfully!" });
    } catch (error) {
        try {
            if (req.files) {
                Object.values(req.files).forEach(fileArray => {
                    fileArray.forEach(file => {
                        fs.unlinkSync(file.path);
                    });
                });
            }
        } catch (cleanupError) {
            console.error(cleanupError);
        }

        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error });
        console.log(error);
    }
});

// update restaurant days and time
route.put('/dayTime/update/byRestaurnat/:id', upload.fields([
    { name: 'image' },
    { name: 'logo' },
    { name: 'other' }
]), async (req, res) => {
    const restaurantId = req.params.id;
    const { days } = req.body;
    const parsedDays = JSON.parse(days);
    try {

        const restaurant = await Restaurant.findById(restaurantId);

        if (!restaurant) {
            return res.status(404).json({ type: "warning", message: "Restaurant does not exist!" });
        }

        restaurant.days = parsedDays

        await restaurant.save();
        res.status(200).json({ type: "success", message: "Restaurant updated successfully!" });
    } catch (error) {

        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error });
        console.log(error);
    }
});


//  *************************************** restaurant-admin ****************************************
// restaurant-admin login route
route.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        const restaurant = await Restaurant.findOne({ mobileNo: username });

        if (!restaurant) {
            return res.status(200).json({ type: 'error', message: '*Invalid credentials' });
        }

        const passwordMatch = await bcrypt.compare(password, restaurant.password);

        if (!passwordMatch) {
            return res.status(200).json({ type: 'error', message: '*Invalid credentials' });
        }

        // Generate a JWT token 
        const token = jwt.sign({ id: restaurant._id, role: restaurant.role }, secretKey);

        res.status(200).json({ type: 'success', message: 'Restaurant logged in successfully', token });
    } catch (error) {
        res.status(500).json({ type: 'error', message: 'Error authenticating sub-admin', error });
        console.log(error)
    }
});

// restaurant-admin change password route
route.post('/change-password', restaurantMiddleWare, async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        const userId = req.user.id;

        const restaurant = await Restaurant.findById(userId);

        if (!restaurant) {
            return res.status(404).json({ type: 'error', message: 'Restaurant not found' });
        }

        if (!oldPassword) {
            return res.status(404).json({ type: 'error', message: '*Please provide old password' });
        }

        const passwordMatch = await bcrypt.compare(oldPassword, restaurant.password);

        if (!passwordMatch) {
            return res.status(200).json({ type: 'error', message: '*Incorrect old password' });
        }

        // Update the password
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        restaurant.password = hashedNewPassword;
        await restaurant.save();

        res.status(200).json({ type: 'success', message: 'Password changed successfully' });
    } catch (error) {
        res.status(500).json({ type: 'error', message: 'Error changing password', error });
        console.log(error);
    }
});




module.exports = route