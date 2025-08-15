import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default function About() {
  return (
    <div className="text-light" style={{ backgroundColor: '#0a0a0a', minHeight: '100vh', paddingTop: '2rem' }}>
      <Container className="py-5">
        {/* Header Section */}
        <div className="text-center mb-5">
          <h1 className="display-3 fw-bold text-light mb-3" style={{ fontFamily: 'Cinzel Decorative, serif' }}>
            About Living Dead Design Co.
          </h1>
          <p className="lead" style={{ maxWidth: '600px', margin: '0 auto' }}>
            Handcrafted apparel and art born from passion, creativity, and a love for unique design.
          </p>
        </div>

        <Row className="justify-content-center">
          <Col lg={8}>
            {/* Main About Section */}
            <Card className="bg-secondary border-secondary mb-5">
              <Card.Body className="p-4">
                <h2 className="text-light mb-4" style={{ fontFamily: 'Cinzel Decorative, serif' }}>
                  Our Story
                </h2>
                <div className="text-muted">
                  <p className="mb-3">
                    Welcome to Living Dead Design Co., where creativity meets craftsmanship. Founded with a passion for 
                    unique design and quality materials, we specialize in creating one-of-a-kind apparel and art pieces 
                    that tell a story.
                  </p>
                  <p className="mb-3">
                    Every piece in our collection is carefully handcrafted with attention to detail and a commitment 
                    to quality. From concept to creation, we pour our heart into each design, ensuring that what you 
                    receive is not just a product, but a piece of wearable art.
                  </p>
                  <p className="mb-0">
                    Our designs draw inspiration from [ADD YOUR INSPIRATION HERE - gothic culture, street art, vintage 
                    aesthetics, etc.], creating pieces that are both timeless and contemporary. Whether you're looking 
                    for a statement piece or everyday wear with a unique twist, you'll find something special here.
                  </p>
                </div>
              </Card.Body>
            </Card>

            {/* What We Do Section */}
            <Card className="bg-secondary border-secondary mb-5">
              <Card.Body className="p-4">
                <h2 className="text-light mb-4" style={{ fontFamily: 'Cinzel Decorative, serif' }}>
                  What We Do
                </h2>
                <Row>
                  <Col md={6} className="mb-3">
                    <h5 className="text-light">🎨 Custom Apparel</h5>
                    <p className="text-muted small">
                      Handcrafted clothing pieces designed to make you stand out. From graphic tees to custom designs, 
                      each piece is made with care and creativity.
                    </p>
                  </Col>
                  <Col md={6} className="mb-3">
                    <h5 className="text-light">🖼️ Original Art</h5>
                    <p className="text-muted small">
                      Original artwork and prints that capture unique perspectives and artistic vision. Perfect for 
                      collectors and art enthusiasts.
                    </p>
                  </Col>
                  <Col md={6} className="mb-3">
                    <h5 className="text-light">✨ Custom Orders</h5>
                    <p className="text-muted small">
                      Have something specific in mind? We work with clients to create custom pieces that reflect 
                      their personal style and vision.
                    </p>
                  </Col>
                  <Col md={6} className="mb-3">
                    <h5 className="text-light">📦 Quality Materials</h5>
                    <p className="text-muted small">
                      We use only high-quality materials and sustainable practices whenever possible, ensuring 
                      durability and comfort in every piece.
                    </p>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            {/* Mission Section */}
            <Card className="bg-secondary border-secondary mb-5">
              <Card.Body className="p-4">
                <h2 className="text-light mb-4" style={{ fontFamily: 'Cinzel Decorative, serif' }}>
                  Our Mission
                </h2>
                <p className="text-muted">
                  [CUSTOMIZE THIS SECTION - Add your personal mission statement, values, and what drives your creative process. 
                  Examples: "To create unique pieces that empower self-expression" or "To bring art into everyday life through 
                  wearable designs" or "To build a community of creative individuals who appreciate handmade craftsmanship."]
                </p>
                <p className="text-muted mb-0">
                  Every purchase supports an independent artist and helps keep the tradition of handmade craftsmanship alive. 
                  Thank you for being part of our creative journey.
                </p>
              </Card.Body>
            </Card>

            {/* Connect Section */}
            <Card className="bg-secondary border-secondary">
              <Card.Body className="p-4 text-center">
                <h2 className="text-light mb-4" style={{ fontFamily: 'Cinzel Decorative, serif' }}>
                  Connect With Us
                </h2>
                <p className="text-muted mb-4">
                  Ready to find your next favorite piece or have a custom design in mind?
                </p>
                
                <div className="d-flex flex-wrap justify-content-center gap-3 mb-4">
                  <Link to="/shop">
                    <Button variant="outline-light" size="lg">
                      Browse Our Shop
                    </Button>
                  </Link>
                  
                  <a 
                    href="https://www.etsy.com/shop/LivingDeadDesignCo?ref=shop-header-name&listing_id=1407277997&from_page=listing"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="outline-primary" size="lg">
                      Visit Our Etsy Shop
                    </Button>
                  </a>
                  
                  <Link to="/custom">
                    <Button variant="outline-success" size="lg">
                      Custom Orders
                    </Button>
                  </Link>
                </div>

                <div className="border-top border-secondary pt-4 mt-4">
                  <h5 className="text-light mb-3">Get In Touch</h5>
                  <div className="row justify-content-center">
                    <div className="col-md-8">
                      <p className="text-muted small mb-2">
                        📧 Email: [ADD YOUR EMAIL]
                      </p>
                      <p className="text-muted small mb-2">
                        📱 Instagram: [ADD YOUR INSTAGRAM]
                      </p>
                      <p className="text-muted small mb-0">
                        💬 Have questions? Feel free to reach out - we'd love to hear from you!
                      </p>
                    </div>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Bottom CTA */}
        <div className="text-center mt-5">
          <p className="text-muted">
            Thank you for supporting independent artists and handmade craftsmanship ✨
          </p>
        </div>
      </Container>
    </div>
  );
}