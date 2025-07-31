'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import Link from 'next/link';
import { toast } from 'react-hot-toast';

import Input from '@/components/form/input/InputField';
import Label from '@/components/form/Label';
import Button from '@/components/ui/button/Button';
import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from '@/icons';
import { authApi } from '@/lib/api/auth';
import { useAuthStore } from '@/store/auth';
import type { ChangePasswordRequest } from '@/types';

// Zod validation schema
const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'رمز عبور فعلی الزامی است'),
    newPassword: z
      .string()
      .min(4, 'رمز عبور جدید حداقل 4 کاراکتر باشد')
      .max(50, 'رمز عبور جدید حداکثر 50 کاراکتر باشد'),
    confirmPassword: z.string().min(1, 'تکرار رمز عبور الزامی است'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'رمز عبور جدید و تکرار آن یکسان نیستند',
    path: ['confirmPassword'],
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: 'رمز عبور جدید نمی‌تواند مانند رمز فعلی باشد',
    path: ['newPassword'],
  });

type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;

export default function ResetPasswordForm() {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const router = useRouter();
  const { user, logout } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  // Change password mutation
  const changePasswordMutation = useMutation({
    mutationFn: async (data: ChangePasswordRequest) => {
      return await authApi.changePassword(data);
    },
    onSuccess: (response) => {
      toast.success(response.message || 'رمز عبور با موفقیت تغییر یافت');

      // Reset form
      reset();

      // If user hasn't changed password before, redirect to dashboard
      if (user && !user.hasChangedPassword) {
        const redirectPath = getRedirectPath(user.primaryRole);
        router.push(redirectPath);
      } else {
        // If it's a regular password change, redirect to profile or dashboard
        router.push('/profile');
      }
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message || error.message || 'خطا در تغییر رمز عبور';

      toast.error(errorMessage);
    },
  });

  const onSubmit = async (data: ChangePasswordFormData) => {
    try {
      await changePasswordMutation.mutateAsync({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
    } catch (error) {
      // Error is handled in mutation onError
    }
  };

  const getRedirectPath = (primaryRole?: string | null): string => {
    switch (primaryRole) {
      case 'admin':
        return '/admin/dashboard';
      case 'accountant':
        return '/accountant/dashboard';
      case 'meter_reader':
        return '/meter-reader/dashboard';
      case 'owner':
      case 'tenant':
        return '/resident/dashboard';
      default:
        return '/dashboard';
    }
  };

  const isLoading = isSubmitting || changePasswordMutation.isPending;
  const isFirstTimePasswordChange = user && !user.hasChangedPassword;

  return (
    <div className="flex w-full flex-1 flex-col lg:w-1/2">
      <div className="mx-auto mb-5 w-full max-w-md sm:pt-10">
        {!isFirstTimePasswordChange && (
          <Link
            href="/profile"
            className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            <ChevronLeftIcon />
            بازگشت به پروفایل
          </Link>
        )}
      </div>

      <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="text-title-sm sm:text-title-md mb-2 font-semibold text-gray-800 dark:text-white/90">
              {isFirstTimePasswordChange ? 'تغییر رمز عبور اولیه' : 'تغییر رمز عبور'}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {isFirstTimePasswordChange
                ? 'برای ادامه کار، لطفاً رمز عبور خود را تغییر دهید'
                : 'برای امنیت بیشتر، رمز عبور جدید انتخاب کنید'}
            </p>
          </div>

          <div>
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <div className="space-y-6">
                {/* Current Password Field */}
                <div>
                  <Label>
                    رمز عبور فعلی <span className="text-error-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      {...register('currentPassword')}
                      type={showCurrentPassword ? 'text' : 'password'}
                      placeholder="رمز عبور فعلی خود را وارد کنید"
                      className={errors.currentPassword ? 'border-error-500' : ''}
                      disabled={isLoading}
                    />
                    <span
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute top-1/2 left-4 z-30 -translate-y-1/2 cursor-pointer"
                    >
                      {showCurrentPassword ? (
                        <EyeIcon className="fill-gray-500 dark:fill-gray-400" />
                      ) : (
                        <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />
                      )}
                    </span>
                  </div>
                  {errors.currentPassword && (
                    <p className="text-error-500 mt-1 text-sm">{errors.currentPassword.message}</p>
                  )}
                </div>

                {/* New Password Field */}
                <div>
                  <Label>
                    رمز عبور جدید <span className="text-error-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      {...register('newPassword')}
                      type={showNewPassword ? 'text' : 'password'}
                      placeholder="رمز عبور جدید را وارد کنید"
                      className={errors.newPassword ? 'border-error-500' : ''}
                      disabled={isLoading}
                    />
                    <span
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute top-1/2 left-4 z-30 -translate-y-1/2 cursor-pointer"
                    >
                      {showNewPassword ? (
                        <EyeIcon className="fill-gray-500 dark:fill-gray-400" />
                      ) : (
                        <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />
                      )}
                    </span>
                  </div>
                  {errors.newPassword && (
                    <p className="text-error-500 mt-1 text-sm">{errors.newPassword.message}</p>
                  )}
                </div>

                {/* Confirm Password Field */}
                <div>
                  <Label>
                    تکرار رمز عبور جدید <span className="text-error-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      {...register('confirmPassword')}
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="رمز عبور جدید را مجدداً وارد کنید"
                      className={errors.confirmPassword ? 'border-error-500' : ''}
                      disabled={isLoading}
                    />
                    <span
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute top-1/2 left-4 z-30 -translate-y-1/2 cursor-pointer"
                    >
                      {showConfirmPassword ? (
                        <EyeIcon className="fill-gray-500 dark:fill-gray-400" />
                      ) : (
                        <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />
                      )}
                    </span>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-error-500 mt-1 text-sm">{errors.confirmPassword.message}</p>
                  )}
                </div>

                {/* Password Requirements */}
                <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800/50">
                  <h3 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    الزامات رمز عبور:
                  </h3>
                  <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                    <li>• حداقل 4 کاراکتر</li>
                    <li>• متفاوت از رمز عبور فعلی</li>
                    <li>• بهتر است شامل حروف و اعداد باشد</li>
                  </ul>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  {!isFirstTimePasswordChange && (
                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1"
                      onClick={() => router.back()}
                      disabled={isLoading}
                    >
                      انصراف
                    </Button>
                  )}

                  <Button
                    type="submit"
                    className={`${isFirstTimePasswordChange ? 'w-full' : 'flex-1'}`}
                    size="sm"
                    loading={isLoading}
                    disabled={isLoading}
                  >
                    {isLoading ? 'در حال تغییر...' : 'تغییر رمز عبور'}
                  </Button>
                </div>

                {/* Logout option for first time users */}
                {isFirstTimePasswordChange && (
                  <div className="mt-4">
                    <Button
                      type="button"
                      variant="ghost"
                      className="w-full text-gray-500 hover:text-gray-700"
                      onClick={() => {
                        logout();
                        router.push('/login');
                      }}
                      disabled={isLoading}
                    >
                      خروج از حساب کاربری
                    </Button>
                  </div>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
