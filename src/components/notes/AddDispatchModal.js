import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Colors from '../../utils/Colors';
import CustomAnimatedModal from '../common/CustomAnimatedModal';
import FormField from '../common/FormField';
import InvoicesModalStyles from '../../utils/InvoicesModalStyles';
import { useInputNavigation } from '../stocksManagement/StockOverview/TotalStock/Components/inputNavigation';

const AddDispatchModal = ({visible, onClose, onSave, editingItem = null, editingIndex = null}) => {
  // Keyboard state
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const scrollViewRef = useRef(null);

  // Product and Warehouse States
  const [productSearchQuery, setProductSearchQuery] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isProductDropdownOpen, setIsProductDropdownOpen] = useState(false);

  // Quantity and Pricing States
  const [quantity, setQuantity] = useState('');
  const [selectedUnit, setSelectedUnit] = useState('KG');
  const [unitPrice, setUnitPrice] = useState('');
  const [selectedCurrency, setSelectedCurrency] = useState('INR');
  const [narration, setNarration] = useState('');

  // Dropdown Visibility States
  const [isUnitDropdownOpen, setIsUnitDropdownOpen] = useState(false);
  const [isCurrencyDropdownOpen, setIsCurrencyDropdownOpen] = useState(false);

  // Field names in order (text inputs only)
  const fieldNames = ['productName', 'quantity', 'unitPrice', 'narration'];

  // Use input navigation hook
  const {
    getInputRef,
    getContainerRef,
    handleInputFocus,
    handleContainerLayout,
    clearInputRefs,
    getKeyboardType,
    handleSubmitEditing,
  } = useInputNavigation(fieldNames.length, scrollViewRef);

  const productOptions = [
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
  const unitOptions = ['KG', 'Litre', 'Box'];
  const currencyOptions = ['INR', 'USD', 'EUR'];

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

  // Populate fields when editing
  useEffect(() => {
    if (visible && editingItem) {
      setProductSearchQuery(editingItem.productName || '');
      setQuantity(editingItem.quantity || '');
      setSelectedUnit(editingItem.unit || 'KG');
      setUnitPrice(editingItem.unitPrice || '');
      setSelectedCurrency(editingItem.currency || 'INR');
      setNarration(editingItem.narration || '');
    } else if (visible && !editingItem) {
      resetForm();
    }
  }, [visible, editingItem]);

  const resetForm = () => {
    setProductSearchQuery('');
    setQuantity('');
    setSelectedUnit('KG');
    setUnitPrice('');
    setSelectedCurrency('INR');
    setNarration('');
    setIsProductDropdownOpen(false);
    setIsUnitDropdownOpen(false);
    setIsCurrencyDropdownOpen(false);
    setFilteredProducts([]);
    setIsKeyboardVisible(false);
  };

  const handleSave = () => {
    const data = {
      productName: productSearchQuery,
      quantity,
      unit: selectedUnit,
      unitPrice,
      currency: selectedCurrency,
      narration,
    };
    onSave?.(data, editingIndex);
    resetForm();
    onClose();
  };

  const handleProductSearch = text => {
    setProductSearchQuery(text);
    if (text.length >= 2) {
      const filtered = productOptions.filter(p =>
        p.toLowerCase().includes(text.toLowerCase()),
      );
      setFilteredProducts(filtered);
      setIsProductDropdownOpen(true);
    } else {
      setIsProductDropdownOpen(false);
    }
  };

  const selectProduct = product => {
    setProductSearchQuery(product);
    setIsProductDropdownOpen(false);
    // Move to next input after selection - keep keyboard open
    const nextRef = getInputRef(1);
    if (nextRef?.current) {
      setTimeout(() => {
        nextRef.current?.focus();
      }, 100);
    }
  };

  const renderDropdownTrigger = (selectedValue, isOpen, setOpen) => (
    <TouchableOpacity
      style={InvoicesModalStyles.modernDropdownTrigger}
      onPress={() => setOpen(!isOpen)}
      activeOpacity={0.7}>
      <Text style={InvoicesModalStyles.modernDropdownText}>
        {selectedValue}
      </Text>
      <Icon
        name="chevron-down-outline"
        size={16}
        color="#6B7280"
        style={isOpen && {transform: [{rotate: '180deg'}]}}
      />
    </TouchableOpacity>
  );

  const renderInputWithDropdown = (
    label,
    placeholder,
    value,
    onChange,
    dropdownItems,
    selectedValue,
    onSelect,
    isOpen,
    setOpen,
    inputIndex,
    nextIndex,
    isLast = false,
  ) => (
    <View style={InvoicesModalStyles.smallInput}>
      <Text style={InvoicesModalStyles.label}>{label}</Text>
      <View 
        style={InvoicesModalStyles.qtyUnitBox}
        ref={getContainerRef(inputIndex)}
        onLayout={e => handleContainerLayout(inputIndex, e)}>
        <TextInput
          ref={getInputRef(inputIndex)}
          style={InvoicesModalStyles.qtyInput}
          placeholder={placeholder}
          placeholderTextColor="#8F939E"
          keyboardType={getKeyboardType('numeric')}
          value={value}
          onChangeText={onChange}
          returnKeyType={isLast ? 'done' : 'next'}
          blurOnSubmit={false}
          onSubmitEditing={() => {
            if (isLast) {
              Keyboard.dismiss();
            } else {
              // Use minimal delay to prevent keyboard closing/reopening
              const nextRef = getInputRef(nextIndex);
              if (nextRef?.current) {
                // Very small delay to ensure smooth transition
                setTimeout(() => {
                  nextRef.current?.focus();
                }, 10);
              }
            }
          }}
          onFocus={() => handleInputFocus(inputIndex)}
        />
        <View style={InvoicesModalStyles.verticalDivider} />
        {renderDropdownTrigger(selectedValue, isOpen, setOpen)}
      </View>
      {isOpen && (
        <View style={InvoicesModalStyles.modernDropdownMenu}>
          {dropdownItems.map((item, idx) => (
            <TouchableOpacity
              key={item + idx}
              style={InvoicesModalStyles.modernDropdownItem}
              onPress={() => {
                onSelect(item);
                setOpen(false);
              }}
              activeOpacity={0.6}>
              <Text
                style={[
                  InvoicesModalStyles.modernDropdownItemText,
                  selectedValue === item &&
                    InvoicesModalStyles.modernDropdownItemTextSelected,
                ]}>
                {item}
              </Text>
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
      title={editingItem ? 'Edit Dispatch Items' : 'Add Dispatch Items'}
      scrollable={false}
      maxHeight={isKeyboardVisible ? '90%' : '60%'}
      statusBarTranslucent={true}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
        style={{}}>
        <Text style={InvoicesModalStyles.subtext}>
          Fill The Form For Information
        </Text>

        <ScrollView
          ref={scrollViewRef}
          style={[InvoicesModalStyles.content, {marginTop: 4}]}
          contentContainerStyle={[
            InvoicesModalStyles.scrollContent,
            isKeyboardVisible && styles.keyboardPadding,
          ]}
          showsVerticalScrollIndicator={false}
          keyboardDismissMode="interactive"
          keyboardShouldPersistTaps="handled"
          nestedScrollEnabled={true}>
          {/* Product Search */}
          <View
            ref={getContainerRef(0)}
            onLayout={e => handleContainerLayout(0, e)}>
            <Text style={InvoicesModalStyles.label}>Product Name</Text>
            <View style={InvoicesModalStyles.inputWithIcon}>
              <Icon
                name="search"
                size={20}
                style={InvoicesModalStyles.iconLeft}
              />
              <TextInput
                ref={getInputRef(0)}
                value={productSearchQuery}
                placeholder="Search Product"
                placeholderTextColor="#8F939E"
                style={[InvoicesModalStyles.input1, {paddingLeft: 24}]}
                onChangeText={handleProductSearch}
                returnKeyType="next"
                blurOnSubmit={false}
                onSubmitEditing={() => {
                  // Use minimal delay to prevent keyboard closing/reopening
                  const nextRef = getInputRef(1);
                  if (nextRef?.current) {
                    // Very small delay to ensure smooth transition
                    setTimeout(() => {
                      nextRef.current?.focus();
                    }, 10);
                  }
                }}
                onFocus={() => handleInputFocus(0)}
              />
            </View>
            {isProductDropdownOpen && filteredProducts.length > 0 && (
              <View style={InvoicesModalStyles.dropdownList}>
                {filteredProducts.map((p, i) => (
                  <TouchableOpacity
                    key={p + i}
                    style={InvoicesModalStyles.dropdownItem}
                    onPress={() => selectProduct(p)}
                    activeOpacity={0.6}>
                    <Text style={InvoicesModalStyles.dropdownText}>
                      {p}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* QTY & Unit / Unit Price & Currency */}
          <View style={InvoicesModalStyles.row}>
            {renderInputWithDropdown(
              'QTY. & Unit',
              '199',
              quantity,
              setQuantity,
              unitOptions,
              selectedUnit,
              setSelectedUnit,
              isUnitDropdownOpen,
              setIsUnitDropdownOpen,
              1, // inputIndex
              2, // nextIndex (Unit Price)
              false, // isLast
            )}
            {renderInputWithDropdown(
              'Unit Price',
              '₹5,000',
              unitPrice,
              setUnitPrice,
              currencyOptions,
              selectedCurrency,
              setSelectedCurrency,
              isCurrencyDropdownOpen,
              setIsCurrencyDropdownOpen,
              2, // inputIndex
              3, // nextIndex (Narration)
              false, // isLast
            )}
          </View>

          {/* Narration */}
          <FormField
            label="Narration/Notes"
            placeholder="Enter Notes"
            value={narration}
            onChangeText={setNarration}
            inputRef={getInputRef(3)}
            containerRef={getContainerRef(3)}
            onLayout={e => handleContainerLayout(3, e)}
            scrollViewRef={scrollViewRef}
            multiline
            returnKeyType="done"
            onFocus={() => handleInputFocus(3)}
            style={InvoicesModalStyles.formGroup}
            inputStyle={{height: 100, textAlignVertical: 'top', paddingTop: 12}}
          />
          <View style={styles.bottomSpacer} />
        </ScrollView>

        <TouchableOpacity
          style={[
            styles.primaryButton,
            isKeyboardVisible && styles.buttonWithKeyboard,
          ]}
          activeOpacity={0.8}
          onPress={() => {
            Keyboard.dismiss();
            setTimeout(() => handleSave(), 100);
          }}>
          <Text style={styles.primaryButtonText}>Save</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </CustomAnimatedModal>
  );
};

const styles = StyleSheet.create({
  // Unique styles for DispatchModal only
  field: {
    marginBottom: 8,
  },
  primaryButton: {
    backgroundColor: '#07624C',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 4,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  keyboardPadding: {
    paddingBottom: Platform.OS === 'ios' ? 180 : 1,
  },
  bottomSpacer: {
    height: 1,
  },
  buttonWithKeyboard: {
    marginBottom: 4,
  },
});

export default AddDispatchModal;
