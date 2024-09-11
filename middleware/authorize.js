const jwt = require('jsonwebtoken');
const User = require('../models/User');
const createCustomError = require('../customError');
require('dotenv').config();

const authUser = (req, res, next) => {
    const token = req.cookies.jwt;
    if (token) {
        jwt.verify(token, process.env.SECRET, (err, decoded) => {
            if (err) {
                return next(createCustomError({ message: 'Invalid token. Please log in again.', status: 401 }));
            }
            req.user = decoded;
            next();
        });
    } else {
        res.redirect("/login");
    }
};

const authAdmin = (req, res, next) => {
    const token = req.cookies.jwt;
    if (token) {
        jwt.verify(token, process.env.SECRET, (err, decoded) => {
            if (err) {
                return next(createCustomError({ message: 'Invalid token. Please log in again.', status: 401 }));
            }
            if (!decoded.isAdmin) {
                return next(createCustomError({ message: 'Access denied. Admins only.', status: 403 }));
            }
            req.user = decoded; 
            next();
        });
    } else {
        return next(createCustomError({ message: 'No token provided. Please log in.', status: 401 }));
    }
};

const checkUser = async (req, res, next) => {
    const token = req.cookies.jwt;
    if (token) {
        jwt.verify(token, process.env.SECRET, async (err, decoded) => {
            if (err) {
                res.locals.user = null;
                return next(); 
            }
            try {
                const user = await User.findById(decoded.id);
                res.locals.user = user;
            } catch (error) {
                res.locals.user = null;
                console.log('Error fetching user:', error);
            }
            next();
        });
    } else {
        res.locals.user = null;
        next();
    }
};

module.exports = {
    authUser,
    authAdmin,
    checkUser
};
