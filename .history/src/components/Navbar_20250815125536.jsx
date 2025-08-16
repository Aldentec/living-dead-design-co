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
    <>
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
              ) : (
                <li>
                  <Link to="/login" className="nav-link">
                    Sign In
                  </Link>
                </li>
              )}

              {/* Shopping Cart */}
              <li>
                <Link to="/cart" className="cart-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="9" cy="21" r="1"/>
                    <circle cx="20" cy="21" r="1"/>
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                  </svg>
                  
                  {cart.totalItems > 0 && (
                    <span className="cart-badge">
                      {cart.totalItems > 99 ? '99+' : cart.totalItems}
                    </span>
                  )}
                  
                  <span className="sr-only">
                    Shopping cart with {cart.totalItems} items
                  </span>
                </Link>
              </li>
            </ul>

            {/* Mobile Menu Toggle */}
            <button 
              className="navbar-toggle"
              onClick={toggleMobileMenu}
              aria-label="Toggle navigation"
              aria-expanded={isMobileMenuOpen}
            >
              <span style={{
                transform: isMobileMenuOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none'
              }}></span>
              <span style={{
                opacity: isMobileMenuOpen ? 0 : 1
              }}></span>
              <span style={{
                transform: isMobileMenuOpen ? 'rotate(-45deg) translate(7px, -6px)' : 'none'
              }}></span>
            </button>
          </div>
        </div>
      </nav>

      {/* Dropdown Styles */}
      <style jsx>{`
        .dropdown {
          position: relative;
          display: inline-block;
        }

        .dropdown-toggle {
          cursor: pointer;
          border: none;
          background: transparent;
        }

        .dropdown-menu {
          position: absolute;
          top: 100%;
          right: 0;
          background: var(--color-bg-elevated);
          border: 1px solid var(--color-border-primary);
          border-radius: var(--radius-xl);
          box-shadow: var(--shadow-xl);
          min-width: 200px;
          padding: var(--space-2);
          z-index: var(--z-dropdown);
          opacity: 0;
          visibility: hidden;
          transform: translateY(-10px);
          transition: var(--transition-all);
          margin-top: var(--space-2);
        }

        .dropdown:hover .dropdown-menu,
        .dropdown:focus-within .dropdown-menu {
          opacity: 1;
          visibility: visible;
          transform: translateY(0);
        }

        .dropdown-item {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          padding: var(--space-3) var(--space-4);
          color: var(--color-text-secondary);
          text-decoration: none;
          border-radius: var(--radius-lg);
          transition: var(--transition-all);
          background: none;
          border: none;
          font-family: var(--font-body);
          font-size: var(--text-sm);
          cursor: pointer;
          width: 100%;
          white-space: nowrap;
        }

        .dropdown-item:hover,
        .dropdown-item:focus {
          background: var(--color-bg-surface);
          color: var(--color-text-primary);
          text-decoration: none;
        }

        .dropdown-item:focus {
          outline: 2px solid var(--color-accent-primary);
          outline-offset: -2px;
        }

        .dropdown-item svg {
          flex-shrink: 0;
        }

        /* Mobile Menu Overlay */
        @media (max-width: 768px) {
          .navbar-nav {
            position: fixed;
            top: 100%;
            left: 0;
            right: 0;
            background: var(--color-bg-secondary);
            flex-direction: column;
            gap: 0;
            padding: var(--space-6);
            border-radius: 0;
            box-shadow: var(--shadow-2xl);
            transform: translateY(-10px);
            opacity: 0;
            visibility: hidden;
            transition: var(--transition-all);
            max-height: calc(100vh - 100px);
            overflow-y: auto;
          }
          
          .navbar-nav.open {
            transform: translateY(0);
            opacity: 1;
            visibility: visible;
          }
          
          .nav-link {
            width: 100%;
            padding: var(--space-4);
            border-radius: var(--radius-md);
            margin-bottom: var(--space-2);
            background: var(--color-bg-surface);
            border: 1px solid var(--color-border-primary);
            text-align: center;
          }

          .nav-link:hover {
            background: var(--color-bg-elevated);
          }

          .cart-icon {
            margin: var(--space-4) auto;
            display: flex;
            justify-content: center;
          }

          .user-menu {
            margin-top: var(--space-4);
            width: 100%;
          }

          .user-menu .dropdown-toggle {
            width: 100%;
            justify-content: center;
            padding: var(--space-4);
            background: var(--color-bg-surface);
            border: 1px solid var(--color-border-primary);
            border-radius: var(--radius-md);
          }

          .user-menu .dropdown-menu {
            position: static;
            opacity: 1;
            visibility: visible;
            transform: none;
            box-shadow: none;
            border: none;
            background: transparent;
            margin-top: var(--space-4);
            padding: 0;
          }

          .dropdown-item {
            padding: var(--space-4);
            border-radius: var(--radius-md);
            background: var(--color-bg-surface);
            margin-bottom: var(--space-2);
            border: 1px solid var(--color-border-primary);
            justify-content: center;
          }
        }

        /* Mobile menu backdrop */
        @media (max-width: 768px) {
          .navbar-nav.open::before {
            content: '';
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            z-index: -1;
            backdrop-filter: blur(4px);
          }
        }

        /* Animation for mobile toggle */
        .navbar-toggle span {
          display: block;
          transition: var(--transition-all);
          transform-origin: center;
        }

        /* Ensure proper stacking for mobile menu */
        @media (max-width: 768px) {
          .navbar-modern {
            z-index: var(--z-modal);
          }
          
          .navbar-nav {
            z-index: var(--z-modal);
          }
        }

        /* Accessibility improvements */
        .dropdown-toggle:focus {
          outline: 2px solid var(--color-accent-primary);
          outline-offset: 2px;
        }

        .navbar-toggle:focus {
          outline: 2px solid var(--color-accent-primary);
          outline-offset: 2px;
        }

        /* Smooth transitions for all interactive elements */
        .nav-link,
        .cart-icon,
        .dropdown-toggle,
        .dropdown-item {
          transition: var(--transition-all);
        }

        /* Ensure text doesn't wrap in dropdown */
        .dropdown-menu {
          white-space: nowrap;
        }

        /* Better mobile cart positioning */
        @media (max-width: 768px) {
          .cart-icon {
            position: relative;
            display: inline-flex;
            padding: var(--space-3);
            background: var(--color-bg-surface);
            border: 1px solid var(--color-border-primary);
            border-radius: var(--radius-lg);
            width: auto;
            min-width: 60px;
          }
        }
      `}</style>
    </>
  );
}