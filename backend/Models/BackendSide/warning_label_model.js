const mongoose = require('mongoose')

const WarningLabelSchema = mongoose.Schema({

    name: {
        type: String,
        required: true,
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

module.exports = mongoose.model('WarningLabels', WarningLabelSchema)