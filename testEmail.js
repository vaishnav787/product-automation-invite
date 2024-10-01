const nodemailer = require('nodemailer');

// Function to send email
async function sendEmail(subject, message) {
    console.log('Preparing to send email...'); // Log when the function is called
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'vaishnav.nair@promodome.in', // Your email address (sender)
            pass: 'nkwt kcqh jczh bbtv' // Your Gmail App Password
        }
    });

    const mailOptions = {
        from: 'vaishnav.nair@promodome.in', // Your email address (sender)
        to: 'md.siraz@promodome.in, yash.yadav@promodome.in, aman.ansari@promodome.in, ansh.ved@promodome.in', // Recipient email address
        subject: subject, // Subject of the email
        text: message // Body of the email containing the error message
    };

    try {
        await transporter.sendMail(mailOptions); // Send the email
        console.log('Email sent successfully'); // Log success message
    } catch (error) {
        console.error('Error sending email:', error); // Log error if sending fails
    }
}

// Test the email function
(async () => {
    await sendEmail('Test Email', 'This is a test email to check if the email functionality works.');
})();
