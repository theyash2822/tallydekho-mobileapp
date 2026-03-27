import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import FormField from '../../../common/FormField';
import Icon from 'react-native-vector-icons/Feather';
import Colors from '../../../../utils/Colors';
import { CommonLabelStyles, CommonDropdownStyles } from '../../../../utils/CommonStyles';
import CustomAnimatedModal from '../../../common/CustomAnimatedModal';
import { useInputNavigation } from '../../../stocksManagement/StockOverview/TotalStock/Components/inputNavigation';
import { validateEmail, validatePhoneNumber } from '../../../../utils/Validations';

const states = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
];

const BuyCreditModal = ({
  visible,
  onClose,
  selectedCreditOption,
  onCreditOptionSelect,
  onBuyNow,
}) => {
  const [showStatesDropdown, setShowStatesDropdown] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [mobileError, setMobileError] = useState('');
  const initialFormData = {
    name: 'Party A',
    email: '',
    mobile: '',
    companyName: '',
    states: '',
    gstNumber: '',
    address: '',
  };
  const [formData, setFormData] = useState(initialFormData);

  const scrollViewRef = useRef(null);
  const fieldCount = 6; // Name, Email, Mobile, Company Name, GST Number, Address
  const {
    getInputRef,
    handleSubmitEditing,
  } = useInputNavigation(fieldCount, scrollViewRef);

  const creditOptionsData = [
    { id: '200', credits: 200, price: 199 },
    { id: '500', credits: 500, price: 449 },
    { id: '1000', credits: 1000, price: 849 },
  ];

  const updateFormData = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
    if (key === 'email') setEmailError('');
    if (key === 'mobile') setMobileError('');
  };

  const validateForm = () => {
    const e = validateEmail(formData.email);
    const m = validatePhoneNumber(formData.mobile);
    setEmailError(e);
    setMobileError(m);
    return !e && !m;
  };

  const handleStateSelect = state => {
    updateFormData('states', state);
    setShowStatesDropdown(false);
  };

  const handleClose = () => {
    setFormData(initialFormData);
    setEmailError('');
    setMobileError('');
    setShowStatesDropdown(false);
    onClose();
  };

  const handleBuyNow = () => {
    if (!validateForm()) return;
    onBuyNow?.();
    handleClose();
  };

  return (
    <CustomAnimatedModal
      visible={visible}
      onClose={handleClose}
      scrollable={true}
      showCloseButton={false}>
      {/* Custom Header with Subtitle */}
      <View style={styles.modalHeader}>
        <View style={{ flex: 1 }}>
          <Text style={styles.modalTitle}>Buy Credit</Text>
          <Text style={styles.modalSubtitle}>
            Add credit to your account.
          </Text>
        </View>
        <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
          <Icon name="x" size={24} color="#666" />
        </TouchableOpacity>
      </View>

      {/* Choose Credit Section */}
      <View style={styles.creditSection}>
        <Text style={styles.sectionTitle}>Choose a credit</Text>
        {creditOptionsData.map(option => (
          <TouchableOpacity
            key={option.id}
            style={[
              styles.creditOption,
              selectedCreditOption === option.id && styles.selectedCreditOption,
            ]}
            onPress={() => onCreditOptionSelect(option.id)}>
            <View
              style={[
                styles.radioButton,
                selectedCreditOption === option.id && styles.selectedRadioButton,
              ]}>
              {selectedCreditOption === option.id && (
                <View style={styles.radioButtonSelected} />
              )}
            </View>
            <View style={styles.creditOptionContent}>
              <Text style={styles.creditAmount}>{option.credits} Credits</Text>
              <Text style={styles.creditPrice}>₹{option.price}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Billing Details */}
      <View style={styles.billingSection}>
        <Text style={styles.sectionTitle}>Billing Details</Text>
        <FormField
          label="Name"
          inputRef={getInputRef(0)}
          style={styles.inputGroup}
          value={formData.name}
          onChangeText={text => updateFormData('name', text)}
          placeholder="Enter name"
          returnKeyType="next"
          blurOnSubmit={false}
          onSubmitEditing={() => handleSubmitEditing(0, 1, 'next')}
        />
        <View style={styles.rowContainer}>
          <FormField
            label="Email"
            error={emailError}
            inputRef={getInputRef(1)}
            style={[styles.inputGroup, styles.halfWidth]}
            value={formData.email}
            onChangeText={text => updateFormData('email', text)}
            placeholder="Enter email address"
            keyboardType="email-address"
            autoCapitalize="none"
            returnKeyType="next"
            blurOnSubmit={false}
            onSubmitEditing={() => handleSubmitEditing(1, 2, 'next')}
            onBlur={() => setEmailError(validateEmail(formData.email))}
          />
          <FormField
            label="Mobile number"
            error={mobileError}
            inputRef={getInputRef(2)}
            style={[styles.inputGroup, styles.halfWidth]}
            value={formData.mobile}
            onChangeText={text => updateFormData('mobile', text)}
            placeholder="Enter phone number"
            keyboardType="phone-pad"
            returnKeyType="next"
            blurOnSubmit={false}
            onSubmitEditing={() => handleSubmitEditing(2, 3, 'next')}
            onBlur={() => setMobileError(validatePhoneNumber(formData.mobile))}
          />
        </View>
        <FormField
          label="Company Name"
          inputRef={getInputRef(3)}
          style={styles.inputGroup}
          value={formData.companyName}
          onChangeText={text => updateFormData('companyName', text)}
          placeholder="Enter company name"
          returnKeyType="next"
          blurOnSubmit={false}
          onSubmitEditing={() => handleSubmitEditing(3, 4, 'next')}
        />
        <View style={styles.rowContainer}>
          <View style={[styles.inputGroup, styles.halfWidth]}>
            <Text style={styles.label}>States <Text style={styles.labelAsterisk}>*</Text></Text>
            <TouchableOpacity
              style={styles.dropdownInput}
              onPress={() => setShowStatesDropdown(!showStatesDropdown)}>
              <Text
                style={[styles.dropdownText, !formData.states && styles.placeholderText]}>
                {formData.states || 'States'}
              </Text>
              <Icon
                name={showStatesDropdown ? 'chevron-up' : 'chevron-down'}
                size={20}
                color="#8F939E"
              />
            </TouchableOpacity>
            {showStatesDropdown && (
              <View style={styles.dropdownOptions}>
                <ScrollView
                  style={styles.dropdownOptionsScroll}
                  contentContainerStyle={styles.dropdownOptionsContent}
                  showsVerticalScrollIndicator={true}
                  nestedScrollEnabled={true}
                  keyboardShouldPersistTaps="handled">
                  {states.map((state, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.dropdownOption,
                        formData.states === state && styles.selectedOption,
                      ]}
                      onPress={() => handleStateSelect(state)}>
                      <Text
                        style={[
                          styles.dropdownOptionText,
                          formData.states === state && styles.selectedOptionText,
                        ]}>
                        {state}
                      </Text>
                      {formData.states === state && (
                        <Icon name="check" size={16} color="#10B981" />
                      )}
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}
          </View>
          <FormField
            label="GST Number"
            inputRef={getInputRef(4)}
            style={[styles.inputGroup, styles.halfWidth]}
            value={formData.gstNumber}
            onChangeText={text => updateFormData('gstNumber', text)}
            placeholder="Enter GST number"
            returnKeyType="next"
            blurOnSubmit={false}
            onSubmitEditing={() => handleSubmitEditing(4, 5, 'next')}
          />
        </View>
        <View style={{ paddingBottom: 10 }}>
          <FormField
            label="Address"
            multiline
            inputRef={getInputRef(5)}
            style={styles.inputGroup}
            value={formData.address}
            onChangeText={text => updateFormData('address', text)}
            placeholder="Enter address"
            returnKeyType="done"
            blurOnSubmit={true}
            onSubmitEditing={() => handleSubmitEditing(5, null, 'done')}
          />
        </View>
      </View>

      {/* Buy Now Button */}
      <View style={{ marginTop: 10, marginBottom: 10 }}>
        <TouchableOpacity style={styles.buyNowButton} onPress={handleBuyNow}>
          <Text style={styles.buyNowText}>Buy Now</Text>
        </TouchableOpacity>
      </View>
    </CustomAnimatedModal>
  );
};

const styles = StyleSheet.create({
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  modalSubtitle: {
    fontSize: 12,
    color: '#8F939E',
    marginTop: 2,
  },
  closeButton: {
    padding: 4,
  },
  creditSection: {
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
    marginTop: 2
  },
  creditOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: '#fff',
    paddingVertical: 12,
  },
  selectedCreditOption: {
    borderColor: '#07624C',
    borderWidth: 1,
    backgroundColor: '#fff',
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    marginRight: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioButtonSelected: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#34C759',
  },
  selectedRadioButton: {
    borderColor: '#34C759',
  },
  creditOptionContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  creditAmount: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111111',
    marginBottom: 4,
  },
  creditPrice: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111111',
  },
  buyNowButton: {
    backgroundColor: '#07624C',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    paddingVertical: 12,
    gap: 8,
  },
  buyNowText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
  },
  billingSection: {
    marginTop: 8,
    marginBottom: 4,
  },
  inputGroup: {
    marginBottom: 10,
  },
  label: { ...CommonLabelStyles.label, marginBottom: 6 },
  labelAsterisk: {
    color: '#EF4444',
    fontSize: 12,
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  halfWidth: {
    flex: 1,
  },
  dropdownInput: CommonDropdownStyles.dropdownInput,
  dropdownText: CommonDropdownStyles.dropdownText,
  placeholderText: {
    color: '#9CA3AF',
  },
  dropdownOptions: {
    marginTop: 4,
    height: 200,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
  },
  dropdownOptionsScroll: {
    flex: 1,
  },
  dropdownOptionsContent: {
    paddingBottom: 8,
  },
  dropdownOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  selectedOption: {
    backgroundColor: '#F0F9FF',
  },
  dropdownOptionText: {
    fontSize: 14,
    color: '#374151',
  },
  selectedOptionText: {
    color: '#10B981',
    fontWeight: '500',
  },
});

export default BuyCreditModal;
