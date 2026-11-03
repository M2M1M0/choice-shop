export interface ChoiceSuperAppSDK {
  send: (payload: string) => void;
}

export interface AccessTokenCallback {
  (token: string): void;
}

export interface PaymentResult {
  ft_number?: string;
  payment_details?: {
    app_id: string;
    merchant_code: string;
    merchant_reference: string;
    title: string;
    total_amount: number;
    currency: string;
  };
  message?: string;
  success?: boolean;
  transaction_status?: 'PAID' | 'FAILED' | 'PENDING';
  error?: string;
}

export interface PermissionResult {
  permission: 'Location' | 'Storage' | 'BackgroundLocation' | 'Camera';
  status: 'granted' | 'rejected';
}

export interface LocationResult {
  latitude?: number;
  longitude?: number;
  error?: string;
}

export interface OrderPayload {
  app_code: string;
  merchant_code: string;
  merchant_reference: string;
  title: string;
  total_amount: number;
  currency: string;
  sign: string;
  confirm_payload: string;
}

export interface AuthPayload {
  xApiKey: string;
  xAccessToken: string;
}

// E-commerce Types
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  rating: number;
  inStock: boolean;
  badge?: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface DeliveryOption {
  id: string;
  name: string;
  description: string;
  price: number;
  estimatedTime: string;
  icon: string;
}

export interface DeliveryAddress {
  latitude: number;
  longitude: number;
  address?: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  deliveryOption: DeliveryOption;
  deliveryAddress?: DeliveryAddress;
  subtotal: number;
  deliveryFee: number;
  total: number;
  status: 'pending' | 'paid' | 'preparing' | 'delivering' | 'completed';
  createdAt: Date;
}

declare global {
  interface Window {
    choicesuperapp?: ChoiceSuperAppSDK;
    handleAccessToken?: (token: string) => void;
    handlePaymentResult?: (result: PaymentResult) => void;
    handlePermissionResult?: (result: PermissionResult[] | string) => void;
    handleLocationResult?: (result: LocationResult) => void;
  }
}

export { };

