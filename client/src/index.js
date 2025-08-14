import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import './index.css';
import AuthProvider, { useAuth } from './auth/AuthContext';
import Home from './pages/Home';
import App from './App';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Playlists from './pages/Playlists';

function Nav() {
  const { user, logout } = useAuth();
  return (
    <nav className="main-nav">
      <Link to="/">Home</Link>
      <Link to="/songs">Songs</Link>
      {!user ? (
        <>
          <Link to="/login">Login</Link>
          <Link to="/signup">Signup</Link>
        </>
      ) : (
        <>
          <span className="nav-greeting">Hi, {user.username}</span>
          <Link to="/playlists">Playlists</Link>
          <button onClick={logout}>Logout</button>
        </>
      )}
    </nav>
  );
}

const Root = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Nav />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/songs" element={<App />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/playlists" element={<Playlists />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Root />);
