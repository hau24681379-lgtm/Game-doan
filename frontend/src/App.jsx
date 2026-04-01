import React, { useState, useMemo } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { getDesignTokens } from './theme';
import { createTheme } from '@mui/material/styles';

import ClientLayout from './layouts/ClientLayout';
import AdminLayout from './layouts/AdminLayout';
import Login from './pages/Login';
import Home from './pages/Home';

// Placeholder Pages
const AdminDashboard = () => <div><h2>Admin Dashboard</h2><p>Users and Stats</p></div>;

function App() {
  const [mode, setMode] = useState('dark');
  
  const toggleColorMode = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  const theme = useMemo(() => createTheme(getDesignTokens(mode)), [mode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route path="/" element={<ClientLayout toggleColorMode={toggleColorMode} />}>
            <Route index element={<Home />} />
          </Route>
          
          <Route path="/admin" element={<AdminLayout toggleColorMode={toggleColorMode} />}>
            <Route index element={<AdminDashboard />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
