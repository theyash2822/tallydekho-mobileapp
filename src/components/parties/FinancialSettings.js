import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import AmountInputWithCurrency from '../notes/AmountWithCurrency';
import Colors from '../../utils/Colors';

const FinancialSettings = () => {
  const [paymentTerm, setPaymentTerm] = useState('');
  const [showTermsDropdown, setShowTermsDropdown] = useState(false);
  const [tags, setTags] = useState(['Party', 'Vendor', 'Supplier']);

  const paymentTerms = ['Net 7', 'Net 15', 'Net 30'];

  return (
    <>
      <View style={styles.container}>
        <Text style={styles.sectionTitle}>Financial Settings</Text>

        <AmountInputWithCurrency label="Credit Limits" />
        {/* Default Payment Terms */}
        <Text style={styles.label}>Default Payment Terms</Text>
        <TouchableOpacity
          style={styles.dropdownBox}
          onPress={() => setShowTermsDropdown(!showTermsDropdown)}>
          <Text style={styles.placeholder}>
            {paymentTerm || 'Net 7, 15, 30, etc.'}
          </Text>
          <Icon
            name={showTermsDropdown ? 'chevron-up' : 'chevron-down'}
            size={16}
            color="#8F939E"
          />
        </TouchableOpacity>

        {showTermsDropdown && (
          <View style={styles.dropdownList}>
            <TouchableOpacity style={styles.dropdownItem}>
              <Icon name="add" size={16} color="#8F939E" />
              <Text style={styles.customText}>Custom</Text>
            </TouchableOpacity>
            {paymentTerms.map(term => (
              <TouchableOpacity
                key={term}
                onPress={() => {
                  setPaymentTerm(term);
                  setShowTermsDropdown(false);
                }}
                style={styles.dropdownItem}>
                <Text>{term}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginTop: 10,
  },
  sectionTitle: {
    fontWeight: '600',
    fontSize: 16,
    marginBottom: 12,
    color: '#2A2A2A',
  },
  label: {
    fontWeight: '500',
    fontSize: 12,
    color: '#8F939E',
    marginTop: 8,
  },
  optionalText: {
    fontWeight: '400',
    fontSize: 12,
    color: '#C4C4C4',
  },
  dropdownBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
    backgroundColor: '#fff',
  },
  placeholder: {
    color: '#8F939E',
  },
  dropdownList: {
    backgroundColor: '#fff',
    borderColor: Colors.border,
    borderWidth: 1,
    borderRadius: 8,
    marginTop: 4,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    gap: 6,
  },
  customText: {
    color: '#8F939E',
  },
});

export default FinancialSettings;
