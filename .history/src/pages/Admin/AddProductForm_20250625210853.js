import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

export default function AddProductForm() {
  const { user } = useAuth();
  const [form, setForm] = useState({
    title: '',
    description: '',
    price: '',
    tags: '',
    image: null,
  });
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    setForm(prev => ({ ...prev, image: file }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg('');

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64Image = reader.result;

      const payload = {
        title: form.title,
        description: form.description,
        price: parseFloat(form.price),
        tags: form.tags.split(',').map(tag => tag.trim()),
        imageBase64: base64Image,
      };

      try {
        const res = await axios.post('https://nbwke3grerscqtfchrbl6txcti0rgeip.lambda-url.us-west-2.on.aws/items', payload, {
          headers: {
            Authorization: `Bearer ${user.idToken}`,
          },
        });

        setSuccessMsg('Product created successfully!');
        setForm({ title: '', description: '', price: '', tags: '', image: null });
      } catch (err) {
        alert('Error: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    if (form.image) {
      reader.readAsDataURL(form.image);
    }
  };

  return (
    <div className="admin-card p-4">
      <h4 className="mb-4"> Add New Product</h4>

      {successMsg && <div className="alert alert-success">{successMsg}</div>}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Title</label>
          <input type="text" name="title" className="form-control" value={form.title} onChange={handleChange} required />
        </div>

        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea name="description" className="form-control" value={form.description} onChange={handleChange} required />
        </div>

        <div className="mb-3">
          <label className="form-label">Price</label>
          <input type="number" step="0.01" name="price" className="form-control" value={form.price} onChange={handleChange} required />
        </div>

        <div className="mb-3">
          <label className="form-label">Tags (comma-separated)</label>
          <input type="text" name="tags" className="form-control" value={form.tags} onChange={handleChange} />
        </div>

        <div className="mb-3">
          <label className="form-label">Image</label>
          <input type="file" accept="image/*" className="form-control" onChange={handleImage} required />
        </div>

        <button type="submit" className="btn admin-btn" disabled={loading}>
          {loading ? 'Uploading...' : 'Create Product'}
        </button>
      </form>
    </div>
  );
}
