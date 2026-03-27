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

const Payments = () => {
  const [selectedTimeFilter, setSelectedTimeFilter] = useState('7D');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('All');
  const scrollViewRef = useRef(null);
  const recentPaymentSectionRef = useRef(null);

  // Mock data for recent payments
  const receivablesCards = [
    {
      id: 1,
      title: 'Today',
      value: '₹75,000',
      icon: Icons.Calender,
      label: 'Receivables',
      amount: '₹75,000',
      change: '+12%',
    },
    {
      id: 2,
      title: 'MTD',
      value: '₹25,000',
      icon: Icons.Calender,
      label: 'Receivables',
      amount: '₹25,000',
      change: '+8%',
    },
    {
      id: 3,
      title: 'YTD',
      value: '₹35,000',
      icon: Icons.CalenderYear,
      label: 'Receivables',
      amount: '₹35,000',
      change: '+15%',
    },
    {
      id: 4,
      title: 'Cash',
      value: '₹45,000',
      icon: Icons.Calender,
      label: 'Receivables',
      amount: '₹45,000',
      change: '-5%',
    },
    {
      id: 5,
      title: 'Bank',
      value: '₹95,000',
      icon: Icons.Bank,
      label: 'Receivables',
      amount: '₹95,000',
      change: '+22%',
    },
  ];

  // Mock data for recent payments with 2025 dates for filtering
  const allRecentPayments = [
    {
      id: 1,
      transactionId: 'PMT-3010',
      name: 'AGL Traders',
      date: '10 Jul',
      fullDate: '2025-07-10',
      amount: '₹75,000',
      method: 'Cash',
      status: 'completed',
    },
    {
      id: 2,
      transactionId: 'PMT-3011',
      name: 'Global Suppliers',
      date: '1 Sept',
      fullDate: '2025-09-01',
      amount: '₹65,000',
      method: 'Bank',
      status: 'completed',
    },
    {
      id: 3,
      transactionId: 'PMT-3012',
      name: 'Tech Solutions',
      date: '15 Jul',
      fullDate: '2025-07-15',
      amount: '₹95,000',
      method: 'Cash',
      status: 'completed',
    },
    {
      id: 4,
      transactionId: 'PMT-3013',
      name: 'Quality Imports',
      date: '18 Jul',
      fullDate: '2025-07-18',
      amount: '₹55,000',
      method: 'Bank',
      status: 'completed',
    },
    {
      id: 5,
      transactionId: 'PMT-3014',
      name: 'Smart Systems',
      date: '20 Jul',
      fullDate: '2025-07-20',
      amount: '₹45,000',
      method: 'Cash',
      status: 'completed',
    },
    {
      id: 6,
      transactionId: 'PMT-3015',
      name: 'Elite Trading',
      date: '22 Jul',
      fullDate: '2025-07-22',
      amount: '₹35,000',
      method: 'Bank',
      status: 'completed',
    },
    {
      id: 7,
      transactionId: 'PMT-3016',
      name: 'Premium Services',
      date: '25 Jul',
      fullDate: '2025-07-25',
      amount: '₹85,000',
      method: 'Cash',
      status: 'completed',
    },
    {
      id: 8,
      transactionId: 'PMT-3017',
      name: 'Advanced Systems',
      date: '28 Jul',
      fullDate: '2025-07-28',
      amount: '₹65,000',
      method: 'Bank',
      status: 'completed',
    },
    {
      id: 9,
      transactionId: 'PMT-3018',
      name: 'Digital Solutions',
      date: '30 Jul',
      fullDate: '2025-07-30',
      amount: '₹55,000',
      method: 'Cash',
      status: 'completed',
    },
    {
      id: 10,
      transactionId: 'PMT-3019',
      name: 'Innovation Corp',
      date: '2 Aug',
      fullDate: '2025-08-02',
      amount: '₹75,000',
      method: 'Bank',
      status: 'completed',
    },
    {
      id: 11,
      transactionId: 'PMT-3020',
      name: 'Quality Imports',
      date: '5 Aug',
      fullDate: '2025-08-05',
      amount: '₹45,000',
      method: 'Cash',
      status: 'completed',
    },
    {
      id: 12,
      transactionId: 'PMT-3021',
      name: 'Global Suppliers',
      date: '8 Aug',
      fullDate: '2025-08-08',
      amount: '₹65,000',
      method: 'Bank',
      status: 'completed',
    },
  ];

  // Filter payments based on selected time filter
const getFilteredPayments = () => {
  const today = new Date();

  // Step 1: apply time filter
  const timeFiltered = allRecentPayments.filter(payment => {
    const paymentDate = new Date(payment.fullDate);

    switch (selectedTimeFilter) {
      case '7D':
        const sevenDaysAgo = new Date(today);
        sevenDaysAgo.setDate(today.getDate() - 7);
        return paymentDate >= sevenDaysAgo && paymentDate <= today;

      case '1M':
        const oneMonthAgo = new Date(today);
        oneMonthAgo.setMonth(today.getMonth() - 1);
        return paymentDate >= oneMonthAgo && paymentDate <= today;

      case '3M':
        const threeMonthsAgo = new Date(today);
        threeMonthsAgo.setMonth(today.getMonth() - 3);
        return paymentDate >= threeMonthsAgo && paymentDate <= today;

      case '6M':
        const sixMonthsAgo = new Date(today);
        sixMonthsAgo.setMonth(today.getMonth() - 6);
        return paymentDate >= sixMonthsAgo && paymentDate <= today;

      default:
        return true;
    }
  });

  // Step 2: apply category filter
  if (selectedCategoryFilter === 'All') return timeFiltered;
  return timeFiltered.filter(
    payment => payment.method === selectedCategoryFilter,
  );
};

  const filteredPayments = getFilteredPayments();
  const [recentPaymentY, setRecentPaymentY] = useState(0);

  // Auto-scroll to Recent Payment section when filter changes and there's data
  useEffect(() => {
    if (filteredPayments.length > 0 && recentPaymentY > 0 && scrollViewRef.current) {
      // Use setTimeout to ensure the layout is complete before scrolling
      setTimeout(() => {
        scrollViewRef.current?.scrollTo({
          y: recentPaymentY - 20, // Offset by 20px for better visibility
          animated: true,
        });
      }, 200);
    }
  }, [selectedTimeFilter, selectedCategoryFilter, filteredPayments.length, recentPaymentY]);

  const handleCardPress = card => {
    // Handle card press if needed
    console.log('Card pressed:', card.title);
  };

  return (
    <>
      <View style={{backgroundColor: '#fff', paddingTop: 10 , paddingBottom:10}}>
        <FinancialMetricsSection
          cards={receivablesCards}
          onCardPress={handleCardPress}
        />
      </View>

      <ScrollView 
        ref={scrollViewRef}
        style={styles.container} 
        showsVerticalScrollIndicator={false}>
        <View style={{padding: 12}}>
          {/* Daily Outflow Chart */}
          <DailyOutflowChart />

          <View
            style={{
              borderRadius: 20,
              backgroundColor: '#fff',
              overflow: 'hidden',
            }}>
            <CashVsBankRatio
              title="Cash vs Bank ratio"
              cashAmount="₹75,000"
              bankAmount="₹450,000"
              chartAmount="₹75,000"
            />
          </View>

          <View 
            ref={recentPaymentSectionRef}
            style={styles.recentPaymentSection}
            onLayout={(event) => {
              const {y} = event.nativeEvent.layout;
              // Y is relative to parent View, add padding to get absolute position
              setRecentPaymentY(y + 12);
            }}>
            <Text style={styles.recentPaymentTitle}>Recent Payment</Text>

            <TimeFilters
              selectedFilter={selectedTimeFilter}
              setSelectedFilter={setSelectedTimeFilter}
            />
            <CategoryFilters
              selectedFilter={selectedCategoryFilter}
              setSelectedFilter={setSelectedCategoryFilter}
            />
            <TransactionList transactions={filteredPayments} type="payment" />
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
  recentPaymentSection: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 20,
    marginTop: 10,
  },
  recentPaymentTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111',
    marginBottom: 12,
  },
});

export default Payments;
