import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ItemProvider } from './contexts/ItemContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ItemListing from './pages/ItemListing';
import AddItem from './pages/AddItem';
import AdminPanel from './pages/AdminPanel';
import './index.css';

const App = () => {
  return (
    <AuthProvider>
      <ItemProvider>
        <Router>
          <div className="min-h-screen bg-[#CAD2C5] flex flex-col">
            <Navbar />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/item/:id" element={<ItemListing />} />
                <Route path="/add-item" element={<AddItem />} />
                <Route path="/admin" element={<AdminPanel />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </ItemProvider>
    </AuthProvider>
  );
};

export default App;