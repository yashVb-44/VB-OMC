const mongoose = require('mongoose');

const BlogsSchema = mongoose.Schema(
    {
        title: {
            type: String,
        },
        image: {
            type: String
        },
        desc: {
            type: String
        },
        status: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Blogs', BlogsSchema);
