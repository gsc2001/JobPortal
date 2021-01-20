const express = require('express');
const mongoose = require('mongoose');
const { check } = require('express-validator');

const Job = require('../../models/Job');
const Application = require('../../models/Application');
const { roles, applicationStatus } = require('../../utils/enums');
const { auth, isRecruiter, isApplicant } = require('../../middleware/auth');
const { validateModel } = require('../../middleware/validators');
const { validate, sendError } = require('../../utils');

const router = express.Router();

/**
 * @route		GET /api/jobs
 * @description Get all jobs listing all for applicant / particular for recruiter
 * @access		private
 */
router.get('/', auth, async (req, res) => {
    try {
        let jobs;
        if (req.user.role === roles.recruiter) {
            jobs = await Job.find({
                recruiter: req.user.id,
                // NOTE: A doubt here can recruiter see job lising after deadline pass
                applicationDeadline: { $gt: Date.now() }
            }).lean();
        } else {
            jobs = await Job.find({ applicationDeadline: { $gt: Date.now() } })
                .populate('recruiter', 'name')
                .lean();

            const _applications = await Application.find({
                job: { $in: jobs.map(job => job._id) }
            })
                .select('_id job applicant')
                .lean();
            jobs.forEach((job, index) => {
                jobs[index].recruiterName = job.recruiter.name;
                let rating = 0;
                Object.values(job.ratingMap).forEach(value => (rating += value));
                const nRating = Object.keys(job.ratingMap).length;
                if (nRating === 0) jobs[index].rating = -1;
                else jobs[index].rating = rating / nRating;
                delete jobs[index].ratingMap;

                const jobApplications = _applications.filter(
                    _application => String(_application.job) === String(job._id)
                );

                if (jobApplications.length >= job.maxApplications) {
                    jobs[index].filled = true;
                } else {
                    jobs[index].filled = false;
                }

                if (
                    jobApplications.filter(
                        appl => String(appl.applicant) === String(req.user.id)
                    ).length > 0
                ) {
                    jobs[index].applied = true;
                } else jobs[index].applied = false;

                delete jobs[index].recruiter;
            });
        }
        return res.json({ jobs });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ errors: [{ msg: 'Server Error' }] });
    }
});

/**
 * @route		POST /api/jobs
 * @description Create a job listing
 * @access		private
 */
router.post(
    '/',
    [
        auth,
        isRecruiter,
        (req, res, next) => {
            req.body.recruiter = req.user.id;
            next();
        },
        validateModel(Job)
    ],
    async (req, res) => {
        if (!validate(req, res)) {
            return;
        }
        try {
            const job = new Job({ ...req.body });
            console.log(job);
            await job.save();
            return res.json({ job });
        } catch (err) {
            console.error(err.message);
            res.status(500).json({ errors: [{ msg: 'Server Error' }] });
        }
    }
);

/**
 * @route		POST /api/jobs/:id/apply
 * @description Apply to a job
 * @access		private
 */
router.post(
    '/:id/apply',
    [auth, isApplicant, check('sop', 'Sop must me there !').exists()],
    async (req, res) => {
        if (!validate(req, res)) {
            return;
        }
        try {
            // Restirctions: Not applied earlier , standby, shl applications < 10, maxApplications

            const jobId = mongoose.Types.ObjectId(req.params.id);
            // check if job exists
            const job = await Job.findById(jobId)
                .select('_id applicationDeadline maxApplications')
                .lean();
            console.log(job._id);
            if (!job || job.applicationDeadline < Date.now()) {
                return res.status(400).json({
                    errors: [{ msg: 'Invalid job id or deadline passed' }]
                });
            }

            const [jobApplications, applications] = await Promise.all([
                Application.find({ job: job._id }).select('_id').lean(),
                Application.find({ applicant: req.user.id }).select('job status').lean()
            ]);

            if (job.maxApplications <= jobApplications.length) {
                return res.status(400).json({
                    errors: [{ msg: 'Application quota filled' }]
                });
            }

            console.log(applications);
            if (
                applications.filter(application => {
                    return String(application.job) === String(job._id);
                }).length !== 0
            ) {
                // already applied
                return res.status(400).json({
                    errors: [{ msg: 'Applied already once , cant apply again' }]
                });
            }
            if (
                applications.filter(
                    application => application.status === applicationStatus.Accepted
                ).length !== 0
            ) {
                // accepted in a job
                return res.status(400).json({
                    errors: [
                        { msg: 'You are already accepted in a job so cant apply now!' }
                    ]
                });
            }
            if (
                applications.filter(
                    application =>
                        application.status === applicationStatus.Shortlisted ||
                        application.status === applicationStatus.Standby
                ).length >= 10
            ) {
                // already 10 applications pending
                const errorMsg =
                    'You cant apply anymore as your 10 applications are pending';
                return sendError(res, 400, errorMsg);
            }

            // All restrictions passed now apply
            const application = new Application({
                applicant: req.user.id,
                job: jobId,
                sop: req.body.sop
            });

            await application.save();

            return res.json({ application });
        } catch (err) {
            console.error(err.message);
            if (err.kind === 'ObjectId') {
                return res.status(400).json({ errors: [{ msg: 'Invalid job Id' }] });
            }
            res.status(500).json({ errors: [{ msg: 'Server Error' }] });
        }
    }
);

/**
 * @route		POST /api/jobs/:id/rate
 * @description Get all jobs listing all for applicant / particular for recruiter
 * @access		private
 */
router.post(
    '/:id/rate',
    [
        auth,
        isApplicant,
        check('rating', 'Rating should be float < 5 > 0').isFloat({ min: 0, max: 5 })
    ],
    async (req, res) => {
        if (!validate(req, res)) {
            return;
        }
        try {
            // Restrictions: Should be an employee of that job

            // TODO: try selecting ratingMap here
            const job = await Job.findById(req.params.id);
            if (!job) {
                return res.status(400).json({ errors: [{ msg: 'No such job ' }] });
            }

            const application = await Application.find({
                applicant: req.user.id,
                status: applicationStatus.Accepted
            })
                .select('job')
                .lean();

            if (!application || application.job !== job.id) {
                return res.status(401).json({ errors: [{ msg: 'Not an employee' }] });
            }

            // Rate now
            job.ratingMap.set(req.user.id, req.body.rating);

            await job.save();
            return res.json({ job });
        } catch (err) {
            console.error(err.message);
            if (err.kind === 'ObjectId') {
                return res.status(400).json({ errors: [{ msg: 'Invalid job Id' }] });
            }
            res.status(500).json({ errors: [{ msg: 'Server Error' }] });
        }
    }
);

/**
 * @route		DELETE /api/jobs/:id
 * @description Delete the job and its applications
 * @access		private
 */
router.delete('/:id', [auth, isRecruiter], async (req, res) => {
    try {
        // Restriction: match recruiter

        const job = await Job.findById(req.params.id);

        if (!job) {
            const e = new Error('Invalid job id');
            e.kind = 'ObjectId';
            throw e;
        }

        if (String(job.recruiter) !== req.user.id) {
            return res
                .status(401)
                .json({ errors: [{ msg: 'Not the recruiter of this job' }] });
        }

        // Steps:
        // 1. Delete all applications
        // 2. Delete job

        const applications = await Application.find({ job: job.id });

        const applicationPromises = applications.map(application => application.remove());

        // delete all applications and job
        await Promise.all([...applicationPromises, job.remove()]);

        return res.json({ success: true });
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(400).json({ errors: [{ msg: 'Invalid job Id' }] });
        }
        res.status(500).json({ errors: [{ msg: 'Server Error' }] });
    }
});

/**
 * @route		PUT /api/jobs/:id
 * @description update job
 * @access		private
 */
router.put(
    '/:id',
    [
        auth,
        isRecruiter,
        check('maxPositions', 'maxPostions should be a int').isInt(),
        check('maxApplications', 'maxApplications should be a int').isInt(),
        check('applicationDeadline', 'Deadline should be after today').isAfter(
            new Date(Date.now()).toDateString()
        )
    ],
    async (req, res) => {
        if (!validate(req, res)) {
            return;
        }
        try {
            // Restirction : match recruiter

            const jobId = req.params.id;
            const job = await Job.findById(jobId);

            if (!job) {
                const e = new Error('Invalid job id');
                e.kind = 'ObjectId';
                throw e;
            }

            if (req.user.id !== String(job.recruiter)) {
                const errorMsg = 'Not the recruiter of this job';
                return sendError(res, 401, errorMsg);
            }
            const { maxPositions, maxApplications, applicationDeadline } = req.body;

            const _applications = await Application.find({
                job: job.id,
                status: { $ne: applicationStatus.Rejected }
            });

            const filledPositions = _applications.filter(
                appl => appl.status === applicationStatus.Accepted
            ).length;

            const filledApplications = _applications.length;

            if (maxPositions < filledPositions) {
                const errorMsg = `Can't set max positions to ${maxPositions} as ${filledPositions} are already filled`;
                return sendError(res, 400, errorMsg);
            }

            if (maxApplications < filledApplications) {
                const errorMsg = `Can't set max applications to ${maxApplications} as ${filledApplications} are already filled`;
                return sendError(res, 400, errorMsg);
            }

            // we can update now

            job.maxApplications = maxApplications;
            job.maxPositions = maxPositions;
            job.applicationDeadline = applicationDeadline;

            await job.save();
            return res.json({ job });
        } catch (err) {
            console.error(err.message);
            if (err.kind === 'ObjectId') {
                return res.status(400).json({ errors: [{ msg: 'Invalid job Id' }] });
            }
            res.status(500).json({ errors: [{ msg: 'Server Error' }] });
        }
    }
);

module.exports = router;
