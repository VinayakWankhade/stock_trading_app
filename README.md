# QuantEdge — Premium Virtual Trading Simulator

QuantEdge (formerly SB Stocks) is a full-stack, institutional-grade virtual stock trading simulation platform built on the MERN stack. It offers real-time market data integration, simulated trading execution, portfolio analytics, and a comprehensive administrative suite, all wrapped in a sleek "Sky Frost" light-themed UI.

---

## 🏗️ Architecture Overview

The application is structured as a monorepo containing two distinct environments:

1. **Client (`/client`)**
   - React + Vite Single Page Application (SPA).
   - Responsible for the user interface, real-time charting, and state management.
2. **Server (`/server`)**
   - Node.js + Express REST API.
   - Handles authentication, database operations (MongoDB), and broadcasts real-time prices via WebSockets (`Socket.io`).

---

## 🛠️ Technology Stack

### Frontend (Client)
- **Core:** React 18, Vite
- **Routing:** React Router v6
- **State Management:** React Context API (`GeneralContext`, `SocketContext`)
- **Styling:** Vanilla CSS (`index.css`) with custom CSS Variables (Sky Frost theme)
- **Charting:** Lightweight Charts (`lightweight-charts`) for TradingView-style performance
- **Icons:** Lucide React
- **API Client:** Axios (configured with interceptors for JWT injection)

### Backend (Server)
- **Core:** Node.js, Express.js
- **Database:** MongoDB (Mongoose ODM)
- **Authentication:** JSON Web Tokens (JWT), bcrypt.js
- **Real-Time Data:** Socket.io (WebSocket), Finnhub API (Market API)
- **Security:** Helmet, CORS, Express-Mongo-Sanitize, XSS-Clean

---

## 📁 Directory Structure

```text
Stock_Trading_App/
│
├── client/                     # Frontend Vite/React App
│   ├── public/                 # Static assets
│   ├── src/
│   │   ├── components/         # Reusable UI components (Navbar, ProtectedRoutes, etc.)
│   │   ├── context/            # Global State managers (GeneralContext, SocketContext)
│   │   ├── pages/              # Route views (Dashboard, StockChart, Admin, etc.)
│   │   ├── App.jsx             # Main routing configuration
│   │   ├── main.jsx            # React entry point
│   │   └── index.css           # Global "Sky Frost" Design System variables
│   ├── vite.config.js          
│   └── vercel.json             # Vercel SPA routing configuration
│
└── server/                     # Backend Node/Express API
    ├── config/                 
    │   └── db.js               # MongoDB connection logic
    ├── controllers/            # Route logic (Auth, Stocks, Portfolio, Admin)
    ├── middleware/             # Custom Express middleware (Auth, Error handling)
    ├── models/                 # Mongoose schemas (User, Stock, Order, Transaction)
    ├── routes/                 # Express API routing definitions
    ├── index.js                # Express Server entry point & Socket.io engine
    └── .env                    # Environment variables
```

---

## 🎓 Instructor / Evaluation Guide

To easily evaluate the administrative capabilities of the platform, an admin account has been predefined. You can log into the application using the following credentials to bypass normal registration and access the protected `/admin` control suite:

- **Email:** `admin@quantedge.com`
- **Password:** `admin_password123`

---

## 🔑 Core Features

### 1. User Authentication
JWT-based authentication. The token is stored in `localStorage` and attached to outgoing API requests via an Axios interceptor (`axiosInstance.js`). Supports automatic redirects based on user Role (`user` vs `admin`).

### 2. Live Market Engine
- Uses **Finnhub API** to fetch real-time stock prices.
- If the Finnhub API key is omitted or hits rate limits, the server falls back to a realistic **Market Simulator Engine**, generating random price fluctuations using a Random Walk algorithm.
- Prices are broadcasted to all connected clients every 20 seconds via **Socket.io**.

### 3. Stock Terminal
Implemented using `lightweight-charts` to provide an institutional-grade chart that updates dynamically as WebSocket events arrive. Users can execute Long/Short trades natively through the terminal interface.

### 4. Portfolio Analytics
Calculates Total Equity, Buying Power, Total Profit/Loss (P&L), and visualizes portfolio allocation using dynamic donut charts.

### 5. Administrative Control Suite (Role: `admin`)
A protected layout accessible only by administrators.
- **System Control:** High-level metrics (Total Users, Trading Volume, System Capital).
- **Entity Directory:** User list with the ability to view/manipulate accounts.
- **Execution Nexus:** A raw feed of every simulated order executed on the platform.
- **Capital Audit:** A ledger of all fiat fund transactions (deposits/withdrawals) within the system.

---

## 🎨 Design System: "Sky Frost" Theme

The application uses an institutional-grade, light-mode aesthetic defined globally in `client/src/index.css`.

- **`--bg-primary`**: `#f0f9ff` (Soft sky blue - used for page backgrounds)
- **`--bg-secondary`**: `#ffffff` (Pure white - used for cards and modals)
- **`--text-primary`**: `#0c4a6e` (Deep sea blue - used for highest contrast text)
- **`--text-secondary`**: `#475569` (Subdued blue-grey text)
- **`--accent-primary`**: `#0ea5e9` (Vibrant blue - used for buttons, brand text, and interactive elements)

---

## 🚀 Deployment Guide

### Frontend Deployment (Vercel)
1. Push your repository to GitHub.
2. Log into Vercel and create a new project.
3. Import the repository.
4. Set the **Framework Preset** to `Vite`.
5. Set the **Root Directory** to `client`.
6. Deploy. (Note: The `vercel.json` file handles React Router Client-Side routing to prevent 404 errors on refresh).

### Backend Deployment (Render)
1. Log into Render and create a new **Web Service**.
2. Set the **Root Directory** to `server`.
3. Build Command: `npm install`
4. Start Command: `node index.js`
5. **Critically**, add your Environment Variables under the "Environment" tab.

### Environment Variables (`server/.env`)
```env
PORT=10000
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/quantedge
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRE=30d
FINNHUB_API_KEY=your_finnhub_key_here
CLIENT_URL=https://your-vercel-deployment-url.vercel.app
```

---

## 🛠️ API Endpoint Summary

### Auth (`/api/user`)
- `POST /register` - Create new virtual trading account
- `POST /login` - Authenticate account and receive JWT
- `GET /me` - Get current logged-in user details (Protected)

### Stocks (`/api/stock`)
- `GET /` - Get all available stocks in the system
- `GET /:symbol` - Get specific stock details

### Trading (`/api/order`)
- `POST /buy` - Execute a simulated buy order
- `POST /sell` - Execute a simulated sell order

### Portfolio (`/api/portfolio`)
- `GET /` - Get current user holdings, balance, and P&L

### Admin (`/api/admin`) *(Requires Admin JWT)*
- `GET /stats` - Global system statistics
- `GET /users` - List all registered users
- `GET /orders` - List all global executed orders
- `GET /transactions` - List all global fund deposits/withdrawals

---

## 🤝 Developer Workflow
To run the project locally:

1. **Start the backend:**
   ```bash
   cd server
   npm install
   npm run dev
   ```
2. **Start the frontend:**
   ```bash
   cd client
   npm install
   npm run dev
   ```
   *Make sure MongoDB is running and your `.env` is configured correctly locally. Ensure that `axios.defaults.baseURL` in `client/src/context/GeneralContext.jsx` and `axiosInstance.js` is set to `http://localhost:5000` during local development.*
