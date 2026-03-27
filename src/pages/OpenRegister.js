import React, {useState, useRef} from 'react';
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
import CustomCalendar from '../components/common/Calender';

const OpenRegister = ({navigation}) => {
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
    },
    {
      key: '2',
      companyName: 'Maaruji Technologies Private Limited',
      date: '10 Jul',
      ewayBillNumber: 'EWB-10045679',
      status: 'Generated',
      timestamp: '12 Jul 23:58',
      invoiceNumber: 'INV-30866',
      canExtend: false,
    },
    {
      key: '3',
      companyName: 'Tech Solutions Ltd',
      date: '09 Jul',
      ewayBillNumber: 'EWB-10045680',
      status: 'Generated',
      timestamp: '11 Jul 22:30',
      invoiceNumber: 'INV-30867',
      canExtend: true,
    },
    {
      key: '4',
      companyName: 'Digital Innovations Pvt Ltd',
      date: '09 Jul',
      ewayBillNumber: 'EWB-10045681',
      status: 'Generated',
      timestamp: '11 Jul 21:15',
      invoiceNumber: 'INV-30868',
      canExtend: false,
    },
    {
      key: '5',
      companyName: 'Maaruji Technologies Private Limited',
      date: '08 Jul',
      ewayBillNumber: 'EWB-10045682',
      status: 'Generated',
      timestamp: '10 Jul 20:45',
      invoiceNumber: 'INV-30869',
      canExtend: true,
    },
  ]);

  const filteredData = listData.filter(
    item =>
      item.companyName.toLowerCase().includes(searchText.toLowerCase()) ||
      item.invoiceNumber.toLowerCase().includes(searchText.toLowerCase()),
  );

  const handleExtendValidity = rowKey => {
    Alert.alert(
      'Extend Validity',
      'Do you want to extend the validity of this E-Way Bill?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Extend',
          onPress: () => {
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

  const renderInvoiceCard = ({item}) => {
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

  return (
    <>
      <View style={styles.container}>
        <Header
          title="Register"
          leftIcon="chevron-left"
          onLeftPress={() => navigation.goBack()}
        />

        <View style={styles.filtersSection}>
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
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-end',
            marginBottom: 10,
            paddingHorizontal: 10,
          }}>
          <View style={{flexShrink: 0 , marginRight:4}}>
            <CustomCalendar label="Select Date Range" />
          </View>
        </View>

        <SwipeListView
          ref={swipeListRef}
          removeClippedSubviews={false}
          data={filteredData}
          keyExtractor={(item, index) => item.key?.toString() || index.toString()}
          renderItem={renderInvoiceCard}
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
  filtersSection: {
    padding: 12,
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
  },
  searchInput: {
    flex: 1,
    fontSize: Platform.OS === 'ios' ? 16 : 16, // Increased font size for iOS to prevent auto-zoom
    color: '#111827',
    paddingVertical: Platform.OS === 'ios' ? 8 : 0, // Added vertical padding for iOS
  },
  scrollContent: {
    paddingHorizontal: 12,
    paddingBottom: 10,
  },
  billCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    overflow: 'hidden',
  },
  billHeader: {
    flexDirection: 'row',
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

export default OpenRegister;
