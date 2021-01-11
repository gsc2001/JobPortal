const emailValidator = email => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
};

const phoneValidator = phn => {
    const re = /^\d{10}$/;
    return re.test(phn);
};

module.exports = {
    emailValidator,
    phoneValidator
};
