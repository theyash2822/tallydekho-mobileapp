import React, {useState, useMemo, useRef, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Keyboard,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Colors from '../../../utils/Colors';
import {CommonInputStyles, CommonLabelStyles, CommonDropdownStyles} from '../../../utils/CommonStyles';

// Dropdown options should be supplied dynamically by parent screens.
// Keeping this as an empty constant avoids static fallback data.
export const EMPTY_OPTIONS = [];

export const paymentMethods = ['Cash', 'Bank', 'UPI'];
export const paymentMethodIcons = {
  Cash: 'cash-outline',
  Bank: 'business-outline',
  UPI: 'logo-usd',
};

// Shared Components
export const SearchableDropdown = ({
  value,
  onChange,
  placeholder,
  data = [],
  scrollViewRef,
  inputRef,
  nextInputRef,
  returnKeyType = 'next',
  onSubmitEditing,
  onFocus,
}) => {
  const [search, setSearch] = useState('');
  const [show, setShow] = useState(false);
  const containerRef = useRef(null);
  const [containerY, setContainerY] = useState(0);

  const filtered = useMemo(
    () =>
      data
        .filter(item => item.toLowerCase().includes(search.toLowerCase()))
        .slice(0, 3),
    [data, search],
  );

  // Scroll when dropdown opens - only if field is lower on screen
  useEffect(() => {
    const SCROLL_THRESHOLD = 150;
    if (
      show &&
      search.length > 0 &&
      scrollViewRef?.current &&
      containerY > SCROLL_THRESHOLD
    ) {
      setTimeout(() => {
        scrollViewRef.current?.scrollTo({
          y: containerY + 120, // Add space for dropdown
          animated: true,
        });
      }, 150);
    }
  }, [show, search, scrollViewRef, containerY]);

  // Determine the "no results" message based on placeholder
  const getNoResultsMessage = () => {
    if (placeholder?.toLowerCase().includes('name')) {
      return 'No party found';
    } else if (placeholder?.toLowerCase().includes('invoice')) {
      return 'No invoices found';
    } else if (placeholder?.toLowerCase().includes('bank')) {
      return 'No bank found';
    }
    return 'No results found';
  };

  const handleFocus = () => {
    if (onFocus) {
      onFocus();
    }
    // Only scroll if field is below threshold (not at top of screen)
    // Threshold: 200px - fields above this don't need scrolling
    const SCROLL_THRESHOLD = 200;
    if (scrollViewRef?.current && containerY > SCROLL_THRESHOLD) {
      setTimeout(() => {
        scrollViewRef.current?.scrollTo({
          y: containerY - 100, // Smooth offset for better UX
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
    <View ref={containerRef} onLayout={handleContainerLayout}>
      <View style={styles.searchContainer}>
        <Icon name="search-outline" size={20} color="#8F939E" />
        <TextInput
          ref={inputRef}
          style={styles.searchInput}
          placeholder={placeholder}
          placeholderTextColor="#8F939E"
          value={value}
          returnKeyType={returnKeyType}
          blurOnSubmit={false}
          onSubmitEditing={() => {
            if (onSubmitEditing) {
              onSubmitEditing();
            } else if (nextInputRef?.current) {
              // Jump directly to next field, keyboard stays open
              setTimeout(() => {
                nextInputRef.current?.focus();
              }, 50);
            }
          }}
          onFocus={handleFocus}
          onChangeText={text => {
            onChange(text);
            setSearch(text);
            setShow(true);
          }}
        />
      </View>
      {show && search.length > 0 && (
        <View style={styles.dropdownOptions}>
          {filtered.length > 0 ? (
            filtered.map(item => (
              <TouchableOpacity
                key={item}
                style={styles.option}
                onPress={() => {
                  onChange(item);
                  setShow(false);
                  // Move to next input after selection
                  if (nextInputRef?.current) {
                    setTimeout(() => {
                      nextInputRef.current.focus();
                    }, 100);
                  }
                }}>
                <Text>{item}</Text>
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.noResultsOption}>
              <Text style={styles.noResultsText}>
                {getNoResultsMessage()}
              </Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
};

export const LabeledInput = ({
  label,
  style,
  inputRef,
  nextInputRef,
  returnKeyType = 'next',
  onSubmitEditing,
  onFocus,
  scrollViewRef,
  scrollToNextOnFocus = false,
  keyboardType,
  ...props
}) => {
  const containerRef = useRef(null);
  const [containerY, setContainerY] = useState(0);

  const handleFocus = () => {
    if (onFocus) {
      onFocus();
    }
    // Only scroll if field is below threshold (not at top of screen)
    // Threshold: 200px - fields above this don't need scrolling
    const SCROLL_THRESHOLD = 200;
    if (scrollViewRef?.current && containerY > SCROLL_THRESHOLD) {
      setTimeout(() => {
        // If scrollToNextOnFocus is true, scroll further to show next field
        const scrollOffset = scrollToNextOnFocus ? 200 : 100;
        scrollViewRef.current?.scrollTo({
          y: containerY - scrollOffset, // Smooth offset for better UX
          animated: true,
        });
      }, 150);
    }
  };

  const handleContainerLayout = event => {
    const {y} = event.nativeEvent.layout;
    setContainerY(y);
  };

  const handleSubmit = () => {
    if (returnKeyType === 'done') {
      // Close keyboard when "Done" is pressed
      Keyboard.dismiss();
    } else if (onSubmitEditing) {
      onSubmitEditing();
    } else if (nextInputRef?.current) {
      // Smoothly move to next field without closing keyboard.  // Small delay to ensure smooth transition
      setTimeout(() => {
        nextInputRef.current?.focus();
      }, 50);
    }
  };

  const effectiveKeyboardType =
    Platform.OS === 'ios' && keyboardType === 'numeric'
      ? 'numbers-and-punctuation'
      : keyboardType;

  return (
    <View ref={containerRef} onLayout={handleContainerLayout}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        ref={inputRef}
        style={[styles.input, props.multiline && {paddingTop: 12}, style]}
        placeholderTextColor="#8F939E"
        returnKeyType={returnKeyType}
        onSubmitEditing={handleSubmit}
        onFocus={handleFocus}
        blurOnSubmit={returnKeyType === 'done'}
        keyboardType={effectiveKeyboardType}
        textAlignVertical={props.multiline ? 'top' : 'center'}
        {...props}
      />
    </View>
  );
};

export const PaymentMethodDropdown = ({
  selected,
  onSelect,
  showDropdown,
  toggleDropdown,
}) => (
  <>
    <TouchableOpacity
      style={[styles.dropdown, {justifyContent: 'space-around'}]}
      onPress={toggleDropdown}>
      <Icon name="card-outline" size={20} />
      <Text style={[styles.dropdownText, {marginLeft: 0}]}>{selected}</Text>
      <Icon name="chevron-down-outline" size={20} />
    </TouchableOpacity>

    {showDropdown && (
      <View style={styles.floatingDropdown}>
        {paymentMethods.map(method => (
          <TouchableOpacity
            key={method}
            style={styles.option}
            onPress={() => {
              onSelect(method);
              toggleDropdown();
            }}>
            <View style={{flexDirection: 'row', alignItems: 'center', gap: 8}}>
              <Icon
                name={paymentMethodIcons[method] || 'card-outline'}
                size={18}
                style={{marginRight: 6}}
              />
              <Text>{method}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    )}
  </>
);


const styles = StyleSheet.create({
  label: {
    ...CommonLabelStyles.label,
    marginTop: 10,
    marginBottom: 4,
  },
  input: {
    ...CommonInputStyles.textInput,
    height: 44,
    color: '#000',
    paddingVertical: 0,
  },
  dropdown: {
    ...CommonDropdownStyles.dropdownInput,
    height: 44,
    paddingVertical: 0,
  },
  dropdownText: {
    fontSize: 14,
    color: '#333',
  },
  dropdownOptions: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderColor: Colors.border,
    borderWidth: 1,
    marginTop: 4,
    zIndex: 100,
  },
  option: {
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  noResultsOption: {
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noResultsText: {
    fontSize: 14,
    color: '#8F939E',
    fontStyle: 'italic',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 44,
    backgroundColor: '#fff',
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#000',
  },
  floatingDropdown: {
    position: 'absolute',
    top: 85,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderColor: Colors.border,
    borderWidth: 1,
    elevation: 1,
    zIndex: 999,
  },
});
