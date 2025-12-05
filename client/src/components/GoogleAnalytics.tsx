import { useEffect, useState } from 'react';
import { trpc } from '@/lib/trpc';
import { useAuth } from '@/_core/hooks/useAuth';
import { hashUserData } from '@/lib/hashUtils';

/**
 * GoogleAnalytics 組件
 * 從資料庫讀取 GA4 ID 和 Meta Pixel ID 並動態載入追蹤代碼
 * 支援 Meta 進階配對 (Advanced Matching) 功能
 */
export function GoogleAnalytics() {
  const { data: settings } = trpc.admin.settings.getAll.useQuery();
  const { user } = useAuth();
  const [advancedMatchingReady, setAdvancedMatchingReady] = useState(false);

  // GA4 初始化
  useEffect(() => {
    if (!settings) return;

    const ga4Setting = settings.find(s => s.key === "ga4_id");
    const ga4Id = ga4Setting?.value;

    if (!ga4Id || ga4Id.trim() === '') {
      console.log('[GA4] No tracking ID configured');
      return;
    }

    // 檢查是否已經載入過
    if (document.querySelector(`script[src*="googletagmanager.com/gtag/js?id=${ga4Id}"]`)) {
      console.log('[GA4] Already loaded');
      return;
    }

    console.log('[GA4] Loading tracking code:', ga4Id);

    // 建立 gtag.js script
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${ga4Id}`;
    document.head.appendChild(script);

    // 初始化 gtag
    window.dataLayer = window.dataLayer || [];
    function gtag(...args: any[]) {
      window.dataLayer.push(args);
    }
    gtag('js', new Date());
    gtag('config', ga4Id, {
      send_page_view: true,
    });

    // 將 gtag 掛載到 window 供全域使用
    (window as any).gtag = gtag;

    console.log('[GA4] Tracking initialized');

    // Cleanup function
    return () => {
      // 移除 script (可選)
      const existingScript = document.querySelector(`script[src*="googletagmanager.com/gtag/js?id=${ga4Id}"]`);
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, [settings]);

  // Meta Pixel 初始化 + 進階配對
  useEffect(() => {
    if (!settings) return;

    const metaSetting = settings.find(s => s.key === "meta_pixel_id");
    const metaPixelId = metaSetting?.value;

    if (!metaPixelId || metaPixelId.trim() === '') {
      console.log('[Meta Pixel] No tracking ID configured');
      return;
    }

    // 檢查是否已經載入過
    if ((window as any).fbq) {
      console.log('[Meta Pixel] Already loaded');
      return;
    }

    console.log('[Meta Pixel] Loading tracking code:', metaPixelId);

    // 初始化 Meta Pixel
    (function(f: any, b: any, e: any, v: any, n?: any, t?: any, s?: any) {
      if (f.fbq) return;
      n = f.fbq = function() {
        n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
      };
      if (!f._fbq) f._fbq = n;
      n.push = n;
      n.loaded = !0;
      n.version = '2.0';
      n.queue = [];
      t = b.createElement(e);
      t.async = !0;
      t.src = v;
      s = b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t, s);
    })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');

    // 基本初始化(不帶進階配對)
    (window as any).fbq('init', metaPixelId);
    (window as any).fbq('track', 'PageView');

    console.log('[Meta Pixel] Basic tracking initialized');
    setAdvancedMatchingReady(true);

  }, [settings]);

  // Meta 進階配對 (Advanced Matching) - 當使用者登入時
  useEffect(() => {
    if (!advancedMatchingReady || !user || !settings) return;

    const metaSetting = settings.find(s => s.key === "meta_pixel_id");
    const metaPixelId = metaSetting?.value;

    if (!metaPixelId || !user.email) return;

    // 使用 SHA-256 加密使用者資料
    hashUserData({
      email: user.email,
      phone: (user as any).phone || null,
      firstName: user.name?.split(' ')[0] || null,
      lastName: user.name?.split(' ')[1] || null,
    }).then(hashedData => {
      console.log('[Meta Pixel] Applying Advanced Matching with hashed user data');

      // 重新初始化 Pixel 並傳入加密的使用者資料
      (window as any).fbq('init', metaPixelId, hashedData);

      console.log('[Meta Pixel] Advanced Matching applied');
    }).catch(err => {
      console.error('[Meta Pixel] Failed to hash user data:', err);
    });

  }, [advancedMatchingReady, user, settings]);

  return null; // 此組件不渲染任何內容
}

// TypeScript 類型擴展
declare global {
  interface Window {
    dataLayer: any[];
    gtag?: (...args: any[]) => void;
    fbq?: (...args: any[]) => void;
    _fbq?: any;
  }
}
