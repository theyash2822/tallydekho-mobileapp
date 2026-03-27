import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import Colors from '../../utils/Colors';

const TabNavigation = ({
  activeTab,
  setActiveTab,
  recentTabLabel = 'Recent Outstandings',
  overdueTabLabel = 'Overdue Parties',
}) => {
  return (
    <View style={styles.tabsContainer}>
      <TouchableOpacity
        style={[styles.tab, activeTab === 'recent' && styles.activeTab]}
        onPress={() => setActiveTab('recent')}>
        <Text
          style={[
            styles.tabText,
            activeTab === 'recent' && styles.activeTabText,
          ]}>
          {recentTabLabel}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.tab, activeTab === 'overdue' && styles.activeTab]}
        onPress={() => setActiveTab('overdue')}>
        <Text
          style={[
            styles.tabText,
            activeTab === 'overdue' && styles.activeTabText,
          ]}>
          {overdueTabLabel}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  tabsContainer: {
    flexDirection: 'row',
    marginHorizontal: 12,
    marginBottom: 12,
    backgroundColor: '#F4F5FA',
    borderRadius: 8,
    padding: 4,
    borderWidth: 1,
    borderColor: Colors.border,
    marginTop: 10,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 6,
  },
  activeTab: {
    backgroundColor: '#fff',
  },
  tabText: {
    fontSize: 12,
    fontWeight: '400',
    color: '#838F9A',
  },
  activeTabText: {
    color: '#000000',
    fontWeight: '500',
  },
});

export default TabNavigation;
