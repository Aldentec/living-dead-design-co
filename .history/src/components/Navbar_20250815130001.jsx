import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function ModernNavbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, isAdmin, signOut } = useAuth();
  const { cart } = useCart();
  const location = useLocation();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  const navLinks = [
    { path: '/shop', label: 'Shop' },
    { path: '/custom', label: 'Custom' },
    { path: '/gallery', label: 'Gallery' },
    { path: '/about', label: 'About' },
  ];

  return (
    <nav className={`navbar-modern ${isScrolled ? 'scrolled' : ''}`}>
      <div className="container-modern">
        <div className="navbar-content">
          {/* Brand Logo */}
          <Link to="/" className="navbar-brand">
            Living Dead Design Co.
          </Link>

          {/* Desktop Navigation */}
          <ul className={`navbar-nav ${isMobileMenuOpen ? 'open' : ''}`}>
            {navLinks.map((link) => (
              <li key={link.path}>
                <Link 
                  to={link.path} 
                  className={`nav-link ${isActiveRoute(link.path) ? 'active' : ''}`}
                >
                  {link.label}
                </Link>
              </li>
            ))}

            {/* User Menu */}
            {user ? (
              <li className="user-menu">
                <div className="dropdown">
                  <button 
                    className="btn btn-ghost btn-sm dropdown-toggle"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'var(--space-2)',
                    }}
                  >
                    <div 
                      className="user-avatar"
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: 'var(--radius-full)',
                        background: 'var(--color-accent-gradient)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: 'var(--text-sm)',
                        fontWeight: 'var(--font-weight-bold)',
                      }}
                    >
                      {user.email?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <span>Account</span>
                  </button>
                  
                  <div className="dropdown-menu">
                    <Link to="/account" className="dropdown-item">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                        <circle cx="12" cy="7" r="4"/>
                      </svg>
                      Profile
                    </Link>
                    
                    {isAdmin && (
                      <Link to="/admin" className="dropdown-item">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="3"/>
                          <path d="M12 1v6m0 6v6"/>
                          <path d="m21 12-6-6-6 6-6-6"/>
                        </svg>
                        Admin
                      </Link>
                    )}
                    
                    <button 
                      onClick={signOut}
                      className="dropdown-item"
                      style={{ width: '100%', textAlign: 'left' }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                        <polyline points="16,17 21,12 16,7"/>
                        <line x1="21" y1="12" x2="9" y2="12"/>
                      </svg>
                      Sign Out
                    </button>
                  </div>
                </div>
              </li>