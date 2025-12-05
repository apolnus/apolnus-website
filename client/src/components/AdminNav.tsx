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

export function AdminSidebar({ currentPath }: AdminSidebarProps) {
  const menuItems = [
    { path: "/admin", label: "儀表板", icon: LayoutDashboard },
    { path: "/admin/subscribers", label: "訂閱者管理", icon: Mail },
    { path: "/admin/partners", label: "合作夥伴管理", icon: Handshake },
    { path: "/admin/settings", label: "網站設定", icon: Settings },
    { path: "/admin/product-models", label: "產品型號管理", icon: Package },
    { path: "/admin/faqs", label: "常見問題管理", icon: HelpCircle },
    { path: "/admin/warranties", label: "保固登錄管理", icon: FileText },
    { path: "/admin/tickets", label: "工單管理", icon: ClipboardList },
    { path: "/admin/dealers", label: "授權經銷商管理", icon: Store },
    { path: "/admin/service-centers", label: "授權維修中心管理", icon: Wrench },
    { path: "/admin/online-stores", label: "線上銷售渠道管理", icon: ShoppingCart },
    { path: "/admin/seo", label: "SEO 管理", icon: Search },
    { path: "/admin/translations", label: "AI 翻譯管理", icon: Languages },
    { path: "/admin/social-links", label: "社群平台連結", icon: Share2 },
    { path: "/admin/jobs", label: "職缺管理", icon: Briefcase },
  ];

  return (
    <aside className="fixed left-0 top-16 bottom-0 w-64 bg-gray-50 border-r border-gray-200 overflow-y-auto">
      <nav className="p-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPath === item.path;
          
          return (
            <Link key={item.path} href={item.path}>
              <div
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors cursor-pointer ${
                  isActive
                    ? "bg-blue-50 text-blue-600 font-medium"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </div>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
