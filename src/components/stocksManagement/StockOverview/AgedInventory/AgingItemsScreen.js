import React, {useState, useRef, useCallback, useMemo} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  Dimensions,
  PanResponder,
  TouchableOpacity,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Feather from 'react-native-vector-icons/Feather';
import Header from '../../../common/Header';
import Colors from '../../../../utils/Colors';

const {width} = Dimensions.get('window');

const AgingItemsScreen = () => {
  const navigation = useNavigation();
  const [selectedPeriod, setSelectedPeriod] = useState('30');

  // Dummy data for aging items
  const agingItems = [
    // 30 Days or Less
    {
      id: '1',
      name: 'Black JBL Speaker',
      stock: '1,208',
      price: '₹125,000',
      daysAged: 25,
    },
    {
      id: '2',
      name: 'Blue JBL Speaker',
      stock: '1,024',
      price: '₹98,000',
      daysAged: 15,
    },
    {
      id: '3',
      name: 'Gray JBL Speaker',
      stock: '567',
      price: '₹58,000',
      daysAged: 5,
    },
    {
      id: '4',
      name: 'Pink JBL Speaker',
      stock: '892',
      price: '₹92,000',
      daysAged: 35,
    },
    {
      id: '5',
      name: 'Cyan JBL Speaker',
      stock: '756',
      price: '₹78,000',
      daysAged: 12,
    },
    {
      id: '6',
      name: 'Lime JBL Speaker',
      stock: '1,156',
      price: '₹115,000',
      daysAged: 28,
    },
    {
      id: '7',
      name: 'Teal JBL Speaker',
      stock: '634',
      price: '₹62,000',
      daysAged: 8,
    },
    {
      id: '8',
      name: 'Indigo JBL Speaker',
      stock: '987',
      price: '₹99,000',
      daysAged: 22,
    },
    // 31-60 Days
    {
      id: '9',
      name: 'White JBL Speaker',
      stock: '856',
      price: '₹89,000',
      daysAged: 45,
    },
    {
      id: '10',
      name: 'Purple JBL Speaker',
      stock: '1,387',
      price: '₹134,000',
      daysAged: 55,
    },
    {
      id: '11',
      name: 'Maroon JBL Speaker',
      stock: '723',
      price: '₹72,000',
      daysAged: 38,
    },
    {
      id: '12',
      name: 'Navy JBL Speaker',
      stock: '1,445',
      price: '₹145,000',
      daysAged: 42,
    },
    {
      id: '13',
      name: 'Olive JBL Speaker',
      stock: '567',
      price: '₹56,000',
      daysAged: 51,
    },
    {
      id: '14',
      name: 'Coral JBL Speaker',
      stock: '892',
      price: '₹89,000',
      daysAged: 33,
    },
    {
      id: '15',
      name: 'Gold JBL Speaker',
      stock: '1,234',
      price: '₹123,000',
      daysAged: 47,
    },
    {
      id: '16',
      name: 'Silver JBL Speaker',
      stock: '678',
      price: '₹67,000',
      daysAged: 59,
    },
    // 61-90 Days
    {
      id: '17',
      name: 'Red JBL Speaker',
      stock: '732',
      price: '₹76,000',
      daysAged: 67,
    },
    {
      id: '18',
      name: 'Orange JBL Speaker',
      stock: '678',
      price: '₹65,000',
      daysAged: 75,
    },
    {
      id: '19',
      name: 'Green JBL Speaker',
      stock: '1,156',
      price: '₹112,000',
      daysAged: 85,
    },
    {
      id: '20',
      name: 'Burgundy JBL Speaker',
      stock: '445',
      price: '₹44,000',
      daysAged: 62,
    },
    {
      id: '21',
      name: 'Turquoise JBL Speaker',
      stock: '1,567',
      price: '₹156,000',
      daysAged: 78,
    },
    {
      id: '22',
      name: 'Violet JBL Speaker',
      stock: '823',
      price: '₹82,000',
      daysAged: 69,
    },
    {
      id: '23',
      name: 'Amber JBL Speaker',
      stock: '934',
      price: '₹93,000',
      daysAged: 88,
    },
    {
      id: '24',
      name: 'Rose JBL Speaker',
      stock: '1,123',
      price: '₹112,000',
      daysAged: 71,
    },
    // 90+ Days
    {
      id: '25',
      name: 'Yellow JBL Speaker',
      stock: '943',
      price: '₹87,000',
      daysAged: 120,
    },
    {
      id: '26',
      name: 'Brown JBL Speaker',
      stock: '1,543',
      price: '₹156,000',
      daysAged: 95,
    },
    {
      id: '27',
      name: 'Silver JBL Speaker',
      stock: '1,234',
      price: '₹128,000',
      daysAged: 110,
    },
    {
      id: '28',
      name: 'Charcoal JBL Speaker',
      stock: '667',
      price: '₹66,000',
      daysAged: 135,
    },
    {
      id: '29',
      name: 'Crimson JBL Speaker',
      stock: '1,789',
      price: '₹178,000',
      daysAged: 142,
    },
    {
      id: '30',
      name: 'Azure JBL Speaker',
      stock: '456',
      price: '₹45,000',
      daysAged: 98,
    },
  ];

  const agingPeriods = [
    {key: '30', label: '30 Day'},
    {key: '60', label: '60 Day'},
    {key: '90', label: '90 Day'},
    {key: '120+', label: '120+ Day'},
  ];

  const handlePeriodSelect = useCallback(period => {
    setSelectedPeriod(period);
  }, []);

  // Filter items based on selected period
  const filteredAgingItems = useMemo(() => {
    if (selectedPeriod === '30') {
      return agingItems.filter(item => item.daysAged <= 30);
    } else if (selectedPeriod === '60') {
      return agingItems.filter(
        item => item.daysAged > 30 && item.daysAged <= 60,
      );
    } else if (selectedPeriod === '90') {
      return agingItems.filter(
        item => item.daysAged > 60 && item.daysAged <= 90,
      );
    } else if (selectedPeriod === '120+') {
      return agingItems.filter(item => item.daysAged > 90);
    }
    return agingItems; // Default: show all items
  }, [selectedPeriod]);

  const renderAgingItem = useCallback(({item}) => (
    <View style={styles.itemCard}>
      {/* Left Side - Icon and Product Info */}
      <View style={styles.leftSection}>
        {/* <View style={styles.itemIcon}>
          <Feather name="box" size={20} color="#16C47F" />
        </View> */}
        <View style={styles.productInfo}>
          <Text style={styles.productName}>{item.name}</Text>
          <Text style={styles.stockText}>{item.stock} Stock</Text>
        </View>
      </View>

      {/* Right Side - Price */}
      <View style={styles.rightSection}>
        <Text style={styles.priceText}>{item.price}</Text>
      </View>
    </View>
  ));

  return (
    <View style={styles.container}>
      {/* Custom Header */}
      <Header title="Aging Items" leftIcon="chevron-left" />

      {/* Aging Period Filter Tabs */}
      <View style={styles.filterContainer}>
        {agingPeriods.map((period, index) => (
          <View key={period.key} style={styles.filterWrapper}>
            <TouchableOpacity
              style={[
                styles.filterButton,
                selectedPeriod === period.key && styles.activeFilterButton,
              ]}
              onPress={() => handlePeriodSelect(period.key)}
              activeOpacity={0.7}>
              <Text
                style={[
                  styles.filterText,
                  selectedPeriod === period.key && styles.activeFilterText,
                ]}>
                {period.label}
              </Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      {/* List Item Header */}
      <View style={styles.listHeader}>
        <Text style={styles.listHeaderText}>List Item</Text>
      </View>

      {/* Aging Items List */}
      <FlatList
        data={filteredAgingItems}
        renderItem={renderAgingItem}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        removeClippedSubviews={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundColorPrimary,
  },
  filterContainer: {
    flexDirection: 'row',
    backgroundColor: '#f4f5fa',
    marginHorizontal: 12,
    marginTop: 10,
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  filterWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeFilterButton: {
    backgroundColor: '#FFFFFF',
  },
  filterText: {
    fontSize: 12,
    fontWeight: '400',
    color: '#8F939E',
    letterSpacing: 0.2,
  },
  activeFilterText: {
    color: '#1A1A1A',
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  listHeader: {
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  listHeaderText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  listContainer: {
    paddingHorizontal: 12,
    paddingBottom: 10,
  },
  itemCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 12,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderColor: '#F0F0F0',
    borderWidth: 1,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginLeft:4
  },
  itemIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F8FFFE',
    borderWidth: 2,
    borderColor: '#16C47F',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  stockText: {
    fontSize: 12,
    color: '#667085',
  },
  rightSection: {
    alignItems: 'flex-end',
  },
  priceText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
});

export default AgingItemsScreen;
