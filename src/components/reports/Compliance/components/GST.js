import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Platform,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import {TextSemibold} from '../../../../utils/CustomText';
import Colors from '../../../../utils/Colors';
import Header from '../../../common/Header';
import CustomBottomButton from '../../../common/BottomButton';
// import ShareNew from '../../../../assets/icons/sharenew';
import {useAuth} from '../../../../hooks/useAuth';

const {width} = Dimensions.get('window');

const GSTScreen = () => {
  const navigation = useNavigation();
  const {selectedFY} = useAuth(); 
  const [selectedTab, setSelectedTab] = useState('GSTR-1');
  const [selectedItems, setSelectedItems] = useState([]);
  
  // Dropdown states - FY dropdown is now locked
  const [showPeriodDropdown, setShowPeriodDropdown] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('Period');

  // Dropdown options
  const periodOptions = ['Daily', 'Weekly', 'Monthly', 'Quarterly'];

  // Handler
  const handlePeriodSelect = (period) => {
    setSelectedPeriod(period);
    setShowPeriodDropdown(false);
  };

  const gstSummary = {
    gstCollected: '₹475 K',
    itcBalance: '₹392 K',
    netPayable: '₹83 K',
    unmatchedInvoices: 7,
  };

  const gstTransactions = [
    {
      id: 1,
      transactionId: 'XYD-0909A',
      type: 'Sales',
      companyName: 'Netaji Industries',
      date: '25 July 2025',
      amount: '₹360,000',
      status: 'warning',
    },
    {
      id: 2,
      transactionId: 'XYD-0908B',
      type: 'Sales',
      companyName: 'ABC Corporation',
      date: '24 July 2025',
      amount: '₹280,000',
      status: 'success',
    },
    {
      id: 3,
      transactionId: 'XYD-0907C',
      type: 'Sales',
      companyName: 'XYZ Limited',
      date: '23 July 2025',
      amount: '₹195,000',
      status: 'success',
    },
    {
      id: 4,
      transactionId: 'XYD-0907C',
      type: 'Sales',
      companyName: 'XYZ Limited',
      date: '23 July 2025',
      amount: '₹195,000',
      status: 'success',
    },
  ];

  const tabs = ['GSTR-1', 'GSTR-2A', 'GSTR-9', 'GSTR-4', 'GSTR-3B', 'GSTR-6'];

  const toggleSelection = id => {
    setSelectedItems(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id],
    );
  };

  const renderGSTSummary = () => (
    <View style={styles.gstSummaryCard}>
      <View style={styles.summaryRow}>
        <Text style={styles.summaryLabel}>GST Collected</Text>
        <Text style={styles.summaryValue}>{gstSummary.gstCollected}</Text>
      </View>
      <View style={styles.summaryRow}>
        <Text style={styles.summaryLabel}>ITC Balance</Text>
        <Text style={styles.summaryValue}>{gstSummary.itcBalance}</Text>
      </View>
      <View style={styles.summaryRow}>
        <Text style={styles.summaryLabel}>Net Payable</Text>
        <Text style={styles.summaryValue}>{gstSummary.netPayable}</Text>
      </View>
      <TouchableOpacity
        style={styles.unmatchedButton}
        onPress={() => navigation.navigate('UnmatchedList')}>
        <Text style={styles.unmatchedButtonText}>
          Unmatched {gstSummary.unmatchedInvoices} Invoices
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderGSTLedger = () => (
    <View style={styles.ledgerSection}>
      <TextSemibold style={styles.ledgerTitle}>GST Ledger</TextSemibold>

      {/* Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.tabsContainer}>
        {tabs.map(tab => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, selectedTab === tab && styles.selectedTab]}
            onPress={() => setSelectedTab(tab)}>
            <Text
              style={[
                styles.tabText,
                selectedTab === tab && styles.selectedTabText,
              ]}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Transaction List */}
      <View style={styles.transactionsList}>
        {gstTransactions.map(transaction => {
          const isSelected = selectedItems.includes(transaction.id);
          return (
            <TouchableOpacity
              key={transaction.id}
              activeOpacity={0.9}
              onPress={() => toggleSelection(transaction.id)}
              onLongPress={() => toggleSelection(transaction.id)}
              style={[
                styles.transactionCard,
                isSelected && {borderColor: '#16C47F', borderWidth: 1},
              ]}>
              {/* Top Header */}
              <View style={styles.cardHeader}>
                <Text style={styles.transactionId}>
                  {transaction.transactionId}
                </Text>
                <View style={styles.headerDot} />
                <Text style={styles.transactionType}>{transaction.type}</Text>
              </View>

              {/* Main Content */}
              <View style={styles.cardContent}>
                <View style={styles.iconContainer}>
                  {transaction.status === 'warning' ? (
                    <Ionicons name="warning" size={16} color="#EF4444" />
                  ) : (
                    <Ionicons name="checkmark" size={16} color="#6F7C97" />
                  )}
                </View>

                <View style={styles.textBlock}>
                  <Text style={styles.companyName}>
                    {transaction.companyName}
                  </Text>
                  <Text style={styles.transactionDate}>{transaction.date}</Text>
                </View>

                <Text style={styles.transactionAmount}>
                  {transaction.amount}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );

  return (
    <>
      <Header
        title={'GST'}
        leftIcon={'chevron-left'}
        // rightIcon={ShareNew}
        // rightIconColor="#111"
      />

      <View style={styles.container}>
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}>
          {/* Filters */}
          <View style={styles.filtersContainer}>
            <View style={styles.filterItemContainer}>
              {/* Read-only FY display - locked to Dashboard selection */}
              <View style={[styles.filterDropdown, styles.lockedDropdown]}>
                <Feather name="calendar" size={16} color="#9CA3AF" style={{marginRight: 1}} />
                <Text style={styles.filterText}>FY {selectedFY?.name || '2025-26'}</Text>
              </View>
            </View>

            <View style={styles.filterItemContainer}>
              <TouchableOpacity
                style={styles.filterDropdown}
                onPress={() => setShowPeriodDropdown(!showPeriodDropdown)}>
                <Text style={styles.filterText}>{selectedPeriod}</Text>
                <Feather name={showPeriodDropdown ? "chevron-up" : "chevron-down"} size={16} color="#6B7280" />
              </TouchableOpacity>

              {showPeriodDropdown && (
                <View style={styles.dropdownContainer}>
                  {periodOptions.map((option, index) => (
                    <TouchableOpacity
                      key={option}
                      style={[
                        styles.dropdownItem,
                        index === periodOptions.length - 1 && styles.lastDropdownItem,
                      ]}
                      onPress={() => handlePeriodSelect(option)}>
                      <Text style={[
                        styles.dropdownText,
                        selectedPeriod === option && styles.dropdownTextSelected,
                      ]}>
                        {option}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          </View>

          {/* GST Summary */}
          {renderGSTSummary()}

          {/* GST Ledger */}
          {renderGSTLedger()}
        </ScrollView>
      </View>

      {/* Bottom Buttons */}
      {selectedItems.length > 0 && (
        <CustomBottomButton buttonText="Share PDF / XLS" />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F5FA',
  },
  scrollView: {
    flex: 1,
    padding: 12,
  },
  filtersContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 10,
    zIndex: 10,
  },
  filterItemContainer: {
    position: 'relative',
    zIndex: 10,
  },
  filterDropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 6,
  },
  lockedDropdown: {
    backgroundColor: '#fff',
  },
  filterText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  dropdownContainer: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: Colors.white,
    borderRadius: 8,
    marginTop: 4,
    zIndex: 1000,
    borderWidth: 1,
    borderColor: Colors.border,
    ...(Platform.OS === 'ios' && {
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.1,
      shadowRadius: 4,
    }),
  },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  lastDropdownItem: {
    borderBottomWidth: 0,
  },
  dropdownText: {
    fontSize: 12,
    color: '#6F7C97',
    fontWeight: '400',
  },
  dropdownTextSelected: {
    color: '#6F7C97',
    fontWeight: '500',
    fontSize: 12,
  },
  gstSummaryCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#111',
    fontWeight: '500',
  },
  summaryValue: {
    fontSize: 12,
    color: '#111',
    fontWeight: '600',
  },
  unmatchedButton: {
    backgroundColor: '#07624C',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  unmatchedButtonText: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
  ledgerSection: {
    borderRadius: 12,
    marginBottom: 24,
  },
  ledgerTitle: {
    fontSize: 14,
    color: '#111111',
    fontWeight: '500',
    marginBottom: 8,
    marginLeft:2
  },
  tabsContainer: {
    marginBottom: 12,
  },
  tab: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginRight: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  selectedTab: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  tabText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  selectedTabText: {
    color: '#111827',
  },
  transactionsList: {
    gap: 10,

  },
  transactionCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  transactionId: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '400',
  },
  headerDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: '#9CA3AF',
    marginHorizontal: 6,
  },
  transactionType: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '400',
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    marginRight: 12,
    backgroundColor: '#F4F5FA',
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textBlock: {
    flex: 1,
  },
  companyName: {
    fontSize: 14,
    color: '#1F2937',
    fontWeight: '500',
    marginBottom: 2,
  },
  transactionDate: {
    fontSize: 12,
    color: '#667085',
    fontWeight: '400',
  },
  transactionAmount: {
    fontSize: 14,
    color: '#000000',
    fontWeight: '600',
  },
});

export default GSTScreen;
