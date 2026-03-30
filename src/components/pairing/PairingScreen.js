/**
 * PairingScreen — Single unified Tally pairing component
 * Used in both onboarding flow and Settings > Integrations
 * 
 * Props:
 *   onSuccess(deviceId) — called when pairing succeeds
 *   onSkip()            — called when user skips (onboarding only)
 *   showSkip            — whether to show skip button (default: false)
 *   title               — optional custom title
 */

import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Keyboard,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiService from '../../services/api/apiService';
import { Logger } from '../../services/utils/logger';
import { getDeviceDetails } from '../../utils/devicedetails';

const CODE_LENGTH = 6;

const PairingScreen = ({
  onSuccess,
  onSkip,
  showSkip = false,
  title = 'Connect to Tally Prime',
}) => {
  const [code, setCode] = useState(Array(CODE_LENGTH).fill(''));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const inputRefs = useRef(Array(CODE_LENGTH).fill(null));

  const handleChange = (text, index) => {
    // Only allow single digit
    const digit = text.replace(/[^0-9]/g, '').slice(-1);
    const newCode = [...code];
    newCode[index] = digit;
    setCode(newCode);
    setError('');

    // Auto-advance
    if (digit && index < CODE_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all filled
    if (digit && index === CODE_LENGTH - 1) {
      const full = [...newCode].join('');
      if (full.length === CODE_LENGTH) {
        handleSubmit(full);
      }
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace') {
      const newCode = [...code];
      if (newCode[index]) {
        newCode[index] = '';
        setCode(newCode);
      } else if (index > 0) {
        newCode[index - 1] = '';
        setCode(newCode);
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  const handleSubmit = async (fullCode) => {
    const enteredCode = fullCode || code.join('');
    if (enteredCode.length !== CODE_LENGTH) {
      setError(`Please enter all ${CODE_LENGTH} digits`);
      return;
    }

    Keyboard.dismiss();
    setLoading(true);
    setError('');

    try {
      // Get device info
      let deviceData = {};
      try {
        const storedInfo = await AsyncStorage.getItem('deviceInfo');
        if (storedInfo) {
          deviceData = JSON.parse(storedInfo);
        } else {
          deviceData = await getDeviceDetails();
          await AsyncStorage.setItem('deviceInfo', JSON.stringify(deviceData));
        }
      } catch {}

      Logger.info('PairingScreen: pairing with code', { code: enteredCode });

      const response = await apiService.pairDevice({
        pairingCode: enteredCode,
        ...deviceData,
      });

      Logger.info('PairingScreen: pairing response', { status: response?.status });

      if (response?.status === true) {
        // Save pairing state
        await AsyncStorage.setItem('isPaired', 'true');
        const deviceId = response?.data?.deviceId || '';
        if (deviceId) {
          await AsyncStorage.setItem('pairedDevice', JSON.stringify({ deviceId }));
        }
        setCode(Array(CODE_LENGTH).fill(''));
        onSuccess?.(deviceId);
      } else {
        const msg = response?.message || 'Invalid code. Please try again.';
        setError(msg);
        setCode(Array(CODE_LENGTH).fill(''));
        inputRefs.current[0]?.focus();
      }
    } catch (err) {
      Logger.error('PairingScreen: pairing error', err);
      setError('Connection failed. Make sure backend is running.');
      setCode(Array(CODE_LENGTH).fill(''));
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const fullCode = code.join('');
  const isComplete = fullCode.length === CODE_LENGTH;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>
        Open TallyDekho Desktop app and click{'\n'}
        <Text style={styles.bold}>"Generate Code"</Text> to get your 6-digit code
      </Text>

      {/* Code input boxes */}
      <View style={styles.codeContainer}>
        {code.map((digit, index) => (
          <TextInput
            key={index}
            ref={ref => (inputRefs.current[index] = ref)}
            style={[
              styles.codeBox,
              digit ? styles.codeBoxFilled : null,
              error ? styles.codeBoxError : null,
            ]}
            value={digit}
            maxLength={1}
            keyboardType="number-pad"
            onChangeText={text => handleChange(text, index)}
            onKeyPress={e => handleKeyPress(e, index)}
            editable={!loading}
            selectTextOnFocus
          />
        ))}
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      {/* Submit button */}
      <TouchableOpacity
        style={[styles.submitBtn, (!isComplete || loading) && styles.submitBtnDisabled]}
        onPress={() => handleSubmit()}
        disabled={!isComplete || loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" size="small" />
        ) : (
          <Text style={styles.submitText}>Connect to Tally</Text>
        )}
      </TouchableOpacity>

      {/* Skip button (onboarding only) */}
      {showSkip && (
        <TouchableOpacity style={styles.skipBtn} onPress={onSkip}>
          <Text style={styles.skipText}>Skip for now</Text>
        </TouchableOpacity>
      )}

      <Text style={styles.hint}>
        Make sure TallyDekho Desktop is running on your Windows PC and connected to the same network.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0A0A0A',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: '#787774',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  bold: {
    fontWeight: '600',
    color: '#059669',
  },
  codeContainer: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  codeBox: {
    width: 48,
    height: 56,
    borderWidth: 2,
    borderColor: '#E8E7E3',
    borderRadius: 12,
    textAlign: 'center',
    fontSize: 22,
    fontWeight: '700',
    color: '#0A0A0A',
    backgroundColor: '#FBFAF8',
  },
  codeBoxFilled: {
    borderColor: '#059669',
    backgroundColor: '#ECFDF5',
  },
  codeBoxError: {
    borderColor: '#F43F5E',
    backgroundColor: '#FFF1F2',
  },
  error: {
    color: '#F43F5E',
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 12,
  },
  submitBtn: {
    width: '100%',
    backgroundColor: '#059669',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  submitBtnDisabled: {
    opacity: 0.5,
  },
  submitText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  skipBtn: {
    marginTop: 16,
    paddingVertical: 8,
  },
  skipText: {
    color: '#787774',
    fontSize: 14,
    textDecoration: 'underline',
  },
  hint: {
    marginTop: 24,
    fontSize: 12,
    color: '#AEACA8',
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: 16,
  },
});

export default PairingScreen;
