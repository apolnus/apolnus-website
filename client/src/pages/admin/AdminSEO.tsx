import { useState, useEffect } from "react";
import AdminNav, { AdminSidebar } from "@/components/AdminNav";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Sparkles, Loader2, Save, Search, RefreshCw, FileText, BarChart3, Globe, Link2 } from "lucide-react";

// 語言列表
const LANGUAGES = [
  { code: "zh-TW", name: "繁體中文", flag: "🇹🇼" },
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "zh-CN", name: "简體中文", flag: "🇨🇳" },
  { code: "ja", name: "日本語", flag: "🇯🇵" },
  { code: "ko", name: "한국어", flag: "🇰🇷" },
  { code: "de", name: "Deutsch", flag: "🇩🇪" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
];

export default function AdminSEO() {
  const [selectedPage, setSelectedPage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState<Record<string, { title: string; description: string; keywords: string }>>({});
  const [translating, setTranslating] = useState(false);
  const [batchTranslating, setBatchTranslating] = useState(false);
  const [batchProgress, setBatchProgress] = useState({ current: 0, total: 0 });
  const [saving, setSaving] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [filling, setFilling] = useState(false);
  const [refreshingSitemap, setRefreshingSitemap] = useState(false);

  // 獲取 Sitemap 統計資訊
  const { data: sitemapStats, refetch: refetchSitemapStats } = trpc.admin.seo.getSitemapStats.useQuery();
  const refreshSitemap = trpc.admin.seo.refreshSitemap.useMutation();

  // 獲取所有 SEO 設定
  const { data: settings, refetch, isLoading } = trpc.admin.seo.getSettings.useQuery();
  const updateSetting = trpc.admin.seo.update.useMutation();
  const translate = trpc.admin.seo.translate.useMutation();
  const syncPages = trpc.admin.seo.syncPages.useMutation();
  const batchFillProductSeo = trpc.admin.seo.batchFillProductSeo.useMutation();

  // 從設定中提取唯一的頁面列表
  const pages = settings
    ? Array.from(new Set(settings.map((s) => s.page))).map((pageId) => {
        // 從第一筆設定中取得頁面名稱(假設zh-TW的title就是頁面名稱)
        const zhTWSetting = settings.find((s) => s.page === pageId && s.language === "zh-TW");
        return {
          id: pageId,
          name: zhTWSetting?.title || pageId,
        };
      })
    : [];

  // 設定初始選中頁面
  useEffect(() => {
    if (pages.length > 0 && !selectedPage) {
      setSelectedPage(pages[0].id);
    }
  }, [pages, selectedPage]);

  // 當頁面切換時,重新讀取該頁面的設定
  useEffect(() => {
    if (settings && selectedPage) {
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

  // 同步頁面
  const handleSyncPages = async () => {
    setSyncing(true);
    try {
      const result = await syncPages.mutateAsync();
      await refetch();
      toast.success(`✅ 同步完成！共 ${result.totalPages} 個頁面,新增 ${result.addedSettings} 筆設定`);
    } catch (error) {
      console.error("Sync error:", error);
      toast.error("同步失敗");
    } finally {
      setSyncing(false);
    }
  };

  // 一鍵更新 Sitemap
  const handleRefreshSitemap = async () => {
    setRefreshingSitemap(true);
    try {
      const result = await refreshSitemap.mutateAsync();
      await refetchSitemapStats();
      toast.success(result.message);
    } catch (error) {
      console.error("Refresh sitemap error:", error);
      toast.error("更新 Sitemap 失敗");
    } finally {
      setRefreshingSitemap(false);
    }
  };

  // 批次填寫產品頁面SEO
  const handleBatchFillProductSeo = async () => {
    setFilling(true);
    try {
      const result = await batchFillProductSeo.mutateAsync();
      await refetch();
      toast.success(`✅ 批次填寫完成！更新了 ${result.updatedCount} 個產品頁面的SEO內容`);
    } catch (error) {
      console.error("Batch fill error:", error);
      toast.error("批次填寫失敗");
    } finally {
      setFilling(false);
    }
  };

  // 單頁 AI 翻譯
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
      // 翻譯 title
      const titleTranslations = await translate.mutateAsync({
        text: masterTitle,
        sourceLang: "zh-TW",
      });

      // 翻譯 description (如果有)
      let descTranslations: any = {};
      if (masterDescription && masterDescription.trim() !== "") {
        descTranslations = await translate.mutateAsync({
          text: masterDescription,
          sourceLang: "zh-TW",
        });
      }

      // 翻譯 keywords (如果有)
      let keywordsTranslations: any = {};
      if (masterKeywords && masterKeywords.trim() !== "") {
        keywordsTranslations = await translate.mutateAsync({
          text: masterKeywords,
          sourceLang: "zh-TW",
        });
      }

      // 更新所有語言的SEO設定
      let successCount = 0;
      for (const lang of LANGUAGES.slice(1)) {
        try {
          await updateSetting.mutateAsync({
            page: selectedPage,
            language: lang.code,
            title: titleTranslations[lang.code] || masterTitle,
            description: descTranslations[lang.code] || masterDescription || "",
            keywords: keywordsTranslations[lang.code] || masterKeywords || "",
          });
          successCount++;
        } catch (err) {
          console.error(`Failed to update ${lang.code}:`, err);
        }
      }

      await refetch();
      toast.success(`✨ AI 翻譯完成！成功: ${successCount}/${LANGUAGES.length - 1}`);
    } catch (error) {
      console.error("Translation error:", error);
      toast.error("翻譯失敗,請稍後再試");
    } finally {
      setTranslating(false);
    }
  };

  // 批次 AI 翻譯所有頁面
  const handleBatchTranslate = async () => {
    if (!settings) {
      toast.error("正在載入資料,請稍後再試");
      return;
    }

    setBatchTranslating(true);
    try {
      // 獲取所有繁中頁面
      const zhTWPages = settings.filter(s => s.language === "zh-TW" && s.title && s.title.trim() !== "");
      
      let totalSuccess = 0;
      let totalPages = zhTWPages.length;
      
      // 初始化進度
      setBatchProgress({ current: 0, total: totalPages });

      for (let i = 0; i < zhTWPages.length; i++) {
        const page = zhTWPages[i];
        try {
          // 翻譯 title
          const titleTranslations = await translate.mutateAsync({
            text: page.title,
            sourceLang: "zh-TW",
          });

          // 翻譯 description (如果有)
          let descTranslations: any = {};
          if (page.description && page.description.trim() !== "") {
            descTranslations = await translate.mutateAsync({
              text: page.description,
              sourceLang: "zh-TW",
            });
          }

          // 翻譯 keywords (如果有)
          let keywordsTranslations: any = {};
          if (page.keywords && page.keywords.trim() !== "") {
            keywordsTranslations = await translate.mutateAsync({
              text: page.keywords,
              sourceLang: "zh-TW",
            });
          }

          // 更新所有語言
          for (const lang of LANGUAGES.slice(1)) {
            await updateSetting.mutateAsync({
              page: page.page,
              language: lang.code,
              title: titleTranslations[lang.code] || page.title,
              description: descTranslations[lang.code] || page.description || "",
              keywords: keywordsTranslations[lang.code] || page.keywords || "",
            });
          }
          
          totalSuccess++;
          
          // 更新進度
          setBatchProgress({ current: i + 1, total: totalPages });
        } catch (error) {
          console.error(`Failed to translate page ${page.page}:`, error);
          // 即使失敗也要更新進度
          setBatchProgress({ current: i + 1, total: totalPages });
        }
      }

      await refetch();
      toast.success(`🎉 批次翻譯完成！成功: ${totalSuccess}/${totalPages}`);
    } catch (error) {
      console.error("Batch translation error:", error);
      toast.error("批次翻譯失敗");
    } finally {
      setBatchTranslating(false);
      // 重置進度
      setBatchProgress({ current: 0, total: 0 });
    }
  };

  // 儲存所有語言的 SEO 設定
  const handleSave = async () => {
    setSaving(true);
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
      toast.success("✅ SEO 設定已儲存");
    } catch (error) {
      console.error("Save error:", error);
      toast.error("儲存失敗");
    } finally {
      setSaving(false);
    }
  };

  // 篩選頁面
  const filteredPages = pages.filter(page => 
    page.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    page.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // 按分類分組
  const pagesByCategory = filteredPages.reduce((acc, page) => {
    let category = "其他頁面";
    
    if (page.id.startsWith("product-")) {
      category = "產品頁面";
    } else if (["home", "about"].includes(page.id)) {
      category = "主要頁面";
    } else if (["where-to-buy", "service-centers", "support", "faq"].includes(page.id)) {
      category = "支援頁面";
    } else if (["profile", "warranty-registration", "support-ticket"].includes(page.id)) {
      category = "用戶頁面";
    }
    
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(page);
    return acc;
  }, {} as Record<string, typeof pages>);

  const [location] = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNav />
      <AdminSidebar currentPath={location} />
      
      <div className="ml-64 pt-20 p-8">
        {/* SEO 狀態面板 */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">總連結數</p>
                <p className="text-2xl font-bold text-gray-900">{sitemapStats?.totalUrls || 0}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Link2 className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">靜態頁面</p>
                <p className="text-2xl font-bold text-gray-900">{sitemapStats?.staticUrls || 0}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">產品頁面</p>
                <p className="text-2xl font-bold text-gray-900">{sitemapStats?.productUrls || 0}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">支援語系</p>
                <p className="text-2xl font-bold text-gray-900">{sitemapStats?.locales || 0}</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Globe className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* 頁首 */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">SEO 管理</h1>
              <p className="text-gray-600 mt-1 text-sm">管理網站各頁面的 SEO 設定,支援 AI 一鍵多國語言翻譯</p>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleRefreshSitemap}
                disabled={refreshingSitemap || isLoading}
                variant="outline"
                className="border-green-600 text-green-600 hover:bg-green-50"
              >
                {refreshingSitemap ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    更新中...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    立即更新 Sitemap
                  </>
                )}
              </Button>
              <Button
                onClick={handleBatchFillProductSeo}
                disabled={filling || isLoading}
                variant="outline"
                className="border-blue-600 text-blue-600 hover:bg-blue-50"
              >
                {filling ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    填寫中...
                  </>
                ) : (
                  <>
                    <FileText className="w-4 h-4 mr-2" />
                    批次填寫產品SEO
                  </>
                )}
              </Button>
              <Button
                onClick={handleBatchTranslate}
                disabled={batchTranslating || isLoading}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700"
              >
                {batchTranslating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    翻譯中 ({batchProgress.current}/{batchProgress.total})
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    批次 AI 翻譯
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-4">
          {/* 左側:頁面列表 */}
          <div className="col-span-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">頁面列表</h3>
                <Button
                  onClick={handleSyncPages}
                  disabled={syncing}
                  size="sm"
                  variant="outline"
                  className="text-xs"
                >
                  {syncing ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : (
                    <RefreshCw className="w-3 h-3" />
                  )}
                </Button>
              </div>
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="搜尋頁面..."
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-3">
                {Object.entries(pagesByCategory).map(([category, categoryPages]) => (
                  <div key={category}>
                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 px-1">
                      {category}
                    </h4>
                    <div className="space-y-1">
                      {categoryPages.map((page) => {
                        const zhTWSetting = settings?.find((s) => s.page === page.id && s.language === "zh-TW");
                        const hasTranslations = LANGUAGES.slice(1).some((lang) => {
                          const setting = settings?.find((s) => s.page === page.id && s.language === lang.code);
                          return setting && setting.title;
                        });

                        return (
                          <Button
                            key={page.id}
                            onClick={() => setSelectedPage(page.id)}
                            variant={selectedPage === page.id ? "default" : "ghost"}
                            className="w-full justify-between text-left"
                          >
                            <span className="truncate">{page.name}</span>
                            <div className="flex items-center gap-1 ml-2">
                              {zhTWSetting && zhTWSetting.title && (
                                <span className="w-2 h-2 rounded-full bg-blue-500" title="繁中已設定" />
                              )}
                              {hasTranslations && (
                                <span className="w-2 h-2 rounded-full bg-green-500" title="已翻譯" />
                              )}
                            </div>
                          </Button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 右側:SEO 設定表單 */}
          <div className="col-span-8">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  {pages.find((p) => p.id === selectedPage)?.name || selectedPage}
                </h2>
                <div className="flex gap-2">
                  <Button
                    onClick={handleAITranslate}
                    disabled={translating || !formData["zh-TW"]?.title}
                    variant="outline"
                    className="border-purple-300 text-purple-700 hover:bg-purple-50"
                  >
                    {translating ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        翻譯中...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" />
                        AI 一鍵翻譯
                      </>
                    )}
                  </Button>
                  <Button onClick={handleSave} disabled={saving}>
                    {saving ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        儲存中...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        儲存
                      </>
                    )}
                  </Button>
                </div>
              </div>

              <Tabs defaultValue="zh-TW" className="w-full">
                <TabsList className="grid grid-cols-7 mb-6">
                  {LANGUAGES.map((lang) => (
                    <TabsTrigger key={lang.code} value={lang.code}>
                      {lang.flag} {lang.name}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {LANGUAGES.map((lang) => (
                  <TabsContent key={lang.code} value={lang.code} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        標題 (Title) <span className="text-red-500">*</span>
                      </label>
                      <Input
                        value={formData[lang.code]?.title || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            [lang.code]: { ...formData[lang.code], title: e.target.value },
                          })
                        }
                        placeholder={`輸入${lang.name}標題`}
                        className="w-full"
                      />
                      <p className="text-xs text-gray-500 mt-1">建議長度: 50-60 字元</p>
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
                            [lang.code]: { ...formData[lang.code], description: e.target.value },
                          })
                        }
                        rows={4}
                        className="w-full"
                      />
                      <p className="text-xs text-gray-500 mt-1">建議長度: 150-160 字元</p>
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
                            [lang.code]: { ...formData[lang.code], keywords: e.target.value },
                          })
                        }
                        placeholder={`輸入${lang.name}關鍵字 (用逗號分隔)`}
                        className="w-full"
                      />
                      <p className="text-xs text-gray-500 mt-1">用逗號分隔多個關鍵字</p>
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
