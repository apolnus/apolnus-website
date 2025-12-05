import { useState } from "react";
import { useLocation } from "wouter";
import AdminNav, { AdminSidebar } from "@/components/AdminNav";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Trash2, Plus, Edit2, MapPin, Phone, Wrench } from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import SEOHead from "@/components/seo/SEOHead";

export default function AdminServiceCenters() {
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
    services: "",
    latitude: "",
    longitude: "",
  });

  const { data: centers, refetch } = trpc.dealers.getAllServiceCenters.useQuery();
  const addMutation = trpc.dealers.createServiceCenter.useMutation();
  const updateMutation = trpc.dealers.updateServiceCenter.useMutation();
  const deleteMutation = trpc.dealers.deleteServiceCenter.useMutation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
      <SEOHead pageKey="adminServiceCenters" />
        <div className="text-gray-600">{t('adminServiceCenters.t_d3933730')}</div>
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
        services: formData.services || undefined,
        latitude: formData.latitude || undefined,
        longitude: formData.longitude || undefined,
      });
      toast.success("授權維修中心已新增");
      setFormData({ name: "", phone: "", address: "", businessHours: "", services: "", latitude: "", longitude: "" });
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
        services: formData.services || undefined,
        latitude: formData.latitude || undefined,
        longitude: formData.longitude || undefined,
      });
      toast.success("授權維修中心已更新");
      setFormData({ name: "", phone: "", address: "", businessHours: "", services: "", latitude: "", longitude: "" });
      setEditingId(null);
      refetch();
    } catch (error) {
      toast.error("更新失敗");
    }
  };

  const handleEdit = (center: any) => {
    setEditingId(center.id);
    setFormData({
      name: center.name,
      phone: center.phone,
      address: center.address,
      businessHours: center.businessHours || "",
      services: center.services || "",
      latitude: center.latitude || "",
      longitude: center.longitude || "",
    });
    setIsAdding(false);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("確定要刪除此授權維修中心嗎？")) return;
    
    try {
      await deleteMutation.mutateAsync({ id });
      toast.success("授權維修中心已刪除");
      refetch();
    } catch (error) {
      toast.error("刪除失敗");
    }
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingId(null);
    setFormData({ name: "", phone: "", address: "", businessHours: "", services: "", latitude: "", longitude: "" });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminNav />
      <AdminSidebar currentPath={location} />
      
      <main className="ml-64 pt-16 p-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-900">{t('adminServiceCenters.t_6364239c')}</h1>
            {!isAdding && !editingId && (
              <Button onClick={() => setIsAdding(true)}>
                <Plus className="w-4 h-4 mr-2" />{t('adminServiceCenters.t_8c002b5f')}</Button>
            )}
          </div>

          {/* 新增/編輯表單 */}
          {(isAdding || editingId) && (
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h2 className="text-lg font-semibold mb-4">
                {editingId ? "編輯授權維修中心" : "新增授權維修中心"}
              </h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">{t('adminServiceCenters.t_0071b16b')}</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder={t('adminServiceCenters.t_53972bcb')}
                  />
                </div>
                <div>
                  <Label htmlFor="phone">{t('adminServiceCenters.t_6e71b0e3')}</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder={t('adminServiceCenters.t_47506b11')}
                  />
                </div>
                <div>
                  <Label htmlFor="address">{t('adminServiceCenters.t_d97ace53')}</Label>
                  <Textarea
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder={t('adminServiceCenters.t_1a9fdf45')}
                    rows={2}
                  />
                </div>
                <div>
                  <Label htmlFor="businessHours">{t('adminServiceCenters.t_64755f73')}</Label>
                  <Input
                    id="businessHours"
                    value={formData.businessHours}
                    onChange={(e) => setFormData({ ...formData, businessHours: e.target.value })}
                    placeholder={t('adminServiceCenters.t_215188b7')}
                  />
                </div>
                <div>
                  <Label htmlFor="services">{t('adminServiceCenters.t_edb23576')}</Label>
                  <Textarea
                    id="services"
                    value={formData.services}
                    onChange={(e) => setFormData({ ...formData, services: e.target.value })}
                    placeholder={t('adminServiceCenters.t_afe3fb6d')}
                    rows={2}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="latitude">{t('adminServiceCenters.t_34680bbf')}</Label>
                    <Input
                      id="latitude"
                      value={formData.latitude}
                      onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                      placeholder={t('adminServiceCenters.t_46dc61e0')}
                    />
                  </div>
                  <div>
                    <Label htmlFor="longitude">{t('adminServiceCenters.t_23fb398d')}</Label>
                    <Input
                      id="longitude"
                      value={formData.longitude}
                      onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                      placeholder={t('adminServiceCenters.t_73cdb943')}
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button onClick={editingId ? handleUpdate : handleAdd}>
                    {editingId ? "更新" : "新增"}
                  </Button>
                  <Button variant="outline" onClick={handleCancel}>{t('adminServiceCenters.t_14c8797c')}</Button>
                </div>
              </div>
            </div>
          )}

          {/* 維修中心列表 */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6">
              <h2 className="text-lg font-semibold mb-4">{t('adminServiceCenters.t_2e2bda5b')}</h2>
              {centers && centers.length > 0 ? (
                <div className="space-y-4">
                  {centers.map((center) => (
                    <div
                      key={center.id}
                      className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg mb-2">{center.name}</h3>
                          <div className="space-y-1 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                              <Phone className="w-4 h-4" />
                              <span>{center.phone}</span>
                            </div>
                            <div className="flex items-start gap-2">
                              <MapPin className="w-4 h-4 mt-0.5" />
                              <span>{center.address}</span>
                            </div>
                            {center.businessHours && (
                              <div className="text-gray-500">
                                營業時間：{center.businessHours}
                              </div>
                            )}
                            {center.services && (
                              <div className="flex items-start gap-2 text-gray-500">
                                <Wrench className="w-4 h-4 mt-0.5" />
                                <span>{center.services}</span>
                              </div>
                            )}
                            {center.latitude && center.longitude && (
                              <div className="text-gray-500 text-xs">
                                座標：{center.latitude}, {center.longitude}
                              </div>
                            )}
                          </div>
                          <div className="mt-2">
                            <span className={`inline-block px-2 py-1 text-xs rounded ${
                              center.isActive === 1 
                                ? "bg-green-100 text-green-800" 
                                : "bg-gray-100 text-gray-800"
                            }`}>
                              {center.isActive === 1 ? "啟用" : "停用"}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2 ml-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(center)}
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(center.id)}
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">{t('adminServiceCenters.t_e3b52506')}</div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
