import nodemailer from 'nodemailer';

// Email configuration - Use environment variables in production
const EMAIL_CONFIG = {
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '465'),
  secure: process.env.SMTP_SECURE === 'true' || parseInt(process.env.SMTP_PORT || '465') === 465,
  auth: {
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
  },
};

const FROM_EMAIL = process.env.FROM_EMAIL || 'noreply@mictestcam.com';
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://mictestcam.com';

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransport(EMAIL_CONFIG);
};

// Send verification email
export async function sendVerificationEmail(
  email: string,
  username: string,
  token: string
): Promise<boolean> {
  const verificationUrl = `${APP_URL}/admin/verify-email?token=${token}`;

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Verify Your Email - MicTestCam</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f3f4f6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
      <table role="presentation" style="width: 100%; border-collapse: collapse;">
        <tr>
          <td align="center" style="padding: 40px 0;">
            <table role="presentation" style="width: 600px; max-width: 100%; border-collapse: collapse; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
              <!-- Header -->
              <tr>
                <td style="background: linear-gradient(135deg, #6366f1 0%, #9333ea 100%); padding: 40px; text-align: center;">
                  <div style="display: inline-block; width: 60px; height: 60px; background-color: rgba(255,255,255,0.2); border-radius: 16px; line-height: 60px;">
                    <span style="color: white; font-size: 28px; font-weight: bold;">M</span>
                  </div>
                  <h1 style="color: white; margin: 20px 0 0; font-size: 24px; font-weight: 600;">MicTestCam Admin</h1>
                </td>
              </tr>
              <!-- Content -->
              <tr>
                <td style="padding: 40px;">
                  <h2 style="color: #111827; margin: 0 0 20px; font-size: 20px;">Welcome, ${username}!</h2>
                  <p style="color: #4b5563; line-height: 1.6; margin: 0 0 20px;">
                    Your admin account has been created. Please verify your email address to activate your account and start managing the MicTestCam blog.
                  </p>
                  <div style="text-align: center; margin: 30px 0;">
                    <a href="${verificationUrl}" style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #6366f1 0%, #9333ea 100%); color: white; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
                      Verify Email Address
                    </a>
                  </div>
                  <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin: 20px 0 0;">
                    This link will expire in 24 hours. If you didn't request this, please ignore this email.
                  </p>
                  <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
                  <p style="color: #9ca3af; font-size: 12px; margin: 0;">
                    If the button doesn't work, copy and paste this link:<br>
                    <a href="${verificationUrl}" style="color: #6366f1; word-break: break-all;">${verificationUrl}</a>
                  </p>
                </td>
              </tr>
              <!-- Footer -->
              <tr>
                <td style="background-color: #f9fafb; padding: 20px; text-align: center;">
                  <p style="color: #9ca3af; font-size: 12px; margin: 0;">
                    © ${new Date().getFullYear()} MicTestCam. All rights reserved.
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

  try {
    if (!EMAIL_CONFIG.auth.user) {
      console.log('Email not configured. Verification URL:', verificationUrl);
      return true; // Return true for development
    }

    const transporter = createTransporter();
    await transporter.sendMail({
      from: `"MicTestCam Admin" <${FROM_EMAIL}>`,
      to: email,
      subject: 'Verify Your Email - MicTestCam Admin',
      html: htmlContent,
    });
    return true;
  } catch (error) {
    console.error('Failed to send verification email:', error);
    return false;
  }
}

// Send password reset email
export async function sendPasswordResetEmail(
  email: string,
  username: string,
  token: string
): Promise<boolean> {
  const resetUrl = `${APP_URL}/admin/reset-password?token=${token}`;

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Reset Your Password - MicTestCam</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f3f4f6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
      <table role="presentation" style="width: 100%; border-collapse: collapse;">
        <tr>
          <td align="center" style="padding: 40px 0;">
            <table role="presentation" style="width: 600px; max-width: 100%; border-collapse: collapse; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
              <!-- Header -->
              <tr>
                <td style="background: linear-gradient(135deg, #6366f1 0%, #9333ea 100%); padding: 40px; text-align: center;">
                  <div style="display: inline-block; width: 60px; height: 60px; background-color: rgba(255,255,255,0.2); border-radius: 16px; line-height: 60px;">
                    <span style="color: white; font-size: 28px; font-weight: bold;">M</span>
                  </div>
                  <h1 style="color: white; margin: 20px 0 0; font-size: 24px; font-weight: 600;">MicTestCam Admin</h1>
                </td>
              </tr>
              <!-- Content -->
              <tr>
                <td style="padding: 40px;">
                  <h2 style="color: #111827; margin: 0 0 20px; font-size: 20px;">Password Reset Request</h2>
                  <p style="color: #4b5563; line-height: 1.6; margin: 0 0 20px;">
                    Hi ${username},<br><br>
                    We received a request to reset your password for your MicTestCam admin account. Click the button below to create a new password.
                  </p>
                  <div style="text-align: center; margin: 30px 0;">
                    <a href="${resetUrl}" style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #6366f1 0%, #9333ea 100%); color: white; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
                      Reset Password
                    </a>
                  </div>
                  <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin: 20px 0 0;">
                    This link will expire in 1 hour. If you didn't request a password reset, you can safely ignore this email.
                  </p>
                  <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
                  <p style="color: #9ca3af; font-size: 12px; margin: 0;">
                    If the button doesn't work, copy and paste this link:<br>
                    <a href="${resetUrl}" style="color: #6366f1; word-break: break-all;">${resetUrl}</a>
                  </p>
                </td>
              </tr>
              <!-- Footer -->
              <tr>
                <td style="background-color: #f9fafb; padding: 20px; text-align: center;">
                  <p style="color: #9ca3af; font-size: 12px; margin: 0;">
                    © ${new Date().getFullYear()} MicTestCam. All rights reserved.
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

  try {
    if (!EMAIL_CONFIG.auth.user) {
      console.log('Email not configured. Reset URL:', resetUrl);
      return true; // Return true for development
    }

    const transporter = createTransporter();
    await transporter.sendMail({
      from: `"MicTestCam Admin" <${FROM_EMAIL}>`,
      to: email,
      subject: 'Reset Your Password - MicTestCam Admin',
      html: htmlContent,
    });
    return true;
  } catch (error) {
    console.error('Failed to send password reset email:', error);
    return false;
  }
}

// Send welcome email after verification
export async function sendWelcomeEmail(
  email: string,
  username: string,
  role: string
): Promise<boolean> {
  const loginUrl = `${APP_URL}/admin/login`;

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to MicTestCam Admin</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f3f4f6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
      <table role="presentation" style="width: 100%; border-collapse: collapse;">
        <tr>
          <td align="center" style="padding: 40px 0;">
            <table role="presentation" style="width: 600px; max-width: 100%; border-collapse: collapse; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
              <!-- Header -->
              <tr>
                <td style="background: linear-gradient(135deg, #6366f1 0%, #9333ea 100%); padding: 40px; text-align: center;">
                  <div style="display: inline-block; width: 60px; height: 60px; background-color: rgba(255,255,255,0.2); border-radius: 16px; line-height: 60px;">
                    <span style="color: white; font-size: 28px; font-weight: bold;">M</span>
                  </div>
                  <h1 style="color: white; margin: 20px 0 0; font-size: 24px; font-weight: 600;">Welcome Aboard!</h1>
                </td>
              </tr>
              <!-- Content -->
              <tr>
                <td style="padding: 40px;">
                  <h2 style="color: #111827; margin: 0 0 20px; font-size: 20px;">Your account is now active!</h2>
                  <p style="color: #4b5563; line-height: 1.6; margin: 0 0 20px;">
                    Hi ${username},<br><br>
                    Your email has been verified and your MicTestCam admin account is now active. You've been assigned the <strong>${role}</strong> role.
                  </p>
                  <div style="text-align: center; margin: 30px 0;">
                    <a href="${loginUrl}" style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #6366f1 0%, #9333ea 100%); color: white; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
                      Go to Admin Panel
                    </a>
                  </div>
                </td>
              </tr>
              <!-- Footer -->
              <tr>
                <td style="background-color: #f9fafb; padding: 20px; text-align: center;">
                  <p style="color: #9ca3af; font-size: 12px; margin: 0;">
                    © ${new Date().getFullYear()} MicTestCam. All rights reserved.
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

  try {
    if (!EMAIL_CONFIG.auth.user) {
      console.log('Email not configured. Login URL:', loginUrl);
      return true;
    }

    const transporter = createTransporter();
    await transporter.sendMail({
      from: `"MicTestCam Admin" <${FROM_EMAIL}>`,
      to: email,
      subject: 'Welcome to MicTestCam Admin!',
      html: htmlContent,
    });
    return true;
  } catch (error) {
    console.error('Failed to send welcome email:', error);
    return false;
  }
}
