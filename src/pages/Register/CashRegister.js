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
import ErrorBoundary from '../../components/common/ErrorBoundary';
import RegisterComponent, {
  CommonCardRenderer,
  IconContainer,
  StatusRow,
} from './common/RegisterComponent';
import {Icons} from '../../utils/Icons';
import {formatCurrencyCompactRounded} from '../../utils/formatUtils';
import RegisterStyles from './css/RegisterStyles';

const CashRegister = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTransactions, setSelectedTransactions] = useState([]);

  // Transaction data with full date information for filtering and calculation
  const allTransactions = [
    {
      id: 1,
      reference: 'DEP-114',
      description: 'Payment to SBI',
      date: '12 Jul',
      fullDate: '2025-07-12',
      amount: '₹15,000',
      amountValue: 15000,
      type: 'payment',
      bank: 'SBI',
    },
    {
      id: 2,
      reference: 'DEP-113',
      description: 'Deposit to ICICI Bank',
      date: '11 Mar',
      fullDate: '2025-03-11',
      amount: '₹15,000',
      amountValue: 15000,
      type: 'payment',
      bank: 'ICICI',
    },
    {
      id: 3,
      reference: 'DEP-112',
      description: 'Transfer to Axis Bank',
      date: '12 Mar',
      fullDate: '2025-03-12',
      amount: '₹15,000',
      amountValue: 15000,
      type: 'payment',
      bank: 'Axis',
    },
    {
      id: 4,
      reference: 'DEP-111',
      description: 'Cash Receipt',
      date: '9 Jan',
      fullDate: '2025-01-09',
      amount: '₹25,000',
      amountValue: 25000,
      type: 'receipt',
      bank: 'Cash',
    },
    {
      id: 5,
      reference: 'DEP-110',
      description: 'Payment to HDFC',
      date: '8 Jul',
      fullDate: '2025-07-08',
      amount: '₹30,000',
      amountValue: 30000,
      type: 'payment',
      bank: 'HDFC',
    },
    {
      id: 6,
      reference: 'DEP-109',
      description: 'Cash Receipt',
      date: '7 Jul',
      fullDate: '2025-07-07',
      amount: '₹45,000',
      amountValue: 45000,
      type: 'receipt',
      bank: 'Cash',
    },
    {
      id: 7,
      reference: 'DEP-108',
      description: 'Transfer to Kotak',
      date: '6 Jul',
      fullDate: '2025-07-06',
      amount: '₹20,000',
      amountValue: 20000,
      type: 'payment',
      bank: 'Kotak',
    },
    {
      id: 8,
      reference: 'DEP-107',
      description: 'Cash Receipt',
      date: '5 Jul',
      fullDate: '2025-07-05',
      amount: '₹35,000',
      amountValue: 35000,
      type: 'receipt',
      bank: 'Cash',
    },
    {
      id: 9,
      reference: 'DEP-106',
      description: 'Payment to Axis',
      date: '4 Jul',
      fullDate: '2025-07-04',
      amount: '₹18,000',
      amountValue: 18000,
      type: 'payment',
      bank: 'Axis',
    },
    {
      id: 10,
      reference: 'DEP-105',
      description: 'Cash Receipt',
      date: '3 Jul',
      fullDate: '2025-07-03',
      amount: '₹50,000',
      amountValue: 50000,
      type: 'receipt',
      bank: 'Cash',
    },
    {
      id: 11,
      reference: 'DEP-104',
      description: 'Payment to SBI',
      date: '2 Jul',
      fullDate: '2025-07-02',
      amount: '₹22,000',
      amountValue: 22000,
      type: 'payment',
      bank: 'SBI',
    },
    {
      id: 12,
      reference: 'DEP-103',
      description: 'Cash Receipt',
      date: '1 Jul',
      fullDate: '2025-07-01',
      amount: '₹40,000',
      amountValue: 40000,
      type: 'receipt',
      bank: 'Cash',
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

  // Handle transaction selection
  const toggleTransactionSelection = transactionId => {
    setSelectedTransactions(prev => {
      if (prev.includes(transactionId)) {
        return prev.filter(id => id !== transactionId);
      } else {
        return [...prev, transactionId];
      }
    });
  };

  // Handle long press selection
  const handleLongPress = transactionId => {
    if (!selectedTransactions.includes(transactionId)) {
      toggleTransactionSelection(transactionId);
    }
  };

  // Handle tap selection
  const handleTap = transactionId => {
    if (selectedTransactions.length > 0) {
      // If in selection mode, toggle selection
      toggleTransactionSelection(transactionId);
    }
  };

  // Share selected transactions
  const shareSelectedTransactions = () => {
    console.log('Sharing transactions:', selectedTransactions);
    // Implement share functionality here
  };

  // Configuration objects
  const iconConfig = {
    backgroundColor: '#F0F2F9',
  };

  // Render transaction card
  const renderTransactionCard = transaction => {
    const isSelected = selectedTransactions.includes(transaction.id);

    return (
      <CommonCardRenderer
        key={transaction.id}
        item={transaction}
        isSelected={isSelected}
        onPress={handleTap}
        onLongPress={handleLongPress}
        // statusConfig={statusConfig}
        iconConfig={iconConfig}>
        <View style={RegisterStyles.content}>
          {/* Top row: Reference only (no status) */}
          <View style={RegisterStyles.header}>
            <StatusRow reference={transaction.reference} showStatus={false} />
          </View>

          {/* Second row: Icon + Description + Amount */}
          <View style={RegisterStyles.mainRow}>
            <IconContainer iconConfig={iconConfig}>
              <Icons.DollarCard height={20} width={20} />
              {/* <Feather name={'arrow-down-left'} size={16} color={'#10B981'} /> */}
            </IconContainer>
            <View style={RegisterStyles.info}>
              <Text style={RegisterStyles.titleSmall}>
                {transaction.description}
              </Text>
              <Text style={RegisterStyles.dateSmall}>{transaction.date}</Text>
            </View>
            <Text style={RegisterStyles.amountMuted}>
              {transaction.type === 'receipt' ? '+' : '-'}
              {transaction.amount}
            </Text>
          </View>
        </View>
      </CommonCardRenderer>
    );
  };

  // Calculate inflow and outflow based on filtered data
  const calculateCashFlow = filteredTransactions => {
    let totalInflow = 0;
    let totalOutflow = 0;

    filteredTransactions.forEach(transaction => {
      if (transaction.type === 'receipt') {
        totalInflow += transaction.amountValue;
      } else if (transaction.type === 'payment') {
        totalOutflow += transaction.amountValue;
      }
    });

    return {
      inflow: totalInflow,
      outflow: totalOutflow,
    };
  };

  // Configuration for common component
  const filters = ['Period', 'Type'];

  // Dynamic summary cards - will be calculated based on filtered data
  const getSummaryCards = filteredTransactions => {
    const {inflow, outflow} = calculateCashFlow(filteredTransactions);

    return [
      {label: 'Inflow', value: `+${formatCurrencyCompactRounded(inflow)}`},
      {label: 'Outflow', value: `-${formatCurrencyCompactRounded(outflow)}`},
    ];
  };

  return (
    <>
      <ErrorBoundary>
        <Header
          title="Cash Register"
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
          data={allTransactions}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedItems={selectedTransactions}
          onItemPress={handleTap}
          onItemLongPress={handleLongPress}
          onShareSelected={shareSelectedTransactions}
          renderCard={renderTransactionCard}
          filters={filters}
          summaryCards={getSummaryCards}
          sectionTitle="List Transactions"
          shareButtonText={`Share ${selectedTransactions.length} Transaction(s)`}
          shareButtonColor="#07624C"
          typeOptions={['All', 'Inflow', 'Outflow']}
        />
      </ErrorBoundary>
    </>
  );
};

const styles = StyleSheet.create({});

export default CashRegister;
