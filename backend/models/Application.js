const mongoose = require('mongoose');
const { text } = require('./general');
const { applicationStatus } = require('../utils/enums');

const ApplicationSchema = new mongoose.Schema(
    {
        jobListing: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'jobListing'
        },
        applicant: {
            type: mongoose.Schema.Types.ObjectId,
            // TODO: verify this with 'applicant'
            ref: 'user'
        },
        sop: text,
        status: {
            type: String,
            enum: [...Object.values(applicationStatus)],
            default: 'STB'
        }
    },
    { timestamps: { createdAt: true, updatedAt: false } }
);

const Application = mongoose.model('application', ApplicationSchema);

module.exports = Application;
