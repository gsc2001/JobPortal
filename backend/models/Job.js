const mongoose = require('mongoose');
const { jobTypes } = require('../utils/enums');
const { number, text } = require('./general');

const JobSchema = new mongoose.Schema(
    {
        recruiter: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user'
        },
        name: text,
        maxApplications: {
            type: Number,
            requred: true
        },
        maxPositions: {
            type: Number,
            required: true
        },
        applicationDeadline: {
            type: Date,
            required: true
        },
        requiredSkills: {
            type: [String],
            default: []
        },
        jobType: {
            type: String,
            enum: [...Object.values(jobTypes)],
            required: true
        },
        duration: {
            type: Number,
            max: 6,
            min: 0
        },
        salary: {
            type: Number,
            required: true
        },
        ratingMap: {
            type: Map,
            of: Number,
            default: {}
        }
    },
    { timestamps: { createdAt: true, updatedAt: false } }
);

const Job = mongoose.model('job', JobSchema);

module.exports = Job;
