import { Link } from "wouter";
import { useTranslation } from 'react-i18next';
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/seo/SEOHead";

export default function ProductOneXSpecs() {
  const { t } = useTranslation();
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white">
      <SEOHead pageKey="product-one-x-specs" />
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
                <div className="text-sm text-white hover:text-gray-300 cursor-pointer whitespace-nowrap transition-colors font-medium">{t('productonexspecs.t_e41e791c')}</div>
              </Link>
              <Link href="/products/one-x/downloads">
                <div className="text-sm text-white hover:text-gray-300 cursor-pointer whitespace-nowrap transition-colors">{t('productonexspecs.t_8f7258d0')}</div>
              </Link>
              <Link href="/products/one-x/faq">
                <div className="text-sm text-white hover:text-gray-300 cursor-pointer whitespace-nowrap transition-colors">{t('productonexspecs.t_fa0b4ecf')}</div>
              </Link>
              <Link href="/where-to-buy">
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">{t('productonexspecs.t_ec696fb3')}</Button>
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
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">{t('productonexspecs.t_ec696fb3')}</Button>
              </Link>
            </div>
            
            {/* Second Row: Menu Items */}
            <div className="flex items-center gap-6 px-4 overflow-x-auto">
              <Link href="/products/one-x/specs">
                <div className="text-sm text-white hover:text-gray-300 cursor-pointer whitespace-nowrap transition-colors font-medium">{t('productonexspecs.t_e41e791c')}</div>
              </Link>
              <Link href="/products/one-x/downloads">
                <div className="text-sm text-white hover:text-gray-300 cursor-pointer whitespace-nowrap transition-colors">{t('productonexspecs.t_8f7258d0')}</div>
              </Link>
              <Link href="/products/one-x/faq">
                <div className="text-sm text-white hover:text-gray-300 cursor-pointer whitespace-nowrap transition-colors">{t('productonexspecs.t_fa0b4ecf')}</div>
              </Link>
            </div>
          </nav>
        </div>
      </div>

      {/* Specs Content */}
      <section className="py-16 mt-6">
        <div className="container max-w-4xl">
          <h1 className="text-4xl lg:text-5xl font-bold mb-12 text-center">{t('productonexspecs.t_530f1958')}</h1>

          {/* Specifications Table */}
          <div className="space-y-12">
            {/* 核心規格 */}
            <div>
              <h2 className="text-3xl font-bold mb-6 pb-3 border-b-2 border-gray-200">{t('productonexspecs.t_51562267')}</h2>
              <table className="w-full">
                <tbody className="divide-y divide-gray-200">
                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-4 font-semibold text-gray-700 w-1/3">{t('productonexspecs.t_b0919a8a')}</td>
                    <td className="py-4 px-4 text-gray-900">
                      <div className="font-medium">Apolnus One X</div>
                      <div className="text-sm text-gray-500 mt-1">{t('productonexspecs.t_779ee3c4')}</div>
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-4 font-semibold text-gray-700">{t('productonexspecs.t_3f26a8d8')}</td>
                    <td className="py-4 px-4 text-gray-900">
                      <div className="font-medium">{t('productonexspecs.t_bba88065')}</div>
                      <div className="text-sm text-gray-500 mt-1">CONSUMABLE-FREE</div>
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-4 font-semibold text-gray-700">{t('productonexspecs.t_32000b92')}</td>
                    <td className="py-4 px-4">
                      <span className="text-3xl font-extrabold text-blue-600">15 - 19</span>
                      <span className="text-lg font-medium text-gray-700 ml-2">坪</span>
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-4 font-semibold text-gray-700">CADR</td>
                    <td className="py-4 px-4">
                      <span className="text-3xl font-extrabold text-blue-600">441.4</span>
                      <span className="text-lg font-medium text-gray-700 ml-2">m³/h</span>
                      <div className="text-sm text-gray-500 mt-1">{t('productonexspecs.t_d8f99c3c')}</div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* 效能認證 */}
            <div>
              <h2 className="text-3xl font-bold mb-6 pb-3 border-b-2 border-gray-200">{t('productonexspecs.t_e3777fdc')}</h2>
              <table className="w-full">
                <tbody className="divide-y divide-gray-200">
                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-4 font-semibold text-gray-700 w-1/3">{t('productonexspecs.t_8a09f29d')}</td>
                    <td className="py-4 px-4">
                      <span className="text-3xl font-extrabold text-green-600">≥ 99.9%</span>
                      <div className="text-sm text-gray-500 mt-2">{t('productonexspecs.t_0bd80a39')}</div>
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-4 font-semibold text-gray-700">{t('productonexspecs.t_3d210d1c')}</td>
                    <td className="py-4 px-4">
                      <span className="text-3xl font-extrabold text-green-600">&gt; 99.99%</span>
                      <div className="text-sm text-gray-500 mt-2">{t('productonexspecs.t_40b1b724')}</div>
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-4 font-semibold text-gray-700">{t('productonexspecs.t_da9d2ef1')}</td>
                    <td className="py-4 px-4">
                      <span className="text-3xl font-extrabold text-green-600">99.2%</span>
                      <div className="text-sm text-gray-500 mt-2">{t('productonexspecs.t_d8ac5c61')}</div>
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-4 font-semibold text-gray-700">{t('productonexspecs.t_d4db6f90')}</td>
                    <td className="py-4 px-4">
                      <span className="text-3xl font-extrabold text-green-600">94.7%</span>
                      <div className="text-sm text-gray-500 mt-2">{t('productonexspecs.t_e2eae0ad')}</div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* 獨家功能 */}
            <div>
              <h2 className="text-3xl font-bold mb-6 pb-3 border-b-2 border-gray-200">{t('productonexspecs.t_29930b2e')}</h2>
              <table className="w-full">
                <tbody className="divide-y divide-gray-200">
                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-4 font-semibold text-gray-700 w-1/3">{t('productonexspecs.t_f2c13b4f')}</td>
                    <td className="py-4 px-4">
                      <span className="text-3xl font-extrabold text-purple-600">{t('productonexspecs.t_dd5691f3')}</span>
                      <span className="text-lg font-medium text-gray-700 ml-2">/c.c.</span>
                      <div className="text-sm text-gray-500 mt-2">{t('productonexspecs.t_f2705e24')}</div>
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-4 font-semibold text-gray-700">{t('productonexspecs.t_cd9600d8')}</td>
                    <td className="py-4 px-4">
                      <span className="text-3xl font-extrabold text-purple-600">98%</span>
                      <span className="text-lg font-medium text-gray-700 ml-2">{t('productonexspecs.t_c583138c')}</span>
                      <div className="text-sm text-gray-500 mt-2">{t('productonexspecs.t_2952dfcb')}</div>
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-4 font-semibold text-gray-700">{t('productonexspecs.t_0686846e')}</td>
                    <td className="py-4 px-4">
                      <div className="font-medium text-gray-900">{t('productonexspecs.t_7a69d307')}</div>
                      <div className="text-sm text-gray-500 mt-1">{t('productonexspecs.t_e98bba60')}</div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* 智慧連線 */}
            <div>
              <h2 className="text-3xl font-bold mb-6 pb-3 border-b-2 border-gray-200">{t('productonexspecs.t_a723722e')}</h2>
              <table className="w-full">
                <tbody className="divide-y divide-gray-200">
                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-4 font-semibold text-gray-700 w-1/3">{t('productonexspecs.t_c7f3fc9a')}</td>
                    <td className="py-4 px-4">
                      <div className="font-medium text-gray-900">{t('productonexspecs.t_e74366f1')}</div>
                      <div className="text-sm text-gray-500 mt-1">{t('productonexspecs.t_6b359588')}</div>
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-4 font-semibold text-gray-700">{t('productonexspecs.t_895aa503')}</td>
                    <td className="py-4 px-4 font-medium text-gray-900">SmartCasa App</td>
                  </tr>
                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-4 font-semibold text-gray-700">{t('productonexspecs.t_f66200ac')}</td>
                    <td className="py-4 px-4 font-medium text-gray-900">{t('productonexspecs.t_4bf1ae63')}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* 硬體規格 */}
            <div>
              <h2 className="text-3xl font-bold mb-6 pb-3 border-b-2 border-gray-200">{t('productonexspecs.t_8fbd92e9')}</h2>
              <table className="w-full">
                <tbody className="divide-y divide-gray-200">
                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-4 font-semibold text-gray-700 w-1/3">{t('productonexspecs.t_d8404287')}</td>
                    <td className="py-4 px-4">
                      <div className="font-medium text-gray-900">480 × 180 × 470 mm</div>
                      <div className="text-sm text-gray-500 mt-1">{t('productonexspecs.t_e884650f')}</div>
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-4 font-semibold text-gray-700">{t('productonexspecs.t_38b94553')}</td>
                    <td className="py-4 px-4">
                      <span className="text-2xl font-bold text-gray-900">9</span>
                      <span className="text-lg font-medium text-gray-700 ml-2">kg</span>
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-4 font-semibold text-gray-700">{t('productonexspecs.t_263a4fb8')}</td>
                    <td className="py-4 px-4">
                      <span className="text-2xl font-bold text-gray-900">40</span>
                      <span className="text-lg font-medium text-gray-700 ml-2">W</span>
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-4 font-semibold text-gray-700">{t('productonexspecs.t_e47c7d0d')}</td>
                    <td className="py-4 px-4 font-medium text-gray-900">{t('productonexspecs.t_7d908489')}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-16 p-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-3">{t('productonexspecs.t_1e388d28')}</h3>
            <p className="text-gray-600 mb-6">{t('productonexspecs.t_94313100')}</p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link href="/products/one-x">
                <Button variant="outline" size="lg" className="text-base">{t('productonexspecs.t_92e7d87f')}</Button>
              </Link>
              <Link href="/where-to-buy">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-base">{t('productonexspecs.t_ec696fb3')}</Button>
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
