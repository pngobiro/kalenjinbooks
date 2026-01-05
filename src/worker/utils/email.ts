/// <reference types="@cloudflare/workers-types" />

import { Env } from '../types/env';

export interface EmailTemplate {
    to: string;
    subject: string;
    html: string;
    text: string;
}

/**
 * Send email using Cloudflare's email service or external provider
 * For now, we'll use a simple fetch to an email service
 */
export async function sendEmail(template: EmailTemplate, env: Env): Promise<boolean> {
    try {
        // For production, you would integrate with:
        // - Cloudflare Email Workers
        // - SendGrid
        // - Mailgun
        // - AWS SES
        // - Resend
        
        // For now, we'll log the email and return success
        console.log('📧 Email would be sent:', {
            to: template.to,
            subject: template.subject,
            preview: template.text.substring(0, 100) + '...'
        });
        
        // In production, uncomment and configure your email service:
        /*
        const response = await fetch('https://api.sendgrid.v3/mail/send', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${env.SENDGRID_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                personalizations: [{
                    to: [{ email: template.to }],
                    subject: template.subject
                }],
                from: { email: 'noreply@kalenjinbooks.com', name: 'KaleeReads' },
                content: [
                    { type: 'text/plain', value: template.text },
                    { type: 'text/html', value: template.html }
                ]
            })
        });
        
        return response.ok;
        */
        
        return true; // Simulate success for now
    } catch (error) {
        console.error('Email sending failed:', error);
        return false;
    }
}

/**
 * Generate approval email template
 */
export function createApprovalEmail(authorName: string, authorEmail: string): EmailTemplate {
    const subject = '🎉 Your KaleeReads Author Application Has Been Approved!';
    
    const html = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Author Application Approved</title>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #E07856; color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
            .button { display: inline-block; background: #E07856; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🎉 Congratulations!</h1>
                <p>Your author application has been approved</p>
            </div>
            <div class="content">
                <p>Dear ${authorName},</p>
                
                <p>We're excited to inform you that your application to become a KaleeReads author has been <strong>approved</strong>!</p>
                
                <p>You can now:</p>
                <ul>
                    <li>✅ Upload and publish your books</li>
                    <li>✅ Set your own pricing</li>
                    <li>✅ Track your sales and earnings</li>
                    <li>✅ Reach thousands of readers</li>
                    <li>✅ Keep 70% of your book sales</li>
                </ul>
                
                <p>Ready to get started?</p>
                <a href="https://kalenjinbooks.com/dashboard/author" class="button">Access Your Dashboard</a>
                
                <p>If you have any questions, feel free to reach out to our support team.</p>
                
                <p>Welcome to the KaleeReads family!</p>
                
                <p>Best regards,<br>
                The KaleeReads Team</p>
            </div>
            <div class="footer">
                <p>KaleeReads - Preserving Kalenjin Literature & Culture</p>
                <p>This email was sent to ${authorEmail}</p>
            </div>
        </div>
    </body>
    </html>
    `;
    
    const text = `
    Congratulations ${authorName}!
    
    Your application to become a KaleeReads author has been approved!
    
    You can now:
    - Upload and publish your books
    - Set your own pricing  
    - Track your sales and earnings
    - Reach thousands of readers
    - Keep 70% of your book sales
    
    Access your dashboard: https://kalenjinbooks.com/dashboard/author
    
    Welcome to the KaleeReads family!
    
    Best regards,
    The KaleeReads Team
    `;
    
    return {
        to: authorEmail,
        subject,
        html,
        text
    };
}

/**
 * Generate rejection email template
 */
export function createRejectionEmail(authorName: string, authorEmail: string, reason: string): EmailTemplate {
    const subject = 'Update on Your KaleeReads Author Application';
    
    const html = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Author Application Update</title>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #f8f9fa; color: #333; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; border-left: 4px solid #dc3545; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
            .reason-box { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 6px; margin: 20px 0; }
            .button { display: inline-block; background: #E07856; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Author Application Update</h1>
                <p>Thank you for your interest in KaleeReads</p>
            </div>
            <div class="content">
                <p>Dear ${authorName},</p>
                
                <p>Thank you for your interest in becoming a KaleeReads author. After careful review, we are unable to approve your application at this time.</p>
                
                <div class="reason-box">
                    <h3>Feedback:</h3>
                    <p>${reason}</p>
                </div>
                
                <p>We encourage you to address the feedback above and reapply in the future. Our platform is always looking for quality content that celebrates Kalenjin culture and literature.</p>
                
                <p>You can submit a new application at any time:</p>
                <a href="https://kalenjinbooks.com/dashboard/author/register" class="button">Apply Again</a>
                
                <p>If you have questions about this decision or need clarification, please don't hesitate to contact our support team.</p>
                
                <p>Thank you for your understanding.</p>
                
                <p>Best regards,<br>
                The KaleeReads Team</p>
            </div>
            <div class="footer">
                <p>KaleeReads - Preserving Kalenjin Literature & Culture</p>
                <p>This email was sent to ${authorEmail}</p>
            </div>
        </div>
    </body>
    </html>
    `;
    
    const text = `
    Dear ${authorName},
    
    Thank you for your interest in becoming a KaleeReads author. After careful review, we are unable to approve your application at this time.
    
    Feedback:
    ${reason}
    
    We encourage you to address the feedback above and reapply in the future. Our platform is always looking for quality content that celebrates Kalenjin culture and literature.
    
    You can submit a new application at: https://kalenjinbooks.com/dashboard/author/register
    
    If you have questions about this decision, please contact our support team.
    
    Thank you for your understanding.
    
    Best regards,
    The KaleeReads Team
    `;
    
    return {
        to: authorEmail,
        subject,
        html,
        text
    };
}