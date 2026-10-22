'use client';

import React from 'react';
import { useCBESuperApp } from '../context/CBESuperAppContext';

export default function LoginPage() {
  const { login, isLoading } = useCBESuperApp();

  return (
    <div className="login-page">
      <div className="login-bg">
        <div className="bg-pattern"></div>
        <div className="bg-gradient"></div>
      </div>

      {/* Content */}
      <div className="login-content">

        <div className="login-header">
          <div className="login-logo">
            <span className="logo-emoji">🛍️</span>
          </div>
          <h1 className="login-title">
            Choice <span className="accent">Shop</span>
          </h1>
          <p className="login-tagline">Ethiopian Marketplace</p>
        </div>

        {/* Features */}
        <div className="login-features">
          <div className="feature-item">
            <span className="feature-icon">☕</span>
            <span className="feature-text">Premium Ethiopian Coffee</span>
          </div>
          <div className="feature-item">
            <span className="feature-icon">🌶️</span>
            <span className="feature-text">Authentic Spices & Herbs</span>
          </div>
          <div className="feature-item">
            <span className="feature-icon">🧺</span>
            <span className="feature-text">Handcrafted Goods</span>
          </div>
          <div className="feature-item">
            <span className="feature-icon">🚚</span>
            <span className="feature-text">Fast Delivery Options</span>
          </div>
        </div>

        {/* Login Button */}
        <div className="login-actions">
          <button
            className={`cbe-login-btn ${isLoading ? 'loading' : ''}`}
            onClick={login}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="spinner"></span>
                <span>Connecting...</span>
              </>
            ) : (
              <>
                <div className="cbe-logo">
                  {/* <svg viewBox="0 0 40 40" fill="none">
                    <rect width="40" height="40" rx="8" fill="#0d4f3c" />
                    <text x="50%" y="55%" dominantBaseline="middle" textAnchor="middle" fill="white" fontSize="18" fontWeight="bold">Choice</text>
                  </svg> */}
                  <span className="text-sm">🛍️</span>
                </div>
                <span>Login with Choice SuperApp</span>
              </>
            )}
          </button>

          <p className="login-hint">
            Secure authentication powered by<br />
            <strong>Choice Superapp</strong>
          </p>
        </div>

        {/* Footer */}
        <div className="login-footer">
          <p>🇪🇹 Discover authentic Ethiopian products</p>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="login-decor">
        <div className="decor-circle c1"></div>
        <div className="decor-circle c2"></div>
        <div className="decor-circle c3"></div>
      </div>
    </div>
  );
}