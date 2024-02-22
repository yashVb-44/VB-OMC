const mongoose = require('mongoose')

const ZoneSchema = mongoose.Schema({

    name: {
        type: String,
        required: true,
    },
    image: {
        type: String
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

module.exports = mongoose.model('Zones', ZoneSchema)