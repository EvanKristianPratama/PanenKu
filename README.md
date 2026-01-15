# 🌾 PanenKu - E-commerce Platform

Platform e-commerce untuk produk pertanian segar langsung dari petani lokal.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

## 📁 Project Architecture

```
src/
├── components/           # React components
│   ├── ui/              # Shadcn/UI primitives
│   ├── common/          # Reusable presentational components
│   │   └── ProductCard/ # Example: Pure UI, no business logic
│   ├── features/        # Feature-specific container components
│   │   └── product/     # Example: With hooks & business logic
│   ├── chat/            # Chat feature components
│   └── admin/           # Admin dashboard components
│
├── hooks/               # Custom React hooks ⭐
│   ├── useAuth.ts       # Authentication state & role checks
│   ├── useCartActions.ts # Cart operations with auth check
│   ├── useNavbarScroll.ts # Navbar scroll behavior
│   ├── useSupportChat.ts  # Support chat with admin
│   ├── useFarmerChat.ts   # Chat with farmer/seller
│   └── useChat.ts       # Firebase chat core
│
├── stores/              # Zustand state management ⭐
│   └── cartStore.ts     # Cart state with persist
│
├── services/            # External services
│   ├── api/             # API client functions
│   │   └── cartApi.ts   # Cart API endpoints
│   ├── chatService.ts   # Firebase chat service
│   └── mongoService.ts  # MongoDB operations
│
├── context/             # React Context (legacy/backward compat)
│   └── CartContext.tsx  # Uses Zustand internally
│
├── constants/           # App constants ⭐
│   ├── routes.ts        # App routes & API endpoints
│   ├── messages.ts      # UI messages (Indonesian)
│   └── config.ts        # App configuration
│
├── lib/                 # Third-party configs
│   ├── firebase.ts      # Firebase config
│   ├── mongodb.ts       # MongoDB connection
│   └── auth.ts          # NextAuth config
│
└── types.ts             # TypeScript types

app/                     # Next.js App Router
├── (shop)/              # Public shop pages
├── (dashboard)/         # Admin & Mitra dashboards
├── (auth)/              # Auth pages
└── api/                 # API routes (backend)
```

## 🏗️ Architecture Pattern

### Component Pattern: Presentational + Container

```tsx
// ✅ Presentational (components/common/)
// - Pure UI, receives props
// - No hooks, no business logic
// - Easy to test & reuse

// ✅ Container (components/features/)
// - Uses custom hooks
// - Handles business logic
// - Passes data to presentational
```

### State Management Flow

```
User Action
    ↓
Component → useCartActions() → cartStore (Zustand) → cartApi → Server
                                    ↓
                              UI Updates
```

### Custom Hooks

| Hook | Purpose | Returns |
|------|---------|---------|
| `useAuth` | Auth state | `user`, `isAuthenticated`, `isAdmin`, `isFarmer`, `logout` |
| `useCartActions` | Cart ops | `addToCart`, `removeFromCart`, `updateQuantity` |
| `useNavbarScroll` | Scroll state | `isScrolled`, `isVisible` |
| `useSupportChat` | Admin chat | `activeChatRoom`, `openSupportChat` |
| `useFarmerChat` | Farmer chat | `activeChatRoom`, `openFarmerChat` |

## 🛠️ Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** Shadcn/UI
- **State Management:** Zustand
- **Authentication:** NextAuth.js
- **Database:** MongoDB
- **Real-time Chat:** Firebase
- **Payment:** Midtrans
- **Testing:** Vitest + React Testing Library

## 📝 Development Guidelines

### Adding New Features

1. **Create custom hook** in `src/hooks/` for business logic
2. **Create presentational component** in `src/components/common/`
3. **Create container component** in `src/components/features/`
4. **Add constants** in `src/constants/` (routes, messages)
5. **Update tests** in `src/__tests__/`
6. **Update CHANGELOG.md**

### Code Conventions

- Use `useAuth()` instead of direct `useSession()`
- Use `useCartActions()` for cart operations
- Use `ROUTES` constants instead of hardcoded strings
- Use `MESSAGES` for UI text (Indonesian)

## 📚 Documentation

- [REFACTORING_GUIDE.md](REFACTORING_GUIDE.md) - Architecture details
- [CHANGELOG.md](CHANGELOG.md) - Version history
- [.github/AGENT_RULES.md](.github/AGENT_RULES.md) - Development rules

## 📄 License

MIT License
