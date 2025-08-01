// pages/users.tsx
'use client';
import React, { useEffect, useState } from 'react';
import { usersApi } from '@/lib/api/users';
import { User } from '@/types';
import Image from 'next/image';

// تنظیم ایمپورت کامپوننت‌ها مطابق پروژه خودتان
import { Table, TableHeader, TableRow, TableCell, TableBody } from '@/components/ui/table';
import Badge from '@/components/ui/badge/Badge';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import ComponentCard from '@/components/common/ComponentCard';
import AddNewUser from './AddNewUser';

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await usersApi.getAllUsers();
      setUsers(
        data.map((user) => ({
          ...user,
          roles: user.roles.map((r) => (typeof r === 'string' ? r : (r as any).role || 'نامشخص')),
        })),
      );
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'خطا در دریافت کاربران');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDeleteUser = async (id: string) => {
    if (!window.confirm('آیا از حذف کاربر اطمینان دارید؟')) return;
    try {
      await usersApi.deleteUser(id);
      alert('کاربر با موفقیت حذف شد');
      fetchUsers();
    } catch (err: any) {
      alert('خطا در حذف کاربر: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleApproveUser = async (id: string) => {
    try {
      await usersApi.approveUser(id);
      alert('کاربر تأیید شد');
      fetchUsers();
    } catch (err: any) {
      alert('خطا در تأیید کاربر: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <>
      <PageBreadcrumb pageTitle="کاربران" />
      <div className="space-y-6">
        <ComponentCard title="جدول لیست کاربران">
          <AddNewUser />
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white p-6 dark:border-white/[0.05] dark:bg-white/[0.03]">
            {loading && <p>در حال بارگذاری کاربران...</p>}
            {error && <p className="mb-4 text-red-600">خطا: {error}</p>}
            {!loading && users.length === 0 && (
              <p className="text-gray-600">هیچ کاربری برای نمایش وجود ندارد.</p>
            )}

            {users.length > 0 && (
              <div className="max-w-full overflow-x-auto">
                <div className="min-w-[900px]">
                  <Table>
                    <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                      <TableRow>
                        <TableCell
                          isHeader
                          className="text-theme-xs px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400"
                        >
                          کاربر
                        </TableCell>
                        <TableCell
                          isHeader
                          className="text-theme-xs px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400"
                        >
                          موبایل
                        </TableCell>
                        <TableCell
                          isHeader
                          className="text-theme-xs px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400"
                        >
                          کد ملی
                        </TableCell>
                        <TableCell
                          isHeader
                          className="text-theme-xs px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400"
                        >
                          نقش‌ها
                        </TableCell>
                        <TableCell
                          isHeader
                          className="text-theme-xs px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400"
                        >
                          تأیید شده
                        </TableCell>
                        <TableCell
                          isHeader
                          className="text-theme-xs px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400"
                        >
                          عملیات
                        </TableCell>
                      </TableRow>
                    </TableHeader>

                    <TableBody>
                      {users.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="flex items-center gap-3 px-5 py-4 text-start">
                            <div className="relative h-10 w-10 overflow-hidden rounded-full">
                              {/* <Image
                                src={``}
                                alt={`${user.firstName} ${user.lastName}`}
                                width={40}
                                height={40}
                                className="object-cover"
                                onError={(e) => {
                                  (e.currentTarget as HTMLImageElement).src = '/default-avatar.png';
                                }}
                              /> */}
                            </div>
                            <span className="text-sm font-medium text-gray-800 dark:text-white/90">
                              {user.firstName} {user.lastName}
                            </span>
                          </TableCell>
                          <TableCell className="px-5 py-4 text-sm whitespace-nowrap text-gray-600 dark:text-gray-400">
                            {user.phone}
                          </TableCell>
                          <TableCell className="px-5 py-4 text-sm whitespace-nowrap text-gray-600 dark:text-gray-400">
                            {user.nationalId}
                          </TableCell>
                          <TableCell className="px-5 py-4 text-sm whitespace-nowrap text-gray-600 dark:text-gray-400">
                            {user.roles.join(', ')}
                          </TableCell>
                          <TableCell className="px-5 py-4 whitespace-nowrap">
                            <Badge size="sm" color={user.isApproved ? 'success' : 'warning'}>
                              {user.isApproved ? 'تأیید شده' : 'در انتظار تأیید'}
                            </Badge>
                          </TableCell>
                          <TableCell className="space-x-2 px-5 py-4 whitespace-nowrap">
                            {!user.isApproved && (
                              <button
                                onClick={() => handleApproveUser(user.id)}
                                className="rounded bg-green-600 px-3 py-1 text-white transition hover:bg-green-700"
                                title="تأیید کاربر"
                              >
                                تأیید
                              </button>
                            )}
                            <button
                              onClick={() => handleDeleteUser(user.id)}
                              className="rounded bg-red-600 px-3 py-1 text-white transition hover:bg-red-700"
                              title="حذف کاربر"
                            >
                              حذف
                            </button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}
          </div>
        </ComponentCard>
      </div>
    </>
  );
}
