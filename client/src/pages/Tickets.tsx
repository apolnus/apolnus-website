import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FileText, Plus } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useTranslation } from "react-i18next";
import SEOHead from "@/components/seo/SEOHead";

export default function Tickets() {
  const { t } = useTranslation();
  const [, setLocation] = useLocation();
  const { user, isLoading: authLoading } = useAuth();
  const { data: tickets, isLoading } = trpc.tickets.myTickets.useQuery(undefined, {
    enabled: !!user,
  });

  if (authLoading || !user) {
    return (
      <>
      <SEOHead pageKey="profile" />
        <Navbar />
        <div className="min-h-screen bg-gray-50 pt-24 flex items-center justify-center">
          <p className="text-gray-600">{t('tickets.t_d3933730')}</p>
        </div>
        <Footer />
      </>
    );
  }

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { label: string; className: string }> = {
      pending: { label: "待處理", className: "bg-yellow-100 text-yellow-800" },
      in_progress: { label: "處理中", className: "bg-blue-100 text-blue-800" },
      replied: { label: "已回覆", className: "bg-green-100 text-green-800" },
      resolved: { label: "已解決", className: "bg-gray-100 text-gray-800" },
      closed: { label: "已關閉", className: "bg-gray-100 text-gray-600" },
    };

    const config = statusConfig[status] || statusConfig.pending;
    return (
      <span
        className={`px-2 py-1 text-xs font-medium rounded-full ${config.className}`}
      >
        {config.label}
      </span>
    );
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 pt-24">
        <div className="container mx-auto px-6 py-12">
          <div className="flex gap-8">
            {/* Sidebar */}
            <aside className="w-64 flex-shrink-0">
              <div className="bg-white rounded-lg shadow-sm p-4">
                <h2 className="text-lg font-semibold mb-4">{t('tickets.t_d54b7a35')}</h2>
                <p className="text-sm text-gray-600 mb-4">歡迎, {user.name}</p>
                <nav className="space-y-1">
                  <button
                    onClick={() => setLocation("/profile")}
                    className="w-full text-left px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>{t('tickets.t_0f9c039f')}</button>
                  <button
                    onClick={() => setLocation("/tickets")}
                    className="w-full text-left px-4 py-2 rounded-lg bg-blue-50 text-blue-700 flex items-center gap-2"
                  >
                    <FileText className="w-5 h-5" />{t('tickets.t_5939bcd7')}</button>
                  <button
                    onClick={() => setLocation("/profile")}
                    className="w-full text-left px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>{t('tickets.t_b2c3ac5d')}</button>
                  <button
                    onClick={() => setLocation("/profile")}
                    className="w-full text-left px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>{t('tickets.t_aa5dc876')}</button>
                  <button
                    onClick={() => {
                      window.location.href = "/api/auth/logout";
                    }}
                    className="w-full text-left px-4 py-2 rounded-lg text-red-600 hover:bg-red-50 flex items-center gap-2"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      />
                    </svg>{t('tickets.t_2f54b5bb')}</button>
                </nav>
              </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1">
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">{t('tickets.t_aa2c5f03')}</h1>
                <Button
                  onClick={() => setLocation("/support-ticket")}
                  className="flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />{t('tickets.t_8deb3404')}</Button>
              </div>

              {isLoading ? (
                <div className="text-center py-12">
                  <p className="text-gray-600">{t('tickets.t_d3933730')}</p>
                </div>
              ) : tickets && tickets.length > 0 ? (
                <div className="space-y-4">
                  {tickets.map((ticket) => (
                    <Card
                      key={ticket.id}
                      className="p-6 hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => setLocation(`/tickets/${ticket.id}`)}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-semibold text-lg text-gray-900 mb-1">
                            {ticket.issueTitle}
                          </h3>
                          <p className="text-sm text-gray-600">
                            工單編號: #{ticket.id}
                          </p>
                        </div>
                        {getStatusBadge(ticket.status)}
                      </div>
                      <div className="flex gap-6 text-sm text-gray-600">
                        <span>產品型號: {ticket.productModel}</span>
                        <span>
                          建立時間:{" "}
                          {new Date(ticket.createdAt).toLocaleDateString("zh-TW")}
                        </span>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                  <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600 mb-6">{t('tickets.t_e329e543')}</p>
                  <Button
                    onClick={() => setLocation("/support-ticket")}
                    className="flex items-center gap-2 mx-auto"
                  >
                    <Plus className="w-4 h-4" />{t('tickets.t_5d44368c')}</Button>
                </div>
              )}
            </main>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
