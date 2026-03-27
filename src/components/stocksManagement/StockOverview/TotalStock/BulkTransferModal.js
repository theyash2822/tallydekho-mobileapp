import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Keyboard,
  ActivityIndicator,
  Platform,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import Icon from 'react-native-vector-icons/Feather';
import Colors from '../../../../utils/Colors';
import CustomAnimatedModal from '../../../common/CustomAnimatedModal';
import FormField from '../../../common/FormField';
import ModalStyles from '../../../../utils/ModalStyles';
import useKeyboardVisibility from '../../../../hooks/useKeyboardVisibility';
import { useInputNavigation } from './Components/inputNavigation';
import { useAuth } from '../../../../hooks/useAuth';
import apiService from '../../../../services/api/apiService';
import { Logger } from '../../../../services/utils/logger';
import { Icons } from '../../../../utils/Icons';


const BulkTransferModal = ({ visible, onClose, onTransfer }) => {
  const { selectedGuid } = useAuth();
  const [sourceWarehouse, setSourceWarehouse] = useState(null);
  const [sourceRack, setSourceRack] = useState('');
  const [destinationWarehouse, setDestinationWarehouse] = useState(null);
  const [destinationRack, setDestinationRack] = useState('');
  const [narration, setNarration] = useState('');

  // Item search functionality
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);

  // Warehouse dropdown states
  const [showSourceWarehouseDropdown, setShowSourceWarehouseDropdown] = useState(false);
  const [showDestinationDropdown, setShowDestinationDropdown] = useState(false);

  // API data
  const [warehouses, setWarehouses] = useState([]);
  const [loadingWarehouses, setLoadingWarehouses] = useState(false);
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);

  // Close all dropdowns helper
  const closeAllDropdowns = useCallback(() => {
    setShowSourceWarehouseDropdown(false);
    setShowDestinationDropdown(false);
  }, []);

  // Fetch warehouses from API
  useEffect(() => {
    const fetchWarehouses = async () => {
      if (!selectedGuid) {
        setWarehouses([]);
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
          // Set default warehouses if not already set
          if (list.length > 0 && !sourceWarehouse) {
            setSourceWarehouse(list[0]);
          }
          if (list.length > 0 && !destinationWarehouse) {
            setDestinationWarehouse(list[0]);
          }
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

    if (visible) {
      fetchWarehouses();
    }
  }, [selectedGuid, visible]);

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      if (!selectedGuid) {
        setProducts([]);
        return;
      }

      try {
        setLoadingProducts(true);
        const body = {
          companyGuid: selectedGuid,
          page: 1,
          searchText: '',
        };
        const response = await apiService.fetchStocks(body);
        if (response?.status && Array.isArray(response?.data?.stocks)) {
          setProducts(response.data.stocks);
        } else {
          setProducts([]);
        }
      } catch (error) {
        Logger.error('Failed to fetch products', error);
        setProducts([]);
      } finally {
        setLoadingProducts(false);
      }
    };

    if (visible) {
      fetchProducts();
    }
  }, [selectedGuid, visible]);

  // Keyboard and scroll management
  const isKeyboardVisible = useKeyboardVisibility();
  const scrollViewRef = useRef(null);
  const [transferState, setTransferState] = useState('transfer'); // 'transfer', 'transferring', 'transferred'

  // Field names in order (main fields only, dynamic item fields handled separately)
  const fieldNames = [
    'searchQuery',
    'sourceWarehouse',
    'sourceRack',
    'destinationRack',
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

  // Filter products based on search query
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleItemSelect = product => {
    const itemId = product.guid || product.id;
    if (selectedItems.find(item => (item.guid || item.id) === itemId)) {
      // Remove item if already selected
      setSelectedItems(selectedItems.filter(item => (item.guid || item.id) !== itemId));
    } else {
      // Add item if not selected with initialized fields
      const newItem = {
        ...product,
        onHandQty: product.currentQuantity ? String(product.currentQuantity) : '',
        batchSerial: '',
        transferQty: '',
      };
      setSelectedItems([...selectedItems, newItem]);
    }
    setSearchQuery('');
  };

  const removeSelectedItem = itemId => {
    setSelectedItems(selectedItems.filter(item => (item.guid || item.id) !== itemId));
  };

  const handleTransfer = useCallback(async () => {
    setTransferState('transferring');

    // Simulate API call
    setTimeout(() => {
      setTransferState('transferred');

      const transferData = {
        selectedItems,
        sourceWarehouse,
        sourceRack,
        destinationWarehouse,
        destinationRack,
        narration,
      };

      // Keep transferred state visible for 1.5 seconds, then transfer (parent will close with animation)
      setTimeout(() => {

        onTransfer(); // Parent will close modal, triggering animation

        // Clear all fields immediately
        setSourceWarehouse(warehouses.length > 0 ? warehouses[0] : null);
        setSourceRack('');
        setDestinationWarehouse(warehouses.length > 0 ? warehouses[0] : null);
        setDestinationRack('');
        setNarration('');
        setSelectedItems([]);
        setSearchQuery('');
        setShowSourceWarehouseDropdown(false);
        setShowDestinationDropdown(false);

        // Clear all input refs
        clearInputRefs();

        // Reset state after a delay to allow animation to complete
        setTimeout(() => {
          setTransferState('transfer');
        }, 300);
      }, 1500);
    }, 1500);
  }, [
    selectedItems,
    sourceWarehouse,
    sourceRack,
    destinationWarehouse,
    destinationRack,
    narration,
    onTransfer,
    onClose,
    warehouses,
  ]);

  const handleClose = useCallback(() => {
    if (transferState !== 'transferring') {
      setSourceWarehouse(warehouses.length > 0 ? warehouses[0] : null);
      setSourceRack('');
      setDestinationWarehouse(warehouses.length > 0 ? warehouses[0] : null);
      setDestinationRack('');
      setNarration('');
      setSelectedItems([]);
      setSearchQuery('');
      setShowSourceWarehouseDropdown(false);
      setTransferState('transfer'); // Reset transfer state
      onClose();
    }
  }, [onClose, transferState, warehouses]);

  const handleSourceWarehouseSelect = useCallback(warehouse => {
    setSourceWarehouse(warehouse);
    setShowSourceWarehouseDropdown(false);
  }, []);

  const handleSourceRackChange = useCallback(text => {
    setSourceRack(text);
  }, []);

  const handleDestinationRackChange = useCallback(text => {
    setDestinationRack(text);
  }, []);

  const handleDestinationWarehouseSelect = useCallback(warehouse => {
    setDestinationWarehouse(warehouse);
    setShowDestinationDropdown(false);
  }, []);


  return (
    <CustomAnimatedModal
      visible={visible}
      onClose={handleClose}
      showCloseButton={false}
      scrollable={true}
      statusBarTranslucent={true}
      maxHeight={isKeyboardVisible ? '90%' : '85%'}>
      {/* Header */}
      <View style={ModalStyles.header}>
        <Text style={ModalStyles.headerTitle}>Bulk Transfer</Text>
        <TouchableOpacity
          style={ModalStyles.closeButton}
          onPress={handleClose}
          disabled={transferState === 'transferring'}>
          <Feather name="x" size={24} color="#666" />
        </TouchableOpacity>
      </View>

      <ScrollView
        ref={scrollViewRef}
        style={ModalStyles.content}
        contentContainerStyle={ModalStyles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="interactive"
        nestedScrollEnabled={true}
        scrollEnabled={!showSourceWarehouseDropdown && !showDestinationDropdown}
        bounces={true}
        scrollEventThrottle={32}>
        {/* Item Name (SKU) */}
        <View
          ref={getContainerRef(0)}
          onLayout={e => handleContainerLayout(0, e)}
          style={ModalStyles.section}>
          <View style={ModalStyles.inputGroup}>
            <Text style={ModalStyles.inputLabel}>Item Name (SKU)</Text>
            <View style={ModalStyles.searchContainer}>
              <Feather name="search" size={16} color="#8F939E" />
              <TextInput
                ref={getInputRef(0)}
                style={ModalStyles.searchInput}
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Search items"
                placeholderTextColor="#8F939E"
                autoCorrect={false}
                autoCapitalize="none"
                clearButtonMode="while-editing"
                returnKeyType="next"
                blurOnSubmit={false}
                onFocus={() => handleInputFocus(0)}
                onSubmitEditing={() => handleSubmitEditing(0, 1, 'next')}
              />
            </View>

            {/* Search Results Dropdown */}
            {searchQuery.length > 0 && (
              <View style={ModalStyles.searchResultsDropdown}>
                <ScrollView
                  style={ModalStyles.searchResultsScroll}
                  showsVerticalScrollIndicator={false}
                  scrollEventThrottle={32}
                  bounces={true}>
                  {loadingProducts ? (
                    <View style={styles.loadingContainer}>
                      <ActivityIndicator size="small" color="#16C47F" />
                    </View>
                  ) : filteredProducts.length > 0 ? (
                    filteredProducts.map(product => (
                      <TouchableOpacity
                        key={product.guid || product.id}
                        style={ModalStyles.searchResultItem}
                        activeOpacity={0.7}
                        onPress={() => handleItemSelect(product)}>
                        <View style={ModalStyles.searchResultContent}>
                          <Text style={ModalStyles.searchResultName}>
                            {product.name}
                          </Text>
                          <Text style={ModalStyles.searchResultId}>
                            {product.productId || product.id}
                          </Text>
                        </View>
                        {selectedItems.find(
                          item => (item.guid || item.id) === (product.guid || product.id),
                        ) && (
                            <Feather name="check" size={20} color="#16C47F" />
                          )}
                      </TouchableOpacity>
                    ))
                  ) : (
                    <View style={styles.emptyContainer}>
                      <Text style={styles.emptyText}>No products found</Text>
                    </View>
                  )}
                </ScrollView>
              </View>
            )}

            {/* Selected Items Chips */}
            {/* {selectedItems.length > 0 && (
                  <View style={ModalStyles.selectedItemsContainer}>
                    {selectedItems.map((item, index) => (
                      <View key={item.guid || item.id} style={ModalStyles.selectedItemChip}>
                        <Text style={ModalStyles.chipText}>{item.name}</Text>
                        <TouchableOpacity
                          style={ModalStyles.removeChipButton}
                          onPress={() => removeSelectedItem(item.guid || item.id)}>
                          <Feather name="x" size={18} color="#13A76D" />
                        </TouchableOpacity>
                      </View>
                    ))}
                  </View>
                )} */}
          </View>
        </View>

        {/* Dynamic Item Cards based on selected items */}
        {selectedItems.map((item, index) => (
          <View key={item.guid || item.id} style={ModalStyles.section}>
            {/* Product Information Card */}
            <View style={ModalStyles.itemCard}>
              <View style={ModalStyles.itemInfo}>
                <View style={ModalStyles.itemIcon}>
                  <Icons.Box height={26} width={26} />
                </View>
                <View style={ModalStyles.itemDetails}>
                  <Text style={ModalStyles.itemName}>{item.name}</Text>
                  <Text style={ModalStyles.itemId}>{item.productId || item.id}</Text>
                </View>
              </View>
              <View style={ModalStyles.itemStatus}>
                <Text
                  style={[
                    ModalStyles.statusText,
                    { color: item.statusColor || '#16C47F' },
                  ]}>
                  {item.statusIcon || '•'} {item.status || 'In Stock'}
                </Text>
                <Text style={ModalStyles.stockQty}>
                  {item.currentQuantity || '0'} {item.unit || 'Nos'}
                </Text>
              </View>
            </View>

            <View style={ModalStyles.itemSection}>
              <View style={ModalStyles.itemHeader}>
                <Text style={ModalStyles.itemTitle}>{item.name}</Text>
              </View>

              <View style={ModalStyles.detailRow}>
                <View style={ModalStyles.detailItem}>
                  <Text style={ModalStyles.detailLabel}>On-hand Qty</Text>
                  <TextInput
                    style={ModalStyles.textInput}
                    value={item.onHandQty || ''}
                    onChangeText={value => {
                      const itemId = item.guid || item.id;
                      const updatedItems = selectedItems.map(selectedItem =>
                        (selectedItem.guid || selectedItem.id) === itemId
                          ? { ...selectedItem, onHandQty: value }
                          : selectedItem,
                      );
                      setSelectedItems(updatedItems);
                    }}
                    placeholder="Enter quantity"
                    placeholderTextColor="#8F939E"
                    keyboardType="numeric"
                  />
                </View>
                <View style={ModalStyles.detailItemLast}>
                  <Text style={ModalStyles.detailLabel}>
                    Batch / Serial Picker
                  </Text>
                  <TextInput
                    style={ModalStyles.textInput}
                    value={item.batchSerial || ''}
                    onChangeText={value => {
                      const itemId = item.guid || item.id;
                      const updatedItems = selectedItems.map(selectedItem =>
                        (selectedItem.guid || selectedItem.id) === itemId
                          ? { ...selectedItem, batchSerial: value }
                          : selectedItem,
                      );
                      setSelectedItems(updatedItems);
                    }}
                    placeholder="Enter batch/serial"
                    placeholderTextColor="#8F939E"
                  />
                </View>
              </View>
              <View style={ModalStyles.detailItem}>
                <Text style={ModalStyles.detailLabel}>
                  Quantity to Transfer{' '}
                  <Text style={ModalStyles.required}>*</Text>
                </Text>
                <View style={ModalStyles.quantityContainer}>
                  <TouchableOpacity
                    style={ModalStyles.quantityButton}
                    onPress={() => {
                      const current = parseInt(item.transferQty) || 0;
                      const updatedItems = selectedItems.map(selectedItem =>
                        selectedItem.id === item.id
                          ? {
                            ...selectedItem,
                            transferQty: Math.max(
                              0,
                              current - 1,
                            ).toString(),
                          }
                          : selectedItem,
                      );
                      setSelectedItems(updatedItems);
                    }}>
                    <Feather name="minus" size={16} color="#666" />
                  </TouchableOpacity>
                  <TextInput
                    style={ModalStyles.quantityTextInput}
                    value={item.transferQty}
                    onChangeText={value => {
                      // Only allow numeric input and empty string
                      if (value === '' || /^\d+$/.test(value)) {
                        const itemId = item.guid || item.id;
                        const updatedItems = selectedItems.map(
                          selectedItem =>
                            (selectedItem.guid || selectedItem.id) === itemId
                              ? { ...selectedItem, transferQty: value }
                              : selectedItem,
                        );
                        setSelectedItems(updatedItems);
                      }
                    }}
                    placeholder="0"
                    placeholderTextColor="#8F939E"
                    keyboardType="numeric"
                  />
                  <TouchableOpacity
                    style={ModalStyles.quantityButton}
                    onPress={() => {
                      const itemId = item.guid || item.id;
                      const current = parseInt(item.transferQty) || 0;
                      const updatedItems = selectedItems.map(selectedItem =>
                        (selectedItem.guid || selectedItem.id) === itemId
                          ? {
                            ...selectedItem,
                            transferQty: (current + 1).toString(),
                          }
                          : selectedItem,
                      );
                      setSelectedItems(updatedItems);
                    }}>
                    <Feather name="plus" size={16} color="#666" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        ))}

        {/* Source Warehouse */}
        <View style={{ marginTop: 10 }}>
          <View style={ModalStyles.section}>
            <View style={ModalStyles.inputGroup}>
              <Text style={ModalStyles.inputLabel}>Source Warehouse</Text>
              <TouchableOpacity
                style={ModalStyles.dropdownField}
                onPress={() => {
                  const newValue = !showSourceWarehouseDropdown;
                  closeAllDropdowns();
                  setShowSourceWarehouseDropdown(newValue);
                }}>
                <View style={ModalStyles.dropdownContent}>
                  <Feather name="home" size={16} color="#666" />
                  <Text
                    style={[
                      ModalStyles.dropdownText,
                      { marginLeft: 10 },
                      !sourceWarehouse && ModalStyles.placeholderText
                    ]}>
                    {sourceWarehouse?.name || sourceWarehouse?.displayName || 'Select warehouse'}
                  </Text>
                </View>
                <Feather
                  name={showSourceWarehouseDropdown ? 'chevron-up' : 'chevron-down'}
                  size={16}
                  color="#666"
                />
              </TouchableOpacity>

              {/* Dropdown Options */}
              {showSourceWarehouseDropdown && (
                <View style={ModalStyles.dropdownList}>
                  <ScrollView
                    nestedScrollEnabled={true}
                    showsVerticalScrollIndicator={false}
                    bounces={false}>
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
                          onPress={() =>
                            handleSourceWarehouseSelect(warehouse)
                          }>
                          <Text style={ModalStyles.dropdownItemText}>
                            {warehouse.name || warehouse.displayName || 'Unnamed Warehouse'}
                          </Text>
                        </TouchableOpacity>
                      ))
                    ) : (
                      <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>No warehouses found</Text>
                      </View>
                    )}
                  </ScrollView>
                </View>
              )}
            </View>
          </View>
        </View>

        {/* Source Rack */}
        <View
          ref={getContainerRef(2)}
          onLayout={e => handleContainerLayout(2, e)}
          style={ModalStyles.section}>
          <View style={ModalStyles.inputGroup}>
            <Text style={ModalStyles.inputLabel}>Source Rack</Text>
            <View style={ModalStyles.searchContainer}>
              <Feather name="search" size={16} color="#8F939E" />
              <TextInput
                ref={getInputRef(2)}
                style={ModalStyles.searchInput}
                value={sourceRack}
                onChangeText={handleSourceRackChange}
                placeholder="Search Rack"
                placeholderTextColor="#8F939E"
                autoCorrect={false}
                autoCapitalize="none"
                clearButtonMode="while-editing"
                returnKeyType="next"
                blurOnSubmit={false}
                onFocus={() => handleInputFocus(2)}
                onSubmitEditing={() => handleSubmitEditing(2, 3, 'next')}
              />
            </View>
          </View>
        </View>

        {/* Destination Warehouse */}
        <View style={ModalStyles.section}>
          <View style={ModalStyles.inputGroup}>
            <Text style={ModalStyles.inputLabel}>
              Destination Warehouse{' '}
              <Text style={ModalStyles.required}>*</Text>
            </Text>
            <TouchableOpacity
              style={ModalStyles.dropdownField}
              onPress={() => {
                const newValue = !showDestinationDropdown;
                closeAllDropdowns();
                setShowDestinationDropdown(newValue);
              }}>
              <View style={ModalStyles.dropdownContent}>
                <Feather name="home" size={16} color="#666" />
                <Text
                  style={[
                    ModalStyles.dropdownText,
                    { marginLeft: 10 },
                    !destinationWarehouse && ModalStyles.placeholderText
                  ]}>
                  {destinationWarehouse?.name || destinationWarehouse?.displayName || 'Select warehouse'}
                </Text>
              </View>
              <Feather
                name={
                  showDestinationDropdown ? 'chevron-up' : 'chevron-down'
                }
                size={16}
                color="#666"
              />
            </TouchableOpacity>

            {/* Dropdown Options */}
            {showDestinationDropdown && (
              <View style={ModalStyles.dropdownList}>
                <ScrollView
                  nestedScrollEnabled={true}
                  showsVerticalScrollIndicator={false}
                  bounces={false}>
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
                        onPress={() =>
                          handleDestinationWarehouseSelect(warehouse)
                        }>
                        <Text style={ModalStyles.dropdownItemText}>
                          {warehouse.name || warehouse.displayName || 'Unnamed Warehouse'}
                        </Text>
                      </TouchableOpacity>
                    ))
                  ) : (
                    <View style={styles.emptyContainer}>
                      <Text style={styles.emptyText}>No warehouses found</Text>
                    </View>
                  )}
                </ScrollView>
              </View>
            )}
          </View>
        </View>

        {/* Destination Rack */}
        <View
          ref={getContainerRef(3)}
          onLayout={e => handleContainerLayout(3, e)}
          style={ModalStyles.section}>
          <View style={ModalStyles.inputGroup}>
            <Text style={ModalStyles.inputLabel}>Destination Rack</Text>
            <View style={ModalStyles.searchContainer}>
              <Feather name="search" size={16} color="#8F939E" />
              <TextInput
                ref={getInputRef(3)}
                style={ModalStyles.searchInput}
                value={destinationRack}
                onChangeText={handleDestinationRackChange}
                placeholder="Search Rack"
                placeholderTextColor="#8F939E"
                autoCorrect={false}
                autoCapitalize="none"
                clearButtonMode="while-editing"
                returnKeyType="next"
                blurOnSubmit={false}
                onFocus={() => handleInputFocus(3)}
                onSubmitEditing={() => handleSubmitEditing(3, 4, 'next')}
              />
            </View>
          </View>
        </View>

        {/* Narration */}
        <FormField
          containerRef={getContainerRef(4)}
          onLayout={e => handleContainerLayout(4, e)}
          label="Narration"
          style={[ModalStyles.section, ModalStyles.inputGroup]}
          inputStyle={[ModalStyles.textInput, ModalStyles.narrationInput]}
          inputRef={getInputRef(4)}
          scrollViewRef={scrollViewRef}
          value={narration}
          onChangeText={setNarration}
          placeholder="-"
          multiline
          numberOfLines={3}
          returnKeyType="done"
          onFocus={() => handleInputFocus(4)}
          onSubmitEditing={() => {
            Keyboard.dismiss();
          }}
        />
      </ScrollView>

      {/* Action Buttons */}
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
    </CustomAnimatedModal>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'column',
    gap: 8,
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
  lastDropdownOption: {
    borderBottomWidth: 0,
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
});

export default BulkTransferModal;
