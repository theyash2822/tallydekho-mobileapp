import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Feather from 'react-native-vector-icons/Feather';
import Header from '../../../common/Header';
import Colors from '../../../../utils/Colors';
import { Icons } from '../../../../utils/Icons';

const WarehouseDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { warehouse } = route.params;

  // Dummy data for stock summary
  const stockSummary = {
    totalStock: {
      number: '1042',
      skus: '0.75',
      quantity: '23',
      value: '₹125,000',
    },
    onHandStock: {
      number: '1042',
      skus: '0.75',
      quantity: '23',
      value: '₹125,000',
    },
  };

  // Dummy data for recent activities
  const recentActivities = [
    {
      id: '1',
      type: 'Stock Transfer',
      reference: 'SI-1024',
      date: '23 Jun',
      icon: Icons.RecentActivity1
    },
    {
      id: '2',
      type: 'Sales Invoice',
      reference: 'INV-112',
      date: '19 Jun',
      icon: Icons.RecentActivity2,
    },
    {
      id: '3',
      type: 'Stock adjustment',
      reference: 'WH-B',
      date: '14 Jun',
      icon: Icons.RecentActivity3,
    },
    {
      id: '4',
      type: 'Purchase Invoice',
      reference: 'WH-B',
      date: '14 Jun',
      icon: Icons.RecentActivity4,
    },
  ];

  const renderStockSummaryCard = (title, data) => (
    <View style={styles.stockCard}>
      <Text style={styles.stockNumber}>{data.number}</Text>
      <Text style={styles.stockTitle}>{title}</Text>
      <View style={styles.stockDataRow}>
        <View style={styles.stockDataColumn}>
          <Text style={styles.stockDataValue}>{data.skus}</Text>
          <Text style={styles.stockDataLabel}>Number of SKUs</Text>
        </View>
        <View style={styles.stockDataDivider} />
        <View style={styles.stockDataColumn}>
          <Text style={styles.stockDataValue}>{data.quantity}</Text>
          <Text style={styles.stockDataLabel}>Quantity</Text>
        </View>
        <View style={styles.stockDataDivider} />
        <View style={styles.stockDataColumn}>
          <Text style={styles.stockDataValue}>{data.value}</Text>
          <Text style={styles.stockDataLabel}>Value (INR)</Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Custom Header */}
      <Header
        title="Warehouses Detail"
        leftIcon="chevron-left"
        onLeftPress={() => navigation.goBack()}
      />

      {/* Scrollable Content */}
      <FlatList
        data={[{ id: 'warehouse-content' }]}
        renderItem={() => (
          <>
            {/* Warehouse Information Card */}
            <View style={styles.warehouseCard}>
              <View style={styles.warehouseIcon}>
                <Feather name="home" size={20} color="#FFF" />
              </View>
              <View style={styles.warehouseInfo}>
                <Text style={styles.warehouseName}>
                  {warehouse?.name || 'Alpha Centauri Warehouse'}
                </Text>
                <Text style={styles.warehouseLocation}>
                  {warehouse?.location || 'New Delhi, India'}
                </Text>
              </View>
            </View>

            {/* Stock Summary Cards */}
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('warehouseTotalStock', { warehouse })
              }>
              {renderStockSummaryCard('Total Stock', stockSummary.totalStock)}
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('warehouseOnHandStock', { warehouse })
              }>
              {renderStockSummaryCard(
                'On Hand Stock',
                stockSummary.onHandStock,
              )}
            </TouchableOpacity>

            {/* Recent Activity Section */}
            <View style={styles.activitySection}>
              <View style={styles.activityHeader}>
                <Text style={styles.activityTitle}>Recent Activity</Text>
                <Feather name="calendar" size={20} color="#FFF" />
              </View>
              {recentActivities.map(item => {
                const IconComponent = item.icon;
                return (
                  <View key={item.id} style={styles.activityItem}>
                    <View style={styles.activityIcon}>
                      {IconComponent && <IconComponent height={16} width={16} />}
                    </View>
                    <View style={styles.activityInfo}>
                      <Text style={styles.activityType}>{item.type}</Text>
                      <Text style={styles.activityReference}>
                        {item.reference}
                      </Text>
                    </View>
                    <Text style={styles.activityDate}>{item.date}</Text>
                  </View>
                );
              })}
            </View>
          </>
        )}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        removeClippedSubviews={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f8fa',
  },
  scrollContent: {
    paddingBottom: 20,
  },
  warehouseCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 12,
    margin: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  warehouseIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#16C47F',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  warehouseInfo: {
    flex: 1,
  },
  warehouseName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  warehouseLocation: {
    fontSize: 12,
    color: '#667085',
    fontWeight: '400',
  },
  stockCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 12,
    marginHorizontal: 12,
    marginBottom: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  stockNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  stockTitle: {
    fontSize: 12,
    fontWeight: '400',
    color: '#667085',
    marginBottom: 8,
  },
  stockDataRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  stockDataColumn: {
    flex: 1,
    alignItems: 'center',
  },
  stockDataValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  stockDataLabel: {
    fontSize: 12,
    color: '#667085',
    textAlign: 'center',
    fontWeight: '400',
  },
  stockDataDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 8,
  },
  activitySection: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 12,
    marginHorizontal: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#494D58',
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: Colors.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 8,
  },
  activityIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityInfo: {
    flex: 1,
  },
  activityType: {
    fontSize: 12,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 2,
  },
  activityReference: {
    fontSize: 10,
    color: '#667085',
    fontWeight: '400',
  },
  activityDate: {
    fontSize: 12,
    color: '#8F939E',
    fontWeight: '500',
  },
});

export default WarehouseDetailScreen;
