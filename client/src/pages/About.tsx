import { useState } from "react";
import { useTranslation } from "react-i18next";
import SEOHead from "@/components/seo/SEOHead";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function About() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<"about" | "contact">("about");

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <SEOHead pageKey="about" />
      <Navbar />
      {/* Hero Section with Background Image */}
      <div className="relative h-[40vh] lg:h-[50vh] lg:h-[60vh] w-full overflow-hidden">
        <img 
          src="/am.jpg" 
          alt="Apolnus Building" 
          className="w-full h-full object-cover"
        />
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="flex gap-0">
            <button
              onClick={() => setActiveTab("about")}
              className={`px-6 lg:px-8 py-4 text-sm lg:text-base font-medium transition-colors relative ${
                activeTab === "about"
                  ? "text-gray-900"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {t('about.tabs.about')}
              {activeTab === "about" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black" />
              )}
            </button>
            <button
              onClick={() => setActiveTab("contact")}
              className={`px-6 lg:px-8 py-4 text-sm lg:text-base font-medium transition-colors relative ${
                activeTab === "contact"
                  ? "text-gray-900"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {t('about.tabs.contact')}
              {activeTab === "contact" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 bg-white">
        {activeTab === "about" ? (
          <div className="container mx-auto px-4 lg:px-6 py-12 lg:py-16 lg:py-20 max-w-5xl">
            <div className="space-y-5">
              {/* 所有段落使用統一較小字型 (14px) */}
              <p className="text-sm leading-relaxed text-gray-700">{t('about.t_0d2fdbc6')}</p>
              
              <p className="text-sm leading-relaxed text-gray-700">{t('about.t_abbd6db6')}</p>
              
              <p className="text-sm leading-relaxed text-gray-700">{t('about.t_aceda23c')}</p>
              
              <p className="text-sm leading-relaxed text-gray-700">{t('about.t_6d1b140a')}</p>
              
              <p className="text-sm leading-relaxed text-gray-700">{t('about.t_0bc4f365')}</p>
              
              <p className="text-sm leading-relaxed text-gray-700">{t('about.t_57c96e51')}</p>
              
              <p className="text-sm leading-relaxed text-gray-700">{t('about.t_619cc303')}</p>
              
              <p className="text-sm leading-relaxed text-gray-700 mb-8">{t('about.t_34530f41')}</p>
              
              <p className="text-right text-sm text-gray-600 italic">
                -- Aaron Kuo
              </p>
            </div>
          </div>
        ) : (
          <div className="container mx-auto px-4 lg:px-6 py-12 lg:py-16 lg:py-20 max-w-5xl">
            {/* 總部 */}
            <div className="mb-12">
              <h2 className="text-xl font-medium text-gray-900 mb-6">{t('about.t_47de64a9')}</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-3">
                {/* 左右並排：標題和內容在同一行 */}
                <div className="flex flex-col lg:flex-row lg:items-center gap-1 lg:gap-2">
                  <div className="text-sm text-gray-700 lg:w-56 flex-shrink-0">{t('about.t_3b2a4807')}</div>
                  <div className="text-sm">
                    <a href="#" className="text-blue-600 hover:underline">{t('about.t_08ce8a1f')}</a>
                  </div>
                </div>
                
                <div className="flex flex-col lg:flex-row lg:items-center gap-1 lg:gap-2">
                  <div className="text-sm text-gray-700 lg:w-56 flex-shrink-0">{t('about.t_34f0d32c')}</div>
                  <div className="text-sm">
                    <a href="#" className="text-blue-600 hover:underline">{t('about.t_08ce8a1f')}</a>
                  </div>
                </div>
                
                <div className="flex flex-col lg:flex-row lg:items-center gap-1 lg:gap-2">
                  <div className="text-sm text-gray-700 lg:w-56 flex-shrink-0">{t('about.t_4faf747d')}</div>
                  <div className="text-sm">
                    <a href="mailto:kol@apolnus.com" className="text-blue-600 hover:underline">
                      kol@apolnus.com
                    </a>
                  </div>
                </div>
                
                <div className="flex flex-col lg:flex-row lg:items-center gap-1 lg:gap-2">
                  <div className="text-sm text-gray-700 lg:w-56 flex-shrink-0">{t('about.t_fdb32954')}</div>
                  <div className="text-sm">
                    <a href="mailto:purchasing@apolnus.com" className="text-blue-600 hover:underline">
                      purchasing@apolnus.com
                    </a>
                  </div>
                </div>
                
                <div className="flex flex-col lg:flex-row lg:items-center gap-1 lg:gap-2">
                  <div className="text-sm text-gray-700 lg:w-56 flex-shrink-0">{t('about.t_9b6562d9')}</div>
                  <div className="text-sm">
                    <a href="mailto:pr@apolnus.com" className="text-blue-600 hover:underline">
                      pr@apolnus.com
                    </a>
                  </div>
                </div>
                
                <div className="flex flex-col lg:flex-row lg:items-center gap-1 lg:gap-2">
                  <div className="text-sm text-gray-700 lg:w-56 flex-shrink-0">{t('about.t_6a4649ab')}</div>
                  <div className="text-sm">
                    <a href="mailto:hr@apolnus.com" className="text-blue-600 hover:underline">
                      hr@apolnus.com
                    </a>
                  </div>
                </div>
                
                <div className="flex flex-col lg:flex-row lg:items-center gap-1 lg:gap-2">
                  <div className="text-sm text-gray-700 lg:w-56 flex-shrink-0">{t('about.t_40db0c15')}</div>
                  <div className="text-sm">
                    <a href="mailto:dev@apolnus.com" className="text-blue-600 hover:underline">
                      dev@apolnus.com
                    </a>
                  </div>
                </div>
                
                <div className="flex flex-col lg:flex-row lg:items-center gap-1 lg:gap-2">
                  <div className="text-sm text-gray-700 lg:w-56 flex-shrink-0">{t('about.t_707ccaaa')}</div>
                  <div className="text-sm">
                    <a href="mailto:govrelations@apolnus.com" className="text-blue-600 hover:underline">
                      govrelations@apolnus.com
                    </a>
                  </div>
                </div>
                
                <div className="flex flex-col lg:flex-row lg:items-center gap-1 lg:gap-2">
                  <div className="text-sm text-gray-700 lg:w-56 flex-shrink-0">{t('about.t_447cd72f')}</div>
                  <div className="text-sm">
                    <a href="mailto:ip@apolnus.com" className="text-blue-600 hover:underline">
                      ip@apolnus.com
                    </a>
                  </div>
                </div>
                
                <div className="flex flex-col lg:flex-row lg:items-center gap-1 lg:gap-2">
                  <div className="text-sm text-gray-700 lg:w-56 flex-shrink-0">{t('about.t_d62a00ee')}</div>
                  <div className="text-sm">
                    <a href="mailto:corpdev@apolnus.com" className="text-blue-600 hover:underline">
                      corpdev@apolnus.com
                    </a>
                  </div>
                </div>
                
                <div className="flex flex-col lg:flex-row lg:items-center gap-1 lg:gap-2">
                  <div className="text-sm text-gray-700 lg:w-56 flex-shrink-0">{t('about.t_bb99166a')}</div>
                  <div className="text-sm">
                    <a href="mailto:legal@apolnus.com" className="text-blue-600 hover:underline">
                      legal@apolnus.com
                    </a>
                  </div>
                </div>
                
                <div className="flex flex-col lg:flex-row lg:items-center gap-1 lg:gap-2">
                  <div className="text-sm text-gray-700 lg:w-56 flex-shrink-0">{t('about.t_6f5c945c')}</div>
                  <div className="text-sm">
                    <a href="mailto:admin@apolnus.com" className="text-blue-600 hover:underline">
                      admin@apolnus.com
                    </a>
                  </div>
                </div>
                
                <div className="flex flex-col lg:flex-row lg:items-center gap-1 lg:gap-2">
                  <div className="text-sm text-gray-700 lg:w-56 flex-shrink-0">{t('about.t_9842b186')}</div>
                  <div className="text-sm">
                    <a href="#" className="text-blue-600 hover:underline">{t('about.t_08ce8a1f')}</a>
                  </div>
                </div>
                
                <div className="flex flex-col lg:flex-row lg:items-center gap-1 lg:gap-2">
                  <div className="text-sm text-gray-700 lg:w-56 flex-shrink-0">{t('about.t_78c182c6')}</div>
                  <div className="text-sm text-gray-700">{t('about.t_293591ac')}</div>
                </div>
                
                <div className="flex flex-col lg:flex-row lg:items-center gap-1 lg:gap-2">
                  <div className="text-sm text-gray-700 lg:w-56 flex-shrink-0">{t('about.t_b6f43c77')}</div>
                  <div className="text-sm text-gray-700">
                    0800-700-788<br />
                    02-2758-5879
                  </div>
                </div>
                
                <div className="flex flex-col lg:flex-row lg:items-center gap-1 lg:gap-2">
                  <div className="text-sm text-gray-700 lg:w-56 flex-shrink-0">{t('about.t_bb48c22f')}</div>
                  <div className="text-sm">
                    <a href="mailto:inform@apolnus.com" className="text-blue-600 hover:underline">
                      inform@apolnus.com
                    </a>
                  </div>
                </div>
                
                <div className="flex flex-col lg:flex-row lg:items-center gap-1 lg:gap-2">
                  <div className="text-sm text-gray-700 lg:w-56 flex-shrink-0">{t('about.t_783208d1')}</div>
                  <div className="text-sm text-gray-700">{t('about.t_a0993cb6')}</div>
                </div>
              </div>
            </div>

            {/* 北美 */}
            <div className="mb-12">
              <h2 className="text-xl font-medium text-gray-900 mb-6">{t('about.t_e7be3d18')}</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-3">
                <div className="flex flex-col lg:flex-row lg:items-center gap-1 lg:gap-2">
                  <div className="text-sm text-gray-700 lg:w-56 flex-shrink-0">{t('about.t_f3e7b6a9')}</div>
                  <div className="text-sm">
                    <a href="#" className="text-blue-600 hover:underline">{t('about.t_08ce8a1f')}</a>
                  </div>
                </div>
                
                <div className="flex flex-col lg:flex-row lg:items-center gap-1 lg:gap-2">
                  <div className="text-sm text-gray-700 lg:w-56 flex-shrink-0">{t('about.t_3b2a4807')}</div>
                  <div className="text-sm">
                    <a href="#" className="text-blue-600 hover:underline">{t('about.t_08ce8a1f')}</a>
                  </div>
                </div>
                
                <div className="flex flex-col lg:flex-row lg:items-center gap-1 lg:gap-2">
                  <div className="text-sm text-gray-700 lg:w-56 flex-shrink-0">{t('about.t_9b6562d9')}</div>
                  <div className="text-sm">
                    <a href="mailto:pr.us@apolnus.com" className="text-blue-600 hover:underline">
                      pr.us@apolnus.com
                    </a>
                  </div>
                </div>
                
                <div className="flex flex-col lg:flex-row lg:items-center gap-1 lg:gap-2">
                  <div className="text-sm text-gray-700 lg:w-56 flex-shrink-0">{t('about.t_9842b186')}</div>
                  <div className="text-sm">
                    <a href="#" className="text-blue-600 hover:underline">{t('about.t_08ce8a1f')}</a>
                  </div>
                </div>
                
                <div className="flex flex-col lg:flex-row lg:items-center gap-1 lg:gap-2">
                  <div className="text-sm text-gray-700 lg:w-56 flex-shrink-0">{t('about.t_783208d1')}</div>
                  <div className="text-sm text-gray-700">
                    Monday to Friday, 09:00 to 17:00 (PST)
                  </div>
                </div>
                
                <div className="flex flex-col lg:flex-row lg:items-center gap-1 lg:gap-2">
                  <div className="text-sm text-gray-700 lg:w-56 flex-shrink-0">{t('about.t_78c182c6')}</div>
                  <div className="text-sm text-gray-700">
                    Wyoming, USA
                  </div>
                </div>
              </div>
            </div>

            {/* 日本 */}
            <div className="mb-12">
              <h2 className="text-xl font-medium text-gray-900 mb-6">{t('about.t_4dbed2e6')}</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-3">
                <div className="flex flex-col lg:flex-row lg:items-center gap-1 lg:gap-2">
                  <div className="text-sm text-gray-700 lg:w-56 flex-shrink-0">{t('about.t_f3e7b6a9')}</div>
                  <div className="text-sm">
                    <a href="mailto:sales.jp@apolnus.com" className="text-blue-600 hover:underline">
                      sales.jp@apolnus.com
                    </a>
                  </div>
                </div>
                
                <div className="flex flex-col lg:flex-row lg:items-center gap-1 lg:gap-2">
                  <div className="text-sm text-gray-700 lg:w-56 flex-shrink-0">{t('about.t_3b2a4807')}</div>
                  <div className="text-sm">
                    <a href="#" className="text-blue-600 hover:underline">{t('about.t_08ce8a1f')}</a>
                  </div>
                </div>
                
                <div className="flex flex-col lg:flex-row lg:items-center gap-1 lg:gap-2">
                  <div className="text-sm text-gray-700 lg:w-56 flex-shrink-0">{t('about.t_9b6562d9')}</div>
                  <div className="text-sm">
                    <a href="mailto:pr.jp@apolnus.com" className="text-blue-600 hover:underline">
                      pr.jp@apolnus.com
                    </a>
                  </div>
                </div>
                
                <div className="flex flex-col lg:flex-row lg:items-center gap-1 lg:gap-2">
                  <div className="text-sm text-gray-700 lg:w-56 flex-shrink-0">{t('about.t_783208d1')}</div>
                  <div className="text-sm text-gray-700">{t('about.t_0d98789d')}</div>
                </div>
                
                <div className="flex flex-col lg:flex-row lg:items-center gap-1 lg:gap-2">
                  <div className="text-sm text-gray-700 lg:w-56 flex-shrink-0">{t('about.t_78c182c6')}</div>
                  <div className="text-sm text-gray-700">
                    Tokyo, Japan
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
