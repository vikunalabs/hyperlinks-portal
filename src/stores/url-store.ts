import { createStore } from 'zustand/vanilla';
import type { 
  ShortenedUrl, 
  UrlState, 
  ShortenUrlData, 
  UpdateUrlData,
  UrlFilters,
  UrlAnalytics,
  BulkUrlOperation,
  BulkUrlResult
} from '../types/url';
import { resourceApiClient, handleApiResponse } from '../services/api-client';

interface UrlStore extends UrlState {
  // Actions
  createUrl: (data: ShortenUrlData) => Promise<ShortenedUrl | null>;
  updateUrl: (id: string, data: UpdateUrlData) => Promise<ShortenedUrl | null>;
  deleteUrl: (id: string) => Promise<boolean>;
  fetchUrls: () => Promise<void>;
  fetchUrl: (id: string) => Promise<ShortenedUrl | null>;
  fetchAnalytics: (urlId: string) => Promise<UrlAnalytics | null>;
  bulkOperation: (operation: BulkUrlOperation) => Promise<BulkUrlResult | null>;
  
  // Filter and pagination
  setFilters: (filters: Partial<UrlFilters>) => void;
  clearFilters: () => void;
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;
  
  // State management
  setCurrentUrl: (url: ShortenedUrl | null) => void;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
}

const initialFilters: UrlFilters = {
  status: 'all'
};

const initialPagination = {
  page: 1,
  size: 20,
  totalElements: 0,
  totalPages: 0
};

export const urlStore = createStore<UrlStore>()((set, get) => ({
  // Initial state
  urls: [],
  currentUrl: null,
  analytics: null,
  isLoading: false,
  error: null,
  filters: initialFilters,
  pagination: initialPagination,

  // Actions
  createUrl: async (data: ShortenUrlData) => {
    set({ isLoading: true, error: null });

    try {
      const response = await resourceApiClient.post<ShortenedUrl>('/urls', data);

      return handleApiResponse(
        response,
        (url) => {
          const { urls } = get();
          set({
            urls: [url, ...urls],
            currentUrl: url,
            isLoading: false
          });
        },
        (error) => {
          set({
            isLoading: false,
            error: error.message
          });
        }
      );

    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to create URL'
      });
      return null;
    }
  },

  updateUrl: async (id: string, data: UpdateUrlData) => {
    set({ isLoading: true, error: null });

    try {
      const response = await resourceApiClient.put<ShortenedUrl>(`/urls/${id}`, data);

      return handleApiResponse(
        response,
        (updatedUrl) => {
          const { urls } = get();
          set({
            urls: urls.map(url => url.id === id ? updatedUrl : url),
            currentUrl: get().currentUrl?.id === id ? updatedUrl : get().currentUrl,
            isLoading: false
          });
        },
        (error) => {
          set({
            isLoading: false,
            error: error.message
          });
        }
      );

    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to update URL'
      });
      return null;
    }
  },

  deleteUrl: async (id: string) => {
    set({ isLoading: true, error: null });

    try {
      const response = await resourceApiClient.delete<{ message: string }>(`/urls/${id}`);

      return handleApiResponse(
        response,
        () => {
          const { urls } = get();
          set({
            urls: urls.filter(url => url.id !== id),
            currentUrl: get().currentUrl?.id === id ? null : get().currentUrl,
            isLoading: false
          });
        },
        (error) => {
          set({
            isLoading: false,
            error: error.message
          });
        }
      ) !== null;

    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to delete URL'
      });
      return false;
    }
  },

  fetchUrls: async () => {
    set({ isLoading: true, error: null });
    const { filters, pagination } = get();

    try {
      const queryParams = new URLSearchParams({
        page: pagination.page.toString(),
        size: pagination.size.toString(),
        ...(filters.status && filters.status !== 'all' && { status: filters.status }),
        ...(filters.search && { search: filters.search }),
        ...(filters.hasPassword !== undefined && { hasPassword: filters.hasPassword.toString() }),
        ...(filters.dateFrom && { dateFrom: filters.dateFrom }),
        ...(filters.dateTo && { dateTo: filters.dateTo }),
        ...(filters.tags && filters.tags.length > 0 && { tags: filters.tags.join(',') })
      });

      const response = await resourceApiClient.get<{
        urls: ShortenedUrl[];
        pagination: typeof pagination;
      }>(`/urls?${queryParams}`);

      handleApiResponse(
        response,
        (data) => {
          set({
            urls: data.urls,
            pagination: data.pagination,
            isLoading: false
          });
        },
        (error) => {
          set({
            isLoading: false,
            error: error.message
          });
        }
      );

    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch URLs'
      });
    }
  },

  fetchUrl: async (id: string) => {
    set({ isLoading: true, error: null });

    try {
      const response = await resourceApiClient.get<ShortenedUrl>(`/urls/${id}`);

      return handleApiResponse(
        response,
        (url) => {
          set({
            currentUrl: url,
            isLoading: false
          });
        },
        (error) => {
          set({
            isLoading: false,
            error: error.message
          });
        }
      );

    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch URL'
      });
      return null;
    }
  },

  fetchAnalytics: async (urlId: string) => {
    set({ isLoading: true, error: null });

    try {
      const response = await resourceApiClient.get<UrlAnalytics>(`/urls/${urlId}/analytics`);

      return handleApiResponse(
        response,
        (analytics) => {
          set({
            analytics,
            isLoading: false
          });
        },
        (error) => {
          set({
            isLoading: false,
            error: error.message
          });
        }
      );

    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch analytics'
      });
      return null;
    }
  },

  bulkOperation: async (operation: BulkUrlOperation) => {
    set({ isLoading: true, error: null });

    try {
      const response = await resourceApiClient.post<BulkUrlResult>('/urls/bulk', operation);

      return handleApiResponse(
        response,
        () => {
          // Refresh URL list after bulk operation
          get().fetchUrls();
          set({ isLoading: false });
        },
        (error) => {
          set({
            isLoading: false,
            error: error.message
          });
        }
      );

    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Bulk operation failed'
      });
      return null;
    }
  },

  // Filter and pagination
  setFilters: (newFilters: Partial<UrlFilters>) => {
    set({
      filters: { ...get().filters, ...newFilters },
      pagination: { ...get().pagination, page: 1 } // Reset to first page
    });
  },

  clearFilters: () => {
    set({
      filters: initialFilters,
      pagination: { ...get().pagination, page: 1 }
    });
  },

  setPage: (page: number) => {
    set({
      pagination: { ...get().pagination, page }
    });
  },

  setPageSize: (size: number) => {
    set({
      pagination: { ...get().pagination, size, page: 1 }
    });
  },

  // State management
  setCurrentUrl: (url: ShortenedUrl | null) => {
    set({ currentUrl: url });
  },

  clearError: () => {
    set({ error: null });
  },

  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  }
}));