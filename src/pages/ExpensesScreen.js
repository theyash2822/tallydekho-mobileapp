import React, {useState, useCallback, useEffect} from 'react';
import {
  View,
  StyleSheet,
  BackHandler,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Header from '../components/common/Header';
import {
  useNavigation,
  useRoute,
  useFocusEffect,
} from '@react-navigation/native';
import Colors from '../utils/Colors';
import Feather from 'react-native-vector-icons/Feather';
import ErrorBoundary from '../components/common/ErrorBoundary';
import TopSection from '../components/dashboard/common/TopSection';
import MainContent from '../components/dashboard/common/MainContent';
import {filterDataByStatusAndPeriod} from '../components/Helper/DateFilterHelper';
import {Icons} from '../utils/Icons';
import ScreenStyles from '../components/dashboard/css/ScreenStyles';
import {FinancialMetricsSection} from '../components/financial';
// import ErrorBoundary from '../common/ErrorBoundary';

const ExpensesScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const data = route.params?.data ? [route.params.data] : [];
  const [selectedPeriod, setSelectedPeriod] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [activeTab, setActiveTab] = useState('recent');

  // Handle back button press safely
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        if (navigation.canGoBack()) {
          navigation.goBack();
        } else {
          navigation.navigate('MainTabs', {screen: 'dashboard'});
        }
        return true; // Prevent default behavior
      };

      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        onBackPress,
      );

      return () => backHandler.remove();
    }, [navigation]),
  );

  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Cleanup any subscriptions or timers here if needed
    };
  }, []);

  // Expenses-specific data for swipable cards
  const expensesCards = [
    {
      id: 'expense-today',
      title: 'Today',
      value: '₹85.000',
      change: '+15%',
      changeType: 'negative',
      icon: Icons.Calender,
    },
    {
      id: 'expense-week',
      title: 'MTD',
      value: '₹245.500',
      change: '+8%',
      changeType: 'negative',
      icon: Icons.CalenderDate,
    },
    {
      id: 'expense-month',
      title: 'YTD',
      value: '₹892.750',
      change: '+12%',
      changeType: 'negative',
      icon: Icons.CalenderYear,
    },
    {
      id: 'expense-pending',
      title: 'Cash Expenses',
      value: '₹45.200',
      change: '+3%',
      changeType: 'negative',
      icon: Icons.Bill,
    },
  ];

  // Mock transaction data for recent expenses (includes dates from Nov 2025 to Jan 2026)
  const recentExpenses = [
    {
      id: 1,
      status: 'Paid',
      reference: 'EXP-001',
      vendor: 'Office Supplies Co.',
      date: '1 Jan',
      fullDate: '01/01/2026',
      time: '09:00 AM',
      amount: '₹2,500',
      isPaid: true,
    },
    {
      id: 2,
      status: 'Unpaid',
      reference: 'EXP-002',
      vendor: 'Internet Provider',
      date: '31 Dec',
      fullDate: '31/12/2025',
      time: '08:30 AM',
      amount: '₹1,200',
      isPaid: false,
    },
    {
      id: 3,
      status: 'Paid',
      reference: 'EXP-003',
      vendor: 'Cleaning Services',
      date: '30 Dec',
      fullDate: '30/12/2025',
      time: '08:00 AM',
      amount: '₹3,800',
      isPaid: true,
    },
    {
      id: 4,
      status: 'Unpaid',
      reference: 'EXP-004',
      vendor: 'Marketing Agency',
      date: '15 Dec',
      fullDate: '15/12/2025',
      time: '07:30 PM',
      amount: '₹5,600',
      isPaid: false,
    },
    {
      id: 5,
      status: 'Paid',
      reference: 'EXP-005',
      vendor: 'Electricity Board',
      date: '10 Dec',
      fullDate: '10/12/2025',
      time: '06:45 PM',
      amount: '₹4,200',
      isPaid: true,
    },
    {
      id: 6,
      status: 'Unpaid',
      reference: 'EXP-006',
      vendor: 'Legal Services',
      date: '5 Dec',
      fullDate: '05/12/2025',
      time: '05:15 PM',
      amount: '₹8,900',
      isPaid: false,
    },
    {
      id: 7,
      status: 'Paid',
      reference: 'EXP-007',
      vendor: 'Transport Services',
      date: '25 Nov',
      fullDate: '25/11/2025',
      time: '04:30 PM',
      amount: '₹3,400',
      isPaid: true,
    },
    {
      id: 8,
      status: 'Unpaid',
      reference: 'EXP-008',
      vendor: 'Security Services',
      date: '20 Nov',
      fullDate: '20/11/2025',
      time: '03:45 PM',
      amount: '₹6,800',
      isPaid: false,
    },
    {
      id: 9,
      status: 'Paid',
      reference: 'EXP-009',
      vendor: 'IT Services',
      date: '15 Nov',
      fullDate: '15/11/2025',
      time: '02:20 PM',
      amount: '₹7,500',
      isPaid: true,
    },
    {
      id: 10,
      status: 'Unpaid',
      reference: 'EXP-010',
      vendor: 'Maintenance Services',
      date: '10 Nov',
      fullDate: '10/11/2025',
      time: '01:15 PM',
      amount: '₹2,100',
      isPaid: false,
    },
  ];

  const topCategories = [
    {
      id: 1,
      category: 'Rent',
      totalAmount: '₹9,00,000.00',
      icon: 'home',
      color: '#3B82F6',
    },
    {
      id: 2,
      category: 'Salaries',
      totalAmount: '₹7,60,000.00',
      icon: 'users',
      color: '#10B981',
    },
    {
      id: 3,
      category: 'Utilities',
      totalAmount: '₹2,45,000.00',
      icon: 'zap',
      color: '#F59E0B',
    },
    {
      id: 4,
      category: 'Salaries',
      totalAmount: '₹7,60,000.00',
      icon: 'users',
      color: '#10B981',
    },
    {
      id: 5,
      category: 'Utilities',
      totalAmount: '₹2,45,000.00',
      icon: 'zap',
      color: '#F59E0B',
    },
  ];

  // Filter recent expenses based on selected status and period
  const filteredRecentExpenses = filterDataByStatusAndPeriod(
    recentExpenses,
    selectedStatus,
    selectedPeriod,
    'date',
    'status',
    false, // useIsPaid = false for ExpensesScreen
  );

  const handleCardPress = card => {
    // Handle card press if needed
  };

  const renderTransactionItem = item => (
    <View style={ScreenStyles.transactionCard}>
      <View style={ScreenStyles.transactionContent}>
        <View style={ScreenStyles.transactionLeft}>
          <View style={ScreenStyles.transactionIcon}>
            <Feather name="arrow-down-left" size={16} color="#10B981" />
          </View>
          <View style={ScreenStyles.transactionInfo}>
            <View style={ScreenStyles.transactionRow}>
              <Text style={ScreenStyles.transactionName}>{item.vendor}</Text>
              <View style={ScreenStyles.dotSeparator} />
              <Text style={ScreenStyles.referenceText}>{item.reference}</Text>
            </View>
            <Text style={ScreenStyles.transactionDate}>
              {item.fullDate} | {item.time}
            </Text>
          </View>
        </View>
        <View style={ScreenStyles.transactionRight}>
          <Text style={ScreenStyles.transactionAmount}>{item.amount}</Text>
        </View>
      </View>
    </View>
  );

  const renderCategoryItem = item => (
    <View style={ScreenStyles.categoryCard}>
      <View style={ScreenStyles.categoryLeft}>
        <View
          style={[ScreenStyles.categoryIcon, {backgroundColor: item.color}]}>
          <Feather name={item.icon} size={20} color="#fff" />
        </View>
        <View style={ScreenStyles.categoryInfo}>
          <Text style={ScreenStyles.categoryName}>{item.category}</Text>
        </View>
      </View>
      <Text style={ScreenStyles.categoryAmount}>{item.totalAmount}</Text>
    </View>
  );

  return (
    <View style={ScreenStyles.container}>
      <ErrorBoundary>
        <Header
          title="Expense"
          leftIcon="chevron-left"
          rightIconType="Ionicons"
          onLeftPress={() => {
            if (navigation.canGoBack()) {
              navigation.goBack();
            } else {
              navigation.navigate('MainTabs', {screen: 'dashboard'});
            }
          }}
        />

        {/* Top white section with filters and metrics */}
        <View style={{zIndex: 1000}}>
          <TopSection
            selectedPeriod={selectedPeriod}
            setSelectedPeriod={setSelectedPeriod}
            selectedStatus={selectedStatus}
            setSelectedStatus={setSelectedStatus}
          />
        </View>
        <FinancialMetricsSection
          cards={expensesCards}
          onCardPress={handleCardPress}
        />

        {/* Main content section with white background */}
        <ScrollView
          style={ScreenStyles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={ScreenStyles.scrollContent}>
          <MainContent
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            recentData={filteredRecentExpenses}
            topData={topCategories}
            renderTransactionItem={renderTransactionItem}
            renderTopItem={renderCategoryItem}
            tab1Name="Recent Expenses"
            tab2Name="Top Categories"
            tab2Value="categories"
            minHeight="96%"
            onViewAllRecent={() => navigation.navigate('expenseRegister')}
            onViewAllTop={() =>
              navigation.navigate('MainTabs', {screen: 'ledger'})
            }
          />
        </ScrollView>
      </ErrorBoundary>
    </View>
  );
};

const styles = StyleSheet.create({
  // All styles moved to ScreenStyles.js
});

export default ExpensesScreen;
