import React, {useState, useMemo, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Header from '../../../common/Header';
import Colors from '../../../../utils/Colors';
import {FilterDrawer} from '../../../filterdrawer';
import {useStockFilters} from '../../../../hooks/useStockFilters';

const StockLedgerScreen = () => {
  const navigation = useNavigation();
  // Use custom hook for stock filters
  const {warehouseNames: warehouseOptions} = useStockFilters();
  const [activeFilter, setActiveFilter] = useState('chronological');
  const [expandedChronological, setExpandedChronological] = useState(new Set());
  const [expandedByItem, setExpandedByItem] = useState(new Set());
  const [expandedByDocument, setExpandedByDocument] = useState(new Set());
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);
  const [selectedChronological, setSelectedChronological] = useState([]);
  const [selectedByItem, setSelectedByItem] = useState([]);
  const [selectedByDocument, setSelectedByDocument] = useState([]);

  // Filter states
  const [dateRange, setDateRange] = useState({startDate: '', endDate: ''});
  const [selectedWarehouses, setSelectedWarehouses] = useState([]);
  const [selectedItemSku, setSelectedItemSku] = useState([]);
  const [selectedBatchSerial, setSelectedBatchSerial] = useState([]);
  const [selectedTxnTypes, setSelectedTxnTypes] = useState([]);
  const txnTypeOptions = ['Sales', 'Purchase', 'Transfer', 'Adjustment', 'Other'];
  const itemSkuOptions = [
    'PRD-1002-ABC - Black JBL Speaker',
    'PRD-1003-DEF - White JBL Speaker',
    'PRD-1004-GHI - Red JBL Speaker',
    'PRD-1005-JKL - Blue JBL Speaker',
    'PRD-1016-QRS - iPhone 14 Pro Max',
    'PRD-1017-TUV - Samsung Galaxy S23 Ultra',
    'PRD-1018-WXY - MacBook Pro M2',
    'PRD-1027-XYZ - Logitech MX Master 3 Mouse',
  ];
  const batchSerialOptions = [
    '#BS-2407',
    '#BS-2408',
    '#BS-2409',
    '#BS-2410',
    '#BS-2411',
    '#BS-2412',
    '#BS-2413',
    '#BS-2414',
  ];

  // Filter handlers
  const handleWarehouseSelect = useCallback((value) => {
    setSelectedWarehouses(prev => {
      if (!prev.includes(value)) {
        return [...prev, value];
      }
      return prev;
    });
  }, []);

  const handleWarehouseDeselect = useCallback((value) => {
    setSelectedWarehouses(prev => prev.filter(w => w !== value));
  }, []);

  const handleWarehouseDeselectAll = useCallback(() => {
    setSelectedWarehouses([]);
  }, []);

  const handleTxnTypeSelect = useCallback((value) => {
    setSelectedTxnTypes(prev => {
      if (!prev.includes(value)) {
        return [...prev, value];
      }
      return prev;
    });
  }, []);

  const handleTxnTypeDeselect = useCallback((value) => {
    setSelectedTxnTypes(prev => prev.filter(t => t !== value));
  }, []);

  const handleTxnTypeDeselectAll = useCallback(() => {
    setSelectedTxnTypes([]);
  }, []);

  const handleItemSkuSelect = useCallback((value) => {
    setSelectedItemSku(prev => {
      if (!prev.includes(value)) {
        return [...prev, value];
      }
      return prev;
    });
  }, []);

  const handleItemSkuDeselect = useCallback((value) => {
    setSelectedItemSku(prev => prev.filter(item => item !== value));
  }, []);

  const handleItemSkuDeselectAll = useCallback(() => {
    setSelectedItemSku([]);
  }, []);

  const handleBatchSerialSelect = useCallback((value) => {
    setSelectedBatchSerial(prev => {
      if (!prev.includes(value)) {
        return [...prev, value];
      }
      return prev;
    });
  }, []);

  const handleBatchSerialDeselect = useCallback((value) => {
    setSelectedBatchSerial(prev => prev.filter(item => item !== value));
  }, []);

  const handleBatchSerialDeselectAll = useCallback(() => {
    setSelectedBatchSerial([]);
  }, []);

  // Get current selection based on active filter
  const getSelectedItems = () => {
    if (activeFilter === 'chronological') return selectedChronological;
    if (activeFilter === 'byItem') return selectedByItem;
    return selectedByDocument;
  };

  const selectedItems = getSelectedItems();

  const filterOptions = [
    {
      id: 'chronological',
      label: 'Chronological',
      icon: 'clock',
    },
    {
      id: 'byItem',
      label: 'By Item',
      icon: 'box',
    },
    {
      id: 'byDocument',
      label: 'By Document',
      icon: 'file-text',
    },
  ];

  // Chronological view data
  const chronologicalData = [
    {
      id: '1',
      documentNumber: 'SZX-921',
      date: 'Dec 12, 2024 14:23',
      value: '+4383',
      isPositive: true,
      item: 'Black JBL',
      unitCost: 'SNR-9834712',
      postedBy: 'Rina Kusuma',
      note: '-',
      batchSerial: '#BS-2407',
      balance: '₹275.00',
    },
    {
      id: '2',
      documentNumber: 'SZX-922',
      date: 'Dec 12, 2024 14:20',
      value: '+538',
      isPositive: true,
      item: 'White JBL',
      unitCost: 'SNR-9834713',
      postedBy: 'Rina Kusuma',
      note: '',
      batchSerial: '#BS-2408',
      balance: '₹175.00',
    },
    {
      id: '3',
      documentNumber: 'SZX-923',
      date: 'Dec 12, 2024 14:15',
      value: '-1250',
      isPositive: false,
      item: 'Red JBL',
      unitCost: 'SNR-9834714',
      postedBy: 'John Doe',
      note: '',
      batchSerial: '#BS-2409',
      balance: '₹450.00',
    },
    {
      id: '4',
      documentNumber: 'SZX-924',
      date: 'Dec 12, 2024 14:10',
      value: '+890',
      isPositive: true,
      item: 'Blue JBL',
      unitCost: 'SNR-9834715',
      postedBy: 'Jane Smith',
      note: '',
      batchSerial: '#BS-2410',
      balance: '₹320.00',
    },
  ];

  // By Item view data
  const byItemData = [
    {
      id: '1',
      productName: 'Black JBL - SKU-2987',
      rowInfo: '4 Row',
      balance: '₹275.00',
      date: '2025-08-01',
      txnId: 'TXN-10231',
      docRef: 'INV-8881',
      quantity: '+50 pcs',
      finalBalance: '₹12,000',
    },
    {
      id: '2',
      productName: 'Black JBL - SKU-2987',
      rowInfo: '4 Row',
      balance: '₹275.00',
      date: '2025-08-01',
      txnId: 'TXN-10231',
      docRef: 'INV-8881',
      quantity: '+50 pcs',
      finalBalance: '₹12,000',
    },
    {
      id: '3',
      productName: 'Black JBL - SKU-2987',
      rowInfo: '4 Row',
      balance: '₹275.00',
      date: '2025-06-01',
      txnId: 'TXN-10231',
      docRef: 'INV-8881',
      quantity: '+50 pcs',
      finalBalance: '₹12,000',
    },
    {
      id: '4',
      productName: 'Black JBL - SKU-2987',
      rowInfo: '4 Row',
      balance: '₹275.00',
      date: '2025-08-01',
      txnId: 'TXN-10231',
      docRef: 'INV-8881',
      quantity: '+50 pcs',
      finalBalance: '₹12,000',
    },
    {
      id: '5',
      productName: 'Black JBL - SKU-2987',
      rowInfo: '4 Row',
      balance: '₹275.00',
      date: '2025-08-01',
      txnId: 'TXN-10231',
      docRef: 'INV-8881',
      quantity: '+50 pcs',
      finalBalance: '₹12,000',
    },
  ];

  // By Document view data
  const byDocumentData = [
    {
      id: '1',
      documentType: 'Purchase Order',
      date: 'Dec 24, 2024',
      warehouse: 'WH-002',
      documentNumber: 'INV-8881',
      itemCount: '4 items',
      amount: '₹12,000',
      item: 'Black JBL',
      unitCost: 'SNR-9834712',
      postedBy: 'Rina Kusuma',
      note: '-',
      batchSerial: '#BS-2407',
      balance: '₹275.00',
    },
    {
      id: '2',
      documentType: 'Sales Order',
      date: 'Dec 23, 2024',
      warehouse: 'WH-001',
      documentNumber: 'INV-8882',
      itemCount: '2 items',
      amount: '₹8,500',
      item: 'White JBL',
      unitCost: 'SNR-9834713',
      postedBy: 'John Doe',
      note: '',
      batchSerial: '#BS-2408',
      balance: '₹175.00',
    },
    {
      id: '3',
      documentType: 'Purchase Return',
      date: 'Dec 22, 2024',
      warehouse: 'WH-003',
      documentNumber: 'INV-8883',
      itemCount: '1 item',
      amount: '₹3,200',
      item: 'Red JBL',
      unitCost: 'SNR-9834714',
      postedBy: 'Jane Smith',
      note: '',
      batchSerial: '#BS-2409',
      balance: '₹450.00',
    },
  ];

  const toggleChronological = id => {
    const newExpanded = new Set(expandedChronological);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedChronological(newExpanded);
  };

  const toggleByItem = id => {
    const newExpanded = new Set(expandedByItem);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedByItem(newExpanded);
  };

  const toggleByDocument = id => {
    const newExpanded = new Set(expandedByDocument);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedByDocument(newExpanded);
  };

  const handleShare = () => {
    if (selectedItems.length > 0) {
      Alert.alert('Share', `Share ${selectedItems.length} selected item(s)`);
    } else {
      Alert.alert('Share', 'Share functionality will be implemented here');
    }
  };

  const toggleItemSelection = itemId => {
    if (activeFilter === 'chronological') {
      setSelectedChronological(prev => {
        if (prev.includes(itemId)) {
          return prev.filter(id => id !== itemId);
        } else {
          return [...prev, itemId];
        }
      });
    } else if (activeFilter === 'byItem') {
      setSelectedByItem(prev => {
        if (prev.includes(itemId)) {
          return prev.filter(id => id !== itemId);
        } else {
          return [...prev, itemId];
        }
      });
    } else {
      setSelectedByDocument(prev => {
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


  const renderFilterButton = filter => {
    const isActive = activeFilter === filter.id;
    return (
      <TouchableOpacity
        key={filter.id}
        style={[styles.filterButton, isActive && styles.activeFilterButton]}
        onPress={() => setActiveFilter(filter.id)}>
        <Feather
          name={filter.icon}
          size={16}
          color={isActive ? '#1A1A1A' : '#8F939E'}
          style={styles.filterIcon}
        />
        <Text style={[styles.filterText, isActive && styles.activeFilterText]}>
          {filter.label}
        </Text>
      </TouchableOpacity>
    );
  };

  // Render function for Chronological view
  const renderChronologicalItem = ({item}) => {
    const isExpanded = expandedChronological.has(item.id);
    const isPositive = item.value.startsWith('+');
    const isSelected = selectedItems.includes(item.id);

    return (
      <TouchableOpacity
        style={[styles.ledgerCard, isSelected && styles.selectedCard]}
        onPress={() => {
          if (selectedItems.length > 0) {
            handleTap(item.id);
          } else {
            toggleChronological(item.id);
          }
        }}
        onLongPress={() => handleLongPress(item.id)}
        activeOpacity={0.8}>
        {/* Main Entry Row */}
        <View style={styles.entryRow}>
          <View style={styles.leftSection}>
            <View style={styles.iconContainer}>
              <Feather name="box" size={18} color="#8F939E" />
            </View>
            <View style={styles.documentInfo}>
              <Text style={styles.documentNumber}>{item.documentNumber}</Text>
              <Text style={styles.documentDate}>{item.date}</Text>
            </View>
          </View>

          <View style={styles.rightSection}>
            <Text
              style={[
                styles.transactionValue,
                {color: isPositive ? '#07B324' : '#F56359'},
              ]}>
              {item.value}
            </Text>
            {selectedItems.length === 0 && (
              <TouchableOpacity
                style={styles.expandButton}
                onPress={() => toggleChronological(item.id)}>
                <Feather name={isExpanded ? "chevron-up" : "chevron-down"} size={20} color="#8F939E" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Expanded Details */}
        {isExpanded && (
          <View style={styles.expandedDetails}>
            <View style={styles.detailRow}>
              <View style={styles.detailLeft}>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Item</Text>
                  <Text style={styles.detailValue}>{item.item}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Unit cost</Text>
                  <Text style={styles.detailValue}>{item.unitCost}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Posted-by</Text>
                  <Text style={styles.detailValue}>{item.postedBy}</Text>
                </View>
                <View style={[styles.detailItem, styles.lastDetailItem]}>
                  <Text style={styles.detailLabel}>Note</Text>
                  <Text style={styles.detailValue}>{item.note}</Text>
                </View>
              </View>
              <View style={styles.detailRight}>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Batch/Serial</Text>
                  <Text style={styles.detailValue}>{item.batchSerial}</Text>
                </View>
                <View style={[styles.detailItem, styles.lastDetailItem]}>
                  <Text style={styles.detailLabel}>Balance</Text>
                  <Text style={styles.detailValue}>{item.balance}</Text>
                </View>
              </View>
            </View>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  // Render function for By Item view
  const renderByItemItem = ({item}) => {
    const isExpanded = expandedByItem.has(item.id);
    const isSelected = selectedItems.includes(item.id);

    return (
      <TouchableOpacity
        style={[styles.ledgerCard, isSelected && styles.selectedCard]}
        onPress={() => {
          if (selectedItems.length > 0) {
            handleTap(item.id);
          } else {
            toggleByItem(item.id);
          }
        }}
        onLongPress={() => handleLongPress(item.id)}
        activeOpacity={0.8}>
        {/* Main Entry Row */}
        <View style={styles.entryRow}>
          <View style={styles.leftSection}>
            <View style={styles.iconContainer}>
              <Feather name="file-text" size={16} color="#8F939E" />
            </View>
            <View style={styles.productInfo}>
              <Text style={styles.productName}>{item.productName}</Text>
              <Text style={styles.rowInfo}>{item.rowInfo}</Text>
            </View>
          </View>

          <View style={styles.rightSection}>
            <Text style={styles.balance}>{item.balance}</Text>
            {selectedItems.length === 0 && (
              <TouchableOpacity
                style={styles.expandButton}
                onPress={() => toggleByItem(item.id)}>
                <Feather name={isExpanded ? "chevron-up" : "chevron-down"} size={20} color="#8F939E" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Expanded Details */}
        {isExpanded && (
          <View style={styles.expandedDetails}>
            <View style={styles.detailRow}>
              <View style={styles.detailLeft}>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Date</Text>
                  <Text style={styles.detailValue}>{item.date}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Doc Ref</Text>
                  <Text style={styles.detailValue}>{item.docRef}</Text>
                </View>
                <View style={[styles.detailItem, styles.lastDetailItem]}>
                  <Text style={styles.detailLabel}>Balance</Text>
                  <Text style={styles.detailValue}>{item.finalBalance}</Text>
                </View>
              </View>
              <View style={styles.detailRight}>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Txn ID</Text>
                  <Text style={styles.detailValue}>{item.txnId}</Text>
                </View>
                <View style={[styles.detailItem, styles.lastDetailItem]}>
                  <Text style={styles.detailLabel}>Quantity</Text>
                  <Text style={styles.detailValue}>{item.quantity}</Text>
                </View>
              </View>
            </View>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  // Render function for By Document view
  const renderByDocumentItem = ({item}) => {
    const isExpanded = expandedByDocument.has(item.id);
    const isSelected = selectedItems.includes(item.id);

    return (
      <TouchableOpacity
        style={[styles.ledgerCard, isSelected && styles.selectedCard]}
        onPress={() => {
          if (selectedItems.length > 0) {
            handleTap(item.id);
          } else {
            toggleByDocument(item.id);
          }
        }}
        onLongPress={() => handleLongPress(item.id)}
        activeOpacity={0.8}>
        {/* Document Header Section */}
        <View style={styles.documentHeader}>
          <View style={styles.documentTypeTag}>
            <Text style={styles.documentTypeText}>{item.documentType}</Text>
          </View>
          <Text style={styles.documentMetaText}>
            {item.date} • {item.warehouse}
          </Text>
        </View>

        {/* Document Info Section */}
        <View style={styles.documentInfoRow}>
          <View style={styles.leftSection}>
            <View style={styles.iconContainer}>
              <Feather name="file-text" size={16} color="#07624C" />
            </View>
            <View style={styles.documentDetails}>
              <Text style={styles.documentNumber}>{item.documentNumber}</Text>
              <Text style={styles.itemCount}>{item.itemCount}</Text>
            </View>
          </View>

          <View style={styles.rightSection}>
            <Text style={styles.amount}>{item.amount}</Text>
            {selectedItems.length === 0 && (
              <TouchableOpacity
                style={styles.expandButton}
                onPress={() => toggleByDocument(item.id)}>
                <Feather name={isExpanded ? "chevron-up" : "chevron-down"} size={20} color="#8F939E" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Expanded Details */}
        {isExpanded && (
          <View style={styles.expandedDetails}>
            <View style={styles.detailRow}>
              <View style={styles.detailLeft}>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Item</Text>
                  <Text style={styles.detailValue}>{item.item}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Unit cost</Text>
                  <Text style={styles.detailValue}>{item.unitCost}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Posted-by</Text>
                  <Text style={styles.detailValue}>{item.postedBy}</Text>
                </View>
                <View style={[styles.detailItem, styles.lastDetailItem]}>
                  <Text style={styles.detailLabel}>Note</Text>
                  <Text style={styles.detailValue}>{item.note}</Text>
                </View>
              </View>
              <View style={styles.detailRight}>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Batch/Serial</Text>
                  <Text style={styles.detailValue}>{item.batchSerial}</Text>
                </View>
                <View style={[styles.detailItem, styles.lastDetailItem]}>
                  <Text style={styles.detailLabel}>Balance</Text>
                  <Text style={styles.detailValue}>{item.balance}</Text>
                </View>
              </View>
            </View>
          </View>
        )}
      </TouchableOpacity>
    );
  };


  return (
    <View style={styles.container}>
      {/* Custom Header */}
      <Header
        title="Stock Ledger"
        leftIcon="chevron-left"
        onLeftPress={() => navigation.goBack()}
        rightIcon="filter"
        rightIconType="Ionicons"
        onRightPress={() => setShowFilterDrawer(true)}
      />

      {/* Filter Buttons */}
      <View style={styles.filterContainer}>
        {filterOptions.map(renderFilterButton)}
      </View>

      {/* Ledger List */}
      <FlatList
        data={
          activeFilter === 'chronological'
            ? chronologicalData
            : activeFilter === 'byItem'
            ? byItemData
            : byDocumentData
        }
        keyExtractor={item => item.id}
        renderItem={
          activeFilter === 'chronological'
            ? renderChronologicalItem
            : activeFilter === 'byItem'
            ? renderByItemItem
            : renderByDocumentItem
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        style={styles.list}
        removeClippedSubviews={false}
      />

      {/* Share Button */}
      <View style={styles.bottomButtonContainer}>
        <TouchableOpacity
          style={styles.shareButton}
          onPress={handleShare}>
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
            dateRange: {
              label: 'Date Range',
              type: 'dateRange',
              value: dateRange,
              onChange: setDateRange,
            },
            warehouse: {
              label: 'Warehouse',
              options: warehouseOptions.map(opt => ({key: opt, label: opt})),
              selected: selectedWarehouses,
              onSelect: handleWarehouseSelect,
              onDeselect: handleWarehouseDeselect,
              onDeselectAll: handleWarehouseDeselectAll,
            },
            itemSku: {
              label: 'Item/SKU',
              options: itemSkuOptions.map(opt => ({key: opt, label: opt})),
              selected: selectedItemSku,
              onSelect: handleItemSkuSelect,
              onDeselect: handleItemSkuDeselect,
              onDeselectAll: handleItemSkuDeselectAll,
            },
            batchSerial: {
              label: 'Batch/Serial',
              options: batchSerialOptions.map(opt => ({key: opt, label: opt})),
              selected: selectedBatchSerial,
              onSelect: handleBatchSerialSelect,
              onDeselect: handleBatchSerialDeselect,
              onDeselectAll: handleBatchSerialDeselectAll,
            },
            txnType: {
              label: 'Txn Type',
              options: txnTypeOptions.map(opt => ({key: opt, label: opt})),
              selected: selectedTxnTypes,
              onSelect: handleTxnTypeSelect,
              onDeselect: handleTxnTypeDeselect,
              onDeselectAll: handleTxnTypeDeselectAll,
            },
          };
        }, [dateRange, selectedWarehouses, selectedItemSku, selectedBatchSerial, selectedTxnTypes, warehouseOptions, txnTypeOptions, itemSkuOptions, batchSerialOptions, handleWarehouseSelect, handleWarehouseDeselect, handleWarehouseDeselectAll, handleTxnTypeSelect, handleTxnTypeDeselect, handleTxnTypeDeselectAll, handleItemSkuSelect, handleItemSkuDeselect, handleItemSkuDeselectAll, handleBatchSerialSelect, handleBatchSerialDeselect, handleBatchSerialDeselectAll])}
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
    marginLeft: 10,
    marginRight: 6,
    paddingVertical: 12,
    gap: 4,
    alignItems: 'center',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  activeFilterButton: {
    backgroundColor: '#FFFFFF',
    borderColor: Colors.border,
  },
  filterIcon: {
    marginRight: 6,
  },
  filterText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#8F939E',
  },
  activeFilterText: {
    color: '#1A1A1A',
  },
  list: {
    flex: 1,
  },
  listContainer: {
    paddingHorizontal: 12,
    paddingBottom: 100,
  },
  ledgerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  entryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  // Common icon container
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F0F2F9',
    borderWidth: 1,
    borderColor: Colors.border,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  documentInfo: {
    flex: 1,
  },
  documentNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 2,
  },
  documentDate: {
    fontSize: 12,
    color: '#8F939E',
  },
  transactionValue: {
    fontSize: 16,
    fontWeight: '600',
    marginRight: 12,
  },

  // Styles for By Item view
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 2,
  },
  rowInfo: {
    fontSize: 12,
    color: '#8F939E',
  },

  // Styles for By Document view
  documentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  documentTypeTag: {
    backgroundColor: '#E8F5E8',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  documentTypeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#07624C',
  },
  documentMetaText: {
    fontSize: 12,
    color: '#8F939E',
  },
  documentInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  documentDetails: {
    flex: 1,
  },
  itemCount: {
    fontSize: 12,
    color: '#8F939E',
  },
  amount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#494D58',
    marginRight: 12,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  balance: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
    marginRight: 12,
  },
  expandButton: {
    padding: 4,
  },
  expandedDetails: {
    marginTop: 12,
    paddingTop: 12,
    paddingHorizontal: 6,
    paddingBottom: 6,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    gap: 12,
  },
  detailLeft: {
    flex: 1,
  },
  detailRight: {
    flex: 1,
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  lastDetailItem: {
    marginBottom: 0,
  },
  detailLabel: {
    fontSize: 11,
    color: '#8F939E',
    fontWeight: '400',
    flex: 1,
  },
  detailValue: {
    fontSize: 11,
    color: '#494D58',
    fontWeight: '500',
    flex: 1,
    textAlign: 'right',
  },
  bottomButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  shareButton: {
    backgroundColor: '#07624C',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  shareButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  // Selection mode styles
  selectedCard: {
    borderColor: '#10B981',
    borderWidth: 1,
  },
});

export default StockLedgerScreen;
