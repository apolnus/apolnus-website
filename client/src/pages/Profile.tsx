import { useState } from "react";
import { useTranslation } from 'react-i18next';
import { User, Shield, MessageSquare, Settings, LogOut } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import SEOHead from "@/components/seo/SEOHead";
import { toast } from "sonner";

export default function Profile() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<"overview" | "settings">("overview");
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const { user, isAuthenticated, isLoading } = useAuth();
  const { data: warranties, isLoading: loadingWarranties } = trpc.warranty.list.useQuery(undefined, {
    enabled: isAuthenticated,
  });
  const { data: tickets, isLoading: loadingTickets } = trpc.tickets.myTickets.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  // Account settings state
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [address, setAddress] = useState(user?.address || "");
  const utils = trpc.useUtils();
  const updateProfile = trpc.user.updateProfile.useMutation({
    onSuccess: () => {
      toast.success("個人資料已更新");
      utils.user.me.invalidate();
    },
    onError: (error) => {
      toast.error(`更新失敗: ${error.message}`);
    },
  });

  const handleSaveProfile = () => {
    updateProfile.mutate({
      name: name || undefined,
      email: email || undefined,
      phone: phone || undefined,
      address: address || undefined,
    });
  };

  const handleLogout = () => {
    window.location.href = "/api/auth/logout";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <SEOHead pageKey="profile" />
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">{t('profile.t_d3933730')}</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <div className="flex-1 flex items-center justify-center py-16">
          <div className="container max-w-md text-center">
            <div className="bg-white rounded-2xl p-8 border shadow-sm">
              <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h1 className="text-2xl font-bold mb-4">{t('profile.t_7174cce7')}</h1>
              <p className="text-gray-600 mb-6">{t('profile.t_2b5d7f4b')}</p>
              <Link href="/login">
                <Button
                  className="bg-blue-600 hover:bg-blue-700 text-white w-full"
                >{t('profile.t_c8ee6c82')}</Button>
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-blue-100 pt-[124px] md:pt-[164px] pb-16 border-b">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center overflow-hidden">
                  {user?.avatar ? (
                    <img src={user.avatar} alt={user.name || "User"} className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-8 h-8 text-white" />
                  )}
                </div>
                <div>
                  <h1 className="text-3xl font-bold">{t('profile.t_f2be7e3b')}</h1>
                  <p className="text-gray-700">歡迎回來，{user?.name || "用戶"}</p>
                  <p className="text-sm text-gray-500">{user?.email}</p>
                </div>
              </div>

              <Button
                variant="outline"
                onClick={handleLogout}
                className="hidden md:flex gap-2 text-red-600 border-red-200 hover:bg-red-50"
              >
                <LogOut className="w-4 h-4" />
                登出
              </Button>
            </div>

            {/* Tab Navigation */}
            <div className="flex gap-4 mt-6">
              <button
                onClick={() => setActiveTab("overview")}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === "overview"
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                  }`}
              >{t('profile.t_dfe666da')}</button>
              <button
                onClick={() => setActiveTab("settings")}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === "settings"
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                  }`}
              >{t('profile.t_00ea9671')}</button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            {activeTab === "overview" ? (
              <>
                {/* Quick Actions */}
                <div className="grid md:grid-cols-3 gap-6 mb-12">
                  <Link href="/support/warranty">
                    <div className="block" onClick={scrollToTop}>
                      <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                        <CardHeader>
                          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
                            <Shield className="w-6 h-6 text-blue-600" />
                          </div>
                          <CardTitle className="text-lg">{t('profile.t_acf6c03c')}</CardTitle>
                          <CardDescription>{t('profile.t_bcf46d9e')}</CardDescription>
                        </CardHeader>
                      </Card>
                    </div>
                  </Link>

                  <Link href="/support-ticket">
                    <div className="block" onClick={scrollToTop}>
                      <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                        <CardHeader>
                          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-3">
                            <MessageSquare className="w-6 h-6 text-green-600" />
                          </div>
                          <CardTitle className="text-lg">{t('profile.t_addb3640')}</CardTitle>
                          <CardDescription>{t('profile.t_b5fbda72')}</CardDescription>
                        </CardHeader>
                      </Card>
                    </div>
                  </Link>

                  <button onClick={() => setActiveTab("settings")} className="text-left">
                    <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                      <CardHeader>
                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-3">
                          <Settings className="w-6 h-6 text-purple-600" />
                        </div>
                        <CardTitle className="text-lg">{t('profile.t_00ea9671')}</CardTitle>
                        <CardDescription>{t('profile.t_8f1b4356')}</CardDescription>
                      </CardHeader>
                    </Card>
                  </button>
                </div>

                {/* Warranty Registrations */}
                <Card className="mb-8">
                  <CardHeader>
                    <CardTitle>{t('profile.t_2c0c4751')}</CardTitle>
                    <CardDescription>{t('profile.t_433c0600')}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {loadingWarranties ? (
                      <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                        <p className="text-sm text-gray-600">{t('profile.t_d3933730')}</p>
                      </div>
                    ) : warranties && warranties.length > 0 ? (
                      <div className="space-y-4">
                        {warranties.map((warranty: any) => (
                          <div
                            key={warranty.id}
                            className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                          >
                            <div>
                              <h4 className="font-medium">{warranty.productModel}</h4>
                              <p className="text-sm text-gray-600">序號：{warranty.serialNumber}</p>
                              <p className="text-sm text-gray-500">
                                購買日期：{new Date(warranty.purchaseDate).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="text-right">
                              <span className="inline-block px-3 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">{t('profile.t_43341844')}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Shield className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-600 mb-4">{t('profile.t_58880694')}</p>
                        <Link href="/support/warranty">
                          <Button variant="outline" className="border-gray-300">{t('profile.t_bd4f320f')}</Button>
                        </Link>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Support Tickets */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>{t('profile.t_6615594b')}</CardTitle>
                        <CardDescription>{t('profile.t_8037d0da')}</CardDescription>
                      </div>
                      <Link href="/support-ticket">
                        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                          {t('profile.t_cd0a4047')}
                        </Button>
                      </Link>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {loadingTickets ? (
                      <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                        <p className="text-sm text-gray-600">{t('profile.t_d3933730')}</p>
                      </div>
                    ) : tickets && tickets.length > 0 ? (
                      <div className="space-y-4">
                        {tickets.map((ticket: any) => (
                          <Link key={ticket.id} href={`/tickets/${ticket.id}`}>
                            <div
                              className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-all hover:shadow-md"
                            >
                              <div>
                                <h4 className="font-medium">{ticket.issueTitle}</h4>
                                <p className="text-sm text-gray-600 line-clamp-1">{ticket.issueDescription}</p>
                                <p className="text-sm text-gray-500">
                                  {new Date(ticket.createdAt).toLocaleDateString()}
                                </p>
                              </div>
                              <div className="text-right flex flex-col items-end gap-2">
                                {ticket.unreadCount > 0 && (
                                  <span className="inline-block px-2 py-1 text-xs font-medium rounded bg-red-500 text-white">
                                    新回覆 ({ticket.unreadCount})
                                  </span>
                                )}
                                <span
                                  className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${ticket.status === "pending"
                                      ? "bg-yellow-100 text-yellow-800"
                                      : ticket.status === "in_progress"
                                        ? "bg-blue-100 text-blue-800"
                                        : ticket.status === "resolved"
                                          ? "bg-green-100 text-green-800"
                                          : "bg-gray-100 text-gray-800"
                                    }`}
                                >
                                  {ticket.status === "pending"
                                    ? "待處理"
                                    : ticket.status === "in_progress"
                                      ? "處理中"
                                      : ticket.status === "resolved"
                                        ? "已解決"
                                        : "已關閉"}
                                </span>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-600 mb-4">{t('profile.t_376f3a7d')}</p>
                        <Link href="/support-ticket">
                          <Button variant="outline" className="border-gray-300">{t('profile.t_cd0a4047')}</Button>
                        </Link>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </>
            ) : (
              /* Account Settings Tab */
              <Card>
                <CardHeader>
                  <CardTitle>{t('profile.t_00ea9671')}</CardTitle>
                  <CardDescription>{t('profile.t_193ee6e8')}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Basic Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">{t('profile.t_63f2f203')}</h3>

                    <div className="space-y-2">
                      <Label htmlFor="name">{t('profile.t_60d0458a')}</Label>
                      <Input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder={t('profile.t_a267bca0')}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">{t('profile.t_007fa6b4')}</Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder={t('profile.t_4593ebb2')}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">{t('profile.t_f7e4f10d')}</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder={t('profile.t_a27fda70')}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address">{t('profile.t_8ce7b9a0')}</Label>
                      <Input
                        id="address"
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder={t('profile.t_b545a5fa')}
                      />
                    </div>
                  </div>

                  {/* Save Button */}
                  <div className="flex justify-between items-center pt-6 border-t">
                    <Button
                      variant="destructive"
                      onClick={handleLogout}
                      className="md:hidden flex gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      登出
                    </Button>

                    <Button
                      onClick={handleSaveProfile}
                      disabled={updateProfile.isPending}
                      className="bg-blue-600 hover:bg-blue-700 text-white ml-auto"
                    >
                      {updateProfile.isPending ? "儲存中..." : "儲存變更"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
