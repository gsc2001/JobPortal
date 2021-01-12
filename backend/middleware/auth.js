const { User } = require('../models/User');
const { roles } = require('../utils/enums');
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

const isRecruiter = async (req, res, next) => {
    if (req.user.role !== roles.recruiter) {
        return res.status(401).json({ errors: [{ msg: 'Only recruiters allowed' }] });
    }
    next();
};

const isApplicant = async (req, res, next) => {
    if (req.user.role !== roles.applicant) {
        return res.status(401).json({ errors: [{ msg: 'Only applicants allowed' }] });
    }
    next();
};

module.exports = {
    auth,
    isRecruiter,
    isApplicant
};
