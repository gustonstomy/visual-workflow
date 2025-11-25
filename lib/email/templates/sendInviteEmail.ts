import { transporter } from "./mail-transporter";

interface SendInviteEmailParams {
  to: string;
  organizationName: string;
  organizationDescription?: string;
  inviteLink: string;
  inviterName?: string;
  role: string;
}

export async function sendInviteEmail({
  to,
  organizationName,
  organizationDescription,
  inviteLink,
  inviterName,
  role,
}: SendInviteEmailParams) {
  await transporter.sendMail({
    from: `"Visual Workflow" <${process.env.SMTP_USER}>`, // Updated sender name
    to,
    subject: `You're invited to join ${organizationName}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body { 
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              line-height: 1.6;
              color: #333;
            }
            .container { 
              max-width: 600px; 
              margin: 0 auto; 
              padding: 20px; 
              background-color: #f9fafb;
            }
            .card {
              background: white;
              border-radius: 8px;
              box-shadow: 0 1px 3px rgba(0,0,0,0.1);
              overflow: hidden;
            }
            .header { 
              background: linear-gradient(135deg, #0079BF 0%, #0063A5 100%);
              color: white; 
              padding: 40px 20px; 
              text-align: center;
            }
            .header h1 {
              margin: 0;
              font-size: 28px;
              font-weight: 700;
            }
            .content { 
              padding: 30px; 
            }
            .content p {
              margin: 10px 0;
            }
            .highlight {
              font-weight: 600;
              color: #0079BF;
            }
            .cta-button { 
              display: inline-block; 
              background: linear-gradient(135deg, #0079BF 0%, #0063A5 100%);
              color: white; 
              padding: 14px 32px; 
              text-decoration: none; 
              border-radius: 6px;
              font-weight: 600;
              margin: 25px 0;
              transition: all 0.3s ease;
            }
            .cta-button:hover {
              transform: translateY(-2px);
              box-shadow: 0 8px 15px rgba(0, 121, 191, 0.3);
            }
            .link-section {
              background-color: #f5f5f5;
              border-left: 4px solid #0079BF;
              padding: 15px;
              margin: 20px 0;
              border-radius: 4px;
              word-break: break-all;
              font-size: 12px;
              font-family: monospace;
              color: #666;
            }
            .role-badge {
              display: inline-block;
              background-color: #dbeafe;
              color: #1e40af;
              padding: 4px 12px;
              border-radius: 20px;
              font-size: 12px;
              font-weight: 600;
              margin: 10px 0;
            }
            .footer { 
              background-color: #f3f4f6;
              padding: 20px; 
              border-top: 1px solid #e5e7eb;
              font-size: 12px; 
              color: #6b7280;
              text-align: center;
            }
            .footer p {
              margin: 5px 0;
            }
            .warning {
              background-color: #fef3c7;
              border-left: 4px solid #f59e0b;
              padding: 15px;
              border-radius: 4px;
              margin: 20px 0;
              font-size: 13px;
              color: #92400e;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="card">
              <div class="header">
                <h1>🎉 You're Invited!</h1>
              </div>
              
              <div class="content">
                <p>Hi there,</p>
                
                <p><span class="highlight">${
                  inviterName || "Someone"
                }</span> has invited you to collaborate on <span class="highlight">${organizationName}</span> in Visual Workflow.</p>
                
                ${
                  organizationDescription
                    ? `
                  <p style="background-color: #f0f9ff; padding: 12px; border-radius: 6px; border-left: 3px solid #0079BF; margin: 15px 0;">
                    <strong>About this organization:</strong><br>
                    ${organizationDescription}
                  </p>
                `
                    : ""
                }
                
                <div class="role-badge">
                  Role: ${role.charAt(0).toUpperCase() + role.slice(1)}
                </div>
                
                <p style="margin-top: 20px; margin-bottom: 20px; color: #555;">
                  Click the button below to accept the invitation and start collaborating:
                </p>
                
                <a href="${inviteLink}" class="cta-button text-white">Accept Invitation</a>
                
                <p style="color: #666; font-size: 14px;">
                  Or copy and paste this link in your browser:
                </p>
                <div class="link-section">
                  ${inviteLink}
                </div>
                
                <div class="warning">
                  <strong>⏰ Important:</strong> This invitation expires in 7 days. Make sure to accept it before then.
                </div>
                
                <p style="margin-top: 25px; color: #666;">
                  If you have any questions or need help, feel free to reply to this email.
                </p>
                
                <p style="margin-top: 20px;">
                  Best regards,<br>
                  <strong>The Visual Workflow Team</strong>
                </p>
              </div>
              
              <div class="footer">
                <p>This is an automated email. Please do not reply directly to this email address.</p>
                <p>© 2025 Visual Workflow. All rights reserved.</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `,
  });
}
