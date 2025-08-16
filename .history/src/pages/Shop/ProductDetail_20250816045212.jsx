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
  const [selectedOptions, setSelectedOptions] = useState({});
  const [quantity, setQuantity] = useState(1);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    fetchProduct();
  }, [productId]);

  useEffect(() => {
    // Update selected variant when options change
    if (product?.variants && Object.keys(selectedOptions).length > 0) {
      const matchingVariant = product.variants.find(variant => {
        return Object.entries(selectedOptions).every(([key, value]) => 
          variant.options[key] === value
        );
      });
      setSelectedVariant(matchingVariant || null);
    }
  }, [selectedOptions, product]);

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
      
      // Set default options if variants exist
      if (productData.variants && productData.variants.length > 0) {
        const firstVariant = productData.variants[0];
        setSelectedOptions(firstVariant.options);
        setSelectedVariant(firstVariant);
      }
    } catch (err) {
      console.error('Error fetching product:', err);
      setError('Failed to load product. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Extract unique option categories and values
  const getVariantStructure = () => {
    if (!product?.variants) return {};
    
    const structure = {};
    
    product.variants.forEach(variant => {
      Object.entries(variant.options).forEach(([key, value]) => {
        if (!structure[key]) {
          structure[key] = new Set();
        }
        structure[key].add(value);
      });
    });
    
    // Convert sets to arrays
    Object.keys(structure).forEach(key => {
      structure[key] = Array.from(structure[key]);
    });
    
    return structure;
  };

  const handleOptionChange = (category, value) => {
    setSelectedOptions(prev => ({
      ...prev,
      [category]: value
    }));
  };

  const getAvailableOptions = (category) => {
    if (!product?.variants) return [];
    
    const structure = getVariantStructure();
    const categoryOptions = structure[category] || [];
    
    // Filter options that are available given current selections
    return categoryOptions.filter(option => {
      const testSelection = { ...selectedOptions, [category]: option };
      
      // Check if any variant matches this combination
      return product.variants.some(variant => {
        return Object.entries(testSelection).every(([key, value]) => 
          variant.options[key] === value
        );
      });
    });
  };

  const isOptionDisabled = (category, value) => {
    if (!product?.variants) return false;
    
    const testSelection = { ...selectedOptions, [category]: value };
    
    // Check if any variant with this option has stock
    const matchingVariants = product.variants.filter(variant => {
      return Object.entries(testSelection).every(([key, val]) => 
        variant.options[key] === val
      );
    });
    
    return matchingVariants.length === 0 || matchingVariants.every(v => v.quantity <= 0);
  };

  const handleAddToCart = async () => {
    if (!product) return;
    
    // Check if variants are required but none selected
    if (product.variants && product.variants.length > 0 && !selectedVariant) {
      setToastMessage('Please select all options before adding to cart');
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
      const variantText = selectedVariant ? 
        ` (${Object.entries(selectedVariant.options).map(([k, v]) => `${k}: ${v}`).join(', ')})` : '';
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

  const variantStructure = getVariantStructure();
  const hasVariants = Object.keys(variantStructure).length > 0;

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

              {/* Compact Variant Selection */}
              {hasVariants && (
                <div className="variant-selection-compact">
                  <h3>Select Options</h3>
                  
                  <div className="variant-options-grid">
                    {Object.entries(variantStructure).map(([category, options]) => (
                      <div key={category} className="variant-option-group">
                        <label className="variant-label">{category}:</label>
                        <div className="variant-buttons">
                          {options.map(option => (
                            <button
                              key={option}
                              className={`variant-button ${
                                selectedOptions[category] === option ? 'selected' : ''
                              } ${isOptionDisabled(category, option) ? 'disabled' : ''}`}
                              onClick={() => handleOptionChange(category, option)}
                              disabled={isOptionDisabled(category, option)}
                            >
                              {option}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Selected Variant Info */}
                  {selectedVariant && (
                    <div className="selected-variant-summary">
                      <div className="variant-summary-content">
                        <div className="variant-summary-selection">
                          <strong>Selected:</strong>{' '}
                          {Object.entries(selectedOptions)
                            .map(([k, v]) => `${k}: ${v}`)
                            .join(' • ')}
                        </div>
                        <div className="variant-summary-details">
                          <span className="variant-price">
                            ${selectedVariant.price.toFixed(2)}
                          </span>
                          <span className="variant-stock">
                            {selectedVariant.quantity <= 0 ? 
                              'Out of Stock' : 
                              `${selectedVariant.quantity} in stock`
                            }
                          </span>
                        </div>
                      </div>
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
                    disabled={isOutOfStock() || addingToCart || (hasVariants && !selectedVariant)}
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
                    ) : hasVariants && !selectedVariant ? (
                      'Select Options Above'
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

              {/* Description */}
              <div className="card" style={{ marginTop: 'var(--space-6)' }}>
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
              <div className="card" style={{ marginTop: 'var(--space-4)' }}>
                <h3>Product Details</h3>
                <div className="product-details-grid">
                  {product.weight > 0 && (
                    <div className="detail-item">
                      <span className="detail-label">Weight:</span>
                      <span className="detail-value">{product.weight} oz</span>
                    </div>
                  )}
                  <div className="detail-item">
                    <span className="detail-label">Total Stock:</span>
                    <span className="detail-value">
                      {hasVariants ? 
                        product.variants.reduce((sum, v) => sum + v.quantity, 0) :
                        product.quantity
                      } available
                    </span>
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
                <div style={{ marginTop: 'var(--space-4)' }}>
                  <h3>Tags</h3>
                  <div className="product-tags">
                    {product.tags.map((tag, index) => (
                      <span key={index} className="product-tag">{tag}</span>
                    ))}
                  </div>
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