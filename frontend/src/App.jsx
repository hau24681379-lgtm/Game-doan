import React, { useState, useMemo } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { getDesignTokens } from './theme';
import { createTheme } from '@mui/material/styles';
import { UserProvider, useUser } from './context/UserContext';

import ClientLayout from './layouts/ClientLayout';
import AdminLayout from './layouts/AdminLayout';
import Login from './pages/Login';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Social from './pages/Social';
import Ranking from './pages/Ranking';

// Placeholder Pages
const AdminDashboard = () => <div style={{ padding: 20 }}><h2>Admin Dashboard</h2><p>Chào mừng Admin! Thống kê người dùng và hệ thống.</p></div>;

const ProtectedRoute = ({ children, role }) => {
  const { user } = useUser();
  if (!user) return <Navigate to="/login" />;
  if (role && user.role !== role) return <Navigate to="/" />;
  return children;
};

function AppContent() {
  const [mode, setMode] = useState('dark');
  const toggleColorMode = () => setMode(prev => (prev === 'light' ? 'dark' : 'light'));
  const theme = useMemo(() => createTheme(getDesignTokens(mode)), [mode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route path="/" element={<ClientLayout toggleColorMode={toggleColorMode} />}>
            <Route index element={<Home />} />
            <Route path="profile" element={<Profile />} />
            <Route path="social" element={<Social />} />
            <Route path="ranking" element={<Ranking />} />
          </Route>
          
          <Route path="/admin" element={
            <ProtectedRoute role="admin">
              <AdminLayout toggleColorMode={toggleColorMode} />
            </ProtectedRoute>
          }>
            <Route index element={<AdminDashboard />} />
            <Route path="profile" element={<Profile />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

function App() {
  return (
    <UserProvider>
      <AppContent />
    </UserProvider>
  );
}

export default App;
