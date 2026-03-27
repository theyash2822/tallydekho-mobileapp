import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
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

const EditStockModal = ({ visible, onClose, product, onSave }) => {
  const { selectedGuid } = useAuth();
  const [adjustmentQuantity, setAdjustmentQuantity] = useState('0');
  const [adjustmentReason, setAdjustmentReason] = useState('Damage');
  const [referenceNote, setReferenceNote] = useState('-');
  const [showReasonDropdown, setShowReasonDropdown] = useState(false);
  const [warehouse, setWarehouse] = useState(null);
  const [showWarehouseDropdown, setShowWarehouseDropdown] = useState(false);
  const [binRack, setBinRack] = useState('');
  const [batchSerial, setBatchSerial] = useState('');
  const [currentQuantity, setCurrentQuantity] = useState('0');
  const [saveState, setSaveState] = useState('save'); // 'save', 'saving', 'saved'
  const [errors, setErrors] = useState({});

  // Keyboard and scroll management
  const isKeyboardVisible = useKeyboardVisibility();
  const scrollViewRef = useRef(null);

  // Field names in order (text inputs only, dropdowns excluded)
  const fieldNames = [
    'binRack',
    'batchSerial',
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

  // Warehouse data from API
  const [warehouses, setWarehouses] = useState([]);
  const [loadingWarehouses, setLoadingWarehouses] = useState(false);

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
          if (list.length > 0 && !warehouse) {
            setWarehouse(list[0]);
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

  useEffect(() => {
    if (product) {

      // Use currentQuantity from API data
      const qty = product.currentQuantity ? String(product.currentQuantity) : '0';
      setCurrentQuantity(qty);

      // Populate warehouse if available - match by name
      if (product.warehouse && warehouses.length > 0) {
        const matchedWarehouse = warehouses.find(
          w => (w.name || w.displayName) === product.warehouse
        );
        if (matchedWarehouse) {
          setWarehouse(matchedWarehouse);
        }
      }

      // Populate bin/rack if available
      if (product.binRack) {
        setBinRack(product.binRack);
      }

      // Populate batch/serial if available
      if (product.batchSerial) {
        setBatchSerial(product.batchSerial);
      }
    }
  }, [product, warehouses]);

  const handleQuantityInputChange = text => {
    // Allow negative numbers for stock reductions
    const numericValue = text.replace(/[^0-9-]/g, '');
    setAdjustmentQuantity(numericValue);
    // Clear error when user types
    if (errors.adjustmentQuantity) {
      setErrors({ ...errors, adjustmentQuantity: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!adjustmentQuantity || adjustmentQuantity === '' || adjustmentQuantity === '-') {
      newErrors.adjustmentQuantity = 'Adjustment quantity is required';
    } else {
      const quantity = parseInt(adjustmentQuantity);
      if (isNaN(quantity)) {
        newErrors.adjustmentQuantity = 'Please enter a valid number';
      }
    }

    if (!adjustmentReason) {
      newErrors.adjustmentReason = 'Adjustment reason is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    const quantity = parseInt(adjustmentQuantity);

    setSaveState('saving');

    // Simulate API call
    setTimeout(() => {
      setSaveState('saved');

      const saveData = {
        productId: product?.id,
        adjustmentQuantity: quantity,
        adjustmentReason,
        referenceNote: referenceNote === '-' ? '' : referenceNote,
        warehouse,
        binRack,
        batchSerial,
        currentQuantity,
      };

      // Keep saved state visible for 1.5 seconds, then save (parent will close with animation)
      setTimeout(() => {
        onSave(saveData); // Parent will close modal, triggering animation

        // Clear all fields immediately
        setAdjustmentQuantity('0');
        setAdjustmentReason('Damage');
        setReferenceNote('-');
        setWarehouse('Deltamas Logistics Center');
        setBinRack('');
        setBatchSerial('');
        setCurrentQuantity('0');
        setShowReasonDropdown(false);
        setErrors({});

        // Clear all input refs
        clearInputRefs();

        // Reset state after a delay to allow animation to complete
        setTimeout(() => {
          setSaveState('save');
        }, 300);
      }, 1500);
    }, 1500);
  };

  const handleClose = useCallback(() => {
    if (saveState !== 'saving') {
      // Reset form on close
      setAdjustmentQuantity('0');
      setAdjustmentReason('Damage');
      setReferenceNote('-');
      setWarehouse(warehouses.length > 0 ? warehouses[0] : null);
      setBinRack('');
      setBatchSerial('');
      setCurrentQuantity('0');
      setSaveState('save');
      setShowWarehouseDropdown(false);
      setErrors({});
      onClose();
    }
  }, [onClose, saveState]);

  // Don't render modal if no product (prevents flash of empty content)
  if (!product && !visible) return null;

  return (
    <CustomAnimatedModal
      visible={visible && !!product}
      onClose={handleClose}
      showCloseButton={false}
      scrollable={true}
      maxHeight={isKeyboardVisible ? '92%' : '84%'}
      statusBarTranslucent={true}
      animationDuration={300}>
      {/* Header */}
      <View style={ModalStyles.header}>
        <Text style={ModalStyles.headerTitle}>Edit Stock</Text>
        <TouchableOpacity
          onPress={handleClose}
          style={ModalStyles.closeButton}
          disabled={saveState === 'saving'}>
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
        scrollEnabled={!showReasonDropdown && !showWarehouseDropdown}
        bounces={true}
        scrollEventThrottle={32}>
        {/* Product Information */}
        {product && (
          <View style={ModalStyles.itemCard}>
            <View style={ModalStyles.itemInfo}>
              <View style={ModalStyles.itemIcon}>
                <Icons.Box height={26} width={26} />
              </View>
              <View style={ModalStyles.itemDetails}>
                <Text style={ModalStyles.itemName}>{product.name}</Text>
                <Text style={ModalStyles.itemId}>
                  {product.productId || product.id}
                </Text>
              </View>
            </View>
            <View style={ModalStyles.itemStatus}>
              <Text
                style={[
                  ModalStyles.statusText,
                  { color: product.statusColor || '#EF4444' },
                ]}>
                {product.statusIcon || '•'} {product.status || 'Low stock'}
              </Text>
              <Text style={ModalStyles.stockQty}>
                {product.currentQuantity || '0'} {product.unit || 'Nos'}
              </Text>
            </View>
          </View>
        )}

        {/* Warehouse Information */}
        <View style={ModalStyles.section}>
          <View style={ModalStyles.inputGroup}>
            <Text style={ModalStyles.inputLabel}>Warehouse</Text>
            <TouchableOpacity
              style={ModalStyles.dropdownField}
              onPress={() => setShowWarehouseDropdown(!showWarehouseDropdown)}
              activeOpacity={0.7}>
              <Text style={[
                ModalStyles.dropdownText,
                !warehouse && ModalStyles.placeholderText
              ]}>
                {warehouse?.name || warehouse?.displayName || 'Select warehouse'}
              </Text>
              <Feather
                name={showWarehouseDropdown ? 'chevron-up' : 'chevron-down'}
                size={16}
                color="#666"
              />
            </TouchableOpacity>

            {showWarehouseDropdown && (
              <View style={ModalStyles.dropdownList}>
                {loadingWarehouses ? (
                  <View style={styles.loadingContainer}>
                    <ActivityIndicator size="small" color="#16C47F" />
                  </View>
                ) : warehouses.length > 0 ? (
                  warehouses.map((wh, index) => (
                    <TouchableOpacity
                      key={wh.guid || wh.id || index}
                      style={[
                        ModalStyles.dropdownItem,
                        index === warehouses.length - 1 && ModalStyles.lastDropdownOption,
                      ]}
                      onPress={() => {
                        setWarehouse(wh);
                        setShowWarehouseDropdown(false);
                      }}>
                      <View style={styles.warehouseDropdownContent}>
                        <Text style={[ModalStyles.dropdownItemText, {fontWeight: '400'}]}>
                          {wh.name || wh.displayName || 'Unnamed Warehouse'}
                        </Text>
                        {(wh.location || wh.address || wh.city) && (
                          <Text style={styles.warehouseLocation}>
                            {wh.location || wh.address || wh.city}
                          </Text>
                        )}
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

        {/* Bin/Rack and Batch/Serial */}
        <View style={ModalStyles.section}>
          <View style={ModalStyles.rowGroup}>
            <FormField
              containerRef={getContainerRef(1)}
              onLayout={e => handleContainerLayout(1, e)}
              label="Bin / Rack"
              style={ModalStyles.halfInputGroup}
              inputStyle={ModalStyles.textInput}
              inputRef={getInputRef(1)}
              scrollViewRef={scrollViewRef}
              value={binRack}
              onChangeText={setBinRack}
              placeholder="Enter bin/rack"
              returnKeyType="next"
              onSubmitEditing={() => handleSubmitEditing(1, 2, 'next')}
              onFocus={() => handleInputFocus(1)}
            />
            <FormField
              containerRef={getContainerRef(2)}
              onLayout={e => handleContainerLayout(2, e)}
              label="Batch / Serial Picker"
              style={ModalStyles.halfInputGroup}
              inputStyle={ModalStyles.textInput}
              inputRef={getInputRef(2)}
              scrollViewRef={scrollViewRef}
              value={batchSerial}
              onChangeText={setBatchSerial}
              placeholder="Enter batch/serial"
              returnKeyType="next"
              onSubmitEditing={() => handleSubmitEditing(2, 3, 'next')}
              onFocus={() => handleInputFocus(2)}
            />
          </View>
        </View>

        {/* Current On-hand Quantity */}
        <View style={ModalStyles.section}>
          <View
            style={ModalStyles.inputGroup}
            ref={getContainerRef(3)}
            onLayout={e => handleContainerLayout(3, e)}>
            <Text style={ModalStyles.inputLabel}>Current On-hand Qty</Text>
            <TextInput
              ref={getInputRef(3)}
              style={[ModalStyles.textInput, styles.readOnlyInput]}
              value={currentQuantity}
              placeholder="Current quantity"
              placeholderTextColor="#8F939E"
              editable={false}
            />
          </View>
        </View>

        {/* Adjustment Details */}
        <View style={[ModalStyles.section, {overflow: 'visible', zIndex: 10}]}>
          {/* Adjustment Quantity and Reason in same row */}
          <View style={[ModalStyles.rowGroup, {overflow: 'visible', zIndex: 10}]}>
            <FormField
              containerRef={getContainerRef(2)}
              onLayout={e => handleContainerLayout(2, e)}
              label="Adjustment Quantity"
              required
              error={errors.adjustmentQuantity}
              style={ModalStyles.halfInputGroup}
              inputStyle={ModalStyles.textInput}
              inputRef={getInputRef(2)}
              scrollViewRef={scrollViewRef}
              keyboardType={getKeyboardType('numeric')}
              value={adjustmentQuantity}
              onChangeText={handleQuantityInputChange}
              placeholder="Enter quantity"
              returnKeyType="next"
              onSubmitEditing={() => handleSubmitEditing(2, 3, 'next')}
              onFocus={() => handleInputFocus(2)}
            />

            <View style={[ModalStyles.halfInputGroup, {overflow: 'visible', zIndex: 10}]}>
              <Text style={ModalStyles.inputLabel}>
                Adjustment Reason <Text style={styles.required}>*</Text>
              </Text>
              <TouchableOpacity
                style={[
                  ModalStyles.dropdownField,
                  errors.adjustmentReason && styles.inputError
                ]}
                onPress={() => {
                  setShowReasonDropdown(!showReasonDropdown);
                  if (errors.adjustmentReason) {
                    setErrors({ ...errors, adjustmentReason: '' });
                  }
                }}
                activeOpacity={0.7}>
                <Text style={ModalStyles.dropdownText}>
                  {adjustmentReason}
                </Text>
                <Feather
                  name={showReasonDropdown ? 'chevron-up' : 'chevron-down'}
                  size={16}
                  color="#666"
                />
              </TouchableOpacity>
              {errors.adjustmentReason && (
                <Text style={styles.errorText}>{errors.adjustmentReason}</Text>
              )}

              {showReasonDropdown && (
                <View style={ModalStyles.dropdownList}>
                  {reasonOptions.map((reason, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[
                        ModalStyles.dropdownItem,
                        index === reasonOptions.length - 1 && ModalStyles.lastDropdownOption,
                      ]}
                      onPress={() => {
                        setAdjustmentReason(reason);
                        setShowReasonDropdown(false);
                        if (errors.adjustmentReason) {
                          setErrors({ ...errors, adjustmentReason: '' });
                        }
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
       
        <FormField
          containerRef={getContainerRef(3)}
          onLayout={e => handleContainerLayout(3, e)}
          label="Reference / Note"
          style={[ModalStyles.section, ModalStyles.inputGroup]}
          inputStyle={[ModalStyles.textInput, ModalStyles.narrationInput]}
          inputRef={getInputRef(3)}
          scrollViewRef={scrollViewRef}
          value={referenceNote}
          onChangeText={setReferenceNote}
          placeholder="Enter reference or note"
          multiline
          numberOfLines={2}
          returnKeyType="done"
          onSubmitEditing={() => handleSubmitEditing(3, null, 'done')}
          onFocus={() => handleInputFocus(3)}
        />
       
        {showReasonDropdown && <View style={{height: 0}} />}
      </ScrollView>

      {/* Save Button - hide when dropdowns are open */}
      <View style={[styles.buttonContainer, showReasonDropdown && {opacity: 0}]} pointerEvents={showReasonDropdown ? 'none' : 'auto'}>
        <TouchableOpacity
          style={[
            styles.saveButton,
            saveState === 'saving' && styles.savingButton,
            saveState === 'saved' && styles.savedButton,
          ]}
          onPress={handleSave}
          disabled={saveState === 'saving'}>
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
    </CustomAnimatedModal>
  );
};

const styles = StyleSheet.create({
  required: {
    color: '#EF4444',
    fontWeight: '400',
  },
  readOnlyInput: {
    backgroundColor: '#F9FAFB',
    color: '#6B7280',
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
  warehouseDropdownContent: {
    flex: 1,
  },
  warehouseLocation: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  buttonContainer: {
    flexDirection: 'column',
    gap: 8,
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

export default EditStockModal;
