const mongoose = require('mongoose');

module.exports = {
    text: {
        type: String,
        required: true
    },
    number: {
        type: Number,
        default: 0
    }
};
