import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Colors from '../../../utils/Colors';

const PartyItem = ({item}) => {
  return (
    <View style={styles.partyCard}>
      <View style={styles.partyLeft}>
        <View style={[styles.partyIcon, {backgroundColor: item.color}]}>
          <Text style={styles.partyInitial}>{item.initial}</Text>
        </View>
        <View style={styles.partyInfo}>
          <Text style={styles.partyName}>{item.customer}</Text>
        </View>
      </View>
      <Text style={styles.partyAmount}>{item.totalAmount}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  partyCard: {
    borderRadius: 12,
    padding: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  partyLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  partyIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  partyInitial: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  partyInfo: {
    flex: 1,
  },
  partyName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
  },
  partyAmount: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F1F1F',
  },
});

export default PartyItem;
