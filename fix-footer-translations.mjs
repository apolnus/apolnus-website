import { readFileSync, writeFileSync } from 'fs';

const filePath = '/home/ubuntu/business-website/client/src/components/Footer.tsx';
let content = readFileSync(filePath, 'utf-8');

// 定義需要替換的文字映射
const replacements = [
  // Footer section titles
  { find: '>公司<', replace: '>{t("footer.company.title")}<' },
  { find: '>產品<', replace: '>{t("footer.products.title")}<' },
  { find: '>支援<', replace: '>{t("footer.support.title")}<' },
  { find: '>探索精彩<', replace: '>{t("footer.explore.title")}<' },
  { find: '>訂閱我們<', replace: '>{t("footer.subscribe.title")}<' },
  
  // Company links
  { find: '關於我們', replace: '{t("footer.company.about")}' },
  { find: '合作夥伴計劃', replace: '{t("footer.company.partner")}' },
  
  // Support links  
  { find: '購買通路', replace: '{t("footer.support.whereToBuy")}' },
  { find: '服務與支援', replace: '{t("footer.support.service")}' },
  { find: '保固登錄', replace: '{t("footer.support.warranty")}' },
  { find: '常見問題', replace: '{t("footer.support.faq")}' },
  
  // Explore links
  { find: '媒體中心', replace: '{t("footer.explore.media")}' },
  
  // Subscribe section
  { find: '立即訂閱以獲取最新產品資訊和優惠活動', replace: '{t("footer.subscribe.description")}' },
  { find: 'placeholder="輸入電子郵件地址"', replace: 'placeholder={t("footer.subscribe.placeholder")}' },
  { find: '訂閱', replace: '{t("footer.subscribe.button")}' },
  
  // Toast messages
  { find: "'訂閱成功！感謝您的訂閱'", replace: 't("footer.subscribe.success")' },
  { find: "'此電子郵件已訂閱'", replace: 't("footer.subscribe.alreadySubscribed")' },
  { find: "'訂閱失敗，請稍後再試'", replace: 't("footer.subscribe.error")' },
  { find: "'請輸入電子郵件地址'", replace: 't("footer.subscribe.emailRequired")' },
  
  // Bottom links
  { find: '私隱權政策', replace: '{t("footer.privacy")}' },
  { find: '使用條款', replace: '{t("footer.terms")}' },
  { find: 'Copyright © 2025 Apolnus 想像創新 版權所有', replace: '{t("footer.copyright")}' },
];

// 執行替換
for (const { find, replace } of replacements) {
  content = content.replace(new RegExp(find, 'g'), replace);
}

// 寫回檔案
writeFileSync(filePath, content, 'utf-8');
console.log('Footer.tsx translations fixed!');
