import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert,
  Platform,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import Colors from '../../../../utils/Colors';
import Header from '../../../common/Header';

const NegativeStockExceptionsScreen = ({navigation}) => {
  const [searchText, setSearchText] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);

  const negativeStockData = [
    {
      id: '1',
      productName: 'Black JBL',
      productId: 'PRD-1002-ABC',
      warehouse: 'Sierra Storage',
      batch: '#B023',
      balanceQty: '245',
      lastMovement: '10/10/24',
    },
    {
      id: '2',
      productName: 'White JBL',
      productId: 'PRD-1003-DEF',
      warehouse: 'Echo Depot',
      batch: '#B024',
      balanceQty: '189',
      lastMovement: '09/10/24',
    },
    {
      id: '3',
      productName: 'Red JBL',
      productId: 'PRD-1004-GHI',
      warehouse: 'Sierra Storage',
      batch: '#B025',
      balanceQty: '312',
      lastMovement: '11/10/24',
    },
  ];

  const filteredData = negativeStockData.filter(
    item =>
      item.productName.toLowerCase().includes(searchText.toLowerCase()) ||
      item.productId.toLowerCase().includes(searchText.toLowerCase()),
  );

  // Handle item selection
  const toggleItemSelection = itemId => {
    setSelectedItems(prev => {
      if (prev.includes(itemId)) {
        return prev.filter(id => id !== itemId);
      } else {
        return [...prev, itemId];
      }
    });
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

  const renderStockItem = ({item}) => {
    const isSelected = selectedItems.includes(item.id);
    
    return (
    <TouchableOpacity
      style={[styles.stockCard, isSelected && styles.selectedCard]}
      onPress={() => handleTap(item.id)}
      onLongPress={() => handleLongPress(item.id)}
      activeOpacity={0.8}>
      <View style={styles.topSection}>
        <View style={styles.iconContainer}>
          <Feather name="box" size={20} color="#FFFFFF" />
        </View>
        <View style={styles.productInfo}>
          <Text style={styles.productName}>{item.productName}</Text>
          <Text style={styles.productId}>{item.productId}</Text>
        </View>
      </View>
      <View style={styles.detailsSection}>
        <View style={styles.detailRow}>
          <View style={styles.leftDetailItem}>
            <Text style={styles.detailLabel}>Warehouse</Text>
            <Text style={styles.detailValue}>{item.warehouse}</Text>
          </View>
          <View style={styles.rightDetailItem}>
            <Text style={styles.detailLabel}>Batch</Text>
            <Text style={styles.detailValue}>{item.batch}</Text>
          </View>
        </View>
        <View style={styles.detailRow}>
          <View style={styles.leftDetailItem}>
            <Text style={styles.detailLabel}>Balance Qty</Text>
            <Text style={styles.balanceValue}>{item.balanceQty}</Text>
          </View>
          <View style={styles.rightDetailItem}>
            <Text style={styles.detailLabel}>Last Movement</Text>
            <Text style={styles.detailValue}>{item.lastMovement}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Header
        title="Negative Stock Exceptions"
        leftIcon="chevron-left"
        onLeftPress={() => navigation.goBack()}
      />
      <View style={styles.searchContainer}>
        <View style={styles.searchInput}>
          <Feather name="search" size={16} color="#8F939E" />
          <TextInput
            placeholder="Search"
            placeholderTextColor="#8F939E"
            style={styles.inputField}
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>
      </View>
      <FlatList
        data={filteredData}
        removeClippedSubviews={false}
        keyExtractor={item => item.id}
        renderItem={renderStockItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
      <View style={styles.shareButtonContainer}>
        <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
          <Text style={styles.shareButtonText}>
            {selectedItems.length > 0
              ? `Share ${selectedItems.length} Item(s)`
              : 'Share'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f8fa',
  },
  searchContainer: {
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  searchInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === 'ios' ? 12 : 4,
    minHeight: Platform.OS === 'ios' ? 44 : undefined,
    gap: 8,
  },
  inputField: {
    flex: 1,
    fontSize: Platform.OS === 'ios' ? 16 : 14,
    color: '#1A1A1A',
    ...(Platform.OS === 'ios' && {
      paddingVertical: 8,
    }),
  },
  listContainer: {
    paddingHorizontal: 12,
    paddingBottom: 20,
  },
  stockCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    padding: 12,
    flexDirection: 'column',
    gap: 1,
  },
  selectedCard: {
    borderColor: '#10B981',
    borderWidth: 1,
  },
  topSection: {
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
  detailsSection: {
    width: '100%',
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  productId: {
    fontSize: 12,
    color: '#8F939E',
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  leftDetailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,
    marginRight: 20,
  },
  rightDetailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,
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
  balanceValue: {
    fontSize: 12,
    color: '#1A1A1A',
    fontWeight: '700',
  },
  separator: {
    height: 12,
  },
  shareButtonContainer: {
    paddingHorizontal: 12,
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  shareButton: {
    backgroundColor: '#07624C',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  shareButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default NegativeStockExceptionsScreen;
