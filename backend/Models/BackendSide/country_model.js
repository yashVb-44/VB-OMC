const mongoose = require('mongoose')

const CountrySchema = mongoose.Schema({

    name: {
        type: String,
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

module.exports = mongoose.model('Country', CountrySchema)