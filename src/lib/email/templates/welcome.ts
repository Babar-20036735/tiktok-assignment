export const createWelcomeEmailTemplate = (userName: string) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to TikTok Clone!</title>
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
          background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
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
          font-size: 20px;
          color: #2d3748;
          margin-bottom: 20px;
        }
        .description {
          color: #4a5568;
          margin-bottom: 30px;
          line-height: 1.7;
        }
        .success-icon {
          text-align: center;
          font-size: 48px;
          margin: 20px 0;
        }
        .features {
          background: #f7fafc;
          border-radius: 8px;
          padding: 20px;
          margin: 20px 0;
        }
        .features h3 {
          color: #2d3748;
          margin-top: 0;
        }
        .features ul {
          color: #4a5568;
          padding-left: 20px;
        }
        .features li {
          margin-bottom: 8px;
        }
        .cta {
          text-align: center;
          margin: 30px 0;
        }
        .cta-button {
          display: inline-block;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 15px 30px;
          text-decoration: none;
          border-radius: 8px;
          font-weight: 600;
          font-size: 16px;
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
          <h1>Welcome!</h1>
        </div>
        
        <div class="content">
          <div class="success-icon">✅</div>
          
          <div class="greeting">
            <strong>Hello ${userName}!</strong>
          </div>
          
          <div class="description">
            Congratulations! Your email has been successfully verified. You're now a member of our vibrant community and can start sharing your amazing videos with the world!
          </div>
          
          <div class="features">
            <h3>🎉 What you can do now:</h3>
            <ul>
              <li>📹 Upload and share your videos</li>
              <li>💬 Comment on videos and engage with the community</li>
              <li>❤️ Like and interact with content you love</li>
              <li>👥 Connect with other creators</li>
              <li>📊 Track your video performance</li>
            </ul>
          </div>
          
          <div class="cta">
            <a href="${
              process.env.NEXTAUTH_URL || "http://localhost:3000"
            }" class="cta-button">
              Start Creating Now! 🚀
            </a>
          </div>
          
          <div class="description">
            Thank you for joining our community! We're excited to see what amazing content you'll create.
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
