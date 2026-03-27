import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Keyboard,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/Feather';
import Colors from '../../../../utils/Colors';
import {CommonInputStyles} from '../../../../utils/CommonStyles';
import CustomAnimatedModal from '../../../common/CustomAnimatedModal';
import FormField from '../../../common/FormField';
import { useInputNavigation } from '../../../stocksManagement/StockOverview/TotalStock/Components/inputNavigation';

const AddBankModal = ({ visible, onClose, onSave }) => {
  const [accountNumber, setAccountNumber] = useState('');
  const [ifsc, setIfsc] = useState('');
  const [bankName, setBankName] = useState('');
  const [branch, setBranch] = useState('');
  const [saveState, setSaveState] = useState('save'); // 'save', 'saving', 'saved'
  const [errors, setErrors] = useState({});

  // Keyboard state
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const scrollViewRef = useRef(null);

  // Input navigation setup
  const fieldNames = ['accountNumber', 'ifsc', 'bankName', 'branch'];
  const {
    getInputRef,
    getContainerRef,
    handleInputFocus,
    handleContainerLayout,
    handleSubmitEditing,
  } = useInputNavigation(fieldNames.length, scrollViewRef);

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

  // Generate different gradient colors for new bank accounts
  const generateGradientColors = () => {
    const colorSchemes = [
      { colors: ['#3B82F6', '#1D4ED8'], label: '#DBEAFE' }, // Blue
      { colors: ['#8B5CF6', '#7C3AED'], label: '#EDE9FE' }, // Purple
      { colors: ['#EC4899', '#BE185D'], label: '#FCE7F3' }, // Pink
      { colors: ['#F59E0B', '#D97706'], label: '#FEF3C7' }, // Amber
      { colors: ['#10B981', '#059669'], label: '#D1FAE5' }, // Green
      { colors: ['#06B6D4', '#0891B2'], label: '#CFFAFE' }, // Cyan
      { colors: ['#F97316', '#EA580C'], label: '#FED7AA' }, // Orange
      { colors: ['#84CC16', '#65A30D'], label: '#F7FEE7' }, // Lime
    ];

    // Pick a random color scheme
    const randomIndex = Math.floor(Math.random() * colorSchemes.length);
    return colorSchemes[randomIndex];
  };


  const validateForm = () => {
    // Temporarily removed validations for testing
    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    setSaveState('saving');
    setErrors({});

    // Simulate API call
    setTimeout(() => {
      setSaveState('saved');

      // Generate random colors for the new account
      const colorScheme = generateGradientColors();

      // Create new bank account object
      const newAccount = {
        id: Date.now(), // Generate unique ID
        type: 'SAVING',
        isPrimary: false,
        bankName: bankName,
        accountNumber: `A/c ${accountNumber}`,
        identifier: ifsc,
        branch: branch,
        accountType: 'SAVING',
        gradientColors: colorScheme.colors,
        labelColor: colorScheme.label,
      };

      // Call onSave with the new account
      onSave(newAccount);

      // Keep saved state visible for 3 seconds before resetting
      setTimeout(() => {
        setSaveState('save');
        // Reset form
        setAccountNumber('');
        setIfsc('');
        setBankName('');
        setBranch('');
      }, 3000);
    }, 2000);
  };

  const handleClose = useCallback(() => {
    if (saveState !== 'saving') {
      onClose();
      // Reset form
      setAccountNumber('');
      setIfsc('');
      setBankName('');
      setBranch('');
      setSaveState('save');
    }
  }, [onClose, saveState]);

  return (
    <CustomAnimatedModal
      visible={visible}
      onClose={handleClose}
      showCloseButton={false}
      scrollable={false}
      maxHeight={isKeyboardVisible ? (Platform.OS === 'ios' ? '94%' : '92%') : '82%'}
      statusBarTranslucent={true}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
        style={{}}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Add Bank</Text>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={handleClose}
            disabled={saveState === 'saving'}>
            <Ionicons name="close" size={24} color="#666" />
          </TouchableOpacity>
        </View>

        {/* Input Fields */}
        <ScrollView
          ref={scrollViewRef}
          style={styles.content}
          contentContainerStyle={[
            styles.scrollContent,
            isKeyboardVisible && styles.keyboardPadding,
            !isKeyboardVisible && styles.normalPadding,
          ]}
          showsVerticalScrollIndicator={false}
          keyboardDismissMode="interactive"
          keyboardShouldPersistTaps="handled"
          nestedScrollEnabled={true}
          scrollEnabled={true}
          bounces={true}>
          <View
            ref={getContainerRef(0)}
            onLayout={e => handleContainerLayout(0, e)}>
            <FormField
              label="Account Number"
              error={errors.accountNumber}
              inputRef={getInputRef(0)}
              style={styles.inputGroup}
              inputStyle={styles.textInput}
              scrollViewRef={scrollViewRef}
              value={accountNumber}
              onChangeText={setAccountNumber}
              placeholder="Enter account number"
              editable={saveState !== 'saving'}
              returnKeyType="next"
              onSubmitEditing={() => handleSubmitEditing(0, 1, 'next')}
              onFocus={() => handleInputFocus(0)}
            />
          </View>

          <View
            ref={getContainerRef(1)}
            onLayout={e => handleContainerLayout(1, e)}>
            <FormField
              label="IFSC"
              error={errors.ifsc}
              inputRef={getInputRef(1)}
              style={styles.inputGroup}
              inputStyle={styles.textInput}
              scrollViewRef={scrollViewRef}
              value={ifsc}
              onChangeText={setIfsc}
              placeholder="Enter IFSC"
              editable={saveState !== 'saving'}
              autoCapitalize="characters"
              returnKeyType="next"
              onSubmitEditing={() => handleSubmitEditing(1, 2, 'next')}
              onFocus={() => handleInputFocus(1)}
            />
          </View>

          <View
            style={styles.rowContainer}
            ref={getContainerRef(2)}
            onLayout={e => handleContainerLayout(2, e)}>
            <FormField
              label="Bank Name"
              error={errors.bankName}
              inputRef={getInputRef(2)}
              style={[styles.inputGroup, styles.halfWidth]}
              inputStyle={styles.textInput}
              scrollViewRef={scrollViewRef}
              value={bankName}
              onChangeText={setBankName}
              placeholder="Enter bank name"
              editable={saveState !== 'saving'}
              returnKeyType="next"
              onSubmitEditing={() => handleSubmitEditing(2, 3, 'next')}
              onFocus={() => handleInputFocus(2)}
            />

            <FormField
              label="Branch"
              error={errors.branch}
              inputRef={getInputRef(3)}
              style={[styles.inputGroup, styles.halfWidth]}
              inputStyle={styles.textInput}
              scrollViewRef={scrollViewRef}
              value={branch}
              onChangeText={setBranch}
              placeholder="Enter branch"
              editable={saveState !== 'saving'}
              returnKeyType="done"
              onSubmitEditing={() => handleSubmitEditing(3, null, 'done')}
              onFocus={() => handleInputFocus(3)}
            />
          </View>
          {isKeyboardVisible && <View style={styles.bottomSpacer} />}
        </ScrollView>

        {/* Action Buttons */}
        <View style={[styles.buttonContainer, isKeyboardVisible && styles.buttonContainerWithKeyboard]}>
          <TouchableOpacity
            style={[
              styles.saveButton,
              saveState === 'saving' && styles.savingButton,
              saveState === 'saved' && styles.savedButton,
            ]}
            onPress={handleSave}
            disabled={saveState === 'saving'}>
            {saveState === 'saving' ? (
              <>
                <ActivityIndicator size="small" color={Colors.white} />
                <Text style={styles.saveButtonText}>Saving...</Text>
              </>
            ) : saveState === 'saved' ? (
              <>
                <Icon name="check" size={16} color={Colors.white} />
                <Text style={styles.saveButtonText}>Saved</Text>
              </>
            ) : (
              <Text style={styles.saveButtonText}>Save</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.cancelButton}
            onPress={handleClose}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </CustomAnimatedModal>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 4,
  },
  content: {
    paddingBottom: 2,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  keyboardPadding: {
    paddingBottom: Platform.OS === 'ios' ? 40 : 10,
  },
  normalPadding: {
    paddingBottom: 20,
  },
  inputGroup: {
    marginBottom: 10,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '400',
    color: '#8F939E',
    marginBottom: 8,
  },
  textInput: {
    ...CommonInputStyles.textInputWithHeight,
    textDecorationLine: 'none',
    textDecorationStyle: 'solid',
  },
  textInputError: {
    borderColor: '#EF4444',
    borderWidth: 2,
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  halfWidth: {
    width: '48%', // Adjust as needed for the desired width
  },
  buttonContainer: {
    flexDirection: 'column',
    gap: 8
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 8,
    backgroundColor: '#07624C',
    gap: 8,
    marginBottom: Platform.OS === 'ios' ? 16 : 0,
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
  cancelButton: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  bottomSpacer: {
    height: Platform.OS === 'ios' ? 40 : 1,
  },
  buttonContainerWithKeyboard: {
    marginBottom: 4,
  },
});

export default AddBankModal;
