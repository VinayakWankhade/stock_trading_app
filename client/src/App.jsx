import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useGeneral } from './context/GeneralContext';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import Home from './pages/Home';
import Login from './components/Login';
import Register from './components/Register';
import Portfolio from './pages/Portfolio';
import History from './pages/History';
import Profile from './pages/Profile';
import Admin from './pages/Admin';
import Users from './pages/Users';
import AllOrders from './pages/AllOrders';
import AllTransactions from './pages/AllTransactions';
import AdminStockChart from './pages/AdminStockChart';
import StockChart from './pages/StockChart';

const UserRoute = ({ children }) => {
  const { isAuthenticated, user, loading } = useGeneral();
  if (loading) return <div>Loading...</div>;
  if (!isAuthenticated) return <Navigate to="/login" />;
  return children;
};

const AdminRoute = ({ children }) => {
  const { isAuthenticated, user, loading } = useGeneral();
  if (loading) return <div>Loading...</div>;
  if (!isAuthenticated) return <Navigate to="/login" />;
  if (user?.role !== 'admin') return <Navigate to="/dashboard" />;
  return children;
};

const App = () => {
  return (
    <Router>
      <div className="min-vh-100">
        <Navbar />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Regular User Routes */}
          <Route path="/dashboard" element={<UserRoute><Home /></UserRoute>} />
          <Route path="/portfolio" element={<UserRoute><Portfolio /></UserRoute>} />
          <Route path="/history" element={<UserRoute><History /></UserRoute>} />
          <Route path="/profile" element={<UserRoute><Profile /></UserRoute>} />
          <Route path="/stock/:ticker" element={<UserRoute><StockChart /></UserRoute>} />
          <Route path="/stock" element={<UserRoute><StockChart /></UserRoute>} />

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminRoute><Admin /></AdminRoute>} />
          <Route path="/admin/users" element={<AdminRoute><Users /></AdminRoute>} />
          <Route path="/admin/orders" element={<AdminRoute><AllOrders /></AdminRoute>} />
          <Route path="/admin/funds" element={<AdminRoute><AllTransactions /></AdminRoute>} />
          <Route path="/admin/chart" element={<AdminRoute><AdminStockChart /></AdminRoute>} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
