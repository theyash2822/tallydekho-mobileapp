import React, {useState, useRef} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Keyboard,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import CustomSwitch from '../common/CustomSwitch';
import Colors from '../../utils/Colors';
import {CommonInputStyles, CommonLabelStyles} from '../../utils/CommonStyles';
import AddVendorModal from '../Sales-purchaseInvoice/VendorModal';
import CustomCalendarnew from '../orders/Calender';
import AddProductSection from '../Quotations/AddProduct';
import {peopleList, referenceInvoice} from '../../utils/Constants';
import ToolTip from '../Sales-purchaseInvoice/ToolTip';
import SearchCustomer from '../common/SearchCustomer';
import SearchReferenceDropdown from './ReferenceSearch';

const CreditNoteInfo = ({scrollViewRef, products, setProducts, logistics, setLogistics}) => {
  const [debitNoteNumber, setDebitNoteNumber] = useState('');
  const [showVendorModal, setShowVendorModal] = useState(false);
  const [selectedDateField, setSelectedDateField] = useState(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [dateValues, setDateValues] = useState({
    dueDate: new Date(),
  });

  const noteNumberInputRef = useRef(null);
  const customerInputRef = useRef(null);
  const referenceInputRef = useRef(null);
  const notesInputRef = useRef(null);
  const containerRef = useRef(null);
  const [containerY, setContainerY] = useState(0);

  const handleNotesFocus = () => {
    // Only scroll if field is below threshold
    const SCROLL_THRESHOLD = 200;
    if (scrollViewRef?.current && containerY > SCROLL_THRESHOLD) {
      setTimeout(() => {
        scrollViewRef.current?.scrollTo({
          y: containerY - 100,
          animated: true,
        });
      }, 150);
    }
  };

  const handleContainerLayout = event => {
    const {y} = event.nativeEvent.layout;
    setContainerY(y);
  };

  const handleInvoiceSelect = invoice => {
    console.log('Selected invoice:', invoice);
  };

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
        <View style={styles.switchRow}>
          {/* <Text style={styles.label}>Regular</Text> */}
          <ToolTip/>
          <CustomSwitch />
        </View>
      </View>

      <View style={styles.inputRow}>
        <View style={styles.inputBox}>
          <Text style={styles.label}>Credit Note Number</Text>
          <TextInput
            ref={noteNumberInputRef}
            value={debitNoteNumber}
            onChangeText={setDebitNoteNumber}
            placeholder="DN-0045"
            placeholderTextColor="#8F939E"
            style={styles.input}
            returnKeyType="next"
            blurOnSubmit={false}
            onSubmitEditing={() => {
              // Date field is not a TextInput, so skip to customer
              if (customerInputRef?.current) {
                setTimeout(() => {
                  customerInputRef.current?.focus();
                }, 50);
              }
            }}
          />
        </View>

        <View style={styles.inputBox}>
          <Text style={styles.label}>Credit Note Date</Text>
          <TouchableOpacity
            onPress={() => handleDatePress('dueDate')}
            style={styles.iconInput}>
            <Icon name="calendar-outline" size={18} color="#8F939E" />
            <Text style={styles.dateText}>
              {dateValues.dueDate.toLocaleDateString('en-GB')}
            </Text>
            <Icon
              name="chevron-down-outline"
              size={20}
              color="#8F939E"
              style={styles.chevronIcon}
            />
          </TouchableOpacity>
        </View>
      </View>

      <SearchCustomer
        peopleList={peopleList}
        onCustomerSelect={customer => console.log('Selected:', customer)}
        vendorModalHeader="Add New Customer"
        enableAddCustomer={false}
        scrollViewRef={scrollViewRef}
        inputRef={customerInputRef}
        nextInputRef={referenceInputRef}
        returnKeyType="next"
      />

      <SearchReferenceDropdown
        label="Reference Invoice"
        data={referenceInvoice}
        placeholder="Search Reference Invoice"
        iconName="document-text-outline"
        onSelect={handleInvoiceSelect}
        scrollViewRef={scrollViewRef}
        inputRef={referenceInputRef}
        nextInputRef={notesInputRef}
        returnKeyType="next"
      />
      
      <View ref={containerRef} onLayout={handleContainerLayout} style={styles.field2}>
        <Text style={styles.label}>Narration/Notes</Text>
        <TextInput
          ref={notesInputRef}
          style={[styles.input, {height: 80 , textAlignVertical:'top'}]}
          multiline
          placeholder="Enter Notes"
          placeholderTextColor="#8F939E"
          returnKeyType="done"
          blurOnSubmit={true}
          onSubmitEditing={() => {
            Keyboard.dismiss();
          }}
          onFocus={handleNotesFocus}
        />
      </View>

      <AddProductSection 
        stockButtonText="Add Return Items ＋"
        modalHeaderText="Add Return Items"
        products={products}
        setProducts={setProducts}
      />

      <AddVendorModal
        visible={showVendorModal}
        onClose={() => setShowVendorModal(false)}
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 12,
    marginTop: 2,
    backgroundColor: Colors.white,
    borderRadius: 10,
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  switchRow: {
    marginLeft: 'auto',
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  label: {
    ...CommonLabelStyles.label,
    fontSize: 14,
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  inputBox: {
    width: '48%',
  },
  input: {
    ...CommonInputStyles.textInput,
    paddingHorizontal: 10,
    color: '#000',
  },
  iconInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderColor: Colors.border,
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 10,
  },
  dateText: {
    marginLeft: 10,
    fontSize: 14,
    color: '#000',
  },
  chevronIcon: {
    marginLeft: 'auto',
  },
  field: {
    marginTop: 10,
    marginBottom: 16,
  },
   field2: {
    marginTop: 10,
    marginBottom: 4,
  },
  section: {
    marginTop: 12,
  },
});

export default CreditNoteInfo;