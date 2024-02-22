const mongoose = require('mongoose');

// Subscription Schema
const SubscriptionHistorySchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users'
    },
    paymentId: {
        type: String,
    },
    subscriptionData: {
        type: Array
    },
    startDate: {
        type: Date
    },
    endDate: {
        type: Date
    },
    validity: {
        type: String
    }
},
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('SubscriptionHistorys', SubscriptionHistorySchema)
