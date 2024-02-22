const mongoose = require('mongoose')

const SubscriptionSchema = mongoose.Schema({

    title: String,
    name: String,
    meals: Number,
    bites: Number,
    discountPrice: Number,
    originalPrice: Number,
    validity: String,
    status: {
        type: Boolean,
        default: true
    },
    feature: {
        type: Boolean,
        default: false
    }
},
    {
        timestamps: true,
    }

)

module.exports = mongoose.model('Subscription', SubscriptionSchema)