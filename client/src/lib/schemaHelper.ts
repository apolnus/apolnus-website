const BASE_URL = "https://www.apolnus.com";

/**
 * 1. 組織架構 (Organization) - 用於首頁
 * 幫助 Google 建立 Knowledge Graph,顯示品牌資訊和社群連結
 */
export function getOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Apolnus",
    "url": BASE_URL,
    "logo": `${BASE_URL}/logo.png`,
    "sameAs": [
      "https://www.facebook.com/Apolnus",
      "https://www.instagram.com/apolnus/",
      "https://www.youtube.com/@Apolnus",
      "https://x.com/apolnus"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+886-2-1234-5678", // TODO: 從網站設定讀取真實電話
      "contactType": "customer service",
      "areaServed": ["TW", "US", "JP", "KR", "CN", "DE", "FR"],
      "availableLanguage": ["zh-TW", "en", "ja", "ko", "zh-CN", "de", "fr"]
    }
  };
}

/**
 * 2. 產品架構 (Product) - 用於產品頁
 * 在搜尋結果中顯示產品價格、庫存狀態、評分等資訊
 */
export function getProductSchema(product: {
  name: string;
  image: string;
  description: string;
  sku: string;
  price?: string;
  currency?: string;
  availability?: "InStock" | "OutOfStock" | "PreOrder";
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "image": [`${BASE_URL}${product.image}`],
    "description": product.description,
    "sku": product.sku,
    "brand": {
      "@type": "Brand",
      "name": "Apolnus"
    },
    "offers": {
      "@type": "Offer",
      "url": `${BASE_URL}/products/${product.sku.toLowerCase()}`,
      "priceCurrency": product.currency || "TWD",
      "price": product.price || "0",
      "availability": `https://schema.org/${product.availability || "InStock"}`
    }
  };
}

/**
 * 3. 麵包屑導航 (BreadcrumbList) - 用於所有頁面
 * 在搜尋結果中顯示頁面層級結構
 */
export function getBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": `${BASE_URL}${item.url}`
    }))
  };
}

/**
 * 4. 常見問題 (FAQPage) - 用於 FAQ 頁面
 * 在搜尋結果中直接顯示問答內容
 */
export function getFAQSchema(faqs: Array<{ question: string; answer: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };
}

/**
 * 5. 本地商家 (LocalBusiness) - 用於實體店面頁面
 * 顯示營業時間、地址、聯絡方式等資訊
 */
export function getLocalBusinessSchema(business: {
  name: string;
  address: string;
  phone: string;
  latitude?: string;
  longitude?: string;
  openingHours?: string;
}) {
  const schema: any = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": business.name,
    "telephone": business.phone,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": business.address
    }
  };

  if (business.latitude && business.longitude) {
    schema.geo = {
      "@type": "GeoCoordinates",
      "latitude": business.latitude,
      "longitude": business.longitude
    };
  }

  if (business.openingHours) {
    schema.openingHours = business.openingHours;
  }

  return schema;
}
