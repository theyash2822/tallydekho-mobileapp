import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Modal,
  Animated,
  TouchableWithoutFeedback,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import OTPModal, {Dialpad} from './OTPModal';
import Colors from '../../../../utils/Colors';
import CountryPickernew from '../../../common/Countrypicker';
import {Icons} from '../../../../utils/Constants';

const EditPhoneModal = ({visible, onClose, currentPhone, onPhoneUpdate}) => {
  const [step, setStep] = useState(1);
  const [showCurrentPhoneOTP, setShowCurrentPhoneOTP] = useState(false);
  const [showNewPhoneOTP, setShowNewPhoneOTP] = useState(false);
  const [newPhone, setNewPhone] = useState(currentPhone);
  const [newPhoneInput, setNewPhoneInput] = useState('');
  const [currentPhoneTimer, setCurrentPhoneTimer] = useState(0);
  const [newPhoneTimer, setNewPhoneTimer] = useState(0);
  const [phoneInput, setPhoneInput] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [showButton, setShowButton] = useState(false);
  const [currentPhoneToVerify, setCurrentPhoneToVerify] = useState('');
  const [focusedPosition, setFocusedPosition] = useState(-1);
  const [newPhoneFocusedPosition, setNewPhoneFocusedPosition] = useState(-1);
  
  // Animation state
  const [isModalVisible, setIsModalVisible] = useState(visible);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(300));

  useEffect(() => {
    if (visible) {
      // Only reset state when modal first opens, not when navigating between steps
      if (step === 1) {
        setNewPhone(currentPhone);
        setShowCurrentPhoneOTP(false);
        setShowNewPhoneOTP(false);
        setStep(1);
        setCurrentPhoneTimer(0);
        setNewPhoneTimer(0);
        setNewPhoneInput('');
        setPhoneInput('');
        setCountryCode('+91');
        setShowButton(false);
        setCurrentPhoneToVerify(''); // Reset only when modal first opens
      }
    }
  }, [visible, currentPhone]);

  // Timer for current phone OTP
  useEffect(() => {
    let interval = null;
    if (showCurrentPhoneOTP && currentPhoneTimer > 0) {
      interval = setInterval(() => {
        setCurrentPhoneTimer(prev => prev - 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [showCurrentPhoneOTP, currentPhoneTimer]);

  // Timer for new phone OTP
  useEffect(() => {
    let interval = null;
    if (showNewPhoneOTP && newPhoneTimer > 0) {
      interval = setInterval(() => {
        setNewPhoneTimer(prev => prev - 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [showNewPhoneOTP, newPhoneTimer]);

  // Cleanup timers when modal closes
  useEffect(() => {
    if (!visible) {
      setCurrentPhoneTimer(0);
      setNewPhoneTimer(0);
    }
  }, [visible]);

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

  const validatePhone = phone => {
    // Basic phone validation - at least 10 digits
    const phoneRegex = /^\d{10,}$/;
    return phoneRegex.test(phone.replace(/\D/g, ''));
  };

  const handleCountrySelect = country => {
    setCountryCode(country.code);
  };

  const handlePhoneKeyPress = key => {
    setPhoneInput(prev => {
      const newPhone = prev.split('');
      // Always add to the end unless we're at max length
      if (newPhone.length < 10) {
        newPhone.push(key);
      }
      return newPhone.join('');
    });

    // Move to next position
    if (focusedPosition === -1) {
      // If no position focused, focus the first position
      setFocusedPosition(0);
    } else if (focusedPosition < 9) {
      setFocusedPosition(focusedPosition + 1);
    }
  };

  const handlePhoneBackspace = () => {
    setPhoneInput(prev => {
      const newPhone = prev.split('');
      if (
        focusedPosition >= 0 &&
        focusedPosition < newPhone.length &&
        newPhone[focusedPosition] !== ''
      ) {
        // Clear digit at focused position
        newPhone[focusedPosition] = '';
      } else if (focusedPosition > 0) {
        // Move to previous position and clear it
        newPhone[focusedPosition - 1] = '';
        setFocusedPosition(focusedPosition - 1);
      } else if (focusedPosition === -1 && newPhone.length > 0) {
        // If no position focused, remove last digit
        newPhone.pop();
      }
      return newPhone.join('');
    });
  };

  const handleNewPhoneKeyPress = key => {
    setNewPhoneInput(prev => {
      const newPhone = prev.split('');
      // Always add to the end unless we're at max length
      if (newPhone.length < 10) {
        newPhone.push(key);
      }
      return newPhone.join('');
    });

    // Move to next position
    if (newPhoneFocusedPosition === -1) {
      // If no position focused, focus the first position
      setNewPhoneFocusedPosition(0);
    } else if (newPhoneFocusedPosition < 9) {
      setNewPhoneFocusedPosition(newPhoneFocusedPosition + 1);
    }
  };

  const handleNewPhoneBackspace = () => {
    setNewPhoneInput(prev => {
      const newPhone = prev.split('');
      if (
        newPhoneFocusedPosition >= 0 &&
        newPhoneFocusedPosition < newPhone.length &&
        newPhone[newPhoneFocusedPosition] !== ''
      ) {
        // Clear digit at focused position
        newPhone[newPhoneFocusedPosition] = '';
      } else if (newPhoneFocusedPosition > 0) {
        // Move to previous position and clear it
        newPhone[newPhoneFocusedPosition - 1] = '';
        setNewPhoneFocusedPosition(newPhoneFocusedPosition - 1);
      } else if (newPhoneFocusedPosition === -1 && newPhone.length > 0) {
        // If no position focused, remove last digit
        newPhone.pop();
      }
      return newPhone.join('');
    });
  };

  const handleContinue = () => {
    if (step === 1) {
      if (!validatePhone(phoneInput)) {
        alert('Please enter a valid phone number (at least 10 digits)');
        return;
      }
      // Store the current phone being verified
      const phoneToVerify = countryCode + phoneInput;
      setCurrentPhoneToVerify(phoneToVerify);
      setStep(2);
      setShowCurrentPhoneOTP(true);
    }
  };

  const handleCurrentPhoneOTPConfirm = otp => {
    if (!otp || otp.length !== 4) {
      alert('Please enter a valid 4-digit OTP');
      return;
    }
    // Here you would typically verify the OTP with your backend
    // For now, we'll simulate success
    setShowCurrentPhoneOTP(false);
    setStep(3);
  };

  const handleNewPhoneOTPConfirm = otp => {
    if (!otp || otp.length !== 4) {
      alert('Please enter a valid 4-digit OTP');
      return;
    }
    // Here you would typically verify the OTP with your backend
    // For now, we'll simulate success
    const newPhoneNumber = countryCode + newPhoneInput;

    // Update the profile with new phone number
    if (onPhoneUpdate) {
      onPhoneUpdate(newPhoneNumber);
    }

    setShowNewPhoneOTP(false);
    onClose();
  };

  const handleResendCurrentPhoneOTP = () => {
    setCurrentPhoneTimer(30);
  };

  const handleResendNewPhoneOTP = () => {
    setNewPhoneTimer(30);
  };

  const handleClose = () => {
    setStep(1);
    setShowCurrentPhoneOTP(false);
    setShowNewPhoneOTP(false);
    setNewPhone(currentPhone);
    setNewPhoneInput('');
    setCurrentPhoneTimer(0);
    setNewPhoneTimer(0);
    setPhoneInput('');
    setCountryCode('+91');
    setShowButton(false);
    setCurrentPhoneToVerify('');
    setFocusedPosition(-1);
    setNewPhoneFocusedPosition(-1);
    onClose();
  };

  const renderStep1 = () => (
    <>
      {/* Modal Header */}
      <View style={styles.modalHeader}>
        <View style={styles.headerContent}>
          <Text style={styles.modalTitle}>Enter Phone Number</Text>
          <Text style={styles.modalSubtitle}>
            Fill the form for information
          </Text>
        </View>
        <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
          <Icon name="x" size={24} color={Colors.secondaryText} />
        </TouchableOpacity>
      </View>

      {/* Modal Content */}
      <View style={styles.modalContent}>
        <View style={styles.inputContainer}>
          <CountryPickernew
            onSelect={handleCountrySelect}
            phoneNumber={phoneInput}
            setPhoneNumber={setPhoneInput}
            Icons={Icons}
            setShowButton={setShowButton}
            setCountryCode={setCountryCode}
            style={styles.countryPickerStyle}
            isReadOnly={false}
            onDigitPress={setFocusedPosition}
            focusedPosition={focusedPosition}
            dialpadMode={true}
          />
        </View>
      </View>

      <View style={{padding: 10}}>
        {/* Primary Action Button */}
        <TouchableOpacity style={styles.primaryButton} onPress={handleContinue}>
          <Text style={styles.primaryButtonText}>Send OTP</Text>
        </TouchableOpacity>
      </View>

      {/* Numeric Keypad */}
      <Dialpad
        onKeyPress={handlePhoneKeyPress}
        onBackspace={handlePhoneBackspace}
      />
    </>
  );

  const renderStep2 = () => {
    // Get the phone number that was entered in step 1
    const phoneToDisplay = currentPhoneToVerify || countryCode + phoneInput;

    return (
      <>
        {/* Modal Header */}
        <View style={styles.modalHeader}>
          <View style={styles.headerContent}>
            <Text style={styles.modalTitle}>
              We've Sent Code To Your Number
            </Text>
          </View>
          <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
            <Icon name="x" size={24} color={Colors.secondaryText} />
          </TouchableOpacity>
        </View>

        {/* Modal Content */}
        <View style={styles.modalContent}>
          <View style={styles.otpContainer}>
            <Text style={styles.otpText}>
              Code has been sent to {phoneToDisplay}
            </Text>
          </View>
        </View>

        <View style={{padding: 10}}>
          {/* Primary Action Button */}
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => setStep(3)}>
            <Text style={styles.primaryButtonText}>Confirm</Text>
          </TouchableOpacity>
        </View>
      </>
    );
  };

  const renderStep3 = () => (
    <>
      {/* Modal Header */}
      <View style={styles.modalHeader}>
        <View style={styles.headerContent}>
          <Text style={styles.modalTitle}>Enter New Phone Number</Text>
          <Text style={styles.modalSubtitle}>
            Fill the form for information
          </Text>
        </View>
        <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
          <Icon name="x" size={24} color={Colors.secondaryText} />
        </TouchableOpacity>
      </View>

      {/* Modal Content */}
      <View style={styles.modalContent}>
        <View style={styles.inputContainer}>
          <CountryPickernew
            onSelect={handleCountrySelect}
            phoneNumber={newPhoneInput}
            setPhoneNumber={setNewPhoneInput}
            Icons={Icons}
            setShowButton={setShowButton}
            setCountryCode={setCountryCode}
            style={styles.countryPickerStyle}
            isReadOnly={false}
            onDigitPress={setNewPhoneFocusedPosition}
            focusedPosition={newPhoneFocusedPosition}
            dialpadMode={true}
          />
        </View>
      </View>

      <View style={{padding: 10}}>
        {/* Primary Action Button */}
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => {
            if (!validatePhone(newPhoneInput)) {
              alert('Please enter a valid phone number (at least 10 digits)');
              return;
            }
            setNewPhone(countryCode + newPhoneInput);
            setShowNewPhoneOTP(true);
          }}>
          <Text style={styles.primaryButtonText}>Send OTP</Text>
        </TouchableOpacity>
      </View>

      {/* Numeric Keypad */}
      <Dialpad
        onKeyPress={handleNewPhoneKeyPress}
        onBackspace={handleNewPhoneBackspace}
      />
    </>
  );

  if (!isModalVisible) return null;

  return (
    <>
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
                {step === 1 && renderStep1()}
                {step === 2 && renderStep2()}
                {step === 3 && renderStep3()}
              </Animated.View>
            </TouchableWithoutFeedback>
          </Animated.View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* OTP Modals */}
      <OTPModal
        visible={showCurrentPhoneOTP}
        onClose={handleClose}
        title="We've Sent Code To Your Number"
        instructionText="Code has been sent to"
        emailText={currentPhoneToVerify}
        primaryButtonText="Continue"
        onPrimaryPress={handleCurrentPhoneOTPConfirm}
        secondaryButtonText="Resend OTP"
        showResendTimer={currentPhoneTimer > 0}
        resendTimer={currentPhoneTimer}
        onSecondaryPress={handleResendCurrentPhoneOTP}
        isPrimaryDisabled={false}
        isResendDisabled={currentPhoneTimer > 0}
      />

      <OTPModal
        visible={showNewPhoneOTP}
        onClose={handleClose}
        title="We've Sent Code To Your Number"
        instructionText="Code has been sent to"
        emailText={countryCode + newPhoneInput}
        primaryButtonText="Confirm"
        onPrimaryPress={handleNewPhoneOTPConfirm}
        secondaryButtonText="Resend OTP"
        showResendTimer={newPhoneTimer > 0}
        resendTimer={newPhoneTimer}
        onSecondaryPress={handleResendNewPhoneOTP}
        isPrimaryDisabled={false}
        isResendDisabled={newPhoneTimer > 0}
      />
    </>
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
  closeButton: {
    padding: 4,
  },
  modalContent: {
    padding: 8,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  inputContainer: {
    marginBottom: 20,
    width: '100%',
  },
  countryPickerStyle: {
    marginBottom: 0,
    marginTop: 0,
  },
  otpContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  otpText: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
  },
  primaryButton: {
    backgroundColor: '#07624C',
    paddingVertical: 14,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    marginBottom: 12,
    marginTop: 10,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default EditPhoneModal;
