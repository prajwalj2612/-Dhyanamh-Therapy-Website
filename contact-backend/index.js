const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
require('dotenv').config();
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');

const app = express();
const helmet = require('helmet');
app.use(helmet());


// CORS configuration
app.use(cors({
    origin: ['http://localhost:8000', 'http://127.0.0.1:8000', 'http://localhost:3000'],
    credentials: true
}));
const cors = require("cors");

const allowedOrigins = [
  "http://localhost:3000", // dev
  "https://your-frontend-domain.com" // prod
];

app.use(cors({
  origin: allowedOrigins,
  methods: ["GET", "POST"],
  credentials: true
}));

app.use(cors(corsOptions));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configure your email transporter (using Gmail SMTP)
const transporter = nodemailer.createTransporter({
    service: 'gmail',
    auth: {
        user: 'omdhyannamtherapy@gmail.com',
        pass: 'qwtbzxgrvqkvhsds'  // Make sure this is your correct app password
    }
});
const emailLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 5, // limit each IP to 5 requests per minute
    message: { message: 'Too many requests, please try again later.' }
});


// Test route
app.get('/api/test', (req, res) => {
    res.json({ message: 'Server is working!' });
});

// Contact form endpoint
app.post('/api/contact', async (req, res) => {
    try {
        const { name, email, phone, service, message } = req.body;
        
        console.log('Contact form received:', req.body);

        // Validation
        if (!name || !email) {
            return res.status(400).json({ 
                success: false, 
                message: 'Name and email are required fields.' 
            });
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ 
                success: false, 
                message: 'Please provide a valid email address.' 
            });
        }

        // Service type mapping
        const serviceMap = {
            'individual': 'Individual Therapy',
            'couples': 'Couples Counseling',
            'family': 'Family Therapy',
            'trauma': 'Trauma Recovery',
            'anxiety': 'Anxiety & Depression',
            'online': 'Online Therapy'
        };

        const serviceName = serviceMap[service] || 'Not specified';

        // Email to therapist/admin
        const adminMailOptions = {
            from: `"Dhyanam Therapy Booking" <omdhyannamtherapy@gmail.com>`,
            to: 'omdhyannamtherapy@gmail.com',
            subject: `🎯 New Appointment Request from ${name}`,
            html: `
                <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; background: #f8f9fa; padding: 20px;">
                    <div style="background: linear-gradient(135deg, #6b46c1 0%, #a855f7 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
                        <h1 style="margin: 0; font-size: 28px;">New Appointment Request</h1>
                        <p style="margin: 10px 0 0 0; opacity: 0.9;">Dhyanam Therapy</p>
                    </div>
                    
                    <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                        <div style="margin-bottom: 25px;">
                            <h2 style="color: #6b46c1; margin-bottom: 20px; font-size: 22px;">Client Information</h2>
                            
                            <div style="margin-bottom: 15px; padding: 15px; background: #f8f9fa; border-left: 4px solid #6b46c1; border-radius: 5px;">
                                <strong style="color: #333;">👤 Name:</strong><br>
                                <span style="font-size: 18px; color: #555;">${name}</span>
                            </div>
                            
                            <div style="margin-bottom: 15px; padding: 15px; background: #f8f9fa; border-left: 4px solid #a855f7; border-radius: 5px;">
                                <strong style="color: #333;">📧 Email:</strong><br>
                                <span style="color: #555;"><a href="mailto:${email}" style="color: #6b46c1; text-decoration: none;">${email}</a></span>
                            </div>
                            
                            ${phone ? `
                            <div style="margin-bottom: 15px; padding: 15px; background: #f8f9fa; border-left: 4px solid #fbbf24; border-radius: 5px;">
                                <strong style="color: #333;">📞 Phone:</strong><br>
                                <span style="color: #555;"><a href="tel:${phone}" style="color: #6b46c1; text-decoration: none;">${phone}</a></span>
                            </div>
                            ` : ''}
                            
                            <div style="margin-bottom: 15px; padding: 15px; background: #f8f9fa; border-left: 4px solid #10b981; border-radius: 5px;">
                                <strong style="color: #333;">🎯 Preferred Service:</strong><br>
                                <span style="color: #555; font-weight: 500;">${serviceName}</span>
                            </div>
                            
                            ${message ? `
                            <div style="margin-bottom: 15px; padding: 15px; background: #f8f9fa; border-left: 4px solid #ef4444; border-radius: 5px;">
                                <strong style="color: #333;">💬 Message:</strong><br>
                                <span style="color: #555; line-height: 1.6;">${message}</span>
                            </div>
                            ` : ''}
                        </div>
                        
                        <div style="background: #e0e7ff; padding: 20px; border-radius: 8px; border: 1px solid #c7d2fe;">
                            <h3 style="color: #6b46c1; margin-bottom: 10px;">📅 Next Steps:</h3>
                            <ul style="color: #555; margin: 0; padding-left: 20px;">
                                <li>Contact the client within 24 hours</li>
                                <li>Schedule the appointment based on availability</li>
                                <li>Send confirmation details to the client</li>
                            </ul>
                        </div>
                        
                        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
                            <p style="color: #888; font-size: 12px;">
                                This email was sent from the Dhyanam Therapy website contact form.<br>
                                Time: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
                            </p>
                        </div>
                    </div>
                </div>
            `
        };

        // Confirmation email to client
        const clientMailOptions = {
            from: `"Dhyanam Therapy" <omdhyannamtherapy@gmail.com>`,
            to: email,
            subject: `✅ Appointment Request Received - Dhyanam Therapy`,
            html: `
                <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; background: #f8f9fa; padding: 20px;">
                    <div style="background: linear-gradient(135deg, #6b46c1 0%, #a855f7 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
                        <h1 style="margin: 0; font-size: 28px;">Thank You, ${name}!</h1>
                        <p style="margin: 10px 0 0 0; opacity: 0.9;">Your appointment request has been received</p>
                    </div>
                    
                    <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                        <div style="text-align: center; margin-bottom: 25px;">
                            <div style="background: #10b981; color: white; width: 60px; height: 60px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-size: 24px; margin-bottom: 15px;">✓</div>
                            <h2 style="color: #6b46c1; margin: 0;">Request Confirmed!</h2>
                        </div>
                        
                        <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; border-left: 4px solid #3b82f6; margin-bottom: 25px;">
                            <h3 style="color: #1e40af; margin-top: 0;">📋 Your Request Details:</h3>
                            <p style="margin: 5px 0; color: #555;"><strong>Service:</strong> ${serviceName}</p>
                            <p style="margin: 5px 0; color: #555;"><strong>Email:</strong> ${email}</p>
                            ${phone ? `<p style="margin: 5px 0; color: #555;"><strong>Phone:</strong> ${phone}</p>` : ''}
                            <p style="margin: 5px 0; color: #555;"><strong>Submitted:</strong> ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</p>
                        </div>
                        
                        <div style="background: #fef3c7; padding: 20px; border-radius: 8px; border-left: 4px solid #fbbf24; margin-bottom: 25px;">
                            <h3 style="color: #92400e; margin-top: 0;">⏰ What happens next?</h3>
                            <ul style="color: #555; margin: 0; padding-left: 20px; line-height: 1.6;">
                                <li>Our team will review your request within <strong>24 hours</strong></li>
                                <li>We'll contact you to schedule your appointment</li>
                                <li>You'll receive a confirmation with session details</li>
                                <li>Any questions will be addressed before your session</li>
                            </ul>
                        </div>
                        
                        <div style="background: #ecfdf5; padding: 20px; border-radius: 8px; border-left: 4px solid #10b981;">
                            <h3 style="color: #065f46; margin-top: 0;">📞 Need immediate assistance?</h3>
                            <p style="color: #555; margin-bottom: 10px;">Feel free to contact us directly:</p>
                            <p style="margin: 5px 0; color: #555;">📱 <a href="tel:+919022101648" style="color: #6b46c1; text-decoration: none;">+91 90221 01648</a></p>
                            <p style="margin: 5px 0; color: #555;">📱 <a href="tel:+919136632156" style="color: #6b46c1; text-decoration: none;">+91 91366 32156</a></p>
                            <p style="margin: 5px 0; color: #555;">📧 <a href="mailto:omdhyannamtherapy@gmail.com" style="color: #6b46c1; text-decoration: none;">omdhyannamtherapy@gmail.com</a></p>
                            <p style="margin: 5px 0; color: #555;">📍 Green Lawns, Belavli Badlapur West, Thane - 421503</p>
                        </div>
                        
                        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
                            <p style="color: #6b46c1; font-weight: 500; margin-bottom: 10px;">🌟 Your journey to wellness starts here</p>
                            <div style="margin-top: 20px;">
                                <a href="https://wa.me/9022101648" style="display: inline-block; background: #25d366; color: white; padding: 10px 20px; text-decoration: none; border-radius: 25px; margin: 0 5px;">WhatsApp</a>
                                <a href="https://www.instagram.com/dhyanamh_therapy" style="display: inline-block; background: #e4405f; color: white; padding: 10px 20px; text-decoration: none; border-radius: 25px; margin: 0 5px;">Instagram</a>
                            </div>
                        </div>
                    </div>
                </div>
            `
        };

        // Send both emails
        await transporter.sendMail(adminMailOptions);
        await transporter.sendMail(clientMailOptions);

        console.log('Emails sent successfully');
        
        res.json({ 
            success: true, 
            message: `Thank you ${name}! Your appointment request has been received. We'll contact you within 24 hours to schedule your session.` 
        });

    } catch (error) {
        console.error('Email sending error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Sorry, there was an error processing your request. Please try again or contact us directly at +91 90221 01648.' 
        });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        success: false, 
        message: 'Something went wrong on our server. Please try again later.' 
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📧 Email service configured for: omdhyannamtherapy@gmail.com`);
});