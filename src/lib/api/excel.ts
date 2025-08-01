// lib/api/excel.ts
import { apiClient } from './client';
import { ExcelImportResponse, TemplateInfo, BillingTemplateInfo } from '@/types'; // فرض بر این است که این تایپ‌ها در '@/types' تعریف شده‌اند

export const excelApi = {
  async importUsers(formData: FormData): Promise<ExcelImportResponse> {
    const response = await apiClient.post('/excel/import-users', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async importUnits(formData: FormData): Promise<ExcelImportResponse> {
    const response = await apiClient.post('/excel/import-units', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async importInitialBillingData(formData: FormData): Promise<ExcelImportResponse> {
    const response = await apiClient.post('/excel/import-initial-billing-data', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async getImportReport(): Promise<any> {
    const response = await apiClient.get('/excel/import-report');
    return response.data;
  },

  // متد برای دریافت اطلاعات تمام قالب‌ها (اطلاعات متا)
  async getTemplateInfo(): Promise<TemplateInfo> {
    const response = await apiClient.get('/excel/download-templates');
    return response.data;
  },

  // متد دریافت راهنمای قالب داده‌های بیلینگ اولیه
  async getBillingTemplateInfo(): Promise<BillingTemplateInfo> {
    const response = await apiClient.get('/excel/billing-template-info');
    return response.data;
  },

  // متدهای دانلود فایل قالب Excel (محتوای باینری)
  async downloadUsersTemplate(): Promise<Blob> {
    const response = await apiClient.get('/excel/templates/users', {
      responseType: 'blob',
    });
    return response.data;
  },

  async downloadUnitsTemplate(): Promise<Blob> {
    const response = await apiClient.get('/excel/templates/units', {
      responseType: 'blob',
    });
    return response.data;
  },

  async downloadInitialBillingTemplate(): Promise<Blob> {
    const response = await apiClient.get('/excel/templates/initial-billing', {
      responseType: 'blob',
    });
    return response.data;
  },

  async downloadAllTemplatesZip(): Promise<Blob> {
    const response = await apiClient.get('/excel/templates/all', {
      responseType: 'blob',
    });
    return response.data;
  },
};
