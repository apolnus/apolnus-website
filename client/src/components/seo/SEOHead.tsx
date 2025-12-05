import { Helmet } from "react-helmet-async";
import { trpc } from "@/lib/trpc";
import { useTranslation } from "react-i18next";
import { APP_LOGO } from "@/const";

interface SEOHeadProps {
  pageKey?: string;
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  ogType?: string;
  canonical?: string;
  jsonLd?: Record<string, any>; // JSON-LD 結構化資料
}

// 全站預設 OG 圖片（寫死）
const SITE_URL = "https://www.apolnus.com";
const DEFAULT_OG_IMAGE = "/og-image.jpg";

export default function SEOHead({
  pageKey,
  title: propTitle,
  description: propDescription,
  keywords: propKeywords,
  ogImage,
  ogType = "website",
  canonical,
  jsonLd,
}: SEOHeadProps) {
  const { i18n } = useTranslation();
  const currentLang = i18n.language || "zh-TW";
  
  // 如果提供了pageKey,從資料庫讀取SEO設定
  const { data: seoData, isLoading } = trpc.public.getSeo.useQuery(
    {
      page: pageKey || "home",
      language: currentLang,
    },
    {
      enabled: !!pageKey,
    }
  );

  // 如果正在載入且沒有props提供的標題,先不渲染以避免閃爍
  if (isLoading && !propTitle && pageKey) {
    return null;
  }

  // 優先使用資料庫的SEO資料,其次使用props,最後使用預設值
  const title = seoData?.title || propTitle || "Apolnus® Official Website | Redefining the Standard of Living";
  const description = seoData?.description || propDescription || "Committed to creating top-tier smart home appliances, combining ultimate craftsmanship with sustainable technology. Apolnus redefines the highest standard of living quality for those who pursue excellence.";
  const keywords = seoData?.keywords || propKeywords || "air purifier,Apolnus,authorized dealer,service center,warranty registration";

  const siteUrl = typeof window !== "undefined" ? window.location.origin : SITE_URL;
  const fullCanonical = canonical ? `${siteUrl}${canonical}` : undefined;

  // 強制使用寫死的預設 OG 圖片
  const finalOgImage = ogImage || DEFAULT_OG_IMAGE;
  
  // 如果是相對路徑，加上 siteUrl 前綴
  const fullOgImage = finalOgImage.startsWith('http') 
    ? finalOgImage 
    : `${siteUrl}${finalOgImage}`;
  
  // Twitter Card 也使用同一張圖片
  const twitterImageUrl = fullOgImage;
  
  // Twitter Card 類型
  const twitterCardType = "summary_large_image";

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      
      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:image" content={fullOgImage} />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content={twitterCardType} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={twitterImageUrl} />
      
      {/* Canonical URL */}
      {fullCanonical && <link rel="canonical" href={fullCanonical} />}
      
      {/* JSON-LD 結構化資料 */}
      {jsonLd && (
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
      )}
    </Helmet>
  );
}
