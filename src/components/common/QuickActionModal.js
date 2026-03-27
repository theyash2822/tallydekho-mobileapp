import React, {useState, useCallback, useEffect} from 'react';
import {View, Text, TouchableOpacity, FlatList, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import {useNavigation} from '@react-navigation/native';
import {quickActions} from '../../utils/Constants';
import Colors from '../../utils/Colors';
import CustomAnimatedModal from './CustomAnimatedModal';

const QuickActionsModal = ({visible, onClose}) => {
  const navigation = useNavigation();
  const [expandedItem, setExpandedItem] = useState(null);
  const [selectedAction, setSelectedAction] = useState(null);

  // Reset state when modal closes
  useEffect(() => {
    if (!visible) {
      setExpandedItem(null);
      setSelectedAction(null);
    }
  }, [visible]);

  const handleDirectNavigation = routeName => {
    // reset states right away
    setExpandedItem(null);
    setSelectedAction(null);

    // close modal
    onClose();

    // navigate after animation
    setTimeout(() => {
      navigation.navigate(routeName);
    }, 300);
  };

  const navigationMap = {
    'Create Invoice': 'salesInvoice',
    'Create Quotation': 'quotation',
    'Create Sales Orders': 'salesOrders',
    'Create Delivery Note': 'deliveryNote',
    'Credit Note': 'creditNote',
    'Purchase Invoice': 'purchaseInvoice',
    'Purchase Order': 'purchaseOrders',
    'Debit Note': 'debitNote',
    'Payment Voucher': 'paymentVoucher',
    'Receipt Voucher': 'receiptVoucher',
    'Contra Voucher': 'contraVoucher',
    'Journal Voucher': 'journalVoucher',
    'Add Item': 'addItem',
    'Add Warehouse': 'addWarehouse',
  };

  const toggleExpand = useCallback((id) => {
    setExpandedItem(prev => prev === id ? null : id);
    setSelectedAction(prev => prev === id ? null : id);
  }, []);

  // const handleSubOptionPress = useCallback((sub) => {
  //   // Special handling for Stock Adjustment and Stock Transfer
  //   if (sub === 'Stock Adjustment') {
  //     setExpandedItem(null);
  //     setSelectedAction(null);
  //     onClose();
  //     setTimeout(() => {
  //       navigation.navigate('warehouseSelection', {action: 'adjustment'});
  //     }, 200);
  //     return;
  //   }

    const handleSubOptionPress = useCallback((sub) => {
    // Special handling for Stock Adjustment and Stock Transfer
    if (sub === 'Stock Adjustment') {
      setExpandedItem(null);
      setSelectedAction(null);
      onClose();
      setTimeout(() => {
        navigation.navigate('quickStockAccess');
      }, 200);
      return;
    }
    
    if (sub === 'Stock Transfer') {
      setExpandedItem(null);
      setSelectedAction(null);
      onClose();
      setTimeout(() => {
        navigation.navigate('stockTransfer');
      }, 200);
      return;
    }

    // Special handling for test - navigate to quick stock access
    // if (sub === 'test') {
    //   setExpandedItem(null);
    //   setSelectedAction(null);
    //   onClose();
    //   setTimeout(() => {
    //     navigation.navigate('quickStockAccess');
    //   }, 200);
    //   return;
    // }

    // Special handling for Ledger types
    if (sub === 'Sundry Creditors' || sub === 'Sundry Debtors' || sub === 'Duties & Taxes' || sub === 'Custom Groups') {
      setExpandedItem(null);
      setSelectedAction(null);
      onClose();
      setTimeout(() => {
        navigation.navigate('addLedger', {ledgerType: sub});
      }, 200);
      return;
    }

    const routeName = navigationMap[sub];
    if (routeName) {
      // Reset states first
      setExpandedItem(null);
      setSelectedAction(null);
      // Close modal
      onClose();
      // Navigate after a shorter delay
      setTimeout(() => {
        navigation.navigate(routeName);
      }, 200);
    }
  }, [navigation, onClose]);

  return (
    <CustomAnimatedModal
      visible={visible}
      onClose={onClose}
      title="Quick Actions"
      overlayColor="rgba(0, 0, 0, 0.2)"
      useSpring={false}
      animationDuration={200}>
      <FlatList
        data={quickActions}
        removeClippedSubviews={false}
        keyExtractor={item => item.id}
        keyboardShouldPersistTaps="handled"
        nestedScrollEnabled={true}
        scrollEnabled={true}
        renderItem={({item}) => (
          <>
            <View
              style={[
                modalStyles.actionContainer,
                selectedAction === item.id ? modalStyles.selectedAction : null,
              ]}>
              <TouchableOpacity
                style={modalStyles.actionItem}
                activeOpacity={0.7}
                onPress={() => {
                  toggleExpand(item.id);
                }}>
                <View
                  style={[
                    modalStyles.iconContainer,
                    {
                      backgroundColor: item.iconBg,
                      borderColor: item.iconBorderColor,
                    },
                  ]}>
                  <Icon name={item.icon} size={20} color="green" />
                </View>
                <Text style={modalStyles.actionText}>{item.name}</Text>
                <Icon
                  name={
                    expandedItem === item.id ? 'chevron-up' : 'chevron-down'
                  }
                  size={20}
                  color="#666"
                />
              </TouchableOpacity>
            </View>

            {expandedItem === item.id && (
              <View style={modalStyles.subOptionsContainer}>
                {item.subOptions.map((sub, index) => (
                  <TouchableOpacity
                    key={index}
                    style={modalStyles.subOptionItem}
                    activeOpacity={0.7}
                    onPress={() => handleSubOptionPress(sub)}>
                    <Text style={modalStyles.subOptionText}>{sub}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </>
        )}
      />
      <TouchableOpacity 
        style={modalStyles.closeButton} 
        activeOpacity={0.7}
        onPress={onClose}>
        <Icon name="x" size={24} color="#fff" />
      </TouchableOpacity>
    </CustomAnimatedModal>
  );
};

const modalStyles = StyleSheet.create({
  actionContainer: {
    backgroundColor: Colors.white,
    borderRadius: 10,
    marginVertical: 5,
    overflow: 'hidden',
  },
  selectedAction: {
    backgroundColor: '#C8E6C9',
    borderWidth: 1,
    borderColor: 'green',
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    borderWidth: 1,
  },
  actionText: {fontSize: 16, color: Colors.black, flex: 1},
  subOptionsContainer: {
    backgroundColor: Colors.white,
    marginBottom: 5,
    borderRadius: 10,
    overflow: 'hidden',
    paddingVertical: 5,
  },
  subOptionItem: {
    paddingVertical: 12,
    paddingHorizontal: 30,
    // marginLeft:30
  },
  subOptionText: {fontSize: 14, color: Colors.secondaryText},
  closeButton: {
    alignSelf: 'center',
    marginTop: 5,
    backgroundColor: '#07624C',
    borderWidth: 1,
    borderColor: '#00503D',
    padding: 10,
    borderRadius: 50,
  },
});

export default QuickActionsModal;
