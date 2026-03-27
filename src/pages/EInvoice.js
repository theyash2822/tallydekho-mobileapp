import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import {SwipeListView} from 'react-native-swipe-list-view';
import Header from '../components/common/Header';
import Colors from '../utils/Colors';
import Feather from 'react-native-vector-icons/Feather';
import CustomBottomButton from '../components/common/BottomButton';

const EInvoices = ({navigation}) => {
  const [selectedFY, setSelectedFY] = useState('FY 2025-26');
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [searchText, setSearchText] = useState('');
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
            // Handle cancel logic here
            const newData = listData.filter(item => item.key !== rowKey);
            setListData(newData);
          },
        },
      ],
    );
  };

  const renderItem = ({item}) => (
    <View style={styles.billCard}>
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
    </View>
  );

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
            <Feather name="x-circle" size={20} color="#FF3B30" />
          </View>
          <Text style={styles.backTextWhite}>Cancel</Text>
        </View>
      </TouchableOpacity>
    </View>
  );

  const ListHeaderComponent = () => (
    <>
      {/* Filters Section */}
      <View style={styles.filtersSection}>
        <View style={styles.filterRow}>
          <TouchableOpacity style={styles.filterButton}>
            <Text style={styles.filterButtonText}>{selectedFY}</Text>
            <Feather name="chevron-down" size={16} color="#6B7280" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.filterButton}>
            <Text style={styles.filterButtonText}>{selectedFilter}</Text>
            <Feather name="chevron-down" size={16} color="#6B7280" />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
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

        {/* Status Overview */}
        <View style={styles.statusSection}>
          <View style={styles.statusRow}>
            <View style={styles.statusItem}>
              <View style={styles.statusBox}>
                <Text style={styles.statusLabel}>Pending</Text>
                <Text style={styles.statusCount}>17</Text>
              </View>
            </View>
            <View style={styles.statusItem}>
              <View style={styles.statusBox}>
                <Text style={styles.statusLabel}>Cancelled</Text>
                <Text style={styles.statusCount}>17</Text>
              </View>
            </View>
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.generatedButton}>
              <Text style={styles.generatedButtonText}>Generated 265</Text>
              <Feather
                name="chevron-right"
                size={16}
                color="#FFFFFF"
                style={styles.arrowIcon}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </>
  );

  return (
    <>
      <View style={styles.container}>
        <Header
          title="E-Invoice"
          leftIcon="chevron-left"
          onLeftPress={() => navigation.goBack()}
        />

        <SwipeListView
          removeClippedSubviews={false}
          data={listData}
          renderItem={renderItem}
          renderHiddenItem={renderHiddenItem}
          ListHeaderComponent={ListHeaderComponent}
          leftOpenValue={155}
          rightOpenValue={-135}
          previewRowKey={'0'}
          previewOpenValue={-70}
          previewOpenDelay={3000}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      </View>
      <CustomBottomButton buttonText="Share" />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundColorPrimary,
  },
  listContainer: {
    paddingBottom: 10,
  },
  filtersSection: {
    padding: 12,
    marginBottom: 8,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 4,
    gap: 6,
    backgroundColor: '#fff',
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
  },
  statusSection: {
    backgroundColor: '#FFFFFF',
    padding: 12,
    marginTop: 10,
    borderRadius: 12,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  statusItem: {
    alignItems: 'center',
    flexDirection: 'row',
    flex: 1,
  },
  statusBox: {
    backgroundColor: '#F3F4F6',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
  },
  buttonRow: {
    alignItems: 'center',
    width: '100%',
  },
  statusLabel: {
    fontSize: 12,
    color: '#8F939E',
    fontWeight: '400',
  },
  statusCount: {
    fontSize: 12,
    fontWeight: '500',
    color: '#111111',
  },
  generatedButton: {
    backgroundColor: '#07624C',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  generatedButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  arrowIcon: {
    marginLeft: 4,
  },
  billCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    padding: 12,
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
  separator: {
    height: 12,
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
    width: 145,
    borderRadius: 12,
  },
  backLeftBtn: {
    left: 16,
  },
  backRightBtn: {
    right: 16,
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

export default EInvoices;
