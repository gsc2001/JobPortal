const jwt = require('jsonwebtoken');
const { roles } = require('../utils/enums');

const verify = req => {
    const token = req.header('Authorization');

    if (!token) {
        const e = new Error('Invalid or no token');
        e.kind = 'NotAuthorized';
        throw e;
    }

    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        req.user = decoded.user;
    } catch (err) {
        const e = new Error('Invalid or no token');
        e.kind = 'NotAuthorized';
        throw e;
    }
};

module.exports = { verify };
