import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function Cart() {
  const { cart, updateQuantity, removeFromCart, clearCart } = useCart();
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [removingItems, setRemovingItems] = useState(new Set());

  const handleQuantityChange = (itemKey, newQuantity) => {
    const quantity = parseInt(newQuantity);
    if (quantity >= 0) {
      updateQuantity(itemKey, quantity);
    }
  };

  const handleRemoveItem = async (itemKey) => {
    setRemovingItems(prev => new Set([...prev, itemKey]));
    
    // Add a small delay for better UX
    setTimeout(() => {
      removeFromCart(itemKey);
      setRemovingItems(prev => {
        const newSet = new Set([...prev]);
        newSet.delete(itemKey);
        return newSet;
      });
    }, 300);
  };

  const handleClearCart = () => {
    clearCart();
    setShowClearConfirm(false);
  };

  const formatPrice = (price) => {
    return `$${price.toFixed(2)}`;
  };

  const subtotal = cart.totalAmount;
  const tax = subtotal * 0.08; // 8% tax
  const shipping = subtotal > 50 ? 0 : 9.99; // Free shipping over $50
  const total = subtotal + tax + shipping;

  // Empty cart state
  if (cart.items.length === 0) {
    return (
      <div className="cart-page">
        <div className="container-modern">
          <div className="cart-empty">
            <div className="empty-cart-icon">
              <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="9" cy="21" r="1"/>
                <circle cx="20" cy="21" r="1"/>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
              </svg>
            </div>
            <h1 className="empty-cart-title">Your Cart is Empty</h1>
            <p className="empty-cart-subtitle">
              Looks like you haven't added any items to your cart yet. 
              Discover our dark and mysterious collection.
            </p>
            <Link to="/shop" className="btn btn-primary btn-lg">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="9" cy="21" r="1"/>
                <circle cx="20" cy="21" r="1"/>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
              </svg>
              Start Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="container-modern">
        {/* Cart Header */}
        <div className="cart-header">
          <div className="cart-title-section">
            <h1 className="cart-title">Shopping Cart</h1>
            <p className="cart-subtitle">
              {cart.totalItems} item{cart.totalItems !== 1 ? 's' : ''} in your cart
            </p>
          </div>
          
          <div className="cart-header-actions">
            <Link to="/shop" className="btn btn-secondary">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="15,18 9,12 15,6"/>
              </svg>
              Continue Shopping
            </Link>
            <button 
              className="btn btn-danger"
              onClick={() => setShowClearConfirm(true)}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="3,6 5,6 21,6"/>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
              </svg>
              Clear Cart
            </button>
          </div>
        </div>

        {/* Cart Content */}
        <div className="cart-layout">
          {/* Cart Items */}
          <div className="cart-items-section">
            <div className="cart-items-list">
              {cart.items.map((item) => (
                <div 
                  key={item.key} 
                  className={`cart-item ${removingItems.has(item.key) ? 'removing' : ''}`}
                >
                  {/* Product Image */}
                  <div className="cart-item-image">
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.title}
                      className="product-image"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="cart-item-info">
                    <h3 className="product-title">{item.product.title}</h3>
                    <p className="product-description">
                      {item.product.description.length > 100 
                        ? `${item.product.description.substring(0, 100)}...` 
                        : item.product.description}
                    </p>
                    
                    {/* Variant Display */}
                    {item.variant && (
                      <div className="variant-display">
                        {Object.entries(item.variant.options || {}).map(([key, value]) => (
                          <span key={key} className="variant-tag">
                            {key}: {value}
                          </span>
                        ))}
                      </div>
                    )}
                    
                    <div className="item-price-mobile">
                      <span className="price-each">{formatPrice(item.price)} each</span>
                      <span className="price-total">{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  </div>

                  {/* Quantity Controls */}
                  <div className="cart-item-quantity">
                    <label className="quantity-label">Quantity</label>
                    <div className="quantity-controls">
                      <button
                        className="quantity-btn"
                        onClick={() => handleQuantityChange(item.key, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <line x1="5" y1="12" x2="19" y2="12"/>
                        </svg>
                      </button>
                      <input
                        type="number"
                        min="1"
                        max="99"
                        value={item.quantity}
                        onChange={(e) => handleQuantityChange(item.key, e.target.value)}
                        className="quantity-input"
                      />
                      <button
                        className="quantity-btn"
                        onClick={() => handleQuantityChange(item.key, item.quantity + 1)}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <line x1="12" y1="5" x2="12" y2="19"/>
                          <line x1="5" y1="12" x2="19" y2="12"/>
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Price and Actions */}
                  <div className="cart-item-price">
                    <div className="price-breakdown">
                      <span className="price-total">{formatPrice(item.price * item.quantity)}</span>
                      <span className="price-each">{formatPrice(item.price)} each</span>
                    </div>
                    <button
                      className="remove-btn"
                      onClick={() => handleRemoveItem(item.key)}
                      disabled={removingItems.has(item.key)}
                    >
                      {removingItems.has(item.key) ? (
                        <div className="btn-spinner"></div>
                      ) : (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="3,6 5,6 21,6"/>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                          <line x1="10" y1="11" x2="10" y2="17"/>
                          <line x1="14" y1="11" x2="14" y2="17"/>
                        </svg>
                      )}
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="cart-summary-section">
            <div className="cart-summary">
              <h2 className="summary-title">Order Summary</h2>
              
              <div className="summary-breakdown">
                <div className="summary-line">
                  <span className="summary-label">Subtotal ({cart.totalItems} items)</span>
                  <span className="summary-value">{formatPrice(subtotal)}</span>
                </div>
                
                <div className="summary-line">
                  <span className="summary-label">Shipping</span>
                  <span className="summary-value">
                    {shipping === 0 ? (
                      <span className="free-shipping">Free</span>
                    ) : (
                      formatPrice(shipping)
                    )}
                  </span>
                </div>
                
                <div className="summary-line">
                  <span className="summary-label">Tax</span>
                  <span className="summary-value">{formatPrice(tax)}</span>
                </div>
                
                <div className="summary-divider"></div>
                
                <div className="summary-total">
                  <span className="total-label">Total</span>
                  <span className="total-value">{formatPrice(total)}</span>
                </div>

                {/* Free Shipping Alert */}
                {shipping > 0 && (
                  <div className="shipping-alert">
                    <div className="alert-icon">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
                      </svg>
                    </div>
                    <span>Add {formatPrice(50 - subtotal)} more for free shipping!</span>
                  </div>
                )}

                {/* Checkout Actions */}
                <div className="checkout-actions">
                  <button className="btn btn-primary btn-lg checkout-btn">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                      <path d="M9 9h6v6H9z"/>
                    </svg>
                    Proceed to Checkout
                  </button>
                  
                  <button className="btn btn-secondary save-btn">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
                    </svg>
                    Save for Later
                  </button>
                </div>

                {/* Security Notice */}
                <div className="security-notice">
                  <div className="security-features">
                    <span className="security-item">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                      </svg>
                      Secure checkout
                    </span>
                    <span className="security-item">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="23,4 23,10 17,10"/>
                        <polyline points="1,20 1,14 7,14"/>
                        <path d="M20.49 9A9 9 0 0 0 5.64 5.64m13.85 8.72A9 9 0 0 1 5.64 18.36"/>
                      </svg>
                      Free returns
                    </span>
                    <span className="security-item">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M9 12l2 2 4-4"/>
                        <circle cx="12" cy="12" r="10"/>
                      </svg>
                      30-day guarantee
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recommended Section */}
        <div className="cart-recommendations">
          <h3 className="recommendations-title">You might also like</h3>
          <p className="recommendations-subtitle">
            Discover more items from our dark collection
          </p>
          <Link to="/shop" className="btn btn-outline recommendations-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="9" cy="21" r="1"/>
              <circle cx="20" cy="21" r="1"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
            </svg>
            Browse Full Collection
          </Link>
        </div>
      </div>

      {/* Clear Cart Confirmation Modal */}
      {showClearConfirm && (
        <div className="modal-overlay" onClick={() => setShowClearConfirm(false)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title danger">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                  <line x1="12" y1="9" x2="12" y2="13"/>
                  <line x1="12" y1="17" x2="12.01" y2="17"/>
                </svg>
                Clear Cart
              </h3>
              <button
                className="modal-close"
                onClick={() => setShowClearConfirm(false)}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to remove all items from your cart?</p>
              <div className="warning-text">
                This action cannot be undone. All {cart.totalItems} items will be removed.
              </div>
            </div>
            <div className="modal-footer">
              <button
                className="btn btn-secondary"
                onClick={() => setShowClearConfirm(false)}
              >
                Cancel
              </button>
              <button
                className="btn btn-danger"
                onClick={handleClearCart}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="3,6 5,6 21,6"/>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                </svg>
                Clear Cart
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}