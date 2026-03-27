import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  FlatList,
  TextInput,
  Platform,
  TouchableWithoutFeedback,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Feather from 'react-native-vector-icons/Feather';
import Colors from '../../../../utils/Colors';
import Header from '../../../common/Header';
import CustomCalendar from '../../../common/Calender';
import { Icons } from '../../../../utils/Icons';

const TotalStock = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { warehouse } = route.params || {};

  // Dummy data for total stock items
  const totalStockItems = [
    {
      id: 'ts-1',
      name: 'Black JBL',
      sku: 'PRD-1002-ABC',
      value: '₹189,500',
      quantity: '23 items',
    },
    {
      id: 'ts-2',
      name: 'Nebula Mining Tools',
      sku: 'PRD-1002-ABC',
      value: '₹210,250',
      quantity: '23 items',
    },
    {
      id: 'ts-3',
      name: 'Palladium Power Cells',
      sku: 'PRD-1002-ABC',
      value: '₹95,750',
      quantity: '23 items',
    },
    {
      id: 'ts-4',
      name: 'Palladium Power Cells',
      sku: 'PRD-1002-ABC',
      value: '₹95,750',
      quantity: '23 items',
    },
    {
      id: 'ts-5',
      name: 'Palladium Power Cells',
      sku: 'PRD-1002-ABC',
      value: '₹95,750',
      quantity: '23 items',
    },
  ];

  // Search state
  const [searchText, setSearchText] = useState('');

  // Date range state
  const [selectedPeriod, setSelectedPeriod] = useState('');

  // Filter items based on search text
  const filteredItems = totalStockItems.filter(
    item =>
      item.name.toLowerCase().includes(searchText.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchText.toLowerCase()),
  );

  const renderStockItem = ({ item }) => (
    <View style={styles.stockItem}>
      <View style={styles.itemLeft}>
        <View style={styles.itemIcon}>
          <Icons.Box height={26} width={26} />
        </View>
        <View style={styles.itemInfo}>
          <Text style={styles.itemName}>{item.name}</Text>
          <Text style={styles.itemSku}>{item.sku}</Text>
        </View>
      </View>

      <View style={styles.itemRight}>
        <Text style={styles.itemValue}>{item.value}</Text>
        <Text style={styles.itemQuantity}>{item.quantity}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Header
        title="Total Stock"
        leftIcon="chevron-left"
        onLeftPress={() => navigation.goBack()}
      />

      {/* Calendar Filter Section - like SalesScreen */}
      <View style={styles.filterSection}>
        <View style={styles.filterButton}>
          <CustomCalendar
            label="Period"
            style={{ paddingHorizontal: 0, paddingVertical: 0, backgroundColor: 'transparent' }}
            containerStyle={{ backgroundColor: 'transparent', borderRadius: 0, paddingHorizontal: 0 }}
            width="auto"
            onDateRangeChange={({ startDate, endDate }) => {
              if (startDate && endDate) {
                setSelectedPeriod(`${startDate} to ${endDate}`);
              } else if (startDate && !endDate) {
                setSelectedPeriod(startDate);
              } else if (!startDate && !endDate) {
                setSelectedPeriod('');
              }
            }}
          />
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Summary Card */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryNumber}>1042</Text>
          <Text style={styles.summaryTitle}>Total stock</Text>

          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>0.75</Text>
              <Text style={styles.summaryLabel}>Number of SKUs</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>23</Text>
              <Text style={styles.summaryLabel}>Quantity</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>₹125,000</Text>
              <Text style={styles.summaryLabel}>Value (INR)</Text>
            </View>
          </View>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchInput}>
            <Feather name="search" size={16} color="#666" />
            <TextInput
              style={styles.searchTextInput}
              placeholder="Search"
              placeholderTextColor="#666"
              value={searchText}
              onChangeText={setSearchText}
            />
          </View>
        </View>

        {/* Stock Items List */}
        <View style={styles.listContainer}>
          <FlatList
            data={filteredItems}
            removeClippedSubviews={false}
            renderItem={renderStockItem}
            keyExtractor={item => item.id}
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f8fa',
  },
  content: {
    flex: 1,
    padding: 12,
    paddingBottom: 20,
  },
  summaryCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
  },
  summaryTitle: {
    fontSize: 12,
    fontWeight: '400',
    color: '#667085',
    marginBottom: 8,
  },
  summaryNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
    fontWeight: '600',
  },
  summaryLabel: {
    fontSize: 12,
    color: '#667085',
    textAlign: 'center',
    fontWeight: '400',
  },
  summaryDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 8,
  },
  searchContainer: {
    marginBottom: 16,
  },
  searchInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === 'ios' ? 14 : 12,
    borderWidth: 1,
    borderColor: Colors.border,
    minHeight: Platform.OS === 'ios' ? 50 : undefined,
  },
  searchTextInput: {
    flex: 1,
    fontSize: Platform.OS === 'ios' ? 16 : 16,
    color: '#333',
    marginLeft: 12,
    paddingVertical: Platform.OS === 'ios' ? 4 : 0,
  },
  stockItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: Colors.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 8,
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  itemIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  itemSku: {
    fontSize: 10,
    color: '#667085',
    marginBottom: 2,
  },
  itemCategory: {
    fontSize: 12,
    color: '#999',
  },
  itemRight: {
    alignItems: 'flex-end',
  },
  itemValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111111',
    marginBottom: 4,
  },
  itemQuantity: {
    fontSize: 10,
    color: '#667085',
    fontWeight: '400',
  },
  filterSection: {
    paddingTop: 10
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: Colors.border,
    justifyContent: 'space-between',
    marginLeft: 12,
    alignSelf: 'flex-start',
  },
});

export default TotalStock;
