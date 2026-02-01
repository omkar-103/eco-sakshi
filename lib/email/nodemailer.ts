// lib/email/nodemailer.ts
import nodemailer from 'nodemailer';
import { Report, User } from '@/types';
import { getStatusLabel, formatDateTime } from '@/lib/utils/helpers';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

async function sendEmail(options: EmailOptions): Promise<boolean> {
  try {
    await transporter.sendMail({
      from: `"GreenSentinel - Environmental Compliance Network" <${process.env.EMAIL_FROM}>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
    });
    console.log(`✅ Email sent to ${options.to}`);
    return true;
  } catch (error) {
    console.error('❌ Email sending failed:', error);
    return false;
  }
}

function getEmailTemplate(content: string, title: string): string {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title}</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f6f7f4;">
      <table role="presentation" style="width: 100%; border-collapse: collapse;">
        <tr>
          <td align="center" style="padding: 40px 0;">
            <table role="presentation" style="width: 600px; max-width: 100%; border-collapse: collapse; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
              <!-- Header -->
              <tr>
                <td style="background: linear-gradient(135deg, #166534 0%, #0369a1 100%); padding: 32px; text-align: center;">
                  <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 700;">
                    🌿 GreenSentinel
                  </h1>
                  <p style="color: #bbf7d0; margin: 8px 0 0 0; font-size: 14px;">
                    Environmental Compliance Network
                  </p>
                </td>
              </tr>
              <!-- Content -->
              <tr>
                <td style="padding: 40px 32px;">
                  ${content}
                </td>
              </tr>
              <!-- Footer -->
              <tr>
                <td style="background-color: #f6f7f4; padding: 24px 32px; text-align: center; border-top: 1px solid #e3e7dd;">
                  <p style="color: #687a59; font-size: 12px; margin: 0;">
                    This is an automated message from GreenSentinel. Please do not reply directly to this email.
                  </p>
                  <p style="color: #687a59; font-size: 12px; margin: 8px 0 0 0;">
                    © ${new Date().getFullYear()} Environmental Compliance Network. All rights reserved.
                  </p>
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

export async function sendWelcomeEmail(user: User): Promise<boolean> {
  const content = `
    <h2 style="color: #166534; margin: 0 0 16px 0; font-size: 20px;">Welcome to GreenSentinel!</h2>
    <p style="color: #363f30; font-size: 16px; line-height: 1.6; margin: 0 0 16px 0;">
      Dear ${user.name},
    </p>
    <p style="color: #516045; font-size: 15px; line-height: 1.6; margin: 0 0 16px 0;">
      Thank you for joining the Environmental Compliance Network. Together, we can make a real difference in protecting our environment.
    </p>
    <p style="color: #516045; font-size: 15px; line-height: 1.6; margin: 0 0 24px 0;">
      You can now report environmental issues in your area and track their resolution progress. Every report counts!
    </p>
    <a href="${process.env.NEXT_PUBLIC_APP_URL}/citizen" style="display: inline-block; background-color: #166534; color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: 600; font-size: 15px;">
      Go to Dashboard
    </a>
  `;

  return sendEmail({
    to: user.email,
    subject: 'Welcome to GreenSentinel - Environmental Compliance Network',
    html: getEmailTemplate(content, 'Welcome'),
  });
}

export async function sendReportSubmittedEmail(user: User, report: Report): Promise<boolean> {
  const content = `
    <h2 style="color: #166534; margin: 0 0 16px 0; font-size: 20px;">Report Submitted Successfully</h2>
    <p style="color: #363f30; font-size: 16px; line-height: 1.6; margin: 0 0 16px 0;">
      Dear ${user.name},
    </p>
    <p style="color: #516045; font-size: 15px; line-height: 1.6; margin: 0 0 16px 0;">
      Your environmental report has been submitted successfully. Here are the details:
    </p>
    <div style="background-color: #f0fdf4; border-radius: 12px; padding: 20px; margin: 0 0 24px 0;">
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 8px 0; color: #516045; font-size: 14px; font-weight: 600;">Complaint ID:</td>
          <td style="padding: 8px 0; color: #166534; font-size: 14px; font-weight: 700;">${report.complaintId}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #516045; font-size: 14px; font-weight: 600;">Title:</td>
          <td style="padding: 8px 0; color: #363f30; font-size: 14px;">${report.title}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #516045; font-size: 14px; font-weight: 600;">Status:</td>
          <td style="padding: 8px 0; color: #f59e0b; font-size: 14px; font-weight: 600;">Pending Review</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #516045; font-size: 14px; font-weight: 600;">Submitted:</td>
          <td style="padding: 8px 0; color: #363f30; font-size: 14px;">${formatDateTime(report.createdAt)}</td>
        </tr>
      </table>
    </div>
    <p style="color: #516045; font-size: 15px; line-height: 1.6; margin: 0 0 24px 0;">
      Our team will review your report and you will receive updates on its progress.
    </p>
    <a href="${process.env.NEXT_PUBLIC_APP_URL}/citizen/reports/${report._id}" style="display: inline-block; background-color: #166534; color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: 600; font-size: 15px;">
      Track Your Report
    </a>
  `;

  return sendEmail({
    to: user.email,
    subject: `Report Submitted - ${report.complaintId}`,
    html: getEmailTemplate(content, 'Report Submitted'),
  });
}



export async function sendStatusUpdateEmail(
  user: User,
  report: Report,
  previousStatus: string,
  notes?: string
): Promise<boolean> {
  const statusColors: Record<string, string> = {
    pending: '#f59e0b',
    verified: '#3b82f6',
    'under-review': '#8b5cf6',
    'in-progress': '#6366f1',
    resolved: '#10b981',
    rejected: '#ef4444',
  };

  const isResolved = report.status === 'resolved';
  const statusColor = statusColors[report.status] || '#516045';

  const content = `
    <h2 style="color: #166534; margin: 0 0 16px 0; font-size: 20px;">
      ${isResolved ? '🎉 Your Report Has Been Resolved!' : 'Report Status Update'}
    </h2>
    <p style="color: #363f30; font-size: 16px; line-height: 1.6; margin: 0 0 16px 0;">
      Dear ${user.name},
    </p>
    <p style="color: #516045; font-size: 15px; line-height: 1.6; margin: 0 0 16px 0;">
      ${isResolved 
        ? 'Great news! The environmental issue you reported has been successfully resolved. Thank you for being an active citizen and helping protect our environment.' 
        : 'There has been an update to your environmental report:'}
    </p>
    <div style="background-color: #f0fdf4; border-radius: 12px; padding: 20px; margin: 0 0 24px 0;">
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 8px 0; color: #516045; font-size: 14px; font-weight: 600;">Complaint ID:</td>
          <td style="padding: 8px 0; color: #166534; font-size: 14px; font-weight: 700;">${report.complaintId}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #516045; font-size: 14px; font-weight: 600;">Title:</td>
          <td style="padding: 8px 0; color: #363f30; font-size: 14px;">${report.title}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #516045; font-size: 14px; font-weight: 600;">Previous Status:</td>
          <td style="padding: 8px 0; color: #687a59; font-size: 14px;">${getStatusLabel(previousStatus)}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #516045; font-size: 14px; font-weight: 600;">New Status:</td>
          <td style="padding: 8px 0; color: ${statusColor}; font-size: 14px; font-weight: 700;">${getStatusLabel(report.status)}</td>
        </tr>
        ${notes ? `
        <tr>
          <td colspan="2" style="padding: 16px 0 0 0;">
            <div style="background-color: #ffffff; border-radius: 8px; padding: 12px; border-left: 4px solid ${statusColor};">
              <p style="color: #516045; font-size: 13px; margin: 0 0 4px 0; font-weight: 600;">Notes from Authority:</p>
              <p style="color: #363f30; font-size: 14px; margin: 0; line-height: 1.5;">${notes}</p>
            </div>
          </td>
        </tr>
        ` : ''}
        ${report.authorityResponse ? `
        <tr>
          <td colspan="2" style="padding: 16px 0 0 0;">
            <div style="background-color: #ffffff; border-radius: 8px; padding: 12px; border-left: 4px solid #10b981;">
              <p style="color: #516045; font-size: 13px; margin: 0 0 4px 0; font-weight: 600;">Action Taken:</p>
              <p style="color: #363f30; font-size: 14px; margin: 0; line-height: 1.5;">${report.authorityResponse.actionTaken}</p>
            </div>
          </td>
        </tr>
        ` : ''}
      </table>
    </div>
    ${isResolved ? `
    <p style="color: #10b981; font-size: 15px; line-height: 1.6; margin: 0 0 24px 0; font-weight: 600;">
      ✅ This complaint has been successfully resolved. Thank you for your contribution to environmental protection!
    </p>
    ` : ''}
    <a href="${process.env.NEXT_PUBLIC_APP_URL}/citizen/reports/${report._id}" style="display: inline-block; background-color: #166534; color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: 600; font-size: 15px;">
      View Full Details
    </a>
  `;

  return sendEmail({
    to: user.email,
    subject: isResolved 
      ? `✅ Report Resolved - ${report.complaintId}` 
      : `Status Update - ${report.complaintId}`,
    html: getEmailTemplate(content, 'Status Update'),
  });
}
export async function sendSubscriptionEmail(
  user: User,
  plan: string,
  validUntil: Date
): Promise<boolean> {
  const planNames: Record<string, string> = {
    premium: 'Premium',
    enterprise: 'Enterprise',
  };

  const content = `
    <h2 style="color: #166534; margin: 0 0 16px 0; font-size: 20px;">🎉 Subscription Activated!</h2>
    <p style="color: #363f30; font-size: 16px; line-height: 1.6; margin: 0 0 16px 0;">
      Dear ${user.name},
    </p>
    <p style="color: #516045; font-size: 15px; line-height: 1.6; margin: 0 0 16px 0;">
      Thank you for upgrading to <strong>${planNames[plan] || plan}</strong>! Your subscription is now active.
    </p>
    <div style="background-color: #f0fdf4; border-radius: 12px; padding: 20px; margin: 0 0 24px 0;">
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 8px 0; color: #516045; font-size: 14px; font-weight: 600;">Plan:</td>
          <td style="padding: 8px 0; color: #166534; font-size: 14px; font-weight: 700;">${planNames[plan] || plan}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #516045; font-size: 14px; font-weight: 600;">Valid Until:</td>
          <td style="padding: 8px 0; color: #363f30; font-size: 14px;">${formatDateTime(validUntil)}</td>
        </tr>
      </table>
    </div>
    <p style="color: #516045; font-size: 15px; line-height: 1.6; margin: 0 0 24px 0;">
      You now have access to all premium features including unlimited reports, priority review, and advanced analytics.
    </p>
    <a href="${process.env.NEXT_PUBLIC_APP_URL}/citizen" style="display: inline-block; background-color: #166534; color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: 600; font-size: 15px;">
      Go to Dashboard
    </a>
  `;

  return sendEmail({
    to: user.email,
    subject: `🎉 ${planNames[plan] || plan} Subscription Activated - GreenSentinel`,
    html: getEmailTemplate(content, 'Subscription Activated'),
  });
}
export { sendEmail, getEmailTemplate };



// Add this to your existing nodemailer.ts file

export async function sendApiKeyEmail(
  user: { name: string; email: string },
  apiKeyData: {
    keyName: string;
    apiKey: string;
    plan: string;
    expiresAt: Date;
    limits: {
      perMinute: number;
      perDay: number;
      perMonth: number;
    };
  }
): Promise<void> {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Your API Key - Eco Sakshi</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8faf8;">
      <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <div style="background: linear-gradient(135deg, #166534 0%, #0ea5e9 100%); border-radius: 16px 16px 0 0; padding: 40px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">🔑 Your API Key is Ready!</h1>
          <p style="color: rgba(255,255,255,0.9); margin-top: 10px;">Eco Sakshi API Access</p>
        </div>
        
        <div style="background: white; padding: 40px; border-radius: 0 0 16px 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.08);">
          <p style="color: #363f38; font-size: 16px; line-height: 1.6;">
            Hello <strong>${user.name}</strong>,
          </p>
          
          <p style="color: #516558; font-size: 15px; line-height: 1.6;">
            Your API key for <strong>${apiKeyData.keyName}</strong> has been created successfully!
          </p>

          <div style="background: #fef3c7; border: 2px solid #f59e0b; border-radius: 12px; padding: 20px; margin: 24px 0;">
            <p style="color: #92400e; font-size: 14px; font-weight: 600; margin: 0 0 10px 0;">
              ⚠️ IMPORTANT: Save this key now!
            </p>
            <p style="color: #92400e; font-size: 13px; margin: 0;">
              This is the only time you'll see the full API key. Store it securely.
            </p>
          </div>

          <div style="background: #052e16; border-radius: 12px; padding: 20px; margin: 24px 0;">
            <p style="color: #86efac; font-size: 12px; margin: 0 0 8px 0; font-weight: 600;">YOUR API KEY:</p>
            <p style="color: #4ade80; font-size: 14px; font-family: 'Courier New', monospace; word-break: break-all; margin: 0; padding: 12px; background: rgba(255,255,255,0.1); border-radius: 8px;">
              ${apiKeyData.apiKey}
            </p>
          </div>

          <div style="background: #f0fdf4; border-radius: 12px; padding: 20px; margin: 24px 0;">
            <h3 style="color: #166534; margin: 0 0 16px 0; font-size: 16px;">Plan Details: ${apiKeyData.plan}</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #516558; font-size: 14px;">Requests per minute:</td>
                <td style="padding: 8px 0; color: #166534; font-size: 14px; font-weight: 600; text-align: right;">${apiKeyData.limits.perMinute}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #516558; font-size: 14px;">Requests per day:</td>
                <td style="padding: 8px 0; color: #166534; font-size: 14px; font-weight: 600; text-align: right;">${apiKeyData.limits.perDay.toLocaleString()}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #516558; font-size: 14px;">Requests per month:</td>
                <td style="padding: 8px 0; color: #166534; font-size: 14px; font-weight: 600; text-align: right;">${apiKeyData.limits.perMonth.toLocaleString()}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #516558; font-size: 14px;">Expires on:</td>
                <td style="padding: 8px 0; color: #166534; font-size: 14px; font-weight: 600; text-align: right;">${apiKeyData.expiresAt.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</td>
              </tr>
            </table>
          </div>

          <div style="background: #f0f9ff; border-radius: 12px; padding: 20px; margin: 24px 0;">
            <h3 style="color: #0369a1; margin: 0 0 12px 0; font-size: 14px;">Quick Start:</h3>
            <pre style="background: #082f49; color: #7dd3fc; padding: 16px; border-radius: 8px; font-size: 12px; overflow-x: auto; margin: 0;">
curl -X GET "https://ecosakshi.com/api/v1/reports" \\
  -H "x-api-key: ${apiKeyData.apiKey}"</pre>
          </div>

          <div style="text-align: center; margin-top: 32px;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/ngo/api" 
               style="display: inline-block; background: linear-gradient(135deg, #166534, #22c55e); color: white; text-decoration: none; padding: 14px 32px; border-radius: 12px; font-weight: 600; font-size: 15px;">
              View API Documentation
            </a>
          </div>

          <hr style="border: none; border-top: 1px solid #dce5de; margin: 32px 0;">
          
          <p style="color: #8fa697; font-size: 13px; text-align: center; margin: 0;">
            Need help? Contact us at <a href="mailto:api@ecosakshi.com" style="color: #166534;">api@ecosakshi.com</a>
          </p>
        </div>

        <p style="text-align: center; color: #8fa697; font-size: 12px; margin-top: 24px;">
          © ${new Date().getFullYear()} Eco Sakshi. All rights reserved.
        </p>
      </div>
    </body>
    </html>
  `;

  await transporter.sendMail({
    from: `"Eco Sakshi API" <${process.env.SMTP_FROM}>`,
    to: user.email,
    subject: `🔑 Your Eco Sakshi API Key: ${apiKeyData.keyName}`,
    html,
  });
}