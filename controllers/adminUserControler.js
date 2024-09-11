const User = require('../models/User');
const createCustomError = require('../customError'); 

const getUsers = async (req, res, next) => {
    try {
        const users = await User.find({});
        if (users.length === 0) {
            return next(createCustomError({ message: "There are no users", status: 404 }));
        }
        res.status(200).json({
            success: true,
            message: "get All users successfully",
            users
        }); 
        } catch (err) {
            next(createCustomError({ message: err.message, status: 500 }));
        }
};

const deluser = async (req, res, next) => {
    const { id } = req.params;
    try {
        const user = await User.findByIdAndDelete(id);
        if (!user) {
            return next(createCustomError({ message: "User Not Found", status: 404 }));
        }
        if (user.isAdmin) {
            return next(createCustomError({ message: "Cannot delete admin", status: 403 }));
        }
        res.status(200).json({
            success: true,
            message: "user deleted  successfully",
            user
        }); 
    } catch (err) {
        next(createCustomError({ message: err.message, status: 500 }));
    }
};

const makeadmin = async (req, res, next) => {
    const { id } = req.params;
    try {
        const user = await User.findByIdAndUpdate(id, { isAdmin: true }, { new: true, runValidators: true });
        if (!user) {
            return next(createCustomError({ message: "User not found", status: 404 }));
        }
        res.status(200).json({
            success: true,
            message: "user become admin  successfully",
            user
        }); 
    } catch (err) {
        next(createCustomError({ message: err.message, status: 500 }));
    }
};

module.exports = {
    getUsers,
    deluser,
    makeadmin
};
