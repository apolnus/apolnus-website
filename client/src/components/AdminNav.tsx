import { Link } from "wouter";
import { APP_LOGO } from "@/const";
import {
  LayoutDashboard,
  Mail,
  Handshake,
  Settings,
  Package,
  HelpCircle,
  FileText,
  ClipboardList,
  Store,
  Wrench,
  Search,
  Languages,
  Share2,
  ShoppingCart,
  Briefcase,
  Users,
} from "lucide-react";

export default function AdminNav() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
      <div className="w-full px-6 md:px-12">
        <div className="flex items-center justify-between h-16">
          {/* Logo - 點擊回到首頁 */}
          <Link href="/">
            <div className="flex items-center cursor-pointer" onClick={scrollToTop}>
              <img src={APP_LOGO} alt="Apolnus" className="h-8" />
            </div>
          </Link>

          {/* 管理後台標題 */}
          <h1 className="text-lg font-semibold text-gray-800">管理後台</h1>

          {/* 返回管理後台按鈕 */}
          <Link href="/admin">
            <div className="text-sm text-gray-600 hover:text-gray-900 cursor-pointer" onClick={scrollToTop}>
              返回管理後台
            </div>
          </Link>
        </div>
      </div>
    </nav>
  );
}

interface AdminSidebarProps {
  currentPath: string;
}

type MenuItem = {
  path: string;
  label: string;
  icon: any;
};

type MenuCategory = {
  title: string;
  items: MenuItem[];
};

export function AdminSidebar({ currentPath }: AdminSidebarProps) {
  const categories: MenuCategory[] = [
    {
      title: "Overview",
      items: [
        { path: "/admin", label: "儀表板", icon: LayoutDashboard },
      ]
    },
    {
      title: "商務管理",
      items: [
        { path: "/admin/warranties", label: "保固登錄管理", icon: FileText },
        { path: "/admin/tickets", label: "工單管理", icon: ClipboardList },
        { path: "/admin/partners", label: "合作夥伴申請", icon: Handshake },
        { path: "/admin/subscribers", label: "訂閱者管理", icon: Mail },
      ]
    },
    {
      title: "內容管理",
      items: [
        { path: "/admin/product-models", label: "產品型號", icon: Package },
        { path: "/admin/faqs", label: "常見問題", icon: HelpCircle },
        { path: "/admin/jobs", label: "職缺管理", icon: Briefcase },
        { path: "/admin/seo", label: "SEO 設定", icon: Search },
        { path: "/admin/translations", label: "AI 翻譯", icon: Languages },
      ]
    },
    {
      title: "營運與據點",
      items: [
        { path: "/admin/dealers", label: "授權經銷商", icon: Store },
        { path: "/admin/service-centers", label: "授權維修中心", icon: Wrench },
        { path: "/admin/online-stores", label: "線上銷售通路", icon: ShoppingCart },
        { path: "/admin/social-links", label: "社群連結", icon: Share2 },
      ]
    },
    {
      title: "系統設定",
      items: [
        { path: "/admin/users", label: "使用者管理", icon: Users },
        { path: "/admin/settings", label: "網站設定", icon: Settings },
      ]
    }
  ];

  return (
    <aside className="fixed left-0 top-16 bottom-0 w-64 bg-white border-r border-gray-200 overflow-y-auto z-40 shadow-[4px_0_24px_-12px_rgba(0,0,0,0.1)]">
      <nav className="p-4 space-y-6">
        {categories.map((category, idx) => (
          <div key={category.title}>
            {category.title !== "Overview" && (
              <h3 className="px-4 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                {category.title}
              </h3>
            )}
            <div className="space-y-1">
              {category.items.map((item) => {
                const Icon = item.icon;
                const isActive = currentPath === item.path;

                return (
                  <Link key={item.path} href={item.path}>
                    <div
                      className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 cursor-pointer group ${isActive
                          ? "bg-slate-900 text-white shadow-md shadow-slate-200"
                          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                        }`}
                    >
                      <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-gray-500 group-hover:text-gray-900"}`} />
                      <span className="text-sm font-medium">{item.label}</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  );
}
