import React from 'react';
import Hero from '../components/Hero';
import ProblemSolution from '../components/ProblemSolution';
import Features from '../components/Features';
import SocialProof from '../components/SocialProof';
import CallToAction from '../components/CallToAction';

const Home = () => {
    return (
        <>
            <Hero />
            <ProblemSolution />
            <Features />
            <SocialProof />
            <CallToAction />
        </>
    );
};

export default Home;
