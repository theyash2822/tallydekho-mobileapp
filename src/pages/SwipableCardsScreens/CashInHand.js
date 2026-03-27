import React, {useState} from 'react';
import {View, ScrollView, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Colors from '../../utils/Colors';
import {FilterBar, FinancialMetricsSection} from '../../components/financial';
import {
  ReceiptsVsPaymentsChart,
  RecentTransactions,
} from '../../components/cash-in-hand';
import DailyOutflowChart from '../../components/payments-receipts/DailyOutflowChart';
import {filterDataByStatusAndPeriod} from '../../components/Helper/DateFilterHelper';
import {Icons} from '../../utils/Icons';

const CashInHand = () => {
  const navigation = useNavigation();
  const [selectedPeriod, setSelectedPeriod] = useState('Period');
  const [selectedFilter, setSelectedFilter] = useState('Period');
  // Financial metrics cards data for Cash in Hand
  const cashInHandCards = [
    {
      id: 1,
      title: 'Cash on Hand',
      value: '₹107,000',
      icon: Icons.CashOnHand,
      change: '+58.5%',
    },
    {
      id: 2,
      title: 'MTD',
      value: '₹100,000',
      icon: Icons.Calender,
      change: '+28.5%',
    },
    {
      id: 3,
      title: 'Inflow Today',
      value: '₹95,000',
      icon: Icons.ArrowDown,
      iconSize: {width: 14, height: 14},
      change: '+5.5%',
    },
    {
      id: 4,
      title: 'Outflow Today',
      value: '₹2.8 M',
      icon: Icons.ArrowUp,
      iconSize: {width: 14, height: 14},
      change: '+12.5%',
    },
    {
      id: 5,
      title: 'Bank',
      value: '+₹12K',
      icon: Icons.Bank,
      change: '+8.5%',
    },
  ];

  // Daily cash balance data - Updated to 7 data points
  const dailyCashData = [
    120000, 115000, 130000, 125000, 118000, 135000, 107000,
  ];
  const dailyCashDates = [
    '1 Aug',
    '2 Aug',
    '3 Aug',
    '4 Aug',
    '5 Aug',
    '6 Aug',
    '7 Aug',
  ];

  // Receipts vs Payments data - Updated to 7 data points
  const receiptsVsPaymentsData = [
    {date: '1 Aug', receipts: 85000, payments: 65000},
    {date: '2 Aug', receipts: 92000, payments: 78000},
    {date: '3 Aug', receipts: 68000, payments: 95000},
    {date: '4 Aug', receipts: 105000, payments: 72000},
    {date: '5 Aug', receipts: 115000, payments: 68000},
    {date: '6 Aug', receipts: 78000, payments: 89000},
    {date: '7 Aug', receipts: 125000, payments: 85000},
  ];

  // Recent transactions data with full date information for filtering
  const allRecentTransactions = [
    {
      id: 1,
      title: 'Cash Sales',
      reference: 'RC-1452',
      date: '10 Jul',
      fullDate: '2025-07-10',
      amount: 8000,
      type: 'receipt',
    },
    {
      id: 2,
      title: 'Taxi Reimburse',
      reference: 'PMT-3491',
      date: '10 Jul',
      fullDate: '2025-07-10',
      amount: 1200,
      type: 'payment',
    },
    {
      id: 3,
      title: 'Cash Sales',
      reference: 'RC-1453',
      date: '9 Jul',
      fullDate: '2025-07-09',
      amount: 12000,
      type: 'receipt',
    },
    {
      id: 4,
      title: 'Office Supplies',
      reference: 'PMT-3492',
      date: '9 Jul',
      fullDate: '2025-07-09',
      amount: 2500,
      type: 'payment',
    },
    {
      id: 5,
      title: 'Cash Sales',
      reference: 'RC-1454',
      date: '8 Jul',
      fullDate: '2025-07-08',
      amount: 6500,
      type: 'receipt',
    },
    {
      id: 6,
      title: 'Petty Cash',
      reference: 'PMT-3493',
      date: '8 Jul',
      fullDate: '2025-07-08',
      amount: 1500,
      type: 'payment',
    },
    {
      id: 7,
      title: 'Cash Sales',
      reference: 'RC-1455',
      date: '7 Jul',
      fullDate: '2025-07-07',
      amount: 9500,
      type: 'receipt',
    },
    {
      id: 8,
      title: 'Transportation',
      reference: 'PMT-3494',
      date: '7 Jul',
      fullDate: '2025-07-07',
      amount: 800,
      type: 'payment',
    },
    {
      id: 9,
      title: 'Cash Sales',
      reference: 'RC-1456',
      date: '6 Jul',
      fullDate: '2025-07-06',
      amount: 11000,
      type: 'receipt',
    },
    {
      id: 10,
      title: 'Office Rent',
      reference: 'PMT-3495',
      date: '6 Jul',
      fullDate: '2025-07-06',
      amount: 5000,
      type: 'payment',
    },
  ];

  // Filter data based on selected period using the helper function
  const filteredRecentTransactions = filterDataByStatusAndPeriod(
    allRecentTransactions,
    'All', // selectedStatus - not used in cash in hand
    selectedPeriod,
    'date', // dateField - use 'date' field which is in "10 Jul" format
    'status', // statusField - not used in cash in hand
    false, // useIsPaid = false
  );

  const handleCardPress = () => {
    // Cards are not clickable - no navigation
  };

  return (
    <>
      {/* Financial Metrics Section */}
      <View style={{backgroundColor: '#fff'}}>
        <FilterBar
          selectedFilter={selectedFilter}
          setSelectedFilter={setSelectedFilter}
          selectedPeriod={selectedPeriod}
          setSelectedPeriod={setSelectedPeriod}
          filters={['Period']}
        />
         <View style={{paddingBottom: 10}}>
        <FinancialMetricsSection
          cards={cashInHandCards}
          onCardPress={handleCardPress}
        />
        </View>
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={{padding: 12}}>
          {/* Daily Cash Balance Chart */}
          <View style={styles.chartContainer}>
            <DailyOutflowChart
              title="Daily Cash Balance"
              data={dailyCashData}
              dates={dailyCashDates}
              lineColor="#10B981"
              pointColor="#10B981"
            />
          </View>

          {/* Receipts vs Payments Chart */}
          <ReceiptsVsPaymentsChart data={receiptsVsPaymentsData} />

          {/* Recent Transactions */}
          <RecentTransactions transactions={filteredRecentTransactions} />
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundColorPrimary,
    marginTop: 10,
  },
  chartContainer: {
    backgroundColor: '#fff',
    borderRadius: 20,
    marginBottom: 12,
    overflow: 'hidden',
  },
});

export default CashInHand;
