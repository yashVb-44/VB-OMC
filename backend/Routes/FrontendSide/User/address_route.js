const express = require('express')
const route = express.Router()
const Address = require('../../../Models/FrontendSide/address_model')
const User = require('../../../Models/FrontendSide/user_model')
const authMiddleWare = require('../../../Middleware/authMiddleWares')

// Create address
route.post('/add', authMiddleWare, async (req, res) => {
    try {

        const userId = req?.user?.userId
        const user = await User.findById(userId);

        const { type, name, mobileNo, houseNo, landmark, fullAddress, lat, lng, country, state, city, area, street, zipcode, isDefault, preferredTimeSlot } = req.body
        if (!user) {
            return res.status(200).json({
                type: "error",
                message: 'User not found'
            });
        }

        if (name === "Loading...") {
            return res.status(200).json({
                type: "error",
                message: 'Please provide valid address'
            });
        }

        const address = await new Address({
            userId: user._id,
            type,
            name,
            mobileNo,
            landmark,
            houseNo,
            fullAddress,
            country,
            state,
            city,
            lat,
            lng,
            area,
            street,
            zipcode,
            isDefault,
            preferredTimeSlot
        });

        await address.save()
        res.status(200).json({ type: "success", message: "Address add successfully!" })

    } catch (error) {
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error })
        console.log(error)
    }
});

// get all Address
route.get('/get', authMiddleWare, async (req, res) => {
    const userId = req.user?.userId
    try {

        const newAddress = await Address.find({ userId: userId, status: true }).populate('userId', 'name');
        if (newAddress.length <= 0) {
            res.status(200).json({ type: "success", message: "Address Not Found!", address: [] });
        }
        else {
            res.status(200).json({ type: "success", message: "Address found successfully!", address: newAddress || [] });
        }

    } catch (error) {
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error })
        console.log(error)
    }
});

// get address by id
route.get('/get/:id', authMiddleWare, async (req, res) => {
    const addressId = req.params.id;
    try {
        const address = await Address.findById(addressId);
        res.status(200).json({ type: "success", message: " Address found successfully!", address: address || "" })

    } catch (error) {
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error })
    }
});

// delete all address
route.delete('/delete', async (req, res) => {

    try {
        await Address.deleteMany()
        res.status(200).json({ type: "error", message: "All Address deleted Successfully!" })

    } catch (error) {
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error })
    }
})

//  delete address by id
route.delete('/delete/:id', authMiddleWare, async (req, res) => {
    const addressId = await req.params.id
    try {
        let result = await Address.findByIdAndUpdate(addressId)
        if (!result) {
            return res.status(200).json({ type: "error", message: "Address not found!" })
        }
        result.status = false
        await result.save()
        res.status(200).json({ type: "success", message: "Address deleted Successfully!" })

    } catch (error) {
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error })
    }
})

//  update address
route.put('/update/:id', authMiddleWare, async (req, res) => {
    const addressId = await req.params.id

    const { type, name, mobileNo, houseNo, landmark, fullAddress, lat, lng, country, state, city, area, street, zipcode, isDefault, preferredTimeSlot } = req.body

    try {

        const newAddress = await Address.findByIdAndUpdate(addressId);
        if (!newAddress) {
            return res.status(404).json({ type: "error", message: "Address does not exists!" });
        }

        newAddress.type = type
        newAddress.name = name
        newAddress.mobileNo = mobileNo
        newAddress.landmark = landmark
        newAddress.houseNo = houseNo
        newAddress.fullAddress = fullAddress
        newAddress.country = country
        newAddress.state = state
        newAddress.city = city
        newAddress.lat = lat
        newAddress.lng = lng
        newAddress.area = area
        newAddress.street = street
        newAddress.zipcode = zipcode
        newAddress.isDefault = isDefault
        newAddress.preferredTimeSlot = preferredTimeSlot

        await newAddress.save()
        res.status(200).json({ type: "success", message: "Address update successfully!" })

    } catch (error) {
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error })
        console.log(error)
    }
})

//  update address
route.patch('/update/:id', authMiddleWare, async (req, res) => {
    const addressId = await req.params.id

    const { type, name, mobileNo, houseNo, landmark, fullAddress, lat, lng, country, state, city, area, street, zipcode, isDefault, preferredTimeSlot } = req.body

    try {

        const newAddress = await Address.findByIdAndUpdate(addressId);
        if (!newAddress) {
            return res.status(404).json({ type: "error", message: "Address does not exists!" });
        }

        newAddress.type = type
        newAddress.name = name
        newAddress.mobileNo = mobileNo
        newAddress.landmark = landmark
        newAddress.houseNo = houseNo
        newAddress.fullAddress = fullAddress
        newAddress.country = country
        newAddress.state = state
        newAddress.city = city
        newAddress.lat = lat
        newAddress.lng = lng
        newAddress.area = area
        newAddress.street = street
        newAddress.zipcode = zipcode
        newAddress.isDefault = isDefault
        newAddress.preferredTimeSlot = preferredTimeSlot

        await newAddress.save()
        res.status(200).json({ type: "success", message: "Address update successfully!" })

    } catch (error) {
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error })
        console.log(error)
    }
})


// // update only status 
// route.put("/update/status/:id", async (req, res) => {

//     const AddressId = await req.params.id

//     try {
//         const { status } = req.body
//         const newAddress = await Address.findByIdAndUpdate(AddressId)
//         newAddress.status = await status

//         await newAddress.save()
//         res.status(200).json({ type: "success", message: "Address status update successfully!" })

//     } catch (error) {
//         res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error })
//     }

// })

module.exports = route