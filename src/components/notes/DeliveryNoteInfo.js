import React, { useState, useRef } from 'react';
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
import { peopleList } from '../../utils/Constants';
import DispatchInfo from './VehicleAndDispatch';
import AddDispatchSection from './AddDispatchSection';
import ToolTip from '../Sales-purchaseInvoice/ToolTip';
import SearchCustomer from '../common/SearchCustomer';

const ___COMP = forwardRef(({DeliveryNoteInfo = forwardRef(({ scrollViewRef, onDispatchDropdownToggle, dispatchItems, setDispatchItems }) => {
  const [deliveryNoteNumber, setDeliveryNoteNumber] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchDocumentQuery, setSearchDocumentQuery] = useState('');
  const [selectedDocument, setSelectedDocument] = useState('');
  const [showDocumentDropdown, setShowDocumentDropdown] = useState(false);
  const [showVendorModal, setShowVendorModal] = useState(false);
  const [selectedDateField, setSelectedDateField] = useState(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [dateValues, setDateValues] = useState({
    poDate: new Date(),
    dueDate: new Date(),
    expectedDate: new Date(),
  });

  const noteNumberInputRef = useRef(null);
  const customerInputRef = useRef(null);
  const documentInputRef = useRef(null);
  const documentContainerRef = useRef(null);
  const trackingNoRef = useRef(null); // Ref for Tracking No in DispatchInfo
  const [documentContainerY, setDocumentContainerY] = useState(0);

  const handleDocumentFocus = () => {
    // Only scroll if field is below threshold
    const SCROLL_THRESHOLD = 200;
    if (scrollViewRef?.current && documentContainerY > SCROLL_THRESHOLD) {
      setTimeout(() => {
        scrollViewRef.current?.scrollTo({
          y: documentContainerY - 100,
          animated: true,
        });
      }, 150);
    }
  };

  const handleDocumentLayout = event => {
    const { y } = event.nativeEvent.layout;
    setDocumentContainerY(y);
  };

  const document = [
    'Document 1',
    'Document 2',
    'Document 3',
    'Document 4',
    'Document 5',
    'Document 6',
    'Document 7',
    'Document 8',
    'Document 9',
  ];

  const filteredDocument = document.filter(name =>
    name.toLowerCase().includes(searchDocumentQuery.toLowerCase()),
  );

  // Show only first 4 documents by default
  const displayedDocuments = filteredDocument.slice(0, 4);

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
          <ToolTip />
          <CustomSwitch />
        </View>
      </View>

      <View style={styles.inputRow}>
        <View style={styles.inputBox}>
          <Text style={styles.label}>Delivery Note Number</Text>
          <TextInput
            ref={noteNumberInputRef}
            value={deliveryNoteNumber}
            onChangeText={setDeliveryNoteNumber}
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
          <Text style={styles.label}>Debit Note Date</Text>
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
        nextInputRef={documentInputRef}
        returnKeyType="next"
      />

      <View ref={documentContainerRef} onLayout={handleDocumentLayout} style={styles.section}>
        <Text style={styles.label}>Linked Document</Text>
        <View style={styles.searchContainer}>
          <Icon
            name="search-outline"
            size={20}
            color="#8F939E"
            style={styles.iconLeft}
          />
          <TextInput
            ref={documentInputRef}
            value={searchDocumentQuery}
            onChangeText={text => {
              setSearchDocumentQuery(text);
              setShowDocumentDropdown(text.trim().length > 1);
            }}
            placeholder="Search Document"
            placeholderTextColor="#8F939E"
            style={styles.input1}
            returnKeyType="next"
            blurOnSubmit={false}
            onSubmitEditing={() => {
              // Focus tracking number in DispatchInfo
              if (trackingNoRef?.current) {
                setTimeout(() => {
                  trackingNoRef.current?.focus();
                }, 50);
              }
            }}
            onFocus={handleDocumentFocus}
          />
        </View>

        {showDocumentDropdown &&
          (displayedDocuments.length > 0 ? (
            <View style={styles.documentList}>
              {displayedDocuments.map((doc, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.documentItem,
                    selectedDocument === doc && styles.selectedDocumentItem,
                  ]}
                  onPress={() => {
                    setSelectedDocument(doc);
                    setSearchDocumentQuery(doc);
                    setShowDocumentDropdown(false);
                    Keyboard.dismiss();
                  }}>
                  <Icon
                    name="document-outline"
                    size={18}
                    color="#444"
                    style={styles.iconLeft}
                  />
                  <Text style={styles.documentText}>{doc}</Text>
                  {selectedDocument === doc && (
                    <Icon
                      name="checkmark-circle"
                      size={20}
                      color="green"
                      style={styles.checkIcon}
                    />
                  )}
                </TouchableOpacity>
              ))}
              {filteredDocument.length > 4 && (
                <View style={styles.moreIndicator}>
                  {/* <Text style={styles.moreText}>
                    +{filteredDocument.length - 4} more results
                  </Text> */}
                </View>
              )}
            </View>
          ) : (
            <Text style={styles.noResult}>No results found</Text>
          ))}
      </View>

      <DispatchInfo
        scrollViewRef={scrollViewRef}
        previousInputRef={documentInputRef}
        trackingNoRef={trackingNoRef}
        onDropdownToggle={onDispatchDropdownToggle}
      />

      <View style={{ marginTop: 0 }}>
        <AddDispatchSection
          stockButtonText="Add Dispatch Items ＋"
          dispatchItems={dispatchItems}
          setDispatchItems={setDispatchItems}
        />
      </View>

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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: Colors.white,
  },
  input1: {
    flex: 1,
    height: 40,
    color: '#000',
  },
  iconLeft: {
    marginRight: 8,
  },
  noResult: {
    marginTop: 10,
    textAlign: 'center',
    color: '#999',
    fontStyle: 'italic',
  },
  section: {
    marginTop: 12,
  },
  documentList: {
    marginTop: 6,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
  documentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  selectedDocumentItem: {
    backgroundColor: '#f0f4ff',
  },
  documentText: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    marginLeft: 8,
  },
  checkIcon: {
    marginLeft: 'auto',
  },
  moreIndicator: {
    // paddingVertical: 8,
    // paddingHorizontal: 12,
    // backgroundColor: '#f8f9fa',
    // alignItems: 'center',
  },
  moreText: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },
});

export default DeliveryNoteInfo;
