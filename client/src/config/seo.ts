/**
 * SEO Configuration for all pages
 * Defines title, description, and keywords for each page in multiple languages
 */

export interface SEOConfig {
  title: string;
  description: string;
  keywords?: string;
}

export interface PageSEO {
  [lang: string]: SEOConfig;
}

export const seoConfig: Record<string, PageSEO> = {
  // Home Page
  home: {
    'zh-TW': {
      title: 'Apolnus 空氣清淨機 | 無耗材科技，純淨呼吸每一天',
      description: '探索 Apolnus One X 無耗材空氣清淨機和 Ultra S7 全效奈米空氣清淨機。革命性靜電集塵技術，無需更換濾網，環保節能，為您打造純淨健康的室內空氣環境。',
      keywords: '空氣清淨機,無耗材,靜電集塵,Apolnus,One X,Ultra S7,PM2.5,空氣品質',
    },
    'zh-CN': {
      title: 'Apolnus 空气净化器 | 无耗材科技，纯净呼吸每一天',
      description: '探索 Apolnus One X 无耗材空气净化器和 Ultra S7 全效纳米空气净化器。革命性静电集尘技术，无需更换滤网，环保节能，为您打造纯净健康的室内空气环境。',
      keywords: '空气净化器,无耗材,静电集尘,Apolnus,One X,Ultra S7,PM2.5,空气质量',
    },
    en: {
      title: 'Apolnus Air Purifiers | Filter-Free Technology for Pure Air',
      description: 'Discover Apolnus One X filter-free air purifier and Ultra S7 nano air purifier. Revolutionary electrostatic technology, no filter replacement needed, eco-friendly and energy-efficient for healthier indoor air.',
      keywords: 'air purifier,filter-free,electrostatic,Apolnus,One X,Ultra S7,PM2.5,air quality',
    },
    ja: {
      title: 'Apolnus 空気清浄機 | フィルター不要の革新技術',
      description: 'Apolnus One X フィルター不要空気清浄機と Ultra S7 ナノ空気清浄機をご紹介。革新的な静電集塵技術により、フィルター交換不要、環境に優しく省エネルギーで、健康的な室内空気環境を実現します。',
      keywords: '空気清浄機,フィルター不要,静電集塵,Apolnus,One X,Ultra S7,PM2.5,空気品質',
    },
    ko: {
      title: 'Apolnus 공기청정기 | 필터 교체 불필요한 혁신 기술',
      description: 'Apolnus One X 필터프리 공기청정기와 Ultra S7 나노 공기청정기를 만나보세요. 혁신적인 정전기 집진 기술로 필터 교체가 필요 없으며, 친환경적이고 에너지 효율적인 건강한 실내 공기 환경을 제공합니다.',
      keywords: '공기청정기,필터프리,정전기집진,Apolnus,One X,Ultra S7,PM2.5,공기질',
    },
    de: {
      title: 'Apolnus Luftreiniger | Filterlose Technologie für reine Luft',
      description: 'Entdecken Sie den Apolnus One X filterlosen Luftreiniger und den Ultra S7 Nano-Luftreiniger. Revolutionäre elektrostatische Technologie, kein Filterwechsel erforderlich, umweltfreundlich und energieeffizient für gesündere Raumluft.',
      keywords: 'Luftreiniger,filterlos,elektrostatisch,Apolnus,One X,Ultra S7,PM2.5,Luftqualität',
    },
    fr: {
      title: 'Apolnus Purificateurs d\'Air | Technologie Sans Filtre',
      description: 'Découvrez le purificateur d\'air sans filtre Apolnus One X et le purificateur d\'air nano Ultra S7. Technologie électrostatique révolutionnaire, aucun remplacement de filtre nécessaire, écologique et économe en énergie pour un air intérieur plus sain.',
      keywords: 'purificateur d\'air,sans filtre,électrostatique,Apolnus,One X,Ultra S7,PM2.5,qualité de l\'air',
    },
  },

  // Where to Buy
  whereToBuy: {
    'zh-TW': {
      title: '購買通路 | Apolnus 空氣清淨機官方商城與授權經銷商',
      description: '在 Apolnus 官方商城、momo購物網、PChome 24h 購物、蝦皮商城購買，或前往全台授權經銷商門市體驗。提供完整售後服務保障。',
      keywords: '購買,官方商城,經銷商,momo,PChome,蝦皮,Apolnus',
    },
    'zh-CN': {
      title: '购买渠道 | Apolnus 空气净化器官方商城与授权经销商',
      description: '在 Apolnus 官方商城、momo购物网、PChome 24h 购物、虾皮商城购买，或前往全台授权经销商门市体验。提供完整售后服务保障。',
      keywords: '购买,官方商城,经销商,momo,PChome,虾皮,Apolnus',
    },
    en: {
      title: 'Where to Buy | Apolnus Official Store & Authorized Dealers',
      description: 'Purchase from Apolnus official store, momo Shopping, PChome 24h, Shopee, or visit authorized dealers across Taiwan. Complete after-sales service guaranteed.',
      keywords: 'buy,official store,dealers,momo,PChome,Shopee,Apolnus',
    },
    ja: {
      title: '購入方法 | Apolnus 公式ストア＆正規販売店',
      description: 'Apolnus 公式ストア、momo ショッピング、PChome 24h、Shopee でご購入いただくか、台湾全土の正規販売店でご体験ください。完全なアフターサービス保証付き。',
      keywords: '購入,公式ストア,販売店,momo,PChome,Shopee,Apolnus',
    },
    ko: {
      title: '구매처 | Apolnus 공식 스토어 및 공인 대리점',
      description: 'Apolnus 공식 스토어, momo 쇼핑, PChome 24h, Shopee에서 구매하거나 대만 전역의 공인 대리점을 방문하세요. 완벽한 애프터서비스 보장.',
      keywords: '구매,공식스토어,대리점,momo,PChome,Shopee,Apolnus',
    },
    de: {
      title: 'Wo Kaufen | Apolnus Offizieller Shop & Autorisierte Händler',
      description: 'Kaufen Sie im offiziellen Apolnus-Shop, bei momo Shopping, PChome 24h, Shopee oder besuchen Sie autorisierte Händler in ganz Taiwan. Vollständiger Kundendienst garantiert.',
      keywords: 'kaufen,offizieller Shop,Händler,momo,PChome,Shopee,Apolnus',
    },
    fr: {
      title: 'Où Acheter | Boutique Officielle Apolnus & Revendeurs Agréés',
      description: 'Achetez sur la boutique officielle Apolnus, momo Shopping, PChome 24h, Shopee ou visitez les revendeurs agréés à Taiwan. Service après-vente complet garanti.',
      keywords: 'acheter,boutique officielle,revendeurs,momo,PChome,Shopee,Apolnus',
    },
  },

  // Service Centers
  serviceCenters: {
    'zh-TW': {
      title: '授權維修中心 | Apolnus 專業售後服務據點',
      description: '查詢全台 Apolnus 授權維修中心，提供專業維修、保養、諮詢服務。快速定位您附近的服務據點，享受完善的售後保障。',
      keywords: '維修中心,售後服務,保養,維修,Apolnus',
    },
    'zh-CN': {
      title: '授权维修中心 | Apolnus 专业售后服务据点',
      description: '查询全台 Apolnus 授权维修中心，提供专业维修、保养、咨询服务。快速定位您附近的服务据点，享受完善的售后保障。',
      keywords: '维修中心,售后服务,保养,维修,Apolnus',
    },
    en: {
      title: 'Service Centers | Apolnus Authorized Repair & Maintenance',
      description: 'Find Apolnus authorized service centers across Taiwan. Professional repair, maintenance, and consultation services. Locate nearby service points for comprehensive after-sales support.',
      keywords: 'service center,after-sales,maintenance,repair,Apolnus',
    },
    ja: {
      title: 'サービスセンター | Apolnus 正規修理・メンテナンス拠点',
      description: '台湾全土の Apolnus 正規サービスセンターを検索。専門的な修理、メンテナンス、相談サービスを提供。お近くのサービス拠点を素早く見つけて、充実したアフターサービスをご利用ください。',
      keywords: 'サービスセンター,アフターサービス,メンテナンス,修理,Apolnus',
    },
    ko: {
      title: '서비스 센터 | Apolnus 공인 수리 및 유지보수 거점',
      description: '대만 전역의 Apolnus 공인 서비스 센터를 찾아보세요. 전문 수리, 유지보수, 상담 서비스 제공. 가까운 서비스 거점을 빠르게 찾아 완벽한 애프터서비스를 받으세요.',
      keywords: '서비스센터,애프터서비스,유지보수,수리,Apolnus',
    },
    de: {
      title: 'Service-Center | Apolnus Autorisierte Reparatur & Wartung',
      description: 'Finden Sie autorisierte Apolnus-Service-Center in ganz Taiwan. Professionelle Reparatur-, Wartungs- und Beratungsdienste. Lokalisieren Sie schnell Service-Standorte in Ihrer Nähe für umfassenden Kundendienst.',
      keywords: 'Service-Center,Kundendienst,Wartung,Reparatur,Apolnus',
    },
    fr: {
      title: 'Centres de Service | Apolnus Réparation & Maintenance Agréées',
      description: 'Trouvez les centres de service agréés Apolnus à Taiwan. Services professionnels de réparation, maintenance et consultation. Localisez rapidement les points de service à proximité pour un support après-vente complet.',
      keywords: 'centre de service,après-vente,maintenance,réparation,Apolnus',
    },
  },

  // About
  about: {
    'zh-TW': {
      title: '關於我們 | Apolnus 想像創新 - 重新定義空氣清淨',
      description: 'Apolnus 致力於創新空氣清淨技術，以無耗材靜電集塵科技為核心，打造環保永續的健康生活環境。了解我們的品牌理念、技術優勢與企業使命。',
      keywords: '關於Apolnus,品牌理念,創新技術,企業使命,空氣清淨',
    },
    'zh-CN': {
      title: '关于我们 | Apolnus 想像创新 - 重新定义空气净化',
      description: 'Apolnus 致力于创新空气净化技术，以无耗材静电集尘科技为核心，打造环保永续的健康生活环境。了解我们的品牌理念、技术优势与企业使命。',
      keywords: '关于Apolnus,品牌理念,创新技术,企业使命,空气净化',
    },
    en: {
      title: 'About Us | Apolnus - Redefining Air Purification',
      description: 'Apolnus is committed to innovative air purification technology with filter-free electrostatic technology at its core, creating eco-friendly and sustainable healthy living environments. Learn about our brand philosophy, technological advantages, and corporate mission.',
      keywords: 'about Apolnus,brand philosophy,innovative technology,corporate mission,air purification',
    },
    ja: {
      title: '会社概要 | Apolnus - 空気清浄の再定義',
      description: 'Apolnus は、フィルター不要の静電集塵技術を核とした革新的な空気清浄技術に取り組み、環境に優しく持続可能な健康的な生活環境を創造します。ブランド理念、技術的優位性、企業使命についてご紹介します。',
      keywords: 'Apolnusについて,ブランド理念,革新技術,企業使命,空気清浄',
    },
    ko: {
      title: '회사 소개 | Apolnus - 공기 정화의 재정의',
      description: 'Apolnus는 필터 불필요 정전기 집진 기술을 핵심으로 하는 혁신적인 공기 정화 기술에 전념하며, 친환경적이고 지속 가능한 건강한 생활 환경을 조성합니다. 브랜드 철학, 기술적 우위, 기업 사명에 대해 알아보세요.',
      keywords: 'Apolnus소개,브랜드철학,혁신기술,기업사명,공기정화',
    },
    de: {
      title: 'Über Uns | Apolnus - Luftreinigung Neu Definiert',
      description: 'Apolnus widmet sich innovativer Luftreinigungstechnologie mit filterloser elektrostatischer Technologie im Kern und schafft umweltfreundliche und nachhaltige gesunde Lebensumgebungen. Erfahren Sie mehr über unsere Markenphilosophie, technologische Vorteile und Unternehmensmission.',
      keywords: 'über Apolnus,Markenphilosophie,innovative Technologie,Unternehmensmission,Luftreinigung',
    },
    fr: {
      title: 'À Propos | Apolnus - Redéfinir la Purification de l\'Air',
      description: 'Apolnus s\'engage dans une technologie innovante de purification de l\'air avec une technologie électrostatique sans filtre au cœur, créant des environnements de vie sains écologiques et durables. Découvrez notre philosophie de marque, nos avantages technologiques et notre mission d\'entreprise.',
      keywords: 'à propos d\'Apolnus,philosophie de marque,technologie innovante,mission d\'entreprise,purification de l\'air',
    },
  },

  // FAQ
  faq: {
    'zh-TW': {
      title: '常見問題 | Apolnus 空氣清淨機使用指南與疑難解答',
      description: '查詢 Apolnus 空氣清淨機常見問題解答，包含產品使用、維護保養、技術規格、售後服務等完整資訊，快速解決您的疑問。',
      keywords: 'FAQ,常見問題,使用指南,疑難解答,Apolnus',
    },
    'zh-CN': {
      title: '常见问题 | Apolnus 空气净化器使用指南与疑难解答',
      description: '查询 Apolnus 空气净化器常见问题解答，包含产品使用、维护保养、技术规格、售后服务等完整信息，快速解决您的疑问。',
      keywords: 'FAQ,常见问题,使用指南,疑难解答,Apolnus',
    },
    en: {
      title: 'FAQ | Apolnus Air Purifier User Guide & Troubleshooting',
      description: 'Find answers to frequently asked questions about Apolnus air purifiers, including product usage, maintenance, technical specifications, and after-sales service. Quick solutions to your questions.',
      keywords: 'FAQ,frequently asked questions,user guide,troubleshooting,Apolnus',
    },
    ja: {
      title: 'よくある質問 | Apolnus 空気清浄機 使用ガイド＆トラブルシューティング',
      description: 'Apolnus 空気清浄機のよくある質問への回答を検索。製品の使用方法、メンテナンス、技術仕様、アフターサービスなどの完全な情報で、疑問を素早く解決します。',
      keywords: 'FAQ,よくある質問,使用ガイド,トラブルシューティング,Apolnus',
    },
    ko: {
      title: '자주 묻는 질문 | Apolnus 공기청정기 사용 가이드 및 문제 해결',
      description: 'Apolnus 공기청정기에 대한 자주 묻는 질문의 답변을 찾아보세요. 제품 사용, 유지보수, 기술 사양, 애프터서비스 등 완전한 정보로 질문을 빠르게 해결하세요.',
      keywords: 'FAQ,자주묻는질문,사용가이드,문제해결,Apolnus',
    },
    de: {
      title: 'FAQ | Apolnus Luftreiniger Benutzerhandbuch & Fehlerbehebung',
      description: 'Finden Sie Antworten auf häufig gestellte Fragen zu Apolnus-Luftreinigern, einschließlich Produktnutzung, Wartung, technische Spezifikationen und Kundendienst. Schnelle Lösungen für Ihre Fragen.',
      keywords: 'FAQ,häufig gestellte Fragen,Benutzerhandbuch,Fehlerbehebung,Apolnus',
    },
    fr: {
      title: 'FAQ | Guide d\'Utilisation & Dépannage des Purificateurs Apolnus',
      description: 'Trouvez des réponses aux questions fréquemment posées sur les purificateurs d\'air Apolnus, y compris l\'utilisation du produit, la maintenance, les spécifications techniques et le service après-vente. Solutions rapides à vos questions.',
      keywords: 'FAQ,questions fréquentes,guide d\'utilisation,dépannage,Apolnus',
    },
  },

  // Profile
  profile: {
    'zh-TW': {
      title: '個人中心 | Apolnus 會員專區',
      description: '管理您的 Apolnus 會員資料、查看訂單記錄、保固登錄、客服工單，享受專屬會員服務。',
      keywords: '個人中心,會員專區,訂單查詢,保固登錄,Apolnus',
    },
    'zh-CN': {
      title: '个人中心 | Apolnus 会员专区',
      description: '管理您的 Apolnus 会员资料、查看订单记录、保固登录、客服工单，享受专属会员服务。',
      keywords: '个人中心,会员专区,订单查询,保固登录,Apolnus',
    },
    en: {
      title: 'My Account | Apolnus Member Center',
      description: 'Manage your Apolnus member profile, view order history, register warranty, submit support tickets, and enjoy exclusive member services.',
      keywords: 'my account,member center,order history,warranty registration,Apolnus',
    },
    ja: {
      title: 'マイアカウント | Apolnus 会員センター',
      description: 'Apolnus 会員プロフィールの管理、注文履歴の確認、保証登録、サポートチケットの送信、会員限定サービスをご利用ください。',
      keywords: 'マイアカウント,会員センター,注文履歴,保証登録,Apolnus',
    },
    ko: {
      title: '마이페이지 | Apolnus 회원 센터',
      description: 'Apolnus 회원 프로필 관리, 주문 내역 조회, 보증 등록, 지원 티켓 제출 및 회원 전용 서비스를 이용하세요.',
      keywords: '마이페이지,회원센터,주문내역,보증등록,Apolnus',
    },
    de: {
      title: 'Mein Konto | Apolnus Mitgliederzentrum',
      description: 'Verwalten Sie Ihr Apolnus-Mitgliedsprofil, sehen Sie Bestellhistorie ein, registrieren Sie Garantie, reichen Sie Support-Tickets ein und genießen Sie exklusive Mitgliederdienste.',
      keywords: 'mein Konto,Mitgliederzentrum,Bestellhistorie,Garantieregistrierung,Apolnus',
    },
    fr: {
      title: 'Mon Compte | Centre des Membres Apolnus',
      description: 'Gérez votre profil de membre Apolnus, consultez l\'historique des commandes, enregistrez la garantie, soumettez des tickets de support et profitez de services membres exclusifs.',
      keywords: 'mon compte,centre des membres,historique des commandes,enregistrement de garantie,Apolnus',
    },
  },

  // Warranty Registration
  warrantyRegistration: {
    'zh-TW': {
      title: '產品保固登錄 | Apolnus 延長保固服務',
      description: '線上登錄您的 Apolnus 產品保固資訊，延長保固期限，享受更完善的售後服務保障。簡單快速，保障您的權益。',
      keywords: '保固登錄,延長保固,產品註冊,售後服務,Apolnus',
    },
    'zh-CN': {
      title: '产品保固登录 | Apolnus 延长保固服务',
      description: '在线登录您的 Apolnus 产品保固信息，延长保固期限，享受更完善的售后服务保障。简单快速，保障您的权益。',
      keywords: '保固登录,延长保固,产品注册,售后服务,Apolnus',
    },
    en: {
      title: 'Warranty Registration | Apolnus Extended Warranty Service',
      description: 'Register your Apolnus product warranty online, extend warranty period, and enjoy comprehensive after-sales service protection. Simple, fast, and secure your rights.',
      keywords: 'warranty registration,extended warranty,product registration,after-sales service,Apolnus',
    },
    ja: {
      title: '製品保証登録 | Apolnus 延長保証サービス',
      description: 'Apolnus 製品の保証情報をオンラインで登録し、保証期間を延長し、より充実したアフターサービス保証をお楽しみください。簡単、迅速、権利を保護します。',
      keywords: '保証登録,延長保証,製品登録,アフターサービス,Apolnus',
    },
    ko: {
      title: '제품 보증 등록 | Apolnus 연장 보증 서비스',
      description: 'Apolnus 제품 보증 정보를 온라인으로 등록하고, 보증 기간을 연장하며, 포괄적인 애프터서비스 보호를 받으세요. 간단하고 빠르며 권리를 보장합니다.',
      keywords: '보증등록,연장보증,제품등록,애프터서비스,Apolnus',
    },
    de: {
      title: 'Garantieregistrierung | Apolnus Erweiterte Garantie',
      description: 'Registrieren Sie Ihre Apolnus-Produktgarantie online, verlängern Sie die Garantiezeit und genießen Sie umfassenden Kundendienst-Schutz. Einfach, schnell und sichern Sie Ihre Rechte.',
      keywords: 'Garantieregistrierung,erweiterte Garantie,Produktregistrierung,Kundendienst,Apolnus',
    },
    fr: {
      title: 'Enregistrement de Garantie | Service de Garantie Étendue Apolnus',
      description: 'Enregistrez en ligne les informations de garantie de votre produit Apolnus, prolongez la période de garantie et profitez d\'une protection complète du service après-vente. Simple, rapide et sécurisez vos droits.',
      keywords: 'enregistrement de garantie,garantie étendue,enregistrement de produit,service après-vente,Apolnus',
    },
  },

  // Support
  support: {
    'zh-TW': {
      title: '服務與支援 | Apolnus 客戶服務中心',
      description: 'Apolnus 提供完整的客戶服務支援，包含產品諮詢、技術支援、維修服務、常見問題解答。專業團隊隨時為您服務。',
      keywords: '客戶服務,技術支援,維修服務,產品諮詢,Apolnus',
    },
    'zh-CN': {
      title: '服务与支援 | Apolnus 客户服务中心',
      description: 'Apolnus 提供完整的客户服务支援，包含产品咨询、技术支援、维修服务、常见问题解答。专业团队随时为您服务。',
      keywords: '客户服务,技术支援,维修服务,产品咨询,Apolnus',
    },
    en: {
      title: 'Service & Support | Apolnus Customer Service Center',
      description: 'Apolnus provides comprehensive customer service support, including product consultation, technical support, repair services, and FAQ. Professional team ready to serve you.',
      keywords: 'customer service,technical support,repair service,product consultation,Apolnus',
    },
    ja: {
      title: 'サービス＆サポート | Apolnus カスタマーサービスセンター',
      description: 'Apolnus は、製品相談、技術サポート、修理サービス、よくある質問を含む包括的なカスタマーサービスサポートを提供します。プロフェッショナルチームがいつでもサービスを提供します。',
      keywords: 'カスタマーサービス,技術サポート,修理サービス,製品相談,Apolnus',
    },
    ko: {
      title: '서비스 및 지원 | Apolnus 고객 서비스 센터',
      description: 'Apolnus는 제품 상담, 기술 지원, 수리 서비스, FAQ를 포함한 포괄적인 고객 서비스 지원을 제공합니다. 전문 팀이 언제든지 서비스를 제공합니다.',
      keywords: '고객서비스,기술지원,수리서비스,제품상담,Apolnus',
    },
    de: {
      title: 'Service & Support | Apolnus Kundendienstzentrum',
      description: 'Apolnus bietet umfassenden Kundendienst-Support, einschließlich Produktberatung, technischer Support, Reparaturdienste und FAQ. Professionelles Team steht Ihnen jederzeit zur Verfügung.',
      keywords: 'Kundendienst,technischer Support,Reparaturdienst,Produktberatung,Apolnus',
    },
    fr: {
      title: 'Service & Support | Centre de Service Client Apolnus',
      description: 'Apolnus fournit un support complet au service client, y compris consultation produit, support technique, services de réparation et FAQ. Équipe professionnelle prête à vous servir.',
      keywords: 'service client,support technique,service de réparation,consultation produit,Apolnus',
    },
  },

  // Partner Program
  partnerProgram: {
    'zh-TW': {
      title: '合作夥伴計畫 | 加入 Apolnus 經銷體系',
      description: '成為 Apolnus 授權經銷商或合作夥伴，共同推廣創新空氣清淨技術。提供完整的經銷支援、行銷資源與培訓計畫。',
      keywords: '合作夥伴,經銷商,加盟,代理,Apolnus',
    },
    'zh-CN': {
      title: '合作伙伴计划 | 加入 Apolnus 经销体系',
      description: '成为 Apolnus 授权经销商或合作伙伴，共同推广创新空气净化技术。提供完整的经销支援、营销资源与培训计划。',
      keywords: '合作伙伴,经销商,加盟,代理,Apolnus',
    },
    en: {
      title: 'Partner Program | Join Apolnus Distribution Network',
      description: 'Become an Apolnus authorized dealer or partner to promote innovative air purification technology together. Complete distribution support, marketing resources, and training programs provided.',
      keywords: 'partner,dealer,franchise,distribution,Apolnus',
    },
    ja: {
      title: 'パートナープログラム | Apolnus 販売ネットワークに参加',
      description: 'Apolnus 正規販売店またはパートナーになり、革新的な空気清浄技術を一緒に推進しましょう。完全な販売サポート、マーケティングリソース、トレーニングプログラムを提供します。',
      keywords: 'パートナー,販売店,フランチャイズ,販売,Apolnus',
    },
    ko: {
      title: '파트너 프로그램 | Apolnus 유통 네트워크 가입',
      description: 'Apolnus 공인 대리점 또는 파트너가 되어 혁신적인 공기 정화 기술을 함께 홍보하세요. 완전한 유통 지원, 마케팅 리소스 및 교육 프로그램을 제공합니다.',
      keywords: '파트너,대리점,프랜차이즈,유통,Apolnus',
    },
    de: {
      title: 'Partnerprogramm | Treten Sie dem Apolnus-Vertriebsnetz bei',
      description: 'Werden Sie autorisierter Apolnus-Händler oder Partner, um innovative Luftreinigungstechnologie gemeinsam zu fördern. Vollständige Vertriebsunterstützung, Marketingressourcen und Schulungsprogramme werden bereitgestellt.',
      keywords: 'Partner,Händler,Franchise,Vertrieb,Apolnus',
    },
    fr: {
      title: 'Programme Partenaire | Rejoignez le Réseau de Distribution Apolnus',
      description: 'Devenez revendeur agréé Apolnus ou partenaire pour promouvoir ensemble une technologie innovante de purification de l\'air. Support de distribution complet, ressources marketing et programmes de formation fournis.',
      keywords: 'partenaire,revendeur,franchise,distribution,Apolnus',
    },
  },

  // Careers
  careers: {
    'zh-TW': {
      title: '招聘精英 | 加入 Apolnus 創新團隊',
      description: '探索 Apolnus 職涯機會，與我們一起創造更健康的空氣環境。提供具競爭力的薪資福利、完善的培訓發展與創新的工作環境。',
      keywords: '招聘,職缺,工作機會,人才招募,Apolnus',
    },
    'zh-CN': {
      title: '招聘精英 | 加入 Apolnus 创新团队',
      description: '探索 Apolnus 职涯机会，与我们一起创造更健康的空气环境。提供具竞争力的薪资福利、完善的培训发展与创新的工作环境。',
      keywords: '招聘,职缺,工作机会,人才招募,Apolnus',
    },
    en: {
      title: 'Careers | Join the Apolnus Innovation Team',
      description: 'Explore career opportunities at Apolnus and create healthier air environments with us. Competitive compensation, comprehensive training and development, and innovative work environment.',
      keywords: 'careers,jobs,opportunities,recruitment,Apolnus',
    },
    ja: {
      title: '採用情報 | Apolnus イノベーションチームに参加',
      description: 'Apolnus でのキャリア機会を探索し、私たちと一緒により健康的な空気環境を創造しましょう。競争力のある報酬、包括的なトレーニングと開発、革新的な職場環境を提供します。',
      keywords: '採用,求人,機会,リクルート,Apolnus',
    },
    ko: {
      title: '채용 정보 | Apolnus 혁신 팀에 합류',
      description: 'Apolnus에서 경력 기회를 탐색하고 우리와 함께 더 건강한 공기 환경을 만드세요. 경쟁력 있는 보상, 포괄적인 교육 및 개발, 혁신적인 근무 환경을 제공합니다.',
      keywords: '채용,일자리,기회,리크루팅,Apolnus',
    },
    de: {
      title: 'Karriere | Treten Sie dem Apolnus-Innovationsteam bei',
      description: 'Erkunden Sie Karrieremöglichkeiten bei Apolnus und schaffen Sie mit uns gesündere Luftumgebungen. Wettbewerbsfähige Vergütung, umfassende Schulung und Entwicklung sowie innovative Arbeitsumgebung.',
      keywords: 'Karriere,Jobs,Möglichkeiten,Rekrutierung,Apolnus',
    },
    fr: {
      title: 'Carrières | Rejoignez l\'Équipe d\'Innovation Apolnus',
      description: 'Explorez les opportunités de carrière chez Apolnus et créez avec nous des environnements d\'air plus sains. Rémunération compétitive, formation et développement complets, et environnement de travail innovant.',
      keywords: 'carrières,emplois,opportunités,recrutement,Apolnus',
    },
  },

  // Privacy Policy
  privacy: {
    'zh-TW': {
      title: '隱私權政策 | Apolnus 個人資料保護聲明',
      description: 'Apolnus 重視您的隱私權，詳細說明我們如何收集、使用、保護您的個人資料，以及您的相關權利。',
      keywords: '隱私權政策,個人資料保護,資料安全,GDPR,Apolnus',
    },
    'zh-CN': {
      title: '隐私权政策 | Apolnus 个人资料保护声明',
      description: 'Apolnus 重视您的隐私权，详细说明我们如何收集、使用、保护您的个人资料，以及您的相关权利。',
      keywords: '隐私权政策,个人资料保护,资料安全,GDPR,Apolnus',
    },
    en: {
      title: 'Privacy Policy | Apolnus Personal Data Protection Statement',
      description: 'Apolnus values your privacy. Detailed explanation of how we collect, use, protect your personal data, and your related rights.',
      keywords: 'privacy policy,personal data protection,data security,GDPR,Apolnus',
    },
    ja: {
      title: 'プライバシーポリシー | Apolnus 個人情報保護声明',
      description: 'Apolnus はお客様のプライバシーを重視しています。個人情報の収集、使用、保護方法、およびお客様の関連する権利について詳しく説明します。',
      keywords: 'プライバシーポリシー,個人情報保護,データセキュリティ,GDPR,Apolnus',
    },
    ko: {
      title: '개인정보 보호정책 | Apolnus 개인정보 보호 성명',
      description: 'Apolnus는 귀하의 개인정보를 중요하게 생각합니다. 개인정보 수집, 사용, 보호 방법 및 관련 권리에 대한 자세한 설명입니다.',
      keywords: '개인정보보호정책,개인정보보호,데이터보안,GDPR,Apolnus',
    },
    de: {
      title: 'Datenschutzrichtlinie | Apolnus Erklärung zum Schutz personenbezogener Daten',
      description: 'Apolnus legt Wert auf Ihre Privatsphäre. Detaillierte Erklärung, wie wir Ihre personenbezogenen Daten erfassen, verwenden, schützen und Ihre damit verbundenen Rechte.',
      keywords: 'Datenschutzrichtlinie,Schutz personenbezogener Daten,Datensicherheit,DSGVO,Apolnus',
    },
    fr: {
      title: 'Politique de Confidentialité | Déclaration de Protection des Données Personnelles Apolnus',
      description: 'Apolnus valorise votre vie privée. Explication détaillée de la manière dont nous collectons, utilisons, protégeons vos données personnelles et vos droits associés.',
      keywords: 'politique de confidentialité,protection des données personnelles,sécurité des données,RGPD,Apolnus',
    },
  },

  // Terms of Service
  terms: {
    'zh-TW': {
      title: '使用條款 | Apolnus 服務條款與使用規範',
      description: 'Apolnus 網站與服務使用條款，詳細說明使用者權利義務、服務範圍、免責聲明等重要資訊。',
      keywords: '使用條款,服務條款,使用規範,法律聲明,Apolnus',
    },
    'zh-CN': {
      title: '使用条款 | Apolnus 服务条款与使用规范',
      description: 'Apolnus 网站与服务使用条款，详细说明使用者权利义务、服务范围、免责声明等重要信息。',
      keywords: '使用条款,服务条款,使用规范,法律声明,Apolnus',
    },
    en: {
      title: 'Terms of Service | Apolnus Service Terms & Usage Guidelines',
      description: 'Apolnus website and service terms of use, detailing user rights and obligations, service scope, disclaimers, and other important information.',
      keywords: 'terms of service,service terms,usage guidelines,legal notice,Apolnus',
    },
    ja: {
      title: '利用規約 | Apolnus サービス規約＆利用ガイドライン',
      description: 'Apolnus ウェブサイトおよびサービスの利用規約、ユーザーの権利と義務、サービス範囲、免責事項などの重要な情報を詳しく説明します。',
      keywords: '利用規約,サービス規約,利用ガイドライン,法的通知,Apolnus',
    },
    ko: {
      title: '이용 약관 | Apolnus 서비스 약관 및 사용 지침',
      description: 'Apolnus 웹사이트 및 서비스 이용 약관, 사용자 권리 및 의무, 서비스 범위, 면책 조항 및 기타 중요한 정보를 자세히 설명합니다.',
      keywords: '이용약관,서비스약관,사용지침,법적고지,Apolnus',
    },
    de: {
      title: 'Nutzungsbedingungen | Apolnus Servicebedingungen & Nutzungsrichtlinien',
      description: 'Apolnus Website- und Service-Nutzungsbedingungen, die Benutzerrechte und -pflichten, Serviceumfang, Haftungsausschlüsse und andere wichtige Informationen detailliert beschreiben.',
      keywords: 'Nutzungsbedingungen,Servicebedingungen,Nutzungsrichtlinien,rechtlicher Hinweis,Apolnus',
    },
    fr: {
      title: 'Conditions d\'Utilisation | Conditions de Service & Directives d\'Utilisation Apolnus',
      description: 'Conditions d\'utilisation du site Web et des services Apolnus, détaillant les droits et obligations des utilisateurs, la portée des services, les clauses de non-responsabilité et autres informations importantes.',
      keywords: 'conditions d\'utilisation,conditions de service,directives d\'utilisation,avis juridique,Apolnus',
    },
  },

  // 404 Not Found
  notFound: {
    'zh-TW': {
      title: '找不到頁面 | Apolnus',
      description: '抱歉，您訪問的頁面不存在。返回首頁或使用導覽列尋找您需要的內容。',
      keywords: '404,找不到頁面,Apolnus',
    },
    'zh-CN': {
      title: '找不到页面 | Apolnus',
      description: '抱歉，您访问的页面不存在。返回首页或使用导航栏寻找您需要的内容。',
      keywords: '404,找不到页面,Apolnus',
    },
    en: {
      title: 'Page Not Found | Apolnus',
      description: 'Sorry, the page you are looking for does not exist. Return to homepage or use navigation to find what you need.',
      keywords: '404,page not found,Apolnus',
    },
    ja: {
      title: 'ページが見つかりません | Apolnus',
      description: '申し訳ございません。お探しのページは存在しません。ホームページに戻るか、ナビゲーションを使用して必要なコンテンツを見つけてください。',
      keywords: '404,ページが見つかりません,Apolnus',
    },
    ko: {
      title: '페이지를 찾을 수 없습니다 | Apolnus',
      description: '죄송합니다. 찾으시는 페이지가 존재하지 않습니다. 홈페이지로 돌아가거나 탐색을 사용하여 필요한 콘텐츠를 찾으세요.',
      keywords: '404,페이지를 찾을 수 없습니다,Apolnus',
    },
    de: {
      title: 'Seite Nicht Gefunden | Apolnus',
      description: 'Entschuldigung, die gesuchte Seite existiert nicht. Kehren Sie zur Startseite zurück oder verwenden Sie die Navigation, um zu finden, was Sie benötigen.',
      keywords: '404,Seite nicht gefunden,Apolnus',
    },
    fr: {
      title: 'Page Non Trouvée | Apolnus',
      description: 'Désolé, la page que vous recherchez n\'existe pas. Retournez à la page d\'accueil ou utilisez la navigation pour trouver ce dont vous avez besoin.',
      keywords: '404,page non trouvée,Apolnus',
    },
  },
};

/**
 * Get SEO config for a specific page and language
 */
export function getSEO(page: string, lang: string = 'zh-TW'): SEOConfig {
  const pageSEO = seoConfig[page];
  if (!pageSEO) {
    // Return default SEO if page not found
    return {
      title: 'Apolnus 空氣清淨機',
      description: 'Apolnus 提供創新的空氣清淨解決方案',
    };
  }

  const seo = pageSEO[lang];
  if (!seo) {
    // Fallback to zh-TW if language not found
    return pageSEO['zh-TW'] || {
      title: 'Apolnus 空氣清淨機',
      description: 'Apolnus 提供創新的空氣清淨解決方案',
    };
  }

  return seo;
}

/**
 * Get all supported languages
 */
export const supportedLanguages = ['zh-TW', 'zh-CN', 'en', 'ja', 'ko', 'de', 'fr'];

/**
 * Get language code for hreflang
 */
export function getHreflangCode(lang: string): string {
  const hreflangMap: Record<string, string> = {
    'zh-TW': 'zh-TW',
    'zh-CN': 'zh-CN',
    'en': 'en-US',
    'ja': 'ja-JP',
    'ko': 'ko-KR',
    'de': 'de-DE',
    'fr': 'fr-FR',
  };
  return hreflangMap[lang] || 'zh-TW';
}
