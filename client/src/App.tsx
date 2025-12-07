import { Toaster } from "@/components/ui/sonner";
import LocaleNotification from "./components/LocaleNotification";
import { GoogleAnalytics } from "./components/GoogleAnalytics";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch, Router } from "wouter";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { URL_PREFIX_MAP, PREFIX_LANGS, DEFAULT_LANG } from "@/lib/i18nHelper";

// Page imports
import Home from "./pages/Home";
import About from "./pages/About";
import WhereToBuy from "./pages/WhereToBuy";
import ServiceCenters from "./pages/ServiceCenters";
import FAQ from "./pages/FAQ";
import Support from "./pages/Support";
import WarrantyRegistration from "./pages/WarrantyRegistration";
import SupportTicket from "./pages/SupportTicket";
import Tickets from "./pages/Tickets";
import TicketDetail from "./pages/TicketDetail";

import TicketManagement from "./pages/admin/TicketManagement";
import TicketProcessing from "./pages/admin/TicketProcessing";
import Admin from "./pages/Admin";
import AdminSubscribers from "./pages/AdminSubscribers";
import AdminPartners from "./pages/AdminPartners";
import AdminSettings from "./pages/AdminSettings";
import AdminProductModels from "./pages/AdminProductModels";
import AdminFAQs from "./pages/AdminFAQs";
import AdminWarranties from "./pages/AdminWarranties";
import AdminTickets from "./pages/AdminTickets";
import AdminTicketDetail from "./pages/AdminTicketDetail";
import AdminDealers from "./pages/AdminDealers";
import AdminServiceCenters from "./pages/AdminServiceCenters";
import AdminOnlineStores from "./pages/admin/AdminOnlineStores";
import AdminSEO from "@/pages/admin/AdminSEO";
import AdminSocialLinks from "./pages/AdminSocialLinks";
import AdminJobs from "./pages/admin/AdminJobs";
import AdminUsers from "./pages/admin/AdminUsers";
import Profile from "./pages/Profile";
import PartnerProgram from "./pages/PartnerProgram";
import ProductOneX from "./pages/ProductOneX";
import ProductOneXSpecs from "./pages/ProductOneXSpecs";
import ProductOneXDownloads from "./pages/ProductOneXDownloads";
import ProductOneXFAQ from "./pages/ProductOneXFAQ";
import ProductUltraS7 from "./pages/ProductUltraS7";
import ProductUltraS7Specs from "./pages/ProductUltraS7Specs";
import ProductUltraS7Downloads from "./pages/ProductUltraS7Downloads";
import ProductUltraS7FAQ from "./pages/ProductUltraS7FAQ";
import Careers from "./pages/Careers";
import CareersSearch from "./pages/CareersSearch";
import TestAPI from "./pages/TestAPI";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Login from "./pages/Login";

/**
 * 內部路由表 (共用)
 * 定義所有頁面路由,不包含語言前綴
 */
function AppRoutes() {
  return (
    <Switch>
      {/* 核心頁面 */}
      <Route path="/" component={Home} />
      <Route path="/about" component={About} />

      {/* 產品頁 */}
      <Route path="/products/one-x" component={ProductOneX} />
      <Route path="/products/one-x/specs" component={ProductOneXSpecs} />
      <Route path="/products/one-x/downloads" component={ProductOneXDownloads} />
      <Route path="/products/one-x/faq" component={ProductOneXFAQ} />

      <Route path="/products/ultra-s7" component={ProductUltraS7} />
      <Route path="/products/ultra-s7/specs" component={ProductUltraS7Specs} />
      <Route path="/products/ultra-s7/downloads" component={ProductUltraS7Downloads} />
      <Route path="/products/ultra-s7/faq" component={ProductUltraS7FAQ} />

      {/* 服務與支援 */}
      <Route path="/where-to-buy" component={WhereToBuy} />
      <Route path="/service-centers" component={ServiceCenters} />
      <Route path="/faq" component={FAQ} />
      <Route path="/support" component={Support} />
      <Route path="/support/warranty" component={WarrantyRegistration} />
      <Route path="/support-ticket" component={SupportTicket} />
      <Route path="/warranty-registration" component={WarrantyRegistration} />

      {/* 會員功能 */}
      <Route path="/login" component={Login} />
      <Route path="/profile" component={Profile} />
      <Route path="/tickets" component={Tickets} />
      <Route path="/tickets/:id" component={TicketDetail} />


      {/* 其他頁面 */}
      <Route path="/careers" component={Careers} />
      <Route path="/careers-search" component={CareersSearch} />
      <Route path="/careers/search" component={CareersSearch} />
      <Route path="/partner-program" component={PartnerProgram} />
      <Route path="/privacy" component={Privacy} />
      <Route path="/terms" component={Terms} />

      {/* Admin 路由 (支援語言前置) */}
      <Route path="/admin" component={Admin} />
      <Route path="/admin/subscribers" component={AdminSubscribers} />
      <Route path="/admin/partners" component={AdminPartners} />
      <Route path="/admin/settings" component={AdminSettings} />
      <Route path="/admin/product-models" component={AdminProductModels} />
      <Route path="/admin/faqs" component={AdminFAQs} />
      <Route path="/admin/warranties" component={AdminWarranties} />
      <Route path="/admin/tickets" component={AdminTickets} />
      <Route path="/admin/tickets/:id" component={AdminTicketDetail} />
      <Route path="/admin/dealers" component={AdminDealers} />
      <Route path="/admin/service-centers" component={AdminServiceCenters} />
      <Route path="/admin/online-stores" component={AdminOnlineStores} />
      <Route path="/admin/seo" component={AdminSEO} />
      <Route path="/admin/social-links" component={AdminSocialLinks} />
      <Route path="/admin/jobs" component={AdminJobs} />
      <Route path="/admin/users" component={AdminUsers} />

      <Route path="/test-api" component={TestAPI} />

      {/* 404 Fallback */}
      <Route component={NotFound} />
    </Switch>
  );
}

/**
 * 語言包裝器 (處理 i18n 切換)
 * @param langCode i18n 語言代碼 (例如 'zh-TW' 或 'en')
 * @param base URL 基礎路徑 (例如 '/tw' 或 '')
 */
function LanguageWrapper({ langCode, base }: { langCode: string; base: string }) {
  const { i18n } = useTranslation();

  useEffect(() => {
    if (i18n.language !== langCode) {
      i18n.changeLanguage(langCode);
    }
  }, [langCode, i18n]);

  // 注釋：允許語言前置訪問admin路徑 (e.g., /tw/admin)
  // 這樣管理後台也能支援多語言界面

  return (
    <Router base={base}>
      <AppRoutes />
    </Router>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <LocaleNotification />
          <Toaster />
          <GoogleAnalytics />
          <Switch>
            {/* 1. Admin 與 API 路由 (優先匹配，不受語言影響) */}
            <Route path="/admin" component={Admin} />
            <Route path="/admin/subscribers" component={AdminSubscribers} />
            <Route path="/admin/partners" component={AdminPartners} />
            <Route path="/admin/settings" component={AdminSettings} />
            <Route path="/admin/product-models" component={AdminProductModels} />
            <Route path="/admin/faqs" component={AdminFAQs} />
            <Route path="/admin/warranties" component={AdminWarranties} />
            <Route path="/admin/tickets" component={AdminTickets} />
            <Route path="/admin/tickets/:id" component={AdminTicketDetail} />
            <Route path="/admin/dealers" component={AdminDealers} />
            <Route path="/admin/service-centers" component={AdminServiceCenters} />
            <Route path="/admin/online-stores" component={AdminOnlineStores} />
            <Route path="/admin/seo" component={AdminSEO} />
            <Route path="/admin/social-links" component={AdminSocialLinks} />
            <Route path="/admin/jobs" component={AdminJobs} />
            <Route path="/admin/users" component={AdminUsers} />

            <Route path="/test-api" component={TestAPI} />

            {/* 2. 非英文語言路由 (明確定義前綴) */}
            {PREFIX_LANGS.map(prefix => (
              <Route key={prefix} path={`/${prefix}/*?`}>
                <LanguageWrapper langCode={URL_PREFIX_MAP[prefix]} base={`/${prefix}`} />
              </Route>
            ))}

            {/* 3. 英文/預設路由 (根目錄) */}
            {/* 這是 Catch-all，所有沒被上面抓走的都會落到這裡 -> 視為英文版 */}
            <Route path="/*?">
              <LanguageWrapper langCode={DEFAULT_LANG} base="" />
            </Route>
          </Switch>
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
