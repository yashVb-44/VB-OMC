const express = require('express')
const route = express.Router()
const User = require('../../../Models/FrontendSide/user_model')
const Wallet = require('../../../Models/FrontendSide/wallet_model')
const multer = require('multer')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const authMiddleWare = require('../../../Middleware/authMiddleWares')
const fs = require('fs');


// add Meals and Bites into the wallet
route.post('/add', authMiddleWare, async (req, res) => {
    try {

        const userId = req?.user?.userId
        const user = await User.findById(userId);

        const { paymentId, meals, bites, trans_type, type } = req.body
        if (!user) {
            return res.status(200).json({
                type: "error",
                message: 'User not found'
            });
        }

        const wallet = await new Wallet({
            userId: user._id,
            type,
            description: "Wallet Balance Update",
            trans_type,
            meals,
            bites,
            paymentId: paymentId || ""
        });

        await wallet.save()
        res.status(200).json({ type: "success", message: "Wallet add successfully!" })

    } catch (error) {
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error })
        console.log(error)
    }
});

// get All Wallet history
route.get('/get', async (req, res) => {
    try {
        const wallets = await Wallet.find().populate({
            path: 'userId',
            model: 'Users',
            select: 'name'
        }).sort({ createdAt: -1 })

        if (wallets.length === 0) {
            return res.status(200).json({ type: "error", message: 'No wallets transactions found', coupon: [] });
        }

        const populatedWallet = wallets.map(wallet => {
            let Type = '';
            if (wallet.type === "0") {
                Type = 'Wallet Transfer';
            } else if (wallet.type === "1") {
                Type = 'Member-Ship Purchase';
            } else if (wallet.type === "2") {
                Type = 'Convert Coins to Wallet';
            } else if (wallet.type === "3") {
                Type = 'Use At Order time';
            } else if (wallet.type === "4") {
                Type = 'Admin Debit';
            } else if (wallet.type === "5") {
                Type = 'Admin Credit';
            }

            return {
                ...wallet.toObject(),
                Type: Type,
                User_Name: wallet?.userId?.User_Name,
                // User_Mobile_No: wallet?.userId?.User_Mobile_No,
                Date: new Date(wallet?.createdAt)?.toLocaleDateString(),
                Time: new Date(wallet?.createdAt)?.toLocaleTimeString(),
            };
        });

        res.status(200).json({ type: "success", message: "Wallet transactions found successfully!", wallet: populatedWallet || [] })
    } catch (error) {
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error })
        console.log(error)
    }
});


module.exports = route

