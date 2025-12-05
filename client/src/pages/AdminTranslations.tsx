import { useState, useEffect, useRef } from "react";
import { useLocation, useSearch } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { Loader2, Sparkles, Save, CheckCircle2, AlertCircle, ScanSearch } from "lucide-react";
import AdminNav, { AdminSidebar } from "@/components/AdminNav";

const LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'ko', name: '한국어', flag: '🇰🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'zh-CN', name: '简体中文', flag: '🇨🇳' },
];

export default function AdminTranslations() {
  const [location] = useLocation();
  const search = useSearch();
  const searchParams = new URLSearchParams(search);
  
  // 優先從 URL 讀取 lang 參數，沒有則預設 'en'
  const initialLang = searchParams.get("lang") || "en";
  const [selectedLang, setSelectedLang] = useState(initialLang);
  const [editedValues, setEditedValues] = useState<Record<string, string>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [showOnlyMissing, setShowOnlyMissing] = useState(false);
  const [translationProgress, setTranslationProgress] = useState({ current: 0, total: 0 });
  const [showProgress, setShowProgress] = useState(false);
  const [progressVisible, setProgressVisible] = useState(false);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);

  // Fetch translations
  const { data, isLoading, refetch } = trpc.admin.translations.list.useQuery({ lang: selectedLang });
  
  // Mutations
  const batchUpdateMutation = trpc.admin.translations.batchUpdate.useMutation({
    onSuccess: (result) => {
      toast.success(`已成功儲存 ${result.updatedCount} 個翻譯`);
      refetch();
      setEditedValues({});
    },
    onError: (error) => {
      toast.error(`儲存失敗: ${error.message}`);
    },
  });

  const extractMutation = trpc.admin.translations.extractFromSource.useMutation({
    onSuccess: (result) => {
      toast.success(`成功提取 ${result.extractedCount} 個新翻譯條目`);
      refetch();
    },
    onError: (error) => {
      toast.error(`提取失敗: ${error.message}`);
    },
  });

  const autoFillMutation = trpc.admin.translations.autoFill.useMutation({
    onMutate: () => {
      setShowProgress(true);
      setProgressVisible(true);
    },
    onSuccess: (result) => {
      toast.success(`AI翻譯完成！已翻譯 ${result.translatedCount} 個條目`);
      // 設定進度為100%，顯示完成狀態
      setTranslationProgress(prev => ({ current: prev.total, total: prev.total }));
      
      // 延遲2秒後才隱藏進度條和重置狀態
      setTimeout(() => {
        setProgressVisible(false);
        setShowProgress(false);
        setTranslationProgress({ current: 0, total: 0 });
        setEditedValues({});
        setSelectedKeys([]); // 清空勾選
        refetch();
      }, 2000);
    },
    onError: (error) => {
      toast.error(`AI翻譯失敗: ${error.message}`);
      setProgressVisible(false);
      setShowProgress(false);
      setTranslationProgress({ current: 0, total: 0 });
    },
  });

  // Simulate progress updates during AI translation
  useEffect(() => {
    if (autoFillMutation.isPending && data && data.missingCount > 0) {
      setTranslationProgress({ current: 0, total: data.missingCount });
      
      // Simulate progress updates
      const interval = setInterval(() => {
        setTranslationProgress(prev => {
          if (prev.current >= prev.total) {
            clearInterval(interval);
            return prev;
          }
          // Update progress every 2 seconds (10 items per chunk, ~2s per chunk)
          return { ...prev, current: Math.min(prev.current + 10, prev.total) };
        });
      }, 2000);
      
      return () => clearInterval(interval);
    }
  }, [autoFillMutation.isPending, data]);

  const handleBatchSave = () => {
    const updates = Object.entries(editedValues)
      .filter(([_, value]) => value && value.trim() !== '')
      .map(([key, value]) => ({ key, value }));
    
    if (updates.length === 0) {
      toast.error('沒有需要儲存的修改');
      return;
    }

    batchUpdateMutation.mutate({
      lang: selectedLang,
      updates,
    });
  };

  const handleAutoFill = () => {
    if (!data) {
      toast.info('沒有翻譯資料');
      return;
    }

    // 檢查是否有勾選項目
    let keysToTranslate: string[] | undefined = undefined;
    let countToTranslate = data.missingCount;
    
    if (selectedKeys.length > 0) {
      // 只翻譯勾選的項目中缺漏的
      const missingInSelected = selectedKeys.filter(key => {
        const entry = data.entries.find(e => e.key === key);
        return entry && entry.missing;
      });
      if (missingInSelected.length === 0) {
        toast.info('選取的項目中沒有需要翻譯的條目');
        return;
      }
      keysToTranslate = missingInSelected;
      countToTranslate = keysToTranslate.length;
    } else if (data.missingCount === 0) {
      toast.info('沒有需要翻譯的條目');
      return;
    }

    const confirmed = confirm(
      `確定要使用AI自動翻譯 ${countToTranslate} 個缺漏的條目嗎？\n\n這可能需要幾分鐘時間。`
    );

    if (confirmed) {
      setTranslationProgress({ current: 0, total: countToTranslate });
      autoFillMutation.mutate({ 
        lang: selectedLang,
        keys: keysToTranslate 
      });
    }
  };

  const handleInputChange = (key: string, value: string) => {
    setEditedValues(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  // Filter entries based on search query and missing filter
  const filteredEntries = data?.entries.filter(entry => {
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesSearch = (
        entry.key.toLowerCase().includes(query) ||
        entry.zhTW.toLowerCase().includes(query) ||
        entry.target.toLowerCase().includes(query)
      );
      if (!matchesSearch) return false;
    }
    
    // Apply missing filter
    if (showOnlyMissing) {
      return !entry.target || entry.target.trim() === '';
    }
    
    return true;
  }) || [];

  // 同步 State 到 URL
  const handleTabChange = (value: string) => {
    setSelectedLang(value);
    
    // 更新 URL 但不刷新頁面
    const params = new URLSearchParams(window.location.search);
    params.set("lang", value);
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.pushState({}, "", newUrl);
  };

  const selectedLangInfo = LANGUAGES.find(l => l.code === selectedLang);

  return (
    <>
      <AdminNav />
      <AdminSidebar currentPath={location} />
      <div className="min-h-screen bg-gray-50 py-8 ml-64 mt-16">
        <div className="container mx-auto py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">AI 翻譯管理</h1>
            <p className="text-gray-600">管理網站多語言內容，使用AI自動補全缺漏的翻譯</p>
          </div>

        <Tabs value={selectedLang} onValueChange={handleTabChange} className="space-y-6">
          <TabsList className="grid grid-cols-6 w-full max-w-3xl">
            {LANGUAGES.map(lang => (
              <TabsTrigger key={lang.code} value={lang.code} className="flex items-center gap-2">
                <span>{lang.flag}</span>
                <span className="hidden sm:inline">{lang.name}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {LANGUAGES.map(lang => (
            <TabsContent key={lang.code} value={lang.code} className="space-y-6">
              {/* Dashboard Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-gray-600">總條目數</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{data?.totalCount || 0}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-gray-600">待翻譯</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-orange-600">{data?.missingCount || 0}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-gray-600">完成度</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-green-600">
                      {data ? Math.round(((data.totalCount - data.missingCount) / data.totalCount) * 100) : 0}%
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Extract & AI Auto-Fill Buttons */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ScanSearch className="w-5 h-5 text-blue-600" />
                      掃描並提取新文字
                    </CardTitle>
                    <CardDescription>
                      自動掃描程式碼中的硬編碼中文，提取到翻譯檔案中
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button
                      onClick={() => extractMutation.mutate()}
                      disabled={extractMutation.isPending}
                      className="w-full"
                      variant="outline"
                    >
                      {extractMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          掃描中...
                        </>
                      ) : (
                        <>
                          <ScanSearch className="mr-2 h-4 w-4" />
                          🔄 掃描並提取新文字
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                <CardHeader>
                  <CardTitle>AI 自動翻譯</CardTitle>
                  <CardDescription>
                    使用AI自動翻譯所有缺漏的條目，基於繁體中文原文進行翻譯
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button
                    onClick={handleAutoFill}
                    disabled={autoFillMutation.isPending || (data && data.missingCount === 0 && selectedKeys.length === 0)}
                    className="w-full"
                    size="lg"
                  >
                    {autoFillMutation.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        AI翻譯中...
                      </>
                    ) : selectedKeys.length > 0 ? (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" />
                        ✨ AI 翻譯選取的 {selectedKeys.length} 項
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" />
                        ✨ AI 一鍵補全所有缺漏
                      </>
                    )}
                  </Button>
                    
                    {/* 進度條容器：使用保留空間策略避免閃爍 */}
                    <div className={`space-y-2 transition-all duration-300 ${
                      progressVisible && translationProgress.total > 0
                        ? 'opacity-100 max-h-32'
                        : 'opacity-0 max-h-0 overflow-hidden'
                    }`}>
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <span>
                          {autoFillMutation.isPending ? "翻譯進度" : "✅ 翻譯完成"}
                        </span>
                        <span className="font-medium">
                          {Math.round((translationProgress.current / (translationProgress.total || 1)) * 100)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className={`h-2.5 rounded-full transition-all duration-500 ${
                            autoFillMutation.isPending 
                              ? "bg-gradient-to-r from-purple-600 to-blue-600" 
                              : "bg-green-500"
                          }`}
                          style={{
                            width: `${(translationProgress.current / (translationProgress.total || 1)) * 100}%`,
                          }}
                        />
                      </div>
                      <p className="text-xs text-gray-500">
                        {autoFillMutation.isPending 
                          ? "正在使用 AI 翻譯，請稍候..." 
                          : "已更新翻譯檔案，正在刷新列表..."}
                      </p>
                      {/* 翻譯完成提示 */}
                      {translationProgress.current === translationProgress.total && translationProgress.total > 0 && (
                        <div className="text-green-600 font-bold text-center animate-pulse pt-2">
                          🎉 翻譯完成！
                        </div>
                      )}
                    </div>
                  {data && data.missingCount === 0 && (
                    <p className="text-sm text-green-600 mt-2 flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" />
                      所有翻譯已完成！
                    </p>
                  )}
                </CardContent>
              </Card>
              </div>

              {/* Search */}
              <Card>
                <CardHeader>
                  <CardTitle>翻譯列表</CardTitle>
                  <CardDescription>
                    搜尋並編輯翻譯條目，未翻譯的條目會以黃色背景標示
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 mb-4">
                    <Input
                      placeholder="搜尋 Key 或內容..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="flex-1"
                    />
                    <label className="flex items-center gap-2 cursor-pointer whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={showOnlyMissing}
                        onChange={(e) => setShowOnlyMissing(e.target.checked)}
                        className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">只顯示待翻譯</span>
                    </label>
                    <Button
                      onClick={handleBatchSave}
                      disabled={batchUpdateMutation.isPending || Object.keys(editedValues).length === 0}
                      className="whitespace-nowrap"
                    >
                      {batchUpdateMutation.isPending ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          儲存中...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4 mr-2" />
                          儲存所有修改 ({Object.keys(editedValues).length})
                        </>
                      )}
                    </Button>
                  </div>

                  {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                      <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
                    </div>
                  ) : (
                    <div className="border rounded-lg overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-12">
                              <input
                                type="checkbox"
                                checked={filteredEntries.length > 0 && selectedKeys.length === filteredEntries.length}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSelectedKeys(filteredEntries.map(entry => entry.key));
                                  } else {
                                    setSelectedKeys([]);
                                  }
                                }}
                                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                              />
                            </TableHead>
                            <TableHead className="w-[300px]">Key</TableHead>
                            <TableHead>繁體中文</TableHead>
                            <TableHead>{selectedLangInfo?.name}</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredEntries.length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={4} className="text-center text-gray-500 py-8">
                                沒有找到符合的條目
                              </TableCell>
                            </TableRow>
                          ) : (
                            filteredEntries.map((entry) => (
                              <TableRow
                                key={entry.key}
                                className={entry.missing ? 'bg-yellow-50' : ''}
                              >
                                <TableCell>
                                  <input
                                    type="checkbox"
                                    checked={selectedKeys.includes(entry.key)}
                                    onChange={(e) => {
                                      if (e.target.checked) {
                                        setSelectedKeys(prev => [...prev, entry.key]);
                                      } else {
                                        setSelectedKeys(prev => prev.filter(k => k !== entry.key));
                                      }
                                    }}
                                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                  />
                                </TableCell>
                                <TableCell className="font-mono text-xs text-gray-600">
                                  {entry.key}
                                  {entry.missing && (
                                    <AlertCircle className="w-4 h-4 inline-block ml-2 text-orange-500" />
                                  )}
                                </TableCell>
                                <TableCell className="max-w-[300px] truncate">
                                  {entry.zhTW}
                                </TableCell>
                                <TableCell>
                                  <Input
                                    value={editedValues[entry.key] ?? entry.target}
                                    onChange={(e) => handleInputChange(entry.key, e.target.value)}
                                    placeholder={entry.missing ? '待翻譯...' : ''}
                                    className={entry.missing ? 'border-orange-300' : ''}
                                  />
                                </TableCell>
                              </TableRow>
                            ))
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  )}

                  {filteredEntries.length > 0 && (
                    <p className="text-sm text-gray-500 mt-4">
                      顯示 {filteredEntries.length} / {data?.totalCount || 0} 個條目
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
        </div>
      </div>
    </>
  );
}
