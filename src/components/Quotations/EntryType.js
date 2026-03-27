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
import CustomCalendarnew from '../orders/Calender';
import AddProductSection from './AddProduct';
import AddVendorModal from '../Sales-purchaseInvoice/VendorModal';
import ToolTip from '../Sales-purchaseInvoice/ToolTip';
import QuotationStyles from './css/QuotationStyles';
import SearchCustomer from '../common/SearchCustomer';

const peopleList = [
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
];

const EntryType = ({ scrollViewRef, products, setProducts }) => {
  const [quotationNo, setQuotationNo] = useState('');
  const [showVendorModal, setShowVendorModal] = useState(false);
  const [showQuotationDateCalendar, setShowQuotationDateCalendar] = useState(false);
  const [showValidityCalendar, setShowValidityCalendar] = useState(false);
  const [quotationDate, setQuotationDate] = useState(null);
  const [validityDate, setValidityDate] = useState(null);

  // Refs for input navigation
  const customerInputRef = useRef(null);
  const referenceNoInputRef = useRef(null);

  const todayPlaceholder = new Date().toLocaleDateString();

  const handleCustomerSelect = customer => {
    console.log('Selected customer:', customer);
  };

  const handleQuotationDatePress = () => {
    setShowQuotationDateCalendar(true);
  };

  const handleQuotationDateSelected = date => {
    setQuotationDate(date);
    setShowQuotationDateCalendar(false);
  };

  const handleValidityDatePress = () => {
    setShowValidityCalendar(true);
  };

  const handleValidityDateSelected = date => {
    setValidityDate(date);
    setShowValidityCalendar(false);
  };
  return (
    <View style={QuotationStyles.container}>
      <View style={QuotationStyles.header}>
        <View style={QuotationStyles.marginRight8}>
          <ToolTip />
        </View>
        <CustomSwitch />
      </View>

      <View style={QuotationStyles.marginTop10}>
        <View style={QuotationStyles.rowContainer}>
          <View style={QuotationStyles.halfField}>
            <Text style={QuotationStyles.label}>Quotation No.</Text>
            <TextInput
              style={[QuotationStyles.input, { height: 40 }]}
              placeholder="QTN-TD-0001"
              value={quotationNo}
              onChangeText={setQuotationNo}
              placeholderTextColor="#8F939E"
            />
          </View>
          <View style={QuotationStyles.halfField}>
            <Text style={QuotationStyles.label}>Quotation Date</Text>
            <TouchableOpacity
              onPress={handleQuotationDatePress}
              style={styles.dateInputBox}>
              <Icon
                name="calendar-outline"
                size={18}
                color="#6F7C97"
                style={{ marginRight: 8 }}
              />
              <Text style={styles.dateText}>
                {quotationDate
                  ? quotationDate.toLocaleDateString()
                  : todayPlaceholder}
              </Text>
              <Icon name="chevron-down-outline" size={18} color="#6F7C97" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={QuotationStyles.marginTop1}>
        <SearchCustomer
          label="Customer Selection"
          peopleList={peopleList}
          onCustomerSelect={handleCustomerSelect}
          vendorModalHeader="Add New Customer"
          enableAddCustomer={true}
          showShippingAddress={true}
          scrollViewRef={scrollViewRef}
          inputRef={customerInputRef}
          nextInputRef={referenceNoInputRef}
          returnKeyType="next"
        />
      </View>
      <View style={QuotationStyles.marginTop12}>
        <View style={QuotationStyles.field}>
          <Text style={QuotationStyles.label}>Quotation Validity</Text>
          <TouchableOpacity
            onPress={handleValidityDatePress}
            style={styles.dateInputBox}>
            <Icon
              name="calendar-outline"
              size={18}
              color="#6F7C97"
              style={{ marginRight: 8 }}
            />
            <Text style={styles.dateText}>
              {validityDate
                ? validityDate.toLocaleDateString()
                : todayPlaceholder}
            </Text>
            <Icon name="chevron-down-outline" size={18} color="#6F7C97" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={QuotationStyles.field}>
        <Text style={QuotationStyles.label}>Reference No.</Text>
        <TextInput
          ref={referenceNoInputRef}
          style={QuotationStyles.input}
          placeholder="-"
          placeholderTextColor={'#8f939E'}
          returnKeyType="done"
        />
      </View>

      <View style={QuotationStyles.field2}>
        <Text style={QuotationStyles.label}>Narration/Notes</Text>
        <TextInput
          style={[QuotationStyles.input, { height: 55 }]}
          multiline
          placeholder="Enter Notes"
          placeholderTextColor={'#8F939E'}
        />
      </View>

      <AddProductSection
        products={products}
        setProducts={setProducts}
      />

      {/* Calendar Modals */}
      {showQuotationDateCalendar && (
        <CustomCalendarnew
          visible={showQuotationDateCalendar}
          initialDate={quotationDate || new Date()}
          onSelectDate={handleQuotationDateSelected}
          onClose={() => setShowQuotationDateCalendar(false)}
          allowFutureDates={true}
        />
      )}

      {showValidityCalendar && (
        <CustomCalendarnew
          visible={showValidityCalendar}
          initialDate={validityDate || new Date()}
          onSelectDate={handleValidityDateSelected}
          onClose={() => setShowValidityCalendar(false)}
          allowFutureDates={true}
        />
      )}

      {/* Vendor Modal */}
      <AddVendorModal
        visible={showVendorModal}
        onClose={() => setShowVendorModal(false)}
        showShippingAddress={true} // or false
        showfirstButton={false}
        showSecondButton={true}
        headerText="Add New Customer"
        vendorNameLabel="Name"
        placeholderName="Party A"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  dateInputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderColor: Colors.border,
    borderWidth: 1,
    justifyContent: 'space-between',

  },
  dateText: {
    flex: 1,
    color: '#000',
    fontSize: 14,
  },
});

export default EntryType;
