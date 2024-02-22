const mongoose = require('mongoose')

const OrderSchema = mongoose.Schema({

    orderId: {
        type: String
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users"
    },
    // Coupon: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "Coupon"
    // },

    // CouponPrice: {
    //     type: Number,
    //     default: 0
    // },
    mealData: {
        type: Array
    },
    custmizationData: {
        type: Array
    },
    address: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Address"
    },
    // Shipping_Charge: {
    //     type: Number
    // },
    // Trans_Charge: {
    //     type: Number,
    //     default: 0   
    // },
    // Track_id: {
    //     type: String,
    //     default: "0"
    // },
    shippingType: {
        type: String,
        default: "0"
    },
    orderType: {
        type: String,
        default: "1"
    },
    bites: {
        type: Number,
        default: 0
    },
    meals: {
        type: Number,
        default: 0
    },
    processed: {
        type: Boolean,
        default: false
    },
    reason: {
        type: String
    },
    quantity: Number
},
    {
        timestamps: true,
    }
)

module.exports = mongoose.model('Orders', OrderSchema)