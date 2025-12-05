import { useState, useEffect } from "react";
import { useTranslation } from 'react-i18next';
import AdminNav from "@/components/AdminNav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Sparkles, Loader2 } from "lucide-react";

// 頁面列表
const PAGES = [
  { id: "home", name: "首頁" },
  { id: "about", name: "關於我們" },
  { id: "product-one-x", name: "產品 - One X" },
  { id: "product-one-x-specs", name: "產品 - One X 規格" },
  { id: "product-one-x-downloads", name: "產品 - One X 下載" },
  { id: "product-one-x-faq", name: "產品 - One X FAQ" },
  { id: "where-to-buy", name: "購買通路" },
  { id: "service-centers", name: "授權維修中心" },
  { id: "support", name: "服務與支援" },
  { id: "faq", name: "常見問題" },
  { id: "profile", name: "個人中心" },
  { id: "warranty-registration", name: "保固登錄" },
  { id: "support-ticket", name: "客服工單" },

  { id: "partner-program", name: "合作夥伴申請" },
  { id: "careers", name: "招聘精英" },
  { id: "privacy-policy", name: "隱私權政策" },
  { id: "terms-of-use", name: "使用條款" },
];

// 語言列表
const LANGUAGES = [
  { code: "zh-TW", name: "繁體中文 (Master)" },
  { code: "en", name: "English" },
  { code: "zh-CN", name: "简体中文" },
  { code: "ja", name: "日本語" },
  { code: "ko", name: "한국어" },
  { code: "de", name: "Deutsch" },
  { code: "fr", name: "Français" },
];

export default function AdminSEO() {
  const { t } = useTranslation();

  const [selectedPage, setSelectedPage] = useState(PAGES[0].id);
  const [formData, setFormData] = useState<Record<string, { title: string; description: string; keywords: string }>>({});
  const [translating, setTranslating] = useState(false);
  const [batchTranslating, setBatchTranslating] = useState(false);

  // 獲取所有 SEO 設定
  const { data: settings, refetch } = trpc.admin.seo.getSettings.useQuery();
  const updateSetting = trpc.admin.seo.updateSetting.useMutation();
  const translate = trpc.admin.seo.translate.useMutation();

  // 當頁面切換時，重新讀取該頁面的設定
  useEffect(() => {
    if (settings) {
      const data: Record<string, { title: string; description: string; keywords: string }> = {};
      
      LANGUAGES.forEach((lang) => {
        const setting = settings.find((s) => s.page === selectedPage && s.language === lang.code);
        data[lang.code] = {
          title: setting?.title || "",
          description: setting?.description || "",
          keywords: setting?.keywords || "",
        };
      });
      
      setFormData(data);
    }
  }, [settings, selectedPage]);

  // 當頁面切換時，重新讀取資料庫
  useEffect(() => {
    refetch();
  }, [selectedPage, refetch]);

  // 批次 AI 翻譯所有頁面
  const handleBatchTranslate = async () => {
    if (!settings) {
      toast.error("正在載入資料，請稍後再試");
      return;
    }

    setBatchTranslating(true);
    let translatedCount = 0;
    let skippedCount = 0;

    try {
      // 找出所有有繁體中文內容的頁面
      const pagesToTranslate: string[] = [];
      
      for (const page of PAGES) {
        const zhTWSetting = settings.find((s) => s.page === page.id && s.language === "zh-TW");
        if (zhTWSetting && zhTWSetting.title) {
          // 檢查是否已經有其他語言的翻譯
          const hasOtherLangs = LANGUAGES.slice(1).some((lang) => {
            const setting = settings.find((s) => s.page === page.id && s.language === lang.code);
            return setting && setting.title;
          });
          
          if (!hasOtherLangs) {
            pagesToTranslate.push(page.id);
          }
        }
      }

      if (pagesToTranslate.length === 0) {
        toast.info("沒有需要翻譯的頁面（所有頁面都已翻譯或沒有繁中內容）");
        setBatchTranslating(false);
        return;
      }

      toast.info(`找到 ${pagesToTranslate.length} 個頁面需要翻譯，開始處理...`);

      // 依序翻譯每個頁面
      for (const pageId of pagesToTranslate) {
        const zhTWSetting = settings.find((s) => s.page === pageId && s.language === "zh-TW");
        if (!zhTWSetting || !zhTWSetting.title) {
          skippedCount++;
          continue;
        }

        try {
          // 翻譯標題
          const titleTranslations = await translate.mutateAsync({
            text: zhTWSetting.title,
            sourceLang: "zh-TW",
          });

          // 翻譯描述（如果有）
          let descriptionTranslations: Record<string, string> = {};
          if (zhTWSetting.description) {
            descriptionTranslations = await translate.mutateAsync({
              text: zhTWSetting.description,
              sourceLang: "zh-TW",
            });
          }

          // 翻譯關鍵字（如果有）
          let keywordsTranslations: Record<string, string> = {};
          if (zhTWSetting.keywords) {
            keywordsTranslations = await translate.mutateAsync({
              text: zhTWSetting.keywords,
              sourceLang: "zh-TW",
            });
          }

          // 儲存所有語言
          for (const lang of LANGUAGES.slice(1)) { // 跳過 zh-TW
            const langCode = lang.code;
            if (titleTranslations[langCode]) {
              await updateSetting.mutateAsync({
                page: pageId,
                language: langCode,
                title: titleTranslations[langCode],
                description: descriptionTranslations[langCode] || "",
                keywords: keywordsTranslations[langCode] || "",
              });
            }
          }

          translatedCount++;
          toast.success(`✅ ${PAGES.find(p => p.id === pageId)?.name} 翻譯完成`);
        } catch (error) {
          console.error(`Translation error for page ${pageId}:`, error);
          skippedCount++;
          toast.error(`❗ ${PAGES.find(p => p.id === pageId)?.name} 翻譯失敗`);
        }
      }

      await refetch();
      toast.success(`✨ 批次翻譯完成！成功: ${translatedCount} 個，跳過: ${skippedCount} 個`);
    } catch (error) {
      console.error("Batch translation error:", error);
      toast.error("批次翻譯失敗，請稍後再試");
    } finally {
      setBatchTranslating(false);
    }
  };

  // AI 一鍵翻譯
  const handleAITranslate = async () => {
    const masterTitle = formData["zh-TW"]?.title;
    const masterDescription = formData["zh-TW"]?.description;
    const masterKeywords = formData["zh-TW"]?.keywords;

    if (!masterTitle) {
      toast.error("請先輸入繁體中文標題");
      return;
    }

    setTranslating(true);
    
    try {
      // 翻譯標題
      const titleTranslations = await translate.mutateAsync({
        text: masterTitle,
        sourceLang: "zh-TW",
      });

      // 翻譯描述（如果有）
      let descriptionTranslations: Record<string, string> = {};
      if (masterDescription) {
        descriptionTranslations = await translate.mutateAsync({
          text: masterDescription,
          sourceLang: "zh-TW",
        });
      }

      // 翻譯關鍵字（如果有）
      let keywordsTranslations: Record<string, string> = {};
      if (masterKeywords) {
        keywordsTranslations = await translate.mutateAsync({
          text: masterKeywords,
          sourceLang: "zh-TW",
        });
      }

      // 更新表單數據
      const newFormData = { ...formData };
      Object.keys(titleTranslations).forEach((lang) => {
        if (!newFormData[lang]) {
          newFormData[lang] = { title: "", description: "", keywords: "" };
        }
        newFormData[lang].title = titleTranslations[lang];
        if (descriptionTranslations[lang]) {
          newFormData[lang].description = descriptionTranslations[lang];
        }
        if (keywordsTranslations[lang]) {
          newFormData[lang].keywords = keywordsTranslations[lang];
        }
      });

      setFormData(newFormData);
      toast.success("✨ AI 翻譯完成！請檢查並儲存");
    } catch (error) {
      console.error("Translation error:", error);
      toast.error("翻譯失敗，請稍後再試");
    } finally {
      setTranslating(false);
    }
  };

  // 儲存所有語言的 SEO 設定
  const handleSave = async () => {
    try {
      // 儲存所有語言
      for (const lang of LANGUAGES) {
        const data = formData[lang.code];
        if (data && data.title) {
          await updateSetting.mutateAsync({
            page: selectedPage,
            language: lang.code,
            title: data.title,
            description: data.description || "",
            keywords: data.keywords || "",
          });
        }
      }

      await refetch();
      toast.success("SEO 設定已儲存");
    } catch (error) {
      console.error("Save error:", error);
      toast.error("儲存失敗");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNav />
      
      <div className="ml-64 p-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{t('seomanagement.t_a86c3886')}</h1>
            <p className="text-gray-600 mt-2">{t('seomanagement.t_9e59e50d')}</p>
          </div>
          <Button
            onClick={handleBatchTranslate}
            disabled={batchTranslating}
            size="lg"
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700"
          >
            {batchTranslating ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />{t('seomanagement.t_979a9cd9')}</>
            ) : (
              <>
                <Sparkles className="w-5 h-5 mr-2" />{t('seomanagement.t_1eace230')}</>
            )}
          </Button>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* 左側：頁面列表 */}
          <div className="col-span-3">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-4 border-b border-gray-200">
                <h2 className="font-semibold text-gray-900">{t('seomanagement.t_435fa47d')}</h2>
              </div>
              <div className="p-2">
                {PAGES.map((page) => (
                  <button
                    key={page.id}
                    onClick={() => setSelectedPage(page.id)}
                    className={`w-full text-left px-4 py-2 rounded-md text-sm transition-colors ${
                      selectedPage === page.id
                        ? "bg-blue-50 text-blue-600 font-medium"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {page.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 右側：編輯表單 */}
          <div className="col-span-9">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  {PAGES.find((p) => p.id === selectedPage)?.name}
                </h2>
                <Button onClick={handleSave} disabled={updateSetting.isPending}>
                  {updateSetting.isPending ? "儲存中..." : "儲存"}
                </Button>
              </div>

              <div className="space-y-6">
                {LANGUAGES.map((lang, index) => (
                  <div key={lang.code} className="border-b border-gray-200 pb-6 last:border-b-0">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-medium text-gray-900">{lang.name}</h3>
                      {index === 0 && (
                        <Button
                          onClick={handleAITranslate}
                          disabled={translating}
                          variant="outline"
                          className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 hover:from-purple-600 hover:to-pink-600"
                        >
                          {translating ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />{t('seomanagement.t_44d096f9')}</>
                          ) : (
                            <>
                              <Sparkles className="w-4 h-4 mr-2" />{t('seomanagement.t_449a9ca3')}</>
                          )}
                        </Button>
                      )}
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">{t('seomanagement.t_6acb491c')}</label>
                        <Input
                          value={formData[lang.code]?.title || ""}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              [lang.code]: {
                                title: e.target.value,
                                description: formData[lang.code]?.description || "",
                                keywords: formData[lang.code]?.keywords || "",
                              },
                            })
                          }
                          placeholder={t('seomanagement.t_bb6665ed')}
                          className="w-full"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">{t('seomanagement.t_937f5fc9')}</label>
                        <Textarea
                          value={formData[lang.code]?.description || ""}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              [lang.code]: {
                                title: formData[lang.code]?.title || "",
                                description: e.target.value,
                                keywords: formData[lang.code]?.keywords || "",
                              },
                            })
                          }
                          placeholder={t('seomanagement.t_70af5bcf')}
                          rows={3}
                          className="w-full"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">{t('seomanagement.t_ced8aa7d')}</label>
                        <Input
                          value={formData[lang.code]?.keywords || ""}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              [lang.code]: {
                                title: formData[lang.code]?.title || "",
                                description: formData[lang.code]?.description || "",
                                keywords: e.target.value,
                              },
                            })
                          }
                          placeholder={t('seomanagement.t_59d0dc9b')}
                          className="w-full"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
