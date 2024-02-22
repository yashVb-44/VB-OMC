const mongoose = require('mongoose')

const MapZoneSchema = mongoose.Schema({

    zone: {
        type: String,
    },
    latitude: String,
    longitude: String,
    status: {
        type: Boolean,
        default: true
    },
    restaurant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Restaurant',
    },
},
    {
        timestamps: true,
    }

)

module.exports = mongoose.model('MapZone', MapZoneSchema)