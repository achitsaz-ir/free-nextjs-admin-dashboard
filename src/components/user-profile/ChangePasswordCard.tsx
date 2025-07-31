// components/user-profile/ChangePasswordCard.tsx
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { z } from 'zod';
import { toast } from 'react-hot-toast';

import Input from '@/components/form/input/InputField';
import Label from '@/components/form/Label';
import Button from '@/components/ui/button/Button';
import { EyeCloseIcon, EyeIcon } from '@/icons';
import { authApi } from '@/lib/api/auth';

const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'رمز عبور فعلی الزامی است'),
    newPassword: z.string().min(4, 'رمز عبور جدید حداقل 4 کاراکتر باشد'),
    confirmPassword: z.string().min(1, 'تکرار رمز عبور الزامی است'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'رمز عبور جدید و تکرار آن یکسان نیستند',
    path: ['confirmPassword'],
  });

type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;

export default function ChangePasswordCard() {
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
  });

  const changePasswordMutation = useMutation({
    mutationFn: authApi.changePassword,
    onSuccess: () => {
      toast.success('رمز عبور با موفقیت تغییر یافت');
      reset();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'خطا در تغییر رمز عبور');
    },
  });

  const onSubmit = (data: ChangePasswordFormData) => {
    changePasswordMutation.mutate({
      currentPassword: data.currentPassword,
      newPassword: data.newPassword,
    });
  };

  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h4 className="mb-2 text-lg font-medium text-gray-900 dark:text-white">تغییر رمز عبور</h4>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          برای امنیت بیشتر، رمز عبور قوی انتخاب کنید
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <Label>رمز عبور فعلی</Label>
          <div className="relative">
            <Input
              {...register('currentPassword')}
              type={showPasswords.current ? 'text' : 'password'}
              className={errors.currentPassword ? 'border-red-500' : ''}
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility('current')}
              className="absolute top-1/2 left-3 -translate-y-1/2"
            >
              {showPasswords.current ? <EyeIcon /> : <EyeCloseIcon />}
            </button>
          </div>
          {errors.currentPassword && (
            <p className="mt-1 text-sm text-red-500">{errors.currentPassword.message}</p>
          )}
        </div>

        <div>
          <Label>رمز عبور جدید</Label>
          <div className="relative">
            <Input
              {...register('newPassword')}
              type={showPasswords.new ? 'text' : 'password'}
              className={errors.newPassword ? 'border-red-500' : ''}
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility('new')}
              className="absolute top-1/2 left-3 -translate-y-1/2"
            >
              {showPasswords.new ? <EyeIcon /> : <EyeCloseIcon />}
            </button>
          </div>
          {errors.newPassword && (
            <p className="mt-1 text-sm text-red-500">{errors.newPassword.message}</p>
          )}
        </div>

        <div>
          <Label>تکرار رمز عبور جدید</Label>
          <div className="relative">
            <Input
              {...register('confirmPassword')}
              type={showPasswords.confirm ? 'text' : 'password'}
              className={errors.confirmPassword ? 'border-red-500' : ''}
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility('confirm')}
              className="absolute top-1/2 left-3 -translate-y-1/2"
            >
              {showPasswords.confirm ? <EyeIcon /> : <EyeCloseIcon />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="mt-1 text-sm text-red-500">{errors.confirmPassword.message}</p>
          )}
        </div>

        <Button
          type="submit"
          loading={changePasswordMutation.isPending}
          disabled={changePasswordMutation.isPending}
          className="w-full sm:w-auto"
        >
          تغییر رمز عبور
        </Button>
      </form>
    </div>
  );
}
