const jwt = require('jsonwebtoken');
const secretKey = process.env.JWT_TOKEN;
const Admin = require('../Models/Admin/admin_model');
const Restaurant = require('../Models/Admin/restaurant_model');

// Create a middleware that checks if the user has either "admin" or "restaurant" role
const checkAdminOrRestaurantRole = async (req, res, next) => {
    const token = req.header('Authorization');

    if (!token) {
        return res.status(200).json({ type: 'error', message: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, secretKey);

        if (decoded) {
            const restaurant = await Restaurant.findById(decoded?.id);
            const admin = await Admin.findById(decoded?.id);

            if (!restaurant && !admin) {
                return res.status(200).json({ type: 'error', message: 'Invalid token.' });
            }

            // Check if the user has either "admin" or "restaurant" role
            if (admin || (restaurant && restaurant.role === 'restaurant')) {
                req.restaurant = decoded;
                req.admin = decoded;
                next();
            } else {
                res.status(200).json({ type: 'error', message: 'Access denied. Insufficient permissions.' });
            }
        } else {
            res.status(200).json({ type: 'error', message: 'Access denied. Invalid token.' });
        }
    } catch (error) {
        res.status(200).json({ type: 'error', message: 'Invalid token.' });
    }
};

module.exports = checkAdminOrRestaurantRole