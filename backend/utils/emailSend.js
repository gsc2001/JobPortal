const nodemailer = require('nodemailer');

const transport = nodemailer.createTransport({
    service: 'hotmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    }
});

module.exports = sendMail = async (to, subject, text) =>
    transport.sendMail({
        from: 'Job portal <job2021portal@outlook.com>',
        to,
        subject,
        text
    });
