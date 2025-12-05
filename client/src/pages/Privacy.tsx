import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useTranslation } from "react-i18next";
import SEOHead from "@/components/seo/SEOHead";

export default function Privacy() {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen flex flex-col">
      <SEOHead pageKey="privacy-policy" />
      <Navbar />
      
      {/* Page Header */}
      <div className="bg-gray-900 text-white pt-[124px] lg:pt-[164px] pb-12">
        <div className="container">
          <h1 className="hero-title text-center text-white">{t('privacy.t_724165e9')}</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-gray-50 py-12">
        <div className="container max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Left Sidebar Navigation */}
            <aside className="lg:col-span-1">
              <nav className="sticky top-24 space-y-2">
                <a href="#scope" className="block px-4 py-2 text-sm hover:bg-gray-200 rounded border-l-4 border-orange-500">{t('privacy.t_19ef4d8a')}</a>
                <a href="#collect" className="block px-4 py-2 text-sm hover:bg-gray-200 rounded border-l-4 border-purple-500">{t('privacy.t_186e2ae8')}</a>
                <a href="#use" className="block px-4 py-2 text-sm hover:bg-gray-200 rounded border-l-4 border-cyan-500">{t('privacy.t_b825c31f')}</a>
                <a href="#cookies" className="block px-4 py-2 text-sm hover:bg-gray-200 rounded border-l-4 border-pink-500">{t('privacy.t_755fb02d')}</a>
                <a href="#share" className="block px-4 py-2 text-sm hover:bg-gray-200 rounded border-l-4 border-green-500">{t('privacy.t_e0ea8f5e')}</a>
                <a href="#transfer" className="block px-4 py-2 text-sm hover:bg-gray-200 rounded border-l-4 border-blue-500">{t('privacy.t_29f62de8')}</a>
                <a href="#retention" className="block px-4 py-2 text-sm hover:bg-gray-200 rounded border-l-4 border-red-500">{t('privacy.t_60336ec1')}</a>
                <a href="#rights" className="block px-4 py-2 text-sm hover:bg-gray-200 rounded border-l-4 border-yellow-500">{t('privacy.t_ff4ee4af')}</a>
                <a href="#children" className="block px-4 py-2 text-sm hover:bg-gray-200 rounded border-l-4 border-indigo-500">{t('privacy.t_6b0046cb')}</a>
                <a href="#security" className="block px-4 py-2 text-sm hover:bg-gray-200 rounded border-l-4 border-teal-500">{t('privacy.t_f4fcd08d')}</a>
                <a href="#changes" className="block px-4 py-2 text-sm hover:bg-gray-200 rounded border-l-4 border-rose-500">{t('privacy.t_251bd6f2')}</a>
                <a href="#contact" className="block px-4 py-2 text-sm hover:bg-gray-200 rounded border-l-4 border-amber-500">{t('privacy.t_121caed2')}</a>
              </nav>
            </aside>

            {/* Right Content Area */}
            <div className="lg:col-span-3 bg-white rounded-lg shadow-sm p-8 lg:p-12">
              <div className="prose prose-gray max-w-none">
                <p className="text-sm text-gray-600 mb-8">{t('privacy.t_9bfe43fc')}<br />{t('privacy.t_87c25e2c')}</p>

                <p className="mb-6">{t('privacy.t_2706bf22')}</p>

                <p className="mb-8">{t('privacy.t_243ebdd0')}</p>

                <section id="scope" className="mb-12">
                  <h2 className="text-2xl font-bold mb-4">{t('privacy.t_8f78e0f0')}</h2>
                  <p className="mb-4">{t('privacy.t_3df87e93')}</p>
                  <ul className="list-disc pl-6 mb-4 space-y-2">
                    <li>{t('privacy.t_1242c7db')}</li>
                    <li>{t('privacy.t_7e2d3f0b')}</li>
                    <li>{t('privacy.t_f2ce42d8')}</li>
                    <li>{t('privacy.t_ed67f9f7')}</li>
                  </ul>
                  <p>{t('privacy.t_38db1da2')}</p>
                </section>

                <section id="collect" className="mb-12">
                  <h2 className="text-2xl font-bold mb-4">{t('privacy.t_21e8ea40')}</h2>
                  <p className="mb-4">{t('privacy.t_60f8e8cd')}</p>
                  
                  <h3 className="text-xl font-semibold mt-6 mb-3">{t('privacy.t_e8d40e8c')}</h3>
                  <ul className="list-disc pl-6 mb-4 space-y-1">
                    <li>{t('privacy.t_e889232a')}</li>
                    <li>{t('privacy.t_ed0d8846')}</li>
                    <li>{t('privacy.t_656a0df4')}</li>
                    <li>{t('privacy.t_383ebb3c')}</li>
                    <li>{t('privacy.t_eb569e12')}</li>
                  </ul>

                  <h3 className="text-xl font-semibold mt-6 mb-3">{t('privacy.t_89b072c7')}</h3>
                  <ul className="list-disc pl-6 mb-4 space-y-1">
                    <li>{t('privacy.t_c1fae5fc')}</li>
                    <li>{t('privacy.t_598fb8ab')}</li>
                    <li>{t('privacy.t_e0acf0b1')}</li>
                    <li>{t('privacy.t_d2e5008a')}</li>
                  </ul>
                  <p className="text-sm text-gray-600 mb-4">{t('privacy.t_35e36fce')}</p>

                  <h3 className="text-xl font-semibold mt-6 mb-3">{t('privacy.t_3af9b076')}</h3>
                  <ul className="list-disc pl-6 mb-4 space-y-1">
                    <li>{t('privacy.t_2cab3d4e')}</li>
                    <li>{t('privacy.t_5edda037')}</li>
                    <li>{t('privacy.t_3661e392')}</li>
                  </ul>

                  <h3 className="text-xl font-semibold mt-6 mb-3">{t('privacy.t_209139d8')}</h3>
                  <ul className="list-disc pl-6 mb-4 space-y-1">
                    <li>{t('privacy.t_14c1e41f')}</li>
                    <li>{t('privacy.t_118a11c3')}</li>
                    <li>{t('privacy.t_4c6bb198')}</li>
                    <li>{t('privacy.t_1996047b')}</li>
                  </ul>

                  <h3 className="text-xl font-semibold mt-6 mb-3">{t('privacy.t_a8106134')}</h3>
                  <ul className="list-disc pl-6 mb-4 space-y-1">
                    <li>{t('privacy.t_b6486816')}</li>
                    <li>{t('privacy.t_44bb21c5')}</li>
                    <li>{t('privacy.t_cb7b9b5c')}</li>
                  </ul>

                  <h3 className="text-xl font-semibold mt-6 mb-3">{t('privacy.t_fe08d731')}</h3>
                  <ul className="list-disc pl-6 mb-4 space-y-1">
                    <li>{t('privacy.t_eb058e6c')}</li>
                    <li>{t('privacy.t_29298f70')}</li>
                  </ul>
                </section>

                <section id="use" className="mb-12">
                  <h2 className="text-2xl font-bold mb-4">{t('privacy.t_62dc6aff')}</h2>
                  <p className="mb-4">{t('privacy.t_1322608e')}</p>
                  
                  <h3 className="text-xl font-semibold mt-6 mb-3">{t('privacy.t_45de0032')}</h3>
                  <ul className="list-disc pl-6 mb-4 space-y-1">
                    <li>{t('privacy.t_429110c1')}</li>
                    <li>{t('privacy.t_7aa72062')}</li>
                    <li>{t('privacy.t_0d47c8bf')}</li>
                    <li>{t('privacy.t_dbc3eadd')}</li>
                  </ul>

                  <h3 className="text-xl font-semibold mt-6 mb-3">{t('privacy.t_3ac588a4')}</h3>
                  <ul className="list-disc pl-6 mb-4 space-y-1">
                    <li>{t('privacy.t_d7446c9b')}</li>
                    <li>{t('privacy.t_94bdb575')}</li>
                    <li>{t('privacy.t_c1e81758')}</li>
                  </ul>

                  <h3 className="text-xl font-semibold mt-6 mb-3">{t('privacy.t_8d195867')}</h3>
                  <ul className="list-disc pl-6 mb-4 space-y-1">
                    <li>{t('privacy.t_cff74bbf')}</li>
                    <li>{t('privacy.t_5906d532')}</li>
                    <li>{t('privacy.t_415afa36')}</li>
                  </ul>
                  <p className="text-sm text-gray-600 mb-4">{t('privacy.t_34c60933')}</p>

                  <h3 className="text-xl font-semibold mt-6 mb-3">{t('privacy.t_4e017c66')}</h3>
                  <ul className="list-disc pl-6 mb-4 space-y-1">
                    <li>{t('privacy.t_354d0245')}</li>
                    <li>{t('privacy.t_4db07eca')}</li>
                    <li>{t('privacy.t_a31210c8')}</li>
                  </ul>

                  <h3 className="text-xl font-semibold mt-6 mb-3">{t('privacy.t_045533aa')}</h3>
                  <p>{t('privacy.t_3daead96')}</p>
                </section>

                <section id="cookies" className="mb-12">
                  <h2 className="text-2xl font-bold mb-4">{t('privacy.t_192e9abd')}</h2>
                  <p className="mb-4">{t('privacy.t_e2168ffc')}</p>
                  <ul className="list-disc pl-6 mb-4 space-y-2">
                    <li>{t('privacy.t_972edec9')}</li>
                    <li>{t('privacy.t_a051889a')}</li>
                    <li>{t('privacy.t_efa779f6')}</li>
                    <li>{t('privacy.t_63362fb5')}</li>
                  </ul>
                  <p>{t('privacy.t_ca121ece')}</p>
                </section>

                <section id="share" className="mb-12">
                  <h2 className="text-2xl font-bold mb-4">{t('privacy.t_0e396e15')}</h2>
                  <p className="mb-4">{t('privacy.t_c911e15c')}</p>
                  
                  <h3 className="text-xl font-semibold mt-6 mb-3">{t('privacy.t_acf19ee7')}</h3>
                  <p className="mb-4">{t('privacy.t_fbab5c91')}</p>
                  <ul className="list-disc pl-6 mb-4 space-y-1">
                    <li>{t('privacy.t_f7c23e26')}</li>
                    <li>{t('privacy.t_75b1f7b7')}</li>
                    <li>{t('privacy.t_8e343e77')}</li>
                    <li>{t('privacy.t_9873840c')}</li>
                    <li>{t('privacy.t_233b3c70')}</li>
                  </ul>
                  <p className="mb-4">{t('privacy.t_56fdbb43')}</p>

                  <h3 className="text-xl font-semibold mt-6 mb-3">{t('privacy.t_56e637c2')}</h3>
                  <p className="mb-4">{t('privacy.t_c0f73a95')}</p>
                  <ul className="list-disc pl-6 mb-4 space-y-1">
                    <li>{t('privacy.t_eec29c3d')}</li>
                    <li>{t('privacy.t_7a48f5ae')}</li>
                    <li>{t('privacy.t_3b4ba1a7')}</li>
                  </ul>

                  <h3 className="text-xl font-semibold mt-6 mb-3">{t('privacy.t_0057b051')}</h3>
                  <p className="mb-4">{t('privacy.t_3eecc53b')}</p>

                  <h3 className="text-xl font-semibold mt-6 mb-3">{t('privacy.t_13569d58')}</h3>
                  <p>{t('privacy.t_4c752636')}</p>
                </section>

                <section id="transfer" className="mb-12">
                  <h2 className="text-2xl font-bold mb-4">{t('privacy.t_dfc01e23')}</h2>
                  <p>{t('privacy.t_e507c1e9')}</p>
                </section>

                <section id="retention" className="mb-12">
                  <h2 className="text-2xl font-bold mb-4">{t('privacy.t_7954181b')}</h2>
                  <p className="mb-4">{t('privacy.t_46447a56')}</p>
                  <ul className="list-disc pl-6 mb-4 space-y-2">
                    <li>{t('privacy.t_5d935432')}</li>
                    <li>{t('privacy.t_47cdbbde')}</li>
                    <li>{t('privacy.t_6882eeef')}</li>
                  </ul>
                  <p>{t('privacy.t_54f6b8a8')}</p>
                </section>

                <section id="rights" className="mb-12">
                  <h2 className="text-2xl font-bold mb-4">{t('privacy.t_876ee5c9')}</h2>
                  <p className="mb-4">{t('privacy.t_bdc9336a')}</p>
                  <ul className="list-disc pl-6 mb-4 space-y-2">
                    <li>{t('privacy.t_6dd566f4')}</li>
                    <li>{t('privacy.t_5581db71')}</li>
                    <li>{t('privacy.t_3358d041')}</li>
                    <li>{t('privacy.t_1998db44')}</li>
                    <li>{t('privacy.t_ac63db6d')}</li>
                    <li>{t('privacy.t_8f1392bd')}</li>
                  </ul>
                  <p>{t('privacy.t_1103a5ff')}</p>
                </section>

                <section id="children" className="mb-12">
                  <h2 className="text-2xl font-bold mb-4">{t('privacy.t_5a6b26bf')}</h2>
                  <p>{t('privacy.t_fe8f249e')}</p>
                </section>

                <section id="security" className="mb-12">
                  <h2 className="text-2xl font-bold mb-4">{t('privacy.t_e5a3e2c4')}</h2>
                  <p className="mb-4">{t('privacy.t_81f910d9')}</p>
                </section>

                <section id="changes" className="mb-12">
                  <h2 className="text-2xl font-bold mb-4">{t('privacy.t_ac48890f')}</h2>
                  <p>{t('privacy.t_2fd59168')}</p>
                </section>

                <section id="contact" className="mb-12">
                  <h2 className="text-2xl font-bold mb-4">{t('privacy.t_8bca65d4')}</h2>
                  <p className="mb-4">{t('privacy.t_4ffde27e')}</p>
                  <p className="font-semibold">Apolnus Ventures LLC</p>
                  <p>Email: hello@apolnus.com</p>
                </section>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
