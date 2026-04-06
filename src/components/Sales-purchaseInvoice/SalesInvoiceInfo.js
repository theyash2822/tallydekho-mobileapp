import React, { useState, useRef, forwardRef, useImperativeHandle } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import CustomSwitch from '../common/CustomSwitch';
import Colors from '../../utils/Colors';
import {CommonInputStyles, CommonLabelStyles, CommonDropdownStyles} from '../../utils/CommonStyles';
import CustomCalendarnew from '../orders/Calender';
import AddVendorModal from './VendorModal';
import ToolTip from './ToolTip';
import SearchCustomer from '../common/SearchCustomer';

const ledgerOptions = [
  'Purchase - Raw Materials',
  'Purchase - Finished Goods',
  'Expenses',
  'Capital Purchases',
  'Etc',
];

const SalesInvoiceInfo = forwardRef(({ scrollViewRef, customerRef }, ref) => {
  const [ledger, setLedger] = useState('');
  const [ledgerDropdownVisible, setLedgerDropdownVisible] = useState(false);
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [showVendorModal, setShowVendorModal] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [invoiceDate, setInvoiceDate] = useState(null);

  // Refs for input navigation
  const customerInputRef = useRef(null);

  const [peopleList, setPeopleList] = useState([
    'Amit Sharma',
    'Ravi Kumar',
    'Priya Soni',
    'Neha Agarwal',
    'Karan Mehta',
    'Deepak Jain',
    'Riya Singh',
    'Arjun Verma',
    'Swati Joshi',
    'Nikhil Bansal',
    'Deepak Jain',
  ]);

  const [confirmationMessage, setConfirmationMessage] = useState('');

  const [showTooltip, setShowTooltip] = useState(false);

  const todayPlaceholder = new Date().toLocaleDateString();

  const handleDatePress = () => {
    setShowCalendar(true);
  };

  const handleDateSelected = date => {
    setInvoiceDate(date);
    setShowCalendar(false);
  };

  useImperativeHandle(ref, () => ({
    getFormData: () => ({
      partyLedger: selectedCustomer,
      salesLedger: ledger || 'Sales Accounts',
      date: invoiceDate
        ? invoiceDate.toISOString().slice(0, 10)
        : new Date().toISOString().slice(0, 10),
      invoiceNumber,
    }),
  }));

  const handleVendorSaveAndUse = name => {
    setPeopleList(prevList =>
      prevList.includes(name) ? prevList : [name, ...prevList],
    );

    setConfirmationMessage(`New vendor "${name}" added`);
    setShowVendorModal(false);

    setTimeout(() => setConfirmationMessage(''), 3000);
  };

  const [selectedCustomer, setSelectedCustomer] = useState('');

  const handleCustomerSelect = customer => {
    setSelectedCustomer(customer?.name || customer || '');
  };

  return (
    <View style={styles.container}>
      {/* Header Row */}
      <View style={styles.row}>
        {/* <Text style={styles.heading}>
          Party Information <Text style={{color: 'red'}}>*</Text>
          <Text style={{color: '#6F7C97', fontSize: 13}}> mandatory</Text>
        </Text> */}
        <View style={styles.switchRow}>
          <ToolTip />
          <CustomSwitch />
        </View>
      </View>



      {/* Ledger Dropdown */}
      <Text style={styles.label}>Ledger Selection</Text>
      <View style={{ marginBottom: 16 }}>
        <TouchableOpacity
          onPress={() => setLedgerDropdownVisible(!ledgerDropdownVisible)}
          style={styles.dropdownHeader}>
          <Text style={{color: ledger ? '#000000' : '#8F939E'}}>{ledger || 'Purchase'}</Text>
          <Icon name="chevron-down-outline" size={18} color="#6F7C97" />
        </TouchableOpacity>

        {ledgerDropdownVisible && (
          <View style={styles.dropdown}>
            {ledgerOptions.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.dropdownItem}
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

      {/* Order Number + Order Date */}
      <View style={styles.inputRow}>
        <View style={styles.inputBox}>
          <Text style={styles.label}>Invoice Number</Text>
          <TextInput
            value={invoiceNumber}
            onChangeText={setInvoiceNumber}
            placeholder="INV-001"
            placeholderTextColor={'#8F939E'}
            style={styles.input}
          />
        </View>

        <View style={styles.inputBox}>
          <Text style={styles.label}>Invoice Date</Text>
          <TouchableOpacity
            onPress={handleDatePress}
            style={styles.dateInputBox}>
            <Icon
              name="calendar-outline"
              size={18}
              color="#6F7C97"
              style={{ marginRight: 8 }}
            />
            <Text style={styles.dateText}>
              {invoiceDate
                ? invoiceDate.toLocaleDateString()
                : todayPlaceholder}
            </Text>
            <Icon name="chevron-down-outline" size={18} color="#6F7C97" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Customer Selection */}
      <SearchCustomer
        ref={customerRef}
        label="Customer Selection"
        peopleList={peopleList}
        onCustomerSelect={handleCustomerSelect}
        vendorModalHeader="Add New Customer"
        enableAddCustomer={true}
        showShippingAddress={true}
        scrollViewRef={scrollViewRef}
        inputRef={customerInputRef}
        returnKeyType="next"
        required={true}
      />

      {/* Calendar Modal */}
      {showCalendar && (
        <CustomCalendarnew
          visible={showCalendar}
          initialDate={invoiceDate || new Date()}
          onSelectDate={handleDateSelected}
          onClose={() => setShowCalendar(false)}
        />
      )}

      {/* Vendor Modal */}
      <AddVendorModal
        visible={showVendorModal}
        onClose={() => setShowVendorModal(false)}
        onSaveAndUse={handleVendorSaveAndUse} // ✅ pass handler
        showShippingAddress={true}
        showfirstButton={false}
        showSecondButton={true}
        headerText="Add New Customer"
        subText="Fill the Form For information"
        vendorNameLabel="Name"
        placeholderName="Party A"
      />
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
  switchRow: {
    marginLeft: 'auto',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  heading: {
    fontSize: 16,
    fontWeight: '600',
  },
  label: {
    ...CommonLabelStyles.label,
    fontSize: 13,
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
    // borderBottomColor: Colors.border,
    // borderBottomWidth: 1,
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  inputBox: {
    width: '49%',
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
  },
  confirmationText: {
    color: '#34C759', // Green success color
    fontSize: 14,
    marginBottom: 8,
    fontWeight: '500',
  },
});

export default SalesInvoiceInfo;
