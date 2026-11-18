import React from 'react';
import HeroBanner from '../components/home/HeroBanner';
import FeaturesBar from '../components/home/FeaturesBar';
import BestsellerSection from '../components/home/BestsellerSection';
import ArtisanStory from '../components/home/ArtisanStory';
import CustomOrderBanner from '../components/home/CustomOrderBanner';
import TestimonialSection from '../components/home/TestimonialSection';

export default function HomePage({ setActivePage, setSelectedCategory }) {
  return (
    <div className="space-y-0">
      <HeroBanner
        setActivePage={setActivePage}
        setSelectedCategory={setSelectedCategory}
      />
      <FeaturesBar />
      
      <BestsellerSection
        setActivePage={setActivePage}
        setSelectedCategory={setSelectedCategory}
      />
      <ArtisanStory setActivePage={setActivePage} />
      <CustomOrderBanner setActivePage={setActivePage} />
      <TestimonialSection />
    </div>
  );
}
