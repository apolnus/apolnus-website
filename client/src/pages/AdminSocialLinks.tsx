import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import {
  MessageCircle,
  Facebook,
  Instagram,
  Youtube,
  Twitter,
  Linkedin,
  Loader2
} from "lucide-react";
import AdminNav, { AdminSidebar } from "@/components/AdminNav";
import { useLocation } from "wouter";

// Platform configurations for each locale
const PLATFORM_CONFIGS = {
  'zh-TW': [
    { platform: 'line', name: 'LINE', icon: MessageCircle, defaultUrl: '' },
    { platform: 'facebook', name: 'Facebook', icon: Facebook, defaultUrl: '' },
    { platform: 'instagram', name: 'Instagram', icon: Instagram, defaultUrl: '' },
    { platform: 'youtube', name: 'YouTube', icon: Youtube, defaultUrl: '' },
    { platform: 'twitter', name: 'X (Twitter)', icon: Twitter, defaultUrl: '' },
  ],
  'zh-CN': [
    { platform: 'wechat', name: '微信 (WeChat)', icon: MessageCircle, defaultUrl: '' },
    { platform: 'weibo', name: '微博 (Weibo)', icon: Twitter, defaultUrl: '' },
    { platform: 'douyin', name: '抖音 (Douyin)', icon: Youtube, defaultUrl: '' },
    { platform: 'xiaohongshu', name: '小紅書', icon: Instagram, defaultUrl: '' },
    { platform: 'bilibili', name: 'Bilibili', icon: Youtube, defaultUrl: '' },
  ],
  'en': [
    { platform: 'facebook', name: 'Facebook', icon: Facebook, defaultUrl: '' },
    { platform: 'instagram', name: 'Instagram', icon: Instagram, defaultUrl: '' },
    { platform: 'youtube', name: 'YouTube', icon: Youtube, defaultUrl: '' },
    { platform: 'twitter', name: 'X (Twitter)', icon: Twitter, defaultUrl: '' },
    { platform: 'linkedin', name: 'LinkedIn', icon: Linkedin, defaultUrl: '' },
  ],
  'ja': [
    { platform: 'line', name: 'LINE', icon: MessageCircle, defaultUrl: '' },
    { platform: 'twitter', name: 'X (Twitter)', icon: Twitter, defaultUrl: '' },
    { platform: 'instagram', name: 'Instagram', icon: Instagram, defaultUrl: '' },
    { platform: 'youtube', name: 'YouTube', icon: Youtube, defaultUrl: '' },
    { platform: 'facebook', name: 'Facebook', icon: Facebook, defaultUrl: '' },
  ],
};

type LocaleKey = keyof typeof PLATFORM_CONFIGS;

interface LinkState {
  platform: string;
  url: string;
  isActive: number;
  displayOrder: number;
}

export default function AdminSocialLinks() {
  const [location] = useLocation();
  const [activeLocale, setActiveLocale] = useState<LocaleKey>('zh-TW');
  const [links, setLinks] = useState<Record<string, LinkState>>({});

  const { data: existingLinks, isLoading } = trpc.socialLinks.getAllByLocale.useQuery(
    { locale: activeLocale }
  );

  // 當資料變化時更新 links state
  useEffect(() => {
    if (existingLinks) {
      const linksMap: Record<string, LinkState> = {};
      existingLinks.forEach((link) => {
        linksMap[link.platform] = {
          platform: link.platform,
          url: link.url,
          isActive: link.isActive,
          displayOrder: link.displayOrder,
        };
      });
      setLinks(linksMap);
    }
  }, [existingLinks]);

  const updateMutation = trpc.socialLinks.updateLinks.useMutation({
    onSuccess: () => {
      toast.success("社群平台連結已更新");
    },
    onError: (error) => {
      toast.error(`更新失敗: ${error.message}`);
    },
  });

  const handleSave = () => {
    const platformConfigs = PLATFORM_CONFIGS[activeLocale];
    const linksToSave = platformConfigs.map((config, index) => {
      const existingLink = links[config.platform];
      return {
        platform: config.platform,
        url: existingLink?.url || '',
        isActive: existingLink?.isActive ?? 1,
        displayOrder: existingLink?.displayOrder ?? index,
      };
    });

    updateMutation.mutate({
      locale: activeLocale,
      links: linksToSave,
    });
  };

  const handleUrlChange = (platform: string, url: string) => {
    setLinks(prev => ({
      ...prev,
      [platform]: {
        ...prev[platform],
        platform,
        url,
        isActive: prev[platform]?.isActive ?? 1,
        displayOrder: prev[platform]?.displayOrder ?? 0,
      },
    }));
  };

  const handleToggle = (platform: string, checked: boolean) => {
    setLinks(prev => ({
      ...prev,
      [platform]: {
        ...prev[platform],
        platform,
        isActive: checked ? 1 : 0,
        url: prev[platform]?.url || '',
        displayOrder: prev[platform]?.displayOrder ?? 0,
      },
    }));
  };

  const platformConfigs = PLATFORM_CONFIGS[activeLocale];

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNav />
      <AdminSidebar currentPath={location} />

      <div className="ml-64 pt-20 p-8">
        <div className="container mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">社群平台連結管理</h1>
            <p className="text-muted-foreground">
              針對不同語言/地區設定專屬的社群平台連結
            </p>
          </div>

          <Tabs value={activeLocale} onValueChange={(value) => setActiveLocale(value as LocaleKey)}>
            <TabsList className="mb-6">
              <TabsTrigger value="zh-TW">繁體中文 (台灣)</TabsTrigger>
              <TabsTrigger value="zh-CN">簡體中文 (中國)</TabsTrigger>
              <TabsTrigger value="en">English (國際)</TabsTrigger>
              <TabsTrigger value="ja">日本語 (日本)</TabsTrigger>
            </TabsList>

            <TabsContent value={activeLocale}>
              <Card>
                <CardHeader>
                  <CardTitle>
                    {activeLocale === 'zh-TW' && '台灣地區社群平台'}
                    {activeLocale === 'zh-CN' && '中國大陸地區社群平台'}
                    {activeLocale === 'en' && '國際地區社群平台'}
                    {activeLocale === 'ja' && '日本地區社群平台'}
                  </CardTitle>
                  <CardDescription>
                    設定在 footer 顯示的社群平台連結
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="w-6 h-6 animate-spin" />
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {platformConfigs.map((config) => {
                        const Icon = config.icon;
                        const linkData = links[config.platform];

                        return (
                          <div key={config.platform} className="flex items-start gap-4 p-4 border rounded-lg">
                            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                              <Icon className="w-6 h-6 text-primary" />
                            </div>

                            <div className="flex-1 space-y-3">
                              <div className="flex items-center justify-between">
                                <Label className="text-base font-semibold">{config.name}</Label>
                                <div className="flex items-center gap-2">
                                  <Label htmlFor={`${config.platform}-active`} className="text-sm">
                                    啟用
                                  </Label>
                                  <Switch
                                    id={`${config.platform}-active`}
                                    checked={linkData?.isActive === 1}
                                    onCheckedChange={(checked) => handleToggle(config.platform, checked)}
                                  />
                                </div>
                              </div>

                              <div className="space-y-2">
                                <Label htmlFor={`${config.platform}-url`}>連結 URL</Label>
                                <Input
                                  id={`${config.platform}-url`}
                                  type="url"
                                  placeholder={`https://...`}
                                  value={linkData?.url || ''}
                                  onChange={(e) => handleUrlChange(config.platform, e.target.value)}
                                />
                              </div>
                            </div>
                          </div>
                        );
                      })}

                      <div className="flex justify-end gap-3 pt-4">
                        <Button
                          onClick={handleSave}
                          disabled={updateMutation.isPending}
                        >
                          {updateMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                          儲存變更
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
