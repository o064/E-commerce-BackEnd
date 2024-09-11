const User = require('../models/User');
const createCustomError = require('../customError'); 
const signUp_post = async (req, res, next) => {
    const { firstName, lastName, userName, email, password, address, mobileNumber, isAdmin } = req.body;
    try {
        const user = await User.create({
            firstName, lastName, userName, email, password, address, mobileNumber, isAdmin
        });
        if (user) {
            const token = user.generateToken();
            res.cookie('jwt', token, { maxAge: 3 * 24 * 60 * 60 * 1000 }); 
            res.status(200).json({
                success: true,
                message: "user signed Up",
                user
            });
        } else {
            throw createCustomError({ message: 'User creation failed', status: 400 });
        }
    } catch (err) {
        console.log(err,err.code);
        next(createCustomError({ message: err.message, status: err.status || 500 }));
    }
};

const logIn_post = async (req, res, next) => {
    const { email, password } = req.body;
    try {
        const user = await User.logIn(email, password);
        if (user) {
            const token = user.generateToken();
            res.cookie('jwt', token, { maxAge: 3 * 24 * 60 * 60 * 1000 });
            res.status(200).json({
                success: true,
                message: "user logged In successfully",
                user
            });
        } else {
            throw createCustomError({ message: 'Invalid email or password', status: 400 });
        }
    } catch (err) {
        next(createCustomError({ message: err.message, status: err.status || 500 }));
    }
};

const get_logout = (req, res) => {
    res.cookie('jwt', "", { maxAge: 1 });
    req.userId = null;
    res.redirect("/");
};

module.exports = {
    signUp_post,
    logIn_post,
    get_logout
};
