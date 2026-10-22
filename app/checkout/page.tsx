'use client';

import React, { useState, useCallback } from 'react';
import Link from 'next/link';
import { useCart } from '../context/CartContext';
import DeliverySelector from '../components/DeliverySelector';
import OrderSummary from '../components/OrderSummary';
import PaymentButton from '../components/PaymentButton';
import { deliveryOptions } from '../data/products';

type CheckoutStep = 'delivery' | 'payment' | 'success';

export default function CheckoutPage() {
  const { items, deliveryOption, setDeliveryOption, clearCart, currentOrder } = useCart();
  const [currentStep, setCurrentStep] = useState<CheckoutStep>('delivery');

  const handlePaymentSuccess = useCallback(() => {
    setCurrentStep('success');
  }, []);

  const handleNewOrder = () => {
    clearCart();
  };


  if (items.length === 0 && currentStep !== 'success') {
    return (
      <div className="checkout-page">
        <div className="checkout-empty">
          <span className="empty-icon">🛒</span>
          <h2>Your cart is empty</h2>
          <p>Add some products before checking out</p>
          <Link href="/" className="back-to-shop-btn">
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  // Success state
  if (currentStep === 'success') {
    return (
      <div className="checkout-page">
        <div className="checkout-success">
          <div className="success-animation">
            <div className="success-circle">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
          </div>
          <h1>Payment Successful!</h1>
          <p className="success-order-id">Order ID: {currentOrder?.id}</p>
          <div className="success-details">
            <div className="detail-item">
              <span className="detail-label">Status</span>
              <span className="detail-value status-paid">Paid</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Delivery</span>
              <span className="detail-value">{currentOrder?.deliveryOption.name}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Estimated Time</span>
              <span className="detail-value">{currentOrder?.deliveryOption.estimatedTime}</span>
            </div>
          </div>
          <p className="success-message">
            Thank you for shopping with Choice-Shop! 🎉<br />
            You will receive updates about your order.
          </p>
          <Link href="/" className="new-order-btn" onClick={handleNewOrder}>
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      {/* Header */}
      <header className="checkout-header">
        <Link href="/" className="back-btn">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          Back
        </Link>
        <h1 className="checkout-title">Checkout</h1>
        <div className="spacer" />
      </header>

      {/* Progress Steps */}
      <div className="checkout-progress">
        <div className={`progress-step ${currentStep === 'delivery' ? 'active' : ''} ${deliveryOption ? 'completed' : ''}`}>
          <div className="step-indicator">
            {deliveryOption ? (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            ) : '1'}
          </div>
          <span>Delivery</span>
        </div>
        <div className="progress-line" />
        <div className={`progress-step ${currentStep === 'payment' ? 'active' : ''}`}>
          <div className="step-indicator">2</div>
          <span>Payment</span>
        </div>
      </div>

      {/* Main Content */}
      <main className="checkout-content">
        {/* Delivery Selection */}
        <section className={`checkout-section ${currentStep === 'delivery' ? 'active' : ''}`}>
          <DeliverySelector
            options={deliveryOptions}
            selectedOption={deliveryOption}
            onSelect={setDeliveryOption}
          />
          {deliveryOption && (
            <button
              className="continue-btn"
              onClick={() => setCurrentStep('payment')}
            >
              Continue
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </button>
          )}
        </section>

        {/* Location Selection */}
        {/* {needsLocation && (
          <section className={`checkout-section ${currentStep === 'location' ? 'active' : ''}`}>
            <LocationPicker
              address={deliveryAddress}
              onAddressSet={handleAddressSet}
            />
            {deliveryAddress && (
              <button 
                className="continue-btn"
                onClick={() => setCurrentStep('payment')}
              >
                Continue to Payment
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </button>
            )}
          </section>
        )} */}


        <section className={`checkout-section ${currentStep === 'payment' ? 'active' : ''}`}>
          <OrderSummary />
          <PaymentButton onPaymentSuccess={handlePaymentSuccess} />

          <div className="payment-security">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0110 0v4" />
            </svg>
            <span>Secured by Choice SuperApp Payment Gateway</span>
          </div>
        </section>
      </main>
    </div>
  );
}

