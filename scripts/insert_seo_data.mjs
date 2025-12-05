import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import { seoSettings } from '../drizzle/schema.js';

const seoData = [
  {
    page: 'about',
    title: '關於我們 | 想像創新，驅動未來 | Apolnus®',
    description: 'Apolnus 波那斯致力於將瘋狂的想像轉化為改變世界的創新。我們不妥協於現狀，堅持以最高標準的科技工藝，重新定義人類的生活品質。',
    keywords: 'Apolnus,波那斯,關於我們,品牌故事,創新科技,智慧家電,企業願景'
  },
  {
    page: 'product-one-x',
    title: 'Apolnus One X | 永續循環科技的極致演繹 | Apolnus®',
    description: '突破傳統家電限制，One X 以專利 TPA 技術實現終身免耗材。結合美學設計與環保理念，為您的空間注入純淨與質感，重新定義潔淨標準。',
    keywords: 'Apolnus,One X,空氣清淨機,無耗材,TPA技術,環保家電,頂級清淨機,設計美學'
  },
  {
    page: 'product-one-x-specs',
    title: 'One X 技術規格 | 頂級效能數據詳解 | Apolnus®',
    description: '深入了解 One X 的核心參數。從 CADR 值、噪音分貝到 TPA 離子場數據，以透明、精確的規格展現真正的技術實力。',
    keywords: 'Apolnus,One X,規格表,CADR,噪音值,TPA參數,功耗,產品尺寸'
  },
  {
    page: 'product-one-x-downloads',
    title: 'One X 下載中心 | 使用手冊與韌體更新 | Apolnus®',
    description: '獲取 One X 完整支援資源。下載最新版產品說明書、快速入門指南及相關驅動程式，確保您的設備隨時保持最佳狀態。',
    keywords: 'Apolnus,One X,下載,使用手冊,說明書,韌體更新,驅動程式'
  },
  {
    page: 'product-one-x-faq',
    title: 'One X 產品問答 | 專業使用與保養指南 | Apolnus®',
    description: '針對 One X 用戶的專屬解答。涵蓋清洗保養、故障排除與日常操作技巧，讓您輕鬆掌握無耗材清淨機的使用訣竅。',
    keywords: 'Apolnus,One X,常見問題,故障排除,清洗濾網,保養教學,使用指南'
  },
  {
    page: 'where-to-buy',
    title: '購買通路 | 官方商城與授權據點 | Apolnus®',
    description: '查詢 Apolnus 官方線上商城與全球授權經銷據點。選擇原廠認證通路，享受最完整的保固服務與專業產品諮詢。',
    keywords: 'Apolnus,購買通路,官方商城,授權經銷商,實體門市,哪裡買,線上購物'
  },
  {
    page: 'service-centers',
    title: '授權維修中心 | 原廠專業技術支援 | Apolnus®',
    description: '查詢全台 Apolnus 授權維修服務網絡。我們提供原廠標準的檢測與維護服務，確保您的產品獲得最專業的照顧與長久保障。',
    keywords: 'Apolnus,維修中心,售後服務,產品維修,技術支援,原廠檢測,維修據點'
  },
  {
    page: 'support',
    title: '服務與支援 | 全方位客戶關懷中心 | Apolnus®',
    description: 'Apolnus 專屬支援中心。提供產品註冊、技術諮詢、線上報修與聯絡客服服務，致力於為您提供無微不至的頂級服務體驗。',
    keywords: 'Apolnus,客戶服務,技術支援,聯絡我們,線上客服,產品支援,售後服務'
  },
  {
    page: 'faq',
    title: '常見問題 | 產品技術與使用指南 | Apolnus®',
    description: '搜尋關於 Apolnus 全系列產品技術、保養維護、App 連線與帳號管理的詳細解答。我們隨時為您提供最專業的指引。',
    keywords: 'Apolnus,常見問題,FAQ,產品疑問,技術支援,App連線,故障排除'
  },
  {
    page: 'profile',
    title: '會員中心 | 專屬帳戶與服務管理 | Apolnus®',
    description: '管理您的 Apolnus 會員資料。在此查看您的訂單記錄、已註冊的產品保固狀態以及專屬會員權益。',
    keywords: 'Apolnus,會員中心,個人資料,訂單查詢,會員權益,帳戶管理'
  },
  {
    page: 'warranty-registration',
    title: '產品保固登錄 | 啟動您的尊榮服務 | Apolnus®',
    description: '立即登錄您的 Apolnus 產品序號，啟動原廠完整保固服務。保障您的權益，享受更快速、更便捷的售後支援。',
    keywords: 'Apolnus,保固登錄,產品註冊,序號登錄,原廠保固,售後保障'
  },
  {
    page: 'support-ticket',
    title: '提交客服工單 | 線上技術支援申請 | Apolnus®',
    description: '遇到問題？請填寫線上工單，詳細描述您的需求。Apolnus 專業技術團隊將會盡速分析並為您提供解決方案。',
    keywords: 'Apolnus,客服工單,線上報修,問題回報,技術諮詢,售後申請'
  },
  {
    page: 'my-tickets',
    title: '我的工單 | 案件處理進度查詢 | Apolnus®',
    description: '隨時追蹤您的客服工單處理狀態與歷史記錄。透明化的服務流程，讓您隨時掌握每一個維修或諮詢環節的進度。',
    keywords: 'Apolnus,工單查詢,維修進度,客服記錄,案件狀態,服務追蹤'
  },
  {
    page: 'partner-program',
    title: '全球合作夥伴計畫 | 共創商業價值 | Apolnus®',
    description: '加入 Apolnus 全球經銷體系。我們尋求志同道合的企業夥伴，共同推廣具備前瞻性的智慧家電科技，開創無限商機與未來。',
    keywords: 'Apolnus,合作夥伴,經銷商申請,代理商,商業合作,B2B,全球經銷'
  },
  {
    page: 'careers',
    title: '招聘精英 | 加入我們，與世界對話 | Apolnus®',
    description: '探索 Apolnus 的職涯機會。這不僅是一份工作，更是與頂尖人才共同挑戰極限、創造世界現象的舞台。尋找對科技與美學充滿熱情的你。',
    keywords: 'Apolnus,人才招聘,職涯機會,加入我們,科技業工作,研發工程師,行銷人才'
  },
  {
    page: 'privacy-policy',
    title: '隱私權政策 | 數位隱私保護聲明 | Apolnus®',
    description: 'Apolnus 高度重視您的數位隱私權。了解我們如何以最高安全標準收集、使用、儲存與保護您的個人資料，讓您安心使用我們的服務。',
    keywords: 'Apolnus,隱私權政策,個資保護,數據安全,隱私聲明,使用者權益'
  },
  {
    page: 'terms-of-use',
    title: '使用條款 | 官方數位服務協議 | Apolnus®',
    description: '詳閱 Apolnus 官方網站使用條款與服務協議。了解您在使用本網站及相關數位服務時的權利與義務，確保雙方權益。',
    keywords: 'Apolnus,使用條款,服務協議,法律聲明,網站規範,用戶條款'
  }
];

async function main() {
  const connection = await mysql.createConnection({
    host: process.env.DATABASE_HOST || 'localhost',
    user: process.env.DATABASE_USER || 'root',
    password: process.env.DATABASE_PASSWORD || '',
    database: process.env.DATABASE_NAME || 'apolnus',
  });

  const db = drizzle(connection);

  console.log('開始插入 SEO 資料...');

  for (const data of seoData) {
    try {
      await db.insert(seoSettings).values({
        page: data.page,
        language: 'zh-TW',
        title: data.title,
        description: data.description,
        keywords: data.keywords,
      });
      console.log(`✅ ${data.page} - 已插入`);
    } catch (error) {
      console.error(`❌ ${data.page} - 插入失敗:`, error.message);
    }
  }

  await connection.end();
  console.log('完成！');
}

main().catch(console.error);
