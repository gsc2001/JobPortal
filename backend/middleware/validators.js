const validateModel = Model => (req, res, next) => {
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

module.exports = { validateModel };
