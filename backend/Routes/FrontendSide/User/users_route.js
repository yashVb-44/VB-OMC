const express = require('express')
const route = express.Router()
const User = require('../../../Models/FrontendSide/user_model')
const multer = require('multer')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const authMiddleWare = require('../../../Middleware/authMiddleWares')
const fs = require('fs');


// Secret key for JWT
const secretKey = process.env.JWT_TOKEN;

// Set up multer middleware to handle file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './imageUploads/frontend/users')
    },
    filename: function (req, file, cb) {
        cb(null, file?.originalname)
    }
})
const upload = multer({ storage: storage })

// Endpoint to generate and send OTP
route.post('/send-otp', async (req, res) => {
    let { mobileNo } = req.body;

    mobileNo = Number(mobileNo);


    try {
        // Generate a random 4-digit OTP
        // const otp = Math.floor(1000 + Math.random() * 9000).toString();
        const otp = 1234;

        // Save the OTP to the user in the database
        const existingMobileNumber = await User.findOne({ mobileNo: mobileNo });

        if (existingMobileNumber?.Block) {
            return res.status(200).json({ type: "error", message: "Sorry! You are blocked by Admin" });
        } else if (existingMobileNumber) {
            existingMobileNumber.otp = otp;
            await existingMobileNumber.save();
        } else {
            const newUser = new User({
                mobileNo: mobileNo,
                otp: otp,
            });
            await newUser.save();
        }

        res.status(200).json({ type: "success", message: "OTP sent successfully!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ type: "error", message: "Server Error!" });
    }
});

// Endpoint to verify the OTP
route.post('/verify-otp', async (req, res) => {
    let { mobileNo, otp, token } = req.body;

    mobileNo = Number(mobileNo);
    // let notificationToken = token;
    otp = Number(otp);

    try {
        // Find the user in the database
        const user = await User.findOne({ mobileNo: mobileNo });

        if (!user) {
            return res.status(404).json({ type: "error", message: 'User not found' });
        }

        else if (user.otp === otp) {
            // OTP verification successful
            const tokenPayload = { userId: user._id, mobileNo: user.mobileNo };
            const authToken = jwt.sign(tokenPayload, secretKey, { expiresIn: '365d' });

            user.Is_Verify = true;
            // user.Notification_Token = notificationToken;
            await user.save();

            return res.status(200).json({
                type: "success",
                message: "Login Successfully!",
                token: authToken,
                userId: user._id,
                name: user.name || ""
            });
        } else {
            // OTP verification failed
            return res.status(200).json({ type: "error", message: "Invalid OTP!", token: "", userId: "" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ type: "error", message: 'Internal server error' });
    }
});

// Sign Up User
route.post('/signUp', async (req, res) => {
    let { name, mobileCode, mobileNo, email, password, role, goal, signType } = req.body;

    mobileNo = Number(mobileNo);

    try {

        const existingMobileNumber = await User.findOne({ mobileNo: mobileNo });
        const existingEmail = await User.findOne({ email: email });

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        if (existingMobileNumber) {
            return res.status(200).json({ type: "error", message: "Mobile number already exist!" });
        } else if (existingEmail) {
            return res.status(200).json({ type: "error", message: "Email already exist!" });
        } else {
            const newUser = new User({
                name: name,
                email: email,
                mobileNo: mobileNo,
                mobileCode: mobileCode,
                password: hashedPassword,
                role: role,
                goal: goal,
                signType: signType
            });
            await newUser.save();
        }

        res.status(200).json({ type: "success", message: "User Sign Up successfully!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ type: "error", message: "Server Error!" });
    }
});

// Login User
route.post('/login', async (req, res) => {
    let { username, password } = req.body;

    try {
        // Check if the username is a valid email or mobile number
        const isEmail = /\S+@\S+\.\S+/;
        const isMobileNumber = /^\d+$/;

        let query;
        if (isEmail.test(username)) {
            query = { email: username };
        } else if (isMobileNumber.test(username)) {
            query = { mobileNo: Number(username) };
        } else {
            return res.status(200).json({ type: "error", message: "Invalid username format!" });
        }

        const user = await User.findOne(query);

        if (!user) {
            return res.status(200).json({ type: "error", message: "User not found!" });
        }

        // Compare the provided password with the stored hashed password
        const isPasswordMatch = await bcrypt.compare(password, user.password);

        if (!isPasswordMatch) {
            return res.status(200).json({ type: "error", message: "Invalid password!" });
        } else {
            const tokenPayload = { userId: user._id, mobileNo: user.mobileNo };
            const authToken = jwt.sign(tokenPayload, secretKey, { expiresIn: '365d' });

            res.status(200).json({ type: "success", message: "User login successful!", token: authToken });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ type: "error", message: "Server Error!" });
    }
});

// get all the User
route.get('/get', async (req, res) => {
    try {
        const Users = await User.find().sort({ createdAt: -1 });

        const populatedusers = Users.map(user => {

            return {
                ...user.toObject(),
            };
        });

        res.status(200).json({ type: "success", message: "User found successfully!", user: populatedusers || [] })
    } catch (error) {
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error })
    }
});

// get all the user for dropdown
route.get('/get/alluser', async (req, res) => {
    try {
        const user = await User.find().sort({ createdAt: -1 });
        res.status(200).json({ type: "success", message: " User found successfully!", user: user })
    } catch (error) {
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error })
    }
});

// get the user profile 
route.get('/profile/get', authMiddleWare, async (req, res) => {
    try {
        const userId = req?.user?.userId
        const user = await User.findById(userId);

        if (!user) {
            res.status(200).json({ type: "error", message: "User not found!", user: [] })
        }
        else {
            const result = {
                _id: user?._id,
                name: user?.name || "",
                image: `${process.env.IMAGE_URL}/${user.image?.replace(/\\/g, '/')}` || "",
                email: user?.email || "",
                mobileNo: user?.mobileNo || "",
                block: user?.block,
            };
            res.status(200).json({ type: "success", message: "User found successfully!", user: result || [] })
        }

    } catch (error) {
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error })
    }
});

// get user by token
route.get('/get', authMiddleWare, async (req, res) => {
    try {
        // Access the currently logged-in user details from req.user
        const userId = req?.user?.userId;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(200).json({ type: "error", message: 'User not found' });
        }

        res.status(200).json({ type: "success", user });
    } catch (error) {
        res.status(500).json({ type: "error", message: 'Internal server error' });
        console.log(error);
    }
});

// Update User Profile
route.put('/profile/update', authMiddleWare, upload.single('image'), async (req, res) => {
    const userId = req.user.userId;
    const { name, email, mobileNo, dob } = req.body;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ type: "error", message: "User does not exist!" });
        }

        if (mobileNo && mobileNo != user.mobileNo) {
            const existingUserWithMobile = await User.findOne({ mobileNo: mobileNo });
            if (existingUserWithMobile) {
                return res.status(200).json({ type: "error", message: "User Mobile Number already exists!" });
            }
        }

        user.name = name || user.name;
        user.email = email || user.email;
        user.mobileNo = mobileNo || user.mobileNo
        user.dob = dob || user.dob

        if (req.file) {
            const extension = req.file.originalname.substring(req.file.originalname.lastIndexOf('.'));
            const random = Math.random() * 100;
            const imageFilename = `${name.replace(/\s/g, '_')}_${Date.now()}_${random}${extension}`;
            const imagePath = `imageUploads/frontend/users/${imageFilename}`;

            fs.renameSync(req.file.path, imagePath);
            user.image = imagePath;
        }

        await user.save();
        res.status(200).json({ type: "success", message: "User updated successfully!" });
    } catch (error) {
        if (req?.file) {
            try {
                fs.unlinkSync(req?.file?.path);
            } catch (error) {

            }
        }
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error });
        console.log(error);
    }
});

// update user status (block or unblock)
route.put("/update/status/:id", async (req, res) => {

    const UserId = await req.params.id

    try {
        const { block } = req.body
        const newUser = await User.findByIdAndUpdate(UserId)
        newUser.block = await block

        await newUser.save()
        res.status(200).json({ type: "success", message: "User Status update successfully!" })

    } catch (error) {
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error })
    }

})

// delete all user
route.delete('/delete', async (req, res) => {

    try {

        const users = await User.find();

        for (const user of users) {
            if (user.image && fs.existsSync(user?.image?.path)) {
                fs.unlinkSync(user?.image?.path);
            }
        }

        await User.deleteMany()
        res.status(200).json({ type: "error", message: "All Users deleted Successfully!" })

    } catch (error) {
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error })
    }
})

// Delete many users
route.delete('/deletes', async (req, res) => {
    try {
        const { ids } = req.body;
        const users = await User.find({ _id: { $in: ids } });

        for (const user of users) {
            if (user.image && fs.existsSync(user?.image?.path)) {
                fs.unlinkSync(user?.image?.path);
            }
        }

        await User.deleteMany({ _id: { $in: ids } });
        res.status(200).json({ type: "success", message: "All Users deleted successfully!" });
    } catch (error) {
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error });
    }
});

// Delete User by ID
route.delete('/delete/:id', async (req, res) => {
    const userId = req.params.id;
    try {
        const user = await User.findById(userId);
        if (!user) {
            res.status(404).json({ type: "error", message: "User not found!" });
        } else {
            if (user.image && fs.existsSync(user?.image?.path)) {
                fs.unlinkSync(user?.image?.path);
            }

            await User.findByIdAndDelete(userId);
            res.status(200).json({ type: "success", message: "User deleted successfully!" });
        }
    } catch (error) {
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error });
    }
});



module.exports = route