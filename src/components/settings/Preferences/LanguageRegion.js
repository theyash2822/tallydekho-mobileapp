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

const LanguageRegion = () => {
  const navigation = useNavigation();
  const [saveState, setSaveState] = useState('save'); // 'save', 'saving', 'saved'

  const [formData, setFormData] = useState({
    language: 'English',
    country: 'India',
    timeZone: 'UTC+05:30 (Asia/Kolkata)',
    firstDayOfWeek: 'Monday',
  });

  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [showTimeZoneDropdown, setShowTimeZoneDropdown] = useState(false);
  const [showFirstDayDropdown, setShowFirstDayDropdown] = useState(false);

  const languages = [
    'English',
    'Hindi',
    'Gujarati',
    'Marathi',
    'Bengali',
    'Tamil',
    'Telugu',
    'Kannada',
    'Malayalam',
    'Punjabi',
  ];

  const countries = [
    'India',
    'United States',
    'United Kingdom',
    'Canada',
    'Australia',
    'Germany',
    'France',
    'Japan',
    'China',
    'Brazil',
  ];

  const timeZones = [
    'UTC+05:30 (Asia/Kolkata)',
    'UTC+00:00 (Europe/London)',
    'UTC-05:00 (America/New_York)',
    'UTC-08:00 (America/Los_Angeles)',
    'UTC+01:00 (Europe/Berlin)',
    'UTC+09:00 (Asia/Tokyo)',
    'UTC+08:00 (Asia/Shanghai)',
    'UTC+05:00 (Asia/Karachi)',
    'UTC+03:00 (Asia/Dubai)',
    'UTC+02:00 (Africa/Cairo)',
  ];

  const firstDays = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ];

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

  const handleLanguageSelect = language => {
    updateFormData('language', language);
    setShowLanguageDropdown(false);
  };

  const handleCountrySelect = country => {
    updateFormData('country', country);
    setShowCountryDropdown(false);
  };

  const handleTimeZoneSelect = timeZone => {
    updateFormData('timeZone', timeZone);
    setShowTimeZoneDropdown(false);
  };

  const handleFirstDaySelect = firstDay => {
    updateFormData('firstDayOfWeek', firstDay);
    setShowFirstDayDropdown(false);
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
        <Header title="Language & Region" leftIcon="chevron-left" />

        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}>
          {/* Settings Card */}
          <View style={styles.settingsCard}>
            {/* Language */}
            <View style={styles.settingItem}>
              <Text style={styles.settingLabel}>Language</Text>
              <TouchableOpacity
                style={styles.dropdownInput}
                onPress={() => {
                  setShowLanguageDropdown(!showLanguageDropdown);
                  setShowCountryDropdown(false);
                  setShowTimeZoneDropdown(false);
                  setShowFirstDayDropdown(false);
                }}>
                <Text style={styles.dropdownText}>{formData.language}</Text>
                <Icon
                  name={showLanguageDropdown ? 'chevron-up' : 'chevron-down'}
                  size={20}
                  color="#667085"
                />
              </TouchableOpacity>

              {showLanguageDropdown && (
                <View style={styles.dropdownOptions}>
                  <ScrollView
                    showsVerticalScrollIndicator={false}
                    nestedScrollEnabled={true}
                    maxHeight={200}>
                    {languages.map((language, index) => (
                      <TouchableOpacity
                        key={index}
                        style={[
                          styles.dropdownOption,
                          formData.language === language &&
                            styles.selectedOption,
                          index === languages.length - 1 && styles.lastDropdownOption,
                        ]}
                        onPress={() => handleLanguageSelect(language)}>
                        <Text
                          style={[
                            styles.dropdownOptionText,
                            formData.language === language &&
                              styles.selectedOptionText,
                          ]}>
                          {language}
                        </Text>
                        {formData.language === language && (
                          <Icon name="check" size={16} color="#10B981" />
                        )}
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}
            </View>

            {/* Country */}
            <View style={styles.settingItem}>
              <Text style={styles.settingLabel}>Country</Text>
              <TouchableOpacity
                style={styles.dropdownInput}
                onPress={() => {
                  setShowCountryDropdown(!showCountryDropdown);
                  setShowLanguageDropdown(false);
                  setShowTimeZoneDropdown(false);
                  setShowFirstDayDropdown(false);
                }}>
                <Text style={styles.dropdownText}>{formData.country}</Text>
                <Icon
                  name={showCountryDropdown ? 'chevron-up' : 'chevron-down'}
                  size={20}
                  color="#667085"
                />
              </TouchableOpacity>

              {showCountryDropdown && (
                <View style={styles.dropdownOptions}>
                  <ScrollView
                    showsVerticalScrollIndicator={false}
                    nestedScrollEnabled={true}
                    maxHeight={200}>
                    {countries.map((country, index) => (
                      <TouchableOpacity
                        key={index}
                        style={[
                          styles.dropdownOption,
                          formData.country === country && styles.selectedOption,
                          index === countries.length - 1 && styles.lastDropdownOption,
                        ]}
                        onPress={() => handleCountrySelect(country)}>
                        <Text
                          style={[
                            styles.dropdownOptionText,
                            formData.country === country &&
                              styles.selectedOptionText,
                          ]}>
                          {country}
                        </Text>
                        {formData.country === country && (
                          <Icon name="check" size={16} color="#10B981" />
                        )}
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}
            </View>

            {/* Time Zone */}
            <View style={styles.settingItem}>
              <Text style={styles.settingLabel}>Time Zone</Text>
              <TouchableOpacity
                style={styles.dropdownInput}
                onPress={() => {
                  setShowTimeZoneDropdown(!showTimeZoneDropdown);
                  setShowLanguageDropdown(false);
                  setShowCountryDropdown(false);
                  setShowFirstDayDropdown(false);
                }}>
                <Text style={styles.dropdownText}>{formData.timeZone}</Text>
                <Icon
                  name={showTimeZoneDropdown ? 'chevron-up' : 'chevron-down'}
                  size={20}
                  color="#667085"
                />
              </TouchableOpacity>

              {showTimeZoneDropdown && (
                <View style={styles.dropdownOptions}>
                  <ScrollView
                    showsVerticalScrollIndicator={false}
                    nestedScrollEnabled={true}
                    maxHeight={200}>
                    {timeZones.map((timeZone, index) => (
                      <TouchableOpacity
                        key={index}
                        style={[
                          styles.dropdownOption,
                          formData.timeZone === timeZone &&
                            styles.selectedOption,
                          index === timeZones.length - 1 && styles.lastDropdownOption,
                        ]}
                        onPress={() => handleTimeZoneSelect(timeZone)}>
                        <Text
                          style={[
                            styles.dropdownOptionText,
                            formData.timeZone === timeZone &&
                              styles.selectedOptionText,
                          ]}>
                          {timeZone}
                        </Text>
                        {formData.timeZone === timeZone && (
                          <Icon name="check" size={16} color="#10B981" />
                        )}
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}
            </View>

            {/* First Day of Week */}
            <View style={styles.settingItem}>
              <Text style={styles.settingLabel}>First Day of Week</Text>
              <TouchableOpacity
                style={styles.dropdownInput}
                onPress={() => {
                  setShowFirstDayDropdown(!showFirstDayDropdown);
                  setShowLanguageDropdown(false);
                  setShowCountryDropdown(false);
                  setShowTimeZoneDropdown(false);
                }}>
                <Text style={styles.dropdownText}>
                  {formData.firstDayOfWeek}
                </Text>
                <Icon
                  name={showFirstDayDropdown ? 'chevron-up' : 'chevron-down'}
                  size={20}
                  color="#667085"
                />
              </TouchableOpacity>

              {showFirstDayDropdown && (
                <View style={styles.dropdownOptions}>
                  <ScrollView
                    showsVerticalScrollIndicator={false}
                    nestedScrollEnabled={true}
                    maxHeight={200}>
                    {firstDays.map((firstDay, index) => (
                      <TouchableOpacity
                        key={index}
                        style={[
                          styles.dropdownOption,
                          formData.firstDayOfWeek === firstDay &&
                            styles.selectedOption,
                          index === firstDays.length - 1 && styles.lastDropdownOption,
                        ]}
                        onPress={() => handleFirstDaySelect(firstDay)}>
                        <Text
                          style={[
                            styles.dropdownOptionText,
                            formData.firstDayOfWeek === firstDay &&
                              styles.selectedOptionText,
                          ]}>
                          {firstDay}
                        </Text>
                        {formData.firstDayOfWeek === firstDay && (
                          <Icon name="check" size={16} color="#10B981" />
                        )}
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}
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
    marginBottom: 20,
    marginTop: 12,
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

export default LanguageRegion;
