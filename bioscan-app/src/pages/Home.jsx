import React from 'react';
import TopNavBar from '../components/TopNavBar';
import HeroSection from '../components/HeroSection';
import FeaturesBentoGrid from '../components/FeaturesBentoGrid';
import PathogenGallery from '../components/PathogenGallery';
import DatasetBanner from '../components/DatasetBanner';
import Footer from '../components/Footer';

const Home = () => {
  return (
    <>
      <TopNavBar />
      <main>
        <HeroSection />
        <FeaturesBentoGrid />
        <PathogenGallery />
        <DatasetBanner />
      </main>
      <Footer />
    </>
  );
};

export default Home;
