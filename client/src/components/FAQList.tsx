import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { trpc } from "@/lib/trpc";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface FAQListProps {
  productSlug?: string;
  showCategoryFilter?: boolean;
}

type FAQ = {
  id: number;
  category: string;
  question: Record<string, string>;
  answer: Record<string, string>;
  order: number;
};

export default function FAQList({ productSlug, showCategoryFilter = true }: FAQListProps) {
  const { i18n } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  const currentLang = i18n.language || 'zh-TW';
  
  const { data: faqs, isLoading } = trpc.faqs.list.useQuery({
    productSlug,
  });

  // 提取所有分類
  const categories = useMemo(() => {
    if (!faqs) return [];
    const uniqueCategories = Array.from(new Set(faqs.map(faq => faq.category)));
    return uniqueCategories.filter(Boolean);
  }, [faqs]);

  // 根據選擇的分類篩選 FAQ
  const filteredFaqs = useMemo(() => {
    if (!faqs) return [];
    if (!selectedCategory) return faqs;
    return faqs.filter(faq => faq.category === selectedCategory);
  }, [faqs, selectedCategory]);

  // 提取當前語言的內容 (Fallback to zh-TW)
  const getLocalizedContent = (content: Record<string, string>) => {
    return content[currentLang] || content['zh-TW'] || '';
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-gray-600">載入中...</div>
      </div>
    );
  }

  if (!faqs || faqs.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        尚無相關問題
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 分類篩選按鈕 */}
      {showCategoryFilter && categories.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedCategory === null ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(null)}
          >
            全部
          </Button>
          {categories.map(category => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>
      )}

      {/* FAQ Accordion */}
      <Accordion type="single" collapsible className="w-full space-y-4">
        {filteredFaqs.map((faq) => {
          const question = getLocalizedContent(faq.question);
          const answer = getLocalizedContent(faq.answer);

          if (!question || !answer) return null;

          return (
            <AccordionItem
              key={faq.id}
              value={`faq-${faq.id}`}
              className="bg-white rounded-lg shadow px-6 border-0"
            >
              <AccordionTrigger className="hover:no-underline py-4">
                <div className="flex items-start gap-3 text-left">
                  {faq.category && (
                    <Badge variant="outline" className="mt-1 shrink-0">
                      {faq.category}
                    </Badge>
                  )}
                  <span className="font-semibold text-gray-900">
                    {question}
                  </span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 whitespace-pre-wrap pb-4">
                {answer}
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>

      {filteredFaqs.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          此分類尚無問題
        </div>
      )}
    </div>
  );
}
