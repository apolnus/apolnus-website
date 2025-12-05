import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import SEOHead from "@/components/seo/SEOHead";

export default function UltraS7() {
  const { t } = useTranslation();
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <SEOHead pageKey="ultraS7" />
      <Navbar />
      
      {/* Product Navigation Bar */}
      <div className="fixed left-0 right-0 bg-[#1a1a1a] text-white z-30" style={{ top: 'calc(4rem + var(--banner-height, 0px))' }}>
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between h-14">
            {/* Left: Product Name */}
            <div className="text-base font-medium">
              Ultra S7
            </div>
            
            {/* Right: Navigation Items + Buy Button */}
            <div className="flex items-center gap-6">
              <a href="#specs" className="text-sm whitespace-nowrap hover:text-gray-300 transition-colors">{t('ultraS7.t_3345ac9b')}</a>
              <a href="#downloads" className="text-sm whitespace-nowrap hover:text-gray-300 transition-colors">{t('ultraS7.t_ece703d2')}</a>
              <Link href="/faq">
                <div className="text-sm whitespace-nowrap hover:text-gray-300 transition-colors cursor-pointer" onClick={scrollToTop}>{t('ultraS7.t_8568b958')}</div>
              </Link>
              <Link href="/where-to-buy">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-6 py-2 rounded-md" onClick={scrollToTop}>{t('ultraS7.t_d8137845')}</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative min-h-screen flex items-center justify-center text-white pt-28 overflow-hidden bg-black">
        {/* Background Image */}
        <img 
          src="/ultra-s7-hero.jpg" 
          alt="Ultra S7 Product" 
          className="absolute inset-0 w-full h-full object-cover z-0"
        />
        {/* Dark Overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60 z-[1]"></div>
        
        <div className="text-center z-10 px-6">
          <p className="text-lg md:text-xl mb-4">{t('ultraS7.t_3ae226d6')}</p>
          <h1 className="text-6xl md:text-8xl font-light mb-6">
            <span className="inline-block" style={{
              background: 'linear-gradient(90deg, #ff6b35 0%, #f7931e 50%, #fbb03b 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>Ultra </span>
            <span className="inline-block" style={{
              background: 'linear-gradient(90deg, #0ea5e9 0%, #3b82f6 50%, #6366f1 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>S7</span>
          </h1>
          <p className="text-xl md:text-2xl font-light mb-8">{t('ultraS7.t_0e1aa147')}</p>
          <Link href="/where-to-buy">
            <Button className="bg-white hover:bg-gray-100 text-blue-600 px-8 py-6 text-lg rounded-full">{t('ultraS7.t_f867a184')}</Button>
          </Link>
        </div>
      </div>

      {/* Product Features Section */}
      <div className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
            <div>
              <h2 className="text-4xl font-light mb-6">{t('ultraS7.t_fa6d46bf')}</h2>
              <p className="text-lg text-gray-700 leading-relaxed">{t('ultraS7.t_a0dca879')}</p>
            </div>
            <div className="aspect-square bg-gray-100 rounded-lg"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
            <div className="order-2 md:order-1">
              <div className="aspect-square bg-gray-100 rounded-lg"></div>
            </div>
            <div className="order-1 md:order-2">
              <h2 className="text-4xl font-light mb-6">{t('ultraS7.t_cf095639')}</h2>
              <p className="text-lg text-gray-700 leading-relaxed">{t('ultraS7.t_ca106080')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Technical Specifications Section */}
      <div id="specs" className="bg-gray-50 py-20">
        <div className="max-w-6xl mx-auto px-6 md:px-12">
          <h2 className="text-4xl font-light mb-12 text-center">{t('ultraS7.t_89de3139')}</h2>
          
          <div className="bg-white rounded-lg shadow-sm p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="border-b border-gray-200 pb-4">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">{t('ultraS7.t_02063be2')}</h3>
                  <p className="text-lg">2.88 cmm</p>
                </div>
                <div className="border-b border-gray-200 pb-4">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">{t('ultraS7.t_ebfa5a15')}</h3>
                  <p className="text-lg">&gt;99.9%</p>
                </div>
                <div className="border-b border-gray-200 pb-4">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">{t('ultraS7.t_98fc15d5')}</h3>
                  <p className="text-lg">&gt;99.9%</p>
                </div>
              </div>
              <div className="space-y-6">
                <div className="border-b border-gray-200 pb-4">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">{t('ultraS7.t_bd54d6e0')}</h3>
                  <p className="text-lg">19.3 dB(A)</p>
                </div>
                <div className="border-b border-gray-200 pb-4">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">{t('ultraS7.t_d4db6f90')}</h3>
                  <p className="text-lg">{t('ultraS7.t_3c4805d4')}</p>
                </div>
                <div className="border-b border-gray-200 pb-4">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">{t('ultraS7.t_e508f097')}</h3>
                  <p className="text-lg">{t('ultraS7.t_3c4805d4')}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="mt-12 space-y-4 text-xs text-gray-600">
            <p>{t('ultraS7.t_7d62b8b2')}</p>
            <p>{t('ultraS7.t_2f463f44')}</p>
            <p>{t('ultraS7.t_2e09a450')}</p>
            <p>{t('ultraS7.t_bf3ada14')}</p>
            <p>{t('ultraS7.t_3e5d4330')}</p>
            <p>{t('ultraS7.t_5068d4cb')}</p>
            <p>{t('ultraS7.t_169a1325')}</p>
            <p>{t('ultraS7.t_7ba17a1c')}</p>
          </div>
        </div>
      </div>

      {/* Downloads Section */}
      <div id="downloads" className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-6 md:px-12">
          <h2 className="text-4xl font-light mb-12 text-center">{t('ultraS7.t_8f7258d0')}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-50 rounded-lg p-6 hover:shadow-md transition-shadow">
              <h3 className="text-lg font-medium mb-2">{t('ultraS7.t_9b1c0cff')}</h3>
              <p className="text-sm text-gray-600 mb-4">{t('ultraS7.t_8948e1e6')}</p>
              <Button variant="outline" className="w-full">{t('ultraS7.t_8f7258d0')}</Button>
            </div>
            <div className="bg-gray-50 rounded-lg p-6 hover:shadow-md transition-shadow">
              <h3 className="text-lg font-medium mb-2">{t('ultraS7.t_d1ab345a')}</h3>
              <p className="text-sm text-gray-600 mb-4">{t('ultraS7.t_8948e1e6')}</p>
              <Button variant="outline" className="w-full">{t('ultraS7.t_8f7258d0')}</Button>
            </div>
            <div className="bg-gray-50 rounded-lg p-6 hover:shadow-md transition-shadow">
              <h3 className="text-lg font-medium mb-2">{t('ultraS7.t_6858ed04')}</h3>
              <p className="text-sm text-gray-600 mb-4">{t('ultraS7.t_8948e1e6')}</p>
              <Button variant="outline" className="w-full">{t('ultraS7.t_8f7258d0')}</Button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
