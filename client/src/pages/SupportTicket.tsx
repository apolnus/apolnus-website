import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { CheckCircle2, Info } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useTranslation } from "react-i18next";
import SEOHead from "@/components/seo/SEOHead";

function LoginPrompt({ redirectUrl }: { redirectUrl: string }) {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen flex flex-col">
      <SEOHead pageId="support-ticket" />
      <Navbar />
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">需要登入</CardTitle>
            <CardDescription>{t('supportticket.t_702cc9fd')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              className="w-full"
              variant="outline"
              onClick={() => window.location.href = `/api/auth/google?redirect=${redirectUrl}`}
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>使用 Google 登入</Button>
            <Button
              className="w-full"
              variant="outline"
              onClick={() => window.location.href = `/api/auth/line?redirect=${redirectUrl}`}
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"/>
              </svg>使用 LINE 登入</Button>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}

export default function SupportTicket() {
  const { t } = useTranslation();
  const [location, setLocationPath] = useLocation();
  const { user, isLoading } = useAuth();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    contactName: "",
    contactPhone: "",
    contactAddress: "",
    productModel: "",
    productSerial: "",
    purchaseDate: "",
    purchaseChannel: "",
    issueTitle: "",
    issueDescription: "",
  });

  const { data: productModels } = trpc.admin.productModels.list.useQuery();
  const createTicket = trpc.tickets.create.useMutation({
    onSuccess: () => {
      setIsSubmitted(true);
      toast.success("工單已成功提交!");

      // 追蹤客服工單提交事件
      // Meta Pixel: Contact 事件
      if ((window as any).fbq) {
        (window as any).fbq('track', 'Contact', {
          content_name: 'Support Ticket',
          content_category: 'Customer Support'
        });
        console.log('[Meta Pixel] Contact event tracked');
      }

      // Meta Pixel: Lead 事件 (也可以同時觸發)
      if ((window as any).fbq) {
        (window as any).fbq('track', 'Lead', {
          content_name: 'Support Ticket Submission'
        });
        console.log('[Meta Pixel] Lead event tracked');
      }

      // GA4: generate_lead 事件
      if ((window as any).gtag) {
        (window as any).gtag('event', 'generate_lead', {
          currency: 'TWD',
          value: 0
        });
        console.log('[GA4] generate_lead event tracked');
      }
    },
    onError: (error) => {
      toast.error(`提交失敗:${error.message}`);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.contactName) {
      toast.error("請填寫聯絡人姓名");
      return;
    }
    if (!formData.contactPhone) {
      toast.error("請填寫聯絡電話");
      return;
    }
    if (!formData.contactAddress) {
      toast.error("請填寫聯絡地址");
      return;
    }
    if (!formData.productModel) {
      toast.error("請選擇產品型號");
      return;
    }
    if (!formData.issueTitle) {
      toast.error("請填寫問題標題");
      return;
    }
    if (!formData.issueDescription) {
      toast.error("請填寫問題描述");
      return;
    }

    createTicket.mutate({
      contactName: formData.contactName,
      contactPhone: formData.contactPhone,
      contactAddress: formData.contactAddress,
      productModel: formData.productModel,
      productSerial: formData.productSerial || undefined,
      purchaseDate: formData.purchaseDate || undefined,
      purchaseChannel: formData.purchaseChannel || undefined,
      issueTitle: formData.issueTitle,
      issueDescription: formData.issueDescription,
    });
  };

  // 如果正在載入,顯示載入中
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">載入中...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // 如果未登入,顯示登入提示
  if (!user) {
    const redirectUrl = encodeURIComponent(location);
    return <LoginPrompt redirectUrl={redirectUrl} />;
  }

  // 已登入,顯示表單
  // 自動填入用戶名稱
  if (user && !formData.contactName) {
    setFormData({ ...formData, contactName: user.name || "" });
  }

  // 提交成功頁面
  if (isSubmitted) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <SEOHead pageKey="support-ticket" />
        <Navbar />
        <div className="flex-1 flex items-center justify-center py-16">
          <div className="container max-w-2xl">
            <div className="bg-white rounded-2xl p-8 md:p-12 text-center border shadow-sm">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-10 h-10 text-green-600" />
              </div>
              <h1 className="text-3xl font-bold mb-4">{t('supportticket.t_164c52d6')}</h1>
              <p className="text-gray-600 mb-8">{t('supportticket.t_7c6cd211')}</p>
              <Button onClick={() => setLocationPath("/profile")}>{t('supportticket.t_90590871')}</Button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <SEOHead pageKey="support-ticket" />
      <Navbar />
      <div className="flex-1 py-12">
        <div className="container max-w-3xl">
          <div className="bg-white rounded-2xl p-6 md:p-10 border shadow-sm">
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">建立客服工單</h1>
              <p className="text-gray-600">{t('supportticket.t_45ef7605')}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Contact Name */}
                <div>
                  <Label htmlFor="contactName">{t('supportticket.t_db47cac3')}</Label>
                  <Input
                    id="contactName"
                    value={formData.contactName}
                    onChange={(e) =>
                      setFormData({ ...formData, contactName: e.target.value })
                    }
                    placeholder="請輸入您的姓名"
                  />
                </div>

                {/* Contact Phone */}
                <div>
                  <Label htmlFor="contactPhone">{t('supportticket.t_ec6d8d0f')}</Label>
                  <Input
                    id="contactPhone"
                    value={formData.contactPhone}
                    onChange={(e) =>
                      setFormData({ ...formData, contactPhone: e.target.value })
                    }
                    placeholder="請輸入聯絡電話"
                  />
                </div>

                {/* Contact Address */}
                <div className="md:col-span-2">
                  <Label htmlFor="contactAddress">{t('supportticket.t_795136d6')}</Label>
                  <Input
                    id="contactAddress"
                    value={formData.contactAddress}
                    onChange={(e) =>
                      setFormData({ ...formData, contactAddress: e.target.value })
                    }
                    placeholder={t('supportticket.t_73eac54d')}
                  />
                </div>

                {/* Product Model */}
                <div>
                  <Label htmlFor="productModel">{t('supportticket.t_27910019')}</Label>
                  <Select
                    value={formData.productModel}
                    onValueChange={(value) =>
                      setFormData({ ...formData, productModel: value })
                    }
                  >
                    <SelectTrigger id="productModel">
                      <SelectValue placeholder="請選擇產品型號" />
                    </SelectTrigger>
                    <SelectContent>
                      {productModels?.map((model) => (
                        <SelectItem key={model.id} value={model.name}>
                          {model.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Product Serial */}
                <div>
                  <Label htmlFor="productSerial">{t('supportticket.t_ab2908ea')}</Label>
                  <Input
                    id="productSerial"
                    value={formData.productSerial}
                    onChange={(e) =>
                      setFormData({ ...formData, productSerial: e.target.value })
                    }
                    placeholder="請輸入產品序號"
                  />
                </div>

                {/* Purchase Date */}
                <div>
                  <Label htmlFor="purchaseDate">{t('supportticket.t_37fd1214')}</Label>
                  <Input
                    id="purchaseDate"
                    type="date"
                    value={formData.purchaseDate}
                    onChange={(e) =>
                      setFormData({ ...formData, purchaseDate: e.target.value })
                    }
                  />
                </div>

                {/* Purchase Channel */}
                <div>
                  <Label htmlFor="purchaseChannel">購買管道（非必填）</Label>
                  <Select
                    value={formData.purchaseChannel}
                    onValueChange={(value) =>
                      setFormData({ ...formData, purchaseChannel: value })
                    }
                  >
                    <SelectTrigger id="purchaseChannel">
                      <SelectValue placeholder="請選擇購買管道" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="官方網站">官方網站</SelectItem>
                      <SelectItem value="授權經銷商">授權經銷商</SelectItem>
                      <SelectItem value="線上購物平台">線上購物平台</SelectItem>
                      <SelectItem value="實體零售店">實體零售店</SelectItem>
                      <SelectItem value="其他">其他</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Issue Title */}
                <div className="md:col-span-2">
                  <Label htmlFor="issueTitle">{t('supportticket.t_14a3d6b9')}</Label>
                  <Input
                    id="issueTitle"
                    value={formData.issueTitle}
                    onChange={(e) =>
                      setFormData({ ...formData, issueTitle: e.target.value })
                    }
                    placeholder={t('supportticket.t_cb57ff13')}
                  />
                </div>

                {/* Issue Description */}
                <div className="md:col-span-2">
                  <Label htmlFor="issueDescription">{t('supportticket.t_26997673')}</Label>
                  <Textarea
                    id="issueDescription"
                    value={formData.issueDescription}
                    onChange={(e) =>
                      setFormData({ ...formData, issueDescription: e.target.value })
                    }
                    placeholder={t('supportticket.t_2dd0d12f')}
                    rows={5}
                  />
                </div>
              </div>

              {/* Info Notice */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
                <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-blue-900">{t('supportticket.t_4fb03776')}</p>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full"
                disabled={createTicket.isPending}
              >
                {createTicket.isPending ? "提交中..." : "提交客服工單"}
              </Button>
            </form>
          </div>

          {/* Notice Section */}
          <div className="mt-8 bg-white rounded-2xl p-6 md:p-8 border shadow-sm">
            <h2 className="text-xl font-bold mb-4">{t('supportticket.t_9e10d660')}</h2>
            <ul className="space-y-2 text-gray-600">
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>{t('supportticket.t_13cf0dc5')}</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>{t('supportticket.t_574da8c3')}</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>{t('supportticket.t_a40b2272')}</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>{t('supportticket.t_645ddf57')}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
