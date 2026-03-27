import React, {useState, useRef , useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Platform,
} from 'react-native';
import {countries} from '../../utils/Constants';
import Colors from '../../utils/Colors';

const CountryPickernew = ({
  onSelect,
  phoneNumber,
  setPhoneNumber,
  Icons,
  setShowButton,
  setCountryCode,
  initialCountryCode,
  initialPhoneNumber,
  style,
  isReadOnly = false,
  onDigitPress,
  focusedPosition = 0,
  dialpadMode = false,
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  // Find country by code if initialCountryCode is provided
  const getInitialCountry = () => {
    if (initialCountryCode) {
      const found = countries.find(
        country => country.code === initialCountryCode || country.code === `+${initialCountryCode.replace('+', '')}`,
      );
      return found || countries[1]; // Default to India if not found
    }
    return countries[1]; // Default to India
  };
  const [selectedCountry, setSelectedCountry] = useState(getInitialCountry());
  const [isInputFocused, setIsInputFocused] = useState(false);
  const inputRef = useRef(null);

  // Update selected country when initialCountryCode changes
  useEffect(() => {
    if (initialCountryCode) {
      const found = countries.find(
        country => country.code === initialCountryCode || country.code === `+${initialCountryCode.replace('+', '')}`,
      );
      if (found) {
        setSelectedCountry(found);
        if (setCountryCode) {
          setCountryCode(found.code);
        }
      }
    }
  }, [initialCountryCode]);

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
    if (setShowButton) setShowButton(showDropdown);
  };

  const selectCountry = country => {
    // Clear phone number when country code changes (only if different country)
    // But preserve if initialPhoneNumber was provided (coming back from OTP)
    if (selectedCountry.code !== country.code && setPhoneNumber && !initialPhoneNumber) {
      setPhoneNumber('');
    }
    setSelectedCountry(country);
    setShowDropdown(false);
    if (onSelect) onSelect(country);
    if (setShowButton) setShowButton(true);
    if (setCountryCode) setCountryCode(country.code);
  };

  const handleDigitClick = position => {
    if (onDigitPress) {
      onDigitPress(position);
    }
  };

  const handlePhoneNumberChange = text => {
    // Only allow digits and limit to 10 characters
    const cleanedText = text.replace(/[^0-9]/g, '').slice(0, 10);
    setPhoneNumber(cleanedText);

    // Show button when phone number is entered
    if (setShowButton && cleanedText.length >= 10) {
      setShowButton(true);
    }
  };

  const handleInputFocus = () => {
    setIsInputFocused(true);
  };

  const handleInputBlur = () => {
    setIsInputFocused(false);
  };

  const focusInput = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Calculate the current cursor position
  const currentCursorPosition = phoneNumber.length;

  // Check country code digit length (excluding + sign)
  const countryCodeDigits = selectedCountry.code.replace(/[^0-9]/g, '');
  const digitLength = countryCodeDigits.length;
  const hasOneDigitCode = digitLength === 1;
  const hasThreeDigitCode = digitLength === 3;

  return (
    <View style={[styles.inputRow, style]}>
      <TouchableOpacity
        style={styles.countryPickerButton}
        onPress={toggleDropdown}>
        <Text style={styles.callingCode}>
          {selectedCountry.flag} {selectedCountry.code}
        </Text>
        <View style={styles.icon}>{Icons.Expand(24, '#89839a')}</View>
      </TouchableOpacity>

      <View
        style={[
          styles.divider,
          Platform.OS === 'ios' && styles.dividerIOS,
          hasOneDigitCode && styles.dividerOneDigit,
          hasThreeDigitCode && styles.dividerThreeDigit,
        ]}
      />

      <TouchableOpacity
        style={styles.phoneInputContainer}
        onPress={() => {
          if (dialpadMode && onDigitPress) {
            // In dialpad mode, clicking the input should focus the first position
            onDigitPress(0);
          } else if (!dialpadMode) {
            focusInput();
          }
        }}
        activeOpacity={dialpadMode ? 0.7 : 1}>
        {/* Phone number input */}
        <TextInput
          ref={inputRef}
          style={styles.phoneInput}
          value={phoneNumber}
          onChangeText={dialpadMode ? undefined : handlePhoneNumberChange}
          onFocus={dialpadMode ? undefined : handleInputFocus}
          onBlur={dialpadMode ? undefined : handleInputBlur}
          keyboardType="numeric"
          maxLength={10}
          placeholder="Enter phone number"
          placeholderTextColor={Colors.placeholder}
          editable={!isReadOnly && !dialpadMode}
          selectTextOnFocus={false}
          autoFocus={false}
          showSoftInputOnFocus={!dialpadMode}
        />
      </TouchableOpacity>

      {showDropdown && (
        <View style={styles.dropdownContainer}>
          <FlatList
            data={countries}
            showsVerticalScrollIndicator={false}
            keyExtractor={item => item.code}
            nestedScrollEnabled
            style={{maxHeight: 370}}
            renderItem={({item}) => (
              <TouchableOpacity
                onPress={() => selectCountry(item)}
                style={styles.countryItem}>
                <Text style={{fontSize: 16, marginRight: 9}}>{item.flag}</Text>
                <Text style={styles.countryText}>
                  {item.name} ({item.code})
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  inputRow: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 10,
    backgroundColor: Colors.white,
    width: '100%',
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  countryPickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '25%',
    paddingVertical: 12,
  },
  callingCode: {
    fontSize: 16,
    fontWeight: '400',
  },
  divider: {
    width: 1,
    height: '80%',
    backgroundColor: '#ccc',
    marginHorizontal: 10,
  },
  dividerIOS: {
    marginLeft: 8,
  },
  dividerOneDigit: {
    marginHorizontal: 2,
  },
  dividerThreeDigit: {
    marginHorizontal: 16,
  },
  icon: {
    marginLeft: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 10,
    paddingLeft: 10,
  },
  readOnlyInput: {
    backgroundColor: '#fff',
    color: '#6B7280',
  },
  dropdownContainer: {
    position: 'absolute',
    top: 62,
    left: 0,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 5,
    zIndex: 10,
    width: '106%',
  },
  countryText: {
    fontSize: 16,
  },
  countryItem: {
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  phoneInput: {
    flex: 1,
    fontSize: 16,
    color: Colors.primaryText,
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  phoneInputContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: 2,
    position: 'relative',
    paddingVertical: 8,
  },
  hiddenInput: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0,
    zIndex: 1,
  },
  phoneDigitBox: {
    borderWidth: 1,
    borderColor: 'transparent',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    position: 'relative',
    minWidth: 24,
    height: 40,
    marginHorizontal: 1,
  },
  phoneDigitBoxFocused: {
    borderColor: Colors.primary,
    borderWidth: 2,
    borderRadius: 4,
    backgroundColor: Colors.backgroundColorPrimary,
  },
  phoneDigitBoxFilled: {
    borderColor: Colors.primary,
    borderWidth: 1,
    borderRadius: 4,
    backgroundColor: Colors.backgroundColorPrimary,
  },
  phoneDigit: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.primaryText,
  },
  phoneDigitFilled: {
    color: Colors.primary,
  },
  cursor: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: 2,
    height: 20,
    backgroundColor: Colors.primary,
    borderRadius: 1,
  },
});

export default CountryPickernew;
