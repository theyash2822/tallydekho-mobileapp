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
import OTPModal from './OTPModal';
import Colors from '../../../../utils/Colors';
import {CommonInputStyles} from '../../../../utils/CommonStyles';

const EditEmailModal = ({visible, onClose, currentEmail, onEmailUpdate}) => {
  const [step, setStep] = useState(1);
  const [showCurrentEmailOTP, setShowCurrentEmailOTP] = useState(false);
  const [showNewEmailOTP, setShowNewEmailOTP] = useState(false);
  const [newEmail, setNewEmail] = useState(currentEmail);
  const [newEmailInput, setNewEmailInput] = useState('');
  const [currentEmailTimer, setCurrentEmailTimer] = useState(0);
  const [newEmailTimer, setNewEmailTimer] = useState(0);
  
  // Animation state
  const [isModalVisible, setIsModalVisible] = useState(visible);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(300));

  useEffect(() => {
    if (visible && step === 1) {
      setNewEmail(currentEmail);
      setShowCurrentEmailOTP(false);
      setShowNewEmailOTP(false);
      setStep(1);
      setCurrentEmailTimer(0);
      setNewEmailTimer(0);
      setNewEmailInput('');
    }
  }, [visible, currentEmail]);

  // Timer for current email OTP
  useEffect(() => {
    let interval = null;
    if (showCurrentEmailOTP && currentEmailTimer > 0) {
      interval = setInterval(() => {
        setCurrentEmailTimer(prev => prev - 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [showCurrentEmailOTP, currentEmailTimer]);

  // Timer for new email OTP
  useEffect(() => {
    let interval = null;
    if (showNewEmailOTP && newEmailTimer > 0) {
      interval = setInterval(() => {
        setNewEmailTimer(prev => prev - 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [showNewEmailOTP, newEmailTimer]);

  // Cleanup timers when modal closes
  useEffect(() => {
    if (!visible) {
      setCurrentEmailTimer(0);
      setNewEmailTimer(0);
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

  const validateEmail = email => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleContinue = () => {
    if (step === 1) {
      if (!validateEmail(newEmail)) {
        alert('Please enter a valid email address');
        return;
      }
      setStep(2);
      setShowCurrentEmailOTP(true);
    }
  };

  const handleCurrentEmailOTPConfirm = otp => {
    if (!otp || otp.length !== 4) {
      alert('Please enter a valid 4-digit OTP');
      return;
    }
    // Here you would typically verify the OTP with your backend
    // For now, we'll simulate success
    setShowCurrentEmailOTP(false);
    setStep(3);
  };

  const handleNewEmailOTPConfirm = otp => {
    if (!otp || otp.length !== 4) {
      alert('Please enter a valid 4-digit OTP');
      return;
    }
    // Here you would typically verify the OTP with your backend
    // For now, we'll simulate success

    // Update the profile with new email
    if (onEmailUpdate) {
      onEmailUpdate(newEmailInput);
    }

    setShowNewEmailOTP(false);
    onClose();
  };

  const handleResendCurrentEmailOTP = () => {
    setCurrentEmailTimer(30);
  };

  const handleResendNewEmailOTP = () => {
    setNewEmailTimer(30);
  };

  const handleClose = () => {
    setStep(1);
    setShowCurrentEmailOTP(false);
    setShowNewEmailOTP(false);
    setNewEmail(currentEmail);
    setNewEmailInput('');
    setCurrentEmailTimer(0);
    setNewEmailTimer(0);
    onClose();
  };

  const renderStep1 = () => (
    <>
      <View style={styles.header}>
        <Text style={styles.title}>Enter Your Email Address</Text>
        <Text style={styles.subtitle}>Fill the form for information</Text>
        <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
          <Icon name="x" size={24} color="#6B7280" />
        </TouchableOpacity>
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.emailInput}
          value={newEmail}
          onChangeText={setNewEmail}
          placeholder="Enter email address"
          keyboardType="email-address"
        />
      </View>
      <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
        <Text style={styles.continueButtonText}>Send OTP</Text>
      </TouchableOpacity>
    </>
  );

  const renderStep2 = () => (
    <>
      <View style={styles.header}>
        <Text style={styles.title}>We've Sent Code To Your Email</Text>
        <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
          <Icon name="x" size={24} color="#6B7280" />
        </TouchableOpacity>
      </View>
      <View style={styles.otpContainer}>
        <Text style={styles.otpText}>Code has been sent to {currentEmail}</Text>
      </View>
      <TouchableOpacity
        style={styles.continueButton}
        onPress={() => setStep(3)}>
        <Text style={styles.continueButtonText}>Confirm</Text>
      </TouchableOpacity>
    </>
  );

  const renderStep3 = () => (
    <>
      <View style={styles.header}>
        <Text style={styles.title}>Enter New Email Address</Text>
        <Text style={styles.subtitle}>Fill the form for information</Text>
        <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
          <Icon name="x" size={24} color="#6B7280" />
        </TouchableOpacity>
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.emailInput}
          value={newEmailInput}
          onChangeText={setNewEmailInput}
          placeholder="Enter new email address"
          keyboardType="email-address"
          placeholderTextColor={'#6B7280'}
        />
      </View>
      <TouchableOpacity
        style={styles.continueButton}
        onPress={() => {
          if (!validateEmail(newEmailInput)) {
            alert('Please enter a valid email address');
            return;
          }
          setNewEmail(newEmailInput);
          setShowNewEmailOTP(true);
        }}>
        <Text style={styles.continueButtonText}>Send OTP</Text>
      </TouchableOpacity>
    </>
  );

  if (!isModalVisible) return null;

  return (
    <>
      <Modal visible={isModalVisible} animationType="none" transparent onRequestClose={onClose}>
        <TouchableWithoutFeedback onPress={onClose}>
          <Animated.View
            style={[
              styles.modalOverlay,
              {opacity: fadeAnim},
            ]}>
            <TouchableWithoutFeedback>
              <Animated.View
                style={[
                  styles.modalContent,
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
        visible={showCurrentEmailOTP}
        onClose={handleClose}
        title="We've Sent Code To Your Email"
        instructionText="Code has been sent to"
        emailText={currentEmail}
        primaryButtonText="Confirm"
        onPrimaryPress={handleCurrentEmailOTPConfirm}
        secondaryButtonText="Resend OTP"
        showResendTimer={currentEmailTimer > 0}
        resendTimer={currentEmailTimer}
        onSecondaryPress={handleResendCurrentEmailOTP}
        isPrimaryDisabled={false}
        isResendDisabled={currentEmailTimer > 0}
      />

      <OTPModal
        visible={showNewEmailOTP}
        onClose={handleClose}
        title="We've Sent Code To Your New Email"
        instructionText="Code has been sent to"
        emailText={newEmail}
        primaryButtonText="Confirm"
        onPrimaryPress={handleNewEmailOTPConfirm}
        secondaryButtonText="Resend OTP"
        showResendTimer={newEmailTimer > 0}
        resendTimer={newEmailTimer}
        onSecondaryPress={handleResendNewEmailOTP}
        isPrimaryDisabled={false}
        isResendDisabled={newEmailTimer > 0}
      />
    </>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 12,
  },
  header: {
    marginBottom: 2,
    position: 'relative',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 10,
  },
  closeButton: {
    position: 'absolute',
    right: 0,
    top: 0,
    padding: 4,
  },
  inputContainer: {
    marginBottom: 20,
  },
  emailInput: CommonInputStyles.textInputLg,
  otpContainer: {
    marginBottom: 20,
  },
  otpText: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
  },
  continueButton: {
    backgroundColor: '#07624C',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default EditEmailModal;
