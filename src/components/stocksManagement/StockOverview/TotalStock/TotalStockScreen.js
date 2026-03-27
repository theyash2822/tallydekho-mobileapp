
import React, { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Pressable,
  ActivityIndicator,
  Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { createShimmerPlaceholder } from 'react-native-shimmer-placeholder';
import { useNavigation } from '@react-navigation/native';
import { SwipeRow } from 'react-native-swipe-list-view';
import Feather from 'react-native-vector-icons/Feather';
import StockMovementModal from './StockMovementModal';
import EditStockModal from './EditStockModal';
import AddNewItemModal from './AddNewItemModal';
import BulkTransferModal from './BulkTransferModal';
import Colors from '../../../../utils/Colors';
import { Icons } from '../../../../utils/Icons';
import { Header } from '../../../common';
import { FilterDrawer } from '../../../filterdrawer';
import apiService from '../../../../services/api/apiService';
import { Logger } from '../../../../services/utils/logger';
import { useAuth } from '../../../../hooks/useAuth';

const TotalStockScreen = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [openRowId, setOpenRowId] = useState(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [totalStocks, setTotalStocks] = useState(0);
  const [page, setPage] = useState(1);
  const { selectedGuid } = useAuth();

  const swipeRowRefs = useRef({});
  const searchTimeoutRef = useRef(null);
  const fetchAbortControllerRef = useRef(null);

  // Edit Stock Modal state
  const [showEditStockModal, setShowEditStockModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Add New Item Modal state
  const [showAddNewItemModal, setShowAddNewItemModal] = useState(false);

  // Bulk Transfer Modal state
  const [showBulkTransferModal, setShowBulkTransferModal] = useState(false);

  // Menu dropdown state
  const [showMenuDropdown, setShowMenuDropdown] = useState(false);

  const [stockItems, setStockItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [originalStockItems, setOriginalStockItems] = useState([]); // Store original data before search
  const [originalTotalStocks, setOriginalTotalStocks] = useState(0); // Store original total count

  const [movementModalVisible, setMovementModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const Shimmer = useMemo(() => createShimmerPlaceholder(LinearGradient), []);

  // Stock filters (warehouses, categories, item groups)
  const [stockFilters, setStockFilters] = useState(null);
  // Actual filter state (applied filters)
  const [selectedWarehouse, setSelectedWarehouse] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);
  // Temporary filter state (for drawer - not applied until Apply is clicked)
  const [tempWarehouse, setTempWarehouse] = useState(null);
  const [tempCategory, setTempCategory] = useState(null);
  const [tempGroup, setTempGroup] = useState(null);
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);

  const handleEdit = useCallback(
    itemId => {
      if (openRowId && swipeRowRefs.current[openRowId]) {
        swipeRowRefs.current[openRowId].closeRow();
        setOpenRowId(null);
      }

      const product = stockItems.find(item => item.guid === itemId);
      if (product) {
        setSelectedProduct(product);
        setShowEditStockModal(true);
      }
    },
    [openRowId, stockItems],
  );

  const handleDelete = useCallback(itemId => {
  }, []);

  const handleMovement = useCallback(
    item => {
      if (openRowId && swipeRowRefs.current[openRowId]) {
        swipeRowRefs.current[openRowId].closeRow();
        setOpenRowId(null);
      }
      setSelectedItem(item);
      setMovementModalVisible(true);
    },
    [openRowId],
  );

  const handleCloseMovementModal = () => {
    setMovementModalVisible(false);
    // Delay clearing item to allow modal closing animation to complete
    setTimeout(() => {
      setSelectedItem(null);
    }, 300); // Match animation duration
    if (openRowId && swipeRowRefs.current[openRowId]) {
      swipeRowRefs.current[openRowId].closeRow();
      setOpenRowId(null);
    }
  };

  const handleSaveAdjustment = adjustmentData => {
  };

  const handleCloseEditStockModal = () => {
    setShowEditStockModal(false);
    // Delay clearing product to allow modal closing animation to complete
    setTimeout(() => {
      setSelectedProduct(null);
    }, 300); // Match animation duration
  };

  const handleAddNewItem = () => {
    setShowAddNewItemModal(false);
  };

  const handleStockTransfer = () => {
    setMovementModalVisible(false);
    // Delay clearing item to allow modal closing animation to complete
    setTimeout(() => {
      setSelectedItem(null);
    }, 300); // Match animation duration
  };

  const handleBulkTransfer = () => {
    setShowBulkTransferModal(false);
  };

  const handleRowOpen = useCallback(
    rowId => {
      if (openRowId && openRowId !== rowId && swipeRowRefs.current[openRowId]) {
        swipeRowRefs.current[openRowId].closeRow();
      }
      setOpenRowId(rowId);
    },
    [openRowId],
  );

  const handleRowClose = useCallback(
    rowId => {
      if (openRowId === rowId) {
        setOpenRowId(null);
      }
    },
    [openRowId],
  );

  const fetchStocks = useCallback(
    async (pageNumber = 1, overrides = {}) => {
      // Cancel previous request if still pending
      if (fetchAbortControllerRef.current) {
        fetchAbortControllerRef.current.abort();
      }
      fetchAbortControllerRef.current = new AbortController();

      if (loadingMore || loading) return;

      try {
        pageNumber === 1 ? setLoading(true) : setLoadingMore(true);

        const resolveGuid = v => (typeof v === 'string' ? v : v?.guid || v?.id || '');
        const warehouse = overrides.warehouse ?? selectedWarehouse;
        const category = overrides.category ?? selectedCategory;
        const group = overrides.group ?? selectedGroup;
        const search = overrides.searchText ?? searchQuery;

        const body = {
          companyGuid: selectedGuid,
          page: pageNumber,
          searchText: search,
          warehouseGuid: resolveGuid(warehouse),
          categoryGuid: resolveGuid(category),
          groupGuid: resolveGuid(group),
        };

        Logger.debug('Fetching stocks', {
          companyGuid: body.companyGuid,
          page: body.page,
          searchText: body.searchText?.substring(0, 20),
          warehouse: body.warehouseGuid,
          category: body.categoryGuid,
        });

        const response = await apiService.fetchStocks(body);

        Logger.debug('Stocks received', {
          count: response?.data?.stocks?.length,
          total: response?.data?.totalStocks,
        });

        if (response?.status && Array.isArray(response?.data?.stocks)) {
          const newStocks = response.data.stocks;
          const total = response.data.totalStocks ?? 0;

          // Store original data when no search is active (first load or cleared search)
          const isSearchActive = (overrides.searchText ?? searchQuery).trim() !== '';
          if (pageNumber === 1 && !isSearchActive) {
            setOriginalStockItems(newStocks);
            setOriginalTotalStocks(total);
          }

          setTotalStocks(total);

          // ✅ If no stocks returned
          if (newStocks.length === 0 && pageNumber === 1) {
            setStockItems([]); // Clear list
            setPage(1);
            return; // stop further processing
          }

          setStockItems(prev =>
            pageNumber === 1 ? newStocks : [...prev, ...newStocks],
          );

          if (pageNumber === 1) {
            setPage(1);
          }
        } else {
          // ✅ When API doesn't return the expected structure
          setStockItems([]);
        }
      } catch (error) {
        if (error.name !== 'AbortError' && error.name !== 'CanceledError') {
          Logger.error('Fetch stocks error', error);
          // Better error handling with new API service
          if (error.isNetworkError) {
            Logger.warn('Network error fetching stocks');
          } else if (error.isTimeout) {
            Logger.warn('Stock fetch timed out');
          }
        } else {
          Logger.debug('Stock fetch cancelled');
        }
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [loading, loadingMore, searchQuery, selectedGuid, selectedWarehouse, selectedCategory, selectedGroup],
  );

  // Debounced search handler
  const handleSearchChange = useCallback(
    text => {
      setSearchQuery(text);

      // Clear previous timeout
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }

      // If search text is cleared, restore original data without API call
      if (text.trim() === '') {
        setPage(1);
        setStockItems(originalStockItems);
        setTotalStocks(originalTotalStocks);
        return;
      }

      // Debounce API call by 1000ms
      searchTimeoutRef.current = setTimeout(() => {
        setPage(1);
        fetchStocks(1, { searchText: text });
      }, 1000);
    },
    [fetchStocks, originalStockItems, originalTotalStocks],
  );

  // Handle infinite scroll with optimized conditions
  const handleEndReached = useCallback(() => {
    // Prevent multiple simultaneous requests
    if (loadingMore || loading) return;

    // Check if we've loaded all available items
    if (stockItems.length >= totalStocks) return;

    // Don't load more if we have very few items (likely an error state)
    if (stockItems.length === 0) return;

    setPage(prevPage => {
      const nextPage = prevPage + 1;
      fetchStocks(nextPage);
      return nextPage;
    });
  }, [loadingMore, loading, stockItems.length, totalStocks, fetchStocks]);

  // Initial fetch and cleanup
  useEffect(() => {
    fetchStocks(1);

    return () => {
      // Cancel any pending requests on unmount
      if (fetchAbortControllerRef.current) {
        fetchAbortControllerRef.current.abort();
      }
      // Clear search timeout on unmount
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  // Fetch stock filters once company is available
  useEffect(() => {
    const fetchFilters = async () => {
      if (!selectedGuid) return;
      try {
        const res = await apiService.fetchStockFilters(selectedGuid);
        // Expecting shape like { data: { warehouses: [], categories: [], groups: [] }, status: true }
        const payload = res?.data || res;
        setStockFilters(payload);
      } catch (e) {
      }
    };
    fetchFilters();
  }, [selectedGuid]);


  // Initialize temporary states when drawer opens
  const handleFilterPress = useCallback(() => {
    setTempWarehouse(selectedWarehouse);
    setTempCategory(selectedCategory);
    setTempGroup(selectedGroup);
    setShowFilterDrawer(true);
  }, [selectedWarehouse, selectedCategory, selectedGroup]);

  // Apply filters when Apply button is clicked
  const handleApplyFilters = useCallback(() => {
    setSelectedWarehouse(tempWarehouse);
    setSelectedCategory(tempCategory);
    setSelectedGroup(tempGroup);
    setPage(1);
    // Fetch stocks with new filters
    fetchStocks(1, {
      warehouse: tempWarehouse,
      category: tempCategory,
      group: tempGroup
    });
  }, [tempWarehouse, tempCategory, tempGroup, fetchStocks]);

  // Cleanup swipe rows on unmount
  useEffect(() => {
    return () => {
      if (openRowId && swipeRowRefs.current[openRowId]) {
        swipeRowRefs.current[openRowId].closeRow();
      }
    };
  }, [openRowId]);

  // Memoized render function to prevent unnecessary re-renders
  const renderStockItem = useCallback(
    ({ item }) => (
      <SwipeRow
        leftOpenValue={110}
        rightOpenValue={-130}
        ref={ref => {
          if (ref) {
            swipeRowRefs.current[item.guid] = ref;
          }
        }}
        onRowOpen={() => handleRowOpen(item.guid)}
        onRowClose={() => handleRowClose(item.guid)}>
        <View style={styles.hiddenRow}>
          <View style={styles.leftAction}>
            <TouchableOpacity
              onPress={() => handleEdit(item.guid)}
              activeOpacity={0.7}
              style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={styles.actionButton}>
                <Feather name="edit-2" size={16} color="#444" />
              </View>
              <Text style={styles.actiontext}>Stock Edit</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.rightAction}>
            <TouchableOpacity
              onPress={() => handleMovement(item)}
              activeOpacity={0.7}
              style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={styles.actionButton}>
                <Feather name="move" size={16} color="#444" />
              </View>
              <Text style={styles.actiontext}>Stock Transfer</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Pressable
          style={styles.stockCard}
          onPress={() => navigation.navigate('itemDetail', { item })}
          activeOpacity={0.7}>
          <View style={styles.cardContent}>
            <View style={styles.leftSection}>
              {/* <View style={styles.iconContainer}>
                <Feather name="box" size={20} color="#13A76D" />
              </View> */}
              <View style={styles.productInfo}>
                <Text style={styles.productName}>{item.name}</Text>
              </View>
            </View>

            <View style={styles.rightSection}>
              <Text style={styles.valueText}>
                ₹{Number(item.amount).toLocaleString('en-IN')}
              </Text>
              <Text style={styles.quantityText}>
                {item.currentQuantity} {item.unit}
              </Text>
            </View>
          </View>
        </Pressable>
      </SwipeRow>
    ),
    [handleEdit, handleMovement, navigation],
  );

  const renderShimmerRow = key => (
    <View key={key} style={styles.stockCard}>
      <View style={styles.cardContent}>
        <View style={styles.leftSection}>
          {/* <Shimmer
            style={{width: 36, height: 36, borderRadius: 18, marginRight: 10}}
            shimmerColors={["#E9EDF3", "#F4F7FB", "#E9EDF3"]}
          /> */}
          <View style={styles.productInfo}>
            <Shimmer
              style={{ width: 160, height: 12, borderRadius: 6 }}
              shimmerColors={["#E9EDF3", "#F4F7FB", "#E9EDF3"]}
            />
          </View>
        </View>
        <View style={styles.rightSection}>
          <Shimmer
            style={{ width: 80, height: 12, borderRadius: 6, marginBottom: 6 }}
            shimmerColors={["#E9EDF3", "#F4F7FB", "#E9EDF3"]}
          />
          <Shimmer
            style={{ width: 60, height: 10, borderRadius: 6 }}
            shimmerColors={["#E9EDF3", "#F4F7FB", "#E9EDF3"]}
          />
        </View>
      </View>
    </View>
  );

  const renderFooter = useCallback(() => {
    if (!loadingMore) return null;
    return (
      <View style={{ paddingVertical: 8 }}>
        {Array.from({ length: 3 }).map((_, i) => renderShimmerRow(`footer-${i}`))}
      </View>
    );
  }, [loadingMore]);

  return (
    <>
      <View style={styles.headerWrapper}>
        <Header
          title={'Total Stock'}
          leftIcon={'chevron-left'}
          rightIcon={'menu'}
          rightIconSize={18}
          onRightPress={() => setShowMenuDropdown(!showMenuDropdown)}
          rightIconType="Feather"
          showBackgroundContainer="true"
        />
        {showMenuDropdown && (
          <>
            <Pressable
              style={styles.dropdownBackdrop}
              onPress={() => setShowMenuDropdown(false)}
            />
            <View style={styles.menuDropdown}>
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => {
                  setShowMenuDropdown(false);
                  setShowAddNewItemModal(true);
                }}
                activeOpacity={0.7}>
                <Feather name="plus" size={18} color="#6f7c97" />
                <Text style={styles.menuItemText}>Add New Item</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.menuItem, styles.lastMenuItem]}
                onPress={() => {
                  setShowMenuDropdown(false);
                  setShowBulkTransferModal(true); 
                }}
                activeOpacity={0.7}>
                <Icons.ArrowUpDown width={18} height={18} fill="#6f7c97" />
                <Text style={styles.menuItemText}>Bulk Transfer</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
      <View style={styles.container}>
        <View style={styles.section2}>
          {/* Search and Filter Row */}
          <View style={styles.searchRow}>
            <View style={styles.searchSection}>
              <View style={styles.searchContainer}>
                <Feather name="search" size={20} color="#666" />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search"
                  placeholderTextColor="#8F939E"
                  value={searchQuery}
                  onChangeText={handleSearchChange}
                  editable={!loading}
                />
                {searchQuery.length > 0 && (
                  <TouchableOpacity
                    style={styles.clearButton}
                    onPress={() => {
                      setSearchQuery('');
                      // Clear any pending search timeout
                      if (searchTimeoutRef.current) {
                        clearTimeout(searchTimeoutRef.current);
                      }
                      // Restore original data without API call
                      setPage(1);
                      setStockItems(originalStockItems);
                      setTotalStocks(originalTotalStocks);
                    }}>
                    <Feather name="x" size={16} color="#999" />
                  </TouchableOpacity>
                )}
              </View>
            </View>

            <TouchableOpacity
              style={styles.filterIconButton}
              onPress={handleFilterPress}
              activeOpacity={0.7}
              disabled={!stockFilters}>
              <Feather name="filter" size={20} color={stockFilters ? "#666" : "#ccc"} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          {stockItems.length === 0 && !loading ? (
            <View style={{ paddingTop: 40, alignItems: 'center' }}>
              <Text style={{ fontSize: 16, color: '#666' }}>No Stocks Found</Text>
            </View>
          ) : loading ? (
            <View style={{ paddingHorizontal: 8, paddingTop: 12 }}>
              {Array.from({ length: 10 }).map((_, i) =>
                renderShimmerRow(`init-${i}`),
              )}
            </View>
          ) : (
            <FlatList
              showsVerticalScrollIndicator={false}
              data={stockItems}
              renderItem={renderStockItem}
              keyExtractor={item => item.guid.toString()}
              contentContainerStyle={styles.listContainer}
              ListFooterComponent={renderFooter}
              onEndReachedThreshold={0.3}
              onEndReached={handleEndReached}
              removeClippedSubviews={false}
              maxToRenderPerBatch={20}
              updateCellsBatchingPeriod={50}
              initialNumToRender={20}
            />
          )}
        </View>
      </View>

      <StockMovementModal
        visible={movementModalVisible}
        onClose={handleCloseMovementModal}
        onTransfer={handleStockTransfer}
        item={selectedItem}
      />
      <EditStockModal
        visible={showEditStockModal}
        onClose={handleCloseEditStockModal}
        product={selectedProduct}
        onSave={handleSaveAdjustment}
      />
      <AddNewItemModal
        visible={showAddNewItemModal}
        onClose={() => setShowAddNewItemModal(false)}
        onSave={handleAddNewItem}
      />
      <BulkTransferModal
        visible={showBulkTransferModal}
        onClose={() => setShowBulkTransferModal(false)}
        onTransfer={handleBulkTransfer}
      />

      {/* Filter Drawer */}
      <FilterDrawer
        visible={showFilterDrawer}
        onClose={() => setShowFilterDrawer(false)}
        slideDirection="left"
        customFilters={useMemo(() => {
          if (!stockFilters) return null;

          const warehouses = stockFilters?.warehouses || stockFilters?.data?.warehouses || [];
          const categories = stockFilters?.categories || stockFilters?.data?.categories || [];
          const groups = stockFilters?.groups || stockFilters?.itemGroups || stockFilters?.data?.groups || [];

          const handleWarehouseSelect = (value) => {
            const item = warehouses.find(w => (w.guid || w.id || w.name) === value);
            if (item) {
              setTempWarehouse(item);
            }
          };

          const handleWarehouseDeselect = () => {
            setTempWarehouse(null);
          };

          const handleCategorySelect = (value) => {
            const item = categories.find(c => (c.guid || c.id || c.name) === value);
            if (item) {
              setTempCategory(item);
            }
          };

          const handleCategoryDeselect = () => {
            setTempCategory(null);
          };

          const handleGroupSelect = (value) => {
            const item = groups.find(g => (g.guid || g.id || g.name) === value);
            if (item) {
              setTempGroup(item);
            }
          };

          const handleGroupDeselect = () => {
            setTempGroup(null);
          };

          return {
            warehouse: {
              label: 'Warehouse',
              options: warehouses.map(item => ({
                key: item.guid || item.id || item.name,
                label: item.name,
              })),
              selected: tempWarehouse ? [tempWarehouse.guid || tempWarehouse.id || tempWarehouse.name] : [],
              onSelect: handleWarehouseSelect,
              onDeselect: handleWarehouseDeselect,
              onDeselectAll: handleWarehouseDeselect,
            },
            category: {
              label: 'Category',
              options: categories.map(item => ({
                key: item.guid || item.id || item.name,
                label: item.name,
              })),
              selected: tempCategory ? [tempCategory.guid || tempCategory.id || tempCategory.name] : [],
              onSelect: handleCategorySelect,
              onDeselect: handleCategoryDeselect,
              onDeselectAll: handleCategoryDeselect,
            },
            itemGroup: {
              label: 'Item Group',
              options: groups.map(item => ({
                key: item.guid || item.id || item.name,
                label: item.name,
              })),
              selected: tempGroup ? [tempGroup.guid || tempGroup.id || tempGroup.name] : [],
              onSelect: handleGroupSelect,
              onDeselect: handleGroupDeselect,
              onDeselectAll: handleGroupDeselect,
            },
          };
        }, [stockFilters, tempWarehouse, tempCategory, tempGroup])}
        onApply={handleApplyFilters}
      />
    </>
  );
};

const styles = StyleSheet.create({
  headerWrapper: {
    position: 'relative',
    zIndex: 1000,
  },
  dropdownBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
  },
  menuDropdown: {
    position: 'absolute',
    top: '100%',
    right: 14,
    backgroundColor: Colors.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    minWidth: 180,
    marginTop: 4,
    overflow: 'hidden',
    zIndex: 1001,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  lastMenuItem: {
    borderBottomWidth: 0,
  },
  menuItemText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#494D58',
  },
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundColorPrimary,
  },
  section: {
    marginTop: 8,
    flex: 1,
  },
  listContainer: {
    paddingHorizontal: 8,
    paddingTop: 12,
    paddingBottom: 10,
  },
  hiddenRow: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 80,
    marginBottom: 8,
    paddingHorizontal: 12,
    marginTop: 10,
  },
  leftAction: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightAction: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actiontext: {
    fontSize: 10,
    marginLeft: 8,
    color: '#111',
    fontWeight: '500',
  },
  stockCard: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  statusLabel: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  statusLabelText: {
    fontSize: 12,
    fontWeight: '400',
    color: '#FFF',
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  loadingContainer: {
    marginTop: 20,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#16C47F',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  productInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  productName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  productId: {
    fontSize: 10,
    color: '#667085',
  },
  rightSection: {
    alignItems: 'flex-end',
  },
  valueText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 2,
  },
  quantityText: {
    fontSize: 10,
    color: '#667085',
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 8,
    marginTop: 12,
    gap: 12,
  },
  searchSection: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: 12,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === 'ios' ? 12 : 14,
    minHeight: Platform.OS === 'ios' ? 50 : undefined,
    gap: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  searchInput: {
    flex: 1,
    fontSize: Platform.OS === 'ios' ? 16 : 14,
    color: '#111111',
    paddingVertical: Platform.OS === 'ios' ? 4 : 0,
  },
  filterIconButton: {
    width: 50,
    height: Platform.OS === 'ios' ? 50 : 52,
    borderRadius: 8,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  clearButton: {
    padding: 4,
  },
});

export default TotalStockScreen;
