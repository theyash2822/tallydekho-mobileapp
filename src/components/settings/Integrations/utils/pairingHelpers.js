/**
 * Pairing Helper Functions
 * Utility functions for pairing operations
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import {Logger} from '../../../../services/utils/logger';
import {formatDateTimeLocaleIN} from '../../../../utils/dateUtils';

export {formatDateTimeLocaleIN as formatDate};

/**
 * Initialize pairing state from storage
 * @param {Function} setIsPaired - Function to update paired state
 * @param {Function} setCode - Function to set code
 * @param {Function} setLastSync - Function to set last sync time
 * @param {Function} fetchPairingFn - Function to fetch pairing details (already bound with params)
 * @param {Function} fetchCompaniesData - Function to fetch companies
 * @param {number} companiesLength - Current companies array length
 */
export const initializePairState = async ({
  setIsPaired,
  setCode,
  setLastSync,
  fetchPairingFn,
  fetchCompaniesData,
  companiesLength,
}) => {
  try {
    const paired = await AsyncStorage.getItem('isPaired');

    if (paired === 'true') {
      setIsPaired(true);

      const stored = await AsyncStorage.getItem('pairedDevice');
      if (stored) {
        const parsed = JSON.parse(stored);
        // Safely handle code (might be string or undefined)
        if (parsed.code) {
          const codeArray =
            typeof parsed.code === 'string' ? parsed.code.split('') : parsed.code;
          setCode(codeArray);
        }
        if (parsed.lastSync) {
          setLastSync(parsed.lastSync);
        }
      }

      // Fetch latest sync time from server
      if (fetchPairingFn) {
        await fetchPairingFn();
      }

      if (companiesLength === 0) {
        fetchCompaniesData();
      }
    } else {
      setIsPaired(false);
    }
  } catch (err) {
    Logger.error('Init Pair State Error', err);
  }
};

