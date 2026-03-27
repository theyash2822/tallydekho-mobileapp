import React from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import {useNavigation, useRoute} from '@react-navigation/native';
import Colors from '../../../../utils/Colors';
import {Header} from '../../../common';

const TransferDetails = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {transferData} = route.params || {};

  // Default data if no transfer data is passed
  const defaultTransferData = {
    id: 'TX-2456',
    status: 'In Transit',
    statusColor: '#16C47F',
    date: '1 Aug 2025',
    origin: 'Jaipur',
    destination: 'Delhi',
    items: [
      {
        id: 'PRD-1002-ABC',
        name: 'Palladium Power Cells',
        price: '₹95,750',
        quantity: 3,
        image: null, // Placeholder for item image
      },
      {
        id: 'PRD-1003-DEF',
        name: 'Quantum Storage Module',
        price: '₹78,500',
        quantity: 2,
        image: null,
      },
      {
        id: 'PRD-1004-GHI',
        name: 'Neural Network Processor',
        price: '₹1,25,000',
        quantity: 1,
        image: null,
      },
    ],
  };

  const transfer = transferData || defaultTransferData;

  const getProgressStep = status => {
    switch (status) {
      case 'Created':
        return 1;
      case 'Dispatched':
        return 2;
      case 'In Transit':
        return 2;
      case 'Received':
        return 3;
      case 'Completed':
        return 3;
      default:
        return 1;
    }
  };

  const renderProgressBar = () => {
    const steps = [
      {id: 'created', label: 'Created', icon: 'box'},
      {id: 'dispatched', label: 'Dispatched', icon: 'truck'},
      {id: 'received', label: 'Received', icon: 'box'},
    ];

    const currentStep = getProgressStep(transfer.status);

    return (
      <View style={styles.progressContainer}>
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep - 1;
          const isNext = index > currentStep - 1;

          return (
            <View key={step.id} style={styles.progressStep}>
              {/* Step Icon */}
              <View
                style={[
                  styles.stepIcon,
                  isCompleted && styles.stepIconCompleted,
                  isCurrent && styles.stepIconCurrent,
                  isNext && styles.stepIconNext,
                ]}>
                <Feather
                  name={step.icon}
                  size={16}
                  color={isCompleted || isCurrent ? '#FFFFFF' : '#8F939E'}
                />
              </View>

              {/* Step Label */}
              <Text
                style={[
                  styles.stepLabel,
                  isCompleted && styles.stepLabelCompleted,
                  isCurrent && styles.stepLabelCurrent,
                  isNext && styles.stepLabelNext,
                ]}>
                {step.label}
              </Text>

              {/* Status Tag for Current Step */}
              {isCurrent && transfer.status === 'In Transit' && (
                <View style={styles.statusTag}>
                  <Text style={styles.statusTagText}>In Transit</Text>
                </View>
              )}

              {/* Connection Line */}
              {index < steps.length - 1 && (
                <View
                  style={[
                    styles.connectionLine,
                    isCompleted && styles.connectionLineCompleted,
                    isNext && styles.connectionLineNext,
                  ]}
                />
              )}
            </View>
          );
        })}
      </View>
    );
  };

  const renderItemCard = item => (
    <View key={item.id} style={styles.itemCard}>
      {/* Item Image Placeholder */}
      <View style={styles.itemImagePlaceholder}>
        <Feather name="package" size={24} color="#8F939E" />
      </View>

      {/* Item Details */}
      <View style={styles.itemDetails}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemId}>{item.id}</Text>
      </View>

      {/* Item Price and Quantity */}
      <View style={styles.itemPriceSection}>
        <Text style={styles.itemPrice}>{item.price}</Text>
        <Text style={styles.itemQuantity}>{item.quantity} Items</Text>
      </View>
    </View>
  );

  return (
    <>
      {/* <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" /> */}
      <View style={styles.container}>
        <Header title={'Details'} leftIcon={'chevron-left'} />

        <ScrollView
          style={styles.content}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}>
          {/* Tracking Card */}
          <View style={styles.trackingCard}>
            {/* Order ID */}
            <View style={styles.orderIdSection}>
              <Text style={styles.orderId}>#{transfer.id}</Text>
            </View>

            {/* Progress Bar */}
            {renderProgressBar()}

            {/* Origin and Destination */}
            <View style={styles.locationSection}>
              <View style={styles.locationItem}>
                <Text style={styles.locationLabel}>Origin</Text>
                <Text style={styles.locationText}>{transfer.origin}</Text>
                <Text style={styles.locationDate}>{transfer.date}</Text>
              </View>
              <View style={styles.locationItem}>
                <Text style={styles.locationLabel}>Destination</Text>
                <Text style={styles.locationText}>{transfer.destination}</Text>
                <Text style={styles.locationDate}>{transfer.date}</Text>
              </View>
            </View>
          </View>

          {/* Items Section */}
          <View style={styles.itemsSection}>
            <Text style={styles.itemsSectionTitle}>Items In Shipping</Text>
            {transfer.items.map(renderItemCard)}
          </View>
        </ScrollView>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F5FA',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 10,
  },
  // Tracking Card Styles
  trackingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    shadowColor: '#000',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  orderIdSection: {
    marginBottom: 10,
  },
  orderId: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  // Progress Bar Styles
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    position: 'relative',
  },
  progressStep: {
    alignItems: 'center',
    flex: 1,
    position: 'relative',
  },
  stepIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  stepIconCompleted: {
    backgroundColor: '#16C47F',
  },
  stepIconCurrent: {
    backgroundColor: '#16C47F',
  },
  stepIconNext: {
    backgroundColor: '#F0F0F0',
  },
  stepLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#8F939E',
    textAlign: 'center',
  },
  stepLabelCompleted: {
    color: '#16C47F',
  },
  stepLabelCurrent: {
    color: '#16C47F',
  },
  stepLabelNext: {
    color: '#8F939E',
  },
  statusTag: {
    backgroundColor: '#16C47F',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 4,
  },
  statusTagText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
  },
  connectionLine: {
    position: 'absolute',
    top: 20,
    left: '50%',
    width: '100%',
    height: 2,
    backgroundColor: '#F0F0F0',
    zIndex: -1,
  },
  connectionLineCompleted: {
    backgroundColor: '#16C47F',
  },
  connectionLineNext: {
    backgroundColor: '#F0F0F0',
  },
  // Location Section Styles
  locationSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  locationItem: {
    flex: 1,
    alignItems: 'center',
  },
  locationLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#8F939E',
    marginBottom: 4,
  },
  locationText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 2,
  },
  locationDate: {
    fontSize: 12,
    color: '#8F939E',
  },
  // Items Section Styles
  itemsSection: {
    marginBottom: 20,
  },
  itemsSectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 12,
  },
  itemCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  itemImagePlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  itemId: {
    fontSize: 12,
    color: '#8F939E',
  },
  itemPriceSection: {
    alignItems: 'flex-end',
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  itemQuantity: {
    fontSize: 12,
    color: '#8F939E',
  },
});

export default TransferDetails;
