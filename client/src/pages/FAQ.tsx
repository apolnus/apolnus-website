import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FAQList from "@/components/FAQList";
import { useTranslation } from "react-i18next";
import SEOHead from "@/components/seo/SEOHead";

export default function FAQ() {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="min-h-screen flex flex-col">
      <SEOHead pageKey="fAQ" />
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-700 text-white pt-[124px] lg:pt-[164px] pb-20">
        <div className="container">
          <h1 className="hero-title text-center text-white">{t('faq.t_fa0b4ecf')}</h1>
          <p className="hero-subtitle text-center mx-auto text-blue-100 mb-8">{t('faq.t_57a557a7')}</p>

          {/* Search */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder={t('faq.t_465ac726')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 h-14 text-lg bg-white text-gray-900 border-0"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="flex-1 py-12 bg-gray-50">
        <div className="container max-w-4xl">
          <FAQList showCategoryFilter={true} />
        </div>
      </section>

      <Footer />
    </div>
  );
}
