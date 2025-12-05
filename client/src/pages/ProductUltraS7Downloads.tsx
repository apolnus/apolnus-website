import { Link } from "wouter";
import { useTranslation } from 'react-i18next';
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Download, FileText, Book, Wrench } from "lucide-react";
import SEOHead from "@/components/seo/SEOHead";

export default function ProductUltraS7Downloads() {
  const { t } = useTranslation();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const downloads = [
    {
      category: "使用手冊",
      icon: Book,
      items: [
        { name: "Ultra S7 使用說明書 (繁體中文)", size: "2.5 MB", format: "PDF" },
        { name: "Ultra S7 User Manual (English)", size: "2.3 MB", format: "PDF" },
        { name: "Ultra S7 快速入門指南", size: "1.2 MB", format: "PDF" },
      ]
    },
    {
      category: "技術文件",
      icon: FileText,
      items: [
        { name: "Ultra S7 技術規格表", size: "850 KB", format: "PDF" },
        { name: "Ultra S7 認證證書", size: "1.5 MB", format: "PDF" },
        { name: "Ultra S7 測試報告", size: "3.2 MB", format: "PDF" },
      ]
    },
    {
      category: "維護保養",
      icon: Wrench,
      items: [
        { name: "Ultra S7 保養維護手冊", size: "1.8 MB", format: "PDF" },
        { name: "濾網更換指南", size: "950 KB", format: "PDF" },
        { name: "故障排除指南", size: "1.1 MB", format: "PDF" },
      ]
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <SEOHead pageKey="product-ultra-s7-downloads" />
      <Navbar />
      
      {/* Product Navigation Bar - DJI Style */}
      <div className="sticky top-16 z-40 bg-gray-900">
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
                <div className="text-sm text-white hover:text-gray-300 cursor-pointer whitespace-nowrap transition-colors font-medium">{t('productultras7downloads.t_89de3139')}</div>
              </Link>
              <Link href="/products/ultra-s7/downloads">
                <div className="text-sm text-white hover:text-gray-300 cursor-pointer whitespace-nowrap transition-colors font-medium">{t('productultras7downloads.t_8f7258d0')}</div>
              </Link>
              <Link href="/products/ultra-s7/faq">
                <div className="text-sm text-white hover:text-gray-300 cursor-pointer whitespace-nowrap transition-colors">{t('productultras7downloads.t_fa0b4ecf')}</div>
              </Link>
              <Link href="/where-to-buy">
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">{t('productultras7downloads.t_ec696fb3')}</Button>
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
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">{t('productultras7downloads.t_ec696fb3')}</Button>
              </Link>
            </div>
            
            {/* Second Row: Menu Items */}
            <div className="flex items-center gap-6 px-4 overflow-x-auto">
              <Link href="/products/ultra-s7/specs">
                <div className="text-sm text-white hover:text-gray-300 cursor-pointer whitespace-nowrap transition-colors font-medium">{t('productultras7downloads.t_89de3139')}</div>
              </Link>
              <Link href="/products/ultra-s7/downloads">
                <div className="text-sm text-white hover:text-gray-300 cursor-pointer whitespace-nowrap transition-colors font-medium">{t('productultras7downloads.t_8f7258d0')}</div>
              </Link>
              <Link href="/products/ultra-s7/faq">
                <div className="text-sm text-white hover:text-gray-300 cursor-pointer whitespace-nowrap transition-colors">{t('productultras7downloads.t_fa0b4ecf')}</div>
              </Link>
            </div>
          </nav>
        </div>
      </div>

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-gray-50 to-white py-16 mt-8">
        <div className="container">
          <h1 className="text-4xl lg:text-5xl font-bold text-center mb-4">{t('productultras7downloads.t_8f7258d0')}</h1>
          <p className="text-xl text-gray-600 text-center">{t('productultras7downloads.t_4816fcef')}</p>
        </div>
      </section>

      {/* Downloads Section */}
      <section className="py-12">
        <div className="container max-w-5xl">
          {downloads.map((category, idx) => (
            <div key={idx} className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <category.icon className="w-5 h-5 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold">{category.category}</h2>
              </div>

              <div className="grid gap-4">
                {category.items.map((item, itemIdx) => (
                  <div 
                    key={itemIdx}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50/30 transition-all group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center group-hover:bg-red-200 transition-colors">
                        <FileText className="w-6 h-6 text-red-600" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                          {item.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {item.format} • {item.size}
                        </div>
                      </div>
                    </div>

                    <Button 
                      variant="outline" 
                      size="sm"
                      className="gap-2 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-colors"
                    >
                      <Download className="w-4 h-4" />{t('productultras7downloads.t_8f7258d0')}</Button>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* App Download Section */}
          <div className="mt-16 p-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
            <h2 className="text-2xl font-bold mb-4 text-center">Apolnus App</h2>
            <p className="text-gray-600 text-center mb-6">{t('productultras7downloads.t_eab26d9f')}</p>
            <div className="flex justify-center gap-4">
              <Button className="bg-black hover:bg-gray-800 gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                </svg>
                App Store
              </Button>
              <Button className="bg-black hover:bg-gray-800 gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.5,12.92 20.16,13.19L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
                </svg>
                Google Play
              </Button>
            </div>
          </div>

          {/* Help Section */}
          <div className="mt-12 text-center p-6 bg-gray-50 rounded-lg">
            <h3 className="text-xl font-semibold mb-2">{t('productultras7downloads.t_0ed8c4c1')}</h3>
            <p className="text-gray-600 mb-4">{t('productultras7downloads.t_4c3716b0')}</p>
            <Link href="/support">
              <Button variant="outline">{t('productultras7downloads.t_f9025205')}</Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
