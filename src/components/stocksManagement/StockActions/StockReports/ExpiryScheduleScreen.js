import React, {useState, useMemo, useCallback} from 'react';
import {View, Text, StyleSheet, FlatList, TouchableOpacity, Alert} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import Colors from '../../../../utils/Colors';
import Header from '../../../common/Header';
import {FilterDrawer} from '../../../filterdrawer';
import {useStockFilters} from '../../../../hooks/useStockFilters';

const ExpiryScheduleScreen = ({navigation}) => {
  // Use custom hook for stock filters
  const {warehouseNames: availableWarehouses} = useStockFilters();
  const [selectedDayRange, setSelectedDayRange] = useState('0-30');
  // Actual filter state (applied filters)
  const [warehouses, setWarehouses] = useState([]);
  const [selectedItemGroup, setSelectedItemGroup] = useState([]);
  
  // Temporary filter state (for drawer - not applied until Apply is clicked)
  const [tempWarehouses, setTempWarehouses] = useState([]);
  const [tempItemGroup, setTempItemGroup] = useState([]);
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);

  const itemGroupOptions = [
    'Electronics',
    'Clothing',
    'Food & Beverages',
    'Home & Garden',
    'Automotive',
  ];

  // Filter handlers (work with temporary state)
  const handleWarehouseSelect = useCallback((value) => {
    setTempWarehouses(prev => {
      if (!prev.includes(value)) {
        return [...prev, value];
      }
      return prev;
    });
  }, []);

  const handleWarehouseDeselect = useCallback((value) => {
    setTempWarehouses(prev => prev.filter(w => w !== value));
  }, []);

  const handleWarehouseDeselectAll = useCallback(() => {
    setTempWarehouses([]);
  }, []);

  const handleItemGroupSelect = useCallback((value) => {
    // Multi-select - add to array if not already present
    setTempItemGroup(prev => {
      if (!prev.includes(value)) {
        return [...prev, value];
      }
      return prev;
    });
  }, []);

  const handleItemGroupDeselect = useCallback((value) => {
    // Multi-select - remove from array
    setTempItemGroup(prev => prev.filter(item => item !== value));
  }, []);

  const handleItemGroupDeselectAll = useCallback(() => {
    setTempItemGroup([]);
  }, []);

  // Initialize temporary states when drawer opens
  const handleFilterPress = useCallback(() => {
    setTempWarehouses([...warehouses]);
    setTempItemGroup([...selectedItemGroup]);
    setShowFilterDrawer(true);
  }, [warehouses, selectedItemGroup]);

  // Apply filters when Apply button is clicked
  const handleApplyFilters = useCallback(() => {
    setWarehouses([...tempWarehouses]);
    setSelectedItemGroup([...tempItemGroup]);
  }, [tempWarehouses, tempItemGroup]);
  
  // Separate selection states for each day range filter
  const [selected0_30, setSelected0_30] = useState([]);
  const [selected31_60, setSelected31_60] = useState([]);
  const [selected60Plus, setSelected60Plus] = useState([]);
  const [selectedExpired, setSelectedExpired] = useState([]);

  // Get current selection based on active day range filter
  const getSelectedItems = () => {
    if (selectedDayRange === '0-30') return selected0_30;
    if (selectedDayRange === '31-60') return selected31_60;
    if (selectedDayRange === '60+') return selected60Plus;
    return selectedExpired;
  };

  const selectedItems = getSelectedItems();

  const dayRangeFilters = [
    {id: '0-30', label: '0-30 Day'},
    {id: '31-60', label: '31-60 Day'},
    {id: '60+', label: '>60 Day'},
    {id: 'expired', label: 'Expired'},
  ];

  const expiryData = [
    // 0-30 days (urgent)
    {
      id: '1',
      warehouse: 'Sierra Storage',
      productName: 'Black JBL',
      productId: 'PRD-1002-ABC',
      batch: 'KL98-A12',
      quantity: '87',
      expiryDate: '11/12/25',
      value: '₹112,800',
      daysLeft: '3 Day',
      isUrgent: true,
      daysToExpiry: 3,
    },
    {
      id: '2',
      warehouse: 'Echo Depot',
      productName: 'White Sony',
      productId: 'PRD-1003-DEF',
      batch: 'KL98-A13',
      quantity: '45',
      expiryDate: '11/15/25',
      value: '₹67,500',
      daysLeft: '6 Day',
      isUrgent: true,
      daysToExpiry: 6,
    },
    {
      id: '3',
      warehouse: 'Sierra Storage',
      productName: 'Red Samsung',
      productId: 'PRD-1004-GHI',
      batch: 'KL98-A14',
      quantity: '120',
      expiryDate: '11/20/25',
      value: '₹180,000',
      daysLeft: '11 Day',
      isUrgent: true,
      daysToExpiry: 11,
    },
    {
      id: '4',
      warehouse: 'Echo Depot',
      productName: 'Blue iPhone',
      productId: 'PRD-1005-JKL',
      batch: 'KL98-A15',
      quantity: '23',
      expiryDate: '11/25/25',
      value: '₹34,500',
      daysLeft: '16 Day',
      isUrgent: true,
      daysToExpiry: 16,
    },
    {
      id: '5',
      warehouse: 'Sierra Storage',
      productName: 'Green MacBook',
      productId: 'PRD-1006-MNO',
      batch: 'KL98-A16',
      quantity: '67',
      expiryDate: '11/30/25',
      value: '₹100,500',
      daysLeft: '21 Day',
      isUrgent: true,
      daysToExpiry: 21,
    },
    {
      id: '6',
      warehouse: 'Echo Depot',
      productName: 'Yellow iPad',
      productId: 'PRD-1007-PQR',
      batch: 'KL98-A17',
      quantity: '34',
      expiryDate: '12/05/25',
      value: '₹51,000',
      daysLeft: '26 Day',
      isUrgent: true,
      daysToExpiry: 26,
    },
    {
      id: '7',
      warehouse: 'Sierra Storage',
      productName: 'Purple AirPods',
      productId: 'PRD-1008-STU',
      batch: 'KL98-A18',
      quantity: '89',
      expiryDate: '12/10/25',
      value: '₹133,500',
      daysLeft: '31 Day',
      isUrgent: false,
      daysToExpiry: 31,
    },
    // 31-60 days
    {
      id: '8',
      warehouse: 'Echo Depot',
      productName: 'Orange Watch',
      productId: 'PRD-1009-VWX',
      batch: 'KL98-A19',
      quantity: '56',
      expiryDate: '12/15/25',
      value: '₹84,000',
      daysLeft: '36 Day',
      isUrgent: false,
      daysToExpiry: 36,
    },
    {
      id: '9',
      warehouse: 'Sierra Storage',
      productName: 'Pink Camera',
      productId: 'PRD-1010-YZA',
      batch: 'KL98-A20',
      quantity: '78',
      expiryDate: '12/20/25',
      value: '₹117,000',
      daysLeft: '41 Day',
      isUrgent: false,
      daysToExpiry: 41,
    },
    {
      id: '10',
      warehouse: 'Echo Depot',
      productName: 'Brown Keyboard',
      productId: 'PRD-1011-BCD',
      batch: 'KL98-A21',
      quantity: '92',
      expiryDate: '12/25/25',
      value: '₹138,000',
      daysLeft: '46 Day',
      isUrgent: false,
      daysToExpiry: 46,
    },
    {
      id: '11',
      warehouse: 'Sierra Storage',
      productName: 'Gray Mouse',
      productId: 'PRD-1012-EFG',
      batch: 'KL98-A22',
      quantity: '41',
      expiryDate: '12/30/25',
      value: '₹61,500',
      daysLeft: '51 Day',
      isUrgent: false,
      daysToExpiry: 51,
    },
    {
      id: '12',
      warehouse: 'Echo Depot',
      productName: 'Cyan Monitor',
      productId: 'PRD-1013-HIJ',
      batch: 'KL98-A23',
      quantity: '15',
      expiryDate: '01/05/26',
      value: '₹22,500',
      daysLeft: '57 Day',
      isUrgent: false,
      daysToExpiry: 57,
    },
    {
      id: '13',
      warehouse: 'Sierra Storage',
      productName: 'Magenta Speaker',
      productId: 'PRD-1014-KLM',
      batch: 'KL98-A24',
      quantity: '63',
      expiryDate: '01/10/26',
      value: '₹94,500',
      daysLeft: '62 Day',
      isUrgent: false,
      daysToExpiry: 62,
    },
    // 60+ days
    {
      id: '14',
      warehouse: 'Echo Depot',
      productName: 'Teal Headphones',
      productId: 'PRD-1015-NOP',
      batch: 'KL98-A25',
      quantity: '28',
      expiryDate: '01/15/26',
      value: '₹42,000',
      daysLeft: '67 Day',
      isUrgent: false,
      daysToExpiry: 67,
    },
    {
      id: '15',
      warehouse: 'Sierra Storage',
      productName: 'Lime Microphone',
      productId: 'PRD-1016-QRS',
      batch: 'KL98-A26',
      quantity: '37',
      expiryDate: '01/20/26',
      value: '₹55,500',
      daysLeft: '72 Day',
      isUrgent: false,
      daysToExpiry: 72,
    },
    {
      id: '16',
      warehouse: 'Echo Depot',
      productName: 'Indigo Webcam',
      productId: 'PRD-1017-TUV',
      batch: 'KL98-A27',
      quantity: '19',
      expiryDate: '01/25/26',
      value: '₹28,500',
      daysLeft: '77 Day',
      isUrgent: false,
      daysToExpiry: 77,
    },
    {
      id: '17',
      warehouse: 'Sierra Storage',
      productName: 'Violet Router',
      productId: 'PRD-1018-WXY',
      batch: 'KL98-A28',
      quantity: '52',
      expiryDate: '01/30/26',
      value: '₹78,000',
      daysLeft: '82 Day',
      isUrgent: false,
      daysToExpiry: 82,
    },
    {
      id: '18',
      warehouse: 'Echo Depot',
      productName: 'Amber Switch',
      productId: 'PRD-1019-ZAB',
      batch: 'KL98-A29',
      quantity: '44',
      expiryDate: '02/05/26',
      value: '₹66,000',
      daysLeft: '88 Day',
      isUrgent: false,
      daysToExpiry: 88,
    },
    // Expired items
    {
      id: '19',
      warehouse: 'Sierra Storage',
      productName: 'Expired Laptop',
      productId: 'PRD-1020-CDE',
      batch: 'KL98-A30',
      quantity: '12',
      expiryDate: '10/15/25',
      value: '₹18,000',
      daysLeft: 'Expired',
      isUrgent: true,
      daysToExpiry: -15,
    },
    {
      id: '20',
      warehouse: 'Echo Depot',
      productName: 'Expired Phone',
      productId: 'PRD-1021-FGH',
      batch: 'KL98-A31',
      quantity: '8',
      expiryDate: '10/20/25',
      value: '₹12,000',
      daysLeft: 'Expired',
      isUrgent: true,
      daysToExpiry: -20,
    },
    // Additional items for Meniji warehouse
    {
      id: '21',
      warehouse: 'Meniji warehouse',
      productName: 'Silver Laptop',
      productId: 'PRD-1022-IJK',
      batch: 'KL98-A32',
      quantity: '15',
      expiryDate: '11/18/25',
      value: '₹22,500',
      daysLeft: '9 Day',
      isUrgent: true,
      daysToExpiry: 9,
    },
    {
      id: '22',
      warehouse: 'Meniji warehouse',
      productName: 'Gold Tablet',
      productId: 'PRD-1023-LMN',
      batch: 'KL98-A33',
      quantity: '28',
      expiryDate: '12/08/25',
      value: '₹42,000',
      daysLeft: '29 Day',
      isUrgent: true,
      daysToExpiry: 29,
    },
    {
      id: '23',
      warehouse: 'Meniji warehouse',
      productName: 'Platinum Phone',
      productId: 'PRD-1024-OPQ',
      batch: 'KL98-A34',
      quantity: '33',
      expiryDate: '12/25/25',
      value: '₹49,500',
      daysLeft: '46 Day',
      isUrgent: false,
      daysToExpiry: 46,
    },
    // Central Hub items
    {
      id: '24',
      warehouse: 'Central Hub',
      productName: 'Diamond Ring',
      productId: 'PRD-1025-RST',
      batch: 'KL98-A35',
      quantity: '5',
      expiryDate: '11/14/25',
      value: '₹75,000',
      daysLeft: '5 Day',
      isUrgent: true,
      daysToExpiry: 5,
    },
    {
      id: '25',
      warehouse: 'Central Hub',
      productName: 'Ruby Necklace',
      productId: 'PRD-1026-UVW',
      batch: 'KL98-A36',
      quantity: '12',
      expiryDate: '11/28/25',
      value: '₹120,000',
      daysLeft: '19 Day',
      isUrgent: true,
      daysToExpiry: 19,
    },
    {
      id: '26',
      warehouse: 'Central Hub',
      productName: 'Emerald Bracelet',
      productId: 'PRD-1027-XYZ',
      batch: 'KL98-A37',
      quantity: '8',
      expiryDate: '12/12/25',
      value: '₹64,000',
      daysLeft: '33 Day',
      isUrgent: false,
      daysToExpiry: 33,
    },
    {
      id: '27',
      warehouse: 'Central Hub',
      productName: 'Sapphire Earrings',
      productId: 'PRD-1028-ABC',
      batch: 'KL98-A38',
      quantity: '15',
      expiryDate: '01/08/26',
      value: '₹90,000',
      daysLeft: '60 Day',
      isUrgent: false,
      daysToExpiry: 60,
    },
    // North Terminal items
    {
      id: '29',
      warehouse: 'North Terminal',
      productName: 'Arctic Monitor',
      productId: 'PRD-1029-DEF',
      batch: 'KL98-A39',
      quantity: '22',
      expiryDate: '11/16/25',
      value: '₹33,000',
      daysLeft: '7 Day',
      isUrgent: true,
      daysToExpiry: 7,
    },
    {
      id: '30',
      warehouse: 'North Terminal',
      productName: 'Frost Keyboard',
      productId: 'PRD-1030-GHI',
      batch: 'KL98-A40',
      quantity: '18',
      expiryDate: '11/22/25',
      value: '₹27,000',
      daysLeft: '13 Day',
      isUrgent: true,
      daysToExpiry: 13,
    },
    {
      id: '31',
      warehouse: 'North Terminal',
      productName: 'Ice Mouse',
      productId: 'PRD-1031-JKL',
      batch: 'KL98-A41',
      quantity: '25',
      expiryDate: '12/18/25',
      value: '₹37,500',
      daysLeft: '39 Day',
      isUrgent: false,
      daysToExpiry: 39,
    },
    {
      id: '32',
      warehouse: 'North Terminal',
      productName: 'Snow Speaker',
      productId: 'PRD-1032-MNO',
      batch: 'KL98-A42',
      quantity: '14',
      expiryDate: '01/22/26',
      value: '₹21,000',
      daysLeft: '74 Day',
      isUrgent: false,
      daysToExpiry: 74,
    },
    // South Complex items
    {
      id: '33',
      warehouse: 'South Complex',
      productName: 'Desert Laptop',
      productId: 'PRD-1033-PQR',
      batch: 'KL98-A43',
      quantity: '9',
      expiryDate: '11/10/25',
      value: '₹13,500',
      daysLeft: '1 Day',
      isUrgent: true,
      daysToExpiry: 1,
    },
    {
      id: '34',
      warehouse: 'South Complex',
      productName: 'Sunset Tablet',
      productId: 'PRD-1034-STU',
      batch: 'KL98-A44',
      quantity: '31',
      expiryDate: '11/25/25',
      value: '₹46,500',
      daysLeft: '16 Day',
      isUrgent: true,
      daysToExpiry: 16,
    },
    {
      id: '35',
      warehouse: 'South Complex',
      productName: 'Canyon Phone',
      productId: 'PRD-1035-VWX',
      batch: 'KL98-A45',
      quantity: '27',
      expiryDate: '12/28/25',
      value: '₹40,500',
      daysLeft: '49 Day',
      isUrgent: false,
      daysToExpiry: 49,
    },
    {
      id: '36',
      warehouse: 'South Complex',
      productName: 'Mesa Headphones',
      productId: 'PRD-1036-YZA',
      batch: 'KL98-A46',
      quantity: '11',
      expiryDate: '02/10/26',
      value: '₹16,500',
      daysLeft: '93 Day',
      isUrgent: false,
      daysToExpiry: 93,
    },
    // Additional expired items for new warehouses
    {
      id: '37',
      warehouse: 'Central Hub',
      productName: 'Expired Diamond',
      productId: 'PRD-1037-BCD',
      batch: 'KL98-A47',
      quantity: '3',
      expiryDate: '10/25/25',
      value: '₹45,000',
      daysLeft: 'Expired',
      isUrgent: true,
      daysToExpiry: -25,
    },
    {
      id: '38',
      warehouse: 'North Terminal',
      productName: 'Expired Arctic',
      productId: 'PRD-1038-EFG',
      batch: 'KL98-A48',
      quantity: '7',
      expiryDate: '10/30/25',
      value: '₹10,500',
      daysLeft: 'Expired',
      isUrgent: true,
      daysToExpiry: -30,
    },
  ];

  const removeWarehouse = warehouseToRemove => {
    setWarehouses(
      warehouses.filter(warehouse => warehouse !== warehouseToRemove),
    );
  };


  // Handle item selection
  const toggleItemSelection = itemId => {
    if (selectedDayRange === '0-30') {
      setSelected0_30(prev => {
        if (prev.includes(itemId)) {
          return prev.filter(id => id !== itemId);
        } else {
          return [...prev, itemId];
        }
      });
    } else if (selectedDayRange === '31-60') {
      setSelected31_60(prev => {
        if (prev.includes(itemId)) {
          return prev.filter(id => id !== itemId);
        } else {
          return [...prev, itemId];
        }
      });
    } else if (selectedDayRange === '60+') {
      setSelected60Plus(prev => {
        if (prev.includes(itemId)) {
          return prev.filter(id => id !== itemId);
        } else {
          return [...prev, itemId];
        }
      });
    } else {
      setSelectedExpired(prev => {
        if (prev.includes(itemId)) {
          return prev.filter(id => id !== itemId);
        } else {
          return [...prev, itemId];
        }
      });
    }
  };

  // Handle long press selection
  const handleLongPress = itemId => {
    if (!selectedItems.includes(itemId)) {
      toggleItemSelection(itemId);
    }
  };

  // Handle tap selection
  const handleTap = itemId => {
    if (selectedItems.length > 0) {
      // If in selection mode, toggle selection
      toggleItemSelection(itemId);
    }
  };

  // Share selected items
  const handleShare = () => {
    if (selectedItems.length > 0) {
      Alert.alert('Share', `Share ${selectedItems.length} selected item(s)`);
    } else {
      Alert.alert('Share', 'Share functionality will be implemented here');
    }
  };

  // Filter data based on selected day range, warehouses, and item group
  const getFilteredData = () => {
    return expiryData.filter(item => {
      // Filter by warehouse (show all if none selected)
      const warehouseMatch = warehouses.length === 0 || warehouses.includes(item.warehouse);

      // Filter by item group (if selected and item has itemGroup field)
      const itemGroupMatch = selectedItemGroup.length === 0 || 
        (item.itemGroup && selectedItemGroup.includes(item.itemGroup));

      // Filter by day range
      let dayRangeMatch = false;

      switch (selectedDayRange) {
        case '0-30':
          dayRangeMatch = item.daysToExpiry >= 0 && item.daysToExpiry <= 30;
          break;
        case '31-60':
          dayRangeMatch = item.daysToExpiry >= 31 && item.daysToExpiry <= 60;
          break;
        case '60+':
          dayRangeMatch = item.daysToExpiry > 60;
          break;
        case 'expired':
          dayRangeMatch = item.daysToExpiry < 0;
          break;
        default:
          dayRangeMatch = true;
      }

      return warehouseMatch && itemGroupMatch && dayRangeMatch;
    });
  };

  const renderWarehouseChips = () => (
    <View style={styles.warehouseSection}>
      <Text style={styles.sectionLabel}>Warehouse Filter</Text>
      <View style={styles.chipContainer}>
        {warehouses.map((warehouse, index) => (
          <View key={index} style={styles.chip}>
            <Feather name="home" size={14} color="#8F939E" />
            <Text style={styles.chipText}>{warehouse}</Text>
            <TouchableOpacity
              style={styles.chipRemove}
              onPress={() => removeWarehouse(warehouse)}>
              <Feather name="x" size={12} color="#8F939E" />
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </View>
  );

  const renderDayRangeFilters = () => (
    <View style={styles.dayRangeSection}>
      <View style={styles.filterContainer}>
        {dayRangeFilters.map((filter, index) => (
          <React.Fragment key={filter.id}>
            <TouchableOpacity
              style={[
                styles.filterButton,
                selectedDayRange === filter.id && styles.activeFilterButton,
              ]}
              onPress={() => setSelectedDayRange(filter.id)}>
              <Text
                style={[
                  styles.filterText,
                  selectedDayRange === filter.id && styles.activeFilterText,
                ]}>
                {filter.label}
              </Text>
            </TouchableOpacity>
            {index < dayRangeFilters.length - 1 && (
              <View style={styles.verticalSeparator} />
            )}
          </React.Fragment>
        ))}
      </View>
    </View>
  );

  const renderExpiryItem = ({item}) => {
    const isSelected = selectedItems.includes(item.id);
    
    return (
    <TouchableOpacity
      style={[styles.expiryCard, isSelected && styles.selectedCard]}
      onPress={() => handleTap(item.id)}
      onLongPress={() => handleLongPress(item.id)}
      activeOpacity={0.8}>
      {/* Storage Tag */}
      <View style={styles.storageTag}>
        <Feather name="home" size={16} color="#8F939E" />
        <Text style={styles.storageText}>{item.warehouse}</Text>
      </View>

      {/* Product Info Section */}
      <View style={styles.productSection}>
        <View style={styles.iconContainer}>
          <Feather name="box" size={20} color="#FFFFFF" />
        </View>
        <View style={styles.productInfo}>
          <Text style={styles.productName}>{item.productName}</Text>
          <Text style={styles.productId}>{item.productId}</Text>
        </View>
      </View>

      {/* Details Section */}
      <View style={styles.detailsSection}>
        <View style={styles.detailRow}>
          <View style={styles.leftColumn}>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Batch/Lot</Text>
              <Text style={styles.detailValue}>{item.batch}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>QTY</Text>
              <Text style={styles.detailValue}>{item.quantity}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Day Left</Text>
              <Text
                style={[
                  styles.detailValue,
                  item.isUrgent && styles.urgentText,
                ]}>
                {item.daysLeft}
              </Text>
            </View>
          </View>
          <View style={styles.rightColumn}>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Expiry Date</Text>
              <Text style={styles.detailValue}>{item.expiryDate}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Value</Text>
              <Text style={styles.detailValue}>{item.value}</Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Custom Header */}
      <Header
        title="Expiry Schedule"
        leftIcon="chevron-left"
        onLeftPress={() => navigation.goBack()}
        rightIcon="filter"
        rightIconType="Ionicons"
        onRightPress={handleFilterPress}
        rightBadge={warehouses.length}
      />

      {/* Filter Sections */}
      {renderWarehouseChips()}
      {renderDayRangeFilters()}

      {/* Expiry Items List */}
      <FlatList
        data={getFilteredData()}
        removeClippedSubviews={false}
        keyExtractor={item => item.id}
        renderItem={renderExpiryItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        ItemSeparatorComponent={() => <View style={styles.listSeparator} />}
      />

      {/* Share Button */}
      <View style={styles.shareButtonContainer}>
        <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
          <Text style={styles.shareButtonText}>
            {selectedItems.length > 0
              ? `Share ${selectedItems.length} Item(s)`
              : 'Share'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Filter Drawer */}
      <FilterDrawer
        visible={showFilterDrawer}
        onClose={() => setShowFilterDrawer(false)}
        slideDirection="left"
        customFilters={useMemo(() => {
          return {
            warehouse: {
              label: 'Warehouse',
              options: availableWarehouses.map(opt => ({key: opt, label: opt})),
              selected: tempWarehouses,
              onSelect: handleWarehouseSelect,
              onDeselect: handleWarehouseDeselect,
              onDeselectAll: handleWarehouseDeselectAll,
            },
            itemGroup: {
              label: 'Item Group',
              options: itemGroupOptions.map(opt => ({key: opt, label: opt})),
              selected: tempItemGroup,
              onSelect: handleItemGroupSelect,
              onDeselect: handleItemGroupDeselect,
              onDeselectAll: handleItemGroupDeselectAll,
            },
          };
        }, [tempWarehouses, tempItemGroup, availableWarehouses, itemGroupOptions, handleWarehouseSelect, handleWarehouseDeselect, handleWarehouseDeselectAll, handleItemGroupSelect, handleItemGroupDeselect, handleItemGroupDeselectAll])}
        onApply={handleApplyFilters}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F8FA',
  },
  warehouseSection: {
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 12,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 6,
  },
  chipText: {
    fontSize: 12,
    color: '#1A1A1A',
  },
  chipRemove: {
    padding: 2,
  },
  dayRangeSection: {
    paddingHorizontal: 12,
  },
  filterContainer: {
    flexDirection: 'row',
    backgroundColor: '#f4f5fa',
    borderRadius: 8,
    paddingHorizontal: 6,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    paddingVertical: 6,
  },
  filterButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    alignItems: 'center',
    borderRadius: 6,
  },
  activeFilterButton: {
    backgroundColor: '#FFFFFF',
  },
  filterText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  activeFilterText: {
    color: '#1A1A1A',
    fontWeight: '600',
  },
  // verticalSeparator: {
  //   width: 1,
  //   backgroundColor: '#E5E7EB',
  //   height: '100%',
  // },
  // listSeparator: {
  //   height: 10,
  // },
  listContainer: {
    paddingHorizontal: 12,
    paddingBottom: 10,
  },
  expiryCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    padding: 12,
    gap: 8,
    marginTop: 10,
  },
  selectedCard: {
    borderColor: '#10B981',
    borderWidth: 1,
  },
  storageTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
  },
  storageText: {
    fontSize: 12,
    color: '#8F939E',
  },
  productSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  productId: {
    fontSize: 12,
    color: '#8F939E',
  },
  detailsSection: {
    width: '100%',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  leftColumn: {
    flex: 1,
    gap: 8,
    marginRight: 8,
  },
  rightColumn: {
    flex: 1,
    gap: 8,
    marginLeft: 12,
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 12,
    color: '#8F939E',
    fontWeight: '400',
  },
  detailValue: {
    fontSize: 12,
    color: '#1A1A1A',
    fontWeight: '500',
  },
  urgentText: {
    color: '#FF3B30',
    fontWeight: '600',
  },
  shareButtonContainer: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  shareButton: {
    backgroundColor: '#07624C',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  shareButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ExpiryScheduleScreen;
