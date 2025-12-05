import { useAuth } from "@/_core/hooks/useAuth";
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
import { getLoginUrl } from "@/const";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const statusMap = {
  pending: { label: "待處理", color: "bg-yellow-500" },
  in_progress: { label: "處理中", color: "bg-blue-500" },
  resolved: { label: "已解決", color: "bg-green-500" },
  closed: { label: "已關閉", color: "bg-gray-500" },
};

export default function TicketDetail() {
  const { t } = useTranslation();

  const [, params] = useRoute("/tickets/:id");
  const [, setLocation] = useLocation();
  const { user, loading: authLoading } = useAuth();
  const [replyMessage, setReplyMessage] = useState("");
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [viewingImage, setViewingImage] = useState<string | null>(null);
  
  const ticketId = params?.id ? parseInt(params.id) : 0;

  const { data: ticket, isLoading: ticketLoading } = trpc.tickets.getById.useQuery(
    { id: ticketId },
    { enabled: ticketId > 0 }
  );

  const { data: replies, isLoading: repliesLoading } = trpc.tickets.getReplies.useQuery(
    { ticketId },
    { enabled: ticketId > 0 }
  );

  const utils = trpc.useUtils();
  
  // Mark replies as read when viewing ticket detail
  const markAsReadMutation = trpc.tickets.markRepliesAsRead.useMutation();
  
  useEffect(() => {
    if (ticketId > 0 && user) {
      markAsReadMutation.mutate({ ticketId });
    }
  }, [ticketId, user]);
  
  const addReplyMutation = trpc.tickets.addReply.useMutation({
    onSuccess: () => {
      toast.success("回覆已送出");
      setReplyMessage("");
      setUploadedImages([]);
      utils.tickets.getReplies.invalidate({ ticketId });
    },
    onError: (error) => {
      toast.error(`送出失敗: ${error.message}`);
    },
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Validate file types and sizes
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
      e.target.value = ''; // Reset input
    }
  };

  const removeImage = (url: string) => {
    setUploadedImages(prev => prev.filter(img => img !== url));
  };

  const handleSendReply = () => {
    if (!replyMessage.trim()) {
      toast.error("請輸入回覆內容");
      return;
    }

    addReplyMutation.mutate({
      ticketId,
      message: replyMessage,
      isAdmin: false,
      attachments: uploadedImages.length > 0 ? uploadedImages : undefined,
    });
  };

  if (authLoading || ticketLoading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center pt-24">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
        <Footer />
      </>
    );
  }

  if (!user) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-24">
          <Card className="w-full max-w-md mx-4">
            <CardHeader>
              <CardTitle>{t('ticketdetail.t_7174cce7')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">{t('ticketdetail.t_4498be8c')}</p>
              <Button
                onClick={() => {
                  window.location.href = getLoginUrl();
                }}
                className="w-full"
              >{t('ticketdetail.t_163c8a39')}</Button>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </>
    );
  }

  if (!ticket) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-24">
          <Card className="w-full max-w-md mx-4">
            <CardHeader>
              <CardTitle>{t('ticketdetail.t_aa41b11c')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">{t('ticketdetail.t_e5ec354c')}</p>
              <Button onClick={() => setLocation("/profile")} className="w-full">{t('ticketdetail.t_d20b5fc9')}</Button>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 pt-24">
        <div className="container max-w-4xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-6">
            <Button
              variant="ghost"
              onClick={() => setLocation("/profile")}
              className="mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />{t('ticketdetail.t_d20b5fc9')}</Button>
            
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {ticket.issueTitle}
                </h1>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-500">工單編號: #{ticket.id}</span>
                  <Badge
                    className={`${
                      statusMap[ticket.status as keyof typeof statusMap]?.color
                    } text-white`}
                  >
                    {statusMap[ticket.status as keyof typeof statusMap]?.label}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Ticket Info Card */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>{t('ticketdetail.t_7a277d72')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-gray-500">{t('ticketdetail.t_50689869')}</span>
                  <p className="font-medium">{ticket.contactName}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">{t('ticketdetail.t_48846895')}</span>
                  <p className="font-medium">{ticket.contactPhone}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">{t('ticketdetail.t_d987a0a4')}</span>
                  <p className="font-medium">{ticket.productModel}</p>
                </div>
                {ticket.serialNumber && (
                  <div>
                    <span className="text-sm text-gray-500">{t('ticketdetail.t_07059058')}</span>
                    <p className="font-medium">{ticket.serialNumber}</p>
                  </div>
                )}
                <div>
                  <span className="text-sm text-gray-500">{t('ticketdetail.t_a689b2ac')}</span>
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
                <span className="text-sm text-gray-500">{t('ticketdetail.t_78faa8d8')}</span>
                <p className="mt-1 text-gray-900 whitespace-pre-wrap">
                  {ticket.issueDescription}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Conversation */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>{t('ticketdetail.t_939547c6')}</CardTitle>
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
                      className={`flex ${
                        reply.isAdmin ? "justify-start" : "justify-end"
                      }`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg p-4 ${
                          reply.isAdmin
                            ? "bg-blue-50 border border-blue-200"
                            : "bg-gray-100 border border-gray-200"
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <span
                            className={`text-xs font-semibold ${
                              reply.isAdmin ? "text-blue-700" : "text-gray-700"
                            }`}
                          >
                            {reply.isAdmin ? "客服人員" : "您"}
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
                <p className="text-center text-gray-500 py-8">{t('ticketdetail.t_27dd024b')}</p>
              )}
            </CardContent>
          </Card>

          {/* Reply Input */}
          {ticket.status !== "closed" && (
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <Textarea
                    placeholder={t('ticketdetail.t_0ef311e7')}
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                    rows={4}
                    className="resize-none"
                  />
                  
                  {/* Image Upload Preview */}
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
                        id="image-upload"
                        accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                        multiple
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => document.getElementById('image-upload')?.click()}
                        disabled={uploading}
                      >
                        {uploading ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />{t('ticketdetail.t_ab273422')}</>
                        ) : (
                          <>
                            <ImagePlus className="w-4 h-4 mr-2" />{t('ticketdetail.t_c4af364d')}</>
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
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />{t('ticketdetail.t_ba34bf4e')}</>
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />{t('ticketdetail.t_99208353')}</>
                      )}
                    </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      
      {/* Image Viewer Modal */}
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
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}
      
      <Footer />
    </>
  );
}
