import React, {useState} from 'react';
import {View, Text, TouchableOpacity, Image, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Colors from '../../utils/Colors';
import {CommonLabelStyles, CommonDropdownStyles} from '../../utils/CommonStyles';
import CustomSwitchTwo from '../common/CustomSwitchTwo';

const upiApps = [
  {id: 'bhim', name: 'BHIM', logo: require('../../assets/bhim.jpg')},
  {id: 'gpay', name: 'G Pay', logo: require('../../assets/gpay.png')},
  {id: 'phonepe', name: 'PhonePe', logo: require('../../assets/phonepay.png')},
  {id: 'paytm', name: 'Paytm', logo: require('../../assets/paytm.jpg')},
];

const PaymentCollection = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedApp, setSelectedApp] = useState(upiApps[0]);
  const [isSwitchOn, setIsSwitchOn] = useState(false);

  const selectApp = app => {
    setSelectedApp(app);
    setDropdownOpen(false);
  };

  const toggleSwitch = () => {
    setIsSwitchOn(prev => !prev);
    setDropdownOpen(false); 
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Payment Collection</Text>

      <View style={styles.row}>
        <CustomSwitchTwo isOn={isSwitchOn} onToggle={toggleSwitch} />
        <Text style={styles.label}>Collect Payment Now</Text>
      </View>

      {isSwitchOn && (
        <>
          <Text style={styles.selectLabel}>Select UPI</Text>
          <TouchableOpacity
            style={styles.dropdown}
            onPress={() => setDropdownOpen(!dropdownOpen)}>
            <Image source={selectedApp.logo} style={styles.logo} />
            <Icon
              name={dropdownOpen ? 'chevron-up' : 'chevron-down'}
              size={20}
              color="#000"
            />
          </TouchableOpacity>

          {dropdownOpen && (
            <View style={styles.dropdownList}>
              {upiApps.map(app => (
                <TouchableOpacity
                  key={app.id}
                  style={styles.dropdownItem}
                  onPress={() => selectApp(app)}>
                  <Image source={app.logo} style={styles.logo} />
                  <Text style={styles.appName}>{app.name}</Text>
                  {selectedApp.id === app.id && (
                    <Icon name="checkmark-circle" size={22} color="#34C759" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          )}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#fff',
  },
  heading: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  label: {
    ...CommonLabelStyles.label,
    fontSize: 14,
    marginBottom: 0,
  },
  selectLabel: {
    marginTop: 16,
    fontSize: 14,
    marginBottom: 6,
    color: '#8F939E',
  },
  dropdown: {
    ...CommonDropdownStyles.dropdownInput,
    padding: 6,
    paddingHorizontal: undefined,
    paddingVertical: undefined,
  },
  logo: {
    width: 80,
    height: 34,
    resizeMode: 'contain',
  },
  dropdownList: {
    marginTop: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    justifyContent: 'space-between',
  },
  appName: {
    flex: 1,
  },
});

export default PaymentCollection;
