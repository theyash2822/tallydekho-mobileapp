import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ScrollView,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/Feather';

import CustomSwitch from '../common/CustomSwitch';
import AmountInputWithCurrency from '../notes/AmountWithCurrency';
import ProductDescription from './ProductDescription';
import Colors from '../../utils/Colors';

const ProductandSevices = ({
  showInvoice = true,
  showDispatch = false,
  showDeliveryLocation = false,
  showSwitch = true,
  showAmountWithcurrency = false,
  showDescription = true,
  title = 'Product/Services',
  allProducts = [],
  onProductSelect = () => {},
}) => {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [search, setSearch] = useState('');

  const toggleDropdown = () => setDropdownVisible(!dropdownVisible);

  const defaultProducts = [
    'Samsung Galaxy J1 Bluetooth',
    'Earphones',
    'JBL Headset',
    'Airpods',
  ];
  const productOptions = allProducts.length > 0 ? allProducts : defaultProducts;

  const handleSelect = name => {
    if (!selectedProducts.includes(name)) {
      const updated = [...selectedProducts, name];
      setSelectedProducts(updated);
      onProductSelect(name);
    }
    setSearch('');
    setDropdownVisible(false);
  };

  const handleRemove = name => {
    setSelectedProducts(selectedProducts.filter(p => p !== name));
  };

  const filteredCustomers = productOptions.filter(c =>
    c.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>{title}</Text>

      {/* Invoice Block */}
      {showInvoice && (
        <>
          <Text style={styles.subHeading}>Invoices</Text>
          <View style={styles.entryRow}>
            <Text style={styles.entryLabel}>Invoices</Text>
            <Ionicons name="chevron-down" size={20} color="#898E9A" />
          </View>
        </>
      )}

      {/* Product Selection */}
      <Text style={styles.subHeading}>Select Product</Text>
      <View style={styles.addCustomerBox}>
        <View style={styles.customerBoxContent}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chipContainer}>
            {selectedProducts.length > 0 ? (
              selectedProducts.map((product, index) => (
                <View key={index} style={styles.chip}>
                  <Text numberOfLines={1} style={{maxWidth: 100}}>
                    {product}
                  </Text>
                  <TouchableOpacity onPress={() => handleRemove(product)}>
                    <Ionicons name="close" size={14} style={{marginLeft: 4}} />
                  </TouchableOpacity>
                </View>
              ))
            ) : (
              <Text style={{color: Colors.secondaryText}}>Select Products</Text>
            )}
          </ScrollView>

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

      {/* Dropdown */}
      {dropdownVisible && (
        <View style={styles.dropdown}>
          {/* Search bar */}
          <View style={styles.searchBox}>
            <Ionicons
              name="search"
              size={18}
              color="#8F939E"
              style={{marginRight: 6}}
            />
            <TextInput
              placeholder="Search for Products..."
              style={styles.input}
              value={search}
              onChangeText={setSearch}
              placeholderTextColor={Colors.secondaryText}
            />
          </View>

          {/* Product List */}
          <View style={styles.dropdownListSection}>
            <TouchableOpacity style={styles.addNew}>
              <Ionicons name="add" size={22} color={Colors.IconColor} />
              <Text style={styles.addNewText}>Add New Product</Text>
            </TouchableOpacity>

            <FlatList
              data={filteredCustomers}
              keyExtractor={item => item}
              removeClippedSubviews={false}
              scrollEnabled={false}
              renderItem={({item}) => (
                <TouchableOpacity
                  style={styles.customerItem}
                  onPress={() => handleSelect(item)}>
                  <View style={styles.dropdownItemContainer}>
                    <Icon name="home" size={22} color="#8F939E" />
                    <Text style={styles.customerText}>{item}</Text>
                  </View>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      )}

      {/* Amount Input */}
      {showAmountWithcurrency && (
        <>
          <AmountInputWithCurrency />
        </>
      )}

      <View style={{marginTop: 15}}></View>

      {showDispatch && (
        <>
          <Text style={[styles.subHeading, {marginBottom: 15}]}>
            Dispatch Reference Number
          </Text>
          <View
            style={[styles.entryDispatchRow, {backgroundColor: Colors.white}]}>
            <TextInput
              style={[styles.entryLabel, {color: Colors.black}]}
              placeholder="Enter Reference Number"
              placeholderTextColor="#8F939E"

              // keyboardType="numeric"
              // inputMode="numeric"
              // maxLength={10}
            />
          </View>
        </>
      )}

      {showDeliveryLocation && (
        <>
          <Text style={styles.subHeading}>Delivery Location</Text>
          <View style={styles.entryRow}>
            <Text style={styles.entryLabel}>Purpose of the entry</Text>
            <Ionicons name="chevron-down" size={20} color="#898E9A" />
          </View>
        </>
      )}

      {showSwitch && (
        <>
          <View style={styles.deliveryAddress}>
            <CustomSwitch />
            <Text style={styles.deliveryLabel}>Different delivery address</Text>
          </View>
        </>
      )}
      {showDescription && <ProductDescription />}
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
    marginTop: 10,
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
  entryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    padding: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    backgroundColor: '#ECEFF7',
    paddingHorizontal: 10,
    paddingVertical: 8,
    justifyContent: 'space-between',
  },
  entryLabel: {
    flex: 1,
    color: Colors.secondaryText,
    fontSize: 14,
    fontWeight: '500',
  },
  addCustomerBox: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 6,
    padding: 8,
    width: '100%',
    backgroundColor: Colors.white,
  },
  customerBoxContent: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    padding: 2,
    backgroundColor: Colors.white,
  },

  chipContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f2fa',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginRight: 8,
  },
  dropdown: {
    marginTop: 12,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  dropdownItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 4,
    borderBottomColor: Colors.border,
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
  input: {
    flex: 1,
    height: 40,
    fontSize: 14,
    color: Colors.black,
  },
  dropdownListSection: {
    backgroundColor: Colors.white,
    padding: 8,
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
    color: Colors.secondaryText,
  },
  amounttext: {
    marginTop: 8,
    fontWeight: '500',
    marginBottom: 6,
    color: Colors.secondaryText,
    fontSize: 12,
  },
  deliveryAddress: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  deliveryLabel: {
    marginLeft: 10,
    fontSize: 14,
    color: Colors.secondaryText,
    fontWeight: '500',
  },
  entryDispatchRow: {
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    backgroundColor: '#ECEFF7',
    paddingHorizontal: 10,
    paddingVertical: 1,
  },
});

export default ProductandSevices;
