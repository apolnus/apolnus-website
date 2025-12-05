import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CheckCircle2, Info } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { trpc } from "@/lib/trpc";
import { useTranslation } from "react-i18next";
import SEOHead from "@/components/seo/SEOHead";
import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const warrantySchema = z.object({
  name: z.string().min(1, "姓名為必填"),
  email: z.string().email("請輸入有效的電子郵件"),
  phone: z.string().min(1, "聯絡電話為必填"),
  productModel: z.string().min(1, "請選擇產品型號"),
  serialNumber: z.string().min(1, "產品序號為必填"),
  purchaseDate: z.string().min(1, "購買日期為必填"),
  purchaseChannel: z.string().optional(),
  notes: z.string().optional(),
});

type WarrantyFormData = z.infer<typeof warrantySchema>;

function LoginPrompt({ redirectUrl }: { redirectUrl: string }) {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen flex flex-col">
      <SEOHead pageId="warranty-registration" />
      <Navbar />
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">{t('warrantyregistration.t_52f8ac04')}</CardTitle>
            <CardDescription>{t('warrantyregistration.t_cfbd04f3')}</CardDescription>
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
              </svg>{t('warrantyregistration.t_65ef512c')}</Button>
            <Button
              className="w-full"
              variant="outline"
              onClick={() => window.location.href = `/api/auth/line?redirect=${redirectUrl}`}
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"/>
              </svg>{t('warrantyregistration.t_a782f892')}</Button>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}

export default function WarrantyRegistration() {
  const { t } = useTranslation();
  const { user, isLoading } = useAuth();
  const [location] = useLocation();
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    control,
  } = useForm<WarrantyFormData>({
    resolver: zodResolver(warrantySchema),
  });

  const { data: productModels } = trpc.admin.productModels.list.useQuery();
  const registerWarranty = trpc.warranty.register.useMutation({
    onSuccess: () => {
      setIsSubmitted(true);
      toast.success("保固登錄成功！");

      // 追蹤保固註冊完成事件
      // Meta Pixel: CompleteRegistration 事件
      if ((window as any).fbq) {
        (window as any).fbq('track', 'CompleteRegistration', {
          content_name: 'Warranty Registration',
          status: 'completed'
        });
        console.log('[Meta Pixel] CompleteRegistration event tracked');
      }

      // GA4: sign_up 事件
      if ((window as any).gtag) {
        (window as any).gtag('event', 'sign_up', {
          method: 'warranty_registration'
        });
        console.log('[GA4] sign_up event tracked');
      }
    },
    onError: (error) => {
      toast.error("保固登錄失敗：" + error.message);
    },
  });

  const onSubmit = (data: WarrantyFormData) => {
    registerWarranty.mutate(data);
  };

  const productModel = watch("productModel");
  const purchaseChannel = watch("purchaseChannel");

  // 如果正在載入,顯示載入中
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">{t('warrantyregistration.t_d3933730')}</p>
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

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
      <SEOHead pageKey="warranty-registration" />
        <Navbar />
        <div className="flex-1 flex items-center justify-center py-16">
          <div className="container max-w-2xl">
            <div className="bg-white rounded-2xl p-8 md:p-12 text-center border shadow-sm">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-10 h-10 text-green-600" />
              </div>
              <h1 className="text-3xl font-bold mb-4">{t('warrantyRegistration.t_26bb16fe')}</h1>
              <p className="text-gray-600 mb-8">{t('warrantyRegistration.t_cb8851e8')}</p>
              <Button onClick={() => window.location.href = "/profile"}>
                {t('warrantyRegistration.t_3e2c4c6f')}
              </Button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <SEOHead pageKey="warranty-registration" />
      <Navbar />
      <div className="flex-1 py-12">
        <div className="container max-w-3xl">
          <div className="bg-white rounded-2xl p-6 md:p-10 border shadow-sm">
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">{t('warrantyregistration.t_acf6c03c')}</h1>
              <p className="text-gray-600">{t('warrantyregistration.t_0968a76a')}</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="name">{t('warrantyregistration.t_5813d2ec')}</Label>
                  <Input
                    id="name"
                    {...register("name")}
                    placeholder={t('warrantyregistration.t_a267bca0')}
                  />
                  {errors.name && (
                    <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="email">{t('warrantyregistration.t_490e1ba6')}</Label>
                  <Input
                    id="email"
                    type="email"
                    {...register("email")}
                    placeholder={t('warrantyregistration.t_1b91c7e7')}
                  />
                  {errors.email && (
                    <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="phone">{t('warrantyregistration.t_ec6d8d0f')}</Label>
                  <Input
                    id="phone"
                    {...register("phone")}
                    placeholder={t('warrantyregistration.t_6b5e2cf1')}
                  />
                  {errors.phone && (
                    <p className="text-sm text-red-500 mt-1">{errors.phone.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="productModel">{t('warrantyregistration.t_27910019')}</Label>
                  <Controller
                    name="productModel"
                    control={control}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger id="productModel">
                          <SelectValue placeholder={t('warrantyregistration.t_b3123773')} />
                        </SelectTrigger>
                        <SelectContent>
                          {productModels?.map((model) => (
                            <SelectItem key={model.id} value={model.name}>
                              {model.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.productModel && (
                    <p className="text-sm text-red-500 mt-1">{errors.productModel.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="serialNumber">{t('warrantyregistration.t_b4f425d8')}</Label>
                  <Input
                    id="serialNumber"
                    {...register("serialNumber")}
                    placeholder={t('warrantyregistration.t_e389cc77')}
                  />
                  {errors.serialNumber && (
                    <p className="text-sm text-red-500 mt-1">{errors.serialNumber.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="purchaseDate">{t('warrantyregistration.t_aeb5fbfb')}</Label>
                  <Input
                    id="purchaseDate"
                    type="date"
                    {...register("purchaseDate")}
                  />
                  {errors.purchaseDate && (
                    <p className="text-sm text-red-500 mt-1">{errors.purchaseDate.message}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="purchaseChannel">{t('warrantyregistration.t_73fda7ca')}</Label>
                  <Controller
                    name="purchaseChannel"
                    control={control}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger id="purchaseChannel">
                          <SelectValue placeholder={t('warrantyregistration.t_32bfd5ec')} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="official">{t('warrantyregistration.t_f4773a89')}</SelectItem>
                          <SelectItem value="dealer">{t('warrantyregistration.t_f67a7ece')}</SelectItem>
                          <SelectItem value="online">{t('warrantyregistration.t_32976506')}</SelectItem>
                          <SelectItem value="retail">{t('warrantyregistration.t_79c1dd9c')}</SelectItem>
                          <SelectItem value="other">{t('warrantyregistration.t_0d98c747')}</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="notes">{t('warrantyregistration.t_aeb2ba2e')}</Label>
                  <Textarea
                    id="notes"
                    {...register("notes")}
                    placeholder={t('warrantyregistration.t_288a4a45')}
                    rows={4}
                  />
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-blue-900">{t('warrantyregistration.t_f479e1b4')}</p>
              </div>

              <Button type="submit" className="w-full" disabled={registerWarranty.isPending}>
                {registerWarranty.isPending ? '登錄中...' : '提交保固登錄'}
              </Button>
            </form>
          </div>

          <div className="mt-8 p-6 bg-white rounded-xl border">
            <h2 className="text-xl font-semibold mb-4">{t('warrantyregistration.t_a115a5c3')}</h2>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>{t('warrantyregistration.t_3573fcef')}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>{t('warrantyregistration.t_33069d1b')}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>{t('warrantyregistration.t_c7a61741')}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>{t('warrantyregistration.t_e840863c')}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
