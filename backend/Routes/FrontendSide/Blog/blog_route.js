const express = require('express')
const route = express.Router()
const multer = require('multer')
const Blogs = require('../../../Models/FrontendSide/blog_model')
const fs = require('fs');
const { formatDistanceToNow } = require('date-fns');


// Set up multer middleware to handle file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './imageUploads/frontend/blogs')
    },
    filename: function (req, file, cb) {
        cb(null, file?.originalname)
    }
})
const upload = multer({ storage: storage })


// Create Blogs
route.post('/add', upload.single('image'), async (req, res) => {
    try {
        const { title, desc } = req.body;


        const blogs = new Blogs({
            title,
            desc
        });

        await blogs.save();

        if (req.file) {
            const extension = req.file.originalname.substring(req.file.originalname.lastIndexOf('.'));
            const random = Math.random() * 100;
            const imageFilename = `${title.replace(/\s/g, '_')}_${Date.now()}_${random}${extension}`;
            const imagePath = `imageUploads/frontend/blogs/${imageFilename}`;

            fs.renameSync(req.file.path, imagePath);
            blogs.image = imagePath;
            await blogs.save();

            return res.status(200).json({ type: 'success', message: 'Blog added successfully!' });
        } else {
            return res.status(200).json({ type: 'success', message: 'Blog added successfully!' });
        }

    } catch (error) {
        try {
            if (req?.file) {
                fs.unlinkSync(req?.file?.path);
            }
        } catch (error) {

        }
        console.log(error)
        return res.status(500).json({ type: 'error', message: 'Server Error!', errorMessage: error.message });
    }
});

// Get all blogs
route.get('/get', async (req, res) => {

    try {
        const blogs = await Blogs.find().sort({ createdAt: -1 })

        if (blogs.length > 0) {
            const blogsData = blogs.map(blogs => ({
                _id: blogs._id,
                title: blogs.title,
                desc: blogs.desc,
                image: `${process.env.IMAGE_URL}/${blogs.image?.replace(/\\/g, '/')}`,
                status: blogs.status,
            }));


            return res.status(200).json({
                type: "success",
                message: "Blogs found successfully!",
                blogs_data: blogsData,

            });
        } else {
            return res.status(404).json({
                type: "warning",
                message: "No Blogs found!",
                blogs_data: [],

            });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error.message });
    }
});


// Find blogs by id
route.get('/get/:id', async (req, res) => {
    const blogsId = req.params.id;
    try {
        const blogs = await Blogs.findOne({ _id: blogsId, status: true });

        if (!blogs) {
            return res.status(404).json({
                type: "warning",
                message: "No blog found!",
                blogs: {},
            });
        } else {
            const blogsData = {
                _id: blogs._id,
                title: blogs.title || "",
                image: `${process.env.IMAGE_URL}/${blogs.image?.replace(/\\/g, '/')}` || "",
            };

            return res.status(200).json({
                type: "success",
                message: "Blog found successfully!",
                blogs: blogsData,
            });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error.message });
    }
});

// Get all blogs on mobile
route.get('/mob/get/all', async (req, res) => {
    try {
        const blogs = await Blogs.find({ status: true }).sort({ updatedAt: -1 });

        if (blogs.length > 0) {
            const blogsData = blogs.map(blogs => ({
                ...blogs.toObject(),
                blogs_id: blogs._id,
                title: blogs.title,
                image: `${process.env.IMAGE_URL}/${blogs.image?.replace(/\\/g, '/')}` || "",
                date: formatDistanceToNow(new Date(blogs.createdAt), { addSuffix: true })
            }));

            return res.status(200).json({
                type: "success",
                message: "Blogs found successfully!",
                blogs_data: blogsData || [],
            });
        } else {
            return res.status(404).json({
                type: "success",
                message: "No Blogs found!",
                blogs_data: [],
            });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error.message });
    }
});

// Find blogs by id for mobile
route.get('/mob/get/:id', async (req, res) => {
    const blogsId = req.params.id;
    try {
        const blogs = await Blogs.findOne({ _id: blogsId, status: true });

        if (!blogs) {
            return res.status(404).json({
                type: "warning",
                message: "No blogs found!",
                blogs_data: [],
            });
        } else {
            const blogsData = {
                ...blogs.toObject(),
                blogs_id: blogs._id,
                title: blogs.title,
                image: `${process.env.IMAGE_URL}/${blogs.image?.replace(/\\/g, '/')}` || "",
                date: formatDistanceToNow(new Date(blogs.createdAt), { addSuffix: true })
            };

            return res.status(200).json({
                type: "success",
                message: "Blogs found successfully!",
                blogs_data: [blogsData] || [],
            });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error.message });
    }
});

// Delete all blogs
route.delete('/delete/all', async (req, res) => {
    try {
        const blogse = await Blogs.find();

        for (const blogs of blogse) {
            try {
                if (blogs.image && fs.existsSync(blogs.image)) {
                    fs.unlinkSync(blogs.image);
                }
            } catch (error) {

            }
        }

        await Blogs.deleteMany();
        res.status(200).json({ type: "success", message: "All Blogs deleted successfully!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error.message });
    }
});

// Delete many blogs
route.delete('/deletes', async (req, res) => {
    try {
        const { ids } = req.body;
        const blogse = await Blogs.find({ _id: { $in: ids } });

        for (const blogs of blogse) {
            try {
                if (blogs.image && fs.existsSync(blogs.image)) {
                    fs.unlinkSync(blogs.image);
                }
            } catch (error) {

            }
        }

        await Blogs.deleteMany({ _id: { $in: ids } });
        res.status(200).json({ type: "success", message: "Selected Blogs deleted successfully!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error.message });
    }
});

// Delete blogs by ID
route.delete('/delete/:id', async (req, res) => {
    const blogsId = req.params.id;
    try {
        const blogs = await Blogs.findById(blogsId);
        if (!blogs) {
            return res.status(404).json({ type: "warning", message: "Blogs not found!" });
        }

        try {
            if (blogs.image && fs.existsSync(blogs.image)) {
                fs.unlinkSync(blogs.image);
            }
        } catch (error) {

        }

        await Blogs.findByIdAndDelete(blogsId);
        res.status(200).json({ type: "success", message: "Blogs deleted successfully!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error.message });
    }
});

// update only status 
route.put("/update/status/:id", async (req, res) => {

    const subBlogsId = await req.params.id

    try {
        const { status } = req.body
        const newBlogs = await Blogs.findByIdAndUpdate(subBlogsId)
        newBlogs.status = await status

        await newBlogs.save()
        res.status(200).json({ type: "success", message: "Blogs Status update successfully!" })

    } catch (error) {
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error })
    }

})

// Update blogs
route.put('/update/:id', upload.single('image'), async (req, res) => {

    try {
        const blogsId = req.params.id;
        const { title, desc } = req.body;

        const existingBlogs = await Blogs.findOne({ title: title, _id: { $ne: blogsId } });

        if (existingBlogs) {
            try {
                if (req.file) {
                    fs.unlinkSync(req.file.path);
                }
            } catch (error) {

            }
            return res.status(200).json({ type: "warning", message: "Blog already exists!" });
        } else {
            const blogs = await Blogs.findById(blogsId);
            if (!blogs) {
                try {
                    if (req.file) {
                        fs.unlinkSync(req.file.path);
                    }
                } catch (error) {

                }
                return res.status(404).json({ type: "warning", message: "Blog does not exist!" });
            }

            blogs.title = title;
            blogs.desc = desc;

            if (req.file) {
                const extension = req.file.originalname.substring(req.file.originalname.lastIndexOf('.'));
                const random = Math.random() * 100;
                const imageFilename = `${title.replace(/\s/g, '_')}_${Date.now()}_${random}${extension}`;
                const imagePath = `imageUploads/frontend/blogs/${imageFilename}`;

                fs.renameSync(req.file.path, imagePath);

                blogs.image = imagePath;
            }

            await blogs.save();
            return res.status(200).json({ type: "success", message: "Blogs updated successfully!" });
        }
    } catch (error) {
        try {
            if (req.file) {
                fs.unlinkSync(req.file.path);
            }
        } catch (error) {


        }
        console.log(error, "erro")
        return res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error.message });
    }
});






module.exports = route

