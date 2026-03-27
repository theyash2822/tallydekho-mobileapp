import React, {useRef, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Keyboard,
  Platform,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Colors from '../../utils/Colors';
import {CommonInputStyles, CommonLabelStyles} from '../../utils/CommonStyles';


export const CustomTextInput = ({
  label,
  value,
  onChangeText,
  placeholder = '-',
  multiline = false,
  keyboardType = 'default',
  style = {},
  inputRef,
  nextInputRef,
  scrollViewRef,
  returnKeyType = 'next',
}) => {
  const containerRef = useRef(null);
  const [containerY, setContainerY] = useState(0);
  const internalInputRef = useRef(null);
  const textInputRef = inputRef || internalInputRef;

  const handleFocus = () => {
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

  const handleSubmit = () => {
    if (returnKeyType === 'done') {
      Keyboard.dismiss();
    } else if (nextInputRef?.current) {
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
        ref={textInputRef}
        style={[
          styles.input,
          multiline && {minHeight: 100, textAlignVertical: 'top'},
          style,
        ]}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        placeholderTextColor={Colors.secondaryText}
        multiline={multiline}
        numberOfLines={multiline ? 3 : 1}
        keyboardType={effectiveKeyboardType}
        returnKeyType={returnKeyType}
        blurOnSubmit={returnKeyType === 'done'}
        onSubmitEditing={handleSubmit}
        onFocus={handleFocus}
      />
    </View>
  );
};

export const CustomDropdown = ({
  label,
  selectedValue,
  options,
  expanded,
  onToggle,
  onSelect,
}) => (
  <>
    <Text style={styles.label}>{label}</Text>
    <View style={styles.dropdownInputRow}>
      <TouchableOpacity
        style={styles.dropdownInputTouchable}
        onPress={onToggle}
        activeOpacity={0.8}>
        <Text style={styles.dropdownText}>{selectedValue}</Text>
        <View style={{flex: 1}} />
        <MaterialIcons
          name={expanded ? 'expand-less' : 'expand-more'}
          size={22}
          color={Colors.secondaryText}
        />
      </TouchableOpacity>
    </View>
    {expanded && (
      <View style={styles.dropdownList}>
        {options.map(option => (
          <TouchableOpacity
            key={option}
            style={styles.dropdownItem}
            onPress={() => onSelect(option)}>
            <Text style={styles.dropdownItemText}>{option}</Text>
          </TouchableOpacity>
        ))}
      </View>
    )}
  </>
);

export const CollapsibleCard = ({title, expanded, onToggle, children}) => (
  <View style={styles.partyCard}>
    <TouchableOpacity
      style={styles.partyHeaderRow}
      onPress={onToggle}
      activeOpacity={0.8}>
      <Text style={styles.partyLabel}>{title}</Text>
      <MaterialIcons
        name={expanded ? 'expand-less' : 'expand-more'}
        size={22}
        color={Colors.secondaryText}
      />
    </TouchableOpacity>
    {expanded && children}
  </View>
);

export const PartyInput = ({
  label,
  value,
  onChangeText,
  placeholder = '-',
  keyboardType = 'default',
  inputRef,
  nextInputRef,
  scrollViewRef,
  returnKeyType = 'next',
}) => {
  const containerRef = useRef(null);
  const [containerY, setContainerY] = useState(0);
  const internalInputRef = useRef(null);
  const textInputRef = inputRef || internalInputRef;

  const handleFocus = () => {
    // Skip auto-scroll for "done" fields (last field in section) to prevent unwanted scrolling
    if (returnKeyType === 'done') {
      return; // Don't auto-scroll for the last field
    }
    
    // Only scroll if field is actually below the visible area
    if (!scrollViewRef?.current) return;
    
    const SCROLL_THRESHOLD = 400; // Very high threshold - only scroll if field is very far down
    const KEYBOARD_OFFSET = 180; // Space above keyboard
    
    // Only scroll if containerY is significantly below threshold
    // This prevents scrolling when navigating between adjacent fields in same section
    if (containerY > SCROLL_THRESHOLD) {
      setTimeout(() => {
        if (scrollViewRef?.current) {
          scrollViewRef.current.scrollTo({
            y: Math.max(0, containerY - KEYBOARD_OFFSET),
            animated: true,
          });
        }
      }, 200);
    }
  };

  const handleContainerLayout = event => {
    const {y} = event.nativeEvent.layout;
    setContainerY(y);
  };

  const handleSubmit = () => {
    if (returnKeyType === 'done') {
      Keyboard.dismiss();
    } else if (nextInputRef?.current) {
      // Focus the next field - its onFocus will handle scrolling
      // Use a small delay to ensure smooth transition
      setTimeout(() => {
        if (nextInputRef?.current) {
          nextInputRef.current.focus();
        }
      }, 100);
    }
  };

  // For iOS, convert numeric and phone-pad to numbers-and-punctuation to support returnKeyType
  const effectiveKeyboardType =
    Platform.OS === 'ios' && (keyboardType === 'numeric' || keyboardType === 'phone-pad')
      ? 'numbers-and-punctuation'
      : keyboardType;

  return (
    <View ref={containerRef} onLayout={handleContainerLayout}>
      <Text style={styles.partyFieldLabel}>{label}</Text>
      <View style={styles.partyInputBox}>
        <TextInput
          ref={textInputRef}
          style={styles.partyInput}
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
          placeholderTextColor={Colors.secondaryText}
          keyboardType={effectiveKeyboardType}
          returnKeyType={returnKeyType}
          blurOnSubmit={returnKeyType === 'done'}
          onSubmitEditing={handleSubmit}
          onFocus={handleFocus}
        />
      </View>
    </View>
  );
};

export const TwoColumnRow = ({leftChild, rightChild}) => (
  <View style={styles.partyRow}>
    <View style={{flex: 1, marginRight: 6}}>{leftChild}</View>
    <View style={{flex: 1, marginLeft: 6}}>{rightChild}</View>
  </View>
);


const styles = StyleSheet.create({
  // Shared label used by both TextInput and Dropdown
  label: {
    ...CommonLabelStyles.label,
    marginBottom: 6,
    marginTop: 10,
  },

  // For CustomTextInput
  input: {
    ...CommonInputStyles.textInputLg,
    width: '100%',
    padding: 14,
  },

  // For CustomDropdown
  dropdownInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    marginTop: 4,
    marginBottom: 2,
  },
  dropdownInputTouchable: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    minWidth: 120,
  },
  dropdownText: {
    fontSize: 14,
    color: Colors.primaryText,
    marginRight: 8,
  },
  dropdownList: {
    backgroundColor: Colors.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 8,
    marginTop: 1,
    overflow: 'hidden',
  },
  dropdownItem: {
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  dropdownItemText: {
    fontSize: 14,
    color: Colors.primaryText,
  },

  // For CollapsibleCard
  partyCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 12,
    marginTop: 4,
  },
  partyHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  partyLabel: {
    color: Colors.primaryText,
    fontSize: 14,
    fontWeight: '400',
  },

  // For PartyInput
  partyFieldLabel: {
    color: Colors.secondaryText,
    fontSize: 12,
    fontWeight: '400',
    marginBottom: 4,
    marginTop: 6,
  },
  partyInputBox: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 8,
    paddingHorizontal: 10,
    paddingVertical: 12,
    height: 50,
  },
  partyInput: {
    fontSize: 14,
    color: Colors.primaryText,
    backgroundColor: 'transparent',
    borderWidth: 0,
    padding: 0,
    paddingVertical: 2,
  },

  // For TwoColumnRow
  partyRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
