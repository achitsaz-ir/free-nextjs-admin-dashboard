'use client';

import React, { useEffect } from 'react';

import { useModal } from '@/hooks/useModal';

import { useForm, Controller, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { usersApi } from '@/lib/api/users';

import { RoleType, CreateUserRequest } from '@/types';
import Label from '@/components/form/Label';
import Input from '@/components/form/input/InputField';
import Button from '@/components/ui/button/Button';
import { Modal } from '@/components/ui/modal';

// تعریف لیست نقش‌ها بر اساس RoleType
const rolesEnum = [
  RoleType.ADMIN,
  RoleType.OWNER,
  RoleType.TENANT,
  RoleType.ACCOUNTANT,
  RoleType.SECURITY,
  RoleType.METER_READER,
] as const;

// اسکیما اعتبارسنجی با zod
const createUserSchema = z.object({
  phone: z.string().min(1, { message: 'موبایل الزامی است' }),
  nationalId: z.string().min(1, { message: 'کد ملی الزامی است' }),
  firstName: z.string().min(1, { message: 'نام الزامی است' }),
  lastName: z.string().min(1, { message: 'نام خانوادگی الزامی است' }),
  password: z.string().min(6, { message: 'رمز عبور باید حداقل 6 کاراکتر باشد' }),
  roles: z.array(z.enum(rolesEnum)).min(1, { message: 'حداقل یک نقش انتخاب کنید' }),
  primaryRole: z.enum(rolesEnum).optional(),
  isApproved: z.boolean().default(false),
  isActive: z.boolean().default(true),
});
//   .refine((data) => data.primaryRole === undefined || data.roles.includes(data.primaryRole), {
//     message: 'نقش اصلی باید یکی از نقش‌های انتخاب شده باشد',
//     path: ['primaryRole'],
//   });

type CreateUserFormData = z.infer<typeof createUserSchema>;

export default function UserFormInModal() {
  const { isOpen, openModal, closeModal } = useModal();

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<CreateUserFormData>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      phone: '',
      nationalId: '',
      firstName: '',
      lastName: '',
      password: '',
      roles: [],
      //   primaryRole: undefined,
      isApproved: false,
      isActive: true,
    },
  });

  // مشاهده roles برای اعتبارسنجی انتخاب primaryRole معتبر
  const selectedRoles = useWatch({ control, name: 'roles' });

  // اگر نقش اصلی انتخاب شده خارج از roles باشد باید پاک شود
  useEffect(() => {
    const primaryRole = watch('primaryRole');
    if (primaryRole && !selectedRoles.includes(primaryRole)) {
      setValue('primaryRole', undefined);
    }
  }, [selectedRoles, setValue, watch]);

  const onSubmit = async (data: CreateUserFormData) => {
    try {
      await usersApi.createUser(data as CreateUserRequest);
      alert('کاربر با موفقیت ثبت شد');
      reset();
      closeModal();
    } catch (error: any) {
      alert(
        'خطا در ثبت کاربر: ' + (error.response?.data?.message || error.message || 'خطای ناشناخته'),
      );
    }
  };

  return (
    <>
      <Button size="sm" onClick={openModal}>
        ثبت کاربر جدید
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={() => {
          reset();
          closeModal();
        }}
        className="max-w-[600px] p-5 lg:p-10"
      >
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <h4 className="mb-6 text-lg font-medium text-gray-800 dark:text-white/90">
            مشخصات کاربر
          </h4>

          <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
            {/* phone */}
            <div className="col-span-1">
              <Label htmlFor="phone">موبایل</Label>
              <Input
                id="phone"
                type="text"
                placeholder="09121234567"
                {...register('phone')}
                error={errors.phone?.message}
                aria-invalid={errors.phone ? 'true' : 'false'}
              />
            </div>

            {/* nationalId */}
            <div className="col-span-1">
              <Label htmlFor="nationalId">کد ملی</Label>
              <Input
                id="nationalId"
                type="text"
                placeholder="0012345678"
                {...register('nationalId')}
                error={errors.nationalId?.message}
                aria-invalid={errors.nationalId ? 'true' : 'false'}
              />
            </div>

            {/* firstName */}
            <div className="col-span-1">
              <Label htmlFor="firstName">نام</Label>
              <Input
                id="firstName"
                type="text"
                placeholder="علی"
                {...register('firstName')}
                error={errors.firstName?.message}
                aria-invalid={errors.firstName ? 'true' : 'false'}
              />
            </div>

            {/* lastName */}
            <div className="col-span-1">
              <Label htmlFor="lastName">نام خانوادگی</Label>
              <Input
                id="lastName"
                type="text"
                placeholder="احمدی"
                {...register('lastName')}
                error={errors.lastName?.message}
                aria-invalid={errors.lastName ? 'true' : 'false'}
              />
            </div>

            {/* password */}
            <div className="col-span-1">
              <Label htmlFor="password">رمز عبور</Label>
              <Input
                id="password"
                type="password"
                placeholder="******"
                {...register('password')}
                error={errors.password?.message}
                aria-invalid={errors.password ? 'true' : 'false'}
                autoComplete="new-password"
              />
            </div>

            {/* roles - چک‌باکس چندانتخابی */}
            <div className="col-span-1 sm:col-span-2">
              <Label>نقش‌ها</Label>
              <Controller
                control={control}
                name="roles"
                render={({ field }) => {
                  const { value, onChange } = field;

                  const toggleRole = (role: RoleType) => {
                    if (value.includes(role)) {
                      onChange(value.filter((r) => r !== role));
                    } else {
                      onChange([...value, role]);
                    }
                  };

                  return (
                    <div className="flex flex-wrap gap-4">
                      {rolesEnum.map((role) => (
                        <label
                          key={role}
                          className="inline-flex cursor-pointer items-center space-x-2"
                        >
                          <input
                            type="checkbox"
                            checked={value.includes(role)}
                            onChange={() => toggleRole(role)}
                            className="form-checkbox"
                            aria-checked={value.includes(role)}
                          />
                          <span>{role}</span>
                        </label>
                      ))}
                    </div>
                  );
                }}
              />
              {errors.roles && <p className="mt-1 text-xs text-red-600">{errors.roles.message}</p>}
            </div>

            {/* primaryRole - انتخاب یک نقش اصلی */}
            {/* <div className="col-span-1 sm:col-span-2">
              <Label htmlFor="primaryRole">نقش اصلی</Label>
              <Controller
                control={control}
                name="primaryRole"
                render={({ field }) => {
                  const { value, onChange } = field;
                  // فقط نقش‌های انتخاب شده اجازه انتخاب نقش اصلی دارند
                  const allowedPrimaryRoles = selectedRoles;

                  return (
                    <select
                      id="primaryRole"
                      value={value ?? ''}
                      onChange={(e) => {
                        const val = e.target.value as RoleType;
                        onChange(val === '' ? undefined : val);
                      }}
                      className="block w-full rounded border border-gray-300 p-2 text-sm"
                      aria-invalid={errors.primaryRole ? 'true' : 'false'}
                      aria-describedby={errors.primaryRole ? 'error-primaryRole' : undefined}
                    >
                      <option value="">انتخاب نقش اصلی (اختیاری)</option>
                      {allowedPrimaryRoles.length === 0 && (
                        <option disabled>ابتدا نقش‌ها را انتخاب کنید</option>
                      )}
                      {allowedPrimaryRoles.map((role) => (
                        <option key={role} value={role}>
                          {role}
                        </option>
                      ))}
                    </select>
                  );
                }}
              />
              {errors.primaryRole && (
                <p id="error-primaryRole" className="mt-1 text-xs text-red-600">
                  {errors.primaryRole.message}
                </p>
              )}
            </div> */}

            {/* isApproved */}
            <div className="col-span-1">
              <label className="inline-flex cursor-pointer items-center space-x-2 select-none">
                <input type="checkbox" {...register('isApproved')} className="form-checkbox" />
                <span>تأیید شده</span>
              </label>
            </div>

            {/* isActive */}
            <div className="col-span-1">
              <label className="inline-flex cursor-pointer items-center space-x-2 select-none">
                <input type="checkbox" {...register('isActive')} className="form-checkbox" />
                <span>فعال</span>
              </label>
            </div>
          </div>

          {/* دکمه‌ها */}
          <div className="mt-6 flex items-center justify-end gap-3">
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                reset();
                closeModal();
              }}
              disabled={isSubmitting}
              type="button"
            >
              بستن
            </Button>
            <Button size="sm" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'در حال ثبت...' : 'ثبت'}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
