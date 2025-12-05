import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import AdminNav, { AdminSidebar } from "@/components/AdminNav";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import SEOHead from "@/components/seo/SEOHead";

// 資料庫 SQL 匯出按鈕組件
function ExportDatabaseButton() {
  const [isExporting, setIsExporting] = useState(false);
  const exportMutation = trpc.backup.exportDatabaseSQL.useMutation();

  const handleExport = async () => {
    try {
      setIsExporting(true);
      toast.info("正在匯出資料庫...");

      const result = await exportMutation.mutateAsync();

      // 建立下載連結
      const blob = new Blob([result.content], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = result.filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success(`資料庫匯出完成！共 ${result.recordCount} 筆記錄`);
    } catch (error) {
      toast.error("資料庫匯出失敗：" + (error instanceof Error ? error.message : "未知錯誤"));
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Button onClick={handleExport} disabled={isExporting} variant="outline" className="w-full">
      {isExporting ? (
        <>
          <span className="animate-spin mr-2">⏳</span>
          正在匯出資料庫...
        </>
      ) : (
        "🗄️ 匯出資料庫 SQL"
      )}
    </Button>
  );
}

// 程式碼下載按鈕組件
function DownloadCodeButton() {
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState<string>("");
  const [taskId, setTaskId] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const startDownloadMutation = trpc.backup.startDownloadCode.useMutation();
  const downloadFileMutation = trpc.backup.downloadCodeFile.useMutation();

  // 輪詢進度
  const { data: progressData } = trpc.backup.getDownloadProgress.useQuery(
    { taskId: taskId || "" },
    {
      enabled: !!taskId && isDownloading,
      refetchInterval: 500,
    }
  );

  // 清理任務
  const clearTaskMutation = trpc.backup.clearDownloadTask.useMutation();

  // 監聽進度更新
  useEffect(() => {
    if (progressData) {
      setProgress(progressData.progress);
      setStage(progressData.message);

      // 如果壓縮完成,下載檔案
      if (progressData.stage === "completed" && progressData.result) {
        const result = progressData.result;

        // 使用新的串流下載 API
        (async () => {
          try {
            setStage("正在下載檔案...");
            const downloadResult = await downloadFileMutation.mutateAsync({
              filePath: result.filePath,
            });

            // 將 Base64 轉換為 Blob
            const binaryString = atob(downloadResult.content);
            const bytes = new Uint8Array(binaryString.length);
            for (let i = 0; i < binaryString.length; i++) {
              bytes[i] = binaryString.charCodeAt(i);
            }
            const blob = new Blob([bytes], { type: "application/zip" });

            // 建立下載連結
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = result.filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            toast.success(`程式碼下載完成！檔案大小: ${result.size}`);

            // 清理狀態
            if (taskId) {
              clearTaskMutation.mutate({ taskId });
            }
            setIsDownloading(false);
            setTaskId(null);
            setProgress(0);
            setStage("");
          } catch (error) {
            toast.error("檔案下載失敗：" + (error instanceof Error ? error.message : "未知錯誤"));
            setIsDownloading(false);
            setTaskId(null);
            setProgress(0);
            setStage("");
          }
        })();
      }

      // 如果錯誤
      if (progressData.stage === "error") {
        toast.error(progressData.message);
        if (taskId) {
          clearTaskMutation.mutate({ taskId });
        }
        setIsDownloading(false);
        setTaskId(null);
        setProgress(0);
        setStage("");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [progressData]);

  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      setProgress(0);
      setStage("正在啟動下載任務...");

      const result = await startDownloadMutation.mutateAsync();
      setTaskId(result.taskId);
    } catch (error) {
      toast.error("啟動下載失敗：" + (error instanceof Error ? error.message : "未知錯誤"));
      setIsDownloading(false);
      setProgress(0);
      setStage("");
    }
  };

  return (
    <div className="space-y-3">
      <Button onClick={handleDownload} disabled={isDownloading} variant="outline" className="w-full">
        {isDownloading ? (
          <>
            <span className="animate-spin mr-2">⏳</span>
            正在生成壓縮包... {progress}%
          </>
        ) : (
          "💾 下載專案程式碼"
        )}
      </Button>

      {isDownloading && (
        <div className="space-y-2">
          {/* 進度條 */}
          <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* 進度文字 */}
          <p className="text-sm text-gray-600 text-center">{stage}</p>
        </div>
      )}
    </div>
  );
}

// 完整備份按鈕組件 (程式碼 + 資料庫)
function FullBackupButton() {
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState<string>("");
  const [taskId, setTaskId] = useState<string | null>(null);
  const [isBackingUp, setIsBackingUp] = useState(false);

  const startBackupMutation = trpc.backup.startFullBackup.useMutation();

  // 輪詢進度
  const { data: progressData } = trpc.backup.getDownloadProgress.useQuery(
    { taskId: taskId || "" },
    {
      enabled: !!taskId && isBackingUp,
      refetchInterval: 500,
    }
  );

  // 清理任務
  const clearTaskMutation = trpc.backup.clearDownloadTask.useMutation();

  // 監聽進度更新
  useEffect(() => {
    if (progressData) {
      setProgress(progressData.progress);
      setStage(progressData.message);

      // 如果備份完成,下載檔案
      if (progressData.stage === "completed" && progressData.result) {
        const result = progressData.result;

        (async () => {
          try {
            setStage("正在下載完整備份...");
            
            // 使用直接下載方式(避免 Base64 編碼問題)
            const downloadUrl = `/api/backup/download/${taskId}`;
            const a = document.createElement("a");
            a.href = downloadUrl;
            a.download = result.filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);

            toast.success(
              `完整備份下載完成！檔案大小: ${result.size}，資料庫記錄數: ${result.recordCount}`
            );

            // 清理狀態
            if (taskId) {
              clearTaskMutation.mutate({ taskId });
            }
            setIsBackingUp(false);
            setTaskId(null);
            setProgress(0);
            setStage("");
          } catch (error) {
            toast.error("檔案下載失敗：" + (error instanceof Error ? error.message : "未知錯誤"));
            setIsBackingUp(false);
            setTaskId(null);
            setProgress(0);
            setStage("");
          }
        })();
      }

      // 如果錯誤
      if (progressData.stage === "error") {
        toast.error(progressData.message);
        if (taskId) {
          clearTaskMutation.mutate({ taskId });
        }
        setIsBackingUp(false);
        setTaskId(null);
        setProgress(0);
        setStage("");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [progressData]);

  const handleBackup = async () => {
    try {
      setIsBackingUp(true);
      setProgress(0);
      setStage("正在啟動完整備份...");

      const result = await startBackupMutation.mutateAsync();
      setTaskId(result.taskId);
    } catch (error) {
      toast.error("啟動備份失敗：" + (error instanceof Error ? error.message : "未知錯誤"));
      setIsBackingUp(false);
      setProgress(0);
      setStage("");
    }
  };

  return (
    <div className="space-y-3">
      <Button onClick={handleBackup} disabled={isBackingUp} className="w-full">
        {isBackingUp ? (
          <>
            <span className="animate-spin mr-2">⏳</span>
            正在備份... {progress}%
          </>
        ) : (
          "📦 完整備份 (程式碼 + 資料庫)"
        )}
      </Button>

      {isBackingUp && (
        <div className="space-y-2">
          {/* 進度條 */}
          <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* 進度文字 */}
          <p className="text-sm text-gray-600 text-center">{stage}</p>
        </div>
      )}
    </div>
  );
}

export default function AdminSettings() {
  const { t } = useTranslation();
  const [location] = useLocation();
  const { isLoading: authLoading } = useAdminAuth();
  const [ga4Id, setGa4Id] = useState("");
  const [metaPixelId, setMetaPixelId] = useState("");
  // 用來暫存各語言的社群連結
  const [socialLinks, setSocialLinks] = useState<Record<string, any>>({});

  // 查詢網站設定
  const { data: settings, isLoading } = trpc.admin.getSettings.useQuery();
  const updateSettingsMutation = trpc.admin.updateSettings.useMutation();

  // 當資料載入完成時,填充表單
  useEffect(() => {
    if (settings) {
      setGa4Id(settings.ga4_id || "");
      setMetaPixelId(settings.meta_pixel_id || "");

      // 解析 social_links JSON
      if (settings.social_links) {
        try {
          const parsed =
            typeof settings.social_links === "string"
              ? JSON.parse(settings.social_links)
              : settings.social_links;
          setSocialLinks(parsed);
        } catch (err) {
          console.error("解析 social_links 失敗:", err);
          setSocialLinks({});
        }
      }
    }
  }, [settings]);

  const handleSave = async () => {
    try {
      await updateSettingsMutation.mutateAsync({
        ga4_id: ga4Id,
        meta_pixel_id: metaPixelId,
        social_links: JSON.stringify(socialLinks),
      });
      toast.success(t("admin.settings.saveSuccess"));
    } catch (error) {
      toast.error(t("admin.settings.saveError"));
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <>
      <SEOHead pageId="admin-settings" />
      <div className="min-h-screen bg-gray-50">
        <AdminNav />
        <div className="flex">
          <AdminSidebar currentPath={location} />
          <main className="flex-1 p-8">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-3xl font-bold mb-8">{t("admin.settings.title")}</h1>

              {/* 備份與下載區塊 */}
              <div className="bg-white rounded-lg shadow p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4">📥 備份與下載</h2>
                <p className="text-sm text-gray-600 mb-6">
                  下載網站的完整程式碼和資料庫備份。所有下載檔案均不包含 node_modules 和 .git 等大型目錄。
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* 資料庫 SQL 匯出 */}
                  <div className="space-y-2">
                    <h3 className="font-medium text-sm">資料庫 SQL</h3>
                    <p className="text-xs text-gray-500 mb-2">
                      匯出所有資料表為 SQL 檔案,可直接匯入資料庫
                    </p>
                    <ExportDatabaseButton />
                  </div>

                  {/* 程式碼下載 */}
                  <div className="space-y-2">
                    <h3 className="font-medium text-sm">專案程式碼</h3>
                    <p className="text-xs text-gray-500 mb-2">
                      下載完整專案原始碼 (不含 node_modules)
                    </p>
                    <DownloadCodeButton />
                  </div>

                  {/* 完整備份 */}
                  <div className="space-y-2">
                    <h3 className="font-medium text-sm">完整備份</h3>
                    <p className="text-xs text-gray-500 mb-2">
                      包含程式碼和資料庫的完整備份包
                    </p>
                    <FullBackupButton />
                  </div>
                </div>

                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-medium text-sm text-blue-900 mb-2">💡 使用說明</h4>
                  <ul className="text-xs text-blue-800 space-y-1">
                    <li>• <strong>資料庫 SQL</strong>: 適合單獨備份資料,檔案較小 (通常 &lt; 1MB)</li>
                    <li>• <strong>專案程式碼</strong>: 適合開發者下載原始碼,檔案約 5-20MB</li>
                    <li>• <strong>完整備份</strong>: 包含程式碼和資料庫,適合完整遷移或災難復原</li>
                  </ul>
                </div>
              </div>

              {/* 分析工具設定 */}
              <div className="bg-white rounded-lg shadow p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4">{t("admin.settings.analytics")}</h2>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="ga4">{t("admin.settings.ga4Id")}</Label>
                    <Input
                      id="ga4"
                      value={ga4Id}
                      onChange={(e) => setGa4Id(e.target.value)}
                      placeholder="G-XXXXXXXXXX"
                    />
                  </div>

                  <div>
                    <Label htmlFor="meta">{t("admin.settings.metaPixelId")}</Label>
                    <Input
                      id="meta"
                      value={metaPixelId}
                      onChange={(e) => setMetaPixelId(e.target.value)}
                      placeholder="123456789012345"
                    />
                  </div>
                </div>

                <Button onClick={handleSave} className="mt-4" disabled={updateSettingsMutation.isPending}>
                  {updateSettingsMutation.isPending ? t("admin.settings.saving") : t("admin.settings.save")}
                </Button>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
