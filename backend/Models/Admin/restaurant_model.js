const mongoose = require('mongoose');

const DaySchema = new mongoose.Schema({
    open_time: String,
    close_time: String,
    closed: {
        type: Boolean,
        default: false
    }
});

const RestaurantSchema = new mongoose.Schema({
    name: String,
    mobileNo: String,
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },

    open_time: String,
    close_time: String,

    days: {
        monday: DaySchema,
        tuesday: DaySchema,
        wednesday: DaySchema,
        thursday: DaySchema,
        friday: DaySchema,
        saturday: DaySchema,
        sunday: DaySchema,
    },


    address: String,
    lat: String,
    lng: String,
    country: String,
    state: String,
    city: String,
    area: String,
    street: String,
    no: String,
    zipcode: String,

    bankdetailsOne: String,
    bankdetailsTwo: String,

    role: {
        type: String,
        required: true,
        default: "restaurant"
    },

    image: String,
    logo: String,
    other: String,

    status: {
        type: String,
        default: 'Pending'
    },
    // block: {
    //     type: Boolean,
    //     default: false
    // },
    feature: {
        type: Boolean,
        default: false
    }
},
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Restaurant', RestaurantSchema);
