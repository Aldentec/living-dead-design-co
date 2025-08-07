import { useState } from 'react';
import AddProductForm from './AddProductForm';
import ListProductTable from './ListProductTable';

export default function AdminHome() {
  const [tab, setTab] = useState('add');

  return (
    <div className="container mt-5 text-light">
      <h1 className="admin-title">Admin Dashboard</h1>

      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <li className="nav-item">
            <button className={`nav-link ${tab === 'list' ? 'active' : ''}`} onClick={() => setTab('list')}>
              📦 View Products
            </button>
          </li>
          <button className={`nav-link ${tab === 'add' ? 'active' : ''}`} onClick={() => setTab('add')}>
            ➕ Add Product
          </button>
        </li>
        
      </ul>

      {tab === 'add' && <AddProductForm />}
      {tab === 'list' && <ListProductTable />}
    </div>
  );
}
