const express = require('express')
const route = express.Router()
const multer = require('multer')
const Subscription = require('../../../Models/BackendSide/subscription_model')
const fs = require('fs');



// Create Subscription
route.post('/add', async (req, res) => {
    try {
        const { title, name, meals, bites, discountPrice, originalPrice, validity } = req.body;

        const subscription = new Subscription({
            title, name, meals, bites, discountPrice, originalPrice, validity
        });

        await subscription.save();
        res.status(200).json({ type: "success", message: "Subscription added successfully!" });
    } catch (error) {
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error });
    }
});

// get all subscription
route.get('/get', async (req, res) => {
    try {
        const subscription = await Subscription.find().sort({ createdAt: -1 });

        if (subscription) {

            const result = subscription.map(subscription => ({
                _id: subscription._id,
                title: subscription.title,
                name: subscription.name,
                meals: subscription.meals,
                bites: subscription.bites,
                discountPrice: subscription.discountPrice,
                originalPrice: subscription.originalPrice,
                validity: subscription.validity,
                status: subscription?.status,
                feature: subscription?.feature
            }));

            res.status(201).json({ type: "success", message: "Subscription found successfully!", subscription: result || [] })
        }
        else {
            res.status(404).json({ type: "warning", message: "No Subscription Found!", subscription: [], subscriptions: [] })
        }

    } catch (error) {
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error })

    }
});

// get subscription by id
route.get('/get/:id', async (req, res) => {
    const subscriptionId = req.params.id
    try {
        const subscription = await Subscription.findById(subscriptionId)
        if (!subscription) {
            res.status(404).json({ type: "warning", message: "No Subscription found!", subscription: [] })
        }
        else {
            const result = {
                _id: subscription._id,
                title: subscription.title,
                name: subscription.name,
                meals: subscription.meals,
                bites: subscription.bites,
                discountPrice: subscription.discountPrice,
                originalPrice: subscription.originalPrice,
                validity: subscription.validity,
            }
            res.status(201).json({ type: "success", message: "Subscription found successfully!", subscription: result })
        };
    } catch (error) {
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error })
        console.log(error)
    }
});

// get all subscription for mobile
route.get('/mob/get', async (req, res) => {
    try {
        const subscription = await Subscription.find({ Subscription_Status: true }).sort({ sequence: -1 });
        if (!subscription) {
            res.status(200).json({ type: "warning", message: "No Subscription found!", subscription: [] })
        }
        else {
            const result = subscription.map(subscription => ({
                subscription_id: subscription._id,
            }));
            res.status(201).json({ type: "success", message: " Subscription found successfully!", subscription: result || [] })
        }
    } catch (error) {
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error })
    }
});

// Delete all subscriptions
route.delete('/delete', async (req, res) => {
    try {
        const subscriptions = await Subscription.find();

        await Subscription.deleteMany();
        res.status(200).json({ type: "success", message: "All Subscriptions deleted successfully!" });
    } catch (error) {
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error });
    }
});

// Delete a specific subscription by ID
route.delete('/delete/:id', async (req, res) => {
    const subscriptionId = req.params.id;
    try {
        const subscription = await Subscription.findById(subscriptionId);
        if (!subscription) {
            res.status(404).json({ type: "error", message: "Subscription not found!" });
        } else {
            await Subscription.findByIdAndDelete(subscriptionId);
            res.status(200).json({ type: "success", message: "Subscription deleted successfully!" });
        }
    } catch (error) {
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error });
    }
});

// Delete multiple subscriptions by IDs
route.delete('/deletes', async (req, res) => {
    try {
        const { ids } = req.body;
        await Subscription.deleteMany({ _id: { $in: ids } });
        res.status(200).json({ type: "success", message: "All Subscriptions deleted successfully!" });
    } catch (error) {
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error });
    }
});

// update only Subscriptionstatus 
route.put("/update/status/:id", async (req, res) => {

    const SubscriptionId = await req.params.id


    try {
        const { status } = req.body
        const newSubscription = await Subscription.findByIdAndUpdate(SubscriptionId)
        newSubscription.status = await status

        await newSubscription.save()
        res.status(200).json({ type: "success", message: "Subscription Status update successfully!" })

    } catch (error) {
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error })
    }

})

// update only Subscription Feature 
route.put("/update/feature/:id", async (req, res) => {

    const SubscriptionId = await req.params.id

    try {
        const { feature } = req.body
        const newSubscription = await Subscription.findByIdAndUpdate(SubscriptionId)
        newSubscription.feature = await feature

        await newSubscription.save()
        res.status(200).json({ type: "success", message: "Subscription Feature update successfully!" })

    } catch (error) {
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error })
    }

})

// Update a specific subscription by ID
route.put('/update/:id', async (req, res) => {
    const subscriptionId = req.params.id;
    const { title, name, meals, bites, discountPrice, originalPrice, validity } = req.body;

    try {

        const subscription = await Subscription.findById(subscriptionId);

        if (!subscription) {
            return res.status(404).json({ type: "warning", message: "Subscription does not exist!" });
        }

        subscription.title = title;
        subscription.name = name;
        subscription.meals = meals;
        subscription.bites = bites;
        subscription.discountPrice = discountPrice;
        subscription.originalPrice = originalPrice;
        subscription.validity = validity;

        await subscription.save();
        res.status(200).json({ type: "success", message: "Subscription updated successfully!" });
    } catch (error) {
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error });
    }
});



module.exports = route