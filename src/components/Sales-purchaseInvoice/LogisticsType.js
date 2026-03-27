import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Colors from '../../utils/Colors';

const LogisticsType = ({
  subHeading = 'Logistics type',
  LogisticsList = ['Air', 'Water', 'Land'],
  onCustomerSelect,
  showAddNew = true,
  onAddNewCustomer,
}) => {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedCustomers, setSelectedCustomers] = useState([]);

  const toggleDropdown = () => setDropdownVisible(!dropdownVisible);

  const handleSelect = name => {
    let updatedSelection = [];
    if (selectedCustomers.includes(name)) {
      updatedSelection = selectedCustomers.filter(item => item !== name);
    } else {
      updatedSelection = [...selectedCustomers, name];
    }
    setSelectedCustomers(updatedSelection);
    onCustomerSelect?.(updatedSelection); // Send array of selected items
  };

  const handleRemove = name => {
    const updated = selectedCustomers.filter(item => item !== name);
    setSelectedCustomers(updated);
    onCustomerSelect?.(updated);
  };

  const filteredCustomers = LogisticsList.filter(c =>
    c.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <View style={styles.container}>
      <Text style={styles.subHeading}>{subHeading}</Text>
      <View style={styles.addCustomerBox}>
        <View style={styles.customerBoxContent}>
          {selectedCustomers.length > 0 ? (
            <View style={{flexDirection: 'row', flexWrap: 'wrap', gap: 6}}>
              {selectedCustomers.map((item, index) => (
                <View key={index} style={styles.chip}>
                  <Text>{item}</Text>
                  <TouchableOpacity onPress={() => handleRemove(item)}>
                    <Ionicons name="close" size={14} style={{marginLeft: 4}} />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          ) : (
            <Text style={{color: '#666', flex: 1}}>Select Logistics</Text>
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
              placeholder="Search for Logistics..."
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
                <Text style={styles.addNewText}>New Logistics Type</Text>
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
                  <Ionicons name="sync" size={20} />
                  <Text style={styles.customerText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      )}
    </View>
  );
};
const styles = StyleSheet.create({
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
    padding: 12,
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
});

export default LogisticsType;
