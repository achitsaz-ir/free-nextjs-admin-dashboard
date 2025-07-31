// app/(dashboard)/profile/page.tsx
'use client';

import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { toast } from 'react-hot-toast';

import UserMetaCard from '@/components/user-profile/UserMetaCard';
import UserInfoCard from '@/components/user-profile/UserInfoCard';
import UserUnitsCard from '@/components/user-profile/UserUnitsCard';
import ChangePasswordCard from '@/components/user-profile/ChangePasswordCard';
import { useAuthStore } from '@/store/auth';
import { usersApi } from '@/lib/api/users';
import UserRolesCard from '@/components/user-profile/UserRolesCard';
import LoadingSkeleton from '@/components/ui/LoadingSkeleton';
import ErrorMessage from '@/components/ui/ErrorMessage';

export default function ProfilePage() {
  const { user: authUser, updateUser } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'info' | 'units' | 'security'>('info');

  // Fetch user profile data
  const {
    data: userProfile,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['user-profile'],
    queryFn: async () => {
      const response = await usersApi.getProfile();
      return response;
    },
    enabled: !!authUser,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const handleProfileUpdate = async (updatedUser: any) => {
    try {
      updateUser(updatedUser);
      toast.success('اطلاعات پروفایل بروزرسانی شد');
      await refetch();
    } catch (error) {
      toast.error('خطا در بروزرسانی اطلاعات');
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <LoadingSkeleton className="h-8 w-48" />
        <div className="rounded-2xl border border-gray-200 bg-white p-5 lg:p-6 dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="space-y-6">
            <LoadingSkeleton className="h-32 w-full" />
            <LoadingSkeleton className="h-48 w-full" />
            <LoadingSkeleton className="h-40 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-5 lg:p-6 dark:border-gray-800 dark:bg-white/[0.03]">
        <ErrorMessage message="خطا در بارگیری اطلاعات پروفایل" onRetry={() => refetch()} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">پروفایل کاربری</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            مشاهده و مدیریت اطلاعات حساب کاربری شما
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-3">
          <button
            onClick={() => refetch()}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            بروزرسانی
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8 rtl:space-x-reverse">
          {[
            { key: 'info', label: 'اطلاعات شخصی', icon: '👤' },
            { key: 'units', label: 'واحدهای من', icon: '🏠' },
            { key: 'security', label: 'امنیت', icon: '🔒' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`inline-flex items-center gap-2 border-b-2 px-1 py-4 text-sm font-medium ${
                activeTab === tab.key
                  ? 'border-brand-500 text-brand-600 dark:text-brand-400'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        {activeTab === 'info' && (
          <div className="space-y-6 p-5 lg:p-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">اطلاعات شخصی</h3>
            <div className="space-y-6">
              <UserMetaCard user={userProfile} onUpdate={handleProfileUpdate} />
              <UserInfoCard user={userProfile} onUpdate={handleProfileUpdate} />
              <UserRolesCard user={userProfile} />
            </div>
          </div>
        )}

        {activeTab === 'units' && (
          <div className="space-y-6 p-5 lg:p-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              واحدهای تخصیص یافته
            </h3>
            <UserUnitsCard user={userProfile} />
          </div>
        )}

        {activeTab === 'security' && (
          <div className="space-y-6 p-5 lg:p-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              تنظیمات امنیتی
            </h3>
            <ChangePasswordCard />
          </div>
        )}
      </div>

      {/* User Activity Log (اختیاری) */}
      {userProfile && (
        <div className="rounded-2xl border border-gray-200 bg-white p-5 lg:p-6 dark:border-gray-800 dark:bg-white/[0.03]">
          <h3 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white/90">
            اطلاعات حساب
          </h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">تاریخ عضویت</dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                {new Date(userProfile.createdAt).toLocaleDateString('fa-IR')}
              </dd>
            </div>

            <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                آخرین بروزرسانی
              </dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                {new Date(userProfile.updatedAt).toLocaleDateString('fa-IR')}
              </dd>
            </div>

            <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">وضعیت حساب</dt>
              <dd className="mt-1">
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    userProfile.isActive
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                      : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                  }`}
                >
                  {userProfile.isActive ? 'فعال' : 'غیرفعال'}
                </span>
              </dd>
            </div>

            <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">وضعیت تایید</dt>
              <dd className="mt-1">
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    userProfile.isApproved
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                  }`}
                >
                  {userProfile.isApproved ? 'تایید شده' : 'در انتظار تایید'}
                </span>
              </dd>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
