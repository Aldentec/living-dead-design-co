import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Pool from '../awsCognito';

export default function Account() {
  const { rawUser, setUser, setRawUser } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [userAttributes, setUserAttributes] = useState({});
  const [orderHistory, setOrderHistory] = useState([]);
  const [customOrders, setCustomOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (rawUser) {
      fetchUserData();
    }
  }, [rawUser]);

  const fetchUserData = async () => {
    try {
      // Get user attributes
      rawUser.getUserAttributes((err, attributes) => {
        if (!err && attributes) {
          const attributeMap = {};
          attributes.forEach(attribute => {
            attributeMap[attribute.Name] = attribute.Value;
          });
          setUserAttributes(attributeMap);
        }
      });

      // Mock order history - you can replace with actual API calls
      setOrderHistory([
        {
          id: 'ORD-001',
          date: '2024-12-15',
          status: 'Delivered',
          total: 89.97,
          items: [
            { name: 'Gothic Skull T-Shirt', price: 29.99, quantity: 1 },
            { name: 'Dark Rose Art Print', price: 59.98, quantity: 2 }
          ]
        },
        {
          id: 'ORD-002',
          date: '2024-11-28',
          status: 'Shipped',
          total: 149.99,
          items: [
            { name: 'Raven Hoodie', price: 149.99, quantity: 1 }
          ]
        }
      ]);

      // Mock custom orders
      setCustomOrders([
        {
          id: 'CUST-001',
          date: '2024-12-10',
          status: 'In Progress',
          projectType: 'Custom Apparel',
          description: 'Gothic band t-shirt design',
          estimatedCompletion: '2025-01-15'
        },
        {
          id: 'CUST-002',
          date: '2024-11-20',
          status: 'Completed',
          projectType: 'Original Artwork',
          description: 'Digital portrait illustration',
          estimatedCompletion: '2024-12-20'
        }
      ]);

    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = () => {
    const cognitoUser = Pool.getCurrentUser();
    if (cognitoUser) {
      cognitoUser.signOut();
      setUser(null);
      setRawUser(null);
      navigate('/');
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'delivered':
      case 'completed':
        return '#22c55e';
      case 'shipped':
      case 'in progress':
        return '#f59e0b';
      case 'pending':
        return '#6b7280';
      case 'cancelled':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  if (!rawUser) {
    return (
      <div className="account-container">
        <div className="container-modern">
          <div className="account-unauthenticated">
            <div className="card card-glass text-center">
              <div style={{
                fontSize: '4rem',
                marginBottom: 'var(--space-6)',
                opacity: 0.7
              }}>
                👻
              </div>
              <h2 style={{ marginBottom: 'var(--space-4)' }}>
                Join the Dark Side
              </h2>
              <p style={{ 
                fontSize: 'var(--text-lg)',
                color: 'var(--color-text-secondary)',
                marginBottom: 'var(--space-8)',
                lineHeight: 'var(--line-height-relaxed)'
              }}>
                Sign in to access your account, view order history, track custom projects, 
                and manage your dark collection.
              </p>
              <div style={{
                display: 'flex',
                gap: 'var(--space-4)',
                justifyContent: 'center',
                flexWrap: 'wrap'
              }}>
                <Link to="/login" className="btn btn-primary btn-lg">
                  Sign In
                </Link>
                <Link to="/signup" className="btn btn-outline btn-lg">
                  Create Account
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="account-container">
      <div className="container-modern">
        {/* Account Header */}
        <div className="account-header">
          <div className="account-hero">
            <div className="account-avatar">
              <div className="avatar-circle">
                {(userAttributes.given_name || rawUser.getUsername()).charAt(0).toUpperCase()}
              </div>
            </div>
            <div className="account-info">
              <h1>
                Welcome back, {userAttributes.given_name || rawUser.getUsername()}
              </h1>
              <p style={{ 
                fontSize: 'var(--text-lg)',
                color: 'var(--color-text-secondary)',
                marginBottom: 'var(--space-2)'
              }}>
                Member since {userAttributes.email_verified ? 'Account Verified' : 'Pending Verification'}
              </p>
              <p style={{ 
                fontSize: 'var(--text-sm)',
                color: 'var(--color-text-muted)'
              }}>
                {userAttributes.email}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="account-nav">
          <div className="account-tabs">
            <button 
              className={`tab-button ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
              Profile
            </button>
            <button 
              className={`tab-button ${activeTab === 'orders' ? 'active' : ''}`}
              onClick={() => setActiveTab('orders')}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 12h6M9 16h6M3 4h18l-2 14H5L3 4z"/>
              </svg>
              Order History
            </button>
            <button 
              className={`tab-button ${activeTab === 'custom' ? 'active' : ''}`}
              onClick={() => setActiveTab('custom')}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
              Custom Orders
            </button>
            <button 
              className={`tab-button ${activeTab === 'settings' ? 'active' : ''}`}
              onClick={() => setActiveTab('settings')}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="3"/>
                <path d="m12 1 1.5 3 3 .5-1.5 3 1.5 3-3 .5L12 23l-1.5-3-3-.5 1.5-3L6 13l3-.5L10.5 9l1.5-3z"/>
              </svg>
              Settings
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="account-content">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="tab-content">
              <div className="profile-grid">
                <div className="profile-section">
                  <div className="card card-glass">
                    <h3 style={{ marginBottom: 'var(--space-6)' }}>Profile Information</h3>
                    <div className="profile-details">
                      <div className="detail-row">
                        <span className="detail-label">Username</span>
                        <span className="detail-value">{rawUser.getUsername()}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Email</span>
                        <span className="detail-value">{userAttributes.email || 'Not provided'}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Name</span>
                        <span className="detail-value">
                          {userAttributes.given_name || userAttributes.name || 'Not provided'}
                        </span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Email Verified</span>
                        <span className="detail-value">
                          <span style={{
                            padding: 'var(--space-1) var(--space-2)',
                            borderRadius: 'var(--radius)',
                            fontSize: 'var(--text-xs)',
                            fontWeight: 'var(--font-weight-medium)',
                            backgroundColor: userAttributes.email_verified === 'true' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                            color: userAttributes.email_verified === 'true' ? '#22c55e' : '#ef4444'
                          }}>
                            {userAttributes.email_verified === 'true' ? 'Verified' : 'Unverified'}
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="profile-section">
                  <div className="card card-glass">
                    <h3 style={{ marginBottom: 'var(--space-6)' }}>Account Stats</h3>
                    <div className="stats-grid">
                      <div className="stat-item">
                        <div className="stat-number">
                          {orderHistory.length}
                        </div>
                        <div className="stat-label">Total Orders</div>
                      </div>
                      <div className="stat-item">
                        <div className="stat-number">
                          {customOrders.length}
                        </div>
                        <div className="stat-label">Custom Projects</div>
                      </div>
                      <div className="stat-item">
                        <div className="stat-number">
                          ${orderHistory.reduce((sum, order) => sum + order.total, 0).toFixed(2)}
                        </div>
                        <div className="stat-label">Total Spent</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <div className="tab-content">
              <div className="orders-section">
                <div className="section-header">
                  <h3>Order History</h3>
                  <Link to="/shop" className="btn btn-outline">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                    Continue Shopping
                  </Link>
                </div>

                {orderHistory.length > 0 ? (
                  <div className="orders-list">
                    {orderHistory.map((order) => (
                      <div key={order.id} className="order-card">
                        <div className="order-header">
                          <div className="order-info">
                            <h4>Order #{order.id}</h4>
                            <p>{new Date(order.date).toLocaleDateString()}</p>
                          </div>
                          <div className="order-status">
                            <span 
                              className="status-badge"
                              style={{ 
                                backgroundColor: `${getStatusColor(order.status)}20`,
                                color: getStatusColor(order.status)
                              }}
                            >
                              {order.status}
                            </span>
                          </div>
                        </div>
                        <div className="order-items">
                          {order.items.map((item, index) => (
                            <div key={index} className="order-item">
                              <span className="item-name">{item.name}</span>
                              <span className="item-details">
                                Qty: {item.quantity} × ${item.price}
                              </span>
                            </div>
                          ))}
                        </div>
                        <div className="order-total">
                          <strong>Total: ${order.total}</strong>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="empty-state">
                    <div className="empty-icon">📦</div>
                    <h4>No orders yet</h4>
                    <p>Start building your dark collection today</p>
                    <Link to="/shop" className="btn btn-primary">
                      Browse Products
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Custom Orders Tab */}
          {activeTab === 'custom' && (
            <div className="tab-content">
              <div className="custom-orders-section">
                <div className="section-header">
                  <h3>Custom Orders</h3>
                  <Link to="/custom" className="btn btn-outline">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 5v14M5 12h14"/>
                    </svg>
                    New Custom Order
                  </Link>
                </div>

                {customOrders.length > 0 ? (
                  <div className="custom-orders-list">
                    {customOrders.map((order) => (
                      <div key={order.id} className="custom-order-card">
                        <div className="custom-order-header">
                          <div className="custom-order-info">
                            <h4>#{order.id}</h4>
                            <p className="project-type">{order.projectType}</p>
                            <p className="order-date">Submitted: {new Date(order.date).toLocaleDateString()}</p>
                          </div>
                          <div className="custom-order-status">
                            <span 
                              className="status-badge"
                              style={{ 
                                backgroundColor: `${getStatusColor(order.status)}20`,
                                color: getStatusColor(order.status)
                              }}
                            >
                              {order.status}
                            </span>
                          </div>
                        </div>
                        <div className="custom-order-description">
                          <p>{order.description}</p>
                        </div>
                        {order.estimatedCompletion && (
                          <div className="estimated-completion">
                            <small>Estimated completion: {new Date(order.estimatedCompletion).toLocaleDateString()}</small>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="empty-state">
                    <div className="empty-icon">🎨</div>
                    <h4>No custom orders yet</h4>
                    <p>Bring your dark visions to life with our custom design service</p>
                    <Link to="/custom" className="btn btn-primary">
                      Start Custom Order
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="tab-content">
              <div className="settings-section">
                <h3 style={{ marginBottom: 'var(--space-8)' }}>Account Settings</h3>
                
                <div className="settings-grid">
                  <div className="setting-card">
                    <h4>Password & Security</h4>
                    <p>Manage your account security and login preferences</p>
                    <button className="btn btn-outline">
                      Change Password
                    </button>
                  </div>

                  <div className="setting-card">
                    <h4>Email Preferences</h4>
                    <p>Control what emails you receive from us</p>
                    <button className="btn btn-outline">
                      Manage Preferences
                    </button>
                  </div>

                  <div className="setting-card">
                    <h4>Privacy Settings</h4>
                    <p>Control your privacy and data preferences</p>
                    <button className="btn btn-outline">
                      Privacy Controls
                    </button>
                  </div>

                  <div className="setting-card danger-zone">
                    <h4>Sign Out</h4>
                    <p>Sign out of your account on this device</p>
                    <button 
                      className="btn btn-danger"
                      onClick={handleSignOut}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/>
                      </svg>
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}