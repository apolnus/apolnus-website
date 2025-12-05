import { useAuth } from "@/_core/hooks/useAuth";
import { useTranslation } from 'react-i18next';
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Send, ArrowLeft } from "lucide-react";
import { useRoute, useLocation } from "wouter";
import { useState } from "react";
import { toast } from "sonner";
import { getLoginUrl } from "@/const";
import AdminNav, { AdminSidebar } from "@/components/AdminNav";

const statusMap = {
  pending: { label: "待處理", color: "bg-yellow-500" },
  in_progress: { label: "處理中", color: "bg-blue-500" },
  resolved: { label: "已解決", color: "bg-green-500" },
  closed: { label: "已關閉", color: "bg-gray-500" },
};

export default function TicketProcessing() {
  const { t } = useTranslation();

  const [, params] = useRoute("/admin/tickets/:id");
  const [location, setLocation] = useLocation();
  const { user, loading: authLoading } = useAuth();
  const [replyMessage, setReplyMessage] = useState("");
  
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
  
  const addReplyMutation = trpc.tickets.addReply.useMutation({
    onSuccess: () => {
      toast.success("回覆已送出");
      setReplyMessage("");
      utils.tickets.getReplies.invalidate({ ticketId });
    },
    onError: (error) => {
      toast.error(`送出失敗: ${error.message}`);
    },
  });

  const updateStatusMutation = trpc.tickets.updateStatus.useMutation({
    onSuccess: () => {
      toast.success("狀態已更新");
      utils.tickets.getById.invalidate({ id: ticketId });
      utils.tickets.listWithFilters.invalidate();
    },
    onError: (error) => {
      toast.error(`更新失敗: ${error.message}`);
    },
  });

  const handleSendReply = () => {
    if (!replyMessage.trim()) {
      toast.error("請輸入回覆內容");
      return;
    }

    addReplyMutation.mutate({
      ticketId,
      message: replyMessage,
      isAdmin: true,
    });
  };

  const handleStatusChange = (newStatus: string) => {
    updateStatusMutation.mutate({
      ticketId,
      status: newStatus as "pending" | "in_progress" | "resolved" | "closed",
    });
  };

  if (authLoading || ticketLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AdminNav />
        <AdminSidebar currentPath={location} />
        <div className="ml-64 pt-20 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AdminNav />
        <AdminSidebar currentPath={location} />
        <div className="ml-64 pt-20 flex items-center justify-center">
          <Card className="w-full max-w-md mx-4">
            <CardHeader>
              <CardTitle>{t('ticketprocessing.t_7174cce7')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">{t('ticketprocessing.t_5be8996b')}</p>
              <Button
                onClick={() => {
                  window.location.href = getLoginUrl();
                }}
                className="w-full"
              >{t('ticketprocessing.t_163c8a39')}</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (user.role !== "admin") {
    return (
      <div className="min-h-screen bg-gray-50">
        <AdminNav />
        <AdminSidebar currentPath={location} />
        <div className="ml-64 pt-20 flex items-center justify-center">
          <Card className="w-full max-w-md mx-4">
            <CardHeader>
              <CardTitle>{t('ticketprocessing.t_547c30f2')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">{t('ticketprocessing.t_d2229d0a')}</p>
              <Button onClick={() => setLocation("/")} className="w-full">{t('ticketprocessing.t_3e29ca29')}</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AdminNav />
        <AdminSidebar currentPath={location} />
        <div className="ml-64 pt-20 flex items-center justify-center">
          <Card className="w-full max-w-md mx-4">
            <CardHeader>
              <CardTitle>{t('ticketprocessing.t_aa41b11c')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">{t('ticketprocessing.t_e22586f4')}</p>
              <Button onClick={() => setLocation("/admin/tickets")} className="w-full">{t('ticketprocessing.t_59903e38')}</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNav />
      <AdminSidebar currentPath={location} />
      <div className="ml-64 pt-20 p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <Button
              variant="ghost"
              onClick={() => setLocation("/admin/tickets")}
              className="mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />{t('ticketprocessing.t_59903e38')}</Button>
            
            <div className="flex items-start justify-between flex-wrap gap-4">
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
              
              {/* Status Control */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">{t('ticketprocessing.t_c9ab1c73')}</span>
                <Select
                  value={ticket.status}
                  onValueChange={handleStatusChange}
                  disabled={updateStatusMutation.isPending}
                >
                  <SelectTrigger className="w-[140px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">{t('ticketprocessing.t_906b6d81')}</SelectItem>
                    <SelectItem value="in_progress">{t('ticketprocessing.t_78489444')}</SelectItem>
                    <SelectItem value="resolved">{t('ticketprocessing.t_6b260302')}</SelectItem>
                    <SelectItem value="closed">{t('ticketprocessing.t_7d6a2179')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content - Conversation */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>{t('ticketprocessing.t_939547c6')}</CardTitle>
                </CardHeader>
                <CardContent>
                  {/* Initial Issue */}
                  <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-semibold text-gray-700">{t('ticketprocessing.t_45d7dfc2')}</span>
                      <span className="text-xs text-gray-500">
                        {new Date(ticket.createdAt).toLocaleDateString("zh-TW", {
                          month: "2-digit",
                          day: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    <p className="text-gray-900 whitespace-pre-wrap">
                      {ticket.issueDescription}
                    </p>
                  </div>

                  {/* Replies */}
                  {repliesLoading ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="w-6 h-6 animate-spin text-primary" />
                    </div>
                  ) : replies && replies.length > 0 ? (
                    <div className="space-y-4 mb-6">
                      {replies.map((reply) => (
                        <div
                          key={reply.id}
                          className={`flex ${
                            reply.isAdmin ? "justify-end" : "justify-start"
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
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : null}

                  {/* Reply Input */}
                  <div className="space-y-4 pt-4 border-t">
                    <Textarea
                      placeholder={t('ticketprocessing.t_3d3b7509')}
                      value={replyMessage}
                      onChange={(e) => setReplyMessage(e.target.value)}
                      rows={4}
                      className="resize-none"
                    />
                    <div className="flex justify-end">
                      <Button
                        onClick={handleSendReply}
                        disabled={addReplyMutation.isPending || !replyMessage.trim()}
                      >
                        {addReplyMutation.isPending ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />{t('ticketprocessing.t_ba34bf4e')}</>
                        ) : (
                          <>
                            <Send className="w-4 h-4 mr-2" />{t('ticketprocessing.t_99208353')}</>
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar - Ticket Info */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>{t('ticketprocessing.t_2793018e')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div>
                    <span className="text-gray-500">{t('ticketprocessing.t_50689869')}</span>
                    <p className="font-medium">{ticket.contactName}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">{t('ticketprocessing.t_48846895')}</span>
                    <p className="font-medium">{ticket.contactPhone}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">{t('ticketprocessing.t_cb0317a6')}</span>
                    <p className="font-medium">{ticket.contactAddress}</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{t('ticketprocessing.t_44484a0d')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div>
                    <span className="text-gray-500">{t('ticketprocessing.t_d987a0a4')}</span>
                    <p className="font-medium">{ticket.productModel}</p>
                  </div>
                  {ticket.serialNumber && (
                    <div>
                      <span className="text-gray-500">{t('ticketprocessing.t_07059058')}</span>
                      <p className="font-medium">{ticket.serialNumber}</p>
                    </div>
                  )}
                  {ticket.purchaseDate && (
                    <div>
                      <span className="text-gray-500">{t('ticketprocessing.t_01533cdb')}</span>
                      <p className="font-medium">
                        {new Date(ticket.purchaseDate).toLocaleDateString("zh-TW")}
                      </p>
                    </div>
                  )}
                  {ticket.purchaseChannel && (
                    <div>
                      <span className="text-gray-500">{t('ticketprocessing.t_a4d3ba99')}</span>
                      <p className="font-medium">{ticket.purchaseChannel}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{t('ticketprocessing.t_5efe8d4c')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div>
                    <span className="text-gray-500">{t('ticketprocessing.t_a689b2ac')}</span>
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
                  <div>
                    <span className="text-gray-500">{t('ticketprocessing.t_3b5637cf')}</span>
                    <p className="font-medium">
                      {new Date(ticket.updatedAt).toLocaleDateString("zh-TW", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
