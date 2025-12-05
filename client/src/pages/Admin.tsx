import { Link, useLocation } from "wouter";
import AdminNav, { AdminSidebar } from "@/components/AdminNav";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { trpc } from "@/lib/trpc";
import { Mail, Handshake, Package, HelpCircle, FileText, ClipboardList, TrendingUp, AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useTranslation } from "react-i18next";
import SEOHead from "@/components/seo/SEOHead";

export default function Admin() {
  const { t } = useTranslation();
  const [location] = useLocation();
  const { isLoading } = useAdminAuth();
  
  // 獲取統計數據
  const { data: dashboardStats } = trpc.admin.dashboard.stats.useQuery();
  const { data: subscribers } = trpc.admin.subscribers.list.useQuery();
  const { data: partners } = trpc.admin.partners.list.useQuery();
  const { data: productModels } = trpc.admin.productModels.list.useQuery();
  const { data: faqs } = trpc.faqs.adminList.useQuery();
  const { data: warranties } = trpc.admin.warranties.list.useQuery();
  const { data: tickets } = trpc.admin.tickets.list.useQuery();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
      <SEOHead pageKey="admin" />
        <div className="text-gray-600">{t('admin.t_d3933730')}</div>
      </div>
    );
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const keyStats = [
    {
      label: "訂閱者總數",
      value: dashboardStats?.totalSubscribers || 0,
      icon: Mail,
      color: "bg-blue-50 text-blue-600",
      link: "/admin/subscribers",
      description: "電子報訂閱者",
    },
    {
      label: "待處理工單",
      value: dashboardStats?.pendingTickets || 0,
      icon: AlertCircle,
      color: "bg-red-50 text-red-600",
      link: "/admin/tickets",
      description: "需要處理的客服工單",
    },
    {
      label: "保固登錄",
      value: dashboardStats?.totalWarranties || 0,
      icon: FileText,
      color: "bg-green-50 text-green-600",
      link: "/admin/warranties",
      description: "產品保固登錄數量",
    },
    {
      label: "合作夥伴申請",
      value: dashboardStats?.totalPartners || 0,
      icon: Handshake,
      color: "bg-purple-50 text-purple-600",
      link: "/admin/partners",
      description: "合作夥伴申請數量",
    },
  ];

  const allStats = [
    {
      label: "訂閱者",
      value: subscribers?.length || 0,
      icon: Mail,
      color: "bg-blue-50 text-blue-600",
      link: "/admin/subscribers",
    },
    {
      label: "合作夥伴",
      value: partners?.length || 0,
      icon: Handshake,
      color: "bg-green-50 text-green-600",
      link: "/admin/partners",
    },
    {
      label: "產品型號",
      value: productModels?.length || 0,
      icon: Package,
      color: "bg-purple-50 text-purple-600",
      link: "/admin/product-models",
    },
    {
      label: "常見問題",
      value: faqs?.length || 0,
      icon: HelpCircle,
      color: "bg-orange-50 text-orange-600",
      link: "/admin/faqs",
    },
    {
      label: "保固登錄",
      value: warranties?.length || 0,
      icon: FileText,
      color: "bg-green-50 text-green-600",
      link: "/admin/warranties",
    },
    {
      label: "客服工單",
      value: tickets?.length || 0,
      icon: ClipboardList,
      color: "bg-red-50 text-red-600",
      link: "/admin/tickets",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminNav />
      <AdminSidebar currentPath={location} />
      
      <main className="ml-64 pt-24 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-900">{t('admin.t_743e9cc9')}</h1>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <TrendingUp className="w-4 h-4" />
              <span>{t('admin.t_859692a9')}</span>
            </div>
          </div>
          
          {/* 關鍵業務指標卡片 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {keyStats.map((stat) => {
              const Icon = stat.icon;
              return (
                <Link key={stat.label} href={stat.link}>
                  <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={scrollToTop}>
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-3 rounded-lg ${stat.color}`}>
                        <Icon className="w-6 h-6" />
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                    <p className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</p>
                    <p className="text-xs text-gray-500">{stat.description}</p>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* 所有統計數據 */}
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">{t('admin.t_df5baa09')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {allStats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <Link key={stat.label} href={stat.link}>
                    <div className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer" onClick={scrollToTop}>
                      <div className={`p-3 rounded-lg ${stat.color}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">{stat.label}</p>
                        <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* 快速操作 */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">{t('admin.t_002df904')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Link href="/admin/settings">
                <div className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer" onClick={scrollToTop}>
                  <div className="p-2 bg-blue-50 text-blue-600 rounded">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{t('admin.t_052efceb')}</p>
                    <p className="text-sm text-gray-600">{t('admin.t_20fdac25')}</p>
                  </div>
                </div>
              </Link>
              
              <Link href="/admin/product-models">
                <div className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer" onClick={scrollToTop}>
                  <div className="p-2 bg-purple-50 text-purple-600 rounded">
                    <Package className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{t('admin.t_b0919a8a')}</p>
                    <p className="text-sm text-gray-600">{t('admin.t_bb9b186d')}</p>
                  </div>
                </div>
              </Link>
              
              <Link href="/admin/faqs">
                <div className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer" onClick={scrollToTop}>
                  <div className="p-2 bg-orange-50 text-orange-600 rounded">
                    <HelpCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{t('admin.t_fa0b4ecf')}</p>
                    <p className="text-sm text-gray-600">{t('admin.t_8f4b37b9')}</p>
                  </div>
                </div>
              </Link>
              
              <Link href="/admin/warranties">
                <div className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer" onClick={scrollToTop}>
                  <div className="p-2 bg-green-50 text-green-600 rounded">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{t('admin.t_b544b151')}</p>
                    <p className="text-sm text-gray-600">{t('admin.t_d75bcffa')}</p>
                  </div>
                </div>
              </Link>
              
              <Link href="/admin/tickets">
                <div className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer" onClick={scrollToTop}>
                  <div className="p-2 bg-red-50 text-red-600 rounded">
                    <ClipboardList className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{t('admin.t_0ab78d3f')}</p>
                    <p className="text-sm text-gray-600">{t('admin.t_2bae6cde')}</p>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
