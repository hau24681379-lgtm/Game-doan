import React, { useState, useMemo } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { getDesignTokens } from './theme';
import { createTheme } from '@mui/material/styles';
import { UserProvider, useUser } from './context/UserContext';
import axios from 'axios';

// Global API Key Setting
axios.defaults.headers.common['x-api-key'] = 'LTUDWEB2026_SECRETKEY';

import ClientLayout from './layouts/ClientLayout';
import AdminLayout from './layouts/AdminLayout';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Social from './pages/Social';
import Ranking from './pages/Ranking';
import ApiDocs from './pages/ApiDocs';

// Placeholder Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminGames from './pages/admin/AdminGames';

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
          <Route path="/register" element={<Register />} />
          
          <Route path="/" element={<ClientLayout toggleColorMode={toggleColorMode} />}>
            <Route index element={<Home />} />
            <Route path="profile" element={<Profile />} />
            <Route path="social" element={<Social />} />
            <Route path="ranking" element={<Ranking />} />
            <Route path="api-docs" element={<ApiDocs />} />
          </Route>
          
          <Route path="/admin" element={
            <ProtectedRoute role="admin">
              <AdminLayout toggleColorMode={toggleColorMode} />
            </ProtectedRoute>
          }>
            <Route index element={<AdminDashboard />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="games" element={<AdminGames />} />
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
