import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Spinner, Alert, Button, Form } from 'react-bootstrap';

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://nbwke3grerscqtfchrbl6txcti0rgeip.lambda-url.us-west-2.on.aws/items');
      
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      
      const data = await response.json();
      console.log('Fetched products:', data);
      
      // Filter only active products and sort by creation date
      const activeProducts = Array.isArray(data) ? data.filter(product => product.isActive !== false) : [];
      setProducts(activeProducts);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to load products. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Get unique categories from products
  const categories = ['all', ...new Set(products.flatMap(product => product.categories || []))];

  // Filter and sort products
  const filteredProducts = products
    .filter(product => {
      const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (product.tags && product.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())));
      
      const matchesCategory = selectedCategory === 'all' || 
                             (product.categories && product.categories.includes(selectedCategory));
      
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return (a.salePrice || a.price) - (b.salePrice || b.price);
        case 'price-high':
          return (b.salePrice || b.price) - (a.salePrice || a.price);
        case 'name':
          return a.title.localeCompare(b.title);
        case 'newest':
        default:
          return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });

  const formatPrice = (price, salePrice) => {
    if (salePrice && salePrice < price) {
      return (
        <>
          <span className="text-danger fw-bold">${salePrice.toFixed(2)}</span>
          <span className="text-muted text-decoration-line-through ms-2">${price.toFixed(2)}</span>
        </>
      );
    }
    return <span className="fw-bold">${price.toFixed(2)}</span>;
  };

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" variant="light" size="lg" />
        <p className="text-light mt-3">Loading products...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">
          {error}
          <Button variant="outline-danger" className="ms-3" onClick={fetchProducts}>
            Try Again
          </Button>
        </Alert>
      </Container>
    );
  }

  return (
    <div className="bg-dark text-light py-5" style={{ minHeight: '100vh' }}>
      <Container>
        {/* Header */}
        <div className="text-center mb-5">
          <h1 className="display-4 fw-bold mb-3" style={{ fontFamily: 'Cinzel Decorative, serif' }}>
            Shop
          </h1>
          <p className="lead text-muted">Discover our handcrafted collection</p>
        </div>

        {/* Filters and Search */}
        <Row className="mb-4">
          <Col lg={4} className="mb-3">
            <Form.Control
              type="search"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-secondary text-light border-secondary"
              style={{ '::placeholder': { color: '#adb5bd' } }}
            />
          </Col>
          <Col lg={4} className="mb-3">
            <Form.Select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-secondary text-light border-secondary"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </option>
              ))}
            </Form.Select>
          </Col>
          <Col lg={4} className="mb-3">
            <Form.Select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-secondary text-light border-secondary"
            >
              <option value="newest">Newest First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name">Name A-Z</option>
            </Form.Select>
          </Col>
        </Row>

        {/* Results Count */}
        <div className="mb-4">
          <small className="text-muted">
            Showing {filteredProducts.length} of {products.length} products
          </small>
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-5">
            <h3 className="text-muted">No products found</h3>
            <p className="text-muted">Try adjusting your search or filters</p>
          </div>
        ) : (
          <Row>
            {filteredProducts.map((product) => (
              <Col key={product.id} lg={4} md={6} className="mb-4">
                <Card className="h-100 bg-secondary border-secondary product-card">
                  <div className="position-relative">
                    <Card.Img
                      variant="top"
                      src={product.imageUrl}
                      alt={product.title}
                      style={{ height: '300px', objectFit: 'cover' }}
                      className="product-image"
                    />
                    {product.salePrice && product.salePrice < product.price && (
                      <Badge bg="danger" className="position-absolute top-0 end-0 m-2">
                        Sale
                      </Badge>
                    )}
                    {product.quantity <= 5 && product.quantity > 0 && (
                      <Badge bg="warning" text="dark" className="position-absolute top-0 start-0 m-2">
                        Low Stock
                      </Badge>
                    )}
                    {product.quantity === 0 && (
                      <Badge bg="dark" className="position-absolute top-0 start-0 m-2">
                        Out of Stock
                      </Badge>
                    )}
                  </div>
                  
                  <Card.Body className="d-flex flex-column text-light">
                    <Card.Title className="h5 mb-2">{product.title}</Card.Title>
                    <Card.Text className="text-muted flex-grow-1">
                      {product.description.length > 100 
                        ? `${product.description.substring(0, 100)}...` 
                        : product.description}
                    </Card.Text>
                    
                    {/* Tags */}
                    {product.tags && product.tags.length > 0 && (
                      <div className="mb-2">
                        {product.tags.slice(0, 3).map((tag, index) => (
                          <Badge key={index} bg="outline-light" className="me-1 mb-1 text-light border-light">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                    
                    {/* Price and Actions */}
                    <div className="d-flex justify-content-between align-items-center mt-auto">
                      <div className="price">
                        {formatPrice(product.price, product.salePrice)}
                      </div>
                      <Button 
                        variant="outline-light" 
                        size="sm"
                        disabled={product.quantity === 0}
                        onClick={() => {
                          // TODO: Add to cart functionality
                          console.log('Add to cart:', product.id);
                        }}
                      >
                        {product.quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
                      </Button>
                    </div>
                    
                    {/* Variants Preview */}
                    {product.variants && product.variants.length > 0 && (
                      <div className="mt-2">
                        <small className="text-muted">
                          Available in {product.variants.length} variant{product.variants.length > 1 ? 's' : ''}
                        </small>
                      </div>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}

        {/* Load More Button - if you implement pagination later */}
        {products.length > 0 && (
          <div className="text-center mt-5">
            <p className="text-muted">
              Showing all {products.length} products
            </p>
          </div>
        )}
      </Container>
    </div>
  );
}