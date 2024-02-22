const mongoose = require('mongoose')

const BannerSchema = mongoose.Schema({

    name: {
        type: String,
        required: true,
    },
    image: {
        type: String
    },
    sequence: {
        type: Number,
        default: 1,
    },
    meal: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Meal'
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

module.exports = mongoose.model('Banners', BannerSchema)