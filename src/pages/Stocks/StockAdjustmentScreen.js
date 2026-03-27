import React, { useState, useEffect, useCallback, useRef } from 'react';
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
  Alert,
  Keyboard,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Feather from 'react-native-vector-icons/Feather';
import Icon from 'react-native-vector-icons/Feather';
import Colors from '../../utils/Colors';
import { Header } from '../../components/common';
import ModalStyles from '../../utils/ModalStyles';
import useKeyboardVisibility from '../../hooks/useKeyboardVisibility';
import { useInputNavigation } from '../../components/stocksManagement/StockOverview/TotalStock/Components/inputNavigation';
import { useAuth } from '../../hooks/useAuth';
import apiService from '../../services/api/apiService';
import { Logger } from '../../services/utils/logger';

const StockAdjustmentScreen = () => {
  const navigation = useNavigation();
  const { selectedGuid } = useAuth();

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
  const [selectedProduct, setSelectedProduct] = useState(null);

  const itemSearchTimeoutRef = useRef(null);
  const scrollViewRef = useRef(null);

  // Form state - for stock adjustment fields
  const [binRack, setBinRack] = useState('');
  const [batchSerial, setBatchSerial] = useState('');
  const [currentQuantity, setCurrentQuantity] = useState('0');
  const [adjustmentQuantity, setAdjustmentQuantity] = useState('');
  const [adjustmentReason, setAdjustmentReason] = useState('Damage');
  const [referenceNote, setReferenceNote] = useState('-');
  const [showReasonDropdown, setShowReasonDropdown] = useState(false);
  const [saveState, setSaveState] = useState('save');
  const [errors, setErrors] = useState({});

  // Keyboard and scroll management
  const isKeyboardVisible = useKeyboardVisibility();
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  // Track keyboard height
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      (e) => {
        setKeyboardHeight(e.endCoordinates.height);
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardHeight(0);
      },
    );

    return () => {
      keyboardDidHideListener?.remove();
      keyboardDidShowListener?.remove();
    };
  }, []);

  // Field names in order (text inputs only)
  const fieldNames = [
    'binRack',
    'batchSerial',
    'currentQuantity',
    'adjustmentQuantity',
    'referenceNote',
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

  const reasonOptions = [
    'Damage',
    'Theft',
    'Opening Balance',
    // 'Count Correction',
  ];

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
    async (searchText) => {
      if (!selectedWarehouse || !selectedGuid) return;

      try {
        setLoadingItems(true);

        const body = {
          companyGuid: selectedGuid,
          page: 1,
          searchText: searchText,
          warehouseGuid: resolveGuid(selectedWarehouse),
        };

        Logger.debug('Fetching warehouse items', {
          warehouse: body.warehouseGuid,
          searchText: body.searchText,
        });

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

      if (text.length > 0) {
        itemSearchTimeoutRef.current = setTimeout(() => {
          fetchItems(text);
        }, 500);
      } else {
        setStockItems([]);
      }
    },
    [fetchItems],
  );

  // Handle warehouse selection
  const handleWarehouseSelect = useCallback(warehouse => {
    setSelectedWarehouse(warehouse);
    setWarehouseSearchQuery(warehouse.name || warehouse.displayName || '');
    setShowWarehouseDropdown(false);
    setSelectedProduct(null);
    setItemSearchQuery('');
    setStockItems([]);
  }, []);

  // Handle item selection
  const handleItemSelect = useCallback(item => {
    setSelectedProduct(item);
    setItemSearchQuery(item.name || '');
    setShowItemDropdown(false);
    setStockItems([]);

    // Clear product error when item is selected
    if (errors.product) {
      setErrors(prev => ({...prev, product: ''}));
    }

    // Set current quantity from item
    const qty = item.currentQuantity
      ? String(item.currentQuantity).replace(' items', '').replace(/\s+/g, '')
      : '0';
    setCurrentQuantity(qty);

    // Reset form fields
    setBinRack('');
    setBatchSerial('');
    setAdjustmentQuantity('');
    setAdjustmentReason('Damage');
    setReferenceNote('-');

    // Scroll to top to show the card
    setTimeout(() => {
      scrollViewRef.current?.scrollTo({ y: 0, animated: true });
    }, 100);
  }, [errors.product]);

  const handleQuantityInputChange = text => {
    const numericValue = text.replace(/[^0-9-]/g, '');
    if (numericValue === '' || numericValue === '-') {
      setAdjustmentQuantity(numericValue);
    } else {
      const parsedValue = parseInt(numericValue);
      if (!isNaN(parsedValue)) {
        setAdjustmentQuantity(numericValue);
      }
    }
    // Clear error when user starts typing
    if (errors.adjustmentQuantity) {
      setErrors(prev => ({...prev, adjustmentQuantity: ''}));
    }
  };

  const handleSave = async () => {
    // Clear previous errors
    const newErrors = {};

    // Validation
    if (!selectedProduct) {
      newErrors.product = 'Select an item';
    }

    if (adjustmentQuantity === '' || adjustmentQuantity === '-') {
      newErrors.adjustmentQuantity = 'Fill Adjustment Quantity';
    } else {
      const quantity = parseInt(adjustmentQuantity);
      if (isNaN(quantity)) {
        newErrors.adjustmentQuantity = 'Fill Adjustment Quantity';
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
    setSaveState('saving');

    setTimeout(() => {
      setSaveState('saved');

      const saveData = {
        productId: selectedProduct?.id || selectedProduct?.guid,
        productName: selectedProduct?.name,
        warehouse: selectedWarehouse?.name || selectedWarehouse?.displayName,
        binRack,
        batchSerial,
        currentQuantity,
        adjustmentQuantity: quantity,
        adjustmentReason,
        referenceNote: referenceNote === '-' ? '' : referenceNote,
      };

      setTimeout(() => {
        Alert.alert('Success', 'Stock adjustment saved successfully', [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]);
      }, 1500);
    }, 1500);
  };

  return (
    <View style={styles.container}>
      <Header
        title="Stock Adjustment"
        leftIcon="chevron-left"
        onLeftPress={() => navigation.goBack()}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}
     >
        <ScrollView
          ref={scrollViewRef}
          style={styles.scrollView}
          contentContainerStyle={[
            styles.scrollContent,
            isKeyboardVisible && {
              paddingBottom: Platform.OS === 'ios' ? 100 : 80
            }
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="interactive"
          nestedScrollEnabled={true}
          scrollEnabled={!showWarehouseDropdown && !showItemDropdown && !showReasonDropdown}
          bounces={true}
          scrollEventThrottle={32}>
          {/* Product Information Card - Show at top */}
          {selectedProduct && (
            <View style={ModalStyles.itemCard}>
              <View style={ModalStyles.itemInfo}>
                <View style={ModalStyles.itemIcon}>
                  <Feather name="package" size={20} color="#16C47F" />
                </View>
                <View style={ModalStyles.itemDetails}>
                  <Text style={ModalStyles.itemName}>
                    {selectedProduct.name}
                  </Text>
                  {/* <Text style={ModalStyles.itemId}>
                    {selectedProduct.productId ||
                      selectedProduct.id ||
                      selectedProduct.guid}
                  </Text> */}
                </View>
              </View>
              <View style={ModalStyles.itemStatus}>
                <Text
                  style={[
                    ModalStyles.statusText,
                    { color: selectedProduct.statusColor || '#EF4444' },
                  ]}>
                  {(selectedProduct.statusIcon || '•') + ' ' + (selectedProduct.status || 'Low stock')}
                </Text>
                <Text style={ModalStyles.stockQty}>
                  {String(selectedProduct.currentQuantity ||
                    selectedProduct.quantity ||
                    '0 items')}
                </Text>
              </View>
            </View>
          )}

          {/* Warehouse Search */}
          <View style={ModalStyles.section}>
            <View style={ModalStyles.inputGroup}>
              <Text style={ModalStyles.inputLabel}>Search Warehouse</Text>
              <View style={styles.searchContainer}>
                <Feather
                  name="search"
                  size={16}
                  color="#8F939E"
                  style={styles.searchIcon}
                />
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
                          <Feather
                            name="home"
                            size={16}
                            color="#666"
                            style={styles.warehouseDropdownIcon}
                          />
                          <View style={styles.warehouseDropdownContent}>
                            <Text
                              style={[
                                ModalStyles.dropdownItemText,
                                styles.warehouseDropdownText,
                              ]}>
                              {warehouse.name ||
                                warehouse.displayName ||
                                'Unnamed Warehouse'}
                            </Text>
                            {warehouse.location && (
                              <Text style={styles.warehouseLocation}>
                                {warehouse.location}
                              </Text>
                            )}
                          </View>
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
                  <Feather
                    name="search"
                    size={16}
                    color="#8F939E"
                    style={styles.searchIcon}
                  />
                  <TextInput
                    style={styles.searchInput}
                    placeholder="Type to search items"
                    placeholderTextColor="#8F939E"
                    value={itemSearchQuery}
                    onChangeText={handleItemSearchChange}
                    onFocus={() => {
                      if (
                        itemSearchQuery.length > 0 &&
                        stockItems.length > 0
                      ) {
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
                              <Text style={styles.itemDropdownName}>
                                {item.name}
                              </Text>
                              {item.productId && (
                                <Text style={styles.itemDropdownId}>
                                  {item.productId}
                                </Text>
                              )}
                            </View>
                            <View style={styles.itemDropdownRight}>
                              <Text style={styles.itemDropdownQty}>
                                {item.currentQuantity || 0}{' '}
                                {item.unit || 'items'}
                              </Text>
                              {item.amount && (
                                <Text style={styles.itemDropdownValue}>
                                  ₹{Number(item.amount || 0).toLocaleString('en-IN')}
                                </Text>
                              )}
                            </View>
                          </View>
                        </TouchableOpacity>
                      ))
                    ) : (
                      <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>
                          {itemSearchQuery.length > 0
                            ? 'No items found'
                            : 'Start typing to search items'}
                        </Text>
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

          {/* Bin/Rack and Batch/Serial */}
          <View style={ModalStyles.section}>
            <View style={ModalStyles.rowGroup}>
              <View
                style={ModalStyles.halfInputGroup}
                ref={getContainerRef(0)}
                onLayout={e => handleContainerLayout(0, e)}>
                <Text style={ModalStyles.inputLabel}>Bin / Rack</Text>
                <TextInput
                  ref={getInputRef(0)}
                  style={ModalStyles.textInput}
                  value={binRack}
                  onChangeText={setBinRack}
                  placeholder="Enter bin/rack"
                  placeholderTextColor="#8F939E"
                  returnKeyType="next"
                  blurOnSubmit={false}
                  onSubmitEditing={() => handleSubmitEditing(0, 1, 'next')}
                  onFocus={() => handleInputFocus(0)}
                  editable={!!selectedProduct}
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
                  placeholder="Enter batch/serial"
                  placeholderTextColor="#8F939E"
                  returnKeyType="next"
                  blurOnSubmit={false}
                  onSubmitEditing={() => handleSubmitEditing(1, 2, 'next')}
                  onFocus={() => handleInputFocus(1)}
                  editable={!!selectedProduct}
                />
              </View>
            </View>
          </View>

          {/* Current On-hand Quantity */}
          <View style={ModalStyles.section}>
            <View
              style={ModalStyles.inputGroup}
              ref={getContainerRef(2)}
              onLayout={e => handleContainerLayout(2, e)}>
              <Text style={ModalStyles.inputLabel}>Current On-hand Qty</Text>
              <View style={styles.readOnlyInputContainer}>
                <Text style={styles.readOnlyInputText}>
                  {currentQuantity || '0'}
                </Text>
              </View>
            </View>
          </View>

          {/* Adjustment Details */}
          <View style={ModalStyles.section}>
            <View style={ModalStyles.rowGroup}>
              <View style={ModalStyles.halfInputGroup}>
                <Text style={ModalStyles.inputLabel}>
                  Adjustment Quantity <Text style={styles.required}>*</Text>
                </Text>
                <View
                  ref={getContainerRef(3)}
                  onLayout={e => handleContainerLayout(3, e)}>
                  <TextInput
                    ref={getInputRef(3)}
                    style={[
                      ModalStyles.textInput,
                      errors.adjustmentQuantity && styles.inputError
                    ]}
                    keyboardType={getKeyboardType('numeric')}
                    value={adjustmentQuantity}
                    onChangeText={handleQuantityInputChange}
                    placeholder="Enter quantity"
                    placeholderTextColor="#8F939E"
                    returnKeyType="next"
                    blurOnSubmit={false}
                    onSubmitEditing={() => handleSubmitEditing(3, 4, 'next')}
                    onFocus={() => handleInputFocus(3)}
                    editable={!!selectedProduct}
                  />
                </View>
                {/* Error message for adjustment quantity */}
                {errors.adjustmentQuantity && (
                  <Text style={styles.errorText}>{errors.adjustmentQuantity}</Text>
                )}
              </View>

              <View style={ModalStyles.halfInputGroup}>
                <Text style={ModalStyles.inputLabel}>
                  Adjustment Reason <Text style={styles.required}>*</Text>
                </Text>
                <TouchableOpacity
                  style={ModalStyles.dropdownField}
                  onPress={() =>
                    selectedProduct && setShowReasonDropdown(!showReasonDropdown)
                  }
                  activeOpacity={0.7}
                  disabled={!selectedProduct}>
                  <Text style={ModalStyles.dropdownText}>
                    {adjustmentReason}
                  </Text>
                  <Feather
                    name={showReasonDropdown ? 'chevron-up' : 'chevron-down'}
                    size={16}
                    color="#666"
                  />
                </TouchableOpacity>

                {showReasonDropdown && (
                  <View style={[ModalStyles.dropdownList, styles.reasonDropdown]}>
                    {reasonOptions.map((reason, index) => (
                      <TouchableOpacity
                        key={index}
                        style={[
                          ModalStyles.dropdownItem,
                          index === reasonOptions.length - 1 &&
                          ModalStyles.lastDropdownOption,
                        ]}
                        onPress={() => {
                          setAdjustmentReason(reason);
                          setShowReasonDropdown(false);
                        }}>
                        <Text style={ModalStyles.dropdownItemText}>
                          {reason}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>
            </View>
          </View>

          {/* Reference/Note */}
          <View
            style={ModalStyles.section}
            ref={getContainerRef(4)}
            onLayout={e => handleContainerLayout(4, e)}>
            <Text style={ModalStyles.inputLabel}>Reference / Note</Text>
            <TextInput
              ref={getInputRef(4)}
              style={[ModalStyles.textInput, ModalStyles.narrationInput]}
              value={referenceNote}
              onChangeText={setReferenceNote}
              placeholder="Enter reference or note"
              placeholderTextColor="#8F939E"
              multiline
              numberOfLines={2}
              textAlignVertical="top"
              returnKeyType="done"
              blurOnSubmit={true}
              onSubmitEditing={() => handleSubmitEditing(4, null, 'done')}
              onFocus={() => handleInputFocus(4)}
              editable={!!selectedProduct}
            />
          </View>
        </ScrollView>

        {/* Save Button */}
        {!isKeyboardVisible && !showReasonDropdown && (
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[
                styles.saveButton,
                saveState === 'saving' && styles.savingButton,
                saveState === 'saved' && styles.savedButton,
              ]}
              onPress={handleSave}
              disabled={saveState === 'saving'}
              activeOpacity={0.7}>
              {saveState === 'saving' ? (
                <>
                  <ActivityIndicator size="small" color={Colors.white} />
                  <Text style={styles.saveButtonText}>Saving...</Text>
                </>
              ) : saveState === 'saved' ? (
                <>
                  <Icon name="check" size={16} color={Colors.white} />
                  <Text style={styles.saveButtonText}>Adjustment Done</Text>
                </>
              ) : (
                <Text style={styles.saveButtonText}>Save Adjustment</Text>
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
    paddingBottom: 40,
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
  clearButton: {
    padding: 4,
    marginLeft: 8,
  },
  warehouseDropdownRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  warehouseDropdownIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  warehouseDropdownContent: {
    flex: 1,
  },
  warehouseDropdownText: {
    flex: 1,
    fontWeight: '400',
  },
  warehouseLocation: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  itemDropdownContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
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
    marginLeft: 12,
  },
  itemDropdownQty: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  itemDropdownValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#16C47F',
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
  readOnlyInputContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 12,
    paddingVertical: 12,
    minHeight: 50,
    justifyContent: 'center',
  },
  readOnlyInputText: {
    fontSize: 14,
    color: '#666',
  },
  buttonContainer: {
    flexDirection: 'column',
    gap: 8,
    padding: 16,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 8,
    backgroundColor: '#07624C',
    gap: 8,
  },
  savingButton: {
    backgroundColor: '#07624C',
  },
  savedButton: {
    backgroundColor: '#07624C',
  },
  saveButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default StockAdjustmentScreen;
