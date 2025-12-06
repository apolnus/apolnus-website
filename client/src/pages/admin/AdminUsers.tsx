import { useState } from "react";
import AdminNav, { AdminSidebar } from "@/components/AdminNav";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";
import { useTranslation } from "react-i18next";
import SEOHead from "@/components/seo/SEOHead";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Users, Search, Shield, User as UserIcon } from "lucide-react";
import { format } from "date-fns";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function AdminUsers() {
    const { t } = useTranslation();
    const [location] = useLocation();
    const { isLoading } = useAdminAuth();
    const [searchTerm, setSearchTerm] = useState("");
    const [roleFilter, setRoleFilter] = useState<"all" | "admin" | "user">("all");

    const { data: users, refetch } = trpc.admin.users.list.useQuery();
    const updateRoleMutation = trpc.admin.users.updateRole.useMutation({
        onSuccess: () => {
            toast.success(t('admin.update_success', 'Update successful'));
            refetch();
        },
        onError: (error) => {
            toast.error(error.message);
        }
    });

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <SEOHead pageKey="admin" />
                <div className="text-gray-600">{t('admin.loading', 'Loading...')}</div>
            </div>
        );
    }

    const filteredUsers = users?.filter((user) => {
        const matchesSearch =
            (user.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
            (user.email || "").toLowerCase().includes(searchTerm.toLowerCase());

        const matchesRole = roleFilter === "all" || user.role === roleFilter;

        return matchesSearch && matchesRole;
    });

    const handleRoleChange = (userId: number, newRole: string) => {
        updateRoleMutation.mutate({ id: userId, role: newRole });
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <SEOHead pageKey="admin" title={t('admin.users_management', 'User Management')} />
            <AdminNav />
            <AdminSidebar currentPath={location} />

            <main className="ml-64 pt-24 p-8">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center justify-between mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                            <Users className="w-8 h-8" />
                            {t('admin.users_management', 'User Management')}
                        </h1>
                        <div className="text-sm text-gray-500">
                            {t('admin.total_users', 'Total Users')}: {users?.length || 0}
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow">
                        <div className="p-6 border-b border-gray-200 flex flex-col md:flex-row gap-4 justify-between items-center">
                            <div className="relative w-full md:w-96">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <Input
                                    className="pl-10"
                                    placeholder={t('admin.search_users', 'Search users by name or email...')}
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <Select value={roleFilter} onValueChange={(v: any) => setRoleFilter(v)}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Filter by Role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Roles</SelectItem>
                                    <SelectItem value="admin">Admin</SelectItem>
                                    <SelectItem value="user">User</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>User</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Role</TableHead>
                                    <TableHead>Created At</TableHead>
                                    <TableHead>Last Signed In</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredUsers?.map((user) => (
                                    <TableRow key={user.id}>
                                        <TableCell className="font-medium">
                                            <div className="flex items-center gap-2">
                                                {user.avatar ? (
                                                    <img src={user.avatar} alt={user.name || "User"} className="w-8 h-8 rounded-full" />
                                                ) : (
                                                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                                                        <span className="text-xs text-gray-500">{(user.name || "U")[0]}</span>
                                                    </div>
                                                )}
                                                <span>{user.name || "N/A"}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell>
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
                                                }`}>
                                                {user.role === 'admin' ? <Shield className="w-3 h-3 mr-1" /> : <UserIcon className="w-3 h-3 mr-1" />}
                                                {user.role}
                                            </span>
                                        </TableCell>
                                        <TableCell>{user.createdAt ? format(new Date(user.createdAt), 'yyyy-MM-dd') : '-'}</TableCell>
                                        <TableCell>{user.lastSignedIn ? format(new Date(user.lastSignedIn), 'yyyy-MM-dd HH:mm') : '-'}</TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                {user.role === 'user' ? (
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleRoleChange(user.id, 'admin')}
                                                        disabled={updateRoleMutation.isLoading}
                                                    >
                                                        {updateRoleMutation.isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Make Admin"}
                                                    </Button>
                                                ) : (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                        onClick={() => handleRoleChange(user.id, 'user')}
                                                        disabled={updateRoleMutation.isLoading}
                                                    >
                                                        {updateRoleMutation.isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Revoke Admin"}
                                                    </Button>
                                                )}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {filteredUsers?.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                                            No users found matching your search.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </main>
        </div>
    );
}
