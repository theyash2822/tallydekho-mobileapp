import React, {useState} from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Colors from '../../utils/Colors';
import {CommonLabelStyles, CommonDropdownStyles} from '../../utils/CommonStyles';

const CompleteInvoiceModal = ({visible, onClose}) => {
  const [status, setStatus] = useState('Paid');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [amount, setAmount] = useState('5000');
  const [method, setMethod] = useState('Cash');
  const [currency, setCurrency] = useState('INR');
  const [showDropdown, setShowDropdown] = useState(false);

  const handleDateChange = (_, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) setDate(selectedDate);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <View style={styles.headerRow}>
            <Text style={styles.title}>Complete Invoice</Text>
            <TouchableOpacity onPress={onClose}>
              <Icon name="close-outline" size={28} />
            </TouchableOpacity>
          </View>

          <Text style={styles.subText}>Invoice#001 Will Be Marked As Paid</Text>

          {/* Status */}
          <Text style={styles.label}>Status</Text>
          <TouchableOpacity
            style={styles.dropdown}
            onPress={() => setShowDropdown(!showDropdown)}>
            <Text>{status}</Text>
            <Icon
              name={showDropdown ? 'chevron-up' : 'chevron-down'}
              size={20}
            />
          </TouchableOpacity>

          {showDropdown && (
            <View style={styles.dropdownOptions}>
              {['Paid', 'Partial', 'Unpaid'].map(item => (
                <TouchableOpacity
                  key={item}
                  onPress={() => {
                    setStatus(item);
                    setShowDropdown(false);
                  }}
                  style={styles.dropdownItem}>
                  <Text>{item}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Date
          <Text style={styles.label}>Date</Text>
          <TouchableOpacity
            onPress={() => setShowDatePicker(true)}
            style={styles.datePicker}>
            <Text>{date.toLocaleDateString()}</Text>
            <Icon name="calendar-outline" size={20} />
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display={Platform.OS === 'ios' ? 'inline' : 'default'}
              onChange={handleDateChange}
            />
          )} */}

          {/* Amount */}
          <Text style={styles.label}>Amount</Text>
          <View style={styles.amountRow}>
            <TextInput
              style={styles.currencyInput}
              value={currency}
              editable={false}
            />
            <TextInput
              style={styles.amountInput}
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
            />
          </View>

          {/* Payment Method */}
          <Text style={styles.label}>Payment Methods</Text>
          {['Cash', 'Bank Transfer', 'Credit'].map(item => (
            <TouchableOpacity
              key={item}
              onPress={() => setMethod(item)}
              style={[
                styles.methodButton,
                {
                  borderColor: method === item ? '#0f766e' : '#e5e7eb',
                  backgroundColor: method === item ? '#e0f2f1' : 'white',
                },
              ]}>
              <View
                style={[
                  styles.radioCircle,
                  {
                    backgroundColor: method === item ? '#0f766e' : 'white',
                    borderColor: '#0f766e',
                  },
                ]}
              />
              <Text style={styles.methodText}>{item}</Text>
            </TouchableOpacity>
          ))}

          {/* Save Button */}
          <TouchableOpacity style={styles.saveButton}>
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: '#00000088',
    justifyContent: 'flex-end',
  },
  modal: {
    backgroundColor: '#F4F5FA',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {fontSize: 18, fontWeight: 'bold'},
  subText: {marginTop: 4, marginBottom: 12, color: '#8F939E'},
  label: {...CommonLabelStyles.label, marginTop: 10, marginBottom: 6},
  amountRow: {flexDirection: 'row', gap: 8},
  currencyInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    padding: 10,
    backgroundColor: 'white',
  },
  amountInput: {
    flex: 3,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    padding: 10,
    backgroundColor: 'white',
  },
  methodButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginTop: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  radioCircle: {
    height: 12,
    width: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginRight: 10,
  },

  dropdown: CommonDropdownStyles.dropdownInput,
  dropdownOptions: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    marginTop: 4,
    backgroundColor: '#fff',
  },
  dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  methodText: {fontSize: 16},
  saveButton: {
    backgroundColor: '#07624C',
    borderRadius: 8,
    marginTop: 20,
    padding: 14,
    alignItems: 'center',
  },
  saveButtonText: {color: 'white', fontWeight: 'bold'},
});

export default CompleteInvoiceModal;
