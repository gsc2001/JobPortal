const mongoose = require('mongoose');
const { number, text } = require('./general');

const JobListingSchema = new mongoose.Schema(
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
            enum: ['FT', 'PT', 'WFH'],
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
        rating: number
    },
    { timestamps: { createdAt: true, updatedAt: false } }
);

const JobListing = mongoose.model('jobListing', JobListingSchema);

module.exports = JobListing;
