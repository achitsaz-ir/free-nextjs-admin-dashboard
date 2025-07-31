// components/user-profile/UserRolesCard.tsx
'use client';

import { User, RoleType } from '@/types';

interface UserRolesCardProps {
  user?: User;
}

export default function UserRolesCard({ user }: UserRolesCardProps) {
  if (!user?.roles || user.roles.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
        <h4 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">نقش‌های کاربری</h4>
        <div className="py-8 text-center">
          <div className="mb-4 text-4xl text-gray-400">👤</div>
          <p className="text-gray-500 dark:text-gray-400">هیچ نقشی تعریف نشده است</p>
        </div>
      </div>
    );
  }

  const getRoleIcon = (role: RoleType): string => {
    const icons = {
      [RoleType.ADMIN]: '👑',
      [RoleType.ACCOUNTANT]: '📊',
      [RoleType.OWNER]: '🏠',
      [RoleType.TENANT]: '🔑',
      [RoleType.METER_READER]: '📋',
      [RoleType.SECURITY]: '🛡️',
    };
    return icons[role] || '👤';
  };

  const getRoleLabel = (role: RoleType): string => {
    const labels = {
      [RoleType.ADMIN]: 'مدیر سیستم',
      [RoleType.ACCOUNTANT]: 'حسابدار',
      [RoleType.OWNER]: 'مالک',
      [RoleType.TENANT]: 'مستاجر',
      [RoleType.METER_READER]: 'قرائت‌گر کنتور',
      [RoleType.SECURITY]: 'نگهبان',
    };
    return labels[role] || role;
  };

  const getRoleDescription = (role: RoleType): string => {
    const descriptions = {
      [RoleType.ADMIN]: 'دسترسی کامل به تمام بخش‌های سیستم',
      [RoleType.ACCOUNTANT]: 'مدیریت امور مالی و گزارش‌گیری',
      [RoleType.OWNER]: 'مالک یک یا چند واحد مسکونی',
      [RoleType.TENANT]: 'مستاجر یک یا چند واحد مسکونی',
      [RoleType.METER_READER]: 'ثبت قرائت کنتورهای آب و برق',
      [RoleType.SECURITY]: 'نظارت بر امنیت مجتمع',
    };
    return descriptions[role] || 'نقش کاربری';
  };

  const getRoleBadgeColor = (role: RoleType, isPrimary: boolean = false): string => {
    const baseColors = {
      [RoleType.ADMIN]:
        'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800',
      [RoleType.ACCOUNTANT]:
        'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800',
      [RoleType.OWNER]:
        'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800',
      [RoleType.TENANT]:
        'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800',
      [RoleType.METER_READER]:
        'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/20 dark:text-gray-400 dark:border-gray-800',
      [RoleType.SECURITY]:
        'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800',
    };

    const primaryRing = isPrimary
      ? ' ring-2 ring-offset-2 ring-brand-500 dark:ring-offset-gray-800'
      : '';
    return (baseColors[role] || baseColors[RoleType.TENANT]) + primaryRing;
  };

  const primaryRole = user.roles.find((role) => role.isPrimary);
  const secondaryRoles = user.roles.filter((role) => !role.isPrimary);

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
      <div className="mb-6">
        <h4 className="mb-2 text-lg font-medium text-gray-900 dark:text-white">نقش‌های کاربری</h4>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          نقش‌های تخصیص یافته به حساب کاربری شما
        </p>
      </div>

      <div className="space-y-4">
        {/* Primary Role */}
        {primaryRole && (
          <div>
            <div className="mb-3 flex items-center gap-2">
              <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300">نقش اصلی</h5>
              <span className="bg-brand-100 text-brand-800 dark:bg-brand-900/20 dark:text-brand-400 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium">
                <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                اصلی
              </span>
            </div>

            <div
              className={`rounded-lg border p-4 ${getRoleBadgeColor(primaryRole.role as RoleType, true)}`}
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl">{getRoleIcon(primaryRole.role as RoleType)}</span>
                <div className="min-w-0 flex-1">
                  <h6 className="font-medium text-current">
                    {getRoleLabel(primaryRole.role as RoleType)}
                  </h6>
                  <p className="mt-1 text-sm opacity-75">
                    {getRoleDescription(primaryRole.role as RoleType)}
                  </p>
                  {primaryRole.unitNumber && (
                    <div className="mt-2 flex items-center gap-1 text-xs">
                      <span className="opacity-75">واحد:</span>
                      <span className="font-medium">{primaryRole.unitNumber}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Secondary Roles */}
        {secondaryRoles.length > 0 && (
          <div>
            <h5 className="mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">
              نقش‌های فرعی ({secondaryRoles.length})
            </h5>
            <div className="space-y-3">
              {secondaryRoles.map((role, index) => (
                <div
                  key={index}
                  className={`rounded-lg border p-4 ${getRoleBadgeColor(role.role as RoleType)}`}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-lg">{getRoleIcon(role.role as RoleType)}</span>
                    <div className="min-w-0 flex-1">
                      <h6 className="font-medium text-current">
                        {getRoleLabel(role.role as RoleType)}
                      </h6>
                      <p className="mt-1 text-sm opacity-75">
                        {getRoleDescription(role.role as RoleType)}
                      </p>
                      {role.unitNumber && (
                        <div className="mt-2 flex items-center gap-1 text-xs">
                          <span className="opacity-75">واحد:</span>
                          <span className="font-medium">{role.unitNumber}</span>
                        </div>
                      )}
                    </div>

                    {/* Status */}
                    <div className="flex-shrink-0">
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                          role.isActive
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                            : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                        }`}
                      >
                        {role.isActive ? 'فعال' : 'غیرفعال'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Roles Summary */}
        <div className="mt-6 border-t border-gray-200 pt-4 dark:border-gray-700">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500 dark:text-gray-400">مجموع نقش‌ها:</span>
            <span className="font-medium text-gray-900 dark:text-white">
              {user.roles.length} نقش
            </span>
          </div>

          <div className="mt-2 flex items-center justify-between text-sm">
            <span className="text-gray-500 dark:text-gray-400">نقش‌های فعال:</span>
            <span className="font-medium text-green-600 dark:text-green-400">
              {user.roles.filter((r) => r.isActive).length} نقش
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
