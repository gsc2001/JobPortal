const { validationResult } = require('express-validator');

const validate = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json(errors);
        return 0;
    }
    return 1;
};

const sendError = (res, code, msg) => {
    return res.status(code).json({ errors: [{ msg }] });
};

module.exports = {
    validate,
    sendError
};
