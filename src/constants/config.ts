// ============================================
// Application Configuration
// ============================================

export const APP_CONFIG = {
  // App Info
  APP_NAME: 'PanenKu',
  APP_DESCRIPTION: 'Marketplace Pertanian - Belanja sayur dan buah segar langsung dari petani',
  APP_VERSION: '1.0.0',
  
  // Locale
  DEFAULT_LOCALE: 'id-ID',
  DEFAULT_CURRENCY: 'IDR',
  
  // Pagination
  DEFAULT_PAGE_SIZE: 12,
  MAX_PAGE_SIZE: 50,
  
  // Cart
  MAX_CART_QUANTITY: 99,
  MIN_CART_QUANTITY: 1,
  
  // Product
  NEW_PRODUCT_DAYS: 7, // Product is "new" if created within X days
  BEST_SELLER_THRESHOLD: 10, // Minimum sold count to be "best seller"
  LOW_STOCK_THRESHOLD: 5, // Show "limited stock" when stock <= X
  
  // Image
  DEFAULT_PRODUCT_IMAGE: '/placeholder-product.jpg',
  DEFAULT_AVATAR: '/placeholder-avatar.jpg',
  
  // Timeouts (in milliseconds)
  API_TIMEOUT: 30000,
  TOAST_DURATION: 3000,
  DEBOUNCE_DELAY: 300,
  
  // Animation durations (in milliseconds)
  ANIMATION_FAST: 150,
  ANIMATION_NORMAL: 300,
  ANIMATION_SLOW: 500,
} as const;

// ============================================
// Feature Flags
// ============================================

export const FEATURES = {
  // Enable/disable features
  ENABLE_CHAT: true,
  ENABLE_SUBSCRIPTIONS: true,
  ENABLE_PRE_ORDER: true,
  ENABLE_HARVEST_DATE: true,
  
  // Development
  ENABLE_DEV_TOOLS: process.env.NODE_ENV === 'development',
  ENABLE_MOCK_DATA: false,
} as const;

// ============================================
// Product Categories
// ============================================

export const PRODUCT_CATEGORIES = [
  { value: 'sayuran', label: 'Sayuran', icon: '🥬' },
  { value: 'buah', label: 'Buah-buahan', icon: '🍎' },
  { value: 'umbi', label: 'Umbi-umbian', icon: '🥔' },
  { value: 'beras', label: 'Beras & Padi', icon: '🌾' },
  { value: 'rempah', label: 'Rempah-rempah', icon: '🌶️' },
  { value: 'kacang', label: 'Kacang-kacangan', icon: '🥜' },
  { value: 'dairy', label: 'Susu & Telur', icon: '🥛' },
  { value: 'daging', label: 'Daging', icon: '🥩' },
  { value: 'ikan', label: 'Ikan & Seafood', icon: '🐟' },
  { value: 'lainnya', label: 'Lainnya', icon: '📦' },
] as const;

// ============================================
// Order Status
// ============================================

export const ORDER_STATUS = {
  PENDING: { value: 'pending', label: 'Menunggu Pembayaran', color: 'yellow' },
  PAID: { value: 'paid', label: 'Dibayar', color: 'blue' },
  PROCESSING: { value: 'processing', label: 'Diproses', color: 'blue' },
  SHIPPED: { value: 'shipped', label: 'Dikirim', color: 'purple' },
  DELIVERED: { value: 'delivered', label: 'Diterima', color: 'green' },
  CANCELLED: { value: 'cancelled', label: 'Dibatalkan', color: 'red' },
} as const;

// ============================================
// User Roles
// ============================================

export const USER_ROLES = {
  USER: { value: 'user', label: 'Pembeli' },
  FARMER: { value: 'farmer', label: 'Petani/Mitra' },
  ADMIN: { value: 'admin', label: 'Administrator' },
} as const;
