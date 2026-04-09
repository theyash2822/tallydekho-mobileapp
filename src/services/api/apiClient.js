// Production-Ready API Client
// Robust API client with retry logic, caching, request deduplication, and comprehensive error handling

import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {API_CONFIG, API_ENDPOINTS, HTTP_STATUS, ERROR_MESSAGES} from './config';
import {NetworkMonitor} from '../utils/networkMonitor';
import {Logger} from '../utils/logger';

// Request cache and deduplication
const requestCache = new Map();
const pendingRequests = new Map();

const maskSensitiveHeaders = headers => {
  if (!headers) return {};
  const plainHeaders =
    typeof headers.toJSON === 'function' ? headers.toJSON() : {...headers};
  const masked = {...plainHeaders};
  const authKey = Object.keys(masked).find(
    key => key.toLowerCase() === 'authorization',
  );
  if (authKey && typeof masked[authKey] === 'string') {
    masked[authKey] = `${masked[authKey].slice(0, 12)}...`;
  }
  return masked;
};

const getFullUrl = config => {
  const base = (config?.baseURL || API_CONFIG.BASE_URL || '').replace(/\/$/, '');
  const path = (config?.url || '').startsWith('/')
    ? config.url
    : `/${config?.url || ''}`;
  const fullPath = `${base}${path}`;
  const params = config?.params;

  if (!params || typeof params !== 'object' || Array.isArray(params)) {
    return fullPath;
  }

  const queryString = new URLSearchParams(
    Object.entries(params)
      .filter(([, value]) => value !== undefined && value !== null)
      .map(([key, value]) => [key, String(value)]),
  ).toString();

  return queryString ? `${fullPath}?${queryString}` : fullPath;
};

/**
 * Generate a unique cache key for requests
 */
const generateCacheKey = (method, url, params) => {
  const paramString = params ? JSON.stringify(params) : '';
  return `${method}:${url}:${paramString}`;
};

/**
 * Check if cached data is still valid
 */
const isCacheValid = cacheEntry => {
  if (!cacheEntry) return false;
  const now = Date.now();
  return now - cacheEntry.timestamp < cacheEntry.ttl;
};

/**
 * Get data from cache
 */
const getCachedData = cacheKey => {
  const cached = requestCache.get(cacheKey);
  if (cached && isCacheValid(cached)) {
    Logger.debug('Cache hit', {cacheKey});
    return cached.data;
  }
  if (cached) {
    requestCache.delete(cacheKey);
  }
  return null;
};

/**
 * Set data to cache
 */
const setCachedData = (cacheKey, data, ttl = API_CONFIG.CACHE_TTL) => {
  requestCache.set(cacheKey, {
    data,
    timestamp: Date.now(),
    ttl,
  });
};

/**
 * Clear all cached data
 */
export const clearCache = () => {
  requestCache.clear();
  Logger.info('API cache cleared');
};

/**
 * Clear specific cache entry
 */
export const clearCacheEntry = cacheKey => {
  requestCache.delete(cacheKey);
  Logger.debug('Cache entry cleared', {cacheKey});
};

/**
 * Create axios instance with default configuration
 */
const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

/**
 * Request Interceptor
 * - Adds authentication token
 * - Implements request deduplication
 * - Adds request ID for tracking
 * - Manages request queue
 */
apiClient.interceptors.request.use(
  async config => {
    // Generate unique request ID
    config.requestId = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Check network connectivity — use cached state to avoid async NetInfo.fetch() per request
    const isConnected = NetworkMonitor.isNetworkConnected;
    if (!isConnected) {
      Logger.error('No network connection');
      return Promise.reject({
        message: ERROR_MESSAGES.NETWORK_ERROR,
        isNetworkError: true,
      });
    }

    // Add authentication token (skip for certain endpoints)
    if (!config.skipAuth) {
      try {
        const token = await AsyncStorage.getItem('authToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (error) {
        Logger.error('Failed to get auth token', error);
      }
    }

    // Log request details
    const requestPayload = config.method === 'get' ? config.params : config.data;
    Logger.network('request', {
      'Base url': (config?.baseURL || API_CONFIG.BASE_URL || '').replace(/\/$/, ''),
      Endpoint: config?.url || '',
      Method: config.method?.toUpperCase(),
      Header: maskSensitiveHeaders(config.headers),
      Request: requestPayload ?? null,
      'Full url': getFullUrl(config),
      Timeout: config.timeout,
      'Request id': config.requestId,
    });

    return config;
  },
  error => {
    Logger.error('Request interceptor error', error);
    return Promise.reject(error);
  },
);

/**
 * Response Interceptor
 * - Handles successful responses
 * - Implements comprehensive error handling
 * - Cleans up pending requests
 */
apiClient.interceptors.response.use(
  response => {
    // Clean up pending request
    const config = response.config;
    const dedupKey = generateCacheKey(
      config.method,
      config.url,
      config.params || config.data,
    );
    pendingRequests.delete(dedupKey);

    Logger.network('response', {
      'Base url': (config?.baseURL || API_CONFIG.BASE_URL || '').replace(/\/$/, ''),
      Endpoint: config?.url || '',
      Method: config.method?.toUpperCase(),
      Status: response.status,
      Header: maskSensitiveHeaders(response.headers),
      Response: response.data,
      'Full url': getFullUrl(config),
      'Request id': config.requestId,
    });

    return response.data;
  },
  async error => {
    const originalRequest = error.config;

    // Clean up pending request
    if (originalRequest) {
      const dedupKey = generateCacheKey(
        originalRequest.method,
        originalRequest.url,
        originalRequest.params || originalRequest.data,
      );
      pendingRequests.delete(dedupKey);
    }

    // Handle network errors
    if (error.message === 'Network Error' || !error.response) {
      Logger.error('Network error', {
        url: originalRequest?.url,
        message: error.message,
      });
      
      return Promise.reject({
        message: ERROR_MESSAGES.NETWORK_ERROR,
        isNetworkError: true,
        originalError: error,
      });
    }

    // Handle timeout
    if (error.code === 'ECONNABORTED') {
      Logger.error('Request timeout', {url: originalRequest?.url});
      return Promise.reject({
        message: ERROR_MESSAGES.TIMEOUT,
        isTimeout: true,
        originalError: error,
      });
    }

    const {response} = error;
    const status = response?.status;
    Logger.network('response', {
      'Base url': (originalRequest?.baseURL || API_CONFIG.BASE_URL || '').replace(
        /\/$/,
        '',
      ),
      Endpoint: originalRequest?.url || '',
      Method: originalRequest?.method?.toUpperCase(),
      Status: status || 'NETWORK_ERROR',
      Header: maskSensitiveHeaders(response?.headers),
      Response: response?.data ?? null,
      Error: error?.message,
      'Full url': getFullUrl(originalRequest || {}),
      'Request id': originalRequest?.requestId,
    });

    // Handle 401 Unauthorized - token expired
    if (status === HTTP_STATUS.UNAUTHORIZED) {
      Logger.warn('Unauthorized - clearing auth token');
      try {
        await AsyncStorage.removeItem('authToken');
        // You might want to trigger a navigation to login screen here
        // or emit an event that the app can listen to
      } catch (err) {
        Logger.error('Failed to clear auth token', err);
      }

      return Promise.reject({
        message: ERROR_MESSAGES.UNAUTHORIZED,
        statusCode: status,
        isUnauthorized: true,
      });
    }

    // Handle 429 Too Many Requests - rate limiting
    if (status === HTTP_STATUS.TOO_MANY_REQUESTS) {
      const retryAfter = response.headers['retry-after'];
      Logger.warn('Rate limited', {retryAfter});
      
      return Promise.reject({
        message: 'Too many requests. Please try again later.',
        statusCode: status,
        isRateLimited: true,
        retryAfter: retryAfter ? parseInt(retryAfter, 10) * 1000 : 60000,
      });
    }

    // Handle server errors (5xx)
    if (status >= 500) {
      Logger.error('Server error', {
        status,
        url: originalRequest?.url,
        data: response?.data,
      });

      return Promise.reject({
        message: ERROR_MESSAGES.SERVER_ERROR,
        statusCode: status,
        isServerError: true,
        details: response?.data,
      });
    }

    // Handle client errors (4xx)
    if (status >= 400 && status < 500) {
      Logger.error('Client error', {
        status,
        url: originalRequest?.url,
        data: response?.data,
      });

      return Promise.reject({
        message: response?.data?.message || 'Request failed',
        statusCode: status,
        isClientError: true,
        details: response?.data,
      });
    }

    // Unknown error
    Logger.error('Unknown API error', {
      error,
      url: originalRequest?.url,
    });

    return Promise.reject({
      message: ERROR_MESSAGES.UNKNOWN,
      originalError: error,
    });
  },
);

/**
 * Retry logic wrapper
 */
const withRetry = async (
  requestFn,
  retryAttempts = API_CONFIG.RETRY_ATTEMPTS,
  retryDelay = API_CONFIG.RETRY_DELAY,
) => {
  let lastError;
  
  for (let attempt = 0; attempt <= retryAttempts; attempt++) {
    try {
      const result = await requestFn();
      if (attempt > 0) {
        Logger.info('Request succeeded after retry', {attempt});
      }
      return result;
    } catch (error) {
      lastError = error;

      // Don't retry on certain errors
      if (
        error.isUnauthorized ||
        error.isClientError ||
        error.isNetworkError ||
        attempt === retryAttempts
      ) {
        break;
      }

      // Calculate delay with exponential backoff
      const delay = retryDelay * Math.pow(2, attempt);
      Logger.warn('Request failed, retrying', {
        attempt: attempt + 1,
        maxAttempts: retryAttempts,
        delay,
      });

      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw lastError;
};

/**
 * Main request handler with caching and retry logic
 */
const request = async (method, url, data, config = {}) => {
  const {
    cache = false,
    cacheTTL = API_CONFIG.CACHE_TTL,
    retryAttempts = API_CONFIG.RETRY_ATTEMPTS,
    skipAuth = false,
    deduplicate = true,
    ...axiosConfig
  } = config;

  // Check cache if enabled
  if (cache && method === 'get') {
    const cacheKey = generateCacheKey(method, url, data);
    const cachedData = getCachedData(cacheKey);
    if (cachedData) {
      return cachedData;
    }
  }

  // Create abort controller
  const abortController = new AbortController();

  // Prepare request config
  const requestConfig = {
    method,
    url,
    ...axiosConfig,
    skipAuth,
    deduplicate,
    signal: abortController.signal,
  };

  if (method === 'get' || method === 'delete') {
    requestConfig.params = data;
  } else {
    requestConfig.data = data;
  }

  // Create request function
  const makeRequest = () => apiClient.request(requestConfig);

  // Track pending request for deduplication
  const dedupKey = generateCacheKey(method, url, data);
  let requestPromise;

  if (deduplicate && pendingRequests.has(dedupKey)) {
    Logger.debug('Deduplicating request', {url, dedupKey});
    // Return a NEW promise that wraps the pending one
    // This ensures each caller gets their own promise
    const pendingPromise = pendingRequests.get(dedupKey);
    requestPromise = new Promise((resolve, reject) => {
      pendingPromise.then(resolve).catch(reject);
    });
  } else {
    // Execute request with retry logic
    requestPromise = withRetry(makeRequest, retryAttempts);
    
    if (deduplicate) {
      pendingRequests.set(dedupKey, requestPromise);
    }

    // Clean up after request completes
    requestPromise
      .finally(() => {
        pendingRequests.delete(dedupKey);
      });
  }

  try {
    const response = await requestPromise;

    // Cache successful response if enabled
    if (cache && method === 'get') {
      const cacheKey = generateCacheKey(method, url, data);
      setCachedData(cacheKey, response, cacheTTL);
    }

    Logger.debug('Request completed successfully', {
      method,
      url,
      cached: cache && method === 'get',
    });

    return response;
  } catch (error) {
    Logger.error('Request failed', error, {method, url});
    throw error;
  }
};

// Export convenience methods
export const apiGet = (url, params, config) => 
  request('get', url, params, config);

export const apiPost = (url, data, config) => 
  request('post', url, data, config);

export const apiPut = (url, data, config) => 
  request('put', url, data, config);

export const apiDelete = (url, params, config) => 
  request('delete', url, params, config);

export default apiClient;

