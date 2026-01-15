// ============================================
// UI Messages - Indonesian (id-ID)
// ============================================

export const MESSAGES = {
  // Auth
  AUTH: {
    LOGIN_REQUIRED: 'Silakan login terlebih dahulu',
    LOGIN_REQUIRED_TITLE: 'Login Diperlukan',
    LOGIN_REQUIRED_CHAT: 'Silakan login untuk chat dengan petani',
    LOGIN_SUCCESS: 'Berhasil login',
    LOGIN_FAILED: 'Email atau password salah',
    LOGOUT_SUCCESS: 'Berhasil logout',
    REGISTER_SUCCESS: 'Registrasi berhasil',
    REGISTER_FAILED: 'Registrasi gagal',
    SESSION_EXPIRED: 'Sesi Anda telah berakhir, silakan login kembali',
  },

  // Cart
  CART: {
    ADDED: (productName: string) => `${productName} ditambahkan ke keranjang`,
    REMOVED: 'Produk dihapus dari keranjang',
    UPDATED: 'Jumlah produk diperbarui',
    EMPTY: 'Keranjang Anda kosong',
    FETCH_ERROR: 'Gagal memuat keranjang',
    ADD_ERROR: 'Gagal menambahkan ke keranjang',
    REMOVE_ERROR: 'Gagal menghapus dari keranjang',
    UPDATE_ERROR: 'Gagal memperbarui jumlah',
    STOCK_LIMIT: (stock: number) => `Stok tersedia hanya ${stock}`,
  },

  // Product
  PRODUCT: {
    NOT_FOUND: 'Produk tidak ditemukan',
    OUT_OF_STOCK: 'Stok habis',
    LIMITED_STOCK: (stock: number) => `Stok terbatas: ${stock}`,
    FETCH_ERROR: 'Gagal memuat produk',
  },

  // Orders
  ORDER: {
    SUCCESS: 'Pesanan berhasil dibuat',
    FAILED: 'Gagal membuat pesanan',
    CANCELLED: 'Pesanan dibatalkan',
    PROCESSING: 'Pesanan sedang diproses',
    SHIPPED: 'Pesanan sedang dikirim',
    DELIVERED: 'Pesanan telah diterima',
    NOT_FOUND: 'Pesanan tidak ditemukan',
  },

  // Chat
  CHAT: {
    START_ERROR: 'Gagal memulai chat',
    SEND_ERROR: 'Gagal mengirim pesan',
    SELF_CHAT: 'Tidak dapat chat dengan diri sendiri',
    FARMER_INFO_MISSING: 'Informasi petani tidak lengkap',
  },

  // Generic
  GENERIC: {
    ERROR: 'Terjadi kesalahan',
    SUCCESS: 'Berhasil',
    LOADING: 'Memuat...',
    SAVING: 'Menyimpan...',
    RETRY: 'Coba lagi',
    CONFIRM: 'Konfirmasi',
    CANCEL: 'Batal',
    YES: 'Ya',
    NO: 'Tidak',
  },

  // Validation
  VALIDATION: {
    REQUIRED: (field: string) => `${field} wajib diisi`,
    INVALID_EMAIL: 'Format email tidak valid',
    PASSWORD_MIN: (min: number) => `Password minimal ${min} karakter`,
    PASSWORD_MISMATCH: 'Password tidak cocok',
  },
} as const;

// ============================================
// Toast Messages (shorter versions)
// ============================================

export const TOAST = {
  SUCCESS: {
    CART_ADD: 'Ditambahkan ke keranjang',
    CART_REMOVE: 'Dihapus dari keranjang',
    ORDER_CREATE: 'Pesanan dibuat',
    PROFILE_UPDATE: 'Profil diperbarui',
    PRODUCT_CREATE: 'Produk ditambahkan',
    PRODUCT_UPDATE: 'Produk diperbarui',
    PRODUCT_DELETE: 'Produk dihapus',
  },
  ERROR: {
    GENERIC: 'Terjadi kesalahan',
    NETWORK: 'Gagal terhubung ke server',
    UNAUTHORIZED: 'Tidak memiliki akses',
  },
} as const;
