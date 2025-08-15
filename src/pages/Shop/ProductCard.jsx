import React from 'react';
import { Card, Badge, Button } from 'react-bootstrap';
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
        return <span className="fw-bold text-light">${minPrice.toFixed(2)} - ${maxPrice.toFixed(2)}</span>;
      } else {
        // All variants same price, show single price
        return <span className="fw-bold text-light">${minPrice.toFixed(2)}</span>;
      }
    }
    
    // Original pricing logic for products without variant pricing
    if (salePrice && salePrice < price) {
      return (
        <>
          <span className="text-danger fw-bold">${salePrice.toFixed(2)}</span>
          <span className="text-muted text-decoration-line-through ms-2" style={{ color: '#6c757d' }}>
            ${price.toFixed(2)}
          </span>
        </>
      );
    }
    return <span className="fw-bold text-light">${price.toFixed(2)}</span>;
  };

  const handleAddToCart = () => {
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

  return (
    <Card className="h-100 bg-secondary border-secondary product-card" onClick={handleCardClick}>
      <div className="position-relative">
        <Card.Img
          variant="top"
          src={product.imageUrl}
          alt={product.title}
          style={{ height: '300px', objectFit: 'cover' }}
          className="product-image"
          loading="lazy"
        />
        
        {/* Sale Badge */}
        {product.salePrice && product.salePrice < product.price && !hasVariantPricing() && (
          <Badge bg="danger" className="position-absolute top-0 end-0 m-2">
            Sale
          </Badge>
        )}
        
        {/* Variant Pricing Badge */}
        {hasVariantPricing() && (
          <Badge bg="info" className="position-absolute top-0 end-0 m-2">
            Multiple Options
          </Badge>
        )}
        
        {/* Stock Status Badges */}
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
        
        {/* New Product Badge - if created within last 30 days */}
        {product.createdAt && new Date(product.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) && (
          <Badge bg="success" className="position-absolute" style={{ top: '10px', left: '50%', transform: 'translateX(-50%)' }}>
            New
          </Badge>
        )}
      </div>
      
      <Card.Body className="d-flex flex-column text-light">
        <Card.Title className="h5 mb-2 text-light">{product.title}</Card.Title>
        <Card.Text className="text-muted flex-grow-1" style={{ color: '#adb5bd' }}>
          {product.description.length > 100 
            ? `${product.description.substring(0, 100)}...` 
            : product.description}
        </Card.Text>
        
        {/* Tags */}
        {product.tags && product.tags.length > 0 && (
          <div className="mb-2">
            {product.tags.slice(0, 3).map((tag, index) => (
              <Badge 
                key={index} 
                bg="outline-light" 
                className="me-1 mb-1 text-light border-light"
                style={{ backgroundColor: 'transparent', border: '1px solid #f8f9fa' }}
              >
                {tag}
              </Badge>
            ))}
            {product.tags.length > 3 && (
              <Badge bg="outline-secondary" className="me-1 mb-1">
                +{product.tags.length - 3} more
              </Badge>
            )}
          </div>
        )}
        
        {/* Categories */}
        {product.categories && product.categories.length > 0 && (
          <div className="mb-2">
            <small className="text-muted" style={{ color: '#6c757d' }}>
              Category: {product.categories.join(', ')}
            </small>
          </div>
        )}
        
        {/* Price and Actions */}
        <div className="d-flex justify-content-between align-items-center mt-auto">
          <div className="price text-light">
            {formatPrice(product.price, product.salePrice)}
          </div>
          <Button 
            variant="outline-light" 
            size="sm"
            disabled={product.quantity === 0}
            onClick={(e) => {
              e.stopPropagation(); // Prevent card click when clicking button
              if (hasVariantPricing()) {
                // If product has variant pricing, go to detail page instead of adding directly
                navigate(`/product/${product.id}`);
              } else {
                handleAddToCart();
              }
            }}
          >
            {product.quantity === 0 ? 'Out of Stock' : hasVariantPricing() ? 'Select Options' : 'Add to Cart'}
          </Button>
        </div>
        
        {/* Variants and Stock Info */}
        <div className="mt-2">
          <div className="d-flex justify-content-between align-items-center">
            {product.variants && product.variants.length > 0 && (
              <small className="text-muted" style={{ color: '#6c757d' }}>
                {product.variants.length} option{product.variants.length > 1 ? 's' : ''}
                {hasVariantPricing() && <span> • Various prices</span>}
              </small>
            )}
            {product.quantity > 0 && (
              <small className="text-muted" style={{ color: '#6c757d' }}>
                {product.quantity} in stock
              </small>
            )}
          </div>
        </div>
        
        {/* Weight info if available */}
        {product.weight > 0 && (
          <div className="mt-1">
            <small className="text-muted" style={{ color: '#6c757d' }}>Weight: {product.weight} oz</small>
          </div>
        )}
      </Card.Body>
    </Card>
  );
}