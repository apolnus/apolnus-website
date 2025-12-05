#!/usr/bin/env python3
"""
生成結構化翻譯 JSON 和 SEO 配置
遵守 Apolnus 品牌一致性規範
"""

import json
import re
from pathlib import Path

# 輸入輸出路徑
INPUT_FILE = Path('/home/ubuntu/apolnus/scripts/extracted/scan_results.json')
OUTPUT_DIR = Path('/home/ubuntu/apolnus/client/src/i18n/locales')
EXISTING_ZH_TW = OUTPUT_DIR / 'zh-TW.json'
EXISTING_EN = OUTPUT_DIR / 'en.json'

# 載入現有翻譯
with open(EXISTING_ZH_TW, 'r', encoding='utf-8') as f:
    existing_zh_tw = json.load(f)

with open(EXISTING_EN, 'r', encoding='utf-8') as f:
    existing_en = json.load(f)

# 載入掃描結果
with open(INPUT_FILE, 'r', encoding='utf-8') as f:
    scan_results = json.load(f)

# 頁面特定翻譯模板（手動定義核心內容）
PAGE_TRANSLATIONS = {
    'whereToBuy': {
        'zh-TW': {
            'title': '購買通路',
            'subtitle': '選擇您喜歡的購買方式',
            'onlinePlatforms': {
                'title': '線上購買平台',
                'description': '在以下官方授權平台購買 Apolnus 產品',
            },
            'dealers': {
                'title': '授權經銷商',
                'description': '前往全台授權經銷商門市體驗產品',
                'filter': {
                    'city': '縣市',
                    'district': '區域',
                    'search': '搜尋經銷商名稱或地址',
                    'searchButton': '搜尋',
                },
                'noResults': '找不到符合條件的經銷商',
                'viewOnMap': '在地圖上查看',
            },
        },
        'en': {
            'title': 'Where to Buy',
            'subtitle': 'Choose your preferred purchase method',
            'onlinePlatforms': {
                'title': 'Online Shopping Platforms',
                'description': 'Purchase Apolnus products from official authorized platforms',
            },
            'dealers': {
                'title': 'Authorized Dealers',
                'description': 'Visit authorized dealers across Taiwan to experience our products',
                'filter': {
                    'city': 'City',
                    'district': 'District',
                    'search': 'Search dealer name or address',
                    'searchButton': 'Search',
                },
                'noResults': 'No dealers found matching your criteria',
                'viewOnMap': 'View on Map',
            },
        },
    },
    'serviceCenters': {
        'zh-TW': {
            'title': '授權維修中心',
            'subtitle': '查詢全台 Apolnus 授權維修服務據點',
            'filter': {
                'city': '縣市',
                'district': '區域',
                'search': '搜尋維修中心名稱或地址',
                'searchButton': '搜尋',
            },
            'noResults': '找不到符合條件的維修中心',
            'viewOnMap': '在地圖上查看',
            'contactInfo': '聯絡資訊',
            'phone': '電話',
            'address': '地址',
            'hours': '營業時間',
        },
        'en': {
            'title': 'Authorized Service Centers',
            'subtitle': 'Find Apolnus authorized service centers across Taiwan',
            'filter': {
                'city': 'City',
                'district': 'District',
                'search': 'Search service center name or address',
                'searchButton': 'Search',
            },
            'noResults': 'No service centers found matching your criteria',
            'viewOnMap': 'View on Map',
            'contactInfo': 'Contact Information',
            'phone': 'Phone',
            'address': 'Address',
            'hours': 'Business Hours',
        },
    },
    'about': {
        'zh-TW': {
            'title': '關於我們',
            'subtitle': '想像創新 - 重新定義空氣清淨',
            'hero': {
                'title': '想像創新',
                'subtitle': '重新定義空氣清淨',
                'description': 'Apolnus 致力於創新空氣清淨技術，以無耗材靜電集塵科技為核心，打造環保永續的健康生活環境。',
            },
            'mission': {
                'title': '我們的使命',
                'content': '透過創新技術，為全球用戶提供最純淨的空氣，打造健康永續的生活環境。我們相信，呼吸純淨空氣是每個人的基本權利。',
            },
            'vision': {
                'title': '我們的願景',
                'content': '成為全球領先的空氣清淨技術品牌，以無耗材、環保、高效的產品，改善全球空氣品質，守護每一次呼吸。',
            },
            'values': {
                'title': '核心價值',
                'innovation': {
                    'title': '創新科技',
                    'description': '持續研發突破性技術，引領空氣清淨產業發展',
                },
                'sustainability': {
                    'title': '環保永續',
                    'description': '無耗材設計，減少環境負擔，實踐永續發展',
                },
                'quality': {
                    'title': '品質承諾',
                    'description': '嚴格品質控管，提供最可靠的產品與服務',
                },
                'customer': {
                    'title': '客戶至上',
                    'description': '以用戶需求為核心，提供完善的售後服務',
                },
            },
        },
        'en': {
            'title': 'About Us',
            'subtitle': 'Imagine Innovation - Redefining Air Purification',
            'hero': {
                'title': 'Imagine Innovation',
                'subtitle': 'Redefining Air Purification',
                'description': 'Apolnus is committed to innovative air purification technology with filter-free electrostatic technology at its core, creating eco-friendly and sustainable healthy living environments.',
            },
            'mission': {
                'title': 'Our Mission',
                'content': 'Through innovative technology, we provide the purest air for global users and create healthy and sustainable living environments. We believe that breathing pure air is a fundamental right for everyone.',
            },
            'vision': {
                'title': 'Our Vision',
                'content': 'To become a leading global air purification technology brand, improving global air quality and protecting every breath with filter-free, eco-friendly, and efficient products.',
            },
            'values': {
                'title': 'Core Values',
                'innovation': {
                    'title': 'Innovation',
                    'description': 'Continuously develop breakthrough technologies to lead the air purification industry',
                },
                'sustainability': {
                    'title': 'Sustainability',
                    'description': 'Filter-free design reduces environmental impact and practices sustainable development',
                },
                'quality': {
                    'title': 'Quality Commitment',
                    'description': 'Strict quality control to provide the most reliable products and services',
                },
                'customer': {
                    'title': 'Customer First',
                    'description': 'User-centric approach with comprehensive after-sales service',
                },
            },
        },
    },
    'faq': {
        'zh-TW': {
            'title': '常見問題',
            'subtitle': '快速找到您需要的答案',
            'categories': {
                'product': '產品相關',
                'usage': '使用方法',
                'maintenance': '維護保養',
                'warranty': '保固服務',
                'purchase': '購買相關',
            },
            'searchPlaceholder': '搜尋問題關鍵字',
            'noResults': '找不到相關問題',
            'stillNeedHelp': '還有其他問題？',
            'contactSupport': '聯絡客服',
        },
        'en': {
            'title': 'Frequently Asked Questions',
            'subtitle': 'Find answers to your questions quickly',
            'categories': {
                'product': 'Product',
                'usage': 'Usage',
                'maintenance': 'Maintenance',
                'warranty': 'Warranty',
                'purchase': 'Purchase',
            },
            'searchPlaceholder': 'Search for questions',
            'noResults': 'No questions found',
            'stillNeedHelp': 'Still need help?',
            'contactSupport': 'Contact Support',
        },
    },
    'profile': {
        'zh-TW': {
            'title': '個人中心',
            'subtitle': '管理您的會員資料',
            'menu': {
                'profile': '個人資料',
                'orders': '訂單記錄',
                'warranty': '保固登錄',
                'tickets': '客服工單',
                'settings': '帳號設定',
            },
            'personalInfo': {
                'title': '個人資料',
                'name': '姓名',
                'email': '電子郵件',
                'phone': '電話',
                'address': '地址',
                'saveButton': '儲存變更',
            },
        },
        'en': {
            'title': 'My Account',
            'subtitle': 'Manage your member profile',
            'menu': {
                'profile': 'Profile',
                'orders': 'Order History',
                'warranty': 'Warranty Registration',
                'tickets': 'Support Tickets',
                'settings': 'Account Settings',
            },
            'personalInfo': {
                'title': 'Personal Information',
                'name': 'Name',
                'email': 'Email',
                'phone': 'Phone',
                'address': 'Address',
                'saveButton': 'Save Changes',
            },
        },
    },
    'warrantyRegistration': {
        'zh-TW': {
            'title': '產品保固登錄',
            'subtitle': '線上登錄您的產品保固資訊',
            'form': {
                'productModel': '產品型號',
                'serialNumber': '序號',
                'purchaseDate': '購買日期',
                'purchaseProof': '購買證明',
                'uploadProof': '上傳購買證明',
                'contactInfo': '聯絡資訊',
                'name': '姓名',
                'email': '電子郵件',
                'phone': '電話',
                'address': '地址',
                'submitButton': '提交登錄',
                'successMessage': '保固登錄成功！',
                'errorMessage': '登錄失敗，請稍後再試',
            },
        },
        'en': {
            'title': 'Warranty Registration',
            'subtitle': 'Register your product warranty online',
            'form': {
                'productModel': 'Product Model',
                'serialNumber': 'Serial Number',
                'purchaseDate': 'Purchase Date',
                'purchaseProof': 'Proof of Purchase',
                'uploadProof': 'Upload Proof',
                'contactInfo': 'Contact Information',
                'name': 'Name',
                'email': 'Email',
                'phone': 'Phone',
                'address': 'Address',
                'submitButton': 'Submit Registration',
                'successMessage': 'Warranty registered successfully!',
                'errorMessage': 'Registration failed, please try again later',
            },
        },
    },
    'supportTicket': {
        'zh-TW': {
            'title': '提交客服工單',
            'subtitle': '我們將盡快為您解決問題',
            'form': {
                'category': '問題類別',
                'subject': '主旨',
                'description': '問題描述',
                'attachments': '附件',
                'uploadFiles': '上傳檔案',
                'priority': '優先級',
                'priorityLow': '低',
                'priorityMedium': '中',
                'priorityHigh': '高',
                'submitButton': '提交工單',
                'successMessage': '工單已提交！',
                'errorMessage': '提交失敗，請稍後再試',
            },
        },
        'en': {
            'title': 'Submit Support Ticket',
            'subtitle': 'We will resolve your issue as soon as possible',
            'form': {
                'category': 'Category',
                'subject': 'Subject',
                'description': 'Description',
                'attachments': 'Attachments',
                'uploadFiles': 'Upload Files',
                'priority': 'Priority',
                'priorityLow': 'Low',
                'priorityMedium': 'Medium',
                'priorityHigh': 'High',
                'submitButton': 'Submit Ticket',
                'successMessage': 'Ticket submitted successfully!',
                'errorMessage': 'Submission failed, please try again later',
            },
        },
    },
    'tickets': {
        'zh-TW': {
            'title': '我的工單',
            'subtitle': '查看您的客服工單記錄',
            'status': {
                'all': '全部',
                'open': '處理中',
                'pending': '等待回覆',
                'resolved': '已解決',
                'closed': '已關閉',
            },
            'table': {
                'ticketId': '工單編號',
                'subject': '主旨',
                'category': '類別',
                'status': '狀態',
                'createdAt': '建立時間',
                'actions': '操作',
                'view': '查看',
            },
            'noTickets': '目前沒有工單記錄',
        },
        'en': {
            'title': 'My Tickets',
            'subtitle': 'View your support ticket history',
            'status': {
                'all': 'All',
                'open': 'Open',
                'pending': 'Pending',
                'resolved': 'Resolved',
                'closed': 'Closed',
            },
            'table': {
                'ticketId': 'Ticket ID',
                'subject': 'Subject',
                'category': 'Category',
                'status': 'Status',
                'createdAt': 'Created At',
                'actions': 'Actions',
                'view': 'View',
            },
            'noTickets': 'No tickets found',
        },
    },
    'support': {
        'zh-TW': {
            'title': '服務與支援',
            'subtitle': '我們隨時為您提供協助',
            'sections': {
                'faq': {
                    'title': '常見問題',
                    'description': '查看常見問題解答',
                    'button': '前往 FAQ',
                },
                'ticket': {
                    'title': '提交工單',
                    'description': '提交客服工單，我們將盡快回覆',
                    'button': '提交工單',
                },
                'warranty': {
                    'title': '保固登錄',
                    'description': '線上登錄您的產品保固',
                    'button': '保固登錄',
                },
                'serviceCenter': {
                    'title': '維修中心',
                    'description': '查詢全台授權維修中心',
                    'button': '查詢維修中心',
                },
            },
            'contact': {
                'title': '聯絡我們',
                'phone': '客服電話',
                'email': '客服信箱',
                'hours': '服務時間：週一至週五 09:00-18:00',
            },
        },
        'en': {
            'title': 'Service & Support',
            'subtitle': 'We are here to help you anytime',
            'sections': {
                'faq': {
                    'title': 'FAQ',
                    'description': 'View frequently asked questions',
                    'button': 'Go to FAQ',
                },
                'ticket': {
                    'title': 'Submit Ticket',
                    'description': 'Submit a support ticket and we will respond soon',
                    'button': 'Submit Ticket',
                },
                'warranty': {
                    'title': 'Warranty Registration',
                    'description': 'Register your product warranty online',
                    'button': 'Register Warranty',
                },
                'serviceCenter': {
                    'title': 'Service Centers',
                    'description': 'Find authorized service centers across Taiwan',
                    'button': 'Find Service Centers',
                },
            },
            'contact': {
                'title': 'Contact Us',
                'phone': 'Customer Service Phone',
                'email': 'Customer Service Email',
                'hours': 'Service Hours: Monday to Friday 09:00-18:00',
            },
        },
    },
    'partnerProgram': {
        'zh-TW': {
            'title': '合作夥伴計畫',
            'subtitle': '加入 Apolnus 經銷體系',
            'hero': {
                'title': '成為 Apolnus 合作夥伴',
                'description': '共同推廣創新空氣清淨技術，開創健康生活新商機',
            },
            'benefits': {
                'title': '合作優勢',
                'support': {
                    'title': '完整經銷支援',
                    'description': '提供完整的產品培訓、行銷資源與技術支援',
                },
                'profit': {
                    'title': '優渥利潤空間',
                    'description': '具競爭力的經銷價格與獎勵機制',
                },
                'brand': {
                    'title': '品牌保障',
                    'description': '授權使用 Apolnus 品牌，提升商業價值',
                },
                'market': {
                    'title': '市場潛力',
                    'description': '空氣清淨市場持續成長，商機無限',
                },
            },
            'requirements': {
                'title': '申請條件',
                'item1': '具備實體店面或線上銷售通路',
                'item2': '認同 Apolnus 品牌理念與價值',
                'item3': '具備良好的客戶服務能力',
                'item4': '願意配合品牌行銷活動',
            },
            'form': {
                'title': '立即申請',
                'companyName': '公司名稱',
                'contactPerson': '聯絡人',
                'phone': '聯絡電話',
                'email': '電子郵件',
                'address': '公司地址',
                'businessType': '業務類型',
                'message': '其他說明',
                'submitButton': '提交申請',
                'successMessage': '申請已提交，我們將盡快與您聯繫！',
                'errorMessage': '提交失敗，請稍後再試',
            },
        },
        'en': {
            'title': 'Partner Program',
            'subtitle': 'Join Apolnus Distribution Network',
            'hero': {
                'title': 'Become an Apolnus Partner',
                'description': 'Promote innovative air purification technology together and create new business opportunities for healthy living',
            },
            'benefits': {
                'title': 'Partnership Benefits',
                'support': {
                    'title': 'Complete Distribution Support',
                    'description': 'Comprehensive product training, marketing resources, and technical support',
                },
                'profit': {
                    'title': 'Attractive Profit Margins',
                    'description': 'Competitive distribution pricing and incentive programs',
                },
                'brand': {
                    'title': 'Brand Protection',
                    'description': 'Authorized use of Apolnus brand to enhance business value',
                },
                'market': {
                    'title': 'Market Potential',
                    'description': 'Continuous growth in air purification market with unlimited opportunities',
                },
            },
            'requirements': {
                'title': 'Requirements',
                'item1': 'Physical store or online sales channel',
                'item2': 'Align with Apolnus brand philosophy and values',
                'item3': 'Strong customer service capabilities',
                'item4': 'Willing to participate in brand marketing activities',
            },
            'form': {
                'title': 'Apply Now',
                'companyName': 'Company Name',
                'contactPerson': 'Contact Person',
                'phone': 'Phone',
                'email': 'Email',
                'address': 'Company Address',
                'businessType': 'Business Type',
                'message': 'Additional Information',
                'submitButton': 'Submit Application',
                'successMessage': 'Application submitted successfully! We will contact you soon.',
                'errorMessage': 'Submission failed, please try again later',
            },
        },
    },
    'careers': {
        'zh-TW': {
            'title': '招聘精英',
            'subtitle': '加入 Apolnus 創新團隊',
            'hero': {
                'title': '與我們一起創造更健康的空氣環境',
                'description': '探索 Apolnus 職涯機會，成為改變世界的一員',
            },
            'whyJoin': {
                'title': '為什麼選擇 Apolnus',
                'innovation': {
                    'title': '創新環境',
                    'description': '鼓勵創新思維，提供發揮創意的舞台',
                },
                'growth': {
                    'title': '職涯發展',
                    'description': '完善的培訓體系，協助員工持續成長',
                },
                'benefits': {
                    'title': '優渥福利',
                    'description': '具競爭力的薪資與完善的福利制度',
                },
                'culture': {
                    'title': '友善文化',
                    'description': '開放包容的工作環境，重視工作生活平衡',
                },
            },
            'openings': {
                'title': '職缺列表',
                'noOpenings': '目前沒有職缺',
                'applyButton': '立即應徵',
            },
            'contact': {
                'title': '找不到合適的職缺？',
                'description': '歡迎主動投遞履歷，我們會將您的資料保留在人才庫中',
                'email': '請將履歷寄至',
            },
        },
        'en': {
            'title': 'Careers',
            'subtitle': 'Join the Apolnus Innovation Team',
            'hero': {
                'title': 'Create Healthier Air Environments with Us',
                'description': 'Explore career opportunities at Apolnus and become part of changing the world',
            },
            'whyJoin': {
                'title': 'Why Join Apolnus',
                'innovation': {
                    'title': 'Innovative Environment',
                    'description': 'Encourage innovative thinking and provide a stage for creativity',
                },
                'growth': {
                    'title': 'Career Development',
                    'description': 'Comprehensive training system to help employees grow continuously',
                },
                'benefits': {
                    'title': 'Competitive Benefits',
                    'description': 'Competitive compensation and comprehensive benefits package',
                },
                'culture': {
                    'title': 'Friendly Culture',
                    'description': 'Open and inclusive work environment, emphasizing work-life balance',
                },
            },
            'openings': {
                'title': 'Job Openings',
                'noOpenings': 'No current openings',
                'applyButton': 'Apply Now',
            },
            'contact': {
                'title': 'Can\'t find a suitable position?',
                'description': 'Feel free to submit your resume proactively, and we will keep it in our talent pool',
                'email': 'Please send your resume to',
            },
        },
    },
    'notFound': {
        'zh-TW': {
            'title': '找不到頁面',
            'message': '抱歉，您訪問的頁面不存在',
            'description': '您可以返回首頁或使用導覽列尋找您需要的內容',
            'homeButton': '返回首頁',
        },
        'en': {
            'title': 'Page Not Found',
            'message': 'Sorry, the page you are looking for does not exist',
            'description': 'You can return to the homepage or use the navigation to find what you need',
            'homeButton': 'Go to Homepage',
        },
    },
}

# 法律頁面段落式翻譯（Privacy & Terms）
LEGAL_TRANSLATIONS = {
    'privacy': {
        'zh-TW': {
            'title': '隱私權政策',
            'lastUpdated': '最後更新日期',
            'intro': '本隱私權政策說明 Apolnus（以下簡稱「本公司」）如何收集、使用、揭露及保護您的個人資料。當您使用本公司的網站、產品或服務時，即表示您同意本隱私權政策的內容。',
            'collection': {
                'title': '資料收集',
                'content': '我們可能收集的個人資料包括但不限於：姓名、電子郵件地址、電話號碼、郵寄地址、產品序號、購買記錄等。這些資料可能透過以下方式收集：網站註冊、產品保固登錄、客服諮詢、線上購物、訂閱電子報等。',
            },
            'usage': {
                'title': '資料使用',
                'content': '我們收集的個人資料將用於以下目的：提供產品與服務、處理訂單與保固、客戶服務與技術支援、行銷與促銷活動、改善產品與服務品質、法律義務履行等。我們不會將您的個人資料用於其他未經您同意的目的。',
            },
            'disclosure': {
                'title': '資料揭露',
                'content': '除非獲得您的同意或法律要求，我們不會向第三方揭露您的個人資料。在以下情況下，我們可能需要揭露您的資料：配合司法機關或政府機關的合法要求、保護本公司或他人的權利與安全、防止詐欺或其他違法行為、業務轉讓或合併時。',
            },
            'security': {
                'title': '資料安全',
                'content': '我們採取適當的技術與組織措施來保護您的個人資料，防止未經授權的存取、使用、揭露、修改或銷毀。這些措施包括：加密傳輸、存取控制、定期安全審查、員工培訓等。然而，沒有任何網路傳輸或電子儲存方式是百分之百安全的。',
            },
            'rights': {
                'title': '您的權利',
                'content': '您對於您的個人資料享有以下權利：查詢或請求閱覽、請求製給複製本、請求補充或更正、請求停止收集、處理或利用、請求刪除。如需行使上述權利，請透過本政策末尾提供的聯絡方式與我們聯繫。',
            },
            'cookies': {
                'title': 'Cookies 使用',
                'content': '本網站使用 Cookies 及類似技術來改善使用者體驗、分析網站流量、提供個人化內容。您可以透過瀏覽器設定來管理或拒絕 Cookies，但這可能影響部分網站功能的正常運作。',
            },
            'thirdParty': {
                'title': '第三方連結',
                'content': '本網站可能包含第三方網站的連結。我們對這些第三方網站的隱私權政策或內容不負責任。當您點擊這些連結離開本網站時，建議您閱讀該網站的隱私權政策。',
            },
            'children': {
                'title': '兒童隱私',
                'content': '本網站的服務不針對 13 歲以下的兒童。我們不會故意收集 13 歲以下兒童的個人資料。如果您發現我們收集了兒童的個人資料，請立即與我們聯繫，我們將盡快刪除相關資料。',
            },
            'changes': {
                'title': '政策變更',
                'content': '我們可能不時更新本隱私權政策。任何重大變更將在本網站上公告，並更新「最後更新日期」。建議您定期查閱本政策以了解最新資訊。繼續使用本網站或服務即表示您接受更新後的政策。',
            },
            'contact': {
                'title': '聯絡我們',
                'content': '如果您對本隱私權政策有任何疑問或需要協助，請透過以下方式與我們聯繫：',
                'email': '電子郵件',
                'phone': '客服電話',
                'address': '公司地址',
            },
        },
        'en': {
            'title': 'Privacy Policy',
            'lastUpdated': 'Last Updated',
            'intro': 'This Privacy Policy explains how Apolnus ("we", "our", or "the Company") collects, uses, discloses, and protects your personal information. By using our website, products, or services, you agree to the terms of this Privacy Policy.',
            'collection': {
                'title': 'Information Collection',
                'content': 'Personal information we may collect includes but is not limited to: name, email address, phone number, mailing address, product serial number, purchase history, etc. This information may be collected through: website registration, product warranty registration, customer service inquiries, online shopping, newsletter subscription, etc.',
            },
            'usage': {
                'title': 'Information Usage',
                'content': 'Personal information we collect will be used for the following purposes: providing products and services, processing orders and warranties, customer service and technical support, marketing and promotional activities, improving product and service quality, legal compliance, etc. We will not use your personal information for other purposes without your consent.',
            },
            'disclosure': {
                'title': 'Information Disclosure',
                'content': 'We will not disclose your personal information to third parties unless we have your consent or are required by law. We may need to disclose your information in the following circumstances: compliance with legal requests from judicial or government authorities, protection of our rights and safety or those of others, prevention of fraud or other illegal activities, business transfer or merger.',
            },
            'security': {
                'title': 'Information Security',
                'content': 'We implement appropriate technical and organizational measures to protect your personal information from unauthorized access, use, disclosure, modification, or destruction. These measures include: encrypted transmission, access control, regular security reviews, employee training, etc. However, no method of internet transmission or electronic storage is 100% secure.',
            },
            'rights': {
                'title': 'Your Rights',
                'content': 'You have the following rights regarding your personal information: access or request to view, request copies, request supplementation or correction, request to stop collection, processing or use, request deletion. To exercise these rights, please contact us using the contact information provided at the end of this policy.',
            },
            'cookies': {
                'title': 'Cookies Usage',
                'content': 'This website uses Cookies and similar technologies to improve user experience, analyze website traffic, and provide personalized content. You can manage or refuse Cookies through your browser settings, but this may affect the normal operation of some website features.',
            },
            'thirdParty': {
                'title': 'Third-Party Links',
                'content': 'This website may contain links to third-party websites. We are not responsible for the privacy policies or content of these third-party websites. When you click these links and leave our website, we recommend reading the privacy policy of that website.',
            },
            'children': {
                'title': 'Children\'s Privacy',
                'content': 'Our services are not directed at children under 13 years of age. We do not knowingly collect personal information from children under 13. If you discover that we have collected personal information from a child, please contact us immediately and we will delete the relevant information as soon as possible.',
            },
            'changes': {
                'title': 'Policy Changes',
                'content': 'We may update this Privacy Policy from time to time. Any significant changes will be announced on this website and the "Last Updated" date will be updated. We recommend that you regularly review this policy to stay informed of the latest information. Continued use of this website or services indicates your acceptance of the updated policy.',
            },
            'contact': {
                'title': 'Contact Us',
                'content': 'If you have any questions about this Privacy Policy or need assistance, please contact us through the following methods:',
                'email': 'Email',
                'phone': 'Customer Service Phone',
                'address': 'Company Address',
            },
        },
    },
    'terms': {
        'zh-TW': {
            'title': '使用條款',
            'lastUpdated': '最後更新日期',
            'intro': '歡迎使用 Apolnus 網站與服務。在使用本網站或服務前，請仔細閱讀以下使用條款。當您使用本網站或服務時，即表示您同意遵守本使用條款的所有規定。',
            'acceptance': {
                'title': '條款接受',
                'content': '使用本網站或服務即表示您接受並同意遵守本使用條款及所有適用的法律法規。如果您不同意本使用條款的任何部分，請勿使用本網站或服務。本公司保留隨時修改或更新本使用條款的權利。',
            },
            'account': {
                'title': '帳號註冊',
                'content': '使用某些服務可能需要註冊帳號。您同意提供真實、準確、完整的註冊資訊，並及時更新以保持資訊的準確性。您有責任維護帳號的安全性與機密性，並對在您帳號下進行的所有活動負責。如發現任何未經授權的使用，請立即通知我們。',
            },
            'prohibited': {
                'title': '禁止行為',
                'content': '您同意不得從事以下行為：違反任何適用的法律法規、侵犯他人的智慧財產權或其他權利、上傳或傳播惡意軟體、病毒或其他有害程式碼、進行詐欺、騷擾、威脅或其他不當行為、干擾或破壞本網站或服務的正常運作、未經授權存取本網站或服務的系統或網路、使用自動化工具或機器人程式存取本網站。',
            },
            'intellectual': {
                'title': '智慧財產權',
                'content': '本網站的所有內容，包括但不限於文字、圖片、影片、音訊、商標、標誌、軟體等，均受智慧財產權法保護，屬於本公司或其授權方所有。未經書面許可，您不得複製、修改、分發、展示、出售或以其他方式使用這些內容。',
            },
            'userContent': {
                'title': '用戶內容',
                'content': '您可能有機會在本網站上發布或提交內容（如評論、評價、圖片等）。您保證您擁有或已獲得必要的權利來發布該內容。您授予本公司非專屬、免費、永久、全球性的權利來使用、複製、修改、展示和分發您提交的內容。本公司保留刪除任何不當或違反本條款的用戶內容的權利。',
            },
            'warranty': {
                'title': '免責聲明',
                'content': '本網站及服務按「現狀」提供，不提供任何明示或暗示的保證，包括但不限於適銷性、特定用途適用性或不侵權的保證。本公司不保證本網站或服務將不間斷、無錯誤或無病毒。您使用本網站或服務的風險由您自行承擔。',
            },
            'liability': {
                'title': '責任限制',
                'content': '在法律允許的最大範圍內，本公司及其董事、員工、代理人或合作夥伴不對因使用或無法使用本網站或服務而產生的任何直接、間接、附帶、特殊、懲罰性或後果性損害承擔責任，包括但不限於利潤損失、資料遺失或業務中斷。',
            },
            'indemnification': {
                'title': '賠償',
                'content': '您同意賠償並使本公司及其董事、員工、代理人免受因您違反本使用條款、侵犯他人權利或違反法律而產生的任何索賠、損失、責任、費用（包括合理的律師費）的損害。',
            },
            'termination': {
                'title': '終止',
                'content': '本公司保留隨時暫停或終止您使用本網站或服務的權利，無需事先通知，特別是當您違反本使用條款時。終止後，您使用本網站或服務的權利將立即停止，但本使用條款中應在終止後繼續有效的條款將繼續有效。',
            },
            'governing': {
                'title': '適用法律',
                'content': '本使用條款受中華民國法律管轄並依其解釋。因本使用條款引起的任何爭議應提交台灣台北地方法院管轄。',
            },
            'contact': {
                'title': '聯絡我們',
                'content': '如果您對本使用條款有任何疑問，請透過以下方式與我們聯繫：',
                'email': '電子郵件',
                'phone': '客服電話',
                'address': '公司地址',
            },
        },
        'en': {
            'title': 'Terms of Service',
            'lastUpdated': 'Last Updated',
            'intro': 'Welcome to Apolnus website and services. Before using this website or services, please read the following Terms of Service carefully. By using this website or services, you agree to comply with all provisions of these Terms of Service.',
            'acceptance': {
                'title': 'Acceptance of Terms',
                'content': 'Using this website or services indicates that you accept and agree to comply with these Terms of Service and all applicable laws and regulations. If you do not agree to any part of these Terms of Service, please do not use this website or services. The Company reserves the right to modify or update these Terms of Service at any time.',
            },
            'account': {
                'title': 'Account Registration',
                'content': 'Using certain services may require account registration. You agree to provide true, accurate, and complete registration information and update it promptly to maintain accuracy. You are responsible for maintaining the security and confidentiality of your account and are responsible for all activities conducted under your account. If you discover any unauthorized use, please notify us immediately.',
            },
            'prohibited': {
                'title': 'Prohibited Conduct',
                'content': 'You agree not to engage in the following behaviors: violating any applicable laws or regulations, infringing on others\' intellectual property rights or other rights, uploading or distributing malware, viruses, or other harmful code, engaging in fraud, harassment, threats, or other improper behavior, interfering with or disrupting the normal operation of this website or services, unauthorized access to systems or networks of this website or services, using automated tools or bots to access this website.',
            },
            'intellectual': {
                'title': 'Intellectual Property Rights',
                'content': 'All content on this website, including but not limited to text, images, videos, audio, trademarks, logos, software, etc., is protected by intellectual property laws and belongs to the Company or its licensors. Without written permission, you may not copy, modify, distribute, display, sell, or otherwise use this content.',
            },
            'userContent': {
                'title': 'User Content',
                'content': 'You may have the opportunity to post or submit content on this website (such as comments, reviews, images, etc.). You warrant that you own or have obtained the necessary rights to post such content. You grant the Company a non-exclusive, royalty-free, perpetual, worldwide right to use, copy, modify, display, and distribute the content you submit. The Company reserves the right to delete any user content that is inappropriate or violates these terms.',
            },
            'warranty': {
                'title': 'Disclaimer',
                'content': 'This website and services are provided "as is" without any express or implied warranties, including but not limited to warranties of merchantability, fitness for a particular purpose, or non-infringement. The Company does not guarantee that this website or services will be uninterrupted, error-free, or virus-free. You use this website or services at your own risk.',
            },
            'liability': {
                'title': 'Limitation of Liability',
                'content': 'To the maximum extent permitted by law, the Company and its directors, employees, agents, or partners shall not be liable for any direct, indirect, incidental, special, punitive, or consequential damages arising from the use or inability to use this website or services, including but not limited to loss of profits, data loss, or business interruption.',
            },
            'indemnification': {
                'title': 'Indemnification',
                'content': 'You agree to indemnify and hold harmless the Company and its directors, employees, and agents from any claims, losses, liabilities, expenses (including reasonable attorney fees) arising from your violation of these Terms of Service, infringement of others\' rights, or violation of laws.',
            },
            'termination': {
                'title': 'Termination',
                'content': 'The Company reserves the right to suspend or terminate your use of this website or services at any time without prior notice, especially when you violate these Terms of Service. After termination, your right to use this website or services will immediately cease, but provisions of these Terms of Service that should continue to be effective after termination will remain in effect.',
            },
            'governing': {
                'title': 'Governing Law',
                'content': 'These Terms of Service are governed by and construed in accordance with the laws of the Republic of China (Taiwan). Any disputes arising from these Terms of Service shall be submitted to the jurisdiction of the Taipei District Court in Taiwan.',
            },
            'contact': {
                'title': 'Contact Us',
                'content': 'If you have any questions about these Terms of Service, please contact us through the following methods:',
                'email': 'Email',
                'phone': 'Customer Service Phone',
                'address': 'Company Address',
            },
        },
    },
}

def generate_all_translations():
    """生成所有語言的翻譯"""
    print('🚀 開始生成翻譯檔案...\n')
    
    # 合併現有翻譯和新翻譯
    all_translations = {
        'zh-TW': {**existing_zh_tw},
        'zh-CN': {},
        'en': {**existing_en},
        'ja': {},
        'ko': {},
        'de': {},
        'fr': {},
    }
    
    # 添加頁面翻譯
    for page_key, page_trans in PAGE_TRANSLATIONS.items():
        for lang in ['zh-TW', 'en']:
            if lang in page_trans:
                all_translations[lang][page_key] = page_trans[lang]
                print(f'✅ 添加 {page_key} ({lang}) 翻譯')
    
    # 添加法律頁面翻譯
    for page_key, page_trans in LEGAL_TRANSLATIONS.items():
        for lang in ['zh-TW', 'en']:
            if lang in page_trans:
                all_translations[lang][page_key] = page_trans[lang]
                print(f'✅ 添加 {page_key} ({lang}) 翻譯（段落式）')
    
    # 保存所有語言檔案
    for lang, translations in all_translations.items():
        if translations:  # 只保存有內容的語言
            output_file = OUTPUT_DIR / f'{lang}.json'
            with open(output_file, 'w', encoding='utf-8') as f:
                json.dump(translations, f, ensure_ascii=False, indent=2)
            print(f'💾 保存 {lang}.json')
    
    print('\n✅ 翻譯檔案生成完成！')
    print(f'📊 總共生成了 {len([t for t in all_translations.values() if t])} 個語言檔案')

if __name__ == '__main__':
    generate_all_translations()
