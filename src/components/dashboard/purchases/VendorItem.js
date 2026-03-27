import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Colors from '../../../utils/Colors';

const VendorItem = ({item}) => {
  return (
    <View style={styles.vendorCard}>
      <View style={styles.vendorLeft}>
        <View style={[styles.vendorIcon, {backgroundColor: item.color}]}>
          <Text style={styles.vendorInitial}>{item.vendor.charAt(0)}</Text>
        </View>
        <View style={styles.vendorInfo}>
          <Text style={styles.vendorName}>{item.vendor}</Text>
          <Text style={styles.vendorStats}>
            {item.transactionCount} transactions
          </Text>
        </View>
      </View>
      <Text style={styles.vendorAmount}>{item.totalAmount}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  vendorCard: {
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  vendorLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  vendorIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  vendorInitial: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
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
  vendorStats: {
    fontSize: 12,
    color: '#6B7280',
  },
  vendorAmount: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F1F1F',
  },
});

export default VendorItem;
