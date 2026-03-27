import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Colors from '../../utils/Colors';
import {CommonLabelStyles, CommonDropdownStyles} from '../../utils/CommonStyles';

const paymentOptions = ['Payment Received', '15 Days', '30 Days', 'Custom'];

const PaymentDropdown = ({onExpand}) => {
  const [selectedOption, setSelectedOption] = useState('Payment Received');
  const [dropdownVisible, setDropdownVisible] = useState(false); // Open by default
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customDays, setCustomDays] = useState('');

  const onOptionPress = option => {
    if (option === 'Custom') {
      // open the custom input instead of just selecting
      setShowCustomInput(true);
      setDropdownVisible(false);
    } else {
      setSelectedOption(option);
      setShowCustomInput(false);
      setDropdownVisible(false);
    }
  };

  const confirmCustom = () => {
    const days = customDays.trim();
    if (days && !isNaN(days)) {
      setSelectedOption(`${days} Days`);
      setCustomDays('');
      setShowCustomInput(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Payment Status</Text>

      {/* Header */}
      <TouchableOpacity
        style={styles.dropdownHeader}
        onPress={() => {
          const newValue = !dropdownVisible;
          setDropdownVisible(newValue);
          setShowCustomInput(false);
          // Auto-scroll when opening
          if (newValue && onExpand) {
            setTimeout(() => {
              onExpand();
            }, 100);
          }
        }}
        activeOpacity={0.8}>
        <Text style={styles.selectedText}>{selectedOption}</Text>
        <Icon
          name={dropdownVisible ? 'chevron-up-outline' : 'chevron-down-outline'}
          size={20}
          color="#999"
        />
      </TouchableOpacity>

      {/* Options List */}
      {dropdownVisible && (
        <View style={styles.dropdownBody}>
          {paymentOptions.map(option => (
            <TouchableOpacity
              key={option}
              style={[
                styles.option,
                option === 'Custom' && styles.customOption,
              ]}
              onPress={() => onOptionPress(option)}>
              <Text
                style={[
                  styles.optionText,
                  option === 'Custom' && styles.customText,
                ]}>
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Custom Days Input */}
      {showCustomInput && (
        <View style={styles.customInputContainer}>
          <TextInput
            style={styles.customInput}
            value={customDays}
            onChangeText={setCustomDays}
            placeholder="Enter number of days"
            placeholderTextColor="#999"
            keyboardType="numeric"
            returnKeyType="done"
            onSubmitEditing={confirmCustom}
          />
          <TouchableOpacity
            style={[
              styles.confirmButton,
              customDays.trim() && styles.confirmButtonActive,
            ]}
            onPress={confirmCustom}>
            <Text
              style={[
                styles.confirmText,
                customDays.trim() && styles.confirmTextActive,
              ]}>
              OK
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 16,
  },
  label: CommonLabelStyles.label,
  dropdownHeader: {
    ...CommonDropdownStyles.dropdownInput,
    borderRadius: 10,
    padding: 12,
    paddingHorizontal: undefined,
    paddingVertical: undefined,
  },
  selectedText: {
    color: '#666',
  },
  dropdownBody: {
    marginTop: 4,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
  option: {
    padding: 14,
  },
  optionText: {
    color: '#000',
  },
  customOption: {
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    backgroundColor: '#fafafa',
  },
  customText: {
    color: '#555',
  },
  customInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  customInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
  },
  confirmButton: {
    marginLeft: 8,
    backgroundColor: '#f1f1f1',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
  },
  confirmButtonActive: {
    backgroundColor: Colors.primary,
  },
  confirmText: {
    color: '#555',
    fontSize: 16,
  },
  confirmTextActive: {
    color: '#fff',
  },
});

export default PaymentDropdown;
