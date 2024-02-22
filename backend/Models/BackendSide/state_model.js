const mongoose = require('mongoose')

const StateSchema = mongoose.Schema({

    name: {
        type: String,
        required: true,
    },
    country: String,
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

module.exports = mongoose.model('State', StateSchema)