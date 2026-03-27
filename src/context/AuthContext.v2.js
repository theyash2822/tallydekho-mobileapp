// Updated AuthContext using optimized API services
import {createContext, useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Alert} from 'react-native';
import apiService from '../services/api/apiService';
import {Logger} from '../services/utils/logger';

const defaultValues = {
  companies: [],
  loading: false,
  error: null,
  selectedGuid: null,
  selectedCompany: null,
  saveGuid: () => {},
  setSelectedCompany: () => {},
  setSelectedFY: () => {},
  fetchCompaniesData: () => {},
  refreshCompanies: () => {},
};

const AuthContext = createContext(defaultValues);

const AuthProvider = ({children}) => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedGuid, setSelectedGuid] = useState(null);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [selectedFY, setSelectedFY] = useState(null);

  // Initialize on mount
  useEffect(() => {
    const initialize = async () => {
      try {
        // Load saved GUID
        await loadSavedGuid();

        // Check if token exists
        const authToken = await AsyncStorage.getItem('authToken');
        
        if (authToken) {
          Logger.info('Auth token found, loading cached companies');
          
          // Load cached companies first for instant UI
          await loadCachedCompanies();
          
          // Fetch fresh data in background
          const hasFetched = await AsyncStorage.getItem('hasFetchedCompanies');
          if (!hasFetched) {
            await fetchCompaniesData();
          }
        }
      } catch (err) {
        Logger.error('Initialization failed', err);
      }
    };

    initialize();
  }, []);

  // Update selected company when companies or GUID changes
  useEffect(() => {
    if (companies.length > 0 && selectedGuid) {
      const found = companies.find(c => c.id === selectedGuid);
      if (found) {
        setSelectedCompany(found);
        Logger.debug('Selected company updated', {
          name: found.name,
          guid: selectedGuid,
        });
      }
    }
  }, [companies, selectedGuid]);

  /**
   * Load saved GUID from storage
   */
  const loadSavedGuid = async () => {
    try {
      const storedGuid = await AsyncStorage.getItem('SELECTED_GUID');
      if (storedGuid) {
        Logger.debug('Loaded saved GUID', {guid: storedGuid});
        setSelectedGuid(storedGuid);
      }
    } catch (err) {
      Logger.error('Failed to load saved GUID', err);
    }
  };

  /**
   * Load companies from cache
   */
  const loadCachedCompanies = async () => {
    try {
      Logger.debug('Loading companies from cache');
      const cachedCompanies = await AsyncStorage.getItem('cachedCompanies');
      
      if (cachedCompanies) {
        const parsed = JSON.parse(cachedCompanies);
        Logger.info('Cached companies loaded', {count: parsed.length});
        setCompanies(parsed);
        return true;
      } else {
        Logger.debug('No cached companies found');
        return false;
      }
    } catch (err) {
      Logger.error('Failed to load cached companies', err);
      return false;
    }
  };

  /**
   * Save GUID to storage and update selected company
   */
  const saveGuid = async guid => {
    try {
      setSelectedGuid(guid);
      await AsyncStorage.setItem('SELECTED_GUID', guid);
      Logger.info('GUID saved', {guid});

      const company = companies.find(c => c.id === guid);
      if (company) {
        setSelectedCompany(company);
        
        // Prefetch common data for better UX
        apiService.prefetchCommonData(guid).catch(err => {
          Logger.warn('Prefetch failed', err);
        });
      }
    } catch (err) {
      Logger.error('Failed to save GUID', err);
    }
  };

  /**
   * Fetch companies from API
   */
  const fetchCompaniesData = async (options = {}) => {
    const {force = false, silent = false} = options;

    try {
      // Prevent duplicate fetching unless forced
      const hasFetched = await AsyncStorage.getItem('hasFetchedCompanies');
      if (!force && hasFetched === 'true' && companies.length > 0) {
        Logger.debug('Companies already fetched, using cache');
        return;
      }

      if (!silent) {
        setLoading(true);
      }
      setError(null);

      Logger.info('Fetching companies from API', {force});
      
      // Use the optimized API service
      const data = await apiService.fetchCompanies({forceRefresh: force});

      if (data?.status && data?.data?.companies) {
        const formattedCompanies = data.data.companies.map(company => ({
          id: company.guid,
          name: company.name,
          years: company.years,
        }));

        setCompanies(formattedCompanies);

        // Cache the companies
        await AsyncStorage.setItem(
          'cachedCompanies',
          JSON.stringify(formattedCompanies),
        );
        await AsyncStorage.setItem('hasFetchedCompanies', 'true');

        Logger.info('Companies fetched and cached successfully', {
          count: formattedCompanies.length,
        });
      } else {
        const errorMsg = 'No companies found';
        setError(errorMsg);
        Logger.warn(errorMsg);
      }
    } catch (err) {
      const errorMessage = err.message || 'Failed to load companies';
      Logger.error('Failed to fetch companies', err);
      
      if (!silent) {
        Alert.alert(
          'Error',
          err.isNetworkError
            ? 'Network connection failed. Please check your internet.'
            : errorMessage,
        );
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Refresh companies (force fetch)
   */
  const refreshCompanies = async () => {
    Logger.info('Refreshing companies');
    await fetchCompaniesData({force: true});
  };

  /**
   * Clear cache and re-fetch
   */
  const clearAndRefetch = async () => {
    try {
      Logger.info('Clearing cache and refetching');
      await AsyncStorage.removeItem('cachedCompanies');
      await AsyncStorage.removeItem('hasFetchedCompanies');
      apiService.clearAllCache();
      await fetchCompaniesData({force: true});
    } catch (err) {
      Logger.error('Failed to clear and refetch', err);
    }
  };

  const values = {
    companies,
    loading,
    error,
    selectedGuid,
    selectedCompany,
    selectedFY,
    saveGuid,
    setSelectedCompany,
    setSelectedFY,
    fetchCompaniesData,
    refreshCompanies,
    clearAndRefetch,
  };

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
};

export {AuthProvider, AuthContext};

