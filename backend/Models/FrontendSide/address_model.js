const mongoose = require('mongoose')

const AddressSchema = mongoose.Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users"
    },
    type: {
        type: String
    },
    name: {
        type: String,
    },
    mobileNo: {
        type: String,
    },
    houseNo: {
        type: String,
    },
    landmark: {
        type: String,
    },
    fullAddress: {
        type: String,
    },
    lat: {
        type: String,
    },
    lng: {
        type: String,
    },
    country: {
        type: String,
    },
    state: {
        type: String,
    },
    area: String,
    street: String,
    city: {
        type: String,
    },
    zipcode: {
        type: Number,
    },
    status: {
        type: Boolean,
        default: true
    },
    isDefault: {
        type: Boolean,
        default: false
    },
    preferredTimeSlot: String
},
    {
        timestamps: true,
    }
)

module.exports = mongoose.model('Address', AddressSchema)