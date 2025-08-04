export const createVerificationEmailTemplate = (
  code: string,
  userName: string
) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Email Verification</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f8f9fa;
        }
        .container {
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }
        .header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          text-align: center;
          padding: 30px 20px;
        }
        .header h1 {
          margin: 0;
          font-size: 28px;
          font-weight: 600;
        }
        .content {
          padding: 40px 30px;
        }
        .greeting {
          font-size: 18px;
          color: #2d3748;
          margin-bottom: 20px;
        }
        .description {
          color: #4a5568;
          margin-bottom: 30px;
          line-height: 1.7;
        }
        .verification-code {
          background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          padding: 25px;
          text-align: center;
          margin: 30px 0;
          font-size: 32px;
          font-weight: bold;
          letter-spacing: 6px;
          color: #2d3748;
          font-family: 'Courier New', monospace;
        }
        .expiry-notice {
          background: #fff5f5;
          border: 1px solid #fed7d7;
          border-radius: 8px;
          padding: 15px;
          margin: 20px 0;
          color: #c53030;
          font-size: 14px;
        }
        .footer {
          background: #f7fafc;
          padding: 20px 30px;
          text-align: center;
          border-top: 1px solid #e2e8f0;
        }
        .footer p {
          margin: 5px 0;
          font-size: 12px;
          color: #718096;
        }
        .logo {
          font-size: 24px;
          font-weight: bold;
          margin-bottom: 10px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">🎬 TikTok Clone</div>
          <h1>Email Verification</h1>
        </div>
        
        <div class="content">
          <div class="greeting">
            <strong>Hello ${userName}!</strong>
          </div>
          
          <div class="description">
            Thank you for signing up for TikTok Clone! To complete your registration and start sharing amazing videos, please verify your email address by entering the verification code below.
          </div>
          
          <div class="verification-code">
            ${code}
          </div>
          
          <div class="expiry-notice">
            ⏰ This verification code will expire in 15 minutes for security reasons.
          </div>
          
          <div class="description">
            If you didn't create an account with us, you can safely ignore this email. Your account won't be activated without verification.
          </div>
        </div>
        
        <div class="footer">
          <p>This is an automated message, please do not reply to this email.</p>
          <p>&copy; 2024 TikTok Clone. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};
