import { Link } from "wouter";
import { useTranslation } from 'react-i18next';
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FAQList from "@/components/FAQList";
import SEOHead from "@/components/seo/SEOHead";

export default function ProductUltraS7FAQ() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-white">
      <SEOHead pageKey="product-ultra-s7-faq" />
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
                <div className="text-sm text-white hover:text-gray-300 cursor-pointer whitespace-nowrap transition-colors">{t('productultras7faq.t_e41e791c')}</div>
              </Link>
              <Link href="/products/ultra-s7/downloads">
                <div className="text-sm text-white hover:text-gray-300 cursor-pointer whitespace-nowrap transition-colors">下載</div>
              </Link>
              <Link href="/products/ultra-s7/faq">
                <div className="text-sm text-white hover:text-gray-300 cursor-pointer whitespace-nowrap transition-colors">常見問題</div>
              </Link>
              <Link href="/where-to-buy">
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">立即購買</Button>
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
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">立即購買</Button>
              </Link>
            </div>
            
            {/* Second Row: Menu Items */}
            <div className="flex items-center gap-6 px-4 overflow-x-auto">
              <Link href="/products/ultra-s7/specs">
                <div className="text-sm text-white hover:text-gray-300 cursor-pointer whitespace-nowrap transition-colors">{t('productultras7faq.t_e41e791c')}</div>
              </Link>
              <Link href="/products/ultra-s7/downloads">
                <div className="text-sm text-white hover:text-gray-300 cursor-pointer whitespace-nowrap transition-colors">下載</div>
              </Link>
              <Link href="/products/ultra-s7/faq">
                <div className="text-sm text-white hover:text-gray-300 cursor-pointer whitespace-nowrap transition-colors">常見問題</div>
              </Link>
            </div>
          </nav>
        </div>
      </div>

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-gray-50 to-white py-16 mt-8">
        <div className="container">
          <h1 className="text-4xl lg:text-5xl font-bold text-center mb-4">常見問題</h1>
          <p className="text-xl text-gray-600 text-center">{t('productultras7faq.t_6a4c50c6')}</p>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12">
        <div className="container max-w-4xl">
          <FAQList productSlug="ultra-s7" showCategoryFilter={true} />

          {/* Contact Section */}
          <div className="mt-16 p-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl text-center">
            <h3 className="text-2xl font-bold mb-4">{t('productultras7faq.t_3f17a6a2')}</h3>
            <p className="text-gray-600 mb-6">{t('productultras7faq.t_444305fd')}</p>
            <div className="flex justify-center gap-4">
              <Link href="/support">
                <Button className="bg-blue-600 hover:bg-blue-700">{t('productultras7faq.t_b23f41ea')}</Button>
              </Link>
              <Link href="/support-ticket">
                <Button variant="outline">提交工單</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
