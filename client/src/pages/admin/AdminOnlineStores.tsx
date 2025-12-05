import { useState, useRef } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Pencil, Trash2, Plus, GripVertical } from "lucide-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const COUNTRIES = [
  { code: "tw", name: "Taiwan (台灣)" },
  { code: "us", name: "United States (美國)" },
  { code: "jp", name: "Japan (日本)" },
  { code: "kr", name: "Korea (韓國)" },
  { code: "cn", name: "China (中國)" },
  { code: "de", name: "Germany (德國)" },
  { code: "fr", name: "France (法國)" },
];

export default function AdminOnlineStores() {
  const [selectedCountry, setSelectedCountry] = useState("tw");
  const [editingStore, setEditingStore] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const logoFileRef = useRef<File | null>(null);

  const { data: allStores, refetch } = trpc.dealers.getAllOnlineStores.useQuery();
  const upsertMutation = trpc.dealers.upsertOnlineStore.useMutation();
  const deleteMutation = trpc.dealers.deleteOnlineStore.useMutation();
  const updateOrderMutation = trpc.dealers.updateOnlineStoresOrder.useMutation();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const currentCountryStores = allStores?.filter(s => s.country === selectedCountry) || [];
  const officialStore = currentCountryStores.find(s => s.type === "official");
  const platformStores = currentCountryStores.filter(s => s.type === "platform");

  const handleSaveOfficial = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    try {
      await upsertMutation.mutateAsync({
        id: officialStore?.id,
        country: selectedCountry,
        type: "official",
        name: formData.get("officialName") as string || "官方商城",
        url: formData.get("officialUrl") as string || undefined,
        logo: formData.get("officialLogo") as string || undefined,
        isActive: 1,
      });
      toast.success("官方商城已更新");
      refetch();
    } catch (error) {
      toast.error("更新失敗");
    }
  };

  const handleSavePlatform = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    try {
      let logoUrl = editingStore?.logo;

      // 如果有上傳新檔案，先上傳到 S3
      if (logoFileRef.current) {
        setUploadingLogo(true);
        const uploadFormData = new FormData();
        uploadFormData.append('file', logoFileRef.current);
        uploadFormData.append('category', 'online-store-logos');

        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: uploadFormData,
        });

        if (!uploadResponse.ok) {
          throw new Error('上傳失敗');
        }

        const uploadResult = await uploadResponse.json();
        logoUrl = uploadResult.url;
        setUploadingLogo(false);
      }

      await upsertMutation.mutateAsync({
        id: editingStore?.id,
        country: selectedCountry,
        type: "platform",
        name: formData.get("platformName") as string,
        url: formData.get("platformUrl") as string || undefined,
        logo: logoUrl || undefined,
        displayOrder: editingStore?.displayOrder || platformStores.length,
        isActive: 1,
      });
      toast.success(editingStore ? "平台已更新" : "平台已新增");
      setIsDialogOpen(false);
      setEditingStore(null);
      setLogoPreview(null);
      logoFileRef.current = null;
      refetch();
    } catch (error) {
      console.error('Save platform error:', error);
      toast.error("操作失敗: " + (error instanceof Error ? error.message : '未知錯誤'));
      setUploadingLogo(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("確定要刪除此平台嗎?")) return;
    
    try {
      await deleteMutation.mutateAsync({ id });
      toast.success("已刪除");
      refetch();
    } catch (error) {
      toast.error("刪除失敗");
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const oldIndex = platformStores.findIndex(s => s.id === active.id);
    const newIndex = platformStores.findIndex(s => s.id === over.id);

    const reorderedStores = arrayMove(platformStores, oldIndex, newIndex);
    const storeIds = reorderedStores.map(s => s.id);

    try {
      await updateOrderMutation.mutateAsync({
        country: selectedCountry,
        storeIds,
      });
      toast.success("順序已更新");
      refetch();
    } catch (error) {
      toast.error("更新順序失敗");
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">線上銷售渠道管理</h1>

      {/* 國家/語言切換 Tabs */}
      <Tabs value={selectedCountry} onValueChange={setSelectedCountry} className="mb-8">
        <TabsList>
          {COUNTRIES.map(country => (
            <TabsTrigger key={country.code} value={country.code}>
              {country.name}
            </TabsTrigger>
          ))}
        </TabsList>

        {COUNTRIES.map(country => (
          <TabsContent key={country.code} value={country.code} className="space-y-8">
            {/* 區塊 A - 官方商城設定 */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">官方商城設定 (Official Store)</h2>
              <form onSubmit={handleSaveOfficial} className="space-y-4">
                <div>
                  <Label htmlFor="officialName">商城名稱</Label>
                  <Input
                    id="officialName"
                    name="officialName"
                    defaultValue={officialStore?.name || "Apolnus 官方商城"}
                    placeholder="Apolnus 官方商城"
                  />
                </div>
                <div>
                  <Label htmlFor="officialUrl">商城連結</Label>
                  <Input
                    id="officialUrl"
                    name="officialUrl"
                    type="url"
                    defaultValue={officialStore?.url || ""}
                    placeholder="https://store.apolnus.com"
                  />
                  <p className="text-sm text-gray-500 mt-1">若為空,前台按鈕將顯示為 Disabled 狀態</p>
                </div>
                <div>
                  <Label htmlFor="officialLogo">Logo URL (選填)</Label>
                  <Input
                    id="officialLogo"
                    name="officialLogo"
                    type="url"
                    defaultValue={officialStore?.logo || ""}
                    placeholder="https://example.com/logo.png"
                  />
                </div>
                <Button type="submit" disabled={upsertMutation.isPending}>
                  {upsertMutation.isPending ? "儲存中..." : "儲存官方商城"}
                </Button>
              </form>
            </Card>

            {/* 區塊 B - 線上經銷平台 */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">線上平台 (Online Retailers)</h2>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={() => setEditingStore(null)}>
                      <Plus className="w-4 h-4 mr-2" />
                      新增平台
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{editingStore ? "編輯平台" : "新增平台"}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSavePlatform} className="space-y-4">
                      <div>
                        <Label htmlFor="platformName">平台名稱 *</Label>
                        <Input
                          id="platformName"
                          name="platformName"
                          required
                          defaultValue={editingStore?.name || ""}
                          placeholder="Amazon JP"
                        />
                      </div>
                      <div>
                        <Label htmlFor="platformUrl">連結</Label>
                        <Input
                          id="platformUrl"
                          name="platformUrl"
                          type="url"
                          defaultValue={editingStore?.url || ""}
                          placeholder="https://amazon.co.jp/..."
                        />
                      </div>
                      <div>
                        <Label htmlFor="platformLogo">Logo 圖片</Label>
                        <Input
                          id="platformLogo"
                          name="platformLogo"
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              logoFileRef.current = file;
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                setLogoPreview(reader.result as string);
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                        {(logoPreview || editingStore?.logo) && (
                          <div className="mt-2 flex items-center justify-center h-16 border rounded p-2">
                            <img
                              src={logoPreview || editingStore?.logo}
                              alt="Logo preview"
                              className="max-h-full object-contain"
                            />
                          </div>
                        )}
                      </div>
                      <Button type="submit" disabled={upsertMutation.isPending}>
                        {upsertMutation.isPending ? "儲存中..." : "儲存"}
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>

              {platformStores.length === 0 ? (
                <p className="text-gray-500 text-center py-8">尚無經銷平台,點擊「新增平台」開始設定</p>
              ) : (
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext
                    items={platformStores.map(s => s.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    <div className="space-y-3">
                      {platformStores.map(store => (
                        <SortableStoreItem
                          key={store.id}
                          store={store}
                          onEdit={() => {
                            setEditingStore(store);
                            setIsDialogOpen(true);
                          }}
                          onDelete={() => handleDelete(store.id)}
                        />
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>
              )}
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}


// 可拖拉的平台項目組件
function SortableStoreItem({
  store,
  onEdit,
  onDelete,
}: {
  store: any;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: store.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className="p-4 border-2 hover:border-blue-300 transition-colors"
    >
      <div className="flex items-center gap-3">
        {/* 拖拉手柄 */}
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600"
        >
          <GripVertical className="w-5 h-5" />
        </div>

        {/* Logo */}
        {store.logo && (
          <div className="flex items-center justify-center h-12 w-16 flex-shrink-0">
            <img src={store.logo} alt={store.name} className="max-h-12 max-w-full object-contain" />
          </div>
        )}

        {/* 內容 */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold">{store.name}</h3>
          <p className="text-sm text-gray-600 truncate">{store.url || "無連結"}</p>
        </div>

        {/* 操作按鈕 */}
        <div className="flex gap-2 flex-shrink-0">
          <Button size="sm" variant="ghost" onClick={onEdit}>
            <Pencil className="w-4 h-4" />
          </Button>
          <Button size="sm" variant="ghost" onClick={onDelete}>
            <Trash2 className="w-4 h-4 text-red-500" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
