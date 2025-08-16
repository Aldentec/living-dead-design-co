import React from 'react';
import { Link } from 'react-router-dom';

export default function About() {
  return (
    <div className="about-container">
      <div className="container-modern">
        {/* Hero Section */}
        <div className="about-hero">
          <div className="about-hero-content">
            <h1 className="about-hero-title">
              About Living Dead Design Co.
            </h1>
            <p className="about-hero-subtitle">
              Handcrafted apparel and art born from passion, creativity, and a love for the beautifully dark.
            </p>
          </div>
          
          {/* Decorative Element */}
          <div className="about-hero-decoration">
            <div className="decoration-circle decoration-circle-1"></div>
            <div className="decoration-circle decoration-circle-2"></div>
            <div className="decoration-circle decoration-circle-3"></div>
          </div>
        </div>

        {/* Our Story Section */}
        <section className="about-section">
          <div className="about-grid">
            <div className="about-content">
              <div className="card">
                <div className="about-icon">
                  📖
                </div>
                <h2>Our Story</h2>
                <div className="about-text">
                  <p>
                    Welcome to Living Dead Design Co., where creativity meets craftsmanship in the shadows of artistic expression. Founded with a passion for the macabre and mysterious, we specialize in creating one-of-a-kind apparel and art pieces that celebrate the beauty found in darkness.
                  </p>
                  <p>
                    Every piece in our collection is carefully handcrafted with obsessive attention to detail and an unwavering commitment to quality. From the initial spark of inspiration to the final stitch, we pour our souls into each design, ensuring that what you receive is not just a product, but a piece of wearable art that tells your story.
                  </p>
                  <p>
                    Our designs draw inspiration from gothic culture, horror aesthetics, occult symbolism, and the timeless beauty found in mortality itself. We create pieces that are both haunting and elegant, dark yet sophisticated - perfect for those who appreciate the art of darkness.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* What We Do Section */}
        <section className="about-section">
          <div className="text-center" style={{ marginBottom: 'var(--space-16)' }}>
            <h2>What We Create</h2>
            <p style={{ 
              fontSize: 'var(--text-lg)', 
              color: 'var(--color-text-secondary)',
              maxWidth: '600px',
              margin: '0 auto',
            }}>
              Each category represents our dedication to dark artistry and exceptional craftsmanship
            </p>
          </div>

          <div className="services-grid">
            <div className="service-card">
              <div className="service-icon">🎨</div>
              <h3>Custom Apparel</h3>
              <p>
                Handcrafted clothing pieces designed to make you stand out from the crowd. From graphic tees featuring original dark art to custom designs that speak to your soul, each piece is made with care and gothic creativity.
              </p>
            </div>

            <div className="service-card">
              <div className="service-icon">🖼️</div>
              <h3>Original Art</h3>
              <p>
                Original artwork and prints that capture the essence of darkness and beauty. Perfect for collectors and art enthusiasts who appreciate the macabre, mysterious, and magnificently dark.
              </p>
            </div>

            <div className="service-card">
              <div className="service-icon">✨</div>
              <h3>Custom Orders</h3>
              <p>
                Have something specific in mind? We work closely with clients to bring their darkest visions to life, creating custom pieces that reflect their personal style and embrace their inner darkness.
              </p>
            </div>

            <div className="service-card">
              <div className="service-icon">📦</div>
              <h3>Quality Materials</h3>
              <p>
                We use only premium materials and sustainable practices whenever possible, ensuring durability and comfort in every piece while honoring our commitment to ethical craftsmanship.
              </p>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="about-section">
          <div className="mission-section">
            <div className="mission-content">
              <div className="card card-elevated">
                <div className="mission-icon">
                  🌙
                </div>
                <h2>Our Mission</h2>
                <div className="mission-text">
                  <p>
                    To create unique pieces that empower self-expression through the beautiful darkness that exists within us all. We believe that embracing the shadows doesn't mean abandoning the light - it means finding beauty in the balance between both.
                  </p>
                  <p>
                    Our mission is to build a community of kindred spirits who appreciate handmade craftsmanship, celebrate individuality, and find art in the unconventional. We strive to keep the tradition of artisan craftsmanship alive while pushing the boundaries of dark aesthetic expression.
                  </p>
                  <blockquote className="mission-quote">
                    "Every purchase supports an independent artist and helps keep the flame of handmade craftsmanship burning bright in the darkness. Thank you for being part of our creative coven."
                  </blockquote>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="about-section">
          <div className="text-center" style={{ marginBottom: 'var(--space-16)' }}>
            <h2>Our Values</h2>
            <p style={{ 
              fontSize: 'var(--text-lg)', 
              color: 'var(--color-text-secondary)',
              maxWidth: '600px',
              margin: '0 auto',
            }}>
              The principles that guide our creative process and business practices
            </p>
          </div>

          <div className="values-grid">
            <div className="value-item">
              <div className="value-icon">⚡</div>
              <h4>Authenticity</h4>
              <p>Every design is an original creation, never copied or mass-produced. Your piece is as unique as you are.</p>
            </div>

            <div className="value-item">
              <div className="value-icon">🖤</div>
              <h4>Quality</h4>
              <p>We never compromise on materials or craftsmanship. Each piece is made to last and treasure.</p>
            </div>

            <div className="value-item">
              <div className="value-icon">🌱</div>
              <h4>Sustainability</h4>
              <p>We prioritize eco-friendly materials and ethical practices whenever possible.</p>
            </div>

            <div className="value-item">
              <div className="value-icon">🤝</div>
              <h4>Community</h4>
              <p>We believe in building connections with fellow artists, customers, and dark art enthusiasts.</p>
            </div>
          </div>
        </section>

        {/* Connect Section */}
        <section className="about-section">
          <div className="connect-section">
            <div className="card card-glass">
              <div className="connect-content">
                <h2>Join Our Dark Family</h2>
                <p style={{ 
                  fontSize: 'var(--text-lg)',
                  color: 'var(--color-text-secondary)',
                  marginBottom: 'var(--space-8)',
                }}>
                  Ready to find your next favorite piece or have a custom design in mind?
                </p>
                
                <div className="connect-actions">
                  <Link to="/shop" className="btn btn-primary btn-lg">
                    <span>Browse Our Shop</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </Link>
                  
                  <a 
                    href="https://www.etsy.com/shop/LivingDeadDesignCo?ref=shop-header-name&listing_id=1407277997&from_page=listing"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-secondary btn-lg"
                  >
                    <span>Visit Our Etsy</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                      <polyline points="15,3 21,3 21,9"/>
                      <line x1="10" y1="14" x2="21" y2="3"/>
                    </svg>
                  </a>
                  
                  <Link to="/custom" className="btn btn-ghost btn-lg">
                    <span>Custom Orders</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                  </Link>
                </div>

                <div className="contact-info">
                  <h3>Get In Touch</h3>
                  <div className="contact-grid">
                    <div className="contact-item">
                      <span className="contact-icon">📧</span>
                      <span>Email: hello@livingdeaddesign.co</span>
                    </div>
                    <div className="contact-item">
                      <span className="contact-icon">📱</span>
                      <span>Instagram: @livingdeaddesignco</span>
                    </div>
                    <div className="contact-item contact-item-full">
                      <span className="contact-icon">💬</span>
                      <span>Have questions? Feel free to reach out - we'd love to hear from you!</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Bottom Message */}
        <div className="about-footer">
          <p style={{ 
            textAlign: 'center',
            color: 'var(--color-text-muted)',
            fontSize: 'var(--text-lg)',
          }}>
            Thank you for supporting independent artists and keeping the darkness beautiful ✨
          </p>
        </div>
      </div>
    </div>
  );
}