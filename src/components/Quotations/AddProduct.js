import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Colors from '../../utils/Colors';
import AddProductModal from '../Sales-purchaseInvoice/ProductModal';
import DeleteConfirmationModal from '../common/DeleteConfirmationModal';
import QuotationStyles from './css/QuotationStyles';

const AddProductSection = ({
  stockButtonText = 'Add Quote Items ＋',
  modalHeaderText = 'Add Quote Items',
  products,
  setProducts,
}) => {
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProductIndex, setEditingProductIndex] = useState(null);
  const [localStocks, setLocalStocks] = useState([]);
  const [showDeleteProductModal, setShowDeleteProductModal] = useState(false);
  const [itemToDeleteIndex, setItemToDeleteIndex] = useState(null);
  
  // Use products from props if provided, otherwise use local state
  const stocks = products !== undefined ? products : localStocks;
  const setStocks = setProducts || setLocalStocks;

  const handleProductModalClose = () => {
    setShowProductModal(false);
    setEditingProductIndex(null);
  };

  const handleProductSave = (productData, editIndex) => {
    if (editIndex !== null && editIndex !== undefined) {
      // Update existing item
      setStocks(prev =>
        prev.map((item, index) => (index === editIndex ? productData : item)),
      );
      setEditingProductIndex(null);
    } else {
      // Add new item
      setStocks(prev => [...prev, productData]);
    }
  };

  const handleEditProduct = (index, item) => {
    setEditingProductIndex(index);
    setShowProductModal(true);
  };

  const handleDeleteProduct = index => {
    setItemToDeleteIndex(index);
    setShowDeleteProductModal(true);
  };

  const confirmDeleteProduct = () => {
    if (itemToDeleteIndex !== null) {
      setStocks(prev => prev.filter((_, i) => i !== itemToDeleteIndex));
    }
    setShowDeleteProductModal(false);
    setItemToDeleteIndex(null);
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
                    <TouchableOpacity
                      onPress={() => handleEditProduct(index, item)}
                      style={styles.iconButton}>
                      <Icon name="create-outline" size={20} color="#07624C" />
                    </TouchableOpacity>
                  </View>
                  <View style={styles.textWithIconRow}>
                    <View style={styles.textWithIcon}>
                      <Icon
                        name="home"
                        size={18}
                        color="#6F7C97"
                        style={styles.icon}
                      />
                      <Text style={styles.boldText}>{item.logisticsCenter}</Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => handleDeleteProduct(index)}
                      style={styles.iconButton}>
                      <Icon name="trash-outline" size={20} color="#FF3B30" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
            <View style={styles.detailsRow}>
              <View style={styles.detailItem}>
                <Text style={styles.labelText}>Qty</Text>
                <Text style={styles.valueText}>{item.qty}</Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.labelText}>Discounts</Text>
                <Text style={styles.valueText}>{item.discount}</Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.labelText}>Tax</Text>
                <Text style={styles.valueText}>{item.tax}</Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.labelText}>Unit Price</Text>
                <Text style={styles.valueText}>{item.unitPrice}</Text>
              </View>
            </View>
          </View>
        ))}


        <TouchableOpacity
          style={styles.innerCard}
          onPress={() => {
            setShowProductModal(true);
          }}>
          <Text style={styles.cardText}>{stockButtonText}</Text>
        </TouchableOpacity>
    

      <AddProductModal
        visible={showProductModal}
        onClose={handleProductModalClose}
        showBarcodeAbove={false}
        showBarcodeBelow={false}
        header={editingProductIndex !== null ? modalHeaderText.replace('Add', 'Edit') : modalHeaderText}
        onSave={handleProductSave}
        editingItem={editingProductIndex !== null ? stocks[editingProductIndex] : null}
        editingIndex={editingProductIndex}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        visible={showDeleteProductModal}
        onClose={() => {
          setShowDeleteProductModal(false);
          setItemToDeleteIndex(null);
        }}
        onConfirm={confirmDeleteProduct}
        title="Delete Product"
        message="Are you sure you want to delete this product?"
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
    marginBottom: 8,
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
  iconButton: {
    padding: 0,
    marginLeft: 8,
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

export default AddProductSection;
