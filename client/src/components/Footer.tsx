import { Link } from "wouter";
import LocaleLink from "@/components/LocaleLink";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import LanguageSelector from "@/components/LanguageSelector";
import { useTranslation } from "react-i18next";
import { Globe, Plus, Minus } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { MessageCircle, Facebook, Instagram, Youtube, Twitter, Linkedin, Share2 } from "lucide-react";
import { useIsMobile } from "@/hooks/useMobile";

// 定義連結資料結構
interface FooterLink {
  label: string;
  href: string;
}

interface FooterSection {
  title: string;
  links: FooterLink[];
}

export default function Footer() {
  const { t, i18n } = useTranslation();
  const [email, setEmail] = useState("");
  const [isLanguageSelectorOpen, setIsLanguageSelectorOpen] = useState(false);
  const isMobile = useIsMobile();
  
  // 手風琴狀態管理 (手機版)
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

  // 語言到國家/地區的映射
  const languageDisplay: Record<string, { region: string; language: string }> = {
    "zh-TW": { region: "台灣", language: "繁體中文" },
    "zh-CN": { region: "中国", language: "简体中文" },
    "en": { region: "United States", language: "English" },
    "ja": { region: "日本", language: "日本語" },
    "ko": { region: "대한민국", language: "한국어" },
    "de": { region: "Deutschland", language: "Deutsch" },
    "fr": { region: "France", language: "Français" },
  };

  const currentLang = i18n.language || "zh-TW";
  const currentDisplay = languageDisplay[currentLang] || languageDisplay["zh-TW"];

  // 查詢當前語言的社群平台連結
  const { data: socialLinks } = trpc.socialLinks.getByLocale.useQuery(
    { locale: currentLang },
    { enabled: true }
  );

  // 定義 Footer 連結結構
  const footerSections: FooterSection[] = [
    {
      title: t('footer.company.title'),
      links: [
        { label: t('footer.company.about'), href: '/about' },
        { label: t('footer.company.partner'), href: '/partner-program' },
      ],
    },
    {
      title: t('footer.products.title'),
      links: [
        { label: 'One X', href: '/products/one-x' },
        { label: 'Ultra S7', href: '/products/ultra-s7' },
      ],
    },
    {
      title: t('footer.support.title'),
      links: [
        { label: t('whereToBuy.title'), href: '/where-to-buy' },
        { label: t('nav.service'), href: '/support' },
        { label: t('footer.support.warranty'), href: '/support/warranty' },
        { label: t('footer.support.faq'), href: '/faq' },
      ],
    },
  ];

  // 平台圖標映射
  const platformIcons: Record<string, React.ReactNode> = {
    line: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"/>
      </svg>
    ),
    facebook: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    ),
    instagram: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
      </svg>
    ),
    youtube: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
      </svg>
    ),
    twitter: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ),
    linkedin: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    ),
    wechat: <MessageCircle className="w-4 h-4" />,
    weibo: <Twitter className="w-4 h-4" />,
    douyin: <Youtube className="w-4 h-4" />,
    xiaohongshu: <Instagram className="w-4 h-4" />,
    bilibili: <Youtube className="w-4 h-4" />,
  };

  // 平台名稱映射
  const platformNames: Record<string, string> = {
    line: 'LINE',
    facebook: 'Facebook',
    instagram: 'Instagram',
    youtube: 'YouTube',
    twitter: 'X (Twitter)',
    linkedin: 'LinkedIn',
    wechat: 'WeChat',
    weibo: 'Weibo',
    douyin: 'Douyin',
    xiaohongshu: 'Xiaohongshu',
    bilibili: 'Bilibili',
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const subscribeMutation = trpc.newsletter.subscribe.useMutation({
    onSuccess: () => {
      toast.success(t('footer.subscribe.success'));
      setEmail("");
    },
    onError: (error) => {
      if (error.message.includes('already subscribed')) {
        toast.error(t('footer.subscribe.alreadySubscribed'));
      } else {
        toast.error(t('footer.subscribe.error'));
      }
    },
  });

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      subscribeMutation.mutate({ email });
    } else {
      toast.error(t('footer.subscribe.emailRequired'));
    }
  };

  const toggleSection = (title: string) => {
    setOpenSections(prev => ({
      ...prev,
      [title]: !prev[title]
    }));
  };

  // 手機版手風琴區塊組件
  const AccordionSection = ({ section }: { section: FooterSection }) => {
    const isOpen = openSections[section.title];
    
    return (
      <div className="border-b border-gray-700">
        <button
          onClick={() => toggleSection(section.title)}
          className="w-full py-4 flex justify-between items-center text-sm font-medium text-white hover:bg-white/5 transition-colors"
        >
          <span>{section.title}</span>
          {isOpen ? (
            <Minus className="w-4 h-4 transition-transform duration-300" />
          ) : (
            <Plus className="w-4 h-4 transition-transform duration-300" />
          )}
        </button>
        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out ${
            isOpen ? 'max-h-96 pb-4' : 'max-h-0'
          }`}
        >
          <ul className="space-y-3 px-0">
            {section.links.map((link, index) => (
              <li key={index}>
                <LocaleLink href={link.href} onClick={scrollToTop}>
                  <span className="text-sm text-gray-400 hover:text-white transition-colors cursor-pointer block">
                    {link.label}
                  </span>
                </LocaleLink>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  };

  return (
    <footer className="bg-[#2b2b2b] text-gray-300 relative z-40">
      {/* Main Footer Content */}
      <div className="w-full px-6 lg:px-12 py-12">
        {/* 桌面版: Grid 佈局 */}
        <div className="hidden lg:grid lg:grid-cols-5 gap-8 lg:gap-12">
          {/* 前三個區塊 */}
          {footerSections.map((section, index) => (
            <div key={index}>
              <h3 className="text-white text-sm font-medium mb-4">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <LocaleLink href={link.href} onClick={scrollToTop}>
                      <span className="text-xs text-gray-400 hover:text-white transition-colors cursor-pointer">
                        {link.label}
                      </span>
                    </LocaleLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* 訂閱區塊 */}
          <div className="lg:col-span-2">
            <h3 className="text-white text-sm font-medium mb-4">{t('footer.subscribe.title')}</h3>
            <p className="text-xs text-gray-400 mb-4">
              {t('footer.subscribe.description')}
            </p>
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <Input
                type="email"
                placeholder={t('footer.subscribe.placeholder')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-[#3a3a3a] border-gray-600 text-white placeholder:text-gray-500 text-xs h-9"
              />
              <Button
                type="submit"
                className="bg-transparent hover:bg-white/10 text-white border border-gray-600 px-4 h-9 text-xs"
              >
                {t('footer.subscribe.button')}
              </Button>
            </form>
          </div>
        </div>

        {/* 手機版: 手風琴佈局 */}
        <div className="lg:hidden space-y-0">
          {footerSections.map((section, index) => (
            <AccordionSection key={index} section={section} />
          ))}
          
          {/* 訂閱區塊 (手機版) */}
          <div className="pt-6">
            <h3 className="text-white text-sm font-medium mb-4">{t('footer.subscribe.title')}</h3>
            <p className="text-xs text-gray-400 mb-4">
              {t('footer.subscribe.description')}
            </p>
            <form onSubmit={handleSubscribe} className="flex flex-col gap-2">
              <Input
                type="email"
                placeholder={t('footer.subscribe.placeholder')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-[#3a3a3a] border-gray-600 text-white placeholder:text-gray-500 text-xs h-9"
              />
              <Button
                type="submit"
                className="bg-transparent hover:bg-white/10 text-white border border-gray-600 h-9 text-xs"
              >
                {t('footer.subscribe.button')}
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-[#464646] bg-[#1b1b1b]">
        <div className="w-full px-6 lg:px-12 pt-6 pb-6 lg:pt-8 lg:pb-12">
          {/* 手機版: 垂直堆疊 (保持原樣) */}
          <div className="lg:hidden flex flex-col gap-6">
            {/* 語言選擇器 (手機版置頂) */}
            <div className="flex justify-start">
              <button
                onClick={() => setIsLanguageSelectorOpen(true)}
                className="flex items-center gap-2 text-xs text-gray-400 hover:text-white transition-colors"
              >
                <Globe className="w-4 h-4" />
                <span>{currentDisplay.region} / {currentDisplay.language}</span>
              </button>
              <LanguageSelector
                isOpen={isLanguageSelectorOpen}
                onClose={() => setIsLanguageSelectorOpen(false)}
              />
            </div>

            {/* 社群圖示 */}
            <div className="flex items-center justify-start gap-3">
              {socialLinks && socialLinks.length > 0 ? (
                socialLinks.map((link) => (
                  <a
                    key={link.platform}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={platformNames[link.platform] || link.platform}
                    className="text-gray-400 hover:text-white transition-all duration-200 hover:scale-110"
                  >
                    {platformIcons[link.platform] || <Share2 className="w-4 h-4" />}
                  </a>
                ))
              ) : (
                <>
                  <a href="https://lin.ee/9oputvu" target="_blank" rel="noopener noreferrer" aria-label="LINE" className="text-gray-400 hover:text-white transition-colors">
                    {platformIcons.line}
                  </a>
                  <a href="https://x.com/apolnus" target="_blank" rel="noopener noreferrer" aria-label="X (Twitter)" className="text-gray-400 hover:text-white transition-colors">
                    {platformIcons.twitter}
                  </a>
                  <a href="https://www.facebook.com/Apolnus" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-gray-400 hover:text-white transition-colors">
                    {platformIcons.facebook}
                  </a>
                  <a href="https://www.instagram.com/apolnus/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-gray-400 hover:text-white transition-colors">
                    {platformIcons.instagram}
                  </a>
                  <a href="https://www.youtube.com/@Apolnus" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="text-gray-400 hover:text-white transition-colors">
                    {platformIcons.youtube}
                  </a>
                </>
              )}
            </div>

            {/* Logo + 主選單 */}
            <div className="flex flex-col items-start gap-4">
              <img src="/footer-logo.png" alt="Apolnus" className="h-4" />
              <div className="flex flex-col flex-wrap items-start gap-3 text-xs text-gray-500">
                <LocaleLink href="/about" onClick={scrollToTop}>
                  <span className="hover:text-white transition-colors cursor-pointer">
                    {t('footer.company.about')}
                  </span>
                </LocaleLink>
                <LocaleLink href="/about#contact" onClick={scrollToTop}>
                  <span className="hover:text-white transition-colors cursor-pointer">
                    {t('footer.company.contact')}
                  </span>
                </LocaleLink>
                <LocaleLink href="/careers" onClick={scrollToTop}>
                  <span className="hover:text-white transition-colors cursor-pointer">
                    {t('footer.company.careers')}
                  </span>
                </LocaleLink>
                <LocaleLink href="/partner-program" onClick={scrollToTop}>
                  <span className="hover:text-white transition-colors cursor-pointer">
                    {t('footer.company.partner')}
                  </span>
                </LocaleLink>
              </div>
            </div>

            {/* Copyright + 法律連結 */}
            <div className="flex flex-col gap-3 text-xs text-gray-500">
              <span>{t('footer.copyright')}</span>
              <div className="flex gap-3">
                <LocaleLink href="/privacy" onClick={scrollToTop}>
                  <span className="hover:text-white transition-colors cursor-pointer">
                    {t('footer.privacy')}
                  </span>
                </LocaleLink>
                <span className="text-gray-700">|</span>
                <LocaleLink href="/terms" onClick={scrollToTop}>
                  <span className="hover:text-white transition-colors cursor-pointer">
                    {t('footer.terms')}
                  </span>
                </LocaleLink>
              </div>
            </div>
          </div>

          {/* 桌面版: 1:1復刻DJI樣式 */}
          <div className="hidden lg:flex justify-between items-end">
            {/* 左側區塊 (Left Section) */}
            <div className="flex flex-col items-start">
              {/* Row 1: Logo + Main Links (同行) */}
              <div className="flex items-center gap-8 mb-4">
                {/* Logo: 高度 20px, 與文字大小協調 */}
                <img src="/footer-logo.png" alt="Apolnus" className="h-5 opacity-90" />
                {/* 主選單: 字體 14px, 顏色 #cfcfcf (亮灰) */}
                <div className="flex gap-6 text-[14px] font-normal text-[#cfcfcf]">
                  <LocaleLink href="/about" onClick={scrollToTop}>
                    <span className="hover:text-white transition-colors cursor-pointer">
                      {t('footer.company.about')}
                    </span>
                  </LocaleLink>
                  <LocaleLink href="/about#contact" onClick={scrollToTop}>
                    <span className="hover:text-white transition-colors cursor-pointer">
                      {t('footer.company.contact')}
                    </span>
                  </LocaleLink>
                  <LocaleLink href="/careers" onClick={scrollToTop}>
                    <span className="hover:text-white transition-colors cursor-pointer">
                      {t('footer.company.careers')}
                    </span>
                  </LocaleLink>
                  <LocaleLink href="/partner-program" onClick={scrollToTop}>
                    <span className="hover:text-white transition-colors cursor-pointer">
                      {t('footer.company.partner')}
                    </span>
                  </LocaleLink>
                </div>
              </div>
              
              {/* Row 2: Legal + Copyright */}
              <div className="flex flex-col gap-2 text-[12px] text-[#858585]">
                {/* 法律連結 */}
                <div className="flex gap-4">
                  <LocaleLink href="/privacy" onClick={scrollToTop}>
                    <span className="hover:text-white transition-colors cursor-pointer">
                      {t('footer.privacy')}
                    </span>
                  </LocaleLink>
                  <span className="text-[#464646]">|</span>
                  <LocaleLink href="/terms" onClick={scrollToTop}>
                    <span className="hover:text-white transition-colors cursor-pointer">
                      {t('footer.terms')}
                    </span>
                  </LocaleLink>
                </div>
                {/* Copyright */}
                <div className="mt-1">
                  {t('footer.copyright')}
                </div>
              </div>
            </div>

            {/* 右側區塊 (Right Section) */}
            <div className="flex flex-col items-end justify-between h-full gap-6">
              {/* Social Icons */}
              <div className="flex gap-3">
                {socialLinks && socialLinks.length > 0 ? (
                  socialLinks.map((link) => (
                    <a
                      key={link.platform}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={platformNames[link.platform] || link.platform}
                      className="text-[#cfcfcf] hover:text-white transition-all duration-200 hover:scale-110"
                    >
                      {platformIcons[link.platform] || <Share2 className="w-4 h-4" />}
                    </a>
                  ))
                ) : (
                  <>
                    <a href="https://lin.ee/9oputvu" target="_blank" rel="noopener noreferrer" aria-label="LINE" className="text-[#cfcfcf] hover:text-white transition-colors">
                      {platformIcons.line}
                    </a>
                    <a href="https://x.com/apolnus" target="_blank" rel="noopener noreferrer" aria-label="X (Twitter)" className="text-[#cfcfcf] hover:text-white transition-colors">
                      {platformIcons.twitter}
                    </a>
                    <a href="https://www.facebook.com/Apolnus" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-[#cfcfcf] hover:text-white transition-colors">
                      {platformIcons.facebook}
                    </a>
                    <a href="https://www.instagram.com/apolnus/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-[#cfcfcf] hover:text-white transition-colors">
                      {platformIcons.instagram}
                    </a>
                    <a href="https://www.youtube.com/@Apolnus" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="text-[#cfcfcf] hover:text-white transition-colors">
                      {platformIcons.youtube}
                    </a>
                  </>
                )}
              </div>
              
              {/* Language Selector */}
              <div>
                <button
                  onClick={() => setIsLanguageSelectorOpen(true)}
                  className="flex items-center gap-2 text-[12px] text-[#cfcfcf] hover:text-white transition-colors"
                >
                  <Globe className="w-4 h-4" />
                  <span>{currentDisplay.region} / {currentDisplay.language}</span>
                </button>
                <LanguageSelector
                  isOpen={isLanguageSelectorOpen}
                  onClose={() => setIsLanguageSelectorOpen(false)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
