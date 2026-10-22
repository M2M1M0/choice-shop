'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Header from './components/Header';
import ProductCard from './components/ProductCard';
import CartDrawer from './components/CartDrawer';
import CategoryFilter from './components/CategoryFilter';
import LoginPage from './components/LoginPage';
import { products, categories } from './data/products';
import { useCBESuperApp } from './context/CBESuperAppContext';
import { Loader2 } from 'lucide-react';


export default function HomePage() {
  const { isAuthenticated, isLoading } = useCBESuperApp();
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');


  useEffect(() => {
    if (typeof window !== 'undefined') {
      import('vconsole').then((VConsole) => {
        new VConsole.default({
          theme: 'dark', // Optional: 'light' or 'dark'

        });
      }).catch((error) => {
        console.error('Failed to load VConsole:', error);
      });
    }
  }, []);



  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesCategory = activeCategory === 'all' || product.category === activeCategory;
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);


  if (!isAuthenticated && !isLoading) {
    return <LoginPage />;
  }


  // Show loading state
  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="loading-content">
          <Loader2 className="loading-spinner-icon animate-spin" />
          <p className="loading-text">Connecting to Choice SuperApp...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <Header />

      <CartDrawer />

      <main className="main-content">
        {/* Hero Section */}
        <section className="hero">
          <div className="hero-content">
            <span className="hero-badge">🇪🇹 Ethiopian Marketplace</span>
            <h1 className="hero-title">
              Discover <span className="highlight">Authentic</span> Ethiopian Products
            </h1>
            <p className="hero-subtitle">
              From premium coffee to handcrafted goods — experience the rich heritage of Ethiopia delivered to your doorstep.
            </p>
          </div>
          <div className="hero-decoration">
            <div className="deco-circle deco-1" />
            <div className="deco-circle deco-2" />
            <div className="deco-circle deco-3" />
          </div>
        </section>

        {/* Search Bar */}
        <div className="search-section">
          <div className="search-container">
            <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
            <input
              type="text"
              className="search-input"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button className="search-clear" onClick={() => setSearchQuery('')}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Categories */}
        <CategoryFilter
          categories={categories}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />

        {/* Products Grid */}
        <section className="products-section">
          <div className="section-header">
            <h2 className="section-title">
              {activeCategory === 'all' ? 'All Products' : categories.find(c => c.id === activeCategory)?.name}
            </h2>
            <span className="product-count">{filteredProducts.length} items</span>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="no-products">
              <span className="no-products-icon">🔍</span>
              <p>No products found</p>
              <button className="reset-btn" onClick={() => { setActiveCategory('all'); setSearchQuery(''); }}>
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="products-grid">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <p>Powered by <strong>CBE SuperApp</strong></p>
          <p className="footer-tagline">Shop local, support Ethiopian artisans 🇪🇹</p>
        </div>
      </footer>
    </div>
  );
}
