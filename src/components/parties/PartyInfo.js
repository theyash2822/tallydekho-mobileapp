import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import Colors from '../../utils/Colors';
import Icon from 'react-native-vector-icons/Ionicons';

const PartyInfo = () => {
  const [partyType, setPartyType] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const partyTypes = ['Other', 'Party', 'Vendor', 'Supplier'];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Party Information</Text>
      <Text style={styles.label}>Party Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Party A"
        placeholderTextColor={'#8F939E'}
      />

      <Text style={styles.label}>Party Type</Text>
      <TouchableOpacity
        style={styles.dropdown}
        onPress={() => setShowDropdown(prev => !prev)}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <Text style={{color: partyType ? '#000' : '#aaa'}}>
            {partyType || 'Party, Vendor, Supplier'}
          </Text>
          <Icon
            name={showDropdown ? 'chevron-up' : 'chevron-down'}
            size={18}
            color="#8F939E"
          />
        </View>
      </TouchableOpacity>

      {showDropdown && (
        <View style={styles.dropdownList}>
          {partyTypes.map(item =>
            item === 'Other' ? (
              <TouchableOpacity
                key={item}
                onPress={() => {
                  // Optionally open modal here
                  setPartyType(item);
                  setShowDropdown(false);
                }}
                style={styles.dropdownItem}>
                <View style={styles.otherRow}>
                  <Icon name="add" size={24} color="#8F939E" />
                  <Text style={{marginLeft: 8, color: '#8F939E'}}>Other</Text>
                </View>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                key={item}
                onPress={() => {
                  setPartyType(item);
                  setShowDropdown(false);
                }}
                style={styles.dropdownItem}>
                <Text>{item}</Text>
              </TouchableOpacity>
            ),
          )}
        </View>
      )}

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <Text style={styles.label}>GSTIN/VAT Number</Text>
        <Text style={styles.label}>
          <Text style={{color: 'red'}}>*</Text> India GST Format
        </Text>
      </View>

      <TextInput
        style={styles.input}
        placeholder="GSTIN/VAT Number"
        placeholderTextColor={'#8F939E'}
      />

      <Text style={styles.label}>Contact Information</Text>
      <TextInput
        style={styles.input}
        placeholder="Phone number"
        placeholderTextColor={'#8F939E'}
        keyboardType="phone-pad"
      />
      <View style={{marginTop: 5}}></View>
      <TextInput
        style={styles.input}
        placeholder="Email address"
        placeholderTextColor={'#8F939E'}
        keyboardType="email-address"
      />

      <Text style={styles.label}>Address</Text>
      <TextInput
        style={styles.input}
        placeholder="Address 1"
        placeholderTextColor={'#8F939E'}
      />

      <TouchableOpacity style={styles.addButton}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Icon name="add" size={20} color="#8F939E" style={{marginRight: 4}} />
          <Text style={styles.addButtonText}>Add address</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    flex: 1,
  },
  title: {
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 4,
    color: '#494D58',
    fontSize: 16,
  },
  label: {
    fontWeight: '400',
    marginTop: 12,
    marginBottom: 4,
    color: '#8F939E',
    fontSize: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#fff',
    color: '#1F1F1F',
  },
  dropdown: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#fff',
  },
  dropdownList: {
    backgroundColor: '#fff',
    borderColor: Colors.border,
    borderWidth: 1,
    borderRadius: 8,
    marginTop: 4,
  },
  otherRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dropdownItem: {
    padding: 12,
    // borderBottomColor: Colors.border,
    // borderBottomWidth: 1,
  },
  addButton: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#F4F5FA',
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  addButtonText: {
    color: '#8F939E',
    fontWeight: '500',
  },
});

export default PartyInfo;
