import { useState } from 'react';

function Contact() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [feedback, setFeedback] = useState({ show: false, message: '', type: '' });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.id.replace('contact', '').toLowerCase()]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Create mailto link with form data
        const mailtoLink = `mailto:alam.irshad2511@gmail.com?subject=${encodeURIComponent(formData.subject)}&body=${encodeURIComponent(
            `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`
        )}`;

        window.location.href = mailtoLink;

        setFeedback({
            show: true,
            message: 'Opening your email client...',
            type: 'success'
        });

        // Reset form
        setFormData({ name: '', email: '', subject: '', message: '' });

        setTimeout(() => setFeedback({ show: false, message: '', type: '' }), 3000);
    };

    return (
        <section id="contact" className="section contact-section">
            <div className="container">
                <div className="section-header">
                    <h2>Get In <span className="text-gold">Touch</span></h2>
                    <p>Let's connect and discuss the markets</p>
                </div>

                <div className="contact-grid">
                    {/* Direct Contact Options */}
                    <div className="contact-options">
                        {/* Email */}
                        <div className="contact-card glass">
                            <div className="contact-icon"><i className="fa-solid fa-envelope"></i></div>
                            <h3>Email</h3>
                            <p>alam.irshad2511@gmail.com</p>
                            <a href="mailto:alam.irshad2511@gmail.com" className="btn btn-sm btn-outline">Send Email</a>
                        </div>

                        {/* WhatsApp */}
                        <div className="contact-card glass">
                            <div className="contact-icon"><i className="fa-brands fa-whatsapp"></i></div>
                            <h3>WhatsApp</h3>
                            <p>Irshad Alam</p>
                            <a
                                href="https://wa.me/919508962364?text=Hello,%20I%20want%20to%20discuss%20trading."
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-sm btn-outline"
                            >
                                Chat on WhatsApp
                            </a>
                        </div>

                        {/* LinkedIn */}
                        <div className="contact-card glass">
                            <div className="contact-icon"><i className="fa-brands fa-linkedin-in"></i></div>
                            <h3>LinkedIn</h3>
                            <p>Irshad Alam</p>
                            <a
                                href="https://www.linkedin.com/in/irshad-alam7234"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-sm btn-outline"
                            >
                                Connect on LinkedIn
                            </a>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="contact-form-wrapper glass">
                        <h3>Send a Message</h3>
                        <form className="contact-form" onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Full Name <span className="text-gold">*</span></label>
                                <input
                                    type="text"
                                    id="contactName"
                                    placeholder="Your Name"
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="form-group">
                                <label>Email Address <span className="text-gold">*</span></label>
                                <input
                                    type="email"
                                    id="contactEmail"
                                    placeholder="Your Email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="form-group">
                                <label>Subject <span className="text-gold">*</span></label>
                                <input
                                    type="text"
                                    id="contactSubject"
                                    placeholder="Topic of discussion"
                                    required
                                    value={formData.subject}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="form-group">
                                <label>Message <span className="text-gold">*</span></label>
                                <textarea
                                    id="contactMessage"
                                    placeholder="Your Message (Max 1000 chars)"
                                    rows="5"
                                    maxLength="1000"
                                    required
                                    value={formData.message}
                                    onChange={handleChange}
                                ></textarea>
                            </div>
                            <button type="submit" className="btn btn-primary btn-block">Send Message</button>
                        </form>

                        {feedback.show && (
                            <div className={`form-feedback ${feedback.type}`} style={{ display: 'block', marginTop: '15px' }}>
                                {feedback.message}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Contact;
