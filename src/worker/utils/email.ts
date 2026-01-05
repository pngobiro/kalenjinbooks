/// <reference types="@cloudflare/workers-types" />

import { Env } from '../types/env';

export interface EmailTemplate {
    to: string;
    subject: string;
    html: string;
    text: string;
}

/**
 * Send email using Resend API
 */
export async function sendEmail(template: EmailTemplate, env: Env): Promise<boolean> {
    try {
        // Check if we have Resend API key
        const resendApiKey = env.RESEND_API_KEY;
        if (!resendApiKey) {
            console.log('📧 RESEND_API_KEY not configured. Email would be sent:', {
                to: template.to,
                subject: template.subject,
                preview: template.text.substring(0, 100) + '...'
            });
            return true; // Return true for development
        }

        // Send email using Resend API with improved deliverability
        const response = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${resendApiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                from: 'KaleeReads Team <onboarding@resend.dev>',
                to: [template.to],
                subject: template.subject,
                html: template.html,
                text: template.text,
                headers: {
                    'X-Entity-Ref-ID': '1234567890',
                    'List-Unsubscribe': '<mailto:unsubscribe@kalenjinbooks.com>',
                    'X-Mailer': 'KaleeReads Platform'
                },
                tags: [
                    {
                        name: 'category',
                        value: 'author-notification'
                    }
                ]
            })
        });

        if (response.ok) {
            const result = await response.json();
            console.log('✅ Email sent successfully:', {
                to: template.to,
                subject: template.subject,
                id: result.id
            });
            return true;
        } else {
            const error = await response.text();
            console.error('❌ Email sending failed:', {
                status: response.status,
                error: error,
                to: template.to
            });
            return false;
        }
        
    } catch (error) {
        console.error('❌ Email sending error:', error);
        return false;
    }
}

/**
 * Generate approval email template
 */
export function createApprovalEmail(authorName: string, authorEmail: string): EmailTemplate {
    const subject = 'Welcome to KaleeReads - Your Author Application Approved';
    
    const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Author Application Approved - KaleeReads</title>
        <style>
            body { 
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; 
                line-height: 1.6; 
                color: #333333; 
                margin: 0; 
                padding: 0; 
                background-color: #f8f9fa;
            }
            .container { 
                max-width: 600px; 
                margin: 20px auto; 
                background: white; 
                border-radius: 8px; 
                overflow: hidden;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }
            .header { 
                background: #E07856; 
                color: white; 
                padding: 40px 30px; 
                text-align: center; 
            }
            .header h1 { 
                margin: 0; 
                font-size: 28px; 
                font-weight: 600; 
            }
            .content { 
                padding: 40px 30px; 
            }
            .content h2 {
                color: #E07856;
                margin-top: 0;
            }
            .button { 
                display: inline-block; 
                background: #E07856; 
                color: white; 
                padding: 14px 28px; 
                text-decoration: none; 
                border-radius: 6px; 
                margin: 20px 0; 
                font-weight: 600;
            }
            .features {
                background: #f8f9fa;
                padding: 20px;
                border-radius: 6px;
                margin: 20px 0;
            }
            .features ul {
                margin: 0;
                padding-left: 20px;
            }
            .features li {
                margin: 8px 0;
            }
            .footer { 
                background: #f8f9fa;
                text-align: center; 
                padding: 30px; 
                color: #666; 
                font-size: 14px; 
                border-top: 1px solid #eee;
            }
            .footer a {
                color: #E07856;
                text-decoration: none;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🎉 Welcome to KaleeReads!</h1>
                <p style="margin: 10px 0 0 0; opacity: 0.9;">Your author application has been approved</p>
            </div>
            <div class="content">
                <h2>Dear ${authorName},</h2>
                
                <p>Congratulations! We're excited to inform you that your application to become a KaleeReads author has been <strong>approved</strong>.</p>
                
                <p>KaleeReads is dedicated to preserving and promoting Kalenjin literature and culture. As an approved author, you're now part of our mission to share authentic stories with readers worldwide.</p>
                
                <div class="features">
                    <h3 style="margin-top: 0; color: #E07856;">What you can do now:</h3>
                    <ul>
                        <li><strong>Publish your books</strong> - Upload and share your stories</li>
                        <li><strong>Set your pricing</strong> - You control your book prices</li>
                        <li><strong>Track earnings</strong> - Monitor your sales and revenue</li>
                        <li><strong>Reach readers</strong> - Connect with thousands of book lovers</li>
                        <li><strong>Keep 70% revenue</strong> - Earn more from your creative work</li>
                    </ul>
                </div>
                
                <p>Ready to start your publishing journey?</p>
                <div style="text-align: center;">
                    <a href="https://kalenjinbooks.com/dashboard/author" class="button">Access Your Dashboard</a>
                </div>
                
                <p>If you have any questions or need assistance, our support team is here to help. Simply reply to this email or contact us through your dashboard.</p>
                
                <p>Welcome to the KaleeReads family!</p>
                
                <p>Best regards,<br>
                <strong>The KaleeReads Team</strong><br>
                Preserving Kalenjin Literature & Culture</p>
            </div>
            <div class="footer">
                <p><strong>KaleeReads</strong> - Digital Platform for Kalenjin Literature</p>
                <p>This email was sent to ${authorEmail}</p>
                <p><a href="mailto:support@kalenjinbooks.com">Contact Support</a> | <a href="https://kalenjinbooks.com/privacy">Privacy Policy</a></p>
            </div>
        </div>
    </body>
    </html>
    `;
    
    const text = `
Welcome to KaleeReads!

Dear ${authorName},

Congratulations! Your application to become a KaleeReads author has been approved.

KaleeReads is dedicated to preserving and promoting Kalenjin literature and culture. As an approved author, you're now part of our mission to share authentic stories with readers worldwide.

What you can do now:
- Publish your books - Upload and share your stories
- Set your pricing - You control your book prices  
- Track earnings - Monitor your sales and revenue
- Reach readers - Connect with thousands of book lovers
- Keep 70% revenue - Earn more from your creative work

Ready to start your publishing journey?
Access your dashboard: https://kalenjinbooks.com/dashboard/author

If you have any questions or need assistance, our support team is here to help. Simply reply to this email or contact us through your dashboard.

Welcome to the KaleeReads family!

Best regards,
The KaleeReads Team
Preserving Kalenjin Literature & Culture

---
This email was sent to ${authorEmail}
Contact Support: support@kalenjinbooks.com
Privacy Policy: https://kalenjinbooks.com/privacy
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
    <html lang="en">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Author Application Update - KaleeReads</title>
        <style>
            body { 
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; 
                line-height: 1.6; 
                color: #333333; 
                margin: 0; 
                padding: 0; 
                background-color: #f8f9fa;
            }
            .container { 
                max-width: 600px; 
                margin: 20px auto; 
                background: white; 
                border-radius: 8px; 
                overflow: hidden;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }
            .header { 
                background: #f8f9fa; 
                color: #333; 
                padding: 40px 30px; 
                text-align: center; 
                border-left: 4px solid #dc3545; 
            }
            .header h1 { 
                margin: 0; 
                font-size: 24px; 
                font-weight: 600; 
                color: #495057;
            }
            .content { 
                padding: 40px 30px; 
            }
            .content h2 {
                color: #495057;
                margin-top: 0;
            }
            .reason-box { 
                background: #fff3cd; 
                border: 1px solid #ffeaa7; 
                padding: 20px; 
                border-radius: 6px; 
                margin: 20px 0; 
            }
            .reason-box h3 {
                margin-top: 0;
                color: #856404;
            }
            .button { 
                display: inline-block; 
                background: #E07856; 
                color: white; 
                padding: 14px 28px; 
                text-decoration: none; 
                border-radius: 6px; 
                margin: 20px 0; 
                font-weight: 600;
            }
            .footer { 
                background: #f8f9fa;
                text-align: center; 
                padding: 30px; 
                color: #666; 
                font-size: 14px; 
                border-top: 1px solid #eee;
            }
            .footer a {
                color: #E07856;
                text-decoration: none;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Author Application Update</h1>
                <p style="margin: 10px 0 0 0; opacity: 0.8;">Thank you for your interest in KaleeReads</p>
            </div>
            <div class="content">
                <h2>Dear ${authorName},</h2>
                
                <p>Thank you for your interest in becoming a KaleeReads author and for taking the time to submit your application.</p>
                
                <p>After careful review by our editorial team, we are unable to approve your application at this time. This decision was not made lightly, and we appreciate the effort you put into your submission.</p>
                
                <div class="reason-box">
                    <h3>Feedback from our review:</h3>
                    <p>${reason}</p>
                </div>
                
                <p>We encourage you to address the feedback above and consider reapplying in the future. KaleeReads is committed to supporting quality content that celebrates and preserves Kalenjin culture and literature.</p>
                
                <p>You can submit a new application at any time:</p>
                <div style="text-align: center;">
                    <a href="https://kalenjinbooks.com/dashboard/author/register" class="button">Apply Again</a>
                </div>
                
                <p>If you have questions about this decision or would like clarification on any aspect of the feedback, please don't hesitate to contact our support team. We're here to help you succeed.</p>
                
                <p>Thank you for your understanding and continued interest in KaleeReads.</p>
                
                <p>Best regards,<br>
                <strong>The KaleeReads Editorial Team</strong><br>
                Preserving Kalenjin Literature & Culture</p>
            </div>
            <div class="footer">
                <p><strong>KaleeReads</strong> - Digital Platform for Kalenjin Literature</p>
                <p>This email was sent to ${authorEmail}</p>
                <p><a href="mailto:support@kalenjinbooks.com">Contact Support</a> | <a href="https://kalenjinbooks.com/privacy">Privacy Policy</a></p>
            </div>
        </div>
    </body>
    </html>
    `;
    
    const text = `
Author Application Update - KaleeReads

Dear ${authorName},

Thank you for your interest in becoming a KaleeReads author and for taking the time to submit your application.

After careful review by our editorial team, we are unable to approve your application at this time. This decision was not made lightly, and we appreciate the effort you put into your submission.

Feedback from our review:
${reason}

We encourage you to address the feedback above and consider reapplying in the future. KaleeReads is committed to supporting quality content that celebrates and preserves Kalenjin culture and literature.

You can submit a new application at any time:
https://kalenjinbooks.com/dashboard/author/register

If you have questions about this decision or would like clarification on any aspect of the feedback, please don't hesitate to contact our support team. We're here to help you succeed.

Thank you for your understanding and continued interest in KaleeReads.

Best regards,
The KaleeReads Editorial Team
Preserving Kalenjin Literature & Culture

---
This email was sent to ${authorEmail}
Contact Support: support@kalenjinbooks.com
Privacy Policy: https://kalenjinbooks.com/privacy
    `;
    
    return {
        to: authorEmail,
        subject,
        html,
        text
    };
}