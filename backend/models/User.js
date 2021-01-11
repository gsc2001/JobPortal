const mongoose = require('mongoose');
const { text, number } = require('./general');

const UserSchema = new mongoose.Schema(
    {
        name: text,
        email: text,
        password: text,
        rating: number,
        role: {
            type: String,
            enum: ['applicant', 'recruiter'],
            required: true
        }
    },
    { discriminatorKey: 'role' }
);

// TODO: pre/post hooks and methods for user

const User = mongoose.model('user', UserSchema);

const ApplicantSchema = new mongoose.Schema({
    education: {
        type: [
            {
                instituteName: text,
                startYear: {
                    type: Date,
                    required: true
                },
                endYear: {
                    type: Date
                }
            }
        ],
        default: []
    },
    skills: {
        type: [String],
        default: []
    }
    // NOTE: May not need to store these here
    // applications: [
    //     {
    //         type: mongoose.Schema.Types.ObjectId,
    //         ref: 'application'
    //     }
    // ]
});

const Applicant = User.discriminator('applicant', ApplicantSchema);

const RecruiterSchema = new mongoose.Schema({
    contactNumber: {
        type: Number,
        required: true
    },
    Bio: text
    // NOTE: May not need to store these here
    // jobs: [
    //     {
    //         type: mongoose.Schema.Types.ObjectId,
    //         ref: 'job'
    //     }
    // ]
});

const Recruiter = User.discriminator('recruiter', RecruiterSchema);

module.exports = {
    User,
    Applicant,
    Recruiter
};
