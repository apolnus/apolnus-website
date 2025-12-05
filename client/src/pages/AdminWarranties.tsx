import { useState } from "react";
import { useLocation } from "wouter";
import AdminNav, { AdminSidebar } from "@/components/AdminNav";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Trash2, Search, Eye, Filter, X } from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import SEOHead from "@/components/seo/SEOHead";

export default function AdminWarranties() {
  const { t } = useTranslation();
  const [location] = useLocation();
  const { isLoading } = useAdminAuth();
  const { data: warranties, refetch } = trpc.admin.warranties.list.useQuery();
  const { data: productModels } = trpc.admin.productModels.list.useQuery();
  const deleteMutation = trpc.admin.warranties.delete.useMutation();

  // 搜尋和篩選狀態
  const [searchQuery, setSearchQuery] = useState("");
  const [filterModel, setFilterModel] = useState<string>("all");
  const [filterDateFrom, setFilterDateFrom] = useState("");
  const [filterDateTo, setFilterDateTo] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // 詳細資料對話框
  const [selectedWarranty, setSelectedWarranty] = useState<any>(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <SEOHead pageKey="adminWarranties" />
        <div className="text-gray-600">{t('adminWarranties.t_d3933730')}</div>
      </div>
    );
  }

  const handleDelete = async (id: number) => {
    if (!confirm("確定要刪除此保固登錄記錄嗎？")) return;
    
    try {
      await deleteMutation.mutateAsync({ id });
      toast.success("記錄已刪除");
      refetch();
    } catch (error) {
      toast.error("刪除失敗");
    }
  };

  const handleViewDetail = (warranty: any) => {
    setSelectedWarranty(warranty);
    setShowDetailDialog(true);
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('zh-TW');
  };

  const clearFilters = () => {
    setSearchQuery("");
    setFilterModel("all");
    setFilterDateFrom("");
    setFilterDateTo("");
  };

  // 過濾邏輯
  const filteredWarranties = warranties?.filter((warranty) => {
    // 搜尋過濾 (姓名/電話/Email/序號)
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesSearch = 
        warranty.name?.toLowerCase().includes(query) ||
        warranty.phone?.toLowerCase().includes(query) ||
        warranty.email?.toLowerCase().includes(query) ||
        warranty.serialNumber?.toLowerCase().includes(query);
      
      if (!matchesSearch) return false;
    }

    // 產品型號過濾
    if (filterModel && filterModel !== "all") {
      if (warranty.productModel !== filterModel) return false;
    }

    // 購買日期範圍過濾
    if (filterDateFrom) {
      const purchaseDate = new Date(warranty.purchaseDate);
      const fromDate = new Date(filterDateFrom);
      if (purchaseDate < fromDate) return false;
    }

    if (filterDateTo) {
      const purchaseDate = new Date(warranty.purchaseDate);
      const toDate = new Date(filterDateTo);
      toDate.setHours(23, 59, 59, 999); // 包含當天結束時間
      if (purchaseDate > toDate) return false;
    }

    return true;
  });

  const hasActiveFilters = searchQuery || filterModel !== "all" || filterDateFrom || filterDateTo;

  return (
    <div className="min-h-screen bg-gray-100">
      <SEOHead pageKey="adminWarranties" />
      <AdminNav />
      <AdminSidebar currentPath={location} />
      
      <main className="ml-64 pt-24 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-900">{t('adminWarranties.t_ab140f2b')}</h1>
            <Button
              variant={showFilters ? "default" : "outline"}
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="w-4 h-4 mr-2" />
              {showFilters ? "隱藏篩選" : "顯示篩選"}
            </Button>
          </div>

          {/* 搜尋和篩選區域 */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* 搜尋框 */}
              <div className="lg:col-span-2">
                <Label htmlFor="search">搜尋 (姓名/電話/Email/序號)</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="search"
                    type="text"
                    placeholder="輸入關鍵字搜尋..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* 產品型號篩選 */}
              {showFilters && (
                <>
                  <div>
                    <Label htmlFor="filterModel">產品型號</Label>
                    <Select value={filterModel} onValueChange={setFilterModel}>
                      <SelectTrigger id="filterModel">
                        <SelectValue placeholder="選擇產品型號" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">全部型號</SelectItem>
                        {productModels?.map((model) => (
                          <SelectItem key={model.id} value={model.name}>
                            {model.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* 購買日期範圍 */}
                  <div>
                    <Label htmlFor="dateFrom">購買日期(起)</Label>
                    <Input
                      id="dateFrom"
                      type="date"
                      value={filterDateFrom}
                      onChange={(e) => setFilterDateFrom(e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="dateTo">購買日期(迄)</Label>
                    <Input
                      id="dateTo"
                      type="date"
                      value={filterDateTo}
                      onChange={(e) => setFilterDateTo(e.target.value)}
                    />
                  </div>
                </>
              )}
            </div>

            {/* 清除篩選按鈕 */}
            {hasActiveFilters && (
              <div className="mt-4 flex items-center justify-between">
                <span className="text-sm text-gray-600">
                  找到 {filteredWarranties?.length || 0} 筆記錄
                </span>
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  <X className="w-4 h-4 mr-2" />
                  清除所有篩選
                </Button>
              </div>
            )}
          </div>

          {/* 資料表格 */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('adminWarranties.t_1e87c212')}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('adminWarranties.t_ed1af6c7')}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('adminWarranties.t_4713848a')}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('adminWarranties.t_91544893')}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('adminWarranties.t_ff2741d8')}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('adminWarranties.t_707f7e46')}</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">{t('adminWarranties.t_6ff78e4f')}</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredWarranties?.map((warranty) => (
                    <tr key={warranty.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {warranty.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {warranty.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {warranty.phone}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {warranty.productModel}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {warranty.serialNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(warranty.purchaseDate)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(warranty.registeredAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewDetail(warranty)}
                          >
                            <Eye className="w-4 h-4 text-blue-600" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(warranty.id)}
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {(!filteredWarranties || filteredWarranties.length === 0) && (
                    <tr>
                      <td colSpan={8} className="px-6 py-8 text-center text-sm text-gray-500">
                        {hasActiveFilters ? "沒有符合條件的記錄" : t('adminWarranties.t_ef90770f')}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      {/* 詳細資料對話框 */}
      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>保固登錄詳細資料</DialogTitle>
          </DialogHeader>
          {selectedWarranty && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-600">姓名</Label>
                  <p className="font-medium">{selectedWarranty.name}</p>
                </div>
                <div>
                  <Label className="text-gray-600">電子郵件</Label>
                  <p className="font-medium">{selectedWarranty.email}</p>
                </div>
                <div>
                  <Label className="text-gray-600">聯絡電話</Label>
                  <p className="font-medium">{selectedWarranty.phone}</p>
                </div>
                <div>
                  <Label className="text-gray-600">產品型號</Label>
                  <p className="font-medium">{selectedWarranty.productModel}</p>
                </div>
                <div>
                  <Label className="text-gray-600">產品序號</Label>
                  <p className="font-medium">{selectedWarranty.serialNumber}</p>
                </div>
                <div>
                  <Label className="text-gray-600">購買日期</Label>
                  <p className="font-medium">{formatDate(selectedWarranty.purchaseDate)}</p>
                </div>
                <div>
                  <Label className="text-gray-600">購買通路</Label>
                  <p className="font-medium">{selectedWarranty.purchaseChannel || "未提供"}</p>
                </div>
                <div>
                  <Label className="text-gray-600">登錄時間</Label>
                  <p className="font-medium">{formatDate(selectedWarranty.registeredAt)}</p>
                </div>
              </div>
              {selectedWarranty.address && (
                <div>
                  <Label className="text-gray-600">地址</Label>
                  <p className="font-medium">{selectedWarranty.address}</p>
                </div>
              )}
              {selectedWarranty.notes && (
                <div>
                  <Label className="text-gray-600">備註</Label>
                  <p className="font-medium whitespace-pre-wrap">{selectedWarranty.notes}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
