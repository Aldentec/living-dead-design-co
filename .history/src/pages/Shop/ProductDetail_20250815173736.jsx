import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
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
      // Add to cart with the correct price (variant price if selected)
      const itemPrice = selectedVariant?.price || product.salePrice || product.price;
      const productWithPrice = { ...product, currentPrice: itemPrice };
      
      addToCart(productWithPrice, selectedVariant, quantity);
      
      // Show success message
      const variantText = selectedVariant ? ` (${selectedVariant.option}: ${selectedVariant.value})` : '';
      const priceText = selectedVariant?.price ? ` - $${selectedVariant.price.toFixed(2)}` : '';
      setToastMessage(`${product.title}${variantText}${priceText} added to cart!`);
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
    // If we have a selected variant with its own price, use that
    const currentPrice = selectedVariant?.price || price;
    const currentSalePrice = selectedVariant?.salePrice || salePrice;
    
    if (currentSalePrice && currentSalePrice < currentPrice) {
      return (
        <div className="product-pricing">
          <span className="price-sale">${currentSalePrice.toFixed(2)}</span>
          <span className="price-original">${currentPrice.toFixed(2)}</span>
        </div>
      );
    }
    return <span className="price-current">${currentPrice.toFixed(2)}</span>;
  };

  const getCurrentPrice = () => {
    return selectedVariant?.price || product?.salePrice || product?.price || 0;
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

  // Loading state
  if (loading) {
    return (
      <div className="product-detail-container">
        <div className="container-modern">
          <div className="text-center" style={{ padding: 'var(--space-24) 0' }}>
            <div className="animate-pulse" style={{
              width: '60px',
              height: '60px',
              background: 'var(--color-accent-gradient)',
              borderRadius: 'var(--radius-full)',
              margin: '0 auto var(--space-4)',
            }}></div>
            <h2>Loading Product...</h2>
            <p style={{ color: 'var(--color-text-secondary)' }}>
              Retrieving product details
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !product) {
    return (
      <div className="product-detail-container">
        <div className="container-modern">
          <div className="text-center" style={{ padding: 'var(--space-24) 0' }}>
            <div style={{
              fontSize: '4rem',
              marginBottom: 'var(--space-4)',
            }}>
              💀
            </div>
            <h2>Product Not Found</h2>
            <p style={{ 
              color: 'var(--color-text-secondary)',
              marginBottom: 'var(--space-6)',
            }}>
              {error || 'The product you are looking for does not exist.'}
            </p>
            <Link to="/shop" className="btn btn-primary">
              ← Back to Shop
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="product-detail-container">
      <div className="container-modern">
        {/* Breadcrumb */}
        <nav className="breadcrumb-nav" style={{ marginBottom: 'var(--space-8)' }}>
          <div className="breadcrumb-links">
            <Link to="/" className="breadcrumb-link">Home</Link>
            <span className="breadcrumb-separator">→</span>
            <Link to="/shop" className="breadcrumb-link">Shop</Link>
            <span className="breadcrumb-separator">→</span>
            <span className="breadcrumb-current">{product.title}</span>
          </div>
        </nav>

        {/* Product Layout */}
        <div className="product-layout">
          {/* Product Image */}
          <div className="product-image-section">
            <div className="product-image-container">
              <img
                src={product.imageUrl}
                alt={product.title}
                className="product-detail-image"
              />
            </div>
          </div>

          {/* Product Info */}
          <div className="product-info-section">
            <div className="product-detail-content">
              {/* Title and Price */}
              <div className="product-header">
                <h1 className="product-detail-title">{product.title}</h1>
                <div className="product-detail-pricing">
                  {formatPrice(product.price, product.salePrice)}
                  {product.salePrice && product.salePrice < product.price && (
                    <div className="sale-badge">
                      Save ${(product.price - product.salePrice).toFixed(2)}
                    </div>
                  )}
                  {selectedVariant?.price && selectedVariant.price !== product.price && (
                    <div className="variant-badge">
                      Variant Price
                    </div>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="card" style={{ marginBottom: 'var(--space-6)' }}>
                <h3>Description</h3>
                <p style={{ 
                  color: 'var(--color-text-secondary)',
                  lineHeight: 'var(--line-height-relaxed)',
                  margin: 0,
                }}>
                  {product.description}
                </p>
              </div>

              {/* Product Details */}
              <div className="card" style={{ marginBottom: 'var(--space-6)' }}>
                <h3>Product Details</h3>
                <div className="product-details-grid">
                  {product.weight > 0 && (
                    <div className="detail-item">
                      <span className="detail-label">Weight:</span>
                      <span className="detail-value">{product.weight} oz</span>
                    </div>
                  )}
                  <div className="detail-item">
                    <span className="detail-label">Stock:</span>
                    <span className="detail-value">{getAvailableQuantity()} available</span>
                  </div>
                  {product.categories && product.categories.length > 0 && (
                    <div className="detail-item detail-item-full">
                      <span className="detail-label">Categories:</span>
                      <span className="detail-value">{product.categories.join(', ')}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Tags */}
              {product.tags && product.tags.length > 0 && (
                <div style={{ marginBottom: 'var(--space-6)' }}>
                  <h3>Tags</h3>
                  <div className="product-tags">
                    {product.tags.map((tag, index) => (
                      <span key={index} className="product-tag">{tag}</span>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Variants */}
              {product.variants && product.variants.length > 0 && (
                <div className="card" style={{ marginBottom: 'var(--space-6)' }}>
                  <h3>Select Option</h3>
                  <div className="variant-grid">
                    {product.variants.map((variant, index) => {
                      const label = Object.entries(variant.options)
                        .map(([key, val]) => `${key}: ${val}`)
                        .join(' • ');

                      return (
                        <button
                          key={index}
                          className={`variant-option ${selectedVariant === variant ? 'selected' : ''} ${variant.quantity <= 0 ? 'disabled' : ''}`}
                          onClick={() => setSelectedVariant(variant)}
                          disabled={variant.quantity <= 0}
                        >
                          <div className="variant-label">{label}</div>
                          <div className="variant-details">
                            ${variant.price.toFixed(2)} • {variant.quantity <= 0 ? 'Out of Stock' : `${variant.quantity} in stock`}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {selectedVariant && (
                    <div className="selected-variant-info">
                      <div className="selected-variant-label">
                        <strong>Selected:</strong>{' '}
                        {Object.entries(selectedVariant.options)
                          .map(([k, v]) => `${k}: ${v}`)
                          .join(' • ')}
                      </div>
                      {selectedVariant.price && selectedVariant.price !== product.price && (
                        <div className="selected-variant-price">
                          <strong>Price:</strong> ${selectedVariant.price.toFixed(2)}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Quantity and Add to Cart */}
              <div className="cart-section">
                <div className="quantity-selector">
                  <label className="form-label">Quantity</label>
                  <input
                    type="number"
                    min="1"
                    max={getAvailableQuantity()}
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="form-control"
                    disabled={isOutOfStock()}
                    style={{ maxWidth: '120px' }}
                  />
                </div>
                
                <div className="cart-actions">
                  <button
                    className="btn btn-primary btn-lg"
                    onClick={handleAddToCart}
                    disabled={isOutOfStock() || addingToCart}
                    style={{ flex: 1 }}
                  >
                    {addingToCart ? (
                      <>
                        <div className="animate-pulse" style={{
                          width: '16px',
                          height: '16px',
                          borderRadius: 'var(--radius-full)',
                          background: 'currentColor',
                          display: 'inline-block',
                          marginRight: 'var(--space-2)',
                        }}></div>
                        Adding...
                      </>
                    ) : isOutOfStock() ? (
                      'Out of Stock'
                    ) : (
                      `🛒 Add to Cart - $${(getCurrentPrice() * quantity).toFixed(2)}`
                    )}
                  </button>
                  
                  <Link to="/shop" className="btn btn-outline">
                    ← Continue Shopping
                  </Link>
                </div>
              </div>

              {/* Stock Warning */}
              {getAvailableQuantity() <= 5 && getAvailableQuantity() > 0 && (
                <div className="stock-warning">
                  ⚠️ Only {getAvailableQuantity()} left in stock!
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {showToast && (
        <div className="modern-toast">
          <div className="modern-toast-content">
            <div className="modern-toast-icon">✅</div>
            <div className="modern-toast-message">
              <strong>Cart Updated</strong>
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