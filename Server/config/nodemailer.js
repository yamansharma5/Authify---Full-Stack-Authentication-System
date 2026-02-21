import nodemailer from 'nodemailer';

/**
 * Creates a fresh transporter each time it's called.
 * This pattern (lazy init) ensures environment variables are always
 * available when the transporter is created — critical for production.
 */
const createTransporter = () => {
    const { SMTP_USER, SMTP_PASS, SMTP_HOST, SMTP_PORT } = process.env;

    if (!SMTP_USER || !SMTP_PASS) {
        console.error("❌ SMTP credentials (SMTP_USER / SMTP_PASS) are missing from environment variables!");
        throw new Error("Missing SMTP credentials");
    }

    return nodemailer.createTransport({
        host: SMTP_HOST || 'smtp-relay.brevo.com',
        port: parseInt(SMTP_PORT) || 587,
        secure: false,      // TLS via STARTTLS (port 587)
        requireTLS: true,
        auth: {
            user: SMTP_USER,
            pass: SMTP_PASS
        },
        connectionTimeout: 10000, // 10 seconds to connect
        greetingTimeout: 10000,   // 10 seconds for greeting
        socketTimeout: 15000,     // 15 seconds for data transfer
        logger: process.env.NODE_ENV !== 'production', // Log in dev only
        debug: process.env.NODE_ENV !== 'production',
    });
};

/**
 * Sends an email with full error reporting.
 * Use this instead of importing `transporter` directly.
 */
export const sendEmail = async (mailOptions) => {
    const transporter = createTransporter();
    try {
        const info = await transporter.sendMail(mailOptions);
        console.log("✅ Email sent:", info.messageId);
        return info;
    } catch (error) {
        console.error("❌ Failed to send email:");
        console.error("  SMTP Host:", process.env.SMTP_HOST || 'smtp-relay.brevo.com');
        console.error("  SMTP User:", process.env.SMTP_USER ? "✓ set" : "✗ MISSING");
        console.error("  SMTP Pass:", process.env.SMTP_PASS ? "✓ set" : "✗ MISSING");
        console.error("  Error:", error.message);
        throw error; // Re-throw so callers can handle it
    }
};

// Keep backward-compatible default export for any existing imports
export default { sendEmail };