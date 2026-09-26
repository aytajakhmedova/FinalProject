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
            <h2 className="newsletter-title">Kampaniyalardan xəbərdar olun</h2>
            <p className="newsletter-description">
              Eksklüziv otel endirimləri, last-minute turlar və səyahət tövsiyələri e-poçtunuza gəlsin.
            </p>
          </div>

          <form className="newsletter-form" onSubmit={handleSubmit}>
            <div className="form-wrapper">
              <input
                type="email"
                placeholder="E-poçt ünvanınız"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="newsletter-input"
                required
              />
              <button type="submit" className="newsletter-button">
                {submitted ? (
                  <>
                    <FaCheckCircle />
                    <span>Abunə oldunuz!</span>
                  </>
                ) : (
                  <>
                    <FaPaperPlane />
                    <span>Abunə ol</span>
                  </>
                )}
              </button>
            </div>
            
            {submitted && (
              <p className="success-message">
                Təşəkkürlər! Təsdiq üçün e-poçtunuzu yoxlayın.
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
