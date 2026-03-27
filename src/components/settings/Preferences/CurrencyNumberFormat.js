import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import {useNavigation} from '@react-navigation/native';
import Header from '../../common/Header';
import Colors from '../../../utils/Colors';
import {CommonDropdownStyles} from '../../../utils/CommonStyles';

const CurrencyNumberFormat = () => {
  const navigation = useNavigation();
  const [saveState, setSaveState] = useState('save'); // 'save', 'saving', 'saved'

  const [formData, setFormData] = useState({
    currency: 'INR',
    dateStyle: 'DD/MM/YYYY',
    timeStyle: '24-hour',
    thousandsSeparator: '12 34 567,89',
    negativeStyle: '-1234',
    decimalPlacement: 2,
  });

  const [showCurrencyDropdown, setShowCurrencyDropdown] = useState(false);
  const [showDateStyleDropdown, setShowDateStyleDropdown] = useState(false);
  const [showTimeStyleDropdown, setShowTimeStyleDropdown] = useState(false);
  const [showThousandsSeparatorDropdown, setShowThousandsSeparatorDropdown] =
    useState(false);
  const [showNegativeStyleDropdown, setShowNegativeStyleDropdown] =
    useState(false);

  const currencies = [
    'INR',
    'USD',
    'EUR',
    'GBP',
    'JPY',
    'CAD',
    'AUD',
    'CHF',
    'CNY',
    'SGD',
  ];

  const dateStyles = [
    'DD/MM/YYYY',
    'MM/DD/YYYY',
    'YYYY-MM-DD',
    'DD-MM-YYYY',
    'MM-DD-YYYY',
  ];

  const timeStyles = ['24-hour', '12-hour'];

  const thousandsSeparators = [
    '12 34 567,89',
    '12,345,678.90',
    '12.345.678,90',
    '12 345 678.90',
    '12,34,56,789.00',
  ];

  const negativeStyles = ['-1234', '(1234)', '1234-', '1234'];

  const handleSave = async () => {
    setSaveState('saving');

    // Simulate API call
    setTimeout(() => {
      setSaveState('saved');

      // Reset to 'save' after 2 seconds
      setTimeout(() => {
        setSaveState('save');
      }, 2000);
    }, 1500);
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  const updateFormData = (key, value) => {
    setFormData(prev => ({...prev, [key]: value}));
  };

  const handleCurrencySelect = currency => {
    updateFormData('currency', currency);
    setShowCurrencyDropdown(false);
  };

  const handleDateStyleSelect = dateStyle => {
    updateFormData('dateStyle', dateStyle);
    setShowDateStyleDropdown(false);
  };

  const handleTimeStyleSelect = timeStyle => {
    updateFormData('timeStyle', timeStyle);
    setShowTimeStyleDropdown(false);
  };

  const handleThousandsSeparatorSelect = separator => {
    updateFormData('thousandsSeparator', separator);
    setShowThousandsSeparatorDropdown(false);
  };

  const handleNegativeStyleSelect = negativeStyle => {
    updateFormData('negativeStyle', negativeStyle);
    setShowNegativeStyleDropdown(false);
  };

  // Close all dropdowns
  const closeAllDropdowns = () => {
    setShowCurrencyDropdown(false);
    setShowDateStyleDropdown(false);
    setShowTimeStyleDropdown(false);
    setShowThousandsSeparatorDropdown(false);
    setShowNegativeStyleDropdown(false);
  };

  // Toggle dropdown with exclusive behavior (only one open at a time)
  const toggleDropdown = (dropdownType) => {
    closeAllDropdowns();
    switch (dropdownType) {
      case 'currency':
        setShowCurrencyDropdown(true);
        break;
      case 'dateStyle':
        setShowDateStyleDropdown(true);
        break;
      case 'timeStyle':
        setShowTimeStyleDropdown(true);
        break;
      case 'thousandsSeparator':
        setShowThousandsSeparatorDropdown(true);
        break;
      case 'negativeStyle':
        setShowNegativeStyleDropdown(true);
        break;
      default:
        break;
    }
  };

  const handleDecimalPlacementChange = increment => {
    const newValue = Math.max(
      0,
      Math.min(4, formData.decimalPlacement + increment),
    );
    updateFormData('decimalPlacement', newValue);
  };

  const getSaveButtonContent = () => {
    switch (saveState) {
      case 'saving':
        return (
          <>
            <Icon
              name="loader"
              size={16}
              color={Colors.white}
              style={styles.spinningIcon}
            />
            <Text style={styles.saveButtonText}>Saving...</Text>
          </>
        );
      case 'saved':
        return (
          <>
            <Icon name="check" size={16} color={Colors.white} />
            <Text style={styles.saveButtonText}>Saved</Text>
          </>
        );
      default:
        return <Text style={styles.saveButtonText}>Save</Text>;
    }
  };

  const getSaveButtonStyle = () => {
    switch (saveState) {
      case 'saving':
        return [styles.saveButton, styles.savingButton];
      case 'saved':
        return [styles.saveButton, styles.savedButton];
      default:
        return styles.saveButton;
    }
  };

  return (
    <>
      <View style={styles.container}>
        <Header title="Currency & Number Format" leftIcon="chevron-left" />

        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}>
          {/* Settings Card */}
          <View style={styles.settingsCard}>
            {/* Currency */}
            <View style={styles.settingItem}>
              <Text style={styles.settingLabel}>Currency</Text>
              <TouchableOpacity
                style={styles.dropdownInput}
                onPress={() => {
                  if (showCurrencyDropdown) {
                    setShowCurrencyDropdown(false);
                  } else {
                    toggleDropdown('currency');
                  }
                }}>
                <Text style={styles.dropdownText}>{formData.currency}</Text>
                <Icon
                  name={showCurrencyDropdown ? 'chevron-up' : 'chevron-down'}
                  size={20}
                  color="#667085"
                />
              </TouchableOpacity>

              {showCurrencyDropdown && (
                <View style={styles.dropdownOptions}>
                  <ScrollView
                    showsVerticalScrollIndicator={false}
                    nestedScrollEnabled={true}
                    maxHeight={200}>
                    {currencies.map((currency, index) => (
                      <TouchableOpacity
                        key={index}
                        style={[
                          styles.dropdownOption,
                          formData.currency === currency &&
                            styles.selectedOption,
                          index === currencies.length - 1 && styles.lastDropdownOption,
                        ]}
                        onPress={() => handleCurrencySelect(currency)}>
                        <Text
                          style={[
                            styles.dropdownOptionText,
                            formData.currency === currency &&
                              styles.selectedOptionText,
                          ]}>
                          {currency}
                        </Text>
                        {formData.currency === currency && (
                          <Icon name="check" size={16} color="#10B981" />
                        )}
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}
            </View>

            {/* Date Style */}
            <View style={styles.settingItem}>
              <Text style={styles.settingLabel}>Date Style</Text>
              <TouchableOpacity
                style={styles.dropdownInput}
                onPress={() => {
                  if (showDateStyleDropdown) {
                    setShowDateStyleDropdown(false);
                  } else {
                    toggleDropdown('dateStyle');
                  }
                }}>
                <Text style={styles.dropdownText}>{formData.dateStyle}</Text>
                <Icon
                  name={showDateStyleDropdown ? 'chevron-up' : 'chevron-down'}
                  size={20}
                  color="#667085"
                />
              </TouchableOpacity>

              {showDateStyleDropdown && (
                <View style={styles.dropdownOptions}>
                  <ScrollView
                    showsVerticalScrollIndicator={false}
                    nestedScrollEnabled={true}
                    maxHeight={200}>
                    {dateStyles.map((dateStyle, index) => (
                      <TouchableOpacity
                        key={index}
                        style={[
                          styles.dropdownOption,
                          formData.dateStyle === dateStyle &&
                            styles.selectedOption,
                          index === dateStyles.length - 1 && styles.lastDropdownOption,
                        ]}
                        onPress={() => handleDateStyleSelect(dateStyle)}>
                        <Text
                          style={[
                            styles.dropdownOptionText,
                            formData.dateStyle === dateStyle &&
                              styles.selectedOptionText,
                          ]}>
                          {dateStyle}
                        </Text>
                        {formData.dateStyle === dateStyle && (
                          <Icon name="check" size={16} color="#10B981" />
                        )}
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}
            </View>

            {/* Time Style */}
            <View style={styles.settingItem}>
              <Text style={styles.settingLabel}>Time Style</Text>
              <TouchableOpacity
                style={styles.dropdownInput}
                onPress={() => {
                  if (showTimeStyleDropdown) {
                    setShowTimeStyleDropdown(false);
                  } else {
                    toggleDropdown('timeStyle');
                  }
                }}>
                <Text style={styles.dropdownText}>{formData.timeStyle}</Text>
                <Icon
                  name={showTimeStyleDropdown ? 'chevron-up' : 'chevron-down'}
                  size={20}
                  color="#667085"
                />
              </TouchableOpacity>

              {showTimeStyleDropdown && (
                <View style={styles.dropdownOptions}>
                  <ScrollView
                    showsVerticalScrollIndicator={false}
                    nestedScrollEnabled={true}
                    maxHeight={200}>
                    {timeStyles.map((timeStyle, index) => (
                      <TouchableOpacity
                        key={index}
                        style={[
                          styles.dropdownOption,
                          formData.timeStyle === timeStyle &&
                            styles.selectedOption,
                          index === timeStyles.length - 1 && styles.lastDropdownOption,
                        ]}
                        onPress={() => handleTimeStyleSelect(timeStyle)}>
                        <Text
                          style={[
                            styles.dropdownOptionText,
                            formData.timeStyle === timeStyle &&
                              styles.selectedOptionText,
                          ]}>
                          {timeStyle}
                        </Text>
                        {formData.timeStyle === timeStyle && (
                          <Icon name="check" size={16} color="#10B981" />
                        )}
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}
            </View>

            {/* Thousands Separator */}
            <View style={styles.settingItem}>
              <Text style={styles.settingLabel}>Thousands Separator</Text>
              <TouchableOpacity
                style={styles.dropdownInput}
                onPress={() => {
                  if (showThousandsSeparatorDropdown) {
                    setShowThousandsSeparatorDropdown(false);
                  } else {
                    toggleDropdown('thousandsSeparator');
                  }
                }}>
                <Text style={styles.dropdownText}>
                  {formData.thousandsSeparator}
                </Text>
                <Icon
                  name={
                    showThousandsSeparatorDropdown
                      ? 'chevron-up'
                      : 'chevron-down'
                  }
                  size={20}
                  color="#667085"
                />
              </TouchableOpacity>

              {showThousandsSeparatorDropdown && (
                <View style={styles.dropdownOptions}>
                  <ScrollView
                    showsVerticalScrollIndicator={false}
                    nestedScrollEnabled={true}
                    maxHeight={200}>
                    {thousandsSeparators.map((separator, index) => (
                      <TouchableOpacity
                        key={index}
                        style={[
                          styles.dropdownOption,
                          formData.thousandsSeparator === separator &&
                            styles.selectedOption,
                          index === thousandsSeparators.length - 1 && styles.lastDropdownOption,
                        ]}
                        onPress={() =>
                          handleThousandsSeparatorSelect(separator)
                        }>
                        <Text
                          style={[
                            styles.dropdownOptionText,
                            formData.thousandsSeparator === separator &&
                              styles.selectedOptionText,
                          ]}>
                          {separator}
                        </Text>
                        {formData.thousandsSeparator === separator && (
                          <Icon name="check" size={16} color="#10B981" />
                        )}
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}
            </View>

            {/* Negative Style */}
            <View style={styles.settingItem}>
              <Text style={styles.settingLabel}>Negative Style</Text>
              <TouchableOpacity
                style={styles.dropdownInput}
                onPress={() => {
                  if (showNegativeStyleDropdown) {
                    setShowNegativeStyleDropdown(false);
                  } else {
                    toggleDropdown('negativeStyle');
                  }
                }}>
                <Text style={styles.dropdownText}>
                  {formData.negativeStyle}
                </Text>
                <Icon
                  name={
                    showNegativeStyleDropdown ? 'chevron-up' : 'chevron-down'
                  }
                  size={20}
                  color="#667085"
                />
              </TouchableOpacity>

              {showNegativeStyleDropdown && (
                <View style={styles.dropdownOptions}>
                  <ScrollView
                    showsVerticalScrollIndicator={false}
                    nestedScrollEnabled={true}
                    maxHeight={200}>
                    {negativeStyles.map((negativeStyle, index) => (
                      <TouchableOpacity
                        key={index}
                        style={[
                          styles.dropdownOption,
                          formData.negativeStyle === negativeStyle &&
                            styles.selectedOption,
                          index === negativeStyles.length - 1 && styles.lastDropdownOption,
                        ]}
                        onPress={() =>
                          handleNegativeStyleSelect(negativeStyle)
                        }>
                        <Text
                          style={[
                            styles.dropdownOptionText,
                            formData.negativeStyle === negativeStyle &&
                              styles.selectedOptionText,
                          ]}>
                          {negativeStyle}
                        </Text>
                        {formData.negativeStyle === negativeStyle && (
                          <Icon name="check" size={16} color="#10B981" />
                        )}
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}
            </View>

            {/* Decimal Placement */}
            <View style={styles.settingItem}>
              <Text style={styles.settingLabel}>Decimal Placement</Text>
              <View style={styles.decimalControl}>
                <TouchableOpacity
                  style={styles.decimalButton}
                  onPress={() => handleDecimalPlacementChange(-1)}>
                  <Icon name="minus" size={16} color="#667085" />
                </TouchableOpacity>

                <View style={styles.decimalDisplay}>
                  <Text style={styles.decimalText}>
                    {formData.decimalPlacement === 0
                      ? '0'
                      : `0.${'0'.repeat(formData.decimalPlacement)}`}
                  </Text>
                </View>

                <TouchableOpacity
                  style={styles.decimalButton}
                  onPress={() => handleDecimalPlacementChange(1)}>
                  <Icon name="plus" size={16} color="#667085" />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Action Buttons */}
        </ScrollView>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={getSaveButtonStyle()}
          onPress={handleSave}
          disabled={saveState === 'saving'}>
          {getSaveButtonContent()}
        </TouchableOpacity>

        <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F5FA',
  },
  scrollView: {
    flex: 1,
  },
  settingsCard: {
    backgroundColor: Colors.white,
    marginHorizontal: 12,
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    marginTop: 10,
  },
  settingItem: {
    marginBottom: 10,
  },
  settingLabel: {
    fontSize: 12,
    fontWeight: '400',
    color: '#8F939E',
    marginBottom: 4,
  },
  dropdownInput: CommonDropdownStyles.dropdownInput,
  dropdownText: {
    fontSize: 14,
    color: '#111827',
  },
  dropdownOptions: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    marginTop: 4,
    maxHeight: 250,
    overflow: 'hidden',
  },
  dropdownOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  lastDropdownOption: {
    borderBottomWidth: 0,
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
  decimalControl: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  decimalButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  decimalDisplay: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  decimalText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  buttonContainer: {
    padding: 12,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  saveButton: {
    backgroundColor: '#07624C',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginVertical: 6,
    gap: 8,
  },
  savingButton: {
    backgroundColor: '#059669',
  },
  savedButton: {
    backgroundColor: '#059669',
  },
  saveButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButton: {
    backgroundColor: '#EEEEEE',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginVertical: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '600',
  },
  spinningIcon: {
    // Add rotation animation if needed
  },
});

export default CurrencyNumberFormat;
