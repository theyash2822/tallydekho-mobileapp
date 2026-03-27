import React from 'react';
import {View, StyleSheet, Text, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Feather from 'react-native-vector-icons/Feather';
import Colors from '../../utils/Colors';

const RecentTransactions = ({transactions = []}) => {
  const navigation = useNavigation();

  const renderTransactionItem = (transaction, index) => (
    <View key={transaction.id} style={styles.transactionItem}>
      <View style={styles.transactionLeft}>
        <View style={[styles.iconContainer]}>
          <Feather
            name={
              transaction.type === 'receipt'
                ? 'arrow-down-left'
                : 'arrow-up-right'
            }
            size={18}
            color={transaction.type === 'receipt' ? '#16C47F' : '#FF3B30'}
          />
        </View>
        <View style={styles.transactionInfo}>
          <Text style={styles.transactionTitle}>
            {transaction.title} •
            <Text style={{color: '#667085', fontSize: 12, fontWeight: '400'}}>
              {' '}
              {transaction.reference}
            </Text>
          </Text>
          <Text style={styles.transactionDate}>{transaction.date}</Text>
        </View>
      </View>
      <View style={styles.transactionRight}>
        <Text style={[styles.transactionAmount]}>
          ₹{transaction.amount.toLocaleString()}
        </Text>
      </View>
    </View>
  );

  const handleViewAll = () => {
    navigation.navigate('cashRegister');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Recent Transactions</Text>
        <TouchableOpacity style={styles.menuButton}>
          {/* <Feather name="more-horizontal" size={20} color="#6B7280" /> */}
        </TouchableOpacity>
      </View>

      <View style={styles.transactionsList}>
        {transactions && transactions.length > 0 ? (
          transactions.map((transaction, index) =>
            renderTransactionItem(transaction, index),
          )
        ) : (
          <View style={styles.noDataContainer}>
            <Text style={styles.noDataText}>No data found</Text>
          </View>
        )}
      </View>

      <TouchableOpacity style={styles.viewAllButton} onPress={handleViewAll}>
        <Text style={styles.viewAllText}>View All</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 12,
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#494D58',
  },
  menuButton: {
    padding: 4,
  },
  transactionsList: {
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
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    backgroundColor: '#F0F2F9',
  },
  transactionInfo: {
    flex: 1,
  },
  transactionTitle: {
    fontSize: 12,
    fontWeight: '500',
    color: '#000000',
  },
  transactionDate: {
    fontSize: 10,
    color: '#6B7280',
  },
  transactionRight: {
    alignItems: 'flex-end',
  },
  transactionAmount: {
    fontSize: 14,
    fontWeight: '500',
    color: '#494D58',
  },
  viewAllButton: {
    alignItems: 'center',
    marginTop: 12,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 20,
  },
  viewAllText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#494D58',
  },
  noDataContainer: {
    paddingVertical: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noDataText: {
    fontSize: 14,
    fontWeight: '400',
    color: '#6B7280',
  },
});

export default RecentTransactions;
