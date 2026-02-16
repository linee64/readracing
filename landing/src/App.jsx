import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import './App.css';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Share from './pages/Share';
import { Analytics } from "@vercel/analytics/react"

const Layout = ({ children }) => {
  const location = useLocation();
  const isSharePage = location.pathname === '/share';

  return (
    <main className="min-h-screen bg-brand-beige font-sans text-brand-black selection:bg-brand-gold selection:text-brand-black flex flex-col overflow-x-hidden">
      <Analytics />
      {!isSharePage && <Header />}
      {!isSharePage && <div className="h-[65px] md:h-[81px]"></div>}

      <div className="flex-grow">
        {children}
      </div>

      {!isSharePage && <Footer />}
    </main>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/share" element={<Share />} />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;
