const jwt = require('jsonwebtoken');
const { model } = require('mongoose');

const User = require('../models/User');
const { verify } = require('./utils');

const auth = async (req, res, next) => {
    try {
        verify(req);

        const _user_id = await User.findById(req.user.id).select('_id');

        if (!_user_id) {
            return res.status(400).json({ errors: [{ msg: 'Invalid token' }] });
        }

        next();
    } catch (err) {
        if (err.kind === 'NotAuthorized') {
            return res.status(401).json({ errors: [{ msg: err.message }] });
        }
        if (err.kind === 'ObjectId') {
            return res.status(400).json({ errors: [{ msg: 'Invalid data' }] });
        }

        console.error(err.message);
        return res.status(500).json({ errors: [{ msg: 'Server Error' }] });
    }
};

module.exports = {
    auth
};
