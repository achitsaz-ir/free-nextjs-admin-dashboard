// ========================
// 🔐 AUTH TYPES
// ========================

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  user: UserProfile;
  message: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface ChangePasswordResponse {
  success: boolean;
  message: string;
}

// ========================
// 👤 USER TYPES
// ========================

export enum RoleType {
  ADMIN = 'admin',
  OWNER = 'owner',
  TENANT = 'tenant',
  ACCOUNTANT = 'accountant',
  SECURITY = 'security',
  METER_READER = 'meter_reader'
}

export interface UserRole {
  id: string;
  userId: string;
  role: RoleType;
  unitNumber?: string | null;
  isActive: boolean;
  isPrimary: boolean;
  createdAt: string;
}

export interface User {
  id: string;
  phone: string;
  nationalId: string;
  firstName: string;
  lastName: string;
  fullName: string;
  isApproved: boolean;
  isActive: boolean;
  hasChangedPassword: boolean;
  roles: UserRole[];
  userUnits: UserUnit[];
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile {
  id: string;
  phone: string;
  fullName: string;
  roles: RoleType[];
  primaryRole: RoleType | null;
  hasChangedPassword: boolean;
}

export interface CreateUserRequest {
  phone: string;
  nationalId: string;
  firstName: string;
  lastName: string;
  password?: string;
  roles: RoleType[];
  isApproved?: boolean;
  isActive?: boolean;
}

export interface CreateUserResponse {
  user: User;
  tempPassword?: string;
}

export interface UpdateUserRequest {
  phone?: string;
  nationalId?: string;
  firstName?: string;
  lastName?: string;
  roles?: RoleType[];
  isApproved?: boolean;
  isActive?: boolean;
}

export interface ManageUserRolesRequest {
  roles: RoleType[];
  primaryRole?: RoleType;
}

export interface ResetPasswordResponse {
  message: string;
  tempPassword: string;
}

// ========================
// 🏠 UNIT TYPES
// ========================

export enum UnitStatus {
  OCCUPIED = 'occupied',
  VACANT = 'vacant',
  UNDER_MAINTENANCE = 'under_maintenance',
  RESERVED = 'reserved'
}

export interface Unit {
  id: string;
  unitNumber: string;
  area: number;
  floorNumber: number | null;
  bedrooms: number;
  bathrooms: number;
  parkingSpaces: number;
  status: UnitStatus;
  monthlyRent: number | null;
  description: string | null;
  metadata: Record<string, any>;
  userUnits: UserUnit[];
  bills: Bill[];
  meterReadings: MeterReading[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateUnitRequest {
  unitNumber: string;
  area: number;
  floorNumber?: number;
  bedrooms?: number;
  bathrooms?: number;
  parkingSpaces?: number;
  status?: UnitStatus;
  monthlyRent?: number;
  description?: string;
}

export interface UpdateUnitRequest {
  unitNumber?: string;
  area?: number;
  floorNumber?: number;
  bedrooms?: number;
  bathrooms?: number;
  parkingSpaces?: number;
  status?: UnitStatus;
  monthlyRent?: number;
  description?: string;
}

// ========================
// 🔗 USER-UNIT ASSIGNMENT
// ========================

export interface UserUnit {
  id: string;
  userId: string;
  unitId: string;
  user: User;
  unit: Unit;
  isActive: boolean;
}

export interface AssignUserToUnitRequest {
  userId: string;
  unitId: string;
  roleType: RoleType;
}

// ========================
// 💰 BILLING TYPES
// ========================

export interface Bill {
  id: string;
  unitId: string;
  unit: Unit;
  billNumber: string;
  billingDate: string;
  dueDate: string;
  
  // مصرف فردی
  unitWaterConsumption: number;
  unitElectricityConsumption: number;
  
  // سهم مشترکات
  unitShareWater: number;
  unitShareElectricity: number;
  excessWaterShare: number;
  excessElectricityShare: number;
  
  // مصرف نهایی
  finalWaterConsumption: number;
  finalElectricityConsumption: number;
  
  // هزینه‌های اصلی
  waterCost: number;
  electricityCost: number;
  waterSubscription: number;
  electricitySubscription: number;
  sewageCost: number;
  
  // هزینه‌های مشترک
  staffSalaryShare: number;
  maintenanceShare: number;
  securityShare: number;
  gardeningShare: number;
  otherCommonShare: number;
  
  // مجاميع
  totalAmount: number;
  previousBalance: number;
  finalAmount: number;
  status: BillStatus;
  
  // اطلاعات تکمیلی
  unitAreaSharePercentage: number;
  totalComplexWater: number;
  totalComplexElectricity: number;
  commonWaterConsumption: number;
  commonElectricityConsumption: number;
  
  createdAt: string;
}

export enum BillStatus {
  PENDING = 'pending',
  PAID = 'paid',
  OVERDUE = 'overdue'
}

export interface MeterReading {
  id: string;
  unitId: string;
  unit?: Unit;
  readingDate: string;
  waterMeter1: number;
  waterMeter2: number;
  electricityMeter1: number;
  electricityMeter2: number;
  readBy: string;
  createdAt: string;
}

export interface ComplexMeterReading {
  id: string;
  readingDate: string;
  mainWaterMeter: number;
  mainElectricityMeter: number;
  readBy: string;
  createdAt: string;
}

export interface TieredRate {
  id: string;
  monthlySettingsId: string;
  utilityType: 'water' | 'electricity';
  fromAmount: number;
  toAmount: number | null;
  rate: number;
  stepOrder: number;
}

export interface MonthlyBillingSettings {
  id: string;
  billingMonth: string;
  waterExcessAmount: number;
  electricityExcessAmount: number;
  waterSubscription: number;
  electricitySubscription: number;
  staffSalaryTotal: number;
  maintenanceCost: number;
  securityCost: number;
  gardeningCost: number;
  otherCommonCosts: number;
  sewagePercentage: number;
  tieredRates: TieredRate[];
  createdAt: string;
}

// ========================
// 📊 BILLING REQUEST TYPES
// ========================

export interface CreateMeterReadingRequest {
  unitId: string;
  waterMeter1: number;
  waterMeter2: number;
  electricityMeter1: number;
  electricityMeter2: number;
  readingDate: string;
}

export interface CreateComplexMeterReadingRequest {
  readingDate: string;
  mainWaterMeter: number;
  mainElectricityMeter: number;
}

export interface TieredRateRequest {
  utilityType: 'water' | 'electricity';
  fromAmount: number;
  toAmount?: number;
  rate: number;
  stepOrder: number;
}

export interface CreateMonthlyBillingSettingsRequest {
  billingMonth: string;
  waterExcessAmount?: number;
  electricityExcessAmount?: number;
  waterSubscription?: number;
  electricitySubscription?: number;
  staffSalaryTotal?: number;
  maintenanceCost?: number;
  securityCost?: number;
  gardeningCost?: number;
  otherCommonCosts?: number;
  sewagePercentage?: number;
  tieredRates?: TieredRateRequest[];
}

export interface GenerateBillsResponse {
  successCount: number;
  errorCount: number;
  errors: string[];
  bills: Bill[];
}

// ========================
// 📈 DASHBOARD & REPORTS
// ========================

export interface DashboardSummary {
  totalUnits: number;
  totalBills: number;
  unpaidBills: number;
  totalRevenue: number;
  occupiedUnits: number;
  currentMonthSettings?: MonthlyBillingSettings;
}

export interface MonthlyReport {
  monthSummary: {
    billingMonth: string;
    settings: MonthlyBillingSettings | null;
    totalBills: number;
  };
  totalRevenue: number;
  totalUnits: number;
  paidBills: number;
  unpaidBills: number;
  complexConsumption: {
    totalWater: number;
    totalElectricity: number;
    commonWater: number;
    commonElectricity: number;
  };
  unitsSummary: Array<{
    unitNumber: string;
    area: number;
    finalWaterConsumption: number;
    finalElectricityConsumption: number;
    totalAmount: number;
    status: string;
  }>;
}

export interface UnitForReading {
  id: string;
  unitNumber: string;
  lastReading?: string;
}

// ========================
// 📄 EXCEL IMPORT TYPES
// ========================

export interface ExcelImportResponse {
  success: boolean;
  message: string;
  fileInfo: {
    originalFileName: string;
    fileSize: string;
    uploadTime: string;
  };
  importType: string;
  totalProcessed: number;
  successCount: number;
  errorCount: number;
  errors: string[];
  createdUsers?: Array<{
    phone: string;
    tempPassword: string;
  }>;
  importSummary?: any;
}

// ========================
// 🔧 API RESPONSE WRAPPERS
// ========================

export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  success: boolean;
}

export interface ApiError {
  message: string;
  statusCode: number;
  error?: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// ========================
// 🎯 FORM TYPES
// ========================

export interface LoginFormData {
  username: string;
  password: string;
}

export interface ChangePasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface UserFormData {
  phone: string;
  nationalId: string;
  firstName: string;
  lastName: string;
  password?: string;
  roles: RoleType[];
  primaryRole?: RoleType;
  isApproved: boolean;
  isActive: boolean;
}

export interface UnitFormData {
  unitNumber: string;
  area: number;
  floorNumber?: number;
  bedrooms: number;
  bathrooms: number;
  parkingSpaces: number;
  status: UnitStatus;
  monthlyRent?: number;
  description?: string;
}

export interface MeterReadingFormData {
  unitId: string;
  waterMeter1: number;
  waterMeter2: number;
  electricityMeter1: number;
  electricityMeter2: number;
  readingDate: string;
}

export interface ComplexMeterReadingFormData {
  readingDate: string;
  mainWaterMeter: number;
  mainElectricityMeter: number;
}

export interface AssignmentFormData {
  userId: string;
  unitId: string;
  roleType: RoleType;
}

export interface MonthlySettingsFormData {
  billingMonth: string;
  waterExcessAmount: number;
  electricityExcessAmount: number;
  waterSubscription: number;
  electricitySubscription: number;
  staffSalaryTotal: number;
  maintenanceCost: number;
  securityCost: number;
  gardeningCost: number;
  otherCommonCosts: number;
  sewagePercentage: number;
  tieredRates: {
    water: TieredRateFormData[];
    electricity: TieredRateFormData[];
  };
}

export interface TieredRateFormData {
  fromAmount: number;
  toAmount?: number;
  rate: number;
  stepOrder: number;
}

// ========================
// 🎨 UI STATE TYPES
// ========================

export interface LoadingState {
  isLoading: boolean;
  message?: string;
}

export interface ErrorState {
  hasError: boolean;
  message?: string;
  statusCode?: number;
}

export interface TableState<T = any> {
  data: T[];
  loading: boolean;
  error?: string;
  pagination: {
    current: number;
    pageSize: number;
    total: number;
  };
  filters: Record<string, any>;
  sorting: {
    field?: string;
    order?: 'ascend' | 'descend';
  };
}

export interface ModalState {
  isOpen: boolean;
  mode: 'create' | 'edit' | 'view' | 'delete';
  data?: any;
}

// ========================
// 🔍 FILTER TYPES
// ========================

export interface UserFilters {
  role?: RoleType;
  status?: 'active' | 'inactive' | 'pending';
  search?: string;
}

export interface UnitFilters {
  status?: UnitStatus;
  floorNumber?: number;
  search?: string;
}

export interface BillFilters {
  status?: BillStatus;
  month?: string;
  unitId?: string;
  search?: string;
}

// ========================
// 📱 THEME & PREFERENCES
// ========================

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  language: 'fa' | 'en';
  dateFormat: 'persian' | 'gregorian';
  numberFormat: 'persian' | 'english';
}

export interface AppConfig {
  apiBaseUrl: string;
  version: string;
  environment: 'development' | 'production' | 'staging';
  features: {
    darkMode: boolean;
    rtlSupport: boolean;
    mobileApp: boolean;
  };
}

// ========================
// 🔐 AUTH STORE TYPES
// ========================

export interface AuthState {
  user: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface AuthActions {
  login: (credentials: LoginFormData) => Promise<void>;
  logout: () => void;
  changePassword: (data: ChangePasswordFormData) => Promise<void>;
  checkAuth: () => Promise<void>;
  clearError: () => void;
}

// ========================
// 📊 CHART DATA TYPES
// ========================

export interface ChartDataPoint {
  label: string;
  value: number;
  color?: string;
}

export interface TimeSeriesDataPoint {
  date: string;
  value: number;
  category?: string;
}

export interface RevenueChartData {
  monthly: TimeSeriesDataPoint[];
  yearly: TimeSeriesDataPoint[];
}

export interface ConsumptionChartData {
  water: TimeSeriesDataPoint[];
  electricity: TimeSeriesDataPoint[];
}

export interface BillStatusChartData {
  paid: number;
  pending: number;
  overdue: number;
}

// ========================
// 🎯 UTILITY TYPES
// ========================

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

export type ApiEndpoint = 
  | 'auth'
  | 'users' 
  | 'units'
  | 'user-units'
  | 'billing'
  | 'excel';

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface ApiRequestConfig {
  method: HttpMethod;
  endpoint: string;
  data?: any;
  params?: Record<string, any>;
  headers?: Record<string, string>;
}

// ========================
// 🔄 VALIDATION SCHEMAS
// ========================

export interface ValidationError {
  field: string;
  message: string;
}

export interface FormValidationState<T = any> {
  data: T;
  errors: ValidationError[];
  touched: Record<keyof T, boolean>;
  isValid: boolean;
  isSubmitting: boolean;
}

// ========================
// 📱 RESPONSIVE TYPES
// ========================

export type BreakPoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

export interface ResponsiveConfig<T = any> {
  xs?: T;
  sm?: T;
  md?: T;
  lg?: T;
  xl?: T;
  '2xl'?: T;
}

// ========================
// 🎨 COMPONENT PROP TYPES
// ========================

export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface TableColumnConfig<T = any> {
  key: keyof T;
  title: string;
  dataIndex: keyof T;
  width?: number | string;
  fixed?: 'left' | 'right';
  sortable?: boolean;
  filterable?: boolean;
  render?: (value: any, record: T, index: number) => React.ReactNode;
}

export interface ButtonVariant {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
}

export interface ModalProps extends BaseComponentProps {
  open: boolean;
  title?: string;
  width?: number | string;
  closable?: boolean;
  maskClosable?: boolean;
  onCancel?: () => void;
  onOk?: () => void;
  footer?: React.ReactNode;
}