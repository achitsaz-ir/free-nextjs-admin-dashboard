// components/user-profile/UserInfoCard.tsx
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { z } from 'zod';
import { toast } from 'react-hot-toast';
import { Edit2, Save, X, Phone, CreditCard } from 'lucide-react';

import Input from '@/components/form/input/InputField';
import Label from '@/components/form/Label';
import Button from '@/components/ui/button/Button';
import { User } from '@/types';
import { usersApi } from '@/lib/api/users';

interface UserInfoCardProps {
  user?: User;
  onUpdate?: (updatedUser: User) => Promise<void>;
}

// Validation schema
const userInfoSchema = z.object({
  firstName: z.string().min(1, 'نام الزامی است').max(50, 'نام حداکثر 50 کاراکتر باشد'),
  lastName: z
    .string()
    .min(1, 'نام خانوادگی الزامی است')
    .max(50, 'نام خانوادگی حداکثر 50 کاراکتر باشد'),
  phone: z.string().regex(/^09\d{9}$/, 'شماره موبایل معتبر وارد کنید'),
  nationalId: z.string().min(10, 'کد ملی باید 10 رقم باشد').max(10, 'کد ملی باید 10 رقم باشد'),
});

type UserInfoFormData = z.infer<typeof userInfoSchema>;

export default function UserInfoCard({ user, onUpdate }: UserInfoCardProps) {
  const [isEditing, setIsEditing] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
    watch,
  } = useForm<UserInfoFormData>({
    resolver: zodResolver(userInfoSchema),
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      phone: user?.phone || '',
      nationalId: user?.nationalId || '',
    },
  });

  // Update user mutation
  const updateUserMutation = useMutation({
    mutationFn: async (data: UserInfoFormData) => {
      if (!user) throw new Error('اطلاعات کاربر موجود نیست');
      return await usersApi.updateProfile(data);
    },
    onSuccess: async (updatedUser) => {
      toast.success('اطلاعات با موفقیت بروزرسانی شد');
      setIsEditing(false);
      if (onUpdate) {
        await onUpdate(updatedUser);
      }
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'خطا در بروزرسانی اطلاعات');
    },
  });

  const onSubmit = (data: UserInfoFormData) => {
    updateUserMutation.mutate(data);
  };

  const handleCancel = () => {
    reset();
    setIsEditing(false);
  };

  const handleEdit = () => {
    setIsEditing(true);
    // Reset form with current user data
    if (user) {
      reset({
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        nationalId: user.nationalId,
      });
    }
  };

  if (!user) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
        <div className="py-8 text-center">
          <p className="text-gray-500 dark:text-gray-400">اطلاعات کاربر در دسترس نیست</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h4 className="text-lg font-medium text-gray-900 dark:text-white">اطلاعات شخصی</h4>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">اطلاعات کاربری و تماس شما</p>
        </div>

        <div className="flex gap-2">
          {!isEditing ? (
            <Button
              variant="outline"
              size="sm"
              onClick={handleEdit}
              className="flex items-center gap-2"
            >
              <Edit2 className="h-4 w-4" />
              ویرایش
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleCancel}
                disabled={updateUserMutation.isPending}
                className="flex items-center gap-2"
              >
                <X className="h-4 w-4" />
                انصراف
              </Button>
            </div>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-6 sm:grid-cols-2">
          {/* First Name */}
          <div>
            <Label htmlFor="firstName">نام</Label>
            {isEditing ? (
              <div className="mt-1">
                <Input
                  id="firstName"
                  {...register('firstName')}
                  className={errors.firstName ? 'border-red-500' : ''}
                  disabled={updateUserMutation.isPending}
                />
                {errors.firstName && (
                  <p className="mt-1 text-sm text-red-500">{errors.firstName.message}</p>
                )}
              </div>
            ) : (
              <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">
                {user.firstName}
              </p>
            )}
          </div>

          {/* Last Name */}
          <div>
            <Label htmlFor="lastName">نام خانوادگی</Label>
            {isEditing ? (
              <div className="mt-1">
                <Input
                  id="lastName"
                  {...register('lastName')}
                  className={errors.lastName ? 'border-red-500' : ''}
                  disabled={updateUserMutation.isPending}
                />
                {errors.lastName && (
                  <p className="mt-1 text-sm text-red-500">{errors.lastName.message}</p>
                )}
              </div>
            ) : (
              <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">
                {user.lastName}
              </p>
            )}
          </div>

          {/* Phone */}
          <div>
            <Label htmlFor="phone">شماره موبایل</Label>
            {isEditing ? (
              <div className="mt-1">
                <div className="relative">
                  <Phone className="absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    id="phone"
                    {...register('phone')}
                    dir="ltr"
                    className={`pr-10 ${errors.phone ? 'border-red-500' : ''}`}
                    placeholder="09xxxxxxxxx"
                    disabled={updateUserMutation.isPending}
                  />
                </div>
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-500">{errors.phone.message}</p>
                )}
              </div>
            ) : (
              <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white" dir="ltr">
                {user.phone}
              </p>
            )}
          </div>

          {/* National ID */}
          <div>
            <Label htmlFor="nationalId">کد ملی</Label>
            {isEditing ? (
              <div className="mt-1">
                <div className="relative">
                  <CreditCard className="absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    id="nationalId"
                    {...register('nationalId')}
                    dir="ltr"
                    className={`pr-10 ${errors.nationalId ? 'border-red-500' : ''}`}
                    placeholder="1234567890"
                    disabled={updateUserMutation.isPending}
                  />
                </div>
                {errors.nationalId && (
                  <p className="mt-1 text-sm text-red-500">{errors.nationalId.message}</p>
                )}
              </div>
            ) : (
              <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white" dir="ltr">
                {user.nationalId}
              </p>
            )}
          </div>
        </div>

        {/* Account Status Info */}
        <div className="mt-6 grid gap-4 border-t border-gray-200 pt-6 sm:grid-cols-2 dark:border-gray-700">
          <div>
            <Label>وضعیت حساب</Label>
            <div className="mt-1 flex items-center gap-2">
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  user.isActive
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                    : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                }`}
              >
                {user.isActive ? 'فعال' : 'غیرفعال'}
              </span>
            </div>
          </div>

          <div>
            <Label>وضعیت تایید</Label>
            <div className="mt-1 flex items-center gap-2">
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  user.isApproved
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                    : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                }`}
              >
                {user.isApproved ? 'تایید شده' : 'در انتظار تایید'}
              </span>
            </div>
          </div>

          <div>
            <Label>تاریخ عضویت</Label>
            <p className="mt-1 text-sm text-gray-900 dark:text-white">
              {new Date(user.createdAt).toLocaleDateString('fa-IR')}
            </p>
          </div>

          <div>
            <Label>آخرین بروزرسانی</Label>
            <p className="mt-1 text-sm text-gray-900 dark:text-white">
              {new Date(user.updatedAt).toLocaleDateString('fa-IR')}
            </p>
          </div>
        </div>

        {/* Save Button - Only show when editing */}
        {isEditing && (
          <div className="mt-6 flex justify-end gap-3 border-t border-gray-200 pt-6 dark:border-gray-700">
            <Button
              type="submit"
              loading={updateUserMutation.isPending}
              disabled={!isDirty || updateUserMutation.isPending}
              className="flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              {updateUserMutation.isPending ? 'در حال ذخیره...' : 'ذخیره تغییرات'}
            </Button>
          </div>
        )}
      </form>
    </div>
  );
}
