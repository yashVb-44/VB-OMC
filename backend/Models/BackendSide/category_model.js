const mongoose = require('mongoose')

const CategorySchema = mongoose.Schema({

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

module.exports = mongoose.model('Categorys', CategorySchema)