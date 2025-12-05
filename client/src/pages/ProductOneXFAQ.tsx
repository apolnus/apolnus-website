import { Link } from "wouter";
import { useTranslation } from 'react-i18next';
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FAQList from "@/components/FAQList";
import SEOHead from "@/components/seo/SEOHead";

export default function ProductOneXFAQ() {
  const { t } = useTranslation();
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <SEOHead pageKey="productOneXFAQ" />
      {/* Main Navbar */}
      <Navbar />
      
      {/* Product Navigation Bar - DJI Style */}
      <div className="sticky top-16 z-40 bg-gray-900">
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
                <div className="text-sm text-white hover:text-gray-300 cursor-pointer whitespace-nowrap transition-colors">{t('productonexfaq.t_e41e791c')}</div>
              </Link>
              <Link href="/products/one-x/downloads">
                <div className="text-sm text-white hover:text-gray-300 cursor-pointer whitespace-nowrap transition-colors">{t('productonexfaq.t_8f7258d0')}</div>
              </Link>
              <Link href="/products/one-x/faq">
                <div className="text-sm text-white hover:text-gray-300 cursor-pointer whitespace-nowrap transition-colors font-medium">{t('productonexfaq.t_fa0b4ecf')}</div>
              </Link>
              <Link href="/where-to-buy">
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">{t('productonexfaq.t_ec696fb3')}</Button>
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
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">{t('productonexfaq.t_ec696fb3')}</Button>
              </Link>
            </div>
            
            {/* Second Row: Menu Items */}
            <div className="flex items-center gap-6 px-4 overflow-x-auto">
              <Link href="/products/one-x/specs">
                <div className="text-sm text-white hover:text-gray-300 cursor-pointer whitespace-nowrap transition-colors">{t('productonexfaq.t_e41e791c')}</div>
              </Link>
              <Link href="/products/one-x/downloads">
                <div className="text-sm text-white hover:text-gray-300 cursor-pointer whitespace-nowrap transition-colors">{t('productonexfaq.t_8f7258d0')}</div>
              </Link>
              <Link href="/products/one-x/faq">
                <div className="text-sm text-white hover:text-gray-300 cursor-pointer whitespace-nowrap transition-colors font-medium">{t('productonexfaq.t_fa0b4ecf')}</div>
              </Link>
            </div>
          </nav>
        </div>
      </div>

      {/* FAQ Content */}
      <section className="flex-1 py-12 bg-gray-50 mt-8">
        <div className="container max-w-4xl">
          <h1 className="text-4xl lg:text-5xl font-bold mb-4 text-center">{t('productonexfaq.t_fa0b4ecf')}</h1>
          <p className="text-lg text-gray-600 text-center mb-12">{t('productonexfaq.t_8a6caf6a')}</p>
          <FAQList productSlug="one-x" showCategoryFilter={true} />
        </div>
      </section>

      <Footer />
    </div>
  );
}
