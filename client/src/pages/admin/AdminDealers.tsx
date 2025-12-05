import { useState } from "react";
import { useLocation } from "wouter";
import AdminNav, { AdminSidebar } from "@/components/AdminNav";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Trash2, Plus, Edit2, MapPin, Phone } from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import SEOHead from "@/components/seo/SEOHead";

export default function AdminDealers() {
  const { t } = useTranslation();
  const [location] = useLocation();
  const { isLoading } = useAdminAuth();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    businessHours: "",
    latitude: "",
    longitude: "",
  });

  const { data: dealers, refetch } = trpc.dealers.getAllDealers.useQuery();
  const addMutation = trpc.dealers.createDealer.useMutation();
  const updateMutation = trpc.dealers.updateDealer.useMutation();
  const deleteMutation = trpc.dealers.deleteDealer.useMutation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
      <SEOHead pageKey="adminDealers" />
        <div className="text-gray-600">{t('adminDealers.t_d3933730')}</div>
      </div>
    );
  }

  const handleAdd = async () => {
    if (!formData.name.trim() || !formData.phone.trim() || !formData.address.trim()) {
      toast.error("請填寫名稱、電話和地址");
      return;
    }
    
    try {
      await addMutation.mutateAsync({
        name: formData.name,
        phone: formData.phone,
        address: formData.address,
        businessHours: formData.businessHours || undefined,
        latitude: formData.latitude || undefined,
        longitude: formData.longitude || undefined,
      });
      toast.success("授權經銷商已新增");
      setFormData({ name: "", phone: "", address: "", businessHours: "", latitude: "", longitude: "" });
      setIsAdding(false);
      refetch();
    } catch (error) {
      toast.error("新增失敗");
    }
  };

  const handleUpdate = async () => {
    if (!editingId) return;
    
    try {
      await updateMutation.mutateAsync({
        id: editingId,
        name: formData.name,
        phone: formData.phone,
        address: formData.address,
        businessHours: formData.businessHours || undefined,
        latitude: formData.latitude || undefined,
        longitude: formData.longitude || undefined,
      });
      toast.success("授權經銷商已更新");
      setFormData({ name: "", phone: "", address: "", businessHours: "", latitude: "", longitude: "" });
      setEditingId(null);
      refetch();
    } catch (error) {
      toast.error("更新失敗");
    }
  };

  const handleEdit = (dealer: any) => {
    setEditingId(dealer.id);
    setFormData({
      name: dealer.name,
      phone: dealer.phone,
      address: dealer.address,
      businessHours: dealer.businessHours || "",
      latitude: dealer.latitude || "",
      longitude: dealer.longitude || "",
    });
    setIsAdding(false);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("確定要刪除此授權經銷商嗎？")) return;
    
    try {
      await deleteMutation.mutateAsync({ id });
      toast.success("授權經銷商已刪除");
      refetch();
    } catch (error) {
      toast.error("刪除失敗");
    }
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingId(null);
    setFormData({ name: "", phone: "", address: "", businessHours: "", latitude: "", longitude: "" });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminNav />
      <AdminSidebar currentPath={location} />
      
      <main className="ml-64 pt-16 p-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-900">{t('adminDealers.t_7775c4e1')}</h1>
            {!isAdding && !editingId && (
              <Button onClick={() => setIsAdding(true)}>
                <Plus className="w-4 h-4 mr-2" />{t('adminDealers.t_3b35cd22')}</Button>
            )}
          </div>

          {/* 新增/編輯表單 */}
          {(isAdding || editingId) && (
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h2 className="text-lg font-semibold mb-4">
                {editingId ? "編輯授權經銷商" : "新增授權經銷商"}
              </h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">{t('adminDealers.t_64900079')}</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder={t('adminDealers.t_e78962ce')}
                  />
                </div>
                <div>
                  <Label htmlFor="phone">{t('adminDealers.t_6e71b0e3')}</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder={t('adminDealers.t_47506b11')}
                  />
                </div>
                <div>
                  <Label htmlFor="address">{t('adminDealers.t_d97ace53')}</Label>
                  <Textarea
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder={t('adminDealers.t_1a9fdf45')}
                    rows={2}
                  />
                </div>
                <div>
                  <Label htmlFor="businessHours">{t('adminDealers.t_64755f73')}</Label>
                  <Input
                    id="businessHours"
                    value={formData.businessHours}
                    onChange={(e) => setFormData({ ...formData, businessHours: e.target.value })}
                    placeholder={t('adminDealers.t_215188b7')}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="latitude">{t('adminDealers.t_34680bbf')}</Label>
                    <Input
                      id="latitude"
                      value={formData.latitude}
                      onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                      placeholder={t('adminDealers.t_46dc61e0')}
                    />
                  </div>
                  <div>
                    <Label htmlFor="longitude">{t('adminDealers.t_23fb398d')}</Label>
                    <Input
                      id="longitude"
                      value={formData.longitude}
                      onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                      placeholder={t('adminDealers.t_73cdb943')}
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button onClick={editingId ? handleUpdate : handleAdd}>
                    {editingId ? "更新" : "新增"}
                  </Button>
                  <Button variant="outline" onClick={handleCancel}>{t('adminDealers.t_14c8797c')}</Button>
                </div>
              </div>
            </div>
          )}

          {/* 經銷商列表 */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6">
              <h2 className="text-lg font-semibold mb-4">{t('adminDealers.t_f802e768')}</h2>
              {dealers && dealers.length > 0 ? (
                <div className="space-y-4">
                  {dealers.map((dealer) => (
                    <div
                      key={dealer.id}
                      className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg mb-2">{dealer.name}</h3>
                          <div className="space-y-1 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                              <Phone className="w-4 h-4" />
                              <span>{dealer.phone}</span>
                            </div>
                            <div className="flex items-start gap-2">
                              <MapPin className="w-4 h-4 mt-0.5" />
                              <span>{dealer.address}</span>
                            </div>
                            {dealer.businessHours && (
                              <div className="text-gray-500">
                                營業時間：{dealer.businessHours}
                              </div>
                            )}
                            {dealer.latitude && dealer.longitude && (
                              <div className="text-gray-500 text-xs">
                                座標：{dealer.latitude}, {dealer.longitude}
                              </div>
                            )}
                          </div>
                          <div className="mt-2">
                            <span className={`inline-block px-2 py-1 text-xs rounded ${
                              dealer.isActive === 1 
                                ? "bg-green-100 text-green-800" 
                                : "bg-gray-100 text-gray-800"
                            }`}>
                              {dealer.isActive === 1 ? "啟用" : "停用"}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2 ml-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(dealer)}
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(dealer.id)}
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">{t('adminDealers.t_23f21b3e')}</div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
