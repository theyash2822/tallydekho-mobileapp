import React, {useState, useMemo, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  FlatList,
  Modal,
  Alert,
  Platform,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Feather from 'react-native-vector-icons/Feather';
import Header from '../../../common/Header';
import Colors from '../../../../utils/Colors';
import {FilterDrawer} from '../../../filterdrawer';
import {Checkbox} from '../../../Helper/HelperComponents';

const ProductItem = React.memo(({item, isSelected, onToggleSelection}) => (
  <View style={styles.productItem}>
    <Checkbox
      checked={isSelected}
      onPress={() => onToggleSelection(item.id)}
      label=""
      style={{marginBottom: 0, marginRight: 8}}
    />

    <View style={styles.productInfo}>
      <Text style={styles.productName}>{item.name}</Text>
      <Text style={styles.productId}>{item.id}</Text>
    </View>

    <Text style={styles.quantity}>{item.quantity}</Text>
  </View>
));

const StockBarcode = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);

  // Filter states
  const [periodFilter, setPeriodFilter] = useState([]);
  const [groupFilter, setGroupFilter] = useState([]);
  const [statusFilter, setStatusFilter] = useState([]);

  const periodOptions = ['Today', 'Last 7 Days', 'Last 30 Days', 'This FY'];
  const groupOptions = ['Electronics', 'Audio', 'Accessories', 'Appliances'];
  const statusOptions = ['Available', 'Reserved', 'Damaged', 'In Transit'];

  // Dummy data for products with group and status
  const [products] = useState([
    // Audio Products
    {id: 'PRD-1002-ABC', name: 'Black JBL Speaker', quantity: 245, group: 'Audio', status: 'Available'},
    {id: 'PRD-1003-DEF', name: 'White JBL Speaker', quantity: 189, group: 'Audio', status: 'Available'},
    {id: 'PRD-1004-GHI', name: 'Red JBL Speaker', quantity: 156, group: 'Audio', status: 'Reserved'},
    {id: 'PRD-1005-JKL', name: 'Blue JBL Speaker', quantity: 234, group: 'Audio', status: 'Available'},
    {id: 'PRD-1006-MNO', name: 'Green JBL Speaker', quantity: 98, group: 'Audio', status: 'In Transit'},
    {id: 'PRD-1007-PQR', name: 'Yellow JBL Speaker', quantity: 167, group: 'Audio', status: 'Available'},
    {id: 'PRD-1008-STU', name: 'Purple JBL Speaker', quantity: 145, group: 'Audio', status: 'Damaged'},
    {id: 'PRD-1009-VWX', name: 'Orange JBL Speaker', quantity: 223, group: 'Audio', status: 'Available'},
    {id: 'PRD-1010-YZA', name: 'Sony WH-1000XM4', quantity: 78, group: 'Audio', status: 'Available'},
    {id: 'PRD-1011-BCD', name: 'Bose QuietComfort 35', quantity: 92, group: 'Audio', status: 'Reserved'},
    {id: 'PRD-1012-EFG', name: 'Samsung Galaxy Buds Pro', quantity: 156, group: 'Audio', status: 'Available'},
    {id: 'PRD-1013-HIJ', name: 'Apple AirPods Pro', quantity: 203, group: 'Audio', status: 'Available'},
    {id: 'PRD-1014-KLM', name: 'Beats Studio3 Wireless', quantity: 134, group: 'Audio', status: 'In Transit'},
    {id: 'PRD-1015-NOP', name: 'Jabra Elite 85t', quantity: 87, group: 'Audio', status: 'Available'},

    // Electronics
    {id: 'PRD-1016-QRS', name: 'iPhone 14 Pro Max', quantity: 45, group: 'Electronics', status: 'Available'},
    {id: 'PRD-1017-TUV', name: 'Samsung Galaxy S23 Ultra', quantity: 67, group: 'Electronics', status: 'Reserved'},
    {id: 'PRD-1018-WXY', name: 'MacBook Pro M2', quantity: 23, group: 'Electronics', status: 'Available'},
    {id: 'PRD-1019-ZAB', name: 'Dell XPS 13 Laptop', quantity: 34, group: 'Electronics', status: 'Available'},
    {id: 'PRD-1020-CDE', name: 'iPad Pro 12.9"', quantity: 56, group: 'Electronics', status: 'In Transit'},
    {id: 'PRD-1021-FGH', name: 'Samsung Galaxy Tab S9', quantity: 41, group: 'Electronics', status: 'Available'},
    {id: 'PRD-1022-IJK', name: 'Apple Watch Series 8', quantity: 89, group: 'Electronics', status: 'Available'},
    {id: 'PRD-1023-LMN', name: 'Samsung Galaxy Watch 6', quantity: 73, group: 'Electronics', status: 'Reserved'},
    {id: 'PRD-1024-OPQ', name: 'Nintendo Switch OLED', quantity: 112, group: 'Electronics', status: 'Available'},
    {id: 'PRD-1025-RST', name: 'PlayStation 5 Console', quantity: 28, group: 'Electronics', status: 'Damaged'},
    {id: 'PRD-1026-UVW', name: 'Xbox Series X Console', quantity: 31, group: 'Electronics', status: 'Available'},

    // Computer Accessories
    {id: 'PRD-1027-XYZ', name: 'Logitech MX Master 3 Mouse', quantity: 156, group: 'Accessories', status: 'Available'},
    {id: 'PRD-1028-ABC', name: 'Apple Magic Keyboard', quantity: 89, group: 'Accessories', status: 'Available'},
    {id: 'PRD-1029-DEF', name: 'Corsair K100 RGB Keyboard', quantity: 67, group: 'Accessories', status: 'Reserved'},
    {id: 'PRD-1030-GHI', name: 'BenQ PD2700U Monitor', quantity: 34, group: 'Accessories', status: 'Available'},
    {id: 'PRD-1031-JKL', name: 'LG 27UK850-W Monitor', quantity: 42, group: 'Accessories', status: 'In Transit'},
    {id: 'PRD-1032-MNO', name: 'Samsung Odyssey G9 Monitor', quantity: 18, group: 'Accessories', status: 'Available'},
    {id: 'PRD-1033-PQR', name: 'WD My Passport 2TB SSD', quantity: 234, group: 'Accessories', status: 'Available'},
    {id: 'PRD-1034-STU', name: 'SanDisk Extreme Pro 1TB', quantity: 189, group: 'Accessories', status: 'Available'},
    {id: 'PRD-1035-VWX', name: 'Seagate Expansion 4TB HDD', quantity: 76, group: 'Accessories', status: 'Damaged'},

    // Smart Home (Appliances)
    {id: 'PRD-1036-YZA', name: 'Amazon Echo Dot 4th Gen', quantity: 298, group: 'Appliances', status: 'Available'},
    {id: 'PRD-1037-BCD', name: 'Google Nest Mini', quantity: 245, group: 'Appliances', status: 'Available'},
    {id: 'PRD-1038-EFG', name: 'Apple HomePod Mini', quantity: 167, group: 'Appliances', status: 'Reserved'},
    {id: 'PRD-1039-HIJ', name: 'Philips Hue Starter Kit', quantity: 89, group: 'Appliances', status: 'Available'},
    {id: 'PRD-1040-KLM', name: 'Ring Video Doorbell Pro', quantity: 134, group: 'Appliances', status: 'In Transit'},
    {id: 'PRD-1041-NOP', name: 'Nest Learning Thermostat', quantity: 67, group: 'Appliances', status: 'Available'},
    {id: 'PRD-1042-QRS', name: 'Samsung SmartThings Hub', quantity: 45, group: 'Appliances', status: 'Available'},
    {id: 'PRD-1043-TUV', name: 'Wyze Cam v3 Security Camera', quantity: 178, group: 'Appliances', status: 'Available'},
    {id: 'PRD-1044-WXY', name: 'Arlo Pro 4 Security Camera', quantity: 92, group: 'Appliances', status: 'Damaged'},

    // Gaming (Electronics)
    {id: 'PRD-1045-ZAB', name: 'Razer DeathAdder V3 Pro', quantity: 123, group: 'Electronics', status: 'Available'},
    {id: 'PRD-1046-CDE', name: 'SteelSeries Arctis Pro Wireless', quantity: 87, group: 'Audio', status: 'Available'},
    {id: 'PRD-1047-FGH', name: 'Logitech G Pro X Superlight', quantity: 156, group: 'Accessories', status: 'Reserved'},
    {id: 'PRD-1048-IJK', name: 'Corsair Vengeance RGB Pro RAM', quantity: 234, group: 'Electronics', status: 'Available'},
    {id: 'PRD-1049-LMN', name: 'NVIDIA RTX 4080 Graphics Card', quantity: 12, group: 'Electronics', status: 'In Transit'},
    {id: 'PRD-1050-OPQ', name: 'AMD Ryzen 9 7950X CPU', quantity: 23, group: 'Electronics', status: 'Available'},
    {
      id: 'PRD-1051-RST',
      name: 'ASUS ROG Strix B650-F Motherboard',
      quantity: 45,
      group: 'Electronics',
      status: 'Available',
    },
    {id: 'PRD-1052-UVW', name: 'Corsair RM850x Power Supply', quantity: 67, group: 'Electronics', status: 'Available'},

    // Mobile Accessories
    {id: 'PRD-1053-XYZ', name: 'Anker PowerCore 20000mAh', quantity: 189, group: 'Accessories', status: 'Available'},
    {
      id: 'PRD-1054-ABC',
      name: 'Belkin Boost Charge Wireless Pad',
      quantity: 145,
      group: 'Accessories',
      status: 'Reserved',
    },
    {id: 'PRD-1055-DEF', name: 'Spigen Tough Armor Case', quantity: 267, group: 'Accessories', status: 'Available'},
    {id: 'PRD-1056-GHI', name: 'OtterBox Defender Series Case', quantity: 198, group: 'Accessories', status: 'Available'},
    {id: 'PRD-1057-JKL', name: 'PopSockets PopGrip', quantity: 345, group: 'Accessories', status: 'In Transit'},
    {id: 'PRD-1058-MNO', name: 'Moment Tele Lens 58mm', quantity: 78, group: 'Accessories', status: 'Available'},
    {id: 'PRD-1059-PQR', name: 'DJI OM 5 Gimbal Stabilizer', quantity: 56, group: 'Accessories', status: 'Available'},
    {id: 'PRD-1060-STU', name: 'GoPro HERO11 Black', quantity: 34, group: 'Electronics', status: 'Damaged'},

    // Office & Productivity (Appliances)
    {id: 'PRD-1061-VWX', name: 'Canon PIXMA TS8320 Printer', quantity: 89, group: 'Appliances', status: 'Available'},
    {id: 'PRD-1062-YZA', name: 'HP LaserJet Pro M404n', quantity: 67, group: 'Appliances', status: 'Reserved'},
    {id: 'PRD-1063-BCD', name: 'Brother HL-L2350DW Printer', quantity: 123, group: 'Appliances', status: 'Available'},
    {id: 'PRD-1064-EFG', name: 'Epson EcoTank ET-4760', quantity: 78, group: 'Appliances', status: 'Available'},
  ]);

  const toggleSelection = useCallback((productId) => {
    setSelectedItems(prev => {
      const newSelected = new Set(prev);
      if (newSelected.has(productId)) {
        newSelected.delete(productId);
      } else {
        newSelected.add(productId);
      }
      return newSelected;
    });
  }, []);

  const handleAddToPrintQueue = useCallback(() => {
    if (selectedItems.size > 0) {
      navigation.navigate('print', {
        queueItems: products.filter(product => selectedItems.has(product.id)),
      });
    } else {
      // Show alert if no items are selected
      Alert.alert(
        'No Items Selected',
        'Please select at least one item to add to the print queue.',
      );
    }
  }, [selectedItems, products, navigation]);

  const removeFilter = useCallback((filterType, value) => {
    switch (filterType) {
      case 'period':
        setPeriodFilter(prev => prev.filter(item => item !== value));
        break;
      case 'group':
        setGroupFilter(prev => prev.filter(item => item !== value));
        break;
      case 'status':
        setStatusFilter(prev => prev.filter(item => item !== value));
        break;
    }
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      // Search filter
      const matchesSearch = 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.id.toLowerCase().includes(searchQuery.toLowerCase());

      // Group filter
      const matchesGroup = 
        groupFilter.length === 0 || groupFilter.includes(product.group);

      // Status filter
      const matchesStatus = 
        statusFilter.length === 0 || statusFilter.includes(product.status);

      // Period filter - for now, we'll just return true as we don't have date data
      // In a real app, you'd filter based on product.createdDate or product.updatedDate
      const matchesPeriod = periodFilter.length === 0;

      return matchesSearch && matchesGroup && matchesStatus && matchesPeriod;
    });
  }, [products, searchQuery, groupFilter, statusFilter, periodFilter]);

  // Filter callbacks
  const handlePeriodSelect = useCallback((value) => {
    setPeriodFilter(prev => {
      if (!prev.includes(value)) {
        return [...prev, value];
      }
      return prev;
    });
  }, []);

  const handlePeriodDeselect = useCallback((value) => {
    setPeriodFilter(prev => prev.filter(item => item !== value));
  }, []);

  const handleGroupSelect = useCallback((value) => {
    setGroupFilter(prev => {
      if (!prev.includes(value)) {
        return [...prev, value];
      }
      return prev;
    });
  }, []);

  const handleGroupDeselect = useCallback((value) => {
    setGroupFilter(prev => prev.filter(item => item !== value));
  }, []);

  const handleStatusSelect = useCallback((value) => {
    setStatusFilter(prev => {
      if (!prev.includes(value)) {
        return [...prev, value];
      }
      return prev;
    });
  }, []);

  const handleStatusDeselect = useCallback((value) => {
    setStatusFilter(prev => prev.filter(item => item !== value));
  }, []);

  const customFiltersConfig = useMemo(() => ({
    period: {
      label: 'Period',
      options: periodOptions.map(opt => ({key: opt, label: opt})),
      selected: periodFilter,
      onSelect: handlePeriodSelect,
      onDeselect: handlePeriodDeselect,
    },
    group: {
      label: 'Group',
      options: groupOptions.map(opt => ({key: opt, label: opt})),
      selected: groupFilter,
      onSelect: handleGroupSelect,
      onDeselect: handleGroupDeselect,
    },
    status: {
      label: 'Status',
      options: statusOptions.map(opt => ({key: opt, label: opt})),
      selected: statusFilter,
      onSelect: handleStatusSelect,
      onDeselect: handleStatusDeselect,
    },
  }), [
    periodFilter,
    groupFilter,
    statusFilter,
    periodOptions,
    groupOptions,
    statusOptions,
    handlePeriodSelect,
    handlePeriodDeselect,
    handleGroupSelect,
    handleGroupDeselect,
    handleStatusSelect,
    handleStatusDeselect,
  ]);

  return (
    <>
      <View style={styles.container}>
        {/* Custom Header */}
        <Header
          title="Barcode"
          leftIcon="chevron-left"
          onLeftPress={() => navigation.goBack()}
        />

        {/* Search and Filter Row */}
        <View style={styles.searchRow}>
          <View style={styles.searchSection}>
            <View style={styles.searchContainer}>
              <Feather name="search" size={20} color="#666" />
              <TextInput
                style={styles.searchInput}
                placeholder="Search"
                placeholderTextColor="#8F939E"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>
          </View>

          <TouchableOpacity
            style={styles.filterIconButton}
            onPress={() => setShowFilterDrawer(true)}
            activeOpacity={0.7}>
            <Feather name="filter" size={20} color="#666" />
          </TouchableOpacity>
        </View>

        {/* Product List */}
        <FlatList
          data={filteredProducts}
          removeClippedSubviews={false}
          keyExtractor={item => item.id}
          renderItem={({item}) => (
            <ProductItem
              item={item}
              isSelected={selectedItems.has(item.id)}
              onToggleSelection={toggleSelection}
            />
          )}
          style={styles.productList}
          showsVerticalScrollIndicator={false}
        />

        <View style={styles.printQueueSection}>
          <TouchableOpacity
            style={styles.printQueueButton}
            onPress={handleAddToPrintQueue}
            activeOpacity={0.8}>
            <Text style={styles.printQueueButtonText}>Add to Print Queue</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Filter Drawer */}
      <FilterDrawer
        visible={showFilterDrawer}
        onClose={useCallback(() => setShowFilterDrawer(false), [])}
        slideDirection="left"
        customFilters={customFiltersConfig}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f8fa',
  },
  // Filter Section
  filterSection: {
    marginHorizontal: 8,
    marginTop: 10,
    borderRadius: 12,
    zIndex: 10,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 8,
    marginTop: 12,
    gap: 12,
  },
  searchSection: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: 12,
    // borderWidth: 1,
    // borderColor: Colors.border,
    // padding: 12,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === 'ios' ? 14 : 14,
    minHeight: Platform.OS === 'ios' ? 50 : undefined,
    gap: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#111111',
    paddingVertical: 0
  },
  filterIconButton: {
    width: 50,
    height: 50,
    borderRadius: 8,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Product List
  productList: {
    flex: 1,
    marginHorizontal: 10,
    marginTop: 10,
  },
  productItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginBottom: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111111',
    marginBottom: 4,
  },
  productId: {
    fontSize: 14,
    color: '#666',
  },
  quantity: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111111',
  },
  // Print Queue Button Section
  printQueueSection: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    padding: 12,
    marginTop: 8,
  },
  // Print Queue Button
  printQueueButton: {
    backgroundColor: '#07624C',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: Platform.OS === 'ios' ? 10 : 0,
  },
  printQueueButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default StockBarcode;
