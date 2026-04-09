import React, {useState, useMemo} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Colors from '../../utils/Colors';
import {CommonInputStyles, CommonLabelStyles, CommonDropdownStyles} from '../../utils/CommonStyles';

// Static sample lists removed; supply dynamic values from API/state.
const dummyParties = [];
const dummyInvoices = [];
const dummyBanks = [];
const dummyLedgers = [];
const dummyLedgerstwo = [];

const voucherTypes = [
  {type: 'Payment', icon: 'card-outline'},
  {type: 'Receipt', icon: 'download-outline'},
  {type: 'Contra', icon: 'swap-horizontal-outline'},
  {type: 'Journal', icon: 'book-outline'},
];

const paymentMethods = ['Cash', 'Bank', 'UPI'];
const paymentMethodIcons = {
  Cash: 'cash-outline',
  Bank: 'business-outline',
  UPI: 'logo-usd',
};

// ========== Shared Components ========== //
const SearchableDropdown = ({value, onChange, placeholder, data = []}) => {
  const [search, setSearch] = useState('');
  const [show, setShow] = useState(false);

  const filtered = useMemo(
    () =>
      data
        .filter(item => item.toLowerCase().includes(search.toLowerCase()))
        .slice(0, 3),
    [data, search],
  );

  return (
    <>
      <View style={styles.searchContainer}>
        <Icon name="search-outline" size={20} color="#8F939E" />
        <TextInput
          style={styles.searchInput}
          placeholder={placeholder}
          placeholderTextColor="#8F939E"
          value={value}
          onChangeText={text => {
            onChange(text);
            setSearch(text);
            setShow(true);
          }}
        />
      </View>
      {show && search.length > 0 && (
        <View style={styles.dropdownOptions}>
          {filtered.map(item => (
            <TouchableOpacity
              key={item}
              style={styles.option}
              onPress={() => {
                onChange(item);
                setShow(false);
              }}>
              <Text>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </>
  );
};

const LabeledInput = ({label, style, ...props}) => (
  <>
    <Text style={styles.label}>{label}</Text>
    <TextInput
      style={[styles.input, style]}
      placeholderTextColor="#8F939E"
      {...props}
    />
  </>
);

const PaymentMethodDropdown = ({
  selected,
  onSelect,
  showDropdown,
  toggleDropdown,
}) => (
  <>
    <TouchableOpacity
      style={[styles.dropdown, {justifyContent: 'space-around'}]}
      onPress={toggleDropdown}>
      <Icon name="card-outline" size={20} />
      <Text style={[styles.dropdownText, {marginLeft: 0}]}>{selected}</Text>
      <Icon name="chevron-down-outline" size={20} />
    </TouchableOpacity>

    {showDropdown && (
      <View style={styles.floatingDropdown}>
        {paymentMethods.map(method => (
          <TouchableOpacity
            key={method}
            style={styles.option}
            onPress={() => {
              onSelect(method);
              toggleDropdown();
            }}>
            <View style={{flexDirection: 'row', alignItems: 'center', gap: 8}}>
              <Icon
                name={paymentMethodIcons[method] || 'card-outline'}
                size={18}
                style={{marginRight: 6}}
              />
              <Text>{method}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    )}
  </>
);

// ========== Main Form ========== //
const VoucherForm = () => {
  const [selectedVoucher, setSelectedVoucher] = useState('Payment');
  const [showVoucherDropdown, setShowVoucherDropdown] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('Bank');
  const [showPaymentDropdown, setShowPaymentDropdown] = useState(false);

  // Inputs
  const [partySearch, setPartySearch] = useState('');
  const [invoiceSearch, setInvoiceSearch] = useState('');
  const [bankSearch, setBankSearch] = useState('');
  const [fromLedgerSearch, setFromLedgerSearch] = useState('');
  const [toLedgerSearch, setToLedgerSearch] = useState('');
  const [debitLedgerSearch, setDebitLedgerSearch] = useState('');
  const [creditLedgerSearch, setCreditLedgerSearch] = useState('');

  const toggleVoucherDropdown = () =>
    setShowVoucherDropdown(!showVoucherDropdown);
  const togglePaymentDropdown = () =>
    setShowPaymentDropdown(!showPaymentDropdown);

  return (
    <View style={styles.container}>
      {/* Voucher Type */}
      <Text style={styles.label}>Voucher Type</Text>
      <TouchableOpacity style={styles.dropdown} onPress={toggleVoucherDropdown}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Icon
            name={
              voucherTypes.find(v => v.type === selectedVoucher)?.icon ??
              'document-outline'
            }
            size={18}
            style={{marginRight: 8}}
          />
          <Text style={styles.dropdownText}>{selectedVoucher}</Text>
        </View>
        <Icon name="chevron-down-outline" size={20} />
      </TouchableOpacity>

      {showVoucherDropdown && (
        <View style={styles.dropdownOptions}>
          {voucherTypes.map(({type, icon}) => (
            <TouchableOpacity
              key={type}
              style={styles.option}
              onPress={() => {
                setSelectedVoucher(type);
                setShowVoucherDropdown(false);
              }}>
              <View
                style={{flexDirection: 'row', alignItems: 'center', gap: 8}}>
                <Icon name={icon} size={18} />
                <Text>{type}</Text>
              </View>
              {selectedVoucher === type && (
                <Icon name="checkmark" size={18} color="green" />
              )}
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Conditional Sections */}
      {['Payment', 'Receipt'].includes(selectedVoucher) && (
        <>
          {/* Party Name and Invoice */}
          <Text style={styles.label}>Party Name</Text>
          <SearchableDropdown
            placeholder="Search Name"
            value={partySearch}
            onChange={setPartySearch}
            data={dummyParties}
          />

          <Text style={styles.label}>Select Invoice</Text>
          <SearchableDropdown
            placeholder="Search Invoice"
            value={invoiceSearch}
            onChange={setInvoiceSearch}
            data={dummyInvoices}
          />

          {/* Amount and Payment Method */}
          <View style={styles.row}>
            <View style={[styles.inputWrapper, {flex: 0.55, marginRight: 8}]}>
              <LabeledInput
                label="Amount"
                placeholder=""
                keyboardType="numeric"
              />
            </View>

            <View style={[styles.inputWrapper, {flex: 0.45}]}>
              <Text style={styles.label}>Payment Methods</Text>
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
              <Text style={styles.label}>Bank Name</Text>
              <SearchableDropdown
                placeholder="Search Bank"
                value={bankSearch}
                onChange={setBankSearch}
                data={dummyBanks}
              />

              <LabeledInput label="Reference No." placeholder="" />
            </>
          )}

          <LabeledInput
            label="Narration / Notes"
            placeholder="Enter Notes"
            multiline
            style={{height: 50}}
          />
        </>
      )}

      {selectedVoucher === 'Contra' && (
        <>
          <Text style={styles.label}>From Ledger</Text>
          <SearchableDropdown
            placeholder="Search Ledger"
            value={fromLedgerSearch}
            onChange={setFromLedgerSearch}
            data={dummyLedgers}
          />

          <Text style={styles.label}>To Ledger</Text>
          <SearchableDropdown
            placeholder="Search Ledger"
            value={toLedgerSearch}
            onChange={setToLedgerSearch}
            data={dummyLedgers}
          />

          <View style={styles.row}>
            <View style={[styles.halfInput, {marginRight: 8, flex: 0.55}]}>
              <LabeledInput
                label="Amount"
                placeholder=""
                keyboardType="numeric"
              />
            </View>
            <View style={[styles.halfInput, {flex: 0.45}]}>
              <Text style={styles.label}>Mode</Text>
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
            <LabeledInput label="Reference No." placeholder="" />
          )}

          <LabeledInput
            label="Narration / Notes"
            placeholder="Enter Notes"
            multiline
            style={{height: 50}}
          />
        </>
      )}

      {selectedVoucher === 'Journal' && (
        <>
          <Text style={styles.label}>Debit Ledger</Text>
          <SearchableDropdown
            placeholder="Search Ledger"
            value={debitLedgerSearch}
            onChange={setDebitLedgerSearch}
            data={dummyLedgerstwo}
          />

          <Text style={styles.label}>Credit Ledger</Text>
          <SearchableDropdown
            placeholder="Search Ledger"
            value={creditLedgerSearch}
            onChange={setCreditLedgerSearch}
            data={dummyLedgerstwo}
          />

          <LabeledInput label="Amount" placeholder="" keyboardType="numeric" />
          <LabeledInput
            label="Narration / Notes"
            placeholder="Enter Notes"
            multiline
            style={{height: 50}}
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    padding: 12,
    backgroundColor: '#fff',
    borderTopRightRadius:8,
    borderTopLeftRadius:8
  },
  label: {
    ...CommonLabelStyles.label,
    fontSize: 14,
    marginTop: 16,
    marginBottom: 4,
  },
  input: {
    ...CommonInputStyles.textInput,
    height: 44,
    color: '#000',
    paddingVertical: 0,
  },
  dropdown: {
    ...CommonDropdownStyles.dropdownInput,
    height: 44,
    paddingVertical: 0,
  },
  dropdownText: {
    fontSize: 14,
    color: '#333',
  },
  dropdownOptions: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderColor: Colors.border,
    borderWidth: 1,
    marginTop: 4,
    zIndex: 100,
  },
  option: {
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 44,
    backgroundColor: '#fff',
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#000',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 8,
    position: 'relative',
  },
  halfInput: {
    flex: 1,
    position: 'relative',
  },
  floatingDropdown: {
    position: 'absolute',
    top: 90,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderColor: Colors.border,
    borderWidth: 1,
    elevation: 4,
    zIndex: 999,
  },
  inputWrapper: {
    paddingHorizontal: 1,
  },
});

export default VoucherForm;





//Perfect Dynamic Code maybe!! handles all of the data in the voucher also uncomment and replace before using the perfect code
// import React, {useState, useMemo} from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
// } from 'react-native';
// import Icon from 'react-native-vector-icons/Ionicons';
// import Colors from '../../utils/Colors';

// const dummyParties = ['Amit Enterprises', 'Global Traders', 'Sharma Stores'];
// const dummyInvoices = ['INV001', 'INV002', 'INV003'];
// const dummyBanks = ['HDFC', 'SBI', 'ICICI'];
// const dummyLedgers = ['Cash', 'Bank', 'Expenses'];
// const dummyLedgerstwo = ['Sales', 'Purchases', 'Commission'];

// const voucherTypes = [
//   {type: 'Payment', icon: 'card-outline'},
//   {type: 'Receipt', icon: 'download-outline'},
//   {type: 'Contra', icon: 'swap-horizontal-outline'},
//   {type: 'Journal', icon: 'book-outline'},
// ];

// const paymentMethods = ['Cash', 'Bank', 'UPI'];
// const paymentMethodIcons = {
//   Cash: 'cash-outline',
//   Bank: 'business-outline',
//   UPI: 'logo-usd',
// };

// const SearchableDropdown = ({value, onChange, placeholder, data = []}) => {
//   const [search, setSearch] = useState('');
//   const [show, setShow] = useState(false);

//   const filtered = useMemo(
//     () =>
//       data
//         .filter(item => item.toLowerCase().includes(search.toLowerCase()))
//         .slice(0, 3),
//     [data, search],
//   );

//   return (
//     <>
//       <View style={styles.searchContainer}>
//         <Icon name="search-outline" size={20} color="#8F939E" />
//         <TextInput
//           style={styles.searchInput}
//           placeholder={placeholder}
//           placeholderTextColor="#8F939E"
//           value={value}
//           onChangeText={text => {
//             onChange(text);
//             setSearch(text);
//             setShow(true);
//           }}
//         />
//       </View>
//       {show && search.length > 0 && (
//         <View style={styles.dropdownOptions}>
//           {filtered.map(item => (
//             <TouchableOpacity
//               key={item}
//               style={styles.option}
//               onPress={() => {
//                 onChange(item);
//                 setShow(false);
//               }}>
//               <Text>{item}</Text>
//             </TouchableOpacity>
//           ))}
//         </View>
//       )}
//     </>
//   );
// };

// const LabeledInput = ({label, value, onChangeText, style, ...props}) => (
//   <>
//     <Text style={styles.label}>{label}</Text>
//     <TextInput
//       style={[styles.input, style]}
//       placeholderTextColor="#8F939E"
//       value={value}
//       onChangeText={onChangeText}
//       {...props}
//     />
//   </>
// );

// const PaymentMethodDropdown = ({selected, onSelect, showDropdown, toggleDropdown}) => (
//   <>
//     <TouchableOpacity
//       style={[styles.dropdown, {justifyContent: 'space-around'}]}
//       onPress={toggleDropdown}>
//       <Icon name="card-outline" size={20} />
//       <Text style={[styles.dropdownText, {marginLeft: 0}]}>{selected}</Text>
//       <Icon name="chevron-down-outline" size={20} />
//     </TouchableOpacity>

//     {showDropdown && (
//       <View style={styles.floatingDropdown}>
//         {paymentMethods.map(method => (
//           <TouchableOpacity
//             key={method}
//             style={styles.option}
//             onPress={() => {
//               onSelect(method);
//               toggleDropdown();
//             }}>
//             <View style={{flexDirection: 'row', alignItems: 'center', gap: 8}}>
//               <Icon
//                 name={paymentMethodIcons[method] || 'card-outline'}
//                 size={18}
//                 style={{marginRight: 6}}
//               />
//               <Text>{method}</Text>
//             </View>
//           </TouchableOpacity>
//         ))}
//       </View>
//     )}
//   </>
// );

// const VoucherForm = ({data, onChange}) => {
//   const [showVoucherDropdown, setShowVoucherDropdown] = useState(false);
//   const [showPaymentDropdown, setShowPaymentDropdown] = useState(false);

//   const toggleVoucherDropdown = () => setShowVoucherDropdown(!showVoucherDropdown);
//   const togglePaymentDropdown = () => setShowPaymentDropdown(!showPaymentDropdown);

//   return (
//     <View style={styles.container}>
//       <Text style={styles.label}>Voucher Type</Text>
//       <TouchableOpacity style={styles.dropdown} onPress={toggleVoucherDropdown}>
//         <View style={{flexDirection: 'row', alignItems: 'center'}}>
//           <Icon
//             name={voucherTypes.find(v => v.type === data.type)?.icon ?? 'document-outline'}
//             size={18}
//             style={{marginRight: 8}}
//           />
//           <Text style={styles.dropdownText}>{data.type}</Text>
//         </View>
//         <Icon name="chevron-down-outline" size={20} />
//       </TouchableOpacity>

//       {showVoucherDropdown && (
//         <View style={styles.dropdownOptions}>
//           {voucherTypes.map(({type, icon}) => (
//             <TouchableOpacity
//               key={type}
//               style={styles.option}
//               onPress={() => {
//                 onChange('type', type);
//                 setShowVoucherDropdown(false);
//               }}>
//               <View style={{flexDirection: 'row', alignItems: 'center', gap: 8}}>
//                 <Icon name={icon} size={18} />
//                 <Text>{type}</Text>
//               </View>
//               {data.type === type && <Icon name="checkmark" size={18} color="green" />}
//             </TouchableOpacity>
//           ))}
//         </View>
//       )}

//       {['Payment', 'Receipt'].includes(data.type) && (
//         <>
//           <Text style={styles.label}>Party Name</Text>
//           <SearchableDropdown
//             placeholder="Search Name"
//             value={data.partyName}
//             onChange={text => onChange('partyName', text)}
//             data={dummyParties}
//           />

//           <Text style={styles.label}>Select Invoice</Text>
//           <SearchableDropdown
//             placeholder="Search Invoice"
//             value={data.invoice}
//             onChange={text => onChange('invoice', text)}
//             data={dummyInvoices}
//           />

//           <View style={styles.row}>
//             <View style={[styles.inputWrapper, {flex: 0.55, marginRight: 8}]}>
//               <LabeledInput
//                 label="Amount"
//                 value={data.amount}
//                 onChangeText={text => onChange('amount', text)}
//                 keyboardType="numeric"
//               />
//             </View>

//             <View style={[styles.inputWrapper, {flex: 0.45}]}>
//               <Text style={styles.label}>Payment Methods</Text>
//               <PaymentMethodDropdown
//                 selected={data.paymentMethod}
//                 onSelect={method => onChange('paymentMethod', method)}
//                 showDropdown={showPaymentDropdown}
//                 toggleDropdown={togglePaymentDropdown}
//               />
//             </View>
//           </View>

//           {data.paymentMethod !== 'Cash' && (
//             <>
//               <Text style={styles.label}>Bank Name</Text>
//               <SearchableDropdown
//                 placeholder="Search Bank"
//                 value={data.bankName}
//                 onChange={text => onChange('bankName', text)}
//                 data={dummyBanks}
//               />
//               <LabeledInput
//                 label="Reference No."
//                 value={data.referenceNo}
//                 onChangeText={text => onChange('referenceNo', text)}
//               />
//             </>
//           )}

//           <LabeledInput
//             label="Narration / Notes"
//             value={data.narration}
//             onChangeText={text => onChange('narration', text)}
//             placeholder="Enter Notes"
//             multiline
//             style={{height: 50}}
//           />
//         </>
//       )}

//       {data.type === 'Contra' && (
//         <>
//           <Text style={styles.label}>From Ledger</Text>
//           <SearchableDropdown
//             placeholder="Search Ledger"
//             value={data.fromLedger}
//             onChange={text => onChange('fromLedger', text)}
//             data={dummyLedgers}
//           />

//           <Text style={styles.label}>To Ledger</Text>
//           <SearchableDropdown
//             placeholder="Search Ledger"
//             value={data.toLedger}
//             onChange={text => onChange('toLedger', text)}
//             data={dummyLedgers}
//           />

//           <View style={styles.row}>
//             <View style={[styles.halfInput, {marginRight: 8, flex: 0.55}]}>
//               <LabeledInput
//                 label="Amount"
//                 value={data.amount}
//                 onChangeText={text => onChange('amount', text)}
//                 keyboardType="numeric"
//               />
//             </View>
//             <View style={[styles.halfInput, {flex: 0.45}]}>
//               <Text style={styles.label}>Mode</Text>
//               <PaymentMethodDropdown
//                 selected={data.paymentMethod}
//                 onSelect={method => onChange('paymentMethod', method)}
//                 showDropdown={showPaymentDropdown}
//                 toggleDropdown={togglePaymentDropdown}
//               />
//             </View>
//           </View>

//           {data.paymentMethod !== 'Cash' && (
//             <LabeledInput
//               label="Reference No."
//               value={data.referenceNo}
//               onChangeText={text => onChange('referenceNo', text)}
//             />
//           )}

//           <LabeledInput
//             label="Narration / Notes"
//             value={data.narration}
//             onChangeText={text => onChange('narration', text)}
//             placeholder="Enter Notes"
//             multiline
//             style={{height: 50}}
//           />
//         </>
//       )}

//       {data.type === 'Journal' && (
//         <>
//           <Text style={styles.label}>Debit Ledger</Text>
//           <SearchableDropdown
//             placeholder="Search Ledger"
//             value={data.debitLedger}
//             onChange={text => onChange('debitLedger', text)}
//             data={dummyLedgerstwo}
//           />

//           <Text style={styles.label}>Credit Ledger</Text>
//           <SearchableDropdown
//             placeholder="Search Ledger"
//             value={data.creditLedger}
//             onChange={text => onChange('creditLedger', text)}
//             data={dummyLedgerstwo}
//           />

//           <LabeledInput
//             label="Amount"
//             value={data.amount}
//             onChangeText={text => onChange('amount', text)}
//             keyboardType="numeric"
//           />

//           <LabeledInput
//             label="Narration / Notes"
//             value={data.narration}
//             onChangeText={text => onChange('narration', text)}
//             placeholder="Enter Notes"
//             multiline
//             style={{height: 50}}
//           />
//         </>
//       )}
//     </View>
//   );
// };