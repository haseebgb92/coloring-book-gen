export const resetPasswordTemplate = (resetUrl: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta http-equiv="x-ua-compatible" content="ie=edge">
  <title>Password Reset</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style type="text/css">
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc; margin: 0; padding: 0; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table { border-collapse: separate !important; width: 100%; }
    .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
    .card { background-color: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
    .header { background-color: #4f46e5; padding: 30px; text-align: center; }
    .logo-text { color: #ffffff; margin: 0; font-size: 28px; font-weight: 900; letter-spacing: -0.05em; text-transform: uppercase; }
    .logo-accent { color: #818cf8; }
    .content { padding: 40px; color: #334155; line-height: 1.6; }
    .content h2 { color: #1e293b; font-size: 20px; font-weight: 700; margin-bottom: 16px; }
    .button-container { text-align: center; margin: 30px 0; }
    .button { background-color: #4f46e5; color: #ffffff !important; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 700; font-size: 16px; display: inline-block; box-shadow: 0 4px 6px rgba(79, 70, 229, 0.2); }
    .footer { padding: 0 40px 40px; text-align: center; color: #94a3b8; font-size: 12px; }
    .footer p { margin: 4px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="card">
      <div class="header">
        <div class="logo-text">Word Search <span class="logo-accent">Studio</span></div>
      </div>
      <div class="content">
        <h2>Password Reset Request</h2>
        <p>Hello,</p>
        <p>We received a request to reset the password for your Word Search Studio account. Click the button below to choose a new password:</p>
        <div class="button-container">
          <a href="${resetUrl}" class="button" target="_blank">Reset Password</a>
        </div>
        <p>If you did not request this, you can safely ignore this email. This link will expire in 1 hour.</p>
        <p>Best regards,<br>The Word Search Studio Team</p>
      </div>
      <div class="footer">
        <p>&copy; 2026 Word Search Studio. All rights reserved.</p>
        <p>Pakistan</p>
      </div>
    </div>
  </div>
</body>
</html>
`;
