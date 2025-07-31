// components/user-profile/UserMetaCard.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { User } from '@/types';

interface UserMetaCardProps {
  user?: User;
  onUpdate?: (user: User) => void;
}

export default function UserMetaCard({ user, onUpdate }: UserMetaCardProps) {
  const [isEditing, setIsEditing] = useState(false);

  if (!user) return null;

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const getRoleBadgeColor = (role: string) => {
    const colors = {
      admin: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400',
      accountant: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
      owner: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
      tenant: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
      meter_reader: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400',
      security: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
    };
    return colors[role as keyof typeof colors] || colors.tenant;
  };

  const getRoleLabel = (role: string) => {
    const labels = {
      admin: 'مدیر سیستم',
      accountant: 'حسابدار',
      owner: 'مالک',
      tenant: 'مستاجر',
      meter_reader: 'قرائت‌گر کنتور',
      security: 'نگهبان',
    };
    return labels[role as keyof typeof labels] || role;
  };

  return (
    <div className="flex items-start gap-6">
      {/* Avatar */}
      <div className="flex-shrink-0">
        <div className="relative">
          <div className="from-brand-500 to-brand-600 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br text-2xl font-bold text-white shadow-lg lg:h-24 lg:w-24">
            {getInitials(user.firstName, user.lastName)}
          </div>

          {/* Status Indicator */}
          <div
            className={`absolute -right-1 -bottom-1 h-6 w-6 rounded-full border-2 border-white dark:border-gray-800 ${
              user.isActive ? 'bg-green-500' : 'bg-gray-400'
            }`}
            title={user.isActive ? 'فعال' : 'غیرفعال'}
          />
        </div>
      </div>

      {/* User Info */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900 lg:text-2xl dark:text-white">
              {user.fullName}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">{user.phone}</p>
          </div>
        </div>

        {/* Roles */}
        <div className="mt-4 flex flex-wrap gap-2">
          {user.roles?.map((roleObj, index) => (
            <span
              key={index}
              className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${getRoleBadgeColor(roleObj.role)} ${
                roleObj.isPrimary ? 'ring-brand-500 ring-2 ring-offset-1' : ''
              }`}
              title={roleObj.isPrimary ? 'نقش اصلی' : ''}
            >
              {getRoleLabel(roleObj.role)}
              {roleObj.isPrimary && (
                <svg className="ml-1 h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </span>
          ))}
        </div>

        {/* Quick Stats */}
        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
          <div className="text-center">
            <div className="text-lg font-semibold text-gray-900 dark:text-white">
              {user.userUnits?.length || 0}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">واحد</div>
          </div>

          <div className="text-center">
            <div className="text-lg font-semibold text-gray-900 dark:text-white">
              {user.roles?.length || 0}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">نقش</div>
          </div>

          <div className="text-center">
            <div
              className={`text-lg font-semibold ${
                user.hasChangedPassword
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-red-600 dark:text-red-400'
              }`}
            >
              {user.hasChangedPassword ? '✓' : '⚠'}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">رمز عبور</div>
          </div>
        </div>
      </div>
    </div>
  );
}
