import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useTranslation } from "react-i18next";
import SEOHead from "@/components/seo/SEOHead";

export default function Terms() {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen flex flex-col">
      <SEOHead pageKey="terms-of-use" />
      <Navbar />
      
      <main className="flex-1 bg-white">
        {/* Hero Section */}
        <div className="bg-gray-50 pt-[124px] md:pt-[164px] pb-16">
          <div className="container">
            <h1 className="hero-title text-center">{t('terms.t_cf286dd2')}</h1>
            <p className="hero-subtitle text-center mx-auto">{t('terms.t_fb8e0684')}</p>
          </div>
        </div>

        {/* Content Section */}
        <div className="container py-16">
          <div className="max-w-4xl mx-auto prose prose-lg">
            {/* 前言 */}
            <div className="mb-12">
              <p className="text-gray-700 leading-relaxed mb-4">{t('terms.t_54d196ee')}</p>
              <p className="text-gray-700 leading-relaxed mb-4">{t('terms.t_9a345e03')}</p>
              <p className="text-gray-700 leading-relaxed">{t('terms.t_09aaa4d2')}</p>
            </div>

            {/* 一、適用範圍 */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-6 pb-3 border-b-2 border-gray-200">{t('terms.t_74d1f4d0')}</h2>
              <p className="text-gray-700 leading-relaxed mb-4">{t('terms.t_f348a651')}</p>
              <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
                <li>{t('terms.t_59708553')}</li>
                <li>{t('terms.t_e6d96960')}</li>
                <li>{t('terms.t_40076f18')}</li>
              </ul>
              <p className="text-gray-700 leading-relaxed">{t('terms.t_5cfc423c')}</p>
            </section>

            {/* 二、接受條款與使用資格 */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-6 pb-3 border-b-2 border-gray-200">{t('terms.t_30c03966')}</h2>
              <p className="text-gray-700 leading-relaxed mb-4">{t('terms.t_a6c71ecf')}</p>
              <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
                <li>{t('terms.t_f4b3314b')}</li>
                <li>{t('terms.t_c6e7e80e')}</li>
                <li>{t('terms.t_b08cacb8')}</li>
              </ul>
              <p className="text-gray-700 leading-relaxed">{t('terms.t_527d5d0e')}</p>
            </section>

            {/* 三、帳號註冊與安全 */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-6 pb-3 border-b-2 border-gray-200">{t('terms.t_61cb95cb')}</h2>
              <p className="text-gray-700 leading-relaxed mb-4">{t('terms.t_4386809c')}</p>
              <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
                <li>{t('terms.t_bcf7029d')}</li>
                <li>{t('terms.t_e475e2c6')}</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mb-4">{t('terms.t_a2a2a526')}</p>
              <p className="text-gray-700 leading-relaxed">{t('terms.t_994145ee')}</p>
            </section>

            {/* 四、商品購買與其他約定條款 */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-6 pb-3 border-b-2 border-gray-200">{t('terms.t_ca7411f0')}</h2>
              <p className="text-gray-700 leading-relaxed mb-4">{t('terms.t_30542427')}</p>
              <p className="text-gray-700 leading-relaxed">{t('terms.t_2fd313d4')}</p>
            </section>

            {/* 五、使用者內容 */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-6 pb-3 border-b-2 border-gray-200">{t('terms.t_33a74bdc')}</h2>
              
              <h3 className="text-xl font-semibold mb-4 text-gray-800">{t('terms.t_6b5ca195')}</h3>
              <p className="text-gray-700 leading-relaxed mb-6">{t('terms.t_00692516')}</p>

              <h3 className="text-xl font-semibold mb-4 text-gray-800">{t('terms.t_0b285664')}</h3>
              <p className="text-gray-700 leading-relaxed mb-4">{t('terms.t_e69dbc9e')}</p>
              <p className="text-gray-700 leading-relaxed mb-6">{t('terms.t_9ad0bcc3')}</p>

              <h3 className="text-xl font-semibold mb-4 text-gray-800">{t('terms.t_67a0d7f1')}</h3>
              <p className="text-gray-700 leading-relaxed mb-4">{t('terms.t_185d825c')}</p>
              <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-2">
                <li>{t('terms.t_ad15c194')}</li>
                <li>{t('terms.t_8e28ab87')}</li>
                <li>{t('terms.t_59a35b78')}</li>
              </ul>

              <h3 className="text-xl font-semibold mb-4 text-gray-800">{t('terms.t_306b7c37')}</h3>
              <p className="text-gray-700 leading-relaxed">{t('terms.t_d5ba2493')}</p>
            </section>

            {/* 六、禁止行為 */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-6 pb-3 border-b-2 border-gray-200">{t('terms.t_8b627b4e')}</h2>
              <p className="text-gray-700 leading-relaxed mb-4">{t('terms.t_2422929a')}</p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>{t('terms.t_e3d01570')}</li>
                <li>{t('terms.t_7dc74ae6')}</li>
                <li>{t('terms.t_56a530e5')}</li>
                <li>{t('terms.t_35631de8')}</li>
                <li>{t('terms.t_8b2bb4f4')}</li>
                <li>{t('terms.t_268cba4d')}</li>
                <li>{t('terms.t_82fd1b55')}</li>
                <li>{t('terms.t_228a68ea')}</li>
                <li>{t('terms.t_e9d5accb')}</li>
              </ul>
            </section>

            {/* 七、智慧財產權 */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-6 pb-3 border-b-2 border-gray-200">{t('terms.t_3ef33aff')}</h2>
              <p className="text-gray-700 leading-relaxed mb-4">{t('terms.t_a55611b9')}</p>
              <p className="text-gray-700 leading-relaxed mb-4">{t('terms.t_cd83ceaa')}</p>
              <p className="text-gray-700 leading-relaxed">{t('terms.t_b447135b')}</p>
            </section>

            {/* 八、第三方連結與服務 */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-6 pb-3 border-b-2 border-gray-200">{t('terms.t_e9ac8af5')}</h2>
              <p className="text-gray-700 leading-relaxed mb-4">{t('terms.t_da4a87e2')}</p>
              <p className="text-gray-700 leading-relaxed">{t('terms.t_250abe57')}</p>
            </section>

            {/* 九、免責聲明 */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-6 pb-3 border-b-2 border-gray-200">{t('terms.t_89b8d5ab')}</h2>
              <p className="text-gray-700 leading-relaxed mb-4">{t('terms.t_35574f7a')}</p>
              <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
                <li>{t('terms.t_7dc5e38f')}</li>
                <li>{t('terms.t_6b6ffb5a')}</li>
                <li>{t('terms.t_f767ef74')}</li>
              </ul>
              <p className="text-gray-700 leading-relaxed">{t('terms.t_1dcbfb14')}</p>
            </section>

            {/* 十、責任限制 */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-6 pb-3 border-b-2 border-gray-200">{t('terms.t_21071a80')}</h2>
              <p className="text-gray-700 leading-relaxed mb-4">{t('terms.t_ead1881e')}</p>
              <p className="text-gray-700 leading-relaxed">{t('terms.t_f7c2ce2b')}</p>
            </section>

            {/* 十一、賠償責任 */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-6 pb-3 border-b-2 border-gray-200">{t('terms.t_2625dd99')}</h2>
              <p className="text-gray-700 leading-relaxed">{t('terms.t_288d3b8c')}</p>
            </section>

            {/* 十二、服務變更、中止與終止 */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-6 pb-3 border-b-2 border-gray-200">{t('terms.t_4ebf4e9e')}</h2>
              <p className="text-gray-700 leading-relaxed mb-4">{t('terms.t_d3be3d37')}</p>
              <p className="text-gray-700 leading-relaxed">{t('terms.t_3705023f')}</p>
            </section>

            {/* 聯絡資訊 */}
            <section className="mt-16 pt-8 border-t-2 border-gray-200">
              <h2 className="text-2xl font-bold mb-6">{t('terms.t_8b2327b1')}</h2>
              <p className="text-gray-700 leading-relaxed mb-4">{t('terms.t_2bcee952')}</p>
              <div className="bg-gray-50 p-6 rounded-lg">
                <p className="text-gray-700 mb-2">
                  <strong>{t('terms.t_d0cc632d')}</strong>Apolnus Ventures LLC
                </p>
                <p className="text-gray-700 mb-2">
                  <strong>{t('terms.t_fad7fa6b')}</strong>support@apolnus.com
                </p>
                <p className="text-gray-700">
                  <strong>{t('terms.t_1e1575c8')}</strong>{t('terms.t_5f5b7cc0')}</p>
              </div>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
