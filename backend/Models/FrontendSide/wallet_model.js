const mongoose = require('mongoose')

const WallteSchema = mongoose.Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users"
    },
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Orders"
    },
    paymentId: {
        type: String,
    },
    meals: Number,
    bites: Number,
    convertMeals: Number,
    convertBites: Number,
    transfer: {
        type: Boolean,
        default: false
    },
    description: {
        type: String
    },
    trans_type: {
        type: String,
        default: "Debit"
    },
    type: {
        type: String,
        default: "0"
    },
    validity: {
        type: String
    }
},
    {
        timestamps: true,
    }
)

module.exports = mongoose.model('Wallte', WallteSchema)