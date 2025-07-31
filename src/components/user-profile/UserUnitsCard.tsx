// components/user-profile/UserUnitsCard.tsx
'use client';

import { User, Unit } from '@/types';

interface UserUnitsCardProps {
  user?: User;
}

export default function UserUnitsCard({ user }: UserUnitsCardProps) {
  if (!user?.userUnits || user.userUnits.length === 0) {
    return (
      <div className="py-8 text-center">
        <div className="mb-4 text-6xl text-gray-400">🏠</div>
        <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-white">
          هیچ واحدی تخصیص نیافته
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          هنوز هیچ واحدی به شما تخصیص داده نشده است.
        </p>
      </div>
    );
  }

  const getUnitStatusColor = (status: string) => {
    const colors = {
      occupied: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
      vacant: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400',
      under_maintenance: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
      reserved: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
    };
    return colors[status as keyof typeof colors] || colors.vacant;
  };

  const getUnitStatusLabel = (status: string) => {
    const labels = {
      occupied: 'اشغال',
      vacant: 'خالی',
      under_maintenance: 'تعمیرات',
      reserved: 'رزرو',
    };
    return labels[status as keyof typeof labels] || status;
  };

  return (
    <div className="space-y-4">
      {user.userUnits.map((userUnit, index) => (
        <div
          key={index}
          className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/50"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-brand-500 flex h-12 w-12 items-center justify-center rounded-lg font-bold text-white">
                {userUnit.unit?.unitNumber}
              </div>

              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">
                  واحد {userUnit.unit?.unitNumber}
                </h4>
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <span>طبقه {userUnit.unit?.floorNumber || 'نامشخص'}</span>
                  <span>•</span>
                  <span>{userUnit.unit?.area} متر مربع</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getUnitStatusColor(
                  userUnit.unit?.status || 'vacant',
                )}`}
              >
                {getUnitStatusLabel(userUnit.unit?.status || 'vacant')}
              </span>
            </div>
          </div>

          {/* Unit Details */}
          {userUnit.unit && (
            <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div>
                <div className="text-sm text-gray-500 dark:text-gray-400">اتاق خواب</div>
                <div className="font-medium text-gray-900 dark:text-white">
                  {userUnit.unit.bedrooms}
                </div>
              </div>

              <div>
                <div className="text-sm text-gray-500 dark:text-gray-400">سرویس</div>
                <div className="font-medium text-gray-900 dark:text-white">
                  {userUnit.unit.bathrooms}
                </div>
              </div>

              <div>
                <div className="text-sm text-gray-500 dark:text-gray-400">پارکینگ</div>
                <div className="font-medium text-gray-900 dark:text-white">
                  {userUnit.unit.parkingSpaces}
                </div>
              </div>

              <div>
                <div className="text-sm text-gray-500 dark:text-gray-400">اجاره ماهانه</div>
                <div className="font-medium text-gray-900 dark:text-white">
                  {userUnit.unit.monthlyRent
                    ? `${userUnit.unit.monthlyRent.toLocaleString('fa-IR')} تومان`
                    : 'تعین نشده'}
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
