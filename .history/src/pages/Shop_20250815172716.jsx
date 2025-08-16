import React, { useState, useEffect } from 'react';
import ProductCard from './Shop/ProductCard';
import { useCart } from '../context/CartContext';

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTags, setSelectedTags] = useState([]);
  const [sortBy, setSortBy] = useState('newest');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  
  const { addToCart } = useCart();

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

  const handleAddToCart = (product, variant = null, quantity = 1) => {
    // Add item to cart
    addToCart(product, variant, quantity);
    
    // Show success toast
    const variantText = variant ? ` (${variant.option}: ${variant.value})` : '';
    setToastMessage(`${product.title}${variantText} added to cart!`);
    setShowToast(true);
  };

  // Loading state
  if (loading) {
    return (
      <div className="shop-container">
        <div className="container-modern">
          <div className="text-center" style={{ padding: 'var(--space-24) 0' }}>
            <div className="animate-pulse" style={{
              width: '60px',
              height: '60px',
              background: 'var(--color-accent-gradient)',
              borderRadius: 'var(--radius-full)',
              margin: '0 auto var(--space-4)',
            }}></div>
            <h2>Loading Products...</h2>
            <p style={{ color: 'var(--color-text-secondary)' }}>
              Discovering our dark collection
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="shop-container">
        <div className="container-modern">
          <div className="text-center" style={{ padding: 'var(--space-24) 0' }}>
            <div style={{
              fontSize: '4rem',
              marginBottom: 'var(--space-4)',
            }}>
              💀
            </div>
            <h2>Something Went Wrong</h2>
            <p style={{ 
              color: 'var(--color-text-secondary)',
              marginBottom: 'var(--space-6)',
            }}>
              {error}
            </p>
            <button 
              onClick={fetchProducts}
              className="btn btn-primary"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="shop-container">
      <div className="container-modern">
        {/* Header */}
        <div className="text-center" style={{ marginBottom: 'var(--space-16)' }}>
          <h1 style={{ 
            fontSize: 'var(--text-5xl)',
            marginBottom: 'var(--space-4)',
          }}>
            Shop
          </h1>
          <p style={{ 
            fontSize: 'var(--text-lg)', 
            color: 'var(--color-text-secondary)',
            maxWidth: '600px',
            margin: '0 auto',
          }}>
            Discover our handcrafted collection of dark art and apparel
          </p>
        </div>

        {/* Tag Filter Section */}
        {allTags.length > 0 && (
          <div className="filter-section" style={{ marginBottom: 'var(--space-8)' }}>
            <h3 style={{ 
              marginBottom: 'var(--space-4)',
              fontSize: 'var(--text-lg)',
            }}>
              Filter by Tags
            </h3>
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 'var(--space-3)',
              alignItems: 'center',
            }}>
              <button
                className={`btn ${selectedTags.length === 0 ? 'btn-primary' : 'btn-outline'}`}
                onClick={clearAllTags}
              >
                All Tags
              </button>
              {allTags.map(tag => (
                <button
                  key={tag}
                  className={`btn btn-sm ${selectedTags.includes(tag) ? 'btn-primary' : 'btn-ghost'}`}
                  onClick={() => toggleTag(tag)}
                >
                  {tag}
                </button>
              ))}
              {selectedTags.length > 0 && (
                <span style={{ 
                  color: 'var(--color-text-muted)', 
                  fontSize: 'var(--text-sm)',
                }}>
                  ({selectedTags.length} tag{selectedTags.length > 1 ? 's' : ''} selected)
                </span>
              )}
            </div>
          </div>
        )}

        {/* Search and Filter Row */}
        <div className="filter-section">
          <div className="filter-row">
            <div className="search-input">
              <input
                type="search"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-control"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="form-control form-select"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </option>
              ))}
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="form-control form-select"
            >
              <option value="newest">Newest First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name">Name A-Z</option>
            </select>
          </div>
        </div>

        {/* Results Summary */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: 'var(--space-8)',
          flexWrap: 'wrap',
          gap: 'var(--space-4)',
        }}>
          <div style={{ color: 'var(--color-text-secondary)' }}>
            <span>Showing {filteredProducts.length} of {products.length} products</span>
            {selectedTags.length > 0 && (
              <span> • Tags: {selectedTags.join(', ')}</span>
            )}
            {selectedCategory !== 'all' && (
              <span> • Category: {selectedCategory}</span>
            )}
            {searchTerm && (
              <span> • Search: "{searchTerm}"</span>
            )}
          </div>
          {(selectedTags.length > 0 || selectedCategory !== 'all' || searchTerm) && (
            <button
              className="btn btn-ghost btn-sm"
              onClick={clearAllFilters}
            >
              Clear All Filters
            </button>
          )}
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center" style={{ padding: 'var(--space-24) 0' }}>
            <div style={{
              fontSize: '4rem',
              marginBottom: 'var(--space-4)',
            }}>
              🔍
            </div>
            <h3>No Products Found</h3>
            <p style={{ 
              color: 'var(--color-text-secondary)',
              marginBottom: 'var(--space-6)',
            }}>
              Try adjusting your search or filters
            </p>
            <button
              className="btn btn-outline"
              onClick={clearAllFilters}
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="product-grid">
            {filteredProducts.map((product) => (
              <ProductCard 
                key={product.id}
                product={product} 
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        )}

        {/* Results Footer */}
        {products.length > 0 && (
          <div className="text-center" style={{ 
            marginTop: 'var(--space-16)',
            padding: 'var(--space-8) 0',
            borderTop: '1px solid var(--color-border-primary)',
          }}>
            <p style={{ color: 'var(--color-text-secondary)' }}>
              Showing all {products.length} products in our dark collection
            </p>
          </div>
        )}
      </div>

      {/* Toast Notification */}
      {showToast && (
        <div className="modern-toast">
          <div className="modern-toast-content">
            <div className="modern-toast-icon">✅</div>
            <div className="modern-toast-message">
              <strong>Added to Cart</strong>
              <p>{toastMessage}</p>
            </div>
            <button 
              className="modern-toast-close"
              onClick={() => setShowToast(false)}
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
}