# QuantEdge – Full Project Documentation

This document outlines the complete lifecycle of the QuantEdge Virtual Trading Simulator, structured across the 7 core phases of software development.

---

## 📁 1. Ideation Phase

### 1.1 Problem Statement
In the modern financial landscape, retail investors and students lack accessible, realistic, and risk-free environments to practice stock trading. Traditional brokerage accounts require capital and carry significant risk, while most existing paper-trading platforms are either outdated, excessively complex, or do not offer real-time market data streaming.

### 1.2 Proposed Solution: QuantEdge
QuantEdge is a premium, institutional-grade virtual stock trading simulator. It is designed to bridge the gap between financial education and real-world execution. The platform provides a simulated wallet (starting at $10,000.00), real-time stock price streaming via WebSockets, interactive financial charts, and a frictionless "Sky Frost" user interface.

### 1.3 Target Audience
- **Students & Beginners:** Learning the basics of stock market mechanics without financial risk.
- **Intermediate Traders:** Testing new strategies on historical and live data boundaries.
- **Educators/Institutions:** Utilizing the platform as a controlled environment for finance courses.

---

## 📁 2. Requirement Analysis

### 2.1 Functional Requirements
- **User Authentication:** Registration, Login, and JWT-based session management.
- **Real-Time Market Data:** Live streaming of stock prices (AAPL, GOOGL, MSFT, etc.) updating every 20 seconds.
- **Simulated Trading Engine:** Ability to execute Buy and Sell orders. Orders must dynamically deduct from/add to the user's virtual buying power.
- **Portfolio Management:** Tracking user holdings, calculating real-time Profit & Loss (P&L), and visualizing asset allocation.
- **Administrative Suite:** A secure dashboard exclusively for platform administrators to monitor overall system capital, view all users, and audit every transaction and order block on the platform.

### 2.2 Non-Functional Requirements
- **Performance/Low Latency:** Market price changes must reflect on the client-side within milliseconds using WebSockets.
- **Security:** Passwords must be hashed (bcrypt), APIs protected by JWT, and the server secured using Helmet (HTTP headers) and CORS policies.
- **Scalability:** The backend must handle continuous WebSocket connections asynchronously without blocking HTTP REST requests.
- **Aesthetic (Sky Frost):** The UI must implement a high-contrast, professional light theme specifically avoiding generic UI patterns.

### 2.3 Hardware & Software Requirements
- **Frontend Stack:** React.js 18, Vite.js, Lightweight Charts (TradingView engine), Lucide React (Icons).
- **Backend Stack:** Node.js, Express.js, Socket.io, Finnhub API.
- **Database:** MongoDB Atlas (Mongoose ODM).
- **Deployment Environments:** Vercel (Frontend), Render (Backend).

---

## 📁 3. Project Design Phase

### 3.1 System Architecture
The application uses a decoupled **Client-Server Architecture**. 
- The Client is a Single Page Application (SPA) that acts as the presentation layer.
- The Server provides RESTful endpoints for CRUD operations and a persistent WebSocket channel (`auth` not required for basic price feed, but required for trading endpoints).

```text
[ React Client ] <-----(REST API / JSON)-----> [ Express.js Backend ] <------> [ MongoDB ]
       ^                                                 ^
       |                                                 |
       +---------------(WebSocket Feed)------------------+
                                                         |
                                                 [ Finnhub Market API ]
```

### 3.2 Database Schema Design
1. **User Schema:** `name`, `email`, `password` (hashed), `role` (user/admin), `buyingPower`.
2. **Stock Schema:** `symbol`, `name`, `currentPrice`, `change`, `changePercent`.
3. **Portfolio Schema:** `userId` (ref), `symbol`, `shares`, `averagePrice`.
4. **Order Schema:** `userId` (ref), `symbol`, `type` (buy/sell), `shares`, `price`, `totalAmount`, `status`.
5. **FundTransaction Schema:** `userId` (ref), `type` (deposit/withdrawal), `amount`, `status`.

### 3.3 UI/UX Design System
The **"Sky Frost" theme** uses:
- Backgrounds: `#f0f9ff` (Soft App Bg) and `#ffffff` (Pure White Cards).
- Accents: `#0ea5e9` (Vibrant Blue) for CTAs and interactive highlights.
- Typography: Deep sea blue (`#0c4a6e`) for contrast and legibility using modern sans-serif fonts.

---

## 📁 4. Project Planning Phase

The project was divided into 4 primary milestones:
1. **Milestone 1: Backend Foundation (Week 1)**
   - Initialized Express server, MongoDB schemas, and Auth controllers.
   - Built the JWT middleware.
2. **Milestone 2: Real-time Data Engine (Week 2)**
   - Integrated Finnhub API for live quotes.
   - Built a custom fallback simulator function when API rate limits are hit.
   - Set up Socket.io broadcasting.
3. **Milestone 3: Frontend Client & Trading UI (Week 3)**
   - Initialized Vite + React.
   - Built `axiosInstance` for API consumption and `GeneralContext` for State.
   - Integrated `lightweight-charts` to plot incoming Socket.io data.
   - Built the Buy/Sell modal logic ensuring accurate math for shares x price.
4. **Milestone 4: Admin Suite & Polish (Week 4)**
   - Designed the protected `/admin` routes.
   - Refactored the entire UI from standard dark-mode to the premium "Sky Frost" design.
   - Deployment configuration (CORS, Vercel SPA routing, Render ENV variables).

---

## 📁 5. Project Development Phase

### 5.1 Core Mechanism Implementations

**The Live Pricing Engine (`server/index.js`)**
The server runs an independent `setInterval` loop every 20 seconds. It fetches real data from Finnhub. If an error occurs (or no API key is present), it defaults to a mathematical "Random Walk" algorithm to continue generating realistic price fluctuations. This data structure is then emitted to all connected clients via `io.emit('priceUpdate', prices)`.

**The Trading Engine (`server/controllers/orderController.js`)**
When a buy order hits the `/api/order/buy` endpoint, the server executes a distributed transaction logic:
1. Calculates Total Cost (shares * current price).
2. Verifies User Buying Power (Cost <= BuyingPower).
3. Deducts Buying Power.
4. Finds or Creates the Portfolio holding (Averages up/down the share cost basis).
5. Creates a ledger entry in the `Order` collection.

**The Client Architecture (`client/src/context`)**
State is deeply central. `GeneralContext` holds the `user` and `token`. `SocketContext` maintains the persistent socket connection globally, allowing the Navbar, Dashboard, and Stock Terminal to all read the absolute most recent price simultaneously without prop-drilling.

---

## 📁 6. Project Documentation

*A detailed, standard `README.md` was also generated at the root of the project to cover installation steps.*

### 6.1 Critical Deployment Configurations

**CORS Policy (Backend):**
Due to strict modern browser policies, the backend must explicitly allow the Vercel frontend. 
```javascript
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
}));
app.options('*', cors()); // explicitly handle preflight
```

**SPA Routing (Frontend):**
Because React defines its own paths (`/dashboard`, `/login`), directly visiting these URLs on Vercel results in a 404 (because no literal `dashboard.html` exists). A `vercel.json` file dictates that all traffic resolves to `index.html`.
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

### 6.2 Key API Endpoints
- **Authentification:** `POST /api/user/register`, `POST /api/user/login`
- **Trading:** `POST /api/order/buy`, `POST /api/order/sell`
- **Analytics:** `GET /api/portfolio/`
- **Market:** *(Delivered via wss:// on `priceUpdate` event)*

---

## 📁 7. Project Demonstration

### 7.1 The User Flow

1. **The Landing Page:** Users arrive at `QuantEdge`, greeted by a high-contrast Sky Frost aesthetic and clear call-to-actions.
2. **Onboarding:** By clicking "Get Started", users create an account. They are immediately routed to the Dashboard.
3. **The Dashboard:** The user views their starting $10,000 buying power. A live ticker displays fluctuating market prices (AAPL, MSFT, TSLA).
4. **Execution:** Clicking a stock routes to the `Stock Terminal`. An interactive TradingView chart displays the asset. The user selects "10 Shares" and clicks "Execute Trade".
5. **Portfolio Verification:** The user navigates to `/portfolio`. The system calculates their new Average Cost, displays a dynamic asset allocation donut chart, and shows real-time P&L as the socket stream updates the closing price of their owned assets.

### 7.2 The Administrative Flow

1. An engineer modifies a user's role to `admin` in the MongoDB database.
2. The user logs in and is automatically routed to `/admin`.
3. **System Overview:** The admin views aggregate metrics: Total platform wealth, total registered users.
4. **Ledger Auditing:** The admin reviews the Global Orders and Capital Flow tables, identifying high-frequency traders or simulated whale activity. They can view the exact millisecond an order was placed.

---

*(End of Software Development Life Cycle Report)*
