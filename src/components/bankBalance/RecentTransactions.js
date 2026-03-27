import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import Colors from '../../utils/Colors';

const RecentTransactions = ({transactions = []}) => {
  const renderTransactionItem = transaction => (
    <View key={transaction.id} style={styles.transactionItem}>
      <View style={styles.transactionLeft}>
        <View style={styles.transactionIcon}>
          <Feather name={'credit-card'} size={16} color={'#16C47F'} />
        </View>
        <View style={styles.transactionInfo}>
          <Text style={styles.transactionId}>{transaction.transactionId}</Text>
          <Text style={styles.transactionDate}>{transaction.date}</Text>
        </View>
      </View>

      <View style={styles.transactionRight}>
        <Text style={[styles.transactionAmount]}>
          {transaction.amount} {transaction.type}
        </Text>
      </View>
    </View>
  );

  if (!transactions || transactions.length === 0) {
    return null;
  }

  return (
    <View style={styles.recentTransactionsSection}>
      <Text style={styles.sectionTitle}>Recent Transactions</Text>
      <View style={styles.transactionsContainer}>
        {transactions.map(renderTransactionItem)}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  recentTransactionsSection: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 20,
    marginTop:8
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#494D58',
    marginBottom: 12,
  },
  transactionsContainer: {
    gap: 8,
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
  },
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  transactionIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F0F2F9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionId: {
    fontSize: 12,
    fontWeight: '500',
    color: '#000000',
  },
  transactionDate: {
    fontSize: 10,
    color: '#667085',
    fontWeight: '400',
  },
  transactionRight: {
    alignItems: 'flex-end',
  },
  transactionAmount: {
    fontSize: 14,
    fontWeight: '500',
    color: '#494D58',
  },
});

export default RecentTransactions;
