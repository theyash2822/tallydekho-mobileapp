import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import {globalStyles, Icons} from '../utils/Constants';
import Logo from '../components/common/Logo';
import {TextMedium, TextSemibold} from '../utils/CustomText';
import Colors from '../utils/Colors';
import {navigateNext} from '../navigation/FlowController';
import apiService from '../services/api/apiService';
import {Logger} from '../services/utils/logger';
import CountryPickernew from '../components/common/Countrypicker';

const LoginScreen = ({navigation, route}) => {
  const initialCountryCode = route?.params?.countryCode || '+91';
  const initialPhoneNumber = route?.params?.phoneNumber || '';

  const [phoneNumber, setPhoneNumber] = useState(initialPhoneNumber);
  const [countryCode, setCountryCode] = useState(initialCountryCode);
  const [showButton, setShowButton] = useState(true);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [phoneNumberError, setPhoneNumberError] = useState('');

  useEffect(() => {
    if (route?.params?.countryCode) {
      setCountryCode(route.params.countryCode);
    }
    if (route?.params?.phoneNumber) {
      setPhoneNumber(route.params.phoneNumber);
    }
  }, [route?.params?.countryCode, route?.params?.phoneNumber]);

  const handlePhoneChange = value => {
    setPhoneNumber(value);
    if (phoneNumberError) setPhoneNumberError('');
  };

  const handleSendOTP = async () => {
    if (!phoneNumber) {
      setPhoneNumberError('Please enter your mobile number');
      return;
    }

    if (phoneNumber.length < 10) {
      setPhoneNumberError('Please enter a valid mobile number');
      return;
    }

    setPhoneNumberError('');

    if (sendingOtp) return;
    setSendingOtp(true);

    try {
      Logger.info('Login: sending OTP', {mobileNumber: phoneNumber});
      const response = await apiService.sendOtp({mobileNumber: phoneNumber});

      if (response?.status) {
        navigateNext(navigation, 'AFTER_LOGIN', {
          phoneNumber,
          countryCode,
        });
      } else {
        Logger.warn('Login: OTP failed', {message: response?.message});
      }
    } catch (error) {
      Logger.error('Login: OTP request error', error);
    } finally {
      setSendingOtp(false);
    }
  };

  const handleCountrySelect = country => {
    setCountryCode(country.code);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ImageBackground
        source={require('../assets/Group37.png')}
        style={styles.backgroundImage}
        resizeMode="cover"
      />

      <View style={styles.container}>
        <Logo />

        <TextSemibold fontSize={36} color={Colors.primaryTitle}>
          Enter your WhatsApp Number
        </TextSemibold>

        <CountryPickernew
          onSelect={handleCountrySelect}
          phoneNumber={phoneNumber}
          setPhoneNumber={handlePhoneChange}
          Icons={Icons}
          setShowButton={setShowButton}
          setCountryCode={setCountryCode}
          initialCountryCode={countryCode}
          initialPhoneNumber={initialPhoneNumber}
        />

        {phoneNumberError ? (
          <Text style={styles.errorText}>{phoneNumberError}</Text>
        ) : null}

        {showButton && (
          <TouchableOpacity
            style={styles.button}
            onPress={handleSendOTP}
            disabled={sendingOtp}>
            {sendingOtp ? (
              <ActivityIndicator size="small" color={Colors.white} />
            ) : (
              <TextMedium fontSize={18} color={Colors.white}>
                Send OTP
              </TextMedium>
            )}
          </TouchableOpacity>
        )}
      </View>
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
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  button: {
    backgroundColor: '#07624c',
    paddingVertical: 10,
    borderRadius: 32,
    marginTop: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 13,
    marginTop: 6,
    marginLeft: 4,
  },
});

export default LoginScreen;
