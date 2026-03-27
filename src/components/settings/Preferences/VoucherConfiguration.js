import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Image,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import {launchImageLibrary} from 'react-native-image-picker';
import Colors from '../../../utils/Colors';
import {CommonDropdownStyles} from '../../../utils/CommonStyles';
import Header from '../../common/Header';
import CustomBottomButtons from '../../common/CustomBottomButtons';
import CustomSwitch from '../../common/CustomSwitch';
import { Icons } from '../../../utils/Icons';

const VoucherConfiguration = () => {
  const navigation = useNavigation();
  const [saveStatus, setSaveStatus] = useState('save'); // 'save', 'saving', 'saved'
  const [expandedSection, setExpandedSection] = useState('Sales Invoice');

  const [voucherConfigs, setVoucherConfigs] = useState({
    'Sales Invoice': {
      format: 'Format 2',
      bank: 'HDFC_00098',
      qrCode: true,
      qrCodeImage: null,
      terms: [
        'Due Date: Specify the deadline for payment.',
        'Late Payment Penalties: Clearly state the consequences of delayed payments, such as interest rates or fixed charges',
        'Payment Methods: Detail the acceptable payment options',
        'Currency: Indicate the currency in which the payment is expected, especially for international transactions.',
        'Accepted Payment Forms: Specify if you accept cash, wire transfers, or any other specific forms of payment.',
      ],
    },
    'Purchase Invoice': {
      format: 'Format 1',
      bank: 'HDFC_00098',
      qrCode: false,
      qrCodeImage: null,
      terms: [
        'Due Date: Specify the deadline for payment.',
        'Late Payment Penalties: Clearly state the consequences of delayed payments, such as interest rates or fixed charges',
        'Payment Methods: Detail the acceptable payment options',
        'Currency: Indicate the currency in which the payment is expected, especially for international transactions.',
        'Accepted Payment Forms: Specify if you accept cash, wire transfers, or any other specific forms of payment.',
      ],
    },
    'Sales Order': {
      format: 'Format 1',
      bank: 'HDFC_00098',
      qrCode: false,
      qrCodeImage: null,
      terms: [
        'Due Date: Specify the deadline for payment.',
        'Late Payment Penalties: Clearly state the consequences of delayed payments, such as interest rates or fixed charges',
        'Payment Methods: Detail the acceptable payment options',
        'Currency: Indicate the currency in which the payment is expected, especially for international transactions.',
        'Accepted Payment Forms: Specify if you accept cash, wire transfers, or any other specific forms of payment.',
      ],
    },
    'Purchase Order': {
      format: 'Format 1',
      bank: 'HDFC_00098',
      qrCode: false,
      qrCodeImage: null,
      terms: [
        'Due Date: Specify the deadline for payment.',
        'Late Payment Penalties: Clearly state the consequences of delayed payments, such as interest rates or fixed charges',
        'Payment Methods: Detail the acceptable payment options',
        'Currency: Indicate the currency in which the payment is expected, especially for international transactions.',
        'Accepted Payment Forms: Specify if you accept cash, wire transfers, or any other specific forms of payment.',
      ],
    },
    Quotation: {
      format: 'Format 1',
      bank: 'HDFC_00098',
      qrCode: false,
      qrCodeImage: null,
      terms: [
        'Due Date: Specify the deadline for payment.',
        'Late Payment Penalties: Clearly state the consequences of delayed payments, such as interest rates or fixed charges',
        'Payment Methods: Detail the acceptable payment options',
        'Currency: Indicate the currency in which the payment is expected, especially for international transactions.',
        'Accepted Payment Forms: Specify if you accept cash, wire transfers, or any other specific forms of payment.',
      ],
    },
    'Credit Note': {
      format: 'Format 1',
      bank: 'HDFC_00098',
      qrCode: false,
      qrCodeImage: null,
      terms: [
        'Due Date: Specify the deadline for payment.',
        'Late Payment Penalties: Clearly state the consequences of delayed payments, such as interest rates or fixed charges',
        'Payment Methods: Detail the acceptable payment options',
        'Currency: Indicate the currency in which the payment is expected, especially for international transactions.',
        'Accepted Payment Forms: Specify if you accept cash, wire transfers, or any other specific forms of payment.',
      ],
    },
  });

  const [showBankDropdown, setShowBankDropdown] = useState(false);
  const [selectedVoucherType, setSelectedVoucherType] = useState(null);
  const [isUploadingQR, setIsUploadingQR] = useState(false);

  // Load saved voucher configurations when component mounts
  useEffect(() => {
    loadVoucherConfigs();
  }, []);

  const loadVoucherConfigs = async () => {
    try {
      const savedConfigs = await AsyncStorage.getItem('voucherConfigs');
      if (savedConfigs) {
        setVoucherConfigs(JSON.parse(savedConfigs));
      }
    } catch (error) {
      console.error('Error loading voucher configs:', error);
    }
  };

  const saveVoucherConfigs = async configs => {
    try {
      await AsyncStorage.setItem('voucherConfigs', JSON.stringify(configs));
    } catch (error) {
      console.error('Error saving voucher configs:', error);
    }
  };

  const voucherTypes = [
    'Sales Invoice',
    'Purchase Invoice',
    'Sales Order',
    'Purchase Order',
    'Quotation',
    'Credit Note',
  ];

  const formatOptions = ['Format 1', 'Format 2', 'Format 3'];
  const bankOptions = ['HDFC_00098', 'ICICI_00123', 'SBI_00456'];

  const toggleSection = sectionName => {
    setExpandedSection(expandedSection === sectionName ? null : sectionName);
  };

  const updateVoucherConfig = (voucherType, field, value) => {
    setVoucherConfigs(prev => {
      const newConfigs = {
        ...prev,
        [voucherType]: {
          ...prev[voucherType],
          [field]: value,
        },
      };

      // Save to AsyncStorage automatically
      saveVoucherConfigs(newConfigs);

      return newConfigs;
    });
  };

  const handleFormatSelect = (voucherType, format) => {
    updateVoucherConfig(voucherType, 'format', format);
    setShowBankDropdown(false); // Close dropdown after selection
  };

  const handleBankSelect = (voucherType, bank) => {
    updateVoucherConfig(voucherType, 'bank', bank);
    setShowBankDropdown(false);
  };

  const handleQRCodeImageSelect = async voucherType => {
    // Prevent multiple clicks
    if (isUploadingQR) {
      return;
    }

    try {
      setIsUploadingQR(true);
      
      const result = await launchImageLibrary({
        mediaType: 'photo',
        includeBase64: false,
        maxHeight: 2000,
        maxWidth: 2000,
      });

      if (result?.assets?.length) {
        const source = {uri: result.assets[0].uri};
        updateVoucherConfig(voucherType, 'qrCodeImage', source);
      }
    } catch (err) {
      console.warn(err);
      Alert.alert('Error', 'Failed to pick QR code image');
    } finally {
      setIsUploadingQR(false);
    }
  };

  const handleSave = async () => {
    setSaveStatus('saving');

    try {
      // Save to AsyncStorage (this is already done automatically in updateVoucherConfig)
      // But we can also save to a server/API here if needed

      // Simulate API call delay
      setTimeout(() => {
        setSaveStatus('saved');

        // Reset to 'save' after 2 seconds
        setTimeout(() => {
          setSaveStatus('save');
        }, 2000);
      }, 1500);
    } catch (error) {
      console.error('Error saving voucher configurations:', error);
      setSaveStatus('save');
    }
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  const renderFormatCard = (format, isSelected, onPress) => (
    <View key={format} style={styles.formatCardWrapper}>
      <TouchableOpacity
        style={[styles.formatCard, isSelected && styles.selectedFormatCard]}
        onPress={onPress}>
        <View style={styles.formatContent}>
          <View style={styles.formatLine} />
          <View style={styles.formatLine} />
          <View style={styles.formatLine} />
          <View style={styles.formatTable}>
            <View style={styles.tableRow}>
              <View style={styles.tableCell} />
              <View style={styles.tableCell} />
            </View>
            <View style={styles.tableRow}>
              <View style={styles.tableCell} />
              <View style={styles.tableCell} />
            </View>
          </View>
        </View>
        {isSelected && (
          <View style={styles.checkmarkContainer}>
            <Ionicons name="checkmark" size={18} color='#07624C' />
          </View>
        )}
      </TouchableOpacity>
      <Text style={styles.formatText}>{format}</Text>
    </View>
  );

  const renderVoucherSection = voucherType => {
    const config = voucherConfigs[voucherType];
    const isExpanded = expandedSection === voucherType;
    const isBankDropdownOpen =
      showBankDropdown && selectedVoucherType === voucherType;

    return (
      <View key={voucherType} style={styles.voucherSection}>
        <TouchableOpacity
          style={styles.sectionHeader}
          onPress={() => toggleSection(voucherType)}>
          <Text style={styles.sectionTitle}>{voucherType}</Text>
          <Ionicons
            name={isExpanded ? 'chevron-up' : 'chevron-down'}
            size={20}
            color="#6B7280"
          />
        </TouchableOpacity>

        {isExpanded && (
          <View style={styles.sectionContent}>
            {/* Format Selection */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Select Format</Text>
              <View style={styles.formatContainer}>
                {formatOptions.map(format =>
                  renderFormatCard(format, config.format === format, () =>
                    handleFormatSelect(voucherType, format),
                  ),
                )}
              </View>
            </View>

            {/* Bank Selection */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Select Bank</Text>
              <TouchableOpacity
                style={styles.dropdownInput}
                onPress={() => {
                  setSelectedVoucherType(voucherType);
                  setShowBankDropdown(!showBankDropdown);
                }}>
                <Text style={styles.dropdownText}>{config.bank}</Text>
                <Ionicons
                  name={isBankDropdownOpen ? 'chevron-up' : 'chevron-down'}
                  size={20}
                  color="#6B7280"
                />
              </TouchableOpacity>

              {isBankDropdownOpen && (
                <View style={styles.dropdownOptions}>
                  {bankOptions.map((bank, index) => (
                    <TouchableOpacity
                      key={bank}
                      style={[
                        styles.dropdownOption,
                        config.bank === bank && styles.selectedOption,
                        index === bankOptions.length - 1 && styles.lastDropdownOption,
                      ]}
                      onPress={() => handleBankSelect(voucherType, bank)}>
                      <Text
                        style={[
                          styles.dropdownOptionText,
                          config.bank === bank && styles.selectedOptionText,
                        ]}>
                        {bank}
                      </Text>
                      {config.bank === bank && (
                        <Ionicons name="checkmark" size={16} color="#10B981" />
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            {/* QR Code Toggle */}
            <View style={styles.inputGroup}>
              <View style={styles.toggleContainer}>
                <Text style={styles.inputLabel1}>QR Code</Text>
                <CustomSwitch
                  value={config.qrCode}
                  onValueChange={value =>
                    updateVoucherConfig(voucherType, 'qrCode', value)
                  }
                />
              </View>

              {config.qrCode && (
                <View style={styles.qrCodeSection}>
                  <TouchableOpacity
                    style={[styles.uploadButton, isUploadingQR && styles.uploadButtonDisabled]}
                    onPress={() => handleQRCodeImageSelect(voucherType)}
                    disabled={isUploadingQR}
                    activeOpacity={0.7}>
                    {isUploadingQR ? (
                      <Ionicons 
                        name="hourglass-outline" 
                        size={20} 
                        color="#9CA3AF" 
                      />
                    ) : (
                      <Icons.UploadLight width={20} height={20} />
                    )}
                    <Text style={[styles.uploadButtonText, isUploadingQR && styles.uploadButtonTextDisabled]}>
                      {isUploadingQR ? 'Uploading...' : 'Upload QR Code'}
                    </Text>
                  </TouchableOpacity>

                  {config.qrCodeImage && (
                    <View style={styles.qrCodeImageContainer}>
                      <Image
                        source={config.qrCodeImage}
                        style={styles.qrCodeImage}
                        resizeMode="contain"
                      />
                      <TouchableOpacity
                        style={styles.removeQRCodeButton}
                        onPress={() =>
                          updateVoucherConfig(voucherType, 'qrCodeImage', null)
                        }>
                        <Ionicons
                          name="close-circle"
                          size={24}
                          color="#EF4444"
                        />
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              )}
            </View>

            {/* Terms & Conditions */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Terms & Conditions</Text>
              <View style={styles.termsContainer}>
                {config.terms.map((term, index) => (
                  <View key={index} style={styles.termItem}>
                    <Text style={styles.bulletPoint}>•</Text>
                    <Text style={styles.termText}>
                      <Text style={styles.termLabel}>
                        {term.split(':')[0]}:
                      </Text>
                      {term.split(':')[1]}
                    </Text>
                  </View>
                ))}
                <TouchableOpacity style={styles.addNewButton}>
                  <Ionicons name="add" size={20} color="#6B7280" />
                  <Text style={styles.addNewButtonText}>Add New</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.sectionActions}>
              <TouchableOpacity style={styles.useFormatButton}>
                <Text style={styles.useFormatButtonText}>Use this format</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelButton}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    );
  };

  return (
    <>
      <Header
        title="Voucher Configuration"
        leftIcon="chevron-left"
        onLeftPress={() => navigation.goBack()}
      />
      <View style={styles.container}>
        {/* <StatusBar barStyle="dark-content" backgroundColor={Colors.white} /> */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollViewContent}
          showsVerticalScrollIndicator={false}>
          {voucherTypes.map(renderVoucherSection)}
        </ScrollView>
      </View>

      {/* <CustomBottomButtons
        onSave={handleSave}
        onCancel={handleCancel}
        saveState={saveStatus}
      /> */}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F5FA',
  },
  scrollView: {
    flex: 1,
    padding: 12,
  },
  scrollViewContent: {
    paddingBottom: 12,
  },

  // Voucher Section styles
  voucherSection: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: Colors.white,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  sectionContent: {
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },

  // Input Group styles
  inputGroup: {
    marginBottom: 12,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '400',
    color: '#8F939E',
    marginBottom: 8,
  },
  inputLabel1: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111',
    marginBottom: 8,
  },

  // Format Selection styles
  formatContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  formatCardWrapper: {
    alignItems: 'center',
  },
  formatCard: {
    width: 90,
    height: 118,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    borderWidth: 2,
    borderColor: 'transparent',
    activeOpacity: 0.7,
  },
  selectedFormatCard: {
    borderColor: '#07624C',
  },
  formatContent: {
    alignItems: 'center',
    gap: 2,
  },
  formatLine: {
    width: 40,
    height: 2,
    backgroundColor: '#D1D5DB',
    borderRadius: 1,
  },
  formatTable: {
    marginTop: 4,
    gap: 2,
  },
  tableRow: {
    flexDirection: 'row',
    gap: 2,
  },
  tableCell: {
    width: 12,
    height: 8,
    backgroundColor: '#D1D5DB',
    borderRadius: 2,
  },
  checkmarkContainer: {
    position: 'absolute',
    bottom: 8,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  formatText: {
    fontSize: 12,
    color: '#374151',
    marginTop: 8,
    textAlign: 'center',
    fontWeight: '500',
  },

  // Dropdown styles
  dropdownInput: CommonDropdownStyles.dropdownInput,
  dropdownText: {
    fontSize: 14,
    color: '#111827',
  },
  dropdownOptions: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    marginTop: 4,
    maxHeight: 250,
    overflow: 'hidden',
  },
  dropdownOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  lastDropdownOption: {
    borderBottomWidth: 0,
  },
  selectedOption: {
    backgroundColor: '#F9FAFB',
  },
  dropdownOptionText: {
    fontSize: 14,
    color: '#374151',
  },
  selectedOptionText: {
    color: '#10B981',
    fontWeight: '500',
  },

  // Toggle styles
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },

  // Upload button styles
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    backgroundColor: Colors.white,
    width: '100%',
  },
  uploadButtonDisabled: {
    backgroundColor: '#F3F4F6',
    opacity: 0.6,
  },
  uploadButtonText: {
    fontSize: 14,
    color: '#6B7280',
  },
  uploadButtonTextDisabled: {
    color: '#9CA3AF',
  },

  // QR Code specific styles
  qrCodeSection: {
    marginTop: 12,
    alignItems: 'center',
  },
  qrCodeImageContainer: {
    position: 'relative',
    marginTop: 12,
    width: 130,
    height: 130,
    borderRadius: 8,
    overflow: 'visible',
  },
  qrCodeImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  removeQRCodeButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 2,
    zIndex: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },

  // Terms & Conditions styles
  termsContainer: {
    gap: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    padding: 12,
    backgroundColor: Colors.white,
  },
  termItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  bulletPoint: {
    fontSize: 16,
    color: '#111827',
    marginTop: 2,
    width: 16,
    textAlign: 'center',
  },
  termText: {
    flex: 1,
    fontSize: 14,
    color: '#667085',
    lineHeight: 20,
  },
  termLabel: {
    fontSize: 14,
    color: '#111827',
    fontWeight: '600',
  },
  addNewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignSelf: 'center',
    marginTop: 8,
  },
  addNewButtonText: {
    fontSize: 14,
    color: '#6B7280',
  },

  // Section Action Buttons
  sectionActions: {
    flexDirection: 'column', // Changed to column for stacked buttons
    gap: 12,
    marginTop: 16,
  },
  useFormatButton: {
    flex: 1,
    backgroundColor: '#07624C',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  useFormatButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.white,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: Colors.white,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
});

export default VoucherConfiguration;
