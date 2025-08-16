import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import heroImage from '../assets/skeletons-dancing-hero.png';

export default function Home() {
  const [isVisible, setIsVisible] = useState(false);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setIsVisible(true);
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://nbwke3grerscqtfchrbl6txcti0rgeip.lambda-url.us-west-2.on.aws/items');
      
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      
      const data = await response.json();
      
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
      
      // Filter only active products and get first 3 for featured section
      const activeProducts = Array.isArray(productsArray) 
        ? productsArray.filter(product => product.isActive !== false)
        : [];
      
      // Sort by newest and take first 3
      const featured = activeProducts
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 3);
      
      setFeaturedProducts(featured);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to load products');
      // Fallback to sample data if API fails
      setFeaturedProducts(getSampleProducts());
    } finally {
      setLoading(false);
    }
  };

  // Fallback sample products
  const getSampleProducts = () => [
    {
      id: 'sample1',
      title: 'Gothic Skull T-Shirt',
      description: 'Premium black cotton tee with intricate skull design',
      price: 29.99,
      salePrice: null,
      imageUrl: '/api/placeholder/300/300',
      tags: ['apparel', 'gothic', 'skull']
    },
    {
      id: 'sample2',
      title: 'Dark Rose Art Print',
      description: 'Beautiful dark artwork perfect for any gothic space',
      price: 19.99,
      salePrice: 15.99,
      imageUrl: '/api/placeholder/300/300',
      tags: ['art', 'print', 'gothic']
    },
    {
      id: 'sample3',
      title: 'Raven Hoodie',
      description: 'Comfortable hoodie featuring mystical raven artwork',
      price: 49.99,
      salePrice: null,
      imageUrl: '/api/placeholder/300/300',
      tags: ['apparel', 'hoodie', 'raven']
    }
  ];

  const ProductCard = ({ product }) => (
    <div className="product-card">
      <div className="product-image-container" style={{ position: 'relative', overflow: 'hidden' }}>
        <img 
          src={product.imageUrl} 
          alt={product.title}
          className="product-image"
          onError={(e) => {
            // Fallback to placeholder if image fails to load
            e.target.src = '/api/placeholder/300/300';
          }}
        />
        {product.salePrice && product.salePrice < product.price && (
          <span 
            className="product-badge"
            style={{
              position: 'absolute',
              top: 'var(--space-3)',
              right: 'var(--space-3)',
              background: 'var(--color-accent-gradient)',
              color: 'white',
              padding: 'var(--space-1) var(--space-3)',
              borderRadius: 'var(--radius-full)',
              fontSize: 'var(--text-xs)',
              fontWeight: 'var(--font-weight-bold)',
            }}
          >
            Sale
          </span>
        )}
      </div>
      <div className="product-info">
        <h3 className="product-title">{product.title}</h3>
        <p className="product-description">
          {product.description && product.description.length > 80 
            ? `${product.description.substring(0, 80)}...` 
            : product.description}
        </p>
        <div className="product-pricing" style={{ marginBottom: 'var(--space-4)' }}>
          {product.salePrice && product.salePrice < product.price ? (
            <>
              <span className="product-price" style={{ 
                textDecoration: 'line-through', 
                color: 'var(--color-text-muted)',
                marginRight: 'var(--space-2)',
              }}>
                ${product.price}
              </span>
              <span className="product-price">${product.salePrice}</span>
            </>
          ) : (
            <span className="product-price">${product.price}</span>
          )}
        </div>
        
        {product.tags && product.tags.length > 0 && (
          <div className="product-tags">
            {product.tags.slice(0, 2).map(tag => (
              <span key={tag} className="product-tag">{tag}</span>
            ))}
          </div>
        )}
        
        <Link 
          to={`/product/${product.id}`} 
          className="btn btn-primary w-full"
          style={{ marginTop: 'var(--space-4)' }}
        >
          View Details
        </Link>
      </div>
    </div>
  );

  return (
    <>
      {/* Hero Section */}
      <section className="hero-modern">
        <div className="container-modern">
          <div className="hero-content">
            <h1 className="hero-title">
              Living Dead Design Co.
            </h1>
            <p className="hero-subtitle">
              Handcrafted apparel and art that celebrates the macabre, the mysterious, 
              and the beautifully dark. Each piece tells a story of rebellion and artistry.
            </p>
            <div className="hero-actions">
              <Link to="/shop" className="btn btn-primary btn-lg">
                <span>Shop Collection</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </Link>
              <Link to="/custom" className="btn btn-ghost btn-lg">
                <span>Custom Orders</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              </Link>
            </div>
          </div>
        </div>
        
        {/* Floating Hero Image */}
        <div 
          className="hero-image-container"
          style={{
            position: 'absolute',
            right: '10%',
            top: '50%',
            transform: 'translateY(-50%)',
            opacity: isVisible ? 0.6 : 0,
            transition: 'opacity 1s ease-out 0.6s',
            zIndex: 1,
          }}
        >
          <img 
            src={heroImage} 
            alt="Dancing Skeletons"
            style={{
              width: '300px',
              height: 'auto',
              filter: 'drop-shadow(0 0 20px rgba(220, 38, 38, 0.3))',
            }}
          />
        </div>
      </section>

      {/* Features Section */}
      <section style={{ padding: 'var(--space-24) 0' }}>
        <div className="container-modern">
          <div className="text-center" style={{ marginBottom: 'var(--space-16)' }}>
            <h2 style={{ marginBottom: 'var(--space-4)' }}>
              Crafted with Dark Passion
            </h2>
            <p style={{ 
              fontSize: 'var(--text-lg)', 
              color: 'var(--color-text-secondary)',
              maxWidth: '600px',
              margin: '0 auto',
            }}>
              Every piece in our collection is meticulously designed and crafted to embody 
              the perfect balance of darkness and beauty.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: 'var(--space-8)',
          }}>
            {/* Feature Card 1 */}
            <div className="card card-glass">
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  width: '60px',
                  height: '60px',
                  background: 'var(--color-accent-gradient)',
                  borderRadius: 'var(--radius-full)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto var(--space-4)',
                  fontSize: '24px',
                }}>
                  ✨
                </div>
                <h3 style={{ marginBottom: 'var(--space-3)' }}>Unique Designs</h3>
                <p style={{ color: 'var(--color-text-tertiary)' }}>
                  Original artwork and designs that you won't find anywhere else. 
                  Each piece is a statement of individuality.
                </p>
              </div>
            </div>

            {/* Feature Card 2 */}
            <div className="card card-glass">
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  width: '60px',
                  height: '60px',
                  background: 'var(--color-accent-gradient)',
                  borderRadius: 'var(--radius-full)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto var(--space-4)',
                  fontSize: '24px',
                }}>
                  🎨
                </div>
                <h3 style={{ marginBottom: 'var(--space-3)' }}>Handcrafted Quality</h3>
                <p style={{ color: 'var(--color-text-tertiary)' }}>
                  Premium materials and attention to detail ensure every piece 
                  meets the highest standards of craftsmanship.
                </p>
              </div>
            </div>

            {/* Feature Card 3 */}
            <div className="card card-glass">
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  width: '60px',
                  height: '60px',
                  background: 'var(--color-accent-gradient)',
                  borderRadius: 'var(--radius-full)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto var(--space-4)',
                  fontSize: '24px',
                }}>
                  ⚡
                </div>
                <h3 style={{ marginBottom: 'var(--space-3)' }}>Custom Orders</h3>
                <p style={{ color: 'var(--color-text-tertiary)' }}>
                  Bring your darkest visions to life with our custom design service. 
                  Made to order, made to perfection.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Preview */}
      <section style={{ 
        padding: 'var(--space-24) 0',
        background: 'var(--color-bg-secondary)',
      }}>
        <div className="container-modern">
          <div className="text-center" style={{ marginBottom: 'var(--space-16)' }}>
            <h2 style={{ marginBottom: 'var(--space-4)' }}>
              Featured Collection
            </h2>
            <p style={{ 
              fontSize: 'var(--text-lg)', 
              color: 'var(--color-text-secondary)',
            }}>
              Discover our most popular designs
            </p>
          </div>

          {/* Loading State */}
          {loading ? (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: 'var(--space-6)',
              marginBottom: 'var(--space-12)',
            }}>
              {[1, 2, 3].map((item) => (
                <div key={item} className="product-card">
                  <div className="skeleton skeleton-image"></div>
                  <div className="product-info">
                    <div className="skeleton skeleton-title"></div>
                    <div className="skeleton skeleton-text" style={{ width: '40%' }}></div>
                    <div className="skeleton skeleton-text" style={{ width: '80%' }}></div>
                    <div style={{ marginTop: 'var(--space-4)' }}>
                      <div className="skeleton" style={{ height: '44px', borderRadius: 'var(--radius-lg)' }}></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            /* Error State */
            <div className="text-center" style={{ padding: 'var(--space-12) 0' }}>
              <p style={{ color: 'var(--color-text-tertiary)', marginBottom: 'var(--space-4)' }}>
                {error}
              </p>
              <button 
                onClick={fetchFeaturedProducts}
                className="btn btn-secondary"
              >
                Try Again
              </button>
            </div>
          ) : (
            /* Products Grid */
            <>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: 'var(--space-6)',
                marginBottom: 'var(--space-12)',
              }}>
                {featuredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              <div className="text-center">
                <Link to="/shop" className="btn btn-primary btn-lg">
                  <span>View All Products</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* About Section */}
      <section style={{ padding: 'var(--space-24) 0' }}>
        <div className="container-modern">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
            gap: 'var(--space-12)',
            alignItems: 'center',
          }}>
            <div>
              <h2 style={{ marginBottom: 'var(--space-6)' }}>
                Born from Darkness, Crafted with Love
              </h2>
              <p style={{ 
                fontSize: 'var(--text-lg)',
                lineHeight: 'var(--line-height-relaxed)',
                marginBottom: 'var(--space-6)',
                color: 'var(--color-text-secondary)',
              }}>
                Living Dead Design Co. emerged from a passion for the beautiful macabre and 
                the artistic expression of life's darker themes. We believe that darkness 
                isn't something to fear, but something to embrace and celebrate.
              </p>
              <p style={{ 
                fontSize: 'var(--text-lg)',
                lineHeight: 'var(--line-height-relaxed)',
                marginBottom: 'var(--space-8)',
                color: 'var(--color-text-secondary)',
              }}>
                Our designs draw inspiration from gothic art, horror aesthetics, and the 
                timeless beauty found in mortality itself. Each piece tells a story and 
                connects you to a community that appreciates the art of darkness.
              </p>
              <Link to="/about" className="btn btn-outline btn-lg">
                <span>Our Story</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </Link>
            </div>
            
            <div className="card card-elevated" style={{ 
              background: 'var(--color-bg-surface)',
              textAlign: 'center',
            }}>
              <div style={{
                fontSize: '4rem',
                marginBottom: 'var(--space-4)',
              }}>
                💀
              </div>
              <h3 style={{ marginBottom: 'var(--space-4)' }}>
                Join the Family
              </h3>
              <p style={{ 
                color: 'var(--color-text-tertiary)',
                marginBottom: 'var(--space-6)',
              }}>
                Be part of our dark community. Get exclusive access to new designs, 
                behind-the-scenes content, and special member-only events.
              </p>
              <Link to="/signup" className="btn btn-primary w-full">
                Join Now
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section style={{ 
        padding: 'var(--space-20) 0',
        background: 'var(--color-bg-tertiary)',
      }}>
        <div className="container-modern">
          <div className="text-center" style={{ maxWidth: '600px', margin: '0 auto' }}>
            <h2 style={{ marginBottom: 'var(--space-4)' }}>
              Stay in the Shadows
            </h2>
            <p style={{ 
              fontSize: 'var(--text-lg)', 
              color: 'var(--color-text-secondary)',
              marginBottom: 'var(--space-8)',
            }}>
              Subscribe to our newsletter for exclusive designs, dark inspiration, 
              and first access to new collections.
            </p>
            
            <div style={{
              display: 'flex',
              gap: 'var(--space-3)',
              maxWidth: '400px',
              margin: '0 auto',
            }}>
              <input 
                type="email" 
                placeholder="Enter your email"
                className="form-control"
                style={{ flex: 1 }}
              />
              <button className="btn btn-primary">
                Subscribe
              </button>
            </div>
            
            <p style={{
              fontSize: 'var(--text-sm)',
              color: 'var(--color-text-muted)',
              marginTop: 'var(--space-4)',
            }}>
              We respect your privacy. Unsubscribe at any time.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}