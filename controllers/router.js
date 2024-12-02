const express = require('express');
const { body, validationResult } = require('express-validator');
const sendEmail = require('../Utils/email');
const { generatePassword } = require('../Utils/password');
const router = express.Router();

// // Route to generate a password and send it via email
// router.post('/send-password', [
//     body('email').isEmail().withMessage('Invalid email address'), // Validate email
// ], async (req, res) => {
//     const { email } = req.body;

//     // Validate if email is provided
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//         return res.status(400).json({ errors: errors.array() });
//     }

//     try {
//         // Generate a random password
//         const password = generatePassword();

//         // Attempt to send the password via email
//         await sendEmail(email, 'Your New Password', `Your new password is: ${password}`);
//         console.log('Email sent successfully');

//         // Respond back to client after successfully sending email
//         res.status(200).json({ message: 'Password sent successfully' });
//     } catch (emailError) {
//         console.error('Failed to send email:', emailError.message);
//         // Respond with an error message indicating the email sending failure
//         res.status(500).json({ error: 'Failed to send email' });
//     }
// });

// Route to generate a password and send it via email
router.post('/send-password', [
    body('email').isEmail().withMessage('Invalid email address'), // Validate email
], async (req, res) => {
    const { email } = req.body;

    // Validate if email is provided
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        // Generate a random password (OTP)
        const password = generatePassword();

        // Attempt to send the password via email
        await sendEmail(email, 'Your New Password', `Your new password is: ${password}`);
        console.log('Email sent successfully');

        // Respond back to client after successfully sending email
        res.status(200).json({
            message: 'Password sent successfully',
            otp: password  // Return the generated OTP
        });
    } catch (emailError) {
        console.error('Failed to send email:', emailError.message);
        res.status(500).json({ error: 'Failed to send email' });
    }
});



// Export router
module.exports = router;
