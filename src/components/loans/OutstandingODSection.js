import React, {useState} from 'react';
import {View, StyleSheet, Text, TouchableOpacity} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import Colors from '../../utils/Colors';
import { Icons } from '../../utils/Icons';

const OutstandingODSection = ({
  outstandingData = [],
  odUtilizationData = [],
}) => {
  const [activeTab, setActiveTab] = useState('outstanding');

  const renderOutstandingItem = item => (
    <View key={item.month} style={styles.outstandingItem}>
      <View style={styles.itemLeft}>
        <View style={styles.itemIcon}>
          {/* <Feather name="dollar-sign" size={16} color="#666" /> */}
          <Icons.Payment/>
        </View>
        <View style={styles.itemInfo}>
          <Text style={styles.itemMonth}>{item.month}</Text>
          <Text style={styles.itemAmount}>{item.amount}</Text>
        </View>
      </View>
      <View style={styles.progressContainer}>
        <View style={styles.progressRow}>
          <View style={styles.verticalLinesContainer}>
            {[...Array(10)].map((_, index) => (
              <View
                key={index}
                style={[
                  styles.verticalLine,
                  {
                    opacity:
                      index < Math.floor(item.percentage / 10) ? 0.8 : 0.3,
                  },
                ]}
              />
            ))}
          </View>
          <Text style={styles.percentageText}>{item.percentage}%</Text>
        </View>
      </View>
    </View>
  );

  const renderODUtilizationItem = item => (
    <View key={item.id} style={styles.outstandingItem}>
      <View style={styles.itemLeft}>
        <View style={styles.itemIcon}>
          {/* <Feather name="settings" size={16} color="#666" /> */}
          <Icons.Like height={20} width={20} />
        </View>
        <View style={styles.itemInfo}>
          <Text style={styles.itemMonth}>{item.date}</Text>
          <Text style={styles.itemAmount}>{item.amount}</Text>
        </View>
      </View>
      <View style={styles.progressContainer}>
        <View style={styles.progressRow}>
          <View style={styles.dotsContainer}>
            {[...Array(10)].map((_, index) => (
              <View
                key={index}
                style={[
                  styles.dot,
                  {
                    backgroundColor:
                      index < Math.floor(item.percentage / 10)
                        ? '#0EA5E9'
                        : '#E5E7EB',
                  },
                ]}
              />
            ))}
          </View>
          <Text style={styles.percentageText}>{item.percentage}%</Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <View style={styles.tabRow}>
          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === 'outstanding' && styles.activeTab,
            ]}
            onPress={() => setActiveTab('outstanding')}>
            <Text
              style={[
                styles.tabText,
                activeTab === 'outstanding' && styles.activeTabText,
              ]}>
              Outstanding (6m)
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'od' && styles.activeTab]}
            onPress={() => setActiveTab('od')}>
            <Text
              style={[
                styles.tabText,
                activeTab === 'od' && styles.activeTabText,
              ]}>
              OD utilisation (30D)
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Content */}
      <View style={styles.contentContainer}>
        {activeTab === 'outstanding' ? (
          <View style={styles.itemsContainer}>
            {outstandingData.map(renderOutstandingItem)}
          </View>
        ) : (
          <View style={styles.itemsContainer}>
            {odUtilizationData.map(renderODUtilizationItem)}
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 20,
    marginBottom: 12,
    overflow: 'hidden',
  },
  tabContainer: {
    paddingHorizontal: 12,
    paddingTop: 12,
  },
  tabRow: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#fff',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#9CA3AF',
  },
  activeTabText: {
    color: '#111827',
    fontWeight: '600',
  },
  contentContainer: {
    padding: 12,
    paddingTop: 12,
  },
  itemsContainer: {
    gap: 8,
  },
  outstandingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  itemIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F0F2F9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  itemInfo: {
    flex: 1,
  },
  itemMonth: {
    fontSize: 12,
    fontWeight: '500',
    color: '#000000',
  },
  itemAmount: {
    fontSize: 10,
    fontWeight: '400',
    color: '#667085',
  },
  progressContainer: {
    alignItems: 'flex-end',
    minWidth: 80,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  verticalLinesContainer: {
    flexDirection: 'row',
    gap: 2,
  },
  verticalLine: {
    width: 2,
    height: 12,
    backgroundColor: '#9CA3AF',
    borderRadius: 1,
  },
  dotsContainer: {
    flexDirection: 'row',
    gap: 3,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  percentageText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
});

export default OutstandingODSection;
