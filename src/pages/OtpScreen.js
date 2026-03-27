import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  SafeAreaView,
  Keyboard,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import { globalStyles } from '../utils/Constants';
import Logo from '../components/common/Logo';
import { TextRegular, TextSemibold } from '../utils/CustomText';
import Colors from '../utils/Colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiService from '../services/api/apiService';
import { Logger } from '../services/utils/logger';
import wsService from '../services/websocket/websocketService';
import { verifySessionToken } from '../utils/sessionManager';
import { getDeviceDetails } from '../utils/devicedetails';
import { useAuth } from '../hooks/useAuth';
import useKeyboardVisibility from '../hooks/useKeyboardVisibility';

const OtpScreen = ({ navigation }) => {
  const [otp, setOtp] = useState(['', '', '', '']);
  const [timer, setTimer] = useState(30);
  const [errorMessage, setErrorMessage] = useState('');
  const [isResendDisabled, setIsResendDisabled] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [resending, setResending] = useState(false);
  const route = useRoute();
  const phoneNumber = route.params?.phoneNumber || '';
  const countryCode = route.params?.countryCode || '+91-';
  const inputRefs = useRef([...Array(4)].map(() => React.createRef()));
  const { fetchCompaniesData } = useAuth();
  const isKeyboardVisible = useKeyboardVisibility();

  /** OTP Resend Timer */
  const handleResendOTP = async () => {
    if (isResendDisabled || resending) return;

    try {
      setResending(true);
      Logger.info('OTP: resend requested', { mobileNumber: phoneNumber });
      const response = await apiService.sendOtp({ mobileNumber: phoneNumber });

      if (response?.status) {
        setTimer(30);
        setIsResendDisabled(true);
        Logger.info('OTP: resend success', { message: response?.message });
      } else {
        Logger.warn('OTP: resend failed', { message: response?.message });
      }
    } catch (error) {
      Logger.error('OTP: resend error', error);
    } finally {
      setResending(false);
    }
  };

  const handleContinueOTP = async () => {
    Keyboard.dismiss(); // Close the keyboard
    const enteredOtp = otp.join('');
    if (enteredOtp.length !== otp.length) {
      setErrorMessage('Please enter the 4-digit OTP');
      return;
    }
    if (verifying) {
      return;
    }

    setVerifying(true);
    Logger.info('OTP: verifying', { mobileNumber: phoneNumber, otp: enteredOtp });
    try {
      const response = await apiService.verifyOtp({
        mobileNumber: phoneNumber,
        otp: enteredOtp,
      });
      if (response?.status) {
        const token = response?.data?.token;
        if (!token) {
          throw new Error('Token missing in verification response');
        }

        // Step 1: Save token
        await AsyncStorage.setItem('authToken', token);
        const preview = token.length > 6 ? `${token.slice(0, 6)}...` : token;
        Logger.info('OTP: auth token saved', {
          tokenPreview: preview,
        });
        await AsyncStorage.removeItem('loggedOut');
        setErrorMessage('');

        // Step 2: Verify token with verify API
        Logger.info('OTP: Verifying token with verify API');
        const verifyResponse = await apiService.verifyToken(token);
        Logger.info('OTP: Verify API response', verifyResponse);

        if (!verifyResponse?.status) {
          throw new Error('Token verification failed');
        }

        // Step 3: Sync verification data (sets onboardingDone based on name)
        const verifyData = verifyResponse?.data || {};
        const nameValue = verifyData?.name;
        const isPairedFromAPI = verifyData?.isPaired === true;

        // Check if name exists and is not null/empty
        const hasProfileName =
          nameValue !== null &&
          nameValue !== undefined &&
          typeof nameValue === 'string' &&
          nameValue.trim().length > 0;

        // Clear onboardingDone first, then set only if name exists
        await AsyncStorage.removeItem('onboardingDone');
        if (hasProfileName) {
          await AsyncStorage.setItem('onboardingDone', 'true');
          await AsyncStorage.setItem('userName', nameValue.trim());

        } else {
          await AsyncStorage.removeItem('userName');

        }

        // Set pairing status
        await AsyncStorage.setItem(
          'isPaired',
          isPairedFromAPI ? 'true' : 'false',
        );

        // Step 4: Update pairing details (PUT /pairing) with device info
        try {
          let devicePayload = null;
          const storedDeviceInfo = await AsyncStorage.getItem('deviceInfo');
          if (storedDeviceInfo) {
            devicePayload = JSON.parse(storedDeviceInfo);
          } else {
            devicePayload = await getDeviceDetails();
            await AsyncStorage.setItem(
              'deviceInfo',
              JSON.stringify(devicePayload),
            );
          }
          if (devicePayload) {
            Logger.info(
              'OTP: Updating pairing details after login',
              devicePayload,
            );
            await apiService.updatePairing({
              manufacturer: devicePayload.manufacturer,
              model: devicePayload.model,
              isAndroid: devicePayload.isAndroid,
              appVersion: devicePayload.appVersion,
            });
          } else {
            Logger.warn('OTP: No device info available for updatePairing');
          }
        } catch (pairingUpdateError) {

          Logger.error(
            'OTP: Failed to update pairing details',
            pairingUpdateError,
          );
        }

        // Step 5: Connect WebSocket (don't block navigation)

        Logger.info('OTP: Connecting WebSocket after token verification');
        wsService.connect().catch(wsError => {

          Logger.error('OTP: WebSocket connection failed', wsError);
          // Don't block navigation if WebSocket fails
        });

        // Step 6: Fetch companies so Dashboard shows the latest list (without manual refresh)
        if (typeof fetchCompaniesData === 'function') {
          try {
            Logger.info('OTP: Fetching companies immediately after login');
            await fetchCompaniesData({ force: true });
          } catch (companiesError) {
            Logger.error(
              'OTP: Failed to fetch companies after login',
              companiesError,
            );
          }
        }

        // Step 7: Navigate based on profile name
        const nextScreen = hasProfileName ? 'MainTabs' : 'getStarted';

        // Set flag if navigating to GetStarted - this persists until user completes onboarding
        if (!hasProfileName) {
          await AsyncStorage.setItem('reachedGetStarted', 'true');

        }

        Logger.info('OTP: verification success - navigating', {
          isPairedFromAPI,
          message: response?.message,
          nameValue,
          hasProfileName,
          nextScreen,
        });

        navigation.replace(nextScreen);
      } else {
        setErrorMessage(response?.message || 'OTP does not match');
      }
    } catch (error) {
      setErrorMessage(error.message || 'Failed to verify OTP');
    } finally {
      setVerifying(false);
    }
  };

  const handleOtpChange = (value, index) => {
    // Only take the last character if multiple characters are entered
    const digit = value.slice(-1);

    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);

    // Clear error message when user edits OTP
    if (errorMessage) {
      setErrorMessage('');
    }

    // Move to next field if a digit was entered and it's not the last field
    if (digit && index < otp.length - 1) {
      // Use setTimeout to ensure the focus happens after the state update
      setTimeout(() => {
        inputRefs.current[index + 1].current.focus();
      }, 10);
    }
  };

  /** Handle Backspace */
  const handleOtpKeyPress = (event, index) => {
    if (event.nativeEvent.key === 'Backspace') {
      const newOtp = [...otp];
      if (otp[index]) {
        // Clear current input
        newOtp[index] = '';
      } else if (index > 0) {
        // Move to the previous field and clear it
        newOtp[index - 1] = '';
        inputRefs.current[index - 1].current.focus();
      }
      setOtp(newOtp);
    }
  };

  /** Timer Effect */
  useEffect(() => {
    let interval;
    if (isResendDisabled && timer > 0) {
      interval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
    } else {
      setIsResendDisabled(false);
    }
    return () => clearInterval(interval);
  }, [timer, isResendDisabled]);

  const scrollViewRef = useRef(null);

  /** Scroll content up when keyboard opens */
  useEffect(() => {
    if (isKeyboardVisible) {
      setTimeout(() => {
        scrollViewRef.current?.scrollTo({
          y: Platform.OS === 'ios' ? 150 : 300,
          animated: true,
        });
      }, Platform.OS === 'ios' ? 300 : 250);
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
          <View>
            <TextSemibold
              fontSize={36}
              color={Colors.primaryTitle}
              fontWeight={500}
              style={styles.title}>
              We've sent code to your WhatsApp number
            </TextSemibold>
          </View>

          <View style={styles.phoneNumberContainer}>
            <TextRegular
              fontSize={14}
              color={Colors.secondaryText}
              style={styles.subtitle}>
              Code has been sent to {countryCode}
              {phoneNumber}
            </TextRegular>
            <TouchableOpacity
              onPress={() => {
                // Remove dash from country code if present (e.g., '+91-' -> '+91')
                const cleanCountryCode = countryCode.replace('-', '');
                navigation.navigate('login', {
                  countryCode: cleanCountryCode,
                  phoneNumber: phoneNumber,
                });
              }}
              style={styles.editIcon}>
              <Text style={styles.changeText}>Change</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.otpContainer}>
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                ref={inputRefs.current[index]}
                style={styles.otpInput}
                value={digit}
                onChangeText={value => handleOtpChange(value, index)}
                keyboardType={Platform.OS === 'ios' ? 'number-pad' : 'numeric'}
                maxLength={1}
                autoFocus={index === 0}
                blurOnSubmit={false}
                returnKeyType={Platform.OS === 'android' ? 'done' : 'default'}
                onKeyPress={event => handleOtpKeyPress(event, index)}
                onSubmitEditing={() => {
                  if (
                    Platform.OS === 'android' &&
                    index === otp.length - 1
                  ) {
                    handleContinueOTP();
                  }
                }}
                textContentType="oneTimeCode"
                selectTextOnFocus={true}
              />


            ))}
          </View>
          {errorMessage ? (
            <Text style={styles.errorText}>{errorMessage}</Text>
          ) : null}

          <TouchableOpacity
            style={styles.button}
            onPress={handleContinueOTP}
            disabled={verifying}>
            {verifying ? (
              <ActivityIndicator size="small" color={Colors.white} />
            ) : (
              <TextRegular
                fontSize={18}
                color={Colors.white}
                style={styles.buttonText}>
                Continue
              </TextRegular>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.resendButton}
            onPress={handleResendOTP}
            disabled={isResendDisabled || resending}>
            <TextRegular
              fontSize={18}
              color={'#76777b'}
              style={styles.resendButtonText}>
              Resend
            </TextRegular>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.white,
  },
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
    paddingBottom: Platform.OS === 'ios' ? 280 : 340,
  },
  container: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  title: {
    marginBottom: 10,
  },
  subtitle: {
    marginBottom: 0,
  },
  phoneNumberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    marginLeft: 4
  },
  editIcon: {
    marginLeft: 2,
    padding: 4,
  },
  changeText: {
    fontSize: 14,
    color: '#07624C',
    textDecorationLine: 'underline',
    textDecorationColor: '#07624C',
    fontWeight: '500',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 16,
  },
  otpInput: {
    width: 75.5,
    height: 72,
    borderWidth: 2,
    borderRadius: 8,
    borderColor: Colors.border,
    textAlign: 'center',
    fontSize: 24,
    marginHorizontal: 4,
  },
  button: {
    backgroundColor: '#07624c',
    paddingVertical: 12,
    borderRadius: 32,
    marginTop: 12,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    textAlign: 'center',
  },
  resendButton: {
    backgroundColor: '#eceff7',
    paddingVertical: 12,
    borderRadius: 32,
    marginTop: 12,
  },
  resendButtonText: {
    textAlign: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    textAlign: 'start',
    marginBottom: 4,
    marginLeft: 4,
  },
});

export default OtpScreen;
