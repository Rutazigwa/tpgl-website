const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config(); // Load environment variables

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Create a transporter object using environment variables
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// API endpoint to handle bookings
app.post('/api/bookings', (req, res) => {
    const { name, email, car, dates, notes } = req.body;

    // Create email content
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Booking Confirmation - TPGL',
        text: `Dear ${name},\n\nThank you for booking with TPGL. Here are the details of your booking:\n\nCar Model: ${car}\nRental Dates: ${dates}\nAdditional Notes: ${notes}\n\nWe will get back to you shortly.\n\nBest regards,\nTPGL Team`,
        html: `<p>Dear ${name},</p>
               <p>Thank you for booking with TPGL. Here are the details of your booking:</p>
               <ul>
                 <li><strong>Car Model:</strong> ${car}</li>
                 <li><strong>Rental Dates:</strong> ${dates}</li>
                 <li><strong>Additional Notes:</strong> ${notes}</li>
               </ul>
               <p>We will get back to you shortly.</p>
               <p>Best regards,<br>TPGL Team</p>`
    };

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
            return res.status(500).json({ message: 'Error sending email' });
        }
        console.log('Email sent:', info.response);
        res.status(200).json({ message: 'Booking received and confirmation email sent' });
    });
});

// Serve static files and routes
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views/index.html'));
});

app.get('/about.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'views/about.html'));
});

app.get('/services.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'views/services.html'));
});

app.get('/contact.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'views/contact.html'));
});

app.get('/booking.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'views/booking.html'));
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the "views" directory
app.use(express.static('views'));

// Nodemailer configuration
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD
    }
});

// Booking route
app.post('/api/bookings', (req, res) => {
    const { name, email, category, startDate, endDate, notes } = req.body;

    // Send confirmation email to the client
    const mailOptionsToClient = {
        from: process.env.EMAIL,
        to: email,
        subject: 'Booking Confirmation - TPGL',
        text: `Dear ${name},\n\nThank you for booking with TPGL. Here are your booking details:\n\nCategory: ${category}\nStart Date: ${startDate}\nEnd Date: ${endDate}\nNotes: ${notes}\n\nWe will contact you shortly to confirm your booking.\n\nBest regards,\nTPGL Team`
    };

    transporter.sendMail(mailOptionsToClient, (error, info) => {
        if (error) {
            console.error('Error sending email to client:', error);
            return res.status(500).send('Error sending email confirmation to client');
        }

        // Send notification email to the admin
        const mailOptionsToAdmin = {
            from: process.env.EMAIL,
            to: process.env.ADMIN_EMAIL,
            subject: 'New Booking - TPGL',
            text: `A new booking has been made:\n\nName: ${name}\nEmail: ${email}\nCategory: ${category}\nStart Date: ${startDate}\nEnd Date: ${endDate}\nNotes: ${notes}\n\nPlease contact the client to confirm the booking.`
        };

        transporter.sendMail(mailOptionsToAdmin, (error, info) => {
            if (error) {
                console.error('Error sending email to admin:', error);
                return res.status(500).send('Error sending email notification to admin');
            }

            res.send({ message: 'Booking confirmed and emails sent' });
        });
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
