// API Service
// Centralized API service with all endpoint methods

import {
  apiGet,
  apiPost,
  apiPut,
  apiDelete,
  clearCache,
  clearCacheEntry,
} from './apiClient';
import {API_ENDPOINTS, REQUEST_CONFIG} from './config';
import {Logger} from '../utils/logger';

/**
 * API Service class with all endpoint methods
 */
class ApiService {
  // ==================== Authentication APIs ====================

  /**
   * Pair device with Tally
   * @param {Object} body - Pairing data
   * @returns {Promise<Object>}
   */
  async pairDevice(body) {
    try {
      Logger.info('Pairing device', {pairingCode: body?.pairingCode});
      const response = await apiPost(API_ENDPOINTS.PAIRING, body, {
        deduplicate: false, // Don't deduplicate pairing requests - each is unique
        retryAttempts: 1, // Only retry once for pairing
      });
      return response;
    } catch (error) {
      Logger.apiError('pairDevice', error, {pairingCode: body?.pairingCode});
      throw error;
    }
  }

  /**
   * Send OTP to mobile number
   * @param {Object} body - { mobileNumber }
   * @returns {Promise<Object>}
   */
  async sendOtp(body) {
    try {
      const masked = body?.mobileNumber
        ? body.mobileNumber.replace(/.(?=.{4})/g, '*')
        : undefined;
      Logger.info('Sending OTP', {mobileNumber: masked});
      return await apiPost(API_ENDPOINTS.SEND_OTP, body, {
        ...REQUEST_CONFIG.NO_AUTH,
        retryAttempts: 0,
        deduplicate: false,
      });
    } catch (error) {
      Logger.apiError('sendOtp', error, {mobileNumber: body?.mobileNumber});
      throw error;
    }
  }

  /**
   * Verify OTP and obtain auth token
   * @param {Object} body - { mobileNumber, otp }
   * @returns {Promise<Object>}
   */
  async verifyOtp(body) {
    try {
      Logger.info('Verifying OTP', {mobileNumber: body?.mobileNumber});
      return await apiPost(API_ENDPOINTS.VERIFY_OTP, body, {
        ...REQUEST_CONFIG.NO_AUTH,
        retryAttempts: 0,
        deduplicate: false,
      });
    } catch (error) {
      Logger.apiError('verifyOtp', error, {mobileNumber: body?.mobileNumber});
      throw error;
    }
  }

  /**
   * Verify authentication token
   * @param {string} token - Auth token to verify
   * @returns {Promise<Object>}
   */
  async verifyToken(token) {
    try {
      Logger.info('Verifying token');
      const response = await apiPost(
        API_ENDPOINTS.VERIFY,
        {token},
        {
          ...REQUEST_CONFIG.NO_RETRY,
          timeout: 10000,
          deduplicate: false, // Don't deduplicate verify requests
        },
      );
      return response;
    } catch (error) {
      Logger.apiError('verifyToken', error, {token: '***'});
      throw error;
    }
  }

  /**
   * Fetch pairing device details
   * @returns {Promise<Object>}
   */
  async fetchPairingDetails() {
    try {
      Logger.info('Fetching pairing details');
      const response = await apiGet(API_ENDPOINTS.PAIRING_DEVICE, null, {
        ...REQUEST_CONFIG.SHORT_CACHE,
        deduplicate: false, // Don't deduplicate - each call needs its own response
        timeout: 10000, // 10 second timeout
      });
      return response;
    } catch (error) {
      Logger.apiError('fetchPairingDetails', error);
      throw error;
    }
  }

  /**
   * Submit onboarding details
   * @param {Object} body - { name, language }
   * @returns {Promise<Object>}
   */
  async submitOnboarding(body) {
    try {
      Logger.info('Submitting onboarding details');
      return await apiPost(API_ENDPOINTS.ONBOARDING, body, {
        deduplicate: false,
      });
    } catch (error) {
      Logger.apiError('submitOnboarding', error);
      throw error;
    }
  }

  // ==================== Company APIs ====================

  /**
   * Fetch all companies
   * @param {Object} options - Request options
   * @returns {Promise<Object>}
   */
  async fetchCompanies(options = {}) {
    const {forceRefresh = false} = options;

    try {
      Logger.info('Fetching companies (real-time, no cache)', {forceRefresh});

      // Always clear cache for real-time data
      const cacheKey = 'get:/companies:null';
      clearCacheEntry(cacheKey);

      // Always fetch fresh - no cache, no deduplication
      const response = await apiGet(API_ENDPOINTS.COMPANIES, null, {
        cache: false, // No cache - always fetch fresh
        deduplicate: false,
        timeout: 15000,
      });

      Logger.info('Companies fetched successfully (real-time)', {
        count: response?.data?.companies?.length,
      });

      return response;
    } catch (error) {
      Logger.apiError('fetchCompanies', error);
      throw error;
    }
  }

  /**
   * Update pairing details (PUT /pairing)
   * @param {Object} body - Pairing update payload
   * @returns {Promise<Object>}
   */
  async updatePairing(body) {
    try {
      Logger.info('Updating pairing details', body);
      const response = await apiPut(API_ENDPOINTS.PAIRING, body, {
        deduplicate: false,
      });
      return response;
    } catch (error) {
      Logger.apiError('updatePairing', error, body);
      throw error;
    }
  }

  // ==================== Ledger APIs ====================

  /**
   * Fetch ledgers list with filters
   * @param {Object} body - Filter parameters
   * @returns {Promise<Object>}
   */
  async fetchLedgers(body) {
    try {
      const {companyGuid, page = 1, searchText = ''} = body;

      Logger.debug('Fetching ledgers', {
        companyGuid,
        page,
        searchText: searchText.substring(0, 20),
      });

      const response = await apiPost(API_ENDPOINTS.LEDGERS, body, {
        deduplicate: page === 1, // Only deduplicate first page
      });

      Logger.debug('Ledgers fetched', {
        count: response?.data?.ledgers?.length,
        page,
      });

      return response;
    } catch (error) {
      Logger.apiError('fetchLedgers', error, body);
      throw error;
    }
  }

  /**
   * Fetch specific ledger details
   * @param {Object} body - Ledger parameters
   * @returns {Promise<Object>}
   */
  async fetchLedgerDetails(body) {
    try {
      const {ledgerGuid} = body;
      Logger.debug('Fetching ledger details', {ledgerGuid});

      const response = await apiPost(API_ENDPOINTS.LEDGER, body, {
        cache: true,
        cacheTTL: 60000, // 1 minute cache
      });

      return response;
    } catch (error) {
      Logger.apiError('fetchLedgerDetails', error, body);
      throw error;
    }
  }

  // ==================== Stock APIs ====================

  /**
   * Fetch stock dashboard summary
   * @param {string} companyGuid - Company GUID
   * @returns {Promise<Object>}
   */
  async fetchStockSummary(companyGuid) {
    try {
      Logger.debug('Fetching stock summary', {companyGuid});

      const response = await apiPost(
        API_ENDPOINTS.STOCK_DASHBOARD,
        {companyGuid},
        REQUEST_CONFIG.SHORT_CACHE,
      );

      return response;
    } catch (error) {
      Logger.apiError('fetchStockSummary', error, {companyGuid});
      throw error;
    }
  }

  /**
   * Fetch stock filters (categories, warehouses, etc.)
   * @param {string} companyGuid - Company GUID
   * @returns {Promise<Object>}
   */
  async fetchStockFilters(companyGuid) {
    try {
      Logger.debug('Fetching stock filters', {companyGuid});

      const response = await apiPost(
        API_ENDPOINTS.STOCK_FILTERS,
        {companyGuid},
        REQUEST_CONFIG.MEDIUM_CACHE,
      );

      return response;
    } catch (error) {
      Logger.apiError('fetchStockFilters', error, {companyGuid});
      throw error;
    }
  }

  /**
   * Fetch stocks list with filters and pagination
   * @param {Object} body - Filter and pagination parameters
   * @param {AbortSignal} signal - Abort signal for cancellation
   * @returns {Promise<Object>}
   */
  async fetchStocks(body, signal = null) {
    try {
      const {companyGuid, page = 1, searchText = ''} = body;

      Logger.debug('Fetching stocks', {
        companyGuid,
        page,
        searchText: searchText.substring(0, 20),
      });

      const config = {
        deduplicate: page === 1, // Only deduplicate first page
      };

      if (signal) {
        config.signal = signal;
      }

      const response = await apiPost(API_ENDPOINTS.STOCKS, body, config);

      Logger.debug('Stocks fetched', {
        count: response?.data?.stocks?.length,
        total: response?.data?.totalStocks,
        page,
      });

      return response;
    } catch (error) {
      // Don't log cancelled requests as errors
      if (error.name === 'AbortError' || error.name === 'CanceledError') {
        Logger.debug('Stock fetch cancelled', {page: body.page});
        throw error;
      }

      Logger.apiError('fetchStocks', error, body);
      throw error;
    }
  }

  /**
   * Fetch single stock details
   * @param {Object} body - {companyGuid, stockGuid}
   * @returns {Promise<Object>}
   */
  async fetchStockDetails(body) {
    try {
      const {companyGuid, stockGuid} = body || {};
      Logger.debug('Fetching stock details', {companyGuid, stockGuid});

      const response = await apiPost(API_ENDPOINTS.STOCK, body, {
        cache: true,
        cacheTTL: 60000,
      });

      return response;
    } catch (error) {
      Logger.apiError('fetchStockDetails', error, body);
      throw error;
    }
  }

  // ==================== Utility Methods ====================

  /**
   * Clear all API cache
   */
  clearAllCache() {
    Logger.info('Clearing all API cache');
    clearCache();
  }

  /**
   * Clear specific cache entry
   * @param {string} method - HTTP method
   * @param {string} endpoint - API endpoint
   * @param {Object} params - Request parameters
   */
  clearSpecificCache(method, endpoint, params) {
    const cacheKey = `${method}:${endpoint}:${
      params ? JSON.stringify(params) : 'null'
    }`;
    Logger.debug('Clearing specific cache', {cacheKey});
    clearCacheEntry(cacheKey);
  }

  /**
   * Prefetch data for better UX
   * @param {string} companyGuid - Company GUID
   */
  async prefetchCommonData(companyGuid) {
    Logger.info('Prefetching common data', {companyGuid});

    try {
      // Fetch in parallel
      await Promise.allSettled([
        this.fetchStockFilters(companyGuid),
        this.fetchStockSummary(companyGuid),
      ]);

      Logger.info('Prefetch completed');
    } catch (error) {
      // Silently fail prefetch
      Logger.warn('Prefetch failed', error);
    }
  }

  /**
   * Batch multiple API calls
   * @param {Array<Function>} apiCalls - Array of API call functions
   * @returns {Promise<Array>}
   */
  async batchRequests(apiCalls) {
    Logger.info('Executing batch requests', {count: apiCalls.length});

    try {
      const results = await Promise.allSettled(apiCalls.map(call => call()));

      const successful = results.filter(r => r.status === 'fulfilled').length;
      Logger.info('Batch requests completed', {
        total: results.length,
        successful,
        failed: results.length - successful,
      });

      return results;
    } catch (error) {
      Logger.error('Batch requests failed', error);
      throw error;
    }
  }

  /**
   * Health check - verify API is reachable
   * @returns {Promise<boolean>}
   */
  async healthCheck() {
    try {
      Logger.debug('Performing health check');
      await this.fetchCompanies();
      Logger.info('Health check passed');
      return true;
    } catch (error) {
      Logger.warn('Health check failed', error);
      return false;
    }
  }
}

// Export singleton instance
const apiService = new ApiService();
export default apiService;

// Export class for testing
export {ApiService};
