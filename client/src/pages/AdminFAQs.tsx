import { useState } from "react";
import { useLocation } from "wouter";
import AdminNav, { AdminSidebar } from "@/components/AdminNav";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Trash2, Plus, Edit2, Sparkles, Download, Upload } from "lucide-react";
import { toast } from "sonner";
import SEOHead from "@/components/seo/SEOHead";

// 支援的語言列表
const LANGUAGES = [
  { code: 'zh-TW', name: '繁體中文', flag: '🇹🇼' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'ko', name: '한국어', flag: '🇰🇷' },
  { code: 'zh-CN', name: '简体中文', flag: '🇨🇳' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
];

type MultiLangContent = Record<string, string>;

interface FormData {
  category: string;
  order: number;
  relatedProducts: string[];
  question: MultiLangContent;
  answer: MultiLangContent;
}

export default function AdminFAQs() {
  const [location] = useLocation();
  const { isLoading } = useAdminAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [currentLang, setCurrentLang] = useState('zh-TW');
  const [formData, setFormData] = useState<FormData>({
    category: "",
    order: 0,
    relatedProducts: [],
    question: { 'zh-TW': '' },
    answer: { 'zh-TW': '' },
  });

  const { data: faqs, refetch } = trpc.faqs.adminList.useQuery();
  // 只查詢有產品頁面的產品 (slug 不為 null)
  const { data: productModels } = trpc.admin.productModels.list.useQuery({ hasPage: true });
  const upsertMutation = trpc.faqs.upsert.useMutation();
  const deleteMutation = trpc.faqs.delete.useMutation();
  const translateMutation = trpc.faqs.translate.useMutation();
  const exportQuery = trpc.faqs.export.useQuery(undefined, { enabled: false });
  const importMutation = trpc.faqs.import.useMutation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <SEOHead pageKey="adminFAQs" />
        <div className="text-gray-600">載入中...</div>
      </div>
    );
  }

  const resetForm = () => {
    setFormData({
      category: "",
      order: 0,
      relatedProducts: [],
      question: { 'zh-TW': '' },
      answer: { 'zh-TW': '' },
    });
    setEditingId(null);
    setCurrentLang('zh-TW');
  };

  const handleAdd = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const handleEdit = (faq: any) => {
    setEditingId(faq.id);
    setFormData({
      category: faq.category || "",
      order: faq.order || 0,
      relatedProducts: (faq.relatedProducts as string[]) || [],
      question: (faq.question as MultiLangContent) || { 'zh-TW': '' },
      answer: (faq.answer as MultiLangContent) || { 'zh-TW': '' },
    });
    setCurrentLang('zh-TW');
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    // 驗證繁體中文必填
    if (!formData.question['zh-TW']?.trim() || !formData.answer['zh-TW']?.trim()) {
      toast.error("請填寫繁體中文的問題和答案");
      return;
    }

    if (!formData.category.trim()) {
      toast.error("請填寫分類");
      return;
    }

    try {
      await upsertMutation.mutateAsync({
        id: editingId || undefined,
        category: formData.category,
        relatedProducts: formData.relatedProducts.length > 0 ? formData.relatedProducts : null,
        question: formData.question,
        answer: formData.answer,
        order: formData.order,
        isActive: 1,
      });
      
      toast.success(editingId ? "FAQ 已更新" : "FAQ 已新增");
      setIsDialogOpen(false);
      resetForm();
      refetch();
    } catch (error) {
      toast.error("儲存失敗");
      console.error(error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("確定要刪除此 FAQ 嗎?")) return;

    try {
      await deleteMutation.mutateAsync({ id });
      toast.success("FAQ 已刪除");
      refetch();
    } catch (error) {
      toast.error("刪除失敗");
    }
  };

  const handleTranslate = async () => {
    const sourceQuestion = formData.question['zh-TW'];
    const sourceAnswer = formData.answer['zh-TW'];

    if (!sourceQuestion || !sourceAnswer) {
      toast.error("請先填寫繁體中文內容");
      return;
    }

    if (currentLang === 'zh-TW') {
      toast.error("請切換到其他語言 Tab 再進行翻譯");
      return;
    }

    try {
      toast.info("正在翻譯中...");
      const result = await translateMutation.mutateAsync({
        question: sourceQuestion,
        answer: sourceAnswer,
        targetLang: currentLang,
      });

      setFormData({
        ...formData,
        question: { ...formData.question, [currentLang]: result.question },
        answer: { ...formData.answer, [currentLang]: result.answer },
      });

      toast.success("翻譯完成");
    } catch (error) {
      toast.error("翻譯失敗");
    }
  };

  const handleExport = async () => {
    try {
      const data = await exportQuery.refetch();
      if (!data.data) {
        toast.error("匯出失敗");
        return;
      }

      const blob = new Blob([JSON.stringify(data.data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `faqs-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success("匯出成功");
    } catch (error) {
      toast.error("匯出失敗");
    }
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const data = JSON.parse(text);

      if (!Array.isArray(data)) {
        toast.error("無效的 JSON 格式");
        return;
      }

      await importMutation.mutateAsync(data);
      toast.success(`匯入成功，共 ${data.length} 筆資料`);
      refetch();
      
      // 清除 input value 以便下次可以選擇同一檔案
      e.target.value = '';
    } catch (error) {
      toast.error("匯入失敗：" + (error instanceof Error ? error.message : '無效的檔案格式'));
    }
  };

  const toggleProduct = (slug: string) => {
    setFormData(prev => ({
      ...prev,
      relatedProducts: prev.relatedProducts.includes(slug)
        ? prev.relatedProducts.filter(p => p !== slug)
        : [...prev.relatedProducts, slug]
    }));
  };

  // 取得翻譯狀態
  const getTranslationStatus = (content: MultiLangContent) => {
    return LANGUAGES.map(lang => ({
      ...lang,
      hasContent: !!content[lang.code]?.trim()
    }));
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminNav />
      <AdminSidebar currentPath={location} />
      <SEOHead pageKey="adminFAQs" />

      <main className="ml-64 pt-24 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-900">FAQ 管理</h1>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleExport}>
                <Download className="w-4 h-4 mr-2" />
                匯出 JSON
              </Button>
              <Button variant="outline" onClick={() => document.getElementById('import-file')?.click()}>
                <Upload className="w-4 h-4 mr-2" />
                匯入 JSON
              </Button>
              <input
                id="import-file"
                type="file"
                accept=".json"
                className="hidden"
                onChange={handleImport}
              />
              <Button onClick={handleAdd}>
                <Plus className="w-4 h-4 mr-2" />
                新增 FAQ
              </Button>
            </div>
          </div>

          {/* FAQ 列表 */}
          <div className="space-y-4">
            {faqs?.map((faq) => {
              const questionObj = faq.question as MultiLangContent;
              const answerObj = faq.answer as MultiLangContent;
              const products = (faq.relatedProducts as string[]) || [];
              const translationStatus = getTranslationStatus(questionObj);

              return (
                <div key={faq.id} className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-3">
                        <Badge variant="outline">{faq.category}</Badge>
                        {products.length > 0 ? (
                          products.map(slug => (
                            <Badge key={slug} className="bg-blue-100 text-blue-800">
                              {productModels?.find(p => p.slug === slug)?.name || slug}
                            </Badge>
                          ))
                        ) : (
                          <Badge className="bg-gray-100 text-gray-600">通用</Badge>
                        )}
                      </div>
                      
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {questionObj['zh-TW'] || '(無繁體中文內容)'}
                      </h3>
                      
                      <p className="text-gray-600 whitespace-pre-wrap mb-3">
                        {answerObj['zh-TW'] || '(無繁體中文內容)'}
                      </p>

                      {/* 翻譯狀態指示器 */}
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">翻譯狀態:</span>
                        {translationStatus.map(lang => (
                          <span
                            key={lang.code}
                            className={`text-lg ${lang.hasContent ? 'opacity-100' : 'opacity-30'}`}
                            title={`${lang.name}: ${lang.hasContent ? '已翻譯' : '未翻譯'}`}
                          >
                            {lang.flag}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex gap-2 ml-4">
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(faq)}>
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(faq.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
            
            {(!faqs || faqs.length === 0) && (
              <div className="bg-white rounded-lg shadow p-12 text-center text-gray-500">
                尚無 FAQ,點擊上方按鈕新增
              </div>
            )}
          </div>
        </div>
      </main>

      {/* 編輯 Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingId ? "編輯 FAQ" : "新增 FAQ"}</DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* 通用設定區 */}
            <div className="space-y-4 border-b pb-6">
              <h3 className="font-semibold text-gray-900">通用設定</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">分類 *</Label>
                  <Input
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="例如: 保固、使用、APP"
                  />
                </div>
                <div>
                  <Label htmlFor="order">排序</Label>
                  <Input
                    id="order"
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>

              <div>
                <Label>關聯產品 (多選)</Label>
                <div className="mt-2 space-y-2">
                  {productModels?.map((product) => (
                    <div key={product.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`product-${product.id}`}
                        checked={formData.relatedProducts.includes(product.slug)}
                        onCheckedChange={() => toggleProduct(product.slug)}
                      />
                      <label
                        htmlFor={`product-${product.id}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                      >
                        {product.name}
                      </label>
                    </div>
                  ))}
                  {(!productModels || productModels.length === 0) && (
                    <p className="text-sm text-gray-500">尚無產品型號</p>
                  )}
                  <p className="text-xs text-gray-500 mt-2">
                    * 不勾選任何產品代表「通用問題」,會顯示在所有產品頁面
                  </p>
                </div>
              </div>
            </div>

            {/* 多語言內容區 */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">多語言內容</h3>
              
              <Tabs value={currentLang} onValueChange={setCurrentLang}>
                <TabsList className="grid grid-cols-7 w-full">
                  {LANGUAGES.map(lang => (
                    <TabsTrigger key={lang.code} value={lang.code}>
                      {lang.flag} {lang.name}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {LANGUAGES.map(lang => (
                  <TabsContent key={lang.code} value={lang.code} className="space-y-4">
                    {lang.code !== 'zh-TW' && (
                      <div className="flex justify-end">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleTranslate}
                          disabled={translateMutation.isPending}
                        >
                          <Sparkles className="w-4 h-4 mr-2" />
                          AI 翻譯 (從繁體中文)
                        </Button>
                      </div>
                    )}

                    <div>
                      <Label htmlFor={`question-${lang.code}`}>
                        問題 {lang.code === 'zh-TW' && '*'}
                      </Label>
                      <Input
                        id={`question-${lang.code}`}
                        value={formData.question[lang.code] || ''}
                        onChange={(e) => setFormData({
                          ...formData,
                          question: { ...formData.question, [lang.code]: e.target.value }
                        })}
                        placeholder={`輸入${lang.name}問題`}
                      />
                    </div>

                    <div>
                      <Label htmlFor={`answer-${lang.code}`}>
                        答案 {lang.code === 'zh-TW' && '*'}
                      </Label>
                      <Textarea
                        id={`answer-${lang.code}`}
                        value={formData.answer[lang.code] || ''}
                        onChange={(e) => setFormData({
                          ...formData,
                          answer: { ...formData.answer, [lang.code]: e.target.value }
                        })}
                        placeholder={`輸入${lang.name}答案`}
                        rows={6}
                      />
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </div>

            {/* 操作按鈕 */}
            <div className="flex gap-4 pt-4 border-t">
              <Button onClick={handleSave} disabled={upsertMutation.isPending}>
                {upsertMutation.isPending ? "儲存中..." : (editingId ? "更新" : "新增")}
              </Button>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                取消
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
