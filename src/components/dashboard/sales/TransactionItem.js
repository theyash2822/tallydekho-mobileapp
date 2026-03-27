import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import Colors from '../../../utils/Colors';

const TransactionItem = ({item}) => {
  return (
    <View style={styles.transactionCard}>
      <View style={styles.transactionContent}>
        <View style={styles.transactionLeft}>
          <View style={styles.customerIcon}>
            <Feather name="arrow-down-left" size={16} color="#10B981" />
          </View>
          <View style={styles.customerInfo}>
            <View style={styles.customerRow}>
              <Text style={styles.customerName}>{item.customer}</Text>
              <View style={styles.dotSeparator} />
              <Text style={styles.referenceText}>{item.reference}</Text>
            </View>
            <Text style={styles.transactionDate}>{item.date}</Text>
          </View>
        </View>
        <View style={styles.transactionRight}>
          <Text style={styles.transactionAmount}>{item.amount}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  transactionCard: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    padding: 12,
    marginBottom: 6,
  },
  transactionContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  customerIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F0F2F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  customerInfo: {
    flex: 1,
  },
  customerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  customerName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  dotSeparator: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#9CA3AF',
    marginHorizontal: 8,
  },
  referenceText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
  },
  transactionDate: {
    fontSize: 12,
    color: '#6B7280',
  },
  transactionRight: {
    alignItems: 'flex-end',
  },
  transactionAmount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
});

export default TransactionItem;
