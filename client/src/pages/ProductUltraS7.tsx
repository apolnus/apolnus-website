import { Link } from "wouter";
import { useTranslation } from 'react-i18next';
import { Button } from "@/components/ui/button";
import { APP_LOGO } from "@/const";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/seo/SEOHead";
import { getProductSchema } from "@/lib/schemaHelper";
import { useEffect } from 'react';

export default function ProductUltraS7() {
  const { t } = useTranslation();
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 產品頁面深度追蹤事件
  useEffect(() => {
    // Meta Pixel: ViewContent 事件
    if ((window as any).fbq) {
      (window as any).fbq('track', 'ViewContent', {
        content_name: 'Ultra S7',
        content_ids: ['ultra-s7'],
        content_type: 'product',
        currency: 'TWD',
        value: 39900
      });
      console.log('[Meta Pixel] ViewContent event tracked: Ultra S7');
    }

    // GA4: view_item 事件
    if ((window as any).gtag) {
      (window as any).gtag('event', 'view_item', {
        items: [{
          item_id: 'ultra-s7',
          item_name: 'Ultra S7',
          item_category: 'Air Purifier',
          price: 39900,
          currency: 'TWD'
        }]
      });
      console.log('[GA4] view_item event tracked: Ultra S7');
    }
  }, []);
  
  // Ultra S7 產品 Schema 資料
  const ultraS7Schema = getProductSchema({
    name: "Ultra S7",
    image: "/products/ultra-s7/hero.jpg",
    description: "Advanced Air Purifier - High-performance air purification with smart features",
    sku: "ultra-s7",
    price: "39900",
    currency: "TWD",
    availability: "InStock"
  });

  return (
    <div className="min-h-screen bg-white">
      <SEOHead pageKey="product-ultra-s7" jsonLd={ultraS7Schema} />
      {/* Main Navbar */}
      <Navbar />
      
      {/* Product Navigation Bar - DJI Style */}
      <div className="sticky top-[64px] z-40 bg-gray-900">
        <div className="container">
          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center justify-between h-14 overflow-x-auto">
            {/* Left: Product Model Name */}
            <Link href="/products/ultra-s7">
              <div className="text-sm font-medium text-white hover:text-gray-300 cursor-pointer whitespace-nowrap transition-colors">
                Ultra S7
              </div>
            </Link>
            
            {/* Right: Other Navigation Items */}
            <div className="flex items-center gap-6">
              <Link href="/products/ultra-s7/specs">
                <div className="text-sm text-white hover:text-gray-300 cursor-pointer whitespace-nowrap transition-colors">{t('productultras7.t_89de3139')}</div>
              </Link>
              <Link href="/products/ultra-s7/downloads">
                <div className="text-sm text-white hover:text-gray-300 cursor-pointer whitespace-nowrap transition-colors">{t('productultras7.t_8f7258d0')}</div>
              </Link>
              <Link href="/products/ultra-s7/faq">
                <div className="text-sm text-white hover:text-gray-300 cursor-pointer whitespace-nowrap transition-colors">{t('productultras7.t_fa0b4ecf')}</div>
              </Link>
              <Link href="/where-to-buy">
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">{t('productultras7.t_ec696fb3')}</Button>
              </Link>
            </div>
          </nav>

          {/* Mobile Navigation - Two Rows */}
          <nav className="lg:hidden py-3">
            {/* First Row: Product Name + Buy Button */}
            <div className="flex items-center justify-between mb-3 px-4">
              <Link href="/products/ultra-s7">
                <div className="text-lg font-medium text-white hover:text-gray-300 cursor-pointer transition-colors">
                  Ultra S7
                </div>
              </Link>
              <Link href="/where-to-buy">
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">{t('productultras7.t_ec696fb3')}</Button>
              </Link>
            </div>
            
            {/* Second Row: Menu Items */}
            <div className="flex items-center gap-6 px-4 overflow-x-auto">
              <Link href="/products/ultra-s7/specs">
                <div className="text-sm text-white hover:text-gray-300 cursor-pointer whitespace-nowrap transition-colors">{t('productultras7.t_89de3139')}</div>
              </Link>
              <Link href="/products/ultra-s7/downloads">
                <div className="text-sm text-white hover:text-gray-300 cursor-pointer whitespace-nowrap transition-colors">{t('productultras7.t_8f7258d0')}</div>
              </Link>
              <Link href="/products/ultra-s7/faq">
                <div className="text-sm text-white hover:text-gray-300 cursor-pointer whitespace-nowrap transition-colors">{t('productultras7.t_fa0b4ecf')}</div>
              </Link>
            </div>
          </nav>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center bg-black pt-[160px] lg:pt-[130px]">
        {/* Background Image */}
        <img 
          src="/ultra-s7-hero.jpg" 
          alt="Ultra S7 Product" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Dark Overlay - 加深遮罩提升文字對比度 */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70"></div>
        <div className="relative z-10 text-center text-white px-4">
          <p className="text-sm lg:text-base uppercase tracking-wider mb-4 text-blue-300">ALL-IN-ONE NANO AIR PURIFIER</p>
          <h1 className="text-6xl md:text-8xl font-extrabold tracking-tighter leading-tight mb-6 pb-2 bg-clip-text text-transparent bg-gradient-to-r from-[#2997FF] via-[#9C40FF] via-[#FF2E93] to-[#FF8A00] animate-shimmer-flow filter drop-shadow-lg">
            Ultra S7
          </h1>
          <p className="text-xl lg:text-2xl mb-8">{t('productultras7.t_961866f4')}</p>
          <div className="flex gap-4 justify-center">
            <Link href="#features">
              <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-gray-900">{t('productultras7.t_9da177f7')}</Button>
            </Link>
            <Link href="/where-to-buy">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">{t('productultras7.t_ec696fb3')}</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="container">
          <h2 className="text-4xl lg:text-5xl font-bold text-center mb-16">{t('productultras7.t_3d80e992')}</h2>
          
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">{t('productultras7.t_8a09f29d')}</h3>
              <p className="text-gray-600">{t('productultras7.t_6ec9c004')}</p>           </div>

            {/* Feature 2 */}
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>              <h3 className="text-xl font-semibold mb-2">{t('productultras7.t_3d210d1c')}</h3>
              <p className="text-gray-600">{t('productultras7.t_fffa745a')}</p>
            </div>

            {/* Feature 3 */}
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>              <h3 className="text-xl font-semibold mb-2">{t('productultras7.t_cf095639')}</h3>
              <p className="text-gray-600">{t('productultras7.t_51e73886')}</p>            </div>
          </div>
        </div>
      </section>

      {/* Specs Highlight Section */}
      <section className="py-20 bg-gray-50">
        <div className="container">
          <h2 className="text-4xl lg:text-5xl font-bold text-center mb-16">{t('productultras7.t_51562267')}</h2>
          
          <div className="grid lg:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">2.88</div>
              <div className="text-gray-600">{t('productultras7.t_86b1379a')}</div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">&gt;99.9%</div>
              <div className="text-gray-600">{t('productultras7.t_63ad3b6e')}</div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">19.3dB</div>
              <div className="text-gray-600">{t('productultras7.t_1dc0fd14')}</div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">&gt;99.9%</div>
              <div className="text-gray-600">{t('productultras7.t_98fc15d5')}</div>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link href="/products/ultra-s7/specs">
              <Button size="lg" variant="outline">{t('productultras7.t_1e740c2a')}</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="container text-center">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">{t('productultras7.t_f0f4b375')}</h2>
          <p className="text-xl mb-8">{t('productultras7.t_c9ffe39c')}</p>
          <Link href="/where-to-buy">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">{t('productultras7.t_ec696fb3')}</Button>
          </Link>
        </div>
      </section>

      {/* Performance Data Disclaimer */}
      <section className="py-8 bg-gray-50">
        <div className="container max-w-6xl">
          <div className="text-xs text-gray-400 leading-relaxed space-y-2">
            <p>{t('productultras7.t_7d62b8b2')}</p>
            <p>{t('productultras7.t_2f463f44')}</p>
            <p>{t('productultras7.t_2e09a450')}</p>
            <p>{t('productultras7.t_bf3ada14')}</p>
            <p>{t('productultras7.t_3e5d4330')}</p>
            <p>{t('productultras7.t_5068d4cb')}</p>
            <p>{t('productultras7.t_169a1325')}</p>
            <p>{t('productultras7.t_7ba17a1c')}</p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
