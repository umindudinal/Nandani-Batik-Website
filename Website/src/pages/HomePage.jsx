import React from 'react';
import HeroBanner from '../components/home/HeroBanner';
import FeaturesBar from '../components/home/FeaturesBar';
import FeaturedCategories from '../components/home/FeaturedCategories';
import BestsellerSection from '../components/home/BestsellerSection';
import ArtisanStory from '../components/home/ArtisanStory';
import CustomOrderBanner from '../components/home/CustomOrderBanner';
import TestimonialSection from '../components/home/TestimonialSection';
import InstagramShowcase from '../components/home/InstagramShowcase';

export default function HomePage({ setActivePage, setSelectedCategory }) {
  return (
    <div className="space-y-0">
      <HeroBanner
        setActivePage={setActivePage}
        setSelectedCategory={setSelectedCategory}
      />
      <FeaturesBar />
      <FeaturedCategories
        setActivePage={setActivePage}
        setSelectedCategory={setSelectedCategory}
      />
      <BestsellerSection
        setActivePage={setActivePage}
        setSelectedCategory={setSelectedCategory}
      />
      <ArtisanStory setActivePage={setActivePage} />
      <CustomOrderBanner setActivePage={setActivePage} />
      <TestimonialSection />
      <InstagramShowcase />
    </div>
  );
}
