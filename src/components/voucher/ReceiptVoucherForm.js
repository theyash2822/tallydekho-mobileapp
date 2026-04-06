import React, {useState, useRef, forwardRef, useImperativeHandle} from 'react';
import {View, Text} from 'react-native';
import {
  SearchableDropdown,
  LabeledInput,
  PaymentMethodDropdown,
  dummyParties,
  dummyInvoices,
  dummyBanks,
} from './shared/VoucherComponents';
import {voucherFormStyles} from './shared/VoucherStyles';

// Main Receipt Voucher Form
const ReceiptVoucherForm = forwardRef(({scrollViewRef, isKeyboardVisible}, ref) => {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('Bank');
  const [showPaymentDropdown, setShowPaymentDropdown] = useState(false);

  // Inputs
  const [partySearch, setPartySearch] = useState('');
  const [invoiceSearch, setInvoiceSearch] = useState('');
  const [bankSearch, setBankSearch] = useState('');
  const [amount, setAmount] = useState('');
  const [refNo, setRefNo] = useState('');
  const [narration, setNarration] = useState('');

  useImperativeHandle(ref, () => ({
    getFormData: () => {
      if (!partySearch || !amount) return null;
      return {
        partyLedger: partySearch,
        bankLedger: bankSearch || (selectedPaymentMethod === 'Cash' ? 'Cash in Hand' : ''),
        amount: parseFloat(amount) || 0,
        reference: refNo,
        narration,
        date: new Date().toISOString().slice(0, 10),
      };
    },
  }));

  // Refs for input navigation
  const partyInputRef = useRef(null);
  const invoiceInputRef = useRef(null);
  const amountInputRef = useRef(null);
  const bankInputRef = useRef(null);
  const refNoInputRef = useRef(null);
  const narrationInputRef = useRef(null);

  const togglePaymentDropdown = () =>
    setShowPaymentDropdown(!showPaymentDropdown);

  return (
    <View style={voucherFormStyles.container}>
      {/* Voucher Type Header */}
      {/* <VoucherTypeHeader
        icon="download-outline"
        title="Receipt Voucher"
        color="#4ECDC4"
      /> */}

      {/* Party Name and Invoice */}
      <Text style={voucherFormStyles.label}>Party Name</Text>
      <SearchableDropdown
        placeholder="Search Name"
        value={partySearch}
        onChange={setPartySearch}
        data={dummyParties}
        scrollViewRef={scrollViewRef}
        inputRef={partyInputRef}
        nextInputRef={invoiceInputRef}
        returnKeyType="next"
      />

      <Text style={voucherFormStyles.label}>Select Invoice</Text>
      <SearchableDropdown
        placeholder="Search Invoice"
        value={invoiceSearch}
        onChange={setInvoiceSearch}
        data={dummyInvoices}
        scrollViewRef={scrollViewRef}
        inputRef={invoiceInputRef}
        nextInputRef={amountInputRef}
        returnKeyType="next"
      />

      {/* Amount and Payment Method */}
      <View style={voucherFormStyles.row}>
        <View
          style={[
            voucherFormStyles.inputWrapper,
            {flex: 0.55, marginRight: 8},
          ]}>
          <LabeledInput
            label="Amount"
            placeholder="Enter amount"
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
            inputRef={amountInputRef}
            nextInputRef={selectedPaymentMethod !== 'Cash' ? bankInputRef : narrationInputRef}
            returnKeyType="next"
            scrollViewRef={scrollViewRef}
            scrollToNextOnFocus={selectedPaymentMethod === 'Cash'}
          />
        </View>

        <View style={[voucherFormStyles.inputWrapper, {flex: 0.45}]}>
          <Text style={voucherFormStyles.label}>Payment Methods</Text>
          <PaymentMethodDropdown
            selected={selectedPaymentMethod}
            onSelect={setSelectedPaymentMethod}
            showDropdown={showPaymentDropdown}
            toggleDropdown={togglePaymentDropdown}
          />
        </View>
      </View>

      {/* Conditionally show Bank Name and Ref No only if NOT Cash */}
      {selectedPaymentMethod !== 'Cash' && (
        <>
          <Text style={voucherFormStyles.label}>Bank Name</Text>
          <SearchableDropdown
            placeholder="Search Bank"
            value={bankSearch}
            onChange={setBankSearch}
            data={dummyBanks}
            scrollViewRef={scrollViewRef}
            inputRef={bankInputRef}
            nextInputRef={refNoInputRef}
            returnKeyType="next"
          />

          <LabeledInput
            label="Reference No."
            placeholder="Enter reference number"
            inputRef={refNoInputRef}
            nextInputRef={narrationInputRef}
            returnKeyType="next"
            scrollViewRef={scrollViewRef}
            scrollToNextOnFocus={true}
          />
        </>
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

export default ReceiptVoucherForm;

