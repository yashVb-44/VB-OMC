const mongoose = require('mongoose')

const AreaSchema = mongoose.Schema({

    name: {
        type: String,
        required: true,
    },
    country: {
        type: String
    },
    state: {
        type: String
    },
    city: {
        type: String
    },
    image: {
        type: String
    },
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

module.exports = mongoose.model('Area', AreaSchema)