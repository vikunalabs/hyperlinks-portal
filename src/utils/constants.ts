// src/utils/constants.ts

// API endpoints and configuration constants

// Base URLs for the dual server architecture
export const API_BASE_URLS = {
  AUTH_SERVER: import.meta.env.VITE_AUTH_SERVER_URL || 'http://localhost:8090',
  RESOURCE_SERVER: import.meta.env.VITE_RESOURCE_SERVER_URL || 'http://localhost:8080'
} as const;

// Authentication endpoints (Auth Server)
export const AUTH_ENDPOINTS = {
  LOGIN: '/api/v1/auth/login',
  REGISTER: '/api/v1/auth/register',
  LOGOUT: '/api/v1/auth/logout',
  REFRESH: '/api/v1/auth/refresh',
  CSRF: '/api/v1/auth/csrf',
  USER: '/api/v1/auth/user',
  FORGOT_PASSWORD: '/api/v1/auth/forgot-password',
  RESET_PASSWORD: '/api/v1/auth/reset-password',
  CONFIRM_ACCOUNT: '/api/v1/auth/confirm-account',
  RESEND_VERIFICATION: '/api/v1/auth/resend-verification',
  GOOGLE_OAUTH: '/oauth2/authorization/google'
} as const;

// Resource Server endpoints  
export const RESOURCE_ENDPOINTS = {
  LINKS: '/api/links',
  ANALYTICS: '/api/analytics',
  QRCODES: '/api/qrcodes',
  ENTERPRISE: '/api/enterprise'
} as const;

// HTTP configuration
export const HTTP_CONFIG = {
  TIMEOUT: 10000, // 10 seconds
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000 // 1 second
} as const;

// Storage keys
export const STORAGE_KEYS = {
  CSRF_TOKEN: 'csrf_token',
  THEME: 'app_theme'
} as const;

// Application constants
export const APP_CONFIG = {
  NAME: 'Hyperlinks Management Platform',
  VERSION: '1.0.0',
  DEBUG: import.meta.env.DEV
} as const;