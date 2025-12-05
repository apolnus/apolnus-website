import { Link } from "wouter";
import { useTranslation } from 'react-i18next';
import { Button } from "@/components/ui/button";
import { Download, FileText, File } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/seo/SEOHead";

export default function ProductOneXDownloads() {
  const { t } = useTranslation();
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const downloads = [
    {
      category: "產品說明書",
      items: [
        { name: "One X 使用說明書（繁體中文）", type: "PDF", size: "待補充", url: "#" },
        { name: "One X 快速入門指南", type: "PDF", size: "待補充", url: "#" },
      ]
    },
    {
      category: "保固與維護",
      items: [
        { name: "產品保固卡", type: "PDF", size: "待補充", url: "#" },
        { name: "清潔保養指南", type: "PDF", size: "待補充", url: "#" },
      ]
    },
    {
      category: "技術文件",
      items: [
        { name: "技術規格表", type: "PDF", size: "待補充", url: "#" },
        { name: "安全注意事項", type: "PDF", size: "待補充", url: "#" },
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <SEOHead pageKey="product-one-x-downloads" />
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
                <div className="text-sm text-white hover:text-gray-300 cursor-pointer whitespace-nowrap transition-colors">{t('productonexdownloads.t_e41e791c')}</div>
              </Link>
              <Link href="/products/one-x/downloads">
                <div className="text-sm text-white hover:text-gray-300 cursor-pointer whitespace-nowrap transition-colors font-medium">{t('productonexdownloads.t_8f7258d0')}</div>
              </Link>
              <Link href="/products/one-x/faq">
                <div className="text-sm text-white hover:text-gray-300 cursor-pointer whitespace-nowrap transition-colors">{t('productonexdownloads.t_fa0b4ecf')}</div>
              </Link>
              <Link href="/where-to-buy">
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">{t('productonexdownloads.t_ec696fb3')}</Button>
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
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">{t('productonexdownloads.t_ec696fb3')}</Button>
              </Link>
            </div>
            
            {/* Second Row: Menu Items */}
            <div className="flex items-center gap-6 px-4 overflow-x-auto">
              <Link href="/products/one-x/specs">
                <div className="text-sm text-white hover:text-gray-300 cursor-pointer whitespace-nowrap transition-colors">{t('productonexdownloads.t_e41e791c')}</div>
              </Link>
              <Link href="/products/one-x/downloads">
                <div className="text-sm text-white hover:text-gray-300 cursor-pointer whitespace-nowrap transition-colors font-medium">{t('productonexdownloads.t_8f7258d0')}</div>
              </Link>
              <Link href="/products/one-x/faq">
                <div className="text-sm text-white hover:text-gray-300 cursor-pointer whitespace-nowrap transition-colors">{t('productonexdownloads.t_fa0b4ecf')}</div>
              </Link>
            </div>
          </nav>
        </div>
      </div>

      {/* Downloads Content */}
      <section className="py-12 mt-6">
        <div className="container max-w-4xl">
          <h1 className="text-4xl font-bold mb-4">{t('productonexdownloads.t_f1523918')}</h1>
          <p className="text-gray-600 mb-8">{t('productonexdownloads.t_50263c10')}</p>

          {/* Download Categories */}
          <div className="space-y-8">
            {downloads.map((category, idx) => (
              <div key={idx}>
                <h2 className="text-2xl font-semibold mb-4 pb-2 border-b">{category.category}</h2>
                <div className="space-y-3">
                  {category.items.map((item, itemIdx) => (
                    <div key={itemIdx} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                          <FileText className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">{item.name}</h3>
                          <p className="text-sm text-gray-500">{item.type} • {item.size}</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="gap-2">
                        <Download className="w-4 h-4" />{t('productonexdownloads.t_8f7258d0')}</Button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Help Section */}
          <div className="mt-12 p-6 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-lg mb-2">{t('productonexdownloads.t_432c841a')}</h3>
            <p className="text-gray-600 mb-4">{t('productonexdownloads.t_538c62be')}</p>
            <div className="flex gap-4">
              <Link href="/support">
                <Button variant="outline">{t('productonexdownloads.t_b23f41ea')}</Button>
              </Link>
              <Link href="/products/one-x/faq">
                <Button variant="outline">{t('productonexdownloads.t_761dc6a5')}</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <Footer />
    </div>
  );
}
