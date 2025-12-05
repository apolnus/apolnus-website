import { useState } from "react";
import { Link } from "wouter";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Briefcase, Users, TrendingUp, Heart, Award, Globe } from "lucide-react";
import { useTranslation } from "react-i18next";
import SEOHead from "@/components/seo/SEOHead";
import ResponsiveVideo from "@/components/ResponsiveVideo";

export default function Careers() {
  const { t } = useTranslation();
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const teams = [
    {
      title: t('careers.teams.rd.title'),
      description: t('careers.teams.rd.description'),
      icon: TrendingUp,
    },
    {
      title: t('careers.teams.marketing.title'),
      description: t('careers.teams.marketing.description'),
      icon: Globe,
    },
    {
      title: t('careers.teams.support.title'),
      description: t('careers.teams.support.description'),
      icon: Heart,
    },
    {
      title: t('careers.teams.operations.title'),
      description: t('careers.teams.operations.description'),
      icon: Users,
    },
  ];

  const benefits = [
    {
      title: t('careers.benefits.compensation.title'),
      description: t('careers.benefits.compensation.description'),
      icon: Award,
    },
    {
      title: t('careers.benefits.growth.title'),
      description: t('careers.benefits.growth.description'),
      icon: TrendingUp,
    },
    {
      title: t('careers.benefits.culture.title'),
      description: t('careers.benefits.culture.description'),
      icon: Users,
    },
    {
      title: t('careers.benefits.health.title'),
      description: t('careers.benefits.health.description'),
      icon: Heart,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <SEOHead pageKey="careers" />
      <Navbar />

      {/* Hero Section with Video Background */}
      <section className="relative min-h-screen flex items-center justify-center pt-[124px] lg:pt-[164px]">
        {/* Video Background */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/hero-video.mp4" type="video/mp4" />
        </video>
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/50" />
        
        {/* Content */}
        <div className="relative z-10 text-center px-6 lg:px-12 py-20">
          <h1 className="text-5xl lg:text-7xl font-bold text-white mb-6">{t('careers.t_4dc76a8b')}</h1>
          <p className="text-xl lg:text-2xl text-white/90 mb-12 max-w-3xl mx-auto">{t('careers.t_b5705b36')}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/careers-search">
              <Button
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-base rounded-md"
              >{t('careers.t_da7198ba')}</Button>
            </Link>
            <Button
              variant="outline"
              size="lg"
              className="border-white text-white hover:bg-white/20 px-8 py-3 text-base rounded-md"
            >{t('careers.t_27d9dec8')}</Button>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">{t('careers.t_652c7cb7')}</h2>
            <p className="text-2xl lg:text-3xl text-gray-600 mb-4">{t('careers.t_1ccd15e2')}</p>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">{t('careers.t_c5d293fd')}</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="text-center p-8 rounded-lg hover:shadow-lg transition-shadow">
              <div className="w-full h-48 bg-gradient-to-br from-blue-100 to-blue-50 rounded-lg mb-6 flex items-center justify-center">
                <TrendingUp className="w-16 h-16 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">{t('careers.t_087a6df3')}</h3>
              <p className="text-gray-600">{t('careers.t_8e4b94fa')}</p>
            </div>

            <div className="text-center p-8 rounded-lg hover:shadow-lg transition-shadow">
              <div className="w-full h-48 bg-gradient-to-br from-green-100 to-green-50 rounded-lg mb-6 flex items-center justify-center">
                <Heart className="w-16 h-16 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">{t('careers.t_c577c494')}</h3>
              <p className="text-gray-600">{t('careers.t_1a6c05be')}</p>
            </div>

            <div className="text-center p-8 rounded-lg hover:shadow-lg transition-shadow">
              <div className="w-full h-48 bg-gradient-to-br from-purple-100 to-purple-50 rounded-lg mb-6 flex items-center justify-center">
                <Award className="w-16 h-16 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">{t('careers.t_7e63cc17')}</h3>
              <p className="text-gray-600">{t('careers.t_60cfbd05')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Video Section - Third Screen */}
      <section className="relative min-h-screen flex items-center justify-center">
        {/* Video Background */}
        <ResponsiveVideo
          videoName="careers-video"
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          loop
          muted
          playsInline
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40" />
        
        {/* Content */}
        <div className="relative z-10 text-center px-6 lg:px-12 py-20">
          <h2 className="text-4xl lg:text-6xl font-bold text-white mb-6">{t('careers.t_972ead32')}</h2>
          <p className="text-xl lg:text-2xl text-white/90 max-w-3xl mx-auto">{t('careers.t_87e54ad9')}</p>
        </div>
      </section>

      {/* Teams Section */}
      <section id="teams" className="py-20 bg-white">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">{t('careers.t_6c1c7004')}</h2>
            <p className="text-xl text-gray-600">{t('careers.t_5a46206b')}</p>
            <p className="text-lg text-gray-600 mt-2">{t('careers.t_b71ace14')}</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {teams.map((team) => {
              const Icon = team.icon;
              return (
                <div key={team.title} className="bg-gray-50 p-8 rounded-lg hover:shadow-lg transition-shadow">
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                      <Icon className="w-6 h-6 text-blue-600" />
                    </div>
                    <h3 className="text-2xl font-semibold text-gray-900">
                      {team.title}
                    </h3>
                  </div>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {team.description}
                  </p>
                  <Link href="/careers-search">
                    <Button
                      variant="outline"
                      className="border-blue-600 text-blue-600 hover:bg-blue-50"
                    >{t('careers.t_1494c0ae')}</Button>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Positions Section */}
      <section id="positions" className="py-20 bg-gray-50">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">{t('careers.t_4ac65fa8')}</h2>
            <p className="text-xl text-gray-600">{t('careers.t_61af37f1')}</p>
          </div>

          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm p-12 text-center">
            <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-6" />
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">{t('careers.t_a39a9c5c')}</h3>
            <p className="text-gray-600 mb-8">{t('careers.t_2a0c9fb5')}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="mailto:hr@apolnus.com">
                <Button
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-base rounded-md"
                >{t('careers.t_d744c716')}</Button>
              </a>
              <Link href="/support">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-3 text-base rounded-md"
                  onClick={scrollToTop}
                >{t('careers.t_121caed2')}</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
