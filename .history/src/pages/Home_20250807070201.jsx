import { Container, Row, Col, Button } from 'react-bootstrap';
import heroImage from '../assets/skeletons-dancing-hero.png';

export default function Home() {
  return (
    <div
      className="hero-section d-flex align-items-center justify-content-center text-center text-light"
      style={{
        backgroundImage: `url(${heroImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '100vh',
        backgroundRepeat: 'no-repeat',
        backgroundColor: '#000' // fallback
      }}
    >
      <Container>
        <Row>
          <Col>
            <h1 className="display-3">Living Dead Design Co.</h1>
            <p className="lead">Handcrafted Apparel & Art</p>
            <Button variant="light" href="/shop">Shop Now</Button>
          </Col>
        </Row>
      </Container>
    </div>

  );
}
