const nodemailer = require("nodemailer");
const asyncHandler = require('express-async-handler');
const sendEmail = asyncHandler(async (email, html) => {
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.APP_EMAIL, // generated ethereal user
            pass: process.env.APP_PASSWORD, // generated ethereal password
        },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: '"Huy LG" <huylg.com>',
        to: email,
        subject: "Forgot Password ✔", // Subject line
        html: html, // html body
    });
    return info
})
module.exports = sendEmail