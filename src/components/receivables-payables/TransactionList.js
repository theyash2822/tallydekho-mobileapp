import React from 'react';
import {View, ScrollView, StyleSheet, Text} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import Colors from '../../utils/Colors';
import TabNavigation from './TabNavigation';

const TransactionList = ({
  activeTab,
  setActiveTab,
  recentOutstandings = [],
  overdueParties = [],
  recentTabLabel = 'Recent Outstandings',
  overdueTabLabel = 'Overdue Parties',
}) => {
  const renderRecentOutstandings = () => {
    if (!recentOutstandings || recentOutstandings.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No data</Text>
        </View>
      );
    }

    return (
      <ScrollView showsVerticalScrollIndicator={false}>
        {recentOutstandings.map((item, index) => (
          <View key={item.id} style={styles.listItem}>
            <View style={styles.itemLeft}>
              <View style={styles.itemIcon}>
                <Feather name="home" size={20} color={'#16C47F'} />
              </View>
              <View style={styles.itemDetails}>
                <View style={{flexDirection: 'row', gap: 10}}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemReference}>{item.reference}</Text>
                </View>
                <Text style={styles.itemDate}>{item.date}</Text>
              </View>
            </View>
            <View style={styles.itemRight}>
              <Text style={styles.itemAmount}>{item.amount}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    );
  };

  const renderOverdueParties = () => {
    if (!overdueParties || overdueParties.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No data</Text>
        </View>
      );
    }

    return (
      <ScrollView showsVerticalScrollIndicator={false}>
        {overdueParties.map((item, index) => (
          <View key={item.id} style={styles.listItem}>
            <View style={styles.itemLeft}>
              <View style={styles.itemIcon}>
                <Feather name="home" size={16} color={'#16C47F'} />
              </View>
              <View style={styles.itemDetails}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemDaysOverdue}>{item.daysOverdue}</Text>
              </View>
            </View>
            <View style={styles.itemRight}>
              <Text style={styles.itemAmount}>{item.amount}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    );
  };

  return (
    <>
      <TabNavigation
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        recentTabLabel={recentTabLabel}
        overdueTabLabel={overdueTabLabel}
      />
      <View style={styles.contentContainer}>
        {activeTab === 'recent'
          ? renderRecentOutstandings()
          : renderOverdueParties()}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    paddingHorizontal: 12,
    paddingBottom: 10,
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.white,
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  itemIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F0F2F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 12,
    fontWeight: '500',
    color: '#111111',
  },
  itemReference: {
    fontSize: 12,
    color: '#667085',
    fontWeight: '400',
  },
  itemRight: {
    alignItems: 'flex-end',
  },
  itemDate: {
    fontSize: 10,
    color: '#667085',
    fontWeight: '400',
  },
  itemDaysOverdue: {
    fontSize: 10,
    color: '#667085',
    fontWeight: '400',
  },
  itemAmount: {
    fontSize: 14,
    fontWeight: '500',
    color: '#494D58',
  },
  emptyContainer: {
    flex: 1,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
  },
  emptyText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#8F939E',
    textAlign: 'center',
  },
});

export default TransactionList;
