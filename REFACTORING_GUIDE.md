# 🌾 PanenKu Refactoring Guide
## Best Practices & Scalable Architecture

---

## 📊 Analisis Struktur Saat Ini

### Masalah yang Ditemukan:

#### 1. **Hooks di Components - Bukan Best Practice**
```
❌ Saat ini: Components langsung menggunakan hooks (useSession, useCart, useChat)
```

Contoh masalah di [ProductCard.tsx](src/components/ProductCard.tsx):
```tsx
// ❌ Komponen presentational mixing dengan logic
export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();           // Business logic
  const { data: session } = useSession();    // Auth state
  const router = useRouter();                // Navigation logic
  
  const handleAddToCart = (e: React.MouseEvent) => {
    // Business logic di dalam presentational component
  };
}
```

#### 2. **Server Component vs Client Component**
- [page.tsx](app/(shop)/page.tsx) dengan baik menggunakan Server Component untuk fetch data
- Tapi Client Component (`'use client'`) terlalu banyak digunakan di level rendah

#### 3. **Business Logic Tersebar**
- Logic authentication ada di banyak komponen
- Cart logic ada di context + komponen
- Chat logic di hooks + komponen

---

## ✅ Arsitektur Best Practice yang Direkomendasikan

### 📁 Struktur Folder Baru

```
src/
├── components/
│   ├── ui/                    # Shadcn/UI primitives (tetap)
│   ├── common/                # Reusable dumb components
│   │   ├── ProductCard/
│   │   │   ├── ProductCard.tsx        # Presentational only
│   │   │   ├── ProductCardSkeleton.tsx
│   │   │   └── index.ts
│   │   ├── Button/
│   │   └── ...
│   ├── features/              # Feature-specific smart components
│   │   ├── cart/
│   │   │   ├── CartButton.tsx         # Container with logic
│   │   │   ├── CartPreview.tsx
│   │   │   └── CartList.tsx
│   │   ├── product/
│   │   │   ├── ProductListContainer.tsx
│   │   │   ├── ProductDetailContainer.tsx
│   │   │   └── AddToCartButton.tsx
│   │   ├── auth/
│   │   │   ├── LoginForm.tsx
│   │   │   └── RegisterForm.tsx
│   │   └── chat/
│   │       ├── ChatContainer.tsx
│   │       └── ChatBox.tsx
│   └── layout/                # Layout components
│       ├── Navbar/
│       ├── Footer/
│       └── Sidebar/
├── hooks/                     # Custom hooks (sudah bagus ✅)
│   ├── useCart.ts
│   ├── useAuth.ts             # NEW: Extract auth logic
│   ├── useChat.ts
│   └── useProducts.ts         # NEW: Product operations
├── services/                  # API/External services (sudah bagus ✅)
│   ├── chatService.ts
│   ├── mongoService.ts
│   └── api/                   # NEW: API client functions
│       ├── cartApi.ts
│       ├── productApi.ts
│       └── authApi.ts
├── stores/                    # NEW: State management (Zustand)
│   ├── cartStore.ts
│   ├── authStore.ts
│   └── uiStore.ts
├── types/                     # TypeScript types
│   ├── product.ts
│   ├── cart.ts
│   ├── user.ts
│   └── index.ts
├── utils/                     # Pure utility functions
│   ├── formatters.ts
│   ├── validators.ts
│   └── helpers.ts
├── constants/                 # NEW: App constants
│   ├── routes.ts
│   ├── config.ts
│   └── messages.ts
└── lib/                       # Third-party configs (tetap)
    ├── firebase.ts
    ├── mongodb.ts
    └── auth.ts
```

---

## 🔧 Langkah-Langkah Refactoring

### Step 1: Pisahkan Presentational & Container Components

**SEBELUM (ProductCard.tsx):**
```tsx
'use client';
export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const { data: session } = useSession();
  const router = useRouter();
  
  const handleAddToCart = (e: React.MouseEvent) => {
    if (!session) {
      toast.error('Silakan login terlebih dahulu');
      router.push('/login');
      return;
    }
    addToCart(product);
  };
  // ... render
}
```

**SESUDAH:**

```tsx
// src/components/common/ProductCard/ProductCard.tsx
// ✅ Pure presentational - NO hooks, NO business logic
interface ProductCardProps {
  product: Product;
  isNew?: boolean;
  isBestSeller?: boolean;
  onAddToCart?: (e: React.MouseEvent) => void;
  isAddingToCart?: boolean;
}

export function ProductCard({ 
  product, 
  onAddToCart,
  isAddingToCart,
  isNew,
  isBestSeller 
}: ProductCardProps) {
  return (
    <Card>
      {/* Pure UI rendering */}
      <Button 
        onClick={onAddToCart}
        disabled={isAddingToCart}
      >
        Add to Cart
      </Button>
    </Card>
  );
}
```

```tsx
// src/components/features/product/ProductCardContainer.tsx
// ✅ Container component dengan logic
'use client';

import { ProductCard } from '@/components/common/ProductCard';
import { useCartActions } from '@/hooks/useCartActions';

export function ProductCardContainer({ product }: { product: Product }) {
  const { addToCart, isLoading } = useCartActions();
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(product);
  };
  
  return (
    <ProductCard 
      product={product}
      onAddToCart={handleAddToCart}
      isAddingToCart={isLoading}
    />
  );
}
```

---

### Step 2: Migrate Context ke Zustand Store

**SEBELUM (CartContext.tsx):**
```tsx
'use client';
const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const { data: session } = useSession();
    // ... 100+ lines of logic
}
```

**SESUDAH:**

```tsx
// src/stores/cartStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, Product } from '@/types';
import { cartApi } from '@/services/api/cartApi';

interface CartState {
  items: CartItem[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchCart: () => Promise<void>;
  addItem: (product: Product, quantity?: number) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isLoading: false,
      error: null,
      
      fetchCart: async () => {
        set({ isLoading: true, error: null });
        try {
          const items = await cartApi.getCart();
          set({ items, isLoading: false });
        } catch (error) {
          set({ error: 'Failed to fetch cart', isLoading: false });
        }
      },
      
      addItem: async (product, quantity = 1) => {
        set({ isLoading: true });
        try {
          await cartApi.addToCart(product.id, quantity);
          await get().fetchCart();
        } catch (error) {
          set({ error: 'Failed to add item', isLoading: false });
        }
      },
      
      // ... other actions
    }),
    { name: 'cart-storage' }
  )
);

// Selector hooks for performance
export const useCartItems = () => useCartStore((state) => state.items);
export const useCartCount = () => useCartStore((state) => 
  state.items.reduce((sum, item) => sum + item.quantity, 0)
);
```

---

### Step 3: Create API Layer

```tsx
// src/services/api/cartApi.ts
import { CartItem } from '@/types';

const BASE_URL = '/api/cart';

export const cartApi = {
  getCart: async (): Promise<CartItem[]> => {
    const res = await fetch(BASE_URL);
    if (!res.ok) throw new Error('Failed to fetch cart');
    const data = await res.json();
    return data.items || [];
  },
  
  addToCart: async (productId: string, quantity: number): Promise<void> => {
    const res = await fetch(BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId, quantity }),
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || 'Failed to add to cart');
    }
  },
  
  removeFromCart: async (productId: string): Promise<void> => {
    const res = await fetch(`${BASE_URL}?productId=${productId}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to remove from cart');
  },
  
  updateQuantity: async (productId: string, quantity: number): Promise<void> => {
    const res = await fetch(BASE_URL, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId, quantity }),
    });
    if (!res.ok) throw new Error('Failed to update quantity');
  },
};
```

---

### Step 4: Create Custom Hooks untuk Business Logic

```tsx
// src/hooks/useCartActions.ts
'use client';

import { useCartStore } from '@/stores/cartStore';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Product } from '@/types';

export function useCartActions() {
  const { addItem, removeItem, updateQuantity, isLoading } = useCartStore();
  const { data: session } = useSession();
  const router = useRouter();
  
  const addToCart = async (product: Product, quantity = 1) => {
    if (!session) {
      toast.error('Silakan login terlebih dahulu');
      router.push('/login');
      return;
    }
    
    try {
      await addItem(product, quantity);
      toast.success(`${product.name} ditambahkan ke keranjang`);
    } catch (error) {
      toast.error('Gagal menambah ke keranjang');
    }
  };
  
  return {
    addToCart,
    removeFromCart: removeItem,
    updateQuantity,
    isLoading,
  };
}
```

```tsx
// src/hooks/useAuth.ts
'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export function useAuth() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const isAuthenticated = status === 'authenticated';
  const isLoading = status === 'loading';
  const user = session?.user;
  const userId = (user as any)?.id;
  const userRole = (user as any)?.role;
  
  const logout = () => {
    signOut({ callbackUrl: '/login' });
  };
  
  const requireAuth = (callback: () => void) => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    callback();
  };
  
  return {
    user,
    userId,
    userRole,
    isAuthenticated,
    isLoading,
    isAdmin: userRole === 'admin',
    isFarmer: userRole === 'farmer',
    logout,
    requireAuth,
  };
}
```

---

### Step 5: Optimasi Server Components

```tsx
// app/(shop)/page.tsx - Server Component (tetap bagus ✅)
import { mongoService } from '@/services/mongoService';
import { ProductListContainer } from '@/components/features/product/ProductListContainer';
import { HeroSection } from '@/components/features/home/HeroSection';

export default async function Home() {
  const products = await mongoService.getProducts();
  
  return (
    <main className="min-h-screen bg-white">
      {/* Server-rendered hero dengan data minimal */}
      <HeroSection />
      
      {/* Client component untuk interaktivitas */}
      <ProductListContainer initialProducts={products} />
    </main>
  );
}
```

```tsx
// src/components/features/product/ProductListContainer.tsx
'use client';

import { Product } from '@/types';
import { ProductCardContainer } from './ProductCardContainer';

interface Props {
  initialProducts: Product[];
}

export function ProductListContainer({ initialProducts }: Props) {
  // Client-side logic jika perlu (filter, sort, etc)
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {initialProducts.map(product => (
        <ProductCardContainer key={product.id} product={product} />
      ))}
    </div>
  );
}
```

---

## 📋 Checklist Refactoring

### Phase 1: Foundation (Week 1)
- [ ] Install Zustand: `npm install zustand`
- [ ] Setup folder structure baru
- [ ] Create types yang proper di `/types`
- [ ] Create API layer di `/services/api`
- [ ] Create constants di `/constants`

### Phase 2: State Management (Week 2)
- [ ] Create `cartStore.ts`
- [ ] Create `authStore.ts` (optional, bisa pakai next-auth)
- [ ] Create `uiStore.ts` (modals, toasts, etc)
- [ ] Migrate CartContext ke Zustand

### Phase 3: Components Refactor (Week 3-4)
- [ ] Refactor ProductCard → Presentational + Container
- [ ] Refactor Navbar → Extract logic ke hooks
- [ ] Refactor ProductDetail → Presentational + Container
- [ ] Refactor Cart components
- [ ] Refactor Chat components

### Phase 4: Hooks Refactor (Week 5)
- [ ] Create `useAuth.ts`
- [ ] Create `useCartActions.ts`
- [ ] Improve `useChat.ts`
- [ ] Create `useProducts.ts` (jika perlu client-side fetching)

### Phase 5: Testing & Cleanup (Week 6)
- [ ] Update tests untuk struktur baru
- [ ] Remove unused code
- [ ] Documentation
- [ ] Performance audit

---

## 🎯 Key Principles

### 1. **Single Responsibility Principle**
Setiap file/fungsi hanya punya 1 tanggung jawab.

### 2. **Separation of Concerns**
- **Presentational components**: Hanya UI, terima props, no hooks
- **Container components**: Logic + hooks, render presentational
- **Hooks**: Reusable stateful logic
- **Services**: External API calls
- **Stores**: Global state management

### 3. **Colocation**
File yang related berdekatan:
```
features/cart/
├── CartButton.tsx
├── CartButton.test.tsx
├── CartPreview.tsx
├── useCartUI.ts        # Hook khusus feature ini
└── index.ts
```

### 4. **Server vs Client Components**
```
Server Component (default):
✅ Data fetching
✅ SEO
✅ Static content
✅ Access backend resources

Client Component ('use client'):
✅ Interactivity (onClick, onChange)
✅ Browser APIs
✅ State (useState, useEffect)
✅ Custom hooks dengan state
```

### 5. **Props Drilling vs Global State**
- 1-2 level: Props
- 3+ level atau cross-feature: Global store (Zustand)

---

## 📦 Dependencies yang Direkomendasikan

```json
{
  "dependencies": {
    "zustand": "^4.5.0",          // State management
    "react-query": "^5.0.0",       // Server state (optional)
    "@tanstack/react-query": "^5.0.0"
  },
  "devDependencies": {
    "@testing-library/react": "^14.0.0",
    "vitest": "latest"            // Sudah ada ✅
  }
}
```

---

## 🚀 Quick Start - Contoh File Pertama

Buat file ini sebagai contoh implementasi:

```bash
# 1. Install Zustand
npm install zustand

# 2. Buat folder structure
mkdir -p src/stores
mkdir -p src/services/api
mkdir -p src/components/common/ProductCard
mkdir -p src/components/features/product
mkdir -p src/components/features/cart
mkdir -p src/constants
```

Mulai dari:
1. `src/stores/cartStore.ts`
2. `src/services/api/cartApi.ts`
3. `src/hooks/useCartActions.ts`
4. Refactor `ProductCard.tsx`

---

## 💡 Tips

1. **Refactor secara bertahap** - Jangan ubah semua sekaligus
2. **Test setiap perubahan** - Pastikan tidak ada regression
3. **Gunakan TypeScript strict mode** - Catch errors lebih awal
4. **Code review** - Review setiap PR
5. **Document breaking changes** - Terutama untuk API internal

---

*Guide ini dibuat berdasarkan analisis codebase PanenKu pada Januari 2026*
