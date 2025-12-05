import { useState, useMemo } from "react";
import { ShoppingCart, ExternalLink, Store, MapPin, Phone, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { trpc } from "@/lib/trpc";
import { useTranslation } from "react-i18next";
import SEOHead from "@/components/seo/SEOHead";

export default function WhereToBuy() {
  const { t, i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState<"online" | "dealers">("online");
  const [selectedCity, setSelectedCity] = useState<string>("all");
  const [selectedDistrict, setSelectedDistrict] = useState<string>("all");
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const { data: dealersData } = trpc.dealers.getDealers.useQuery();
  
  // 獲取當前國家代碼 (從 i18n 語言映射到國家)
  const currentCountry = useMemo(() => {
    const langToCountry: Record<string, string> = {
      'zh-TW': 'tw',
      'en': 'us',
      'ja': 'jp',
      'ko': 'kr',
      'zh-CN': 'cn',
      'de': 'de',
      'fr': 'fr',
    };
    return langToCountry[i18n.language] || 'tw';
  }, [i18n.language]);
  
  // 從 API 獲取線上商店資料
  const { data: onlineStoresData } = trpc.dealers.getOnlineStores.useQuery({ country: currentCountry });

  // 分離官方商城和經銷平台
  const officialStore = useMemo(() => 
    onlineStoresData?.find(s => s.type === 'official'),
    [onlineStoresData]
  );
  
  const platformStores = useMemo(() => 
    onlineStoresData?.filter(s => s.type === 'platform') || [],
    [onlineStoresData]
  );

  // 使用從 API 獲取的經銷商資料，如果沒有則顯示空陣列
  const allDealers = dealersData || [];

  // Parse city and district from address
  const parseAddress = (address: string) => {
    // 嘗試解析逗號分隔格式："街道, 區域, 縣市"
    const parts = address.split(", ");
    if (parts.length >= 3) {
      return {
        street: parts[0],
        district: parts[1],
        city: parts[2],
      };
    }
    
    // 解析台灣地址格式："縣市+區域+街道"
    const cityMatch = address.match(/^([一-龥]+[市縣])/); // 匹配縣市
    const districtMatch = address.match(/[市縣]([一-龥]+[區鄉鎮市])/); // 匹配區域
    
    if (cityMatch && districtMatch) {
      const city = cityMatch[1];
      const district = districtMatch[1];
      const street = address.substring(city.length + district.length);
      return { city, district, street };
    }
    
    return { street: address, district: "", city: "" };
  };

  // Get unique cities
  const cities = useMemo(() => {
    const citySet = new Set<string>();
    allDealers.forEach((dealer) => {
      const { city } = parseAddress(dealer.address);
      if (city) citySet.add(city);
    });
    return Array.from(citySet).sort();
  }, [allDealers]);

  // Get districts for selected city
  const districts = useMemo(() => {
    if (selectedCity === "all") return [];
    const districtSet = new Set<string>();
    allDealers.forEach((dealer) => {
      const { city, district } = parseAddress(dealer.address);
      if (city === selectedCity && district) {
        districtSet.add(district);
      }
    });
    return Array.from(districtSet).sort();
  }, [allDealers, selectedCity]);

  // Filter dealers
  const dealers = useMemo(() => {
    return allDealers.filter((dealer) => {
      const { city, district } = parseAddress(dealer.address);
      
      // City filter
      if (selectedCity !== "all" && city !== selectedCity) {
        return false;
      }
      
      // District filter
      if (selectedDistrict !== "all" && district !== selectedDistrict) {
        return false;
      }
      
      // Keyword search
      if (searchKeyword) {
        const keyword = searchKeyword.toLowerCase();
        return (
          dealer.name.toLowerCase().includes(keyword) ||
          dealer.address.toLowerCase().includes(keyword) ||
          dealer.phone.includes(keyword)
        );
      }
      
      return true;
    });
  }, [allDealers, selectedCity, selectedDistrict, searchKeyword]);

  // Handle city change
  const handleCityChange = (value: string) => {
    setSelectedCity(value);
    setSelectedDistrict("all");
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <SEOHead pageKey="where-to-buy" />
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-[#1a2332] text-white pt-[124px] md:pt-[164px] pb-16">
        <div className="container">
          <h1 className="hero-title text-white">{t('whereToBuy.title')}</h1>
          <p className="hero-subtitle text-gray-300">{t('whereToBuy.subtitle')}</p>
        </div>
      </section>

      {/* Tabs */}
      <div className="border-b bg-white sticky top-16 z-10">
        <div className="container">
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab("online")}
              className={`px-6 py-4 font-medium transition-colors relative ${
                activeTab === "online"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >{t('whereToBuy.tabs.online')}</button>
            <button
              onClick={() => setActiveTab("dealers")}
              className={`px-6 py-4 font-medium transition-colors relative ${
                activeTab === "dealers"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >{t('whereToBuy.tabs.dealers')}</button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 py-12">
        <div className="container">
          {activeTab === "online" ? (
            <div className="space-y-12">
              {/* 模組 1: 官方商城 (DJI 風格 - Full-width) */}
              <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-8 md:p-12 border border-gray-200">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div>
                    <div className="inline-block bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium mb-4">{t('wheretobuy.t_a5c1f279')}</div>
                    <h2 className="text-3xl font-bold mb-4">{officialStore?.name || "Apolnus 官方商城"}</h2>
                    <p className="text-gray-600 mb-8">{t('wheretobuy.t_6c2a6a2d')}</p>
                  </div>
                  <div className="flex justify-end">
                    {officialStore?.url ? (
                      <a href={officialStore.url} target="_blank" rel="noopener noreferrer">
                        <Button 
                          size="lg" 
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                          onClick={() => {
                            // 追蹤「哪裡購買」按鈕點擊事件
                            // Meta Pixel: FindLocation 事件
                            if ((window as any).fbq) {
                              (window as any).fbq('track', 'FindLocation', {
                                content_name: 'Official Store',
                                content_category: 'Where to Buy'
                              });
                              console.log('[Meta Pixel] FindLocation event tracked: Official Store');
                            }

                            // GA4: view_promotion 事件
                            if ((window as any).gtag) {
                              (window as any).gtag('event', 'view_promotion', {
                                promotion_name: 'Official Store'
                              });
                              console.log('[GA4] view_promotion event tracked');
                            }
                          }}
                        >
                          {t('wheretobuy.t_5d2d8d08')}<ExternalLink className="ml-2 h-5 w-5" />
                        </Button>
                      </a>
                    ) : (
                      <Button size="lg" disabled className="bg-gray-300 text-gray-500 cursor-not-allowed">{t('wheretobuy.t_02364f76')}</Button>
                    )}
                  </div>
                </div>
              </div>

              {/* 模組 2: 經銷平台 (DJI 風格 - Grid 網格) */}
              {platformStores.length > 0 && (
                <div>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {platformStores.map((store) => (
                      <a
                        key={store.id}
                        href={store.url || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`block p-6 border-2 rounded-lg transition-all ${
                          store.url 
                            ? 'hover:shadow-lg hover:-translate-y-1 cursor-pointer border-gray-200' 
                            : 'cursor-not-allowed border-gray-100 bg-gray-50'
                        }`}
                        onClick={(e) => {
                          if (!store.url) {
                            e.preventDefault();
                            return;
                          }

                          // 追蹤經銷平台連結點擊事件
                          // Meta Pixel: FindLocation 事件
                          if ((window as any).fbq) {
                            (window as any).fbq('track', 'FindLocation', {
                              content_name: store.name,
                              content_category: 'Platform Store'
                            });
                            console.log('[Meta Pixel] FindLocation event tracked:', store.name);
                          }

                          // GA4: select_promotion 事件
                          if ((window as any).gtag) {
                            (window as any).gtag('event', 'select_promotion', {
                              promotion_name: store.name
                            });
                            console.log('[GA4] select_promotion event tracked');
                          }
                        }}
                      >
                        {/* Logo 區域 */}
                        <div className="flex items-center justify-center h-12 mb-4">
                          {store.logo ? (
                            <img 
                              src={store.logo} 
                              alt={store.name} 
                              className="max-h-12 object-contain"
                            />
                          ) : (
                            <Store className="w-12 h-12 text-gray-400" />
                          )}
                        </div>
                        {/* 平台名稱 */}
                        <h4 className="font-semibold text-center text-gray-800">{store.name}</h4>
                        {!store.url && (
                          <p className="text-sm text-gray-400 text-center mt-2">{t('wheretobuy.t_02364f76')}</p>
                        )}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div>
              {/* Filter Section */}
              <div className="bg-gray-50 rounded-xl p-6 mb-8">
                <p className="text-gray-700 mb-6">{t('whereToBuy.dealers.notice')}</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* City Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('whereToBuy.dealers.filter.city')}</label>
                    <select
                      value={selectedCity}
                      onChange={(e) => handleCityChange(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="all">{t('whereToBuy.dealers.filter.allCities')}</option>
                      {cities.map((city) => (
                        <option key={city} value={city}>
                          {city}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* District Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('whereToBuy.dealers.filter.district')}</label>
                    <select
                      value={selectedDistrict}
                      onChange={(e) => setSelectedDistrict(e.target.value)}
                      disabled={selectedCity === "all"}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                    >
                      <option value="all">{t('whereToBuy.dealers.filter.allDistricts')}</option>
                      {districts.map((district) => (
                        <option key={district} value={district}>
                          {district}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Search */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('whereToBuy.dealers.filter.search')}</label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        placeholder={t('whereToBuy.dealers.filter.searchPlaceholder')}
                        value={searchKeyword}
                        onChange={(e) => setSearchKeyword(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                {/* Clear Filters */}
                {(selectedCity !== "all" || selectedDistrict !== "all" || searchKeyword) && (
                  <div className="mt-4">
                    <button
                      onClick={() => {
                        setSelectedCity("all");
                        setSelectedDistrict("all");
                        setSearchKeyword("");
                      }}
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >{t('whereToBuy.t_6f3b2d89')}</button>
                  </div>
                )}
              </div>

              <p className="text-gray-600 mb-6">{t('whereToBuy.dealers.resultsCount', { count: dealers.length })}</p>
              <div className="grid gap-6">
                {dealers.length > 0 ? (
                  dealers.map((dealer) => (
                    <div key={dealer.id} className="border rounded-xl p-6 hover:shadow-lg transition-shadow bg-white">
                      <div className="flex items-start gap-4">
                        <Store className="w-8 h-8 text-blue-600 flex-shrink-0" />
                        <div className="flex-1">
                          <h3 className="font-bold text-lg mb-3">{dealer.name}</h3>
                          <div className="space-y-2 text-gray-600">
                            <div className="flex items-center gap-2">
                              <Phone className="w-4 h-4" />
                              <span>{dealer.phone}</span>
                            </div>
                            <div className="flex items-start gap-2">
                              <MapPin className="w-4 h-4 mt-0.5" />
                              <span>{dealer.address}</span>
                            </div>
                            {dealer.businessHours && (
                              <div className="text-sm text-gray-500">
                                營業時間：{dealer.businessHours}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 text-gray-500">{t('whereToBuy.dealers.noData')}</div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
