const mongoose = require('mongoose')

const MapPolygoneZoneSchema = mongoose.Schema({

    color: String,
    coordinates: {
        type: Array
    },
    status: {
        type: Boolean,
        default: true
    },
    mapZone: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MapZone',
    },
},
    {
        timestamps: true,
    }

)

module.exports = mongoose.model('MapPolygoneZone', MapPolygoneZoneSchema)