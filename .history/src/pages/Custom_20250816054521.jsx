import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Custom() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    projectType: '',
    budget: '',
    timeline: '',
    description: '',
    inspiration: '',
    size: '',
    colors: '',
    additionalNotes: ''
  });

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success'); // 'success' or 'error'
  const [isSubmitting, setIsSubmitting] = useState(false);

  const LAMBDA_URL = 'https://nbwke3grerscqtfchrbl6txcti0rgeip.lambda-url.us-west-2.on.aws';

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(`${LAMBDA_URL}/custom-orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setToastMessage(`Custom order request submitted successfully! Order ID: ${data.orderId}. We'll be in touch within 24 hours.`);
        setToastType('success');
        setShowToast(true);
        
        // Reset form
        setFormData({
          name: '',
          email: '',
          phone: '',
          projectType: '',
          budget: '',
          timeline: '',
          description: '',
          inspiration: '',
          size: '',
          colors: '',
          additionalNotes: ''
        });
      } else {
        setToastMessage(data.error || 'Something went wrong. Please try again or contact us directly.');
        setToastType('error');
        setShowToast(true);
      }
    } catch (error) {
      console.error('Custom order submission error:', error);
      setToastMessage('Network error. Please check your connection and try again.');
      setToastType('error');
      setShowToast(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="custom-container">
      <div className="container-modern">
        {/* Hero Section */}
        <div className="custom-hero">
          <div className="custom-hero-content">
            <h1 className="custom-hero-title">
              Custom Orders
            </h1>
            <p className="custom-hero-subtitle">
              Bring your darkest visions to life. We collaborate with you to create unique, personalized pieces that reflect your individual style and embrace your inner darkness.
            </p>
          </div>
          
          {/* Decorative Element */}
          <div className="custom-hero-decoration">
            <div className="custom-icon">✨</div>
          </div>
        </div>

        {/* Process Section */}
        <section className="custom-section">
          <div className="text-center" style={{ marginBottom: 'var(--space-16)' }}>
            <h2>Our Custom Process</h2>
            <p style={{ 
              fontSize: 'var(--text-lg)', 
              color: 'var(--color-text-secondary)',
              maxWidth: '600px',
              margin: '0 auto',
            }}>
              From initial concept to final creation, we guide you through every step
            </p>
          </div>

          <div className="process-grid">
            <div className="process-step">
              <div className="process-number">01</div>
              <div className="process-content">
                <h3>Consultation</h3>
                <p>We discuss your vision, requirements, and preferences to understand exactly what you're looking for.</p>
              </div>
            </div>

            <div className="process-step">
              <div className="process-number">02</div>
              <div className="process-content">
                <h3>Design & Quote</h3>
                <p>We create initial designs and provide a detailed quote including materials, timeline, and pricing.</p>
              </div>
            </div>

            <div className="process-step">
              <div className="process-number">03</div>
              <div className="process-content">
                <h3>Creation</h3>
                <p>Once approved, we begin crafting your piece with regular updates throughout the process.</p>
              </div>
            </div>

            <div className="process-step">
              <div className="process-number">04</div>
              <div className="process-content">
                <h3>Delivery</h3>
                <p>Your finished piece is carefully packaged and shipped to you with tracking and insurance.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="custom-section">
          <div className="text-center" style={{ marginBottom: 'var(--space-16)' }}>
            <h2>What We Can Create</h2>
            <p style={{ 
              fontSize: 'var(--text-lg)', 
              color: 'var(--color-text-secondary)',
              maxWidth: '600px',
              margin: '0 auto',
            }}>
              Our custom services cover a wide range of dark art and apparel
            </p>
          </div>

          <div className="services-showcase">
            <div className="showcase-grid">
              <div className="showcase-item">
                <div className="showcase-icon">👕</div>
                <h4>Custom Apparel</h4>
                <ul>
                  <li>Graphic t-shirts & hoodies</li>
                  <li>Hand-painted garments</li>
                  <li>Embroidered pieces</li>
                  <li>Distressed & altered clothing</li>
                </ul>
              </div>

              <div className="showcase-item">
                <div className="showcase-icon">🎨</div>
                <h4>Original Artwork</h4>
                <ul>
                  <li>Digital illustrations</li>
                  <li>Traditional paintings</li>
                  <li>Custom portraits</li>
                  <li>Logo & brand design</li>
                </ul>
              </div>

              <div className="showcase-item">
                <div className="showcase-icon">🖼️</div>
                <h4>Prints & Posters</h4>
                <ul>
                  <li>Limited edition prints</li>
                  <li>Custom sizing options</li>
                  <li>Premium paper choices</li>
                  <li>Framing services</li>
                </ul>
              </div>

              <div className="showcase-item">
                <div className="showcase-icon">🎭</div>
                <h4>Special Projects</h4>
                <ul>
                  <li>Event merchandise</li>
                  <li>Band artwork</li>
                  <li>Business branding</li>
                  <li>Unique commissions</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Order Form Section */}
        <section className="custom-section">
          <div className="custom-form-section">
            <div className="form-header">
              <h2>Start Your Custom Order</h2>
              <p style={{ 
                fontSize: 'var(--text-lg)', 
                color: 'var(--color-text-secondary)',
                marginBottom: 'var(--space-8)',
              }}>
                Fill out the form below and we'll get back to you within 24 hours to discuss your project
              </p>
            </div>

            <div className="custom-form-container">
              <form onSubmit={handleSubmit} className="custom-form">
                {/* Contact Information */}
                <div className="form-section">
                  <h3>Contact Information</h3>
                  <div className="form-grid">
                    <div className="form-group">
                      <label className="form-label">Full Name *</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="form-control"
                        required
                        disabled={isSubmitting}
                        placeholder="Your name"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Email Address *</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="form-control"
                        required
                        disabled={isSubmitting}
                        placeholder="your@email.com"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Phone Number</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="form-control"
                        disabled={isSubmitting}
                        placeholder="(555) 123-4567"
                      />
                    </div>
                  </div>
                </div>

                {/* Project Details */}
                <div className="form-section">
                  <h3>Project Details</h3>
                  <div className="form-grid">
                    <div className="form-group">
                      <label className="form-label">Project Type *</label>
                      <select
                        name="projectType"
                        value={formData.projectType}
                        onChange={handleInputChange}
                        className="form-control form-select"
                        required
                        disabled={isSubmitting}
                      >
                        <option value="">Select project type</option>
                        <option value="apparel">Custom Apparel</option>
                        <option value="artwork">Original Artwork</option>
                        <option value="print">Prints & Posters</option>
                        <option value="logo">Logo/Branding</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Budget Range</label>
                      <select
                        name="budget"
                        value={formData.budget}
                        onChange={handleInputChange}
                        className="form-control form-select"
                        disabled={isSubmitting}
                      >
                        <option value="">Select budget range</option>
                        <option value="under-100">Under $100</option>
                        <option value="100-250">$100 - $250</option>
                        <option value="250-500">$250 - $500</option>
                        <option value="500-1000">$500 - $1,000</option>
                        <option value="over-1000">Over $1,000</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Timeline</label>
                      <select
                        name="timeline"
                        value={formData.timeline}
                        onChange={handleInputChange}
                        className="form-control form-select"
                        disabled={isSubmitting}
                      >
                        <option value="">When do you need this?</option>
                        <option value="flexible">I'm flexible</option>
                        <option value="1-2-weeks">1-2 weeks</option>
                        <option value="3-4-weeks">3-4 weeks</option>
                        <option value="1-2-months">1-2 months</option>
                        <option value="3-months">3+ months</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Project Description */}
                <div className="form-section">
                  <h3>Project Vision</h3>
                  <div className="form-group">
                    <label className="form-label">Project Description *</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      className="form-control"
                      rows="4"
                      required
                      disabled={isSubmitting}
                      placeholder="Describe your vision in detail. What do you want created? What style or mood are you going for?"
                    ></textarea>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Inspiration & References</label>
                    <textarea
                      name="inspiration"
                      value={formData.inspiration}
                      onChange={handleInputChange}
                      className="form-control"
                      rows="3"
                      disabled={isSubmitting}
                      placeholder="Share any inspiration, reference images, or specific elements you'd like included. Feel free to include links to Pinterest boards, images, or other references."
                    ></textarea>
                  </div>

                  <div className="form-grid">
                    <div className="form-group">
                      <label className="form-label">Size/Dimensions</label>
                      <input
                        type="text"
                        name="size"
                        value={formData.size}
                        onChange={handleInputChange}
                        className="form-control"
                        disabled={isSubmitting}
                        placeholder="e.g., Medium t-shirt, 11x14 print, etc."
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Color Preferences</label>
                      <input
                        type="text"
                        name="colors"
                        value={formData.colors}
                        onChange={handleInputChange}
                        className="form-control"
                        disabled={isSubmitting}
                        placeholder="e.g., Black and red, monochrome, vibrant colors"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Additional Notes</label>
                    <textarea
                      name="additionalNotes"
                      value={formData.additionalNotes}
                      onChange={handleInputChange}
                      className="form-control"
                      rows="3"
                      disabled={isSubmitting}
                      placeholder="Anything else you'd like us to know about your project?"
                    ></textarea>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="form-submit">
                  <button
                    type="submit"
                    className="btn btn-primary btn-lg"
                    disabled={isSubmitting}
                    style={{ width: '100%', maxWidth: '400px' }}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-pulse" style={{
                          width: '16px',
                          height: '16px',
                          borderRadius: 'var(--radius-full)',
                          background: 'currentColor',
                          display: 'inline-block',
                          marginRight: 'var(--space-2)',
                        }}></div>
                        Submitting Request...
                      </>
                    ) : (
                      <>
                        <span>Submit Custom Order Request</span>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M5 12h14M12 5l7 7-7 7"/>
                        </svg>
                      </>
                    )}
                  </button>
                  
                  <p style={{ 
                    fontSize: 'var(--text-sm)',
                    color: 'var(--color-text-muted)',
                    textAlign: 'center',
                    marginTop: 'var(--space-4)',
                  }}>
                    We'll review your request and get back to you within 24 hours
                  </p>
                </div>
              </form>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="custom-section">
          <div className="faq-section">
            <div className="text-center" style={{ marginBottom: 'var(--space-16)' }}>
              <h2>Frequently Asked Questions</h2>
            </div>

            <div className="faq-grid">
              <div className="faq-item">
                <h4>How long does a custom order take?</h4>
                <p>Timeline varies depending on the complexity of the project. Simple designs typically take 1-2 weeks, while more complex pieces can take 4-6 weeks. We'll provide an estimated timeline during our initial consultation.</p>
              </div>

              <div className="faq-item">
                <h4>What's the minimum order for custom work?</h4>
                <p>We don't have a minimum order requirement. Whether you need one custom piece or multiple items, we're happy to work with you to bring your vision to life.</p>
              </div>

              <div className="faq-item">
                <h4>How does pricing work?</h4>
                <p>Pricing depends on the complexity, materials, and time required for your project. We provide detailed quotes upfront with no hidden fees. A 50% deposit is required to begin work.</p>
              </div>

              <div className="faq-item">
                <h4>Can I see the design before it's made?</h4>
                <p>Absolutely! We provide digital mockups or sketches for approval before beginning production. We want to ensure you're completely happy with the design.</p>
              </div>

              <div className="faq-item">
                <h4>Do you ship internationally?</h4>
                <p>Yes, we ship worldwide! International shipping costs and timelines will be calculated based on your location and provided with your quote.</p>
              </div>

              <div className="faq-item">
                <h4>What if I'm not satisfied with the result?</h4>
                <p>Your satisfaction is our priority. We work closely with you throughout the process to ensure the final product meets your expectations. We'll discuss any concerns and work to make it right.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact CTA */}
        <section className="custom-section">
          <div className="contact-cta">
            <div className="card card-glass">
              <div className="text-center">
                <h2>Ready to Start Your Custom Project?</h2>
                <p style={{ 
                  fontSize: 'var(--text-lg)', 
                  color: 'var(--color-text-secondary)',
                  marginBottom: 'var(--space-8)',
                }}>
                  Have questions? Prefer to discuss your project directly? Get in touch!
                </p>
                
                <div className="contact-options">
                  <div className="contact-option">
                    <span className="contact-icon">📧</span>
                    <span>hello@livingdeaddesign.co</span>
                  </div>
                  <div className="contact-option">
                    <span className="contact-icon">📱</span>
                    <span>@livingdeaddesignco</span>
                  </div>
                </div>

                <div style={{ marginTop: 'var(--space-8)' }}>
                  <Link to="/shop" className="btn btn-outline btn-lg">
                    Browse Existing Designs
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Toast Notification */}
      {showToast && (
        <div className="modern-toast">
          <div className="modern-toast-content">
            <div className="modern-toast-icon">
              {toastType === 'success' ? '✅' : '❌'}
            </div>
            <div className="modern-toast-message">
              <strong>{toastType === 'success' ? 'Request Submitted' : 'Submission Failed'}</strong>
              <p>{toastMessage}</p>
            </div>
            <button 
              className="modern-toast-close"
              onClick={() => setShowToast(false)}
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
}