const express = require('express')
const route = express.Router()
const multer = require('multer')
const Category = require('../../../Models/BackendSide/category_model')
const fs = require('fs');



// Set up multer middleware to handle file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './imageUploads/backend/category')
    },
    filename: function (req, file, cb) {
        cb(null, file?.originalname)
    }
})
const upload = multer({ storage: storage })


// Create Category
route.post('/add/byAdmin', upload.single('image'), async (req, res) => {
    try {
        const { name } = req.body;

        const existingCategory = await Category.findOne({ name });


        if (existingCategory) {
            try {
                if (req?.file) {
                    fs.unlinkSync(req?.file?.path);
                }
            } catch (cleanupError) {
                console.error(cleanupError);
            }
            return res.status(202).json({ type: "warning", message: "Category is already exists!" });
        }

        const tourType = new Category({
            name
        });

        if (req.file) {
            const extension = req.file.originalname.substring(req.file.originalname.lastIndexOf('.'));
            const random = Math.random() * 100;
            const imageFilename = `${name.replace(/\s/g, '_')}_${Date.now()}_${random}${extension}`;
            const imagePath = `imageUploads/backend/category/${imageFilename}`;

            fs.renameSync(req.file.path, imagePath);
            tourType.image = imagePath;

        }

        await tourType.save()
        return res.status(200).json({ type: 'success', message: 'Category added successfully!' });

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

// get all category
route.get('/list/get', async (req, res) => {
    try {
        const category = await Category.find().sort({ createdAt: -1 });

        if (category) {

            const result = category.map(category => ({
                _id: category?._id,
                name: category?.name,
                image: `${process.env.IMAGE_URL}/${category.image?.replace(/\\/g, '/')}`,
                feature: category?.feature
            }))
            res.status(201).json({ type: "success", message: " Category found successfully!", category: result || [] })
        }
        else {
            res.status(404).json({ type: "warning", message: " No Category Found!", category: [] })
        }

    } catch (error) {
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error })
        console.log(error)
    }
});

// get all category (for frotend side list)
route.get('/list/getAll', async (req, res) => {
    try {
        const category = await Category.find().sort({ createdAt: -1 });

        if (category) {

            const result = category.map(category => ({
                name: category?.name,
            }))
            res.status(201).json({ type: "success", message: " Category found successfully!", category: result || [] })
        }
        else {
            res.status(404).json({ type: "warning", message: " No Category Found!", category: [] })
        }

    } catch (error) {
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error })
        console.log(error)
    }
});

// get category with server-side pagination
// route.get('/list/get', async (req, res) => {

//     try {
//         const page = parseInt(req.query.page) || 1;
//         const pageSize = parseInt(req.query.limit) || 10;

//         const totalCategoryCount = await Category.countDocuments();
//         const totalPages = Math.ceil(totalCategoryCount / pageSize);

//         const category = await Category.find()
//             .sort({ createdAt: -1 })
//             .skip((page - 1) * pageSize)
//             .limit(pageSize);

//         if (category.length > 0) {
//             const result = category.map((amenity) => ({
//                 id: amenity?._id,
//                 name: amenity?.name,
//                 image: `${process.env.IMAGE_URL}/${amenity.image?.replace(/\\/g, '/')}`,
//             }));

//             res.status(200).json({
//                 type: 'success',
//                 message: 'Category found successfully!',
//                 category: result || [],
//                 total: totalCategoryCount,
//                 totalPages: totalPages,
//                 currentPage: page,
//                 limit: pageSize

//             });
//         } else {
//             res.status(404).json({ type: 'warning', message: 'No Category Found!', category: [] });
//         }
//     } catch (error) {
//         res.status(500).json({ type: 'error', message: 'Server Error!', errorMessage: error });
//         console.log(error);
//     }
// });


// get category by id
route.get('/single/get/:id', async (req, res) => {
    const categoryId = req.params.id

    try {
        const category = await Category.findById(categoryId)
        if (!category) {
            res.status(404).json({ type: "warning", message: "No Category found!", category: [] })
        }
        else {
            const result = {
                _id: category?._id,
                name: category?.name,
                image: `${process.env.IMAGE_URL}/${category.image?.replace(/\\/g, '/')}`,
            }
            res.status(201).json({ type: "success", message: " Category found successfully!", category: result })
        };
    } catch (error) {
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error })
        console.log(error)
    }
});

// get all category for mobile
// route.get('/mob/get', async (req, res) => {
//     try {
//         const category = await Category.find({ Category_Status: true }).sort({ Category_Sequence: -1 });
//         if (!category) {
//             res.status(200).json({ type: "warning", message: "No Category found!", category: [] })
//         }
//         else {
//             const result = category.map(category => ({
//                 category_id: category._id,
//                 category_Image: `${process.env.IMAGE_URL}/${category.image?.replace(/\\/g, '/')}` || "",
//                 category_sequence: category.Category_Sequence,
//                 categoryId: category.CategoryId
//             }));
//             res.status(201).json({ type: "success", message: " Category found successfully!", category: result || [] })
//         }
//     } catch (error) {
//         res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error })
//     }
// });

// Delete all categorys
route.delete('/delete/all', async (req, res) => {
    try {
        const categorys = await Category.find();

        if (categorys.length > 0) {
            for (const category of categorys) {
                if (category.image && fs.existsSync(category.image)) {
                    try {
                        fs.unlinkSync(category.image);
                    } catch (error) {

                    }
                }
            }
        }

        await Category.deleteMany();
        res.status(200).json({ type: "success", message: "All Category deleted successfully!" });
    } catch (error) {
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error });
    }
});

// Delete a specific category by ID
route.delete('/delete/:id', async (req, res) => {
    const categoryId = req.params.id;
    try {
        const category = await Category.findById(categoryId);
        if (!category) {
            res.status(404).json({ type: "error", message: "Category not found!" });
        } else {
            try {
                if (category.image && fs.existsSync(category.image)) {
                    fs.unlinkSync(category.image);
                }
            } catch (error) {

            }

            await Category.findByIdAndDelete(categoryId);
            res.status(200).json({ type: "success", message: "Category deleted successfully!" });
        }
    } catch (error) {
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error });
    }
});

// Delete multiple categorys by IDs
route.delete('/deletes', async (req, res) => {
    try {
        const { ids } = req.body;
        const categorys = await Category.find({ _id: { $in: ids } });

        for (const category of categorys) {
            if (category.image && fs.existsSync(category.image)) {
                try {
                    fs.unlinkSync(category.image);
                } catch (error) {

                }
            }
        }

        await Category.deleteMany({ _id: { $in: ids } });
        res.status(200).json({ type: "success", message: "All Category deleted successfully!" });
    } catch (error) {
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error });
    }
});

// update only Category feature 
route.put("/update/feature/:id", async (req, res) => {

    const CategoryId = await req.params.id

    try {
        const { feature } = req.body
        const newCategory = await Category.findByIdAndUpdate(CategoryId)
        newCategory.feature = await feature

        await newCategory.save()
        res.status(200).json({ type: "success", message: "Category Status update successfully!" })

    } catch (error) {
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error })
    }

})

// Update a specific category by ID
route.put('/update/byAdmin/:id', upload.single('image'), async (req, res) => {
    const categoryId = req.params.id;
    const { name } = req.body;

    try {
        const existingCategory = await Category.findOne({ name, _id: { $ne: categoryId } });

        if (existingCategory) {
            try {
                fs.unlinkSync(req.file?.path);
            } catch (error) {

            }
            return res.status(


            ).json({ type: "warning", message: "Category already exists!" });
        }

        const category = await Category.findById(categoryId);

        if (!category) {
            try {
                fs.unlinkSync(req.file?.path);
            } catch (error) {

            }
            return res.status(404).json({ type: "warning", message: "Category does not exist!" });
        }

        category.name = name;


        if (req.file) {

            const extension = req.file.originalname.substring(req.file.originalname.lastIndexOf('.'));
            const random = Math.random() * 100;
            const imageFilename = `${name.replace(/\s/g, '_')}_${Date.now()}_${random}${extension}`;
            const imagePath = `imageUploads/backend/category/${imageFilename}`;

            fs.renameSync(req.file.path, imagePath);

            category.image = imagePath;
        }

        await category.save();
        res.status(200).json({ type: "success", message: "Category updated successfully!" });
    } catch (error) {
        if (req.file) {
            try {
                fs.unlinkSync(req?.file?.path);
            } catch (error) {

            }
        }
        res.status(500).json({ type: "error", message: "Server Error!", errorMessage: error });
        console.log(error)
    }
});




module.exports = route