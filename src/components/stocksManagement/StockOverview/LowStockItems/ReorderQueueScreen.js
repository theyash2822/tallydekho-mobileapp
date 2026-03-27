import React, {useState, useCallback, useMemo, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Feather from 'react-native-vector-icons/Feather';
import Header from '../../../common/Header';
import Colors from '../../../../utils/Colors';
import {CustomBottomButton} from '../../../common';
import {Checkbox} from '../../../Helper/HelperComponents';
import FormField from '../../../common/FormField';

const ReorderQueueScreen = () => {
  const navigation = useNavigation();
  const [selectedItems, setSelectedItems] = useState(new Set(['1'])); // First item selected by default

  // Dummy data for reorder queue items
  const reorderItems = [
    {
      id: '1',
      name: 'Black JBL',
      productId: 'PRD-1002-ABC',
      onHand: '1392',
      suggestedQty: '2000',
      reorderPoint: 'DN-00045',
    },
    {
      id: '2',
      name: 'Red JBL',
      productId: 'PRD-1002-XYZ',
      onHand: '856',
      suggestedQty: '1500',
      reorderPoint: 'DN-00046',
    },
    {
      id: '3',
      name: 'White JBL',
      productId: 'PRD-1003-XYZ',
      onHand: '432',
      suggestedQty: '1000',
      reorderPoint: 'DN-00047',
    },
  ];

  // State for editable input values - start with empty values
  const [inputValues, setInputValues] = useState({});
  const inputRefs = useRef({});

  const toggleItemSelection = useCallback(itemId => {
    setSelectedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  }, []);

  const handleInputChange = useCallback((itemId, field, value) => {
    setInputValues(prev => ({
      ...prev,
      [itemId]: {
        ...prev[itemId],
        [field]: value,
      },
    }));
  }, []);

  const handleNewPurchaseOrder = useCallback(() => {
    const selectedItemIds = Array.from(selectedItems);
    
    if (selectedItemIds.length === 0) {
      alert('Please select at least one item to create a purchase order');
      return;
    }

    // Map selected items to purchase order format
    const purchaseOrderItems = selectedItemIds.map(id => {
      const originalItem = reorderItems.find(item => item.id === id);
      const inputData = inputValues[id] || {};
      
      return {
        productName: originalItem.name,
        productId: originalItem.productId,
        qty: inputData.suggestedQty || originalItem.suggestedQty || '0',
        onHand: inputData.onHand || originalItem.onHand || '0',
        reorderPoint: inputData.reorderPoint || originalItem.reorderPoint || '',
        // Default values for fields not in reorder queue
        logisticsCenter: '', // Will be filled by user in purchase order
        discount: '0',
        tax: '0',
        unitPrice: '0',
      };
    });

    // Navigate to purchase orders screen with pre-filled data
    navigation.navigate('purchaseOrders', {
      initialProducts: purchaseOrderItems,
    });
  }, [selectedItems, inputValues, reorderItems, navigation]);

  const renderReorderItem = useCallback(
    ({item}) => {
      const isSelected = selectedItems.has(item.id);
      const currentInputValues = inputValues[item.id] || {
        onHand: '',
        suggestedQty: '',
        reorderPoint: '',
      };

      return (
        <View style={styles.itemCard}>
          {/* Product Header */}
          <View style={styles.productHeaderContainer}>
            <View style={styles.productHeader}>
              <View style={styles.itemIcon}>
                <Feather name="box" size={20} color="#16C47F" />
              </View>

              <View style={styles.productInfo}>
                <Text style={styles.productName}>{item.name}</Text>
                <Text style={styles.productId}>{item.productId}</Text>
              </View>
            </View>
          </View>

          {/* Quantity and Reorder Information */}
          <View style={styles.infoSection}>
            <View style={styles.infoRow}>
              <FormField
                label="On-Hand"
                style={styles.infoColumn}
                labelStyle={styles.infoLabel}
                inputStyle={styles.infoInput}
                inputRef={ref => { inputRefs.current[`${item.id}_onHand`] = ref; }}
                value={currentInputValues.onHand}
                onChangeText={value => handleInputChange(item.id, 'onHand', value)}
                keyboardType="numeric"
                placeholder={item.onHand}
                returnKeyType="next"
                onSubmitEditing={() => {
                  inputRefs.current[`${item.id}_suggestedQty`]?.focus();
                }}
              />
              <FormField
                label="Suggested Qty *All"
                style={styles.infoColumn}
                labelStyle={styles.infoLabel}
                inputStyle={styles.infoInput}
                inputRef={ref => { inputRefs.current[`${item.id}_suggestedQty`] = ref; }}
                value={currentInputValues.suggestedQty}
                onChangeText={value => handleInputChange(item.id, 'suggestedQty', value)}
                keyboardType="numeric"
                placeholder={item.suggestedQty}
                returnKeyType="next"
                onSubmitEditing={() => {
                  inputRefs.current[`${item.id}_reorderPoint`]?.focus();
                }}
              />
            </View>

            <View style={styles.infoRow}>
              <FormField
                label="Reorder Point"
                style={styles.infoColumn}
                labelStyle={styles.infoLabel}
                inputStyle={styles.infoInput}
                inputRef={ref => { inputRefs.current[`${item.id}_reorderPoint`] = ref; }}
                value={currentInputValues.reorderPoint}
                onChangeText={value => handleInputChange(item.id, 'reorderPoint', value)}
                placeholder={item.reorderPoint}
                returnKeyType="done"
              />
              <View style={styles.infoColumn} />
            </View>
          </View>

          {/* Action Checkbox */}
          <Checkbox
            checked={isSelected}
            onPress={() => toggleItemSelection(item.id)}
            label="Add to PO Basket"
            style={{marginBottom: 0 }}
            labelStyle={{fontSize: 14, color: '#8F939E'}}
          />
        </View>
      );
    },
    [selectedItems, inputValues, toggleItemSelection, handleInputChange],
  );

  return (
    <>
      <View style={styles.container}>
        {/* Custom Header */}
        <Header
          title="Reorder Queue"
          leftIcon="chevron-left"
          onLeftPress={() => navigation.goBack()}
        />

        {/* Reorder Items List */}
        <FlatList
          data={reorderItems}
          renderItem={renderReorderItem}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
          removeClippedSubviews={false}
        />
      </View>
      <CustomBottomButton
        buttonText="New Purchase order"
        onPress={handleNewPurchaseOrder}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundColorPrimary,
  },
  listContainer: {
    paddingHorizontal: 10,
    paddingTop: 12,
  },
  itemCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  productHeaderContainer: {
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  productHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#16C47F',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  productId: {
    fontSize: 14,
    color: '#666',
  },
  infoSection: {
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  infoColumn: {
    flex: 0.48,
  },
  infoLabel: {
    fontSize: 12,
    fontWeight: '400',
    color: '#8F939E',
    marginBottom: 6,
  },
  infoInput: {
    backgroundColor: '#fff',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 14,
    color: '#333',
    borderWidth: 1,
    borderColor: Colors.border,
    minHeight: 36,
  },
});

export default ReorderQueueScreen;
