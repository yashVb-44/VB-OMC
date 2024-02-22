const express = require('express')
const route = express.Router()
const User = require('../../../Models/FrontendSide/user_model')
const jwt = require('jsonwebtoken');
const authMiddleWare = require('../../../Middleware/authMiddleWares')
const fs = require('fs');
const path = require('path')
const SubscriptionHistory = require('../../../Models/BackendSide/subscription_history_model')
const Subscription = require('../../../Models/BackendSide/subscription_model')
const Wallet = require('../../../Models/FrontendSide/wallet_model')
const checkAdminRole = require('../../../Middleware/adminMiddleWares')


// function for get Subscription data for user
async function getSubscriptionData(id) {
    const SubscriptionData = await Subscription.find({ _id: id })
    if (SubscriptionData) {
        return SubscriptionData || []
    }
    else {
        return []
    }
}

// funcation for add meals and bites on the user wallet
async function addMealsAndBitesToWallet(paymentId, meals, bites, userId) {
    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(200).json({
                type: "error",
                message: 'User not found'
            });
        }

        const wallet = await new Wallet({
            userId: userId,
            type: "1",
            description: "Wallet Balance Update",
            trans_type: "Credit",
            meals,
            bites,
            paymentId: paymentId || ""
        });

        await wallet.save()
    } catch (error) {

    }
}

// Create Subscription history
route.post('/add', authMiddleWare, async (req, res) => {
    const userId = req?.user?.userId;

    try {
        let { paymentId, subscriptionId } = req.body;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ type: "error", message: "User not found." });
        }

        let startDate = new Date();

        let subscription = await Subscription.findById(subscriptionId)

        if (!subscription) {
            return res.status(404).json({ type: "error", message: "SubScription not found!." })
        }

        let subscriptionData = await getSubscriptionData(subscriptionId);

        const firstSubscription = subscriptionData.length > 0 ? subscriptionData[0] : null;

        const validityInDays = firstSubscription.validity;
        const endDate = new Date(startDate.getTime() + validityInDays * 24 * 60 * 60 * 1000);

        const subscriptionObj = firstSubscription
            ? {
                paymentId: paymentId || "",
                Subscription: {
                    Subscription_Title: firstSubscription?.title,
                    Subscription_Name: firstSubscription?.name,
                    Subscription_Meals: firstSubscription?.meals,
                    Subscription_Bites: firstSubscription?.bites,
                    Subscription_Discount_Price: firstSubscription?.discountPrice,
                    Subscription_Original_Price: firstSubscription?.originalPrice,
                    Validity: firstSubscription?.validity,
                    createdAt: firstSubscription?.createdAt,
                    updatedAt: firstSubscription?.updatedAt,
                    startDate: firstSubscription?.startDate || startDate,
                    endDate: firstSubscription?.endDate || endDate
                },
            }
            : {
                paymentId: paymentId || "",
                startDate: startDate,
                endDate: endDate
            };

        let subscriptionHistory = await SubscriptionHistory.findOne({ userId: userId });

        if (subscriptionHistory) {
            subscriptionHistory.subscriptionData.unshift(subscriptionObj);
        } else {
            subscriptionHistory = new SubscriptionHistory({
                userId: userId,
                subscriptionData: [subscriptionObj],
                validity: endDate
            });
        }

        await subscriptionHistory.save();
        await addMealsAndBitesToWallet(paymentId, firstSubscription?.meals, firstSubscription?.bites, userId)

        res.status(200).json({ type: "success", message: "Subscription added successfully!" });
    } catch (error) {
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error.message });
        console.log(error)
    }
});

// get all subscription history
route.get('/get/all', async (req, res) => {

    try {
        const subscriptionHistory = await SubscriptionHistory.find().sort({ updatedAt: -1 }).populate('userId', 'name mobileNo')
        const newSubscriptionHistory = subscriptionHistory?.map(history => {
            return {
                ...history.toObject(),
                User_Name: history?.UserId?.name,
                User_Mobile_No: history?.UserId?.mobileNo,
                total_subscription: history?.subscriptionData?.length,
                updatedAt: new Date(history?.updatedAt)?.toLocaleDateString(),
                validity: new Date(history?.validity)?.toLocaleDateString()
            }
        })
        res.status(200).json({ type: "success", message: "Subscription found successfully!", subscriptionHistory: newSubscriptionHistory || [] })

    } catch (error) {
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error })
        console.log(error)
    }
});

// get all subscriptionHistory for user
route.get('/list/get/byUser', authMiddleWare, async (req, res) => {

    const userId = req?.user?.userId

    try {
        const subscriptionHistory = await SubscriptionHistory.find({ userId: userId })
            // .sort({ updatedAt: -1 })
            .lean(); // Convert the document to plain JavaScript object

        res.status(200).json({ type: "success", message: "Subscription found successfully!", subscriptionHistory: subscriptionHistory || [] })

    } catch (error) {
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error })
        console.log(error)
    }
});

// Delete all subscription
route.delete('/delete', async (req, res) => {
    try {
        await SubscriptionHistory.deleteMany();
        res.status(200).json({ type: "success", message: "All SubscriptionHistory deleted successfully!" });
    } catch (error) {
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error });
    }
});


module.exports = route
