import { Shield, MessageSquare, Wrench, FileText, Mail } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useTranslation } from "react-i18next";
import SEOHead from "@/components/seo/SEOHead";

export default function Support() {
  const { t } = useTranslation();
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const services = [
    {
      icon: Shield,
      title: t('support.services.warranty.title'),
      description: t('support.services.warranty.description'),
      link: "/warranty-registration",
      color: "bg-blue-500",
    },
    {
      icon: MessageSquare,
      title: t('support.services.ticket.title'),
      description: t('support.services.ticket.description'),
      link: "/support-ticket",
      color: "bg-green-500",
    },
    {
      icon: Wrench,
      title: t('support.services.serviceCenter.title'),
      description: t('support.services.serviceCenter.description'),
      link: "/service-centers",
      color: "bg-orange-500",
    },
    {
      icon: FileText,
      title: t('support.services.faq.title'),
      description: t('support.services.faq.description'),
      link: "/faq",
      color: "bg-purple-500",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <SEOHead pageKey="support" />
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white pt-[124px] md:pt-[164px] pb-20">
        <div className="container">
          <h1 className="hero-title text-center text-white">{t('support.t_c5232edc')}</h1>
          <p className="hero-subtitle text-center mx-auto text-blue-100">{t('support.t_2d7fa4f9')}</p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16">
        <div className="container">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <Link key={index} href={service.link}>
                  <div className="block bg-white rounded-xl p-6 border hover:shadow-xl transition-all transform hover:-translate-y-1 cursor-pointer" onClick={scrollToTop}>
                    <div className={`${service.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-bold text-lg mb-2">{service.title}</h3>
                    <p className="text-sm text-gray-600">{service.description}</p>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Contact Section */}
          <div className="bg-white rounded-2xl p-8 md:p-12 border max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">{t('support.t_432c841a')}</h2>
              <p className="text-gray-600">{t('support.t_a0e06284')}</p>
            </div>

            <div className="flex flex-col items-center gap-6">
              {/* Email Support */}
              <div className="flex items-start gap-4 w-full max-w-md">
                <div className="bg-blue-100 w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Mail className="w-7 h-7 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg mb-2">{t('support.t_83bcb853')}</h3>
                  <p className="text-gray-600 text-sm mb-3">{t('support.t_8cbae629')}</p>
                  <a href="mailto:support@apolnus.com" className="text-blue-600 hover:underline font-semibold text-base">
                    support@apolnus.com
                  </a>
                </div>
              </div>

              <div className="text-center mt-4">
                <Link href="/about">
                  <Button variant="outline" size="lg" className="border-gray-300" onClick={scrollToTop}>
                    {t('support.t_258be695')}
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Resources Section */}
          <div className="mt-16">
            <h2 className="text-3xl font-bold mb-8 text-center">{t('support.t_83c4cbac')}</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <Link href="/where-to-buy">
                <div className="block bg-white rounded-xl p-6 border hover:shadow-lg transition-shadow cursor-pointer" onClick={scrollToTop}>
                  <h3 className="font-bold text-lg mb-2">{t('support.t_9c70748f')}</h3>
                  <p className="text-sm text-gray-600">{t('support.t_d6dd4be7')}</p>
                </div>
              </Link>
              <Link href="/about">
                <div className="block bg-white rounded-xl p-6 border hover:shadow-lg transition-shadow cursor-pointer" onClick={scrollToTop}>
                  <h3 className="font-bold text-lg mb-2">{t('support.t_5ff40de4')}</h3>
                  <p className="text-sm text-gray-600">{t('support.t_40cb695f')}</p>
                </div>
              </Link>
              <a
                href="#"
                className="block bg-white rounded-xl p-6 border hover:shadow-lg transition-shadow"
              >
                <h3 className="font-bold text-lg mb-2">{t('support.t_f1523918')}</h3>
                <p className="text-sm text-gray-600">{t('support.t_0aeb7de9')}</p>
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
