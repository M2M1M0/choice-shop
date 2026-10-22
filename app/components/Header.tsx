'use client';

import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useCBESuperApp } from '../context/CBESuperAppContext';
import Link from 'next/link';
import Scanner from './Scanner';

export default function Header() {
  const { itemCount, openCart } = useCart();
  const { logout } = useCBESuperApp();
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Close side menu on Escape and prevent body scrolling when open
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMenuOpen]);

  return (
    <>
      <header className="header">
        <div className="header-content">
          <Link href="/" className="logo">
            <span className="logo-icon">🛍️</span>
            <span className="logo-text">Choice <span className="logo-accent">Shop</span></span>
          </Link>

          <div className="header-actions">
            {/* Scan Button */}
            {/* <button
              className="scan-header-btn"
              onClick={() => setIsScannerOpen(true)}
              aria-label="Scan product"
              title="Scan product"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="7" height="7" />
                <rect x="14" y="3" width="7" height="7" />
                <rect x="14" y="14" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" />
              </svg>
            </button> */}

            {/* Cart Button */}
            <button className="cart-btn" onClick={openCart} aria-label="Open cart" title="Shopping cart">
              <svg className="cart-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 01-8 0" />
              </svg>
              {itemCount > 0 && (
                <span className="cart-badge">{itemCount}</span>
              )}
            </button>

            {/* User Profile Button */}
            <button
              className="user-btn"
              onClick={() => setIsMenuOpen(true)}
              aria-label="Open user menu"
              title="User menu"
            >
              <svg className="user-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              <span className="user-status-dot" aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>

      {/* User Side Drawer Backdrop */}
      <div
        className={`user-backdrop ${isMenuOpen ? 'open' : ''}`}
        onClick={() => setIsMenuOpen(false)}
        aria-hidden={!isMenuOpen}
      />

      {/* User Side Drawer */}
      <aside
        className={`user-drawer ${isMenuOpen ? 'open' : ''}`}
        aria-label="User account and settings"
      >
        {/* Drawer Header */}
        <div className="user-drawer-header">
          <h2 className="user-drawer-title">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="user-drawer-title-icon">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            My Account
          </h2>
          <button
            className="close-btn"
            onClick={() => setIsMenuOpen(false)}
            aria-label="Close user menu"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Drawer Body */}
        <div className="user-drawer-body">
          {/* Profile Card */}
          <div className="user-profile-card">
            <div className="user-profile-avatar-wrap">
              <div className="user-profile-avatar">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
              <span className="user-profile-pulse" title="Connected" />
            </div>
            <div className="user-profile-details">
              <div className="user-profile-name-row">
                <h3 className="user-profile-name">Choice User</h3>
              </div>
              <p className="user-profile-sub">Connected via Choice SuperApp</p>
              <div className="user-profile-status">
                <span className="user-status-dot-sm" />
                <span>Wallet & Payments Active</span>
              </div>
            </div>
          </div>

          {/* Quick Stats / Action Row */}
          <div className="user-quick-stats">
            <div
              className="user-stat-card"
              onClick={() => {
                setIsMenuOpen(false);
                openCart();
              }}
              role="button"
              tabIndex={0}
            >
              <span className="user-stat-label">Active Cart</span>
              <span className="user-stat-val">
                🛒 {itemCount} {itemCount === 1 ? 'item' : 'items'}
              </span>
            </div>
            <div
              className="user-stat-card"
              onClick={() => {
                setIsMenuOpen(false);
                setIsScannerOpen(true);
              }}
              role="button"
              tabIndex={0}
            >
              <span className="user-stat-label">Quick Scan</span>
              <span className="user-stat-val">📷 Barcode</span>
            </div>
          </div>

          {/* Navigation Items - Group 1: Shopping */}
          <div className="user-menu-section">
            <span className="user-section-title">Shop & Scan</span>

            <button
              className="user-menu-item"
              onClick={() => {
                setIsMenuOpen(false);
                setIsScannerOpen(true);
              }}
            >
              <div className="user-menu-item-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="7" height="7" />
                  <rect x="14" y="3" width="7" height="7" />
                  <rect x="14" y="14" width="7" height="7" />
                  <rect x="3" y="14" width="7" height="7" />
                </svg>
              </div>
              <div className="user-menu-item-content">
                <div className="user-menu-item-title">Scan Product Barcode</div>
                <div className="user-menu-item-desc">Find items in-store quickly</div>
              </div>
              <svg className="user-menu-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>

            <button
              className="user-menu-item"
              onClick={() => {
                setIsMenuOpen(false);
                openCart();
              }}
            >
              <div className="user-menu-item-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <path d="M16 10a4 4 0 01-8 0" />
                </svg>
              </div>
              <div className="user-menu-item-content">
                <div className="user-menu-item-title">View Cart</div>
                <div className="user-menu-item-desc">
                  {itemCount > 0 ? `${itemCount} products waiting` : 'Your cart is empty'}
                </div>
              </div>
              {itemCount > 0 && <span className="user-menu-badge">{itemCount}</span>}
              <svg className="user-menu-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>

            <Link
              href="/checkout"
              className="user-menu-item"
              onClick={() => setIsMenuOpen(false)}
            >
              <div className="user-menu-item-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="1" y="3" width="15" height="13" />
                  <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                  <circle cx="5.5" cy="18.5" r="2.5" />
                  <circle cx="18.5" cy="18.5" r="2.5" />
                </svg>
              </div>
              <div className="user-menu-item-content">
                <div className="user-menu-item-title">Delivery & Checkout</div>
                <div className="user-menu-item-desc">Fast delivery across Addis Ababa</div>
              </div>
              <svg className="user-menu-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </Link>
          </div>


        </div>

        {/* Drawer Footer */}
        <div className="user-drawer-footer">
          <button
            className="user-logout-btn"
            onClick={() => {
              setIsMenuOpen(false);
              logout();
            }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            <span>Disconnect & Logout</span>
          </button>
          <div className="user-drawer-version">
            <span>Choice Mini Shop • v1.0.0</span>
            <span>Choice Superapp (Choice)</span>
          </div>
        </div>
      </aside>

      {/* Scanner Modal */}
      <Scanner isOpen={isScannerOpen} onClose={() => setIsScannerOpen(false)} />
    </>
  );
}
