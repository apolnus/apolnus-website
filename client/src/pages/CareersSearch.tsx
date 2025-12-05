import { useState, useMemo, useCallback } from "react";
import { useTranslation } from 'react-i18next';
import { trpc } from "@/lib/trpc";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Search, Plus, Minus, X, SlidersHorizontal, Heart } from "lucide-react";
import { Link } from "wouter";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface Job {
  id: number;
  jobId: string;
  title: string;
  department: string;
  location: string;
  country: string;
  description: string;
  requirements: string | null;
  postedAt: Date;
}

interface FilterPanelProps {
  uniqueLocations: string[];
  selectedLocations: string[];
  keywords: string[];
  keywordInput: string;
  locationExpanded: boolean;
  keywordExpanded: boolean;
  totalFilters: number;
  t: (key: string) => string;
  onLocationToggle: (location: string) => void;
  onKeywordInputChange: (value: string) => void;
  onAddKeyword: () => void;
  onRemoveKeyword: (keyword: string) => void;
  onClearAll: () => void;
  onLocationExpandToggle: () => void;
  onKeywordExpandToggle: () => void;
}

const FilterPanel = ({
  uniqueLocations,
  selectedLocations,
  keywords,
  keywordInput,
  locationExpanded,
  keywordExpanded,
  totalFilters,
  t,
  onLocationToggle,
  onKeywordInputChange,
  onAddKeyword,
  onRemoveKeyword,
  onClearAll,
  onLocationExpandToggle,
  onKeywordExpandToggle,
}: FilterPanelProps) => (
  <div>
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-[17px] font-normal text-[#1d1d1f]">{t('careerssearch.t_a0ea9a55')}</h2>
      {totalFilters > 0 && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearAll}
          className="text-[#0071e3] hover:text-[#0077ed] text-[14px]"
        >{t('careerssearch.t_aa43fa46')}</Button>
      )}
    </div>

    {/* Location Filter */}
    <div className="border-b border-[#d2d2d7] pb-4 mb-4">
      <button
        onClick={onLocationExpandToggle}
        className="w-full flex items-center justify-between py-3 text-left group"
      >
        <span className="text-[15px] font-normal text-[#1d1d1f]">
          地點{" "}
          {selectedLocations.length > 0 && (
            <span className="text-[14px] font-normal text-[#86868b] ml-2">
              已套用 {selectedLocations.length} 項篩選條件
            </span>
          )}
        </span>
        {locationExpanded ? (
          <Minus className="w-5 h-5 text-[#86868b]" />
        ) : (
          <Plus className="w-5 h-5 text-[#86868b]" />
        )}
      </button>

      {locationExpanded && (
        <div className="mt-3 space-y-1 max-h-64 overflow-y-auto">
          {uniqueLocations.map((location) => (
            <label
              key={location}
              className="flex items-center gap-3 py-2 px-2 cursor-pointer hover:bg-[#f5f5f7] rounded transition-colors"
            >
              <Checkbox
                checked={selectedLocations.includes(location)}
                onCheckedChange={() => onLocationToggle(location)}
              />
              <span className="text-[17px] text-[#1d1d1f]">{location}</span>
            </label>
          ))}
        </div>
      )}
    </div>

    {/* Keyword Filter */}
    <div className="border-b border-[#d2d2d7] pb-4 mb-4">
      <button
        onClick={onKeywordExpandToggle}
        className="w-full flex items-center justify-between py-3 text-left group"
      >
        <span className="text-[15px] font-normal text-[#1d1d1f]">
          關鍵字{" "}
          {keywords.length > 0 && (
            <span className="text-[14px] font-normal text-[#86868b] ml-2">
              已套用 {keywords.length} 項篩選條件
            </span>
          )}
        </span>
        {keywordExpanded ? (
          <Minus className="w-5 h-5 text-[#86868b]" />
        ) : (
          <Plus className="w-5 h-5 text-[#86868b]" />
        )}
      </button>

      {keywordExpanded && (
        <div className="mt-3 space-y-3">
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder={t('careerssearch.t_ef77dc71')}
              value={keywordInput}
              onChange={(e) => onKeywordInputChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  onAddKeyword();
                }
              }}
              className="flex-1 h-11 text-[17px]"
            />
            <Button onClick={onAddKeyword} size="sm" className="h-11 px-4 bg-[#0071e3] hover:bg-[#0077ed]">{t('careerssearch.t_66ab5e9f')}</Button>
          </div>

          {keywords.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {keywords.map((keyword) => (
                <span
                  key={keyword}
                  className="inline-flex items-center gap-1 bg-[#0071e3] text-white px-3 py-1.5 rounded-full text-[14px]"
                >
                  {keyword}
                  <button
                    onClick={() => onRemoveKeyword(keyword)}
                    className="hover:bg-white/20 rounded-full p-0.5"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  </div>
);

export default function CareersSearch() {
  const { t } = useTranslation();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [keywords, setKeywords] = useState<string[]>([]);
  const [keywordInput, setKeywordInput] = useState("");
  const [expandedJobId, setExpandedJobId] = useState<number | null>(null);
  const [locationExpanded, setLocationExpanded] = useState(false);
  const [keywordExpanded, setKeywordExpanded] = useState(false);
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);

  // 獲取所有職缺
  const { data: allJobs } = trpc.jobs.list.useQuery({});

  // 從所有職缺中提取唯一的地點
  const uniqueLocations = useMemo(() => {
    if (!allJobs) return [];
    const locationSet = new Set<string>();
    allJobs.forEach((job) => {
      if (job.location) locationSet.add(job.location);
    });
    return Array.from(locationSet).sort();
  }, [allJobs]);

  // 前端篩選職缺
  const filteredJobs = useMemo(() => {
    if (!allJobs) return [];
    
    return allJobs.filter((job) => {
      // 地點篩選
      if (selectedLocations.length > 0 && !selectedLocations.includes(job.location)) {
        return false;
      }

      // 搜尋查詢篩選
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = job.title.toLowerCase().includes(query);
        const matchesDept = job.department.toLowerCase().includes(query);
        const matchesDesc = job.description.toLowerCase().includes(query);
        const matchesReq = job.requirements?.toLowerCase().includes(query) || false;
        if (!matchesTitle && !matchesDept && !matchesDesc && !matchesReq) return false;
      }

      // 關鍵字篩選
      if (keywords.length > 0) {
        const jobText = `${job.title} ${job.department} ${job.description}`.toLowerCase();
        const matchesKeywords = keywords.some((keyword) =>
          jobText.includes(keyword.toLowerCase())
        );
        if (!matchesKeywords) return false;
      }

      return true;
    });
  }, [allJobs, selectedLocations, searchQuery, keywords]);

  const handleLocationToggle = useCallback((location: string) => {
    setSelectedLocations((prev) =>
      prev.includes(location)
        ? prev.filter((l) => l !== location)
        : [...prev, location]
    );
  }, []);

  const handleAddKeyword = useCallback(() => {
    if (keywordInput.trim() && !keywords.includes(keywordInput.trim())) {
      setKeywords((prev) => [...prev, keywordInput.trim()]);
      setKeywordInput("");
    }
  }, [keywordInput, keywords]);

  const handleRemoveKeyword = useCallback((keyword: string) => {
    setKeywords((prev) => prev.filter((k) => k !== keyword));
  }, []);

  const handleClearAll = useCallback(() => {
    setSelectedLocations([]);
    setKeywords([]);
    setSearchQuery("");
  }, []);

  const handleApply = useCallback((job: Job) => {
    const subject = `Application: ${job.title} (${job.jobId})`;
    const body = `Hi Apolnus Team,\n\nI am interested in applying for the position of ${job.title}.\n\nBest regards,`;
    window.location.href = `mailto:hr@apolnus.com?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
  }, []);

  const totalFilters = selectedLocations.length + keywords.length;

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />

      {/* Header Section */}
      <div className="bg-white pt-28 pb-12 px-6">
        <div className="container mx-auto max-w-5xl">
          <h1 className="text-[32px] font-normal text-[#1d1d1f] mb-10 text-center leading-tight">{t('careerssearch.t_f39d1b02')}</h1>

          {/* Search Bar */}
          <div className="max-w-3xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#86868b]" />
              <Input
                type="text"
                placeholder={t('careerssearch.t_c7a60a01')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-14 bg-white border border-[#d2d2d7] rounded-xl text-[17px] placeholder:text-[#86868b] focus:border-[#0071e3] focus:ring-1 focus:ring-[#0071e3]"
              />
            </div>
          </div>

          {/* Mobile Filter Button */}
          <div className="mt-6 lg:hidden max-w-3xl mx-auto text-center">
            <Dialog open={filterDialogOpen} onOpenChange={setFilterDialogOpen}>
              <DialogTrigger asChild>
                <button className="inline-flex items-center gap-1.5 text-[15px] text-[#0071e3] hover:text-[#0077ed] font-normal">
                  <SlidersHorizontal className="w-4 h-4" />
                  篩選 {totalFilters > 0 && `(${totalFilters})`}
                </button>
              </DialogTrigger>
              <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-[21px] font-semibold">{t('careerssearch.t_104fe4ff')}</DialogTitle>
                </DialogHeader>
                <FilterPanel
                  uniqueLocations={uniqueLocations}
                  selectedLocations={selectedLocations}
                  keywords={keywords}
                  keywordInput={keywordInput}
                  locationExpanded={locationExpanded}
                  keywordExpanded={keywordExpanded}
                  totalFilters={totalFilters}
                  t={t}
                  onLocationToggle={handleLocationToggle}
                  onKeywordInputChange={setKeywordInput}
                  onAddKeyword={handleAddKeyword}
                  onRemoveKeyword={handleRemoveKeyword}
                  onClearAll={handleClearAll}
                  onLocationExpandToggle={() => setLocationExpanded(!locationExpanded)}
                  onKeywordExpandToggle={() => setKeywordExpanded(!keywordExpanded)}
                />
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      {/* Main Content - Left Sidebar + Right List */}
      <div className="container mx-auto px-6 py-8 flex-1">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Left Sidebar - Filters (Desktop Only) */}
          <aside className="hidden lg:block lg:w-80 flex-shrink-0">
            <div className="sticky top-24">
              <FilterPanel
                uniqueLocations={uniqueLocations}
                selectedLocations={selectedLocations}
                keywords={keywords}
                keywordInput={keywordInput}
                locationExpanded={locationExpanded}
                keywordExpanded={keywordExpanded}
                totalFilters={totalFilters}
                t={t}
                onLocationToggle={handleLocationToggle}
                onKeywordInputChange={setKeywordInput}
                onAddKeyword={handleAddKeyword}
                onRemoveKeyword={handleRemoveKeyword}
                onClearAll={handleClearAll}
                onLocationExpandToggle={() => setLocationExpanded(!locationExpanded)}
                onKeywordExpandToggle={() => setKeywordExpanded(!keywordExpanded)}
              />
            </div>
          </aside>

          {/* Right Content - Jobs List */}
          <main className="flex-1">
            {/* Applied Filters & Results Count */}
            <div className="mb-8">
              {selectedLocations.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 mb-6">
                  {selectedLocations.map((location) => (
                    <span
                      key={location}
                      className="inline-flex items-center gap-2 bg-[#f5f5f7] text-[#1d1d1f] px-4 py-2 rounded-full text-[14px]"
                    >
                      {location}
                      <button
                        onClick={() => handleLocationToggle(location)}
                        className="hover:bg-[#d2d2d7] rounded-full p-0.5 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </span>
                  ))}
                </div>
              )}

              <p className="text-[17px] text-[#1d1d1f]">
                <span className="font-semibold">{filteredJobs?.length || 0}</span>{t('careerssearch.t_b425bac2')}</p>
            </div>

            {/* Jobs List */}
            {!filteredJobs ? (
              <div className="text-center py-12 text-[#86868b] text-[17px]">{t('careerssearch.t_d3933730')}</div>
            ) : filteredJobs.length === 0 ? (
              <div className="text-center py-12 text-[#86868b] text-[17px]">{t('careerssearch.t_5dc8e1e4')}</div>
            ) : (
              <div className="space-y-0">
                {filteredJobs.map((job, index) => (
                  <div
                    key={job.id}
                    className={`border-b border-[#d2d2d7] ${
                      index === 0 ? "border-t" : ""
                    }`}
                  >
                    {/* Job List Item */}
                    <div
                      className="py-6 px-5 hover:bg-[#f5f5f7] cursor-pointer transition-colors"
                      onClick={() =>
                        setExpandedJobId(expandedJobId === job.id ? null : job.id)
                      }
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                           <h3 className="text-[19px] font-medium text-[#0071e3] mb-2 hover:underline">
                            {job.title}
                          </h3>
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[14px] text-[#86868b]">
                            <span>{job.department}</span>
                            <span>{new Date(job.postedAt).toLocaleDateString("zh-TW")}</span>
                            <span>{job.location}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              // TODO: Add to favorites
                            }}
                            className="p-2 hover:bg-white rounded-full transition-colors"
                          >
                            <Heart className="w-5 h-5 text-[#86868b]" />
                          </button>
                          {expandedJobId === job.id ? (
                            <Minus className="w-5 h-5 text-[#86868b]" />
                          ) : (
                            <Plus className="w-5 h-5 text-[#86868b]" />
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Expanded Content */}
                    {expandedJobId === job.id && (
                      <div className="px-5 pb-8 bg-[#fbfbfd]">
                        <div className="max-w-3xl">
                          {/* Job Description */}
                          <div className="mb-8">
                            <h4 className="text-[12px] font-semibold text-[#1d1d1f] mb-4 uppercase tracking-wide">{t('careerssearch.t_851b1a2c')}</h4>
                            <div
                              className="text-[17px] text-[#1d1d1f] leading-relaxed prose prose-sm max-w-none"
                              dangerouslySetInnerHTML={{ __html: job.description }}
                            />
                          </div>

                          {/* Requirements */}
                          {job.requirements && (
                            <div className="mb-8">
                              <h4 className="text-[12px] font-semibold text-[#1d1d1f] mb-4 uppercase tracking-wide">{t('careerssearch.t_5074476d')}</h4>
                              <div
                                className="text-[17px] text-[#1d1d1f] leading-relaxed prose prose-sm max-w-none"
                                dangerouslySetInnerHTML={{
                                  __html: job.requirements,
                                }}
                              />
                            </div>
                          )}

                          {/* Apply Button */}
                          <div className="mt-8">
                            <Button
                              onClick={() => handleApply(job)}
                              className="bg-[#0071e3] hover:bg-[#0077ed] text-white px-6 py-3 rounded-full text-[17px] font-medium h-auto"
                            >{t('careerssearch.t_fabcce69')}</Button>
                          </div>

                          {/* Job Info */}
                          <div className="mt-6 text-[14px] text-[#86868b]">
                            <p>
                              職位編號: {job.jobId} | 發布日期:{" "}
                              {new Date(job.postedAt).toLocaleDateString("zh-TW")}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
}
