import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import SignUp from './pages/SignUp';

function App() {
  return (
    <Router>
      <main className="min-h-screen bg-brand-beige font-sans text-brand-black selection:bg-brand-gold selection:text-brand-black flex flex-col overflow-x-hidden">
        <Header />

        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
          </Routes>
        </div>

        <Footer />
      </main>
    </Router>
  );
}

export default App;
