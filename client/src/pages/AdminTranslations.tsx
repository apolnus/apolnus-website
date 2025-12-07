import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Search, Sparkles, Save, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { Link } from "wouter";

interface TranslationEntry {
    key: string;
    zhTW: string;
    target: string;
    isMissing: boolean;
}

const LANGUAGES = [
    { code: 'en', name: 'English' },
    { code: 'jp', name: '日本語' },
    { code: 'ko', name: '한국어' },
    { code: 'de', name: 'Deutsch' },
    { code: 'fr', name: 'Français' },
    { code: 'cn', name: '简体中文' },
];

export default function AdminTranslations() {
    const [selectedLang, setSelectedLang] = useState('en');
    const [entries, setEntries] = useState<TranslationEntry[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [showOnlyMissing, setShowOnlyMissing] = useState(false);
    const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());
    const [editedValues, setEditedValues] = useState<Record<string, string>>({});
    const [stats, setStats] = useState({ totalCount: 0, missingCount: 0 });
    const [aiProgress, setAiProgress] = useState({ current: 0, total: 0, isRunning: false });

    const scanMutation = trpc.admin.translations.scan.useMutation({
        onSuccess: (data) => {
            setEntries(data.entries);
            setStats({ totalCount: data.totalCount, missingCount: data.missingCount });
            setSelectedKeys(new Set());
            setEditedValues({});
            toast.success(`掃描完成：${data.totalCount} 個項目，${data.missingCount} 個待翻譯`);
        },
        onError: (error) => {
            toast.error(`掃描失敗: ${error.message}`);
        },
    });

    const saveMutation = trpc.admin.translations.save.useMutation({
        onSuccess: (data) => {
            toast.success(`已儲存 ${data.updatedCount} 個翻譯`);
            setEditedValues({});
            // Refresh list
            scanMutation.mutate({ lang: selectedLang });
        },
        onError: (error) => {
            toast.error(`儲存失敗: ${error.message}`);
        },
    });

    const aiTranslateMutation = trpc.admin.translations.aiTranslate.useMutation({
        onSuccess: (data) => {
            setAiProgress({ current: 0, total: 0, isRunning: false });
            toast.success(`AI 翻譯完成：${data.translatedCount} 個項目`);
            // Refresh list
            scanMutation.mutate({ lang: selectedLang });
        },
        onError: (error) => {
            setAiProgress({ current: 0, total: 0, isRunning: false });
            toast.error(`AI 翻譯失敗: ${error.message}`);
        },
    });

    // Handle scan
    const handleScan = () => {
        scanMutation.mutate({ lang: selectedLang });
    };

    // Handle save
    const handleSave = () => {
        const updates = Object.entries(editedValues).map(([key, value]) => ({ key, value }));
        if (updates.length === 0) {
            toast.info('沒有需要儲存的變更');
            return;
        }
        saveMutation.mutate({ lang: selectedLang, updates });
    };

    // Handle AI translate
    const handleAiTranslate = () => {
        const keysToTranslate = Array.from(selectedKeys);
        if (keysToTranslate.length === 0) {
            toast.info('請先勾選要翻譯的項目');
            return;
        }
        setAiProgress({ current: 0, total: keysToTranslate.length, isRunning: true });
        aiTranslateMutation.mutate({ lang: selectedLang, keys: keysToTranslate });
    };

    // Handle checkbox toggle
    const handleToggleSelect = (key: string) => {
        const newSelected = new Set(selectedKeys);
        if (newSelected.has(key)) {
            newSelected.delete(key);
        } else {
            newSelected.add(key);
        }
        setSelectedKeys(newSelected);
    };

    // Handle select all missing
    const handleSelectAllMissing = () => {
        const missingKeys = filteredEntries.filter(e => e.isMissing).map(e => e.key);
        setSelectedKeys(new Set(missingKeys));
    };

    // Handle input change
    const handleInputChange = (key: string, value: string) => {
        setEditedValues(prev => ({ ...prev, [key]: value }));
    };

    // Filter entries
    const filteredEntries = entries.filter(entry => {
        const matchesSearch = searchQuery === '' ||
            entry.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
            entry.zhTW.toLowerCase().includes(searchQuery.toLowerCase()) ||
            entry.target.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesMissing = !showOnlyMissing || entry.isMissing;
        return matchesSearch && matchesMissing;
    });

    return (
        <>
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="container mx-auto px-4 max-w-7xl">
                    {/* Header */}
                    <div className="flex items-center gap-4 mb-6">
                        <Link href="/admin">
                            <Button variant="ghost" size="icon">
                                <ArrowLeft className="w-5 h-5" />
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold">翻譯管理</h1>
                            <p className="text-gray-500">管理網站多語言翻譯內容</p>
                        </div>
                    </div>

                    {/* Controls */}
                    <Card className="mb-6">
                        <CardHeader>
                            <CardTitle>翻譯設定</CardTitle>
                            <CardDescription>選擇目標語言並掃描網站翻譯</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap items-center gap-4">
                                <div className="w-48">
                                    <Select value={selectedLang} onValueChange={setSelectedLang}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="選擇語言" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {LANGUAGES.map(lang => (
                                                <SelectItem key={lang.code} value={lang.code}>
                                                    {lang.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <Button onClick={handleScan} disabled={scanMutation.isPending}>
                                    {scanMutation.isPending ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            掃描中...
                                        </>
                                    ) : (
                                        <>
                                            <Search className="w-4 h-4 mr-2" />
                                            掃描網站
                                        </>
                                    )}
                                </Button>
                                <Button
                                    onClick={handleAiTranslate}
                                    disabled={aiTranslateMutation.isPending || selectedKeys.size === 0}
                                    variant="secondary"
                                >
                                    {aiTranslateMutation.isPending ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            AI 翻譯中...
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles className="w-4 h-4 mr-2" />
                                            AI 翻譯選取項目 ({selectedKeys.size})
                                        </>
                                    )}
                                </Button>
                                <Button
                                    onClick={handleSave}
                                    disabled={saveMutation.isPending || Object.keys(editedValues).length === 0}
                                >
                                    {saveMutation.isPending ? (
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    ) : (
                                        <Save className="w-4 h-4 mr-2" />
                                    )}
                                    儲存變更
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* AI Progress */}
                    {aiProgress.isRunning && (
                        <Card className="mb-6 border-blue-200 bg-blue-50">
                            <CardContent className="py-4">
                                <div className="flex items-center gap-4">
                                    <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                                    <div className="flex-1">
                                        <p className="font-medium text-blue-800">AI 翻譯進行中...</p>
                                        <div className="w-full bg-blue-200 rounded-full h-2 mt-2">
                                            <div
                                                className="bg-blue-600 h-2 rounded-full transition-all"
                                                style={{ width: `${aiProgress.total > 0 ? (aiProgress.current / aiProgress.total) * 100 : 0}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Stats */}
                    {entries.length > 0 && (
                        <div className="grid grid-cols-3 gap-4 mb-6">
                            <Card>
                                <CardContent className="py-4 text-center">
                                    <p className="text-2xl font-bold">{stats.totalCount}</p>
                                    <p className="text-gray-500">總計項目</p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent className="py-4 text-center">
                                    <p className="text-2xl font-bold text-green-600">{stats.totalCount - stats.missingCount}</p>
                                    <p className="text-gray-500">已翻譯</p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent className="py-4 text-center">
                                    <p className="text-2xl font-bold text-orange-600">{stats.missingCount}</p>
                                    <p className="text-gray-500">待翻譯</p>
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    {/* Translation List */}
                    {entries.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle>翻譯列表</CardTitle>
                                <CardDescription>
                                    勾選項目後可使用 AI 翻譯，或直接編輯翻譯內容
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {/* Filters */}
                                <div className="flex items-center gap-4 mb-4">
                                    <Input
                                        placeholder="搜尋 Key 或內容..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="max-w-sm"
                                    />
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <Checkbox
                                            checked={showOnlyMissing}
                                            onCheckedChange={(checked) => setShowOnlyMissing(checked === true)}
                                        />
                                        <span className="text-sm">只顯示待翻譯</span>
                                    </label>
                                    <Button variant="outline" size="sm" onClick={handleSelectAllMissing}>
                                        全選待翻譯項目
                                    </Button>
                                </div>

                                {/* Table */}
                                <div className="border rounded-lg overflow-hidden">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead className="w-12">選取</TableHead>
                                                <TableHead className="w-1/4">Key</TableHead>
                                                <TableHead className="w-1/3">繁體中文</TableHead>
                                                <TableHead className="w-1/3">翻譯內容</TableHead>
                                                <TableHead className="w-16">狀態</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {filteredEntries.slice(0, 100).map((entry) => (
                                                <TableRow key={entry.key} className={entry.isMissing ? 'bg-orange-50' : ''}>
                                                    <TableCell>
                                                        <Checkbox
                                                            checked={selectedKeys.has(entry.key)}
                                                            onCheckedChange={() => handleToggleSelect(entry.key)}
                                                        />
                                                    </TableCell>
                                                    <TableCell className="font-mono text-xs text-gray-600">
                                                        {entry.key}
                                                    </TableCell>
                                                    <TableCell className="text-sm">
                                                        {entry.zhTW}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Input
                                                            value={editedValues[entry.key] ?? entry.target}
                                                            onChange={(e) => handleInputChange(entry.key, e.target.value)}
                                                            placeholder="輸入翻譯..."
                                                            className={entry.isMissing ? 'border-orange-300' : ''}
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        {entry.isMissing ? (
                                                            <AlertCircle className="w-5 h-5 text-orange-500" />
                                                        ) : (
                                                            <CheckCircle2 className="w-5 h-5 text-green-500" />
                                                        )}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>

                                {filteredEntries.length > 100 && (
                                    <p className="text-sm text-gray-500 mt-4">
                                        顯示前 100 個結果，共 {filteredEntries.length} 個項目
                                    </p>
                                )}
                            </CardContent>
                        </Card>
                    )}

                    {/* Empty State */}
                    {entries.length === 0 && !scanMutation.isPending && (
                        <Card>
                            <CardContent className="py-12 text-center">
                                <Search className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">尚未掃描翻譯</h3>
                                <p className="text-gray-500 mb-4">選擇語言後點擊「掃描網站」開始</p>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </>
    );
}
