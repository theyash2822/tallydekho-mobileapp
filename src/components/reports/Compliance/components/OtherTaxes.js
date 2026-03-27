import React, { useState } from 'react';
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
import { useNavigation } from '@react-navigation/native';
import { TextSemibold, TextRegular } from '../../../../utils/CustomText';
import Colors from '../../../../utils/Colors';
import Header from '../../../common/Header';
import CustomBottomButton from '../../../common/BottomButton';
import { useAuth } from '../../../../hooks/useAuth';

const { width } = Dimensions.get('window');

const OtherTaxes = () => {
  const navigation = useNavigation();
  const { selectedFY } = useAuth();
  const [selectedTab, setSelectedTab] = useState('TDS');

  // Dropdown states - FY dropdown is now locked
  const [showPeriodDropdown, setShowPeriodDropdown] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('Period');

  // Dropdown options
  const periodOptions = ['Monthly', 'Quarterly', 'Half Yearly', 'Yearly'];

  // Handler
  const handlePeriodSelect = (period) => {
    setSelectedPeriod(period);
    setShowPeriodDropdown(false);
  };

  // Mock data for different tabs
  const tabFinancialData = {
    TDS: {
      Deducted: '₹182 K',
      Remitted: '₹140 K',
      'Pending Pay': '₹42 K',
      'Late-Fee': '₹1.5 K',
    },
    TCS: {
      Collected: '₹95 K',
      Remitted: '₹78 K',
      'Pending Pay': '₹17 K',
      'Late-Fee': '₹0.8 K',
    },
    'Import Duty': {
      'Duty Assessed': '₹245 K',
      'Duty Paid': '₹198 K',
      'Pending Duty': '₹47 K',
      Interest: '₹2.1 K',
    },
    'Export Duty': {
      'Duty Assessed': '₹156 K',
      'Duty Paid': '₹134 K',
      'Pending Duty': '₹22 K',
      'Refund Awaiting': '₹1.2 K',
    },
    Excise: {
      'Duty Accrued': '₹89 K',
      'Duty Paid': '₹76 K',
      'Input Credit': '₹13 K',
      'Net Payable': '₹0.9 K',
    },
    VAT: {
      'Output VAT': '₹312 K',
      'Input VAT': '₹268 K',
      'Net Payable': '₹44 K',
    },
    Cess: {
      'Cess Accrued': '₹67 K',
      'Cess Paid': '₹58 K',
      'Pending Cess': '₹9 K',
      Interest: '₹0.6 K',
    },
  };

  const getFinancialLabels = tab => {
    const labels = {
      TDS: ['Deducted', 'Remitted', 'Pending Pay', 'Late-Fee'],
      TCS: ['Collected', 'Remitted', 'Pending Pay', 'Late-Fee'],
      'Import Duty': ['Duty Assessed', 'Duty Paid', 'Pending Duty', 'Interest'],
      'Export Duty': [
        'Duty Assessed',
        'Duty Paid',
        'Pending Duty',
        'Refund Awaiting',
      ],
      Excise: ['Duty Accrued', 'Duty Paid', 'Input Credit', 'Net Payable'],
      VAT: ['Output VAT', 'Input VAT', 'Net Payable'],
      Cess: ['Cess Accrued', 'Cess Paid', 'Pending Cess', 'Interest'],
    };
    return labels[tab] || labels.TDS;
  };

  const getFinancialValues = tab => {
    return tabFinancialData[tab] || tabFinancialData.TDS;
  };

  const lateChallans = [
    { id: 1, invoice: 'INV-893', amount: '₹18 K', dueDate: '05 Jul' },
    { id: 2, invoice: 'INV-918', amount: '₹12 K', dueDate: '09 Jul' },
    { id: 3, invoice: 'INV-321', amount: '₹11.2 K', dueDate: '09 Jul' },
    { id: 4, invoice: 'INV-245', amount: '₹15.5 K', dueDate: '09 Jul' },
    { id: 5, invoice: 'INV-789', amount: '₹9.8 K', dueDate: '09 Jul' },
  ];

  const recentActivity = [
    { action: '14 IRNs generated', timestamp: '10 Jul 14:42' },
    { action: '9 IRNs retry (success 8)', timestamp: '10 Jul 14:42' },
    {
      action: '9 IRNs Modified (success 3, Failed 6)',
      timestamp: '10 Jul 14:42',
    },
  ];

  const tabs = [
    'TDS',
    'TCS',
    'Import Duty',
    'Export Duty',
    'Excise',
    'VAT',
    'Cess',
  ];

  const renderFinancialSummary = () => {
    const financialData = getFinancialValues(selectedTab);
    const labels = getFinancialLabels(selectedTab);
    const isVAT = selectedTab === 'VAT';

    return (
      <View style={styles.financialGrid}>
        {/* Row 1 */}
        <View style={styles.financialRow}>
          <View style={styles.financialItem}>
            <Text style={styles.financialLabel}>{labels[0]}</Text>
            <Text style={styles.financialValue}>
              {financialData[labels[0]]}
            </Text>
          </View>
          <View style={styles.financialItem}>
            <Text style={styles.financialLabel}>{labels[1]}</Text>
            <Text style={styles.financialValue}>
              {financialData[labels[1]]}
            </Text>
          </View>
        </View>
        {/* Row 2 */}
        <View style={styles.financialRow}>
          {!isVAT ? (
            <>
              <View style={styles.financialItem}>
                <Text style={styles.financialLabel}>{labels[2]}</Text>
                <Text style={styles.financialValue}>
                  {financialData[labels[2]]}
                </Text>
              </View>
              <View style={styles.financialItem}>
                <Text style={styles.financialLabel}>{labels[3]}</Text>
                <Text style={styles.financialValue}>
                  {financialData[labels[3]]}
                </Text>
              </View>
            </>
          ) : (
            <View style={styles.financialItemVAT}>
              <Text style={styles.financialLabel}>{labels[2]}</Text>
              <Text style={styles.financialValue}>
                {financialData[labels[2]]}
              </Text>
            </View>
          )}
        </View>
      </View>
    );
  };

  const renderLateChallans = () => (
    <View style={styles.sectionContainer}>
      <View style={styles.cardHeader}>
        <TextSemibold style={styles.cardTitle}>
          Top 5 Late Challans
        </TextSemibold>
      </View>
      {lateChallans.map((challan, index) => (
        <View key={challan.id} style={styles.challanItem}>
          <Text style={styles.challanNumber}>{index + 1}.</Text>
          <Text style={styles.challanInvoice}>{challan.invoice}</Text>
          <Text style={styles.challanAmount}>{challan.amount}</Text>
          <Text style={styles.challanDueDate}>Due {challan.dueDate}</Text>
        </View>
      ))}
    </View>
  );

  const renderRecentActivity = () => (
    <View style={styles.sectionContainer}>
      <View style={styles.cardHeader}>
        <TextSemibold style={styles.cardTitle}>Recent Activity</TextSemibold>
      </View>
      {recentActivity.map((activity, index) => (
        <View key={index} style={styles.activityItem}>
          <Text style={styles.activityText}>{activity.action}</Text>
          <Text style={styles.activityTimestamp}>{activity.timestamp}</Text>
        </View>
      ))}
    </View>
  );

  return (
    <>
      <Header
        title={'Other Taxes'}
        leftIcon={'chevron-left'}
        onLeftPress={() => navigation.goBack()}
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
                <Feather name="calendar" size={16} color="#9CA3AF" style={{ marginRight: 1 }} />
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

          {/* Content Cards */}
          <View style={styles.card}>
            {renderFinancialSummary()}
            {renderLateChallans()}
            {renderRecentActivity()}
          </View>
        </ScrollView>
      </View>
      <CustomBottomButton buttonText="Open Register"
       onPress={() => navigation.navigate('openRegister')}
        secondButtonText='Export as PDF'
        showSecondButton
        secondButtonColor='#F7F9FC'
      />
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 24,
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
      shadowOffset: { width: 0, height: 2 },
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
  tabsContainer: {
    marginBottom: 10,
  },
  tab: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 4,
    borderRadius: 20,
    backgroundColor: '#F6F8FA',
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
  card: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 12,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cardHeader: {
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 16,
    color: '#111827',
    fontWeight: '600',
  },
  financialGrid: {
    // Removed flexDirection: 'row' and flexWrap: 'wrap'
    // Removed gap: 12
  },
  financialRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  financialItem: {
    width: (width - 50) / 2 - 6, // This width calculation is now relative to the row
    backgroundColor: '#F6F8FA',
    padding: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  financialLabel: {
    fontSize: 12,
    color: '#8F939E',
    fontWeight: '400',
  },
  financialValue: {
    fontSize: 12,
    color: '#111827',
    fontWeight: '600',
  },
  financialItemVAT: {
    width: '100%',
    backgroundColor: '#F6F8FA',
    padding: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  challanItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    marginBottom: 8,
  },
  challanNumber: {
    fontSize: 14,
    color: '#6B7280',
    marginRight: 12,
    fontWeight: '500',
    width: 20,
  },
  challanInvoice: {
    fontSize: 12,
    color: '#494D58',
    fontWeight: '400',
    marginRight: 8,
  },
  challanAmount: {
    fontSize: 12,
    color: '#494D58',
    fontWeight: '400',
  },
  challanDueDate: {
    fontSize: 12,
    color: '#111111',
    fontWeight: '500',
    marginLeft: 'auto',
  },
  activityItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    marginBottom: 8,
  },
  activityText: {
    fontSize: 12,
    color: '#494D58',
    fontWeight: '400',
    flex: 1,
  },
  activityTimestamp: {
    fontSize: 10,
    color: '#6B7280',
    fontWeight: '500',
  },
  sectionContainer: {
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 12,
    borderRadius: 16,
  },
});

export default OtherTaxes;
