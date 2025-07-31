'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import Link from 'next/link';
import { toast } from 'react-hot-toast';

import Checkbox from '@/components/form/input/Checkbox';
import Input from '@/components/form/input/InputField';
import Label from '@/components/form/Label';
import Button from '@/components/ui/button/Button';
import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from '@/icons';
import { authApi } from '@/lib/api/auth';
import { useAuthStore } from '@/store/auth';
import type { LoginResponse } from '@/types';

// Zod validation schema
const loginSchema = z.object({
  username: z
    .string()
    .min(1, 'شماره موبایل الزامی است')
    .regex(/^09\d{9}$/, 'شماره موبایل معتبر وارد کنید (09xxxxxxxxx)'),
  password: z.string().min(1, 'رمز عبور الزامی است').min(4, 'رمز عبور حداقل 4 کاراکتر باشد'),
  rememberMe: z.boolean().optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function SignInForm() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { login: loginToStore } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
      rememberMe: false,
    },
  });

  const rememberMe = watch('rememberMe');

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: async (data: Omit<LoginFormData, 'rememberMe'>) => {
      return await authApi.login(data);
    },
    onSuccess: (response: LoginResponse) => {
      // Store auth data
      loginToStore(response);

      // Show success message
      toast.success(response.message || 'ورود موفقیت‌آمیز');

      // Check if password needs to be changed
      if (!response.user.hasChangedPassword) {
        toast.error('لطفاً رمز عبور خود را تغییر دهید');
        router.push('/reset-password');
      } else {
        // Redirect based on user role
        const redirectPath = getRedirectPath(response.user.primaryRole);
        router.push(redirectPath);
      }
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || error.message || 'خطا در ورود به سیستم';

      toast.error(errorMessage);
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await loginMutation.mutateAsync({
        username: data.username,
        password: data.password,
      });

      // Store remember me preference
      if (data.rememberMe) {
        localStorage.setItem('rememberMe', 'true');
      } else {
        localStorage.removeItem('rememberMe');
      }
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

  const isLoading = isSubmitting || loginMutation.isPending;

  return (
    <div className="flex w-full flex-1 flex-col lg:w-1/2">
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="text-title-sm sm:text-title-md mb-2 font-semibold text-gray-800 dark:text-white/90">
              ورود به سیستم
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              شماره موبایل و رمز عبور خود را وارد کنید
            </p>
          </div>

          <div>
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <div className="space-y-6">
                {/* Phone Number Field */}
                <div>
                  <Label>
                    شماره موبایل <span className="text-error-500">*</span>
                  </Label>
                  <Input
                    {...register('username')}
                    placeholder="09xxxxxxxxx"
                    type="tel"
                    dir="ltr"
                    className={errors.username ? 'border-error-500' : ''}
                    disabled={isLoading}
                  />
                  {errors.username && (
                    <p className="text-error-500 mt-1 text-sm">{errors.username.message}</p>
                  )}
                </div>

                {/* Password Field */}
                <div>
                  <Label>
                    رمز عبور <span className="text-error-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      {...register('password')}
                      type={showPassword ? 'text' : 'password'}
                      placeholder="رمز عبور خود را وارد کنید"
                      className={errors.password ? 'border-error-500' : ''}
                      disabled={isLoading}
                    />
                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute top-1/2 left-4 z-30 -translate-y-1/2 cursor-pointer"
                    >
                      {showPassword ? (
                        <EyeIcon className="fill-gray-500 dark:fill-gray-400" />
                      ) : (
                        <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />
                      )}
                    </span>
                  </div>
                  {errors.password && (
                    <p className="text-error-500 mt-1 text-sm">{errors.password.message}</p>
                  )}
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Checkbox
                      checked={rememberMe || false}
                      onChange={(checked) => setValue('rememberMe', checked)}
                      disabled={isLoading}
                    />
                    <span className="text-theme-sm block font-normal text-gray-700 dark:text-gray-400">
                      مرا به خاطر بسپار
                    </span>
                  </div>

                  <Link
                    href="/reset-password"
                    className="text-brand-500 hover:text-brand-600 dark:text-brand-400 text-sm"
                  >
                    فراموشی رمز عبور؟
                  </Link>
                </div>

                {/* Submit Button */}
                <div>
                  <Button
                    type="submit"
                    className="w-full"
                    size="sm"
                    loading={isLoading}
                    disabled={isLoading}
                  >
                    {isLoading ? 'در حال ورود...' : 'ورود'}
                  </Button>
                </div>
              </div>
            </form>

            {/* Sign Up Link */}
            <div className="mt-5">
              <p className="text-center text-sm font-normal text-gray-700 sm:text-start dark:text-gray-400">
                حساب کاربری ندارید؟{' '}
                <Link
                  href="/signup"
                  className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
                >
                  ثبت نام
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
