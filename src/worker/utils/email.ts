/// <reference types="@cloudflare/workers-types" />

import { Env } from '../types/env';

export interface EmailTemplate {
    to: string;
    subject: string;
    html: string;
    text: string;
}

/**
 * Send email using Cloudflare Email Workers
 */
export async function sendEmail(template: EmailTemplate, env: Env): Promise<boolean> {
    try {
        // Check if Email binding is available
        if (!env.EMAIL) {
            console.log('📧 Email service not configured. Email would be sent:', {
                to: template.to,
                subject: template.subject,
                preview: template.text.substring(0, 100) + '...'
            });
            return true; // Return true for development
        }

        // Create email message using Cloudflare Email Workers API
        const emailContent = `From: KaleeReads Team <${env.EMAIL_FROM || 'noreply@kalenjinbooks.com'}>
To: ${template.to}
Subject: ${template.subject}
Content-Type: text/html; charset=utf-8
X-Mailer: KaleeReads Platform
List-Unsubscribe: <mailto:unsubscribe@kalenjinbooks.com>

${template.html}`;

        // Send the email using the EMAIL binding
        await env.EMAIL.send({
            from: env.EMAIL_FROM || 'noreply@kalenjinbooks.com',
            to: template.to,
            subject: template.subject,
            html: template.html,
        });

        console.log('✅ Email sent via Cloudflare Email Workers:', {
            to: template.to,
            subject: template.subject,
        });
        
        return true;
    } catch (error) {
        console.error('❌ Email sending error:', error);
        console.error('Error details:', JSON.stringify(error, null, 2));
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

/**
 * Generate hard copy request notification email for author
 */
export function createHardCopyRequestEmail(
    authorName: string,
    authorEmail: string,
    bookTitle: string,
    requesterName: string,
    requesterEmail: string,
    requesterPhone: string,
    quantity: number,
    city: string,
    country: string
): EmailTemplate {
    const subject = `New Hard Copy Request for "${bookTitle}"`;
    
    const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Hard Copy Request - KaleeReads</title>
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
            .info-box {
                background: #f8f9fa;
                padding: 20px;
                border-radius: 6px;
                margin: 20px 0;
                border-left: 4px solid #E07856;
            }
            .info-box h3 {
                margin-top: 0;
                color: #495057;
            }
            .info-row {
                display: flex;
                padding: 8px 0;
                border-bottom: 1px solid #e9ecef;
            }
            .info-row:last-child {
                border-bottom: none;
            }
            .info-label {
                font-weight: 600;
                width: 140px;
                color: #495057;
            }
            .info-value {
                flex: 1;
                color: #212529;
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
                <h1>📦 New Hard Copy Request</h1>
                <p style="margin: 10px 0 0 0; opacity: 0.9;">Someone wants a physical copy of your book!</p>
            </div>
            <div class="content">
                <h2>Dear ${authorName},</h2>
                
                <p>Great news! A reader has requested a hard copy of your book <strong>"${bookTitle}"</strong>.</p>
                
                <div class="info-box">
                    <h3>Request Details:</h3>
                    <div class="info-row">
                        <div class="info-label">Book:</div>
                        <div class="info-value">${bookTitle}</div>
                    </div>
                    <div class="info-row">
                        <div class="info-label">Quantity:</div>
                        <div class="info-value">${quantity} ${quantity === 1 ? 'copy' : 'copies'}</div>
                    </div>
                    <div class="info-row">
                        <div class="info-label">Location:</div>
                        <div class="info-value">${city}, ${country}</div>
                    </div>
                </div>
                
                <div class="info-box">
                    <h3>Requester Information:</h3>
                    <div class="info-row">
                        <div class="info-label">Name:</div>
                        <div class="info-value">${requesterName}</div>
                    </div>
                    <div class="info-row">
                        <div class="info-label">Email:</div>
                        <div class="info-value"><a href="mailto:${requesterEmail}">${requesterEmail}</a></div>
                    </div>
                    <div class="info-row">
                        <div class="info-label">Phone:</div>
                        <div class="info-value"><a href="tel:${requesterPhone}">${requesterPhone}</a></div>
                    </div>
                </div>
                
                <p><strong>Next Steps:</strong></p>
                <ol>
                    <li>Review the request details in your dashboard</li>
                    <li>Respond with your pricing and delivery estimate</li>
                    <li>Coordinate directly with the requester for payment and delivery</li>
                </ol>
                
                <div style="text-align: center;">
                    <a href="https://kalenjinbooks.com/dashboard/author/requests" class="button">View Request in Dashboard</a>
                </div>
                
                <p>Please respond to this request within 2-3 business days to maintain a good relationship with your readers.</p>
                
                <p>Best regards,<br>
                <strong>The KaleeReads Team</strong></p>
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
New Hard Copy Request - KaleeReads

Dear ${authorName},

Great news! A reader has requested a hard copy of your book "${bookTitle}".

Request Details:
- Book: ${bookTitle}
- Quantity: ${quantity} ${quantity === 1 ? 'copy' : 'copies'}
- Location: ${city}, ${country}

Requester Information:
- Name: ${requesterName}
- Email: ${requesterEmail}
- Phone: ${requesterPhone}

Next Steps:
1. Review the request details in your dashboard
2. Respond with your pricing and delivery estimate
3. Coordinate directly with the requester for payment and delivery

View Request in Dashboard: https://kalenjinbooks.com/dashboard/author/requests

Please respond to this request within 2-3 business days to maintain a good relationship with your readers.

Best regards,
The KaleeReads Team

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
 * Generate hard copy request confirmation email for requester
 */
export function createHardCopyConfirmationEmail(
    requesterName: string,
    requesterEmail: string,
    bookTitle: string,
    authorName: string
): EmailTemplate {
    const subject = `Hard Copy Request Received for "${bookTitle}"`;
    
    const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Request Received - KaleeReads</title>
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
                background: #28a745; 
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
                color: #28a745;
                margin-top: 0;
            }
            .info-box {
                background: #d4edda;
                padding: 20px;
                border-radius: 6px;
                margin: 20px 0;
                border-left: 4px solid #28a745;
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
                <h1>✅ Request Received!</h1>
                <p style="margin: 10px 0 0 0; opacity: 0.9;">We've notified the author</p>
            </div>
            <div class="content">
                <h2>Dear ${requesterName},</h2>
                
                <p>Thank you for your interest in <strong>"${bookTitle}"</strong> by ${authorName}!</p>
                
                <p>We've received your hard copy request and have notified the author. They will review your request and get back to you within 2-3 business days with:</p>
                
                <ul>
                    <li>Pricing information</li>
                    <li>Estimated delivery time</li>
                    <li>Payment and delivery instructions</li>
                </ul>
                
                <div class="info-box">
                    <p style="margin: 0;"><strong>What happens next?</strong></p>
                    <p style="margin: 10px 0 0 0;">The author will contact you directly at <strong>${requesterEmail}</strong> to finalize the details of your order.</p>
                </div>
                
                <p>If you have any questions in the meantime, feel free to reach out to our support team.</p>
                
                <p>Thank you for supporting Kalenjin literature!</p>
                
                <p>Best regards,<br>
                <strong>The KaleeReads Team</strong></p>
            </div>
            <div class="footer">
                <p><strong>KaleeReads</strong> - Digital Platform for Kalenjin Literature</p>
                <p>This email was sent to ${requesterEmail}</p>
                <p><a href="mailto:support@kalenjinbooks.com">Contact Support</a> | <a href="https://kalenjinbooks.com">Visit Website</a></p>
            </div>
        </div>
    </body>
    </html>
    `;
    
    const text = `
Request Received! - KaleeReads

Dear ${requesterName},

Thank you for your interest in "${bookTitle}" by ${authorName}!

We've received your hard copy request and have notified the author. They will review your request and get back to you within 2-3 business days with:

- Pricing information
- Estimated delivery time
- Payment and delivery instructions

What happens next?
The author will contact you directly at ${requesterEmail} to finalize the details of your order.

If you have any questions in the meantime, feel free to reach out to our support team.

Thank you for supporting Kalenjin literature!

Best regards,
The KaleeReads Team

---
This email was sent to ${requesterEmail}
Contact Support: support@kalenjinbooks.com
Visit Website: https://kalenjinbooks.com
    `;
    
    return {
        to: requesterEmail,
        subject,
        html,
        text
    };
}
