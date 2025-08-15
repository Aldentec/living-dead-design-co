import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Form, Badge, Spinner, Alert, Toast, ToastContainer } from 'react-bootstrap';
import { useCart } from '../../context/CartContext';

export default function ProductDetail() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    fetchProduct();
  }, [productId]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://nbwke3grerscqtfchrbl6txcti0rgeip.lambda-url.us-west-2.on.aws/items/${productId}`
      );
      
      if (!response.ok) {
        if (response.status === 404) {
          setError('Product not found');
          return;
        }
        throw new Error('Failed to fetch product');
      }
      
      const data = await response.json();
      console.log('Fetched product:', data);
      
      // Parse the Lambda response
      let productData;
      if (data.body) {
        productData = typeof data.body === 'string' ? JSON.parse(data.body) : data.body;
      } else {
        productData = data;
      }
      
      setProduct(productData);
      
      // Set default variant if available
      if (productData.variants && productData.variants.length > 0) {
        setSelectedVariant(productData.variants[0]);
      }
    } catch (err) {
      console.error('Error fetching product:', err);
      setError('Failed to load product. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!product) return;
    
    // Check if variants are required but none selected
    if (product.variants && product.variants.length > 0 && !selectedVariant) {
      setToastMessage('Please select a variant before adding to cart');
      setShowToast(true);
      return;
    }

    // Check stock availability
    const availableQuantity = selectedVariant ? selectedVariant.quantity : product.quantity;
    if (availableQuantity <= 0) {
      setToastMessage('This item is out of stock');
      setShowToast(true);
      return;
    }

    if (quantity > availableQuantity) {
      setToastMessage(`Only ${availableQuantity} items available in stock`);
      setShowToast(true);
      return;
    }

    setAddingToCart(true);
    
    try {
      // Add to cart
      addToCart(product, selectedVariant, quantity);
      
      // Show success message
      const variantText = selectedVariant ? ` (${selectedVariant.option}: ${selectedVariant.value})` : '';
      setToastMessage(`${product.title}${variantText} added to cart!`);
      setShowToast(true);
      
      // Reset quantity to 1
      setQuantity(1);
    } catch (error) {
      console.error('Error adding to cart:', error);
      setToastMessage('Failed to add item to cart. Please try again.');
      setShowToast(true);
    } finally {
      setAddingToCart(false);
    }
  };

  const formatPrice = (price, salePrice) => {
    if (salePrice && salePrice < price) {
      return (
        <>
          <span className="h3 text-danger fw-bold">${salePrice.toFixed(2)}</span>
          <span className="text-muted text-decoration-line-through ms-3 h5">${price.toFixed(2)}</span>
        </>
      );
    }
    return <span className="h3 fw-bold text-light">${price.toFixed(2)}</span>;
  };

  const getAvailableQuantity = () => {
    if (selectedVariant) {
      return selectedVariant.quantity || 0;
    }
    return product?.quantity || 0;
  };

  const isOutOfStock = () => {
    return getAvailableQuantity() <= 0;
  };

  if (loading) {
    return (
      <div className="bg-dark text-light" style={{ minHeight: '100vh', marginTop: '-4.5rem', paddingTop: '4.5rem' }}>
        <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
          <div className="text-center">
            <Spinner animation="border" variant="light" size="lg" />
            <p className="text-light mt-3">Loading product...</p>
          </div>
        </Container>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="bg-dark text-light" style={{ minHeight: '100vh', marginTop: '-4.5rem', paddingTop: '4.5rem' }}>
        <Container className="py-5">
          <Alert variant="danger">
            <h4>Product Not Found</h4>
            <p>{error || 'The product you are looking for does not exist.'}</p>
            <Link to="/shop">
              <Button variant="outline-light">← Back to Shop</Button>
            </Link>
          </Alert>
        </Container>
      </div>
    );
  }

  return (
    <div className="bg-dark text-light" style={{ minHeight: '100vh', marginTop: '-4.5rem', paddingTop: '4.5rem' }}>
      <Container style={{ paddingTop: '2rem', paddingBottom: '3rem' }}>
        {/* Breadcrumb */}
        <nav aria-label="breadcrumb" className="mb-4">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link to="/" className="text-decoration-none">Home</Link>
            </li>
            <li className="breadcrumb-item">
              <Link to="/shop" className="text-decoration-none">Shop</Link>
            </li>
            <li className="breadcrumb-item active text-muted" aria-current="page">
              {product.title}
            </li>
          </ol>
        </nav>

        <Row>
          {/* Product Image */}
          <Col lg={6} className="mb-4">
            <Card className="bg-secondary border-secondary">
              <Card.Body className="p-0">
                <img
                  src={product.imageUrl}
                  alt={product.title}
                  className="img-fluid w-100 rounded"
                  style={{ maxHeight: '600px', objectFit: 'cover' }}
                />
              </Card.Body>
            </Card>
          </Col>

          {/* Product Info */}
          <Col lg={6}>
            <div className="sticky-top" style={{ top: '100px' }}>
              {/* Title and Price */}
              <div className="mb-4">
                <h1 className="h2 text-light mb-3" style={{ fontFamily: 'Cinzel Decorative, serif' }}>
                  {product.title}
                </h1>
                <div className="mb-3">
                  {formatPrice(product.price, product.salePrice)}
                  {product.salePrice && product.salePrice < product.price && (
                    <Badge bg="danger" className="ms-3">
                      Save ${(product.price - product.salePrice).toFixed(2)}
                    </Badge>
                  )}
                </div>
              </div>

              {/* Description */}
              <Card className="bg-secondary border-secondary mb-4">
                <Card.Body>
                  <h5 className="text-light mb-3">Description</h5>
                  <p className="text-light" style={{ lineHeight: '1.6' }}>{product.description}</p>
                </Card.Body>
              </Card>

              {/* Product Details */}
              <Card className="bg-secondary border-secondary mb-4">
                <Card.Body>
                  <h5 className="text-light mb-3">Product Details</h5>
                  <Row className="text-muted">
                    {product.weight > 0 && (
                      <Col sm={6} className="mb-2">
                        <strong>Weight:</strong> {product.weight} oz
                      </Col>
                    )}
                    <Col sm={6} className="mb-2">
                      <strong>Stock:</strong> {getAvailableQuantity()} available
                    </Col>
                    {product.categories && product.categories.length > 0 && (
                      <Col sm={12} className="mb-2">
                        <strong>Categories:</strong> {product.categories.join(', ')}
                      </Col>
                    )}
                  </Row>
                </Card.Body>
              </Card>

              {/* Tags */}
              {product.tags && product.tags.length > 0 && (
                <div className="mb-4">
                  <h6 className="text-light mb-2">Tags</h6>
                  <div>
                    {product.tags.map((tag, index) => (
                      <Badge key={index} bg="outline-light" className="me-2 mb-2 text-light border-light">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Variants */}
              {product.variants && product.variants.length > 0 && (
                <Card className="bg-secondary border-secondary mb-4">
                  <Card.Body>
                    <h5 className="text-light mb-3">Select Option</h5>
                    <div className="d-flex flex-wrap gap-2">
                      {product.variants.map((variant, index) => (
                        <Button
                          key={index}
                          variant={selectedVariant === variant ? "primary" : "outline-secondary"}
                          size="sm"
                          onClick={() => setSelectedVariant(variant)}
                          disabled={variant.quantity <= 0}
                        >
                          {variant.value}
                          {variant.quantity <= 0 && <small className="ms-1">(Out of Stock)</small>}
                          {variant.quantity <= 5 && variant.quantity > 0 && (
                            <small className="ms-1">({variant.quantity} left)</small>
                          )}
                        </Button>
                      ))}
                    </div>
                    {selectedVariant && (
                      <small className="text-muted mt-2 d-block">
                        Selected: {selectedVariant.option} - {selectedVariant.value}
                      </small>
                    )}
                  </Card.Body>
                </Card>
              )}

              {/* Quantity and Add to Cart */}
              <Card className="bg-secondary border-secondary">
                <Card.Body>
                  <Row className="align-items-center">
                    <Col sm={4}>
                      <Form.Label className="text-light">Quantity</Form.Label>
                      <Form.Control
                        type="number"
                        min="1"
                        max={getAvailableQuantity()}
                        value={quantity}
                        onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                        className="bg-secondary text-light border-secondary"
                        disabled={isOutOfStock()}
                      />
                    </Col>
                    <Col sm={8}>
                      <div className="d-grid gap-2 mt-3 mt-sm-0">
                        <Button
                          variant="primary"
                          size="lg"
                          onClick={handleAddToCart}
                          disabled={isOutOfStock() || addingToCart}
                        >
                          {addingToCart ? (
                            <>
                              <Spinner as="span" animation="border" size="sm" className="me-2" />
                              Adding...
                            </>
                          ) : isOutOfStock() ? (
                            'Out of Stock'
                          ) : (
                            '🛒 Add to Cart'
                          )}
                        </Button>
                        <Link to="/shop">
                          <Button variant="outline-light" className="w-100">
                            ← Continue Shopping
                          </Button>
                        </Link>
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>

              {/* Stock Warning */}
              {getAvailableQuantity() <= 5 && getAvailableQuantity() > 0 && (
                <Alert variant="warning" className="mt-3">
                  <small>⚠️ Only {getAvailableQuantity()} left in stock!</small>
                </Alert>
              )}
            </div>
          </Col>
        </Row>
      </Container>

      {/* Toast Notifications */}
      <ToastContainer 
        position="top-center" 
        className="p-3"
        style={{ zIndex: 9999, marginTop: '80px' }}
      >
        <Toast 
          show={showToast} 
          onClose={() => setShowToast(false)} 
          delay={3000} 
          autohide
          bg="success"
        >
          <Toast.Header>
            <strong className="me-auto">✅ Cart Updated</strong>
          </Toast.Header>
          <Toast.Body className="text-white">
            {toastMessage}
          </Toast.Body>
        </Toast>
      </ToastContainer>
    </div>
  );
}