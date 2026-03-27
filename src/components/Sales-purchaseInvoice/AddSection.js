import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import Colors from '../../utils/Colors';
import AddProductModal from './ProductModal';
import AddLogisticModal from './LogisticModal';
import Icon from 'react-native-vector-icons/Ionicons';
import DeleteConfirmationModal from '../common/DeleteConfirmationModal';
 
const AddSection = ({
  stockHeading = 'Stocks/Product',
  logisticsHeading = 'Logistics/Shipping',
  stockButtonText = 'Add Stock ＋',
  logisticsButtonText = 'Add Logistics ＋',
  products,
  setProducts,
  logistics,
  setLogistics,
}) => {
  const [showProductModal, setShowProductModal] = useState(false);
  const [showVendorModal, setShowVendorModal] = useState(false);
  const [editingProductIndex, setEditingProductIndex] = useState(null);
  const [editingLogisticIndex, setEditingLogisticIndex] = useState(null);
  const [showDeleteProductModal, setShowDeleteProductModal] = useState(false);
  const [showDeleteLogisticModal, setShowDeleteLogisticModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState({type: null, index: null});
  
  // Use props if provided, otherwise use local state
  const [localStocks, setLocalStocks] = useState([]);
  const [localLogistics, setLocalLogistics] = useState([]);
  
  const stocks = products !== undefined ? products : localStocks;
  const setStocks = setProducts || setLocalStocks;
  const logisticsList = logistics !== undefined ? logistics : localLogistics;
  const setLogisticsList = setLogistics || setLocalLogistics;


  const handleLogisticsModalClose = () => {
    setShowVendorModal(false);
    setEditingLogisticIndex(null);
  };

  const handleLogisticsSave = (logisticsData, editIndex) => {
    if (editIndex !== null && editIndex !== undefined) {
      // Update existing item
      setLogisticsList(prev =>
        prev.map((item, index) => (index === editIndex ? logisticsData : item)),
      );
      setEditingLogisticIndex(null);
    } else {
      // Add new item
      setLogisticsList(prev => [...prev, logisticsData]);
    }
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

  const handleEditLogistic = (index, item) => {
    setEditingLogisticIndex(index);
    setShowVendorModal(true);
  };

  const handleProductModalClose = () => {
    setShowProductModal(false);
    setEditingProductIndex(null);
  };

  const handleDeleteProduct = index => {
    setItemToDelete({type: 'product', index});
    setShowDeleteProductModal(true);
  };

  const handleDeleteLogistic = index => {
    setItemToDelete({type: 'logistic', index});
    setShowDeleteLogisticModal(true);
  };

  const confirmDeleteProduct = () => {
    if (itemToDelete.type === 'product' && itemToDelete.index !== null) {
      setStocks(prev => prev.filter((_, i) => i !== itemToDelete.index));
    }
    setShowDeleteProductModal(false);
    setItemToDelete({type: null, index: null});
  };

  const confirmDeleteLogistic = () => {
    if (itemToDelete.type === 'logistic' && itemToDelete.index !== null) {
      setLogisticsList(prev => prev.filter((_, i) => i !== itemToDelete.index));
    }
    setShowDeleteLogisticModal(false);
    setItemToDelete({type: null, index: null});
  };
 
  const calculateSubtotal = () => {
    return stocks.reduce((total, item) => {
      const qty = parseFloat(item.qty?.replace(/[^\d.]/g, '') || 0);
      const unitPrice = parseFloat(item.unitPrice?.replace(/[^\d.]/g, '') || 0);
      const baseAmount = qty * unitPrice;

      // Calculate discount - matching Summary logic
      const discountStr = (item.discount ?? '').toString().trim();
      let discountAmount = 0;
      if (discountStr) {
        if (discountStr.includes('%')) {
          // Percentage: multiply qty * unitPrice, then apply percentage
          const discountPercent = parseFloat(discountStr.replace('%', '')) || 0;
          discountAmount = (discountPercent / 100) * baseAmount;
        } else {
          // Flat amount: use the value directly
          discountAmount = parseFloat(discountStr) || 0;
        }
      }

      // Calculate tax - matching Summary logic
      const taxStr = (item.tax ?? '').toString().trim();
      let taxAmount = 0;
      if (taxStr) {
        if (taxStr.includes('%')) {
          // Percentage: multiply qty * unitPrice, then apply percentage
          const taxPercent = parseFloat(taxStr.replace('%', '')) || 0;
          taxAmount = (taxPercent / 100) * baseAmount;
        } else {
          // Flat amount: use the value directly
          taxAmount = parseFloat(taxStr) || 0;
        }
      }

      // Final subtotal: baseAmount - discount + tax
      const subtotal = baseAmount - discountAmount + taxAmount;

      return total + subtotal;
    }, 0);
  };
 
  return (
    <View style={styles.container}>
      {/* Stocks Section */}
      <View style={styles.cardContainer}>
        <Text style={styles.heading}>
          {stockHeading}
          <Text style={styles.asterisk}>*</Text>
        </Text>
 
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
      </View>
 
      {/* Logistics Section */}
      <View style={[styles.cardContainer, {marginTop: 10}]}>
        <Text style={styles.heading}>{logisticsHeading}</Text>
 
        {logisticsList.map((item, index) => (
          <View key={index} style={styles.logisticsCard}>
            <View style={styles.logisticsHeader}>
              <View style={{flexDirection: 'row', margin: 8, marginLeft: 16}}>
                <Icon name="home" size={18} color="#6F7C97" style={styles.icon} />
                <Text style={styles.boldText}>{item.logisticsCenter}</Text>
              </View>
              <View style={styles.logisticsActionIcons}>
                <TouchableOpacity
                  onPress={() => handleEditLogistic(index, item)}
                  style={styles.iconButton}>
                  <Icon name="create-outline" size={20} color="#07624C" />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleDeleteLogistic(index)}
                  style={styles.iconButton}>
                  <Icon name="trash-outline" size={20} color="#FF3B30" />
                </TouchableOpacity>
              </View>
            </View>
 
            <View style={styles.logisticsRow}>
              <View style={[styles.detailItem, {marginLeft: 10}]}>
                <Text style={styles.labelText}>Amount</Text>
                <Text style={styles.valueText}>{item.amount}</Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.labelText}>Tracking No</Text>
                <Text style={styles.valueText}>{item.trackingNo}</Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.labelText}>Tax on Logistics</Text>
                <Text style={styles.valueText}>{item.taxRate}</Text>
              </View>
            </View>
 
            {item.remarks && item.remarks.trim() && (
              <View style={{paddingTop: 4, paddingLeft: 8}}>
                <Text style={styles.remarks}>Remarks: {item.remarks}</Text>
              </View>
            )}
          </View>
        ))}
 
        <TouchableOpacity
          style={styles.innerCard}
          onPress={() => {
            setShowVendorModal(true);
          }}>
          <Text style={styles.cardText}>{logisticsButtonText}</Text>
        </TouchableOpacity>
      </View>
 
      {/* Modals */}
      <AddProductModal
        visible={showProductModal}
        onClose={handleProductModalClose}
        showBarcodeBelow={true}
        showBarcodeAbove={false}
        onSave={handleProductSave}
        editingItem={editingProductIndex !== null ? stocks[editingProductIndex] : null}
        editingIndex={editingProductIndex}
        header={editingProductIndex !== null ? 'Edit Product' : 'Add Product'}
      />
      <AddLogisticModal
        visible={showVendorModal}
        onClose={handleLogisticsModalClose}
        onSave={handleLogisticsSave}
        editingItem={editingLogisticIndex !== null ? logisticsList[editingLogisticIndex] : null}
        editingIndex={editingLogisticIndex}
        header={editingLogisticIndex !== null ? 'Edit Logistic' : 'Add Logistic'}
      />

      {/* Delete Confirmation Modals */}
      <DeleteConfirmationModal
        visible={showDeleteProductModal}
        onClose={() => {
          setShowDeleteProductModal(false);
          setItemToDelete({type: null, index: null});
        }}
        onConfirm={confirmDeleteProduct}
        title="Delete Product"
        message="Are you sure you want to delete this product?"
      />

      <DeleteConfirmationModal
        visible={showDeleteLogisticModal}
        onClose={() => {
          setShowDeleteLogisticModal(false);
          setItemToDelete({type: null, index: null});
        }}
        onConfirm={confirmDeleteLogistic}
        title="Delete Logistic"
        message="Are you sure you want to delete this logistic?"
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
  asterisk: {
    color: '#FF3B30',
    fontSize: 16,
  },
  stockCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 10,
  },
  productInfoContainer: {
    padding: 8,
    paddingLeft: 16,
    paddingVertical: 10,
  },
  productInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
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
  iconButton: {
    padding: 0,
    marginLeft: 8,
  },
  boldText: {
    fontWeight: '600',
    fontSize: 14,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingVertical: 10,
    paddingHorizontal: 16,
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
    fontSize: 14,
    fontWeight: '500',
    color: '#494D58',
  },
  subtotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    backgroundColor: '#F7F9FC',
    marginBottom: 8,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  subtotalText: {
    fontSize: 14,
    fontWeight: '400',
    color: '#8F939E',
  },
  amountText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#16C47F',
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
  logisticsCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 10,
  },
  logisticsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingVertical: 10,
    paddingHorizontal: 8,
  },
  detailItem: {
    flex: 1,
    alignItems: 'flex-start',
  },
  logText: {
    fontSize: 13,
    textAlign: 'center',
    width: '33%',
  },
  remarks: {
    marginTop: 4,
    fontSize: 13,
    color: '#8F939E',
    marginLeft: 10,
    paddingBottom: 20,
  },
  logisticsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginRight: 12,
  },
  logisticsActionIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconButton: {
    padding: 0,
  },
});

export default AddSection;