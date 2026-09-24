import React, { useState } from 'react';
import { FaPaperPlane, FaCheckCircle } from 'react-icons/fa';
import './Newsletter.css';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      setTimeout(() => {
        setEmail('');
        setSubmitted(false);
      }, 3000);
    }
  };

  return (
    <section className="newsletter-section">
      <div className="newsletter-container">
        <div className="newsletter-content">
          <div className="newsletter-text">
            <h2 className="newsletter-title">Subscribe to Our Newsletter</h2>
            <p className="newsletter-description">
              Get exclusive deals, special offers, and insider tips delivered straight to your inbox.
            </p>
          </div>

          <form className="newsletter-form" onSubmit={handleSubmit}>
            <div className="form-wrapper">
              <input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="newsletter-input"
                required
              />
              <button type="submit" className="newsletter-button">
                {submitted ? (
                  <>
                    <FaCheckCircle />
                    <span>Subscribed!</span>
                  </>
                ) : (
                  <>
                    <FaPaperPlane />
                    <span>Subscribe</span>
                  </>
                )}
              </button>
            </div>
            
            {submitted && (
              <p className="success-message">
                Thank you for subscribing! Check your email for confirmation.
              </p>
            )}
          </form>
        </div>

        <div className="newsletter-decoration">
          <div className="floating-circle circle-1"></div>
          <div className="floating-circle circle-2"></div>
          <div className="floating-circle circle-3"></div>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
