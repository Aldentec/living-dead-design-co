import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function ProductCard({ product, onAddToCart }) {
  const navigate = useNavigate();

  const formatPrice = (price, salePrice) => {
    // Check if variants have different prices
    const variantPrices = product.variants?.map(v => v.price).filter(p => p !== undefined);
    
    if (variantPrices && variantPrices.length > 0) {
      const minPrice = Math.min(...variantPrices);
      const maxPrice = Math.max(...variantPrices);
      
      if (minPrice !== maxPrice) {
        // Show price range if variants have different prices
        return <span className="product-price">${minPrice.toFixed(2)} - ${maxPrice.toFixed(2)}</span>;
      } else {
        // All variants same price, show single price
        return <span className="product-price">${minPrice.toFixed(2)}</span>;
      }
    }
    
    // Original pricing logic for products without variant pricing
    if (salePrice && salePrice < price) {
      return (
        <div className="product-pricing">
          <span className="product-price product-price-sale">${salePrice.toFixed(2)}</span>
          <span className="product-price product-price-original">${price.toFixed(2)}</span>
        </div>
      );
    }
    return <span className="product-price">${price.toFixed(2)}</span>;
  };

  const handleAddToCart = (e) => {
    e.stopPropagation(); // Prevent card click when clicking button
    if (onAddToCart) {
      onAddToCart(product);
    } else {
      // Default behavior - log to console
      console.log('Add to cart:', product.id);
    }
  };

  const handleCardClick = () => {
    // Navigate to product detail page
    navigate(`/product/${product.id}`);
  };

  const hasVariantPricing = () => {
    const variantPrices = product.variants?.map(v => v.price).filter(p => p !== undefined);
    return variantPrices && variantPrices.length > 0;
  };

  const isNewProduct = () => {
    return product.createdAt && new Date(product.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  };

  const isLowStock = () => {
    return product.quantity <= 5 && product.quantity > 0;
  };

  const isOutOfStock = () => {
    return product.quantity === 0;
  };

  return (
    <div className="product-card" onClick={handleCardClick}>
      {/* Product Image Container */}
      <div className="product-image-container">
        <img
          src={product.imageUrl}
          alt={product.title}
          className="product-image"
          loading="lazy"
          onError={(e) => {
            // Fallback to placeholder if image fails to load
            e.target.src = '/api/placeholder/300/300';
          }}
        />
        
        {/* Product Badges */}
        <div className="product-badges">
          {/* Sale Badge */}
          {product.salePrice && product.salePrice < product.price && !hasVariantPricing() && (
            <span className="product-badge product-badge-sale">Sale</span>
          )}
          
          {/* Variant Pricing Badge */}
          {hasVariantPricing() && (
            <span className="product-badge product-badge-info">Multiple Options</span>
          )}
          
          {/* New Product Badge */}
          {isNewProduct() && (
            <span className="product-badge product-badge-new">New</span>
          )}
        </div>

        {/* Stock Status Badges */}
        <div className="product-status-badges">
          {isLowStock() && (
            <span className="product-badge product-badge-warning">Low Stock</span>
          )}
          {isOutOfStock() && (
            <span className="product-badge product-badge-danger">Out of Stock</span>
          )}
        </div>
      </div>
      
      {/* Product Info */}
      <div className="product-info">
        <h3 className="product-title">{product.title}</h3>
        
        <p className="product-description">
          {product.description.length > 100 
            ? `${product.description.substring(0, 100)}...` 
            : product.description}
        </p>
        
        {/* Tags */}
        {product.tags && product.tags.length > 0 && (
          <div className="product-tags">
            {product.tags.slice(0, 3).map((tag, index) => (
              <span key={index} className="product-tag">
                {tag}
              </span>
            ))}
            {product.tags.length > 3 && (
              <span className="product-tag product-tag-more">
                +{product.tags.length - 3} more
              </span>
            )}
          </div>
        )}
        
        {/* Categories */}
        {product.categories && product.categories.length > 0 && (
          <div className="product-categories">
            <span className="product-category-label">Category:</span>
            <span className="product-category-value">{product.categories.join(', ')}</span>
          </div>
        )}
        
        {/* Price and Actions */}
        <div className="product-footer">
          <div className="product-price-section">
            {formatPrice(product.price, product.salePrice)}
          </div>
          
          <button 
            className={`btn ${isOutOfStock() ? 'btn-outline' : hasVariantPricing() ? 'btn-secondary' : 'btn-primary'} btn-sm`}
            disabled={isOutOfStock()}
            onClick={(e) => {
              e.stopPropagation();
              if (hasVariantPricing()) {
                // If product has variant pricing, go to detail page instead of adding directly
                navigate(`/product/${product.id}`);
              } else {
                handleAddToCart(e);
              }
            }}
          >
            {isOutOfStock() ? 'Out of Stock' : hasVariantPricing() ? 'Select Options' : 'Add to Cart'}
          </button>
        </div>
        
        {/* Product Meta Info */}
        <div className="product-meta">
          <div className="product-meta-row">
            {product.variants && product.variants.length > 0 && (
              <span className="product-meta-item">
                {product.variants.length} option{product.variants.length > 1 ? 's' : ''}
                {hasVariantPricing() && <span> • Various prices</span>}
              </span>
            )}
            {product.quantity > 0 && (
              <span className="product-meta-item">
                {product.quantity} in stock
              </span>
            )}
          </div>
          
          {/* Weight info if available */}
          {product.weight > 0 && (
            <div className="product-meta-row">
              <span className="product-meta-item">Weight: {product.weight} oz</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}