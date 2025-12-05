import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Pencil, Trash2, Plus, Download, Upload } from "lucide-react";
import { URL_PREFIX_MAP } from "@/lib/i18nHelper";

interface Job {
  id: number;
  jobId: string;
  title: string;
  department: string;
  location: string;
  country: string;
  description: string;
  requirements: string | null;
  isActive: number;
  postedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export default function AdminJobs() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);

  const { data: jobs, refetch } = trpc.admin.jobs.list.useQuery();
  const upsertMutation = trpc.admin.jobs.upsert.useMutation();
  const deleteMutation = trpc.admin.jobs.delete.useMutation();
  const exportCSVQuery = trpc.admin.jobs.exportCSV.useQuery(undefined, { enabled: false });
  const exportExcelQuery = trpc.admin.jobs.exportExcel.useQuery(undefined, { enabled: false });
  const importCSVMutation = trpc.admin.jobs.importCSV.useMutation();
  const importExcelMutation = trpc.admin.jobs.importExcel.useMutation();
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [importResult, setImportResult] = useState<{ successCount: number; errorCount: number; errors: string[] } | null>(null);

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    try {
      await upsertMutation.mutateAsync({
        id: editingJob?.id,
        jobId: formData.get("jobId") as string,
        title: formData.get("title") as string,
        department: formData.get("department") as string,
        location: formData.get("location") as string,
        country: formData.get("country") as string,
        description: formData.get("description") as string,
        requirements: formData.get("requirements") as string,
        isActive: formData.get("isActive") === "on" ? 1 : 0,
      });

      toast.success(editingJob ? "職缺已更新" : "職缺已新增");
      setIsDialogOpen(false);
      setEditingJob(null);
      refetch();
    } catch (error) {
      toast.error("操作失敗");
      console.error(error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("確定要刪除這個職缺嗎?")) return;

    try {
      await deleteMutation.mutateAsync({ id });
      toast.success("職缺已刪除");
      refetch();
    } catch (error) {
      toast.error("刪除失敗");
      console.error(error);
    }
  };

  const countryOptions = Object.entries(URL_PREFIX_MAP).map(([code, name]) => ({
    code,
    name,
  }));

  // 匯出 CSV
  const handleExportCSV = async () => {
    try {
      const result = await exportCSVQuery.refetch();
      if (!result.data) {
        toast.error("無法匯出資料");
        return;
      }

      const blob = new Blob([result.data.content], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = result.data.filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success("已匯出 CSV 檔案");
    } catch (error) {
      toast.error("匯出失敗");
      console.error(error);
    }
  };

  // 匯出 Excel
  const handleExportExcel = async () => {
    try {
      const result = await exportExcelQuery.refetch();
      if (!result.data) {
        toast.error("無法匯出資料");
        return;
      }

      // 將 base64 轉換為 Blob
      const byteCharacters = atob(result.data.content);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = result.data.filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success("已匯出 Excel 檔案");
    } catch (error) {
      toast.error("匯出失敗");
      console.error(error);
    }
  };

  // 匯入功能
  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      
      if (fileExtension === 'csv') {
        // 處理 CSV 檔案
        const text = await file.text();
        const result = await importCSVMutation.mutateAsync({ content: text });
        
        setImportResult(result);
        setImportDialogOpen(true);
        refetch();
        
        if (result.errorCount === 0) {
          toast.success(`成功匯入 ${result.successCount} 筆資料`);
        } else {
          toast.warning(`匯入完成：成功 ${result.successCount} 筆，失敗 ${result.errorCount} 筆`);
        }
      } else if (fileExtension === 'xlsx' || fileExtension === 'xls') {
        // 處理 Excel 檔案
        const arrayBuffer = await file.arrayBuffer();
        const base64 = btoa(
          new Uint8Array(arrayBuffer).reduce(
            (data, byte) => data + String.fromCharCode(byte),
            ''
          )
        );
        
        const result = await importExcelMutation.mutateAsync({ content: base64 });
        
        setImportResult(result);
        setImportDialogOpen(true);
        refetch();
        
        if (result.errorCount === 0) {
          toast.success(`成功匯入 ${result.successCount} 筆資料`);
        } else {
          toast.warning(`匯入完成：成功 ${result.successCount} 筆，失敗 ${result.errorCount} 筆`);
        }
      } else {
        toast.error('不支援的檔案格式，請使用 CSV 或 Excel 檔案');
        return;
      }
      
      // 清除檔案輸入
      e.target.value = '';
    } catch (error: any) {
      toast.error(error.message || '匯入失敗');
      console.error(error);
    }
  };

  // 舊的 JSON 匯入功能 (保留但不使用)
  const handleImportJSON_OLD = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const importedJobs = JSON.parse(text);

      // 驗證格式
      if (!Array.isArray(importedJobs)) {
        toast.error("檔案格式錯誤：必須是 JSON 陣列");
        return;
      }

      // 驗證必要欄位
      const requiredFields = ["title", "department", "country", "description", "requirements", "isActive"];
      for (const job of importedJobs) {
        for (const field of requiredFields) {
          if (!(field in job)) {
            toast.error(`檔案格式錯誤：缺少必要欄位 "${field}"`);
            return;
          }
        }
      }

      const confirmed = confirm(
        `確定要匯入 ${importedJobs.length} 個職缺嗎？`
      );
      if (!confirmed) return;

      // OLD JSON import code removed
    } catch (error) {
      toast.error("匯入失敗：" + (error instanceof Error ? error.message : "未知錯誤"));
      console.error(error);
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">職缺管理</h1>
        <div className="flex gap-2">
          {/* 匯出按鈕 */}
          <Select onValueChange={(value) => {
            if (value === 'csv') handleExportCSV();
            else if (value === 'excel') handleExportExcel();
          }}>
            <SelectTrigger className="w-36">
              <Download className="w-4 h-4 mr-2" />
              <SelectValue placeholder="匯出" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="csv">匯出 CSV</SelectItem>
              <SelectItem value="excel">匯出 Excel</SelectItem>
            </SelectContent>
          </Select>

          {/* 匯入按鈕 */}
          <div className="relative">
            <input
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={handleImport}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              id="import-file"
            />
            <Button variant="outline" asChild>
              <label htmlFor="import-file" className="cursor-pointer">
                <Upload className="w-4 h-4 mr-2" />
                匯入 CSV/Excel
              </label>
            </Button>
          </div>

          {/* 新增按鈕 */}
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setEditingJob(null)}>
                <Plus className="w-4 h-4 mr-2" />
                新增職缺
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingJob ? "編輯職缺" : "新增職缺"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="jobId">職位編號 *</Label>
                  <Input
                    id="jobId"
                    name="jobId"
                    defaultValue={editingJob?.jobId}
                    placeholder="例如: ENG-TW-001"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="title">職位名稱 *</Label>
                  <Input
                    id="title"
                    name="title"
                    defaultValue={editingJob?.title}
                    placeholder="例如: 資深前端工程師"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="department">部門 *</Label>
                  <Input
                    id="department"
                    name="department"
                    defaultValue={editingJob?.department}
                    placeholder="例如: 硬體研發"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="location">城市 *</Label>
                  <Input
                    id="location"
                    name="location"
                    defaultValue={editingJob?.location}
                    placeholder="例如: Taipei"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="country">國家 *</Label>
                <Select
                  name="country"
                  defaultValue={editingJob?.country || "tw"}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="選擇國家" />
                  </SelectTrigger>
                  <SelectContent>
                    {countryOptions.map((option) => (
                      <SelectItem key={option.code} value={option.code}>
                        {option.name} ({option.code.toUpperCase()})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="description">職位描述 *</Label>
                <Textarea
                  id="description"
                  name="description"
                  defaultValue={editingJob?.description}
                  placeholder="支援 HTML 標籤,例如: <ul><li>項目1</li></ul>"
                  rows={6}
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  支援 HTML 標籤 (例如: &lt;p&gt;, &lt;ul&gt;, &lt;li&gt;, &lt;strong&gt;)
                </p>
              </div>

              <div>
                <Label htmlFor="requirements">任職要求</Label>
                <Textarea
                  id="requirements"
                  name="requirements"
                  defaultValue={editingJob?.requirements || ""}
                  placeholder="支援 HTML 標籤,例如: <ul><li>要求1</li></ul>"
                  rows={6}
                />
                <p className="text-xs text-gray-500 mt-1">
                  支援 HTML 標籤 (例如: &lt;p&gt;, &lt;ul&gt;, &lt;li&gt;, &lt;strong&gt;)
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="isActive"
                  name="isActive"
                  defaultChecked={editingJob?.isActive === 1}
                />
                <Label htmlFor="isActive">上架 (顯示在前台)</Label>
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsDialogOpen(false);
                    setEditingJob(null);
                  }}
                >
                  取消
                </Button>
                <Button type="submit">儲存</Button>
              </div>
            </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card className="p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-3">職位編號</th>
                <th className="text-left p-3">職位名稱</th>
                <th className="text-left p-3">部門</th>
                <th className="text-left p-3">地點</th>
                <th className="text-left p-3">國家</th>
                <th className="text-left p-3">狀態</th>
                <th className="text-left p-3">發布日期</th>
                <th className="text-right p-3">操作</th>
              </tr>
            </thead>
            <tbody>
              {jobs?.map((job) => (
                <tr key={job.id} className="border-b hover:bg-gray-50">
                  <td className="p-3 font-mono text-sm">{job.jobId}</td>
                  <td className="p-3 font-medium">{job.title}</td>
                  <td className="p-3">{job.department}</td>
                  <td className="p-3">{job.location}</td>
                  <td className="p-3">{job.country.toUpperCase()}</td>
                  <td className="p-3">
                    <span
                      className={`inline-block px-2 py-1 text-xs rounded ${
                        job.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {job.isActive ? "上架" : "下架"}
                    </span>
                  </td>
                  <td className="p-3 text-sm text-gray-600">
                    {new Date(job.postedAt).toLocaleDateString("zh-TW")}
                  </td>
                  <td className="p-3">
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setEditingJob(job);
                          setIsDialogOpen(true);
                        }}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(job.id)}
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {!jobs || jobs.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-gray-500">
                    尚無職缺資料
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </Card>

      {/* 匯入結果 Dialog */}
      <Dialog open={importDialogOpen} onOpenChange={setImportDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>匯入結果</DialogTitle>
          </DialogHeader>
          {importResult && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Card className="p-4 bg-green-50">
                  <div className="text-sm text-gray-600">成功</div>
                  <div className="text-2xl font-bold text-green-600">
                    {importResult.successCount}
                  </div>
                </Card>
                <Card className="p-4 bg-red-50">
                  <div className="text-sm text-gray-600">失敗</div>
                  <div className="text-2xl font-bold text-red-600">
                    {importResult.errorCount}
                  </div>
                </Card>
              </div>
              
              {importResult.errors && importResult.errors.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">錯誤詳情：</h3>
                  <div className="bg-red-50 p-4 rounded-lg max-h-64 overflow-y-auto">
                    <ul className="list-disc list-inside space-y-1 text-sm text-red-800">
                      {importResult.errors.map((error, index) => (
                        <li key={index}>{error}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
              
              <div className="flex justify-end">
                <Button onClick={() => setImportDialogOpen(false)}>關閉</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
