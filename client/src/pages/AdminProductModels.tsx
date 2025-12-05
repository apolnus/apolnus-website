import { useState } from "react";
import { useLocation } from "wouter";
import AdminNav, { AdminSidebar } from "@/components/AdminNav";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Plus, GripVertical } from "lucide-react";
import { toast } from "sonner";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useTranslation } from "react-i18next";
import SEOHead from "@/components/seo/SEOHead";

interface ProductModel {
  id: number;
  name: string;
  order: number;
  createdAt: Date;
}

function SortableRow({ model, onDelete }: { model: ProductModel; onDelete: (id: number) => void }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: model.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <tr ref={setNodeRef} style={style} className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap">
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing inline-flex items-center text-gray-400 hover:text-gray-600"
        >
          <GripVertical className="w-5 h-5" />
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {model.id}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
        {model.name}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {model.order}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete(model.id)}
          className="text-red-600 hover:text-red-900"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </td>
    </tr>
  );
}

export default function AdminProductModels() {
  const { t } = useTranslation();
  const [location] = useLocation();
  const { isLoading } = useAdminAuth();
  const [newModel, setNewModel] = useState("");
  const { data: productModels, refetch } = trpc.admin.productModels.list.useQuery();
  const addMutation = trpc.admin.productModels.add.useMutation();
  const deleteMutation = trpc.admin.productModels.delete.useMutation();
  const updateOrderMutation = trpc.admin.productModels.updateOrder.useMutation();

  const [items, setItems] = useState<ProductModel[]>(productModels || []);

  // Update items when productModels data changes
  if (productModels && JSON.stringify(items.map(i => i.id)) !== JSON.stringify(productModels.map(m => m.id))) {
    setItems([...productModels]);
  }

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
      <SEOHead pageKey="adminProductModels" />
        <div className="text-gray-600">{t('adminProductModels.t_d3933730')}</div>
      </div>
    );
  }

  const handleAdd = async () => {
    if (!newModel.trim()) {
      toast.error("請輸入產品型號");
      return;
    }
    
    try {
      await addMutation.mutateAsync({ name: newModel.trim() });
      toast.success("產品型號已新增");
      setNewModel("");
      refetch();
    } catch (error) {
      toast.error("新增失敗");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("確定要刪除此產品型號嗎？")) return;
    
    try {
      await deleteMutation.mutateAsync({ id });
      toast.success("產品型號已刪除");
      refetch();
    } catch (error) {
      toast.error("刪除失敗");
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    const oldIndex = items.findIndex((item) => item.id === active.id);
    const newIndex = items.findIndex((item) => item.id === over.id);

    const newItems = arrayMove(items, oldIndex, newIndex);
    setItems(newItems);

    // Update order in database
    const updates = newItems.map((item, index) => ({
      id: item.id,
      order: index,
    }));

    try {
      await updateOrderMutation.mutateAsync({ items: updates });
      toast.success("排序已更新");
      refetch();
    } catch (error) {
      toast.error("排序更新失敗");
      // Revert on error
      setItems(productModels || []);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminNav />
      <AdminSidebar currentPath={location} />
      
      <main className="ml-64 pt-24 p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">{t('adminProductModels.t_cab0397c')}</h1>

          {/* 新增產品型號 */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">{t('adminProductModels.t_6821a4a1')}</h2>
            <div className="flex gap-4">
              <Input
                value={newModel}
                onChange={(e) => setNewModel(e.target.value)}
                placeholder={t('adminProductModels.t_838ab003')}
                onKeyPress={(e) => e.key === 'Enter' && handleAdd()}
                className="flex-1"
              />
              <Button onClick={handleAdd}>
                <Plus className="w-4 h-4 mr-2" />{t('adminProductModels.t_f7473762')}</Button>
            </div>
          </div>

          {/* 產品型號列表 */}
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-6 py-4 bg-blue-50 border-b border-blue-100">
                <p className="text-sm text-blue-800">
                  <GripVertical className="w-4 h-4 inline mr-1" />{t('adminProductModels.t_80845b0b')}</p>
              </div>
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('adminProductModels.t_a34940cf')}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('adminProductModels.t_72688f47')}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('adminProductModels.t_eaf17bd9')}</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">{t('adminProductModels.t_728c10a6')}</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <SortableContext
                    items={items.map(item => item.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    {items.map((model) => (
                      <SortableRow
                        key={model.id}
                        model={model}
                        onDelete={handleDelete}
                      />
                    ))}
                  </SortableContext>
                  {(!items || items.length === 0) && (
                    <tr>
                      <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">{t('adminProductModels.t_8c5242c9')}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </DndContext>
        </div>
      </main>
    </div>
  );
}
