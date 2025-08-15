import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Spinner, Alert, Button, Form, Badge } from 'react-bootstrap';
import ProductCard from './Shop/ProductCard';

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTags, setSelectedTags] = useState([]);
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
  
  // Get unique tags from products
  const allTags = [...new Set(products.flatMap(product => product.tags || []))];

  // Handle tag selection
  const toggleTag = (tag) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const clearAllTags = () => {
    setSelectedTags([]);
  };

  const clearAllFilters = () => {
    setSelectedTags([]);
    setSelectedCategory('all');
    setSearchTerm('');
  };

  // Filter and sort products
  const filteredProducts = products
    .filter(product => {
      const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (product.tags && product.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())));
      
      const matchesCategory = selectedCategory === 'all' || 
                             (product.categories && product.categories.includes(selectedCategory));
      
      const matchesTags = selectedTags.length === 0 || 
                         (product.tags && selectedTags.some(selectedTag => 
                           product.tags.some(productTag => productTag.toLowerCase() === selectedTag.toLowerCase())
                         ));
      
      return matchesSearch && matchesCategory && matchesTags;
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
    <div className="bg-dark text-light pb-5 shop-page" style={{ minHeight: '100vh' }}>
      <Container className="pt-5">
        {/* Header */}
        <div className="text-center mb-5">
          <h1 className="display-4 fw-bold mb-3 text-light" style={{ fontFamily: 'Cinzel Decorative, serif' }}>
            Shop
          </h1>
          <p className="lead text-muted" style={{ color: '#6c757d' }}>Discover our handcrafted collection</p>
        </div>

        {/* Tag Filter */}
        {allTags.length > 0 && (
          <div className="mb-4 tag-filter-section">
            <div className="d-flex align-items-center flex-wrap gap-2">
              <span className="text-light me-3">Filter by tags:</span>
              <Button
                variant={selectedTags.length === 0 ? "light" : "outline-light"}
                size="sm"
                onClick={clearAllTags}
                className="mb-2"
              >
                All Tags
              </Button>
              {allTags.map(tag => (
                <Button
                  key={tag}
                  variant={selectedTags.includes(tag) ? "primary" : "outline-secondary"}
                  size="sm"
                  onClick={() => toggleTag(tag)}
                  className="mb-2"
                  style={{
                    backgroundColor: selectedTags.includes(tag) ? '#0d6efd' : 'transparent',
                    borderColor: selectedTags.includes(tag) ? '#0d6efd' : '#6c757d',
                    color: selectedTags.includes(tag) ? '#fff' : '#adb5bd'
                  }}
                >
                  {tag}
                </Button>
              ))}
              {selectedTags.length > 0 && (
                <small className="text-muted ms-2" style={{ color: '#6c757d' }}>
                  ({selectedTags.length} tag{selectedTags.length > 1 ? 's' : ''} selected)
                </small>
              )}
            </div>
          </div>
        )}

        {/* Filters and Search */}
        <Row className="mb-4">
          <Col lg={4} className="mb-3">
            <Form.Control
              type="search"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-secondary text-light border-secondary"
              style={{ backgroundColor: '#495057', color: '#f8f9fa', borderColor: '#6c757d' }}
            />
          </Col>
          <Col lg={4} className="mb-3">
            <Form.Select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-secondary text-light border-secondary"
              style={{ backgroundColor: '#495057', color: '#f8f9fa', borderColor: '#6c757d' }}
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
              style={{ backgroundColor: '#495057', color: '#f8f9fa', borderColor: '#6c757d' }}
            >
              <option value="newest">Newest First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name">Name A-Z</option>
            </Form.Select>
          </Col>
        </Row>

        {/* Results Count */}
        <div className="mb-4 d-flex justify-content-between align-items-center">
          <small className="text-muted" style={{ color: '#adb5bd' }}>
            Showing {filteredProducts.length} of {products.length} products
            {selectedTags.length > 0 && (
              <span> • Filtered by tags: {selectedTags.join(', ')}</span>
            )}
            {selectedCategory !== 'all' && (
              <span> • Category: {selectedCategory}</span>
            )}
            {searchTerm && (
              <span> • Search: "{searchTerm}"</span>
            )}
          </small>
          {(selectedTags.length > 0 || selectedCategory !== 'all' || searchTerm) && (
            <Button
              variant="outline-secondary"
              size="sm"
              onClick={clearAllFilters}
            >
              Clear All Filters
            </Button>
          )}
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-5">
            <h3 className="text-muted" style={{ color: '#adb5bd' }}>No products found</h3>
            <p className="text-muted" style={{ color: '#6c757d' }}>Try adjusting your search or filters</p>
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
            <p className="text-muted" style={{ color: '#6c757d' }}>
              Showing all {products.length} products
            </p>
          </div>
        )}
      </Container>
    </div>
  );
}