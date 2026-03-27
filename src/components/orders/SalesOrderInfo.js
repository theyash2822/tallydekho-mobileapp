import React, { useState, useRef } from 'react';
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
import AddVendorModal from '../Sales-purchaseInvoice/VendorModal';
import CustomCalendarnew from './Calender';
import ToolTip from '../Sales-purchaseInvoice/ToolTip';
import SearchCustomer from '../common/SearchCustomer';
import { peopleList } from '../../utils/Constants';
import OrderStyles from './css/OrderStyles';

const ledgerOptions = [
  'Purchase - Raw Materials',
  'Purchase - Finished Goods',
  'Expenses',
  'Capital Purchases',
  'Etc',
];

const SalesOrderInfo = ({ scrollViewRef }) => {
  const [ledger, setLedger] = useState('');
  const [ledgerDropdownVisible, setLedgerDropdownVisible] = useState(false);
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [showVendorModal, setShowVendorModal] = useState(false);
  const [selectedDateField, setSelectedDateField] = useState(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [dateValues, setDateValues] = useState({
    order: null,
    due: null,
    validity: null,
  });

  // Refs for input navigation
  const customerInputRef = useRef(null);

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
    <View style={OrderStyles.container}>
      {/* Header Row */}
      <View style={OrderStyles.row}>
        <Text style={OrderStyles.heading}>
          Party Information
        </Text>
        <View style={OrderStyles.marginLeftAuto}>
          <CustomSwitch />
          {/* <Text style={styles.label1}>Regular</Text> */}
        </View>
      </View>
      <ToolTip />

      {/* Ledger Dropdown */}
      <Text style={OrderStyles.label}>Ledger Selection</Text>
      <View style={OrderStyles.dropdownContainer}>
        <TouchableOpacity
          onPress={() => setLedgerDropdownVisible(!ledgerDropdownVisible)}
          style={OrderStyles.dropdownHeader}>
          {/* <Text>{ledger || 'Purchase'}</Text> */}
          <Text style={{ color: ledger ? '#000000' : '#8F939E' }}>{ledger || 'Purchase'}</Text>
          <Icon name="chevron-down-outline" size={18} color="#6F7C97" />
        </TouchableOpacity>

        {ledgerDropdownVisible && (
          <View style={OrderStyles.dropdown}>
            {ledgerOptions.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  OrderStyles.dropdownItem,
                  index === ledgerOptions.length - 1 && OrderStyles.lastDropdownItem,
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

      {/* Order Number + Order Date */}
      <View style={OrderStyles.inputRow}>
        <View style={OrderStyles.inputBox}>
          <Text style={OrderStyles.label}>Order Number</Text>
          <TextInput
            value={invoiceNumber}
            onChangeText={setInvoiceNumber}
            placeholder="#122492429432"
            placeholderTextColor={'#8F939E'}
            style={OrderStyles.input}
          />
        </View>

        <View style={OrderStyles.inputBox}>
          <Text style={OrderStyles.label}>Order Date</Text>
          <TouchableOpacity
            onPress={() => handleDatePress('order')}
            style={OrderStyles.dateInputBox}>
            <Icon
              name="calendar-outline"
              size={18}
              color="#6F7C97"
              style={OrderStyles.dateIcon}
            />
            <Text style={OrderStyles.dateText}>
              {dateValues.order
                ? dateValues.order.toLocaleDateString()
                : todayPlaceholder}
            </Text>
            <Icon name="chevron-down-outline" size={18} color="#6F7C97" />
          </TouchableOpacity>
        </View>
      </View>

      <SearchCustomer
        peopleList={peopleList}
        onCustomerSelect={customer => console.log('Selected:', customer)}
        vendorModalHeader="Add New Customer"
        enableAddCustomer={true}
        scrollViewRef={scrollViewRef}
        inputRef={customerInputRef}
        returnKeyType="next"
      />

      {/* Due Date + Validity Period */}
      <View style={OrderStyles.marginTop10}>
        <View style={OrderStyles.inputRow}>
          <View style={OrderStyles.inputBox}>
            <Text style={OrderStyles.label}>Due Date</Text>
            <TouchableOpacity
              onPress={() => handleDatePress('due')}
              style={OrderStyles.dateInputBox}>
              <Icon
                name="calendar-outline"
                size={18}
                color="#6F7C97"
                style={OrderStyles.dateIcon}
              />
              <Text style={OrderStyles.dateText}>
                {dateValues.due
                  ? dateValues.due.toLocaleDateString()
                  : todayPlaceholder}
              </Text>
              <Icon name="chevron-down-outline" size={18} color="#6F7C97" />
            </TouchableOpacity>
          </View>

          <View style={OrderStyles.inputBox}>
            <Text style={OrderStyles.label}>Validity Period</Text>
            <TouchableOpacity
              onPress={() => handleDatePress('validity')}
              style={OrderStyles.dateInputBox}>
              <Icon
                name="calendar-outline"
                size={18}
                color="#6F7C97"
                style={OrderStyles.dateIcon}
              />
              <Text style={OrderStyles.dateText}>
                {dateValues.validity
                  ? dateValues.validity.toLocaleDateString()
                  : todayPlaceholder}
              </Text>
              <Icon name="chevron-down-outline" size={18} color="#6F7C97" />
            </TouchableOpacity>
            <Text style={OrderStyles.additionalText}>Valid for 30 days</Text>
          </View>
        </View>
      </View>

      {/* Shared Date Picker */}
      {showCalendar && (
        <CustomCalendarnew
          visible={showCalendar}
          initialDate={dateValues[selectedDateField]}
          onSelectDate={handleDateSelected}
          onClose={() => setShowCalendar(false)}
          allowFutureDates={
            selectedDateField === 'due' || selectedDateField === 'validity'
          }
        />
      )}

      {/* Vendor Modal */}
      <AddVendorModal
        visible={showVendorModal}
        onClose={() => setShowVendorModal(false)}
        showShippingAddress={true} // or false
        showfirstButton={false}
        showSecondButton={true}
        vendorNameLabel="Name"
        placeholderName="Party A"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  // All styles moved to OrderStyles.js
});

export default SalesOrderInfo;
