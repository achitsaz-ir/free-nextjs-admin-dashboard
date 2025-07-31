// components/ui/FileDropzone.tsx
'use client';

import { useCallback, useState } from 'react';
import { Upload, FileSpreadsheet, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FileDropzoneProps {
  onFileSelect: (file: File) => void;
  acceptedTypes?: string;
  maxSize?: number; // MB
  loading?: boolean;
  dragActive?: boolean;
  onDragActiveChange?: (active: boolean) => void;
  className?: string;
}

export default function FileDropzone({
  onFileSelect,
  acceptedTypes = '.xlsx,.xls',
  maxSize = 10,
  loading = false,
  dragActive = false,
  onDragActiveChange,
  className,
}: FileDropzoneProps) {
  const [error, setError] = useState<string>('');

  const validateFile = (file: File): string | null => {
    // Check file type
    const allowedTypes = acceptedTypes.split(',').map((type) => type.trim());
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();

    if (!allowedTypes.includes(fileExtension)) {
      return `فقط فایل‌های ${acceptedTypes} مجاز هستند`;
    }

    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      return `حجم فایل نباید بیشتر از ${maxSize}MB باشد`;
    }

    return null;
  };

  const handleFileSelect = useCallback(
    (file: File) => {
      const validationError = validateFile(file);
      if (validationError) {
        setError(validationError);
        return;
      }

      setError('');
      onFileSelect(file);
    },
    [onFileSelect, acceptedTypes, maxSize],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      onDragActiveChange?.(false);

      const files = Array.from(e.dataTransfer.files);
      if (files.length > 0) {
        handleFileSelect(files[0]);
      }
    },
    [handleFileSelect, onDragActiveChange],
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const handleDragEnter = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      onDragActiveChange?.(true);
    },
    [onDragActiveChange],
  );

  const handleDragLeave = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      if (!e.currentTarget.contains(e.relatedTarget as Node)) {
        onDragActiveChange?.(false);
      }
    },
    [onDragActiveChange],
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  return (
    <div className={cn('space-y-4', className)}>
      <div
        className={cn(
          'relative rounded-lg border-2 border-dashed p-8 text-center transition-colors',
          dragActive || loading
            ? 'border-brand-400 bg-brand-50 dark:border-brand-600 dark:bg-brand-900/20'
            : 'border-gray-300 hover:border-gray-400 dark:border-gray-600 dark:hover:border-gray-500',
          loading && 'pointer-events-none opacity-60',
        )}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
      >
        <input
          type="file"
          accept={acceptedTypes}
          onChange={handleInputChange}
          className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
          disabled={loading}
        />

        <div className="space-y-4">
          <div className="mx-auto flex h-16 w-16 items-center justify-center">
            {loading ? (
              <div className="border-brand-600 h-8 w-8 animate-spin rounded-full border-b-2" />
            ) : (
              <FileSpreadsheet className="h-8 w-8 text-gray-400" />
            )}
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              {loading ? 'در حال پردازش...' : 'فایل Excel را انتخاب کنید'}
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {loading ? 'لطفاً صبر کنید...' : 'فایل را اینجا بکشید یا کلیک کنید'}
            </p>
          </div>

          <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
            <Upload className="h-3 w-3" />
            <span>
              حداکثر {maxSize}MB • {acceptedTypes}
            </span>
          </div>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-md bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400">
          <AlertCircle className="h-4 w-4" />
          {error}
        </div>
      )}
    </div>
  );
}
