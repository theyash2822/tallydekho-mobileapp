import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Platform,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import Colors from '../../../../utils/Colors';
import Header from '../../../common/Header';
import CustomBottomButton from '../../../common/BottomButton';
import {Checkbox} from '../../../Helper/HelperComponents';

const DayBook = () => {
  const navigation = useNavigation();
  const [selectedView, setSelectedView] = useState('myEntries');
  const [expandedMonths, setExpandedMonths] = useState(['May 25']);
  const [selectedCards, setSelectedCards] = useState([]);
  const [showVoucherTypeDropdown, setShowVoucherTypeDropdown] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [selectedVoucherType, setSelectedVoucherType] =
    useState('Voucher Type');
  const [selectedStatus, setSelectedStatus] = useState('Status');
  const [showDr, setShowDr] = useState(true);
  const [showCr, setShowCr] = useState(true);

  // Mock data for transactions
  const transactions = [
    {
      month: 'May 25',
      entries: [
        {
          id: '1',
          voucherId: 'PV-2098',
          date: '07 May',
          company: 'Netaji Industries',
          description: 'Payment HDFC → Rent',
          amount: 'Cr ₹75 000',
          status: 'pending',
        },
        {
          id: '2',
          voucherId: 'PV-2098',
          date: '08 May',
          company: 'Netaji Industries',
          description: 'Journal → Salary Accrual',
          amount: 'Cr ₹75 000',
          status: 'pending',
        },
        {
          id: '3',
          voucherId: 'PV-2098',
          date: '09 May',
          company: 'Netaji Industries',
          description: 'Payment → Sales GST',
          amount: 'Cr ₹75 000',
          status: 'completed',
        },
      ],
    },
    {
      month: 'Jun 25',
      entries: [
        {
          id: '4',
          voucherId: 'RV-2099',
          date: '01 Jun',
          company: 'Netaji Industries',
          description: 'Receipt ICICI → Sales',
          amount: 'Dr ₹45 000',
          status: 'pending',
        },
        {
          id: '5',
          voucherId: 'JV-2100',
          date: '02 Jun',
          company: 'Netaji Industries',
          description: 'Journal → Office Expenses',
          amount: 'Dr ₹12 500',
          status: 'completed',
        },
      ],
    },
  ];

  const toggleMonthExpansion = month => {
    setExpandedMonths(prev =>
      prev.includes(month) ? prev.filter(m => m !== month) : [...prev, month],
    );
  };

  const getStatusIcon = status => {
    switch (status) {
      case 'completed':
        return <Icon name="check" size={16} color="#6F7C97" />;
      case 'pending':
        return <Icon name="refresh-cw" size={16} color="#6F7C97" />;
      default:
        return <Icon name="clock" size={16} color="#6F7C97" />;
    }
  };

  const getHeaderTitle = () => {
    return selectedView === 'myEntries' ? 'My Entries' : 'Day Book';
  };

  const getButtonText = () => {
    return selectedView === 'myEntries' ? 'Push' : 'Share';
  };

  const toggleCardSelection = cardId => {
    if (selectedView === 'myEntries') {
      setSelectedCards(prev =>
        prev.includes(cardId)
          ? prev.filter(id => id !== cardId)
          : [...prev, cardId],
      );
    }
  };

  const handleViewChange = view => {
    setSelectedView(view);
    // Clear selected cards when switching to Day Book view
    if (view === 'dayBook') {
      setSelectedCards([]);
    }
  };

  const voucherTypeOptions = ['ALL', 'Sales', 'Purchase'];
  const statusOptions = ['All', 'Pending'];

  const handleVoucherTypeSelect = type => {
    setSelectedVoucherType(type);
    setShowVoucherTypeDropdown(false);
  };

  const handleStatusSelect = status => {
    setSelectedStatus(status);
    setShowStatusDropdown(false);
  };

  return (
    <View style={styles.container}>
      {/* <StatusBar barStyle="dark-content" backgroundColor="#F4F5FA" /> */}

      {/* Header */}
      <Header
        title={getHeaderTitle()}
        leftIcon={'chevron-left'}
        onLeftPress={() => navigation.goBack()}
      />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}>
        {/* Period Section */}
        <View style={styles.periodContainer}>
          <View style={styles.periodHeader}>
            <View style={styles.periodLeft}>
              <Icon name="calendar" size={16} color="#6B7280" />
              <Text style={styles.periodText}>01 Apr - 30 Jun 25</Text>
            </View>
            <Text style={styles.voucherCount}>4 392 Vouchers</Text>
          </View>
        </View>

        {/* Filters */}
        <View style={styles.filtersContainer}>
          <View style={styles.filterItemContainer}>
            <TouchableOpacity
              style={styles.filterItem}
              onPress={() =>
                setShowVoucherTypeDropdown(!showVoucherTypeDropdown)
              }>
              <Text style={styles.filterLabel}>{selectedVoucherType}</Text>
              <Icon
                name={showVoucherTypeDropdown ? 'chevron-up' : 'chevron-down'}
                size={16}
                color="#6B7280"
              />
            </TouchableOpacity>

            {showVoucherTypeDropdown && (
              <View style={styles.dropdownContainer}>
                {voucherTypeOptions.map((option, index) => (
                  <TouchableOpacity
                    key={option}
                    style={[
                      styles.dropdownItem,
                      index === voucherTypeOptions.length - 1 &&
                        styles.lastDropdownItem,
                    ]}
                    onPress={() => handleVoucherTypeSelect(option)}>
                    <Text
                      style={[
                        styles.dropdownText,
                        selectedVoucherType === option &&
                          styles.dropdownTextSelected,
                      ]}>
                      {option}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          <View style={styles.filterItemContainer}>
            <TouchableOpacity
              style={styles.filterItem}
              onPress={() => setShowStatusDropdown(!showStatusDropdown)}>
              <Text style={styles.filterLabel}>{selectedStatus}</Text>
              <Icon
                name={showStatusDropdown ? 'chevron-up' : 'chevron-down'}
                size={16}
                color="#6B7280"
              />
            </TouchableOpacity>

            {showStatusDropdown && (
              <View style={styles.dropdownContainer}>
                {statusOptions.map((option, index) => (
                  <TouchableOpacity
                    key={option}
                    style={[
                      styles.dropdownItem,
                      index === statusOptions.length - 1 &&
                        styles.lastDropdownItem,
                    ]}
                    onPress={() => handleStatusSelect(option)}>
                    <Text
                      style={[
                        styles.dropdownText,
                        selectedStatus === option &&
                          styles.dropdownTextSelected,
                      ]}>
                      {option}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          <Checkbox
            label="Dr"
            checked={showDr}
            onPress={() => setShowDr(!showDr)}
            style={{marginBottom: 0, marginRight: 8}}
          />
          <Checkbox
            label="Cr"
            checked={showCr}
            onPress={() => setShowCr(!showCr)}
            style={{marginBottom: 0}}
          />
        </View>

        {/* View Selection */}
        <View style={styles.viewSelectionContainer}>
          <TouchableOpacity
            style={[
              styles.viewButton,
              selectedView === 'myEntries' && styles.viewButtonActive,
            ]}
            onPress={() => handleViewChange('myEntries')}>
            <Icon
              name="edit-3"
              size={16}
              color={selectedView === 'myEntries' ? '#1F2937' : '#6B7280'}
            />
            <Text
              style={[
                styles.viewButtonText,
                selectedView === 'myEntries' && styles.viewButtonTextActive,
              ]}>
              My Entries
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.viewButton,
              selectedView === 'dayBook' && styles.viewButtonActive,
            ]}
            onPress={() => handleViewChange('dayBook')}>
            <Icon
              name="calendar"
              size={16}
              color={selectedView === 'dayBook' ? '#1F2937' : '#6B7280'}
            />
            <Text
              style={[
                styles.viewButtonText,
                selectedView === 'dayBook' && styles.viewButtonTextActive,
              ]}>
              Day Book
            </Text>
          </TouchableOpacity>
        </View>

        {/* Summary Totals */}
        <View
          style={{
            backgroundColor: '#fff',
            padding: 12,
            borderRadius: 14,
            borderWidth: 1,
            borderColor: Colors.border,
          }}>
          <View style={styles.summaryContainer}>
            <Text style={styles.summaryText}>Cr ₹75 000</Text>
            <Text style={styles.summaryText}>Dr ₹72.4 M</Text>
          </View>

          {/* Transactions */}
          <View style={styles.transactionsContainer}>
            {transactions.map((monthData, index) => (
              <View key={index} style={styles.monthGroup}>
                <TouchableOpacity
                  style={styles.monthHeader}
                  onPress={() => toggleMonthExpansion(monthData.month)}>
                  <Text style={styles.monthTitle}>{monthData.month}</Text>
                  <Icon
                    name={
                      expandedMonths.includes(monthData.month)
                        ? 'chevron-up'
                        : 'chevron-down'
                    }
                    size={16}
                    color="#6B7280"
                  />
                </TouchableOpacity>

                {expandedMonths.includes(monthData.month) && (
                  <View style={styles.entriesContainer}>
                    {monthData.entries.map(entry => (
                      <TouchableOpacity
                        key={entry.id}
                        style={[
                          styles.entryItem,
                          selectedCards.includes(entry.id) &&
                            styles.entryItemSelected,
                        ]}
                        onPress={() => toggleCardSelection(entry.id)}
                        activeOpacity={0.7}>
                        {/* Top row: Voucher ID, dot separator, and Date */}
                        <View style={styles.topRow}>
                          <Text style={styles.voucherId}>
                            {entry.voucherId}
                          </Text>
                          <View style={styles.dotSeparator} />
                          <Text style={styles.entryDate}>{entry.date}</Text>
                        </View>

                        {/* Status Icon, Company Name, and Description in same row */}
                        <View style={styles.contentRow}>
                          <View
                            style={[
                              styles.statusIconContainer,
                              {backgroundColor: '#F4F5FA'},
                            ]}>
                            {getStatusIcon(entry.status)}
                          </View>
                          <View style={styles.textContent}>
                            <Text style={styles.companyName}>
                              {entry.company}
                            </Text>
                            <Text style={styles.description}>
                              {entry.description}
                            </Text>
                          </View>
                        </View>

                        {/* Amount - positioned absolutely on the right */}
                        <View style={styles.amountContainer}>
                          <Text style={styles.amount}>{entry.amount}</Text>
                        </View>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>
            ))}
          </View>
        </View>

        {/* Bottom spacing */}
        <View style={{height: 20}} />
      </ScrollView>

      {/* Bottom Button */}
      <CustomBottomButton
        onPress={() => {
          // Handle button press based on selected view
          if (selectedView === 'myEntries') {
            // Handle Push action
            console.log('Push selected cards:', selectedCards);
          } else {
            // Handle Share action
            console.log('Share day book data');
          }
        }}
        buttonText={getButtonText()}
        textColor="#FFFFFF"
      />
    </View>
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
  periodContainer: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  periodHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  periodLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  periodText: {
    fontSize: 14,
    fontWeight: '400',
    color: '#111111',
  },
  voucherCount: {
    fontSize: 12,
    color: '#000000',
    fontWeight: '500',
  },
  filtersContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 10,
    flexWrap: 'wrap',
  },
  filterItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 6,
    minWidth: 100,
    justifyContent: 'space-between',
  },
  filterItemContainer: {
    position: 'relative',
  },
  filterLabel: {
    fontSize: 10,
    color: '#6F7C97',
    fontWeight: '400',
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
  viewSelectionContainer: {
    flexDirection: 'row',
    backgroundColor: '#F4F5FA',
    borderRadius: 22,
    padding: 4,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  viewButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 20,
    gap: 8,
  },
  viewButtonActive: {
    backgroundColor: '#fff',
  },
  viewButtonText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  viewButtonTextActive: {
    color: '#1F2937',
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: Colors.white,
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  summaryText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
  },
  transactionsContainer: {
    gap: 12,
  },
  monthGroup: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  monthHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    minHeight: 28,
  },
  monthTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000000',
  },
  entriesContainer: {
    padding: 12,
  },
  entryItem: {
    position: 'relative',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    marginBottom: 6,
    backgroundColor: Colors.white,
  },
  entryItemSelected: {
    borderWidth: 2,
    borderColor: '#10B981',
    borderRadius: 8,
    marginBottom: 8,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  voucherId: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primaryTitle,
  },
  dotSeparator: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#6B7280',
  },
  entryDate: {
    fontSize: 12,
    color: '#6B7280',
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 8,
  },
  statusIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContent: {
    flex: 1,
    gap: 4,
  },
  companyName: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.primaryTitle,
  },
  description: {
    fontSize: 12,
    color: '#6B7280',
  },
  amountContainer: {
    position: 'absolute',
    top: 16,
    right: 16,
    bottom: 16,
    justifyContent: 'center',
  },
  amount: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primaryTitle,
  },
});

export default DayBook;
