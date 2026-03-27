import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Platform,
  Keyboard,
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

const StockMovementModal = ({ visible, onClose, onTransfer, item }) => {
  const { selectedGuid } = useAuth();
  const [sourceWarehouse, setSourceWarehouse] = useState(null);
  const [destinationWarehouse, setDestinationWarehouse] = useState(null);
  const [sourceRack, setSourceRack] = useState('');
  const [destinationRack, setDestinationRack] = useState('');
  const [onHandQty, setOnHandQty] = useState('');
  const [batchSerial, setBatchSerial] = useState('');
  const [transferQty, setTransferQty] = useState('');
  const [narration, setNarration] = useState('');
  const [transferState, setTransferState] = useState('transfer'); // 'transfer', 'transferring', 'transferred'
  const [errors, setErrors] = useState({});

  // Keyboard and scroll management
  const isKeyboardVisible = useKeyboardVisibility();
  const scrollViewRef = useRef(null);

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
  const [showSourceWarehouseDropdown, setShowSourceWarehouseDropdown] =
    useState(false);
  const [
    showDestinationWarehouseDropdown,
    setShowDestinationWarehouseDropdown,
  ] = useState(false);

  // Warehouse data from API
  const [warehouses, setWarehouses] = useState([]);
  const [loadingWarehouses, setLoadingWarehouses] = useState(false);

  // Dummy data for dropdowns
  const rackOptions = ['Rack A-01', 'Rack A-02', 'Rack A-03', 'Rack A-04'];

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
          // Set default warehouse if not already set
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

  const validateForm = () => {
    const newErrors = {};

    if (!destinationWarehouse || !destinationWarehouse.name) {
      newErrors.destinationWarehouse = 'Destination warehouse is required';
    }

    if (!transferQty || transferQty === '') {
      newErrors.transferQty = 'Transfer quantity is required';
    } else {
      const qty = parseInt(transferQty);
      if (isNaN(qty) || qty <= 0) {
        newErrors.transferQty = 'Please enter a valid quantity greater than 0';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleTransfer = useCallback(async () => {
    if (!validateForm()) {
      return;
    }

    setTransferState('transferring');

    // Simulate API call
    setTimeout(() => {
      setTransferState('transferred');

      const transferData = {
        item,
        sourceRack,
        destinationRack,
        transferQty,
        narration,
      };

      // Keep transferred state visible for 1.5 seconds, then transfer (parent will close with animation)
      setTimeout(() => {
        onTransfer(); // Parent will close modal, triggering animation

        // Clear all fields immediately
        setSourceWarehouse(warehouses.length > 0 ? warehouses[0] : null);
        setDestinationWarehouse(warehouses.length > 0 ? warehouses[0] : null);
        setSourceRack('');
        setDestinationRack('');
        setOnHandQty('');
        setBatchSerial('');
        setTransferQty('');
        setNarration('');
        setShowSourceRackDropdown(false);
        setShowDestinationRackDropdown(false);
        setShowSourceWarehouseDropdown(false);
        setShowDestinationWarehouseDropdown(false);
        setErrors({});

        // Clear all input refs
        clearInputRefs();

        // Reset state after a delay to allow animation to complete
        setTimeout(() => {
          setTransferState('transfer');
        }, 300);
      }, 1500);
    }, 1500);
  }, [
    item,
    sourceRack,
    destinationRack,
    transferQty,
    narration,
    onTransfer,
    onClose,
    warehouses,
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
      onClose();
    }
  }, [onClose, transferState, warehouses]);

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

  const handleWarehouseSelect = useCallback((warehouse, isSource = true) => {
    if (isSource) {
      setSourceWarehouse(warehouse);
      setShowSourceWarehouseDropdown(false);
    } else {
      setDestinationWarehouse(warehouse);
      setShowDestinationWarehouseDropdown(false);
      // Clear error when warehouse is selected
      if (errors.destinationWarehouse) {
        setErrors({ ...errors, destinationWarehouse: '' });
      }
    }
  }, [errors]);

  // Don't render modal if no item (prevents flash of empty content)
  if (!item && !visible) return null;

  return (
    <CustomAnimatedModal
      visible={visible && !!item}
      onClose={handleClose}
      showCloseButton={false}
      scrollable={true}
      maxHeight={isKeyboardVisible ? '92%' : '90%'}
      statusBarTranslucent={true}
      animationDuration={300}>
      {/* Header */}
      <View style={ModalStyles.header}>
        <Text style={ModalStyles.headerTitle}>Stock Transfer</Text>
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
        scrollEnabled={
          !showSourceRackDropdown &&
          !showDestinationRackDropdown &&
          !showSourceWarehouseDropdown &&
          !showDestinationWarehouseDropdown
        }
        bounces={true}
        scrollEventThrottle={32}>
        {/* Item Information Card */}
        {item && (
          <View style={ModalStyles.itemCard}>
            <View style={ModalStyles.itemInfo}>
              <View style={ModalStyles.itemIcon}>
                <Icons.Box height={26} width={26} />
              </View>
              <View style={ModalStyles.itemDetails}>
                <Text style={ModalStyles.itemName}>{item.name}</Text>
                {/* <Text style={ModalStyles.itemId}>{item.productId}</Text> */}
              </View>
            </View>
            <View style={ModalStyles.itemStatus}>
              {/* <Text
                    style={[ModalStyles.statusText, {color: item.statusColor}]}>
                    ▲ {item.status}
                  </Text> */}
              <Text style={ModalStyles.stockQty}>12 Stock</Text>
            </View>
          </View>
        )}

        {/* Source Details */}
        <View style={ModalStyles.section}>
          <View style={ModalStyles.inputGroup}>
            <Text style={ModalStyles.inputLabel}>Source Warehouse</Text>
            <TouchableOpacity
              style={ModalStyles.dropdownField}
              onPress={() =>
                setShowSourceWarehouseDropdown(!showSourceWarehouseDropdown)
              }>
              <View style={{ flexDirection: 'row' }}>
                <Feather
                  name="home"
                  size={16}
                  color="#666"
                  style={styles.fieldIcon}
                />
                <Text style={ModalStyles.dropdownText}>
                  {sourceWarehouse?.name || sourceWarehouse?.displayName || 'Select warehouse'}
                </Text>
              </View>
              <Feather name="chevron-down" size={16} color="#666" />
            </TouchableOpacity>

            {showSourceWarehouseDropdown && (
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
                        index === warehouses.length - 1 && ModalStyles.lastDropdownOption,
                      ]}
                      onPress={() => handleWarehouseSelect(warehouse, true)}>
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
              </View>
            )}
          </View>

          <View style={ModalStyles.inputGroup}>
            <Text style={ModalStyles.inputLabel}>Source Rack</Text>
            <TouchableOpacity
              style={ModalStyles.dropdownField}
              onPress={() =>
                setShowSourceRackDropdown(!showSourceRackDropdown)
              }>
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
                      index === rackOptions.length - 1 && ModalStyles.lastDropdownOption,
                    ]}
                    onPress={() => handleRackSelect(rack, true)}>
                    <Text style={ModalStyles.dropdownItemText}>{rack}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          <View style={ModalStyles.rowGroup}>
            <FormField
              containerRef={getContainerRef(0)}
              onLayout={e => handleContainerLayout(0, e)}
              label="On-hand Qty"
              style={[ModalStyles.inputGroup, ModalStyles.halfInputGroup]}
              inputStyle={ModalStyles.textInput}
              inputRef={getInputRef(0)}
              scrollViewRef={scrollViewRef}
              value={onHandQty}
              onChangeText={setOnHandQty}
              keyboardType={getKeyboardType('numeric')}
              placeholder="Enter quantity"
              returnKeyType="next"
              onSubmitEditing={() => handleSubmitEditing(0, 1, 'next')}
              onFocus={() => handleInputFocus(0)}
            />
            <FormField
              containerRef={getContainerRef(1)}
              onLayout={e => handleContainerLayout(1, e)}
              label="Batch / Serial Picker"
              style={[ModalStyles.inputGroup, ModalStyles.halfInputGroup]}
              inputStyle={ModalStyles.textInput}
              inputRef={getInputRef(1)}
              scrollViewRef={scrollViewRef}
              value={batchSerial}
              onChangeText={setBatchSerial}
              placeholder="Enter batch no."
              returnKeyType="next"
              onSubmitEditing={() => handleSubmitEditing(1, 2, 'next')}
              onFocus={() => handleInputFocus(1)}
            />
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
              onPress={() => {
                setShowDestinationWarehouseDropdown(
                  !showDestinationWarehouseDropdown,
                );
                if (errors.destinationWarehouse) {
                  setErrors({ ...errors, destinationWarehouse: '' });
                }
              }}>
              <View style={{ flexDirection: 'row' }}>
                <Feather
                  name="home"
                  size={16}
                  color="#666"
                  style={styles.fieldIcon}
                />
                <Text style={[
                  ModalStyles.dropdownText,
                  !destinationWarehouse && ModalStyles.placeholderText
                ]}>
                  {destinationWarehouse?.name || destinationWarehouse?.displayName || 'Select warehouse'}
                </Text>
              </View>
              <Feather name="chevron-down" size={16} color="#666" />
            </TouchableOpacity>
            {errors.destinationWarehouse && (
              <Text style={styles.errorText}>{errors.destinationWarehouse}</Text>
            )}

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
                        index === warehouses.length - 1 && ModalStyles.lastDropdownOption,
                      ]}
                      onPress={() => handleWarehouseSelect(warehouse, false)}>
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
              </View>
            )}
          </View>

          <View style={ModalStyles.rowGroup}>
            <View style={ModalStyles.halfInputGroup}>
              <Text style={ModalStyles.inputLabel}>Destination Rack</Text>
              <TouchableOpacity
                style={ModalStyles.dropdownField}
                onPress={() =>
                  setShowDestinationRackDropdown(
                    !showDestinationRackDropdown,
                  )
                }>
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
                        index === rackOptions.length - 1 && ModalStyles.lastDropdownOption,
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

            <FormField
              containerRef={getContainerRef(2)}
              onLayout={e => handleContainerLayout(2, e)}
              label="Quantity to Transfer"
              required
              error={errors.transferQty}
              style={[ModalStyles.inputGroup, ModalStyles.halfInputGroup]}
              inputStyle={ModalStyles.textInput}
              inputRef={getInputRef(2)}
              scrollViewRef={scrollViewRef}
              value={transferQty}
              onChangeText={(text) => {
                setTransferQty(text);
                if (errors.transferQty) {
                  setErrors({ ...errors, transferQty: '' });
                }
              }}
              keyboardType={getKeyboardType('numeric')}
              placeholder="Enter quantity"
              returnKeyType="next"
              onSubmitEditing={() => handleSubmitEditing(2, 3, 'next')}
              onFocus={() => handleInputFocus(2)}
            />
          </View>
        </View>

        {/* Narration */}
        <FormField
          containerRef={getContainerRef(3)}
          onLayout={e => handleContainerLayout(3, e)}
          label="Narration"
          style={[ModalStyles.section, ModalStyles.inputGroup]}
          inputStyle={[ModalStyles.textInput, ModalStyles.narrationInput]}
          inputRef={getInputRef(3)}
          scrollViewRef={scrollViewRef}
          value={narration}
          onChangeText={setNarration}
          multiline
          numberOfLines={3}
          placeholder="Enter transfer notes..."
          returnKeyType="done"
          onSubmitEditing={() => handleSubmitEditing(3, null, 'done')}
          onFocus={() => handleInputFocus(3)}
        />
      </ScrollView>

      {/* Transfer Button */}
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
    </CustomAnimatedModal>
  );
};

const styles = StyleSheet.create({
  fieldIcon: {
    marginRight: 8,
  },
  inputError: {
    borderColor: '#EF4444',
    borderWidth: 1.5,
  },
  errorText: {
    fontSize: 12,
    color: '#EF4444',
    marginTop: 4,
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
  },
  required: {
    color: '#EF4444',
    fontWeight: '400',
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

export default StockMovementModal;
