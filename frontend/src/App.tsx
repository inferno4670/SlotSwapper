import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import Signup from './components/Signup';
import Login from './components/Login';
import Calendar from './components/Calendar';
import Marketplace from './components/Marketplace';
import Notifications from './components/Notifications';
import ThemeToggle from './components/ThemeToggle';
import './App.css';

function App() {
  const [isAuthenticated] = useState(!!localStorage.getItem('token'));

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <Router>
      <div className="App">
        <header className="app-header">
          <div className="container header-content">
            <Link to="/" className="header-title">SlotSwapper</Link>
            <nav>
              <div className="nav-links">
                {isAuthenticated ? (
                  <>
                    <Link to="/dashboard" className="nav-link">Calendar</Link>
                    <Link to="/marketplace" className="nav-link">Marketplace</Link>
                    <Link to="/notifications" className="nav-link">Notifications</Link>
                    <button onClick={handleLogout} className="btn btn-secondary">Logout</button>
                  </>
                ) : (
                  <>
                    <Link to="/login" className="nav-link">Login</Link>
                    <Link to="/signup" className="nav-link">Sign Up</Link>
                  </>
                )}
                <ThemeToggle />
              </div>
            </nav>
          </div>
        </header>
        <main>
          <div className="container">
            <Routes>
              <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/login" element={<Login />} />
              <Route path="/dashboard" element={<Calendar />} />
              <Route path="/marketplace" element={<Marketplace />} />
              <Route path="/notifications" element={<Notifications />} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
}

export default App;