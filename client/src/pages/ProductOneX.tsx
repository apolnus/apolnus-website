import { useState } from "react";
import { useTranslation } from 'react-i18next';
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { APP_LOGO } from "@/const";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/seo/SEOHead";
import { getProductSchema } from "@/lib/schemaHelper";
import { useEffect } from 'react';
import ResponsiveVideo from "@/components/ResponsiveVideo";

export default function ProductOneX() {
  const { t } = useTranslation();
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 產品頁面深度追蹤事件
  useEffect(() => {
    // Meta Pixel: ViewContent 事件
    if ((window as any).fbq) {
      (window as any).fbq('track', 'ViewContent', {
        content_name: 'One X',
        content_ids: ['one-x'],
        content_type: 'product',
        currency: 'TWD',
        value: 29900
      });
      console.log('[Meta Pixel] ViewContent event tracked: One X');
    }

    // GA4: view_item 事件
    if ((window as any).gtag) {
      (window as any).gtag('event', 'view_item', {
        items: [{
          item_id: 'one-x',
          item_name: 'One X',
          item_category: 'Air Purifier',
          price: 29900,
          currency: 'TWD'
        }]
      });
      console.log('[GA4] view_item event tracked: One X');
    }
  }, []);
  
  // One X 產品 Schema 資料
  const oneXSchema = getProductSchema({
    name: "One X",
    image: "/products/one-x/hero.jpg",
    description: "Filter-Free Air Purifier - Revolutionary air purification technology without traditional filters",
    sku: "one-x",
    price: "29900",
    currency: "TWD",
    availability: "InStock"
  });

  return (
    <div className="min-h-screen bg-white">
      <SEOHead pageKey="product-one-x" jsonLd={oneXSchema} />
      {/* Main Navbar */}
      <Navbar />
      
      {/* Product Navigation Bar - DJI Style */}
      <div className="sticky top-[64px] z-40 bg-gray-900">
        <div className="container">
          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center justify-between h-14 overflow-x-auto">
            {/* Left: Product Model Name */}
            <Link href="/products/one-x">
              <div className="text-sm font-medium text-white hover:text-gray-300 cursor-pointer whitespace-nowrap transition-colors">
                One X
              </div>
            </Link>
            
            {/* Right: Other Navigation Items */}
            <div className="flex items-center gap-6">
              <Link href="/products/one-x/specs">
                <div className="text-sm text-white hover:text-gray-300 cursor-pointer whitespace-nowrap transition-colors">{t('productOneX.nav.specs')}</div>
              </Link>
              <Link href="/products/one-x/downloads">
                <div className="text-sm text-white hover:text-gray-300 cursor-pointer whitespace-nowrap transition-colors">{t('productOneX.nav.downloads')}</div>
              </Link>
              <Link href="/products/one-x/faq">
                <div className="text-sm text-white hover:text-gray-300 cursor-pointer whitespace-nowrap transition-colors">{t('productOneX.nav.faq')}</div>
              </Link>
              <Link href="/where-to-buy">
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">{t('productOneX.nav.buyNow')}</Button>
              </Link>
            </div>
          </nav>

          {/* Mobile Navigation - Two Rows */}
          <nav className="lg:hidden py-3">
            {/* First Row: Product Name + Buy Button */}
            <div className="flex items-center justify-between mb-3 px-4">
              <Link href="/products/one-x">
                <div className="text-lg font-medium text-white hover:text-gray-300 cursor-pointer transition-colors">
                  One X
                </div>
              </Link>
              <Link href="/where-to-buy">
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">{t('productOneX.nav.buyNow')}</Button>
              </Link>
            </div>
            
            {/* Second Row: Menu Items */}
            <div className="flex items-center gap-6 px-4 overflow-x-auto">
              <Link href="/products/one-x/specs">
                <div className="text-sm text-white hover:text-gray-300 cursor-pointer whitespace-nowrap transition-colors">{t('productOneX.nav.specs')}</div>
              </Link>
              <Link href="/products/one-x/downloads">
                <div className="text-sm text-white hover:text-gray-300 cursor-pointer whitespace-nowrap transition-colors">{t('productOneX.nav.downloads')}</div>
              </Link>
              <Link href="/products/one-x/faq">
                <div className="text-sm text-white hover:text-gray-300 cursor-pointer whitespace-nowrap transition-colors">{t('productOneX.nav.faq')}</div>
              </Link>
            </div>
          </nav>
        </div>
      </div>

      {/* Hero Section with Video Background */}
      <section className="relative h-screen min-h-[600px] flex items-center justify-center text-white overflow-hidden pt-[160px] lg:pt-[130px]">
        {/* Video Background */}
        <ResponsiveVideo
          videoName="one-x-hero"
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          loop
          muted
          playsInline
        />
        
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black/40"></div>
        
        {/* Content */}
        <div className="container text-center relative z-10">
          <h1 className="text-5xl lg:text-7xl font-bold mb-4 drop-shadow-lg">One X</h1>
          <p className="text-xl lg:text-2xl mb-8 text-gray-100 drop-shadow-lg">{t('productOneX.hero.subtitle')}</p>
          <div className="flex gap-4 justify-center">
            <Link href="/where-to-buy">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">{t('productOneX.hero.buyNow')}</Button>
            </Link>
            <Button size="lg" variant="outline" className="bg-transparent text-white border-white hover:bg-white/10">{t('productOneX.hero.learnMore')}</Button>
          </div>
        </div>
      </section>

      {/* Second Banner - 2026 One X */}
      <section className="relative h-[400px] lg:h-[500px] flex items-center justify-center overflow-hidden">
        <img
          src="/2026-onex.jpg"
          alt="2026 One X"
          className="absolute inset-0 w-full h-full object-cover"
        />
      </section>

      {/* Product Introduction */}
      <section className="py-20">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">Back to One. Born Again</h2>
            <p className="text-lg text-gray-600">{t('productOneX.introduction.description')}</p>
          </div>

          {/* Key Features Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-lg mb-2">{t('productOneX.features.filterFree.title')}</h3>
              <p className="text-gray-600">{t('productOneX.features.filterFree.description')}</p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="font-semibold text-lg mb-2">{t('productOneX.features.uvSterilization.title')}</h3>
              <p className="text-gray-600">{t('productOneX.features.uvSterilization.description')}</p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-lg mb-2">{t('productOneX.features.quietOperation.title')}</h3>
              <p className="text-gray-600">{t('productOneX.features.quietOperation.description')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Hyper-Ion Technology Section */}
      <section className="py-20 lg:py-32 bg-white">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center max-w-7xl mx-auto">
            {/* Left: Video */}
            <div className="order-1 lg:order-1">
              <div className="relative rounded-xl overflow-hidden shadow-2xl">
                <ResponsiveVideo
                  videoName="hyperion"
                  className="w-full h-auto"
                  muted
                  playsInline
                  loop
                  autoPlay={false}
                />
              </div>
            </div>

            {/* Right: Text */}
            <div className="order-2 lg:order-2 flex flex-col justify-center">
              <h2 className="text-xl lg:text-2xl font-bold text-gray-900 mb-3">{t('productonex.t_de6841f6')}</h2>
              <p className="text-sm lg:text-base text-gray-500 leading-relaxed">{t('productonex.t_4df4b03a')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-50">
        <div className="container text-center">
          <h2 className="text-3xl font-bold mb-6">{t('productOneX.cta.title')}</h2>
          <p className="text-lg text-gray-600 mb-8">{t('productOneX.cta.description')}</p>
          <Link href="/where-to-buy">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">{t('productOneX.cta.buyNow')}</Button>
          </Link>
        </div>
      </section>

      {/* Performance Data Disclaimer */}
      <section className="py-8 bg-gray-50">
        <div className="container max-w-6xl">
          <div className="text-xs text-gray-400 leading-relaxed space-y-2">
            <p>{t('productonex.t_4f667d4a')}</p>
            <p>{t('productonex.t_debbaab7')}</p>
            <p>{t('productonex.t_cac91932')}</p>
            <p>{t('productonex.t_54955fc8')}</p>
            <p>{t('productonex.t_14ada393')}</p>
            <p>{t('productonex.t_aa4c23ad')}</p>
            <p>{t('productonex.t_a7b0552e')}</p>
            <p>{t('productonex.t_f1820907')}</p>
            <p>{t('productonex.t_fc729b13')}</p>
            <p>{t('productonex.t_999a1370')}</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
