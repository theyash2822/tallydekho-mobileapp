import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Feather from 'react-native-vector-icons/Feather';
import Header from '../../../common/Header';
import Colors from '../../../../utils/Colors';
import { Icons } from '../../../../utils/Icons';

const OnHandStockItemDetail = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { itemName, productId } = route.params;

  // Dummy data for the item
  const itemData = {
    name: itemName || 'Black JBL',
    productId: productId || 'PRD-1002-ABC',
    keyMatrix: {
      totalQtyOnHand: -562,
      totalStockValue: '53000rs',
      availableQty: 85,
      reorderLevel: 10,
      leadTimeDays: 35,
      committedQty: 15,
    },
    pricing: {
      lastPurchaseRate: '₹11.87/unit',
      averagePurchaseRate: '₹12.50/unit',
      standardSellingPrice: '₹18.00/unit',
      marginPercent: 44,
    },
    narration: '-',
    movementHistory: [
      {
        type: 'Purchase +100',
        reference: 'PO-789',
        date: '23 Jun',
        icon: Icons.RecentActivity4
      },
      {
        type: 'Sale -20',
        reference: 'INV-112',
        date: '19 Jun',
        icon: Icons.RecentActivity2
      },
      {
        type: 'Transfer -30',
        reference: 'WH-B',
        date: '14 Jun',
        icon: Icons.RecentActivity1
      },
      {
        type: 'Transfer -30',
        reference: 'WH-B',
        date: '14 Jun',
        icon: Icons.RecentActivity1
      },
    ],
  };

  return (
    <View style={styles.container}>
      <Header
        title="Item Detail"
        leftIcon="chevron-left"
        onLeftPress={() => navigation.goBack()}
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Item Identification Section */}
        <View style={[styles.section, { alignItems: 'center' }]}>
          <View style={styles.itemIconContainer}>
            <Icons.Box height={32} width={32} />
            {/* <Feather name="box" size={24} color="#16C47F" /> */}
          </View>
          <Text style={styles.itemName}>{itemData.name}</Text>
          <Text style={styles.productId}>{itemData.productId}</Text>
          <View style={styles.barcodeContainer}>
            <Text style={styles.barcodeText}>
              ||| || || ||| || || ||| || || |||
            </Text>
          </View>
        </View>

        {/* Key Matrix Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Key Matrix</Text>
          <View style={styles.matrixRow}>
            <Text style={styles.matrixLabel}>Total Qty on Hand</Text>
            <Text style={styles.matrixValue}>
              {itemData.keyMatrix.totalQtyOnHand}
            </Text>
          </View>
          <View style={styles.matrixRow}>
            <Text style={styles.matrixLabel}>Total Stock Value</Text>
            <Text style={styles.matrixValue}>
              {itemData.keyMatrix.totalStockValue}
            </Text>
          </View>
          <View style={styles.matrixRow}>
            <Text style={styles.matrixLabel}>Available Qty</Text>
            <Text style={styles.matrixValue}>
              {itemData.keyMatrix.availableQty}
            </Text>
          </View>
          <View style={styles.matrixRow}>
            <Text style={styles.matrixLabel}>Reorder level</Text>
            <Text style={styles.matrixValue}>
              {itemData.keyMatrix.reorderLevel}
            </Text>
          </View>
          <View style={styles.matrixRow}>
            <Text style={styles.matrixLabel}>Lead-time days</Text>
            <Text style={styles.matrixValue}>
              {itemData.keyMatrix.leadTimeDays}
            </Text>
          </View>
          <View style={styles.committedRow}>
            <Text style={styles.committedLabel}>Committed Qty</Text>
            <View style={styles.committedRight}>
              <Text style={styles.committedValue}>
                {itemData.keyMatrix.committedQty}
              </Text>
              <Feather name="chevron-right" size={16} color="#666" />
            </View>
          </View>
        </View>

        {/* Pricing & Cost Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pricing & Cost</Text>
          <View style={styles.matrixRow}>
            <Text style={styles.matrixLabel}>Last Purchase Rate</Text>
            <Text style={styles.matrixValue}>
              {itemData.pricing.lastPurchaseRate}
            </Text>
          </View>
          <View style={styles.matrixRow}>
            <Text style={styles.matrixLabel}>Average Purchase Rate</Text>
            <Text style={styles.matrixValue}>
              {itemData.pricing.averagePurchaseRate}
            </Text>
          </View>
          <View style={styles.matrixRow}>
            <Text style={styles.matrixLabel}>Standard Selling Price(s)</Text>
            <Text style={styles.matrixValue}>
              {itemData.pricing.standardSellingPrice}
            </Text>
          </View>
          <View style={styles.matrixRow}>
            <Text style={styles.matrixLabel}>Margin % indicator</Text>
            <Text style={styles.matrixValue}>
              {itemData.pricing.marginPercent}%
            </Text>
          </View>
        </View>

        {/* Narration Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Narration</Text>
          <Text style={styles.narrationText}>{itemData.narration}</Text>
        </View>

        {/* Movement History Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              Movement History (Last 10 d)
            </Text>
            <Feather name="calendar" size={20} color="#666" />
          </View>
          {itemData.movementHistory.map((movement, index) => {
            const IconComponent = movement.icon;
            return (
              <View
                key={index}
                style={[
                  styles.movementItem,
                  index === itemData.movementHistory.length - 1 &&
                  styles.lastMovementItem,
                ]}>
                <View style={styles.movementIcon}>
                  {IconComponent && <IconComponent height={16} width={16} />}
                </View>
                <View style={styles.movementInfo}>
                  <Text style={styles.movementType}>{movement.type}</Text>
                  <Text style={styles.movementReference}>
                    {movement.reference}
                  </Text>
                </View>
                <Text style={styles.movementDate}>{movement.date}</Text>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundColorPrimary,
    paddingBottom: 12,
  },
  content: {
    flex: 1,
    padding: 12,
  },
  itemIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  productId: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  barcodeContainer: {
    width: '100%',
    alignItems: 'center',
  },
  barcodeText: {
    fontSize: 16,
    color: '#333',
    letterSpacing: 2,
  },
  section: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.border
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  matrixRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  matrixLabel: {
    fontSize: 12,
    color: '#8F939E',
    fontWeight: '400',
    flex: 1,
  },
  matrixValue: {
    fontSize: 12,
    fontWeight: '500',
    color: '#333',
  },
  committedRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    marginTop: 8,
  },
  committedLabel: {
    fontSize: 14,
    color: '#666',
  },
  committedRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  committedValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginRight: 8,
  },
  narrationText: {
    fontSize: 14,
    color: '#666',
  },
  movementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  lastMovementItem: {
    borderBottomWidth: 0,
  },
  movementIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  movementInfo: {
    flex: 1,
  },
  movementType: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 2,
  },
  movementReference: {
    fontSize: 12,
    color: '#666',
  },
  movementDate: {
    fontSize: 12,
    color: '#666',
  },
});

export default OnHandStockItemDetail;
