import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import CustomSwitch from '../common/CustomSwitch';
import CustomDatePicker from './CustomDatePicker';
import LogisticsType from './LogisticsType';
import AmountInputWithCurrency from '../notes/AmountWithCurrency';
import Colors from '../../utils/Colors';

const LogisticsForm = () => {
  const [quantity, setQuantity] = useState(5000);
  const [value, setValue] = useState('');
  const taxOptions = ['GST', 'SGST', 'IGST'];

  const [selectedTax, setSelectedTax] = useState('');
  const [showTaxOptions, setShowTaxOptions] = useState(false);

  return (
    <View style={styles.mainContainer}>
      {/* Logistics Section */}
      <View style={styles.container}>
        <Text style={styles.label}>Logistics</Text>

        <LogisticsType />

        <AmountInputWithCurrency label="Logistics/Shipping Costs" />
        <View style={styles.switchRow}>
          <CustomSwitch />
          <Text style={styles.taxonlogistics}>Tax on Logistics</Text>
        </View>

        <View style={styles.row}>
          {/* Quantity Section */}

          <View style={{position: 'relative'}}>
            <Text style={styles.subLabel}>Select Tax Type</Text>
            <TouchableOpacity
              onPress={() => setShowTaxOptions(!showTaxOptions)}
              style={styles.dropdownButton}>
              <Text style={styles.dropdownText}>
                {selectedTax || 'Choose Tax Type'}
              </Text>
              <Feather name="chevron-down" size={20} color="#8F939E" />
            </TouchableOpacity>

            {showTaxOptions && (
              <View style={styles.dropdownListAbsolute}>
                {taxOptions.map((option, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => {
                      setSelectedTax(option);
                      setShowTaxOptions(false);
                    }}
                    style={styles.dropdownItem}>
                    <Text style={styles.dropdownItemText}>{option}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Unit Price Section */}
          <View>
            <Text style={styles.subLabel}>Amount</Text>
            <View style={styles.AmountContainer}>
              <TextInput
                style={styles.amountInput}
                placeholder="₹ 5000"
                placeholderTextColor="#8F939E"
                keyboardType="numeric"
              />
            </View>
          </View>
        </View>
        <View>
          <Text style={styles.subLabel}> Purchase Ref number</Text>
          <View style={styles.Textcontainer}>
            <TextInput
              style={styles.input}
              placeholder="Reference number"
              placeholderTextColor="#999"
              secureTextEntry={true} // Mask input (like a password field)
              value={value}
              onChangeText={setValue}
            />
          </View>

          <View>
            <Text style={styles.subLabel}>Due date</Text>
          </View>
          <CustomDatePicker />
          <View style={styles.switchRow}>
            <CustomSwitch />
            <Text style={styles.taxonlogistics}>Custom due date</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  container: {
    backgroundColor: Colors.white,
    padding: 16,
    borderRadius: 10,
    marginTop: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subLabel: {
    fontSize: 12,
    marginTop: 8,
    color: Colors.secondaryText,
  },
  dropdownListAbsolute: {
    position: 'absolute',
    top: 80, // adjust based on dropdownButton height
    left: 0,
    right: 0,
    zIndex: 10,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
  },

  Textcontainer: {
    marginTop: 6,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 10,
    paddingVertical: 4,
    paddingHorizontal: 10,
    backgroundColor: Colors.white,
  },
  input: {
    fontSize: 16,
    color: '#333',
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  taxonlogistics: {
    marginLeft: 10,
    fontSize: 12,
    color: Colors.secondaryText,
  },
  textArea: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
    height: 80,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.white,
    borderRadius: 8,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    width: 155,
    height: 50,
    marginTop: 5,
  },
  quantityText: {
    fontSize: 16,
    marginHorizontal: 10,
    color: Colors.secondaryText,
  },
  AmountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ECEFF7',
    borderRadius: 8,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    width: 155,
    height: 50,
    marginTop: 5,
  },
  amountInput: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  AmountText: {fontSize: 16, color: Colors.secondaryText},
  subLabel: {
    fontSize: 12,
    marginTop: 8,
    color: Colors.secondaryText,
  },
  textArea: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
    height: 80,
  },
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 12,
    width: 155,
    marginTop: 5,
    backgroundColor: Colors.white,
  },

  dropdownText: {
    fontSize: 14,
    color: Colors.secondaryText,
  },

  dropdownList: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    marginTop: 5,
    backgroundColor: Colors.white,
    width: 155,
    elevation: 3,
  },

  dropdownItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },

  dropdownItemText: {
    fontSize: 16,
    color: '#333',
  },
});

export default LogisticsForm;
