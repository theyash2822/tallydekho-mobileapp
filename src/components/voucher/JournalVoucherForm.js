import React, {useState, useRef, forwardRef, useImperativeHandle} from 'react';
import {View, Text} from 'react-native';
import {
  SearchableDropdown,
  LabeledInput,
  dummyLedgerstwo,
} from './shared/VoucherComponents';
import {voucherFormStyles} from './shared/VoucherStyles';

// Main Journal Voucher Form
const JournalVoucherForm = forwardRef(({scrollViewRef, isKeyboardVisible}, ref) => {
  // Inputs
  const [debitLedgerSearch, setDebitLedgerSearch] = useState('');
  const [creditLedgerSearch, setCreditLedgerSearch] = useState('');
  const [amount, setAmount] = useState('');
  const [narration, setNarration] = useState('');

  useImperativeHandle(ref, () => ({
    getFormData: () => {
      if (!debitLedgerSearch || !creditLedgerSearch || !amount) return null;
      return {
        drLedger: debitLedgerSearch,
        crLedger: creditLedgerSearch,
        amount: parseFloat(amount) || 0,
        narration,
        date: new Date().toISOString().slice(0, 10),
      };
    },
  }));

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
        value={amount}
        onChangeText={setAmount}
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
        value={narration}
        onChangeText={setNarration}
        inputRef={narrationInputRef}
        returnKeyType="done"
        scrollViewRef={scrollViewRef}
      />
    </View>
  );
});

export default JournalVoucherForm;
