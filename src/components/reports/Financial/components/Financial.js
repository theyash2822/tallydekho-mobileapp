import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import {TextSemibold} from '../../../../utils/CustomText';
import Colors from '../../../../utils/Colors';
import Header from '../../../common/Header';

const Financial = () => {
  const navigation = useNavigation();
  const [expandedSections, setExpandedSections] = useState({
    profitLoss: true,
    balanceSheet: true,
    trialBalance: true,
  });

  const [selectedTab, setSelectedTab] = useState('Liability');

  const toggleSection = section => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // Style combinations for cleaner code
  const getLiabilityHeaderStyle = column => [
    styles.tableHeaderText,
    styles.liabilitiesTableCell,
    styles[column],
  ];

  const getLiabilityCellStyle = column => [
    styles.tableCell,
    styles.liabilitiesTableCell,
    styles[column],
  ];

  const getAssetsCellStyle = () => [styles.tableCell, styles.assetsTableCell];

  const getAssetsHeaderStyle = () => [
    styles.tableHeaderText,
    styles.assetsTableCell,
  ];

  const profitLossData = [
    {
      left: {label: 'Opening Stock', value: '₹150,000'},
      right: {label: 'Closing Stock', value: '₹740,000'},
    },
    {
      left: {label: 'Purchase', value: '₹150,000'},
      right: {label: 'Sales', value: '₹740,000'},
    },
    {
      left: {label: 'Direct Expense', value: '₹150,000'},
      right: {label: 'Indirect Expense', value: '₹740,000'},
    },
    {
      left: {label: 'Indirect Income', value: '₹150,000'},
      right: {label: 'Direct Income', value: '₹740,000'},
    },
    {
      left: {label: 'Gross Profit', value: '₹150,000'},
      right: {label: 'Gross Loss', value: '₹740,000'},
    },
    {
      left: {label: 'Net Profit', value: '₹150,000'},
      right: {label: 'Net Loss', value: '₹740,000'},
    },
  ];

  const renderProfitLossSection = () => (
    <View style={styles.section}>
      <TouchableOpacity
        style={styles.sectionHeader}
        onPress={() => toggleSection('profitLoss')}>
        <TextSemibold style={styles.sectionTitle}>Profit & Loss</TextSemibold>
        <Ionicons
          name={expandedSections.profitLoss ? 'chevron-up' : 'chevron-down'}
          size={20}
          color="#6B7280"
        />
      </TouchableOpacity>

      {expandedSections.profitLoss && (
        <View style={styles.gridContainer}>
          {profitLossData.map((item, index) => (
            <View style={styles.combinedGridItem} key={index}>
              <View style={styles.combinedItemRow}>
                {/* Left Column */}
                <View style={styles.combinedItemColumn}>
                  <Text style={styles.gridLabel}>{item.left.label}</Text>
                  <Text style={styles.gridValue}>{item.left.value}</Text>
                </View>

                <View style={styles.verticalSeparator} />

                {/* Right Column */}
                <View style={styles.combinedItemColumn}>
                  <Text style={styles.gridLabel}>{item.right.label}</Text>
                  <Text style={styles.gridValue}>{item.right.value}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      )}
    </View>
  );

  const renderBalanceSheetSection = () => {
    const liabilities = [
      {name: 'Capital Account', opening: '₹500,000', current: '₹520,000'},
      {name: 'Current Liability', opening: '₹120,000', current: '₹100,000'},
      {name: 'Loan Liabilities', opening: '₹300,000', current: '₹280,000'},
      {name: 'Miscellaneous', opening: '₹25,000', current: '₹30,000'},
      {name: 'Profit & Loss', opening: '₹0', current: '₹40,000'},
      {
        name: 'Total Liabilities',
        opening: '',
        current: '₹970,000',
        isTotal: true,
      },
    ];

    const assets = [
      {name: 'Fixed Asset', amount: '₹600,000'},
      {name: 'Current Assets', amount: '₹250,000'},
      {name: 'Investments', amount: '₹50,000'},
      {name: 'Difference in Opening Balance', amount: '₹70,000'},
      {name: 'Total Assets', amount: '₹970,000', isTotal: true},
    ];

    return (
      <View style={styles.section}>
        <TouchableOpacity
          style={styles.sectionHeader}
          onPress={() => toggleSection('balanceSheet')}>
          <TextSemibold style={styles.sectionTitle}>Balance Sheet</TextSemibold>
          <Ionicons
            name={expandedSections.balanceSheet ? 'chevron-up' : 'chevron-down'}
            size={20}
            color="#6B7280"
          />
        </TouchableOpacity>

        {expandedSections.balanceSheet && (
          <View>
            {/* Tabs */}
            <View style={styles.tabsContainer}>
              <TouchableOpacity
                style={[
                  styles.tab,
                  selectedTab === 'Liability' && styles.selectedTab,
                ]}
                onPress={() => setSelectedTab('Liability')}>
                <Text
                  style={[
                    styles.tabText,
                    selectedTab === 'Liability' && styles.selectedTabText,
                  ]}>
                  Liability
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.tab,
                  selectedTab === 'Assets' && styles.selectedTab,
                ]}
                onPress={() => setSelectedTab('Assets')}>
                <Text
                  style={[
                    styles.tabText,
                    selectedTab === 'Assets' && styles.selectedTabText,
                  ]}>
                  Assets
                </Text>
              </TouchableOpacity>
            </View>

            {/* Liability Table */}
            {selectedTab === 'Liability' && (
              <View style={styles.tableContainer}>
                <View style={styles.tableHeader}>
                  <Text style={getLiabilityHeaderStyle('liabilityColumn')}>
                    Liability
                  </Text>
                  <Text style={getLiabilityHeaderStyle('openingBalanceColumn')}>
                    Opening Balance
                  </Text>
                  <Text style={getLiabilityHeaderStyle('currentPeriodColumn')}>
                    Current Period
                  </Text>
                </View>

                {liabilities.map((item, index) => (
                  <View
                    key={index}
                    style={[
                      styles.tableRow,
                      index === liabilities.length - 1 && {
                        borderBottomWidth: 0,
                      },
                      item.isTotal && {backgroundColor: '#EFF2F4'}, // ✅ inline bg color for Total
                    ]}>
                    <Text style={getLiabilityCellStyle('liabilityColumn')}>
                      {item.name}
                    </Text>
                    <Text style={getLiabilityCellStyle('openingBalanceColumn')}>
                      {item.opening}
                    </Text>
                    <Text
                      style={[
                        getLiabilityCellStyle('currentPeriodColumn'),
                        item.isTotal && styles.totalCell,
                      ]}>
                      {item.current}
                    </Text>
                  </View>
                ))}
              </View>
            )}

            {/* Assets Table */}
            {selectedTab === 'Assets' && (
              <View style={styles.tableContainer}>
                <View style={[styles.tableHeader, styles.assetsTableHeader]}>
                  <Text style={getAssetsHeaderStyle()}>Asset</Text>
                  <Text style={getAssetsHeaderStyle()}>Amount (INR)</Text>
                </View>

                {assets.map((item, index) => (
                  <View
                    key={index}
                    style={[
                      styles.tableRow,
                      styles.assetsTableRow,
                      index === assets.length - 1 && {borderBottomWidth: 0},
                      item.isTotal && {backgroundColor: '#EFF2F4'}, // ✅ inline bg color for Total
                    ]}>
                    <Text style={getAssetsCellStyle()}>{item.name}</Text>
                    <Text
                      style={[
                        getAssetsCellStyle(),
                        item.isTotal && styles.totalCell,
                      ]}>
                      {item.amount}
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        )}
      </View>
    );
  };

  const trialBalanceData = [
    {
      left: {label: 'Current Assets', value: '₹250,000'},
      right: {label: 'Miscellaneous Expenses', value: '₹15,000'},
    },
    {
      left: {label: 'Sales Account', value: '₹480,000'},
      right: {label: 'Purchase Accounts', value: '₹320,000'},
    },
  ];

  const renderTrialBalanceSection = () => (
    <View style={styles.section}>
      <TouchableOpacity
        style={styles.sectionHeader}
        onPress={() => toggleSection('trialBalance')}>
        <TextSemibold style={styles.sectionTitle}>Trial Balance</TextSemibold>
        <Ionicons
          name={expandedSections.trialBalance ? 'chevron-up' : 'chevron-down'}
          size={20}
          color="#6B7280"
        />
      </TouchableOpacity>

      {expandedSections.trialBalance && (
        <View style={styles.gridContainer}>
          {trialBalanceData.map((item, index) => (
            <View style={styles.combinedGridItem} key={index}>
              <View style={styles.combinedItemRow}>
                {/* Left Column */}
                <View style={styles.combinedItemColumn}>
                  <Text style={styles.gridLabel}>{item.left.label}</Text>
                  <Text style={styles.gridValue}>{item.left.value}</Text>
                </View>

                <View style={styles.verticalSeparator} />

                {/* Right Column */}
                <View style={styles.combinedItemColumn}>
                  <Text style={styles.gridLabel}>{item.right.label}</Text>
                  <Text style={styles.gridValue}>{item.right.value}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      )}
    </View>
  );

  return (
    <>
      <Header
        title={'Financial'}
        leftIcon={'chevron-left'}
        onLeftPress={() => navigation.goBack()}
      />
      <View style={styles.container}>
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}>
          {/* Financial Overview */}
          <View style={styles.contentCard}>{renderProfitLossSection()}</View>
          <View style={[styles.contentCard, {marginTop: 10}]}>
            {renderBalanceSheetSection()}
          </View>

          <View style={[styles.contentCard, {marginTop: 10}]}>
            {renderTrialBalanceSection()}
          </View>
        </ScrollView>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundColorPrimary,
  },
  scrollView: {
    flex: 1,
    padding: 12,
    paddingBottom: 40,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  contentCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingVertical: 14,
  },
  section: {
    marginBottom: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    color: '#111827',
    fontWeight: '600',
  },
  gridContainer: {
    gap: 12,
    marginTop: 12,
  },
  gridLabel: {
    fontSize: 12,
    color: '#8F939E',
    fontWeight: '400',
    marginBottom: 4,
  },
  gridValue: {
    fontSize: 16,
    color: '#494d58',
    fontWeight: '500',
  },
  tabsContainer: {
    flexDirection: 'row',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 10,
    backgroundColor: '#F3F4F6',
    padding: 4,
    marginTop: 12,
  },
  tab: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: 'transparent',
    alignItems: 'center',
  },
  selectedTab: {
    backgroundColor: Colors.white,
  },
  tabText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  selectedTabText: {
    color: '#111827',
  },
  tableContainer: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    overflow: 'hidden',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#F9FAFB',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    justifyContent: 'space-around',
  },
  tableHeaderText: {
    flex: 1,
    fontSize: 12,
    color: '#667085',
    fontWeight: '400',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    justifyContent: 'space-around',
  },
  tableCell: {
    flex: 1,
    fontSize: 12,
    color: '#667085',
    fontWeight: '400',
  },
  totalCell: {
    fontWeight: '700',
    color: '#111',
  },
  combinedGridItem: {
    backgroundColor: Colors.white,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  combinedItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  combinedItemColumn: {
    flex: 1,
    alignItems: 'center',
  },
  verticalSeparator: {
    width: 1,
    height: '100%',
    backgroundColor: Colors.border,
  },
  assetsTableHeader: {
    justifyContent: 'space-between',
  },
  assetsTableRow: {
    justifyContent: 'space-between',
  },
  assetsTableCell: {
    flex: 0,
  },
  liabilitiesTableCell: {
    flex: 0,
  },
  liabilityColumn: {
    flex: 1, // Takes more space for longer text
  },
  openingBalanceColumn: {
    flex: 1, // Takes less space
  },
  currentPeriodColumn: {
    flex: 0, // Takes less space
  },  
});

export default Financial;
