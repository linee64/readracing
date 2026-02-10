import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import { Analytics } from "@vercel/analytics/react"

function App() {
  return (
    <AuthProvider>
      <Router>
        <main className="min-h-screen bg-brand-beige font-sans text-brand-black selection:bg-brand-gold selection:text-brand-black flex flex-col overflow-x-hidden">
          <Analytics />
          <Header />
          <div className="h-[65px] md:h-[81px]"></div>

          <div className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
            </Routes>
          </div>

          <Footer />
        </main>
      </Router>
    </AuthProvider>
  );
}

export default App;
