//AppLayout.js
import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Home from './Home';

function AppLayout() {
  const location = useLocation();
  const excludedRoutes = ['/auth/login', '/auth/signup', '/auth/forgot-password'];

  const isAuthRoute = excludedRoutes.includes(location.pathname);

  return (
    <div>
      {!isAuthRoute && <Navbar />}
      <Routes>
        <Route path="*" element={<Home />} />
        {/* Add other routes here as needed */}
      </Routes>
    </div>
  );
}

export default AppLayout;
