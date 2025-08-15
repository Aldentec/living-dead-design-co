import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Spinner, Alert, Button, Form } from 'react-bootstrap';
import ProductCard from '../components/ProductCard';

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
      
      // Parse the Lambda response - the actual product data is in the body field
      let productsArray;
      if (data.body) {
        // Lambda is returning full HTTP response with body as JSON string
        productsArray = JSON.parse(data.body);
      } else if (Array.isArray(data)) {
        // Direct array response
        productsArray = data;
      } else {
        productsArray = [];
      }
      
      console.log('Parsed products:', productsArray);
      
      // Filter only active products and sort by creation date
      const activeProducts = Array.isArray(productsArray) ? productsArray.filter(product => product.isActive !== false) : [];
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

  const handleAddToCart = (product) => {
    // TODO: Implement cart functionality
    // For now, just show an alert or console log
    console.log('Adding to cart:', product.title);
    // You could show a toast notification here
    alert(`${product.title} added to cart!`);
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
                <ProductCard 
                  product={product} 
                  onAddToCart={handleAddToCart}
                />
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