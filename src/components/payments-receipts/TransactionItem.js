import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import Colors from '../../utils/Colors';

const TransactionItem = ({item, type = 'payment'}) => {
  return (
    <View style={styles.transactionItem}>
      <View style={styles.transactionLeft}>
        <Text style={styles.transactionHeader}>
          {item.method} • {item.transactionId}
        </Text>
        <View style={styles.transactionDetails}>
          <View style={styles.transactionIcon}>
            <Feather name="home" size={16} color="#34C759" />
          </View>
          <View style={styles.transactionInfo}>
            <Text style={styles.transactionName}>{item.name}</Text>
            <Text style={styles.transactionDate}>
              {item.date} • {item.method}
            </Text>
          </View>
        </View>
      </View>
      <View style={styles.transactionRight}>
        <Text style={styles.transactionAmount}>{item.amount}</Text>
        <View style={styles.statusIcon}>
          <Feather name="check" size={14} color="#fff" />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12, 
    borderWidth: 1,
    borderColor: Colors.border,
  },
  transactionLeft: {
    flex: 1,
  },
  transactionHeader: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  transactionDetails: {
    flexDirection: 'row',
    alignItems: 'center',
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
  transactionName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111',
    marginBottom: 2,
  },
  transactionDate: {
    fontSize: 12,
    color: '#666',
  },
  transactionRight: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  transactionAmount: {
    fontSize: 14,
    fontWeight: '500',
    color: '#494D58',
  },
  statusIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default TransactionItem;
