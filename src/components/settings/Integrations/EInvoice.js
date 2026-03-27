import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Platform,
  Keyboard,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/Feather';
import Colors from '../../../utils/Colors';
import {CommonInputStyles, CommonLabelStyles, CommonDropdownStyles} from '../../../utils/CommonStyles';
import Header from '../../common/Header';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import CustomBottomButtons from '../../common/CustomBottomButtons';
import FormField from '../../common/FormField';
import EInvoiceConnectionStatus from './Components/EInvoiceConnectionStatus';
import useKeyboardVisibility from '../../../hooks/useKeyboardVisibility';
import { useInputNavigation } from '../../stocksManagement/StockOverview/TotalStock/Components/inputNavigation';

const EInvoice = () => {
  const navigation = useNavigation();
  const [formData, setFormData] = useState({
    gspProvider: '',
    irpClientId: '',
    irpClientSecret: '',
    irpUsername: '',
    irpPassword: '',
    gstin: '',
    companyName: '',
  });
  const [saveState, setSaveState] = useState('save');
  const [showIrpDropdown, setShowIrpDropdown] = useState(false);
  const [isAccountConnected, setIsAccountConnected] = useState(false);
  const [errors, setErrors] = useState({});
  const scrollViewRef = useRef(null);

  // Keyboard and scroll management
  const isKeyboardVisible = useKeyboardVisibility();

  // Field names in order (text inputs only)
  const fieldNames = [
    'irpClientId',
    'irpClientSecret',
    'irpUsername',
    'irpPassword',
    'gstin',
    'companyName',
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

  // Add loading state to prevent flashing
  const [isLoading, setIsLoading] = useState(true);

  // Load connection status when component mounts
  useEffect(() => {
    loadConnectionStatus();
  }, []);

  // Load connection status every time screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      loadConnectionStatus();
    }, []),
  );

  const loadConnectionStatus = async () => {
    try {
      setIsLoading(true); // Start loading
      const status = await AsyncStorage.getItem('eInvoiceConnectionStatus');

      if (status === 'connected') {
        setIsAccountConnected(true);
      } else {
        setIsAccountConnected(false);
      }
    } catch (error) {
      setIsAccountConnected(false); // Default to false on error
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  const saveConnectionStatus = async status => {
    try {
      await AsyncStorage.setItem('eInvoiceConnectionStatus', status);
    } catch (error) {
    }
  };

  const gspProviders = [
    'Clear Tax',
    'Tally Solutions',
    'Master Data Management',
    'GSTN',
    'Other',
  ];

  const handleVerify = async () => {
    // Clear previous errors
    const newErrors = {};

    // Validation for mandatory fields
    if (!formData.gspProvider || formData.gspProvider.trim() === '') {
      newErrors.gspProvider = 'Fill GSP Provider';
    }

    if (!formData.irpClientId || formData.irpClientId.trim() === '') {
      newErrors.irpClientId = 'Fill IRP Client ID';
    }

    if (!formData.irpClientSecret || formData.irpClientSecret.trim() === '') {
      newErrors.irpClientSecret = 'Fill IRP Client Secret';
    }

    if (!formData.irpUsername || formData.irpUsername.trim() === '') {
      newErrors.irpUsername = 'Fill User Name (IRP)';
    }

    if (!formData.irpPassword || formData.irpPassword.trim() === '') {
      newErrors.irpPassword = 'Fill Password (IRP)';
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
    setSaveState('saving');

    // Simulate API verification
    setTimeout(() => {
      setSaveState('saved');

      setTimeout(() => {
        setIsAccountConnected(true);
        saveConnectionStatus('connected');
        setSaveState('save');
      }, 3000);
    }, 2000);
  };

  const handleCancel = () => {
    setFormData({
      gspProvider: '',
      irpClientId: '',
      irpClientSecret: '',
      irpUsername: '',
      irpPassword: '',
      gstin: '',
      companyName: '',
    });
    setShowIrpDropdown(false);
    setErrors({});
    clearInputRefs();
    setSaveState('save');
  };

  const selectGspProvider = provider => {
    setFormData({...formData, gspProvider: provider});
    setShowIrpDropdown(false);
    if (errors.gspProvider) {
      setErrors(prev => ({...prev, gspProvider: ''}));
    }
  };

  const handleUnpairIntegration = async () => {
    setIsAccountConnected(false);
    await saveConnectionStatus('disconnected');
    setFormData({
      gspProvider: '',
      irpClientId: '',
      irpClientSecret: '',
      irpUsername: '',
      irpPassword: '',
      gstin: '',
      companyName: '',
    });
    setShowIrpDropdown(false);
    clearInputRefs();
  };

  const handleSyncMissedIRNs = () => {
  };

  // Show loading spinner while checking connection status
  if (isLoading) {
    return (
      <View style={styles.container}>
        <Header title="E-Invoice" leftIcon="chevron-left" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#10B981" />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </View>
    );
  }

  return (
    <>
      <View style={styles.container}>
        <Header title="E-Invoice" leftIcon="chevron-left" />

        <ScrollView
          ref={scrollViewRef}
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="interactive"
          nestedScrollEnabled={true}
          scrollEnabled={!showIrpDropdown}
            contentContainerStyle={
              isKeyboardVisible && Platform.OS === 'ios' && {paddingBottom: 200}
            }>
          {/* Form Section - Hidden when account is connected */}
          {!isAccountConnected && (
            <View style={styles.formContainer}>
              <Text style={styles.sectionTitle}>Connect Account</Text>

              {/* GSP Provider Dropdown */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>
                  GSP Provider <Text style={styles.required}>*</Text>
                </Text>
                <TouchableOpacity
                  style={[
                    styles.dropdownInput,
                    errors.gspProvider && styles.inputError,
                  ]}
                  onPress={() => {
                    setShowIrpDropdown(!showIrpDropdown);
                    if (errors.gspProvider) {
                      setErrors(prev => ({...prev, gspProvider: ''}));
                    }
                  }}>
                  <Text
                    style={[
                      styles.dropdownText,
                      !formData.gspProvider && styles.placeholderText,
                    ]}>
                    {formData.gspProvider || 'Select GSP Provider'}
                  </Text>
                  <Ionicons
                    name={showIrpDropdown ? 'chevron-up' : 'chevron-down'}
                    size={20}
                    color="#667085"
                  />
                </TouchableOpacity>
                {errors.gspProvider && (
                  <Text style={styles.errorText}>{errors.gspProvider}</Text>
                )}

                {showIrpDropdown && (
                  <View style={styles.dropdownOptions}>
                    {gspProviders.map((provider, index) => (
                      <TouchableOpacity
                        key={index}
                        style={[
                          styles.dropdownOption,
                          formData.gspProvider === provider &&
                            styles.selectedOption,
                          index === 0 && styles.firstDropdownOption,
                          index === gspProviders.length - 1 &&
                            styles.lastDropdownOption,
                        ]}
                        onPress={() => selectGspProvider(provider)}>
                        <Text
                          style={[
                            styles.dropdownOptionText,
                            formData.gspProvider === provider &&
                              styles.selectedOptionText,
                          ]}>
                          {provider}
                        </Text>
                        {formData.gspProvider === provider && (
                          <Icon name="check" size={16} color="#10B981" />
                        )}
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>

              {/* IRP Client ID */}
              <FormField
                label="IRP Client ID"
                required
                error={errors.irpClientId}
                inputRef={getInputRef(0)}
                containerRef={getContainerRef(0)}
                onLayout={e => handleContainerLayout(0, e)}
                style={styles.inputGroup}
                value={formData.irpClientId}
                onChangeText={text => {
                  setFormData({...formData, irpClientId: text});
                  if (errors.irpClientId) {
                    setErrors(prev => ({...prev, irpClientId: ''}));
                  }
                }}
                placeholder="Enter IRP Client ID"
                returnKeyType="next"
                onSubmitEditing={() => handleSubmitEditing(0, 1, 'next')}
                onFocus={() => handleInputFocus(0)}
              />

              {/* IRP Client Secret */}
              <FormField
                label="IRP Client Secret"
                required
                error={errors.irpClientSecret}
                inputRef={getInputRef(1)}
                containerRef={getContainerRef(1)}
                onLayout={e => handleContainerLayout(1, e)}
                style={styles.inputGroup}
                value={formData.irpClientSecret}
                onChangeText={text => {
                  setFormData({...formData, irpClientSecret: text});
                  if (errors.irpClientSecret) {
                    setErrors(prev => ({...prev, irpClientSecret: ''}));
                  }
                }}
                placeholder="Enter IRP Client Secret"
                secureTextEntry
                returnKeyType="next"
                onSubmitEditing={() => handleSubmitEditing(1, 2, 'next')}
                onFocus={() => handleInputFocus(1)}
              />

              {/* User Name (IRP) */}
              <FormField
                label="User Name (IRP)"
                required
                error={errors.irpUsername}
                inputRef={getInputRef(2)}
                containerRef={getContainerRef(2)}
                onLayout={e => handleContainerLayout(2, e)}
                style={styles.inputGroup}
                value={formData.irpUsername}
                onChangeText={text => {
                  setFormData({...formData, irpUsername: text});
                  if (errors.irpUsername) {
                    setErrors(prev => ({...prev, irpUsername: ''}));
                  }
                }}
                placeholder="Enter User Name (IRP)"
                returnKeyType="next"
                onSubmitEditing={() => handleSubmitEditing(2, 3, 'next')}
                onFocus={() => handleInputFocus(2)}
              />

              {/* Password (IRP) */}
              <FormField
                label="Password (IRP)"
                required
                error={errors.irpPassword}
                inputRef={getInputRef(3)}
                containerRef={getContainerRef(3)}
                onLayout={e => handleContainerLayout(3, e)}
                style={styles.inputGroup}
                value={formData.irpPassword}
                onChangeText={text => {
                  setFormData({...formData, irpPassword: text});
                  if (errors.irpPassword) {
                    setErrors(prev => ({...prev, irpPassword: ''}));
                  }
                }}
                placeholder="Enter Password"
                secureTextEntry
                returnKeyType="next"
                onSubmitEditing={() => handleSubmitEditing(3, 4, 'next')}
                onFocus={() => handleInputFocus(3)}
              />

              {/* GSTIN */}
              <FormField
                label="GSTIN"
                inputRef={getInputRef(4)}
                containerRef={getContainerRef(4)}
                onLayout={e => handleContainerLayout(4, e)}
                style={styles.inputGroup}
                value={formData.gstin}
                onChangeText={text => setFormData({...formData, gstin: text})}
                placeholder="Enter GSTIN"
                returnKeyType="next"
                onSubmitEditing={() => {
                  if (scrollViewRef?.current) {
                    scrollViewRef.current.scrollToEnd({animated: true});
                  }
                  setTimeout(() => {
                    handleSubmitEditing(4, 5, 'next');
                  }, 100);
                }}
                onFocus={() => handleInputFocus(4)}
              />

              {/* Company Name */}
              <FormField
                label="Company Name"
                inputRef={getInputRef(5)}
                containerRef={getContainerRef(5)}
                onLayout={e => handleContainerLayout(5, e)}
                style={styles.inputGroup}
                value={formData.companyName}
                onChangeText={text => setFormData({...formData, companyName: text})}
                placeholder="Enter Company Name"
                returnKeyType="done"
                onSubmitEditing={() => handleSubmitEditing(5, null, 'done')}
                onFocus={() => handleInputFocus(5)}
              />


              {/* Bottom spacer for iOS keyboard */}
              {isKeyboardVisible && Platform.OS === 'ios' && (
                <View style={{height: 20}} />
              )}
            </View>
          )}

          {/* Connected Account Status - Shown when account is connected */}
          {isAccountConnected && (
            <EInvoiceConnectionStatus
              onUnpairIntegration={handleUnpairIntegration}
            />
          )}
        </ScrollView>
      </View>

      {/* Only show buttons when form is visible (not connected) */}
      {!isAccountConnected && (
        <CustomBottomButtons
          onSave={handleVerify}
          onCancel={handleCancel}
          saveState={saveState}
          saveButtonText="Verify"
          cancelButtonText="Cancel"
          saveButtonColor="#07624C"
          cancelButtonColor="#F7F9FC"
          cancelTextColor="#374151"
          savingText="Verification..."
          savedText="Verified"
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundColorPrimary,
  },
  scrollView: {
    flex: 1,
  },
  formContainer: {
    backgroundColor: Colors.white,
    marginHorizontal: 12,
    marginTop: 10,
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 10,
  },
  inputGroup: {
    marginBottom: 14,
  },
  label: { ...CommonLabelStyles.label, marginBottom: 10 },
  textInput: CommonInputStyles.textInput,
  dropdownInput: CommonDropdownStyles.dropdownInput,
  dropdownText: CommonDropdownStyles.dropdownText,
  placeholderText: CommonDropdownStyles.placeholderText,
  dropdownOptions: CommonDropdownStyles.dropdownOptions,
  dropdownOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  firstDropdownOption: {
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  lastDropdownOption: {
    borderBottomWidth: 0,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  selectedOption: {
    backgroundColor: '#fff',
  },
  dropdownOptionText: {
    fontSize: 14,
    color: '#374151',
  },
  selectedOptionText: {
    color: '#10B981',
    fontWeight: '500',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  inputError: {
    borderColor: '#EF4444',
    borderWidth: 1,
  },
  required: {
    color: '#EF4444',
    fontWeight: '400',
  },
});

export default EInvoice;
