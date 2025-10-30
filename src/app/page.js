'use client';

import React, { useState, useEffect } from "react";
import { translations } from "@/data/translations";
import LanguageSwitcher from "@/components/charity/LanguageSwitcher";
import HeroSection from "@/components/charity/HeroSection";
import AboutSection from "@/components/charity/AboutSection";
import HelpSection from "@/components/charity/HelpSection";
import NeedsSection from "@/components/charity/NeedsSection";
import TestimonialsSection from "@/components/charity/TestimonialsSection";
import StatsSection from "@/components/charity/StatsSection";
import TeamSection from "@/components/charity/TeamSection";
import GallerySection from "@/components/charity/GallerySection";
import ContactSection from "@/components/charity/ContactSection";
import Footer from "@/components/charity/Footer";

export default function Home() {
  const [language, setLanguage] = useState('en');
  const [content, setContent] = useState(translations.en);

  useEffect(() => {
    setContent(translations[language]);
  }, [language]);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="fixed top-6 right-6 z-50">
        <LanguageSwitcher
          currentLanguage={language}
          onLanguageChange={setLanguage}
        />
      </div>
      <HeroSection content={content} onScrollToHelp={() => scrollToSection('help')} />
      <AboutSection content={content} />
      <HelpSection content={content} />
      <NeedsSection content={content} language={language} />
      <TestimonialsSection content={content} language={language} />
      <StatsSection language={language} />
      <TeamSection language={language} />
      <GallerySection language={language} />
      <ContactSection content={content} />
      <Footer content={content} />
    </div>
  );
}
