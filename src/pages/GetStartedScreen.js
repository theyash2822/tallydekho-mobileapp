import React, {useState, useRef, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  SafeAreaView,
  StyleSheet,
  TextInput,
  ScrollView,
  Platform,
  BackHandler,
  ActivityIndicator,
} from 'react-native';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {Checkbox} from '../components/Helper/HelperComponents';
import {Icons} from '../utils/Constants';
import Logo from '../components/common/Logo';
import {TextMedium, TextRegular, TextSemibold} from '../utils/CustomText';
import Colors from '../utils/Colors';
import TermsModal from './getstarted/TermsModal';
import PrivacyPolicyModal from './getstarted/PrivacyPolicyModal';
import CustomTextInput2 from '../components/common/CustomTextInput2';
import {navigateNext} from '../navigation/FlowController';
import apiService from '../services/api/apiService';
import {Logger} from '../services/utils/logger';
import useKeyboardVisibility from '../hooks/useKeyboardVisibility';
import {countries} from '../utils/Constants';

const CustomTextInput = ({
  placeholder,
  value,
  onChangeText,
  leftIcon,
  inputRef,
  returnKeyType,
  onSubmitEditing,
  onFocus,
}) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: Colors.border,
        backgroundColor: Colors.white,
        marginBottom: 10,
        paddingHorizontal: 10,
        height: 50,
      }}>
      {leftIcon && (
        <View style={{marginRight: 8}}>{leftIcon(22, '#898E9A')}</View>
      )}
      <TextInput
        ref={inputRef}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#8F9393"
        returnKeyType={returnKeyType}
        onSubmitEditing={onSubmitEditing}
        onFocus={onFocus}
        blurOnSubmit={false}
        style={{
          flex: 1,
          fontSize: 16,
          color: Colors.black,
        }}
      />
    </View>
  );
};

const Getstarted = ({navigation}) => {
  const nav = useNavigation();
  const [fullName, setFullName] = useState('');
  const [language, setLanguage] = useState('');
  const [checked, setChecked] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [languageError, setLanguageError] = useState('');
  const [fullNameError, setFullNameError] = useState('');
  const [termsError, setTermsError] = useState('');

  const [isTermsModalVisible, setIsTermsModalVisible] = useState(false);
  const [isPrivacyModalVisible, setIsPrivacyModalVisible] = useState(false);
  
  const isKeyboardVisible = useKeyboardVisibility();
  const scrollViewRef = useRef(null);
  const nameInputRef = useRef(null);
  const languageInputRef = useRef(null);
  const languageDropdownRef = useRef(null);

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        // ✅ User reached GetStarted after OTP - they must complete it
        // Don't allow going back - just stay on GetStarted screen
        // Return true to prevent default back behavior (which would close app)
        return true;
      };

      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        onBackPress,
      );

      return () => backHandler.remove();
    }, [nav]),
  );

  useEffect(() => {
    if (isKeyboardVisible) {
      setTimeout(() => {
        scrollViewRef.current?.scrollTo({
          y: Platform.OS === 'ios' ? 150 : 200,
          animated: true,
        });
      }, Platform.OS === 'ios' ? 250 : 100);
    } else if (!isKeyboardVisible) {
      // Reset scroll position when keyboard closes
      setTimeout(() => {
        scrollViewRef.current?.scrollTo({
          y: 0,
          animated: true,
        });
      }, 100);
    }
  }, [isKeyboardVisible]);

  const handleLanguageChange = text => {
    setLanguage(text);
    // Validate language when user types - use includes() to match dropdown filtering
    if (text.trim()) {
      const hasMatchingOptions = countries.some(
        country =>
          country.language.toLowerCase().includes(text.toLowerCase().trim()) ||
          country.name.toLowerCase().includes(text.toLowerCase().trim()),
      );
      // Show error if no matching options (for any length)
      if (!hasMatchingOptions) {
        setLanguageError('Incorrect language');
      } else {
        setLanguageError('');
      }
    } else {
      setLanguageError('');
    }
  };

  const handleLanguageBlur = () => {
    if (language.trim()) {
      // On blur, check for exact match (user should select from dropdown)
      const isValidLanguage = countries.some(
        country =>
          country.language.toLowerCase() === language.toLowerCase().trim() ||
          country.name.toLowerCase() === language.toLowerCase().trim(),
      );
      if (!isValidLanguage) {
        setLanguageError('Incorrect language');
      }
    }
  };

  // Check if form is valid (all required fields filled)
  const isFormValid = () => {
    // Check if full name is filled
    if (!fullName.trim()) {
      return false;
    }

    // Check if language is filled and valid
    if (!language.trim()) {
      return false;
    }

    const isValidLanguage = countries.some(
      country =>
        country.language.toLowerCase() === language.toLowerCase().trim() ||
        country.name.toLowerCase() === language.toLowerCase().trim(),
    );
    if (!isValidLanguage) {
      return false;
    }

    // Check if terms are accepted
    if (!checked) {
      return false;
    }

    return true;
  };

  const handleLogin = async () => {
    // Clear previous errors
    setFullNameError('');
    setLanguageError('');
    setTermsError('');

    let hasErrors = false;

    // Validate full name
    if (!fullName.trim()) {
      setFullNameError('Please enter your full name');
      hasErrors = true;
    }

    // Validate language - check if empty or if it's an invalid language
    if (!language.trim()) {
      setLanguageError('Please choose a language');
      hasErrors = true;
    } else {
      // Check if the language is valid (exists in countries list)
      const isValidLanguage = countries.some(
        country =>
          country.language.toLowerCase() === language.toLowerCase().trim() ||
          country.name.toLowerCase() === language.toLowerCase().trim(),
      );
      if (!isValidLanguage) {
        setLanguageError('Please choose a valid language');
        hasErrors = true;
      }
    }

    // Validate terms acceptance
    if (!checked) {
      setTermsError('Please accept the Terms & Conditions and Privacy Policy');
      hasErrors = true;
    }

    if (hasErrors || submitting) {
      return;
    }

    setSubmitting(true);

    try {
      Logger.info('Onboarding: submitting details', {
        name: fullName.trim(),
        language: language.trim(),
      });
      const response = await apiService.submitOnboarding({
        name: fullName.trim(),
        language: language.trim(),
      });
      if (response?.status) {
        Logger.info('Onboarding: submission success', {message: response?.message});
        // Don't clear saved values here - keep them in case user comes back
        // They will be cleared only after successful sync/pairing
        navigateNext(navigation, 'AFTER_GET_STARTED');
      } else {
        Logger.warn('Onboarding: submission failed', {message: response?.message});
      }
    } catch (error) {
      Logger.error('Onboarding: submission error', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ImageBackground
        source={require('../assets/Group37.png')}
        style={styles.backgroundImage}
        resizeMode="cover">
        <View style={styles.overlay} />
      </ImageBackground>

      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={[
          styles.scrollContent,
          isKeyboardVisible && styles.keyboardPadding,
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        keyboardDismissMode="interactive">
        <View style={styles.container}>
          <Logo />

          <TextSemibold
            fontSize={38}
            color={Colors.primaryTitle}
            style={styles.title}>
            Get Started
          </TextSemibold>

          <TextRegular
            fontSize={15}
            color={Colors.secondaryText}
            style={styles.subtitle}>
            Log in to access your profile and get started easily.
          </TextRegular>

          {/* Full Name Input */}
          <CustomTextInput
            placeholder="Full Name"
            value={fullName}
            onChangeText={text => {
              setFullName(text);
              if (fullNameError) {
                setFullNameError('');
              }
            }}
            leftIcon={() => Icons.User(22, '#898E9A')}
            inputRef={nameInputRef}
            returnKeyType="next"
            onSubmitEditing={() => {
              languageInputRef.current?.focus();
              // Open language dropdown when navigating from name to language
              setTimeout(() => {
                languageDropdownRef.current?.openDropdown();
              }, 100);
            }}
            onFocus={() => {
              // Close language dropdown when name field is focused
              languageDropdownRef.current?.closeDropdown();
            }}
          />
          {fullNameError && (
            <Text style={styles.errorText}>{fullNameError}</Text>
          )}

          <CustomTextInput2
            ref={languageDropdownRef}
            placeholder="Choose Language"
            value={language}
            onChangeText={handleLanguageChange}
            onBlur={handleLanguageBlur}
            onFocus={() => {
              // Clear error when user focuses language field
              if (languageError) {
                setLanguageError('');
              }
            }}
            leftIcon={() => Icons.Globe(22, '#898E9A')}
            isDropdown
            inputRef={languageInputRef}
            returnKeyType="done"
            errorMessage={languageError}
          />

          {/* Terms + Privacy */}
          <View style={styles.linksContainer}>
            <Checkbox
              checked={checked}
              onPress={() => {
                setChecked(!checked);
                if (termsError) {
                  setTermsError('');
                }
              }}
              style={{marginBottom: 0}}
            />
            <TextRegular fontSize={14}>Accept</TextRegular>
            <TouchableOpacity onPress={() => setIsTermsModalVisible(true)}>
              <TextMedium fontSize={14} color={'#007AFF'} style={styles.linkText}>
                Terms & Conditions
              </TextMedium>
            </TouchableOpacity>
            <Text style={styles.separator}>&</Text>
            <TouchableOpacity onPress={() => setIsPrivacyModalVisible(true)}>
              <TextMedium fontSize={14} color={'#007AFF'} style={styles.linkText}>
                Privacy Policy
              </TextMedium>
            </TouchableOpacity>
          </View>
          {termsError && (
            <Text style={styles.errorText}>{termsError}</Text>
          )}

          {/* Login Button */}
          <TouchableOpacity
            style={[
              styles.button,
              (!isFormValid() || submitting) && styles.buttonDisabled,
            ]}
            onPress={handleLogin}
            disabled={!isFormValid() || submitting}>
            {submitting ? (
              <ActivityIndicator size="small" color={Colors.white} />
            ) : (
              <TextRegular
                fontSize={18}
                color={Colors.white}
                style={styles.buttonText}>
                Login
              </TextRegular>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Terms Modal */}
      <TermsModal
        visible={isTermsModalVisible}
        onClose={() => setIsTermsModalVisible(false)}
      />

      {/* Privacy Modal */}
      <PrivacyPolicyModal
        visible={isPrivacyModalVisible}
        onClose={() => setIsPrivacyModalVisible(false)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {flex: 1, backgroundColor: Colors.white},
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '50%',
    zIndex: 0,
  },
  scrollContent: {
    flexGrow: 1,
  },
  keyboardPadding: {
    paddingBottom: Platform.OS === 'ios' ? 330 : 370,
  },
  container: {paddingHorizontal: 20},
  title: {marginBottom: 20},
  subtitle: {marginBottom: 20},
  linksContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 10,
  },
  linkText: {
    textDecorationLine: 'underline',
    marginHorizontal: 4,
  },
  separator: {marginHorizontal: 1},
  button: {
    backgroundColor: '#07624c',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonDisabled: {
    backgroundColor: '#A8D5BA',
    opacity: 0.7,
  },
  buttonText: {textAlign: 'center'},
  errorText: {
    fontSize: 12,
    color: '#EF4444',
    marginTop: -8,
    marginBottom: 8,
    marginLeft: 4,
  },
});

export default Getstarted;
