import { Link, useLocation } from "wouter";
import { ReactNode } from "react";
import { PREFIX_LANGS, getLangFromPath } from "@/lib/i18nHelper";

interface LocaleLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export default function LocaleLink({ href, children, ...props }: LocaleLinkProps) {
  const [location] = useLocation();

  // 1. 偵測當前 URL 的語言 (例如 /tw/about -> zh-TW, /about -> en)
  const currentLang = getLangFromPath(location);
  
  // 2. 判斷當前是否有語言前綴
  const segments = location.split('/').filter(Boolean);
  const currentPrefix = segments.length > 0 && PREFIX_LANGS.includes(segments[0]) ? segments[0] : '';

  // 3. 處理目標路徑
  let finalHref = href;

  // 只處理內部絕對路徑 (以 / 開頭,且不是 http 開頭)
  if (href.startsWith('/') && !href.startsWith('http')) {
    // 檢查是否已經包含語言前綴 (避免重複添加)
    const hrefSegments = href.split('/').filter(Boolean);
    const hrefHasPrefix = hrefSegments.length > 0 && PREFIX_LANGS.includes(hrefSegments[0]);
    
    if (!hrefHasPrefix) {
      // 如果目標路徑沒有前綴,根據當前語言決定是否添加
      if (currentLang === 'en') {
        // 英文版:保持根目錄,不添加前綴
        finalHref = href;
      } else if (currentPrefix) {
        // 非英文版:添加當前語言前綴
        finalHref = `/${currentPrefix}${href}`;
      }
    }
  }

  return (
    <Link href={finalHref} {...props}>
      {children}
    </Link>
  );
}
