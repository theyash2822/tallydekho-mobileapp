import React, {useState, useCallback, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
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
import { CustomSwitch } from '../../../common';

const AddNewItemModal = ({visible, onClose, onSave}) => {
  const [group, setGroup] = useState('');
  const [productName, setProductName] = useState('');
  const [unitOfMeasure, setUnitOfMeasure] = useState('');
  const [taxRate, setTaxRate] = useState('');
  const [purchasePrice, setPurchasePrice] = useState('');
  const [warehousePlacement, setWarehousePlacement] = useState(
    'Deltamas Logistics Center',
  );
  const [quantity, setQuantity] = useState('');
  const [defaultSalePrice, setDefaultSalePrice] = useState('');
  const [expiryDate, setExpiryDate] = useState('01/02/2025');
  const [batchNumber, setBatchNumber] = useState('');
  const [generateBarcode, setGenerateBarcode] = useState(true);
  const [itemNameChecked, setItemNameChecked] = useState(true);
  const [skuChecked, setSkuChecked] = useState(false);
  const [salePriceChecked, setSalePriceChecked] = useState(false);
  const [saveState, setSaveState] = useState('save'); // 'save', 'saving', 'saved'

  // Dropdown states
  const [showGroupDropdown, setShowGroupDropdown] = useState(false);
  const [showUnitDropdown, setShowUnitDropdown] = useState(false);
  const [showTaxDropdown, setShowTaxDropdown] = useState(false);
  const [showWarehouseDropdown, setShowWarehouseDropdown] = useState(false);

  // Keyboard and scroll management
  const isKeyboardVisible = useKeyboardVisibility();
  const scrollViewRef = useRef(null);

  // Field names in order (only text inputs, not dropdowns)
  const fieldNames = [
    'productName',
    'purchasePrice',
    'quantity',
    'defaultSalePrice',
    'expiryDate',
    'batchNumber',
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

  // Dummy data for dropdowns
  const groupOptions = ['Electronics', 'Clothing', 'Books', 'Home & Garden'];
  const unitOptions = ['Pieces', 'Kg', 'Liters', 'Meters'];
  const taxOptions = ['0%', '5%', '18%', '28%'];
  const warehouseOptions = [
    'Deltamas Logistics Center',
    'Main Warehouse',
    'Secondary Storage',
    'Regional Hub',
  ];

  const handleSave = useCallback(async () => {
    setSaveState('saving');

    // Simulate API call
    setTimeout(() => {
      setSaveState('saved');

      const newItemData = {
        group,
        productName,
        unitOfMeasure,
        taxRate,
        purchasePrice,
        warehousePlacement,
        quantity,
        defaultSalePrice,
        expiryDate,
        batchNumber,
        generateBarcode,
        itemNameChecked,
        skuChecked,
        salePriceChecked,
      };

      // Keep saved state visible for 1.5 seconds, then save (parent will close with animation)
      setTimeout(() => {
        console.log('New item data:', newItemData);
        onSave(); // Parent will close modal, triggering animation
        
        // Clear all fields immediately
        setGroup('');
        setProductName('');
        setUnitOfMeasure('');
        setTaxRate('');
        setPurchasePrice('');
        setWarehousePlacement('Deltamas Logistics Center');
        setQuantity('');
        setDefaultSalePrice('');
        setExpiryDate('01/02/2025');
        setBatchNumber('');
        setGenerateBarcode(true);
        setItemNameChecked(true);
        setSkuChecked(false);
        setSalePriceChecked(false);
        setShowGroupDropdown(false);
        setShowUnitDropdown(false);
        setShowTaxDropdown(false);
        setShowWarehouseDropdown(false);
        
        // Clear all input refs
        clearInputRefs();
        
        // Reset state after a delay to allow animation to complete
        setTimeout(() => {
          setSaveState('save');
        }, 300);
      }, 1500);
    }, 1500);
  }, [
    group,
    productName,
    unitOfMeasure,
    taxRate,
    purchasePrice,
    warehousePlacement,
    quantity,
    defaultSalePrice,
    expiryDate,
    batchNumber,
    generateBarcode,
    itemNameChecked,
    skuChecked,
    salePriceChecked,
    onSave,
  ]);

  const handleClose = useCallback(() => {
    if (saveState !== 'saving') {
      // Reset form on close
      setGroup('');
      setProductName('');
      setUnitOfMeasure('');
      setTaxRate('');
      setPurchasePrice('');
      setWarehousePlacement('Deltamas Logistics Center');
      setQuantity('');
      setDefaultSalePrice('');
      setExpiryDate('01/02/2025');
      setBatchNumber('');
      setGenerateBarcode(true);
      setItemNameChecked(true);
      setSkuChecked(false);
      setSalePriceChecked(false);
      setSaveState('save');
      onClose();
    }
  }, [onClose, saveState]);

  return (
    <CustomAnimatedModal
      visible={visible}
      onClose={handleClose}
      showCloseButton={false}
      scrollable={true}
      statusBarTranslucent={true}
      maxHeight={isKeyboardVisible ? '90%' : '84%'}>
      {/* Header */}
      <View style={ModalStyles.header}>
        <Text style={ModalStyles.headerTitle}>Add New Item</Text>
        <TouchableOpacity
          style={ModalStyles.closeButton}
          onPress={handleClose}
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
        scrollEnabled={
          !showGroupDropdown &&
          !showUnitDropdown &&
          !showTaxDropdown &&
          !showWarehouseDropdown
        }
        bounces={true}
        scrollEventThrottle={32}>
            {/* Group */}
            <View style={ModalStyles.section}>
              <View style={ModalStyles.inputGroup}>
                <Text style={ModalStyles.inputLabel}>Group</Text>
                <TouchableOpacity
                  style={ModalStyles.dropdownField}
                  onPress={() => setShowGroupDropdown(!showGroupDropdown)}>
                  <Text
                    style={[
                      ModalStyles.dropdownText,
                      !group && ModalStyles.placeholderText,
                    ]}>
                    {group || 'Select group'}
                  </Text>
                  <Feather name="chevron-down" size={16} color="#666" />
                </TouchableOpacity>

                {showGroupDropdown && (
                  <View style={ModalStyles.dropdownList}>
                    {groupOptions.map((option, index) => (
                      <TouchableOpacity
                        key={index}
                        style={ModalStyles.dropdownItem}
                        onPress={() => {
                          setGroup(option);
                          setShowGroupDropdown(false);
                        }}>
                        <Text style={ModalStyles.dropdownItemText}>
                          {option}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>
            </View>

            {/* Product Name */}
            <FormField
              containerRef={getContainerRef(0)}
              onLayout={e => handleContainerLayout(0, e)}
              label="Product name"
              required
              style={[ModalStyles.section, ModalStyles.inputGroup]}
              inputStyle={ModalStyles.textInput}
              inputRef={getInputRef(0)}
              scrollViewRef={scrollViewRef}
              value={productName}
              onChangeText={setProductName}
              placeholder="Enter product name"
              returnKeyType="next"
              onFocus={() => handleInputFocus(0)}
              onSubmitEditing={() => handleSubmitEditing(0, 1, 'next')}
            />

            {/* Unit of Measure and Tax Rate in same row */}
            <View style={ModalStyles.section}>
              <View style={ModalStyles.rowGroup}>
                <View style={ModalStyles.halfInputGroup}>
                  <Text style={ModalStyles.inputLabel}>
                    Unit of measure <Text style={ModalStyles.required}>*</Text>
                  </Text>
                  <TouchableOpacity
                    style={ModalStyles.dropdownField}
                    onPress={() => setShowUnitDropdown(!showUnitDropdown)}>
                    <Text
                      style={[
                        ModalStyles.dropdownText,
                        !unitOfMeasure && ModalStyles.placeholderText,
                      ]}>
                      {unitOfMeasure || 'Select unit'}
                    </Text>
                    <Feather name="chevron-down" size={16} color="#666" />
                  </TouchableOpacity>

                  {showUnitDropdown && (
                    <View style={ModalStyles.dropdownList}>
                      {unitOptions.map((option, index) => (
                        <TouchableOpacity
                          key={index}
                          style={ModalStyles.dropdownItem}
                          onPress={() => {
                            setUnitOfMeasure(option);
                            setShowUnitDropdown(false);
                          }}>
                          <Text style={ModalStyles.dropdownItemText}>
                            {option}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </View>

                <View style={[ModalStyles.halfInputGroup, {marginRight: 0}]}>
                  <Text style={ModalStyles.inputLabel}>Tax rate</Text>
                  <TouchableOpacity
                    style={ModalStyles.dropdownField}
                    onPress={() => setShowTaxDropdown(!showTaxDropdown)}>
                    <Text
                      style={[
                        ModalStyles.dropdownText,
                        !taxRate && ModalStyles.placeholderText,
                      ]}>
                      {taxRate || 'Select tax rate'}
                    </Text>
                    <Feather name="chevron-down" size={16} color="#666" />
                  </TouchableOpacity>

                  {showTaxDropdown && (
                    <View style={ModalStyles.dropdownList}>
                      {taxOptions.map((option, index) => (
                        <TouchableOpacity
                          key={index}
                          style={ModalStyles.dropdownItem}
                          onPress={() => {
                            setTaxRate(option);
                            setShowTaxDropdown(false);
                          }}>
                          <Text style={ModalStyles.dropdownItemText}>
                            {option}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </View>
              </View>
            </View>

            {/* Purchase Price */}
            <View
              ref={getContainerRef(1)}
              onLayout={e => handleContainerLayout(1, e)}
              style={ModalStyles.section}>
              <View style={ModalStyles.inputGroup}>
                <Text style={ModalStyles.inputLabel}>Purchase Price</Text>
                <View style={ModalStyles.priceContainer}>
                  <FormField
                    style={{flex: 1}}
                    inputStyle={[ModalStyles.priceInput, {borderWidth: 0, borderRadius: 0}]}
                    inputRef={getInputRef(1)}
                    scrollViewRef={scrollViewRef}
                    value={purchasePrice}
                    onChangeText={setPurchasePrice}
                    placeholder="Enter price"
                    keyboardType={getKeyboardType('numeric')}
                    returnKeyType="next"
                    onFocus={() => handleInputFocus(1)}
                    onSubmitEditing={() => handleSubmitEditing(1, 2, 'next')}
                  />
                  <View style={ModalStyles.currencyLabel}>
                    <Text style={ModalStyles.currencyText}>INR</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Warehouse Placement */}
            <View style={ModalStyles.section}>
              <View style={ModalStyles.inputGroup}>
                <Text style={ModalStyles.inputLabel}>Warehouse Placement</Text>
                <TouchableOpacity
                  style={ModalStyles.dropdownField}
                  onPress={() =>
                    setShowWarehouseDropdown(!showWarehouseDropdown)
                  }>
                  <Text style={ModalStyles.dropdownText}>
                    {warehousePlacement}
                  </Text>
                  <Feather name="chevron-down" size={16} color="#666" />
                </TouchableOpacity>

                {showWarehouseDropdown && (
                  <View style={ModalStyles.dropdownList}>
                    {warehouseOptions.map((option, index) => (
                      <TouchableOpacity
                        key={index}
                        style={ModalStyles.dropdownItem}
                        onPress={() => {
                          setWarehousePlacement(option);
                          setShowWarehouseDropdown(false);
                        }}>
                        <Text style={ModalStyles.dropdownItemText}>
                          {option}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>
            </View>

            {/* Quantity and Default Sale Price in same row */}
            <View
              ref={getContainerRef(2)}
              onLayout={e => handleContainerLayout(2, e)}
              style={ModalStyles.section}>
              <View style={ModalStyles.rowGroup}>
                <FormField
                  label="Quantity"
                  style={[ModalStyles.inputGroup, ModalStyles.halfInputGroup]}
                  inputStyle={ModalStyles.textInput}
                  inputRef={getInputRef(2)}
                  scrollViewRef={scrollViewRef}
                  value={quantity}
                  onChangeText={setQuantity}
                  placeholder="Enter quantity"
                  keyboardType={getKeyboardType('numeric')}
                  returnKeyType="next"
                  onFocus={() => handleInputFocus(2)}
                  onSubmitEditing={() => handleSubmitEditing(2, 3, 'next')}
                />
                <View style={[ModalStyles.halfInputGroup, {marginRight: 0}]}>
                  <View style={ModalStyles.inputGroup}>
                    <Text style={ModalStyles.inputLabel}>Default Sale Price</Text>
                    <View style={ModalStyles.priceContainer}>
                      <FormField
                        style={{flex: 1}}
                        inputStyle={[ModalStyles.priceInput, {borderWidth: 0, borderRadius: 0}]}
                        inputRef={getInputRef(3)}
                        scrollViewRef={scrollViewRef}
                        value={defaultSalePrice}
                        onChangeText={setDefaultSalePrice}
                        placeholder="Enter sale price"
                        keyboardType={getKeyboardType('numeric')}
                        returnKeyType="next"
                        onFocus={() => handleInputFocus(2)}
                        onSubmitEditing={() => handleSubmitEditing(3, 4, 'next')}
                      />
                      <View style={ModalStyles.currencyLabel}>
                        <Text style={ModalStyles.currencyText}>INR</Text>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            </View>

            {/* Expiry Date and Batch Number in same row */}
            <View
              ref={getContainerRef(3)}
              onLayout={e => handleContainerLayout(3, e)}
              style={ModalStyles.section}>
              <View style={ModalStyles.rowGroup}>
                <View style={ModalStyles.halfInputGroup}>
                  <Text style={ModalStyles.inputLabel}>Expiry Date</Text>
                  <TextInput
                    ref={getInputRef(4)}
                    style={ModalStyles.textInput}
                    value={expiryDate}
                    onChangeText={setExpiryDate}
                    placeholder="DD/MM/YYYY"
                    placeholderTextColor="#8F939E"
                    returnKeyType="next"
                    blurOnSubmit={false}
                    onFocus={() => handleInputFocus(3)}
                    onSubmitEditing={() => handleSubmitEditing(4, 5, 'next')}
                  />
                </View>
                <FormField
                  label="Batch Number"
                  style={[ModalStyles.inputGroup, ModalStyles.halfInputGroup, {marginRight: 0}]}
                  inputStyle={ModalStyles.textInput}
                  inputRef={getInputRef(5)}
                  scrollViewRef={scrollViewRef}
                  value={batchNumber}
                  onChangeText={setBatchNumber}
                  placeholder="Enter batch number"
                  returnKeyType="done"
                  onFocus={() => handleInputFocus(3)}
                  onSubmitEditing={() => {
                    Keyboard.dismiss();
                  }}
                />
              </View>
            </View>

            {/* Generate Barcode Toggle */}
            <View style={ModalStyles.section}>
              <View style={ModalStyles.inputGroup}>
                <View style={styles.barcodeRow}>
                  <Text style={[ModalStyles.inputLabel, styles.barcodeText]}>
                    Generate Barcode
                  </Text>
                  <CustomSwitch
                    value={generateBarcode}
                    onValueChange={setGenerateBarcode}
                  />
                </View>
              </View>
            </View>

            {/* Checkboxes in same row with simple gaps */}
            <View style={ModalStyles.section}>
              <View style={ModalStyles.inputGroup}>
                <View style={ModalStyles.checkboxRowGroup}>
                  <TouchableOpacity
                    style={ModalStyles.checkboxRow}
                    onPress={() => setItemNameChecked(!itemNameChecked)}>
                    <View
                      style={[
                        ModalStyles.checkbox,
                        itemNameChecked && ModalStyles.checkboxChecked,
                      ]}>
                      {itemNameChecked && (
                        <Feather name="check" size={16} color="#FFF" />
                      )}
                    </View>
                    <Text style={ModalStyles.checkboxLabel}>Item Name</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={ModalStyles.checkboxRow}
                    onPress={() => setSkuChecked(!skuChecked)}>
                    <View
                      style={[
                        ModalStyles.checkbox,
                        skuChecked && ModalStyles.checkboxChecked,
                      ]}>
                      {skuChecked && (
                        <Feather name="check" size={16} color="#FFF" />
                      )}
                    </View>
                    <Text style={ModalStyles.checkboxLabel}>SKU</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={ModalStyles.checkboxRow}
                    onPress={() => setSalePriceChecked(!salePriceChecked)}>
                    <View
                      style={[
                        ModalStyles.checkbox,
                        salePriceChecked && ModalStyles.checkboxChecked,
                      ]}>
                      {salePriceChecked && (
                        <Feather name="check" size={16} color="#FFF" />
                      )}
                    </View>
                    <Text style={ModalStyles.checkboxLabel}>Sale Price</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
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
              <Text style={styles.saveButtonText}>Saved</Text>
            </>
          ) : (
            <Text style={styles.saveButtonText}>Save</Text>
          )}
        </TouchableOpacity>
      </View>
    </CustomAnimatedModal>
  );
};

const styles = StyleSheet.create({
  barcodeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  barcodeText: {
    marginBottom: 0,
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
    backgroundColor: '#059669',
  },
  savedButton: {
    backgroundColor: '#059669',
  },
  saveButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AddNewItemModal;
