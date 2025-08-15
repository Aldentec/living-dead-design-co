import React from 'react';
import { Card, Badge, Button } from 'react-bootstrap';

export default function ProductCard({ product, onAddToCart }) {
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

  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart(product);
    } else {
      // Default behavior - log to console
      console.log('Add to cart:', product.id);
    }
  };

  const handleCardClick = () => {
    // TODO: Navigate to product detail page
    console.log('View product details:', product.slug || product.id);
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
        {product.salePrice && product.salePrice < product.price && (
          <Badge bg="danger" className="position-absolute top-0 end-0 m-2">
            Sale
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
            <small className="text-muted">
              Category: {product.categories.join(', ')}
            </small>
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
            onClick={(e) => {
              e.stopPropagation(); // Prevent card click when clicking button
              handleAddToCart();
            }}
          >
            {product.quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
          </Button>
        </div>
        
        {/* Variants and Stock Info */}
        <div className="mt-2">
          <div className="d-flex justify-content-between align-items-center">
            {product.variants && product.variants.length > 0 && (
              <small className="text-muted">
                {product.variants.length} variant{product.variants.length > 1 ? 's' : ''}
              </small>
            )}
            {product.quantity > 0 && (
              <small className="text-muted">
                {product.quantity} in stock
              </small>
            )}
          </div>
        </div>
        
        {/* Weight info if available */}
        {product.weight > 0 && (
          <div className="mt-1">
            <small className="text-muted">Weight: {product.weight} oz</small>
          </div>
        )}
      </Card.Body>
    </Card>
  );
}