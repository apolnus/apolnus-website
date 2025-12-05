import { useState, useEffect, useMemo } from "react";
import { MapPin, Phone, Mail, Search, Wrench, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { trpc } from "@/lib/trpc";
import { useTranslation } from "react-i18next";
import SEOHead from "@/components/seo/SEOHead";

interface ServiceCenter {
  id: number;
  name: string;
  address: string;
  phone: string;
  businessHours: string | null;
  services: string | null;
  latitude: string | null;
  longitude: string | null;
  isActive: number;
  createdAt: Date;
  updatedAt: Date;
}

export default function ServiceCenters() {
  const { t } = useTranslation();
  const [selectedCity, setSelectedCity] = useState<string>("all");
  const [selectedDistrict, setSelectedDistrict] = useState<string>("all");
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  
  // 從 API 獲取授權維修中心資料
  const { data: serviceCentersData, isLoading } = trpc.dealers.getServiceCenters.useQuery();
  const serviceCenters = serviceCentersData || [];

  // 保留舊的 JSON 資料讀取作為備用（可以後續移除）
  useEffect(() => {
    // 如果需要從 JSON 檔案讀取資料，可以在這裡處理
    // fetch("/service-centers.json")
    //   .then((res) => res.json())
    //   .then((data) => {
    //     const activeCenters = data.filter((center: ServiceCenter) => center.isActive === "1");
    //     setServiceCenters(activeCenters);
    //   })
    //   .catch((error) => console.error("Error loading service centers:", error));
  }, []);

  // Parse city and district from address
  const parseAddress = (address: string) => {
    const parts = address.split(", ");
    if (parts.length >= 3) {
      return {
        street: parts[0],
        district: parts[1],
        city: parts[2],
      };
    }
    return { street: address, district: "", city: "" };
  };

  // Get unique cities
  const cities = useMemo(() => {
    const citySet = new Set<string>();
    serviceCenters.forEach((center) => {
      const { city } = parseAddress(center.address);
      if (city) citySet.add(city);
    });
    return Array.from(citySet).sort();
  }, [serviceCenters]);

  // Get districts for selected city
  const districts = useMemo(() => {
    if (selectedCity === "all") return [];
    const districtSet = new Set<string>();
    serviceCenters.forEach((center) => {
      const { city, district } = parseAddress(center.address);
      if (city === selectedCity && district) {
        districtSet.add(district);
      }
    });
    return Array.from(districtSet).sort();
  }, [serviceCenters, selectedCity]);

  // Filter service centers
  const filteredCenters = useMemo(() => {
    return serviceCenters.filter((center) => {
      const { city, district } = parseAddress(center.address);
      
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
          center.name.toLowerCase().includes(keyword) ||
          center.address.toLowerCase().includes(keyword) ||
          center.phone.includes(keyword)
        );
      }
      
      return true;
    });
  }, [serviceCenters, selectedCity, selectedDistrict, searchKeyword]);

  // Handle city change
  const handleCityChange = (value: string) => {
    setSelectedCity(value);
    setSelectedDistrict("all");
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <SEOHead pageKey="service-centers" />
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white pt-[124px] md:pt-[164px] pb-16">
          <div className="container">
            <h1 className="hero-title text-white">{t('serviceCenters.title')}</h1>
            <p className="hero-subtitle text-gray-300">
              {t('serviceCenters.subtitle')}
            </p>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="border-b bg-gray-50">
          <div className="container py-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* City Select */}
              <Select value={selectedCity} onValueChange={handleCityChange}>
                <SelectTrigger>
                  <SelectValue placeholder={t('serviceCenters.filter.city')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('serviceCenters.filter.allCities')}</SelectItem>
                  {cities.map((city) => (
                    <SelectItem key={city} value={city}>
                      {city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* District Select */}
              <Select 
                value={selectedDistrict} 
                onValueChange={setSelectedDistrict}
                disabled={selectedCity === "all"}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t('serviceCenters.filter.district')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('serviceCenters.filter.allDistricts')}</SelectItem>
                  {districts.map((district) => (
                    <SelectItem key={district} value={district}>
                      {district}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Keyword Search */}
              <div className="md:col-span-2 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder={t('serviceCenters.filter.search')}
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="mt-4 text-sm text-gray-600">
              {t('serviceCenters.resultsCount', { count: filteredCenters.length })}
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="container py-8">
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCenters.length === 0 ? (
                <div className="col-span-full text-center py-12 text-gray-500">
                  {t('serviceCenters.noResults')}
                </div>
              ) : (
              filteredCenters.map((center: any) => (
                <div
                  key={center.id}
                  className="border rounded-lg p-6 hover:shadow-lg transition-shadow bg-white"
                >
                  <h3 className="font-semibold text-lg mb-4">{center.name}</h3>
                  
                  <div className="space-y-3 text-sm text-gray-600">
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 flex-shrink-0 mt-0.5 text-gray-400" />
                      <span>{center.address}</span>
                    </div>
                    
                    {center.phone && (
                      <div className="flex items-center gap-3">
                        <Phone className="w-5 h-5 flex-shrink-0 text-gray-400" />
                        <a
                          href={`tel:${center.phone}`}
                          className="hover:text-blue-600 transition-colors"
                        >
                          {center.phone}
                        </a>
                      </div>
                    )}
                    
                    {center.businessHours && (
                      <div className="text-gray-500">
                        {t('serviceCenters.hours')}: {center.businessHours}
                      </div>
                    )}
                    
                    {center.services && (
                      <div className="flex items-start gap-3">
                        <Wrench className="w-5 h-5 flex-shrink-0 mt-0.5 text-gray-400" />
                        <span>{center.services}</span>
                      </div>
                    )}
                  </div>
                </div>
                ))
              )}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
