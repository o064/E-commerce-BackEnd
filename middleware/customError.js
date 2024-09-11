const ErrorHandler = (err) => {
    let errors = {};
    // incorrect email
    if (err.message === 'email is incorrect') {
        errors.email = 'That email is not registered';
    }

    // incorrect password
    if (err.message === 'password is incorrect') {
        errors.password = 'That password is incorrect';
    }
    if (err.code === 11000) { // for unique
        errors.email = "the email is already exist";
        return errors;
    }

    if (err.message.includes('user validation failed')) {
        Object.values(err.errors).forEach(({ properties }) => {
            errors[properties.path] = properties.message
        });
    }
    return errors;
}
const customErrorMiddleware = (err, req, res, next) => {
    const errors = ErrorHandler(err);
    const status = err.status || 400;  
    res.status(status).json({
        success: false,
        message: err.message || 'An error occurred',
        errors,
    });
};
module.exports = customErrorMiddleware;
