// lib/api/excel.ts
import { apiClient } from './client';
import { ExcelImportResponse } from '@/types';

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

  async getTemplateInfo(): Promise<any> {
    const response = await apiClient.get('/excel/download-templates');
    return response.data;
  },

  async getBillingTemplateInfo(): Promise<any> {
    const response = await apiClient.get('/excel/billing-template-info');
    return response.data;
  },
};
