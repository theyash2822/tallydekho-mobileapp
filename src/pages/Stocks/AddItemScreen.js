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
  KeyboardAvoidingView,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Feather from 'react-native-vector-icons/Feather';
import Icon from 'react-native-vector-icons/Feather';
import Colors from '../../utils/Colors';
import {Header, CustomSwitch} from '../../components/common';
import FormField from '../../components/common/FormField';
import ModalStyles from '../../utils/ModalStyles';
import useKeyboardVisibility from '../../hooks/useKeyboardVisibility';
import {formatDateObjectDMY} from '../../utils/dateUtils';
import {useInputNavigation} from '../../components/stocksManagement/StockOverview/TotalStock/Components/inputNavigation';
import CustomCalendarnew from '../../components/orders/Calender';

const AddItemScreen = () => {
  const navigation = useNavigation();
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
  const [expiryDate, setExpiryDate] = useState(new Date());
  const [batchNumber, setBatchNumber] = useState('');
  const [generateBarcode, setGenerateBarcode] = useState(true);
  const [itemNameChecked, setItemNameChecked] = useState(true);
  const [skuChecked, setSkuChecked] = useState(false);
  const [salePriceChecked, setSalePriceChecked] = useState(false);
  const [saveState, setSaveState] = useState('save'); // 'save', 'saving', 'saved'

  // Error states for validation
  const [errors, setErrors] = useState({});

  // Calendar state
  const [showExpiryCalendar, setShowExpiryCalendar] = useState(false);

  // Dropdown states
  const [showGroupDropdown, setShowGroupDropdown] = useState(false);
  const [showUnitDropdown, setShowUnitDropdown] = useState(false);
  const [showTaxDropdown, setShowTaxDropdown] = useState(false);
  const [showWarehouseDropdown, setShowWarehouseDropdown] = useState(false);

  // Keyboard and scroll management
  const isKeyboardVisible = useKeyboardVisibility();
  const scrollViewRef = useRef(null);

  // Field names in order (only text inputs, not dropdowns, excluding expiryDate which uses calendar)
  const fieldNames = [
    'productName',
    'purchasePrice',
    'quantity',
    'defaultSalePrice',
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

  // Handle expiry date selection
  const handleExpiryDateSelected = useCallback((date) => {
    setExpiryDate(date);
    setShowExpiryCalendar(false);
  }, []);

  const handleSave = useCallback(async () => {
    // Clear previous errors
    const newErrors = {};

    // Validation for mandatory fields
    if (!productName.trim()) {
      newErrors.productName = 'Product name is required';
    }

    if (!unitOfMeasure.trim()) {
      newErrors.unitOfMeasure = 'Unit of measure is required';
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
        expiryDate: formatDateObjectDMY(expiryDate),
        batchNumber,
        generateBarcode,
        itemNameChecked,
        skuChecked,
        salePriceChecked,
      };

      // Keep saved state visible for 1.5 seconds, then navigate back
      setTimeout(() => {
        navigation.goBack();
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
    navigation,
  ]);

  return (
    <View style={styles.container}>
      <Header
        title="Add New Item"
        leftIcon="chevron-left"
        onLeftPress={() => navigation.goBack()}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}>
        <ScrollView
          ref={scrollViewRef}
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
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
                      style={[
                        ModalStyles.dropdownItem,
                        index === groupOptions.length - 1 &&
                          ModalStyles.lastDropdownOption,
                      ]}
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
          <View
            ref={getContainerRef(0)}
            onLayout={e => handleContainerLayout(0, e)}
            style={ModalStyles.section}>
            <FormField
              label="Product name"
              required
              error={errors.productName}
              inputRef={getInputRef(0)}
              style={ModalStyles.inputGroup}
              inputStyle={ModalStyles.textInput}
              scrollViewRef={scrollViewRef}
              value={productName}
              onChangeText={text => {
                setProductName(text);
                if (errors.productName) {
                  setErrors(prev => ({...prev, productName: ''}));
                }
              }}
              placeholder="Enter product name"
              returnKeyType="next"
              onFocus={() => handleInputFocus(0)}
              onSubmitEditing={() => handleSubmitEditing(0, 1, 'next')}
            />
          </View>

          {/* Unit of Measure and Tax Rate in same row */}
          <View style={ModalStyles.section}>
            <View style={ModalStyles.rowGroup}>
              <View style={ModalStyles.halfInputGroup}>
                <Text style={ModalStyles.inputLabel}>
                  Unit of measure <Text style={ModalStyles.required}>*</Text>
                </Text>
                <TouchableOpacity
                  style={[
                    ModalStyles.dropdownField,
                    errors.unitOfMeasure && styles.inputError,
                  ]}
                  onPress={() => {
                    setShowUnitDropdown(!showUnitDropdown);
                    if (errors.unitOfMeasure) {
                      setErrors(prev => ({...prev, unitOfMeasure: ''}));
                    }
                  }}>
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
                        style={[
                          ModalStyles.dropdownItem,
                          index === unitOptions.length - 1 &&
                            ModalStyles.lastDropdownOption,
                        ]}
                        onPress={() => {
                          setUnitOfMeasure(option);
                          setShowUnitDropdown(false);
                          if (errors.unitOfMeasure) {
                            setErrors(prev => ({...prev, unitOfMeasure: ''}));
                          }
                        }}>
                        <Text style={ModalStyles.dropdownItemText}>
                          {option}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
                {errors.unitOfMeasure && (
                  <Text style={styles.errorText}>{errors.unitOfMeasure}</Text>
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
                        style={[
                          ModalStyles.dropdownItem,
                          index === taxOptions.length - 1 &&
                            ModalStyles.lastDropdownOption,
                        ]}
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
                <TextInput
                  ref={getInputRef(1)}
                  style={ModalStyles.priceInput}
                  value={purchasePrice}
                  onChangeText={setPurchasePrice}
                  placeholder="Enter price"
                  placeholderTextColor="#8F939E"
                  keyboardType={getKeyboardType('numeric')}
                  returnKeyType="next"
                  blurOnSubmit={false}
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
                      style={[
                        ModalStyles.dropdownItem,
                        index === warehouseOptions.length - 1 &&
                          ModalStyles.lastDropdownOption,
                      ]}
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
                inputRef={getInputRef(2)}
                style={ModalStyles.halfInputGroup}
                inputStyle={ModalStyles.textInput}
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
                <Text style={ModalStyles.inputLabel}>Default Sale Price</Text>
                <View style={ModalStyles.priceContainer}>
                  <TextInput
                    ref={getInputRef(3)}
                    style={ModalStyles.priceInput}
                    value={defaultSalePrice}
                    onChangeText={setDefaultSalePrice}
                    placeholder="Enter sale price"
                    placeholderTextColor="#8F939E"
                    keyboardType={getKeyboardType('numeric')}
                    returnKeyType="next"
                    blurOnSubmit={false}
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

          {/* Expiry Date and Batch Number in same row */}
          <View
            ref={getContainerRef(3)}
            onLayout={e => handleContainerLayout(3, e)}
            style={ModalStyles.section}>
            <View style={ModalStyles.rowGroup}>
              <View style={ModalStyles.halfInputGroup}>
                <Text style={ModalStyles.inputLabel}>Expiry Date</Text>
                <TouchableOpacity
                  style={ModalStyles.dropdownField}
                  onPress={() => setShowExpiryCalendar(true)}>
                  <View style={{flexDirection: 'row', alignItems: 'center', flex: 1}}>
                    <Feather
                      name="calendar"
                      size={16}
                      color="#666"
                      style={{marginRight: 8}}
                    />
                    <Text
                      style={[
                        ModalStyles.dropdownText,
                        !expiryDate && ModalStyles.placeholderText,
                      ]}>
                      {expiryDate ? formatDateObjectDMY(expiryDate) : 'DD/MM/YYYY'}
                    </Text>
                  </View>
                  <Feather name="chevron-down" size={16} color="#666" />
                </TouchableOpacity>
              </View>
              <FormField
                label="Batch Number"
                inputRef={getInputRef(4)}
                containerRef={getContainerRef(4)}
                onLayout={e => handleContainerLayout(4, e)}
                style={[ModalStyles.halfInputGroup, {marginRight: 0}]}
                inputStyle={ModalStyles.textInput}
                scrollViewRef={scrollViewRef}
                value={batchNumber}
                onChangeText={setBatchNumber}
                placeholder="Enter batch number"
                returnKeyType="done"
                onFocus={() => handleInputFocus(4)}
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
        {!isKeyboardVisible && (
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
        )}
      </KeyboardAvoidingView>

      {/* Custom Calendar for Expiry Date */}
      {showExpiryCalendar && (
        <CustomCalendarnew
          visible={showExpiryCalendar}
          initialDate={expiryDate}
          onSelectDate={handleExpiryDateSelected}
          onClose={() => setShowExpiryCalendar(false)}
          allowFutureDates={true}
        />
      )}
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
  barcodeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  barcodeText: {
    marginBottom: 0,
  },
  inputError: {
    borderColor: '#EF4444',
    borderWidth: 1,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
});

export default AddItemScreen;
