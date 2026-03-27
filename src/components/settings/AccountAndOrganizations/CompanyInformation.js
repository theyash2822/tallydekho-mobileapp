import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  Platform,
  Keyboard,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import {launchImageLibrary} from 'react-native-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from '../../common/Header';
import Colors from '../../../utils/Colors';
import {CommonLabelStyles, CommonDropdownStyles} from '../../../utils/CommonStyles';
import CustomBottomButtons from '../../common/CustomBottomButtons';
import FormField from '../../common/FormField';
import {Checkbox} from '../../Helper/HelperComponents';
import useKeyboardVisibility from '../../../hooks/useKeyboardVisibility';
import { useInputNavigation } from '../../stocksManagement/StockOverview/TotalStock/Components/inputNavigation';

const CompanyInformation = () => {
  const navigation = useNavigation();
  const [saveState, setSaveState] = useState('save'); // 'save', 'saving', 'saved'
  const [selectedImage, setSelectedImage] = useState(null);

  const [formData, setFormData] = useState({
    companyName: '',
    address: '',
    gstin: '',
    registrationType: '',
    pan: '',
    fyStartMonth: '',
    booksLockDate: true,
    phone: '',
    email: '',
    website: '',
    companyLogo: null, // Add logo field to formData
  });

  const [showFyMonthDropdown, setShowFyMonthDropdown] = useState(false);
  const [showRegistrationTypeDropdown, setShowRegistrationTypeDropdown] =
    useState(false);

  // Keyboard and scroll management
  const isKeyboardVisible = useKeyboardVisibility();
  const scrollViewRef = useRef(null);

  // Field names in order (text inputs only)
  const fieldNames = [
    'companyName',
    'address',
    'gstin',
    'pan',
    'phone',
    'email',
    'website',
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

  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const registrationTypes = [
    'Regular',
    'Composition',
    'Unregistered',
    'Input Service Distributor',
    'SEZ Unit',
  ];

  const handleSave = async () => {
    setSaveState('saving');

    try {
      // Prepare data to save (including image)
      const dataToSave = {
        ...formData,
        companyLogo: selectedImage || formData.companyLogo, // Include current image
      };

      console.log('Saving company information:', dataToSave);

      // Simulate API call
      setTimeout(() => {
        setSaveState('saved');

        // Reset to 'save' after 2 seconds
        setTimeout(() => {
          setSaveState('save');
        }, 2000);
      }, 1500);
    } catch (error) {
      console.error('Error saving:', error);
      Alert.alert('Error', 'Failed to save company information');
      setSaveState('save');
    }
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  const updateFormData = (key, value) => {
    setFormData(prev => {
      // Only update if the value is actually different
      if (prev[key] === value) {
        return prev;
      }
      return {...prev, [key]: value};
    });
  };

  const handleMonthSelect = month => {
    updateFormData('fyStartMonth', month);
    setShowFyMonthDropdown(false);
  };

  const handleRegistrationTypeSelect = type => {
    updateFormData('registrationType', type);
    setShowRegistrationTypeDropdown(false);
  };

  const handleImagePicker = async () => {
    try {
      const result = await launchImageLibrary({
        mediaType: 'photo',
        includeBase64: false,
        maxHeight: 2000,
        maxWidth: 2000,
      });

      if (result?.assets?.length) {
        const source = {uri: result.assets[0].uri};
        setSelectedImage(source);
        // Also update formData with the selected image
        updateFormData('companyLogo', source);
        // Save the selected image to AsyncStorage
        await saveSelectedImage(source);
      }
    } catch (err) {
      console.warn(err);
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const saveSelectedImage = async imageSource => {
    try {
      await AsyncStorage.setItem('companyLogo', JSON.stringify(imageSource));
    } catch (error) {
      console.error('Error saving image:', error);
    }
  };

  const loadSelectedImage = async () => {
    try {
      const savedImage = await AsyncStorage.getItem('companyLogo');
      if (savedImage) {
        const imageSource = JSON.parse(savedImage);
        setSelectedImage(imageSource);
        updateFormData('companyLogo', imageSource);
      }
    } catch (error) {
      console.error('Error loading image:', error);
    }
  };

  // Load the saved image when the screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      loadSelectedImage();
    }, []),
  );

  return (
    <>
      <View style={styles.container}>
        <Header title="Company Information" leftIcon="chevron-left" />

        <ScrollView
          ref={scrollViewRef}
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="interactive"
          nestedScrollEnabled={true}
          scrollEnabled={true}
          contentContainerStyle={
            isKeyboardVisible && Platform.OS === 'ios' && {paddingBottom: 200}
          }>
          {/* Form Section */}
          <View style={styles.formContainer}>
            {/* Company Logo Section */}
            <View style={styles.logoSection}>
              <View style={styles.logoContainer}>
                <View style={styles.logoBackground}>
                  <Image
                    source={
                      selectedImage || require('../../../assets/logo.png')
                    }
                    style={styles.logo}
                    defaultSource={require('../../../assets/logo.png')}
                  />
                </View>
                <TouchableOpacity
                  style={styles.cameraButton}
                  onPress={handleImagePicker}>
                  <Icon name="camera" size={20} color="#000" />
                </TouchableOpacity>
              </View>
              <Text style={styles.logoText}>Only JPG, PNG and GIF</Text>
              <Text style={styles.logoText}>Maximum size 50kb</Text>
            </View>

            {/* Company Name */}
            <FormField
              label="Company Name"
              inputRef={getInputRef(0)}
              containerRef={getContainerRef(0)}
              onLayout={e => handleContainerLayout(0, e)}
              style={styles.inputGroup}
              scrollViewRef={scrollViewRef}
              value={formData.companyName}
              onChangeText={text => updateFormData('companyName', text)}
              placeholder="Enter company name"
              returnKeyType="next"
              onSubmitEditing={() => handleSubmitEditing(0, 1, 'next')}
              onFocus={() => handleInputFocus(0)}
            />

            {/* Address */}
            <FormField
              label="Address"
              inputRef={getInputRef(1)}
              containerRef={getContainerRef(1)}
              onLayout={e => handleContainerLayout(1, e)}
              style={styles.inputGroup}
              scrollViewRef={scrollViewRef}
              multiline
              value={formData.address}
              onChangeText={text => updateFormData('address', text)}
              placeholder="Enter company address"
              returnKeyType="next"
              onSubmitEditing={() => handleSubmitEditing(1, 2, 'next')}
              onFocus={() => handleInputFocus(1)}
            />

            {/* GSTIN */}
            <FormField
              label="GSTIN"
              required
              inputRef={getInputRef(2)}
              containerRef={getContainerRef(2)}
              onLayout={e => handleContainerLayout(2, e)}
              style={styles.inputGroup}
              scrollViewRef={scrollViewRef}
              value={formData.gstin}
              onChangeText={text => updateFormData('gstin', text)}
              placeholder="Enter GSTIN"
              returnKeyType="next"
              onSubmitEditing={() => handleSubmitEditing(2, 3, 'next')}
              onFocus={() => handleInputFocus(2)}
            />

            {/* Registration Type */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Registration Type<Text style={{color: '#EF4444'}}> *</Text></Text>
              <TouchableOpacity
                style={styles.dropdownInput}
                onPress={() =>
                  setShowRegistrationTypeDropdown(!showRegistrationTypeDropdown)
                }>
                <Text
                  style={[
                    styles.dropdownText,
                    !formData.registrationType && styles.placeholderText,
                  ]}>
                  {formData.registrationType || 'Select registration type'}
                </Text>
                <Icon
                  name={
                    showRegistrationTypeDropdown ? 'chevron-up' : 'chevron-down'
                  }
                  size={20}
                  color="#667085"
                />
              </TouchableOpacity>

              {showRegistrationTypeDropdown && (
                <View style={styles.dropdownOptions}>
                  {registrationTypes.map((type, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.dropdownOption,
                        formData.registrationType === type &&
                          styles.selectedOption,
                        index === 0 && styles.firstDropdownOption,
                        index === registrationTypes.length - 1 &&
                          styles.lastDropdownOption,
                      ]}
                      onPress={() => handleRegistrationTypeSelect(type)}>
                      <Text
                        style={[
                          styles.dropdownOptionText,
                          formData.registrationType === type &&
                            styles.selectedOptionText,
                        ]}>
                        {type}
                      </Text>
                      {formData.registrationType === type && (
                        <Icon name="check" size={16} color="#10B981" />
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            {/* PAN */}
            <FormField
              label="PAN"
              inputRef={getInputRef(3)}
              containerRef={getContainerRef(3)}
              onLayout={e => handleContainerLayout(3, e)}
              style={styles.inputGroup}
              scrollViewRef={scrollViewRef}
              value={formData.pan}
              onChangeText={text => updateFormData('pan', text)}
              placeholder="Enter PAN"
              returnKeyType="next"
              onSubmitEditing={() => handleSubmitEditing(3, 4, 'next')}
              onFocus={() => handleInputFocus(3)}
            />

            {/* FY Start Month */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>FY Start Month<Text style={{color: '#EF4444'}}> *</Text></Text>
              <TouchableOpacity
                style={styles.dropdownInput}
                onPress={() => setShowFyMonthDropdown(!showFyMonthDropdown)}>
                <Text
                  style={[
                    styles.dropdownText,
                    !formData.fyStartMonth && styles.placeholderText,
                  ]}>
                  {formData.fyStartMonth || 'Select FY start month'}
                </Text>
                <Icon
                  name={showFyMonthDropdown ? 'chevron-up' : 'chevron-down'}
                  size={20}
                  color="#667085"
                />
              </TouchableOpacity>

              {showFyMonthDropdown && (
                <View style={styles.dropdownOptions}>
                  <ScrollView
                    showsVerticalScrollIndicator={false}
                    nestedScrollEnabled={true}>
                    {months.map((month, index) => (
                      <TouchableOpacity
                        key={index}
                        style={[
                          styles.dropdownOption,
                          formData.fyStartMonth === month &&
                            styles.selectedOption,
                          index === 0 && styles.firstDropdownOption,
                          index === months.length - 1 &&
                            styles.lastDropdownOption,
                        ]}
                        onPress={() => handleMonthSelect(month)}>
                        <Text
                          style={[
                            styles.dropdownOptionText,
                            formData.fyStartMonth === month &&
                              styles.selectedOptionText,
                          ]}>
                          {month}
                        </Text>
                        {formData.fyStartMonth === month && (
                          <Icon name="check" size={16} color="#10B981" />
                        )}
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}
            </View>

            <Checkbox
              checked={formData.booksLockDate}
              onPress={() =>
                updateFormData('booksLockDate', !formData.booksLockDate)
              }
              label="30 days after FY end"
            />

            {/* Phone */}
            <FormField
              label="Phone"
              inputRef={getInputRef(4)}
              containerRef={getContainerRef(4)}
              onLayout={e => handleContainerLayout(4, e)}
              style={styles.inputGroup}
              scrollViewRef={scrollViewRef}
              value={formData.phone}
              onChangeText={text => updateFormData('phone', text)}
              placeholder="Enter phone number"
              keyboardType={Platform.OS === 'ios' ? 'numbers-and-punctuation' : 'phone-pad'}
              returnKeyType="next"
              onSubmitEditing={() => handleSubmitEditing(4, 5, 'next')}
              onFocus={() => handleInputFocus(4)}
            />

            {/* Email */}
            <FormField
              label="Email"
              inputRef={getInputRef(5)}
              containerRef={getContainerRef(5)}
              onLayout={e => handleContainerLayout(5, e)}
              style={styles.inputGroup}
              scrollViewRef={scrollViewRef}
              value={formData.email}
              onChangeText={text => updateFormData('email', text)}
              placeholder="Enter email address"
              keyboardType="email-address"
              autoCapitalize="none"
              returnKeyType="next"
              onSubmitEditing={() => {
                if (scrollViewRef?.current) {
                  scrollViewRef.current.scrollToEnd({animated: true});
                }
                setTimeout(() => {
                  handleSubmitEditing(5, 6, 'next');
                }, 100);
              }}
              onFocus={() => handleInputFocus(5)}
            />

            {/* Website */}
            <FormField
              label="Website"
              inputRef={getInputRef(6)}
              containerRef={getContainerRef(6)}
              onLayout={e => handleContainerLayout(6, e)}
              style={styles.inputGroup}
              scrollViewRef={scrollViewRef}
              value={formData.website}
              onChangeText={text => updateFormData('website', text)}
              placeholder="Enter website URL"
              autoCapitalize="none"
              returnKeyType="done"
              onSubmitEditing={() => handleSubmitEditing(6, null, 'done')}
              onFocus={() => {
                setTimeout(() => {
                  if (scrollViewRef?.current) {
                    scrollViewRef.current.scrollToEnd({animated: true});
                  }
                }, 300);
                handleInputFocus(6);
              }}
            />

            {/* Bottom spacer for iOS keyboard */}
            {isKeyboardVisible && Platform.OS === 'ios' && (
              <View style={{height: 20}} />
            )}
          </View>
        </ScrollView>
      </View>
      <CustomBottomButtons
        onSave={handleSave}
        onCancel={handleCancel}
        saveState={saveState}
      />
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
  logoSection: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  logoContainer: {
    position: 'relative',
    marginBottom: 10,
  },
  logoBackground: {
    position: 'relative',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#F0F0F0', // A placeholder background
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#F0F0F0',
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.white,
  },
  logoText: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 2,
  },
  formContainer: {
    backgroundColor: Colors.white,
    marginHorizontal: 12,
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
    marginTop: 10,
  },
  inputGroup: {
    marginBottom: 10,
  },
  label: CommonLabelStyles.label,
  dropdownInput: CommonDropdownStyles.dropdownInput,
  dropdownText: CommonDropdownStyles.dropdownText,
  placeholderText: {
    color: '#8F939E',
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
});

export default CompanyInformation;
