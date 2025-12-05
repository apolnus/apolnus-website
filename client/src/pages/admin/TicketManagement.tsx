import { useAuth } from "@/_core/hooks/useAuth";
import { useTranslation } from 'react-i18next';
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Loader2, Search } from "lucide-react";
import { useLocation } from "wouter";
import { useState } from "react";
import { getLoginUrl } from "@/const";
import AdminNav, { AdminSidebar } from "@/components/AdminNav";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

const statusMap = {
  pending: { label: "待處理", color: "bg-yellow-500" },
  in_progress: { label: "處理中", color: "bg-blue-500" },
  resolved: { label: "已解決", color: "bg-green-500" },
  closed: { label: "已關閉", color: "bg-gray-500" },
};

export default function TicketManagement() {
  const { t } = useTranslation();

  const { user, loading: authLoading } = useAuth();
  const [, setLocation] = useLocation();
  const [selectedStatus, setSelectedStatus] = useState<
    "pending" | "in_progress" | "resolved" | "closed" | undefined
  >(undefined);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedTickets, setSelectedTickets] = useState<number[]>([]);
  const [batchStatus, setBatchStatus] = useState<"pending" | "in_progress" | "resolved" | "closed">("pending");

  const { data: tickets, isLoading, refetch } = trpc.tickets.listWithFilters.useQuery(
    {
      status: selectedStatus,
      search: searchKeyword,
    },
    {
      enabled: !!user && user.role === "admin",
    }
  );

  const batchUpdateMutation = trpc.tickets.batchUpdateStatus.useMutation({
    onSuccess: (data) => {
      toast.success(`成功更新 ${data.count} 個工單狀態`);
      setSelectedTickets([]);
      refetch();
    },
    onError: (error) => {
      toast.error(`批次更新失敗: ${error.message}`);
    },
  });

  const handleSelectAll = () => {
    if (selectedTickets.length === tickets?.length) {
      setSelectedTickets([]);
    } else {
      setSelectedTickets(tickets?.map(t => t.id) || []);
    }
  };

  const handleSelectTicket = (ticketId: number) => {
    setSelectedTickets(prev => 
      prev.includes(ticketId) 
        ? prev.filter(id => id !== ticketId)
        : [...prev, ticketId]
    );
  };

  const handleBatchUpdate = () => {
    if (selectedTickets.length === 0) {
      toast.error("請至少選擇一個工單");
      return;
    }
    batchUpdateMutation.mutate({
      ticketIds: selectedTickets,
      status: batchStatus,
    });
  };

  const [location] = useLocation();

  if (authLoading) {
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
            <CardContent className="pt-6">
              <p className="text-gray-600 mb-4">{t('ticketmanagement.t_5be8996b')}</p>
              <Button
                onClick={() => {
                  window.location.href = getLoginUrl();
                }}
                className="w-full"
              >{t('ticketmanagement.t_163c8a39')}</Button>
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
            <CardContent className="pt-6">
              <p className="text-gray-600">{t('ticketmanagement.t_d2229d0a')}</p>
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
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">{t('ticketmanagement.t_c96b3296')}</h1>

          {/* Filters */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4">
                {/* Status Filter */}
                <div className="flex gap-2 flex-wrap">
                  <Button
                    variant={selectedStatus === undefined ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedStatus(undefined)}
                  >{t('ticketmanagement.t_a8b0c204')}</Button>
                  <Button
                    variant={selectedStatus === "pending" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedStatus("pending")}
                  >{t('ticketmanagement.t_906b6d81')}</Button>
                  <Button
                    variant={selectedStatus === "in_progress" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedStatus("in_progress")}
                  >{t('ticketmanagement.t_78489444')}</Button>
                  <Button
                    variant={selectedStatus === "resolved" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedStatus("resolved")}
                  >{t('ticketmanagement.t_6b260302')}</Button>
                  <Button
                    variant={selectedStatus === "closed" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedStatus("closed")}
                  >{t('ticketmanagement.t_7d6a2179')}</Button>
                </div>

                {/* Search */}
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder={t('ticketmanagement.t_0289c05c')}
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Batch Operations Toolbar */}
          {tickets && tickets.length > 0 && (
            <Card className="mb-6">
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                  <div className="flex items-center gap-3">
                    <Checkbox
                      checked={selectedTickets.length === tickets.length && tickets.length > 0}
                      onCheckedChange={handleSelectAll}
                      id="select-all"
                    />
                    <label htmlFor="select-all" className="text-sm font-medium cursor-pointer">
                      全選 ({selectedTickets.length}/{tickets.length})
                    </label>
                  </div>

                  {selectedTickets.length > 0 && (
                    <>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">{t('ticketmanagement.t_f6bfc85f')}</span>
                        <Select value={batchStatus} onValueChange={(value: any) => setBatchStatus(value)}>
                          <SelectTrigger className="w-[140px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">{t('ticketmanagement.t_906b6d81')}</SelectItem>
                            <SelectItem value="in_progress">{t('ticketmanagement.t_78489444')}</SelectItem>
                            <SelectItem value="resolved">{t('ticketmanagement.t_6b260302')}</SelectItem>
                            <SelectItem value="closed">{t('ticketmanagement.t_7d6a2179')}</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Button 
                        onClick={handleBatchUpdate}
                        disabled={batchUpdateMutation.isPending}
                      >
                        {batchUpdateMutation.isPending ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />{t('ticketmanagement.t_ca0536f2')}</>
                        ) : (
                          `更新 ${selectedTickets.length} 個工單`
                        )}
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={() => setSelectedTickets([])}
                      >{t('ticketmanagement.t_36f1682d')}</Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Tickets List */}
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : tickets && tickets.length > 0 ? (
            <div className="space-y-4">
              {tickets.map((ticket) => (
                <Card
                  key={ticket.id}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <Checkbox
                        checked={selectedTickets.includes(ticket.id)}
                        onCheckedChange={() => handleSelectTicket(ticket.id)}
                        onClick={(e) => e.stopPropagation()}
                        className="mt-1"
                      />
                      <div 
                        className="flex-1 cursor-pointer"
                        onClick={() => setLocation(`/admin/tickets/${ticket.id}`)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <span className="text-sm text-gray-500">
                                工單編號: #{ticket.id}
                              </span>
                              <Badge
                                className={`${
                                  statusMap[ticket.status as keyof typeof statusMap]?.color
                                } text-white`}
                              >
                                {statusMap[ticket.status as keyof typeof statusMap]?.label}
                              </Badge>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                              {ticket.issueTitle}
                            </h3>
                            <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                              {ticket.issueDescription}
                            </p>
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <span>聯絡人: {ticket.contactName}</span>
                              <span>產品型號: {ticket.productModel}</span>
                              <span>
                                建立時間:{" "}
                                {new Date(ticket.createdAt).toLocaleDateString("zh-TW", {
                                  year: "numeric",
                                  month: "2-digit",
                                  day: "2-digit",
                                })}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-gray-500">
                  {searchKeyword || selectedStatus
                    ? "沒有符合條件的工單"
                    : "目前沒有任何工單"}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
