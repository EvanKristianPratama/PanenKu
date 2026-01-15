// ============================================
// Application Routes
// ============================================

export const ROUTES = {
  // Public
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  HELP: '/help',
  
  // Shop
  CART: '/cart',
  ORDERS: '/orders',
  PROFILE: '/profile',
  PRODUCT: (id: string | number) => `/product/${id}`,
  PAYMENT: (id: string | number) => `/payment/${id}`,
  
  // Admin Dashboard
  ADMIN: '/admin',
  ADMIN_PRODUCTS: '/admin/products',
  ADMIN_ORDERS: '/admin/orders',
  ADMIN_USERS: '/admin/users',
  ADMIN_MESSAGES: '/admin/messages',
  
  // Farmer/Mitra Dashboard
  MITRA: '/mitra',
  MITRA_PRODUCTS: '/mitra/products',
  MITRA_ORDERS: '/mitra/orders',
  MITRA_MESSAGES: '/mitra/messages',
} as const;

// ============================================
// API Endpoints
// ============================================

export const API_ENDPOINTS = {
  // Auth
  AUTH: '/api/auth',
  REGISTER: '/api/register',
  
  // Cart
  CART: '/api/cart',
  
  // Checkout & Orders
  CHECKOUT: '/api/checkout',
  ORDERS: '/api/orders',
  ORDER_DETAIL: (id: string) => `/api/orders/${id}`,
  
  // Products
  PRODUCTS: '/api/farmer/products',
  
  // Admin
  ADMIN_USERS: '/api/admin/users',
  ADMIN_ORDERS: '/api/admin/orders',
  
  // Farmer
  FARMER_PRODUCTS: '/api/farmer/products',
  FARMER_ORDERS: '/api/farmer/orders',
  
  // Chat
  CHAT: '/api/chat',
  CONTACT_ADMIN: '/api/contact/admin',
  
  // Subscriptions
  SUBSCRIPTIONS: '/api/subscriptions',
  
  // Midtrans
  MIDTRANS_TOKEN: '/api/midtrans/token',
  MIDTRANS_NOTIFICATION: '/api/midtrans/notification',
  
  // User
  USER_PROFILE: '/api/user/profile',
} as const;

// ============================================
// External URLs
// ============================================

export const EXTERNAL_URLS = {
  MIDTRANS_SNAP: 'https://app.sandbox.midtrans.com/snap/snap.js',
  // Add production URL when ready
  // MIDTRANS_SNAP_PROD: 'https://app.midtrans.com/snap/snap.js',
} as const;
