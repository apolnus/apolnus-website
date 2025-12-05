import { Link, useLocation } from "wouter";
import LocaleLink from "@/components/LocaleLink";
import { useState, useEffect } from "react";
import { Menu, X, User, LogOut, Settings, ChevronRight } from "lucide-react";
import { APP_LOGO } from "@/const";

const LOGO_WHITE = "/logo-white.png";
const LOGO_BLACK = APP_LOGO;
import { useAuth } from "@/hooks/useAuth";
import { useTranslation } from "react-i18next";

// 檢查用戶是否為管理員（根據資料庫 role 欄位）
const isAdmin = (user: any) => {
  if (!user) return false;
  return user.role === "admin";
};
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Navbar() {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [oneMenuOpen, setOneMenuOpen] = useState(false);
  const [ultraMenuOpen, setUltraMenuOpen] = useState(false);

  const { user, logout } = useAuth();
  const { t } = useTranslation();

  // Monitor scroll position
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = () => {
    logout();
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  // Dynamic styles based on scroll position
  const navBgClass = scrolled 
    ? "bg-white shadow-sm" 
    : "bg-black/50 backdrop-blur-md";
  
  const textClass = scrolled 
    ? "text-gray-900" 
    : "text-white";
  
  const textHoverClass = scrolled 
    ? "hover:text-gray-600" 
    : "hover:text-white/80";

  return (
    <nav 
      className={`fixed left-0 right-0 z-50 transition-all duration-300 ${navBgClass}`}
      style={{ top: "var(--banner-height, 0px)" }}
    >
      <div className="w-full px-6 lg:px-12">
        <div className="flex items-center justify-between h-16">
          {/* Left: Logo + Menu Items */}
          <div className="flex items-center gap-8">
            {/* Logo */}
            <LocaleLink href="/">
              <div className="flex items-center cursor-pointer" onClick={scrollToTop}>
                <img 
                  src={scrolled ? LOGO_BLACK : LOGO_WHITE} 
                  alt="Apolnus" 
                  className={`transition-all duration-300 ${scrolled ? 'h-5' : 'h-4'}`}
                />
              </div>
            </LocaleLink>

            {/* Desktop Menu Items */}
            <div className="hidden lg:flex items-center gap-6">
              {/* One Menu with Dropdown */}
              <div 
                className="relative"
                onMouseEnter={() => setOneMenuOpen(true)}
                onMouseLeave={() => setOneMenuOpen(false)}
              >
                <button className={`text-sm ${textClass} ${textHoverClass} transition-colors`}>
                  One
                </button>
                {oneMenuOpen && (
                  <div className="absolute top-full left-0 pt-2 z-50">
                    <div className="w-48 bg-white shadow-lg rounded-md py-2">
                      <LocaleLink href="/products/one-x">
                        <div 
                          className="block px-4 py-2 text-sm text-gray-900 hover:bg-gray-100 transition-colors cursor-pointer flex items-center justify-between"
                          onClick={scrollToTop}
                        >
                          <span>One X</span>
                          <span className="text-xs font-semibold text-red-600 bg-red-50 px-1.5 py-0.5 rounded">NEW</span>
                        </div>
                      </LocaleLink>
                      <div className="block px-4 py-2 text-sm text-gray-400 cursor-not-allowed flex items-center justify-between">
                        <span>One S</span>
                        <span className="text-xs text-gray-400">{t('nav.comingSoon')}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Ultra Menu with Dropdown */}
              <div 
                className="relative"
                onMouseEnter={() => setUltraMenuOpen(true)}
                onMouseLeave={() => setUltraMenuOpen(false)}
              >
                <button className={`text-sm ${textClass} ${textHoverClass} transition-colors`}>
                  Ultra
                </button>
                {ultraMenuOpen && (
                  <div className="absolute top-full left-0 pt-2 z-50">
                    <div className="w-48 bg-white shadow-lg rounded-md py-2">
                      <LocaleLink href="/products/ultra-s7">
                        <div 
                          className="block px-4 py-2 text-sm text-gray-900 hover:bg-gray-100 transition-colors cursor-pointer flex items-center justify-between"
                          onClick={scrollToTop}
                        >
                          <span>Ultra S7</span>
                          <span className="text-xs font-semibold text-red-600 bg-red-50 px-1.5 py-0.5 rounded">NEW</span>
                        </div>
                      </LocaleLink>
                    </div>
                  </div>
                )}
              </div>

              <LocaleLink href="/support">
                <div className={`text-sm ${textClass} ${textHoverClass} transition-colors cursor-pointer`} onClick={scrollToTop}>
                  {t('nav.service')}
                </div>
              </LocaleLink>
              <LocaleLink href="/where-to-buy">
                <div className={`text-sm ${textClass} ${textHoverClass} transition-colors cursor-pointer`} onClick={scrollToTop}>
                  {t('nav.whereToBuy')}
                </div>
              </LocaleLink>
            </div>
          </div>

          {/* Right: User Menu */}
          <div className="hidden lg:flex items-center gap-4">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger className={`flex items-center gap-2 text-sm ${textClass} ${textHoverClass} transition-colors`}>
                  <User className="w-4 h-4" />
                  <span>{user.name}</span>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem asChild>
                    <LocaleLink href="/profile">
                      <div className="flex items-center gap-2 w-full cursor-pointer" onClick={scrollToTop}>
                        <User className="w-4 h-4" />
                        {t('nav.profile')}
                      </div>
                    </LocaleLink>
                  </DropdownMenuItem>
                  {isAdmin(user) && (
                    <DropdownMenuItem asChild>
                      <Link href="/admin">
                        <div className="flex items-center gap-2 w-full cursor-pointer" onClick={scrollToTop}>
                          <Settings className="w-4 h-4" />
                          {t('nav.admin')}
                        </div>
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="w-4 h-4 mr-2" />
                    {t('nav.logout')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <LocaleLink
                href={`/login?redirect=${encodeURIComponent(location)}`}
                className={`text-sm ${textClass} ${textHoverClass} transition-colors`}
              >
                {t('nav.login')}
              </LocaleLink>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className={`lg:hidden ${textClass} z-[90] relative transition-opacity duration-300 ${
              mobileMenuOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'
            }`}
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Mobile Menu - DJI Style (Slide from Right) */}
      <div className={`lg:hidden fixed inset-0 z-[100] ${
        mobileMenuOpen ? '' : 'pointer-events-none'
      }`}>
        {/* Backdrop */}
        <div 
          className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${
            mobileMenuOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={closeMobileMenu}
        />
        
        {/* Menu Panel */}
        <div 
          className={`fixed right-0 top-0 h-screen w-[85%] max-w-sm bg-white shadow-2xl transform transition-transform duration-300 z-[110] ${
            mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
            <div className="flex flex-col h-full overflow-y-auto">
              {/* Menu Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                <img src={LOGO_BLACK} alt="Apolnus" className="h-5" />
                <button
                  onClick={closeMobileMenu}
                  className="text-gray-600 hover:text-gray-900 transition-colors z-[120] relative"
                  aria-label="Close menu"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Menu Items */}
              <div className="flex-1 py-2">
                {/* Main Navigation */}
                <div className="px-6 space-y-0">
                  {/* One Menu - Mobile */}
                  <div>
                    <div className="py-2.5 text-base text-gray-900 font-medium">
                      One
                    </div>
                    <div className="pl-4 space-y-0">
                      <LocaleLink href="/products/one-x">
                        <div
                          className="flex items-center justify-between py-2 text-sm text-gray-700 hover:text-gray-900 transition-colors cursor-pointer"
                          onClick={() => { scrollToTop(); closeMobileMenu(); }}
                        >
                          <div className="flex items-center gap-2">
                            <span>One X</span>
                            <span className="text-xs font-semibold text-red-600 bg-red-50 px-1.5 py-0.5 rounded">NEW</span>
                          </div>
                          <ChevronRight className="w-4 h-4" />
                        </div>
                      </LocaleLink>
                      <div className="flex items-center justify-between py-2 text-sm text-gray-400 cursor-not-allowed">
                        <div className="flex items-center gap-2">
                          <span>One S</span>
                          <span className="text-xs text-gray-400">{t('nav.comingSoon')}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Ultra Menu - Mobile */}
                  <div>
                    <div className="py-2.5 text-base text-gray-900 font-medium">
                      Ultra
                    </div>
                    <div className="pl-4 space-y-0">
                      <LocaleLink href="/products/ultra-s7">
                        <div
                          className="flex items-center justify-between py-2 text-sm text-gray-700 hover:text-gray-900 transition-colors cursor-pointer"
                          onClick={() => { scrollToTop(); closeMobileMenu(); }}
                        >
                          <div className="flex items-center gap-2">
                            <span>Ultra S7</span>
                            <span className="text-xs font-semibold text-red-600 bg-red-50 px-1.5 py-0.5 rounded">NEW</span>
                          </div>
                          <ChevronRight className="w-4 h-4" />
                        </div>
                      </LocaleLink>
                    </div>
                  </div>

                  <LocaleLink href="/support">
                    <div
                      className="flex items-center justify-between py-2.5 text-base text-gray-900 hover:text-gray-600 transition-colors cursor-pointer"
                      onClick={() => { scrollToTop(); closeMobileMenu(); }}
                    >
                      <span>{t('nav.service')}</span>
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </LocaleLink>
                  <LocaleLink href="/where-to-buy">
                    <div
                      className="flex items-center justify-between py-2.5 text-base text-gray-900 hover:text-gray-600 transition-colors cursor-pointer"
                      onClick={() => { scrollToTop(); closeMobileMenu(); }}
                    >
                      <span>{t('nav.whereToBuy')}</span>
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </LocaleLink>
                </div>

                {/* Divider */}
                <div className="my-2 border-t border-gray-200" />

                {/* User Section */}
                <div className="px-6 space-y-0">
                  {user ? (
                    <>
                      <LocaleLink href="/profile">
                        <div
                          className="flex items-center justify-between py-2.5 text-base text-gray-900 hover:text-gray-600 transition-colors cursor-pointer"
                          onClick={() => { scrollToTop(); closeMobileMenu(); }}
                        >
                          <span>{t('nav.profile')}</span>
                          <ChevronRight className="w-4 h-4" />
                        </div>
                      </LocaleLink>
                      {isAdmin(user) && (
                        <Link href="/admin">
                          <div
                            className="flex items-center justify-between py-2.5 text-base text-gray-900 hover:text-gray-600 transition-colors cursor-pointer"
                            onClick={() => { scrollToTop(); closeMobileMenu(); }}
                          >
                            <span>{t('nav.admin')}</span>
                            <ChevronRight className="w-4 h-4" />
                          </div>
                        </Link>
                      )}
                      <button
                        onClick={() => {
                          handleLogout();
                          closeMobileMenu();
                        }}
                        className="flex items-center justify-between w-full py-2.5 text-base text-gray-900 hover:text-gray-600 transition-colors"
                      >
                        <span>{t('nav.logout')}</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </>
                  ) : (
                    <LocaleLink
                      href={`/login?redirect=${encodeURIComponent(location)}`}
                      className="flex items-center justify-between py-3 text-base text-gray-900 hover:text-gray-600 transition-colors"
                    >
                      <span>{t('nav.login')}</span>
                      <ChevronRight className="w-4 h-4" />
                    </LocaleLink>
                  )}
                </div>
              </div>
            </div>
          </div>
      </div>
    </nav>
  );
}
