import { useState } from 'react';
import AddProductForm from './AddProductForm';
import ListProductTable from './ListProductTable';
import './Admin.css';

export default function AdminHome() {
  const [tab, setTab] = useState('list');

  return (
    <div className="admin-page">
      <div className="container-modern">
        {/* Header Section */}
        <div className="admin-header">
          <div className="admin-header-content">
            <div className="admin-title-section">
              <div className="admin-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 3v18h18"/>
                  <path d="M18 17V9"/>
                  <path d="M13 17V5"/>
                  <path d="M8 17v-3"/>
                </svg>
              </div>
              <div>
                <h1 className="admin-title">Admin Dashboard</h1>
                <p className="admin-subtitle">Manage your Living Dead Design Co. inventory</p>
              </div>
            </div>
            
            <div className="admin-stats">
              <div className="admin-stat">
                <div className="stat-icon">📦</div>
                <div>
                  <div className="stat-label">Total Products</div>
                  <div className="stat-value">--</div>
                </div>
              </div>
              <div className="admin-stat">
                <div className="stat-icon">💰</div>
                <div>
                  <div className="stat-label">Active Items</div>
                  <div className="stat-value">--</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="admin-nav">
          <div className="admin-tabs">
            <button 
              className={`admin-tab ${tab === 'list' ? 'active' : ''}`}
              onClick={() => setTab('list')}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
              </svg>
              <span>View Products</span>
              <div className="tab-indicator"></div>
            </button>
            
            <button 
              className={`admin-tab ${tab === 'add' ? 'active' : ''}`}
              onClick={() => setTab('add')}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="5" x2="12" y2="19"/>
                <line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              <span>Add Product</span>
              <div className="tab-indicator"></div>
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="admin-content">
          {tab === 'list' && (
            <div className="admin-section">
              <div className="admin-section-header">
                <h2 className="section-title">Product Inventory</h2>
                <p className="section-subtitle">
                  Manage your existing products, inventory levels, and pricing
                </p>
              </div>
              <div className="admin-section-content">
                <ListProductTable />
              </div>
            </div>
          )}
          
          {tab === 'add' && (
            <div className="admin-section">
              <div className="admin-section-header">
                <h2 className="section-title">Add New Product</h2>
                <p className="section-subtitle">
                  Create a new product listing for your horror-themed merchandise
                </p>
              </div>
              <div className="admin-section-content">
                <AddProductForm />
              </div>
            </div>
          )}
        </div>

        {/* Background Decoration */}
        <div className="admin-decoration">
          <div className="admin-circle admin-circle-1"></div>
          <div className="admin-circle admin-circle-2"></div>
          <div className="admin-circle admin-circle-3"></div>
        </div>
      </div>
    </div>
  );
}