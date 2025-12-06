import { Link, useLocation } from "wouter";
import AdminNav, { AdminSidebar } from "@/components/AdminNav";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { trpc } from "@/lib/trpc";
import { Mail, Handshake, Package, HelpCircle, FileText, ClipboardList, TrendingUp, AlertCircle, Users as UsersIcon, LayoutDashboard, Settings } from "lucide-react";
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
    <div className="min-h-screen bg-gray-50 font-sans">
      <AdminNav />
      <AdminSidebar currentPath={location} />

      <main className="ml-64 pt-20 p-8 transition-all duration-300">
        <div className="max-w-7xl mx-auto space-y-8">

          {/* Welcome Section */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">儀表板</h1>
              <p className="text-sm text-gray-500 mt-1">歡迎回來，查看今日的系統概況。</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium px-2 py-1 bg-green-100 text-green-700 rounded-full">系統運作正常</span>
              <span className="text-xs text-gray-400">資料庫已連線</span>
            </div>
          </div>

          {/* Key Metrics Row - Highlights Critical Numbers */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { label: "待處理工單", value: dashboardStats?.pendingTickets || 0, icon: AlertCircle, color: "text-red-600 bg-red-50", link: "/admin/tickets", desc: "未解決的客服案件" },
              { label: "新保固登錄", value: dashboardStats?.totalWarranties || 0, icon: FileText, color: "text-blue-600 bg-blue-50", link: "/admin/warranties", desc: "累計產品註冊數" },
              { label: "合作夥伴申請", value: dashboardStats?.totalPartners || 0, icon: Handshake, color: "text-purple-600 bg-purple-50", link: "/admin/partners", desc: "等待審核中" },
              { label: "總訂閱人數", value: dashboardStats?.totalSubscribers || 0, icon: Mail, color: "text-emerald-600 bg-emerald-50", link: "/admin/subscribers", desc: "電子報訂閱清單" },
            ].map((stat, i) => {
              const Icon = stat.icon;
              return (
                <Link key={i} href={stat.link}>
                  <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer group" onClick={scrollToTop}>
                    <div className="flex justify-between items-start mb-4">
                      <div className={`p-3 rounded-lg ${stat.color} group-hover:scale-110 transition-transform`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-2xl font-bold text-gray-900">{stat.value}</span>
                    </div>
                    <h3 className="text-sm font-medium text-gray-700">{stat.label}</h3>
                    <p className="text-xs text-gray-400 mt-1">{stat.desc}</p>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Quick Access Grid - Functional Areas */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* System Management */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-5 border-b border-gray-100 bg-gray-50/50">
                <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                  <LayoutDashboard className="w-4 h-4 text-gray-500" />
                  系統管理
                </h2>
              </div>
              <div className="p-5 grid gap-4">
                <Link href="/admin/users">
                  <div className="flex items-center gap-4 p-3 rounded-lg border border-gray-100 hover:border-blue-200 hover:bg-blue-50/30 transition-all cursor-pointer group" onClick={scrollToTop}>
                    <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                      <UsersIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900">使用者管理</h3>
                      <p className="text-xs text-gray-500">管理角色與權限</p>
                    </div>
                    <div className="ml-auto text-xs font-bold bg-gray-100 px-2 py-1 rounded text-gray-600">
                      高優先
                    </div>
                  </div>
                </Link>

                <Link href="/admin/settings">
                  <div className="flex items-center gap-4 p-3 rounded-lg border border-gray-100 hover:border-gray-200 hover:bg-gray-50 transition-all cursor-pointer" onClick={scrollToTop}>
                    <div className="p-2 bg-gray-100 text-gray-600 rounded-lg">
                      <Settings className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900">網站設定</h3>
                      <p className="text-xs text-gray-500">全域系統配置</p>
                    </div>
                  </div>
                </Link>
              </div>
            </div>

            {/* Content Overview */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden lg:col-span-2">
              <div className="p-5 border-b border-gray-100 bg-gray-50/50">
                <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                  <Package className="w-4 h-4 text-gray-500" />
                  內容總覽
                </h2>
              </div>
              <div className="p-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { label: "產品型號", value: productModels?.length || 0, icon: Package, link: "/admin/product-models" },
                    { label: "常見問題", value: faqs?.length || 0, icon: HelpCircle, link: "/admin/faqs" },
                  ].map((item, idx) => {
                    const Icon = item.icon;
                    return (
                      <Link key={idx} href={item.link}>
                        <div className="flex items-center justify-between p-4 rounded-lg border border-gray-100 hover:bg-gray-50 hover:border-gray-200 transition-all cursor-pointer" onClick={scrollToTop}>
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-gray-100 text-gray-600 rounded-lg">
                              <Icon className="w-4 h-4" />
                            </div>
                            <span className="text-sm font-medium text-gray-700">{item.label}</span>
                          </div>
                          <span className="text-lg font-bold text-gray-900">{item.value}</span>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              </div>
            </div>

          </div>

        </div>
      </main >
    </div >
  );
}
