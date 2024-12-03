// require('dotenv').config();
// const nodemailer = require('nodemailer');

// // Create a transporter using environment variables for sensitive data
// const transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//         user: process.env.EMAIL_USER,  // Use email from environment variable
//         pass: process.env.EMAIL_PASS,  // Use password from environment variable
//     },
// });

// // Function to send email
// const sendEmail = (to, subject, text) => {
//     const mailOptions = {
//         from: process.env.EMAIL_USER,  // Use the email from environment variable
//         to,
//         subject,
//         text,
//     };

//     return transporter.sendMail(mailOptions);
// };

// module.exports = sendEmail;


require('dotenv').config();
const nodemailer = require('nodemailer');

// Create a transporter using environment variables for sensitive data
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,  // Use email from environment variable
        pass: process.env.EMAIL_PASS,  // Use password from environment variable
    },
});

// Function to send email
const sendEmail = (to, subject, text) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,  // Use the email from environment variable
        to,
        subject,
        text,
    };

    return transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
