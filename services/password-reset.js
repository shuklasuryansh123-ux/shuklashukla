// Password Reset Service
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const fs = require('fs').promises;
const path = require('path');

class PasswordResetService {
    constructor() {
        this.resetTokens = new Map(); // Store reset tokens temporarily
        this.tokenExpiry = 15 * 60 * 1000; // 15 minutes
        this.adminEmail = 'shukla.suryansh123@gmail.com';
        
        // Email configuration
        this.emailConfig = {
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER || 'shukla.suryansh123@gmail.com',
                pass: process.env.EMAIL_PASS || 'your-app-password'
            }
        };
        
        // Persistent credentials storage
        this.credentialsFilePath = path.join(__dirname, '..', 'data', 'admin-credentials.json');

        // Initialize transporter
        this.transporter = nodemailer.createTransport(this.emailConfig);
    }

    async ensureDataDir() {
        await fs.mkdir(path.dirname(this.credentialsFilePath), { recursive: true });
    }

    async readCredentialsFromFile() {
        try {
            const content = await fs.readFile(this.credentialsFilePath, 'utf8');
            const parsed = JSON.parse(content);
            return parsed || null;
        } catch (error) {
            return null;
        }
    }

    async writeCredentialsToFile(credentials) {
        await this.ensureDataDir();
        await fs.writeFile(this.credentialsFilePath, JSON.stringify(credentials, null, 2));
    }

    // Generate reset token
    generateResetToken() {
        return crypto.randomBytes(32).toString('hex');
    }

    // Create reset token for email
    createResetToken(email) {
        if (email !== this.adminEmail) {
            throw new Error('Email address not registered for password reset');
        }

        const token = this.generateResetToken();
        const expiry = Date.now() + this.tokenExpiry;

        this.resetTokens.set(token, {
            email: email,
            expiry: expiry,
            used: false
        });

        return token;
    }

    // Validate reset token
    validateResetToken(token) {
        const tokenData = this.resetTokens.get(token);
        
        if (!tokenData) {
            return { valid: false, message: 'Invalid reset token' };
        }

        if (tokenData.used) {
            return { valid: false, message: 'Reset token already used' };
        }

        if (Date.now() > tokenData.expiry) {
            this.resetTokens.delete(token);
            return { valid: false, message: 'Reset token expired' };
        }

        return { valid: true, email: tokenData.email };
    }

    // Mark token as used
    markTokenAsUsed(token) {
        const tokenData = this.resetTokens.get(token);
        if (tokenData) {
            tokenData.used = true;
            this.resetTokens.set(token, tokenData);
        }
    }

    // Send password reset email
    async sendPasswordResetEmail(email) {
        try {
            const token = this.createResetToken(email);
            const resetUrl = `${process.env.SITE_URL || 'http://localhost:3000'}/admin-reset.html?token=${token}`;

            const mailOptions = {
                from: this.emailConfig.auth.user,
                to: email,
                subject: 'Password Reset Request - Shukla & Shukla Associates Admin Panel',
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; text-align: center;">
                            <h2 style="color: #000; margin-bottom: 20px;">🛠️ Admin Panel Password Reset</h2>
                            <p style="color: #666; margin-bottom: 20px;">
                                You have requested a password reset for the Shukla & Shukla Associates Admin Panel.
                            </p>
                            <div style="background: #fff; padding: 20px; border-radius: 6px; margin: 20px 0;">
                                <p style="margin-bottom: 15px;">
                                    <strong>Click the button below to reset your password:</strong>
                                </p>
                                <a href="${resetUrl}" 
                                   style="display: inline-block; background: #000; color: #fff; padding: 12px 24px; 
                                          text-decoration: none; border-radius: 6px; font-weight: bold;">
                                    🔐 Reset Password
                                </a>
                            </div>
                            <p style="color: #666; font-size: 14px; margin-top: 20px;">
                                <strong>Important:</strong>
                            </p>
                            <ul style="color: #666; font-size: 14px; text-align: left; margin: 10px 0;">
                                <li>This link will expire in 15 minutes</li>
                                <li>If you didn't request this reset, please ignore this email</li>
                                <li>For security, this link can only be used once</li>
                            </ul>
                            <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
                            <p style="color: #999; font-size: 12px;">
                                Shukla & Shukla Associates<br>
                                Professional Legal Services<br>
                                Indore, Madhya Pradesh
                            </p>
                        </div>
                    </div>
                `
            };

            const result = await this.transporter.sendMail(mailOptions);
            console.log('Password reset email sent successfully');
            return { success: true, message: 'Password reset email sent successfully' };
        } catch (error) {
            console.error('Error sending password reset email:', error);
            return { success: false, message: 'Failed to send password reset email' };
        }
    }

    // Reset password with token
    async resetPassword(token, newPassword) {
        try {
            const validation = this.validateResetToken(token);
            
            if (!validation.valid) {
                return { success: false, message: validation.message };
            }

            // Validate new password
            if (!newPassword || newPassword.length < 8) {
                return { success: false, message: 'Password must be at least 8 characters long' };
            }

            // Here you would typically update the password in your database
            const adminCredentials = {
                email: validation.email,
                password: newPassword,
                lastUpdated: new Date().toISOString()
            };

            // Store new credentials (in production, this should be in a secure database)
            await this.writeCredentialsToFile(adminCredentials);

            // Mark token as used
            this.markTokenAsUsed(token);

            // Clean up expired tokens
            this.cleanupExpiredTokens();

            return { success: true, message: 'Password reset successfully' };
        } catch (error) {
            console.error('Error resetting password:', error);
            return { success: false, message: 'Failed to reset password' };
        }
    }

    // Clean up expired tokens
    cleanupExpiredTokens() {
        const now = Date.now();
        for (const [token, data] of this.resetTokens.entries()) {
            if (now > data.expiry) {
                this.resetTokens.delete(token);
            }
        }
    }

    // Get admin credentials
    async getAdminCredentials() {
        try {
            const credentials = await this.readCredentialsFromFile();
            return credentials ? credentials : null;
        } catch (error) {
            console.error('Error getting admin credentials:', error);
            return null;
        }
    }

    // Verify admin credentials
    async verifyCredentials(email, password) {
        const credentials = await this.getAdminCredentials();
        
        if (credentials && credentials.email === email && credentials.password === password) {
            return true;
        }

        // Fallback to default credentials
        return email === 'shukla.suryansh123@gmail.com' && password === '12032003';
    }

    // Update admin credentials
    async updateCredentials(email, newPassword) {
        const credentials = {
            email: email,
            password: newPassword,
            lastUpdated: new Date().toISOString()
        };

        await this.writeCredentialsToFile(credentials);
        return true;
    }
}

module.exports = PasswordResetService;
