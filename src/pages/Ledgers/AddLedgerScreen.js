import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  ActivityIndicator,
  Platform,
  KeyboardAvoidingView,
  Keyboard,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Feather from 'react-native-vector-icons/Feather';
import Icon from 'react-native-vector-icons/Feather';
import Colors from '../../utils/Colors';
import { Header, CustomSwitch } from '../../components/common';
import FormField from '../../components/common/FormField';
import ModalStyles from '../../utils/ModalStyles';
import {CommonInputStyles} from '../../utils/CommonStyles';
import useKeyboardVisibility from '../../hooks/useKeyboardVisibility';
import { useInputNavigation } from '../../components/stocksManagement/StockOverview/TotalStock/Components/inputNavigation';
import { indianStates, standardTallyGroups } from '../../utils/Constants';

const gstRegistrationTypes = ['Regular', 'Unregistered', 'Composition'];
const dutyTaxTypes = ['CGST', 'SGST', 'IGST', 'Cess', 'Others'];

const AddLedgerScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const ledgerType = route.params?.ledgerType || 'Sundry Debtors';

  // Basic Fields
  const [name, setName] = useState('');
  const [underGroup, setUnderGroup] = useState('');
  const [openingBalance, setOpeningBalance] = useState('');
  const [isDebit, setIsDebit] = useState(true); // Dr/Cr toggle
  const [creditPeriod, setCreditPeriod] = useState('');

  // Error states for validation
  const [errors, setErrors] = useState({});

  // Duties & Taxes specific fields
  const [dutyTaxType, setDutyTaxType] = useState('');
  const [percentageOfCalculation, setPercentageOfCalculation] = useState('');

  // Toggles
  const [enableMailingDetails, setEnableMailingDetails] = useState(false);
  const [provideBankDetails, setProvideBankDetails] = useState(false);

  // Custom Groups - Group search
  const [groupSearchQuery, setGroupSearchQuery] = useState('');
  const [showGroupSearchDropdown, setShowGroupSearchDropdown] = useState(false);

  // Mailing Details (Conditional)
  const [mailingName, setMailingName] = useState('');
  const [address, setAddress] = useState('');
  const [state, setState] = useState('');
  const [country, setCountry] = useState('India');
  const [pincode, setPincode] = useState('');

  // Bank Details (Conditional)
  const [beneficiaryName, setBeneficiaryName] = useState('');
  const [bankName, setBankName] = useState('');
  const [ifscCode, setIfscCode] = useState('');
  const [accountNumber, setAccountNumber] = useState('');

  // GST Details
  const [gstRegistrationType, setGstRegistrationType] = useState('Regular');
  const [gstin, setGstin] = useState('');
  const [panItNumber, setPanItNumber] = useState('');

  // UI States
  const [showUnderGroupDropdown, setShowUnderGroupDropdown] = useState(false);
  const [showStateDropdown, setShowStateDropdown] = useState(false);
  const [showGstTypeDropdown, setShowGstTypeDropdown] = useState(false);
  const [showDutyTaxTypeDropdown, setShowDutyTaxTypeDropdown] = useState(false);
  const [saveState, setSaveState] = useState('save');

  // Keyboard and scroll management
  const isKeyboardVisible = useKeyboardVisibility();
  const scrollViewRef = useRef(null);
  const gstRegistrationRef = useRef(null);
  const [gstRegistrationY, setGstRegistrationY] = useState(0);

  // Set default group based on ledger type (only on initial mount or ledger type change)
  React.useEffect(() => {
    const defaultGroups = {
      'Sundry Debtors': 'Sundry Debtors',
      'Sundry Creditors': 'Sundry Creditors',
      'Duties & Taxes': 'Duties & Taxes (Current Liabilities)',
    };
    // Only set default if it's not Custom Groups and underGroup is empty
    if (ledgerType !== 'Custom Groups' && !underGroup) {
      setUnderGroup(defaultGroups[ledgerType] || ledgerType);
    } else if (ledgerType === 'Custom Groups') {
      // Reset to empty for Custom Groups only if not already set
      if (!underGroup) {
        setUnderGroup('');
      }
    }
  }, [ledgerType]);

  // Field names for input navigation
  const getFieldNames = () => {
    const fields = ['name', 'openingBalance'];
    if (ledgerType === 'Duties & Taxes') {
      fields.push('percentageOfCalculation');
      return fields;
    }
    if (
      ledgerType === 'Sundry Debtors' ||
      ledgerType === 'Sundry Creditors'
    ) {
      fields.push('creditPeriod');
    }
    if (enableMailingDetails) {
      fields.push('mailingName', 'address', 'country', 'pincode');
    }
    if (provideBankDetails) {
      fields.push('beneficiaryName', 'bankName', 'ifscCode', 'accountNumber');
    }
    if (ledgerType === 'Custom Groups') {
      if (gstRegistrationType === 'Regular') {
        fields.push('gstin');
      }
      fields.push('panItNumber');
    } else if (
      ledgerType === 'Sundry Debtors' ||
      ledgerType === 'Sundry Creditors'
    ) {
      if (gstRegistrationType === 'Regular') {
        fields.push('gstin');
      }
      fields.push('panItNumber');
    }
    return fields;
  };

  // Helper function to get GSTIN field index
  const getGstinFieldIndex = () => {
    let index = 2; // name (0), openingBalance (1)
    if (
      ledgerType === 'Sundry Debtors' ||
      ledgerType === 'Sundry Creditors'
    ) {
      index++; // creditPeriod
    }
    if (enableMailingDetails) {
      index += 4; // mailingName, address, country, pincode
    }
    if (provideBankDetails) {
      index += 4; // beneficiaryName, bankName, ifscCode, accountNumber
    }
    return index;
  };

  // Helper function to get PAN/IT field index
  const getPanItFieldIndex = () => {
    let index = getGstinFieldIndex();
    if (gstRegistrationType === 'Regular') {
      index++; // gstin
    }
    return index;
  };

  const fieldNames = getFieldNames();

  const {
    getInputRef,
    getContainerRef,
    handleInputFocus,
    handleContainerLayout,
    clearInputRefs,
    getKeyboardType,
    handleSubmitEditing,
  } = useInputNavigation(fieldNames.length, scrollViewRef);

  // Group options based on ledger type
  const getGroupOptions = () => {
    switch (ledgerType) {
      case 'Sundry Debtors':
        return ['Sundry Debtors', 'Sundry Debtors - Others'];
      case 'Sundry Creditors':
        return ['Sundry Creditors', 'Sundry Creditors - Others'];
      case 'Duties & Taxes':
        return [
          'Duties & Taxes (Current Liabilities)',
          'Duties & Taxes',
          'GST',
          'TDS',
          'TCS',
        ];
      case 'Custom Groups':
        // Filter groups based on search query
        if (groupSearchQuery.trim()) {
          return standardTallyGroups.filter(group =>
            group.toLowerCase().includes(groupSearchQuery.toLowerCase())
          );
        }
        return standardTallyGroups;
      default:
        return [ledgerType];
    }
  };

  const groupOptions = getGroupOptions();

  // Helper function to close all dropdowns
  const closeAllDropdowns = () => {
    setShowUnderGroupDropdown(false);
    setShowStateDropdown(false);
    setShowGstTypeDropdown(false);
    setShowDutyTaxTypeDropdown(false);
    setShowGroupSearchDropdown(false);
  };

  const handleSave = async () => {
    // Clear previous errors
    const newErrors = {};

    // Validation for all ledger types
    if (!name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!underGroup.trim()) {
      newErrors.underGroup = 'Under (Group) is required';
    }

    if (!openingBalance.trim()) {
      newErrors.openingBalance = 'Opening Balance is required';
    }

    // Duties & Taxes specific validation
    if (ledgerType === 'Duties & Taxes') {
      if (!dutyTaxType.trim()) {
        newErrors.dutyTaxType = 'Fill Type of Duty / Tax';
      }
      if (!percentageOfCalculation.trim()) {
        newErrors.percentageOfCalculation = 'Fill Percentage of Calculation';
      } else {
        const percentage = parseFloat(percentageOfCalculation);
        if (isNaN(percentage) || percentage < 0 || percentage > 100) {
          if (percentage > 100) {
            newErrors.percentageOfCalculation = 'Percentage should be less than or equal to 100';
          } else if (percentage < 0) {
            newErrors.percentageOfCalculation = 'Percentage should be greater than or equal to 0';
          } else {
            newErrors.percentageOfCalculation = 'Fill Percentage of Calculation';
          }
        }
      }
    }

    // GSTIN is mandatory if Registration Type is Regular
    if (gstRegistrationType === 'Regular' && !gstin.trim()) {
      newErrors.gstin = 'GSTIN is required for Regular registration type';
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

    const saveData = {
      ledgerType,
      name: name.trim(),
      underGroup,
      openingBalance: parseFloat(openingBalance) || 0,
      isDebit,
      ...(ledgerType === 'Duties & Taxes'
        ? {
          dutyTaxType: dutyTaxType.trim(),
          percentageOfCalculation: parseFloat(percentageOfCalculation) || 0,
        }
        : {
          ...(ledgerType === 'Sundry Debtors' ||
            ledgerType === 'Sundry Creditors'
            ? { creditPeriod: creditPeriod ? parseInt(creditPeriod) : null }
            : {}),
          enableMailingDetails,
          mailingDetails: enableMailingDetails
            ? {
              mailingName: mailingName.trim(),
              address: address.trim(),
              state: state.trim(),
              country: country.trim() || 'India',
              pincode: pincode.trim(),
            }
            : null,
          provideBankDetails,
          bankDetails: provideBankDetails
            ? {
              beneficiaryName: beneficiaryName.trim(),
              bankName: bankName.trim(),
              ifscCode: ifscCode.trim(),
              accountNumber: accountNumber.trim(),
            }
            : null,
          ...((ledgerType === 'Sundry Debtors' ||
            ledgerType === 'Sundry Creditors') ||
            ledgerType === 'Custom Groups'
            ? {
              gstDetails: {
                registrationType: gstRegistrationType,
                gstin: gstin.trim(),
                panItNumber: panItNumber.trim(),
              },
            }
            : {}),
        }),
    };

    setTimeout(() => {
      setSaveState('saved');
      console.log('Ledger saved:', saveData);
      setTimeout(() => {
        navigation.goBack();
      }, 1500);
    }, 1500);
  };

  const resetForm = () => {
    setName('');
    setOpeningBalance('');
    setIsDebit(true);
    setCreditPeriod('');
    setDutyTaxType('');
    setPercentageOfCalculation('');
    setEnableMailingDetails(false);
    setProvideBankDetails(false);
    setGroupSearchQuery('');
    setShowGroupSearchDropdown(false);
    setMailingName('');
    setAddress('');
    setState('');
    setCountry('India');
    setPincode('');
    setBeneficiaryName('');
    setBankName('');
    setIfscCode('');
    setAccountNumber('');
    setGstRegistrationType('Regular');
    setGstin('');
    setPanItNumber('');
    clearInputRefs();
  };

  return (
    <View style={styles.container}>
      <Header
        title={`${ledgerType}`}
        leftIcon="chevron-left"
        onLeftPress={() => navigation.goBack()}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}>
        <ScrollView
          ref={scrollViewRef}
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="interactive"
          nestedScrollEnabled={true}
          scrollEnabled={true}
          bounces={true}
          scrollEventThrottle={32}>
          {/* Name */}
          <View style={ModalStyles.section}>
            <FormField
              label="Name"
              required
              error={errors.name}
              inputRef={getInputRef(0)}
              containerRef={getContainerRef(0)}
              onLayout={e => handleContainerLayout(0, e)}
              scrollViewRef={scrollViewRef}
              style={ModalStyles.inputGroup}
              inputStyle={ModalStyles.textInput}
              value={name}
              onChangeText={text => {
                setName(text);
                if (errors.name) {
                  setErrors(prev => ({...prev, name: ''}));
                }
              }}
              placeholder="Enter ledger name"
              returnKeyType="next"
              onSubmitEditing={() => handleSubmitEditing(0, 1, 'next')}
              onFocus={() => handleInputFocus(0)}
            />
          </View>

          {/* Under (Group) - Only for Custom Groups */}
          {ledgerType === 'Custom Groups' && (
            <View style={ModalStyles.section}>
              <View style={ModalStyles.inputGroup}>
                <Text style={ModalStyles.inputLabel}>
                  Under (Group) <Text style={styles.required}>*</Text>
                </Text>
                <View style={styles.searchContainer}>
                  <Feather
                    name="search"
                    size={16}
                    color="#8F939E"
                    style={styles.searchIcon}
                  />
                  <TextInput
                    style={styles.searchInput}
                    placeholder="Search or type group name..."
                    placeholderTextColor="#8F939E"
                    value={underGroup || groupSearchQuery}
                    onChangeText={text => {
                      setGroupSearchQuery(text);
                      // Clear selected group when user starts typing
                      if (text !== underGroup) {
                        setUnderGroup('');
                      }
                      // Close other dropdowns but keep group search dropdown open
                      closeAllDropdowns();
                      if (text.length > 0) {
                        setShowGroupSearchDropdown(true);
                      } else {
                        setShowGroupSearchDropdown(false);
                      }
                    }}
                    onFocus={() => {
                      // Close other dropdowns but keep group search dropdown open
                      closeAllDropdowns();
                      // If group is selected, clear it to allow editing
                      if (underGroup) {
                        setUnderGroup('');
                        setGroupSearchQuery('');
                      }
                      setShowGroupSearchDropdown(true);
                    }}
                  />
                  {underGroup && (
                    <TouchableOpacity
                      style={styles.clearButton}
                      onPress={() => {
                        setUnderGroup('');
                        setGroupSearchQuery('');
                        setShowGroupSearchDropdown(false);
                        if (errors.underGroup) {
                          setErrors(prev => ({...prev, underGroup: ''}));
                        }
                      }}>
                      <Feather name="x" size={16} color="#666" />
                    </TouchableOpacity>
                  )}
                  {!underGroup && groupSearchQuery.length > 0 && (
                    <TouchableOpacity
                      style={styles.clearButton}
                      onPress={() => {
                        setGroupSearchQuery('');
                        setShowGroupSearchDropdown(false);
                      }}>
                      <Feather name="x" size={16} color="#666" />
                    </TouchableOpacity>
                  )}
                </View>
                {showGroupSearchDropdown && (
                  <View style={ModalStyles.dropdownList2}>
                    <ScrollView
                      nestedScrollEnabled={true}
                      showsVerticalScrollIndicator={true}>
                      {groupOptions.length > 0 ? (
                        groupOptions.map((group, index) => (
                          <TouchableOpacity
                            key={index}
                            style={[
                              ModalStyles.dropdownItem,
                              index === groupOptions.length - 1 &&
                              ModalStyles.lastDropdownOption,
                            ]}
                            onPress={() => {
                              // Set group immediately
                              setUnderGroup(group);
                              // Clear search query so input shows only selected group
                              setGroupSearchQuery('');
                              // Close dropdown immediately
                              setShowGroupSearchDropdown(false);
                              if (errors.underGroup) {
                                setErrors(prev => ({...prev, underGroup: ''}));
                              }
                            }}>
                            <Text style={ModalStyles.dropdownItemText}>
                              {group}
                            </Text>
                          </TouchableOpacity>
                        ))
                      ) : (
                        <View style={styles.emptyContainer}>
                          <Text style={styles.emptyText}>
                            No groups found. Type to create new group.
                          </Text>
                        </View>
                      )}
                    </ScrollView>
                  </View>
                )}
                {errors.underGroup && (
                  <Text style={styles.errorText}>{errors.underGroup}</Text>
                )}
              </View>
            </View>
          )}

          {/* Opening Balance */}
          <View style={ModalStyles.section}>
            <View
              style={ModalStyles.inputGroup}
              ref={getContainerRef(1)}
              onLayout={e => handleContainerLayout(1, e)}>
              <Text style={ModalStyles.inputLabel}>
                Opening Balance <Text style={styles.required}>*</Text>
              </Text>
              <View style={[
                styles.openingRow,
                errors.openingBalance && styles.inputError
              ]}>
                <TextInput
                  ref={getInputRef(1)}
                  style={styles.openingInput}
                  value={openingBalance}
                  onChangeText={text => {
                    setOpeningBalance(text);
                    if (errors.openingBalance) {
                      setErrors(prev => ({...prev, openingBalance: ''}));
                    }
                  }}
                  placeholder="0.00"
                  placeholderTextColor="#8F939E"
                  keyboardType={getKeyboardType('numeric')}
                  returnKeyType="next"
                  blurOnSubmit={false}
                  onSubmitEditing={() => handleSubmitEditing(1, 2, 'next')}
                  onFocus={() => handleInputFocus(1)}
                />
                <Text style={[styles.drLabel, {marginRight: 10}]}>Dr</Text>
                <CustomSwitch
                  value={!isDebit}
                  onValueChange={(value) => setIsDebit(!value)}
                />
                <Text style={styles.crLabel}>Cr</Text>
              </View>
              {errors.openingBalance && (
                <Text style={styles.errorText}>{errors.openingBalance}</Text>
              )}
            </View>
          </View>

          {/* Duties & Taxes Specific Fields */}
          {ledgerType === 'Duties & Taxes' && (
            <>
              <View style={ModalStyles.section}>
                <View style={ModalStyles.rowGroup}>
                  {/* Type of Duty / Tax */}
                  <View style={ModalStyles.halfInputGroup}>
                    <Text style={ModalStyles.inputLabel}>
                      Type of Duty / Tax <Text style={styles.required}>*</Text>
                    </Text>
                    <TouchableOpacity
                      style={[
                        ModalStyles.dropdownField,
                        errors.dutyTaxType && styles.inputError
                      ]}
                      onPress={() => {
                        const newValue = !showDutyTaxTypeDropdown;
                        closeAllDropdowns();
                        setShowDutyTaxTypeDropdown(newValue);
                        if (errors.dutyTaxType) {
                          setErrors(prev => ({...prev, dutyTaxType: ''}));
                        }
                      }}
                      activeOpacity={0.7}>
                      <Text
                        style={[
                          ModalStyles.dropdownText,
                          !dutyTaxType && ModalStyles.placeholderText,
                        ]}>
                        {dutyTaxType || 'Select type'}
                      </Text>
                      <Feather
                        name={
                          showDutyTaxTypeDropdown ? 'chevron-up' : 'chevron-down'
                        }
                        size={16}
                        color="#666"
                      />
                    </TouchableOpacity>

                    {showDutyTaxTypeDropdown && (
                      <View style={ModalStyles.dropdownList}>
                        <ScrollView
                          nestedScrollEnabled={true}
                          showsVerticalScrollIndicator={true}
                          style={styles.dropdownScrollView}>
                          {dutyTaxTypes.map((type, index) => (
                            <TouchableOpacity
                              key={index}
                              style={[
                                ModalStyles.dropdownItem,
                                index === dutyTaxTypes.length - 1 &&
                                ModalStyles.lastDropdownOption,
                              ]}
                              onPress={() => {
                                setDutyTaxType(type);
                                setShowDutyTaxTypeDropdown(false);
                                if (errors.dutyTaxType) {
                                  setErrors(prev => ({...prev, dutyTaxType: ''}));
                                }
                              }}>
                              <Text style={ModalStyles.dropdownItemText}>
                                {type}
                              </Text>
                            </TouchableOpacity>
                          ))}
                        </ScrollView>
                      </View>
                    )}
                    {errors.dutyTaxType && (
                      <Text style={styles.errorText}>{errors.dutyTaxType}</Text>
                    )}
                  </View>

                  {/* Percentage of Calculation */}
                  <View
                    style={ModalStyles.halfInputGroup}
                    ref={getContainerRef(2)}
                    onLayout={e => handleContainerLayout(2, e)}>
                    <Text style={ModalStyles.inputLabel}>
                      Percentage of Calculation <Text style={styles.required}>*</Text>
                    </Text>
                    <View style={[
                      styles.percentageContainer,
                      errors.percentageOfCalculation && styles.inputError
                    ]}>
                      <TextInput
                        ref={getInputRef(2)}
                        style={styles.percentageInput}
                        value={percentageOfCalculation}
                        onChangeText={text => {
                          // Allow empty string, numbers, and decimal point
                          if (text === '' || /^\d*\.?\d*$/.test(text)) {
                            setPercentageOfCalculation(text);
                            // Clear error if user is typing
                            if (errors.percentageOfCalculation) {
                              setErrors(prev => ({...prev, percentageOfCalculation: ''}));
                            }
                            // Validate if value exceeds 100
                            if (text.trim() !== '') {
                              const percentage = parseFloat(text);
                              if (!isNaN(percentage) && percentage > 100) {
                                setErrors(prev => ({
                                  ...prev,
                                  percentageOfCalculation: 'Percentage should be less than or equal to 100',
                                }));
                              }
                            }
                          }
                        }}
                        onBlur={() => {
                          // Validate on blur
                          if (percentageOfCalculation.trim() !== '') {
                            const percentage = parseFloat(percentageOfCalculation);
                            if (isNaN(percentage) || percentage < 0 || percentage > 100) {
                              if (percentage > 100) {
                                setErrors(prev => ({
                                  ...prev,
                                  percentageOfCalculation: 'Percentage should be less than or equal to 100',
                                }));
                              } else if (percentage < 0) {
                                setErrors(prev => ({
                                  ...prev,
                                  percentageOfCalculation: 'Percentage should be greater than or equal to 0',
                                }));
                              }
                            }
                          }
                        }}
                        placeholder="0.00"
                        placeholderTextColor="#8F939E"
                        keyboardType={getKeyboardType('numeric')}
                        returnKeyType="done"
                        blurOnSubmit={true}
                        onSubmitEditing={() => Keyboard.dismiss()}
                        onFocus={() => handleInputFocus(2)}
                      />
                      <Text style={styles.percentageSymbol}>%</Text>
                    </View>
                    {errors.percentageOfCalculation && (
                      <Text style={styles.errorText}>{errors.percentageOfCalculation}</Text>
                    )}
                  </View>
                </View>
              </View>
            </>
          )}

          {/* Credit Period */}
          {(ledgerType === 'Sundry Debtors' ||
            ledgerType === 'Sundry Creditors') && (
              <View style={ModalStyles.section}>
                <FormField
                  label="Credit Period (Days)"
                  inputRef={getInputRef(2)}
                  containerRef={getContainerRef(2)}
                  onLayout={e => handleContainerLayout(2, e)}
                  scrollViewRef={scrollViewRef}
                  style={ModalStyles.inputGroup}
                  inputStyle={ModalStyles.textInput}
                  value={creditPeriod}
                  onChangeText={setCreditPeriod}
                  placeholder="Enter credit period in days"
                  keyboardType={getKeyboardType('numeric')}
                  returnKeyType="next"
                  onSubmitEditing={() => handleSubmitEditing(2, 3, 'next')}
                  onFocus={() => handleInputFocus(2)}
                />
              </View>
            )}

          {/* Enable Mailing Details Toggle */}
          {(ledgerType === 'Sundry Debtors' ||
            ledgerType === 'Sundry Creditors' ||
            ledgerType === 'Custom Groups') && (
              <View style={ModalStyles.section}>
                <View style={styles.toggleContainer}>
                  <Text style={ModalStyles.inputLabel}>
                    Enable Mailing Details
                  </Text>
                  <CustomSwitch
                    value={enableMailingDetails}
                    onValueChange={setEnableMailingDetails}
                  />
                </View>
              </View>
            )}

          {/* Mailing Details - Conditional */}
          {enableMailingDetails &&
            (ledgerType === 'Sundry Debtors' ||
              ledgerType === 'Sundry Creditors' ||
              ledgerType === 'Custom Groups') && (
              <>
                <View style={ModalStyles.section}>
                  <FormField
                    label="Mailing Name"
                    inputRef={getInputRef(3)}
                    containerRef={getContainerRef(3)}
                    onLayout={e => handleContainerLayout(3, e)}
                    scrollViewRef={scrollViewRef}
                    style={ModalStyles.inputGroup}
                    inputStyle={ModalStyles.textInput}
                    value={mailingName}
                    onChangeText={setMailingName}
                    placeholder="Enter mailing name"
                    returnKeyType="next"
                    onSubmitEditing={() => handleSubmitEditing(3, 4, 'next')}
                    onFocus={() => handleInputFocus(3)}
                  />
                </View>

                <View style={ModalStyles.section}>
                  <FormField
                    label="Address"
                    multiline
                    inputRef={getInputRef(4)}
                    containerRef={getContainerRef(4)}
                    onLayout={e => handleContainerLayout(4, e)}
                    scrollViewRef={scrollViewRef}
                    style={ModalStyles.inputGroup}
                    inputStyle={[ModalStyles.textInput, ModalStyles.narrationInput]}
                    value={address}
                    onChangeText={setAddress}
                    placeholder="Enter address"
                    returnKeyType="next"
                    onSubmitEditing={() => handleSubmitEditing(4, 5, 'next')}
                    onFocus={() => handleInputFocus(4)}
                  />
                </View>

                <View style={ModalStyles.section}>
                  <View style={ModalStyles.inputGroup}>
                    <Text style={ModalStyles.inputLabel}>State</Text>
                    <TouchableOpacity
                      style={[
                        ModalStyles.dropdownField,
                        errors.state && styles.inputError,
                      ]}
                      onPress={() => {
                        const newValue = !showStateDropdown;
                        closeAllDropdowns();
                        setShowStateDropdown(newValue);
                        if (errors.state) {
                          setErrors(prev => ({...prev, state: ''}));
                        }
                      }}
                      activeOpacity={0.7}>
                      <Text
                        style={[
                          ModalStyles.dropdownText,
                          !state && ModalStyles.placeholderText,
                        ]}>
                        {state || 'Select state'}
                      </Text>
                      <Feather
                        name={showStateDropdown ? 'chevron-up' : 'chevron-down'}
                        size={16}
                        color="#666"
                      />
                    </TouchableOpacity>

                    {showStateDropdown && (
                      <View style={ModalStyles.dropdownList}>
                        <ScrollView
                          nestedScrollEnabled={true}
                          showsVerticalScrollIndicator={true}
                          style={styles.dropdownScrollView}>
                          {indianStates.map((stateOption, index) => (
                            <TouchableOpacity
                              key={index}
                              style={[
                                ModalStyles.dropdownItem,
                                index === indianStates.length - 1 &&
                                ModalStyles.lastDropdownOption,
                              ]}
                              onPress={() => {
                                setState(stateOption);
                                setShowStateDropdown(false);
                                if (errors.state) {
                                  setErrors(prev => ({...prev, state: ''}));
                                }
                              }}>
                              <Text style={ModalStyles.dropdownItemText}>
                                {stateOption}
                              </Text>
                            </TouchableOpacity>
                          ))}
                        </ScrollView>
                      </View>
                    )}
                    {errors.state && (
                      <Text style={styles.errorText}>{errors.state}</Text>
                    )}
                  </View>
                </View>

                <View style={ModalStyles.section}>
                  <View style={ModalStyles.rowGroup}>
                    <FormField
                      label="Pincode"
                      inputRef={getInputRef(6)}
                      containerRef={getContainerRef(6)}
                      onLayout={e => handleContainerLayout(6, e)}
                      scrollViewRef={scrollViewRef}
                      style={styles.pincodeInputGroup}
                      inputStyle={ModalStyles.textInput}
                      value={pincode}
                      onChangeText={setPincode}
                      placeholder="Enter pincode"
                      keyboardType={getKeyboardType('numeric')}
                      returnKeyType="next"
                      onSubmitEditing={() => {
                        if (provideBankDetails) {
                          handleSubmitEditing(6, 7, 'next');
                        } else {
                          const nextIndex = gstRegistrationType === 'Regular'
                            ? getGstinFieldIndex()
                            : getPanItFieldIndex();
                          handleSubmitEditing(6, nextIndex, 'next');
                        }
                      }}
                      onFocus={() => handleInputFocus(6)}
                    />
                    <FormField
                      label="Country"
                      inputRef={getInputRef(5)}
                      containerRef={getContainerRef(5)}
                      onLayout={e => handleContainerLayout(5, e)}
                      scrollViewRef={scrollViewRef}
                      style={styles.countryInputGroup}
                      inputStyle={ModalStyles.textInput}
                      value={country}
                      onChangeText={setCountry}
                      placeholder="India"
                      returnKeyType="next"
                      onSubmitEditing={() => handleSubmitEditing(5, 6, 'next')}
                      onFocus={() => handleInputFocus(5)}
                    />
                  </View>
                </View>
              </>
            )}

          {/* Provide Bank Details Toggle */}
          {(ledgerType === 'Sundry Debtors' ||
            ledgerType === 'Sundry Creditors' ||
            ledgerType === 'Custom Groups') && (
            <View style={[ModalStyles.section, styles.toggleSectionSpacing]}>
                <View style={styles.toggleContainer}>
                  <Text style={ModalStyles.inputLabel}>Provide Bank Details</Text>
                  <CustomSwitch
                    value={provideBankDetails}
                    onValueChange={setProvideBankDetails}
                  />
                </View>
              </View>
            )}

          {/* Bank Details - Conditional */}
          {provideBankDetails &&
            (ledgerType === 'Sundry Debtors' ||
              ledgerType === 'Sundry Creditors' ||
              ledgerType === 'Custom Groups') && (
              <>
                <View style={ModalStyles.section}>
                  <FormField
                    label="Beneficiary Name"
                    inputRef={getInputRef(7)}
                    containerRef={getContainerRef(7)}
                    onLayout={e => handleContainerLayout(7, e)}
                    scrollViewRef={scrollViewRef}
                    style={ModalStyles.inputGroup}
                    inputStyle={ModalStyles.textInput}
                    value={beneficiaryName}
                    onChangeText={setBeneficiaryName}
                    placeholder="Enter beneficiary name"
                    returnKeyType="next"
                    onSubmitEditing={() => handleSubmitEditing(7, 8, 'next')}
                    onFocus={() => handleInputFocus(7)}
                  />
                </View>

                <View style={ModalStyles.section}>
                  <FormField
                    label="Bank Name"
                    inputRef={getInputRef(8)}
                    containerRef={getContainerRef(8)}
                    onLayout={e => handleContainerLayout(8, e)}
                    scrollViewRef={scrollViewRef}
                    style={ModalStyles.inputGroup}
                    inputStyle={ModalStyles.textInput}
                    value={bankName}
                    onChangeText={setBankName}
                    placeholder="Enter bank name"
                    returnKeyType="next"
                    onSubmitEditing={() => handleSubmitEditing(8, 10, 'next')}
                    onFocus={() => handleInputFocus(8)}
                  />
                </View>

                <View style={ModalStyles.section}>
                  <FormField
                    label="Account Number"
                    inputRef={getInputRef(10)}
                    containerRef={getContainerRef(10)}
                    onLayout={e => handleContainerLayout(10, e)}
                    scrollViewRef={scrollViewRef}
                    style={ModalStyles.inputGroup}
                    inputStyle={ModalStyles.textInput}
                    value={accountNumber}
                    onChangeText={setAccountNumber}
                    placeholder="Enter account number"
                    keyboardType={getKeyboardType('numeric')}
                    returnKeyType="next"
                    onSubmitEditing={() => handleSubmitEditing(10, 9, 'next')}
                    onFocus={() => handleInputFocus(10)}
                  />
                </View>

                <View style={ModalStyles.section}>
                  <FormField
                    label="IFSC Code"
                    inputRef={getInputRef(9)}
                    containerRef={getContainerRef(9)}
                    onLayout={e => handleContainerLayout(9, e)}
                    scrollViewRef={scrollViewRef}
                    style={ModalStyles.inputGroup}
                    inputStyle={ModalStyles.textInput}
                    value={ifscCode}
                    onChangeText={setIfscCode}
                    placeholder="Enter IFSC code"
                    returnKeyType="next"
                    onSubmitEditing={() => handleSubmitEditing(9, 11, 'next')}
                    onFocus={() => handleInputFocus(9)}
                  />
                </View>
              </>
            )}

          {/* GST Registration Type */}
          {(ledgerType === 'Sundry Debtors' ||
            ledgerType === 'Sundry Creditors' ||
            ledgerType === 'Custom Groups') && (
              <View
                style={ModalStyles.section}
                ref={gstRegistrationRef}
                onLayout={event => {
                  const {y} = event.nativeEvent.layout;
                  setGstRegistrationY(y);
                }}>
                <View style={ModalStyles.inputGroup}>
                  <Text style={ModalStyles.inputLabel}>
                    GST Registration Type <Text style={styles.required}>*</Text>
                  </Text>
                  <TouchableOpacity
                    style={ModalStyles.dropdownField}
                    onPress={() => {
                      const newValue = !showGstTypeDropdown;
                      closeAllDropdowns();
                      setShowGstTypeDropdown(newValue);
                      if (newValue && scrollViewRef.current && gstRegistrationY > 0) {
                        setTimeout(() => {
                          scrollViewRef.current?.scrollTo({
                            y: gstRegistrationY - 20,
                            animated: true,
                          });
                        }, 100);
                      }
                    }}
                    activeOpacity={0.7}>
                    <Text style={ModalStyles.dropdownText}>
                      {gstRegistrationType || 'Select type'}
                    </Text>
                    <Feather
                      name={showGstTypeDropdown ? 'chevron-up' : 'chevron-down'}
                      size={16}
                      color="#666"
                    />
                  </TouchableOpacity>

                  {showGstTypeDropdown && (
                    <View style={styles.gstDropdownListExpanded}>
                      {gstRegistrationTypes.map((type, index) => (
                        <TouchableOpacity
                          key={index}
                          style={[
                            ModalStyles.dropdownItem,
                            index === gstRegistrationTypes.length - 1 &&
                            ModalStyles.lastDropdownOption,
                          ]}
                          onPress={() => {
                            setGstRegistrationType(type);
                            setShowGstTypeDropdown(false);
                            if (type !== 'Regular') {
                              setGstin('');
                            }
                            // Scroll back to remove extra bottom space - scroll to field position
                            setTimeout(() => {
                              if (scrollViewRef.current && gstRegistrationY > 0) {
                                scrollViewRef.current?.scrollTo({
                                  y: Math.max(0, gstRegistrationY - 50),
                                  animated: true,
                                });
                              }
                            }, 150);
                          }}>
                          <Text style={ModalStyles.dropdownItemText}>{type}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </View>
              </View>
            )}

          {/* GSTIN - Conditional (Mandatory if Regular) */}
          {gstRegistrationType === 'Regular' &&
            (ledgerType === 'Sundry Debtors' ||
              ledgerType === 'Sundry Creditors' ||
              ledgerType === 'Custom Groups') && (
              <View style={ModalStyles.section}>
                <FormField
                  label="GSTIN"
                  required
                  error={errors.gstin}
                  inputRef={getInputRef(getGstinFieldIndex())}
                  containerRef={getContainerRef(getGstinFieldIndex())}
                  onLayout={e => handleContainerLayout(getGstinFieldIndex(), e)}
                  scrollViewRef={scrollViewRef}
                  style={ModalStyles.inputGroup}
                  inputStyle={ModalStyles.textInput}
                  value={gstin}
                  onChangeText={text => {
                    setGstin(text);
                    if (errors.gstin) {
                      setErrors(prev => ({...prev, gstin: ''}));
                    }
                  }}
                  placeholder="Enter GSTIN"
                  autoCapitalize="characters"
                  returnKeyType="next"
                  onSubmitEditing={() =>
                    handleSubmitEditing(
                      getGstinFieldIndex(),
                      getPanItFieldIndex(),
                      'next'
                    )
                  }
                  onFocus={() => handleInputFocus(getGstinFieldIndex())}
                />
              </View>
            )}

          {/* PAN/IT No. */}
          {(ledgerType === 'Sundry Debtors' ||
            ledgerType === 'Sundry Creditors' ||
            ledgerType === 'Custom Groups') && (
              <View style={ModalStyles.section}>
                <FormField
                  label="PAN/IT No."
                  inputRef={getInputRef(getPanItFieldIndex())}
                  containerRef={getContainerRef(getPanItFieldIndex())}
                  onLayout={e => handleContainerLayout(getPanItFieldIndex(), e)}
                  scrollViewRef={scrollViewRef}
                  style={ModalStyles.inputGroup}
                  inputStyle={ModalStyles.textInput}
                  value={panItNumber}
                  onChangeText={setPanItNumber}
                  placeholder="Enter PAN/IT number"
                  autoCapitalize="characters"
                  returnKeyType="done"
                  onSubmitEditing={() => Keyboard.dismiss()}
                  onFocus={() => handleInputFocus(getPanItFieldIndex())}
                />
              </View>
            )}
        </ScrollView>

        {/* Save Button */}
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
                  <Text style={styles.saveButtonText}>Ledger Created</Text>
                </>
              ) : (
                <Text style={styles.saveButtonText}>Save Ledger</Text>
              )}
            </TouchableOpacity>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 12,
  },
  required: {
    color: '#EF4444',
  },
  inputError: CommonInputStyles.textInputError,
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  toggleSectionSpacing: {
    marginTop: 8,
    marginBottom: 8,
  },
  openingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === 'ios' ? 10 : 6,
    minHeight: Platform.OS === 'ios' ? 40 : 36,
  },
  openingInput: {
    flex: 1,
    fontSize: 14,
    color: Colors.primaryText,
    backgroundColor: 'transparent',
    borderWidth: 0,
    padding: 0,
    paddingVertical: 6,
  },
  drLabel: {
    fontSize: 14,
    color: Colors.secondaryText,
  },
  crLabel: {
    fontSize: 14,
    color: Colors.secondaryText,
    marginLeft: 10,
  },
  countryInputGroup: {
    flex: 0.51,
  },
  pincodeInputGroup: {
    flex: 0.45,
  },
  percentageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingLeft: 12,
    paddingRight: 8,
    height: 50,
  },
  percentageInput: {
    flex: 1,
    fontSize: 14,
    color: '#111111', 
    paddingVertical: 12,
    height: 50,
  },
  percentageSymbol: {
    fontSize: 16,
    color: '#111',
    fontWeight: '600',
    marginLeft: 4,
    marginRight:10
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === 'ios' ? 13 : 14,
    minHeight: Platform.OS === 'ios' ? 40 : 36,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    paddingVertical: 0,
  },
  clearButton: {
    padding: 4,
  },
  selectedGroupContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginTop: 8,
  },
  selectedGroupText: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  emptyContainer: {
    padding: 12,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 12,
    color: '#8F939E',
    textAlign: 'center',
  },
  dropdownScrollView: {
    maxHeight: 240,
  },
  readOnlyInputContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 12,
    paddingVertical: 12,
    minHeight: 50,
    justifyContent: 'center',
  },
  readOnlyInputText: {
    fontSize: 14,
    color: '#666',
  },
  gstDropdownListExpanded: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    marginTop: 4,
    overflow: 'hidden',
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
});

export default AddLedgerScreen;
