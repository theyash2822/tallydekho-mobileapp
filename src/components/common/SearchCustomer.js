import React, {useState, useMemo, useRef, useEffect, useImperativeHandle, forwardRef} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Keyboard,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import AddVendorModal from '../Sales-purchaseInvoice/VendorModal';
import Colors from '../../utils/Colors';
import {CommonLabelStyles} from '../../utils/CommonStyles';

const SearchCustomer = forwardRef(({
  placeholder = 'Search Customer ',
  label = 'Customer Name',
  peopleList = [],
  onCustomerSelect,
  vendorModalHeader = 'Add New Customer',
  showShippingAddress = true,
  enableAddCustomer = true,
  scrollViewRef,
  inputRef: externalInputRef,
  nextInputRef,
  returnKeyType = 'next',
  required = false,
  onValidationChange,
}, ref) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [showVendorModal, setShowVendorModal] = useState(false);
  const [customerError, setCustomerError] = useState('');
  const [isTouched, setIsTouched] = useState(false);
  const internalInputRef = useRef(null);
  const containerRef = useRef(null);
  const [containerY, setContainerY] = useState(0);
  
  // Use external ref if provided, otherwise use internal
  const inputRef = externalInputRef || internalInputRef;

  // Validation function
  const validateCustomer = (value = null) => {
    const currentValue = value !== null ? value : (selectedCustomer || searchQuery);
    // If required, validate that field is not empty
    if (required && (!currentValue || !currentValue.trim())) {
      return 'Please enter a valid customer';
    }
    return '';
  };

  // Expose validation method to parent via ref
  useImperativeHandle(ref, () => ({
    validate: () => {
      const error = validateCustomer();
      setCustomerError(error);
      setIsTouched(true);
      return !error; // Return true if valid
    },
    getValue: () => selectedCustomer || searchQuery,
    clearError: () => {
      setCustomerError('');
      setIsTouched(false);
    },
  }));

  // Notify parent of validation state changes
  useEffect(() => {
    if (onValidationChange) {
      const isValid = !validateCustomer();
      onValidationChange(isValid);
    }
  }, [searchQuery, selectedCustomer, onValidationChange, required]);
  
  const filteredPeople = useMemo(() => {
    return peopleList.filter(person =>
      person.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [searchQuery, peopleList]);

  const handleSelectCustomer = customer => {
    setSelectedCustomer(customer);
    setSearchQuery('');
    setCustomerError(''); // Clear error when customer is selected
    setIsTouched(true);
    onCustomerSelect && onCustomerSelect(customer);

    // Move to next input after selection - keep keyboard open
    if (nextInputRef?.current) {
      setTimeout(() => {
        nextInputRef.current?.focus();
      }, 50);
    } else {
      inputRef.current?.blur();
      Keyboard.dismiss();
    }
  };

  const handleFocus = () => {
    // Only scroll if field is below threshold (not at top of screen)
    const SCROLL_THRESHOLD = 200;
    if (scrollViewRef?.current && containerY > SCROLL_THRESHOLD) {
      setTimeout(() => {
        scrollViewRef.current?.scrollTo({
          y: containerY - 100,
          animated: true,
        });
      }, 150);
    }
  };

  const handleContainerLayout = event => {
    const {y} = event.nativeEvent.layout;
    setContainerY(y);
  };

  return (
    <View ref={containerRef} onLayout={handleContainerLayout} style={{marginTop: 8}}>
      <Text style={styles.label}>{label}</Text>

      <View style={styles.searchContainer}>
        <Icon
          name="search-outline"
          size={20}
          color="#8F939E"
          style={styles.iconLeft}
        />
        <TextInput
          ref={inputRef}
          value={selectedCustomer || searchQuery}
          onChangeText={text => {
            setSearchQuery(text);
            setSelectedCustomer('');
            setIsTouched(true);
            // Validate immediately when user changes the field
            // Show error if required and field becomes empty/invalid
            if (required) {
              const error = validateCustomer(text);
              setCustomerError(error);
            } else {
              // Clear error if not required
              setCustomerError('');
            }
          }}
          placeholder={placeholder}
          placeholderTextColor="#8F939E"
          style={styles.input1}
          returnKeyType={returnKeyType}
          blurOnSubmit={false}
          onSubmitEditing={() => {
            if (nextInputRef?.current) {
              setTimeout(() => {
                nextInputRef.current?.focus();
              }, 50);
            }
          }}
          onFocus={handleFocus}
          onBlur={() => {
            // Always validate on blur if required, or if field was touched
            if (required || isTouched) {
              const error = validateCustomer();
              setCustomerError(error);
            }
          }}
        />

        {enableAddCustomer && (
          <>
            <View style={styles.divider} />
            <TouchableOpacity onPress={() => setShowVendorModal(true)}>
              <Icon
                name="add-outline"
                size={24}
                color="#8F939E"
                style={styles.iconRight}
              />
            </TouchableOpacity>
          </>
        )}
      </View>

      {searchQuery.trim().length > 1 && filteredPeople.length > 0 ? (
        filteredPeople.map((customer, index) => (
          <TouchableOpacity
            key={index}
            style={styles.resultItem}
            onPress={() => handleSelectCustomer(customer)}>
            <Icon
              name="person-outline"
              size={18}
              color="#444"
              style={{marginRight: 8}}
            />
            <Text style={styles.resultText}>{customer}</Text>
          </TouchableOpacity>
        ))
      ) : searchQuery.trim().length > 1 ? (
        <Text style={styles.noResult}>No results found</Text>
      ) : null}

      {enableAddCustomer && (
        <AddVendorModal
          visible={showVendorModal}
          onClose={() => {
            setShowVendorModal(false);
            // Validate when modal closes if field is touched or required
            if (isTouched || required) {
              const error = validateCustomer();
              setCustomerError(error);
            }
          }}
          onSaveAndUse={(name) => {
            // When customer is saved and used, set it as selected
            setSelectedCustomer(name);
            setSearchQuery('');
            setCustomerError('');
            setIsTouched(true);
            onCustomerSelect && onCustomerSelect(name);
            setShowVendorModal(false);
          }}
          showShippingAddress={showShippingAddress}
          showfirstButton={false}
          showSecondButton={true}
          headerText={vendorModalHeader}
          vendorNameLabel="Name"
          placeholderName="Party A"
        />
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  label: {
    ...CommonLabelStyles.label,
    marginBottom: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    paddingVertical: 1,
  },
  input1: {
    flex: 1,
    height: 40,
    color: '#000',
  },
  iconLeft: {
    marginRight: 8,
  },
  iconRight: {
    marginLeft: 8,
  },
  divider: {
    width: 1,
    height: 20,
    backgroundColor: '#ccc',
    marginRight: 8,
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 6,
    marginTop: 6,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  resultText: {
    fontSize: 14,
    color: '#333',
  },
  noResult: {
    marginTop: 10,
    textAlign: 'center',
    color: '#999',
    fontStyle: 'italic',
  },
});

export default SearchCustomer;
