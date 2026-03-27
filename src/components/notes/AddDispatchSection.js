import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Colors from '../../utils/Colors';
import AddDispatchModal from './AddDispatchModal';
import DeleteConfirmationModal from '../common/DeleteConfirmationModal';

const AddDispatchSection = ({
  stockButtonText = 'Add Dispatch Items ＋',
  dispatchItems,
  setDispatchItems,
}) => {
  const [showDispatchModal, setShowDispatchModal] = useState(false);
  const [editingDispatchIndex, setEditingDispatchIndex] = useState(null);
  const [localStocks, setLocalStocks] = useState([]);
  const [showDeleteDispatchModal, setShowDeleteDispatchModal] = useState(false);
  const [itemToDeleteIndex, setItemToDeleteIndex] = useState(null);
  
  // Use props if provided, otherwise use local state
  const stocks = dispatchItems !== undefined ? dispatchItems : localStocks;
  const setStocks = setDispatchItems || setLocalStocks;

  const handleDispatchModalClose = () => {
    setShowDispatchModal(false);
    setEditingDispatchIndex(null);
  };

  const handleDispatchSave = (dispatchData, editIndex) => {
    if (editIndex !== null && editIndex !== undefined) {
      // Update existing item
      setStocks(prev =>
        prev.map((item, index) => (index === editIndex ? dispatchData : item)),
      );
      setEditingDispatchIndex(null);
    } else {
      // Add new item
      setStocks(prev => [...prev, dispatchData]);
    }
  };

  const handleEditDispatch = (index, item) => {
    setEditingDispatchIndex(index);
    setShowDispatchModal(true);
  };

  const handleDeleteDispatch = index => {
    setItemToDeleteIndex(index);
    setShowDeleteDispatchModal(true);
  };

  const confirmDeleteDispatch = () => {
    if (itemToDeleteIndex !== null) {
      setStocks(prev => prev.filter((_, i) => i !== itemToDeleteIndex));
    }
    setShowDeleteDispatchModal(false);
    setItemToDeleteIndex(null);
  };

  const getFormattedAmount = (qty, unitPrice) => {
    const quantity = parseFloat(qty);
    const price = parseFloat(unitPrice);
    if (isNaN(quantity) || isNaN(price)) return '0';
    return (quantity * price).toFixed(0);
  };

  return (
    <View style={styles.container}>
      {/* Stocks Section */}
     
        {stocks.map((item, index) => (
          <View key={index} style={styles.stockCard}>
            <View style={styles.productInfoContainer}>
              <View style={styles.productInfoRow}>
                <View style={styles.productInfoLeft}>
                  <View style={styles.textWithIconRow}>
                    <View style={styles.textWithIcon}>
                      <Icon
                        name="person"
                        size={18}
                        color="#6F7C97"
                        style={styles.icon}
                      />
                      <Text style={styles.boldText}>{item.productName}</Text>
                    </View>
                    <View style={styles.actionIcons}>
                      <TouchableOpacity
                        onPress={() => handleEditDispatch(index, item)}
                        style={styles.iconButton}>
                        <Icon name="create-outline" size={20} color="#07624C" />
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => handleDeleteDispatch(index)}
                        style={styles.iconButton}>
                        <Icon name="trash-outline" size={20} color="#FF3B30" />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
            </View>
            <View style={styles.detailsRow}>
              <View style={styles.detailItem}>
                <Text style={styles.labelText}>Unit Price</Text>
                <Text style={styles.valueText}>{item.unitPrice}</Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.labelText}>Qty</Text>
                <Text style={styles.valueText}>{item.quantity}</Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.labelText}>Amount</Text>
                <Text style={styles.valueText}>
                  {getFormattedAmount(item.quantity, item.unitPrice)}
                </Text>
              </View>
            </View>
          </View>
        ))}

        <TouchableOpacity
          style={styles.innerCard}
          onPress={() => {
            setShowDispatchModal(true);
          }}>
          <Text style={styles.cardText}>{stockButtonText}</Text>
        </TouchableOpacity>
     

      <AddDispatchModal
        visible={showDispatchModal}
        onClose={handleDispatchModalClose}
        onSave={handleDispatchSave}
        editingItem={editingDispatchIndex !== null ? stocks[editingDispatchIndex] : null}
        editingIndex={editingDispatchIndex}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        visible={showDeleteDispatchModal}
        onClose={() => {
          setShowDeleteDispatchModal(false);
          setItemToDeleteIndex(null);
        }}
        onConfirm={confirmDeleteDispatch}
        title="Delete Dispatch Item"
        message="Are you sure you want to delete this dispatch item?"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
  },
  cardContainer: {
    backgroundColor: Colors.white,
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  heading: {
    fontWeight: '600',
    fontSize: 16,
    marginBottom: 12,
  },
  stockCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 10,
  },
  productInfoContainer: {
    marginBottom: 0,
  },
  productInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    margin: 8,
    marginLeft: 20,
    paddingVertical: 6,
  },
  productInfoLeft: {
    flex: 1,
  },
  textWithIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  textWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  icon: {
    marginRight: 12,
  },
  boldText: {
    fontWeight: '600',
    fontSize: 14,
  },
  actionIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginLeft: 8,
  },
  iconButton: {
    padding: 0,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  detailItem: {
    alignItems: 'center',
    marginHorizontal: 5,
  },
  labelText: {
    fontSize: 12,
    color: '#8F939E',
    fontWeight: '400',
    marginBottom: 4,
  },
  valueText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#494D58',
  },
  innerCard: {
    backgroundColor: '#f4f6fa',
    paddingVertical: 14,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cardText: {
    fontSize: 16,
    fontWeight: '500',
  },
});

export default AddDispatchSection;
