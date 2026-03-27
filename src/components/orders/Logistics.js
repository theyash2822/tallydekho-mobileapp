import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import CustomSwitch from '../common/CustomSwitch';
import AmountInputWithCurrency from '../notes/AmountWithCurrency';
import CustomCalendar from '../../pages/Calender';
import Colors from '../../utils/Colors';

const LogisticsCard = ({
  showDeliveryDate = true,
  showRefNumber = true,
  showHeader = true,
  labelDate = 'Expected Delivery Date',
}) => {
  return (
    <View style={styles.container}>
      {showHeader && <Text style={styles.header}>Logistics</Text>}

      {/* Logistics Shipping Cost */}
      <AmountInputWithCurrency label={'Logistics/Shipping Costs'} />

      {/* Toggle for Tax on Logistics */}
      <View style={styles.toggleRow}>
        <CustomSwitch />
        <Text style={styles.toggleLabel}>Tax on Logistics</Text>
      </View>

      {/* Expected Delivery Date */}
      {showDeliveryDate && (
        <>
          <Text style={styles.label}>{labelDate}</Text>
          <View style={styles.dateBox}>
            <CustomCalendar
              width="100%"
              label="Date"
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}
            />
          </View>
        </>
      )}

      {/* Ref Number */}
      {showRefNumber && (
        <>
          <Text style={[styles.label, {marginTop: 8}]}>Ref. Number</Text>
          <TextInput
            style={styles.refInput}
            placeholder="INV-20250204-4136"
            placeholderTextColor={Colors.secondaryText}
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 14,
    backgroundColor: Colors.white,
    padding: 12,
    marginTop: 10,
  },
  header: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
    color: Colors.primaryTitle,
  },
  label: {
    fontSize: 13,
    color: Colors.secondaryText,
    marginBottom: 6,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 10,
  },
  toggleLabel: {
    fontSize: 12,
    marginLeft: 10,
    color: Colors.secondaryText,
  },
  datePickerBox: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  dateText: {
    fontSize: 13,
    color: Colors.primaryText,
  },
  dropdownIcon: {
    fontSize: 12,
    color: '#6F7C97',
  },
  refInput: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    fontSize: 13,
    color: Colors.secondaryText,
  },
  dateBox: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 10,
    paddingHorizontal: 5,
    paddingVertical: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default LogisticsCard;
