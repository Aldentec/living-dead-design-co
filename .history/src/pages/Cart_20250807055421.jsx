import React from 'react';
import { Container, Row, Col, Card, Button, Form, Alert, Image } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function Cart() {
  const { cart, updateQuantity, removeFromCart, clearCart } = useCart();

  const handleQuantityChange = (itemKey, newQuantity) => {
    const quantity = parseInt(newQuantity);
    if (quantity >= 0) {
      updateQuantity(itemKey, quantity);
    }
  };

  const formatPrice = (price) => {
    return `$${price.toFixed(2)}`;
  };

  const subtotal = cart.totalAmount;
  const tax = subtotal * 0.08; // 8% tax
  const shipping = subtotal > 50 ? 0 : 9.99; // Free shipping over $50
  const total = subtotal + tax + shipping;

  if (cart.items.length === 0) {
    return (
      <div className="bg-dark text-light" style={{ minHeight: '100vh', paddingTop: '2rem' }}>
        <Container className="py-5">
          <div className="text-center py-5">
            <h1 className="display-4 mb-4 text-light" style={{ fontFamily: 'Cinzel Decorative, serif' }}>
              Your Cart
            </h1>
            <div className="mb-4">
              <span style={{ fontSize: '4rem' }}>🛒</span>
            </div>
            <h3 className="text-muted mb-4">Your cart is empty</h3>
            <p className="text-muted mb-4">Looks like you haven't added any items to your cart yet.</p>
            <Link to="/shop">
              <Button variant="outline-light" size="lg">
                Continue Shopping
              </Button>
            </Link>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="bg-dark text-light" style={{ minHeight: '100vh', paddingTop: '2rem' }}>
      <Container className="py-4">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="display-5 text-light" style={{ fontFamily: 'Cinzel Decorative, serif' }}>
            Your Cart
          </h1>
          <div className="d-flex gap-3">
            <Link to="/shop">
              <Button variant="outline-light">Continue Shopping</Button>
            </Link>
            <Button variant="outline-danger" onClick={clearCart}>
              Clear Cart
            </Button>
          </div>
        </div>

        <Row>
          {/* Cart Items */}
          <Col lg={8}>
            <div className="mb-4">
              <small className="text-muted">
                {cart.totalItems} item{cart.totalItems !== 1 ? 's' : ''} in your cart
              </small>
            </div>

            {cart.items.map((item) => (
              <Card key={item.key} className="bg-secondary mb-3 border-secondary">
                <Card.Body>
                  <Row className="align-items-center">
                    {/* Product Image */}
                    <Col md={3}>
                      <Image
                        src={item.product.imageUrl}
                        alt={item.product.title}
                        rounded
                        style={{ width: '100%', height: '120px', objectFit: 'cover' }}
                      />
                    </Col>

                    {/* Product Info */}
                    <Col md={4}>
                      <h5 className="text-light mb-1">{item.product.title}</h5>
                      <p className="text-muted small mb-2">
                        {item.product.description.length > 80 
                          ? `${item.product.description.substring(0, 80)}...` 
                          : item.product.description}
                      </p>
                      {item.variant && (
                        <small className="text-info">
                          {item.variant.option}: {item.variant.value}
                        </small>
                      )}
                    </Col>

                    {/* Quantity Control */}
                    <Col md={2}>
                      <Form.Label className="small text-muted">Quantity</Form.Label>
                      <div className="d-flex align-items-center">
                        <Button
                          variant="outline-secondary"
                          size="sm"
                          onClick={() => handleQuantityChange(item.key, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          -
                        </Button>
                        <Form.Control
                          type="number"
                          min="1"
                          max="99"
                          value={item.quantity}
                          onChange={(e) => handleQuantityChange(item.key, e.target.value)}
                          className="mx-2 text-center bg-secondary text-light border-secondary"
                          style={{ width: '60px' }}
                        />
                        <Button
                          variant="outline-secondary"
                          size="sm"
                          onClick={() => handleQuantityChange(item.key, item.quantity + 1)}
                        >
                          +
                        </Button>
                      </div>
                    </Col>

                    {/* Price and Actions */}
                    <Col md={3} className="text-end">
                      <div className="mb-2">
                        <strong className="text-light">
                          {formatPrice(item.price * item.quantity)}
                        </strong>
                        <br />
                        <small className="text-muted">
                          {formatPrice(item.price)} each
                        </small>
                      </div>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => removeFromCart(item.key)}
                      >
                        Remove
                      </Button>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            ))}
          </Col>

          {/* Order Summary */}
          <Col lg={4}>
            <Card className="bg-secondary border-secondary sticky-top" style={{ top: '100px' }}>
              <Card.Body>
                <h5 className="text-light mb-4">Order Summary</h5>
                
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">Subtotal ({cart.totalItems} items)</span>
                  <span className="text-light">{formatPrice(subtotal)}</span>
                </div>
                
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">Shipping</span>
                  <span className="text-light">
                    {shipping === 0 ? 'Free' : formatPrice(shipping)}
                  </span>
                </div>
                
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">Tax</span>
                  <span className="text-light">{formatPrice(tax)}</span>
                </div>
                
                <hr className="border-secondary" />
                
                <div className="d-flex justify-content-between mb-4">
                  <strong className="text-light">Total</strong>
                  <strong className="text-light h5">{formatPrice(total)}</strong>
                </div>

                {shipping > 0 && (
                  <Alert variant="info" className="small">
                    Add {formatPrice(50 - subtotal)} more for free shipping!
                  </Alert>
                )}

                <div className="d-grid gap-2">
                  <Button variant="primary" size="lg">
                    Proceed to Checkout
                  </Button>
                  <Button variant="outline-light">
                    Save for Later
                  </Button>
                </div>

                <div className="mt-3 text-center">
                  <small className="text-muted">
                    Secure checkout • Free returns • 30-day guarantee
                  </small>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Recommended Items */}
        <div className="mt-5">
          <h4 className="text-light mb-3">You might also like</h4>
          <p className="text-muted">
            <Link to="/shop" className="text-decoration-none">
              Browse our full collection →
            </Link>
          </p>
        </div>
      </Container>
    </div>
  );
}