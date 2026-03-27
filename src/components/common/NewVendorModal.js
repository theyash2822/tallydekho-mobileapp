import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/Ionicons'; // for dropdown icon
import Colors from '../../utils/Colors';

const AddNewVendorBottomSheet = ({visible, onClose, onAddVendor}) => {
  const [businessName, setBusinessName] = useState('');
  const [gstin, setGstin] = useState('');
  const [contactName, setContactName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');

  const isFormValid =
    businessName.trim() &&
    gstin.trim() &&
    contactName.trim() &&
    phoneNumber.trim() &&
    address.trim() &&
    city.trim() &&
    country.trim();

  const handleAdd = () => {
    if (isFormValid) {
      const vendorData = {
        businessName: businessName.trim(),
        gstin: gstin.trim(),
        contactName: contactName.trim(),
        phoneNumber: phoneNumber.trim(),
        address: address.trim(),
        city: city.trim(),
        country: country.trim(),
      };

      onAddVendor(vendorData);

      // Reset all fields
      setBusinessName('');
      setGstin('');
      setContactName('');
      setPhoneNumber('');
      setAddress('');
      setCity('');
      setCountry('');

      // Optionally close the modal too:
      onClose();
    }
  };

  return (
    <Modal
      isVisible={visible}
      onBackdropPress={onClose}
      style={styles.modal}
      swipeDirection="down"
      onSwipeComplete={onClose}
      backdropOpacity={0.4}
      useNativeDriver={true}
      propagateSwipe={true}>
      <View style={styles.sheet}>
        <View style={styles.handle} />
        <Text style={styles.title}>Add New Vendor</Text>

        <ScrollView contentContainerStyle={{paddingBottom: 30}}>
          <Text style={styles.sectionTitle}>Business Name</Text>
          <TextInput
            value={businessName}
            onChangeText={setBusinessName}
            placeholder="FiscalFlow Ltd., etc."
            placeholderTextColor={Colors.secondaryText}
            style={styles.input}
          />
          <Text style={styles.sectionTitle}>GSTIN</Text>
          <TextInput
            value={gstin}
            onChangeText={setGstin}
            placeholder="GSTIN"
            placeholderTextColor={Colors.secondaryText}
            style={styles.input}
          />

          <Text style={styles.sectionTitle}>Contact information</Text>
          <TextInput
            value={contactName}
            onChangeText={setContactName}
            placeholder="Contact person name"
            placeholderTextColor={Colors.secondaryText}
            style={styles.input}
          />
          <TextInput
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            placeholder="Phone number"
            placeholderTextColor={Colors.secondaryText}
            style={styles.input}
            keyboardType="phone-pad"
          />

          <Text style={styles.sectionTitle}>Address</Text>
          <TextInput
            value={address}
            onChangeText={setAddress}
            placeholder="house/flat number, street name, etc."
            placeholderTextColor={Colors.secondaryText}
            style={styles.input}
          />

          <TextInput
            value={city}
            onChangeText={setCity}
            placeholder="City"
            placeholderTextColor={Colors.secondaryText}
            style={styles.input}
          />
          <TextInput
            value={country}
            onChangeText={setCountry}
            placeholder="Country"
            placeholderTextColor={Colors.secondaryText}
            style={styles.input}
          />
          {/* <View style={[styles.input, styles.dropdown]}>
            <Text style={styles.dropdownText}>Country</Text>
            <Icon name="chevron-down-outline" size={20} color="#8F939E" />
          </View> */}

          <TouchableOpacity
            style={[
              styles.addButton,
              {backgroundColor: isFormValid ? '#07624C' : '#ccc'},
            ]}
            onPress={handleAdd}
            disabled={!isFormValid}>
            <Text style={styles.addButtonText}>Add Vendor</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  sheet: {
    backgroundColor: Colors.backgroundColorPrimary,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    maxHeight: '90%',
  },
  handle: {
    width: 40,
    height: 5,
    backgroundColor: '#ccc',
    borderRadius: 3,
    alignSelf: 'center',
    marginBottom: 10,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 20,
    marginBottom: 16,
    color: '#1F2736',
  },
  sectionTitle: {
    fontWeight: '500',
    fontSize: 12,
    marginVertical: 10,
    color: Colors.secondaryText,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    color: Colors.black,
    fontSize: 14,
    backgroundColor: Colors.white,
  },
  // dropdown: {
  //   flexDirection: 'row',
  //   justifyContent: 'space-between',
  //   alignItems: 'center',
  // },
  // dropdownText: {
  //   color: Colors.secondaryText,
  //   fontSize: 14,
  // },
  addButton: {
    backgroundColor: '#07624C',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  addButtonText: {
    color: Colors.white,
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default AddNewVendorBottomSheet;
