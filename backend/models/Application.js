const mongoose = require('mongoose');
const { text } = require('./general');
const { applicationStatus } = require('../utils/enums');

const ApplicationSchema = new mongoose.Schema(
    {
        job: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'job'
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
            default: applicationStatus.Standby
        }
    },
    { timestamps: { createdAt: true, updatedAt: false } }
);

const Application = mongoose.model('application', ApplicationSchema);

module.exports = Application;
