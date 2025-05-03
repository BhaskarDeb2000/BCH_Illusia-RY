
import React, { useState } from 'react';

const AboutPage = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Replace with actual backend endpoint or email service
    console.log('Form submitted:', formData);
    setSubmitted(true);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">About Illusia ry</h1>
      <p className="mb-4">
        Illusia ry is a Finnish association supporting game and event creators across the country.
        We offer over 200 categorized storage items for booking, managed through a platform
        collaboratively built with Business College Helsinki students.
      </p>
      <p className="mb-4">
        The system provides user-friendly tools for browsing, booking, and managing inventory, while
        admins handle approvals and system oversight. The project emphasizes data privacy,
        accessibility, and intuitive design for both desktop and mobile users.
      </p>
      <p className="mb-4">
        For inquiries, feedback, or collaboration, please reach out via the form below.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">Contact Us</h2>
      {submitted ? (
        <p className="text-green-600 font-medium">Thank you! We'll get back to you soon.</p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            className="w-full p-2 border rounded"
            type="text"
            name="name"
            placeholder="Your name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            className="w-full p-2 border rounded"
            type="email"
            name="email"
            placeholder="Your email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <textarea
            className="w-full p-2 border rounded"
            name="message"
            placeholder="Your message"
            rows={4}
            value={formData.message}
            onChange={handleChange}
            required
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Send Message
          </button>
        </form>
      )}
    </div>
  );
};

export default AboutPage;
