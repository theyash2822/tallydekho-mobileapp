import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import CustomAnimatedModal from './CustomAnimatedModal';
import Colors from '../../utils/Colors';

const DeleteConfirmationModal = ({
  visible,
  onClose,
  onConfirm,
  title = 'Delete Item',
  message = 'Are you sure you want to delete this item?',
}) => {
  return (
    <CustomAnimatedModal
      visible={visible}
      onClose={onClose}
      showCloseButton={false}
      statusBarTranslucent={true}>
      <View style={styles.deleteModalContainer}>
        {/* Icon */}
        <View style={styles.deleteIconContainer}>
          <Icon name="trash-outline" size={28} color="#EF4444" />
        </View>

        {/* Title */}
        <Text style={styles.deleteModalTitle}>{title}</Text>

        {/* Message */}
        <Text style={styles.deleteModalMessage}>{message}</Text>

        {/* Action Buttons */}
        <View style={styles.deleteButtonContainer}>
          <TouchableOpacity
            style={styles.deleteConfirmButton}
            onPress={onConfirm}
            activeOpacity={0.8}>
            <Text style={styles.deleteConfirmButtonText}>Delete</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.deleteCancelButton}
            onPress={onClose}
            activeOpacity={0.8}>
            <Text style={styles.deleteCancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </CustomAnimatedModal>
  );
};

const styles = StyleSheet.create({
  deleteModalContainer: {
    borderRadius: 16,
    width: '100%',
  },
  deleteIconContainer: {
    // backgroundColor: '#FEE2E2',
    borderRadius: 24,
    padding: 12,
    alignSelf: 'center',
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteModalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
    textAlign: 'center',
  },
  deleteModalMessage: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 20,
  },
  deleteButtonContainer: {
    flexDirection: 'column',
    gap: 12,
  },
  deleteConfirmButton: {
    width: '100%',
    backgroundColor: '#EF4444',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  deleteConfirmButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  deleteCancelButton: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  deleteCancelButtonText: {
    color: '#374151',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default DeleteConfirmationModal;
