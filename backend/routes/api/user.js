const express = require('express');
const { check } = require('express-validator');

const { auth, isRecruiter } = require('../../middleware/auth');
const { User, Recruiter, Applicant } = require('../../models/User');
const Application = require('../../models/Application');
const { roles } = require('../../utils/enums');
const { validateUserModel } = require('../../middleware/validators');
const { applicationStatus } = require('../../utils/enums');
const uploadImage = require('../../utils/uploadImage');

const router = express.Router();

/**
 * @route		GET /api/user/me
 * @description Get personal data
 * @access		private
 */
router.get('/me', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        return res.json({ user });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ errors: [{ msg: 'Server Error' }] });
    }
});

/**
 * @route		PATCH api/user/me
 * @description Edit self
 * @access		private
 */
router.patch(
    '/me',
    [
        auth,
        (req, res, next) => {
            // setup to pass password validation
            req.body.password = 'test-pass';
            next();
        },
        validateUserModel
    ],
    async (req, res) => {
        // console.log(req);
        try {
            let user;
            if (req.user.role === roles.recruiter) {
                user = await Recruiter.findByIdAndUpdate(
                    req.user.id,
                    {
                        name: req.body.name,
                        contactNumber: req.body.contactNumber,
                        bio: req.body.bio
                    },
                    { new: true }
                );
            } else {
                user = await Applicant.findByIdAndUpdate(
                    req.user.id,
                    {
                        name: req.body.name,
                        education: req.body.education,
                        skills: req.body.skills
                    },
                    { new: true }
                );
            }
            return res.json({ user });
        } catch (err) {
            console.error(err.message);
            res.status(500).json({ errors: [{ msg: 'Server Error' }] });
        }
    }
);

/**
 * @route		PATCH api/user/rate/:id
 * @description Rate an employee
 * @access		private
 */
router.patch(
    '/rate/:id',
    [
        auth,
        isRecruiter,
        check('rating', 'Enter a valid rating').exists().isFloat({ min: 0, max: 5 })
    ],
    async (req, res) => {
        try {
            const applicantId = req.params.id;
            const application = await Application.findOne({
                applicant: applicantId,
                status: applicationStatus.Accepted
            })
                .populate('job', 'recruiter')
                .lean();
            if (!application || String(application.job.recruiter) !== req.user.id) {
                return res.status(401).json({ errors: [{ msg: 'Not allowed!' }] });
            }

            const applicant = await Applicant.findById(applicantId).select('ratingMap');
            applicant.ratingMap.set(req.user.id, req.body.rating);
            console.log(applicant);

            await applicant.save();

            return res.json({ applicant });
        } catch (err) {
            console.error(err.message);
            res.status(500).json({ errors: [{ msg: 'Server Error' }] });
        }
    }
);

/**
 * @route		POST /api/user/upload
 * @description Upload image
 * @access		private
 */
router.post('/upload_image', async (req, res) => {
    try {
        const image_res = await uploadImage(req.body.file);
        return res.json(image_res.data.image);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ errors: [{ msg: 'Server Error' }] });
    }
});

module.exports = router;
