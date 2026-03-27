import React, {useState, useEffect, useImperativeHandle, forwardRef} from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  Text,
  BackHandler,
  StyleSheet,
  TextInput,
} from 'react-native';
import {countries} from '../../utils/Constants';
import Colors from '../../utils/Colors';
import Icon from 'react-native-vector-icons/Feather';

const CustomTextInput2 = forwardRef(({
  placeholder,
  value,
  onChangeText,
  leftIcon,
  inputRef,
  returnKeyType,
  onSubmitEditing,
  onBlur,
  onFocus,
  errorMessage,
}, ref) => {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState(null);
  const [searchText, setSearchText] = useState(value || '');

  // Expose methods to parent via ref
  useImperativeHandle(ref, () => ({
    closeDropdown: () => {
      setDropdownVisible(false);
    },
    openDropdown: () => {
      setDropdownVisible(true);
    },
  }));

  // Sync searchText with value prop
  useEffect(() => {
    if (value !== undefined) {
      setSearchText(value);
    }
  }, [value]);

  const handleCountrySelect = country => {
    setSelectedIcon(country.flag);
    setDropdownVisible(false);
    setSearchText(country.language);
    if (onChangeText) {
      onChangeText(country.language);
    }
  };

  const handleDropdownToggle = () => {
    if (dropdownVisible) {
      // When closing dropdown, restore the original value if searchText was modified
      if (value && searchText !== value) {
        setSearchText(value);
        if (onChangeText) {
          onChangeText(value);
        }
      }
    }
    // Don't clear searchText when opening dropdown - preserve the current value
    setDropdownVisible(prev => !prev);
  };

  // Close dropdown on back button press
  useEffect(() => {
    const backAction = () => {
      if (dropdownVisible) {
        setDropdownVisible(false);
        return true;
      }
      return false;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, [dropdownVisible]);

  const filteredCountries = searchText
    ? countries.filter(
        item =>
          item.language.toLowerCase().includes(searchText.toLowerCase()) ||
          item.name.toLowerCase().includes(searchText.toLowerCase()),
      )
    : countries;

  return (
    <View style={{width: '100%'}}>
      {/* TextInput with left + right icons manually */}
      <View style={styles.inputWrapper}>
        {selectedIcon ? (
          <Text style={styles.flagIcon}>{selectedIcon}</Text>
        ) : (
          leftIcon(24, Colors.black)
        )}

        <TextInput
          ref={inputRef}
          value={searchText}
          onChangeText={text => {
            setSearchText(text);
            setDropdownVisible(true);
            if (onChangeText) {
              onChangeText(text);
            }
          }}
          onFocus={() => {
            // Open dropdown when input is focused
            setDropdownVisible(true);
            // Call parent's onFocus if provided
            if (onFocus) {
              onFocus();
            }
          }}
          onBlur={onBlur}
          placeholder={placeholder}
          placeholderTextColor="#8F9393"
          returnKeyType={returnKeyType}
          onSubmitEditing={onSubmitEditing}
          blurOnSubmit={returnKeyType === 'done'}
          style={styles.input}
        />

        <TouchableOpacity onPress={handleDropdownToggle}>
          <Icon
            name={dropdownVisible ? 'chevron-up' : 'chevron-down'}
            size={20}
            color={Colors.black}
          />
        </TouchableOpacity>
      </View>

      {/* Error Message */}
      {errorMessage && (
        <Text style={styles.errorText}>{errorMessage}</Text>
      )}

      {/* Dropdown List - Hide if there's an error message or no matching results */}
      {dropdownVisible && !errorMessage && filteredCountries.length > 0 && (
        <View style={styles.dropdownContainer}>
          <FlatList
            data={filteredCountries}
            keyExtractor={item => item.code}
            keyboardShouldPersistTaps="handled"
            initialNumToRender={10}
            renderItem={({item, index}) => (
              <TouchableOpacity
                onPress={() => handleCountrySelect(item)}
                style={[
                  styles.dropdownItem,
                  index === filteredCountries.length - 1 && {
                    borderBottomWidth: 0,
                  },
                ]}>
                <Text style={styles.flagIcon}>{item.flag}</Text>
                <Text style={styles.countryText}>
                  {item.name} ({item.language})
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    backgroundColor: Colors.white,
    paddingHorizontal: 10,
    height: 50,
    marginBottom: 5,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: Colors.black,
    paddingVertical: 0,
    marginHorizontal: 8,
  },
  chevron: {
    fontSize: 16,
    color: Colors.black,
    paddingHorizontal: 5,
  },
  flagIcon: {
    fontSize: 20,
    marginRight: 6,
  },
  dropdownContainer: {
    position: 'absolute',
    top: 55,
    width: '100%',
    backgroundColor: Colors.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    maxHeight: 360,
    zIndex: 999,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  countryText: {
    fontSize: 14,
  },
  errorText: {
    fontSize: 12,
    color: '#EF4444',
    marginTop: 4,
    marginLeft: 4,
  },
});

export default CustomTextInput2;
