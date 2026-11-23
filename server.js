const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const NOTIFICATION_RECIPIENT = process.env.NOTIFICATION_RECIPIENT || 'ashishagrwal307@gmail.com';

// Ensure data directory exists for persistent inquiry storage
const DB_DIR = path.join(__dirname, 'db');
const INQUIRIES_FILE = path.join(DB_DIR, 'inquiries.json');
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}
if (!fs.existsSync(INQUIRIES_FILE)) {
  fs.writeFileSync(INQUIRIES_FILE, JSON.stringify([], null, 2), 'utf-8');
}

// In-memory / JSON persistence helper
function saveInquiry(inquiry) {
  try {
    const raw = fs.readFileSync(INQUIRIES_FILE, 'utf-8');
    const list = JSON.parse(raw || '[]');
    list.unshift(inquiry);
    fs.writeFileSync(INQUIRIES_FILE, JSON.stringify(list, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving inquiry to JSON store:', err);
  }
}

function getInquiries() {
  try {
    const raw = fs.readFileSync(INQUIRIES_FILE, 'utf-8');
    return JSON.parse(raw || '[]');
  } catch {
    return [];
  }
}

// Middlewares
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Accept', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve frontend static files
app.use(express.static(path.join(__dirname)));

// Nodemailer Transporter Cache
let cachedTransporter = null;
let isEthereal = false;

async function getTransporter() {
  if (cachedTransporter) return cachedTransporter;

  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const port = parseInt(process.env.SMTP_PORT || '587', 10);
  const secure = process.env.SMTP_SECURE === 'true' || port === 465;

  if (user && pass && pass.trim().length > 0) {
    const cleanPass = pass.replace(/\s+/g, '');
    const isGmail = (host && host.toLowerCase().includes('gmail')) || (user && user.toLowerCase().includes('@gmail.com'));

    if (isGmail) {
      console.log(`[SMTP] Initializing Gmail Service transporter for: ${user}`);
      cachedTransporter = nodemailer.createTransport({
        service: 'gmail',
        auth: { user, pass: cleanPass }
      });
    } else {
      console.log(`[SMTP] Initializing SMTP transporter for host: ${host}:${port} (user: ${user})`);
      cachedTransporter = nodemailer.createTransport({
        host,
        port,
        secure,
        auth: { user, pass: cleanPass },
        tls: { rejectUnauthorized: false }
      });
    }
    isEthereal = false;
  } else {
    // Development / Automated Test mode: Create Ethereal test account automatically
    console.log('[SMTP] No production SMTP credentials detected in .env. Initializing Ethereal test account...');
    try {
      const testAccount = await nodemailer.createTestAccount();
      console.log(`[SMTP] Generated Ethereal Test Account: ${testAccount.user}`);
      cachedTransporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass
        }
      });
      isEthereal = true;
    } catch (testAccErr) {
      console.warn('[SMTP] Could not create Ethereal account, falling back to JSON transport:', testAccErr.message);
      cachedTransporter = nodemailer.createTransport({ jsonTransport: true });
      isEthereal = true;
    }
  }

  return cachedTransporter;
}

// Reset transporter cache when environment changes
function resetTransporter() {
  cachedTransporter = null;
}

// Helper: Escape HTML to prevent injection in email templates
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// HTML Template: Admin Notification
function generateAdminEmailHtml({ name, email, subject, message, dateStr, clientIp }) {
  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeSubject = escapeHtml(subject);
  const safeMessage = escapeHtml(message).replace(/\n/g, '<br/>');

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>New Portfolio Inquiry</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0b0f1d; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #f1f5f9;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #0b0f1d; padding: 30px 15px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="max-width: 600px; width: 100%; background-color: #111827; border: 1px solid rgba(0, 210, 255, 0.25); border-radius: 12px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.5);">
          <!-- Header Bar -->
          <tr>
            <td style="background: linear-gradient(135deg, #0d1b2a, #112240); padding: 24px 30px; border-bottom: 2px solid #00d2ff;">
              <table width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td>
                    <h1 style="margin: 0; font-size: 20px; font-weight: 700; color: #ffffff; letter-spacing: 0.5px;">
                      ⚡ New Portfolio Inquiry Received
                    </h1>
                    <p style="margin: 4px 0 0; font-size: 13px; color: #00d2ff; font-family: monospace;">
                      Ashish Agrawal &bull; Portfolio Lead Dispatcher
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Content Body -->
          <tr>
            <td style="padding: 30px;">
              <p style="margin: 0 0 20px; font-size: 15px; line-height: 1.6; color: #cbd5e1;">
                You have received a new project inquiry or message from your portfolio contact form:
              </p>

              <!-- Details Table -->
              <table width="100%" cellspacing="0" cellpadding="0" style="background-color: #1f2937; border-radius: 8px; border: 1px solid #374151; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 12px 16px; font-size: 13px; font-weight: 600; color: #94a3b8; border-bottom: 1px solid #374151; width: 120px;">Client Name</td>
                  <td style="padding: 12px 16px; font-size: 14px; font-weight: 700; color: #ffffff; border-bottom: 1px solid #374151;">${safeName}</td>
                </tr>
                <tr>
                  <td style="padding: 12px 16px; font-size: 13px; font-weight: 600; color: #94a3b8; border-bottom: 1px solid #374151;">Email Address</td>
                  <td style="padding: 12px 16px; font-size: 14px; color: #00d2ff; border-bottom: 1px solid #374151;">
                    <a href="mailto:${safeEmail}" style="color: #00d2ff; text-decoration: none; font-weight: 600;">${safeEmail}</a>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 16px; font-size: 13px; font-weight: 600; color: #94a3b8; border-bottom: 1px solid #374151;">Subject</td>
                  <td style="padding: 12px 16px; font-size: 14px; font-weight: 600; color: #ffffff; border-bottom: 1px solid #374151;">${safeSubject}</td>
                </tr>
                <tr>
                  <td style="padding: 12px 16px; font-size: 13px; font-weight: 600; color: #94a3b8;">Submission Time</td>
                  <td style="padding: 12px 16px; font-size: 13px; color: #94a3b8; font-family: monospace;">${dateStr} (IP: ${clientIp})</td>
                </tr>
              </table>

              <!-- Message Section -->
              <div style="margin-bottom: 24px;">
                <h3 style="margin: 0 0 8px; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; color: #10b981;">Message Content:</h3>
                <div style="background-color: #0b0f1d; border-left: 3px solid #10b981; border-radius: 4px; padding: 16px; font-size: 14px; line-height: 1.6; color: #f8fafc; font-family: inherit;">
                  ${safeMessage}
                </div>
              </div>

              <!-- Quick Action Button -->
              <table width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center">
                    <a href="mailto:${safeEmail}?subject=Re:%20${encodeURIComponent(subject)}" style="display: inline-block; background: linear-gradient(135deg, #00d2ff, #0070f3); color: #ffffff; text-decoration: none; font-weight: 700; font-size: 14px; padding: 12px 28px; border-radius: 6px; box-shadow: 0 4px 14px rgba(0, 210, 255, 0.4);">
                      ✉️ Reply Directly to ${safeName}
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #0d1322; padding: 16px 30px; text-align: center; border-top: 1px solid #1f2937; font-size: 12px; color: #64748b;">
              Delivered automatically via Ashish Agrawal Portfolio System &bull; <a href="mailto:${NOTIFICATION_RECIPIENT}" style="color: #64748b; text-decoration: none;">${NOTIFICATION_RECIPIENT}</a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

// HTML Template: Client Confirmation Receipt
function generateClientConfirmationEmailHtml({ name, subject, message, dateStr }) {
  const safeName = escapeHtml(name);
  const safeSubject = escapeHtml(subject);
  const safeMessage = escapeHtml(message).replace(/\n/g, '<br/>');

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Inquiry Confirmation - Ashish Agrawal</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0b0f1d; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #f1f5f9;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #0b0f1d; padding: 30px 15px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="max-width: 600px; width: 100%; background-color: #111827; border: 1px solid rgba(16, 185, 129, 0.3); border-radius: 12px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.5);">
          <!-- Header Bar -->
          <tr>
            <td style="background: linear-gradient(135deg, #0d1b2a, #112240); padding: 24px 30px; border-bottom: 2px solid #10b981;">
              <table width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td>
                    <h1 style="margin: 0; font-size: 20px; font-weight: 700; color: #ffffff;">
                      Thank you for contacting Ashish Agrawal
                    </h1>
                    <p style="margin: 4px 0 0; font-size: 13px; color: #10b981; font-family: monospace;">
                      Web Developer &bull; Sales Executive &bull; Digital Problem Solver
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Content Body -->
          <tr>
            <td style="padding: 30px;">
              <p style="margin: 0 0 16px; font-size: 16px; font-weight: 600; color: #ffffff;">
                Hello ${safeName},
              </p>
              <p style="margin: 0 0 20px; font-size: 14px; line-height: 1.6; color: #cbd5e1;">
                This email confirms that your inquiry regarding <strong style="color: #00d2ff;">"${safeSubject}"</strong> has been successfully received. I appreciate you taking the time to connect!
              </p>

              <!-- Turnaround Promise Card -->
              <div style="background-color: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.3); border-radius: 8px; padding: 14px 18px; margin-bottom: 24px;">
                <p style="margin: 0; font-size: 13px; color: #34d399; line-height: 1.5;">
                  🕒 <strong>Fast Response Guarantee:</strong> I personally review all submissions and will get back to you within <strong>24 business hours</strong> (typically within 2–4 hours during business days).
                </p>
              </div>

              <!-- Summary of their message -->
              <div style="margin-bottom: 24px;">
                <h4 style="margin: 0 0 8px; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; color: #94a3b8;">
                  Summary of your submission (${dateStr}):
                </h4>
                <div style="background-color: #0b0f1d; border-left: 3px solid #00d2ff; border-radius: 4px; padding: 14px 16px; font-size: 13px; line-height: 1.6; color: #e2e8f0;">
                  <p style="margin: 0 0 6px; font-weight: 600; color: #00d2ff;">Subject: ${safeSubject}</p>
                  <p style="margin: 0; color: #cbd5e1;">${safeMessage}</p>
                </div>
              </div>

              <p style="margin: 0 0 20px; font-size: 13px; line-height: 1.6; color: #94a3b8;">
                If your inquiry is urgent or you would like to share additional files or specs, you can also email me directly at
                <a href="mailto:${NOTIFICATION_RECIPIENT}" style="color: #00d2ff; text-decoration: underline;">${NOTIFICATION_RECIPIENT}</a>.
              </p>

              <div style="border-top: 1px solid #1f2937; padding-top: 20px; margin-top: 20px;">
                <p style="margin: 0; font-size: 14px; font-weight: 700; color: #ffffff;">Ashish Agrawal</p>
                <p style="margin: 2px 0 0; font-size: 12px; color: #64748b;">Web Developer &bull; Sales Executive</p>
                <p style="margin: 2px 0 0; font-size: 12px; color: #00d2ff;">
                  <a href="mailto:${NOTIFICATION_RECIPIENT}" style="color: #00d2ff; text-decoration: none;">${NOTIFICATION_RECIPIENT}</a>
                </p>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #0d1322; padding: 14px 30px; text-align: center; border-top: 1px solid #1f2937; font-size: 11px; color: #64748b;">
              &copy; ${new Date().getFullYear()} Ashish Agrawal. All rights reserved. This confirmation was sent automatically to confirm receipt of your inquiry.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

// =========================================================================
// API ROUTES
// =========================================================================

// Health check endpoint
app.get('/api/health', async (req, res) => {
  const isSmtpSet = Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    smtp_configured: isSmtpSet,
    mode: isSmtpSet ? 'live_smtp' : 'test_preview_mode',
    notification_recipient: NOTIFICATION_RECIPIENT
  });
});

// Get recent inquiries (for admin dashboard / audit)
app.get('/api/inquiries', (req, res) => {
  const list = getInquiries();
  res.json({ success: true, count: list.length, data: list });
});

// Primary Contact Form Submission Endpoint
const handleInquirySubmission = async (req, res) => {
  try {
    const { full_name, name, email, subject, message } = req.body;
    const clientName = (full_name || name || '').trim();
    const clientEmail = (email || '').trim();
    const clientSubject = (subject || '').trim();
    const clientMessage = (message || '').trim();
    const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
    const dateStr = new Date().toLocaleString('en-US', {
      timeZone: 'Asia/Kolkata',
      dateStyle: 'medium',
      timeStyle: 'short'
    });

    // Validation
    const errors = [];
    if (!clientName || clientName.length < 2) {
      errors.push({ field: 'name', message: 'Name must be at least 2 characters long.' });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!clientEmail || !emailRegex.test(clientEmail)) {
      errors.push({ field: 'email', message: 'Please provide a valid email address.' });
    }
    if (!clientSubject || clientSubject.length < 3) {
      errors.push({ field: 'subject', message: 'Subject must be at least 3 characters long.' });
    }
    if (!clientMessage || clientMessage.length < 10) {
      errors.push({ field: 'message', message: 'Message must be at least 10 characters long.' });
    }

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        error: errors[0].message,
        errors
      });
    }

    const transporter = await getTransporter();
    const senderName = process.env.SENDER_NAME || 'Ashish Agrawal Portfolio';
    const senderEmail = process.env.SENDER_EMAIL || process.env.SMTP_USER || 'ashishagrwal307@gmail.com';
    const fromHeader = `"${senderName}" <${senderEmail}>`;

    console.log(`[Submission] Processing inquiry from: "${clientName}" <${clientEmail}> - "${clientSubject}"`);

    // 1. Send Admin Notification Email
    const adminMailOptions = {
      from: fromHeader,
      to: NOTIFICATION_RECIPIENT,
      replyTo: `"${clientName}" <${clientEmail}>`,
      subject: `📬 Portfolio Inquiry: ${clientSubject} (${clientName})`,
      text: `New Portfolio Inquiry:\n\nName: ${clientName}\nEmail: ${clientEmail}\nSubject: ${clientSubject}\nTime: ${dateStr}\n\nMessage:\n${clientMessage}`,
      html: generateAdminEmailHtml({
        name: clientName,
        email: clientEmail,
        subject: clientSubject,
        message: clientMessage,
        dateStr,
        clientIp
      })
    };

    // 2. Send Client Confirmation Email
    const clientMailOptions = {
      from: fromHeader,
      to: clientEmail,
      replyTo: NOTIFICATION_RECIPIENT,
      subject: `Inquiry Received: ${clientSubject} - Ashish Agrawal`,
      text: `Hello ${clientName},\n\nThank you for reaching out! Your message regarding "${clientSubject}" has been received. I review all inquiries promptly and will get back to you within 24 hours.\n\nYour Message:\n${clientMessage}\n\nBest regards,\nAshish Agrawal\n${NOTIFICATION_RECIPIENT}`,
      html: generateClientConfirmationEmailHtml({
        name: clientName,
        subject: clientSubject,
        message: clientMessage,
        dateStr
      })
    };

    // Dispatch both emails in parallel
    const [adminResult, clientResult] = await Promise.allSettled([
      transporter.sendMail(adminMailOptions),
      transporter.sendMail(clientMailOptions)
    ]);

    const adminOk = adminResult.status === 'fulfilled';
    const clientOk = clientResult.status === 'fulfilled';

    let adminPreviewUrl = null;
    let clientPreviewUrl = null;

    if (adminOk) {
      adminPreviewUrl = nodemailer.getTestMessageUrl(adminResult.value) || null;
      console.log(`[Admin Email] Dispatched successfully to ${NOTIFICATION_RECIPIENT}.`);
      if (adminPreviewUrl) console.log(`[Admin Preview URL]: ${adminPreviewUrl}`);
    } else {
      console.error('[Admin Email Error]:', adminResult.reason);
    }

    if (clientOk) {
      clientPreviewUrl = nodemailer.getTestMessageUrl(clientResult.value) || null;
      console.log(`[Client Confirmation Email] Dispatched successfully to ${clientEmail}.`);
      if (clientPreviewUrl) console.log(`[Client Preview URL]: ${clientPreviewUrl}`);
    } else {
      console.error('[Client Email Error]:', clientResult.reason);
    }

    // Persist inquiry to JSON store
    const inquiryRecord = {
      id: 'inq_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6),
      created_at: new Date().toISOString(),
      full_name: clientName,
      email: clientEmail,
      subject: clientSubject,
      message: clientMessage,
      client_ip: clientIp,
      status: 'received',
      email_delivery: {
        admin_delivered: adminOk,
        admin_preview: adminPreviewUrl,
        client_delivered: clientOk,
        client_preview: clientPreviewUrl
      }
    };
    saveInquiry(inquiryRecord);

    // If at least one email was sent (or test preview generated)
    if (adminOk || clientOk) {
      return res.status(200).json({
        success: true,
        message: 'Your message has been sent successfully! A confirmation email has been dispatched to your inbox.',
        inquiryId: inquiryRecord.id,
        delivery: {
          admin: adminOk,
          client: clientOk,
          is_test_mode: isEthereal,
          previews: {
            admin_url: adminPreviewUrl,
            client_url: clientPreviewUrl
          }
        }
      });
    } else {
      // Both failed
      const errReason = adminResult.reason?.message || clientResult.reason?.message || 'SMTP delivery failed.';
      return res.status(502).json({
        success: false,
        error: `Email transmission failed: ${errReason}`
      });
    }
  } catch (err) {
    console.error('[Server Error in /api/inquiries]:', err);
    return res.status(500).json({
      success: false,
      error: 'An internal server error occurred while processing your message. Please try again or email directly.'
    });
  }
};

// Mount endpoints
app.post('/api/inquiries', handleInquirySubmission);
app.post('/api/contact', handleInquirySubmission);

// SMTP Setup page
app.get('/setup-smtp', (req, res) => {
  res.sendFile(path.join(__dirname, 'setup-smtp.html'));
});

// Save and verify SMTP configuration
app.post('/api/save-smtp', async (req, res) => {
  try {
    const { host, port, user, pass, recipient } = req.body;
    if (!user || !pass) {
      return res.status(400).json({ success: false, error: 'Email user and password/app-password are required.' });
    }

    const cleanPass = pass.replace(/\s+/g, '');
    const cleanHost = host || 'smtp.gmail.com';
    const cleanPort = parseInt(port || '587', 10);
    const targetRecipient = recipient || user;
    const isGmail = cleanHost.toLowerCase().includes('gmail') || user.toLowerCase().includes('@gmail.com');

    // Test transporter configuration
    let testTransporter;
    if (isGmail) {
      testTransporter = nodemailer.createTransport({
        service: 'gmail',
        auth: { user, pass: cleanPass }
      });
    } else {
      testTransporter = nodemailer.createTransport({
        host: cleanHost,
        port: cleanPort,
        secure: cleanPort === 465,
        auth: { user, pass: cleanPass },
        tls: { rejectUnauthorized: false }
      });
    }

    // Verify SMTP connection
    console.log(`[SMTP Verify] Testing connection for ${user}...`);
    await testTransporter.verify();

    // Send a real verification email
    const testInfo = await testTransporter.sendMail({
      from: `"Ashish Agrawal Portfolio" <${user}>`,
      to: targetRecipient,
      subject: '🎉 SMTP Successfully Connected - Ashish Agrawal Portfolio',
      text: `Congratulations Ashish!\n\nYour portfolio email integration is now 100% active and connected to ${user}.\nFuture client inquiries will be delivered instantly to this inbox, and clients will receive automated confirmation emails.\n\nTime: ${new Date().toLocaleString()}`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0b0f1d; padding: 25px; color: #f8fafc; border-radius: 10px;">
          <h2 style="color: #10b981; margin: 0 0 10px;">🎉 SMTP Integration Operational!</h2>
          <p style="font-size: 15px; line-height: 1.6; color: #cbd5e1;">
            Congratulations Ashish! Your email pipeline has been verified and connected to <strong>${escapeHtml(user)}</strong>.
          </p>
          <div style="background: #111827; border-left: 4px solid #10b981; padding: 12px 16px; margin: 15px 0;">
            <p style="margin: 0; font-size: 13px; color: #34d399;">
              ✅ <strong>Admin Notifications:</strong> Inquiries will land directly in this inbox.<br/>
              ✅ <strong>Client Confirmations:</strong> Clients will automatically receive an instant receipt from you.
            </p>
          </div>
          <p style="font-size: 12px; color: #64748b; margin-top: 20px;">
            Ashish Agrawal Portfolio &bull; Verified on ${new Date().toLocaleString()}
          </p>
        </div>
      `
    });

    // Save to .env on disk
    const envPath = path.join(__dirname, '.env');
    const newEnv = `PORT=${process.env.PORT || 3000}
NOTIFICATION_RECIPIENT=${targetRecipient}
SENDER_NAME=${process.env.SENDER_NAME || 'Ashish Agrawal Portfolio'}
SENDER_EMAIL=${user}

SMTP_HOST=${cleanHost}
SMTP_PORT=${cleanPort}
SMTP_SECURE=${cleanPort === 465}
SMTP_USER=${user}
SMTP_PASS=${cleanPass}
`;
    fs.writeFileSync(envPath, newEnv, 'utf-8');

    // Update in-memory process.env
    process.env.SMTP_HOST = cleanHost;
    process.env.SMTP_PORT = String(cleanPort);
    process.env.SMTP_USER = user;
    process.env.SMTP_PASS = cleanPass;
    process.env.NOTIFICATION_RECIPIENT = targetRecipient;
    resetTransporter();

    console.log(`[SMTP Verify] Successfully verified and saved credentials! Test message sent to ${targetRecipient}`);
    return res.json({
      success: true,
      message: `Credentials verified and saved! A confirmation email was just sent to ${targetRecipient}.`,
      messageId: testInfo.messageId
    });
  } catch (err) {
    console.error('[SMTP Verify Error]:', err.message);
    let helpfulMsg = err.message;
    if (err.message.includes('Username and Password not accepted') || err.message.includes('Invalid login') || err.message.includes('535-5.7.8')) {
      helpfulMsg = 'Gmail rejected login. Google requires an "App Password" (not your normal Gmail password). Please generate a 16-character App Password at https://myaccount.google.com/apppasswords with 2-Step Verification turned ON.';
    }
    return res.status(401).json({
      success: false,
      error: helpfulMsg
    });
  }
});

// Diagnostic test endpoint to verify SMTP on demand
app.post('/api/test-email', async (req, res) => {
  try {
    const testTarget = req.body.email || NOTIFICATION_RECIPIENT;
    const transporter = await getTransporter();
    const info = await transporter.sendMail({
      from: `"Ashish Agrawal Portfolio" <${process.env.SMTP_USER || 'test@ashishagrawal.dev'}>`,
      to: testTarget,
      subject: '✅ SMTP Connectivity Test - Ashish Agrawal Portfolio',
      text: 'This is a test email verifying that the SMTP dispatch pipeline is operational!',
      html: '<p style="color: #10b981; font-family: sans-serif;"><strong>Success!</strong> SMTP dispatch pipeline is fully operational.</p>'
    });
    const previewUrl = nodemailer.getTestMessageUrl(info);
    res.json({
      success: true,
      message: `Test email dispatched to ${testTarget}`,
      messageId: info.messageId,
      previewUrl
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Fallback to index.html for single-page portfolio routing
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Only start the listener if run directly (allows exporting app for testing)
if (require.main === module) {
  const server = app.listen(PORT, () => {
    const isLive = Boolean(process.env.SMTP_USER && process.env.SMTP_PASS && process.env.SMTP_PASS.trim().length > 0);
    console.log(`=======================================================`);
    console.log(`🚀 Ashish Agrawal Portfolio Server running on:`);
    console.log(`   http://localhost:${PORT}`);
    console.log(`   Notification Recipient: ${process.env.NOTIFICATION_RECIPIENT || NOTIFICATION_RECIPIENT}`);
    if (isLive) {
      console.log(`   Status: 🟢 LIVE SMTP ACTIVE (${process.env.SMTP_USER})`);
    } else {
      console.log(`   Status: 🟡 TEST MODE (Awaiting App Password)`);
      console.log(`   👉 Set up your Gmail App Password to receive real emails:`);
      console.log(`      http://localhost:${PORT}/setup-smtp`);
    }
    console.log(`=======================================================`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`Port ${PORT} is in use. Retrying on port ${Number(PORT) + 1}...`);
      server.listen(Number(PORT) + 1);
    } else {
      console.error('Server error:', err);
    }
  });
}

module.exports = { app, getTransporter, resetTransporter };
