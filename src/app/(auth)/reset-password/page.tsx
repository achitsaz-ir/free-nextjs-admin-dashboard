// app/(auth)/reset-password/page.tsx

import ResetPasswordForm from '@/components/auth/ResetPasswordForm';

export const metadata = {
  title: 'تغییر رمز عبور - اسپادانا PropTech',
  description: 'تغییر رمز عبور حساب کاربری',
};

export default function ResetPasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4 dark:bg-gray-900">
      <div className="w-full max-w-lg">
        <ResetPasswordForm />
      </div>
    </div>
  );
}
