import React, {useState, useCallback} from 'react';
import {
  View,
  StyleSheet,
  BackHandler,
  Text,
  TouchableOpacity,
} from 'react-native';
import Header from '../../components/common/Header';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import Feather from 'react-native-vector-icons/Feather';
import ErrorBoundary from '../../components/common/ErrorBoundary';
import RegisterStyles from './css/RegisterStyles';
import RegisterComponent, {
  CommonCardRenderer,
  StatusRow,
  IconContainer,
} from './common/RegisterComponent';

const ExpenseRegister = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedExpenses, setSelectedExpenses] = useState([]);

  // Mock data for expenses with full date information (includes dates from Nov 2025 to Jan 2026)
  const expenses = [
    {
      id: 1,
      status: 'Paid',
      type: 'Direct',
      reference: 'EXP-001',
      vendor: 'Office Supplies Co.',
      date: '1 Jan',
      fullDate: '01/01/2026', // DD/MM/YYYY format for display
      time: '09:00 AM',
      amount: '₹2,500',
      isPaid: true,
      category: 'Office Supplies',
    },
    {
      id: 2,
      status: 'Unpaid',
      type: 'Direct',
      reference: 'EXP-002',
      vendor: 'Internet Provider',
      date: '31 Dec',
      fullDate: '31/12/2025',
      time: '08:30 AM',
      amount: '₹1,200',
      isPaid: false,
      category: 'Utilities',
    },
    {
      id: 3,
      status: 'Paid',
      type: 'Indirect',
      reference: 'EXP-003',
      vendor: 'Cleaning Services',
      date: '30 Dec',
      fullDate: '30/12/2025',
      time: '08:00 AM',
      amount: '₹3,800',
      isPaid: true,
      category: 'Services',
    },
    {
      id: 4,
      status: 'Unpaid',
      type: 'Indirect',
      reference: 'EXP-004',
      vendor: 'Marketing Agency',
      date: '15 Dec',
      fullDate: '15/12/2025',
      time: '07:30 PM',
      amount: '₹5,600',
      isPaid: false,
      category: 'Marketing',
    },
    {
      id: 5,
      status: 'Paid',
      type: 'Direct',
      reference: 'EXP-005',
      vendor: 'Electricity Board',
      date: '10 Dec',
      fullDate: '10/12/2025',
      time: '06:45 PM',
      amount: '₹4,200',
      isPaid: true,
      category: 'Utilities',
    },
    {
      id: 6,
      status: 'Unpaid',
      type: 'Indirect',
      reference: 'EXP-006',
      vendor: 'Legal Services',
      date: '25 Nov',
      fullDate: '25/11/2025',
      time: '05:15 PM',
      amount: '₹8,900',
      isPaid: false,
      category: 'Legal',
    },
  ];

  // Handle back button press safely
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        if (navigation.canGoBack()) {
          navigation.goBack();
        } else {
          navigation.navigate('MainTabs', {screen: 'dashboard'});
        }
        return true;
      };

      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        onBackPress,
      );

      return () => backHandler.remove();
    }, [navigation]),
  );

  // Handle expense selection
  const toggleExpenseSelection = expenseId => {
    setSelectedExpenses(prev => {
      if (prev.includes(expenseId)) {
        return prev.filter(id => id !== expenseId);
      } else {
        return [...prev, expenseId];
      }
    });
  };

  // Handle long press selection
  const handleLongPress = expenseId => {
    if (!selectedExpenses.includes(expenseId)) {
      toggleExpenseSelection(expenseId);
    }
  };

  // Handle tap selection
  const handleTap = expenseId => {
    if (selectedExpenses.length > 0) {
      // If in selection mode, toggle selection
      toggleExpenseSelection(expenseId);
    }
  };

  // Share selected expenses
  const shareSelectedExpenses = () => {
    console.log('Sharing expenses:', selectedExpenses);
    // Implement share functionality here
  };

  // Configuration objects
  const statusConfig = {
    getColor: status => (status === 'Paid' ? '#10B981' : '#EF4444'),
  };

  const iconConfig = {
    backgroundColor: '#F0F2F9',
  };

  // Render expense card
  const renderExpenseCard = expense => {
    const isSelected = selectedExpenses.includes(expense.id);

    return (
      <CommonCardRenderer
        key={expense.id}
        item={expense}
        isSelected={isSelected}
        onPress={handleTap}
        onLongPress={handleLongPress}
        statusConfig={statusConfig}
        iconConfig={iconConfig}>
        <View style={RegisterStyles.content}>
          {/* Top row: Status + Reference */}
          <View style={RegisterStyles.header}>
            <StatusRow
              status={expense.status}
              reference={expense.reference}
              statusConfig={statusConfig}
            />
          </View>

          {/* Second row: Icon + Vendor + Amount */}
          <View style={RegisterStyles.mainRow}>
            <IconContainer iconConfig={iconConfig}>
              <Feather name="arrow-down-left" size={16} color="#10B981" />
            </IconContainer>
            <View style={RegisterStyles.info}>
              <Text style={RegisterStyles.title}>{expense.vendor}</Text>
              <Text style={RegisterStyles.date}>
                {expense.fullDate} | {expense.time}
              </Text>
            </View>
            <Text style={RegisterStyles.amount}>{expense.amount}</Text>
          </View>
        </View>
      </CommonCardRenderer>
    );
  };

  // Configuration for common component
  const filters = ['Period', 'Type', 'Status'];
  const summaryCards = [
    {label: 'Total', value: '₹16,400'},
    {label: 'Tax', value: '₹2,940'},
  ];

  return (
    <>
      <ErrorBoundary>
        <Header
          title="Expense Register"
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

        <RegisterComponent
          data={expenses}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedItems={selectedExpenses}
          onItemPress={handleTap}
          onItemLongPress={handleLongPress}
          onShareSelected={shareSelectedExpenses}
          renderCard={renderExpenseCard}
          filters={filters}
          summaryCards={summaryCards}
          sectionTitle="List Of Expenses"
          shareButtonText={`Share ${selectedExpenses.length} Expense(s)`}
          shareButtonColor="#07624C"
          typeOptions={['All', 'Direct', 'Indirect']}
        />
      </ErrorBoundary>
    </>
  );
};

const styles = StyleSheet.create({});

export default ExpenseRegister;
