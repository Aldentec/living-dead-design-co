import { Container, Row, Col, Button } from 'react-bootstrap';

export default function Home() {
  return (
    <div className="hero">
      <Container className="text-center text-light d-flex align-items-center justify-content-center h-100">
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
