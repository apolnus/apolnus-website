import { useState, useEffect, useMemo } from "react";
import AdminNav from "@/components/AdminNav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Sparkles, Loader2, RefreshCw } from "lucide-react";

// 語言列表已移至下方

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
  // 獲取所有 SEO 設定
  const { data: settings, refetch } = trpc.admin.seo.getSettings.useQuery();
  
  // 從設定中提取所有唯一的頁面 ID
  const pages = useMemo(() => {
    if (!settings) return [];
    const uniquePages = Array.from(new Set(settings.map(s => s.page)));
    return uniquePages.map(page => ({
      id: page,
      name: page.split('/').pop() || page,
      category: page.startsWith('products/') ? 'product' : 'general'
    }));
  }, [settings]);
  
  const [selectedPage, setSelectedPage] = useState<string>('');
  
  // 當頁面列表載入後，設定預設選中的頁面
  useEffect(() => {
    if (pages.length > 0 && !selectedPage) {
      setSelectedPage(pages[0].id);
    }
  }, [pages, selectedPage]);
  const [formData, setFormData] = useState<Record<string, { title: string; description: string; keywords: string }>>({});
  const [translating, setTranslating] = useState(false);
  const [batchTranslating, setBatchTranslating] = useState(false);

  const updateSetting = trpc.admin.seo.updateSetting.useMutation();
  const translate = trpc.admin.seo.translate.useMutation();
  const syncPages = trpc.admin.seo.syncPages.useMutation();

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

  // 同步網站頁面
  const handleSyncPages = async () => {
    try {
      const result = await syncPages.mutateAsync();
      await refetch();
      if (result.addedCount > 0) {
        toast.success(`✅ 成功同步 ${result.addedCount} 個新頁面`);
      } else {
        toast.info("ℹ️ 沒有新頁面需要同步");
      }
    } catch (error) {
      console.error("Sync pages error:", error);
      toast.error("❗ 同步失敗，請稍後再試");
    }
  };

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
      
      for (const page of pages) {
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
          toast.success(`✅ ${pages.find(p => p.id === pageId)?.name} 翻譯完成`);
        } catch (error) {
          console.error(`Translation error for page ${pageId}:`, error);
          skippedCount++;
          toast.error(`❗ ${pages.find(p => p.id === pageId)?.name} 翻譯失敗`);
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
            <h1 className="text-3xl font-bold text-gray-900">SEO 管理</h1>
            <p className="text-gray-600 mt-2">管理網站各頁面的 SEO 設定，支援 AI 一鍵多國語言翻譯</p>
          </div>
          <Button
            onClick={handleBatchTranslate}
            disabled={batchTranslating}
            size="lg"
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700"
          >
            {batchTranslating ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                批次翻譯中...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 mr-2" />
                ✨ 批次 AI 翻譯所有頁面
              </>
            )}
          </Button>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* 左側：頁面列表 */}
          <div className="col-span-3">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <h2 className="font-semibold text-gray-900">頁面列表</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSyncPages}
                  disabled={syncPages.isPending}
                  className="h-8 w-8 p-0"
                >
                  <RefreshCw className={`h-4 w-4 ${syncPages.isPending ? 'animate-spin' : ''}`} />
                </Button>
              </div>
              <div className="p-2">
                {pages.map((page) => (
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
                  {pages.find((p) => p.id === selectedPage)?.name}
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
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              翻譯中...
                            </>
                          ) : (
                            <>
                              <Sparkles className="w-4 h-4 mr-2" />
                              ✨ AI 一鍵翻譯
                            </>
                          )}
                        </Button>
                      )}
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          標題 (Title)
                        </label>
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
                          placeholder="輸入頁面標題"
                          className="w-full"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          描述 (Description)
                        </label>
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
                          placeholder="輸入頁面描述"
                          rows={3}
                          className="w-full"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          關鍵字 (Keywords)
                        </label>
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
                          placeholder="輸入關鍵字（逗號分隔）"
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
