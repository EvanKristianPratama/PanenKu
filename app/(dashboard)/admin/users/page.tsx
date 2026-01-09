'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { User, Mail, Shield, Search, Users, Leaf, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { showAlert } from '@/lib/sweetalert';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface UserData {
    _id: string;
    name: string;
    email: string;
    role: 'admin' | 'user' | 'farmer';
    createdAt?: string;
}

const roleOptions = [
    { value: 'user', label: 'User', icon: User, bgColor: 'bg-blue-100', textColor: 'text-blue-700' },
    { value: 'farmer', label: 'Petani', icon: Leaf, bgColor: 'bg-green-100', textColor: 'text-green-700' },
    { value: 'admin', label: 'Admin', icon: Shield, bgColor: 'bg-purple-100', textColor: 'text-purple-700' },
];

import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function AdminUsersPage() {
    const [users, setUsers] = useState<UserData[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [updating, setUpdating] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState({
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 1
    });

    useEffect(() => {
        const timeout = setTimeout(() => {
            fetchUsers(1);
        }, 500); // Debounce search
        return () => clearTimeout(timeout);
    }, [search]);

    useEffect(() => {
        fetchUsers(page);
    }, [page]);

    const fetchUsers = async (pageNum: number) => {
        try {
            setLoading(true);
            const res = await fetch(`/api/admin/users?page=${pageNum}&limit=10&search=${search}`);
            const data = await res.json();
            setUsers(data.users || []);
            setPagination(data.pagination || { total: 0, page: 1, limit: 10, totalPages: 1 });
            setPage(pageNum);
        } catch (error) {
            toast.error('Gagal memuat data pengguna');
        } finally {
            setLoading(false);
        }
    };

    const handleRoleChange = async (userId: string, newRole: string) => {
        const user = users.find(u => u._id === userId);
        if (!user || user.role === newRole) return;

        const roleLabel = roleOptions.find(r => r.value === newRole)?.label || newRole;
        const confirm = await showAlert.confirm(
            'Ubah Role',
            `Ubah role ${user.name} menjadi ${roleLabel}?`
        );

        if (!confirm) return;

        setUpdating(userId);
        try {
            const res = await fetch('/api/admin/users', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, role: newRole })
            });

            if (res.ok) {
                setUsers(users.map(u =>
                    u._id === userId ? { ...u, role: newRole as any } : u
                ));
                showAlert.success('Berhasil', `Role berhasil diubah menjadi ${roleLabel}`);
            } else {
                const data = await res.json();
                showAlert.error('Gagal', data.error || 'Gagal mengubah role');
            }
        } catch (error) {
            showAlert.error('Error', 'Terjadi kesalahan');
        } finally {
            setUpdating(null);
        }
    };

    const getRoleOption = (role: string) => roleOptions.find(r => r.value === role);
    const adminCount = users.filter(u => u.role === 'admin').length;
    const farmerCount = users.filter(u => u.role === 'farmer').length;
    const userCount = users.filter(u => u.role === 'user').length;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Manajemen Pengguna</h1>
                <p className="text-gray-500">Kelola pengguna dan ubah role menjadi Petani/Admin</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-4">
                <Card className="border-0 shadow-sm">
                    <CardContent className="p-4 text-center">
                        <Users className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-2xl font-bold text-gray-900">{pagination.total}</p>
                        <p className="text-sm text-gray-500">Total User (Semua)</p>
                    </CardContent>
                </Card>
                {/* Note: Specific role counts are current page only, better removed or fetched separately. Keeping simple for now */}
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                    placeholder="Cari pengguna..."
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value);
                        setPage(1); // Reset page on search
                    }}
                    className="pl-10 bg-white"
                />
            </div>

            {/* Users List */}
            {loading ? (
                <div className="flex items-center justify-center py-20 bg-white rounded-lg">
                    <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
                </div>
            ) : users.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                    <User className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">Tidak ada pengguna ditemukan</p>
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Pengguna</th>
                                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Email</th>
                                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Role</th>
                                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Ubah Role</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {users.map((user) => {
                                const roleOpt = getRoleOption(user.role);
                                const RoleIcon = roleOpt?.icon || User;
                                return (
                                    <tr key={user._id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${roleOpt?.bgColor || 'bg-gray-100'}`}>
                                                    <RoleIcon className={`w-5 h-5 ${roleOpt?.textColor || 'text-gray-600'}`} />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900">{user.name}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-gray-600">
                                                <Mail className="w-4 h-4" />
                                                {user.email}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <Badge className={`${roleOpt?.bgColor} ${roleOpt?.textColor}`}>
                                                {roleOpt?.label || user.role}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4">
                                            <Select
                                                disabled={updating === user._id}
                                                onValueChange={(val) => handleRoleChange(user._id, val)}
                                                defaultValue={user.role}
                                            >
                                                <SelectTrigger className="w-[140px]">
                                                    {updating === user._id ? (
                                                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                                    ) : null}
                                                    <SelectValue placeholder="Pilih Role" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {roleOptions.map((option) => (
                                                        <SelectItem key={option.value} value={option.value}>
                                                            <div className="flex items-center gap-2">
                                                                <option.icon className={`w-4 h-4 ${option.textColor}`} />
                                                                <span>{option.label}</span>
                                                            </div>
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>

                    {/* Pagination Controls */}
                    <div className="p-4 border-t border-gray-100 flex items-center justify-between">
                        <div className="text-sm text-gray-500">
                            Hal. {page} dari {pagination.totalPages} ({pagination.total} total)
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                            >
                                <ChevronLeft className="w-4 h-4 mr-1" />
                                Sebelumnya
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
                                disabled={page === pagination.totalPages}
                            >
                                Selanjutnya
                                <ChevronRight className="w-4 h-4 ml-1" />
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
