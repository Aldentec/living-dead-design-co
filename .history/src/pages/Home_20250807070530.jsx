import { Container, Row, Col, Button, Image } from 'react-bootstrap';
import heroImage from '../assets/skeletons-dancing-hero.png';

export default function Home() {
  return (
    <div
      className="text-light d-flex align-items-center"
      style={{ backgroundColor: '#0a0a0a', minHeight: '100vh' }}
    >
      <Container className="text-center">
        <Row className="justify-content-center mb-4">
          <Col md={8}>
            <Image
              src={heroImage}
              alt="Dancing Skeletons"
              fluid
              className="mb-4"
              style={{ maxHeight: '400px' }}
            />
          </Col>
        </Row>
        <Row className="justify-content-center">
          <Col md={8}>
            <h1 className="display-3">Living Dead Design Co.</h1>
            <p className="lead">Handcrafted Apparel & Art</p>
            <Button variant="light" href="/shop">Shop Now</Button>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
