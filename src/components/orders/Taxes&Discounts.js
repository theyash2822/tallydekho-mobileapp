// import React, {useState} from 'react';
// import {
//   View,
//   Text,
//   Image,
//   StyleSheet,
//   TouchableOpacity,
//   TouchableWithoutFeedback,
//   TextInput,
// } from 'react-native';
// import {RadioButton, Checkbox} from 'react-native-paper';
// import CustomSwitch from '../common/CustomSwitch';

// const TaxesAndDiscounts = () => {
//   const [discountType, setDiscountType] = useState('percentage');
//   const [selectedProducts, setSelectedProducts] = useState({});
//   const [applyToInvoice, setApplyToInvoice] = useState(false);

//   // const [taxInputs, setTaxInputs] = useState(['', '', '']);
//   const [taxes, setTaxes] = useState([
//     {label: 'GST', amount: ''},
//     {label: 'CGST', amount: ''},
//     {label: 'SGST', amount: ''},
//   ]);

//   // const handleTaxInputChange = (index, value) => {
//   //   const updatedInputs = [...taxInputs];
//   //   updatedInputs[index] = value;
//   //   setTaxInputs(updatedInputs);
//   // };

//   const products = [
//     {
//       id: '1',
//       name: 'Samsung Galaxy J1 Bluetooth',
//       image: require('../../assets/logo.png'),
//       bgColor: '#EDE8FF',
//     },
//     {
//       id: '2',
//       name: 'Black JBL portable Bluetooth Speaker',
//       image: require('../../assets/logo.png'),
//       bgColor: '#FFF4D8',
//     },
//   ];

//   const toggleProductSelection = id => {
//     setSelectedProducts(prev => ({
//       ...prev,
//       [id]: !prev[id],
//     }));
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.header}>
//         Taxes and Discounts <Text style={styles.asterisk}>*</Text>
//         <Text style={styles.optional}> optional</Text>
//       </Text>

//       <Text style={[styles.sectionTitle, {marginBottom: 8}]}>Tax</Text>

//       {taxes.map((tax, index) => (
//         <View style={styles.taxBox} key={tax.label}>
//           <Text style={styles.taxLabel}>{tax.label}</Text>
//           <View style={styles.divider} />
//           <TextInput
//             style={styles.taxInput}
//             placeholder="₹5000 | 18% | INR6000.00"
//             placeholderTextColor={Colors.secondaryText}
//             value={tax.amount}
//             onChangeText={text => {
//               const updated = [...taxes];
//               updated[index].amount = text;
//               setTaxes(updated);
//             }}
//           />
//         </View>
//       ))}

//       <View style={styles.toggleWrapper}>
//         <CustomSwitch />
//         <Text style={styles.toggleText}>
//           Separate Tax Calculation for Logistics
//         </Text>
//       </View>

//       {/* Discount Type */}
//       <Text style={[styles.sectionTitle, {marginTop: 16}]}>Discounts</Text>

//       <RadioButton.Group
//         onValueChange={newValue => setDiscountType(newValue)}
//         value={discountType}>
//         <View style={styles.discountRow}>
//           <RadioButton.Item
//             label="Percentages %"
//             value="percentage"
//             color="#16C47F"
//             uncheckedColor="#8F939E"
//             labelStyle={
//               discountType === 'percentage'
//                 ? styles.discountTextActive
//                 : styles.discountText
//             }
//             style={[
//               styles.discountOption,
//               discountType === 'percentage' && styles.discountOptionActive,
//             ]}
//             rippleColor="transparent" // ✅ Fully disables ripple blink
//             theme={{colors: {ripple: 'transparent'}}} // extra safety
//             position="leading"
//           />

//           <RadioButton.Item
//             label="Flat discounts ₹"
//             value="flat"
//             color="#16C47F"
//             uncheckedColor="#8F939E"
//             labelStyle={
//               discountType === 'flat'
//                 ? styles.discountTextActive
//                 : styles.discountText
//             }
//             style={[
//               styles.discountOption,
//               discountType === 'flat' && styles.discountOptionActive,
//             ]}
//             rippleColor="transparent"
//             theme={{colors: {ripple: 'transparent'}}}
//             position="leading"
//           />
//         </View>
//       </RadioButton.Group>

//       {/* Product list */}
//       <Text style={[styles.sectionTitle, {marginTop: 16}]}>Product(s)</Text>
//       {products.map(product => (
//         <View style={styles.productItem} key={product.id}>
//           <View
//             style={[
//               styles.productImageWrapper,
//               {backgroundColor: product.bgColor},
//             ]}>
//             <Image source={product.image} style={styles.productImage} />
//           </View>
//           <Text style={styles.productName}>{product.name}</Text>

//           <TouchableWithoutFeedback
//             onPress={() => toggleProductSelection(product.id)}>
//             <View>
//               <Checkbox
//                 status={selectedProducts[product.id] ? 'checked' : 'unchecked'}
//                 color="#2E7D32"
//                 uncheckedColor="#000"
//                 theme={{colors: {ripple: 'transparent'}}} // Optional
//               />
//             </View>
//           </TouchableWithoutFeedback>
//         </View>
//       ))}

//       {/* Apply to entire invoice */}
//       <View style={styles.applyInvoiceWrapper}>
//         <TouchableWithoutFeedback
//           onPress={() => setApplyToInvoice(!applyToInvoice)}>
//           <View>
//             <Checkbox
//               status={applyToInvoice ? 'checked' : 'unchecked'}
//               color="#2E7D32"
//               uncheckedColor="#000"
//               theme={{colors: {ripple: 'transparent'}}} // optional, won't matter now
//             />
//           </View>
//         </TouchableWithoutFeedback>

//         <Text style={styles.applyInvoiceText}>Apply to entire invoice</Text>
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     borderRadius: 14,
//     backgroundColor: Colors.white,
//     padding: 12,
//     marginTop: 10,
//   },
//   header: {
//     fontSize: 16,
//     fontWeight: '600',
//     marginBottom: 12,
//     color: Colors.primaryTitle,
//   },
//   optional: {
//     color: Colors.secondaryText,
//     fontSize: 12,
//   },
//   asterisk: {
//     color: 'red',
//     fontSize: 12,
//   },
//   sectionTitle: {
//     fontWeight: '400',
//     fontSize: 12,
//     color: Colors.secondaryText,
//   },
//   divider: {
//     height: '70%',
//     width: 1,
//     backgroundColor: '#e4e4e4',
//     marginRight: 8,
//   },
//   taxBox: {
//     borderWidth: 1,
//     borderColor: '#ECECEC',
//     borderRadius: 10,
//     padding: 10,
//     marginBottom: 10,
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingRight: 8,
//   },
//   taxLabel: {
//     fontWeight: '600',
//     color: '#16C47F',
//     marginRight: 4,
//   },
//   taxAmount: {
//     fontSize: 14,
//     color: Colors.secondaryText,
//   },
//   toggleWrapper: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginTop: 6,
//   },
//   toggleText: {
//     marginLeft: 10,
//     fontSize: 13,
//     color: '#6F7C97',
//   },
//   taxInput: {
//     flex: 1,
//     fontSize: 14,
//     color: Colors.primaryText,
//     paddingVertical: 4,
//   },

//   discountRow: {
//     flexDirection: 'row',
//     marginTop: 10,
//     gap: 10,
//   },
//   discountOption: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: '#ECECEC',
//     flex: 1,
//     padding: 10,
//   },
//   discountOptionActive: {
//     borderColor: Colors.border,
//     backgroundColor: Colors.white,
//   },
//   discountText: {
//     fontSize: 13,
//     color: '#6F7C97',
//   },
//   discountTextActive: {
//     fontSize: 13,
//     fontWeight: '600',
//     color: Colors.secondaryText,
//   },
//   productItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: 10,
//   },
//   productImageWrapper: {
//     height: 40,
//     width: 40,
//     borderRadius: 20,
//     marginRight: 12,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   productImage: {
//     height: 24,
//     width: 24,
//     resizeMode: 'contain',
//   },
//   productName: {
//     flex: 1,
//     fontSize: 14,
//     color: Colors.primaryText,
//     fontWeight: '400',
//   },
//   applyInvoiceWrapper: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginTop: 12,
//     borderTopWidth: 1,
//     borderColor: Colors.border,
//   },
//   applyInvoiceText: {
//     fontSize: 12,
//     marginLeft: 8,
//     color: Colors.secondaryText,
//   },
// });

// export default TaxesAndDiscounts;

//With Image

// With Icon

import React, {useState} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  TextInput,
} from 'react-native';
import {RadioButton, Checkbox, Avatar} from 'react-native-paper';
import CustomSwitch from '../common/CustomSwitch';
import Colors from '../../utils/Colors';

const TaxesAndDiscounts = () => {
  const [discountType, setDiscountType] = useState('percentage');
  const [selectedProducts, setSelectedProducts] = useState({});
  const [applyToInvoice, setApplyToInvoice] = useState(false);

  // const [taxInputs, setTaxInputs] = useState(['', '', '']);
  const [taxes, setTaxes] = useState([
    {label: 'GST', amount: ''},
    {label: 'CGST', amount: ''},
    {label: 'SGST', amount: ''},
  ]);

  // const handleTaxInputChange = (index, value) => {
  //   const updatedInputs = [...taxInputs];
  //   updatedInputs[index] = value;
  //   setTaxInputs(updatedInputs);
  // };

  const products = [
    {
      id: '1',
      name: 'Samsung Galaxy J1 Bluetooth',
      // image: require('../../assets/logo.png'),
      icon: '🎤',
      bgColor: '#8639EB',
    },
    {
      id: '2',
      name: 'Black JBL portable Bluetooth Speaker',
      // image: require('../../assets/logo.png'),
      icon: '📀',
      bgColor: '#FFF1BE',
    },
  ];

  const toggleProductSelection = id => {
    setSelectedProducts(prev => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>
        Taxes and Discounts <Text style={styles.asterisk}>*</Text>
        <Text style={styles.optional}> optional</Text>
      </Text>

      <Text style={[styles.sectionTitle, {marginBottom: 8}]}>Tax</Text>

      {taxes.map((tax, index) => (
        <View style={styles.taxBox} key={tax.label}>
          <Text style={styles.taxLabel}>{tax.label}</Text>
          <View style={styles.divider} />
          <TextInput
            style={styles.taxInput}
            placeholder="₹5000 | 18% | INR6000.00"
            placeholderTextColor={Colors.secondaryText}
            value={tax.amount}
            onChangeText={text => {
              const updated = [...taxes];
              updated[index].amount = text;
              setTaxes(updated);
            }}
          />
        </View>
      ))}

      <View style={styles.toggleWrapper}>
        <CustomSwitch />
        <Text style={styles.toggleText}>
          Separate Tax Calculation for Logistics
        </Text>
      </View>

      {/* Discount Type */}
      <Text style={[styles.sectionTitle, {marginTop: 16}]}>Discounts</Text>

      <RadioButton.Group
        onValueChange={newValue => setDiscountType(newValue)}
        value={discountType}>
        <View style={styles.discountRow}>
          <RadioButton.Item
            label="Percentages %"
            value="percentage"
            color="#16C47F"
            uncheckedColor="#8F939E"
            labelStyle={
              discountType === 'percentage'
                ? styles.discountTextActive
                : styles.discountText
            }
            style={[
              styles.discountOption,
              discountType === 'percentage' && styles.discountOptionActive,
            ]}
            rippleColor="transparent" // ✅ Fully disables ripple blink
            theme={{colors: {ripple: 'transparent'}}} // extra safety
            position="leading"
          />

          <RadioButton.Item
            label="Flat discounts ₹"
            value="flat"
            color="#16C47F"
            uncheckedColor="#8F939E"
            labelStyle={
              discountType === 'flat'
                ? styles.discountTextActive
                : styles.discountText
            }
            style={[
              styles.discountOption,
              discountType === 'flat' && styles.discountOptionActive,
            ]}
            rippleColor="transparent"
            theme={{colors: {ripple: 'transparent'}}}
            position="leading"
          />
        </View>
      </RadioButton.Group>

      {/* Product list */}
      <Text style={[styles.sectionTitle, {marginTop: 16}]}>Product(s)</Text>
      {products.map(product => (
        <View style={styles.productItem} key={product.id}>
          <View
            style={[
              styles.productImageWrapper,
              {backgroundColor: product.bgColor},
            ]}>
            <Avatar.Text
              size={40}
              label={product.icon}
              style={{backgroundColor: product.bgColor}}
            />
          </View>
          <Text style={styles.productName}>{product.name}</Text>

          <TouchableWithoutFeedback
            onPress={() => toggleProductSelection(product.id)}>
            <View>
              <Checkbox
                status={selectedProducts[product.id] ? 'checked' : 'unchecked'}
                color="#2E7D32"
                uncheckedColor="#000"
                theme={{colors: {ripple: 'transparent'}}} // Optional
              />
            </View>
          </TouchableWithoutFeedback>
        </View>
      ))}

      {/* Apply to entire invoice */}
      <View style={styles.applyInvoiceWrapper}>
        <TouchableWithoutFeedback
          onPress={() => setApplyToInvoice(!applyToInvoice)}>
          <View>
            <Checkbox
              status={applyToInvoice ? 'checked' : 'unchecked'}
              color="#2E7D32"
              uncheckedColor="#000"
              theme={{colors: {ripple: 'transparent'}}} // optional, won't matter now
            />
          </View>
        </TouchableWithoutFeedback>

        <Text style={styles.applyInvoiceText}>Apply to entire invoice</Text>
      </View>
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
    marginBottom: 12,
    color: Colors.primaryTitle,
  },
  optional: {
    color: Colors.secondaryText,
    fontSize: 12,
  },
  asterisk: {
    color: 'red',
    fontSize: 12,
  },
  sectionTitle: {
    fontWeight: '400',
    fontSize: 12,
    color: Colors.secondaryText,
  },
  divider: {
    height: '70%',
    width: 1,
    backgroundColor: '#e4e4e4',
    marginRight: 8,
  },
  taxBox: {
    borderWidth: 1,
    borderColor: '#ECECEC',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 8,
  },
  taxLabel: {
    fontWeight: '600',
    color: '#16C47F',
    marginRight: 4,
  },
  taxAmount: {
    fontSize: 14,
    color: Colors.secondaryText,
  },
  toggleWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  toggleText: {
    marginLeft: 10,
    fontSize: 13,
    color: '#6F7C97',
  },
  taxInput: {
    flex: 1,
    fontSize: 14,
    color: Colors.primaryText,
    paddingVertical: 4,
  },

  discountRow: {
    flexDirection: 'row',
    marginTop: 10,
    gap: 10,
  },
  discountOption: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ECECEC',
    flex: 1,
    padding: 10,
  },
  discountOptionActive: {
    borderColor: Colors.border,
    backgroundColor: Colors.white,
  },
  discountText: {
    fontSize: 13,
    color: '#6F7C97',
  },
  discountTextActive: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.secondaryText,
  },
  productItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  productImageWrapper: {
    height: 40,
    width: 40,
    borderRadius: 20,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  productImage: {
    height: 24,
    width: 24,
    resizeMode: 'contain',
  },
  productName: {
    flex: 1,
    fontSize: 14,
    color: Colors.primaryText,
    fontWeight: '400',
  },
  applyInvoiceWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    borderTopWidth: 1,
    borderColor: Colors.border,
  },
  applyInvoiceText: {
    fontSize: 12,
    marginLeft: 8,
    color: Colors.secondaryText,
  },
});

export default TaxesAndDiscounts;
