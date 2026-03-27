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

const PurchaseOrderInfo = ({ scrollViewRef }) => {
  const [poNumber, setPoNumber] = useState('');
  const [showVendorModal, setShowVendorModal] = useState(false);
  const [selectedDateField, setSelectedDateField] = useState(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [dateValues, setDateValues] = useState({
    poDate: new Date(),
    dueDate: new Date(),
    expectedDate: new Date(),
  });

  // Refs for input navigation
  const customerInputRef = useRef(null);

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
    <View style={OrderStyles.containerWithFlex}>
      <View style={OrderStyles.row}>
        <View style={[OrderStyles.marginLeftAuto, OrderStyles.flexRowGap8]}>
          <ToolTip />
          {/* <Text style={styles.label}>Regular</Text> */}
          <CustomSwitch />
        </View>
      </View>

      {/* PO Number */}
      <View style={OrderStyles.marginTop0}>
        <Text style={OrderStyles.label14}>PO Number</Text>
        <TextInput
          value={poNumber}
          onChangeText={setPoNumber}
          placeholder="Enter PO Number"
          placeholderTextColor={'#8F939E'}
          style={OrderStyles.input}
        />
      </View>

      {/* PO Date & Due Date */}
      <View style={OrderStyles.inputRowWithMargin}>
        <View style={OrderStyles.inputBox}>
          <Text style={OrderStyles.label14}>PO Date</Text>
          <TouchableOpacity
            onPress={() => handleDatePress('poDate')}
            style={OrderStyles.iconInput}>
            <Icon name="calendar-outline" size={18} color="#8F939E" />
            <Text style={OrderStyles.dateTextWithMargin}>
              {dateValues.poDate.toLocaleDateString('en-GB')}
            </Text>
            <Icon
              name="chevron-down-outline"
              size={20}
              color="#8F939E"
              style={OrderStyles.chevronIcon}
            />
          </TouchableOpacity>
        </View>

        <View style={OrderStyles.inputBox}>
          <Text style={OrderStyles.label14}>Due Date</Text>
          <TouchableOpacity
            onPress={() => handleDatePress('dueDate')}
            style={OrderStyles.iconInput}>
            <Icon name="calendar-outline" size={18} color="#8F939E" />
            <Text style={OrderStyles.dateTextWithMargin}>
              {dateValues.dueDate.toLocaleDateString('en-GB')}
            </Text>
            <Icon
              name="chevron-down-outline"
              size={20}
              color="#8F939E"
              style={OrderStyles.chevronIcon}
            />
          </TouchableOpacity>
        </View>
      </View>

      <View style={OrderStyles.marginTop2}>
        <SearchCustomer
          peopleList={peopleList}
          placeholder='Search Vendor'
          label='Vendor Name'
          onCustomerSelect={customer => console.log('Selected:', customer)}
          vendorModalHeader="Add New Vendor"
          enableAddCustomer={true}
          scrollViewRef={scrollViewRef}
          inputRef={customerInputRef}
          returnKeyType="next"
        />
      </View>

      {/* Expected Delivery Date */}
      <View style={OrderStyles.marginTop12}>
        <Text style={OrderStyles.label14}>Expected Delivery Date</Text>
        <TouchableOpacity
          onPress={() => handleDatePress('expectedDate')}
          style={OrderStyles.iconInput}>
          <Icon name="calendar-outline" size={18} color="#8F939E" />
          <Text style={OrderStyles.dateTextWithMargin}>
            {dateValues.expectedDate.toLocaleDateString('en-GB')}
          </Text>
          <Icon
            name="chevron-down-outline"
            size={20}
            color="#8F939E"
            style={OrderStyles.chevronIcon}
          />
        </TouchableOpacity>
      </View>

      {/* Vendor Modal */}
      <AddVendorModal
        visible={showVendorModal}
        onClose={() => setShowVendorModal(false)}
        vendorNameLabel=" Vendor Name"
        placeholderName="Party A"
      />

      {/* Custom Calendar Component */}
      {showCalendar && (
        <CustomCalendarnew
          visible={showCalendar}
          initialDate={dateValues[selectedDateField]}
          onSelectDate={handleDateSelected}
          onClose={() => setShowCalendar(false)}
          allowFutureDates={true}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  // All styles moved to OrderStyles.js
});

export default PurchaseOrderInfo;
