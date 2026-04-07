import {createContext, useCallback, useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiService from '../services/api/apiService';
import {Logger} from '../services/utils/logger';
import {Alert} from 'react-native';
import wsService from '../services/websocket/websocketService';

const defaultValues = {
  companies: [],
  setCompanies: () => {},
  loading: false,
  error: null,
  selectedGuid: null,
  selectedCompany: null,
  saveGuid: () => {},
  setSelectedCompany: () => {},
  setSelectedFY: () => {},
  fetchCompaniesData: () => {},
};

const AuthContext = createContext(defaultValues);

const AuthProvider = ({children}) => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedGuid, setSelectedGuid] = useState(null);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [selectedFY, setSelectedFY] = useState(null);
  // Ensure selected FY stays in sync with selected company years
  useEffect(() => {
    if (!selectedCompany?.years?.length) {
      if (selectedFY !== null) {
        setSelectedFY(null);
      }
      return;
    }

    const hasSelectedFY =
      selectedFY &&
      selectedCompany.years.some(year => year.uniqueId === selectedFY.uniqueId);

    if (!hasSelectedFY) {
      const defaultFY =
        selectedCompany.years[selectedCompany.years.length - 1] ||
        selectedCompany.years[0];
      Logger.info('AuthContext: Defaulting FY for selected company', {
        guid: selectedCompany.id,
        fy: defaultFY?.name,
      });
      setSelectedFY(defaultFY || null);
    }
  }, [selectedCompany, selectedFY]);

  useEffect(() => {
    const initialize = async () => {
      await loadSavedGuid();
      const authToken = await AsyncStorage.getItem('authToken');

      if (authToken) {
        // Always fetch fresh data - WebSocket synced event will handle real-time updates
        Logger.info(
          'AuthContext: Fetching companies on initialization (real-time, no cache)',
        );
        // Fetch in background, don't block initialization
        fetchCompaniesData().catch(err => {
          Logger.error('AuthContext: Failed to fetch companies on init', err);
        });
      }
    };
    initialize();
  }, []);

  useEffect(() => {
    if (companies.length === 0) {
      setSelectedCompany(null);
      return;
    }

    if (selectedGuid) {
      const found = companies.find(c => c.id === selectedGuid);
      if (found) {
        setSelectedCompany(found);
        return;
      }
    }

    const fallbackCompany = companies[0];
    if (fallbackCompany) {
      Logger.info(
        'AuthContext: No selected company found, defaulting to first company',
        {guid: fallbackCompany.id},
      );
      setSelectedCompany(fallbackCompany);
      setSelectedGuid(fallbackCompany.id);
      AsyncStorage.setItem('SELECTED_GUID', fallbackCompany.id).catch(err => {
        Logger.error('Failed to persist default company GUID', err);
      });
    }
  }, [companies, selectedGuid]);

  const loadSavedGuid = async () => {
    try {
      const storedGuid = await AsyncStorage.getItem('SELECTED_GUID');
      if (storedGuid) {
        Logger.debug('Saved GUID loaded', {guid: storedGuid});
        setSelectedGuid(storedGuid);
      }
    } catch (err) {
      Logger.error('Failed to load saved GUID', err);
    }
  };

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

  const fetchCompaniesData = useCallback(async options => {
    const normalizedOptions =
      typeof options === 'boolean'
        ? {force: options}
        : options && typeof options === 'object'
        ? options
        : {};
    const {force = false} = normalizedOptions;

    try {
      setLoading(true);
      setError(null);

      // Always fetch from API - no cache, no skipping
      // If unpaired, API will return demo company
      Logger.info('Fetching companies from API (real-time, no cache)', {force});
      const data = await apiService.fetchCompanies({forceRefresh: true}); // Always force refresh

      if (data?.status && data?.data?.companies) {
        const formattedCompanies = data.data.companies.map(company => ({
          id: company.guid,
          name: company.name,
          years: company.years,
        }));

        setCompanies(formattedCompanies);

        Logger.info('Companies fetched successfully (real-time)', {
          count: formattedCompanies.length,
          isPaired: await AsyncStorage.getItem('isPaired'),
        });
      } else {
        setError('No companies found');
        setCompanies([]);
      }
    } catch (err) {
      Logger.error('Failed to fetch companies', err);
      // Better error handling with new API service
      const errorMessage = err.isNetworkError
        ? 'Network connection failed. Please check your internet.'
        : err.message || 'Failed to load companies';
      Alert.alert('Error', errorMessage);
      setError(err.message);
      setCompanies([]);
    } finally {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // WebSocket event listeners
  useEffect(() => {
    // Handle 'synced' event - refresh companies when desktop syncs (add/remove companies)
    const handleSynced = async payload => {
      Logger.info(
        '[AuthContext] Synced event received - desktop synced, refreshing companies',
        payload,
      );
      // Always fetch fresh data when desktop syncs (companies added/removed)
      await fetchCompaniesData({force: true});
    };

    // Handle 'unpaired' event - fetch companies to get demo company
    // Navigation to pairing screen is handled in WebSocket service
    const handleUnpaired = async payload => {
      Logger.warn(
        '[AuthContext] Unpaired event received, clearing selection and fetching demo company',
        payload,
      );
      setCompanies([]);
      setSelectedCompany(null);
      setSelectedGuid(null);
      setSelectedFY(null);
      await AsyncStorage.removeItem('SELECTED_GUID');
      await fetchCompaniesData({force: true});
    };

    // Handle 'logout' event - clear everything when user logs in on another device
    const handleLogout = async payload => {
      Logger.warn('[AuthContext] Logout event received', payload);
      setCompanies([]);
      setSelectedCompany(null);
      setSelectedGuid(null);
      setSelectedFY(null);
      await AsyncStorage.removeItem('SELECTED_GUID');
      // Navigation will be handled by the WebSocket service alert
    };

    // Handle 'paired' event - mobile just paired, refresh companies with real data
    const handlePaired = async payload => {
      Logger.info('[AuthContext] Paired event received - refreshing companies', payload);
      await AsyncStorage.setItem('isPaired', 'true');
      await fetchCompaniesData({force: true});
    };

    // Register event listeners
    wsService.on('synced', handleSynced);
    wsService.on('unpaired', handleUnpaired);
    wsService.on('logout', handleLogout);
    wsService.on('paired', handlePaired);

    // Cleanup listeners on unmount
    return () => {
      wsService.off('synced', handleSynced);
      wsService.off('unpaired', handleUnpaired);
      wsService.off('logout', handleLogout);
      wsService.off('paired', handlePaired);
    };
  }, [fetchCompaniesData]);

  const values = {
    companies,
    setCompanies,
    loading,
    error,
    selectedGuid,
    selectedCompany,
    saveGuid,
    setSelectedCompany,
    selectedFY,
    setSelectedFY,
    fetchCompaniesData,
  };

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
};

export {AuthProvider, AuthContext};
