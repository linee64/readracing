import React from 'react';
import './App.css';
import Hero from './components/Hero';
import ProblemSolution from './components/ProblemSolution';
import Features from './components/Features';
import SocialProof from './components/SocialProof';
import CallToAction from './components/CallToAction';
import Footer from './components/Footer';

function App() {
  return (
    <main className="min-h-screen bg-brand-beige font-sans text-brand-black selection:bg-brand-black selection:text-brand-beige">
      <Hero />
      <ProblemSolution />
      <Features />
      <SocialProof />
      <CallToAction />
      <Footer />
    </main>
  );
}

export default App;
