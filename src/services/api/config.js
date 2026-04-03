// API Configuration
// Centralized configuration for API endpoints and settings

const ENV = {
  DEV: 'development',
  STAGING: 'staging',
  PROD: 'production',
};

// Current environment - change this based on your build config

const CURRENT_ENV = __DEV__ ? ENV.DEV : ENV.PROD;
// const CURRENT_ENV = ENV.DEV; // removed - was hardcoded

// API Base URLs for different environments
const API_BASE_URLS = {
  [ENV.DEV]: 'http://192.168.29.39:3001/app', // Local backend — change to your IP
  [ENV.STAGING]: 'https://staging.tallydekho.com/app',
  [ENV.PROD]: 'https://api.tallydekho.com/app', // Production AWS domain
};

// WebSocket URLs for different environments
const WS_BASE_URLS = {
  [ENV.DEV]: 'ws://192.168.29.39:3001', // Local backend — change to your IP
  [ENV.STAGING]: 'wss://staging.tallydekho.com',
  [ENV.PROD]: 'wss://api.tallydekho.com', // Production AWS domain
};

// API Configuration
export const API_CONFIG = {
  BASE_URL: API_BASE_URLS[CURRENT_ENV],
  WS_URL: WS_BASE_URLS[CURRENT_ENV],
  TIMEOUT: 30000, // 30 seconds
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 second
  CACHE_TTL: 5 * 60 * 1000, // 5 minutes
  MAX_CONCURRENT_REQUESTS: 5,
  REQUEST_DEDUP_WINDOW: 500, // milliseconds
};

// API Endpoints
export const API_ENDPOINTS = {
  // Auth
  PAIRING: '/pairing',
  VERIFY: '/verify',
  PAIRING_DEVICE: '/pairing-device',
  // PAIRED_DEVICE is an alias for PAIRING_DEVICE — use PAIRING_DEVICE
  SEND_OTP: '/send-otp',
  VERIFY_OTP: '/verify-otp',
  ONBOARDING: '/onboarding',

  // Companies
  COMPANIES: '/companies',

  // Ledgers
  LEDGERS: '/ledgers',
  LEDGER: '/ledger',

  // New endpoints added in backend v1.0
  VOUCHERS: '/vouchers',
  DASHBOARD: '/dashboard',
  REPORTS_PL: '/reports/pl',
  REPORTS_BALANCE_SHEET: '/reports/balance-sheet',

  // Stocks
  STOCK_DASHBOARD: '/stock-dashboard',
  STOCK_FILTERS: '/stock-filters',
  STOCKS: '/stocks',
  STOCK: '/stock',
};

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  REQUEST_TIMEOUT: 408,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504,
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network connection failed. Please check your internet.',
  TIMEOUT: 'Request timed out. Please try again.',
  UNAUTHORIZED: 'Session expired. Please login again.',
  SERVER_ERROR: 'Server error. Please try again later.',
  UNKNOWN: 'An unexpected error occurred.',
  NO_RESPONSE: 'No response from server.',
  CANCELLED: 'Request was cancelled.',
};

// Cache keys
export const CACHE_KEYS = {
  COMPANIES: 'api_cache_companies',
  PAIRING_DETAILS: 'api_cache_pairing_details',
  STOCK_FILTERS: 'api_cache_stock_filters',
};

// Request config presets
export const REQUEST_CONFIG = {
  NO_AUTH: {
    skipAuth: true,
  },
  NO_RETRY: {
    retryAttempts: 0,
  },
  LONG_TIMEOUT: {
    timeout: 60000, // 1 minute
  },
  SHORT_CACHE: {
    cache: true,
    cacheTTL: 60000, // 1 minute
  },
  MEDIUM_CACHE: {
    cache: true,
    cacheTTL: 300000, // 5 minutes
  },
  LONG_CACHE: {
    cache: true,
    cacheTTL: 3600000, // 1 hour
  },
};

export default {
  API_CONFIG,
  API_ENDPOINTS,
  HTTP_STATUS,
  ERROR_MESSAGES,
  CACHE_KEYS,
  REQUEST_CONFIG,
  ENV,
  CURRENT_ENV,
};
