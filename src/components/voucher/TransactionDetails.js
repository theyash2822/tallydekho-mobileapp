import React, {useState} from 'react';
import {View, Text, TextInput, StyleSheet} from 'react-native';
import AmountInputWithCurrency from '../notes/AmountWithCurrency';
import CustomCalendar from '../../pages/Calender';
import DropdownSelector from './DropdownSelector';
import Colors from '../../utils/Colors';

const TransactionDetails = ({
  showDate = true,
  showDebit = true,
  showCredit = true,
  showVoucherNumber = true,
  showAmountBoxAtTop = false,
  showAmountBoxAtBottom = true,
  labelDate = 'Date',
  labelDebit = 'Debit Bank Account',
  labelCredit = 'Credit Bank Account',
  labelAmount = 'Amount',
}) => {
  const [voucherNumber, setVoucherNumber] = useState('');

  const [selectedDebit, setSelectedDebit] = useState('Customer A');
  const [selectedCredit, setSelectedCredit] = useState('Customer A');
  const customers = ['Customer A', 'Customer B', 'Customer C'];

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Transaction Details</Text>

      {showVoucherNumber && (
        <>
          <Text style={styles.label}>Voucher Number</Text>
          <TextInput
            style={styles.input}
            secureTextEntry
            placeholder="***************"
            placeholderTextColor={Colors.secondaryText}
            value={voucherNumber}
            onChangeText={setVoucherNumber}
          />
        </>
      )}

      {showDate && (
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

      {showAmountBoxAtTop && (
        <>
          <AmountInputWithCurrency label="Transfer Amount" />
        </>
      )}

      {showDebit && (
        <DropdownSelector
          label={labelDebit}
          options={customers}
          selectedValue={selectedDebit}
          onValueChange={setSelectedDebit}
        />
      )}

      {showCredit && (
        <DropdownSelector
          label={labelCredit}
          options={customers}
          selectedValue={selectedCredit}
          onValueChange={setSelectedCredit}
        />
      )}
      {showAmountBoxAtBottom && (
        <>
          <AmountInputWithCurrency />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    backgroundColor: Colors.white,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  header: {
    fontWeight: '600',
    marginVertical: 6,
    color: Colors.primaryTitle,
    fontSize: 16,
  },
  label: {
    marginVertical: 6,
    color: Colors.secondaryText,
    fontSize: 12,
    fontWeight: '400',
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    padding: 10,
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

export default TransactionDetails;
