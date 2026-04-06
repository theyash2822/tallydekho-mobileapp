import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import CustomSwitch from '../common/CustomSwitch';
import Colors from '../../utils/Colors';
import {CommonInputStyles, CommonLabelStyles, CommonDropdownStyles} from '../../utils/CommonStyles';
import AddVendorModal from './VendorModal';
import ToolTip from './ToolTip';
import CustomCalendarnew from '../orders/Calender';
import { peopleList } from '../../utils/Constants';
import SearchCustomer from '../common/SearchCustomer';
import { Icons } from '../../utils/Icons';

const ledgerOptions = [
  'Purchase - Raw Materials',
  'Purchase - Finished Goods',
  'Expenses',
  'Capital Purchases',
  'Etc',
];


const PurchaseInvoiceInfo = forwardRef(({ scrollViewRef }, ref) => {
  const navigation = useNavigation();
  const [ledger, setLedger] = useState('');
  const [ledgerDropdownVisible, setLedgerDropdownVisible] = useState(false);
  const [scannedBarcode, setScannedBarcode] = useState('');
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [selectedDateField, setSelectedDateField] = useState(null);
  const [referenceNumber, setReferenceNumber] = useState('');
  const [showCalendar, setShowCalendar] = useState(false);
  const [dateValues, setDateValues] = useState({
    order: null,
  });
  const [showVendorModal, setShowVendorModal] = useState(false);

  // Refs for input navigation
  const vendorInputRef = useRef(null);
  const referenceNumberInputRef = useRef(null);

  const [selectedVendor, setSelectedVendor] = useState('');

  useImperativeHandle(ref, () => ({
    getFormData: () => ({
      partyLedger: selectedVendor,
      purchaseLedger: ledger || 'Purchase Accounts',
      date: dateValues.order
        ? dateValues.order.toISOString().slice(0, 10)
        : new Date().toISOString().slice(0, 10),
      invoiceNumber,
      referenceNumber,
    }),
  }));

  const handleVendorSelect = vendor => {
    setSelectedVendor(vendor?.name || vendor || '');
  };

  const todayPlaceholder = new Date().toLocaleDateString();
  const handleDatePress = fieldKey => {
    setSelectedDateField(fieldKey);
    setShowCalendar(true);
  };

  const handleDateSelected = date => {
    setDateValues(prev => ({
      ...prev,
      [selectedDateField]: date,
    }));
    setShowCalendar(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text style={styles.heading}>Invoice Scanning & Upload</Text>
        <View style={{ marginLeft: 'auto' }}>
          <CustomSwitch />
        </View>
      </View>
      <View style={{ marginBottom: 16 }}>
        <ToolTip />
      </View>

      <TouchableOpacity
        style={styles.scanButton}
        onPress={() => {
          navigation.navigate('scanner', {
            onScanComplete: (scannedCode) => {
              setScannedBarcode(scannedCode);
              // You can use the scanned barcode here as needed
              // For example, search for a product with this barcode
            },
          });
        }}>
        <Text style={styles.scanText}>Scan Barcode</Text>
        <Icons.ScanBarcode height={20} width={20} />
      </TouchableOpacity>

      {/* Ledger Dropdown */}
      <Text style={styles.label}>Ledger Selection</Text>
      <View style={{ marginBottom: 16 }}>
        <TouchableOpacity
          onPress={() => setLedgerDropdownVisible(!ledgerDropdownVisible)}
          style={styles.dropdownHeader}>
          <Text style={{color: ledger ? '#000000' : '#8F939E'}}>{ledger || 'Select Ledger'}</Text>
          <Icon name="chevron-down-outline" size={18} color="#6F7C97" />
        </TouchableOpacity>

        {ledgerDropdownVisible && (
          <View style={styles.dropdown}>
            {ledgerOptions.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.dropdownItem,
                  index === ledgerOptions.length - 1 && styles.lastDropdownItem,
                ]}
                onPress={() => {
                  setLedger(item);
                  setLedgerDropdownVisible(false);
                }}>
                <Icon name="people-outline" size={18} color="#333" />
                <Text style={{ marginLeft: 8 }}>{item}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      {/* Invoice Fields */}
      <View style={styles.inputRow}>
        <View style={styles.inputBox}>
          <Text style={styles.label}>Invoice Number</Text>
          <TextInput
            value={invoiceNumber}
            onChangeText={setInvoiceNumber}
            placeholder="e.g. INV-001"
            placeholderTextColor={'#8F939E'}
            style={styles.input}
          />
        </View>

        <View style={styles.inputBox}>
          <Text style={styles.label}>Invoice Date</Text>
          <TouchableOpacity
            onPress={() => handleDatePress('order')}
            style={styles.dateInputBox}>
            <Icon
              name="calendar-outline"
              size={18}
              color="#6F7C97"
              style={styles.dateIcon}
            />
            <Text style={styles.dateText}>
              {dateValues.order
                ? dateValues.order.toLocaleDateString()
                : todayPlaceholder}
            </Text>
            <Icon name="chevron-down-outline" size={18} color="#6F7C97" />
          </TouchableOpacity>
        </View>

      </View>

      {/* Vendor Selection */}
      <SearchCustomer
        placeholder='Search Vendor'
        label="Vendor Selection"
        peopleList={peopleList}
        onCustomerSelect={handleVendorSelect}
        vendorModalHeader="Add New Vendor"
        enableAddCustomer={true}
        showShippingAddress={true}
        scrollViewRef={scrollViewRef}
        inputRef={vendorInputRef}
        nextInputRef={referenceNumberInputRef}
        returnKeyType="next"
      />

      {showCalendar && (
        <CustomCalendarnew
          visible={showCalendar}
          initialDate={dateValues[selectedDateField]}
          onSelectDate={handleDateSelected}
          onClose={() => setShowCalendar(false)}
          allowFutureDates={true}
        />
      )}

      <AddVendorModal
        visible={showVendorModal}
        onClose={() => setShowVendorModal(false)}
        placeholderName="Party A"
      />

      {/* Reference Number */}
      <View style={{ marginTop: 12 }}>
        <Text style={styles.label}>Purchase Reference Number</Text>
        <TextInput
          ref={referenceNumberInputRef}
          value={referenceNumber}
          onChangeText={setReferenceNumber}
          placeholder="e.g. PRN-001"
          placeholderTextColor={'#8F939E'}
          style={styles.input}
          returnKeyType="done"
        />
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    padding: 12,
    marginTop: 2,
    backgroundColor: Colors.white,
    borderRadius: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  heading: {
    fontSize: 16,
    fontWeight: '600',
  },
  scanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8EFF6',
    padding: 12,
    borderRadius: 8,
    justifyContent: 'center',
    marginBottom: 16,
  },
  scanText: {
    marginRight: 8,
    fontWeight: '500',
  },
  dropdownHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: Colors.white,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  dropdown: {
    ...CommonDropdownStyles.dropdownOptions,
    maxHeight: undefined,
    overflow: undefined,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomColor: Colors.border,
    borderBottomWidth: 1,
  },
  lastDropdownItem: {
    borderBottomWidth: 0,
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  inputBox: {
    width: '48%',
  },
  label: {
    ...CommonLabelStyles.label,
    fontSize: 13,
  },
  input: {
    ...CommonInputStyles.textInput,
    paddingHorizontal: 10,
  },
  dateInputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 12,
    borderColor: Colors.border,
    borderWidth: 1,
    justifyContent: 'space-between',
  },
  dateText: {
    flex: 1,
    color: '#000',
    marginLeft: 8
  },
});

export default PurchaseInvoiceInfo;