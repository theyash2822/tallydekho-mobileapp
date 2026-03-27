import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import Colors from '../../utils/Colors';
import Icon from 'react-native-vector-icons/Ionicons';
import AddLogisticModal from '../Sales-purchaseInvoice/LogisticModal';
import DeleteConfirmationModal from '../common/DeleteConfirmationModal';

const AddLogisticsSection = ({
  logisticsHeading = 'Logistics/Shipping',
  logisticsButtonText = 'Add Logistics ＋',
  logistics,
  setLogistics,
}) => {
  const [showVendorModal, setShowVendorModal] = useState(false);
  const [editingLogisticIndex, setEditingLogisticIndex] = useState(null);
  const [localLogistics, setLocalLogistics] = useState([]);
  const [showDeleteLogisticModal, setShowDeleteLogisticModal] = useState(false);
  const [itemToDeleteIndex, setItemToDeleteIndex] = useState(null);
  
  // Use logistics from props if provided, otherwise use local state
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

  const handleEditLogistic = (index, item) => {
    setEditingLogisticIndex(index);
    setShowVendorModal(true);
  };

  const handleDeleteLogistic = index => {
    setItemToDeleteIndex(index);
    setShowDeleteLogisticModal(true);
  };

  const confirmDeleteLogistic = () => {
    if (itemToDeleteIndex !== null) {
      setLogisticsList(prev => prev.filter((_, i) => i !== itemToDeleteIndex));
    }
    setShowDeleteLogisticModal(false);
    setItemToDeleteIndex(null);
  };

  return (
    <View style={styles.container}>
      {/* Logistics Section */}
      <View style={[styles.cardContainer, {marginTop: 10}]}>
        <Text style={styles.heading}>{logisticsHeading}</Text>

        {logisticsList.map((item, index) => (
          <View key={index} style={styles.logisticsCard}>
            <View style={styles.logisticsHeader}>
              <View style={styles.row}>
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

      <AddLogisticModal
        visible={showVendorModal}
        onClose={handleLogisticsModalClose}
        onSave={handleLogisticsSave}
        editingItem={editingLogisticIndex !== null ? logisticsList[editingLogisticIndex] : null}
        editingIndex={editingLogisticIndex}
        header={editingLogisticIndex !== null ? 'Edit Logistic' : 'Add Logistic'}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        visible={showDeleteLogisticModal}
        onClose={() => {
          setShowDeleteLogisticModal(false);
          setItemToDeleteIndex(null);
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
    marginTop: 1,
  },
  cardContainer: {
    backgroundColor: Colors.white,
    borderRadius: 10,
    padding: 12,
    // borderWidth: 1,
    // borderColor: Colors.border,
  },
  heading: {
    fontWeight: '600',
    fontSize: 16,
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    margin: 8,
    marginLeft: 20,
    paddingVertical: 6,
  },
  icon: {
    marginRight: 12,
  },
  boldText: {
    fontWeight: '600',
    fontSize: 14,
  },
  logisticsCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 10,
  },
  logisticsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logisticsActionIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconButton: {
    padding: 0,
  },
  logisticsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  detailItem: {
    flex: 1,
    alignItems: 'flex-start',
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
  remarks: {
    marginTop: 4,
    fontSize: 13,
    color: '#8F939E',
    marginLeft: 12,
    paddingBottom: 20,
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

export default AddLogisticsSection;
