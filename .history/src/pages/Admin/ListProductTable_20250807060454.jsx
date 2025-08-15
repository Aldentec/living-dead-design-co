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
      updated = updated.filter(p => p.title.toLowerCase().includes(searchTerm.toLowerCase()));
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
    if (sortKey !== key) return <span className="text-muted ms-1">⇅</span>;
    return sortOrder === 'asc'
      ? <span className="ms-1">↑</span>
      : <span className="ms-1">↓</span>;
  }

  function handleShowVariants(variants) {
    setSelectedVariants(variants);
    setShowVariantsModal(true);
  }

  function handleCloseVariants() {
    setShowVariantsModal(false);
    setSelectedVariants([]);
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
        // Remove item from local state
        setProducts(prev => prev.filter(p => p.id !== itemToDelete.id));
        setFilteredProducts(prev => prev.filter(p => p.id !== itemToDelete.id));
        
        // Close modal
        handleCloseDeleteModal();
        
        // Show success message
        alert(`"${itemToDelete.title}" has been deleted successfully.`);
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

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <div className="mb-3 d-flex gap-3 flex-wrap align-items-center">
        <input
          type="text"
          placeholder="Search by title..."
          className="form-control w-auto"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select
          className="form-select w-auto"
          value={selectedTag}
          onChange={(e) => setSelectedTag(e.target.value)}
        >
          <option value="">All Tags</option>
          {allTags.map(tag => (
            <option key={tag} value={tag}>{tag}</option>
          ))}
        </select>

        <button 
          className="btn btn-outline-success btn-sm"
          onClick={fetchProducts}
          title="Refresh products"
        >
          🔄 Refresh
        </button>
      </div>

      <div className="mb-2">
        <small className="text-muted">
          Showing {filteredProducts.length} of {products.length} products
        </small>
      </div>

      {filteredProducts.length === 0 ? (
        <p>No products found for your filters.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover table-bordered table-dark align-middle">
            <thead className="table-light text-dark">
              <tr>
                <th>Preview</th>
                <th style={{ cursor: 'pointer' }} onClick={() => handleSort('title')}>
                  Title {renderSortIcon('title')}
                </th>
                <th>Description</th>
                <th style={{ cursor: 'pointer' }} onClick={() => handleSort('price')}>
                  Price {renderSortIcon('price')}
                </th>
                <th style={{ cursor: 'pointer' }} onClick={() => handleSort('quantity')}>
                  Quantity {renderSortIcon('quantity')}
                </th>
                <th style={{ cursor: 'pointer' }} onClick={() => handleSort('sold')}>
                  Sold {renderSortIcon('sold')}
                </th>
                <th style={{ cursor: 'pointer' }} onClick={() => handleSort('weight')}>
                  Weight {renderSortIcon('weight')}
                </th>
                <th>Variants</th>
                <th>Active</th>
                <th>Tags</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((item) => (
                <tr key={item.id}>
                  <td>
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      width="60"
                      height="60"
                      className="rounded"
                      onError={(e) => {
                        if (!e.target.dataset.fallback) {
                          e.target.src = '/fallback.jpg';
                          e.target.dataset.fallback = 'true';
                        }
                      }}
                    />
                  </td>
                  <td>{item.title}</td>
                  <td>
                    <span title={item.description}>
                      {item.description.length > 50 
                        ? `${item.description.substring(0, 50)}...` 
                        : item.description}
                    </span>
                  </td>
                  <td>${item.price}</td>
                  <td>{item.quantity}</td>
                  <td>{item.sold}</td>
                  <td>{item.weight} oz</td>
                  <td>
                    {Array.isArray(item.variants) && item.variants.length > 0 ? (
                      <button
                        className="btn btn-sm btn-outline-light"
                        onClick={() => handleShowVariants(item.variants)}
                      >
                        🔍 View ({item.variants.length})
                      </button>
                    ) : (
                      <span className="text-muted">—</span>
                    )}
                  </td>
                  <td>{item.isActive ? '✅' : '❌'}</td>
                  <td>
                    <span title={Array.isArray(item.tags) ? item.tags.join(', ') : ''}>
                      {Array.isArray(item.tags) ? (
                        item.tags.length > 2 
                          ? `${item.tags.slice(0, 2).join(', ')}...` 
                          : item.tags.join(', ')
                      ) : ''}
                    </span>
                  </td>
                  <td>{item.createdAt ? new Date(item.createdAt).toLocaleDateString() : ''}</td>
                  <td>
                    <div className="d-flex gap-1">
                      <button
                        className="btn btn-sm btn-outline-warning"
                        title="Edit product"
                        onClick={() => {
                          // TODO: Implement edit functionality
                          alert('Edit functionality coming soon!');
                        }}
                      >
                        ✏️
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        title="Delete product"
                        onClick={() => handleDeleteClick(item)}
                      >
                        🗑️
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
        <div
          className="modal fade show"
          style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.6)' }}
          tabIndex="-1"
        >
          <div className="modal-dialog">
            <div className="modal-content text-dark">
              <div className="modal-header">
                <h5 className="modal-title">Product Variants</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleCloseVariants}
                ></button>
              </div>
              <div className="modal-body">
                {selectedVariants.length > 0 ? (
                  <ul className="list-group">
                    {selectedVariants.map((v, index) => (
                      <li className="list-group-item d-flex justify-content-between align-items-center" key={index}>
                        <div>
                          <strong>{v.option}:</strong> {v.value}
                        </div>
                        <span className="badge bg-secondary rounded-pill">Qty: {v.quantity}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No variants found.</p>
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
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div
          className="modal fade show"
          style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.6)' }}
          tabIndex="-1"
        >
          <div className="modal-dialog">
            <div className="modal-content text-dark">
              <div className="modal-header border-danger">
                <h5 className="modal-title text-danger">⚠️ Confirm Delete</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleCloseDeleteModal}
                  disabled={deleting}
                ></button>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to delete this product?</p>
                <div className="alert alert-warning">
                  <strong>"{itemToDelete?.title}"</strong>
                </div>
                <p className="small text-muted">
                  This action cannot be undone. The product and its image will be permanently deleted from the store.
                </p>
                
                {deleteError && (
                  <div className="alert alert-danger mt-3">
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
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Deleting...
                    </>
                  ) : (
                    '🗑️ Delete Product'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}