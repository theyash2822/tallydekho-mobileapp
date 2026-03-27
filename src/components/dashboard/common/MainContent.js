import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import Colors from '../../../utils/Colors';

const MainContent = ({
  activeTab,
  setActiveTab,
  recentData,
  topData,
  renderTransactionItem,
  renderTopItem,
  tab1Name,
  tab2Name,
  tab2Value,
  onViewAllRecent,
  onViewAllTop,
  minHeight = '83%', // Default to 83% for Sales, can be overridden
}) => {
  const isRecentEmpty = activeTab === 'recent' && recentData.length === 0;
  const isTopEmpty = activeTab === tab2Value && topData.length === 0;

  return (
    <View style={[styles.mainContentSection, {minHeight}]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContentContainer,
          isRecentEmpty || isTopEmpty ? {flexGrow: 1} : {},
        ]}
        style={styles.scrollContainer}
        bounces={false}
        alwaysBounceVertical={false}
        keyboardShouldPersistTaps="handled">
        {/* Tab Navigation */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'recent' && styles.activeTab]}
            onPress={() => setActiveTab('recent')}>
            <Text
              style={[
                styles.tabText,
                activeTab === 'recent' && styles.activeTabText,
              ]}>
              {tab1Name}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, activeTab === tab2Value && styles.activeTab]}
            onPress={() => setActiveTab(tab2Value)}>
            <Text
              style={[
                styles.tabText,
                activeTab === tab2Value && styles.activeTabText,
              ]}>
              {tab2Name}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Content based on active tab */}
        {activeTab === 'recent' ? (
          <>
            {isRecentEmpty ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No vouchers found</Text>
                <TouchableOpacity
                  style={styles.viewAllButton}
                  onPress={onViewAllRecent}>
                  <Text style={styles.viewAllText}>View All</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <>
                <View style={styles.transactionsList}>
                  {recentData.map((item, index) => (
                    <View key={item.id || index}>
                      {renderTransactionItem(item)}
                    </View>
                  ))}
                </View>
                <TouchableOpacity
                  style={styles.viewAllButton}
                  onPress={onViewAllRecent}>
                  <Text style={styles.viewAllText}>View All</Text>
                  <Feather name="chevron-right" size={20} color="#6B7280" />
                </TouchableOpacity>
              </>
            )}
          </>
        ) : (
          <>
            {isTopEmpty ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No parties found</Text>
                <TouchableOpacity
                  style={styles.viewAllButton}
                  onPress={onViewAllTop}>
                  <Text style={styles.viewAllText}>View All</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <>
                <View style={styles.topList}>
                  {topData.map((item, index) => (
                    <View key={item.id || index}>{renderTopItem(item)}</View>
                  ))}
                </View>
                <TouchableOpacity
                  style={styles.viewAllButton}
                  onPress={onViewAllTop}>
                  <Text style={styles.viewAllText}>View All</Text>
                  <Feather name="chevron-right" size={20} color="#6B7280" />
                </TouchableOpacity>
              </>
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContentSection: {
    backgroundColor: '#fff',
    marginHorizontal: 8,
    borderRadius: 20,
    paddingTop: 12,
    paddingHorizontal: 12,
  },
  scrollContainer: {},
  scrollContentContainer: {
    paddingBottom: 20,
    flexGrow: 1, // Ensure content can expand and button is accessible
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 6,
    marginBottom: 12,
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
    color: '#6B7280',
  },
  activeTabText: {
    color: '#111827',
  },
  transactionsList: {
    marginBottom: 6,
  },
  topList: {
    gap: 6,
    marginBottom: 10,
  },
  emptyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    minHeight: 200, // Use fixed height instead of percentage for better iOS compatibility
  },
  emptyText: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 12,
    fontWeight: '500',
    
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: Colors.border,
    alignSelf: 'center',
    minWidth: 100, // Ensure button has minimum width for better touch target
    minHeight: 44, // iOS recommended minimum touch target size
  },
  viewAllText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#494D58',
  },
});

export default MainContent;
