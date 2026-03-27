import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from 'react-native';
import Colors from '../../utils/Colors';
import CustomAnimatedModal from '../common/CustomAnimatedModal';
import FormField from '../common/FormField';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Checkbox } from '../Helper/HelperComponents';
import InvoicesModalStyles from '../../utils/InvoicesModalStyles';
import ModalStyles from '../../utils/ModalStyles';
import { useInputNavigation } from '../stocksManagement/StockOverview/TotalStock/Components/inputNavigation';
import { validatePhoneNumber, validateEmail } from '../../utils/Validations';

const AddVendorModal = ({
  visible,
  onClose,
  showShippingAddress = false,
  showfirstButton = true,
  showSecondButton = false,
  onSaveAndUse,

  headerText = 'Add New Vendor',
  subText = 'Fill the Form For information',
  vendorNameLabel = 'Vendor Name',
  contactNumberLabel = 'Contact Number',
  emailLabel = 'Email',
  billingAddressLabel = 'Billing Address',
  shippingAddressLabel = 'Shipping Address',
  gstinLabel = 'GSTIN',
  placeholderName = 'Vendor Name',
}) => {
  // Keyboard state
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const scrollViewRef = useRef(null);

  const [vendorName, setVendorName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [email, setEmail] = useState('');
  const [billingAddress, setBillingAddress] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [gstin, setGstin] = useState('');
  const [sameAsBilling, setSameAsBilling] = useState(false);

  // Validation states
  const [phoneError, setPhoneError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [nameError, setNameError] = useState('');

  // Field names in order (dynamic based on showShippingAddress)
  const fieldNames = showShippingAddress
    ? ['vendorName', 'contactNumber', 'email', 'billingAddress', 'shippingAddress', 'gstin']
    : ['vendorName', 'contactNumber', 'email', 'billingAddress', 'gstin'];

  // Use input navigation hook
  const {
    getInputRef,
    getContainerRef,
    handleInputFocus,
    handleContainerLayout,
    clearInputRefs,
    getKeyboardType,
    handleSubmitEditing,
  } = useInputNavigation(fieldNames.length, scrollViewRef);


  useEffect(() => {
    if (sameAsBilling) {
      setShippingAddress(billingAddress);
    }
  }, [billingAddress, sameAsBilling]);

  // Reset form and errors when modal closes
  useEffect(() => {
    if (!visible) {
      // Reset all form fields
      setVendorName('');
      setContactNumber('');
      setEmail('');
      setBillingAddress('');
      setShippingAddress('');
      setGstin('');
      setSameAsBilling(false);
      // Reset all errors
      setNameError('');
      setPhoneError('');
      setEmailError('');
      // Clear input refs
      clearInputRefs();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  // Keyboard event listeners
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setIsKeyboardVisible(true);
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setIsKeyboardVisible(false);
      },
    );

    return () => {
      keyboardDidHideListener?.remove();
      keyboardDidShowListener?.remove();
    };
  }, []);

  const handleSave = () => {
    // Clear previous errors
    setNameError('');
    setPhoneError('');
    setEmailError('');

    // Validate mandatory name field
    if (!vendorName.trim()) {
      setNameError('Fill Vendor Name');
      // Scroll to first error
      setTimeout(() => {
        scrollViewRef.current?.scrollTo({y: 0, animated: true});
      }, 100);
      return;
    }

    // Validate phone and email
    const phoneValidationError = validatePhoneNumber(contactNumber);
    const emailValidationError = validateEmail(email);

    if (phoneValidationError) {
      setPhoneError(phoneValidationError);
      // Scroll to first error
      setTimeout(() => {
        scrollViewRef.current?.scrollTo({y: 0, animated: true});
      }, 100);
      return;
    }

    if (emailValidationError) {
      setEmailError(emailValidationError);
      // Scroll to first error
      setTimeout(() => {
        scrollViewRef.current?.scrollTo({y: 0, animated: true});
      }, 100);
      return;
    }

    // All validations passed, proceed with save
    onClose();
  };

  const handleSaveAndUse = () => {
    // Clear previous errors
    setNameError('');
    setPhoneError('');
    setEmailError('');

    // Validate mandatory name field
    if (!vendorName.trim()) {
      setNameError('Fill Vendor Name');
      // Scroll to first error
      setTimeout(() => {
        scrollViewRef.current?.scrollTo({y: 0, animated: true});
      }, 100);
      return;
    }

    // Validate phone and email
    const phoneValidationError = validatePhoneNumber(contactNumber);
    const emailValidationError = validateEmail(email);

    if (phoneValidationError) {
      setPhoneError(phoneValidationError);
      // Scroll to first error
      setTimeout(() => {
        scrollViewRef.current?.scrollTo({y: 0, animated: true});
      }, 100);
      return;
    }

    if (emailValidationError) {
      setEmailError(emailValidationError);
      // Scroll to first error
      setTimeout(() => {
        scrollViewRef.current?.scrollTo({y: 0, animated: true});
      }, 100);
      return;
    }

    // All validations passed, proceed with save and use
    console.log('Saving and using vendor:', vendorName);
    onClose();
    onSaveAndUse?.(vendorName.trim());
    // clear fields
    setVendorName('');
    setContactNumber('');
    setEmail('');
    setBillingAddress('');
    setShippingAddress('');
    setGstin('');
    setSameAsBilling(false);
    setPhoneError('');
    setEmailError('');
    setNameError('');
  };

  return (
    <CustomAnimatedModal
      visible={visible}
      onClose={onClose}
      showCloseButton={false}
      scrollable={false}
      maxHeight={isKeyboardVisible ? '90%' : '85%'}
      statusBarTranslucent={true}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
        style={{}}>
        <View style={InvoicesModalStyles.header}>
          <Text style={InvoicesModalStyles.headerTitle}>{headerText}</Text>
          <TouchableOpacity
            onPress={onClose}
            style={InvoicesModalStyles.closeButton}>
            <Icon name="close" color={'#6F7C97'} size={26} />
          </TouchableOpacity>
        </View>
        <Text style={InvoicesModalStyles.subtext}>{subText}</Text>

        <ScrollView
          ref={scrollViewRef}
          style={[ModalStyles.content, { marginTop: 4 }]}
          contentContainerStyle={[
            ModalStyles.scrollContent,
            isKeyboardVisible && styles.keyboardPadding,
            !isKeyboardVisible && styles.normalPadding,
          ]}
          showsVerticalScrollIndicator={false}
          keyboardDismissMode="interactive"
          keyboardShouldPersistTaps="handled"
          nestedScrollEnabled={true}
          bounces={true}>
          <FormField
            label={vendorNameLabel}
            required
            error={nameError}
            placeholder={placeholderName}
            value={vendorName}
            onChangeText={(text) => {
              setVendorName(text);
              if (nameError) setNameError('');
            }}
            inputRef={getInputRef(0)}
            containerRef={getContainerRef(0)}
            onLayout={e => handleContainerLayout(0, e)}
            scrollViewRef={scrollViewRef}
            nextInputRef={getInputRef(1)}
            returnKeyType="next"
            onFocus={() => handleInputFocus(0)}
            autoCorrect={false}
            style={InvoicesModalStyles.formGroup}
            labelStyle={InvoicesModalStyles.label}
            inputStyle={InvoicesModalStyles.input}
          />

          <View style={[InvoicesModalStyles.row, {marginBottom: 8}]}>
            <FormField
              label={contactNumberLabel}
              error={phoneError}
              placeholder="Phone number"
              value={contactNumber}
              onChangeText={(text) => {
                setContactNumber(text);
                if (phoneError) setPhoneError('');
              }}
              onBlur={() => {
                const error = validatePhoneNumber(contactNumber);
                setPhoneError(error);
              }}
              inputRef={getInputRef(1)}
              containerRef={getContainerRef(1)}
              onLayout={e => handleContainerLayout(1, e)}
              scrollViewRef={scrollViewRef}
              nextInputRef={getInputRef(2)}
              returnKeyType="next"
              onFocus={() => handleInputFocus(1)}
              keyboardType={Platform.OS === 'ios' ? 'numbers-and-punctuation' : 'phone-pad'}
              autoCorrect={false}
              style={InvoicesModalStyles.halfInput}
              labelStyle={InvoicesModalStyles.label}
              inputStyle={InvoicesModalStyles.input}
            />
            <FormField
              label={emailLabel}
              error={emailError}
              placeholder="Email address"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (emailError) setEmailError('');
              }}
              onBlur={() => {
                const error = validateEmail(email);
                setEmailError(error);
              }}
              inputRef={getInputRef(2)}
              containerRef={getContainerRef(2)}
              onLayout={e => handleContainerLayout(2, e)}
              scrollViewRef={scrollViewRef}
              nextInputRef={getInputRef(3)}
              returnKeyType="next"
              onFocus={() => handleInputFocus(2)}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              style={InvoicesModalStyles.halfInput}
              labelStyle={InvoicesModalStyles.label}
              inputStyle={InvoicesModalStyles.input}
            />
          </View>

          <FormField
            label={billingAddressLabel}
            placeholder="-"
            value={billingAddress}
            onChangeText={setBillingAddress}
            inputRef={getInputRef(3)}
            containerRef={getContainerRef(3)}
            onLayout={e => handleContainerLayout(3, e)}
            scrollViewRef={scrollViewRef}
            nextInputRef={getInputRef(4)}
            returnKeyType="next"
            onFocus={() => handleInputFocus(3)}
            multiline
            style={InvoicesModalStyles.formGroup}
            labelStyle={InvoicesModalStyles.label}
            inputStyle={[InvoicesModalStyles.input, {height: 50, minHeight: 50}]}
          />

          {showShippingAddress && (
            <View>
              <View style={[InvoicesModalStyles.formGroup0, { marginTop: 10 }]}>
                <Checkbox
                  checked={sameAsBilling}
                  onPress={() => setSameAsBilling(!sameAsBilling)}
                  label="Same as billing address"
                />
              </View>
              <FormField
                label={shippingAddressLabel}
                placeholder="-"
                value={shippingAddress}
                onChangeText={text => {
                  setShippingAddress(text);
                  if (sameAsBilling && text !== billingAddress) {
                    setSameAsBilling(false);
                  }
                }}
                editable={!sameAsBilling}
                inputRef={getInputRef(4)}
                containerRef={getContainerRef(4)}
                onLayout={e => handleContainerLayout(4, e)}
                scrollViewRef={scrollViewRef}
                nextInputRef={getInputRef(5)}
                returnKeyType="next"
                onFocus={() => handleInputFocus(4)}
                multiline
                style={InvoicesModalStyles.formGroup}
                labelStyle={InvoicesModalStyles.label}
                inputStyle={[InvoicesModalStyles.input, {height: 50, minHeight: 50}]}
              />
            </View>
          )}

          <FormField
            label={gstinLabel}
            placeholder="GSTIN/VAT Number"
            value={gstin}
            onChangeText={setGstin}
            inputRef={getInputRef(showShippingAddress ? 5 : 4)}
            containerRef={getContainerRef(showShippingAddress ? 5 : 4)}
            onLayout={e => handleContainerLayout(showShippingAddress ? 5 : 4, e)}
            scrollViewRef={scrollViewRef}
            returnKeyType="done"
            onFocus={() => handleInputFocus(showShippingAddress ? 5 : 4)}
            style={InvoicesModalStyles.formGroup}
            labelStyle={InvoicesModalStyles.label}
            inputStyle={[InvoicesModalStyles.input, {height: 50}]}
          />
          {isKeyboardVisible && <View style={styles.bottomSpacer} />}
        </ScrollView>

        {/* Bottom Buttons */}
        {showfirstButton && (
          <View style={[styles.buttonsRow, isKeyboardVisible && styles.buttonsWithKeyboard]}>
            <TouchableOpacity
              style={styles.primaryButton}
              activeOpacity={0.85}
              onPress={() => {
                Keyboard.dismiss();
                setTimeout(() => handleSave(), 100);
              }}>
              <Text style={styles.primaryText}>Save</Text>
            </TouchableOpacity>
          </View>
        )}

        {showSecondButton && (
          <View style={[styles.buttonsRow, isKeyboardVisible && styles.buttonsWithKeyboard]}>
            <TouchableOpacity
              style={styles.primaryButton}
              activeOpacity={0.85}
              onPress={() => {
                Keyboard.dismiss();
                setTimeout(() => handleSaveAndUse(), 100);
              }}>
              <Text style={styles.primaryText}>Save & Use</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.secondaryButton,
                Platform.OS === 'ios' && { marginBottom: 16 },
              ]}
              activeOpacity={0.85}
              onPress={() => {
                Keyboard.dismiss();
                setTimeout(() => handleSave(), 100);
              }}
            >
              <Text style={styles.secondaryText}>Save Only</Text>
            </TouchableOpacity>
          </View>
        )}
      </KeyboardAvoidingView>
    </CustomAnimatedModal>
  );
};

const styles = StyleSheet.create({
  buttonsRow: {
    flexDirection: 'column',
    gap: 12,
    marginTop: 12,
  },
  primaryButton: {
    backgroundColor: '#07624C',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  secondaryButton: {
    backgroundColor: '#fff',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  primaryText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryText: {
    color: '#041B29',
    fontSize: 16,
    fontWeight: '600',
  },
  keyboardPadding: {
    paddingBottom: Platform.OS === 'ios' ? 40 : 10,
  },
  normalPadding: {
    paddingBottom: 20,
  },
  bottomSpacer: {
    height: Platform.OS === 'ios' ? 60 : 60,
  },
  inputError: {
    borderColor: '#FF3B30',
    borderWidth: 1.5,
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  buttonsWithKeyboard: {
    marginBottom: 4,
  },
  required: {
    color: '#EF4444',
    fontWeight: '400',
  },
});

export default AddVendorModal;

//Hiding CustomBottomButton

// import React, {useState, useEffect} from 'react';
// import {
//   Modal,
//   View,
//   Text,
//   TextInput,
//   ScrollView,
//   StyleSheet,
//   TouchableOpacity,
//   KeyboardAvoidingView,
//   Platform,
//   Keyboard,
// } from 'react-native';
// import Colors from '../../utils/Colors';
// import CustomBottomButton from '../common/BottomButton';
// import Icon from 'react-native-vector-icons/MaterialIcons';

// const AddVendorModal = ({
//   visible,
//   onClose,
//   showShippingAddress = false,
//   showfirstButton = true,
//   showSecondButton = false,
//   headerText = 'Add New Vendor',
//   subText = 'Fill the Form For information',
//   vendorNameLabel = 'Vendor Name',
//   contactNumberLabel = 'Contact Number',
//   emailLabel = 'Email (Optional)',
//   billingAddressLabel = 'Billing Address',
//   shippingAddressLabel = 'Shipping Address',
//   gstinLabel = 'GSTIN (Optional , with Validation)',
//   placeholderName = 'Vendor Name',
// }) => {
//   const [vendorName, setVendorName] = useState('');
//   const [contactNumber, setContactNumber] = useState('');
//   const [email, setEmail] = useState('');
//   const [billingAddress, setBillingAddress] = useState('');
//   const [shippingAddress, setShippingAddress] = useState('');
//   const [gstin, setGstin] = useState('');
//   const [sameAsBilling, setSameAsBilling] = useState(true);
//   const [isInputFocused, setIsInputFocused] = useState(false);

//   useEffect(() => {
//     if (sameAsBilling) {
//       setShippingAddress(billingAddress);
//     }
//   }, [billingAddress, sameAsBilling]);

//   return (
//     <Modal visible={visible} transparent animationType="slide">
//       <KeyboardAvoidingView
//         behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//         style={styles.backdrop}>
//         <TouchableOpacity
//           style={styles.backdropTouchable}
//           activeOpacity={1}
//           onPress={Keyboard.dismiss}
//         />
//         <View style={styles.modal}>
//           <ScrollView
//             showsVerticalScrollIndicator={false}
//             keyboardShouldPersistTaps="handled">
//             <Text style={styles.header}>{headerText}</Text>
//             <Text style={InvoicesModalStyles.subtext}>{subText}</Text>

//             <View style={InvoicesModalStyles.formGroup}>
//               <Text style={[InvoicesModalStyles.label, {marginTop: 6}]}>
//                 {vendorNameLabel}
//               </Text>
//               <TextInput
//                 style={InvoicesModalStyles.input}
//                 placeholder={placeholderName}
//                 placeholderTextColor="#8F939E"
//                 value={vendorName}
//                 onChangeText={setVendorName}
//                 onFocus={() => setIsInputFocused(true)}
//                 onBlur={() => setIsInputFocused(false)}
//               />
//             </View>

//             <View style={InvoicesModalStyles.row}>
//               <View style={InvoicesModalStyles.halfInput}>
//                 <Text style={InvoicesModalStyles.label}>{contactNumberLabel}</Text>
//                 <TextInput
//                   style={InvoicesModalStyles.input}
//                   placeholder="Phone number"
//                   placeholderTextColor="#8F939E"
//                   keyboardType="phone-pad"
//                   value={contactNumber}
//                   onChangeText={setContactNumber}
//                   onFocus={() => setIsInputFocused(true)}
//                   onBlur={() => setIsInputFocused(false)}
//                 />
//               </View>

//               <View style={InvoicesModalStyles.halfInput}>
//                 <Text style={InvoicesModalStyles.label}>{emailLabel}</Text>
//                 <TextInput
//                   style={InvoicesModalStyles.input}
//                   placeholder="Email address"
//                   placeholderTextColor="#8F939E"
//                   keyboardType="email-address"
//                   value={email}
//                   onChangeText={setEmail}
//                   onFocus={() => setIsInputFocused(true)}
//                   onBlur={() => setIsInputFocused(false)}
//                 />
//               </View>
//             </View>

//             <View style={InvoicesModalStyles.formGroup}>
//               <Text style={InvoicesModalStyles.label}>{billingAddressLabel}</Text>
//               <TextInput
//                 style={[InvoicesModalStyles.input, {height: 50}]}
//                 placeholder="-"
//                 placeholderTextColor="#8F939E"
//                 multiline
//                 value={billingAddress}
//                 onChangeText={setBillingAddress}
//                 onFocus={() => setIsInputFocused(true)}
//                 onBlur={() => setIsInputFocused(false)}
//               />
//             </View>

//             {showShippingAddress && (
//               <View style={InvoicesModalStyles.formGroup}>
//                 <TouchableOpacity
//                   style={InvoicesModalStyles.checkboxContainer}
//                   onPress={() => setSameAsBilling(!sameAsBilling)}
//                   activeOpacity={0.8}>
//                   <View
//                     style={[
//                       InvoicesModalStyles.checkboxBox,
//                       {
//                         backgroundColor: sameAsBilling ? '#34C759' : '#fff',
//                       },
//                     ]}>
//                     {sameAsBilling && (
//                       <Icon name="check" size={16} color="#fff" />
//                     )}
//                   </View>
//                   <Text style={InvoicesModalStyles.checkboxLabel}>
//                     Same as billing address
//                   </Text>
//                 </TouchableOpacity>

//                 <Text style={InvoicesModalStyles.label}>{shippingAddressLabel}</Text>
//                 <TextInput
//                   style={[InvoicesModalStyles.input, {height: 50}]}
//                   placeholder="-"
//                   placeholderTextColor="#8F939E"
//                   multiline
//                   value={shippingAddress}
//                   onChangeText={text => {
//                     setShippingAddress(text);
//                     if (sameAsBilling && text !== billingAddress) {
//                       setSameAsBilling(false);
//                     }
//                   }}
//                   editable={!sameAsBilling}
//                   onFocus={() => setIsInputFocused(true)}
//                   onBlur={() => setIsInputFocused(false)}
//                 />
//               </View>
//             )}

//             <View style={InvoicesModalStyles.formGroup}>
//               <Text style={InvoicesModalStyles.label}>{gstinLabel}</Text>
//               <TextInput
//                 style={[InvoicesModalStyles.input, {height: 50}]}
//                 placeholder="GSTIN/VAT Number"
//                 placeholderTextColor="#8F939E"
//                 value={gstin}
//                 onChangeText={setGstin}
//                 onFocus={() => setIsInputFocused(true)}
//                 onBlur={() => setIsInputFocused(false)}
//               />
//             </View>
//           </ScrollView>
//         </View>
//         {!isInputFocused && showfirstButton && (
//           <CustomBottomButton
//             onPress={onClose}
//             buttonText="Save"
//             buttonColor="#07624C"
//             textColor="#FFFFFF"
//           />
//         )}
//         {!isInputFocused && showSecondButton && (
//           <CustomBottomButton
//             onPress={onClose}
//             buttonText="Save & Use"
//             buttonColor="#07624C"
//             textColor="#FFFFFF"
//             showSecondButton={true}
//             secondButtonText="Save Only"
//           />
//         )}
//       </KeyboardAvoidingView>
//     </Modal>
//   );
// };

// const styles = StyleSheet.create({
//   backdrop: {
//     flex: 1,
//     justifyContent: 'flex-end',
//     backgroundColor: 'rgba(0,0,0,0.3)',
//   },
//   backdropTouchable: {
//     flex: 1,
//   },
//   modal: {
//     backgroundColor: '#F4F5FA',
//     borderTopLeftRadius: 20,
//     borderTopRightRadius: 20,
//     padding: 16,
//     maxHeight: '85%',
//   },
//   header: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginBottom: 6,
//   },
//   subtext: {
//     color: 'gray',
//     marginBottom: 16,
//     fontSize: 13,
//   },
//   formGroup: {
//     marginBottom: 14,
//   },
//   label: {
//     fontSize: 14,
//     fontWeight: '400',
//     marginBottom: 6,
//     color: '#8F939E',
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: Colors.border || '#D0D0D0',
//     borderRadius: 10,
//     paddingHorizontal: 12,
//     paddingVertical: 10,
//     fontSize: 13,
//     backgroundColor: '#FFF',
//     color: '#000',
//   },
//   row: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     gap: 10,
//     marginBottom: 14,
//   },
//   halfInput: {
//     flex: 1,
//   },
//   checkboxContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 10,
//   },
//   checkboxLabel: {
//     fontSize: 14,
//     color: '#8F939E',
//   },
//   checkboxBox: {
//     width: 20,
//     height: 20,
//     borderRadius: 4,
//     borderWidth: 1.5,
//     borderColor: '#F0EFF4',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 8,
//   },
// });

// export default AddVendorModal;
