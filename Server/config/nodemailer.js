import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: 'smtp-relay.brevo.com',
    port: 587,
    secure: false,
    requireTLS: true,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

// Verify transporter configuration on startup
transporter.verify((error, success) => {
    if (error) {
        // ...existing code...
    } else {
        // ...existing code...
    }
});

export default transporter;