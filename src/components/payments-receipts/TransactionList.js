import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import TransactionItem from './TransactionItem';
import Colors from '../../utils/Colors';

const TransactionList = ({transactions, type = 'payment'}) => {
  if (!transactions || transactions.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No voucher found</Text>
      </View>
    );
  }

  return (
    <View style={styles.transactionsList}>
      {transactions.map(item => (
        <TransactionItem key={item.id} item={item} type={type} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  transactionsList: {
    gap: 12,
  },
  emptyContainer: {
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#8F939E',
    textAlign: 'center',
  },
});

export default TransactionList;
