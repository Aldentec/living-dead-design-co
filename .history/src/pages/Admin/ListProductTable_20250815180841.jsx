import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function ListProductTable() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [sortKey, setSortKey] = useState('title');
  const [sortOrder, setSortOrder] = useState('asc');
  
  const [showVariantsModal, setShowVariantsModal] = useState(false);
  const [selectedVariants, setSelectedVariants] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  // Delete functionality states
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  const { user } = useAuth();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://nbwke3grerscqtfchrbl6txcti0rgeip.lambda-url.us-west-2.on.aws/items');
      const data = await response.json();
      
      const parsed = typeof data.body === 'string' ? JSON.parse(data.body) : data.body;
      const items = Array.isArray(parsed) ? parsed : [];
      setProducts(items);
      setFilteredProducts(items);
    } catch (err) {
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let updated = [...products];

    if (selectedTag) {
      updated = updated.filter(p => Array.isArray(p.tags) && p.tags.includes(selectedTag));
    }

    if (searchTerm) {
      updated = updated.filter(p => 
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    updated.sort((a, b) => {
      let valA = a[sortKey];
      let valB = b[sortKey];

      if (['price', 'quantity', 'weight', 'sold'].includes(sortKey)) {
        valA = parseFloat(valA) || 0;
        valB = parseFloat(valB) || 0;
      } else {
        valA = valA?.toString().toLowerCase() || '';
        valB = valB?.toString().toLowerCase() || '';
      }

      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    setFilteredProducts(updated);
  }, [products, searchTerm, selectedTag, sortKey, sortOrder]);

  const allTags = Array.from(new Set(products.flatMap(p => p.tags || [])));

  function handleSort(key) {
    if (sortKey === key) {
      setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
  }

  function renderSortIcon(key) {
    if (sortKey !== key) {
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="sort-icon">
          <path d="M8 9l4-4 4 4"/>
          <path d="M16 15l-4 4-4-4"/>
        </svg>
      );
    }
    return sortOrder === 'asc' ? (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="sort-icon active">
        <path d="M8 15l4-4 4 4"/>
      </svg>
    ) : (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="sort-icon active">
        <path d="M8 9l4 4 4-4"/>
      </svg>
    );
  }

  function handleShowVariants(variants, product) {
    setSelectedVariants(variants);
    setSelectedProduct(product);
    setShowVariantsModal(true);
  }

  function handleCloseVariants() {
    setShowVariantsModal(false);
    setSelectedVariants([]);
    setSelectedProduct(null);
  }

  // Delete functionality
  function handleDeleteClick(item) {
    setItemToDelete(item);
    setShowDeleteModal(true);
    setDeleteError('');
  }

  function handleCloseDeleteModal() {
    setShowDeleteModal(false);
    setItemToDelete(null);
    setDeleteError('');
  }

  async function handleConfirmDelete() {
    if (!itemToDelete) return;

    setDeleting(true);
    setDeleteError('');

    try {
      const response = await fetch(
        `https://nbwke3grerscqtfchrbl6txcti0rgeip.lambda-url.us-west-2.on.aws/items/${itemToDelete.id}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${user?.idToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.ok) {
        setProducts(prev => prev.filter(p => p.id !== itemToDelete.id));
        setFilteredProducts(prev => prev.filter(p => p.id !== itemToDelete.id));
        handleCloseDeleteModal();
      } else {
        const errorData = await response.json().catch(() => ({}));
        setDeleteError(errorData.message || 'Failed to delete item. Please try again.');
      }
    } catch (error) {
      console.error('Error deleting item:', error);
      setDeleteError('Network error. Please check your connection and try again.');
    } finally {
      setDeleting(false);
    }
  }

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="loading-spinner"></div>
        <p>Loading products...</p>
      </div>
    );
  }

  return (
    <div className="product-table-container">
      {/* Filters and Controls */}
      <div className="table-controls">
        <div className="table-filters">
          <div className="filter-group">
            <div className="search-wrapper">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="search-icon">
                <circle cx="11" cy="11" r="8"/>
                <path d="m21 21-4.35-4.35"/>
              </svg>
              <input
                type="text"
                placeholder="Search products..."
                className="search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="filter-group">
            <select
              className="filter-select"
              value={selectedTag}
              onChange={(e) => setSelectedTag(e.target.value)}
            >
              <option value="">All Tags</option>
              {allTags.map(tag => (
                <option key={tag} value={tag}>{tag}</option>
              ))}
            </select>
          </div>

          <button 
            className="btn btn-secondary refresh-btn"
            onClick={fetchProducts}
            title="Refresh products"
            disabled={loading}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="23,4 23,10 17,10"/>
              <polyline points="1,20 1,14 7,14"/>
              <path d="M20.49 9A9 9 0 0 0 5.64 5.64m13.85 8.72A9 9 0 0 1 5.64 18.36"/>
            </svg>
            Refresh
          </button>
        </div>

        <div className="table-stats">
          <span className="stats-text">
            Showing {filteredProducts.length} of {products.length} products
          </span>
        </div>
      </div>

      {/* Products Table */}
      {filteredProducts.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <path d="M16 16s-1.5-2-4-2-4 2-4 2"/>
              <line x1="9" y1="9" x2="9.01" y2="9"/>
              <line x1="15" y1="9" x2="15.01" y2="9"/>
            </svg>
          </div>
          <h3>No products found</h3>
          <p>Try adjusting your search criteria or add some products to get started.</p>
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="modern-table">
            <thead>
              <tr>
                <th>Image</th>
                <th className="sortable" onClick={() => handleSort('title')}>
                  <span>Title</span>
                  {renderSortIcon('title')}
                </th>
                <th>Description</th>
                <th className="sortable" onClick={() => handleSort('price')}>
                  <span>Price</span>
                  {renderSortIcon('price')}
                </th>
                <th className="sortable" onClick={() => handleSort('quantity')}>
                  <span>Stock</span>
                  {renderSortIcon('quantity')}
                </th>
                <th className="sortable" onClick={() => handleSort('sold')}>
                  <span>Sold</span>
                  {renderSortIcon('sold')}
                </th>
                <th className="sortable" onClick={() => handleSort('weight')}>
                  <span>Weight</span>
                  {renderSortIcon('weight')}
                </th>
                <th>Variants</th>
                <th>Status</th>
                <th>Tags</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((item) => (
                <tr key={item.id} className="table-row">
                  <td>
                    <div className="product-image-cell">
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="product-thumbnail"
                        onError={(e) => {
                          if (!e.target.dataset.fallback) {
                            e.target.src = '/fallback.jpg';
                            e.target.dataset.fallback = 'true';
                          }
                        }}
                      />
                    </div>
                  </td>
                  <td>
                    <div className="product-title">
                      {item.title}
                    </div>
                  </td>
                  <td>
                    <div className="product-description" title={item.description}>
                      {item.description.length > 50 
                        ? `${item.description.substring(0, 50)}...` 
                        : item.description}
                    </div>
                  </td>
                  <td>
                    <div className="price-cell">
                      ${parseFloat(item.price).toFixed(2)}
                    </div>
                  </td>
                  <td>
                    <div className={`stock-cell ${item.quantity <= 5 ? 'low-stock' : ''}`}>
                      {item.quantity}
                      {item.quantity <= 5 && item.quantity > 0 && (
                        <span className="low-stock-badge">Low</span>
                      )}
                      {item.quantity === 0 && (
                        <span className="out-of-stock-badge">Out</span>
                      )}
                    </div>
                  </td>
                  <td>
                    <div className="sold-cell">
                      {item.sold || 0}
                    </div>
                  </td>
                  <td>
                    <div className="weight-cell">
                      {item.weight ? `${item.weight} oz` : '—'}
                    </div>
                  </td>
                  <td>
                    {Array.isArray(item.variants) && item.variants.length > 0 ? (
                      <button
                        className="btn btn-sm btn-secondary variants-btn"
                        onClick={() => handleShowVariants(item.variants, item)}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="3"/>
                          <path d="M12 1v6M12 17v6M4.22 4.22l4.24 4.24M15.54 15.54l4.24 4.24M1 12h6M17 12h6M4.22 19.78l4.24-4.24M15.54 8.46l4.24-4.24"/>
                        </svg>
                        {item.variants.length}
                      </button>
                    ) : (
                      <span className="no-variants">—</span>
                    )}
                  </td>
                  <td>
                    <div className={`status-badge ${item.isActive ? 'active' : 'inactive'}`}>
                      {item.isActive ? 'Active' : 'Inactive'}
                    </div>
                  </td>
                  <td>
                    <div className="tags-cell">
                      {Array.isArray(item.tags) && item.tags.length > 0 ? (
                        <div className="tags-container" title={item.tags.join(', ')}>
                          {item.tags.slice(0, 2).map(tag => (
                            <span key={tag} className="tag">{tag}</span>
                          ))}
                          {item.tags.length > 2 && (
                            <span className="tag-more">+{item.tags.length - 2}</span>
                          )}
                        </div>
                      ) : (
                        <span className="no-tags">—</span>
                      )}
                    </div>
                  </td>
                  <td>
                    <div className="date-cell">
                      {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : '—'}
                    </div>
                  </td>
                  <td>
                    <div className="actions-cell">
                      <button
                        className="btn btn-sm btn-warning action-btn"
                        title="Edit product"
                        onClick={() => {
                          alert('Edit functionality coming soon!');
                        }}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                        </svg>
                      </button>
                      <button
                        className="btn btn-sm btn-danger action-btn"
                        title="Delete product"
                        onClick={() => handleDeleteClick(item)}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="3,6 5,6 21,6"/>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                          <line x1="10" y1="11" x2="10" y2="17"/>
                          <line x1="14" y1="11" x2="14" y2="17"/>
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Variants Modal */}
      {showVariantsModal && (
        <div className="modal-overlay" onClick={handleCloseVariants}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">
                Product Variants
                {selectedProduct && (
                  <span className="modal-subtitle">for "{selectedProduct.title}"</span>
                )}
              </h3>
              <button
                className="modal-close"
                onClick={handleCloseVariants}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
            <div className="modal-body">
              {selectedVariants.length > 0 ? (
                <div className="variants-list">
                  {selectedVariants.map((variant, index) => (
                    <div className="variant-item" key={index}>
                      <div className="variant-options">
                        {Object.entries(variant.options || {}).map(([key, value]) => (
                          <div key={key} className="variant-option">
                            <span className="option-label">{key}:</span>
                            <span className="option-value">{value}</span>
                          </div>
                        ))}
                      </div>
                      <div className="variant-details">
                        <div className="variant-price">
                          ${parseFloat(variant.price || 0).toFixed(2)}
                        </div>
                        <div className="variant-quantity">
                          Qty: {variant.quantity || 0}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-variants">
                  <p>No variants found for this product.</p>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button
                className="btn btn-secondary"
                onClick={handleCloseVariants}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal-overlay" onClick={handleCloseDeleteModal}>
          <div className="modal-container delete-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title danger">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                  <line x1="12" y1="9" x2="12" y2="13"/>
                  <line x1="12" y1="17" x2="12.01" y2="17"/>
                </svg>
                Confirm Delete
              </h3>
              <button
                className="modal-close"
                onClick={handleCloseDeleteModal}
                disabled={deleting}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to delete this product?</p>
              <div className="delete-product-info">
                <div className="product-preview">
                  {itemToDelete?.imageUrl && (
                    <img src={itemToDelete.imageUrl} alt={itemToDelete.title} />
                  )}
                  <div>
                    <strong>"{itemToDelete?.title}"</strong>
                    <p>${parseFloat(itemToDelete?.price || 0).toFixed(2)}</p>
                  </div>
                </div>
              </div>
              <div className="warning-text">
                This action cannot be undone. The product and its image will be permanently deleted from the store.
              </div>
              
              {deleteError && (
                <div className="error-message">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="15" y1="9" x2="9" y2="15"/>
                    <line x1="9" y1="9" x2="15" y2="15"/>
                  </svg>
                  {deleteError}
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button
                className="btn btn-secondary"
                onClick={handleCloseDeleteModal}
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                className="btn btn-danger"
                onClick={handleConfirmDelete}
                disabled={deleting}
              >
                {deleting ? (
                  <>
                    <div className="btn-spinner"></div>
                    Deleting...
                  </>
                ) : (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="3,6 5,6 21,6"/>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                    </svg>
                    Delete Product
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}