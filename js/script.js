document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('booking-form');
    const testimonials = document.querySelectorAll('.testimonial');
    let currentTestimonial = 0;

    function showTestimonial(index) {
        testimonials.forEach((testimonial, i) => {
            testimonial.classList.remove('active');
            if (i === index) {
                testimonial.classList.add('active');
            }
        });
    }

    function nextTestimonial() {
        currentTestimonial = (currentTestimonial + 1) % testimonials.length;
        showTestimonial(currentTestimonial);
    }

    setInterval(nextTestimonial, 5000);

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const car = document.getElementById('car').value;
        const dates = document.getElementById('dates').value;
        const notes = document.getElementById('notes').value;

        fetch('/api/bookings', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email, car, dates, notes })
        })
        .then(response => response.json())
        .then(data => {
            alert(data.message); // Show confirmation message to the user
        })
        .catch(error => {
            console.error('Error:', error);
            alert('There was an error submitting your booking.');
        });
    });
});
document.addEventListener('DOMContentLoaded', () => {
    const testimonials = document.querySelectorAll('.testimonial');
    let currentTestimonial = 0;

    function showTestimonial(index) {
        testimonials.forEach((testimonial, i) => {
            testimonial.style.display = 'none';
            if (i === index) {
                testimonial.style.display = 'flex';
            }
        });
    }

    function nextTestimonial() {
        currentTestimonial = (currentTestimonial + 1) % testimonials.length;
        showTestimonial(currentTestimonial);
    }

    setInterval(nextTestimonial, 5000); // Change every 5 seconds
    showTestimonial(currentTestimonial); // Show the first testimonial initially
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
// script.js
document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });
});

