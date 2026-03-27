import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import Colors from '../../../utils/Colors';

const TransactionItem = ({item}) => {
  return (
    <View style={styles.transactionCard}>
      <View style={styles.transactionHeader}>
        <View style={styles.statusContainer}>
          <View
            style={[
              styles.statusDot,
              {backgroundColor: item.isPaid ? '#10B981' : '#EF4444'},
            ]}
          />
          <Text
            style={[
              styles.statusText,
              {color: item.isPaid ? '#10B981' : '#EF4444'},
            ]}>
            {item.status}
          </Text>
          <View style={styles.dotSeparator} />
          <Text style={styles.referenceText}>{item.reference}</Text>
        </View>
      </View>

      <View style={styles.transactionContent}>
        <View style={styles.transactionLeft}>
          <View style={styles.transactionIcon}>
            <Feather name="arrow-down-left" size={16} color="#10B981" />
          </View>
          <View style={styles.vendorInfo}>
            <Text style={styles.vendorName}>{item.vendor}</Text>
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
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
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
  transactionIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F0F2F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  vendorInfo: {
    flex: 1,
  },
  vendorName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
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
