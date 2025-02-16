import { StrictMode, useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './index.css';
import Table from './Table.jsx';
import Login from './Login.jsx';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    setIsAuthenticated(!!localStorage.getItem('token'));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  return (
    <StrictMode>
      <Router>
        <Routes>
          <Route path="/" element={ isAuthenticated ? <Navigate to="/table" /> : <Login onLoginSuccess={() => setIsAuthenticated(true)} /> }/>
          <Route path="/table" element={isAuthenticated ? <Table onLogout={handleLogout} /> : <Navigate to="/" />}/>
        </Routes>
      </Router>
    </StrictMode>
  );
}

createRoot(document.getElementById('root')).render(<App />);
