import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  FlatList,
  Keyboard,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import Colors from '../../utils/Colors';
import CustomSwitch from '../common/CustomSwitch';
import CustomAnimatedModal from '../common/CustomAnimatedModal';
import InvoicesModalStyles from '../../utils/InvoicesModalStyles';
import { Icons } from '../../utils/Icons';
import { useInputNavigation } from '../../components/stocksManagement/StockOverview/TotalStock/Components/inputNavigation';

const AddProductModal = ({
  visible,
  onClose,
  header = 'Add product',
  showBarcodeAbove = true,
  showBarcodeBelow = false,
  onSave,
  label1 = 'Warehouse',
  editingItem = null,
  editingIndex = null,
}) => {
  const navigation = useNavigation();
  // Keyboard state
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  
  // Input navigation setup
  const scrollViewRef = useRef(null);
  // Field names in order (text inputs only, excluding dropdowns)
  const fieldNames = [
    'warehouse',
    'productName',
    'qty',
    'unitPrice',
    'discount',
    'tax',
  ];
  
  const {
    getInputRef,
    getContainerRef,
    handleInputFocus,
    handleContainerLayout,
    getKeyboardType,
    handleSubmitEditing,
  } = useInputNavigation(fieldNames.length, scrollViewRef);

  const [qty, setQty] = useState('');
  const [unit, setUnit] = useState('KG');
  const [unitPrice, setUnitPrice] = useState('');
  const [currency, setCurrency] = useState('INR');
  const [isFlatDiscount, setIsFlatDiscount] = useState(true);
  const [taxAmount, setTaxAmount] = useState('');
  const [isFlatTax, setIsFlatTax] = useState(true);

  const [selectedWarehouse, setSelectedWarehouse] = useState('');

  const [showUnitDropdown, setShowUnitDropdown] = useState(false);
  const [showCurrencyDropdown, setShowCurrencyDropdown] = useState(false);
  const units = ['KG', 'Litre', 'Box'];
  const currencies = ['INR', 'USD', 'EUR'];
  const [discount, setDiscount] = useState('');

  // Keyboard event listeners
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setIsKeyboardVisible(true);
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setIsKeyboardVisible(false);
      },
    );

    return () => {
      keyboardDidHideListener?.remove();
      keyboardDidShowListener?.remove();
    };
  }, []);

  const [warehouseDropdownVisible, setWarehouseDropdownVisible] =
    useState(false);
  const [warehouseList, setWarehouseList] = useState([
    'Deltamas Logistics Center',
    'Alpha Distribution Hub',
    'MegaCorp Warehouse',
    'QuickShip Depot',
    'City Central Storage',
  ]); // Replace with your actual data

  const filteredWarehouses = warehouseList.filter(warehouse =>
    warehouse.toLowerCase().includes(selectedWarehouse.toLowerCase()),
  );

  const [productSearch, setProductSearch] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [showProductDropdown, setShowProductDropdown] = useState(false);

  const productList = [
    'Apple iPhone 14 Pro',
    'Samsung Galaxy S23',
    'Sony WH-1000XM5 Headphones',
    'Dell XPS 13 Laptop',
    'Apple MacBook Air M2',
    'Canon EOS R10 Camera',
    'Nike Air Max 270',
    'Adidas Ultraboost',
    'Logitech MX Master 3 Mouse',
    'HP Envy 6055e Printer',
    'Amazon Echo Dot (5th Gen)',
    'Lenovo ThinkPad X1 Carbon',
  ];

  const resetFields = () => {
    setProductSearch('');
    setSelectedWarehouse('');
    setQty('');
    setUnit('KG');
    setDiscount('');
    setTaxAmount('');
    setUnitPrice('');
    setCurrency('INR');
    setShowUnitDropdown(false);
    setWarehouseDropdownVisible(false);
    setShowCurrencyDropdown(false);
    setShowProductDropdown(false);
    setFilteredProducts([]);
    setIsFlatDiscount(true);
    setIsFlatTax(true);
  };

  // Handler functions for dropdown selections (like AddDispatchModal)
  const selectWarehouse = warehouse => {
    setSelectedWarehouse(warehouse);
    setWarehouseDropdownVisible(false);
    // Move to next input after selection - keep keyboard open
    const nextRef = getInputRef(1);
    if (nextRef?.current) {
      // Small delay ensures dropdown closes smoothly while keeping keyboard open
      setTimeout(() => {
        nextRef.current?.focus();
      }, 10);
    }
  };

  const selectProduct = product => {
    setProductSearch(product);
    setShowProductDropdown(false);
    // Move to next input after selection - keep keyboard open
    const nextRef = getInputRef(2);
    if (nextRef?.current) {
      // Small delay ensures dropdown closes smoothly while keeping keyboard open
      setTimeout(() => {
        nextRef.current?.focus();
      }, 10);
    }
  };

  // Listen for scanned barcode when returning from scanner
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // Check route params for scanned barcode
      const state = navigation.getState();
      const currentRoute = state?.routes[state.index];
      if (currentRoute?.params?.scannedBarcode) {
        const scannedCode = currentRoute.params.scannedBarcode;
        setProductSearch(scannedCode);
        // Clear the param
        navigation.setParams({ scannedBarcode: undefined });
      }
    });
    return unsubscribe;
  }, [navigation, visible]);

  // Populate fields when editing
  useEffect(() => {
    if (visible && editingItem) {
      // Set product name
      setProductSearch(editingItem.productName || '');

      // Set logistics center
      setSelectedWarehouse(editingItem.logisticsCenter || '');

      // Parse qty and unit from "10KG" format
      const qtyString = editingItem.qty || '';
      const unitMatch = qtyString.match(/(KG|Litre|Box)$/i);
      if (unitMatch) {
        const extractedUnit = unitMatch[0].toUpperCase();
        const extractedQty = qtyString.replace(/(KG|Litre|Box)$/i, '').trim();
        setQty(extractedQty);
        setUnit(extractedUnit === 'LITRE' ? 'Litre' : extractedUnit);
      } else {
        setQty(qtyString);
        setUnit('KG');
      }

      // Parse discount (can be "10%" or "10" or flat amount)
      const discountStr = (editingItem.discount || '').toString();
      if (discountStr.includes('%')) {
        setIsFlatDiscount(false);
        setDiscount(discountStr.replace('%', '').trim());
      } else if (discountStr) {
        setIsFlatDiscount(true);
        setDiscount(discountStr);
      } else {
        setDiscount('');
        setIsFlatDiscount(true);
      }

      // Parse tax (can be "10%" or "10" or flat amount)
      const taxStr = (editingItem.tax || '').toString();
      if (taxStr.includes('%')) {
        setIsFlatTax(false);
        setTaxAmount(taxStr.replace('%', '').trim());
      } else if (taxStr) {
        setIsFlatTax(true);
        setTaxAmount(taxStr);
      } else {
        setTaxAmount('');
        setIsFlatTax(true);
      }

      // Set unit price
      setUnitPrice(editingItem.unitPrice || '');
    } else if (!visible) {
      // Reset when modal closes
      resetFields();
    }
  }, [editingItem, visible]);

  // const calculateSubtotal = () => {
  //   const qtyNum = parseFloat(qty) || 0;
  //   const priceNum = parseFloat(unitPrice) || 0;
  //   const discountNum = parseFloat(discount) || 0;
  //   const taxNum = parseFloat(taxAmount) || 0;

  //   let subtotalValue = qtyNum * priceNum;

  //   if (!isFlatDiscount) {
  //     subtotalValue -= (subtotalValue * discountNum) / 100;
  //   } else {
  //     subtotalValue -= discountNum;
  //   }

  //   subtotalValue += taxNum;

  //   return `₹${subtotalValue.toFixed(2)}`;
  // };

  const calculateSubtotal = () => {
    const qtyNum = parseFloat(qty) || 0;
    const priceNum = parseFloat(unitPrice) || 0;
    const discountNum = parseFloat(discount) || 0;
    const taxNum = parseFloat(taxAmount) || 0;

    const baseAmount = qtyNum * priceNum;

    // Calculate discount based on discount toggle (flat or percentage)
    let discountAmount = 0;
    if (isFlatDiscount) {
      // Flat amount for discount
      discountAmount = discountNum;
    } else {
      // Percentage for discount - apply on baseAmount
      discountAmount = (discountNum / 100) * baseAmount;
    }

    // Calculate tax based on tax toggle (flat or percentage)
    // Tax is calculated on baseAmount (qty * unitPrice), not on discounted amount
    let taxAmountCalculated = 0;
    if (isFlatTax) {
      // Flat amount for tax
      taxAmountCalculated = taxNum;
    } else {
      // Percentage for tax - apply on baseAmount (matching Summary calculation)
      taxAmountCalculated = (taxNum / 100) * baseAmount;
    }

    // Final subtotal: baseAmount - discount + tax
    const subtotalValue = baseAmount - discountAmount + taxAmountCalculated;

    return `₹${subtotalValue.toFixed(2)}`;
  };

  const renderDropdown = (
    items,
    selectedValue,
    onSelect,
    showDropdown,
    setShowDropdown,
  ) => (
    <TouchableOpacity
      style={styles.modernDropdownTrigger}
      onPress={() => setShowDropdown(!showDropdown)}
      activeOpacity={0.7}>
      <Text style={styles.modernDropdownText}>{selectedValue}</Text>
      <Icon
        name="chevron-down-outline"
        size={16}
        color="#6B7280"
        style={[styles.chevronIcon, showDropdown && styles.chevronRotated]}
      />
    </TouchableOpacity>
  );

  const renderInputWithDropdown = (
    label,
    placeholder,
    value,
    onChangeText,
    dropdownItems,
    selectedDropdown,
    onDropdownSelect,
    showDropdown,
    setShowDropdown,
    inputIndex,
    nextIndex,
    isLast = false,
  ) => (
    <View style={InvoicesModalStyles.smallInput}>
      <Text style={InvoicesModalStyles.label}>{label}</Text>
      <View 
        style={styles.qtyUnitBox}
        ref={getContainerRef(inputIndex)}
        onLayout={e => handleContainerLayout(inputIndex, e)}>
        <TextInput
          ref={getInputRef(inputIndex)}
          style={styles.qtyInput}
          placeholder={placeholder}
          placeholderTextColor="#8F939E"
          keyboardType={getKeyboardType('numeric')}
          value={value}
          onChangeText={onChangeText}
          returnKeyType={isLast ? 'done' : 'next'}
          blurOnSubmit={false}
          onSubmitEditing={() => {
            if (isLast) {
              Keyboard.dismiss();
            } else {
              const nextRef = getInputRef(nextIndex);
              if (nextRef?.current) {
                setTimeout(() => {
                  nextRef.current?.focus();
                }, 10);
              }
            }
          }}
          onFocus={() => handleInputFocus(inputIndex)}
        />
        <View style={styles.verticalDivider} />
        {renderDropdown(
          dropdownItems,
          selectedDropdown,
          onDropdownSelect,
          showDropdown,
          setShowDropdown,
        )}
      </View>
      {showDropdown && (
        <View style={styles.modernDropdownMenu}>
          {dropdownItems.map((item, index) => (
            <TouchableOpacity
              key={item}
              style={[
                styles.modernDropdownItem,
                index !== dropdownItems.length - 1 &&
                styles.modernDropdownItemBorder,
              ]}
              onPress={() => {
                onDropdownSelect(item);
                setShowDropdown(false);
              }}
              activeOpacity={0.6}>
              <Text
                style={[
                  styles.modernDropdownItemText,
                  selectedDropdown === item &&
                  styles.modernDropdownItemTextSelected,
                ]}>
                {item}
              </Text>
              {selectedDropdown === item && (
                <Icon name="checkmark" size={16} color="E5E7EB" />
              )}
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );

  return (
    <CustomAnimatedModal
      visible={visible}
      onClose={onClose}
      title={header}
      scrollable={false}
      maxHeight="90%">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
        style={{}}>
        <Text style={InvoicesModalStyles.subtext}>
          Fill The Form For Information
        </Text>

        <ScrollView
          ref={scrollViewRef}
          style={[InvoicesModalStyles.content, { marginTop: 4 }]}
          contentContainerStyle={[
            InvoicesModalStyles.scrollContent,
            isKeyboardVisible && styles.keyboardPadding,
          ]}
          showsVerticalScrollIndicator={false}
          keyboardDismissMode="interactive"
          keyboardShouldPersistTaps="handled"
          nestedScrollEnabled={true}>
          {showBarcodeAbove && (
            <TouchableOpacity
              style={styles.barcodeBtn}
              onPress={() => {
                navigation.navigate('scanner', {
                  onScanComplete: scannedCode => {
                    setProductSearch(scannedCode);
                  },
                });
              }}>
              <Text style={styles.scanText}>Scan Barcode</Text>
              <Icons.ScanBarcode height={20} width={20}/>
            </TouchableOpacity>
          )}

          <Text style={InvoicesModalStyles.label}>{label1}</Text>

          <View 
            style={InvoicesModalStyles.inputWithIcon}
            ref={getContainerRef(0)}
            onLayout={e => handleContainerLayout(0, e)}>
            <Icon
              name="home-outline"
              size={20}
              style={InvoicesModalStyles.iconLeft}
            />
            <TextInput
              ref={getInputRef(0)}
              value={selectedWarehouse}
              placeholder="Search Warehouse"
              style={[
                InvoicesModalStyles.input1,
                { paddingLeft: 20 },
              ]}
              placeholderTextColor="#8F939E"
              returnKeyType="next"
              blurOnSubmit={false}
              onSubmitEditing={() => {
                // Use minimal delay to prevent keyboard closing/reopening
                const nextRef = getInputRef(1);
                if (nextRef?.current) {
                  setTimeout(() => {
                    nextRef.current?.focus();
                  }, 10);
                }
              }}
              onChangeText={text => {
                setSelectedWarehouse(text);
                if (text.length >= 2) {
                  setWarehouseDropdownVisible(true);
                } else {
                  setWarehouseDropdownVisible(false);
                }
              }}
              onFocus={() => handleInputFocus(0)}
            />
            <Icon
              name="search-outline"
              size={20}
              style={InvoicesModalStyles.iconRight}
            />
          </View>

          {warehouseDropdownVisible && selectedWarehouse.length >= 2 && filteredWarehouses.length > 0 && (
            <View style={InvoicesModalStyles.dropdownList}>
              {filteredWarehouses.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => selectWarehouse(item)}
                  style={InvoicesModalStyles.dropdownItem}
                  activeOpacity={0.6}>
                  <Text style={InvoicesModalStyles.dropdownText}>
                    {item}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          <View>
            <Text style={InvoicesModalStyles.label}>Product Name</Text>
            <View 
              style={InvoicesModalStyles.inputWithIcon}
              ref={getContainerRef(1)}
              onLayout={e => handleContainerLayout(1, e)}>
              <Icon
                name="search-outline"
                size={20}
                style={InvoicesModalStyles.iconLeft}
              />
              <TextInput
                ref={getInputRef(1)}
                value={productSearch}
                placeholder="Search Product"
                placeholderTextColor="#8F939E"
                style={[InvoicesModalStyles.input1, { paddingLeft: 20 }]}
                returnKeyType="next"
                blurOnSubmit={false}
                onSubmitEditing={() => {
                  // Use minimal delay to prevent keyboard closing/reopening
                  const nextRef = getInputRef(2);
                  if (nextRef?.current) {
                    setTimeout(() => {
                      nextRef.current?.focus();
                    }, 10);
                  }
                }}
                onChangeText={text => {
                  setProductSearch(text);
                  if (text.length >= 2) {
                    const filtered = productList.filter(item =>
                      item.toLowerCase().includes(text.toLowerCase()),
                    );
                    setFilteredProducts(filtered);
                    setShowProductDropdown(true);
                  } else {
                    setShowProductDropdown(false);
                  }
                }}
                onFocus={() => handleInputFocus(1)}
              />
            </View>

            {/* Search Suggestions Dropdown */}
            {showProductDropdown && filteredProducts.length > 0 && (
              <View style={InvoicesModalStyles.dropdownList}>
                {filteredProducts.map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => selectProduct(item)}
                    style={InvoicesModalStyles.dropdownItem}
                    activeOpacity={0.6}>
                    <Text style={InvoicesModalStyles.dropdownText}>
                      {item}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          <View style={InvoicesModalStyles.row}>
            {renderInputWithDropdown(
              'QTY. & Unit',
              '199',
              qty,
              setQty,
              units,
              unit,
              setUnit,
              showUnitDropdown,
              setShowUnitDropdown,
              2, // inputIndex for qty
              3, // nextIndex for unitPrice
            )}

            {renderInputWithDropdown(
              'Unit Price',
              '₹5,000',
              unitPrice,
              setUnitPrice,
              currencies,
              currency,
              setCurrency,
              showCurrencyDropdown,
              setShowCurrencyDropdown,
              3, // inputIndex for unitPrice
              4, // nextIndex for discount
            )}
          </View>

          <Text style={InvoicesModalStyles.label}>Discounts</Text>
          <View 
            style={styles.discountRow}
            ref={getContainerRef(4)}
            onLayout={e => handleContainerLayout(4, e)}>
            <TextInput
              ref={getInputRef(4)}
              style={[InvoicesModalStyles.input2, { flex: 1 }]}
              keyboardType={getKeyboardType('numeric')}
              placeholder="20"
              placeholderTextColor="#8F939E"
              value={discount}
              returnKeyType="next"
              blurOnSubmit={false}
              onSubmitEditing={() => {
                handleSubmitEditing(4, 5, 'next');
              }}
              onFocus={() => handleInputFocus(4)}
              onChangeText={setDiscount}
            />
            <View style={styles.discountDivider} />
            <Text style={styles.percentText}>%</Text>
            <CustomSwitch
              value={isFlatDiscount}
              onValueChange={setIsFlatDiscount}
            />
            <Text style={styles.discountLabel}>
              {isFlatDiscount ? 'Flat' : 'Percentage'}
            </Text>
          </View>

          <Text style={InvoicesModalStyles.label}>Tax</Text>
          <View 
            style={styles.discountRow}
            ref={getContainerRef(5)}
            onLayout={e => handleContainerLayout(5, e)}>
            <TextInput
              ref={getInputRef(5)}
              style={[InvoicesModalStyles.input2, { flex: 1 }]}
              keyboardType={getKeyboardType('numeric')}
              placeholder="20"
              placeholderTextColor="#8F939E"
              value={taxAmount}
              returnKeyType="done"
              blurOnSubmit={false}
              onSubmitEditing={() => {
                Keyboard.dismiss();
              }}
              onFocus={() => handleInputFocus(5)}
              onChangeText={setTaxAmount}
            />
            <View style={styles.discountDivider} />
            <Text style={styles.percentText}>%</Text>
            <CustomSwitch
              value={isFlatTax}
              onValueChange={setIsFlatTax}
            />
            <Text style={styles.discountLabel}>
              {isFlatTax ? 'Flat' : 'Percentage'}
            </Text>
          </View>

          <View style={styles.subtotalRow}>
            <Text style={InvoicesModalStyles.label2}>Subtotal</Text>
            <Text style={styles.subtotalValue}>{calculateSubtotal()}</Text>
          </View>

          {showBarcodeBelow && (
            <TouchableOpacity
              style={styles.barcodeBtn}
              onPress={() => {
                navigation.navigate('scanner', {
                  onScanComplete: (scannedCode) => {
                    setProductSearch(scannedCode);
                  },
                });
              }}>
              <Text style={styles.scanText}>Scan Barcode</Text>
              <Icon name="scan" size={20} />
            </TouchableOpacity>
          )}
          <View style={styles.bottomSpacer} />
        </ScrollView>

          <TouchableOpacity
          style={[
            styles.primaryButton, 
            Platform.OS === 'ios' && { marginBottom: 16 },
            isKeyboardVisible && styles.buttonWithKeyboard,
          ]}
            activeOpacity={0.8}
            onPress={() => {
            // Dismiss keyboard first to prevent double-click issue
            Keyboard.dismiss();
            
              const productData = {
                productName: productSearch,
                logisticsCenter: selectedWarehouse,
                qty: qty + unit,
                discount: isFlatDiscount ? `${discount}` : `${discount}%`,
                tax: isFlatTax ? taxAmount : `${taxAmount}%`,
                unitPrice: unitPrice,
              };

              onSave(productData, editingIndex); // ✅ Call the parent with editing index
              resetFields();
              onClose(); // ✅ Close the modal
            }}>
            <Text style={styles.primaryButtonText}>
              {editingItem ? 'Update' : 'Save'}
            </Text>
          </TouchableOpacity>
      </KeyboardAvoidingView>
    </CustomAnimatedModal>
  );
};

const styles = StyleSheet.create({
  // Common styles moved to InvoicesModalStyles.js
  // Only unique ProductModal-specific styles remain below

  // Unique styles for ProductModal only
  iconRight: {
    position: 'absolute',
    right: 12,
    color: '#888',
  },
  qtyUnitBox: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  qtyInput: {
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 10,
    fontSize: 14,
    color: '#333',
  },
  verticalDivider: {
    width: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 8,
  },
  modernDropdownTrigger: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
  },
  modernDropdownText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
    marginRight: 8,
  },
  chevronIcon: {
    transform: [{ rotate: '0deg' }],
  },
  chevronRotated: {
    transform: [{ rotate: '180deg' }],
  },
  primaryButton: {
    backgroundColor: '#07624C',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 4
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  modernDropdownMenu: {
    position: 'absolute',
    top: 85,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    zIndex: 1000,
    overflow: 'hidden',
  },
  modernDropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
  },
  modernDropdownItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  modernDropdownItemText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  modernDropdownItemTextSelected: {
    color: '374151',
    fontWeight: '600',
  },
  barcodeBtn: {
    backgroundColor: '#E8EFF6',
    padding: 12,
    marginVertical: 12,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  scanText: {
    fontWeight: '600',
    fontSize: 14,
    color: '#000',
    marginRight: 10,
  },
  discountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  discountDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#ccc',
    marginHorizontal: 8,
  },
  percentText: {
    color: '#8F939E',
    marginHorizontal: 4,
  },
  discountLabel: {
    marginLeft: 6,
    color: '#8F939E',
  },
  subtotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  subtotalValue: {
    color: '#0A8F52',
    fontWeight: 'bold',
    fontSize: 14,
    padding: 14,
  },
  keyboardPadding: {
    paddingBottom: Platform.OS === 'ios' ? 180 : 1,
  },
  bottomSpacer: {
    height: 1,
  },
  buttonWithKeyboard: {
    marginBottom: Platform.OS === 'ios' ? 4 : 4,
  },
});

export default AddProductModal;

//Little bit optimized and different

// import React, {useState} from 'react';
// import {
//   Modal,
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   ScrollView,
//   KeyboardAvoidingView,
//   Platform,
// } from 'react-native';
// import Icon from 'react-native-vector-icons/Ionicons';
// import Colors from '../../utils/Colors';
// import CustomSwitch from '../common/CustomSwitch';
// import CustomBottomButton from '../common/BottomButton';

// const AddProductModal = ({
//   visible,
//   onClose,
//   header = 'Add product',
//   showBarcodeAbove = true,
//   showBarcodeBelow = false,
//   onSave,
// }) => {
//   // Product and Warehouse States
//   const [productSearchQuery, setProductSearchQuery] = useState('');
//   const [selectedWarehouse, setSelectedWarehouse] = useState('');
//   const [isWarehouseDropdownOpen, setIsWarehouseDropdownOpen] = useState(false);
//   const [filteredProducts, setFilteredProducts] = useState([]);
//   const [isProductDropdownOpen, setIsProductDropdownOpen] = useState(false);

//   // Quantity and Pricing States
//   const [quantity, setQuantity] = useState('');
//   const [selectedUnit, setSelectedUnit] = useState('KG');
//   const [unitPrice, setUnitPrice] = useState('');
//   const [selectedCurrency, setSelectedCurrency] = useState('INR');

//   // Discount and Tax States
//   const [discountValue, setDiscountValue] = useState('');
//   const [selectedDiscountType, setSelectedDiscountType] = useState('Discount');
//   const [taxValue, setTaxValue] = useState('');
//   const [selectedTaxType, setSelectedTaxType] = useState('GST');
//   const [isFlatDiscount, setIsFlatDiscount] = useState(true);

//   // Dropdown Visibility States
//   const [isUnitDropdownOpen, setIsUnitDropdownOpen] = useState(false);
//   const [isCurrencyDropdownOpen, setIsCurrencyDropdownOpen] = useState(false);
//   const [isDiscountDropdownOpen, setIsDiscountDropdownOpen] = useState(false);
//   const [isTaxDropdownOpen, setIsTaxDropdownOpen] = useState(false);

//   // Static Data
//   const warehouseOptions = [
//     'Deltamas Logistics Center',
//     'Alpha Distribution Hub',
//     'MegaCorp Warehouse',
//     'QuickShip Depot',
//     'City Central Storage',
//   ];

//   const productOptions = [
//     'Apple iPhone 14 Pro',
//     'Samsung Galaxy S23',
//     'Sony WH-1000XM5 Headphones',
//     'Dell XPS 13 Laptop',
//     'Apple MacBook Air M2',
//     'Canon EOS R10 Camera',
//     'Nike Air Max 270',
//     'Adidas Ultraboost',
//     'Logitech MX Master 3 Mouse',
//     'HP Envy 6055e Printer',
//     'Amazon Echo Dot (5th Gen)',
//     'Lenovo ThinkPad X1 Carbon',
//   ];

//   const unitOptions = ['KG', 'Litre', 'Box'];
//   const currencyOptions = ['INR', 'USD', 'EUR'];
//   const discountOptions = ['Flat', 'Percent'];
//   const taxOptions = ['GST', 'CGST', 'IGST' , 'VAT'];

//   // Computed Values
//   const filteredWarehouseOptions = warehouseOptions.filter(warehouse =>
//     warehouse.toLowerCase().includes(selectedWarehouse.toLowerCase()),
//   );

//   // const [subtotal, setSubtotal] = useState('125,000');
//   // const [searchQuery, setSearchQuery] = useState('');

//   const resetAllFields = () => {
//     setProductSearchQuery('');
//     setSelectedWarehouse('');
//     setQuantity('');
//     setSelectedUnit('KG');
//     setDiscountValue('');
//     setTaxValue('');
//     setUnitPrice('');
//     setSelectedCurrency('INR');
//     setSelectedDiscountType('Flat');
//     setSelectedTaxType('GST');
//     setIsUnitDropdownOpen(false);
//     setIsCurrencyDropdownOpen(false);
//     setIsProductDropdownOpen(false);
//     setIsWarehouseDropdownOpen(false);
//     setIsDiscountDropdownOpen(false);
//     setIsTaxDropdownOpen(false);
//     setFilteredProducts([]);
//     setIsFlatDiscount(false);
//   };

//   // const calculateSubtotal = () => {
//   //   const qtyNum = parseFloat(quantity) || 0;
//   //   const priceNum = parseFloat(unitPrice) || 0;
//   //   const discountNum = parseFloat(discountValue) || 0;
//   //   const taxNum = parseFloat(taxValue) || 0;

//   //   let subtotalValue = qtyNum * priceNum;

//   //   if (!isFlatDiscount) {
//   //     subtotalValue -= (subtotalValue * discountNum) / 100;
//   //   } else {
//   //     subtotalValue -= discountNum;
//   //   }

//   //   subtotalValue += taxNum;

//   //   return `₹${subtotalValue.toFixed(2)}`;
//   // };

//   const calculateSubtotal = () => {
//     const quantityNum = parseFloat(quantity) || 0;
//     const priceNum = parseFloat(unitPrice) || 0;
//     const taxNum = parseFloat(taxValue) || 0;

//     const discountStr = (discountValue ?? '').toString().trim();
//     const discountPercent = parseFloat(discountStr) || 0;

//     let subtotal = quantityNum * priceNum;

//     // Always treat discount as percentage
//     const discountAmount = (discountPercent / 100) * subtotal;
//     subtotal -= discountAmount;

//     // Add flat tax
//     subtotal += taxNum;

//     return `₹${subtotal.toFixed(2)}`;
//   };

//   const handleProductSearch = searchText => {
//     setProductSearchQuery(searchText);

//     if (searchText.length >= 2) {
//       const filtered = productOptions.filter(product =>
//         product.toLowerCase().includes(searchText.toLowerCase()),
//       );
//       setFilteredProducts(filtered);
//       setIsProductDropdownOpen(true);
//     } else {
//       setIsProductDropdownOpen(false);
//     }
//   };

//   const handleWarehouseSearch = searchText => {
//     setSelectedWarehouse(searchText);
//     setIsWarehouseDropdownOpen(true);
//   };

//   const selectProduct = product => {
//     setProductSearchQuery(product);
//     setIsProductDropdownOpen(false);
//   };

//   const selectWarehouse = warehouse => {
//     setSelectedWarehouse(warehouse);
//     setIsWarehouseDropdownOpen(false);
//   };

//   const renderDropdownTrigger = (
//     items,
//     selectedValue,
//     onSelect,
//     isDropdownOpen,
//     setDropdownOpen,
//   ) => (
//     <TouchableOpacity
//       style={styles.modernDropdownTrigger}
//       onPress={() => setDropdownOpen(!isDropdownOpen)}
//       activeOpacity={0.7}>
//       <Text style={styles.modernDropdownText}>{selectedValue}</Text>
//       <Icon
//         name="chevron-down-outline"
//         size={16}
//         color="#6B7280"
//         style={[styles.chevronIcon, isDropdownOpen && styles.chevronRotated]}
//       />
//     </TouchableOpacity>
//   );

//   const renderInputWithDropdown = (
//     label,
//     placeholder,
//     value,
//     onChangeText,
//     dropdownItems,
//     selectedDropdownValue,
//     onDropdownSelect,
//     isDropdownOpen,
//     setDropdownOpen,
//     dropdownType = 'typeA',
//   ) => (
//     <View style={InvoicesModalStyles.smallInput}>
//       <Text style={InvoicesModalStyles.label}>{label}</Text>
//       <View style={styles.qtyUnitBox}>
//         <TextInput
//           style={styles.qtyInput}
//           placeholder={placeholder}
//           placeholderTextColor="#8F939E"
//           keyboardType="numeric"
//           value={value}
//           onChangeText={onChangeText}
//         />
//         <View style={styles.verticalDivider} />
//         {renderDropdownTrigger(
//           dropdownItems,
//           selectedDropdownValue,
//           onDropdownSelect,
//           isDropdownOpen,
//           setDropdownOpen,
//         )}
//       </View>
//       {isDropdownOpen && (
//         <View
//           style={[
//             styles.modernDropdownMenu,
//             dropdownType === 'typeB' && styles.modernDropdownMenuTypeB,
//           ]}>
//           {dropdownItems.map((item, index) => (
//             <TouchableOpacity
//               key={item}
//               style={[
//                 styles.modernDropdownItem,
//                 index !== dropdownItems.length - 1 &&
//                   styles.modernDropdownItemBorder,
//               ]}
//               onPress={() => {
//                 onDropdownSelect(item);
//                 setDropdownOpen(false);
//               }}
//               activeOpacity={0.6}>
//               <Text
//                 style={[
//                   styles.modernDropdownItemText,
//                   selectedDropdownValue === item &&
//                     styles.modernDropdownItemTextSelected,
//                 ]}>
//                 {item}
//               </Text>
//               {selectedDropdownValue === item && (
//                 <Icon name="checkmark" size={16} color="E5E7EB" />
//               )}
//             </TouchableOpacity>
//           ))}
//         </View>
//       )}
//     </View>
//   );

//   return (
//     <Modal visible={visible} transparent animationType="slide">
//       <KeyboardAvoidingView
//         behavior={Platform.OS === 'ios' ? 'padding' : undefined}
//         style={styles.backdrop}>
//         <View style={styles.modal}>
//           <ScrollView showsVerticalScrollIndicator={false}>
//             <View
//               style={{flexDirection: 'row', justifyContent: 'space-between'}}>
//               <Text style={styles.header}>{header}</Text>
//               <TouchableOpacity onPress={onClose}>
//                 <Icon name="close" color={'#6F7C97'} size={26} />
//               </TouchableOpacity>
//             </View>
//             <Text style={InvoicesModalStyles.subtext}>Fill The Form For Information</Text>

//             {showBarcodeAbove && (
//               <TouchableOpacity style={styles.barcodeBtn}>
//                 <Text style={styles.scanText}>Scan Barcode</Text>
//                 <Icon name="scan" size={20} />
//               </TouchableOpacity>
//             )}

//             {/* Warehouse Selection */}
//             <Text style={InvoicesModalStyles.label}>Warehouse</Text>
//             <TouchableOpacity
//               onPress={() => setIsWarehouseDropdownOpen(prev => !prev)}
//               activeOpacity={0.8}>
//               <View style={InvoicesModalStyles.inputWithIcon}>
//                 <Icon name="home-outline" size={20} style={styles.iconLeft} />
//                 <TextInput
//                   value={selectedWarehouse}
//                   placeholder="Select Warehouse"
//                   style={[InvoicesModalStyles.input1, {paddingLeft: 24, paddingRight: 30}]}
//                   placeholderTextColor="#8F939E"
//                   editable={true}
//                   pointerEvents="auto"
//                   onChangeText={handleWarehouseSearch}
//                 />
//                 <Icon name="chevron-down" size={20} style={styles.iconRight} />
//               </View>
//             </TouchableOpacity>

//             {isWarehouseDropdownOpen && (
//               <View style={styles.dropdownList}>
//                 {filteredWarehouseOptions.map((warehouse, index) => (
//                   <TouchableOpacity
//                     key={index}
//                     onPress={() => selectWarehouse(warehouse)}
//                     style={styles.dropdownItem}>
//                     <Text style={styles.dropdownText}>{warehouse}</Text>
//                   </TouchableOpacity>
//                 ))}
//               </View>
//             )}

//             {/* Product Search */}
//             <View>
//               <Text style={InvoicesModalStyles.label}>Product Name</Text>
//               <View style={InvoicesModalStyles.inputWithIcon}>
//                 <Icon name="search" size={20} style={styles.iconLeft} />
//                 <TextInput
//                   value={productSearchQuery}
//                   placeholder="Search Product"
//                   placeholderTextColor="#8F939E"
//                   style={[InvoicesModalStyles.input1, {paddingLeft: 20}]}
//                   onChangeText={handleProductSearch}
//                 />
//               </View>

//               {isProductDropdownOpen && filteredProducts.length > 0 && (
//                 <View style={styles.dropdownList}>
//                   {filteredProducts.map((product, index) => (
//                     <TouchableOpacity
//                       key={index}
//                       onPress={() => selectProduct(product)}
//                       style={styles.dropdownItem}>
//                       <Text style={styles.dropdownText}>{product}</Text>
//                     </TouchableOpacity>
//                   ))}
//                 </View>
//               )}
//             </View>

//             {/* Input Fields Row */}
//             <View style={InvoicesModalInvoicesModalStyles.row}>
//               {renderInputWithDropdown(
//                 'QTY. & Unit',
//                 '199',
//                 quantity,
//                 setQuantity,
//                 unitOptions,
//                 selectedUnit,
//                 setSelectedUnit,
//                 isUnitDropdownOpen,
//                 setIsUnitDropdownOpen,
//               )}

//               {renderInputWithDropdown(
//                 'Unit Price',
//                 '₹5,000',
//                 unitPrice,
//                 setUnitPrice,
//                 currencyOptions,
//                 selectedCurrency,
//                 setSelectedCurrency,
//                 isCurrencyDropdownOpen,
//                 setIsCurrencyDropdownOpen,
//               )}
//             </View>

//             <View style={InvoicesModalInvoicesModalStyles.row}>
//               {renderInputWithDropdown(
//                 'Amount',
//                 '10',
//                 discountValue,
//                 setDiscountValue,
//                 discountOptions,
//                 selectedDiscountType,
//                 setSelectedDiscountType,
//                 isDiscountDropdownOpen,
//                 setIsDiscountDropdownOpen,
//                 'typeB',
//               )}

//               {renderInputWithDropdown(
//                 'Tax',
//                 '₹2,000',
//                 taxValue,
//                 setTaxValue,
//                 taxOptions,
//                 selectedTaxType,
//                 setSelectedTaxType,
//                 isTaxDropdownOpen,
//                 setIsTaxDropdownOpen,
//                 'typeB',
//               )}
//             </View>

//             {/* Subtotal Display */}
//             <View style={styles.subtotalRow}>
//               <Text style={InvoicesModalStyles.label2}>Subtotal</Text>
//               <Text style={styles.subtotalValue}>{calculateSubtotal()}</Text>
//             </View>

//             {showBarcodeBelow && (
//               <TouchableOpacity style={styles.barcodeBtn}>
//                 <Text style={styles.scanText}>Scan Barcode</Text>
//                 <Icon name="scan" size={20} />
//               </TouchableOpacity>
//             )}
//           </ScrollView>
//         </View>
//       </KeyboardAvoidingView>

//       <CustomBottomButton
//         onPress={() => {
//           const productData = {
//             productName: productSearchQuery,
//             logisticsCenter: selectedWarehouse,
//             qty: quantity + selectedUnit,
//             discount: isFlatDiscount ? `${discountValue}` : `${discountValue}%`,
//             tax: taxValue, // dynamic flat amount
//             unitPrice: unitPrice,
//           };

//           onSave(productData); // ✅ Call the parent
//           resetAllFields();
//           onClose(); // ✅ Close the modal
//         }}
//         buttonText="Save"
//         buttonColor="#07624C"
//         textColor="#FFFFFF"
//       />
//     </Modal>
//   );
// };

// const styles = StyleSheet.create({
//   backdrop: {
//     flex: 1,
//     backgroundColor: 'rgba(0,0,0,0.3)',
//     justifyContent: 'flex-end',
//   },
//   modal: {
//     backgroundColor: '#F4F5FA',
//     paddingHorizontal: 12,
//     paddingTop: 16,
//     paddingBottom: 10,
//     borderTopLeftRadius: 20,
//     borderTopRightRadius: 20,
//     maxHeight: '80%',

//   },
//   header: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginBottom: 4,
//   },
//   subtext: {
//     color: 'gray',
//     marginBottom: 16,
//     fontSize: 13,
//   },
//   label: {
//     marginTop: 12,
//     marginBottom: 6,
//     fontSize: 13,
//     fontWeight: '400',
//     color: '#8F939E',
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: Colors.border,
//     borderRadius: 10,
//     paddingHorizontal: 12,
//     paddingVertical: 14,
//     fontSize: 14,
//     backgroundColor: '#fff',
//     color: '#000',
//   },
//   input1: {
//     flex: 1,
//     fontSize: 14,
//     color: '#000',
//   },
//   iconRight: {
//     position: 'absolute',
//     right: 12,
//     color: '#888',
//   },
//   row: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     justifyContent: 'space-between',
//   },
//   smallInput: {
//     flex: 1,
//     minWidth: '45%',
//     marginHorizontal: 4,
//     marginVertical: 2,
//   },
//   qtyUnitBox: {
//     flexDirection: 'row',
//     backgroundColor: '#fff',
//     borderRadius: 12,
//     borderWidth: 1,
//     borderColor: Colors.border,
//     overflow: 'hidden',
//   },
//   qtyInput: {
//     flex: 1,
//     paddingHorizontal: 12,
//     paddingVertical: 10,
//     fontSize: 14,
//     color: '#333',
//   },
//   verticalDivider: {
//     width: 1,
//     backgroundColor: '#E5E7EB',
//     marginVertical: 8,
//   },
//   // Modern Dropdown Styles
//   modernDropdownTrigger: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingHorizontal: 12,
//     paddingVertical: 12,
//     backgroundColor: '#FFFFFF',
//   },
//   modernDropdownText: {
//     fontSize: 14,
//     color: '#374151',
//     fontWeight: '500',
//     marginRight: 8,
//   },
//   chevronIcon: {
//     transform: [{rotate: '0deg'}],
//   },
//   chevronRotated: {
//     transform: [{rotate: '180deg'}],
//   },
//   modernDropdownMenu: {
//     position: 'absolute',
//     top: 85,
//     left: 0,
//     right: 0,
//     backgroundColor: '#FFFFFF',
//     borderRadius: 12,
//     borderWidth: 1,
//     borderColor: Colors.border,
//     shadowColor: '#000',
//     shadowOffset: {
//       width: 0,
//       height: 4,
//     },
//     shadowOpacity: 0.1,
//     shadowRadius: 12,
//     elevation: 8,
//     zIndex: 1000,
//     overflow: 'hidden',
//   },
//   modernDropdownMenuTypeB: {
//     top: 50,
//     left: 0,
//     right: 0,
//     backgroundColor: '#FFFFFF',
//     borderRadius: 12,
//     borderWidth: 1,
//     borderColor: Colors.border,
//     zIndex: 1000,
//     overflow: 'hidden',
//   },

//   modernDropdownItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     paddingHorizontal: 16,
//     paddingVertical: 8,
//     backgroundColor: '#FFFFFF',
//   },
//   modernDropdownItemBorder: {
//     borderBottomWidth: 1,
//     borderBottomColor: '#F3F4F6',
//   },
//   modernDropdownItemText: {
//     fontSize: 14,
//     color: '#374151',
//     fontWeight: '500',
//   },
//   modernDropdownItemTextSelected: {
//     color: '374151',
//     fontWeight: '600',
//   },
//   dropdownItem: {
//     padding: 10,
//     borderBottomWidth: 1,
//     borderBottomColor: Colors.border,
//   },
//   inputWithIcon: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     borderWidth: 1,
//     borderColor: Colors.border,
//     borderRadius: 10,
//     backgroundColor: '#fff',
//     paddingVertical: 6,
//     paddingLeft: 20,
//     position: 'relative',
//   },
//   iconLeft: {
//     position: 'absolute',
//     left: 12,
//     color: '#888',
//   },
//   barcodeBtn: {
//     backgroundColor: '#E8EFF6',
//     padding: 12,
//     marginVertical: 12,
//     borderRadius: 10,
//     flexDirection: 'row',
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderWidth: 1,
//     borderColor: Colors.border,
//   },
//   scanText: {
//     fontWeight: '600',
//     fontSize: 14,
//     color: '#000',
//     marginRight: 10,
//   },
//   subtotalRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginTop: 20,
//     marginBottom:40,
//     borderTopWidth: 1,
//     borderTopColor: Colors.border,
//     backgroundColor: '#fff',
//     borderRadius: 10,
//   },
//   label2: {
//     fontSize: 16,
//     fontWeight: '400',
//     color: '#8F939E',
//     padding: 16,
//   },
//   subtotalValue: {
//     color: '#0A8F52',
//     fontWeight: 'bold',
//     fontSize: 16,
//     padding: 16,
//   },
//   dropdownList: {
//     backgroundColor: '#fff',
//     borderColor: Colors.border,
//     borderWidth: 1,
//     borderRadius: 10,
//     marginTop: 4,
//     paddingVertical: 4,
//   },
//   dropdownItem: {
//     paddingVertical: 8,
//     paddingHorizontal: 12,
//   },
//   dropdownText: {
//     color: '#333',
//     fontSize: 14,
//   },
// });

// export default AddProductModal;
