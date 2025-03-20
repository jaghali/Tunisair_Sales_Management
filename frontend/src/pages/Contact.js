import React, { useState } from 'react';
import { motion } from 'framer-motion'; // Make sure to import motion from framer-motion
import "../App.css";

function Contact() {
  // State to manage form input values
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  // State to manage form submission status
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulating a form submission process
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate delay for form submission
      setFormSubmitted(true);
      setIsSubmitting(false);
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      setIsSubmitting(false);
    }
  };

  // Define styles as constants for consistency with previous styles
  const containerStyle = {
    padding: "10px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  };

  const formTitleStyle = {
    fontSize: '24px',
    fontWeight: '600',
    color: '#c80505',
    marginBottom: '20px',
  };

  const formGroupStyle = {
    marginBottom: '16px',
  };

  const labelStyle = {
    display: 'block',
    fontSize: '14px',
    color: 'black',
    marginBottom: '8px',
  };

  const inputStyle = {
    color: 'white',
    paddingLeft: '16px',
    paddingRight: '16px',
    paddingTop: '8px',
    paddingBottom: '8px',
    borderRadius: '8px',
    fontSize: '14px',
    outline: 'none',
    width: '100%',
  };

  const textareaStyle = {
    color: 'white',
    paddingLeft: '16px',
    paddingRight: '16px',
    paddingTop: '8px',
    paddingBottom: '8px',
    borderRadius: '8px',
    fontSize: '14px',
    outline: 'none',
    width: '100%',
    resize: 'vertical',
  };

  const buttonStyle = {
    backgroundColor: '#c80505',
    color: 'white',
    padding: '10px 20px',
    borderRadius: '8px',
    fontSize: '16px',
    border: 'none',
    cursor: 'pointer',
    width: '100%',
    marginTop: '20px',
  };

  const formSubmittedMessageStyle = {
    textAlign: 'center',
    fontSize: '18px',
    fontWeight: '600',
    color: '#c80505',
  };

  return (
    <motion.div
      style={containerStyle}
      initial={{ opacity: 0, y: 20 }}  // Initial animation state
      animate={{ opacity: 1, y: 0 }}  // End animation state
      transition={{ duration: 1 }}    // Set animation duration
    >
      <h1 style={formTitleStyle}>Contact Admin</h1>

      {formSubmitted ? (
        <div style={formSubmittedMessageStyle}>
          <h2>Thank you for contacting us!</h2>
          <p>Your message has been successfully sent. We will get back to you soon.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="contact-form">
          <div style={formGroupStyle}>
            <label htmlFor="name" style={labelStyle}>Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter your name"
              style={inputStyle}
            />
          </div>

          <div style={formGroupStyle}>
            <label htmlFor="email" style={labelStyle}>Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
              style={inputStyle}
            />
          </div>

          <div style={formGroupStyle}>
            <label htmlFor="subject" style={labelStyle}>Subject:</label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              required
              placeholder="Enter the subject"
              style={inputStyle}
            />
          </div>

          <div style={formGroupStyle}>
            <label htmlFor="message" style={labelStyle}>Message:</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows="4"
              required
              placeholder="Write your message"
              style={textareaStyle}
            ></textarea>
          </div>

          <div style={formGroupStyle}>
            <button type="submit" disabled={isSubmitting} style={buttonStyle}>
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </button>
          </div>
        </form>
      )}
    </motion.div>
  );
}

export default Contact;
