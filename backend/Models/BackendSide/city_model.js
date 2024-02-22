const mongoose = require('mongoose')

const CitySchema = mongoose.Schema({

    name: {
        type: String,
    },
    country: {
        type: String
    },
    state: {
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

module.exports = mongoose.model('City', CitySchema)