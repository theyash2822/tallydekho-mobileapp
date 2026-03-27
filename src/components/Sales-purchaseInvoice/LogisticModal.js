import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Colors from '../../utils/Colors';
import CustomAnimatedModal from '../common/CustomAnimatedModal';
import InvoicesModalStyles from '../../utils/InvoicesModalStyles';
import { useInputNavigation } from '../stocksManagement/StockOverview/TotalStock/Components/inputNavigation';
import { Icons } from '../../utils/Icons';

const logisticTypes = ['Courier', 'Transport', 'Freight', 'Custom'];
const taxOptions = [
  'Single Tax Rate',
  'Applied to All Logistics Entries',
  'Excluded from Logistics',
  'Included in Total Amount',
];

const AddLogisticModal = ({ 
  visible, 
  onClose, 
  onSave,
  editingItem = null,
  editingIndex = null,
  header = 'Add Logistic',
}) => {
  // Keyboard state
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const scrollViewRef = useRef(null);

  const [selectedLogisticType, setSelectedLogisticType] = useState('Purchase');
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [amount, setAmount] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [remarks, setRemarks] = useState('');
  const [selectedTax, setSelectedTax] = useState('');
  const [showTaxDropdown, setShowTaxDropdown] = useState(false);

  // Field names in order (text inputs only)
  const fieldNames = ['amount', 'trackingNumber', 'remarks'];

  // Use input navigation hook
  const {
    getInputRef,
    getContainerRef,
    handleInputFocus,
    handleContainerLayout,
    clearInputRefs,
    getKeyboardType,
    handleSubmitEditing,
  } = useInputNavigation(fieldNames.length, scrollViewRef);

  // Populate fields when editing
  useEffect(() => {
    if (visible && editingItem) {
      setSelectedLogisticType(editingItem.logisticsCenter || 'Purchase');
      setAmount(editingItem.amount || '');
      setTrackingNumber(editingItem.trackingNo || '');
      setSelectedTax(editingItem.taxRate || '');
      setRemarks(editingItem.remarks || '');
    } else if (!visible) {
      // Reset form when modal closes
      setAmount('');
      setTrackingNumber('');
      setRemarks('');
      setSelectedLogisticType('Purchase');
      setSelectedTax('');
    }
  }, [editingItem, visible]);

  // Keyboard event listeners
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setIsKeyboardVisible(true);
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setIsKeyboardVisible(false);
      },
    );

    return () => {
      keyboardDidHideListener?.remove();
      keyboardDidShowListener?.remove();
    };
  }, []);

  const handleSave = () => {
    const logisticsData = {
      logisticsCenter: selectedLogisticType,
      amount,
      trackingNo: trackingNumber,
      taxRate: selectedTax,
      remarks,
    };

    if (onSave) {
      onSave(logisticsData, editingIndex);
    }

    // Reset form
    setAmount('');
    setTrackingNumber('');
    setRemarks('');
    setSelectedLogisticType('Purchase');
    setSelectedTax('');
    onClose();
  };

  return (
    <CustomAnimatedModal
      visible={visible}
      onClose={onClose}
      title={header}
      scrollable={false}
      maxHeight={isKeyboardVisible ? '90%' : (showTaxDropdown ? '87%' : '79%')}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
        style={{}}>
        <Text style={InvoicesModalStyles.subtext}>
          Fill The Form For Information
        </Text>

        <ScrollView
          ref={scrollViewRef}
          style={[InvoicesModalStyles.content, { marginTop: 4 }]}
          contentContainerStyle={[
            InvoicesModalStyles.scrollContent,
            isKeyboardVisible && styles.keyboardPadding,
          ]}
          showsVerticalScrollIndicator={false}
          keyboardDismissMode="interactive"
          keyboardShouldPersistTaps="handled"
          nestedScrollEnabled={true}>
          {/* Logistics Type */}
          <Text style={InvoicesModalStyles.label}>Logistics Type</Text>
          <TouchableOpacity
            style={InvoicesModalStyles.dropdownInput}
            onPress={() => setShowTypeDropdown(!showTypeDropdown)}>
            <Text style={styles.dropdownTriggerText}>
              {selectedLogisticType}
            </Text>
            <Icon name="chevron-down" size={20} color="#6f7c97" />
          </TouchableOpacity>
          {showTypeDropdown && (
            <View style={InvoicesModalStyles.dropdownList}>
              {logisticTypes.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={InvoicesModalStyles.dropdownItem}
                  onPress={() => {
                    setSelectedLogisticType(item);
                    setShowTypeDropdown(false);
                  }}>
                  {/* <Icon
                    name="cube-outline"
                    size={18}
                    color="#333"
                    style={{ marginRight: 10 }}
                  /> */}
                  <Icons.Truck height={18} width={18} style={{marginRight:10}}/>
                  <Text style={InvoicesModalStyles.dropdownText}>{item}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Amount and Tracking */}
          <View style={InvoicesModalStyles.row}>
            <View
              style={{ flex: 1 }}
              ref={getContainerRef(0)}
              onLayout={e => handleContainerLayout(0, e)}>
              <Text style={InvoicesModalStyles.label}>Amount</Text>
              <TextInput
                ref={getInputRef(0)}
                style={InvoicesModalStyles.input}
                placeholder="122"
                placeholderTextColor="#8F939E"
                value={amount}
                keyboardType={getKeyboardType('numeric')}
                onChangeText={setAmount}
                returnKeyType="next"
                blurOnSubmit={false}
                onSubmitEditing={() => {
                  const nextRef = getInputRef(1);
                  if (nextRef?.current) {
                    setTimeout(() => {
                      nextRef.current?.focus();
                    }, 50);
                  }
                }}
                onFocus={() => handleInputFocus(0)}
              />
            </View>
            <View
              style={{ flex: 1 }}
              ref={getContainerRef(1)}
              onLayout={e => handleContainerLayout(1, e)}>
              <Text style={InvoicesModalStyles.label}>
                Tracking Number{' '}
              </Text>
              <TextInput
                ref={getInputRef(1)}
                style={InvoicesModalStyles.input}
                placeholder="108643216874"
                keyboardType={getKeyboardType('numeric')}
                placeholderTextColor="#8F939E"
                value={trackingNumber}
                onChangeText={setTrackingNumber}
                returnKeyType="next"
                blurOnSubmit={false}
                onSubmitEditing={() => {
                  const nextRef = getInputRef(2);
                  if (nextRef?.current) {
                    setTimeout(() => {
                      nextRef.current?.focus();
                    }, 50);
                  }
                }}
                onFocus={() => handleInputFocus(1)}
              />
            </View>
          </View>

          {/* Remarks */}
          <View
            ref={getContainerRef(2)}
            onLayout={e => handleContainerLayout(2, e)}>
            <Text style={InvoicesModalStyles.label}>
              Remarks{' '}
            </Text>
            <TextInput
              ref={getInputRef(2)}
              style={InvoicesModalStyles.input}
              placeholder="-"
              placeholderTextColor="#8F939E"
              value={remarks}
              returnKeyType="done"
              blurOnSubmit={true}
              onSubmitEditing={() => Keyboard.dismiss()}
              onChangeText={setRemarks}
              onFocus={() => handleInputFocus(2)}
            />
          </View>

          <Text style={InvoicesModalStyles.label}>Tax on Logistics</Text>
          <TouchableOpacity
            style={InvoicesModalStyles.dropdownInput}
            onPress={() => setShowTaxDropdown(!showTaxDropdown)}>
            <Text style={InvoicesModalStyles.dropdownText}>
              {selectedTax || 'Applied to All Logistics Entries'}
            </Text>
            <Icon name="chevron-down" size={20} color="#6f7c97" />
          </TouchableOpacity>

          {showTaxDropdown && (
            <View style={InvoicesModalStyles.dropdownList}>
              {taxOptions.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={[InvoicesModalStyles.dropdownItem, { paddingLeft: 12 }]}
                  onPress={() => {
                    setSelectedTax(item);
                    setShowTaxDropdown(false);
                  }}>
                  <Text style={InvoicesModalStyles.dropdownText}>{item}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
          <View style={styles.bottomSpacer} />
        </ScrollView>
        <View style={[styles.buttonsRow, isKeyboardVisible && styles.buttonsWithKeyboard]}>
          <TouchableOpacity
            style={styles.primaryButton}
            activeOpacity={0.85}
            onPress={() => {
              Keyboard.dismiss();
              setTimeout(() => handleSave(), 100);
            }}>
            <Text style={styles.primaryText}>
              {editingItem ? 'Update' : 'Save & Use'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.secondaryButton,
              Platform.OS === 'ios' && { marginBottom: 16 },
            ]}
            activeOpacity={0.85}
            onPress={onClose}
          >
            <Text style={styles.secondaryText}>
              {editingItem ? 'Cancel' : 'Save'}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </CustomAnimatedModal>
  );
};

const styles = StyleSheet.create({
  dropdownTriggerText: {
    fontSize: 14,
    color: '#8F939E', 
  },
  buttonsRow: {
    flexDirection: 'column',
    gap: 12,
    marginTop: 12,
  },
  primaryButton: {
    backgroundColor: '#07624C',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  secondaryButton: {
    backgroundColor: '#fff',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  primaryText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryText: {
    color: '#041B29',
    fontSize: 16,
    fontWeight: '600',
  },
  keyboardPadding: {
    paddingBottom: Platform.OS === 'ios' ? 220 : 1,
  },
  bottomSpacer: {
    height: 1,
  },
  buttonsWithKeyboard: {
    marginBottom: 4,
  },
});

export default AddLogisticModal;

