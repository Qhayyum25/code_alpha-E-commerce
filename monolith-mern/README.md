# MONOLITH — Full Stack MERN E-Commerce

A complete e-commerce platform built with **MongoDB · Express · React · Node.js**.

---

## Features

| Feature | Details |
|---|---|
| 🛍️ Product Listings | 22 mock products across 4 categories |
| 🔍 Search & Filter | By category, name search, sort by price/rating |
| 🛒 Shopping Cart | Persistent per-user cart in MongoDB |
| 👤 Auth | JWT register/login, bcrypt password hashing |
| 📦 Order Flow | Checkout → Mock Payment → Order tracking |
| ⭐ Reviews | Star ratings + comments per product |
| 👤 Profile | Edit name, email, address, password |
| 📱 Responsive | Mobile-first design |

---

## Project Structure

```
monolith-mern/
├── server/                  # Express + MongoDB API
│   ├── models/              # User, Product, Cart, Order schemas
│   ├── routes/              # auth, products, cart, orders
│   ├── middleware/          # JWT auth middleware
│   ├── config/seed.js       # Mock data seeder
│   └── server.js            # Entry point
└── client/                  # React + Vite frontend
    └── src/
        ├── components/      # Navbar, CartDrawer, ProductCard
        ├── context/         # AppContext (auth + cart state)
        ├── pages/           # All pages
        └── utils/api.js     # Axios instance
```

---

## Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)

### 1. Start MongoDB
```bash
# Local MongoDB
mongod

# OR use MongoDB Atlas free cluster and update MONGO_URI in server/.env
```

### 2. Start the Server
```bash
cd server
npm install
npm run dev
# → http://localhost:5000
# → Seeds 22 products + 2 users automatically
```

### 3. Start the Client
```bash
cd client
npm install
npm run dev
# → http://localhost:5173
```

---

## Demo Credentials

| Role  | Email                  | Password   |
|-------|------------------------|------------|
| User  | demo@monolith.com      | demo1234   |
| Admin | admin@monolith.com     | admin123   |

---

## API Endpoints

### Auth
| Method | Route | Access |
|---|---|---|
| POST | /api/auth/register | Public |
| POST | /api/auth/login | Public |
| GET  | /api/auth/me | Private |
| PUT  | /api/auth/profile | Private |

### Products
| Method | Route | Access |
|---|---|---|
| GET  | /api/products | Public |
| GET  | /api/products/featured | Public |
| GET  | /api/products/:id | Public |
| POST | /api/products | Admin |
| PUT  | /api/products/:id | Admin |
| DELETE | /api/products/:id | Admin |
| POST | /api/products/:id/reviews | Private |

### Cart
| Method | Route | Access |
|---|---|---|
| GET    | /api/cart | Private |
| POST   | /api/cart | Private |
| PUT    | /api/cart/:productId | Private |
| DELETE | /api/cart/:productId | Private |
| DELETE | /api/cart | Private |

### Orders
| Method | Route | Access |
|---|---|---|
| POST | /api/orders | Private |
| GET  | /api/orders/my | Private |
| GET  | /api/orders/:id | Private |
| PUT  | /api/orders/:id/pay | Private |
| GET  | /api/orders | Admin |
| PUT  | /api/orders/:id/status | Admin |

---

## Tech Stack
- **Frontend:** React 18, React Router 6, Axios, Vite
- **Backend:** Node.js, Express 4, Mongoose 8
- **Database:** MongoDB (local or Atlas)
- **Auth:** JWT + bcryptjs
- **Styling:** Pure CSS with CSS variables
# code_alpha-E-commerce
