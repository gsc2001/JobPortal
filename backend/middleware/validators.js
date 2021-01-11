const { Recruiter, Applicant } = require('../models/User');
const { roles } = require('../utils/enums');

const validateUserModel = (req, res, next) => {
    if (!req.body.role) {
        return res.status(400).json({ errors: [{ msg: 'Bad request' }] });
    }
    let Model;
    if (req.body.role === roles.recruiter) {
        Model = Recruiter;
    } else {
        Model = Applicant;
    }

    const _obj = new Model({
        ...req.body
    });

    const validationErrors = _obj.validateSync();
    if (validationErrors) {
        let errorMessages = [];
        const errors = validationErrors.errors;
        for (let field in errors) errorMessages.push({ msg: errors[field].message });
        return res.status(400).json({ errors: errorMessages });
    }
    next();
};

module.exports = { validateUserModel };
