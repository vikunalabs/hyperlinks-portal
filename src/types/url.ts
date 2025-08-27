// URL shortening and management types

export interface ShortenedUrl {
  id: string;
  shortCode: string;
  shortUrl: string;
  originalUrl: string;
  title?: string;
  description?: string;
  customSlug?: string;
  tags: string[];
  isActive: boolean;
  hasPassword: boolean;
  expiresAt?: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  clickCount: number;
  lastClickedAt?: string;
  qrCode?: string;
}

// URL Creation/Update Types
export interface ShortenUrlData {
  originalUrl: string;
  customSlug?: string;
  title?: string;
  description?: string;
  tags?: string[];
  expiresAt?: string;
  password?: string;
}

export interface UpdateUrlData {
  title?: string;
  description?: string;
  tags?: string[];
  isActive?: boolean;
  expiresAt?: string;
}

// Analytics Types
export interface UrlAnalytics {
  urlId: string;
  totalClicks: number;
  uniqueClicks: number;
  clicksByDate: ClickByDate[];
  clicksByCountry: ClickByCountry[];
  clicksByReferrer: ClickByReferrer[];
  clicksByDevice: ClickByDevice[];
  recentClicks: RecentClick[];
}

export interface ClickByDate {
  date: string;
  clicks: number;
  uniqueClicks: number;
}

export interface ClickByCountry {
  country: string;
  countryCode: string;
  clicks: number;
  percentage: number;
}

export interface ClickByReferrer {
  source: string;
  clicks: number;
  percentage: number;
}

export interface ClickByDevice {
  device: 'desktop' | 'mobile' | 'tablet';
  clicks: number;
  percentage: number;
}

export interface RecentClick {
  id: string;
  timestamp: string;
  country?: string;
  referrer?: string;
  userAgent?: string;
  ipAddress?: string; // May be hashed for privacy
}

// Bulk Operations
export interface BulkUrlOperation {
  urlIds: string[];
  operation: 'activate' | 'deactivate' | 'delete';
}

export interface BulkUrlResult {
  successful: string[];
  failed: Array<{ id: string; error: string }>;
  total: number;
  successCount: number;
  failureCount: number;
}

// URL List/Filtering Types
export interface UrlFilters {
  status?: 'all' | 'active' | 'inactive' | 'expired';
  hasPassword?: boolean;
  tags?: string[];
  search?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface UrlSortOptions {
  field: 'createdAt' | 'clickCount' | 'title' | 'lastClickedAt';
  direction: 'asc' | 'desc';
}

export interface UrlListParams extends UrlFilters {
  page?: number;
  size?: number;
  sort?: UrlSortOptions;
}

// QR Code Types
export interface QrCodeOptions {
  size: number;
  margin: number;
  format: 'png' | 'svg' | 'jpeg';
  errorCorrectionLevel: 'L' | 'M' | 'Q' | 'H';
}

export interface QrCodeResponse {
  urlId: string;
  qrCode: string; // Base64 encoded image or SVG string
  format: string;
  size: number;
}

// URL State Types
export interface UrlState {
  urls: ShortenedUrl[];
  currentUrl: ShortenedUrl | null;
  analytics: UrlAnalytics | null;
  isLoading: boolean;
  error: string | null;
  filters: UrlFilters;
  pagination: {
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
  };
}

// URL Event Types
export interface UrlEvents {
  'url.created': { url: ShortenedUrl; timestamp: number };
  'url.updated': { url: ShortenedUrl; timestamp: number };
  'url.deleted': { urlId: string; timestamp: number };
  'url.clicked': { urlId: string; shortCode: string; timestamp: number };
  'url.bulk.operation': { operation: string; count: number; timestamp: number };
}

// Validation Types
export interface UrlValidation {
  originalUrl: { isValid: boolean; message: string };
  customSlug: { isValid: boolean; message: string };
  title: { isValid: boolean; message: string };
  expiresAt: { isValid: boolean; message: string };
}

// Export/Import Types
export interface UrlExportData {
  urls: ShortenedUrl[];
  analytics: Record<string, UrlAnalytics>;
  exportedAt: string;
  totalCount: number;
}

export interface UrlImportData {
  originalUrl: string;
  customSlug?: string;
  title?: string;
  description?: string;
  tags?: string[];
}