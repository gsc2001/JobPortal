const express = require('express');
const { check } = require('express-validator');
const bcrypt = require('bcryptjs');

const { validateUserModel } = require('../../middleware/validators');
const { Applicant, Recruiter, User } = require('../../models/User');
const { validate } = require('../../utils');
const { roles } = require('../../utils/enums');

const router = express.Router();

/**
 * @route		POST api/core/login
 * @description Login user to get the token
 * @access		public
 */
router.post(
    '/login',
    [
        check('email', 'Please enter a valid email').isEmail(),
        check('password', 'Password Required').exists()
    ],
    async (req, res) => {
        if (!validate(req, res)) {
            return;
        }
        try {
            const { email, password } = req.body;

            const user = await User.findOne({ email });
            if (!user || !(await user.checkPassword(password))) {
                return res.status(401).json({ errors: [{ msg: 'Invalid credentials' }] });
            }

            return res.json({
                token: user.generateJWT(),
                user: {
                    role: user.role,
                    name: user.name,
                    email: user.email,
                    avatarImage: user.avatarImage
                }
            });
        } catch (err) {
            console.error(err.message);
            res.status(500).json({ errors: [{ msg: 'Server Error' }] });
        }
    }
);

const registerUser = async user => {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    await user.save();
    const token = user.generateJWT();
    return token;
};

/**
 * @route		POST api/core/register
 * @description Register user
 * @access		public
 */
router.post('/register', validateUserModel, async (req, res) => {
    try {
        let _u = await User.findOne({ email: req.body.email });
        if (_u) {
            return res.status(400).json({ errors: [{ msg: 'User already exists' }] });
        }
        let user;
        if (req.body.role === roles.recruiter) {
            user = new Recruiter({ ...req.body });
        } else {
            user = new Applicant({ ...req.body });
        }
        const token = await registerUser(user);
        return res.json({
            token,
            user: {
                role: user.role,
                name: user.name,
                email: user.email,
                avatarImage: user.avatarImage
            }
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ errors: [{ msg: 'Server Error' }] });
    }
});

// /**
//  * @route		POST api/core/register/recruiter
//  * @description Register recruiter
//  * @access		public
//  */
// router.post('/register/recruiter', validateModel(Recruiter), async (req, res) => {
//     try {
//         let _u = await User.findOne({ email: req.body.email });
//         if (_u) {
//             return res.status(400).json({ errors: [{ msg: 'User already exists' }] });
//         }
//         const recruiter = new Recruiter({ ...req.body });
//         const token = await registerUser(recruiter);
//         return res.json({ token, role: roles.recruiter });
//     } catch (err) {
//         console.error(err.message);
//         res.status(500).json({ errors: [{ msg: 'Server Error' }] });
//     }
// });
module.exports = router;
