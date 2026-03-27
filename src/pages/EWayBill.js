import React, {useState, useMemo, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  Platform,
} from 'react-native';
import {SwipeListView} from 'react-native-swipe-list-view';
import Header from '../components/common/Header';
import Colors from '../utils/Colors';
import Feather from 'react-native-vector-icons/Feather';
import CustomBottomButton from '../components/common/BottomButton';
import {Icons} from '../utils/Icons';
import {SwipeableCards} from '../components/common';
import FilterRow from './Filterrow';
import {FinancialMetricsSection} from '../components/financial';

const EWayBillScreen = ({navigation}) => {
  const [selectedFY, setSelectedFY] = useState('FY 2025-26');
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [searchText, setSearchText] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);
  const swipeListRef = useRef(null);

  const [listData, setListData] = useState([
    {
      key: '1',
      companyName: 'Maaruji Technologies Private Limited',
      date: '10 Jul',
      ewayBillNumber: 'EWB-10045678',
      status: 'Generated',
      timestamp: '12 Jul 23:59',
      invoiceNumber: 'INV-30865',
      canExtend: true,
      type: 'Paid',
    },
    {
      key: '2',
      companyName: 'Tech Solutions Ltd',
      date: '09 Jul',
      ewayBillNumber: 'EWB-10045679',
      status: 'Generated',
      timestamp: '11 Jul 22:30',
      invoiceNumber: 'INV-30866',
      canExtend: false,
      type: 'Pending',
    },
    {
      key: '3',
      companyName: 'Digital Innovations Pvt Ltd',
      date: '08 Jul',
      ewayBillNumber: 'EWB-10045680',
      status: 'Generated',
      timestamp: '10 Jul 20:45',
      invoiceNumber: 'INV-30867',
      canExtend: true,
      type: 'Cancelled',
    },
    {
      key: '4',
      companyName: 'Maaruji Tech',
      date: '07 Jul',
      ewayBillNumber: 'EWB-10045681',
      status: 'Generated',
      timestamp: '09 Jul 18:30',
      invoiceNumber: 'INV-30868',
      canExtend: false,
      type: 'Paid',
    },
    {
      key: '5',
      companyName: 'StartUp Pvt Ltd',
      date: '06 Jul',
      ewayBillNumber: 'EWB-10045682',
      status: 'Generated',
      timestamp: '08 Jul 17:00',
      invoiceNumber: 'INV-30869',
      canExtend: true,
      type: 'Pending',
    },
  ]);

  // derived state based on filter
  const filteredData = listData.filter(
    item =>
      (selectedFilter === 'All' || item.type === selectedFilter) &&
      (item.companyName.toLowerCase().includes(searchText.toLowerCase()) ||
        item.invoiceNumber.toLowerCase().includes(searchText.toLowerCase())),
  );

  const Cards = [
    {
      id: 'cards-amount',
      title: 'Total Amount',
      value: '₹4500',
      change: '+18%',
      changeType: 'positive',
      icon: Icons.Calender,
    },
    {
      id: 'cards-paid',
      title: 'Paid',
      value: '₹3500',
      change: '+12%',
      changeType: 'positive',
      icon: Icons.CalenderDate,
    },
    {
      id: 'cards-pending',
      title: 'Pending',
      value: '₹1,000',
      change: '+22%',
      changeType: 'positive',
      icon: Icons.CalenderYear,
    },
  ];

  const handleExtendValidity = rowKey => {
    Alert.alert(
      'Extend Validity',
      'Do you want to extend the validity of this E-Way Bill?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Extend',
          onPress: () => {
            // Handle extend validity logic here
            console.log('Extending validity for:', rowKey);
          },
        },
      ],
    );
  };

  const handleCancel = rowKey => {
    Alert.alert(
      'Cancel E-Way Bill',
      'Are you sure you want to cancel this E-Way Bill?',
      [
        {text: 'No', style: 'cancel'},
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: () => {
            const newData = listData.filter(item => item.key !== rowKey);
            setListData(newData);
          },
        },
      ],
    );
  };

  const CardPress = card => {
    // Handle card press if needed
    console.log('Card pressed:', card.title);
  };

  const toggleItemSelection = key => {
    setSelectedItems(prev =>
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key],
    );
  };

  const handleLongPress = key => {
    if (!selectedItems.includes(key)) {
      toggleItemSelection(key);
    }
  };

  const handleTap = key => {
    if (selectedItems.length > 0) {
      toggleItemSelection(key);
    }
  };

  const renderBillCard = ({item}) => {
    const isSelected = selectedItems.includes(item.key);

    return (
      <TouchableOpacity
        style={[
          styles.billCard,
          isSelected && {borderColor: '#10B981', borderWidth: 1},
        ]}
        onPress={() => handleTap(item.key)}
        onLongPress={() => handleLongPress(item.key)}
        activeOpacity={1}>
        <View style={styles.billHeader}>
          <View style={styles.billLeft}>
            <Text style={styles.invoiceNumber}>{item.invoiceNumber}</Text>
            <View style={styles.billContentRow}>
              <View style={styles.statusIcon}>
                <Feather name="arrow-down-left" size={16} color="#16C47F" />
              </View>
              <View style={styles.billInfo}>
                <Text style={styles.companyName}>{item.companyName}</Text>
                <Text style={styles.timestamp}>
                  {item.timestamp} {item.status}
                </Text>
              </View>
              <View style={styles.billRight}>
                <Text style={styles.date}>{item.date}</Text>
                <Text style={styles.ewayBillNumber}>{item.ewayBillNumber}</Text>
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderHiddenItem = ({item}) => (
    <View style={styles.rowBack}>
      <TouchableOpacity
        style={[styles.backBtn, styles.backLeftBtn]}
        onPress={() => handleExtendValidity(item.key)}
        disabled={!item.canExtend}>
        <View style={styles.actionButton}>
          <View style={styles.iconContainer}>
            <Feather name="calendar" size={20} color="#6F7C97" />
          </View>
          <Text style={styles.backTextWhite}>Extend Validity</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.backBtn, styles.backRightBtn]}
        onPress={() => handleCancel(item.key)}>
        <View style={styles.actionButton}>
          <View style={styles.iconContainer}>
            <Feather name="x" size={20} color="#FF3B30" />
          </View>
          <Text style={styles.backTextWhite}>Cancel</Text>
        </View>
      </TouchableOpacity>
    </View>
  );

  const ListHeaderComponent = useMemo(
    () => (
      <>
        <View style={styles.filtersSection}>
          <FilterRow
            selectedFY={selectedFY}
            selectedFilter={selectedFilter}
            onFilterChange={setSelectedFilter}
            onFYChange={setSelectedFY}
          />

          <View style={styles.searchContainer}>
            <Feather name="search" size={20} color="#9CA3AF" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search"
              placeholderTextColor="#9CA3AF"
              value={searchText}
              onChangeText={setSearchText}
            />
          </View>
        </View>
      </>
    ),
    [selectedFY, selectedFilter, searchText],
  );

  return (
    <>
      <View style={styles.container}>
        <Header title="E-Way Bill" leftIcon="chevron-left" />
        {ListHeaderComponent}
        <FinancialMetricsSection cards={Cards} onCardPress={CardPress} />
        <View style={{marginTop:8}}></View>

        <SwipeListView
          ref={swipeListRef}
          data={filteredData}
          removeClippedSubviews={false}
          keyExtractor={(item, index) => item.key?.toString() || index.toString()}
          renderItem={renderBillCard}
          renderHiddenItem={renderHiddenItem}
          leftOpenValue={140}
          rightOpenValue={-110}
          disableLeftSwipe={false}
          disableRightSwipe={false}
          closeOnRowOpen={true}
          closeOnRowBeginSwipe={false}
          closeOnScroll={true}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          previewOpenValue={-40}
          previewOpenDelay={0}
        />
      </View>
      {selectedItems.length > 0 && <CustomBottomButton buttonText="Share" />}
    </>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundColorPrimary,
  },
  scrollContent: {
    paddingHorizontal: 12,
    paddingBottom: 10,
  },
  filtersSection: {
    padding: 10,
    zIndex: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === 'ios' ? 12 : 14, // Increased padding for iOS
    minHeight: Platform.OS === 'ios' ? 44 : undefined, // Min height for iOS touch target
    gap: 6,
    backgroundColor: '#fff',
    zIndex: 1,
  },
  searchInput: {
    flex: 1,
    fontSize: Platform.OS === 'ios' ? 16 : 16, // Increased font size for iOS to prevent auto-zoom
    color: '#111827',
    paddingVertical: Platform.OS === 'ios' ? 8 : 0, // Added vertical padding for iOS
  },
  billCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    overflow: 'hidden',
  },
  billLeft: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    flex: 1,
  },
  billContentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  statusIcon: {
    marginRight: 12,
    backgroundColor: '#F0F2F9',
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  billInfo: {
    flex: 1,
  },
  invoiceNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  companyName: {
    fontSize: 12,
    fontWeight: '500',
    color: '#000000',
    marginBottom: 8,
  },
  timestamp: {
    fontSize: 12,
    color: '#6B7280',
  },
  billRight: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 40,
  },
  date: {
    fontSize: 10,
    color: '#667085',
    fontWeight: '400',
  },
  ewayBillNumber: {
    fontSize: 10,
    fontWeight: '500',
    color: '#667085',
  },
  rowBack: {
    alignItems: 'center',
    backgroundColor: 'transparent',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  backBtn: {
    alignItems: 'center',
    bottom: 0,
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    width: 115,
    borderRadius: 12,
  },
  backLeftBtn: {
    left: 16,
  },
  backRightBtn: {
    right: 1,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    flex: 1,
  },
  iconContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backTextWhite: {
    color: '#6F7C97',
    fontSize: 12,
    fontWeight: '400',
    textAlign: 'center',
  },
});

export default EWayBillScreen;
