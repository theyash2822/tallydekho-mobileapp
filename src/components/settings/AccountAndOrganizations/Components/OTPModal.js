import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TextInput,
  Animated,
  TouchableWithoutFeedback,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import Colors from '../../../../utils/Colors';

// Export the Dialpad Component for reuse
export const Dialpad = ({onKeyPress, onBackspace}) => {
  const renderKeypadButton = (key, isBackspace = false) => (
    <TouchableOpacity
      key={key}
      style={[styles.keypadButton, isBackspace && styles.deleteButton]}
      onPress={() => (isBackspace ? onBackspace() : onKeyPress(key))}>
      {isBackspace ? (
        <Icon name="delete" size={24} color={Colors.primaryText} />
      ) : (
        <Text style={styles.keypadButtonText}>{key}</Text>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.keypad}>
      <View style={styles.keypadRow}>
        {renderKeypadButton('1')}
        {renderKeypadButton('2')}
        {renderKeypadButton('3')}
      </View>
      <View style={styles.keypadRow}>
        {renderKeypadButton('4')}
        {renderKeypadButton('5')}
        {renderKeypadButton('6')}
      </View>
      <View style={styles.keypadRow}>
        {renderKeypadButton('7')}
        {renderKeypadButton('8')}
        {renderKeypadButton('9')}
      </View>
      <View style={styles.keypadRow}>
        <View style={styles.emptyButton} />
        {renderKeypadButton('0')}
        {renderKeypadButton('', true)}
      </View>
    </View>
  );
};

const OTPModal = ({
  visible,
  onClose,
  onConfirm,
  title,
  subtitle,
  instructionText,
  emailText,
  primaryButtonText,
  secondaryButtonText,
  onPrimaryPress,
  onSecondaryPress,
  isPrimaryDisabled = false,
  primaryButtonColor = '#07624C',
  secondaryButtonColor = '#e0e3e7c5',
  primaryButtonTextColor = '#FFFFFF',
  secondaryButtonTextColor = '#8F939E',
  showResendTimer = false,
  resendTimer = 30,
  isResendDisabled = false,
  otpLength = 4,
  keepButtonStyleEnabled = false, // New prop to keep button style enabled even when disabled
}) => {
  const [otp, setOtp] = useState(Array(otpLength).fill(''));
  const [focusedIndex, setFocusedIndex] = useState(0);
  
  // Animation state
  const [isModalVisible, setIsModalVisible] = useState(visible);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(300));

  useEffect(() => {
    if (visible) {
      setOtp(Array(otpLength).fill(''));
      setFocusedIndex(0);
    }
  }, [visible, otpLength]);

  // Animation effect
  useEffect(() => {
    if (visible) {
      setIsModalVisible(true);
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          tension: 50,
          friction: 10,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 300,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setIsModalVisible(false);
      });
    }
  }, [visible]);

  const handleKeyPress = key => {
    // If the focused index is empty, fill it
    if (otp[focusedIndex] === '') {
      const newOtp = [...otp];
      newOtp[focusedIndex] = key;
      setOtp(newOtp);

      // Move to next empty index or stay at current if it's the last
      if (focusedIndex < otpLength - 1) {
        setFocusedIndex(focusedIndex + 1);
      }
    } else {
      // If focused index is filled, find next empty index
      const nextEmptyIndex = otp.findIndex(
        (digit, index) => index > focusedIndex && digit === '',
      );

      if (nextEmptyIndex !== -1) {
        const newOtp = [...otp];
        newOtp[nextEmptyIndex] = key;
        setOtp(newOtp);
        setFocusedIndex(nextEmptyIndex + 1);
      }
    }
  };

  const handleBackspace = () => {
    // If current focused index has a digit, clear it and stay there
    if (otp[focusedIndex] !== '') {
      const newOtp = [...otp];
      newOtp[focusedIndex] = '';
      setOtp(newOtp);
    } else {
      // If current focused index is empty, go to previous filled index
      const prevFilledIndex = otp
        .map((digit, index) => ({digit, index}))
        .filter(item => item.digit !== '' && item.index < focusedIndex)
        .pop()?.index;

      if (prevFilledIndex !== undefined) {
        const newOtp = [...otp];
        newOtp[prevFilledIndex] = '';
        setOtp(newOtp);
        setFocusedIndex(prevFilledIndex);
      }
    }
  };

  const handleOtpBoxPress = index => {
    setFocusedIndex(index);
  };

  const handlePrimaryPress = () => {
    if (onPrimaryPress) {
      onPrimaryPress(otp.join(''));
    } else if (onConfirm) {
      onConfirm(otp.join(''));
    }
  };

  const isPrimaryButtonDisabled =
    isPrimaryDisabled || otp.some(digit => digit === '');

  // Determine button styling - if keepButtonStyleEnabled is true, always use enabled style
  const buttonBackgroundColor = keepButtonStyleEnabled
    ? primaryButtonColor
    : isPrimaryButtonDisabled
    ? '#D1D5DB'
    : primaryButtonColor;
  
  const buttonTextColor = keepButtonStyleEnabled
    ? primaryButtonTextColor
    : isPrimaryButtonDisabled
    ? '#9CA3AF'
    : primaryButtonTextColor;

  if (!isModalVisible) return null;

  return (
    <Modal
      visible={isModalVisible}
      transparent
      animationType="none"
      onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <Animated.View
          style={[
            styles.overlay,
            {opacity: fadeAnim},
          ]}>
          <TouchableWithoutFeedback>
            <Animated.View
              style={[
                styles.modal,
                {transform: [{translateY: slideAnim}]},
              ]}>
          {/* Modal Header */}
          <View style={styles.modalHeader}>
            <View style={styles.headerContent}>
              <Text style={styles.modalTitle}>{title}</Text>
              {subtitle && <Text style={styles.modalSubtitle}>{subtitle}</Text>}
              {instructionText && emailText && !subtitle && (
                <Text style={styles.modalSubtitle}>
                  {instructionText} {emailText}
                </Text>
              )}
            </View>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Icon name="x" size={24} color={Colors.secondaryText} />
            </TouchableOpacity>
          </View>

          {/* Modal Content */}
          <View style={styles.modalContent}>
            {/* OTP Input Fields */}
            <View style={styles.otpContainer}>
              {otp.map((digit, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.otpInput,
                    focusedIndex === index && styles.otpInputFocused,
                  ]}
                  onPress={() => handleOtpBoxPress(index)}
                  activeOpacity={0.7}>
                  <Text style={styles.otpDigit}>{digit}</Text>
                  {focusedIndex === index && focusedIndex < otpLength - 1 && (
                    <View style={styles.cursor} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={{padding: 10}}>
            {/* Primary Action Button */}
            <TouchableOpacity
              style={[
                styles.primaryButton,
                {
                  backgroundColor: buttonBackgroundColor,
                  opacity: isPrimaryButtonDisabled && !keepButtonStyleEnabled ? 0.6 : 1,
                },
              ]}
              onPress={handlePrimaryPress}
              disabled={isPrimaryButtonDisabled}>
              <Text
                style={[
                  styles.primaryButtonText,
                  {
                    color: buttonTextColor,
                  },
                ]}>
                {primaryButtonText}
              </Text>
            </TouchableOpacity>

            {/* Secondary Action Button */}
            {secondaryButtonText && (
              <TouchableOpacity
                style={[
                  styles.secondaryButton,
                  {
                    backgroundColor: isResendDisabled
                      ? '#F3F4F6'
                      : secondaryButtonColor,
                  },
                ]}
                onPress={onSecondaryPress}
                disabled={isResendDisabled}>
                <Text
                  style={[
                    styles.secondaryButtonText,
                    {
                      color: isResendDisabled
                        ? '#9CA3AF'
                        : secondaryButtonTextColor,
                    },
                  ]}>
                  {showResendTimer && isResendDisabled
                    ? `Resend OTP (${resendTimer}s)`
                    : secondaryButtonText}
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Numeric Keypad */}
          <Dialpad onKeyPress={handleKeyPress} onBackspace={handleBackspace} />
            </Animated.View>
          </TouchableWithoutFeedback>
        </Animated.View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: '#F4F5FA',
    width: '100%',
    maxHeight: '90%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
    backgroundColor: '#fff',
  },
  headerContent: {
    flex: 1,
    marginRight: 40,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  modalSubtitle: {
    fontSize: 12,
    color: '#6B7280',
  },
  modalContent: {
    padding: 8,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 20,
  },
  otpInput: {
    width: 50,
    height: 50,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  otpInputFocused: {
    borderColor: '#07624C',
    borderWidth: 1,
  },
  otpDigit: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
  },
  cursor: {
    position: 'absolute',
    bottom: 8,
    width: 2,
    height: 3,
    backgroundColor: '#F4F5FA',
    borderRadius: 1,
  },
  primaryButton: {
    paddingVertical: 14,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    marginBottom: 12,
    marginTop: 10,
  },
  primaryDisabled: {
    backgroundColor: '#D1D5DB',
  },
  primaryButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  secondaryButton: {
    paddingVertical: 14,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    marginBottom: 12,
  },
  secondaryButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  keypad: {
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  keypadRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 3,
  },
  keypadButton: {
    width: 121,
    height: 45,
    borderRadius: 10,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  keypadButtonText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#374151',
  },
  deleteButton: {
    backgroundColor: 'transparent',
    borderWidth: 0,
  },
  emptyButton: {
    width: 121,
    height: 45,
    marginBottom:10
  },
});

export default OTPModal;
