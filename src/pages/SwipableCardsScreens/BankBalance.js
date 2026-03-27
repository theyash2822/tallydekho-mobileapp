import React, {useState} from 'react';
import {View, ScrollView, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Colors from '../../utils/Colors';
import {FinancialMetricsSection} from '../../components/financial';
import {
  BankAccountCards,
  RecentTransactions,
} from '../../components/bankBalance';
import {Icons} from '../../utils/Icons';
// import {BankAccountCards, RecentTransactions} from '../components/bankbalance';

const BankBalance = () => {
  const navigation = useNavigation();

  // Bank balance cards data for FinancialMetricsSection
  const bankBalanceCards = [
    {
      id: 1,
      title: 'Total Balance',
      value: '₹92,00,000',
      icon: Icons.CoinStack,
      change: '+12%',
    },
    {
      id: 2,
      title: 'Inflow Today',
      value: '₹1.27M',
      icon: Icons.BankNote,
      change: '+6.8%',
    },
    {
      id: 3,
      title: 'Outflow Today',
      value: '₹7.4M',
      icon: Icons.Wallet,
      change: '+9.1%',
    },
  ];

  // Bank account cards data
  const bankAccounts = [
    {
      id: 1,
      bankName: 'HDFC Bank',
      accountNumber: 'CA-1234',
      balance: '₹1,125,000',
      lastFeed: '10 Jul 2025',
      gradient: ['#10B981', '#059669'],
    },
    {
      id: 2,
      bankName: 'SBI Bank',
      accountNumber: 'SB-5678',
      balance: '₹750,000',
      lastFeed: '09 Jul 2025',
      gradient: ['#3B82F6', '#2563EB'],
    },
    {
      id: 3,
      bankName: 'ICICI Bank',
      accountNumber: 'IC-9012',
      balance: '₹450,000',
      lastFeed: '08 Jul 2025',
      gradient: ['#8B5CF6', '#7C3AED'],
    },
    {
      id: 4,
      bankName: 'Axis Bank',
      accountNumber: 'AX-3456',
      balance: '₹380,000',
      lastFeed: '07 Jul 2025',
      gradient: ['#F59E0B', '#D97706'],
    },
  ];

  // Bank-specific transactions data
  const bankTransactions = {
    0: [
      // HDFC Bank
      {
        id: 1,
        transactionId: 'HDFC-CH-778',
        date: 'Jul 10',
        amount: '₹75,000',
        type: 'Dr',
        category: 'Cheque',
      },
      {
        id: 2,
        transactionId: 'HDFC-DEP-009',
        date: '9 Jul',
        amount: '₹30,000',
        type: 'Cr',
        category: 'Cash Deposit',
      },
      {
        id: 3,
        transactionId: 'HDFC-RTGS-778',
        date: '08 Jul',
        amount: '₹75,000',
        type: 'Cr',
        category: 'RTGS',
      },
      {
        id: 4,
        transactionId: 'HDFC-UPI-779',
        date: '08 Jul',
        amount: '₹45,000',
        type: 'Cr',
        category: 'UPI',
      },
      {
        id: 5,
        transactionId: 'HDFC-NEFT-780',
        date: '07 Jul',
        amount: '₹25,000',
        type: 'Dr',
        category: 'NEFT',
      },
    ],
    1: [
      // SBI Bank
      {
        id: 1,
        transactionId: 'SBI-CH-456',
        date: 'Jul 10',
        amount: '₹50,000',
        type: 'Dr',
        category: 'Cheque',
      },
      {
        id: 2,
        transactionId: 'SBI-DEP-123',
        date: '9 Jul',
        amount: '₹20,000',
        type: 'Cr',
        category: 'Cash Deposit',
      },
      {
        id: 3,
        transactionId: 'SBI-RTGS-456',
        date: '08 Jul',
        amount: '₹60,000',
        type: 'Cr',
        category: 'RTGS',
      },
      {
        id: 4,
        transactionId: 'SBI-IMPS-789',
        date: '08 Jul',
        amount: '₹35,000',
        type: 'Cr',
        category: 'IMPS',
      },
      {
        id: 5,
        transactionId: 'SBI-NEFT-012',
        date: '07 Jul',
        amount: '₹15,000',
        type: 'Dr',
        category: 'NEFT',
      },
    ],
    2: [
      // ICICI Bank
      {
        id: 1,
        transactionId: 'ICICI-CH-234',
        date: 'Jul 10',
        amount: '₹40,000',
        type: 'Dr',
        category: 'Cheque',
      },
      {
        id: 2,
        transactionId: 'ICICI-DEP-567',
        date: '9 Jul',
        amount: '₹25,000',
        type: 'Cr',
        category: 'Cash Deposit',
      },
      {
        id: 3,
        transactionId: 'ICICI-RTGS-890',
        date: '08 Jul',
        amount: '₹55,000',
        type: 'Cr',
        category: 'RTGS',
      },
      {
        id: 4,
        transactionId: 'ICICI-UPI-123',
        date: '08 Jul',
        amount: '₹30,000',
        type: 'Cr',
        category: 'UPI',
      },
      {
        id: 5,
        transactionId: 'ICICI-NEFT-456',
        date: '07 Jul',
        amount: '₹20,000',
        type: 'Dr',
        category: 'NEFT',
      },
    ],
    3: [
      // Axis Bank
      {
        id: 1,
        transactionId: 'AXIS-CH-789',
        date: 'Jul 10',
        amount: '₹35,000',
        type: 'Dr',
        category: 'Cheque',
      },
      {
        id: 2,
        transactionId: 'AXIS-DEP-012',
        date: '9 Jul',
        amount: '₹18,000',
        type: 'Cr',
        category: 'Cash Deposit',
      },
      {
        id: 3,
        transactionId: 'AXIS-RTGS-345',
        date: '08 Jul',
        amount: '₹42,000',
        type: 'Cr',
        category: 'RTGS',
      },
      {
        id: 4,
        transactionId: 'AXIS-IMPS-678',
        date: '08 Jul',
        amount: '₹28,000',
        type: 'Cr',
        category: 'IMPS',
      },
      {
        id: 5,
        transactionId: 'AXIS-NEFT-901',
        date: '07 Jul',
        amount: '₹12,000',
        type: 'Dr',
        category: 'NEFT',
      },
    ],
  };

  // Default transactions (HDFC Bank)
  const [currentTransactions, setCurrentTransactions] = useState(
    bankTransactions[0],
  );

  const handleCardPress = () => {
    // Cards are not clickable - no navigation
  };

  const handleBankChange = (bankIndex, bankAccount) => {
    setCurrentTransactions(bankTransactions[bankIndex]);
  };

  return (
    <>
      <View style={{backgroundColor: '#fff', paddingTop: 10 , paddingBottom:10}}>
        <FinancialMetricsSection
          cards={bankBalanceCards}
          onCardPress={handleCardPress}
        />
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={{padding: 12}}>
          {/* Bank Account Cards Section */}
          <BankAccountCards
            bankAccounts={bankAccounts}
            onBankChange={handleBankChange}
          />

          {/* Recent Transactions Section */}
          <RecentTransactions transactions={currentTransactions} />
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
});

export default BankBalance;
