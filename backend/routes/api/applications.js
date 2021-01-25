const express = require('express');
const { check } = require('express-validator');

const { auth, isRecruiter } = require('../../middleware/auth');
const Application = require('../../models/Application');
const { sendError, validate } = require('../../utils');
const { roles, applicationStatus } = require('../../utils/enums');

const router = express.Router();

/**
 * @route		GET /api/applications?jobId="{job_id}"
 * @description Get applications for me or jobId
 * @access		private
 */
router.get('/', auth, async (req, res) => {
    try {
        if (req.user.role === roles.applicant) {
            const applications = await Application.find({
                applicant: req.user.id
            })
                .populate({
                    path: 'job',
                    select: 'recruiter name salary ratingMap',
                    populate: { path: 'recruiter', select: 'name' }
                })
                .lean();
            return res.json({ applications });
        } else {
            if (!req.query.jobId) {
                return sendError(res, 400, 'Please pass jobId');
            }
            const jobId = req.query.jobId;

            const applications = await Application.find({
                job: jobId,
                status: { $ne: applicationStatus.Rejected }
            }).populate('applicant', 'name skills education ratingMap');

            return res.json({ applications });
        }
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(400).json({ errors: [{ msg: 'Invalid job Id' }] });
        }
        res.status(500).json({ errors: [{ msg: 'Server Error' }] });
    }
});

/**
 * @route		PUT /api/applications/:id/status_update
 * @description Update status of the application
 * @access		private
 */
router.put(
    '/:id/status_update',
    [
        auth,
        isRecruiter,
        check('status', "Status needs to be in ['SHL', 'STB', 'ACC' ,'REJ']").isIn(
            Object.values(applicationStatus)
        )
    ],
    async (req, res) => {
        if (!validate(req, res)) {
            return;
        }
        try {
            const applicationId = req.params.id;
            const application = await Application.findById(applicationId).populate(
                'job',
                'recruiter maxPositions'
            );

            if (String(application.job.recruiter) !== req.user.id) {
                return sendError(res, 401, 'You are not the recruiter of this job');
            }
            let applicationPromises = [];
            if (req.body.status === applicationStatus.Accepted) {
                // if update is to accept, check max positions check applicant acceptance, set doj
                // and also move all other applications for both job and user to rejected

                console.log('hi');
                const [jobApplications, _applications] = await Promise.all([
                    Application.find({
                        job: application.job.id,
                        applicant: { $ne: application.applicant }
                    }),
                    Application.find({
                        applicant: application.applicant
                    })
                ]);

                const filledPositions = jobApplications.filter(
                    appl => appl.status === applicationStatus.Accepted
                );

                console.log(filledPositions, _applications);
                const isAlreadyAccepted =
                    _applications.filter(
                        _application => _application.status === applicationStatus.Accepted
                    ).length !== 0;

                if (isAlreadyAccepted) {
                    return sendError(
                        res,
                        400,
                        'Person is already accepted somewhere else'
                    );
                }

                if (filledPositions.length >= application.job.maxPositions) {
                    return sendError(res, 400, 'Positions already filled');
                }

                applicationPromises = _applications.map(_application => {
                    _application.status = applicationStatus.Rejected;
                    return _application.save();
                });

                if (filledPositions.length + 1 >= application.job.maxPositions) {
                    const nonAcceptedApplications = jobApplications.filter(
                        appl => appl.status !== applicationStatus.Accepted
                    );
                    applicationPromises.concat(
                        nonAcceptedApplications.map(_appl => {
                            _appl.status = applicationStatus.Rejected;
                            return _appl.save();
                        })
                    );
                }

                application.doj = new Date();
            }

            // update status now
            application.status = req.body.status;
            await Promise.all([application.save(), ...applicationPromises]);

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

module.exports = router;
