import React, {useState, useEffect, useCallback, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import Feather from 'react-native-vector-icons/Feather';
import Icon from 'react-native-vector-icons/Feather';
import Colors from '../../utils/Colors';
import {Header} from '../../components/common';
import ModalStyles from '../../utils/ModalStyles';
import useKeyboardVisibility from '../../hooks/useKeyboardVisibility';
import {useInputNavigation} from '../../components/stocksManagement/StockOverview/TotalStock/Components/inputNavigation';
import {useAuth} from '../../hooks/useAuth';
import apiService from '../../services/api/apiService';
import {Logger} from '../../services/utils/logger';

const StockTransferScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {product: routeProduct} = route.params || {};
  const {selectedGuid} = useAuth();
  
  // Warehouse search state
  const [warehouseSearchQuery, setWarehouseSearchQuery] = useState('');
  const [warehouses, setWarehouses] = useState([]);
  const [selectedWarehouse, setSelectedWarehouse] = useState(null);
  const [showWarehouseDropdown, setShowWarehouseDropdown] = useState(false);
  const [loadingWarehouses, setLoadingWarehouses] = useState(false);
  
  // Items list state
  const [stockItems, setStockItems] = useState([]);
  const [loadingItems, setLoadingItems] = useState(false);
  const [itemSearchQuery, setItemSearchQuery] = useState('');
  const [showItemDropdown, setShowItemDropdown] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(routeProduct || null);
  
  // Form state
  const [sourceRack, setSourceRack] = useState('');
  const [destinationRack, setDestinationRack] = useState('');
  const [onHandQty, setOnHandQty] = useState('');
  const [batchSerial, setBatchSerial] = useState('');
  const [transferQty, setTransferQty] = useState('');
  const [narration, setNarration] = useState('');
  const [transferState, setTransferState] = useState('transfer'); // 'transfer', 'transferring', 'transferred'
  const [errors, setErrors] = useState({});
  
  // Destination warehouse state
  const [destinationWarehouse, setDestinationWarehouse] = useState('');
  const [showDestinationWarehouseDropdown, setShowDestinationWarehouseDropdown] = useState(false);

  // Keyboard and scroll management
  const isKeyboardVisible = useKeyboardVisibility();
  const scrollViewRef = useRef(null);
  const itemSearchTimeoutRef = useRef(null);
  const narrationContainerY = useRef(null);

  // Field names in order (text inputs only)
  const fieldNames = [
    'onHandQty',
    'batchSerial',
    'transferQty',
    'narration',
  ];

  // Use common input navigation hook
  const {
    getInputRef,
    getContainerRef,
    handleInputFocus,
    handleContainerLayout,
    clearInputRefs,
    getKeyboardType,
    handleSubmitEditing,
  } = useInputNavigation(fieldNames.length, scrollViewRef);

  // Dropdown states
  const [showSourceRackDropdown, setShowSourceRackDropdown] = useState(false);
  const [showDestinationRackDropdown, setShowDestinationRackDropdown] =
    useState(false);

  // Dummy data for dropdowns
  const rackOptions = ['Rack A-01', 'Rack A-02', 'Rack A-03', 'Rack A-04'];
  
  const resolveGuid = v => (typeof v === 'string' ? v : v?.guid || v?.id || '');

  // Fetch warehouses
  useEffect(() => {
    const fetchWarehouses = async () => {
      if (!selectedGuid) {
        setWarehouses([]);
        setLoadingWarehouses(false);
        return;
      }

      try {
        setLoadingWarehouses(true);
        const res = await apiService.fetchStockFilters(selectedGuid);
        const payload = res?.data || res;
        const list =
          payload?.warehouses ||
          payload?.data?.warehouses ||
          payload?.warehousesList ||
          [];
        if (Array.isArray(list)) {
          setWarehouses(list);
        } else {
          setWarehouses([]);
        }
      } catch (error) {
        Logger.error('Failed to fetch warehouses', error);
        setWarehouses([]);
      } finally {
        setLoadingWarehouses(false);
      }
    };

    fetchWarehouses();
  }, [selectedGuid]);

  // Filter warehouses based on search
  const filteredWarehouses = warehouses.filter(w => {
    const name = w.name || w.displayName || '';
    const location = w.location || w.address || w.city || '';
    return (
      name.toLowerCase().includes(warehouseSearchQuery.toLowerCase()) ||
      location.toLowerCase().includes(warehouseSearchQuery.toLowerCase())
    );
  });

  // Fetch items for selected warehouse
  const fetchItems = useCallback(
    async (searchText = '') => {
      if (!selectedWarehouse || !selectedGuid) return;

      try {
        setLoadingItems(true);

        const body = {
          companyGuid: selectedGuid,
          page: 1,
          searchText: searchText,
          warehouseGuid: resolveGuid(selectedWarehouse),
        };

        const response = await apiService.fetchStocks(body);

        if (response?.status && Array.isArray(response?.data?.stocks)) {
          setStockItems(response.data.stocks);
        } else {
          setStockItems([]);
        }
      } catch (error) {
        Logger.error('Fetch warehouse items error', error);
        setStockItems([]);
      } finally {
        setLoadingItems(false);
      }
    },
    [selectedWarehouse, selectedGuid],
  );

  // Debounced item search
  const handleItemSearchChange = useCallback(
    text => {
      setItemSearchQuery(text);
      setShowItemDropdown(text.length > 0);

      if (itemSearchTimeoutRef.current) {
        clearTimeout(itemSearchTimeoutRef.current);
      }

      itemSearchTimeoutRef.current = setTimeout(() => {
        if (text.length > 0) {
          fetchItems(text);
        }
      }, 1000);
    },
    [fetchItems],
  );

  // Fetch items when warehouse is selected
  useEffect(() => {
    if (selectedWarehouse && selectedGuid) {
      fetchItems('');
    }
  }, [selectedWarehouse, selectedGuid]);

  // Handle warehouse selection
  const handleWarehouseSelect = useCallback(warehouse => {
    setSelectedWarehouse(warehouse);
    setWarehouseSearchQuery(warehouse.name || warehouse.displayName || '');
    setShowWarehouseDropdown(false);
    setSelectedProduct(null); // Reset selected product when warehouse changes
    setStockItems([]);
    setItemSearchQuery('');
  }, []);

  // Handle item selection
  const handleItemSelect = useCallback(item => {
    setSelectedProduct(item);
    const qty = item.currentQuantity
      ? String(item.currentQuantity).replace(' items', '').replace(/\s+/g, '')
      : '0';
    setOnHandQty(qty);
    setItemSearchQuery(item.name || '');
    setShowItemDropdown(false);
    
    // Clear product error when item is selected
    if (errors.product) {
      setErrors(prev => ({...prev, product: ''}));
    }
    
    // Scroll to form
    setTimeout(() => {
      scrollViewRef.current?.scrollTo({y: 0, animated: true});
    }, 100);
  }, [errors.product]);

  // Initialize product from route params
  useEffect(() => {
    if (routeProduct) {
      setSelectedProduct(routeProduct);
      const qty = routeProduct.currentQuantity
        ? String(routeProduct.currentQuantity).replace(' items', '').replace(/\s+/g, '')
        : '0';
      setOnHandQty(qty);
    }
  }, [routeProduct]);

  const handleTransfer = useCallback(async () => {
    // Clear previous errors
    const newErrors = {};

    // Validation
    if (!selectedProduct) {
      newErrors.product = 'Select an item';
    }

    if (!destinationWarehouse || destinationWarehouse.trim() === '') {
      newErrors.destinationWarehouse = 'Fill Destination Warehouse';
    }

    if (!transferQty || transferQty.trim() === '') {
      newErrors.transferQty = 'Fill Quantity to Transfer';
    } else {
      const quantity = parseInt(transferQty);
      if (isNaN(quantity) || quantity <= 0) {
        newErrors.transferQty = 'Fill Quantity to Transfer';
      }
    }

    // Set errors and return if validation fails
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      // Scroll to first error
      setTimeout(() => {
        scrollViewRef.current?.scrollTo({y: 0, animated: true});
      }, 100);
      return;
    }

    // Clear errors if validation passes
    setErrors({});
    setTransferState('transferring');

    // Simulate API call
    setTimeout(() => {
      setTransferState('transferred');

      const transferData = {
        product: selectedProduct,
        sourceWarehouse: selectedWarehouse,
        destinationWarehouse,
        sourceRack,
        destinationRack,
        transferQty,
        narration,
      };

      // Keep transferred state visible for 1.5 seconds, then navigate back
      setTimeout(() => {
        navigation.goBack();
        
        // Clear all fields immediately
        setSourceRack('');
        setDestinationRack('');
        setOnHandQty('');
        setBatchSerial('');
        setTransferQty('');
        setNarration('');
        setShowSourceRackDropdown(false);
        setShowDestinationRackDropdown(false);
        setShowWarehouseDropdown(false);
        setShowItemDropdown(false);
        setShowDestinationWarehouseDropdown(false);
        
        // Clear all input refs
        clearInputRefs();
        
        // Reset state after a delay to allow animation to complete
        setTimeout(() => {
          setTransferState('transfer');
        }, 300);
      }, 1500);
    }, 1500);
  }, [
    selectedProduct,
    selectedWarehouse,
    destinationWarehouse,
    sourceRack,
    destinationRack,
    transferQty,
    narration,
    navigation,
    clearInputRefs,
  ]);

  const handleClose = useCallback(() => {
    if (transferState !== 'transferring') {
      setTransferState('transfer');
      setSourceRack('');
      setDestinationRack('');
      setOnHandQty('');
      setBatchSerial('');
      setTransferQty('');
      setNarration('');
      setSelectedProduct(null);
      setSelectedWarehouse(null);
      setDestinationWarehouse('');
      setWarehouseSearchQuery('');
      setItemSearchQuery('');
      setStockItems([]);
      navigation.goBack();
    }
  }, [navigation, transferState]);

  // Dropdown handlers
  const handleRackSelect = useCallback((rack, isSource = true) => {
    if (isSource) {
      setSourceRack(rack);
      setShowSourceRackDropdown(false);
    } else {
      setDestinationRack(rack);
      setShowDestinationRackDropdown(false);
    }
  }, []);

  const handleDestinationWarehouseSelect = useCallback(warehouse => {
    setDestinationWarehouse(warehouse.name || warehouse.displayName || '');
    setShowDestinationWarehouseDropdown(false);
    
    // Clear error when warehouse is selected
    if (errors.destinationWarehouse) {
      setErrors(prev => ({...prev, destinationWarehouse: ''}));
    }
  }, [errors.destinationWarehouse]);

  return (
    <View style={styles.container}>
      <Header
        title="Stock Transfer"
        leftIcon="chevron-left"
        onLeftPress={handleClose}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}>
        <ScrollView
          ref={scrollViewRef}
          style={styles.scrollView}
          contentContainerStyle={[
            styles.scrollContent,
            isKeyboardVisible && styles.scrollContentWithKeyboard
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="interactive"
          nestedScrollEnabled={true}
          scrollEnabled={true}
          bounces={true}
          scrollEventThrottle={32}>
          {/* Product Information - Moved to top */}
          {selectedProduct && (
            <View style={ModalStyles.itemCard}>
              <View style={ModalStyles.itemInfo}>
                <View style={ModalStyles.itemIcon}>
                  <Feather name="box" size={20} color="#16C47F" />
                </View>
                <View style={ModalStyles.itemDetails}>
                  <Text style={ModalStyles.itemName}>{selectedProduct.name}</Text>
                </View>
              </View>
              <View style={ModalStyles.itemStatus}>
                <Text style={ModalStyles.stockQty}>
                  {selectedProduct.currentQuantity || selectedProduct.quantity || 0} {selectedProduct.unit || 'items'}
                </Text>
              </View>
            </View>
          )}

          {/* Warehouse Search */}
          <View style={ModalStyles.section}>
            <View style={ModalStyles.inputGroup}>
              <Text style={ModalStyles.inputLabel}>Search Warehouse</Text>
              <View style={styles.searchContainer}>
                <Feather name="search" size={16} color="#8F939E" style={styles.searchIcon} />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search warehouse"
                  placeholderTextColor="#8F939E"
                  value={warehouseSearchQuery}
                  onChangeText={text => {
                    setWarehouseSearchQuery(text);
                    setShowWarehouseDropdown(text.length > 0);
                  }}
                  onFocus={() => {
                    if (warehouseSearchQuery.length > 0) {
                      setShowWarehouseDropdown(true);
                    }
                  }}
                />
                {warehouseSearchQuery.length > 0 && (
                  <TouchableOpacity
                    style={styles.clearButton}
                    onPress={() => {
                      setWarehouseSearchQuery('');
                      setSelectedWarehouse(null);
                      setShowWarehouseDropdown(false);
                      setStockItems([]);
                      setSelectedProduct(null);
                      setItemSearchQuery('');
                    }}>
                    <Feather name="x" size={16} color="#666" />
                  </TouchableOpacity>
                )}
              </View>

              {showWarehouseDropdown && (
                <View style={ModalStyles.dropdownList}>
                  {loadingWarehouses ? (
                    <View style={styles.loadingContainer}>
                      <ActivityIndicator size="small" color="#16C47F" />
                    </View>
                  ) : filteredWarehouses.length > 0 ? (
                    filteredWarehouses.map((warehouse, index) => (
                      <TouchableOpacity
                        key={warehouse.guid || warehouse.id || index}
                        style={[
                          ModalStyles.dropdownItem,
                          index === filteredWarehouses.length - 1 &&
                            ModalStyles.lastDropdownOption,
                        ]}
                        onPress={() => handleWarehouseSelect(warehouse)}>
                        <View style={styles.warehouseDropdownRow}>
                          <Feather name="home" size={16} color="#666" style={styles.warehouseDropdownIcon} />
                          <Text style={[ModalStyles.dropdownItemText, styles.warehouseDropdownText]}>
                            {warehouse.name || warehouse.displayName || 'Unnamed Warehouse'}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    ))
                  ) : (
                    <View style={styles.emptyContainer}>
                      <Text style={styles.emptyText}>No warehouses found</Text>
                    </View>
                  )}
                </View>
              )}
            </View>
          </View>

          {/* Item Search - Show only when warehouse is selected */}
          {selectedWarehouse && (
            <View style={ModalStyles.section}>
              <View style={ModalStyles.inputGroup}>
                <Text style={ModalStyles.inputLabel}>Search Item</Text>
                
                {/* Item Search */}
                <View style={[
                  styles.searchContainer,
                  errors.product && styles.inputError
                ]}>
                  <Feather name="search" size={16} color="#8F939E" style={styles.searchIcon} />
                  <TextInput
                    style={styles.searchInput}
                    placeholder="Search items"
                    placeholderTextColor="#8F939E"
                    value={itemSearchQuery}
                    onChangeText={handleItemSearchChange}
                    onFocus={() => {
                      if (itemSearchQuery.length > 0 && stockItems.length > 0) {
                        setShowItemDropdown(true);
                      }
                    }}
                  />
                  {itemSearchQuery.length > 0 && (
                    <TouchableOpacity
                      style={styles.clearButton}
                      onPress={() => {
                        setItemSearchQuery('');
                        setSelectedProduct(null);
                        setShowItemDropdown(false);
                        setStockItems([]);
                      }}>
                      <Feather name="x" size={16} color="#666" />
                    </TouchableOpacity>
                  )}
                </View>

                {/* Item Dropdown */}
                {showItemDropdown && (
                  <View style={ModalStyles.dropdownList}>
                    {loadingItems ? (
                      <View style={styles.loadingContainer}>
                        <ActivityIndicator size="small" color="#16C47F" />
                      </View>
                    ) : stockItems.length > 0 ? (
                      stockItems.map((item, index) => (
                        <TouchableOpacity
                          key={item.guid || item.id || index}
                          style={[
                            ModalStyles.dropdownItem,
                            index === stockItems.length - 1 &&
                              ModalStyles.lastDropdownOption,
                          ]}
                          onPress={() => handleItemSelect(item)}>
                          <View style={styles.itemDropdownContent}>
                            <View style={styles.itemDropdownLeft}>
                              <Text style={styles.itemDropdownName}>{item.name}</Text>
                              {item.productId && (
                                <Text style={styles.itemDropdownId}>{item.productId}</Text>
                              )}
                            </View>
                            <View style={styles.itemDropdownRight}>
                              <Text style={styles.itemDropdownQty}>
                                {item.currentQuantity || 0} {item.unit || 'items'}
                              </Text>
                            </View>
                          </View>
                        </TouchableOpacity>
                      ))
                    ) : (
                      <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>No items found</Text>
                      </View>
                    )}
                  </View>
                )}

                {/* Error message for product selection */}
                {errors.product && (
                  <Text style={styles.errorText}>{errors.product}</Text>
                )}
              </View>
            </View>
          )}

          {/* Source Details */}
          <View style={ModalStyles.section}>
            <View style={ModalStyles.inputGroup}>
              <Text style={ModalStyles.inputLabel}>Source Rack</Text>
              <TouchableOpacity
                style={ModalStyles.dropdownField}
                onPress={() =>
                  selectedWarehouse && selectedProduct && setShowSourceRackDropdown(!showSourceRackDropdown)
                }
                disabled={!selectedWarehouse || !selectedProduct}
                activeOpacity={0.7}>
                <Text
                  style={[
                    ModalStyles.dropdownText,
                    !sourceRack && ModalStyles.placeholderText,
                  ]}>
                  {sourceRack || 'Select rack'}
                </Text>
                <Feather name="chevron-down" size={16} color="#666" />
              </TouchableOpacity>

              {showSourceRackDropdown && (
                <View style={ModalStyles.dropdownList}>
                  {rackOptions.map((rack, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[
                        ModalStyles.dropdownItem,
                        index === rackOptions.length - 1 &&
                          ModalStyles.lastDropdownOption,
                      ]}
                      onPress={() => handleRackSelect(rack, true)}>
                      <Text style={ModalStyles.dropdownItemText}>{rack}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            <View style={ModalStyles.rowGroup}>
              <View
                style={ModalStyles.halfInputGroup}
                ref={getContainerRef(0)}
                onLayout={e => handleContainerLayout(0, e)}>
                <Text style={ModalStyles.inputLabel}>On-hand Qty</Text>
                <TextInput
                  ref={getInputRef(0)}
                  style={ModalStyles.textInput}
                  value={onHandQty}
                  onChangeText={setOnHandQty}
                  keyboardType={getKeyboardType('numeric')}
                  placeholder="Enter quantity"
                  placeholderTextColor="#8F939E"
                  returnKeyType="next"
                  blurOnSubmit={false}
                  onSubmitEditing={() => handleSubmitEditing(0, 1, 'next')}
                  onFocus={() => handleInputFocus(0)}
                  editable={!!selectedWarehouse && !!selectedProduct}
                />
              </View>

              <View
                style={ModalStyles.halfInputGroup}
                ref={getContainerRef(1)}
                onLayout={e => handleContainerLayout(1, e)}>
                <Text style={ModalStyles.inputLabel}>
                  Batch / Serial Picker
                </Text>
                <TextInput
                  ref={getInputRef(1)}
                  style={ModalStyles.textInput}
                  value={batchSerial}
                  onChangeText={setBatchSerial}
                  placeholder="Enter batch no."
                  placeholderTextColor="#8F939E"
                  returnKeyType="next"
                  blurOnSubmit={false}
                  onSubmitEditing={() => handleSubmitEditing(1, 2, 'next')}
                  onFocus={() => handleInputFocus(1)}
                  editable={!!selectedWarehouse && !!selectedProduct}
                />
              </View>
            </View>
          </View>

          {/* Destination Details */}
          <View style={ModalStyles.section}>
            <View style={ModalStyles.inputGroup}>
              <Text style={ModalStyles.inputLabel}>
                Destination Warehouse <Text style={styles.required}>*</Text>
              </Text>
              <TouchableOpacity
                style={[
                  ModalStyles.dropdownField,
                  errors.destinationWarehouse && styles.inputError
                ]}
                onPress={() =>
                  selectedWarehouse && selectedProduct && setShowDestinationWarehouseDropdown(
                    !showDestinationWarehouseDropdown,
                  )
                }
                disabled={!selectedWarehouse || !selectedProduct}
                activeOpacity={0.7}>
                <Text
                  style={[
                    ModalStyles.dropdownText,
                    !destinationWarehouse && ModalStyles.placeholderText,
                  ]}>
                  {destinationWarehouse || 'Select warehouse'}
                </Text>
                <Feather name="chevron-down" size={16} color="#666" />
              </TouchableOpacity>

              {showDestinationWarehouseDropdown && (
                <View style={ModalStyles.dropdownList}>
                  {loadingWarehouses ? (
                    <View style={styles.loadingContainer}>
                      <ActivityIndicator size="small" color="#16C47F" />
                    </View>
                  ) : warehouses.length > 0 ? (
                    warehouses.map((warehouse, index) => (
                      <TouchableOpacity
                        key={warehouse.guid || warehouse.id || index}
                        style={[
                          ModalStyles.dropdownItem,
                          index === warehouses.length - 1 &&
                            ModalStyles.lastDropdownOption,
                        ]}
                        onPress={() => handleDestinationWarehouseSelect(warehouse)}>
                        <View style={styles.warehouseDropdownRow}>
                          <Feather name="home" size={16} color="#666" style={styles.warehouseDropdownIcon} />
                          <Text style={[ModalStyles.dropdownItemText, styles.warehouseDropdownText]}>
                            {warehouse.name || warehouse.displayName || 'Unnamed Warehouse'}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    ))
                  ) : (
                    <View style={styles.emptyContainer}>
                      <Text style={styles.emptyText}>No warehouses found</Text>
                    </View>
                  )}
                </View>
              )}
            </View>

            <View style={ModalStyles.rowGroup}>
              <View style={ModalStyles.halfInputGroup}>
                <Text style={ModalStyles.inputLabel}>Destination Rack</Text>
                <TouchableOpacity
                  style={ModalStyles.dropdownField}
                  onPress={() =>
                    selectedWarehouse && selectedProduct && setShowDestinationRackDropdown(
                      !showDestinationRackDropdown,
                    )
                  }
                  disabled={!selectedWarehouse || !selectedProduct}
                  activeOpacity={0.7}>
                  <Text
                    style={[
                      ModalStyles.dropdownText,
                      !destinationRack && ModalStyles.placeholderText,
                    ]}>
                    {destinationRack || 'Select rack'}
                  </Text>
                  <Feather name="chevron-down" size={16} color="#666" />
                </TouchableOpacity>

                {showDestinationRackDropdown && (
                  <View style={ModalStyles.dropdownList}>
                    {rackOptions.map((rack, index) => (
                      <TouchableOpacity
                        key={index}
                        style={[
                          ModalStyles.dropdownItem,
                          index === rackOptions.length - 1 &&
                            ModalStyles.lastDropdownOption,
                        ]}
                        onPress={() => handleRackSelect(rack, false)}>
                        <Text style={ModalStyles.dropdownItemText}>
                          {rack}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>

              <View
                style={ModalStyles.halfInputGroup}
                ref={getContainerRef(2)}
                onLayout={e => handleContainerLayout(2, e)}>
                <Text style={ModalStyles.inputLabel}>
                  Quantity to Transfer <Text style={styles.required}>*</Text>
                </Text>
                <TextInput
                  ref={getInputRef(2)}
                  style={[
                    ModalStyles.textInput,
                    errors.transferQty && styles.inputError
                  ]}
                  value={transferQty}
                  onChangeText={text => {
                    setTransferQty(text);
                    // Clear error when user starts typing
                    if (errors.transferQty) {
                      setErrors(prev => ({...prev, transferQty: ''}));
                    }
                  }}
                  keyboardType={getKeyboardType('numeric')}
                  placeholder="Enter quantity"
                  placeholderTextColor="#8F939E"
                  returnKeyType="next"
                  blurOnSubmit={false}
                  onSubmitEditing={() => handleSubmitEditing(2, 3, 'next')}
                  onFocus={() => handleInputFocus(2)}
                  editable={!!selectedWarehouse && !!selectedProduct}
                />
                {/* Error message for transfer quantity */}
                {errors.transferQty && (
                  <Text style={styles.errorText}>{errors.transferQty}</Text>
                )}
              </View>
            </View>
          </View>

          {/* Narration */}
          <View
            style={ModalStyles.section}
            ref={getContainerRef(3)}
            onLayout={e => {
              handleContainerLayout(3, e);
              narrationContainerY.current = e.nativeEvent.layout.y;
            }}>
            <Text style={ModalStyles.inputLabel}>Narration</Text>
            <TextInput
              ref={getInputRef(3)}
              style={[ModalStyles.textInput, ModalStyles.narrationInput]}
              value={narration}
              onChangeText={setNarration}
              multiline
              numberOfLines={3}
              placeholder="Enter transfer notes..."
              placeholderTextColor="#8F939E"
              returnKeyType="done"
              blurOnSubmit={true}
              onSubmitEditing={() => handleSubmitEditing(3, null, 'done')}
              onFocus={() => {
                // Scroll to end to position narration field just above keyboard
                if (scrollViewRef?.current) {
                  setTimeout(() => {
                    scrollViewRef.current?.scrollToEnd({animated: true});
                  }, 300);
                }
              }}
              editable={!!selectedWarehouse && !!selectedProduct}
            />
          </View>

        </ScrollView>

        {/* Transfer Button */}
        {!isKeyboardVisible && (
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[
                styles.transferButton,
                transferState === 'transferring' && styles.transferringButton,
                transferState === 'transferred' && styles.transferredButton,
              ]}
              onPress={handleTransfer}
              disabled={transferState === 'transferring'}>
              {transferState === 'transferring' ? (
                <>
                  <ActivityIndicator size="small" color={Colors.white} />
                  <Text style={styles.transferButtonText}>Transferring...</Text>
                </>
              ) : transferState === 'transferred' ? (
                <>
                  <Icon name="check" size={16} color={Colors.white} />
                  <Text style={styles.transferButtonText}>Transferred</Text>
                </>
              ) : (
                <Text style={styles.transferButtonText}>Transfer</Text>
              )}
            </TouchableOpacity>
          </View>
        )}
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundColorPrimary,
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 12,
    paddingBottom: 12,
  },
  scrollContentWithKeyboard: {
    paddingBottom: Platform.OS === 'ios' ? 250 : 150,
  },
  fieldIcon: {
    marginRight: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === 'ios' ? 16 : 14,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    paddingVertical: 0,
  },
  clearButton: {
    padding: 4,
    marginLeft: 8,
  },
  warehouseDropdownRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  warehouseDropdownIcon: {
    marginRight: 12,
  },
  warehouseDropdownText: {
    flex: 1,
  },
  itemDropdownContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  required: {
    color: '#EF4444',
    fontWeight: '400',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  inputError: {
    borderColor: '#EF4444',
    borderWidth: 1,
  },
  itemDropdownLeft: {
    flex: 1,
  },
  itemDropdownName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  itemDropdownId: {
    fontSize: 12,
    color: '#666',
  },
  itemDropdownRight: {
    alignItems: 'flex-end',
  },
  itemDropdownQty: {
    fontSize: 12,
    color: '#666',
  },
  loadingContainer: {
    padding: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyContainer: {
    padding: 14,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#666',
  },
  buttonContainer: {
    flexDirection: 'column',
    gap: 8,
    padding: 12,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  transferButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 8,
    backgroundColor: '#07624C',
    gap: 8,
  },
  transferringButton: {
    backgroundColor: '#07624C',
  },
  transferredButton: {
    backgroundColor: '#07624C',
  },
  transferButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default StockTransferScreen;
