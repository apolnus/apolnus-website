import Navbar from "@/components/Navbar";
import { useTranslation } from 'react-i18next';
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import SEOHead from "@/components/seo/SEOHead";

export default function OneX() {
  const { t } = useTranslation();
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const navbarHeight = 120; // top navbar (64px) + product nav (56px)
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - navbarHeight;
      
      // Scroll to section first
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      
      // After scrolling, scroll down a bit more to show footer
      setTimeout(() => {
        const currentPosition = window.pageYOffset;
        const footerOffset = 400; // Additional scroll to show footer
        window.scrollTo({
          top: currentPosition + footerOffset,
          behavior: 'smooth'
        });
      }, 600); // Wait for initial scroll to complete
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <SEOHead pageKey="product-one-x" />
      <Navbar />
      
      {/* Product Navigation Bar */}
      <div className="fixed left-0 right-0 bg-[#1a1a1a] text-white z-30" style={{ top: 'calc(4rem + var(--banner-height, 0px))' }}>
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between h-14">
            {/* Left: Product Name */}
            <div className="text-base font-medium">
              One X
            </div>
            
            {/* Right: Navigation Items + Buy Button */}
            <div className="flex items-center gap-6">
              <button onClick={() => scrollToSection('specs')} className="text-sm whitespace-nowrap hover:text-gray-300 transition-colors">{t('oneX.t_3345ac9b')}</button>
              <button onClick={() => scrollToSection('downloads')} className="text-sm whitespace-nowrap hover:text-gray-300 transition-colors">{t('oneX.t_ece703d2')}</button>
              <Link href="/faq">
                <div className="text-sm whitespace-nowrap hover:text-gray-300 transition-colors cursor-pointer" onClick={scrollToTop}>{t('oneX.t_8568b958')}</div>
              </Link>
              <Link href="/where-to-buy">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-6 py-2 rounded-md" onClick={scrollToTop}>{t('oneX.t_d8137845')}</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative min-h-screen flex items-center justify-center bg-black text-white pt-28 overflow-hidden">
        {/* Background Video */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/one-x-hero.mp4" type="video/mp4" />
        </video>
        
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/30" />
        
        <div className="text-center z-10 px-6">
          <h1 className="text-6xl md:text-8xl font-light mb-6">One X</h1>
          <p className="text-2xl md:text-4xl font-light mb-8" style={{ color: '#00d4ff' }}>{t('oneX.t_92ef8b58')}</p>
          <Link href="/where-to-buy">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg rounded-full">{t('oneX.t_16b9cbe4')}</Button>
          </Link>
        </div>
      </div>

      {/* Product Features Section */}
      <div className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
            <div>
              <h2 className="text-4xl font-light mb-6">{t('oneX.t_92e37fa1')}</h2>
              <p className="text-lg text-gray-700 leading-relaxed">{t('oneX.t_896ba2a4')}</p>
            </div>
            <div className="aspect-square bg-gray-100 rounded-lg"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
            <div className="order-2 md:order-1">
              <div className="aspect-square bg-gray-100 rounded-lg"></div>
            </div>
            <div className="order-1 md:order-2">
              <h2 className="text-4xl font-light mb-6">{t('oneX.t_1364846e')}</h2>
              <p className="text-lg text-gray-700 leading-relaxed">{t('oneX.t_5b061551')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Technical Specifications Section */}
      <div id="specs" className="bg-gray-50 pt-20 pb-20 scroll-mt-32">
        <div className="max-w-6xl mx-auto px-6 md:px-12">
          <h2 className="text-4xl font-light mb-12 text-center">{t('oneX.t_89de3139')}</h2>
          
          <div className="bg-white rounded-lg shadow-sm p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="border-b border-gray-200 pb-4">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">{t('oneX.t_8d6d49ca')}</h3>
                  <p className="text-lg">441.4 m³/h</p>
                </div>
                <div className="border-b border-gray-200 pb-4">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">{t('oneX.t_6fe1b826')}</h3>
                  <p className="text-lg">99.2%</p>
                </div>
                <div className="border-b border-gray-200 pb-4">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">{t('oneX.t_9cfe9f53')}</h3>
                  <p className="text-lg">99.93%</p>
                </div>
              </div>
              <div className="space-y-6">
                <div className="border-b border-gray-200 pb-4">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">{t('oneX.t_77942f3a')}</h3>
                  <p className="text-lg">94.7%</p>
                </div>
                <div className="border-b border-gray-200 pb-4">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">{t('oneX.t_311af347')}</h3>
                  <p className="text-lg">99.99%</p>
                </div>
                <div className="border-b border-gray-200 pb-4">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">{t('oneX.t_7c2651ae')}</h3>
                  <p className="text-lg">0.0086 ppm</p>
                </div>
              </div>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="mt-12 space-y-4 text-xs text-gray-600">
            <p>{t('oneX.t_645a2103')}</p>
            <p>{t('oneX.t_4db860e3')}</p>
            <p>{t('oneX.t_2f503d3a')}</p>
            <p>{t('oneX.t_30bbe123')}</p>
            <p>{t('oneX.t_ae694e91')}</p>
            <p>{t('oneX.t_50d56e69')}</p>
            <p>{t('oneX.t_2a2d68fc')}</p>
            <p>{t('oneX.t_67b0f9c0')}</p>
          </div>
        </div>
      </div>

      {/* Downloads Section */}
      <div id="downloads" className="bg-white pt-20 pb-20 scroll-mt-32">
        <div className="max-w-6xl mx-auto px-6 md:px-12">
          <h2 className="text-4xl font-light mb-12 text-center">{t('oneX.t_8f7258d0')}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-50 rounded-lg p-6 hover:shadow-md transition-shadow">
              <h3 className="text-lg font-medium mb-2">{t('oneX.t_9b1c0cff')}</h3>
              <p className="text-sm text-gray-600 mb-4">{t('oneX.t_8948e1e6')}</p>
              <Button variant="outline" className="w-full">{t('oneX.t_8f7258d0')}</Button>
            </div>
            <div className="bg-gray-50 rounded-lg p-6 hover:shadow-md transition-shadow">
              <h3 className="text-lg font-medium mb-2">{t('oneX.t_d1ab345a')}</h3>
              <p className="text-sm text-gray-600 mb-4">{t('oneX.t_8948e1e6')}</p>
              <Button variant="outline" className="w-full">{t('oneX.t_8f7258d0')}</Button>
            </div>
            <div className="bg-gray-50 rounded-lg p-6 hover:shadow-md transition-shadow">
              <h3 className="text-lg font-medium mb-2">{t('oneX.t_6858ed04')}</h3>
              <p className="text-sm text-gray-600 mb-4">{t('oneX.t_8948e1e6')}</p>
              <Button variant="outline" className="w-full">{t('oneX.t_8f7258d0')}</Button>
            </div>
          </div>
        </div>
      </div>

      {/* Disclaimer Section */}
      <div className="bg-white py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-xs text-gray-400 space-y-2 leading-relaxed">
            <p>{t('onex.t_645a2103')}</p>
            <p>{t('onex.t_0b6372a1')}</p>
            <p>{t('onex.t_ea3d03e3')}</p>
            <p>{t('onex.t_27e77fd0')}</p>
            <p>{t('onex.t_46aa7a37')}</p>
            <p>{t('onex.t_09faf437')}</p>
            <p>{t('onex.t_5743b87f')}</p>
            <p>{t('onex.t_600f1280')}</p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
