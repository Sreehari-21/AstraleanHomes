import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Products from './pages/Products';
import Sofas from './pages/Sofas';
import Beds from './pages/Beds';
import KingBeds from './pages/KingBeds';
import QueenBeds from './pages/QueenBeds';
import Tables from './pages/Tables';
import Chairs from './pages/Chairs';
import Dining from './pages/Dining';
import Furnishings from './pages/Furnishings';
import Storage from './pages/Storage';
import Decor from './pages/Decor';
import Contact from './pages/Contact';
import ProductDetails from './pages/ProductDetails';
import Checkout from './pages/Checkout';

// Admin Pages
import AdminRoute from './components/AdminRoute';
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageProducts from './pages/admin/ManageProducts';
import ManageOrders from './pages/admin/ManageOrders';
import AdminSettings from './pages/admin/AdminSettings';
import ManageCategories from './pages/admin/ManageCategories';
import ManageEnquiries from './pages/admin/ManageEnquiries';

import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import './App.css';

function AppContent() {
  const location = useLocation();
  const hideFooterRoutes = ['/login', '/signup'];
  const isAdminRoute = location.pathname.startsWith('/admin');
  const shouldHideFooter = hideFooterRoutes.includes(location.pathname) || isAdminRoute;

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/products" element={<Products />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/sofas" element={<Sofas />} />
        <Route path="/beds" element={<Beds />} />
        <Route path="/king-beds" element={<KingBeds />} />
        <Route path="/queen-beds" element={<QueenBeds />} />
        <Route path="/tables" element={<Tables />} />
        <Route path="/chairs" element={<Chairs />} />
        <Route path="/dining" element={<Dining />} />
        <Route path="/furnishings" element={<Furnishings />} />
        <Route path="/storage" element={<Storage />} />
        <Route path="/decor" element={<Decor />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/checkout" element={<Checkout />} />

        {/* Admin Protected Routes */}
        <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        <Route path="/admin/products" element={<AdminRoute><ManageProducts /></AdminRoute>} />
        <Route path="/admin/orders" element={<AdminRoute><ManageOrders /></AdminRoute>} />
        <Route path="/admin/settings" element={<AdminRoute><AdminSettings /></AdminRoute>} />
        <Route path="/admin/categories" element={<AdminRoute><ManageCategories /></AdminRoute>} />
        <Route path="/admin/enquiries" element={<AdminRoute><ManageEnquiries /></AdminRoute>} />
      </Routes>
      {!shouldHideFooter && <Footer />}
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <ScrollToTop />
          <AppContent />
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
