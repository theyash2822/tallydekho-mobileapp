import React, {useState, useRef} from 'react';
import {View, Text} from 'react-native';
import {
  SearchableDropdown,
  LabeledInput,
  dummyLedgerstwo,
} from './shared/VoucherComponents';
import {voucherFormStyles} from './shared/VoucherStyles';

// Main Journal Voucher Form
const JournalVoucherForm = ({scrollViewRef, isKeyboardVisible}) => {
  // Inputs
  const [debitLedgerSearch, setDebitLedgerSearch] = useState('');
  const [creditLedgerSearch, setCreditLedgerSearch] = useState('');

  // Refs for input navigation
  const debitLedgerInputRef = useRef(null);
  const creditLedgerInputRef = useRef(null);
  const amountInputRef = useRef(null);
  const narrationInputRef = useRef(null);

  return (
    <View style={voucherFormStyles.container}>
      {/* Voucher Type Header */}
      {/* <VoucherTypeHeader
        icon="book-outline"
        title="Journal Voucher"
        color="#96CEB4"
      /> */}

      <Text style={voucherFormStyles.label}>Debit Ledger</Text>
      <SearchableDropdown
        placeholder="Search Ledger"
        value={debitLedgerSearch}
        onChange={setDebitLedgerSearch}
        data={dummyLedgerstwo}
        scrollViewRef={scrollViewRef}
        inputRef={debitLedgerInputRef}
        nextInputRef={creditLedgerInputRef}
        returnKeyType="next"
      />

      <Text style={voucherFormStyles.label}>Credit Ledger</Text>
      <SearchableDropdown
        placeholder="Search Ledger"
        value={creditLedgerSearch}
        onChange={setCreditLedgerSearch}
        data={dummyLedgerstwo}
        scrollViewRef={scrollViewRef}
        inputRef={creditLedgerInputRef}
        nextInputRef={amountInputRef}
        returnKeyType="next"
      />

      <LabeledInput
        label="Amount"
        placeholder="Enter amount"
        keyboardType="numeric"
        inputRef={amountInputRef}
        nextInputRef={narrationInputRef}
        returnKeyType="next"
        scrollViewRef={scrollViewRef}
        scrollToNextOnFocus={true}
      />

      <LabeledInput
        label="Narration / Notes"
        placeholder="Enter Notes"
        multiline
        style={{height: 80}}
        inputRef={narrationInputRef}
        returnKeyType="done"
        scrollViewRef={scrollViewRef}
      />
    </View>
  );
};

export default JournalVoucherForm;
