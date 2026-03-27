import React, {useState} from 'react';
import {View, Text, TextInput, StyleSheet} from 'react-native';
import CountryPickernew from '../common/Countrypicker';
import {Icons} from '../../utils/Constants';
import Colors from '../../utils/Colors';

const PersonalInfoForm = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [showButton, setShowButton] = useState(true);
  const [countryCode, setCountryCode] = useState('+91');

  const handleCountrySelect = country => {
    console.log('Selected Country:', country);
    setCountryCode(country.callingCode); // Assuming country.callingCode gives the country code
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>
        Personal information <Text style={styles.optional}></Text>
        <Text style={styles.asterisk}>*</Text>
        <Text style={styles.optional}>optional</Text>
      </Text>

      {/* Email Input */}
      <TextInput
        placeholder="Email"
        style={styles.input}
        placeholderTextColor="#999"
      />

      <CountryPickernew
        style={{marginTop: 1}}
        onSelect={handleCountrySelect}
        phoneNumber={phoneNumber}
        setPhoneNumber={setPhoneNumber}
        Icons={Icons}
        setShowButton={setShowButton}
        setCountryCode={setCountryCode}
      />
      {/* Address 1 */}
      <TextInput
        placeholder="Address 1"
        style={styles.input}
        placeholderTextColor="#999"
      />

      {/* Address 2 */}
      <TextInput
        placeholder="Address 2"
        style={styles.input}
        placeholderTextColor="#999"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: 12,
    color: Colors.secondaryText,
    marginTop: 10,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  optional: {
    color: Colors.secondaryText,
  },
  asterisk: {
    color: 'red',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    marginBottom: 12,
    fontSize: 14,
    color: Colors.secondaryText,
  },
});

export default PersonalInfoForm;
