"use client";

import ImageSearchSection from "@/components/landing-page/image-search-section";
import HeroSection from "@/components/landing-page/landing-section";
import OverviewSection from "@/components/landing-page/overview-section";
import RecommendationSection from "@/components/landing-page/recommendation-section";
import TestimonialSection from "@/components/landing-page/testimonial-section";
import TextSearchSection from "@/components/landing-page/text-search-section";

export default function LandingPage() {
  return (
    <div className='min-h-screen w-full bg-gray-50 flex flex-col pt-8'>
      <HeroSection />
      <OverviewSection />
      <RecommendationSection />
      <ImageSearchSection />
      <TextSearchSection />
      <TestimonialSection />
    </div>
  );
}
