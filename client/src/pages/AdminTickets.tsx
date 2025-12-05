import { useLocation } from "wouter";
import AdminNav, { AdminSidebar } from "@/components/AdminNav";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Trash2, Eye } from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import SEOHead from "@/components/seo/SEOHead";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useState, useMemo } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function AdminTickets() {
  const { t } = useTranslation();
  const [location] = useLocation();
  const { isLoading } = useAdminAuth();
  const { data: tickets, refetch } = trpc.admin.tickets.list.useQuery();
  const updateStatusMutation = trpc.admin.tickets.updateStatus.useMutation();
  const deleteMutation = trpc.admin.tickets.delete.useMutation();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [batchStatus, setBatchStatus] = useState<string>("pending");
  const batchUpdateMutation = trpc.admin.tickets.batchUpdateStatus.useMutation();

  // 搜尋和篩選邏輯
  const filteredTickets = useMemo(() => {
    if (!tickets) return [];
    
    return tickets.filter((ticket) => {
      // 狀態篩選
      if (statusFilter !== "all" && ticket.status !== statusFilter) {
        return false;
      }
      
      // 搜尋篩選（工單號碼、聯絡人、電話、問題描述）
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const ticketNumber = `#${ticket.id}`;
        return (
          ticketNumber.includes(query) ||
          ticket.contactName.toLowerCase().includes(query) ||
          ticket.contactPhone.toLowerCase().includes(query) ||
          ticket.issueTitle.toLowerCase().includes(query)
        );
      }
      
      return true;
    });
  }, [tickets, searchQuery, statusFilter]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
      <SEOHead pageKey="adminTickets" />
        <div className="text-gray-600">{t('adminTickets.t_d3933730')}</div>
      </div>
    );
  }

  const handleStatusChange = async (id: number, status: string) => {
    try {
      await updateStatusMutation.mutateAsync({ 
        id, 
        status: status as "pending" | "in_progress" | "resolved" | "closed"
      });
      toast.success("狀態已更新");
      refetch();
    } catch (error) {
      toast.error("更新失敗");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("確定要刪除此工單嗎？")) return;
    
    try {
      await deleteMutation.mutateAsync({ id });
      toast.success("工單已刪除");
      refetch();
    } catch (error) {
      toast.error("刪除失敗");
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(filteredTickets.map(t => t.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id: number, checked: boolean) => {
    if (checked) {
      setSelectedIds([...selectedIds, id]);
    } else {
      setSelectedIds(selectedIds.filter(sid => sid !== id));
    }
  };

  const handleBatchUpdate = async () => {
    if (selectedIds.length === 0) {
      toast.error("請至少選擇一個工單");
      return;
    }

    try {
      await batchUpdateMutation.mutateAsync({
        ids: selectedIds,
        status: batchStatus as "pending" | "in_progress" | "resolved" | "closed",
      });
      toast.success(`已更新 ${selectedIds.length} 個工單的狀態`);
      setSelectedIds([]);
      refetch();
    } catch (error) {
      toast.error("批次更新失敗");
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap = {
      pending: { label: "待處理", color: "bg-yellow-100 text-yellow-800" },
      in_progress: { label: "處理中", color: "bg-blue-100 text-blue-800" },
      resolved: { label: "已解決", color: "bg-green-100 text-green-800" },
      closed: { label: "已關閉", color: "bg-gray-100 text-gray-800" },
    };
    const { label, color } = statusMap[status as keyof typeof statusMap] || statusMap.pending;
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${color}`}>
        {label}
      </span>
    );
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('zh-TW');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminNav />
      <AdminSidebar currentPath={location} />
      
      <main className="ml-64 pt-24 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">{t('adminTickets.t_9975533f')}</h1>
            
            {/* 搜尋和篩選區域 */}
            <div className="flex gap-4 items-center mb-4">
              <div className="flex-1">
                <Input
                  placeholder="搜尋工單號碼、聯絡人、電話或問題描述..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="max-w-md"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="篩選狀態" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部狀態</SelectItem>
                  <SelectItem value="pending">待處理</SelectItem>
                  <SelectItem value="in_progress">處理中</SelectItem>
                  <SelectItem value="resolved">已解決</SelectItem>
                  <SelectItem value="closed">已關閉</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 批次操作區域 */}
            {selectedIds.length > 0 && (
              <div className="flex gap-4 items-center p-4 bg-blue-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">
                  已選擇 {selectedIds.length} 個工單
                </span>
                <Select value={batchStatus} onValueChange={setBatchStatus}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="選擇狀態" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">待處理</SelectItem>
                    <SelectItem value="in_progress">處理中</SelectItem>
                    <SelectItem value="resolved">已解決</SelectItem>
                    <SelectItem value="closed">已關閉</SelectItem>
                  </SelectContent>
                </Select>
                <Button onClick={handleBatchUpdate} disabled={batchUpdateMutation.isPending}>
                  {batchUpdateMutation.isPending ? "更新中..." : "批次更新狀態"}
                </Button>
                <Button variant="outline" onClick={() => setSelectedIds([])}>
                  取消選擇
                </Button>
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left">
                    <Checkbox
                      checked={selectedIds.length === filteredTickets.length && filteredTickets.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">工單號碼</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('adminTickets.t_02594def')}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('adminTickets.t_ed1af6c7')}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('adminTickets.t_4713848a')}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('adminTickets.t_8c436c4a')}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('adminTickets.t_fc729e09')}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('adminTickets.t_23114130')}</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">{t('adminTickets.t_6ff78e4f')}</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTickets?.map((ticket) => (
                  <tr key={ticket.id} className={selectedIds.includes(ticket.id) ? "bg-blue-50" : ""}>
                    <td className="px-4 py-4">
                      <Checkbox
                        checked={selectedIds.includes(ticket.id)}
                        onCheckedChange={(checked) => handleSelectOne(ticket.id, checked as boolean)}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => window.location.href = `/admin/tickets/${ticket.id}`}
                          title="查看詳情"
                          className="p-1 h-auto"
                        >
                          <Eye className="w-4 h-4 text-blue-600" />
                        </Button>
                        <span className="text-sm font-mono font-medium text-gray-900">
                          #{ticket.id}
                        </span>
                        {(ticket as any).unreadCount > 0 && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-500 text-white">
                            新回覆 ({(ticket as any).unreadCount})
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {ticket.contactName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {ticket.contactPhone}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {ticket.productModel}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {ticket.issueTitle}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <Select
                        value={ticket.status}
                        onValueChange={(value) => handleStatusChange(ticket.id, value)}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">{t('adminTickets.t_906b6d81')}</SelectItem>
                          <SelectItem value="in_progress">{t('adminTickets.t_78489444')}</SelectItem>
                          <SelectItem value="resolved">{t('adminTickets.t_6b260302')}</SelectItem>
                          <SelectItem value="closed">{t('adminTickets.t_7d6a2179')}</SelectItem>
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(ticket.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(ticket.id)}
                        title="刪除工單"
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </Button>
                    </td>
                  </tr>
                ))}
                {!filteredTickets || filteredTickets.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-6 py-4 text-center text-sm text-gray-500">
                      {searchQuery || statusFilter !== "all" ? "沒有符合條件的工單" : t('adminTickets.t_88f89268')}
                    </td>
                  </tr>
                ) : null}
              </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
