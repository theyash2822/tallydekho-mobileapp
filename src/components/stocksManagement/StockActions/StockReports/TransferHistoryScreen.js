import React, {useState, useCallback, useMemo} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StatusBar,
  Platform,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import {useNavigation} from '@react-navigation/native';
import Colors from '../../../../utils/Colors';
import {FilterDrawer} from '../../../filterdrawer';
import Header from '../../../common/Header';
import {Icons} from '../../../../utils/Icons';
import {useStockFilters} from '../../../../hooks/useStockFilters';

const TransferHistoryScreen = () => {
  const navigation = useNavigation();
  // Use custom hook for stock filters
  const {warehouseNames: warehouseOptions} = useStockFilters();
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);
  const [activeFilters, setActiveFilters] = useState({});
  
  // Actual filter state (applied filters)
  const [dateRange, setDateRange] = useState({startDate: '', endDate: ''});
  const [selectedSourceWarehouses, setSelectedSourceWarehouses] = useState([]);
  const [selectedDestinationWarehouses, setSelectedDestinationWarehouses] = useState([]);
  const [selectedStatuses, setSelectedStatuses] = useState([]);
  
  // Temporary filter state (for drawer - not applied until Apply is clicked)
  const [tempDateRange, setTempDateRange] = useState({startDate: '', endDate: ''});
  const [tempSourceWarehouses, setTempSourceWarehouses] = useState([]);
  const [tempDestinationWarehouses, setTempDestinationWarehouses] = useState([]);
  const [tempStatuses, setTempStatuses] = useState([]);
  
  const statusOptions = [
    {id: 'draft', label: 'Draft'},
    {id: 'in-transit', label: 'In Transit'},
    {id: 'received', label: 'Received'},
    {id: 'cancelled', label: 'Cancelled'},
  ];

  // Mock data for transfer history
  const transferHistory = [
    {
      id: 'TX-2456',
      status: 'In Transit',
      statusColor: '#16C47F',
      date: '08 July',
      origin: 'Main Warehouse',
      destination: 'North Branch',
      itemCount: 3,
      items: ['iPhone 15 Pro', 'Samsung Galaxy S24', 'MacBook Air M2'],
    },
    {
      id: 'TX-2455',
      status: 'Completed',
      statusColor: '#10B981',
      date: '07 July',
      origin: 'Central Hub',
      destination: 'West Storage',
      itemCount: 5,
      items: [
        'Dell XPS 13',
        'Sony WH-1000XM5',
        'Apple Watch Series 9',
        'iPad Air 5th Gen',
        'AirPods Pro',
      ],
    },
    {
      id: 'TX-2454',
      status: 'Pending',
      statusColor: '#F59E0B',
      date: '06 July',
      origin: 'South Depot',
      destination: 'East Facility',
      itemCount: 2,
      items: ['MacBook Pro M3', 'Samsung Galaxy Tab S9'],
    },
    {
      id: 'TX-2453',
      status: 'Completed',
      statusColor: '#10B981',
      date: '05 July',
      origin: 'Tech Warehouse',
      destination: 'Port Storage',
      itemCount: 4,
      items: [
        'iPhone 14 Pro',
        'Samsung Galaxy S23',
        'MacBook Air M1',
        'iPad Pro',
      ],
    },
    {
      id: 'TX-2452',
      status: 'In Transit',
      statusColor: '#16C47F',
      date: '04 July',
      origin: 'Metro Hub',
      destination: 'Suburban Depot',
      itemCount: 6,
      items: [
        'Dell Inspiron',
        'HP Pavilion',
        'Lenovo ThinkPad',
        'ASUS ROG',
        'Acer Swift',
        'MSI Gaming',
      ],
    },
    {
      id: 'TX-2451',
      status: 'Draft',
      statusColor: '#6B7280',
      date: '03 July',
      origin: 'Regional Center',
      destination: 'Local Storage',
      itemCount: 3,
      items: ['iPad Mini', 'Samsung Galaxy A54', 'OnePlus Nord'],
    },
    {
      id: 'TX-2450',
      status: 'Cancelled',
      statusColor: '#EF4444',
      date: '02 July',
      origin: 'West Storage',
      destination: 'Central Hub',
      itemCount: 4,
      items: ['MacBook Pro M2', 'iPhone 13', 'Samsung Galaxy S22', 'iPad Air'],
    },
    {
      id: 'TX-2449',
      status: 'Received',
      statusColor: '#10B981',
      date: '01 July',
      origin: 'North Branch',
      destination: 'Main Warehouse',
      itemCount: 7,
      items: [
        'Dell Latitude',
        'HP EliteBook',
        'Lenovo Yoga',
        'ASUS ZenBook',
        'Acer Aspire',
        'MSI Creator',
        'Razer Blade',
      ],
    },
    {
      id: 'TX-2448',
      status: 'In Transit',
      statusColor: '#16C47F',
      date: '30 June',
      origin: 'Port Storage',
      destination: 'Tech Warehouse',
      itemCount: 2,
      items: ['MacBook Air M3', 'Samsung Galaxy Tab S9 Ultra'],
    },
    {
      id: 'TX-2447',
      status: 'Completed',
      statusColor: '#10B981',
      date: '29 June',
      origin: 'Suburban Depot',
      destination: 'Metro Hub',
      itemCount: 5,
      items: [
        'iPhone 15',
        'Samsung Galaxy S24 Ultra',
        'MacBook Pro M3 Pro',
        'iPad Pro 12.9',
        'AirPods Max',
      ],
    },
    {
      id: 'TX-2446',
      status: 'Pending',
      statusColor: '#F59E0B',
      date: '28 June',
      origin: 'Local Storage',
      destination: 'Regional Center',
      itemCount: 3,
      items: ['Dell XPS 15', 'Sony WH-1000XM4', 'Apple Watch Ultra'],
    },
    {
      id: 'TX-2445',
      status: 'Draft',
      statusColor: '#6B7280',
      date: '27 June',
      origin: 'Central Hub',
      destination: 'West Storage',
      itemCount: 4,
      items: [
        'Lenovo ThinkPad X1',
        'HP Spectre',
        'ASUS ROG Strix',
        'MSI Raider',
      ],
    },
    {
      id: 'TX-2444',
      status: 'Cancelled',
      statusColor: '#EF4444',
      date: '26 June',
      origin: 'North Branch',
      destination: 'Main Warehouse',
      itemCount: 6,
      items: [
        'MacBook Pro M3 Max',
        'iPhone 15 Pro Max',
        'Samsung Galaxy Z Fold',
        'iPad Air 6th Gen',
        'Sony WH-1000XM5',
        'Apple Watch Series 9',
      ],
    },
    {
      id: 'TX-2443',
      status: 'Received',
      statusColor: '#10B981',
      date: '25 June',
      origin: 'South Depot',
      destination: 'Central Hub',
      itemCount: 3,
      items: ['Dell Precision', 'HP ZBook', 'Lenovo Legion'],
    },
  ];

  const filteredHistory = transferHistory.filter(transfer => {
    // Search filter
    const searchMatch =
      transfer.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transfer.origin.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transfer.destination.toLowerCase().includes(searchQuery.toLowerCase());

    if (!searchMatch) return false;

    // Status filter
    if (activeFilters.status && activeFilters.status !== 'In Transit') {
      if (transfer.status !== activeFilters.status) return false;
    }

    // Source warehouse filter
    if (activeFilters.sourceWarehouse) {
      if (transfer.origin !== activeFilters.sourceWarehouse) return false;
    }

    // Destination warehouse filter
    if (activeFilters.destinationWarehouse) {
      if (transfer.destination !== activeFilters.destinationWarehouse)
        return false;
    }

    // Date range filter
    if (activeFilters.fromDate) {
      // Convert transfer date to comparable format
      const transferDateParts = transfer.date.split(' ');
      const month = transferDateParts[1];
      const day = transferDateParts[0];

      // Simple month comparison for demo (in real app, use proper date parsing)
      const monthOrder = {
        June: 6,
        July: 7,
        August: 8,
        September: 9,
        October: 10,
        November: 11,
        December: 12,
      };

      const transferMonth = monthOrder[month] || 0;
      const transferDay = parseInt(day);

      // Compare with fromDate (YYYY-MM-DD format from CustomCalendar)
      const fromDateParts = activeFilters.fromDate.split('-');
      const fromYear = parseInt(fromDateParts[0]);
      const fromMonth = parseInt(fromDateParts[1]);
      const fromDay = parseInt(fromDateParts[2]);

      if (
        transferMonth < fromMonth ||
        (transferMonth === fromMonth && transferDay < fromDay)
      ) {
        return false;
      }
    }

    if (activeFilters.toDate) {
      const transferDateParts = transfer.date.split(' ');
      const month = transferDateParts[1];
      const day = transferDateParts[0];

      const monthOrder = {
        June: 6,
        July: 7,
        August: 8,
        September: 9,
        October: 10,
        November: 11,
        December: 12,
      };

      const transferMonth = monthOrder[month] || 0;
      const transferDay = parseInt(day);

      // Compare with toDate (YYYY-MM-DD format from CustomCalendar)
      const toDateParts = activeFilters.toDate.split('-');
      const toYear = parseInt(toDateParts[0]);
      const toMonth = parseInt(toDateParts[1]);
      const toDay = parseInt(toDateParts[2]);

      if (
        transferMonth > toMonth ||
        (transferMonth === toMonth && transferDay > toDay)
      ) {
        return false;
      }
    }

    return true;
  });

  const getStatusIcon = status => {
    switch (status) {
      case 'In Transit':
        return 'truck';
      case 'Completed':
      case 'Received':
        return 'check-circle';
      case 'Pending':
        return 'clock';
      case 'Draft':
        return 'edit-3';
      case 'Cancelled':
        return 'x-circle';
      default:
        return 'circle';
    }
  };

  const handleBackPress = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleFilterPress = useCallback(() => {
    // Initialize temporary states with current applied filters
    setTempDateRange({...dateRange});
    setTempSourceWarehouses([...selectedSourceWarehouses]);
    setTempDestinationWarehouses([...selectedDestinationWarehouses]);
    setTempStatuses([...selectedStatuses]);
    setShowFilterDrawer(true);
  }, [dateRange, selectedSourceWarehouses, selectedDestinationWarehouses, selectedStatuses]);

  // Source warehouse handlers (work with temporary state)
  const handleSourceWarehouseSelect = useCallback((value) => {
    setTempSourceWarehouses(prev => {
      if (!prev.includes(value)) {
        return [...prev, value];
      }
      return prev;
    });
  }, []);

  const handleSourceWarehouseDeselect = useCallback((value) => {
    setTempSourceWarehouses(prev => prev.filter(w => w !== value));
  }, []);

  const handleSourceWarehouseDeselectAll = useCallback(() => {
    setTempSourceWarehouses([]);
  }, []);

  // Destination warehouse handlers (work with temporary state)
  const handleDestinationWarehouseSelect = useCallback((value) => {
    setTempDestinationWarehouses(prev => {
      if (!prev.includes(value)) {
        return [...prev, value];
      }
      return prev;
    });
  }, []);

  const handleDestinationWarehouseDeselect = useCallback((value) => {
    setTempDestinationWarehouses(prev => prev.filter(w => w !== value));
  }, []);

  const handleDestinationWarehouseDeselectAll = useCallback(() => {
    setTempDestinationWarehouses([]);
  }, []);

  // Status handlers (work with temporary state)
  const handleStatusSelect = useCallback((value) => {
    setTempStatuses(prev => {
      if (!prev.includes(value)) {
        return [...prev, value];
      }
      return prev;
    });
  }, []);

  const handleStatusDeselect = useCallback((value) => {
    setTempStatuses(prev => prev.filter(s => s !== value));
  }, []);

  const handleStatusDeselectAll = useCallback(() => {
    setTempStatuses([]);
  }, []);

  // Apply filters when Apply button is clicked
  const handleApplyFilters = useCallback(() => {
    setDateRange({...tempDateRange});
    setSelectedSourceWarehouses([...tempSourceWarehouses]);
    setSelectedDestinationWarehouses([...tempDestinationWarehouses]);
    setSelectedStatuses([...tempStatuses]);
  }, [tempDateRange, tempSourceWarehouses, tempDestinationWarehouses, tempStatuses]);

  const handleReset = useCallback(() => {
    setActiveFilters({});
  }, []);

  const handleTransferPress = useCallback(
    transfer => {
      // Navigate to transfer details screen
      navigation.navigate('TransferDetails', {
        transferData: {
          ...transfer,
          items: transfer.items.map((item, index) => ({
            id: `PRD-${1000 + index}-${String.fromCharCode(
              65 + index,
            )}${String.fromCharCode(65 + index + 1)}${String.fromCharCode(
              65 + index + 2,
            )}`,
            name: item,
            price: `₹${Math.floor(Math.random() * 50000) + 25000}`,
            quantity: Math.floor(Math.random() * 5) + 1,
          })),
        },
      });
    },
    [navigation],
  );

  return (
    <>
      <View style={styles.container}>
        {/* <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" /> */}

        {/* Header */}
        <Header
          title="Transfer History"
          leftIcon="chevron-left"
          onLeftPress={handleBackPress}
          rightIcon="filter"
          rightIconType="Ionicons"
          onRightPress={handleFilterPress}
        />

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Feather name="search" size={16} color="#8F939E" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search"
              placeholderTextColor="#8F939E"
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoCorrect={false}
              autoCapitalize="none"
            />
          </View>
        </View>

        {/* Transfer History List */}
        <ScrollView
          style={styles.content}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          bounces={false}
          overScrollMode="never">
          {filteredHistory.map((transfer, index) => (
            <TouchableOpacity
              key={transfer.id}
              style={styles.transferCard}
              activeOpacity={0.7}
              onPress={() => handleTransferPress(transfer)}>
              {/* Status and Date Row */}
              <View style={styles.statusRow}>
                <View
                  style={[
                    styles.statusTag,
                    {backgroundColor: transfer.statusColor},
                  ]}>
                  <Feather
                    name={getStatusIcon(transfer.status)}
                    size={12}
                    color="#FFFFFF"
                  />
                  <Text style={styles.statusText}>{transfer.status}</Text>
                </View>
                <View style={styles.dateContainer}>
                  <View style={styles.dateBullet} />
                  <Text style={styles.dateText}>{transfer.date}</Text>
                </View>
              </View>

              {/* Transfer Route, TX ID, and Item Count Row */}
              <View style={styles.routeRow}>
                <View style={styles.routeSection}>
                  <View style={styles.routeIcon}>
                    <Icons.ArrowLeftRight />
                  </View>
                  <View style={styles.routeAndIdContainer}>
                    <Text style={styles.routeText}>
                      {transfer.origin}{' '}
                      <Text style={{color: '#8F939E'}}>To</Text>{' '}
                      {transfer.destination}
                    </Text>
                    <Text style={styles.transferId}>#{transfer.id}</Text>
                  </View>
                </View>
                <Text style={styles.itemCount}>{transfer.itemCount} Items</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Filter Drawer */}
      <FilterDrawer
        visible={showFilterDrawer}
        onClose={() => setShowFilterDrawer(false)}
        slideDirection="left"
        customFilters={useMemo(() => {
          return {
            dateRange: {
              label: 'Date Range',
              type: 'dateRange',
              value: tempDateRange,
              onChange: setTempDateRange,
            },
            sourceWarehouse: {
              label: 'Source Warehouse',
              options: warehouseOptions.map(opt => ({key: opt, label: opt})),
              selected: tempSourceWarehouses,
              onSelect: handleSourceWarehouseSelect,
              onDeselect: handleSourceWarehouseDeselect,
              onDeselectAll: handleSourceWarehouseDeselectAll,
            },
            destinationWarehouse: {
              label: 'Destination Warehouse',
              options: warehouseOptions.map(opt => ({key: opt, label: opt})),
              selected: tempDestinationWarehouses,
              onSelect: handleDestinationWarehouseSelect,
              onDeselect: handleDestinationWarehouseDeselect,
              onDeselectAll: handleDestinationWarehouseDeselectAll,
            },
            status: {
              label: 'Status',
              options: statusOptions.map(opt => ({key: opt.label, label: opt.label})),
              selected: tempStatuses,
              onSelect: handleStatusSelect,
              onDeselect: handleStatusDeselect,
              onDeselectAll: handleStatusDeselectAll,
            },
          };
        }, [tempDateRange, tempSourceWarehouses, tempDestinationWarehouses, tempStatuses, warehouseOptions, statusOptions, handleSourceWarehouseSelect, handleSourceWarehouseDeselect, handleSourceWarehouseDeselectAll, handleDestinationWarehouseSelect, handleDestinationWarehouseDeselect, handleDestinationWarehouseDeselectAll, handleStatusSelect, handleStatusDeselect, handleStatusDeselectAll])}
        onApply={handleApplyFilters}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundColorPrimary,
  },
  searchContainer: {
    paddingHorizontal: 8,
    paddingVertical: 12,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === 'ios' ? 10 : 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: '#1A1A1A',
    paddingVertical: Platform.OS === 'ios' ? 8 : 6,
    textAlignVertical: 'center',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 8,
  },
  transferCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 10,
  },
  statusTag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dateBullet: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#8F939E',
  },
  dateText: {
    fontSize: 12,
    color: '#8F939E',
    fontWeight: '500',
  },
  routeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  routeSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    flex: 1,
  },
  routeIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  routeAndIdContainer: {
    flex: 1,
    gap: 4,
  },
  routeText: {
    fontSize: 14,
    color: '#1A1A1A',
    fontWeight: '500',
  },
  transferId: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '600',
  },
  itemCount: {
    fontSize: 14,
    color: '#8F939E',
    fontWeight: '500',
    textAlign: 'right',
    minWidth: 60,
  },
});

export default TransferHistoryScreen;
