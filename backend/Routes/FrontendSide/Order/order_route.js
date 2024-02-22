const express = require('express')
const route = express.Router()
const Order = require('../../../Models/FrontendSide/order_model')
// const Meal = require('../../../Models/BackendSide/meal_model')
const { Meal, Customization } = require('../../../Models/BackendSide/meal_model')
const User = require('../../../Models/FrontendSide/user_model')


const authMiddleware = require('../../../Middleware/authMiddleWares')


async function generateUniqueKey() {

    const randomNum = Math.floor(Math.random() * 1000000);

    // const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    // const randomAlphabet = alphabet[Math.floor(Math.random() * alphabet.length)];

    const paddedRandomNum = String(randomNum).padStart(6, '0');
    const uniqueOrderId = `#${paddedRandomNum}`;

    return uniqueOrderId;
}

// function for get meal data for user
async function getMealData(mealId) {
    const mealData = await Meal.findById(mealId).select("name description meals bites restaurant warningLabels isCustimizeMandatory cover")
    if (mealData) {
        return [mealData]
    }
    else {
        return []
    }
}


// Add Order Route with Coupon and Coupon Usage
route.post("/add", authMiddleware, async (req, res) => {

    try {
        let { address, custmizationData, mealId, shippingType, quantity, bites, meals } = req.body;
        const userId = req.user.userId;
        const orderId = await generateUniqueKey();
        meals = Number(meals)
        bites = Number(bites)
        quantity = Number(quantity)


        let MealData = await getMealData(mealId);
        let newOrder;

        // Create the new order
        newOrder = new Order({
            orderId,
            userId,
            address,
            meals,
            bites,
            quantity,
            shippingType,
            mealData: MealData,
            custmizationData: custmizationData || [],
            reason: "",
        });


        // Save the new order and update stock
        await newOrder.save();

        res.status(200).json({ type: "success", message: "Order successfull!" });

    } catch (error) {
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error });
        console.log(error);
    }
});


// get all orders for particular user 
route.get('/getAll', authMiddleware, async (req, res) => {

    try {
        const userId = req.user.userId;
        let OrderList = await Order.find({ userId: userId }).populate({
            path: 'address',
            model: 'Address',
            select: '-createdAt -updatedAt -__v'
        })
            .sort({ updatedAt: -1 })

        // if (OrderList.length >= 1) {
        //     OrderList = OrderList?.map(async order => ({
        //         _id: order?._id,
        //         orderId: order?.orderId,
        //         userId: order?.userId,
        //         Coupon: order?.Coupon || "",
        //         PaymentType: order?.PaymentType,
        //         PaymentId: order?.PaymentId || "",
        //         OrderType: order?.OrderType,
        //         CouponPrice: order?.CouponPrice,
        //         DiscountPrice: order?.DiscountPrice,
        //         FinalPrice: order?.FinalPrice,
        //         OriginalPrice: order?.OriginalPrice,
        //         reason: order?.reason || "",
        //         Address: order?.Address || {},
        //         cartData: order?.cartData.map(cartItem => ({
        //             ...cartItem,
        //             variationImage: `https://${process.env.IP_ADDRESS}:${process.env.PORT}/${cartItem?.variation?.Variation_Images[0]?.path?.replace(/\\/g, '/')}`
        //         })),
        //         Shipping_Charge: order?.Shipping_Charge,
        //         Status: order?.Status,
        //         createdAt: order?.createdAt?.toISOString()?.substring(0, 10),
        //         checkRating: await getOrderRatingStatus(order?._id),
        //         PaymentStatus: order?.order_status || ""
        //     }))

        //     OrderList = await Promise.all(OrderList);
        // }

        res.status(200).json({ type: "success", message: "All Order get Successfully!", orderList: OrderList || [] })

    } catch (error) {
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error })
        console.log(error)
    }

})



module.exports = route  