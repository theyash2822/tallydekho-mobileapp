import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Switch,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CustomSwitch from '../common/CustomSwitch';
import PersonalInfoForm from './PersonalInformation';
import Colors from '../../utils/Colors';

const PartyInformation = ({
  heading = 'Party Information',
  subHeading = 'Customer Name',
  customerList = [],
  entryLabel = 'Type',
  entrySubLabel = 'Optional (default)',
  onCustomerSelect,
  showEntryMode = true,
  showAddNew = true,
  showPersonalinformation = false,
  onAddNewCustomer,
}) => {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [search, setSearch] = useState('');

  const toggleDropdown = () => setDropdownVisible(!dropdownVisible);

  const handleSelect = name => {
    setSelectedCustomer(name);
    setSearch('');
    setDropdownVisible(false);
    onCustomerSelect?.(name); // Trigger callback
  };

  const handleRemove = () => setSelectedCustomer(null);

  const filteredCustomers = customerList.filter(c =>
    c.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>{heading}</Text>

      {showEntryMode && (
        <>
          <Text style={styles.subHeading}>Entry Mode</Text>
          <View style={styles.entryRow}>
            <Text style={styles.entryLabel}>{entryLabel}</Text>
            <View style={styles.switchGroup}>
              <Text style={styles.optionalText}>{entrySubLabel}</Text>
              <CustomSwitch />
            </View>
          </View>
        </>
      )}

      <Text style={styles.subHeading}>{subHeading}</Text>
      <View style={styles.addCustomerBox}>
        <View style={styles.customerBoxContent}>
          {selectedCustomer ? (
            <View style={styles.chip}>
              <Text>{selectedCustomer}</Text>
              <TouchableOpacity onPress={handleRemove}>
                <Ionicons name="close" size={14} style={{marginLeft: 4}} />
              </TouchableOpacity>
            </View>
          ) : (
            <Text style={{color: Colors.secondaryText, flex: 1}}>
              Select Customer
            </Text>
          )}
          <TouchableOpacity onPress={toggleDropdown}>
            <Ionicons
              name={dropdownVisible ? 'chevron-up' : 'chevron-down'}
              size={20}
              color={Colors.IconColor}
              style={{marginLeft: 8}}
            />
          </TouchableOpacity>
        </View>
      </View>

      {dropdownVisible && (
        <View style={styles.dropdown}>
          <View style={styles.searchBox}>
            <Ionicons
              name="search"
              size={18}
              color="#8F939E"
              style={{marginRight: 6}}
            />
            <TextInput
              placeholder="Search for parties..."
              style={styles.input}
              value={search}
              onChangeText={setSearch}
              placeholderTextColor={Colors.secondaryText}
            />
          </View>

          <View style={styles.dropdownListSection}>
            {showAddNew && (
              <TouchableOpacity
                style={styles.addNew}
                onPress={onAddNewCustomer}>
                <Ionicons name="add" size={22} color={Colors.IconColor} />
                <Text style={styles.addNewText}>Add New Customer</Text>
              </TouchableOpacity>
            )}

            <FlatList
              data={filteredCustomers}
              keyExtractor={item => item}
              removeClippedSubviews={false}
              scrollEnabled={false}
              renderItem={({item}) => (
                <TouchableOpacity
                  style={styles.customerItem}
                  onPress={() => handleSelect(item)}>
                  <Ionicons name="person" size={20} />
                  <Text style={styles.customerText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      )}

      {showPersonalinformation && (
        <>
          <PersonalInfoForm />
        </>
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    padding: 12,
    backgroundColor: Colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  heading: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.primaryTitle,
    marginBottom: 12,
  },
  subHeading: {
    fontWeight: '500',
    marginBottom: 6,
    color: Colors.secondaryText,
    fontSize: 12,
  },
  customerBoxContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  entryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    padding: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
  },
  entryLabel: {
    flex: 1,
    color: Colors.primaryTitle,
    fontSize: 14,
    fontWeight: '500',
  },
  switchBox: {
    flex: 1,
    alignItems: 'flex-end',
  },
  searchBox: {
    borderRadius: 10,
    marginTop: 4,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7F9FB',
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 8,
    marginLeft: 4,
    marginRight: 4,
  },
  addCustomerBox: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 6,
    padding: 8,
    width: '100%',
    backgroundColor: Colors.white,
  },
  chip: {
    flexDirection: 'row',
    backgroundColor: '#F0F2F9',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  dropdownListSection: {
    backgroundColor: Colors.white,
    padding: 8,
  },
  dropdownToggle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dropdown: {
    marginTop: 12,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  input: {
    flex: 1,
    height: 40,
    fontSize: 14,
    color: Colors.black,
  },
  addNew: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    borderRadius: 6,
  },
  addNewText: {
    marginLeft: 6,
    color: Colors.secondaryText,
  },
  customerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
  },
  customerText: {
    marginLeft: 8,
  },
  switchGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4, // Just a small gap between the text and switch
  },
  optionalText: {
    color: Colors.secondaryText,
    fontSize: 14,
    marginRight: 4,
  },
});

export default PartyInformation;
