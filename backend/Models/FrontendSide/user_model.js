const mongoose = require('mongoose');

const UserSchema = mongoose.Schema(
    {
        name: {
            type: String,
        },
        image: {
            type: String
        },
        email: {
            type: String,
        },
        mobileCode: {
            type: String
        },
        mobileNo: {
            type: Number
        },
        password: {
            type: String,
        },
        mobileOtp: {
            type: Number,
            default: 1234
        },
        emailOtp: {
            type: Number,
            default: 1234
        },
        emailIsVerify: {
            type: Boolean,
            default: false
        },
        mobileIsVerify: {
            type: Boolean,
            default: false
        },
        role: String,
        goal: String,
        block: {
            type: Boolean,
            default: false
        },
        loginType: String,
        signType: {
            type: String,
            default: "0"
        }
        // Wallet: {
        //     type: Number,
        //     default: 0
        // },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Users', UserSchema);
