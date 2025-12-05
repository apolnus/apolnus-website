import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Search, Handshake, FileCheck, CheckCircle, Building2, Store, Briefcase, Cpu } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { useLocation } from "wouter";
import { useTranslation } from "react-i18next";
import SEOHead from "@/components/seo/SEOHead";

export default function PartnerProgram() {
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState(1);
  const [, setLocation] = useLocation();

  // Form data
  const [partnerType, setPartnerType] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [businessNumber, setBusinessNumber] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [address, setAddress] = useState("");
  const [companySize, setCompanySize] = useState("");
  const [annualRevenue, setAnnualRevenue] = useState("");
  const [mainBusiness, setMainBusiness] = useState("");
  const [cooperationIntent, setCooperationIntent] = useState("");

  const addPartnerMutation = trpc.admin.partners.add.useMutation({
    onSuccess: () => {
      toast.success("申請已提交！我們將盡快與您聯繫。");
      setCurrentStep(4);
    },
    onError: (error) => {
      toast.error("提交失敗：" + error.message);
    },
  });

  const handleNextStep = () => {
    if (currentStep === 1 && !partnerType) {
      toast.error("請選擇合作類型");
      return;
    }
    if (currentStep === 2) {
      if (!companyName || !contactName || !contactEmail || !contactPhone) {
        toast.error("請填寫所有必填欄位");
        return;
      }
    }
    if (currentStep === 3) {
      // Submit form - map to API expected fields
      const message = `合作類型: ${partnerType}
統一編號: ${businessNumber}
地址: ${address}
公司規模: ${companySize}
年營業額: ${annualRevenue}
主要業務: ${mainBusiness}
合作意向: ${cooperationIntent}`;
      
      addPartnerMutation.mutate({
        companyName,
        contactName,
        email: contactEmail,
        phone: contactPhone,
        message,
      });
      return;
    }
    setCurrentStep(currentStep + 1);
  };

  const handlePrevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const partnerTypes = [
    {
      id: "distributor",
      title: t('partnerProgram.distributor.title'),
      description: t('partnerProgram.distributor.description'),
      icon: Building2,
    },
    {
      id: "retail",
      title: t('partnerProgram.retail.title'),
      description: t('partnerProgram.retail.description'),
      icon: Store,
    },
    {
      id: "enterprise",
      title: t('partnerProgram.enterprise.title'),
      description: t('partnerProgram.enterprise.description'),
      icon: Briefcase,
    },
    {
      id: "technology",
      title: t('partnerProgram.technology.title'),
      description: t('partnerProgram.technology.description'),
      icon: Cpu,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <SEOHead pageKey="partner-program" />
      <Navbar />

      {/* Hero Section */}
      <section className="bg-[#1a1d29] text-white pt-[124px] lg:pt-[164px] pb-24 px-6">
        <div className="container mx-auto max-w-6xl">
          <h1 className="hero-title text-white">{t('partnerProgram.t_b91d52d7')}</h1>
          <p className="text-2xl lg:text-3xl mb-6 text-gray-300">{t('partnerProgram.t_4ca7ed03')}</p>
          <p className="hero-subtitle text-gray-400">{t('partnerProgram.t_2972fc3e')}</p>
        </div>
      </section>

      {/* Application Process */}
      <section className="py-20 px-6 bg-white">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-4xl font-bold text-center mb-16 text-gray-900">{t('partnerProgram.t_91f8ffc4')}</h2>
          {/* Desktop Version: Horizontal Layout */}
          <div className="hidden lg:grid lg:grid-cols-5 gap-8">
            {[
              { Icon: FileText, title: t('partnerProgram.process.step1.title'), desc: t('partnerProgram.process.step1.desc'), color: "border-green-500", bgColor: "bg-green-50", iconColor: "text-green-600" },
              { Icon: Search, title: t('partnerProgram.process.step2.title'), desc: t('partnerProgram.process.step2.desc'), color: "border-blue-500", bgColor: "bg-blue-50", iconColor: "text-blue-600" },
              { Icon: Handshake, title: t('partnerProgram.process.step3.title'), desc: t('partnerProgram.process.step3.desc'), color: "border-orange-500", bgColor: "bg-orange-50", iconColor: "text-orange-600" },
              { Icon: FileCheck, title: t('partnerProgram.process.step4.title'), desc: t('partnerProgram.process.step4.desc'), color: "border-purple-500", bgColor: "bg-purple-50", iconColor: "text-purple-600" },
              { Icon: CheckCircle, title: t('partnerProgram.process.step5.title'), desc: t('partnerProgram.process.step5.desc'), color: "border-cyan-500", bgColor: "bg-cyan-50", iconColor: "text-cyan-600" },
            ].map((step, index) => {
              const IconComponent = step.Icon;
              return (
                <div key={index} className="text-center">
                  <div className={`w-20 h-20 mx-auto mb-4 ${step.bgColor} rounded-full flex items-center justify-center`}>
                    <IconComponent className={`w-10 h-10 ${step.iconColor}`} />
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-gray-900">{step.title}</h3>
                  <p className="text-sm text-gray-600">{step.desc}</p>
                </div>
              );
            })}
          </div>
          {/* Mobile Version: Vertical Layout with Cards */}
          <div className="lg:hidden space-y-6">
            {[
              { Icon: FileText, title: t('partnerProgram.process.step1.title'), desc: t('partnerProgram.process.step1.desc'), color: "border-green-500", bgColor: "bg-green-50", iconColor: "text-green-600", numberBg: "bg-green-500", number: "1" },
              { Icon: Search, title: t('partnerProgram.process.step2.title'), desc: t('partnerProgram.process.step2.desc'), color: "border-blue-500", bgColor: "bg-blue-50", iconColor: "text-blue-600", numberBg: "bg-blue-500", number: "2" },
              { Icon: Handshake, title: t('partnerProgram.process.step3.title'), desc: t('partnerProgram.process.step3.desc'), color: "border-orange-500", bgColor: "bg-orange-50", iconColor: "text-orange-600", numberBg: "bg-orange-500", number: "3" },
              { Icon: FileCheck, title: t('partnerProgram.process.step4.title'), desc: t('partnerProgram.process.step4.desc'), color: "border-purple-500", bgColor: "bg-purple-50", iconColor: "text-purple-600", numberBg: "bg-purple-500", number: "4" },
              { Icon: CheckCircle, title: t('partnerProgram.process.step5.title'), desc: t('partnerProgram.process.step5.desc'), color: "border-cyan-500", bgColor: "bg-cyan-50", iconColor: "text-cyan-600", numberBg: "bg-cyan-500", number: "5" },
            ].map((step, index) => {
              const IconComponent = step.Icon;
              return (
                <div key={index}>
                  <Card className={`border-2 ${step.color} relative overflow-hidden`}>
                    <div className={`absolute top-2 right-2 w-8 h-8 ${step.numberBg} text-white rounded-full flex items-center justify-center text-sm font-bold`}>
                      {step.number}
                    </div>
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className={`w-16 h-16 flex-shrink-0 ${step.bgColor} rounded-full flex items-center justify-center`}>
                          <IconComponent className={`w-8 h-8 ${step.iconColor}`} />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold mb-2 text-gray-900">{step.title}</h3>
                          <p className="text-sm text-gray-600 leading-relaxed">{step.desc}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  {index < 4 && (
                    <div className="flex justify-center py-2">
                      <div className="w-0.5 h-8 bg-gray-300"></div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="container mx-auto max-w-4xl">
          <Card className="shadow-lg">
            <CardContent className="p-8">
              {/* Step Indicator */}
              <div className="hidden lg:flex items-start justify-center mb-12 gap-4">
                {[
                  { num: 1, label: t('partnerProgram.t_b41eb211') },
                  { num: 2, label: t('partnerProgram.t_1a1c94b5') },
                  { num: 3, label: t('partnerProgram.t_e3b69d57') },
                  { num: 4, label: t('partnerProgram.t_782d15be') },
                ].map((step, index) => (
                  <div key={step.num} className="flex items-center">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg mb-3 ${
                          currentStep === step.num
                            ? "bg-blue-600 text-white"
                            : currentStep > step.num
                            ? "bg-green-500 text-white"
                            : "bg-gray-300 text-gray-600"
                        }`}
                      >
                        {step.num}
                      </div>
                      <span className={`text-sm text-center whitespace-nowrap ${
                        currentStep === step.num ? "font-bold text-blue-600" : "text-gray-600"
                      }`}>
                        {step.label}
                      </span>
                    </div>
                    {index < 3 && (
                      <div
                        className={`w-16 h-1 mb-8 ${
                          currentStep > step.num ? "bg-green-500" : "bg-gray-300"
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>

              {/* Mobile Step Indicator */}
              <div className="lg:hidden flex items-center justify-center mb-12">
                {[1, 2, 3, 4].map((step, index) => (
                  <div key={step} className="flex items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-base ${
                        currentStep === step
                          ? "bg-blue-600 text-white"
                          : currentStep > step
                          ? "bg-green-500 text-white"
                          : "bg-gray-300 text-gray-600"
                      }`}
                    >
                      {step}
                    </div>
                    {index < 3 && (
                      <div
                        className={`w-8 h-1 ${
                          currentStep > step ? "bg-green-500" : "bg-gray-300"
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>
              <div className="lg:hidden text-center mb-8">
                <span className="text-base font-bold text-blue-600">
                  {currentStep === 1 && t('partnerProgram.t_b41eb211')}
                  {currentStep === 2 && t('partnerProgram.t_1a1c94b5')}
                  {currentStep === 3 && t('partnerProgram.t_e3b69d57')}
                  {currentStep === 4 && t('partnerProgram.t_782d15be')}
                </span>
              </div>

              {/* Step 1: Partner Type Selection */}
              {currentStep === 1 && (
                <div>
                  <h3 className="text-2xl font-bold mb-8 text-gray-900">{t('partnerProgram.t_ac04d4bf')}</h3>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {partnerTypes.map((type) => {
                      const IconComponent = type.icon;
                      return (
                        <Card
                          key={type.id}
                          className={`cursor-pointer transition-all hover:shadow-lg ${
                            partnerType === type.id ? "border-2 border-blue-600 bg-blue-50" : ""
                          }`}
                          onClick={() => setPartnerType(type.id)}
                        >
                          <CardContent className="p-6">
                            <div className="flex items-start gap-4">
                              <div className="w-12 h-12 flex-shrink-0 bg-blue-100 rounded-full flex items-center justify-center">
                                <IconComponent className="w-6 h-6 text-blue-600" />
                              </div>
                              <div className="flex-1">
                                <h4 className="text-xl font-bold mb-2 text-gray-900">{type.title}</h4>
                                <p className="text-gray-600">{type.description}</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Step 2: Company Basic Information */}
              {currentStep === 2 && (
                <div>
                  <h3 className="text-2xl font-bold mb-8 text-gray-900">{t('partnerProgram.t_a5e3b2d2')}</h3>
                  <div className="space-y-6">
                    <div>
                      <Label htmlFor="companyName" className="text-base">{t('partnerProgram.t_5a702b7a')}<span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="companyName"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        placeholder={t('partnerProgram.t_7588f9ed')}
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label htmlFor="businessNumber" className="text-base">{t('partnerProgram.t_85b00766')}</Label>
                      <Input
                        id="businessNumber"
                        value={businessNumber}
                        onChange={(e) => setBusinessNumber(e.target.value)}
                        placeholder={t('partnerProgram.t_80351cb4')}
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label htmlFor="contactName" className="text-base">{t('partnerProgram.t_0c664d31')}<span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="contactName"
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        placeholder={t('partnerProgram.t_de242c9e')}
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label htmlFor="contactEmail" className="text-base">{t('partnerProgram.t_c14776d3')}<span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="contactEmail"
                        type="email"
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        placeholder={t('partnerProgram.t_1b91c7e7')}
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label htmlFor="contactPhone" className="text-base">{t('partnerProgram.t_d6298174')}<span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="contactPhone"
                        value={contactPhone}
                        onChange={(e) => setContactPhone(e.target.value)}
                        placeholder={t('partnerProgram.t_6b5e2cf1')}
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label htmlFor="address" className="text-base">{t('partnerProgram.t_713a71b4')}</Label>
                      <Input
                        id="address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder={t('partnerProgram.t_308033b4')}
                        className="mt-2"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Business Background */}
              {currentStep === 3 && (
                <div>
                  <h3 className="text-2xl font-bold mb-8 text-gray-900">{t('partnerProgram.t_a04ad868')}</h3>
                  <div className="space-y-6">
                    <div>
                      <Label htmlFor="companySize" className="text-base">{t('partnerProgram.t_d3c85afc')}</Label>
                      <Input
                        id="companySize"
                        value={companySize}
                        onChange={(e) => setCompanySize(e.target.value)}
                        placeholder={t('partnerProgram.t_0e00410a')}
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label htmlFor="annualRevenue" className="text-base">{t('partnerProgram.t_94ec0e6d')}</Label>
                      <Input
                        id="annualRevenue"
                        value={annualRevenue}
                        onChange={(e) => setAnnualRevenue(e.target.value)}
                        placeholder={t('partnerProgram.t_a960447f')}
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label htmlFor="mainBusiness" className="text-base">{t('partnerProgram.t_3cee4e14')}</Label>
                      <Textarea
                        id="mainBusiness"
                        value={mainBusiness}
                        onChange={(e) => setMainBusiness(e.target.value)}
                        placeholder={t('partnerProgram.t_4fd0f647')}
                        className="mt-2"
                        rows={4}
                      />
                    </div>
                    <div>
                      <Label htmlFor="cooperationIntent" className="text-base">{t('partnerProgram.t_120be729')}</Label>
                      <Textarea
                        id="cooperationIntent"
                        value={cooperationIntent}
                        onChange={(e) => setCooperationIntent(e.target.value)}
                        placeholder={t('partnerProgram.t_66b483fe')}
                        className="mt-2"
                        rows={4}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Completion */}
              {currentStep === 4 && (
                <div className="text-center py-12">
                  <div className="w-20 h-20 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center text-5xl">
                    ✅
                  </div>
                  <h3 className="text-3xl font-bold mb-4 text-gray-900">{t('partnerProgram.t_73a4ef29')}</h3>
                  <p className="text-lg text-gray-600 mb-8">{t('partnerProgram.t_2479155d')}</p>
                  <Button onClick={() => setLocation("/")} size="lg">{t('partnerProgram.t_54f6648c')}</Button>
                </div>
              )}

              {/* Navigation Buttons */}
              {currentStep < 4 && (
                <div className="flex justify-between mt-12">
                  {currentStep > 1 && (
                    <Button variant="outline" onClick={handlePrevStep} size="lg">{t('partnerProgram.t_247bdf08')}</Button>
                  )}
                  <Button
                    onClick={handleNextStep}
                    size="lg"
                    className="ml-auto"
                    disabled={addPartnerMutation.isPending}
                  >
                    {currentStep === 3
                      ? addPartnerMutation.isPending
                        ? "提交中..."
                        : "提交申請"
                      : "下一步"}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
}
