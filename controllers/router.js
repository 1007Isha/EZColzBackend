// const express = require('express');
// const { generatePassword } = require('../Utils/password');
// const sendEmail = require('../Utils/email');
// const router = express.Router();

// // Temporary store for OTPs (use a more persistent solution like database for production)
// const otpStore = {}; // { email: otp }

// router.post('/send-password', async (req, res) => {
//     const { email } = req.body;

//     if (!email) {
//         return res.status(400).json({ error: 'Email is required' });
//     }

//     try {
//         // Generate a 6-digit OTP
//         const otp = generatePassword();

//         // Store the OTP temporarily (for demo purposes, this should be handled by a database in production)
//         otpStore[email] = otp;
//      console.log(otpStore)
//         // Send the OTP via email
//         await sendEmail(email, 'Your OTP', `Your OTP is: ${otp}`);
//         console.log(`OTP sent successfully to ${email}`);

//         // Respond with the OTP for frontend verification
//         res.status(200).json({ message: 'OTP sent successfully', otp });
//     } catch (emailError) {
//         console.error('Failed to send email:', emailError.message);
//         res.status(500).json({ error: 'Failed to send email' });
//     }
// });

// // Endpoint to verify the OTP entered by the user
// router.post('/verify-otp', (req, res) => {
//     const { email, otp } = req.body;

//     if (!email || !otp) {
//         return res.status(400).json({ error: 'Email and OTP are required' });
//     }

//     const storedOtp = otpStore[email];

//     if (storedOtp === otp) {
//         // OTP matches, success
//         res.status(200).json({ message: 'OTP verified successfully' });
//     } else {
//         // OTP does not match
//         res.status(400).json({ error: 'Invalid OTP' });
//     }
// });

// module.exports = router;

const express = require('express');
const { generatePassword } = require('../Utils/password');
const sendEmail = require('../Utils/email');
const router = express.Router();

// Temporary store for OTPs (use a more persistent solution like database for production)
const otpStore = {}; // { email: otp }

router.post('/send-password', async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ error: 'Email is required' });
    }

    // Check if the email domain is "chitkara.edu.in"
    const emailDomain = email.split('@')[1];
    console.log(emailDomain);
    if (emailDomain !== 'chitkara.edu.in') {

        return res.status(400).json({ error: 'Email domain should be chitkara.edu.in' });
    }

    try {
        // Generate a 6-digit OTP
        const otp = generatePassword();

        // Store the OTP temporarily (for demo purposes, this should be handled by a database in production)
        otpStore[email] = otp;

        // Send the OTP via email
        await sendEmail(email, 'Your OTP', `Your OTP is: ${otp}`);
        console.log(`OTP sent successfully to ${email}`);

        // Respond with the OTP for frontend verification
        res.status(200).json({ message: 'OTP sent successfully', otp });
    } catch (emailError) {
        console.error('Failed to send email:', emailError.message);
        res.status(500).json({ error: 'Failed to send email' });
    }
});

// Endpoint to verify the OTP entered by the user
router.post('/verify-otp', (req, res) => {
    const { email, otp } = req.body;

    if (!email || !otp) {
        return res.status(400).json({ error: 'Email and OTP are required' });
    }

    const storedOtp = otpStore[email];

    if (storedOtp === otp) {
        // OTP matches, success
        res.status(200).json({ message: 'OTP verified successfully' });
    } else {
        // OTP does not match
        res.status(400).json({ error: 'Invalid OTP' });
    }
});

module.exports = router;
