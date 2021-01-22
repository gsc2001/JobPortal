const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { text, number } = require('./general');
const validators = require('../utils/validators');

const UserSchema = new mongoose.Schema(
    {
        name: text,
        avatarImage: text,
        email: {
            type: String,
            unique: true,
            required: true,
            validate: {
                validator: validators.emailValidator,
                message: props => `${props.value} is not a valid email`
            }
        },
        password: text,
        role: {
            type: String,
            enum: ['applicant', 'recruiter'],
            required: true
        }
    },
    { discriminatorKey: 'role' }
);

UserSchema.methods.generateJWT = function () {
    const payload = {
        user: {
            id: this._id,
            role: this.role
        }
    };
    const token = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: 36000000 });
    return token;
};

UserSchema.methods.checkPassword = function (password) {
    return bcrypt.compare(password, this.password);
};

const User = mongoose.model('user', UserSchema);

const ApplicantSchema = new mongoose.Schema({
    education: {
        type: [
            {
                instituteName: text,
                startYear: number,
                endYear: {
                    type: Number
                }
            }
        ],
        default: []
    },
    skills: {
        type: [String],
        default: []
    },
    ratingMap: {
        type: Map,
        of: Number,
        default: {}
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
        type: String,
        required: true,
        validate: {
            validator: validators.phoneValidator,
            message: props => `${props.value} is not a valid phone`
        }
    },
    bio: text
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
