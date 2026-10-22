'use client';

import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useCBESuperApp } from '../context/CBESuperAppContext';
import { formatCurrency } from '../data/products';

interface PaymentButtonProps {
  onPaymentSuccess: () => void;
}

export default function PaymentButton({ onPaymentSuccess }: PaymentButtonProps) {
  const { total, deliveryOption, createOrder, items } = useCart();
  const { initiatePayment, paymentResult, clearPaymentResult } = useCBESuperApp();
  const [isProcessing, setIsProcessing] = useState(false);

  const isDisabled = items.length === 0 || !deliveryOption || isProcessing;

  useEffect(() => {
    if (paymentResult) {
      setIsProcessing(false);

      if (paymentResult.success || paymentResult.transaction_status === 'PAID') {
        onPaymentSuccess();
      }


      clearPaymentResult();
    }
  }, [paymentResult, onPaymentSuccess, clearPaymentResult]);

  const handlePayment = () => {
    if (isDisabled) return;

    setIsProcessing(true);

    const order = createOrder();

    initiatePayment(
      total,
      order.id,
      `Choice-Shop Order - ${items.length} item(s)`
    );
  };

  return (
    <button
      className={`payment-btn ${isProcessing ? 'processing' : ''}`}
      onClick={handlePayment}
      disabled={isDisabled}
    >
      {isProcessing ? (
        <>
          <span className="spinner" />
          Processing Payment...
        </>
      ) : (
        <>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="payment-icon">
            <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
            <line x1="1" y1="10" x2="23" y2="10" />
          </svg>
          Pay with Choice SuperApp
          <span className="payment-amount">{formatCurrency(total)}</span>
        </>
      )}
    </button>
  );
}

