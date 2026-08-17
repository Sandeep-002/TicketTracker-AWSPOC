import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminDashboard from './pages/AdminDashboard';
import UserDashboard from './pages/UserDashboard';
import ITSupportDashboard from './pages/ITSupportDashboard';
import TicketDetailPage from './pages/TicketDetailPage';

const RootRedirect = () => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === 'ROLE_ADMIN') return <Navigate to="/admin" replace />;
  if (user.role === 'ROLE_IT_SUPPORT') return <Navigate to="/it-support" replace />;
  return <Navigate to="/dashboard" replace />;
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Root Redirect based on user role */}
          <Route path="/" element={<RootRedirect />} />

          {/* Role Protected Routes */}
          <Route element={<ProtectedRoute allowedRoles={['ROLE_ADMIN']} />}>
            <Route path="/admin" element={<AdminDashboard />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={['ROLE_IT_SUPPORT', 'ROLE_ADMIN']} />}>
            <Route path="/it-support" element={<ITSupportDashboard />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={['ROLE_USER', 'ROLE_IT_SUPPORT', 'ROLE_ADMIN']} />}>
            <Route path="/dashboard" element={<UserDashboard />} />
            <Route path="/tickets/:id" element={<TicketDetailPage />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
