// app/(dashboard)/admin/import/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import {
  Upload,
  Download,
  FileSpreadsheet,
  Users,
  Building,
  Settings,
  CheckCircle,
  AlertCircle,
  Loader2,
  FileText,
  Info,
} from 'lucide-react';

import Button from '@/components/ui/button/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { Alert, AlertDescription } from '@/components/ui/Alert';
import { Progress } from '@/components/ui/Progress';
import FileDropzone from '@/components/ui/FileDropzone';
import { excelApi } from '@/lib/api/excel';
import { ExcelImportResponse } from '@/types';

type ImportType = 'users' | 'units' | 'initial-billing';

interface ImportResult {
  type: ImportType;
  result: ExcelImportResponse;
  timestamp: Date;
}

export default function ImportExportPage() {
  const [activeTab, setActiveTab] = useState<ImportType>('users');
  const [importHistory, setImportHistory] = useState<ImportResult[]>([]);
  const [dragActive, setDragActive] = useState<ImportType | null>(null);
  const router = useRouter();

  // Import mutation
  const importMutation = useMutation({
    mutationFn: async ({ file, type }: { file: File; type: ImportType }) => {
      const formData = new FormData();
      formData.append('file', file);

      switch (type) {
        case 'users':
          return await excelApi.importUsers(formData);
        case 'units':
          return await excelApi.importUnits(formData);
        case 'initial-billing':
          return await excelApi.importInitialBillingData(formData);
      }
    },
    onSuccess: (result, variables) => {
      toast.success(result.message || 'فایل با موفقیت پردازش شد');

      // Add to history
      const newResult: ImportResult = {
        type: variables.type,
        result,
        timestamp: new Date(),
      };
      setImportHistory((prev) => [newResult, ...prev.slice(0, 9)]); // Keep last 10
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'خطا در پردازش فایل');
    },
  });

  // Get import info
  const getImportInfo = (type: ImportType) => {
    const info = {
      users: {
        title: 'کاربران',
        description: 'وارد کردن لیست کاربران از فایل Excel',
        icon: Users,
        color: 'blue',
        acceptedFormats: '.xlsx, .xls',
        maxSize: '10MB',
        requiredColumns: ['phone', 'nationalId', 'firstName', 'lastName', 'role', 'unitNumber'],
        sampleData: [
          '09121234567 | 0012345678 | علی | احمدی | owner | 101',
          '09121234568 | 0012345679 | فاطمه | محمدی | tenant | 102',
        ],
      },
      units: {
        title: 'واحدها',
        description: 'وارد کردن اطلاعات واحدهای مسکونی',
        icon: Building,
        color: 'green',
        acceptedFormats: '.xlsx, .xls',
        maxSize: '10MB',
        requiredColumns: ['unitNumber', 'area', 'floorNumber', 'bedrooms', 'bathrooms', 'status'],
        sampleData: ['101 | 85.5 | 1 | 2 | 1 | occupied', '102 | 92.0 | 1 | 2 | 2 | vacant'],
      },
      'initial-billing': {
        title: 'داده‌های اولیه بیلینگ',
        description: 'وارد کردن تنظیمات و قرائت‌های اولیه (ماه صفر)',
        icon: Settings,
        color: 'purple',
        acceptedFormats: '.xlsx, .xls',
        maxSize: '10MB',
        requiredColumns: ['چندین شیت با ساختار پیچیده'],
        sampleData: ['شیت 1: قرائت اولیه کنتورها', 'شیت 2: تنظیمات ماهانه و نرخ‌ها'],
      },
    };

    return info[type];
  };

  const handleFileUpload = (file: File, type: ImportType) => {
    // Validate file
    if (!file.name.match(/\.(xlsx|xls)$/)) {
      toast.error('فقط فایل‌های Excel (.xlsx, .xls) مجاز هستند');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error('حجم فایل نباید بیشتر از 10MB باشد');
      return;
    }

    importMutation.mutate({ file, type });
  };

  const downloadTemplate = async (type: ImportType) => {
    try {
      const response = await excelApi.getTemplateInfo();
      // This would typically trigger a download
      toast.success('قالب در حال دانلود است...');
    } catch (error) {
      toast.error('خطا در دانلود قالب');
    }
  };

  const getStatusColor = (successCount: number, errorCount: number) => {
    if (errorCount === 0) return 'text-green-600';
    if (successCount === 0) return 'text-red-600';
    return 'text-yellow-600';
  };

  return (
    <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-8">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">مدیریت Excel</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            وارد کردن و خروجی گیری اطلاعات از طریق فایل‌های Excel
          </p>
        </div>

        {/* Import/Export Tabs */}
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as ImportType)}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              کاربران
            </TabsTrigger>
            <TabsTrigger value="units" className="flex items-center gap-2">
              <Building className="h-4 w-4" />
              واحدها
            </TabsTrigger>
            <TabsTrigger value="initial-billing" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              بیلینگ اولیه
            </TabsTrigger>
          </TabsList>

          {/* Tab Contents */}
          {(['users', 'units', 'initial-billing'] as ImportType[]).map((type) => {
            const info = getImportInfo(type);
            const IconComponent = info.icon;

            return (
              <TabsContent key={type} value={type} className="space-y-6">
                <div className="grid gap-6 lg:grid-cols-2">
                  {/* Import Section */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Upload className="h-5 w-5" />
                        وارد کردن {info.title}
                      </CardTitle>
                      <CardDescription>{info.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* File Upload Area */}
                      <FileDropzone
                        onFileSelect={(file) => handleFileUpload(file, type)}
                        acceptedTypes=".xlsx,.xls"
                        maxSize={10}
                        loading={importMutation.isPending}
                        dragActive={dragActive === type}
                        onDragActiveChange={(active) => setDragActive(active ? type : null)}
                      />

                      {/* Upload Progress */}
                      {importMutation.isPending && (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span className="text-sm text-gray-600">در حال پردازش فایل...</span>
                          </div>
                          <Progress value={undefined} className="w-full" />
                        </div>
                      )}

                      {/* File Requirements */}
                      <Alert>
                        <Info className="h-4 w-4" />
                        <AlertDescription>
                          <div className="space-y-1 text-sm">
                            <p>
                              <strong>فرمت مجاز:</strong> {info.acceptedFormats}
                            </p>
                            <p>
                              <strong>حداکثر حجم:</strong> {info.maxSize}
                            </p>
                            <p>
                              <strong>ستون‌های ضروری:</strong>
                            </p>
                            <ul className="mr-4 list-disc">
                              {info.requiredColumns.map((col, idx) => (
                                <li key={idx}>{col}</li>
                              ))}
                            </ul>
                          </div>
                        </AlertDescription>
                      </Alert>
                    </CardContent>
                  </Card>

                  {/* Template Download Section */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Download className="h-5 w-5" />
                        دانلود قالب
                      </CardTitle>
                      <CardDescription>قالب آماده برای وارد کردن {info.title}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div
                        className={`rounded-lg border-2 border-dashed border-${info.color}-200 bg-${info.color}-50 p-6 text-center dark:border-${info.color}-800 dark:bg-${info.color}-900/20`}
                      >
                        <IconComponent
                          className={`mx-auto h-12 w-12 text-${info.color}-400 mb-4`}
                        />
                        <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-white">
                          قالب {info.title}
                        </h3>
                        <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                          شامل ستون‌ها و نمونه داده‌های مورد نیاز
                        </p>
                        <Button
                          onClick={() => downloadTemplate(type)}
                          variant="outline"
                          className="flex items-center gap-2"
                        >
                          <FileSpreadsheet className="h-4 w-4" />
                          دانلود قالب Excel
                        </Button>
                      </div>

                      {/* Sample Data */}
                      <div>
                        <h4 className="mb-2 text-sm font-medium text-gray-900 dark:text-white">
                          نمونه داده‌ها:
                        </h4>
                        <div className="space-y-1">
                          {info.sampleData.map((sample, idx) => (
                            <code
                              key={idx}
                              className="block rounded bg-gray-100 p-2 text-xs dark:bg-gray-800"
                            >
                              {sample}
                            </code>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            );
          })}
        </Tabs>

        {/* Import History */}
        {importHistory.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                تاریخچه Import
              </CardTitle>
              <CardDescription>آخرین عملیات وارد کردن فایل‌ها</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {importHistory.map((item, index) => {
                  const info = getImportInfo(item.type);
                  const IconComponent = info.icon;

                  return (
                    <div
                      key={index}
                      className="flex items-center justify-between rounded-lg border border-gray-200 p-4 dark:border-gray-700"
                    >
                      <div className="flex items-center gap-4">
                        <IconComponent className="h-8 w-8 text-gray-400" />
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white">
                            {info.title}
                          </h4>
                          <p className="text-sm text-gray-500">
                            {item.timestamp.toLocaleString('fa-IR')}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        {/* Status */}
                        <div className="text-right">
                          <div
                            className={`text-sm font-medium ${getStatusColor(
                              item.result.successCount,
                              item.result.errorCount,
                            )}`}
                          >
                            {item.result.successCount} موفق, {item.result.errorCount} خطا
                          </div>
                          <div className="text-xs text-gray-500">
                            از {item.result.totalProcessed} رکورد
                          </div>
                        </div>

                        {/* Status Icon */}
                        {item.result.errorCount === 0 ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : item.result.successCount === 0 ? (
                          <AlertCircle className="h-5 w-5 text-red-500" />
                        ) : (
                          <AlertCircle className="h-5 w-5 text-yellow-500" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Help Section */}
        <Card>
          <CardHeader>
            <CardTitle>راهنمای استفاده</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/20">
                  <Download className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="mb-2 font-medium text-gray-900 dark:text-white">1. دانلود قالب</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  ابتدا قالب Excel مربوطه را دانلود کنید
                </p>
              </div>

              <div className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
                  <FileSpreadsheet className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="mb-2 font-medium text-gray-900 dark:text-white">2. تکمیل اطلاعات</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  فایل را با اطلاعات صحیح تکمیل کنید
                </p>
              </div>

              <div className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/20">
                  <Upload className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="mb-2 font-medium text-gray-900 dark:text-white">3. آپلود فایل</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  فایل تکمیل شده را آپلود کنید
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
