import React, {useState, useRef, forwardRef, useImperativeHandle} from 'react';
import {View, Text} from 'react-native';
import {
  SearchableDropdown,
  LabeledInput,
  PaymentMethodDropdown,
  EMPTY_OPTIONS,
} from './shared/VoucherComponents';
import {voucherFormStyles} from './shared/VoucherStyles';

// Main Contra Voucher Form
const ContraVoucherForm = forwardRef(({
  scrollViewRef,
  isKeyboardVisible,
  ledgerOptions = EMPTY_OPTIONS,
}, ref) => {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('Bank');
  const [showPaymentDropdown, setShowPaymentDropdown] = useState(false);

  // Inputs
  const [fromLedgerSearch, setFromLedgerSearch] = useState('');
  const [toLedgerSearch, setToLedgerSearch] = useState('');
  const [amount, setAmount] = useState('');
  const [narration, setNarration] = useState('');

  useImperativeHandle(ref, () => ({
    getFormData: () => {
      if (!fromLedgerSearch || !toLedgerSearch || !amount) return null;
      return {
        fromLedger: fromLedgerSearch,
        toLedger: toLedgerSearch,
        amount: parseFloat(amount) || 0,
        narration,
        date: new Date().toISOString().slice(0, 10),
      };
    },
  }));

  // Refs for input navigation
  const fromLedgerInputRef = useRef(null);
  const toLedgerInputRef = useRef(null);
  const amountInputRef = useRef(null);
  const refNoInputRef = useRef(null);
  const narrationInputRef = useRef(null);

  const togglePaymentDropdown = () =>
    setShowPaymentDropdown(!showPaymentDropdown);

  return (
    <View style={voucherFormStyles.container}>
      {/* Voucher Type Header */}
      {/* <VoucherTypeHeader
        icon="swap-horizontal-outline"
        title="Contra Voucher"
        color="#45B7D1"
      /> */}

      <Text style={voucherFormStyles.label}>From Ledger</Text>
      <SearchableDropdown
        placeholder="Search Ledger"
        value={fromLedgerSearch}
        onChange={setFromLedgerSearch}
        data={ledgerOptions}
        scrollViewRef={scrollViewRef}
        inputRef={fromLedgerInputRef}
        nextInputRef={toLedgerInputRef}
        returnKeyType="next"
      />

      <Text style={voucherFormStyles.label}>To Ledger</Text>
      <SearchableDropdown
        placeholder="Search Ledger"
        value={toLedgerSearch}
        onChange={setToLedgerSearch}
        data={ledgerOptions}
        scrollViewRef={scrollViewRef}
        inputRef={toLedgerInputRef}
        nextInputRef={amountInputRef}
        returnKeyType="next"
      />

      <View style={voucherFormStyles.row}>
        <View
          style={[voucherFormStyles.halfInput, {marginRight: 8, flex: 0.55}]}>
          <LabeledInput
            label="Amount"
            placeholder="Enter amount"
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
            inputRef={amountInputRef}
            nextInputRef={selectedPaymentMethod !== 'Cash' ? refNoInputRef : narrationInputRef}
            returnKeyType="next"
            scrollViewRef={scrollViewRef}
            scrollToNextOnFocus={selectedPaymentMethod === 'Cash'}
          />
        </View>
        <View style={[voucherFormStyles.halfInput, {flex: 0.45}]}>
          <Text style={voucherFormStyles.label}>Mode</Text>
          <PaymentMethodDropdown
            selected={selectedPaymentMethod}
            onSelect={setSelectedPaymentMethod}
            showDropdown={showPaymentDropdown}
            toggleDropdown={togglePaymentDropdown}
          />
        </View>
      </View>

      {/* Conditionally show Reference No. only if NOT Cash */}
      {selectedPaymentMethod !== 'Cash' && (
        <LabeledInput
          label="Reference No."
          placeholder="Enter reference number"
          inputRef={refNoInputRef}
          nextInputRef={narrationInputRef}
          returnKeyType="next"
          scrollViewRef={scrollViewRef}
          scrollToNextOnFocus={true}
        />
      )}

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

export default ContraVoucherForm;
