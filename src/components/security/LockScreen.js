import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {ScanFace, Fingerprint} from 'lucide-react-native';
import Colors from '../../utils/Colors';
import biometricService from '../../services/security/biometricService';
import passkeyService from '../../services/security/passkeyService';
import screenLockService from '../../services/security/screenLockService';

const LockScreen = ({onUnlock}) => {
  const [passkey, setPasskey] = useState(['', '', '', '']);
  const [biometricAvailable, setBiometricAvailable] = useState(false);
  const [biometricType, setBiometricType] = useState(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const inputRefs = [useRef(), useRef(), useRef(), useRef()];

  useEffect(() => {
    checkBiometricAvailability();
  }, []);

  const checkBiometricAvailability = async () => {
    const {available, type} = await biometricService.isAvailable();
    setBiometricAvailable(available);
    setBiometricType(type);
  };

  const handleChange = (text, index) => {
    if (text.length > 1) return;

    const newPasskey = [...passkey];
    newPasskey[index] = text;
    setPasskey(newPasskey);

    if (text && index < 3) {
      inputRefs[index + 1].current?.focus();
    }

    if (newPasskey.every(digit => digit !== '')) {
      handleVerifyPasskey(newPasskey.join(''));
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && !passkey[index] && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };

  const handleVerifyPasskey = async (enteredPasskey) => {
    setIsAuthenticating(true);
    
    try {
      const isValid = await passkeyService.verifyPasskey(enteredPasskey);
      
      if (isValid) {
        setPasskey(['', '', '', '']);
        await screenLockService.unlock();
        onUnlock && onUnlock();
      } else {
        Alert.alert('Invalid Passkey', 'The passkey you entered is incorrect. Please try again.');
        setPasskey(['', '', '', '']);
        inputRefs[0].current?.focus();
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to verify passkey. Please try again.');
      setPasskey(['', '', '', '']);
      inputRefs[0].current?.focus();
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleBiometricAuth = async () => {
    setIsAuthenticating(true);
    
    try {
      const result = await biometricService.authenticate('Unlock Tally Dekho');
      
      if (result.success) {
        await screenLockService.unlock();
        onUnlock && onUnlock();
      } else {
        Alert.alert('Authentication Failed', result.error || 'Biometric authentication failed');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to authenticate. Please try again.');
    } finally {
      setIsAuthenticating(false);
    }
  };

  const biometricTypeName = biometricService.getBiometricTypeName(biometricType);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
        <View style={styles.content}>
          <Icon name="lock" size={64} color={Colors.primary} style={styles.lockIcon} />
          <Text style={styles.title}>App Locked</Text>
          <Text style={styles.subtitle}>Enter your passkey to unlock</Text>

          <View style={styles.passkeyContainer}>
            {passkey.map((digit, index) => (
              <TextInput
                key={index}
                ref={inputRefs[index]}
                style={[styles.passkeyInput, digit && styles.passkeyInputFilled]}
                value={digit}
                maxLength={1}
                keyboardType="numeric"
                secureTextEntry
                onChangeText={text => handleChange(text, index)}
                onKeyPress={e => handleKeyPress(e, index)}
                editable={!isAuthenticating}
                selectTextOnFocus
              />
            ))}
          </View>

          {biometricAvailable && (
            <TouchableOpacity
              style={styles.biometricButton}
              onPress={handleBiometricAuth}
              disabled={isAuthenticating}
            >
              {Platform.OS === 'ios' ? (
                <ScanFace size={24} color={Colors.primary} />
              ) : (
                <Fingerprint size={24} color={Colors.primary} />
              )}
              <Text style={styles.biometricText}>
                {Platform.OS === 'ios' ? 'Use Face ID' : `Use ${biometricTypeName}`}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundColorPrimary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    width: '100%',
    paddingHorizontal: 40,
    alignItems: 'center',
  },
  lockIcon: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111111',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#667085',
    marginBottom: 32,
    textAlign: 'center',
  },
  passkeyContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 32,
  },
  passkeyInput: {
    width: 60,
    height: 60,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    backgroundColor: Colors.white,
    textAlign: 'center',
    fontSize: 24,
    fontWeight: '600',
    color: '#111111',
  },
  passkeyInputFilled: {
    borderColor: Colors.primary,
    borderWidth: 2,
  },
  biometricButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  biometricText: {
    fontSize: 16,
    color: Colors.primary,
    fontWeight: '500',
    marginLeft: 8,
  },
});

export default LockScreen;
