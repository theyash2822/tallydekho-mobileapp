import React, {useState, useCallback, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Platform,
  KeyboardAvoidingView,
  Keyboard,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Feather from 'react-native-vector-icons/Feather';
import Icon from 'react-native-vector-icons/Feather';
import Colors from '../../utils/Colors';
import {CommonInputStyles, CommonLabelStyles} from '../../utils/CommonStyles';
import {Header} from '../../components/common';
import FormField from '../../components/common/FormField';
import useKeyboardVisibility from '../../hooks/useKeyboardVisibility';
import {useInputNavigation} from '../../components/stocksManagement/StockOverview/TotalStock/Components/inputNavigation';
import {validatePhoneNumber, validateEmail} from '../../utils/Validations';

const AddWarehouseScreen = () => {
  const navigation = useNavigation();
  const [warehouseCode, setWarehouseCode] = useState('');
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [racks, setRacks] = useState([
    {rack: '23 A', label: 'Bay 12'},
  ]);
  const [newRack, setNewRack] = useState('');
  const [newLabel, setNewLabel] = useState('');
  const [narration, setNarration] = useState('');
  const [saveStatus, setSaveStatus] = useState('save'); // 'save', 'saving', 'saved'

  // Validation states - using errors object for consistency
  const [errors, setErrors] = useState({});

  // Keyboard and scroll management
  const isKeyboardVisible = useKeyboardVisibility();
  const scrollViewRef = useRef(null);

  // Field names in order (text inputs only, excluding multiline fields)
  const fieldNames = [
    'warehouseCode',
    'name',
    'phoneNumber',
    'email',
    'zipCode',
    'newRack',
    'newLabel',
  ];

  // Use common input navigation hook
  const {
    getInputRef,
    getContainerRef,
    handleInputFocus,
    handleContainerLayout,
    clearInputRefs,
    getKeyboardType,
    handleSubmitEditing,
  } = useInputNavigation(fieldNames.length, scrollViewRef);

  const handlePhoneChange = (text) => {
    setPhoneNumber(text);
    // Clear error when user starts typing again
    if (errors.phoneNumber) {
      setErrors(prev => ({...prev, phoneNumber: ''}));
    }
  };

  const handlePhoneBlur = () => {
    // Validate only when user switches to next field
    const error = validatePhoneNumber(phoneNumber);
    if (error) {
      setErrors(prev => ({...prev, phoneNumber: error}));
    } else {
      setErrors(prev => ({...prev, phoneNumber: ''}));
    }
  };

  const handleEmailChange = (text) => {
    setEmail(text);
    // Clear error when user starts typing again
    if (errors.email) {
      setErrors(prev => ({...prev, email: ''}));
    }
  };

  const handleEmailBlur = () => {
    // Validate only when user switches to next field
    const error = validateEmail(email);
    if (error) {
      setErrors(prev => ({...prev, email: error}));
    } else {
      setErrors(prev => ({...prev, email: ''}));
    }
  };

  const handleSave = async () => {
    // Clear previous errors
    const newErrors = {};

    // Validation for mandatory fields
    if (!warehouseCode.trim()) {
      newErrors.warehouseCode = 'Warehouse code is required';
    }

    if (!name.trim()) {
      newErrors.name = 'Name is required';
    }

    // Validate phone number using Validations.js (handles empty strings)
    const phoneValidationError = validatePhoneNumber(phoneNumber);
    if (phoneValidationError) {
      newErrors.phoneNumber = phoneValidationError;
    }

    // Validate email using Validations.js (handles empty strings)
    const emailValidationError = validateEmail(email);
    if (emailValidationError) {
      newErrors.email = emailValidationError;
    }

    // Set errors and return if validation fails
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      // Scroll to first error
      setTimeout(() => {
        scrollViewRef.current?.scrollTo({y: 0, animated: true});
      }, 100);
      return;
    }

    // Clear errors if validation passes
    setErrors({});

    setSaveStatus('saving');

    // Create new warehouse object
    const newWarehouse = {
      id: Date.now(),
      name: name.trim() || 'Test Warehouse',
      location: address.trim() || 'New Delhi, India',
      code: warehouseCode.trim() || 'TEST-001',
      isExpanded: false,
      cycleCountFrequency: 'Weekly',
      autoArchiveLayer: '12',
    };

    // Simulate API call
    setTimeout(() => {
      setSaveStatus('saved');

      // Keep saved state visible for 1.5 seconds, then navigate back
      setTimeout(() => {
        console.log('New warehouse:', newWarehouse);
        navigation.goBack();
      }, 1500);
    }, 1500);
  };

  const resetForm = () => {
    setWarehouseCode('');
    setName('');
    setPhoneNumber('');
    setEmail('');
    setAddress('');
    setZipCode('');
    setRacks([{rack: '23 A', label: 'Bay 12'}]);
    setNewRack('');
    setNewLabel('');
    setNarration('');
  };

  const addRack = () => {
    if (newRack.trim() && newLabel.trim()) {
      setRacks([...racks, {rack: newRack.trim(), label: newLabel.trim()}]);
      setNewRack('');
      setNewLabel('');
    }
  };

  const removeRack = index => {
    setRacks(racks.filter((_, i) => i !== index));
  };

  return (
    <View style={styles.container}>
      <Header
        title="Add Warehouse"
        leftIcon="chevron-left"
        onLeftPress={() => navigation.goBack()}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}>
        <ScrollView
          ref={scrollViewRef}
          style={styles.content}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          bounces={false}
          overScrollMode="never"
          keyboardShouldPersistTaps="handled"
          nestedScrollEnabled={true}>
          <View style={styles.formSection}>
            <FormField
              label="Warehouse Code"
              required
              error={errors.warehouseCode}
              inputRef={getInputRef(0)}
              containerRef={getContainerRef(0)}
              onLayout={e => handleContainerLayout(0, e)}
              scrollViewRef={scrollViewRef}
              style={styles.inputGroup}
              value={warehouseCode}
              onChangeText={text => {
                setWarehouseCode(text);
                if (errors.warehouseCode) {
                  setErrors(prev => ({...prev, warehouseCode: ''}));
                }
              }}
              placeholder="Add Code"
              returnKeyType="next"
              onSubmitEditing={() => handleSubmitEditing(0, 1, 'next')}
              onFocus={() => handleInputFocus(0)}
            />

            <FormField
              label="Name"
              required
              error={errors.name}
              inputRef={getInputRef(1)}
              containerRef={getContainerRef(1)}
              onLayout={e => handleContainerLayout(1, e)}
              scrollViewRef={scrollViewRef}
              style={styles.inputGroup}
              value={name}
              onChangeText={text => {
                setName(text);
                if (errors.name) {
                  setErrors(prev => ({...prev, name: ''}));
                }
              }}
              placeholder="Add Name"
              returnKeyType="next"
              onSubmitEditing={() => handleSubmitEditing(1, 2, 'next')}
              onFocus={() => handleInputFocus(1)}
            />

            <View style={styles.row}>
              <FormField
                label="Phone Number"
                error={errors.phoneNumber}
                inputRef={getInputRef(2)}
                containerRef={getContainerRef(2)}
                onLayout={e => handleContainerLayout(2, e)}
                scrollViewRef={scrollViewRef}
                style={[styles.inputGroup, {flex: 1}]}
                value={phoneNumber}
                onChangeText={handlePhoneChange}
                onBlur={handlePhoneBlur}
                placeholder="Enter Phone number"
                keyboardType="phone-pad"
                returnKeyType="next"
                onSubmitEditing={() => handleSubmitEditing(2, 3, 'next')}
                onFocus={() => handleInputFocus(2)}
              />
              <FormField
                label="Email"
                error={errors.email}
                inputRef={getInputRef(3)}
                containerRef={getContainerRef(3)}
                onLayout={e => handleContainerLayout(3, e)}
                scrollViewRef={scrollViewRef}
                style={[styles.inputGroup, {flex: 1}]}
                value={email}
                onChangeText={handleEmailChange}
                onBlur={handleEmailBlur}
                placeholder="Enter Email"
                keyboardType="email-address"
                returnKeyType="next"
                onSubmitEditing={() => handleSubmitEditing(3, 4, 'next')}
                onFocus={() => handleInputFocus(3)}
              />
            </View>

            <FormField
              label="Address"
              multiline
              scrollViewRef={scrollViewRef}
              style={styles.inputGroup}
              value={address}
              onChangeText={setAddress}
              placeholder="Enter full address"
              returnKeyType="next"
            />

            <FormField
              label="Zip Code"
              inputRef={getInputRef(4)}
              containerRef={getContainerRef(4)}
              onLayout={e => handleContainerLayout(4, e)}
              scrollViewRef={scrollViewRef}
              style={styles.inputGroup}
              value={zipCode}
              onChangeText={setZipCode}
              placeholder="Zip Code"
              keyboardType="numeric"
              returnKeyType="next"
              onSubmitEditing={() => handleSubmitEditing(4, 5, 'next')}
              onFocus={() => handleInputFocus(4)}
            />
          </View>

          <View style={styles.formSection}>
            <Text style={styles.label}>Racks</Text>
            
            {/* Existing Racks */}
            {racks.map((rackItem, index) => (
              <View key={index} style={styles.rackItem}>
                <View style={styles.rackBox}>
                  <Text style={styles.rackText}>{rackItem.rack}</Text>
                </View>
                <View style={styles.rackBox}>
                  <Text style={styles.rackLabel}>{rackItem.label}</Text>
                </View>
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => removeRack(index)}>
                  <Feather name="x" size={16} color="#6F7C97" />
                </TouchableOpacity>
              </View>
            ))}

            {/* Add New Rack */}
            <View style={styles.addRackSection}>
              <View style={styles.rackItem}>
                <View
                  ref={getContainerRef(5)}
                  onLayout={e => handleContainerLayout(5, e)}
                  style={styles.rackBox}>
                  <TextInput
                    ref={getInputRef(5)}
                    style={styles.rackInput}
                    value={newRack}
                    onChangeText={setNewRack}
                    placeholder="Enter Racks"
                    placeholderTextColor={'#8F939E'}
                    returnKeyType="next"
                    blurOnSubmit={false}
                    onFocus={() => handleInputFocus(5)}
                    onSubmitEditing={() => handleSubmitEditing(5, 6, 'next')}
                  />
                </View>
                <View
                  ref={getContainerRef(6)}
                  onLayout={e => handleContainerLayout(6, e)}
                  style={styles.rackBox}>
                  <TextInput
                    ref={getInputRef(6)}
                    style={styles.rackInput}
                    value={newLabel}
                    onChangeText={setNewLabel}
                    placeholder="Enter Label"
                    placeholderTextColor={'#8F939E'}
                    returnKeyType="done"
                    blurOnSubmit={true}
                    onFocus={() => handleInputFocus(6)}
                    onSubmitEditing={() => {
                      Keyboard.dismiss();
                      addRack();
                    }}
                  />
                </View>
                <TouchableOpacity
                  style={styles.addButton}
                  onPress={addRack}>
                  <Feather name="plus" size={16} color="#6F7C97" />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View style={styles.formSection}>
            <FormField
              label="Narration"
              multiline
              scrollViewRef={scrollViewRef}
              style={styles.inputGroup}
              value={narration}
              onChangeText={setNarration}
              placeholder="Enter Narration"
            />
          </View>
        </ScrollView>

        {/* Action Buttons */}
        {!isKeyboardVisible && (
          <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.saveButton,
              saveStatus === 'saving' && styles.savingButton,
              saveStatus === 'saved' && styles.savedButton,
            ]}
            onPress={handleSave}
            disabled={saveStatus === 'saving'}>
            {saveStatus === 'saving' ? (
              <>
                <ActivityIndicator size="small" color={Colors.white} />
                <Text style={styles.saveButtonText}>Saving...</Text>
              </>
            ) : saveStatus === 'saved' ? (
              <>
                <Icon name="check" size={16} color={Colors.white} />
                <Text style={styles.saveButtonText}>Saved</Text>
              </>
            ) : (
              <Text style={styles.saveButtonText}>Save</Text>
            )}
          </TouchableOpacity>

          {/* <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => navigation.goBack()}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity> */}
        </View>
        )}
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundColorPrimary,
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 12,
  },
  formSection: {
    marginBottom: 0,
  },
  inputGroup: {
    marginBottom: 12,
  },
  label: {
    ...CommonLabelStyles.label,
    marginBottom: 6,
  },
  input: {
    ...CommonInputStyles.textInput,
    paddingVertical: 14,
    color: '#1A1A1A',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    gap: 16,
  },
  rackItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  rackBox: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    minHeight: 50,
    justifyContent: 'center',
  },
  rackInput: {
    paddingHorizontal: 12,
    paddingVertical: 14,
    fontSize: 14,
    color: '#1A1A1A',
    backgroundColor: 'transparent',
    borderWidth: 0,
    width: '100%',
  },
  rackText: {
    fontSize: 14,
    color: '#1A1A1A',
    fontWeight: '500',
    paddingHorizontal: 12,
    paddingVertical: 14,
  },
  rackLabel: {
    fontSize: 14,
    color: '#1A1A1A',
    fontWeight: '500',
    paddingHorizontal: 12,
    paddingVertical: 14,
  },
  removeButton: {
    padding: 4,
  },
  addRackSection: {
    marginTop: 8,
  },
  addButton: {
    padding: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    flexDirection: 'column',
    gap: 8,
    padding: 16,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 8,
    backgroundColor: '#07624C',
    gap: 8,
  },
  savingButton: {
    backgroundColor: '#07624C',
  },
  savedButton: {
    backgroundColor: '#07624C',
  },
  saveButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  inputError: {
    borderColor: '#EF4444',
  },
  errorText: {
    fontSize: 12,
    color: '#EF4444',
    marginTop: 4,
    marginLeft: 4,
  },
  required: {
    color: '#EF4444',
    fontWeight: '400',
  },
});

export default AddWarehouseScreen;
