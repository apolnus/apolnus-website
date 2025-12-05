import { useLocation } from "wouter";
import AdminNav, { AdminSidebar } from "@/components/AdminNav";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Trash2, Check, X } from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import SEOHead from "@/components/seo/SEOHead";

export default function AdminPartners() {
  const { t } = useTranslation();
  const [location] = useLocation();
  const { isLoading } = useAdminAuth();
  const { data: partners, refetch } = trpc.admin.partners.list.useQuery();
  const updateStatusMutation = trpc.admin.partners.updateStatus.useMutation();
  const deleteMutation = trpc.admin.partners.delete.useMutation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
      <SEOHead pageKey="adminPartners" />
        <div className="text-gray-600">{t('adminPartners.t_d3933730')}</div>
      </div>
    );
  }

  const handleUpdateStatus = async (id: number, status: "pending" | "approved" | "rejected") => {
    try {
      await updateStatusMutation.mutateAsync({ id, status });
      toast.success("狀態已更新");
      refetch();
    } catch (error) {
      toast.error("更新失敗");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("確定要刪除此合作夥伴申請嗎？")) return;
    
    try {
      await deleteMutation.mutateAsync({ id });
      toast.success("申請已刪除");
      refetch();
    } catch (error) {
      toast.error("刪除失敗");
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: "bg-yellow-100 text-yellow-800",
      approved: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
    };
    const labels = {
      pending: "待審核",
      approved: "已批准",
      rejected: "已拒絕",
    };
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[status as keyof typeof styles]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminNav />
      <AdminSidebar currentPath={location} />
      
      <main className="ml-64 pt-24 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-900">{t('adminPartners.t_f14e9429')}</h1>
          </div>

          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('adminPartners.t_155c5371')}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('adminPartners.t_02594def')}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('adminPartners.t_2133274b')}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('adminPartners.t_ed1af6c7')}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('adminPartners.t_fc729e09')}</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">{t('adminPartners.t_6ff78e4f')}</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {partners?.map((partner) => (
                  <tr key={partner.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {partner.companyName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {partner.contactName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {partner.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {partner.phone || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(partner.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                      {partner.status === "pending" && (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleUpdateStatus(partner.id, "approved")}
                            className="text-green-600 hover:text-green-900"
                          >
                            <Check className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleUpdateStatus(partner.id, "rejected")}
                            className="text-red-600 hover:text-red-900"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(partner.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
                {(!partners || partners.length === 0) && (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">{t('adminPartners.t_49435890')}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
