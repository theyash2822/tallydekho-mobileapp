import React, {useState, useRef, useEffect} from 'react';
import {View, ScrollView, StyleSheet, Text} from 'react-native';
import Colors from '../../utils/Colors';
import {
  CashVsBankRatio,
  TimeFilters,
  CategoryFilters,
  TransactionList,
  DailyOutflowChart,
} from '../../components/payments-receipts';
import {FinancialMetricsSection} from '../../components/financial';
import {Icons} from '../../utils/Icons';

const Receipts = () => {
  const [selectedTimeFilter, setSelectedTimeFilter] = useState('7D');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('All');
  const scrollViewRef = useRef(null);
  const recentReceiptSectionRef = useRef(null);

  // Receipts-specific cards data - fixed structure to match SwipeableCards expectations
  const receiptsCards = [
    {
      id: 1,
      title: 'Total Receipts',
      value: '₹2,45,000',
      icon: Icons.Payment,
      change: '+12.5%',
    },
    {
      id: 2,
      title: 'Cash Receipts',
      value: '₹1,25,000',
      icon: Icons.Payment,
      change: '+8.3%',
    },
    {
      id: 3,
      title: 'Bank Receipts',
      value: '₹1,20,000',
      icon: Icons.Payment,
      change: '+15.7%',
    },
    {
      id: 4,
      title: 'Pending',
      value: '₹45,000',
      icon: Icons.Payment,
      change: '-5.2%',
    },
    {
      id: 5,
      title: 'Overdue',
      value: '₹12,000',
      icon: Icons.Payment,
      change: '-2.1%',
    },
    {
      id: 6,
      title: 'This Month',
      value: '₹85,000',
      icon: Icons.Payment,
      change: '+18.9%',
    },
    {
      id: 7,
      title: 'Last Month',
      value: '₹1,60,000',
      icon: Icons.Payment,
      change: '+6.4%',
    },
  ];

  // Mock data for recent receipts with 2025 dates for filtering
  const allRecentReceipts = [
    {
      id: 1,
      transactionId: 'RCT-001',
      name: 'ABC Company Ltd',
      date: '10 Jul',
      fullDate: '2025-07-10',
      amount: '₹25,000',
      method: 'Cash',
      status: 'completed',
    },
    {
      id: 2,
      transactionId: 'RCT-002',
      name: 'XYZ Corporation',
      date: '12 Jul',
      fullDate: '2025-07-12',
      amount: '₹18,500',
      method: 'Bank',
      status: 'completed',
    },
    {
      id: 3,
      transactionId: 'RCT-003',
      name: 'DEF Industries',
      date: '15 Jul',
      fullDate: '2025-07-15',
      amount: '₹32,000',
      method: 'Cash',
      status: 'completed',
    },
    {
      id: 4,
      transactionId: 'RCT-004',
      name: 'GHI Solutions',
      date: '18 Jul',
      fullDate: '2025-07-18',
      amount: '₹15,750',
      method: 'Bank',
      status: 'completed',
    },
    {
      id: 5,
      transactionId: 'RCT-005',
      name: 'JKL Enterprises',
      date: '20 Jul',
      fullDate: '2025-07-20',
      amount: '₹28,900',
      method: 'Cash',
      status: 'completed',
    },
    {
      id: 6,
      transactionId: 'RCT-006',
      name: 'MNO Corp',
      date: '22 Jul',
      fullDate: '2025-07-22',
      amount: '₹35,000',
      method: 'Bank',
      status: 'completed',
    },
    {
      id: 7,
      transactionId: 'RCT-007',
      name: 'PQR Ltd',
      date: '25 Jul',
      fullDate: '2025-07-25',
      amount: '₹42,500',
      method: 'Cash',
      status: 'completed',
    },
    {
      id: 8,
      transactionId: 'RCT-008',
      name: 'STU Inc',
      date: '28 Jul',
      fullDate: '2025-07-28',
      amount: '₹38,200',
      method: 'Bank',
      status: 'completed',
    },
    {
      id: 9,
      transactionId: 'RCT-009',
      name: 'VWX Group',
      date: '30 Jul',
      fullDate: '2025-07-30',
      amount: '₹55,800',
      method: 'Cash',
      status: 'completed',
    },
    {
      id: 10,
      transactionId: 'RCT-010',
      name: 'YZA Corp',
      date: '2 Aug',
      fullDate: '2025-08-02',
      amount: '₹28,900',
      method: 'Bank',
      status: 'completed',
    },
    {
      id: 11,
      transactionId: 'RCT-011',
      name: 'BCD Ltd',
      date: '5 Aug',
      fullDate: '2025-08-05',
      amount: '₹67,300',
      method: 'Cash',
      status: 'completed',
    },
    {
      id: 12,
      transactionId: 'RCT-012',
      name: 'EFG Inc',
      date: '8 Aug',
      fullDate: '2025-08-08',
      amount: '₹23,400',
      method: 'Bank',
      status: 'completed',
    },
  ];

  // Filter receipts based on selected time filter
  const getFilteredReceipts = () => {
    const today = new Date();

    // Step 1: filter by time
    const timeFiltered = allRecentReceipts.filter(receipt => {
      const receiptDate = new Date(receipt.fullDate);

      switch (selectedTimeFilter) {
        case '7D':
          const sevenDaysAgo = new Date(today);
          sevenDaysAgo.setDate(today.getDate() - 7);
          return receiptDate >= sevenDaysAgo && receiptDate <= today;

        case '1M':
          const oneMonthAgo = new Date(today);
          oneMonthAgo.setMonth(today.getMonth() - 1);
          return receiptDate >= oneMonthAgo && receiptDate <= today;

        case '3M':
          const threeMonthsAgo = new Date(today);
          threeMonthsAgo.setMonth(today.getMonth() - 3);
          return receiptDate >= threeMonthsAgo && receiptDate <= today;

        case '6M':
          const sixMonthsAgo = new Date(today);
          sixMonthsAgo.setMonth(today.getMonth() - 6);
          return receiptDate >= sixMonthsAgo && receiptDate <= today;

        default:
          return true;
      }
    });

    // Step 2: filter by category (Cash, Bank, All)
    if (selectedCategoryFilter === 'All') return timeFiltered;
    return timeFiltered.filter(
      receipt => receipt.method === selectedCategoryFilter,
    );
  };

  const filteredReceipts = getFilteredReceipts();
  const [recentReceiptY, setRecentReceiptY] = useState(0);

  // Auto-scroll to Recent Receipts section when filter changes and there's data
  useEffect(() => {
    if (filteredReceipts.length > 0 && recentReceiptY > 0 && scrollViewRef.current) {
      // Use setTimeout to ensure the layout is complete before scrolling
      setTimeout(() => {
        scrollViewRef.current?.scrollTo({
          y: recentReceiptY - 20, // Offset by 20px for better visibility
          animated: true,
        });
      }, 200);
    }
  }, [selectedTimeFilter, selectedCategoryFilter, filteredReceipts.length, recentReceiptY]);

  // Daily inflow data for receipts (different from payments)
  const dailyInflowData = [18500, 22400, 18900, 35200, 45600, 28900, 32500];
  const dailyInflowDates = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const handleCardPress = card => {
    // Handle card press if needed
    console.log('Card pressed:', card.title);
  };

  return (
    <>
      <View
        style={{backgroundColor: '#fff', paddingTop: 10, paddingBottom: 10}}>
        <FinancialMetricsSection
          cards={receiptsCards}
          onCardPress={handleCardPress}
        />
      </View>

      <ScrollView 
        ref={scrollViewRef}
        style={styles.container} 
        showsVerticalScrollIndicator={false}>
        <View style={{padding: 12}}>
          {/* Daily Inflow Chart */}
          <DailyOutflowChart
            title="Daily Inflow"
            data={dailyInflowData}
            dates={dailyInflowDates}
          />
          <View
            style={{
              borderRadius: 20,
              backgroundColor: '#fff',
              overflow: 'hidden',
            }}>
            <CashVsBankRatio
              title="Cash vs Bank ratio"
              cashAmount="₹1,25,000"
              bankAmount="₹2,50,000"
              chartAmount="₹1,25,000"
            />
          </View>

          <View 
            ref={recentReceiptSectionRef}
            style={styles.recentReceiptSection}
            onLayout={(event) => {
              const {y} = event.nativeEvent.layout;
              // Y is relative to parent View, add padding to get absolute position
              setRecentReceiptY(y + 12);
            }}>
            <Text style={styles.recentReceiptTitle}>Recent Receipts</Text>
            <TimeFilters
              selectedFilter={selectedTimeFilter}
              setSelectedFilter={setSelectedTimeFilter}
            />
            <CategoryFilters
              selectedFilter={selectedCategoryFilter}
              setSelectedFilter={setSelectedCategoryFilter}
            />
            <TransactionList transactions={filteredReceipts} type="receipt" />
          </View>
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundColorPrimary,
  },
  recentReceiptSection: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 20,
    marginTop: 10,
  },
  recentReceiptTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111',
    marginBottom: 12,
  },
});

export default Receipts;
