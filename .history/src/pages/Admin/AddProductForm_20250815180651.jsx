import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

export default function AddProductForm() {
  const { user } = useAuth();
  const [form, setForm] = useState({
    title: '',
    description: '',
    price: '',
    quantity: '',
    weight: '',
    tags: '',
    variants: `[
  {
    "options": {
      "Color": "Black",
      "Style": "T-Shirt",
      "Size": "M"
    },
    "price": 20,
    "quantity": 10
  },
  {
    "options": {
      "Color": "Black",
      "Style": "Hoodie",
      "Size": "L"
    },
    "price": 35,
    "quantity": 5
  }
]`,
    image: null,
  });
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [dragActive, setDragActive] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    // Clear messages when user starts typing
    if (successMsg) setSuccessMsg('');
    if (errorMsg) setErrorMsg('');
  };

  const handleImage = (file) => {
    if (file && file.type.startsWith('image/')) {
      setForm(prev => ({ ...prev, image: file }));
      setErrorMsg('');
    } else {
      setErrorMsg('Please select a valid image file');
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    handleImage(file);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImage(e.dataTransfer.files[0]);
    }
  };

  const validateForm = () => {
    if (!form.title.trim()) {
      setErrorMsg('Product title is required');
      return false;
    }
    if (!form.description.trim()) {
      setErrorMsg('Product description is required');
      return false;
    }
    if (!form.price || parseFloat(form.price) <= 0) {
      setErrorMsg('Valid price is required');
      return false;
    }
    if (!form.quantity || parseInt(form.quantity) < 0) {
      setErrorMsg('Valid quantity is required');
      return false;
    }
    if (!form.image) {
      setErrorMsg('Product image is required');
      return false;
    }
    
    // Validate JSON variants
    if (form.variants.trim()) {
      try {
        JSON.parse(form.variants);
      } catch (err) {
        setErrorMsg('Variants must be valid JSON format');
        return false;
      }
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    setSuccessMsg('');
    setErrorMsg('');

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64Image = reader.result;

      const payload = {
        title: form.title.trim(),
        description: form.description.trim(),
        price: parseFloat(form.price),
        quantity: parseInt(form.quantity, 10),
        weight: form.weight ? parseFloat(form.weight) : 0,
        tags: form.tags ? form.tags.split(',').map(tag => tag.trim()).filter(tag => tag) : [],
        variants: form.variants.trim() ? JSON.parse(form.variants) : [],
        imageBase64: base64Image,
      };

      try {
        const res = await axios.post(
          'https://nbwke3grerscqtfchrbl6txcti0rgeip.lambda-url.us-west-2.on.aws/items', 
          payload, 
          {
            headers: {
              Authorization: `Bearer ${user.idToken}`,
              'Content-Type': 'application/json',
            },
          }
        );

        setSuccessMsg('Product created successfully!');
        // Reset form
        setForm({ 
          title: '', 
          description: '', 
          price: '', 
          quantity: '',
          weight: '',
          tags: '', 
          variants: `[
  {
    "options": {
      "Color": "Black",
      "Style": "T-Shirt",
      "Size": "M"
    },
    "price": 20,
    "quantity": 10
  }
]`,
          image: null 
        });
        
        // Clear file input
        const fileInput = document.getElementById('product-image');
        if (fileInput) fileInput.value = '';
        
      } catch (err) {
        console.error('Error creating product:', err);
        setErrorMsg(err.response?.data?.message || err.message || 'Failed to create product');
      } finally {
        setLoading(false);
      }
    };

    if (form.image) {
      reader.readAsDataURL(form.image);
    }
  };

  return (
    <div className="admin-form-container">
      {/* Messages */}
      {successMsg && (
        <div className="admin-message admin-message-success">
          <div className="admin-message-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="20,6 9,17 4,12"/>
            </svg>
          </div>
          {successMsg}
        </div>
      )}

      {errorMsg && (
        <div className="admin-message admin-message-error">
          <div className="admin-message-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="15" y1="9" x2="9" y2="15"/>
              <line x1="9" y1="9" x2="15" y2="15"/>
            </svg>
          </div>
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="admin-form">
        {/* Basic Information Section */}
        <div className="form-section">
          <h3 className="form-section-title">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14,2 14,8 20,8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
              <polyline points="10,9 9,9 8,9"/>
            </svg>
            Basic Information
          </h3>
          
          <div className="form-grid">
            <div className="form-group form-group-full">
              <label htmlFor="title" className="form-label">Product Title *</label>
              <input
                id="title"
                name="title"
                type="text"
                className="form-control"
                value={form.title}
                onChange={handleChange}
                placeholder="Enter product title"
                required
                disabled={loading}
              />
            </div>

            <div className="form-group form-group-full">
              <label htmlFor="description" className="form-label">Description *</label>
              <textarea
                id="description"
                name="description"
                className="form-control form-textarea"
                value={form.description}
                onChange={handleChange}
                placeholder="Describe your product..."
                rows="4"
                required
                disabled={loading}
              />
            </div>
          </div>
        </div>

        {/* Pricing & Inventory Section */}
        <div className="form-section">
          <h3 className="form-section-title">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="1" x2="12" y2="23"/>
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
            </svg>
            Pricing & Inventory
          </h3>
          
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="price" className="form-label">Price ($) *</label>
              <input
                id="price"
                name="price"
                type="number"
                step="0.01"
                min="0"
                className="form-control"
                value={form.price}
                onChange={handleChange}
                placeholder="0.00"
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="quantity" className="form-label">Quantity *</label>
              <input
                id="quantity"
                name="quantity"
                type="number"
                min="0"
                className="form-control"
                value={form.quantity}
                onChange={handleChange}
                placeholder="0"
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="weight" className="form-label">Weight (oz)</label>
              <input
                id="weight"
                name="weight"
                type="number"
                step="0.1"
                min="0"
                className="form-control"
                value={form.weight}
                onChange={handleChange}
                placeholder="0.0"
                disabled={loading}
              />
            </div>
          </div>
        </div>

        {/* Product Details Section */}
        <div className="form-section">
          <h3 className="form-section-title">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
              <line x1="7" y1="7" x2="7.01" y2="7"/>
            </svg>
            Product Details
          </h3>
          
          <div className="form-grid">
            <div className="form-group form-group-full">
              <label htmlFor="tags" className="form-label">Tags</label>
              <input
                id="tags"
                name="tags"
                type="text"
                className="form-control"
                value={form.tags}
                onChange={handleChange}
                placeholder="horror, dark, gothic, merchandise (comma-separated)"
                disabled={loading}
              />
              <div className="form-help">
                Separate tags with commas to help customers find your products
              </div>
            </div>

            <div className="form-group form-group-full">
              <label htmlFor="variants" className="form-label">Product Variants (JSON)</label>
              <textarea
                id="variants"
                name="variants"
                className="form-control form-textarea-code"
                value={form.variants}
                onChange={handleChange}
                placeholder="Enter variants in JSON format"
                rows="8"
                disabled={loading}
              />
              <div className="form-help">
                Define product options like colors, sizes, and styles in JSON format
              </div>
            </div>
          </div>
        </div>

        {/* Image Upload Section */}
        <div className="form-section">
          <h3 className="form-section-title">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
              <circle cx="8.5" cy="8.5" r="1.5"/>
              <polyline points="21,15 16,10 5,21"/>
            </svg>
            Product Image
          </h3>
          
          <div className="form-grid">
            <div className="form-group form-group-full">
              <label className="form-label">Upload Image *</label>
              <div 
                className={`file-upload-area ${dragActive ? 'drag-active' : ''} ${form.image ? 'has-file' : ''}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  id="product-image"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="file-input"
                  required
                  disabled={loading}
                />
                
                <div className="file-upload-content">
                  {form.image ? (
                    <div className="file-preview">
                      <img 
                        src={URL.createObjectURL(form.image)} 
                        alt="Preview" 
                        className="preview-image"
                      />
                      <div className="file-info">
                        <div className="file-name">{form.image.name}</div>
                        <div className="file-size">
                          {(form.image.size / (1024 * 1024)).toFixed(2)} MB
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="file-upload-placeholder">
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                        <polyline points="7,10 12,15 17,10"/>
                        <line x1="12" y1="15" x2="12" y2="3"/>
                      </svg>
                      <p>Drop an image here or click to select</p>
                      <span>PNG, JPG, WEBP up to 10MB</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="form-actions">
          <button 
            type="submit" 
            className="btn btn-primary admin-submit"
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="btn-spinner"></div>
                Creating Product...
              </>
            ) : (
              <>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="20,6 9,17 4,12"/>
                </svg>
                Create Product
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}