const mongoose = require('mongoose');


// Customization Schema
const CustomizationSchema = mongoose.Schema({
    name: {
        type: String,
    },
    segment: [{
        name: {
            type: String,
        },
        bites: {
            type: Number
        },
        status: {
            type: Boolean,
            default: true
        },
    }],
    type: {
        type: String,
        default: "radio"
    },
    status: {
        type: Boolean,
        default: true
    },
    isCustimizeMandatory: {
        type: Boolean,
        default: false
    }
},
    {
        timestamps: true,
    }
);

const MealSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    description: {
        type: String
    },
    meals: Number,
    bites: Number,
    gallary: [{
        type: String
    }],
    cover: {
        type: String
    },
    restaurant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Restaurant',
    },
    Customization: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customization',
    }],
    warningLabels: [{
        type: String,
    }],
    feature: {
        type: Boolean,
        default: false
    },
    status: {
        type: Boolean,
        default: true
    },
    isCustimizeMandatory: {
        type: Boolean,
        default: false
    }

},
    {
        timestamps: true,
    }
);

const Meal = mongoose.model('Meal', MealSchema);
const Customization = mongoose.model('Customization', CustomizationSchema);

module.exports = { Meal, Customization };

