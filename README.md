# 🛍️ MONOLITH — Full Stack MERN E-Commerce

![MERN Stack](https://img.shields.io/badge/Stack-MERN-green?style=for-the-badge)
![MongoDB](https://img.shields.io/badge/MongoDB-6.0-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Express](https://img.shields.io/badge/Express-4.x-000000?style=for-the-badge&logo=express&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js&logoColor=white)

> A complete, production-ready e-commerce platform built with the MERN stack. Features user authentication, product catalog, shopping cart, checkout flow, and order tracking.

---

## 📸 Screenshots

### 🏠 Home Page
> Hero section with featured products and category grid

### 🛒 Shop Page
> Filter by category, search by name, sort by price/rating

### 📦 Product Detail
> Image gallery, quantity selector, star reviews

### 💳 Checkout
> 3-step wizard — Shipping → Payment → Review & Place Order

### 📋 Order Tracking
> Live order status tracker — Pending → Processing → Shipped → Delivered

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔐 Authentication | JWT-based register/login with bcrypt password hashing |
| 🛍️ Product Catalog | 22 mock products across 4 categories with real images |
| 🔍 Search & Filter | Filter by category, search by name, sort by price/rating/name |
| 🛒 Shopping Cart | Persistent cart stored in MongoDB per user |
| 💳 Checkout Flow | 3-step checkout: Shipping → Payment → Order Review |
| 📦 Order Management | Place orders, view history, track order status |
| ⭐ Reviews | Star ratings and comments per product |
| 👤 User Profile | Edit name, email, shipping address, password |
| 📱 Responsive | Mobile-first design, works on all screen sizes |
| 🌱 Auto Seed | Database auto-seeds with 22 products + demo users on first run |

---

## 🗂️ Project Structure

```
monolith-mern/
├── server/                        # Express + MongoDB API
│   ├── config/
│   │   └── seed.js                # Mock data (22 products + users)
│   ├── middleware/
│   │   └── auth.js                # JWT authentication middleware
│   ├── models/
│   │   ├── User.js                # User schema (bcrypt, JWT)
│   │   ├── Product.js             # Product schema (reviews, rating)
│   │   ├── Cart.js                # Cart schema (per user)
│   │   └── Order.js               # Order schema (status tracking)
│   ├── routes/
│   │   ├── auth.js                # Register, Login, Profile
│   │   ├── products.js            # CRUD + Search + Reviews
│   │   ├── cart.js                # Add, Update, Remove, Clear
│   │   └── orders.js              # Place, Pay, Track, History
│   ├── .env                       # Environment variables
│   └── server.js                  # Express app entry point
│
└── client/                        # React + Vite frontend
    └── src/
        ├── components/
        │   ├── layout/
        │   │   ├── Navbar.jsx     # Sticky nav with cart badge
        │   │   └── Toast.jsx      # Notification toasts
        │   ├── cart/
        │   │   └── CartDrawer.jsx # Slide-in cart sidebar
        │   └── product/
        │       └── ProductCard.jsx# Product card with quick-add
        ├── context/
        │   └── AppContext.jsx     # Global auth + cart state
        ├── pages/
        │   ├── HomePage.jsx       # Hero + featured products
        │   ├── ShopPage.jsx       # Catalog with filters
        │   ├── ProductPage.jsx    # Detail + reviews
        │   ├── CartPage.jsx       # Cart with qty controls
        │   ├── CheckoutPage.jsx   # 3-step checkout wizard
        │   ├── OrderPage.jsx      # Order detail + tracker
        │   ├── OrdersPage.jsx     # Order history
        │   ├── LoginPage.jsx      # Login form
        │   ├── RegisterPage.jsx   # Register form
        │   └── ProfilePage.jsx    # Account settings
        ├── utils/
        │   └── api.js             # Axios instance with JWT
        └── App.jsx                # Router + protected routes
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** v18+ → https://nodejs.org
- **MongoDB** (local) → https://www.mongodb.com/try/download/community
- **Git** → https://git-scm.com

### Installation

**1. Clone the repository**
```bash
git clone https://github.com/Qhayyum25/code_alpha-E-commerce.git
cd code_alpha-E-commerce
```

**2. Start MongoDB**
```bash
# Windows (run as Administrator)
net start MongoDB

# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

**3. Setup & start the Backend**
```bash
cd server
npm install
npm run dev
```

✅ You should see:
```
MongoDB connected
✅  Seeded 22 products
✅  Admin user created — admin@monolith.com / admin123
✅  Demo user created — demo@monolith.com / demo1234
Server running on http://localhost:5000
```

**4. Setup & start the Frontend** (new terminal)
```bash
cd client
npm install
npm run dev
```

✅ You should see:
```
VITE ready at http://localhost:5173
```

**5. Open your browser**
```
http://localhost:5173
```

---

## 🔑 Demo Credentials

| Role  | Email | Password |
|-------|-------|----------|
| 👤 User | demo@monolith.com | demo1234 |
| 🔧 Admin | admin@monolith.com | admin123 |

---

## 🌐 API Endpoints

### Auth
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/auth/register` | Public | Create new account |
| POST | `/api/auth/login` | Public | Login and get JWT |
| GET | `/api/auth/me` | Private | Get current user |
| PUT | `/api/auth/profile` | Private | Update profile |

### Products
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/products` | Public | List with filter/search/sort/pagination |
| GET | `/api/products/featured` | Public | Get featured products |
| GET | `/api/products/:id` | Public | Get single product |
| POST | `/api/products` | Admin | Create product |
| PUT | `/api/products/:id` | Admin | Update product |
| DELETE | `/api/products/:id` | Admin | Delete product |
| POST | `/api/products/:id/reviews` | Private | Add review |

### Cart
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/cart` | Private | Get user's cart |
| POST | `/api/cart` | Private | Add item to cart |
| PUT | `/api/cart/:productId` | Private | Update item quantity |
| DELETE | `/api/cart/:productId` | Private | Remove item |
| DELETE | `/api/cart` | Private | Clear entire cart |

### Orders
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/orders` | Private | Place new order |
| GET | `/api/orders/my` | Private | Get my orders |
| GET | `/api/orders/:id` | Private | Get order detail |
| PUT | `/api/orders/:id/pay` | Private | Mark as paid (mock) |
| GET | `/api/orders` | Admin | Get all orders |
| PUT | `/api/orders/:id/status` | Admin | Update order status |

---

## 🛠️ Tech Stack

### Backend
- **Node.js** — JavaScript runtime
- **Express.js** — Web framework
- **MongoDB** — NoSQL database
- **Mongoose** — MongoDB ODM
- **JWT** — Authentication tokens
- **bcryptjs** — Password hashing

### Frontend
- **React 18** — UI library
- **React Router 6** — Client-side routing
- **Axios** — HTTP client
- **Vite** — Build tool & dev server
- **CSS Variables** — Theming system

---

## ⚙️ Environment Variables

Create `server/.env`:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/monolith
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRES_IN=7d
```

---

## 📦 Product Categories

| Category | Products |
|----------|----------|
| 🏠 Home | Editor Lamp, Coffee Table, Linen Throw, Ceramic Vase Set, Oak Bookshelf, Wool Rug |
| 👗 Fashion | Raw Denim Jacket, Merino Turtleneck, Minimal Sneaker, Canvas Tote, Linen Shirt, Wool Overcoat |
| 💻 Electronics | Studio Monitor, Wireless Earbuds, Charging Pad, Mechanical Keyboard, Desk Hub, LED Panel |
| 💍 Accessories | Leather Wallet, Titanium Watch, Merino Beanie, Brass Key Holder |

---

## 🤝 Contributing

1. Fork the repo
2. Create a feature branch → `git checkout -b feature/YourFeature`
3. Commit your changes → `git commit -m "Add YourFeature"`
4. Push to the branch → `git push origin feature/YourFeature`
5. Open a Pull Request

---

## 👨‍💻 Author

**Qhayyum** — [@Qhayyum25](https://github.com/Qhayyum25)

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<p align="center">Built with ❤️ using the MERN Stack</p>
