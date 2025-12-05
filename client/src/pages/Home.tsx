import { useState } from "react";
import { useTranslation } from 'react-i18next';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "wouter";
import SEOHead from "@/components/seo/SEOHead";
import { getOrganizationSchema } from "@/lib/schemaHelper";
import { Button } from "@/components/ui/button";
import ResponsiveVideo from "@/components/ResponsiveVideo";

export default function Home() {
  const { t } = useTranslation();
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  return (
    <div className="min-h-screen flex flex-col">
      <SEOHead pageKey="home" jsonLd={getOrganizationSchema()} />
      <Navbar />

      {/* Hero Section - One X with Video Background */}
      <section className="relative min-h-screen flex items-center justify-start pt-24">
        {/* Video Background */}
        <ResponsiveVideo
          videoName="one-x-hero"
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          loop
          muted
          playsInline
          controls={false}
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/20" />
        
        {/* Content */}
        <div className="relative z-10 w-full px-6 lg:px-12 py-20">
          <div className="max-w-4xl">
            <h1 className="text-6xl lg:text-8xl font-extrabold tracking-tighter leading-tight mb-4 bg-clip-text text-transparent bg-gradient-to-br from-[#ff8a00] via-[#e52e71] to-[#ff8a00] animate-text-shimmer bg-[length:200%_auto]">
              One X
            </h1>
            <p className="text-2xl lg:text-4xl text-blue-400 mb-8">{t('home.t_a6ec6029')}</p>
            <Link href="/where-to-buy">
              <Button
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-base rounded-md"
                onClick={scrollToTop}
              >{t('home.t_ec696fb3')}</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Section 2 - Two Column Banner (Back to One + 純淨空氣) */}
      <section className="grid lg:grid-cols-2">
        {/* Left: Back to One. Born Again */}
        <div className="relative min-h-screen flex items-center justify-center bg-cover bg-center" style={{ backgroundImage: 'url(/back-to-one-product.png)' }}>
          <div className="absolute inset-0 bg-black/30" />
          <div className="relative z-10 px-8 lg:px-12 text-center lg:text-left">
            <h2 className="font-bold text-white mb-8 whitespace-nowrap" style={{ fontSize: 'clamp(2rem, 5vw, 3.75rem)' }}>
              Back to One. Born Again
            </h2>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link href="/products/one-x">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-white text-white hover:bg-white/20"
                  onClick={scrollToTop}
                >{t('home.t_9da177f7')}</Button>
              </Link>
              <Link href="/where-to-buy">
                <Button
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={scrollToTop}
                >{t('home.t_ec696fb3')}</Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Right: 純淨空氣，純粹生活 */}
        <div className="relative min-h-screen flex items-center justify-center bg-cover bg-center" style={{ backgroundImage: 'url(/product-living-room.jpeg)' }}>
          <div className="absolute inset-0 bg-black/20" />
          <div className="relative z-10 px-8 lg:px-12 text-center lg:text-left">
            <h2 className="font-bold text-white mb-8 whitespace-nowrap" style={{ fontSize: 'clamp(2rem, 5vw, 3.75rem)' }}>{t('home.t_7f6a74a7')}</h2>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:text-left">
              <Link href="/products/one-x">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-white text-white hover:bg-white/20"
                  onClick={scrollToTop}
                >{t('home.t_9da177f7')}</Button>
              </Link>
              <Link href="/where-to-buy">
                <Button
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={scrollToTop}
                >{t('home.t_ec696fb3')}</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
