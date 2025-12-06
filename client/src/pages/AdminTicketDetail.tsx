import { useTranslation } from 'react-i18next';
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Send, ArrowLeft, ImagePlus, X, ZoomIn } from "lucide-react";
import { useRoute, useLocation } from "wouter";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import AdminNav, { AdminSidebar } from "@/components/AdminNav";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import SEOHead from "@/components/seo/SEOHead";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const statusMap = {
  pending: { label: "待處理", color: "bg-yellow-500" },
  in_progress: { label: "處理中", color: "bg-blue-500" },
  resolved: { label: "已解決", color: "bg-green-500" },
  closed: { label: "已關閉", color: "bg-gray-500" },
};

export default function AdminTicketDetail() {
  const { t } = useTranslation();
  const [, params] = useRoute("/admin/tickets/:id");
  const [, setLocation] = useLocation();
  const [location] = useLocation();
  const { isLoading: authLoading } = useAdminAuth();
  const [replyMessage, setReplyMessage] = useState("");
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [viewingImage, setViewingImage] = useState<string | null>(null);

  const ticketId = params?.id ? parseInt(params.id) : 0;

  const { data: ticket, isLoading: ticketLoading, refetch: refetchTicket } = trpc.admin.tickets.getById.useQuery(
    { id: ticketId },
    { enabled: ticketId > 0 }
  );

  const { data: replies, isLoading: repliesLoading, refetch: refetchReplies } = trpc.tickets.getReplies.useQuery(
    { ticketId },
    { enabled: ticketId > 0 }
  );

  const updateStatusMutation = trpc.admin.tickets.updateStatus.useMutation({
    onSuccess: () => {
      toast.success("狀態已更新");
      refetchTicket();
    },
    onError: (error) => {
      toast.error(`更新失敗: ${error.message}`);
    },
  });



  const markAsReadMutation = trpc.tickets.markRepliesAsRead.useMutation({
    onSuccess: () => {
      // 標記已讀成功後，不需要特別通知，也不一定需要重新整理列表，
      // 但如果用戶切換回列表頁，應該要看到更新後的狀態。
      // 可以考慮 invalidate queries
    }
  });

  // 進入頁面時標記已讀
  // 進入頁面時標記已讀
  useEffect(() => {
    if (ticketId > 0) {
      markAsReadMutation.mutate({ ticketId });
    }
  }, [ticketId]);

  const addReplyMutation = trpc.tickets.addReply.useMutation({
    onSuccess: () => {
      toast.success("回覆已送出");
      setReplyMessage("");
      setUploadedImages([]);
      refetchReplies();
    },
    onError: (error) => {
      toast.error(`送出失敗: ${error.message}`);
    },
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const validFiles: File[] = [];
    for (const file of Array.from(files)) {
      if (!file.type.match(/^image\/(jpeg|jpg|png|gif|webp)$/)) {
        toast.error(`${file.name} 不是支援的圖片格式`);
        continue;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} 超過5MB限制`);
        continue;
      }
      validFiles.push(file);
    }

    if (validFiles.length === 0) return;

    setUploading(true);
    try {
      const uploadPromises = validFiles.map(async (file) => {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) throw new Error('上傳失敗');

        const data = await response.json();
        return data.url;
      });

      const urls = await Promise.all(uploadPromises);
      setUploadedImages(prev => [...prev, ...urls]);
      toast.success(`已上傳 ${urls.length} 張圖片`);
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('圖片上傳失敗');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const removeImage = (url: string) => {
    setUploadedImages(prev => prev.filter(img => img !== url));
  };

  const handleStatusChange = (status: string) => {
    updateStatusMutation.mutate({
      id: ticketId,
      status: status as "pending" | "in_progress" | "resolved" | "closed",
    });
  };

  const handleSendReply = () => {
    if (!replyMessage.trim()) {
      toast.error("請輸入回覆內容");
      return;
    }

    addReplyMutation.mutate({
      ticketId,
      message: replyMessage,
      isAdmin: true,
      attachments: uploadedImages.length > 0 ? uploadedImages : undefined,
    });
  };

  if (authLoading || ticketLoading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <SEOHead pageKey="adminTickets" />
        <AdminNav />
        <AdminSidebar currentPath={location} />
        <main className="ml-64 pt-24 p-8">
          <div className="flex items-center justify-center h-96">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        </main>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="min-h-screen bg-gray-100">
        <SEOHead pageKey="adminTickets" />
        <AdminNav />
        <AdminSidebar currentPath={location} />
        <main className="ml-64 pt-24 p-8">
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle>工單不存在</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">找不到此工單</p>
              <Button onClick={() => setLocation("/admin/tickets")} className="w-full">
                返回工單列表
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <SEOHead pageKey="adminTickets" />
      <AdminNav />
      <AdminSidebar currentPath={location} />

      <main className="ml-64 pt-24 p-8">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <Button
              variant="ghost"
              onClick={() => setLocation("/admin/tickets")}
              className="mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              返回工單列表
            </Button>

            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {ticket.issueTitle}
                </h1>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-500">工單編號: #{ticket.id}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600">狀態:</span>
                <Select
                  value={ticket.status}
                  onValueChange={handleStatusChange}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">待處理</SelectItem>
                    <SelectItem value="in_progress">處理中</SelectItem>
                    <SelectItem value="resolved">已解決</SelectItem>
                    <SelectItem value="closed">已關閉</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Ticket Info Card */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>工單資訊</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-gray-500">聯絡人</span>
                  <p className="font-medium">{ticket.contactName}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">聯絡電話</span>
                  <p className="font-medium">{ticket.contactPhone}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">產品型號</span>
                  <p className="font-medium">{ticket.productModel}</p>
                </div>
                {ticket.serialNumber && (
                  <div>
                    <span className="text-sm text-gray-500">產品序號</span>
                    <p className="font-medium">{ticket.serialNumber}</p>
                  </div>
                )}
                <div>
                  <span className="text-sm text-gray-500">建立時間</span>
                  <p className="font-medium">
                    {new Date(ticket.createdAt).toLocaleDateString("zh-TW", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
              <div>
                <span className="text-sm text-gray-500">問題描述</span>
                <p className="mt-1 text-gray-900 whitespace-pre-wrap">
                  {ticket.issueDescription}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Conversation */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>對話記錄</CardTitle>
            </CardHeader>
            <CardContent>
              {repliesLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-primary" />
                </div>
              ) : replies && replies.length > 0 ? (
                <div className="space-y-4">
                  {replies.map((reply) => (
                    <div
                      key={reply.id}
                      className={`flex ${reply.isAdmin ? "justify-start" : "justify-end"
                        }`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg p-4 ${reply.isAdmin
                          ? "bg-blue-50 border border-blue-200"
                          : "bg-gray-100 border border-gray-200"
                          }`}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <span
                            className={`text-xs font-semibold ${reply.isAdmin ? "text-blue-700" : "text-gray-700"
                              }`}
                          >
                            {reply.isAdmin ? "客服人員" : "客戶"}
                          </span>
                          <span className="text-xs text-gray-500">
                            {new Date(reply.createdAt).toLocaleDateString("zh-TW", {
                              month: "2-digit",
                              day: "2-digit",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                        <p className="text-gray-900 whitespace-pre-wrap">
                          {reply.message}
                        </p>
                        {reply.attachments && (() => {
                          try {
                            const attachments = JSON.parse(reply.attachments);
                            if (Array.isArray(attachments) && attachments.length > 0) {
                              return (
                                <div className="mt-3 grid grid-cols-2 gap-2">
                                  {attachments.map((url: string, idx: number) => (
                                    <div key={idx} className="relative group">
                                      <img
                                        src={url}
                                        alt={`attachment-${idx}`}
                                        className="w-full h-32 object-cover rounded border cursor-pointer hover:opacity-80 transition"
                                        onClick={() => setViewingImage(url)}
                                      />
                                      <button
                                        onClick={() => setViewingImage(url)}
                                        className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition"
                                        title="放大圖片"
                                      >
                                        <ZoomIn className="w-4 h-4" />
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              );
                            }
                          } catch (e) {
                            return null;
                          }
                          return null;
                        })()}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500 py-8">尚無對話記錄</p>
              )}
            </CardContent>
          </Card>

          {/* Reply Input */}
          {ticket.status !== "closed" && (
            <Card>
              <CardHeader>
                <CardTitle>回覆客戶</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Textarea
                    placeholder="輸入回覆內容..."
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                    rows={4}
                    className="resize-none"
                  />

                  {uploadedImages.length > 0 && (
                    <div className="grid grid-cols-3 gap-2">
                      {uploadedImages.map((url, idx) => (
                        <div key={idx} className="relative group">
                          <img
                            src={url}
                            alt={`upload-${idx}`}
                            className="w-full h-24 object-cover rounded border"
                          />
                          <button
                            onClick={() => removeImage(url)}
                            className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
                            title="移除圖片"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex justify-between items-center">
                    <div>
                      <input
                        type="file"
                        id="admin-image-upload"
                        accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                        multiple
                        onChange={handleImageUpload}
                        className="hidden"
                        title="上傳圖片"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => document.getElementById('admin-image-upload')?.click()}
                        disabled={uploading}
                      >
                        {uploading ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            上傳中...
                          </>
                        ) : (
                          <>
                            <ImagePlus className="w-4 h-4 mr-2" />
                            上傳圖片
                          </>
                        )}
                      </Button>
                    </div>
                    <div className="flex justify-end">
                      <Button
                        onClick={handleSendReply}
                        disabled={addReplyMutation.isPending || !replyMessage.trim()}
                      >
                        {addReplyMutation.isPending ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            送出中...
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4 mr-2" />
                            送出回覆
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      {viewingImage && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setViewingImage(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh]">
            <img
              src={viewingImage}
              alt="viewing"
              className="max-w-full max-h-[90vh] object-contain"
            />
            <button
              onClick={() => setViewingImage(null)}
              className="absolute top-4 right-4 bg-white text-black p-2 rounded-full hover:bg-gray-200 transition"
              title="關閉"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
