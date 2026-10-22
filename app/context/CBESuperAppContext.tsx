'use client';

import React, { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import type { PaymentResult, PermissionResult, LocationResult, OrderPayload, AuthPayload } from '../types';
import axios from 'axios';

// SDK Configuration - Replace with actual values from CBE
const SDK_CONFIG = {
  appCode: 'C61nWLWF',//'LE5s6Zu0',
  merchantCode: '908115214270684',//'MERCHANT_001',
  apiKey: process.env.NEXT_PUBLIC_CBE_API_KEY || '',
  appName: 'Choice Mini Shop',
  apiBaseUrl: 'https://qaapisuperapp.cbe.com.et/api/v1/cbesuperapp',
};

interface CBESuperAppContextType {
  isSDKAvailable: boolean;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  location: LocationResult | null;
  permissions: PermissionResult[];
  paymentResult: PaymentResult | null;
  cameraPermission: 'granted' | 'rejected' | 'pending';
  login: () => void;
  logout: () => void;
  initiatePayment: (amount: number, reference: string, title: string) => void;
  requestLocationPermission: () => void;
  requestCameraPermission: () => void;
  getCurrentLocation: () => void;
  clearPaymentResult: () => void;
  openCamera: (callback: (result: string) => void) => void;
}

const CBESuperAppContext = createContext<CBESuperAppContextType | undefined>(undefined);

export function CBESuperAppProvider({ children }: { children: ReactNode }) {
  const [isSDKAvailable, setIsSDKAvailable] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [location, setLocation] = useState<LocationResult | null>(null);
  const [permissions, setPermissions] = useState<PermissionResult[]>([]);
  const [paymentResult, setPaymentResult] = useState<PaymentResult | null>(null);
  const [cameraPermission, setCameraPermission] = useState<'granted' | 'rejected' | 'pending'>('pending');
  const [cameraCallback, setCameraCallback] = useState<((result: string) => void) | null>(null);

  // Initialize SDK and set up callbacks
  useEffect(() => {
    const checkSDK = () => {
      if (typeof window !== 'undefined' && window.cbesuperapp) {
        setIsSDKAvailable(true);
        return true;
      }
      return false;
    };




    // Set up callback handlers
    window.handleAccessToken = async (customerIdentifier: string) => {
      console.log('Access UserIdentifier received From Choice SuperApp:', customerIdentifier);

      try {
        setIsLoading(true);


        const response = await axios.post(
          '/api/cbe-client-token',
          {
            app_code: SDK_CONFIG.appCode,
            // customer_identifier: customerIdentifier,
          },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        console.log('Choice API Response:', response.data);

        const clientToken = response.data?.token || response.data?.data?.token || response.data?.access_token;

        if (clientToken) {
          setAccessToken(clientToken);
          setIsLoading(false);

          // Store tokens in session
          if (typeof sessionStorage !== 'undefined') {
            sessionStorage.setItem('cbe_access_token', customerIdentifier);
            sessionStorage.setItem('cbe_client_token', clientToken);
          }

          console.log('Login successful, token stored');
        } else {
          throw new Error('No token received from API');
        }
      } catch (error) {
        console.error('Error calling Choice API:', error);
        setIsLoading(false);

        // setAccessToken(customerIdentifier);
        if (typeof sessionStorage !== 'undefined') {
          sessionStorage.setItem('cbe_access_token', customerIdentifier);
        }
      }
    };

    window.handlePaymentResult = (result: PaymentResult) => {
      console.log('Payment Result:', result);
      setPaymentResult(result);
    };

    window.handlePermissionResult = (result: PermissionResult[] | string) => {
      if (result === 'error') {
        console.error('Permission request failed');
        return;
      }
      console.log('Location Permission Result:', result);
      setPermissions(result as PermissionResult[]);

      const cameraPerm = (result as PermissionResult[]).find(p => p.permission === 'Camera');
      if (cameraPerm) {
        setCameraPermission(cameraPerm.status);
      }

      // If location permission granted, fetch location
      const locationPerm = (result as PermissionResult[]).find(p => p.permission === 'Location');
      if (locationPerm?.status === 'granted') {
        console.log('Location permission granted, fetching location');
        getCurrentLocation();
      }
    };

    window.handleLocationResult = (result: LocationResult) => {
      console.log('Location Result:', result);
      setLocation(result);
    };

    // Camera scan result handler
    (window as any).handleCameraResult = (result: string) => {
      console.log('Camera/Scan Result:', result);
      if (cameraCallback) {
        cameraCallback(result);
        setCameraCallback(null);
      }
    };

    // Check SDK availability
    checkSDK();

    const handleAccessToken = async (customerIdentifier: string) => {
      console.log('Access UserIdentifier received From Choice SuperApp:', customerIdentifier);

      try {
        setIsLoading(true);


        const response = await axios.post(
          '/api/cbe-client-token',
          {
            app_code: SDK_CONFIG.appCode,
            // customer_identifier: customerIdentifier,
          },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        console.log('Choice API Response:', response.data);

        const clientToken = response.data?.token || response.data?.data?.token || response.data?.access_token;

        if (clientToken) {
          setAccessToken(clientToken);
          setIsLoading(false);

          if (typeof sessionStorage !== 'undefined') {
            sessionStorage.setItem('cbe_access_token', customerIdentifier);
            sessionStorage.setItem('cbe_client_token', clientToken);
          }

          console.log('Login successful, token stored');
        } else {
          throw new Error('No token received from API');
        }
      } catch (error) {
        console.error('Error calling CBE API:', error);
        setIsLoading(false);

        // setAccessToken(customerIdentifier);
        if (typeof sessionStorage !== 'undefined') {
          sessionStorage.setItem('cbe_access_token', customerIdentifier);
        }
      }
    };

    handleAccessToken('1234567890');




    if (typeof sessionStorage !== 'undefined') {
      const storedToken = sessionStorage.getItem('cbe_access_token');
      if (storedToken) {
        setAccessToken(storedToken);
      }
    }

    return () => {
      delete window.handleAccessToken;
      delete window.handlePaymentResult;
      delete window.handlePermissionResult;
      delete window.handleLocationResult;
      delete (window as any).handleCameraResult;
    };
  }, [cameraCallback]);

  const login = useCallback(() => {
    setIsLoading(true);

    if (!window.cbesuperapp) {
      console.log('SDK not available - simulating login');
      // Simulate login for testing
      setTimeout(() => {
        console.log('Simulating login for testing');
        const demoToken = 'demo_token_' + Date.now();
        setAccessToken(demoToken);
        setIsLoading(false);
        if (typeof sessionStorage !== 'undefined') {
          sessionStorage.setItem('cbe_access_token', demoToken);
        }
      }, 1500);
      return;
    }

    console.log('Fetching access token from Choice SuperApp');

    const payload = JSON.stringify({
      functionName: 'fetchAccessToken',
      params: {
        appcode: SDK_CONFIG.appCode,
        callbackName: 'handleAccessToken',
      },
    });

    window.cbesuperapp.send(payload);
  }, []);

  const logout = useCallback(() => {
    setAccessToken(null);
    setPermissions([]);
    setLocation(null);
    setCameraPermission('pending');
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.removeItem('cbe_access_token');
      sessionStorage.removeItem('cbe_client_token');
    }
  }, []);

  //handleAccessToken('1234567890');


  const initiatePayment = useCallback(async (amount: number, reference: string, title: string) => {

    if (!window.cbesuperapp) {
      console.log('SDK not available for payment');
      setTimeout(() => {
        setPaymentResult({
          success: true,
          ft_number: 'FT' + Date.now(),
          payment_details: {
            app_id: SDK_CONFIG.appCode,
            merchant_code: SDK_CONFIG.merchantCode,
            merchant_reference: reference,
            title: title,
            total_amount: amount,
            currency: 'ETB',
          },
          message: 'Payment confirmed (Demo)',
          transaction_status: 'PAID',
        });
      }, 2000);
      return;
    }

    const orderBase = {
      app_code: 'C61nWLWF',//'092999', // SDK_CONFIG.appCode,
      merchant_code: '908115214270684',//,'003411488457437', // SDK_CONFIG.merchantCode,
      merchant_reference: reference,
      title,
      total_amount: amount,
      currency: 'ETB',
    };

    const authRes = await fetch('/api/cbe-generate-order-auth', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...orderBase,
        // For signing, total_amount must be a number (not a string).
        total_amount: amount,
        // credit_account_number is optional; if omitted, proxy uses "".
      }),
    });

    if (!authRes.ok) {
      const errText = await authRes.text().catch(() => '');
      throw new Error(`Failed to generate order auth (${authRes.status}): ${errText}`);
    }

    const { sign, confirm_payload } = (await authRes.json()) as {
      sign: string;
      confirm_payload: string;
    };

    const orderPayload: OrderPayload = {
      ...orderBase,
      sign,
      confirm_payload,
    };

    const authPayload: AuthPayload = {
      xApiKey: SDK_CONFIG.apiKey,
      xAccessToken: accessToken || '',
    };

    const paymentRequest = JSON.stringify({
      functionName: 'initiatePayment',
      params: {
        orderPayload,
        authPayload,
        callbackName: 'handlePaymentResult',
        appName: SDK_CONFIG.appName,
      },
    });

    window.cbesuperapp.send(paymentRequest);
  }, [accessToken]);

  const requestLocationPermission = useCallback(() => {
    if (!window.cbesuperapp) {
      console.log('SDK not available for permissions');
      setPermissions([{ permission: 'Location', status: 'granted' }]);
      return;
    }

    const permissionRequest = JSON.stringify({
      functionName: 'requestPermissions',
      params: {
        permissions: ['Location'],
        callbackName: 'handlePermissionResult',
      },
    });

    window.cbesuperapp.send(permissionRequest);
  }, []);

  const requestCameraPermission = useCallback(() => {
    if (!window.cbesuperapp) {
      console.log('SDK not available for camera permission - simulating');
      setCameraPermission('granted');
      setPermissions(prev => [...prev.filter(p => p.permission !== 'Camera'), { permission: 'Camera', status: 'granted' }]);
      return;
    }

    const permissionRequest = JSON.stringify({
      functionName: 'requestPermissions',
      params: {
        permissions: ['Camera'],
        callbackName: 'handlePermissionResult',
      },
    });

    window.cbesuperapp.send(permissionRequest);
  }, []);

  const getCurrentLocation = useCallback(() => {
    if (!window.cbesuperapp) {
      console.log('SDK not available for location');
      setLocation({ latitude: 9.0054, longitude: 38.7636 });
      return;
    }

    const locationRequest = JSON.stringify({
      functionName: 'fetchCurrentLocation',
      params: {
        callbackName: 'handleLocationResult',
      },
    });

    window.cbesuperapp.send(locationRequest);
  }, []);

  const openCamera = useCallback((callback: (result: string) => void) => {
    setCameraCallback(() => callback);

    if (!window.cbesuperapp) {
      console.log('SDK not available for camera - simulating scan');
      // Simulate a barcode scan result
      setTimeout(() => {
        callback('PRODUCT_' + Math.random().toString(36).substring(7).toUpperCase());
      }, 1500);
      return;
    }

    const cameraRequest = JSON.stringify({
      functionName: 'openCamera',
      params: {
        mode: 'scan', // or 'photo'
        callbackName: 'handleCameraResult',
      },
    });

    window.cbesuperapp.send(cameraRequest);
  }, []);

  const clearPaymentResult = useCallback(() => {
    setPaymentResult(null);
  }, []);

  return (
    <CBESuperAppContext.Provider
      value={{
        isSDKAvailable,
        accessToken,
        isAuthenticated: !!accessToken,
        isLoading,
        location,
        permissions,
        paymentResult,
        cameraPermission,
        login,
        logout,
        initiatePayment,
        requestLocationPermission,
        requestCameraPermission,
        getCurrentLocation,
        clearPaymentResult,
        openCamera,
      }}
    >
      {children}
    </CBESuperAppContext.Provider>
  );
}

export function useCBESuperApp() {
  const context = useContext(CBESuperAppContext);
  if (context === undefined) {
    throw new Error('useCBESuperApp must be used within a CBESuperAppProvider');
  }
  return context;
}
