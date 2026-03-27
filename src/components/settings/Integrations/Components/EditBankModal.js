import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Keyboard,
  Platform,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
} from 'react-native';
import FormField from '../../../common/FormField';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/Feather';
import Colors from '../../../../utils/Colors';
import LinearGradient from 'react-native-linear-gradient';
import CustomAnimatedModal from '../../../common/CustomAnimatedModal';
import { useInputNavigation } from '../../../stocksManagement/StockOverview/TotalStock/Components/inputNavigation';

const EditBankModal = ({ visible, onClose, bankAccount, onSave, onDelete, onDeleteClick }) => {
  const [formData, setFormData] = useState({
    accountNumber: '',
    ifsc: '',
    bankName: '',
    branch: '',
  });
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [saveState, setSaveState] = useState('save'); // 'save', 'saving', 'saved'
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

  useEffect(() => {
    if (bankAccount) {
      const accountNumberWithoutPrefix = bankAccount.accountNumber.replace(/^A\/c\s*/i, '');
      setFormData({
        accountNumber: accountNumberWithoutPrefix,
        ifsc: bankAccount.identifier,
        bankName: bankAccount.bankName,
        branch: bankAccount.branch,
      });
    }
  }, [bankAccount]);

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
      keyboardDidShowListener?.remove();
      keyboardDidHideListener?.remove();
    };
  }, []);

  const handleSave = async () => {
    if (
      !formData.accountNumber.trim() ||
      !formData.ifsc.trim() ||
      !formData.bankName.trim() ||
      !formData.branch.trim()
    ) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setSaveState('saving');

    // Simulate API call
    setTimeout(() => {
      setSaveState('saved');

      const updatedAccount = {
        ...bankAccount,
        accountNumber: formData.accountNumber ? `A/c ${formData.accountNumber}` : '',
        identifier: formData.ifsc,
        bankName: formData.bankName,
        branch: formData.branch,
      };

      // Keep saved state visible for 1.5 seconds, then save (parent will close with animation)
      setTimeout(() => {
        onSave(updatedAccount); // Parent will close modal, triggering animation
        // Reset state after a delay to allow animation to complete
        setTimeout(() => {
          setSaveState('save');
        }, 300);
      }, 1500);
    }, 1000);
  };

  const handleDelete = () => {
    // Call parent's delete click handler which will close edit modal and open delete modal
    if (onDeleteClick) {
      onDeleteClick(bankAccount);
    }
  };


  const handleClose = useCallback(() => {
    if (saveState !== 'saving') {
      onClose();
      // Reset state
      setSaveState('save');
    }
  }, [onClose, saveState]);

  if (!bankAccount) return null;

  return (
    <>
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
            <Text style={styles.modalTitle}>Edit Bank</Text>
            <View style={styles.headerActions}>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={handleDelete}>
                <Ionicons name="trash" size={20} color="#EF4444" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={handleClose}
                disabled={saveState === 'saving'}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
          </View>

          {/* ScrollView for content */}
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
            {/* Bank Card Preview */}
            <View style={styles.cardPreview}>
              <LinearGradient
                colors={bankAccount.gradientColors}
                style={styles.previewCard}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}>
                <View style={styles.cardContent}>
                  <View style={styles.cardHeader}>
                    <View style={styles.bankLabelContainer}>
                      <Text
                        style={[
                          styles.bankLabel,
                          {
                            backgroundColor: bankAccount.labelColor,
                            color: bankAccount.gradientColors[0],
                          },
                        ]}>
                        {formData.bankName}
                      </Text>
                      <View style={styles.separator} />
                      <Text style={styles.accountNumber}>
                        {formData.accountNumber ? `A/c ${formData.accountNumber}` : ''}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.bottomSection}>
                    <View style={styles.accountInfo}>
                      <Text style={styles.identifier}>{formData.ifsc}</Text>
                      <Text style={styles.branch}>{formData.branch}</Text>
                    </View>

                    <View style={styles.accountTypeContainer}>
                      <Text style={styles.accountType}>
                        {bankAccount.accountType}
                      </Text>
                    </View>
                  </View>
                </View>
              </LinearGradient>
            </View>

            {/* Form Fields */}
            <View style={styles.formContainer}>
              <View
                ref={getContainerRef(0)}
                onLayout={e => handleContainerLayout(0, e)}>
                <FormField
                  label="Account Number"
                  inputRef={getInputRef(0)}
                  style={styles.inputGroup}
                  value={formData.accountNumber}
                  onChangeText={text => {
                    // Only allow numbers
                    const numericText = text.replace(/[^0-9]/g, '');
                    setFormData({ ...formData, accountNumber: numericText });
                  }}
                  placeholder="Enter account number"
                  keyboardType={Platform.OS === 'ios' ? 'number-pad' : 'numeric'}
                  returnKeyType={Platform.OS === 'android' ? 'next' : undefined}
                  blurOnSubmit={false}
                  onSubmitEditing={() => Platform.OS === 'android' && handleSubmitEditing(0, 1, 'next')}
                  onFocus={() => handleInputFocus(0)}
                />
              </View>

              <View
                ref={getContainerRef(1)}
                onLayout={e => handleContainerLayout(1, e)}>
                <FormField
                  label="IFSC"
                  inputRef={getInputRef(1)}
                  style={styles.inputGroup}
                  value={formData.ifsc}
                  onChangeText={text =>
                    setFormData({ ...formData, ifsc: text })
                  }
                  placeholder="Enter IFSC code"
                  autoCapitalize="characters"
                  returnKeyType="next"
                  blurOnSubmit={false}
                  onSubmitEditing={() => handleSubmitEditing(1, 2, 'next')}
                  onFocus={() => handleInputFocus(1)}
                />
              </View>

              <View
                style={styles.inputRow}
                ref={getContainerRef(2)}
                onLayout={e => handleContainerLayout(2, e)}>
                <FormField
                  label="Bank Name"
                  inputRef={getInputRef(2)}
                  style={styles.inputGroup}
                  value={formData.bankName}
                  onChangeText={text =>
                    setFormData({ ...formData, bankName: text })
                  }
                  placeholder="Enter bank name"
                  returnKeyType="next"
                  blurOnSubmit={false}
                  onSubmitEditing={() => handleSubmitEditing(2, 3, 'next')}
                  onFocus={() => handleInputFocus(2)}
                />
                <FormField
                  label="Branch"
                  inputRef={getInputRef(3)}
                  style={styles.inputGroup}
                  value={formData.branch}
                  onChangeText={text =>
                    setFormData({ ...formData, branch: text })
                  }
                  placeholder="Enter branch"
                  returnKeyType="done"
                  blurOnSubmit={true}
                  onSubmitEditing={() => handleSubmitEditing(3, null, 'done')}
                  onFocus={() => handleInputFocus(3)}
                />
              </View>
            </View>
            {isKeyboardVisible && <View style={styles.bottomSpacer} />}
          </ScrollView>

          {/* Action Buttons - Hidden when keyboard is visible */}
          {!isKeyboardVisible && (
            <View style={styles.buttonContainer}>
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
          )}
        </KeyboardAvoidingView>
      </CustomAnimatedModal>
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  deleteButton: {
    padding: 1,
  },
  closeButton: {
    padding: 8,
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
    paddingBottom: 10,
  },
  cardPreview: {
    marginBottom: 10,
  },
  previewCard: {
    borderRadius: 16,
    minHeight: 160,
  },
  cardContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  cardHeader: {
    marginBottom: 16,
  },
  bankLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
    paddingHorizontal: 12
  },
  bankLabel: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    fontSize: 12,
    fontWeight: '600',
  },
  separator: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  accountNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.white,
  },
  bottomSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 12,
  },
  accountInfo: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  identifier: {
    fontSize: 14,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 4,
  },
  branch: {
    fontSize: 14,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.9)',
  },
  // accountTypeContainer: {
  //   alignSelf: 'flex-end',
  // },
  accountType: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.white,
    borderRadius: 12,
  },
  formContainer: {
    marginBottom: 10,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 10,
  },
  inputGroup: {
    flex: 1,
  },
  buttonContainer: {
    flexDirection: 'column',
    gap: 8,
    marginBottom: Platform.OS === 'ios' ? 16 : 0,
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
    height: Platform.OS === 'ios' ? 40 : 30,
  },
  buttonContainerWithKeyboard: {
    marginBottom: 4,
  },
});

export default EditBankModal;
