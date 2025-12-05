import { Link } from "wouter";
import { useTranslation } from 'react-i18next';
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/seo/SEOHead";

export default function ProductUltraS7Specs() {
  const { t } = useTranslation();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white">
      <SEOHead pageKey="product-ultra-s7-specs" />
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
                <div className="text-sm text-white hover:text-gray-300 cursor-pointer whitespace-nowrap transition-colors font-medium">{t('productultras7specs.t_89de3139')}</div>
              </Link>
              <Link href="/products/ultra-s7/downloads">
                <div className="text-sm text-white hover:text-gray-300 cursor-pointer whitespace-nowrap transition-colors">{t('productultras7specs.t_8f7258d0')}</div>
              </Link>
              <Link href="/products/ultra-s7/faq">
                <div className="text-sm text-white hover:text-gray-300 cursor-pointer whitespace-nowrap transition-colors">{t('productultras7specs.t_fa0b4ecf')}</div>
              </Link>
              <Link href="/where-to-buy">
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">{t('productultras7specs.t_ec696fb3')}</Button>
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
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">{t('productultras7specs.t_ec696fb3')}</Button>
              </Link>
            </div>
            
            {/* Second Row: Menu Items */}
            <div className="flex items-center gap-6 px-4 overflow-x-auto">
              <Link href="/products/ultra-s7/specs">
                <div className="text-sm text-white hover:text-gray-300 cursor-pointer whitespace-nowrap transition-colors font-medium">{t('productultras7specs.t_89de3139')}</div>
              </Link>
              <Link href="/products/ultra-s7/downloads">
                <div className="text-sm text-white hover:text-gray-300 cursor-pointer whitespace-nowrap transition-colors">{t('productultras7specs.t_8f7258d0')}</div>
              </Link>
              <Link href="/products/ultra-s7/faq">
                <div className="text-sm text-white hover:text-gray-300 cursor-pointer whitespace-nowrap transition-colors">{t('productultras7specs.t_fa0b4ecf')}</div>
              </Link>
            </div>
          </nav>
        </div>
      </div>

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-gray-50 to-white py-16 mt-8">
        <div className="container">
          <h1 className="text-4xl lg:text-5xl font-bold text-center mb-4">{t('productultras7specs.t_89de3139')}</h1>
          <p className="text-xl text-gray-600 text-center">{t('productultras7specs.t_835e14ac')}</p>
        </div>
      </section>

      {/* Specs Tables */}
      <section className="py-12">
        <div className="container max-w-4xl">
          {/* Performance Specs */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6 pb-2 border-b-2 border-blue-600">{t('productultras7specs.t_1bc48680')}</h2>
            <table className="w-full">
              <tbody className="divide-y divide-gray-200">
                <tr className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-4 font-semibold text-gray-700 w-1/3">{t('productultras7specs.t_5626a1fc')}</td>
                  <td className="py-4 px-4">
                    <span className="text-3xl font-extrabold text-blue-600">2.88 cmm</span>
                    <div className="text-sm text-gray-500 mt-2">{t('productultras7specs.t_5c284aed')}</div>
                    <div className="text-xs text-gray-400 mt-1">{t('productultras7specs.t_a905ce3e')}</div>
                  </td>
                </tr>
                <tr className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-4 font-semibold text-gray-700">{t('productultras7specs.t_32000b92')}</td>
                  <td className="py-4 px-4">
                    <span className="text-3xl font-extrabold text-blue-600">{t('productultras7specs.t_f77e6ac6')}</span>
                  </td>
                </tr>
                <tr className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-4 font-semibold text-gray-700 w-1/3">{t('productultras7specs.t_8a09f29d')}</td>
                  <td className="py-4 px-4">
                    <span className="text-3xl font-extrabold text-green-600">≥ 99.9%</span>
                    <div className="text-sm text-gray-500 mt-2">{t('productultras7specs.t_8137f32e')}</div>
                    <div className="text-xs text-gray-400 mt-1">{t('productultras7specs.t_a152fde8')}</div>
                  </td>
                </tr>
                <tr className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-4 font-semibold text-gray-700">{t('productultras7specs.t_3d210d1c')}</td>
                  <td className="py-4 px-4">
                    <span className="text-3xl font-extrabold text-green-600">&gt; 99.9%</span>
                    <div className="text-xs text-gray-400 mt-1">{t('productultras7specs.t_e7055214')}</div>
                  </td>
                </tr>
                <tr className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-4 font-semibold text-gray-700">{t('productultras7specs.t_d4db6f90')}</td>
                  <td className="py-4 px-4">
                    <span className="text-2xl font-bold text-gray-800">{t('productultras7specs.t_69cf53e0')}</span>
                    <div className="text-xs text-gray-400 mt-1">{t('productultras7specs.t_4b1d5721')}</div>
                  </td>
                </tr>
                <tr className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-4 font-semibold text-gray-700">{t('productultras7specs.t_e508f097')}</td>
                  <td className="py-4 px-4">
                    <span className="text-2xl font-bold text-gray-800">{t('productultras7specs.t_69cf53e0')}</span>
                    <div className="text-xs text-gray-400 mt-1">{t('productultras7specs.t_918b8e34')}</div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Technical Specs */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6 pb-2 border-b-2 border-blue-600">{t('productultras7specs.t_e41e791c')}</h2>
            <table className="w-full">
              <tbody className="divide-y divide-gray-200">
                <tr className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-4 font-semibold text-gray-700 w-1/3">{t('productultras7specs.t_5a3952d5')}</td>
                  <td className="py-4 px-4">{t('productultras7specs.t_ae23ac9b')}</td>
                </tr>
                <tr className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-4 font-semibold text-gray-700">{t('productultras7specs.t_a4d331bc')}</td>
                  <td className="py-4 px-4">{t('productultras7specs.t_48b9bc9a')}</td>
                </tr>
                <tr className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-4 font-semibold text-gray-700">{t('productultras7specs.t_5b72f9ae')}</td>
                  <td className="py-4 px-4">
                    <span className="text-3xl font-extrabold text-blue-600">19.3 dB(A)</span>
                    <div className="text-xs text-gray-400 mt-1">{t('productultras7specs.t_fe52c5d5')}</div>
                  </td>
                </tr>
                <tr className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-4 font-semibold text-gray-700">{t('productultras7specs.t_263a4fb8')}</td>
                  <td className="py-4 px-4">15 W</td>
                </tr>
                <tr className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-4 font-semibold text-gray-700">{t('productultras7specs.t_913f95cc')}</td>
                  <td className="py-4 px-4">110 - 240 V</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Physical Specs */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6 pb-2 border-b-2 border-blue-600">{t('productultras7specs.t_d7feacec')}</h2>
            <table className="w-full">
              <tbody className="divide-y divide-gray-200">
                <tr className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-4 font-semibold text-gray-700 w-1/3">{t('productultras7specs.t_d8404287')}</td>
                  <td className="py-4 px-4">
                    <span className="text-lg text-gray-800">{t('productultras7specs.t_4948e90a')}</span>
                  </td>
                </tr>
                <tr className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-4 font-semibold text-gray-700">{t('productultras7specs.t_38b94553')}</td>
                  <td className="py-4 px-4">
                    <span className="text-lg text-gray-800">1.95 kg</span>
                  </td>
                </tr>
                <tr className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-4 font-semibold text-gray-700">{t('productultras7specs.t_b1c4123d')}</td>
                  <td className="py-4 px-4">
                    <span className="text-lg text-gray-800">{t('productultras7specs.t_ff4c9f6a')}</span>
                    <div className="text-sm text-gray-500 mt-2">{t('productultras7specs.t_00ba9297')}</div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Smart Features */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6 pb-2 border-b-2 border-blue-600">{t('productultras7specs.t_11afbaff')}</h2>
            <table className="w-full">
              <tbody className="divide-y divide-gray-200">
                <tr className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-4 font-semibold text-gray-700 w-1/3">{t('productultras7specs.t_ad61b3ac')}</td>
                  <td className="py-4 px-4">VOC</td>
                </tr>
                <tr className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-4 font-semibold text-gray-700">{t('productultras7specs.t_e8eb6565')}</td>
                  <td className="py-4 px-4">{t('productultras7specs.t_608c1e57')}</td>
                </tr>
                <tr className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-4 font-semibold text-gray-700">{t('productultras7specs.t_cbb08c9c')}</td>
                  <td className="py-4 px-4">{t('productultras7specs.t_581e50be')}</td>
                </tr>
                <tr className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-4 font-semibold text-gray-700">{t('productultras7specs.t_74481bb7')}</td>
                  <td className="py-4 px-4">{t('productultras7specs.t_f0851cae')}</td>
                </tr>
                <tr className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-4 font-semibold text-gray-700">{t('productultras7specs.t_53f2c97d')}</td>
                  <td className="py-4 px-4">{t('productultras7specs.t_47bc5982')}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Package Contents */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6 pb-2 border-b-2 border-blue-600">{t('productultras7specs.t_7bd19c61')}</h2>
            <ul className="space-y-3">
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span>{t('productultras7specs.t_bb470ea8')}</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span>{t('productultras7specs.t_a5e6fea3')}</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span>{t('productultras7specs.t_63455a3c')}</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span>{t('productultras7specs.t_da3d83c3')}</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span>{t('productultras7specs.t_1b90ef45')}</span>
              </li>
            </ul>
          </div>

          {/* 免責聲明 */}
          <div className="bg-gray-50 p-6 rounded-lg mb-12">
            <h3 className="font-semibold text-gray-700 mb-3">{t('productultras7specs.t_dcd0fc58')}</h3>
            <p className="text-sm text-gray-600 leading-relaxed">{t('productultras7specs.t_9482247f')}</p>
          </div>

          {/* CTA */}
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <h3 className="text-2xl font-bold mb-4">{t('productultras7specs.t_2cac82e0')}</h3>
            <Link href="https://store.apolnus.com/">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">{t('productultras7specs.t_ec696fb3')}</Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
