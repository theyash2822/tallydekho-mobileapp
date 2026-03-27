import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Switch,
  Alert,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from '../../common/Header';
import OTPModal from './Components/OTPModal';
import EditEmailModal from './Components/EditEmailModal';
import EditPhoneModal from './Components/EditPhoneModal';
import Colors from '../../../utils/Colors';
import {CommonInputStyles, CommonLabelStyles} from '../../../utils/CommonStyles';
import CustomBottomButton from '../../common/BottomButton';
import CustomSwitch from '../../common/CustomSwitch';
import biometricService from '../../../services/security/biometricService';
import passkeyService from '../../../services/security/passkeyService';
import screenLockService from '../../../services/security/screenLockService';
import ReactNativeBiometrics from 'react-native-biometrics';

const Profile = () => {
  const navigation = useNavigation();
  const [fullName, setFullName] = useState('Rajesh Sharma');
  const [phoneNumber, setPhoneNumber] = useState('+919355699338');
  const [displayPhone, setDisplayPhone] = useState('+91 ******** 210');
  const [email, setEmail] = useState('accounts@maarujitech.in');
  const [displayEmail, setDisplayEmail] = useState('***********tech.in');
  const [biometricEnabled, setBiometricEnabled] = useState(true);
  const [passkeyEnabled, setPasskeyEnabled] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showPasskeyModal, setShowPasskeyModal] = useState(false);
  const [showEditEmailModal, setShowEditEmailModal] = useState(false);
  const [showEditPhoneModal, setShowEditPhoneModal] = useState(false);
  const [deleteModalTimer, setDeleteModalTimer] = useState(0);
  const [passkeyModalTimer, setPasskeyModalTimer] = useState(0);
  const [saveState, setSaveState] = useState('save'); // 'save', 'saving', 'saved'
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [biometricAvailable, setBiometricAvailable] = useState(false);
  const [biometricType, setBiometricType] = useState(null);

  // Load profile data from AsyncStorage when component mounts
  useEffect(() => {
    loadProfileData();
    checkBiometricAvailability();
  }, []);

  const checkBiometricAvailability = async () => {
    try {
      const {available, type} = await biometricService.isAvailable();
      // For iOS: always show (don't hide anything)
      // For Android: only show if biometric is available
      if (Platform.OS === 'ios') {
        setBiometricAvailable(true);
        setBiometricType(type);
      } else {
        // Android: only show if biometric is available
        setBiometricAvailable(available && type !== null);
        setBiometricType(type);
      }
    } catch (error) {
      if (Platform.OS === 'ios') {
        setBiometricAvailable(true);
      } else {
        setBiometricAvailable(false);
      }
      setBiometricType(null);
    }
  };

  const loadProfileData = async () => {
    try {
      const savedFullName = await AsyncStorage.getItem('profile_fullName');
      const savedPhoneNumber = await AsyncStorage.getItem(
        'profile_phoneNumber',
      );
      const savedEmail = await AsyncStorage.getItem('profile_email');
      const savedBiometricEnabled = await AsyncStorage.getItem(
        'profile_biometricEnabled',
      );
      const savedPasskeyEnabled = await AsyncStorage.getItem(
        'profile_passkeyEnabled',
      );

      if (savedFullName) setFullName(savedFullName);
      if (savedPhoneNumber) {
        setPhoneNumber(savedPhoneNumber);
        // Update display phone with saved data
        const countryCode = savedPhoneNumber.substring(0, 3);
        const lastThreeDigits = savedPhoneNumber.substring(
          savedPhoneNumber.length - 3,
        );
        const maskedDisplay = `${countryCode} ******** ${lastThreeDigits}`;
        setDisplayPhone(maskedDisplay);
      }
      if (savedEmail) {
        setEmail(savedEmail);
        // Update display email with saved data
        const atIndex = savedEmail.indexOf('@');
        if (atIndex > 0) {
          const domain = savedEmail.substring(atIndex);
          const maskedDisplay = `********${domain}`;
          setDisplayEmail(maskedDisplay);
        }
      }
      if (savedBiometricEnabled !== null)
        setBiometricEnabled(savedBiometricEnabled === 'true');
      if (savedPasskeyEnabled !== null)
        setPasskeyEnabled(savedPasskeyEnabled === 'true');

      // Reset save state when component mounts
      setSaveState('save');
    } catch (error) {
    }
  };

  const saveProfileData = async () => {
    try {
      await AsyncStorage.setItem('profile_fullName', fullName);
      await AsyncStorage.setItem('profile_phoneNumber', phoneNumber);
      await AsyncStorage.setItem('profile_email', email);
      await AsyncStorage.setItem(
        'profile_biometricEnabled',
        biometricEnabled.toString(),
      );
      await AsyncStorage.setItem(
        'profile_passkeyEnabled',
        passkeyEnabled.toString(),
      );
    } catch (error) {
    }
  };

  const getSaveButtonProps = () => {
    switch (saveState) {
      case 'saving':
        return {
          text: 'Saving...',
          icon: 'refresh-cw',
          color: '#D1D5DB',
          textColor: '#9CA3AF',
          disabled: true,
        };
      case 'saved':
        return {
          text: 'Saved',
          icon: 'check',
          // color: '#10B981',
          color: '#07624C',
          textColor: '#FFFFFF',
          disabled: false,
        };
      default:
        return {
          text: 'Save',
          icon: null,
          color: '#07624C',
          textColor: '#FFFFFF',
          disabled: false,
        };
    }
  };

  const handleSave = () => {
    // Here you would typically send the data to your backend API
    // For now, we'll simulate a successful save

    // Validate required fields
    if (!fullName.trim()) {
      alert('Please enter your full name');
      return;
    }

    if (!phoneNumber.trim()) {
      alert('Please enter your phone number');
      return;
    }

    if (!email.trim()) {
      alert('Please enter your email address');
      return;
    }

    // Set saving state
    setSaveState('saving');

    // Save to AsyncStorage
    saveProfileData()
      .then(() => {

        // Show saved state
        setSaveState('saved');

        // Show success message
        setShowSuccessMessage(true);

        // Hide success message after 3 seconds
        setTimeout(() => {
          setShowSuccessMessage(false);
        }, 3000);

        // You can add additional logic here like:
        // - Navigate back
        // - Update global state
        // - Sync with backend
      })
      .catch(error => {
        alert('Failed to save profile. Please try again.');
        setSaveState('save');
      });
  };

  const handleDeleteAccount = () => {
    setShowDeleteModal(true);
  };

  const handlePasskeyToggle = async value => {
    if (value && !passkeyEnabled) {
      // Check if passkey already exists
      const hasPasskey = await passkeyService.hasPasskey();
      if (hasPasskey) {
        // Passkey exists, just enable it
        const result = await passkeyService.enablePasskey();
        if (result.success) {
          setPasskeyEnabled(true);
          await AsyncStorage.setItem('profile_passkeyEnabled', 'true');
          
          // Enable screen lock
          await screenLockService.enableScreenLock();
        } else {
          Alert.alert('Error', result.error || 'Failed to enable passkey. Please try again.');
        }
      } else {
        // No passkey exists, show modal to create one
        setShowPasskeyModal(true);
      }
    } else {
      // Disable passkey
      const result = await passkeyService.disablePasskey();
      if (result.success) {
        setPasskeyEnabled(false);
        await AsyncStorage.setItem('profile_passkeyEnabled', 'false');
        
        // Disable screen lock if biometric is also disabled
        if (!biometricEnabled) {
          await screenLockService.disableScreenLock();
        }
      } else {
        Alert.alert('Error', 'Failed to disable passkey. Please try again.');
      }
    }
  };

  const handleResendDeleteOTP = () => {
    setDeleteModalTimer(30);
  };

  const handleResendPasskeyOTP = () => {
    setPasskeyModalTimer(30);
  };

  const handleResetPasscode = async () => {
    // Reset passcode logic here
    const result = await passkeyService.disablePasskey();
    if (result.success) {
      setPasskeyEnabled(false);
      setShowPasskeyModal(false);
      Alert.alert('Success', 'Passkey has been reset. You can create a new one.');
    } else {
      Alert.alert('Error', 'Failed to reset passkey. Please try again.');
    }
  };

  const handleBiometricToggle = async value => {
    if (value) {
      // Check if biometric is available
      if (!biometricAvailable) {
        Alert.alert(
          'Biometric Not Available',
          'Biometric authentication is not available on this device.',
        );
        return;
      }

      // Test biometric authentication
      const result = await biometricService.authenticate(
        'Enable biometric authentication',
      );
      
      if (result.success) {
        setBiometricEnabled(true);
        await AsyncStorage.setItem('profile_biometricEnabled', 'true');
        
        // Enable screen lock if biometric is enabled
        await screenLockService.enableScreenLock();
      } else {
        Alert.alert('Authentication Failed', result.error || 'Biometric authentication failed');
      }
    } else {
      // Disable biometric
      setBiometricEnabled(false);
      await AsyncStorage.setItem('profile_biometricEnabled', 'false');
      
      // Disable screen lock if both biometric and passkey are disabled
      const passkeyEnabled = await passkeyService.isPasskeyEnabled();
      if (!passkeyEnabled) {
        await screenLockService.disableScreenLock();
      }
    }
  };

  // Timer countdown for delete modal
  useEffect(() => {
    let interval = null;
    if (showDeleteModal && deleteModalTimer > 0) {
      interval = setInterval(() => {
        setDeleteModalTimer(prev => prev - 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [showDeleteModal, deleteModalTimer]);

  // Timer countdown for passkey modal
  useEffect(() => {
    let interval = null;
    if (showPasskeyModal && passkeyModalTimer > 0) {
      interval = setInterval(() => {
        setPasskeyModalTimer(prev => prev - 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [showPasskeyModal, passkeyModalTimer]);

  // Reset timers when modals close
  useEffect(() => {
    if (!showDeleteModal) {
      setDeleteModalTimer(0);
    }
  }, [showDeleteModal]);

  useEffect(() => {
    if (!showPasskeyModal) {
      setPasskeyModalTimer(0);
    }
  }, [showPasskeyModal]);

  const handleEditPhone = () => {
    setShowEditPhoneModal(true);
  };

  const handlePhoneUpdate = newPhoneNumber => {
    // Update the real phone number
    setPhoneNumber(newPhoneNumber);

    // Create masked version for display
    const countryCode = newPhoneNumber.substring(0, 3); // +91
    const lastThreeDigits = newPhoneNumber.substring(newPhoneNumber.length - 3);
    const maskedDisplay = `${countryCode} ******** ${lastThreeDigits}`;

    setDisplayPhone(maskedDisplay);

    // Save phone number immediately
    AsyncStorage.setItem('profile_phoneNumber', newPhoneNumber).catch(error => {
    });
  };

  const handleEmailUpdate = newEmail => {
    // Update the real email
    setEmail(newEmail);

    // Create masked version for display
    const atIndex = newEmail.indexOf('@');
    if (atIndex > 0) {
      const domain = newEmail.substring(atIndex);
      const maskedDisplay = `********${domain}`;
      setDisplayEmail(maskedDisplay);
    }

    // Save email immediately
    AsyncStorage.setItem('profile_email', newEmail).catch(error => {
    });
  };

  const handleEditEmail = () => {
    setShowEditEmailModal(true);
  };

  return (
    <>
      <View style={styles.container}>
        <Header title="Profile" leftIcon="chevron-left" />

        <View style={styles.content}>
          {/* User Information Section */}
          <View style={styles.section}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Full Name</Text>
              <TextInput
                style={styles.textInput}
                value={fullName}
                onChangeText={text => {
                  setFullName(text);
                  // Save full name immediately
                  AsyncStorage.setItem('profile_fullName', text).catch(
                    error => {
                      console.log('Error saving full name:', error);
                    },
                  );
                }}
                placeholder="Enter full name"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Phone Number</Text>
              <View style={styles.phoneContainer}>
                <View style={styles.phoneInputRow}>
                  <TextInput
                    style={[styles.textInput, styles.phoneInput]}
                    value={displayPhone}
                    onChangeText={setDisplayPhone}
                    placeholder="Enter phone number"
                    editable={false}
                  />
                  <Icon
                    name="check-circle"
                    size={16}
                    color="#10B981"
                    style={styles.checkIcon}
                  />
                  <TouchableOpacity
                    onPress={handleEditPhone}
                    style={styles.editButton}>
                    <Text style={styles.editText}>Edit</Text>
                    <Icon
                      name="chevron-right"
                      size={18}
                      color="#8F939E"
                      style={styles.chevronIcon}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email</Text>
              <View style={styles.phoneContainer}>
                <View style={styles.phoneInputRow}>
                  <TextInput
                    style={[styles.textInput, styles.phoneInput]}
                    value={displayEmail}
                    onChangeText={setDisplayEmail}
                    placeholder="Enter email"
                    editable={false}
                  />
                  <Icon
                    name="check-circle"
                    size={16}
                    color="#10B981"
                    style={styles.checkIcon}
                  />
                  <TouchableOpacity
                    onPress={handleEditEmail}
                    style={styles.editButton}>
                    <Text style={styles.editText}>Edit</Text>
                    <Icon
                      name="chevron-right"
                      size={18}
                      color="#8F939E"
                      style={styles.chevronIcon}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            
            {/* Only show biometric and passkey options if device supports them */}
            {/* For iOS: always show (don't hide anything), for Android: only if available */}
            {biometricAvailable && (
              <>
                <View style={styles.settingRow}>
                  <View style={styles.settingLabelContainer}>
                    <Text style={styles.settingLabel}>Biometric & screen lock</Text>
                    {biometricType && (
                      <Text style={styles.settingSubLabel}>
                        ({biometricService.getBiometricTypeName(biometricType)})
                      </Text>
                    )}
                  </View>
                  <CustomSwitch
                    value={biometricEnabled}
                    onValueChange={handleBiometricToggle}
                  />
                </View>

                <View style={styles.settingRow}>
                  <Text style={styles.settingLabel}>PassKey (2FA)</Text>
                  <CustomSwitch
                    value={passkeyEnabled}
                    onValueChange={value => {
                      handlePasskeyToggle(value);
                      // Save passkey setting immediately
                      AsyncStorage.setItem(
                        'profile_passkeyEnabled',
                        value.toString(),
                      ).catch(error => {
                        console.log('Error saving passkey setting:', error);
                      });
                    }}
                  />
                </View>
              </>
            )}
          </View>
        </View>

        {/* Modals */}
        <OTPModal
          visible={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          title="Delete Account Confirmation"
          instructionText="Code has been sent to"
          emailText={phoneNumber}
          primaryButtonText="Delete Account"
          primaryButtonColor="#EF4444"
          keepButtonStyleEnabled={true}
          onPrimaryPress={otp => {
            console.log('Delete account with OTP:', otp);
            setShowDeleteModal(false);
          }}
          secondaryButtonText="Resend OTP"
          showResendTimer={deleteModalTimer > 0}
          resendTimer={deleteModalTimer}
          onSecondaryPress={handleResendDeleteOTP}
          isResendDisabled={deleteModalTimer > 0}
        />

        <OTPModal
          visible={showPasskeyModal}
          onClose={() => setShowPasskeyModal(false)}
          title="Create A Passkey"
          subtitle="Enter A 4-Digit Passkey"
          primaryButtonText="Confirm"
          onPrimaryPress={async otp => {
            if (otp.length !== 4 || !/^\d{4}$/.test(otp)) {
              Alert.alert('Invalid Passkey', 'Please enter a valid 4-digit passkey.');
              return;
            }

            const result = await passkeyService.setPasskey(otp);
            if (result.success) {
              setPasskeyEnabled(true);
              await AsyncStorage.setItem('profile_passkeyEnabled', 'true');
              setShowPasskeyModal(false);
              
              // Enable screen lock if biometric is also enabled
              if (biometricEnabled) {
                await screenLockService.enableScreenLock();
              } else {
                await screenLockService.enableScreenLock();
              }
              
              Alert.alert('Success', 'Passkey created successfully!');
            } else {
              Alert.alert('Error', result.error || 'Failed to create passkey. Please try again.');
            }
          }}
          secondaryButtonText="Reset passcode"
          onSecondaryPress={handleResetPasscode}
          showResendTimer={passkeyModalTimer > 0}
          resendTimer={passkeyModalTimer}
          isResendDisabled={passkeyModalTimer > 0}
        />

        <EditEmailModal
          visible={showEditEmailModal}
          onClose={() => setShowEditEmailModal(false)}
          currentEmail={email}
          onEmailUpdate={handleEmailUpdate}
        />

        <EditPhoneModal
          visible={showEditPhoneModal}
          onClose={() => setShowEditPhoneModal(false)}
          currentPhone={phoneNumber}
          onPhoneUpdate={handlePhoneUpdate}
        />
      </View>


      {/* Success Message */}
      <View style={{backgroundColor:Colors.backgroundColorPrimary}}>
      {showSuccessMessage && (
        <View style={styles.successMessage}>
          <Icon name="check-circle" size={20} color="#10B981" />
          <Text style={styles.successText}>Profile saved successfully!</Text>
        </View>
      )}
      </View>


      <CustomBottomButton
        buttonText={getSaveButtonProps().text}
        onPress={handleSave}
        disabled={getSaveButtonProps().disabled}
        buttonColor={getSaveButtonProps().color}
        textColor={getSaveButtonProps().textColor}
        icon={getSaveButtonProps().icon}
        secondButtonText="Delete Account"
        secondTextColor="#FFF"
        secondButtonColor='#EF4444'
        onSecondPress={handleDeleteAccount}
        showSecondButton
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundColorPrimary,
  },
  content: {
    flex: 1,
    padding: 10,
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  inputContainer: {
    marginBottom: 12,
  },
  label: {
    ...CommonLabelStyles.label,
    fontSize: 14,
  },
  textInput: {
    ...CommonInputStyles.textInputLg,
    paddingVertical: 10,
  },
  phoneContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  phoneInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
  },
  phoneInput: {
    flex: 0,
    borderWidth: 0,
    paddingHorizontal: 0,
    paddingVertical: 0,
    backgroundColor: 'transparent',
  },
  checkIcon: {
    marginLeft: 8,
  },
  editButton: {
    marginLeft: 'auto',
    flexDirection: 'row',
    alignItems: 'center',
  },
  editText: {
    fontSize: 14,
    color: '#8F939E',
    fontWeight: '500',
  },
  chevronIcon: {
    marginLeft: 4,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  settingLabel: {
    fontSize: 14,
    color: '#8F939E',
    fontWeight: '400',
  },
  settingLabelContainer: {
    flex: 1,
  },
  settingSubLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '400',
    marginTop: 2,
  },
  successMessage: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#10B981',
    borderRadius: 8,
    padding: 12,
    margin: 16,
   
  },
  successText: {
    fontSize: 14,
    color: '#10B981',
    fontWeight: '500',
    marginLeft: 8,
  },
});

export default Profile;
