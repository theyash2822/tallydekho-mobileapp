import {useState, useEffect, useMemo} from 'react';
import apiService from '../services/api/apiService';
import {useAuth} from './useAuth';

/**
 * Custom hook to fetch and manage stock filters (warehouses, categories, groups)
 * @returns {Object} { stockFilters, warehouseOptions, categoryOptions, groupOptions, loading }
 */
export const useStockFilters = () => {
  const {selectedGuid} = useAuth();
  const [stockFilters, setStockFilters] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFilters = async () => {
      if (!selectedGuid) {
        setStockFilters(null);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const res = await apiService.fetchStockFilters(selectedGuid);
        const payload = res?.data || res;
        setStockFilters(payload);
      } catch (e) {
        setStockFilters(null);
      } finally {
        setLoading(false);
      }
    };

    fetchFilters();
  }, [selectedGuid]);

  // Extract warehouses from API response
  const warehouseOptions = useMemo(() => {
    const warehouses = stockFilters?.warehouses || stockFilters?.data?.warehouses || [];
    return warehouses.map(item => ({
      id: item.guid || item.id || item.name,
      name: item.name || item.displayName || '',
      guid: item.guid || item.id,
      // Keep original item for reference if needed
      original: item,
    }));
  }, [stockFilters]);

  // Extract warehouse names as strings (for screens that need string array)
  const warehouseNames = useMemo(() => {
    return warehouseOptions.map(item => item.name);
  }, [warehouseOptions]);

  // Extract categories from API response
  const categoryOptions = useMemo(() => {
    const categories = stockFilters?.categories || stockFilters?.data?.categories || [];
    return categories.map(item => ({
      id: item.guid || item.id || item.name,
      name: item.name || item.displayName || '',
      guid: item.guid || item.id,
      original: item,
    }));
  }, [stockFilters]);

  // Extract groups from API response
  const groupOptions = useMemo(() => {
    const groups = stockFilters?.groups || stockFilters?.itemGroups || stockFilters?.data?.groups || [];
    return groups.map(item => ({
      id: item.guid || item.id || item.name,
      name: item.name || item.displayName || '',
      guid: item.guid || item.id,
      original: item,
    }));
  }, [stockFilters]);

  return {
    stockFilters,
    warehouseOptions,
    warehouseNames,
    categoryOptions,
    groupOptions,
    loading,
  };
};

