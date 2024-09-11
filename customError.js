module.exports = ({ message = 'An error occurred', status = 500 } = {}) => {
    const customErr = new Error(message);
    customErr.status = status;
    return customErr;
};
