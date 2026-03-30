import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Animated,
  Image,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import Colors from '../../../utils/Colors';
import Header from '../../common/Header';
import CustomBottomButton from '../../common/BottomButton';
import CustomAnimatedModal from '../../common/CustomAnimatedModal';
import PairedDeviceCard from './Components/PairedDeviceCard';
import {Logger} from '../../../services/utils/logger';
import {AuthContext} from '../../../context/AuthContext';
import {useAuth} from '../../../hooks/useAuth';
import {
  unpairDevice,
  fetchPairing,
  handlePairNow as pairNow,
  handleUnpair as unpair,
} from './utils/pairingUtils';
import {
  handleCodeChange,
  handleKeyPress,
  handleCancelPairing,
} from './utils/pairingHandlers';
import {formatDate, initializePairState} from './utils/pairingHelpers';
import {setupBlinkAnimation} from './utils/pairingAnimation';

const TallyERPSync = () => {
  const navigation = useNavigation();
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [showModal, setShowModal] = useState(false);
  const [isPairing, setIsPairing] = useState(false);
  const [lastSync, setLastSync] = useState(null);
  const [isPaired, setIsPaired] = useState(false);
  const [isCodeRevealed, setIsCodeRevealed] = useState(false);
  const inputRefs = useRef([]);
  const scrollViewRef = useRef(null);
  const codeInputContainerRef = useRef(null);
  const codeInputYPosition = useRef(0);

  const {companies, fetchCompaniesData, setCompanies} = useAuth(AuthContext);

  // Animation values for blinking dots
  const dot1Opacity = useRef(new Animated.Value(1)).current;
  const dot2Opacity = useRef(new Animated.Value(1)).current;
  const dot3Opacity = useRef(new Animated.Value(1)).current;

  // Blinking animation effect
  useEffect(() => {
    setupBlinkAnimation(isPairing, dot1Opacity, dot2Opacity, dot3Opacity);
  }, [isPairing, dot1Opacity, dot2Opacity, dot3Opacity]);

  // Fetch pairing details when screen is focused
  useFocusEffect(
    React.useCallback(() => {
      fetchPairing({
        setLastSync,
        setCompanies,
        fetchCompaniesData,
        setIsPaired,
        setCode,
      }).catch(err => {
        Logger.error('Failed to fetch pairing on focus', err);
      });
    }, []),
  );

  // Initialize pairing state on mount
  useEffect(() => {
    initializePairState({
      setIsPaired,
      setCode,
      setLastSync,
      fetchPairing: async () => {
        await fetchPairing({
          setLastSync,
          setCompanies,
          fetchCompaniesData,
          setIsPaired,
          setCode,
        });
      },
      fetchCompaniesData,
      companiesLength: companies.length,
    });
  }, []);

  // Wrapper functions for handlers
  const handlePairNowWrapper = async () => {
    const fullCode = code.join('');
    await pairNow({
      fullCode,
      setIsPairing,
      setLastSync,
      setIsPaired,
      fetchPairingFn: async () => {
        await fetchPairing({
          setLastSync,
          setCompanies,
          fetchCompaniesData,
          setIsPaired,
          setCode,
        });
      },
      fetchCompaniesData,
      setCompanies,
      setCode,
    });
  };

  const handleUnpairWrapper = () => {
    unpair({
      unpairDevice: () =>
        unpairDevice({
          setCompanies,
          fetchCompaniesData,
          setIsPaired,
          setCode,
        }),
    });
  };

  const handleCodeInputLayout = (event) => {
    const {y} = event.nativeEvent.layout;
    codeInputYPosition.current = y;
  };

  const handleCodeInputFocus = (index) => {
    setTimeout(() => {
      if (scrollViewRef.current && codeInputYPosition.current > 0) {
        scrollViewRef.current.scrollTo({
          y: codeInputYPosition.current - 150,
          animated: true,
        });
      }
    }, 300);
  };

  const handleCodeChangeWrapper = (text, index) => {
    handleCodeChange(text, index, code, setCode, inputRefs);
  };

  const handleKeyPressWrapper = (e, index) => {
    handleKeyPress(e, index, code, setCode, inputRefs);
  };

  const handleCancelPairingWrapper = () => {
    handleCancelPairing(setIsPairing, setCode);
  };

  const openTallyDekhoWebsite = () => {
    navigation.navigate('TallyDekhoWebView', {
      url: 'https://www.tallydekho.com',
    });
  };

  const isCodeComplete = code.every(digit => digit !== '');

  const LoadingDots = () => (
    <View style={styles.loadingContainer}>
      <Animated.View style={[styles.loadingDot, {opacity: dot1Opacity}]} />
      <Animated.View style={[styles.loadingDot, {opacity: dot2Opacity}]} />
      <Animated.View style={[styles.loadingDot, {opacity: dot3Opacity}]} />
    </View>
  );

  return (
    <>
      <Header
        title="Tally Prime Sync"
        leftIcon="chevron-left"
        onLeftPress={() => navigation.goBack()}
      />
  

      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}>
        <ScrollView 
          ref={scrollViewRef}
          style={styles.container}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="interactive">
        {!isPaired ? (
          <View style={styles.contentCard}>
            <Text style={styles.instructionTitle}>Follow the steps mention below</Text>

            <View style={styles.stepCard}>
              <Text style={styles.stepLabel}>Step 1</Text>
              <View style={styles.stepContent}>
                <Image
                  source={require('../../../assets/Desktop.png')}
                  style={styles.desktopImage}
                  resizeMode="contain"
                />
                <Text style={styles.stepText}>
                  Download <Text style={styles.boldStepText}>TallyDekho</Text> Agent from https://www.tallydekho.com/download
                </Text>
              </View>
            </View>

            <View style={styles.stepCard}>
              <Text style={styles.stepLabel}>Step 2</Text>
              <View style={styles.pairingCard}>
                <Text style={styles.pairingTitle}>Pairing</Text>
                <View style={styles.pairingDivider} />
                <View style={styles.codeDisplayContainer}>
                  <View style={styles.codeDisplay}>
                    <View style={styles.hiddenCodeContainer}>
                      <View style={styles.codeDot} />
                      <View style={styles.codeDot} />
                      <View style={styles.codeDot} />
                      <View style={styles.codeDot} />
                    </View>
                  </View>
                  <TouchableOpacity
                    style={styles.revealButton}
                    disabled={true}>
                    <Text style={styles.revealButtonText}>
                      Reveal code
                    </Text>
                  </TouchableOpacity>
                </View>
                <Text style={styles.pairingInstruction}>
                  Enter this code in the mobile app → Settings → Account Pairing
                </Text>
              </View>
            </View>

            <Text style={styles.pairLabel}>Pair Device</Text>

            {!isPairing ? (
              <>
                <View 
                  ref={codeInputContainerRef}
                  onLayout={handleCodeInputLayout}
                  style={styles.codeInputContainer}>
                  {code.map((digit, index) => (
                    <TextInput
                      key={index}
                      ref={ref => (inputRefs.current[index] = ref)}
                      style={styles.codeInput}
                      value={digit}
                      onChangeText={text => handleCodeChangeWrapper(text, index)}
                      onKeyPress={e => handleKeyPressWrapper(e, index)}
                      onFocus={() => handleCodeInputFocus(index)}
                      placeholder="-"
                      placeholderTextColor="#9CA3AF"
                      keyboardType="numeric"
                      maxLength={1}
                      textAlign="center"
                      selectTextOnFocus
                    />
                  ))}
                </View>

                <Text style={styles.instructionText}>Enter 6-digit code</Text>

                <TouchableOpacity
                  style={[
                    styles.pairButton,
                    !isCodeComplete && styles.pairButtonDisabled,
                  ]}
                  onPress={handlePairNowWrapper}
                  disabled={!isCodeComplete}>
                  <Text style={styles.pairButtonText}>Pair Now</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.helpLink}
                  onPress={() => setShowModal(true)}>
                  <Text style={styles.helpLinkText}>
                    {' '}
                    Where do I find the code?{' '}
                  </Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <LoadingDots />

                <Text style={styles.statusText}>Awaiting Approval</Text>

                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={handleCancelPairingWrapper}>
                  <Text style={styles.cancelButtonText}>Cancel Pairing</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.helpLink}
                  onPress={() => setShowModal(true)}>
                  <Text style={styles.helpLinkText}>
                    {' '}
                    Where do I find the code?{' '}
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        ) : (
          <PairedDeviceCard
            lastSync={lastSync}
            companies={companies.map(c => c.name)}
            onUnpair={handleUnpairWrapper}
          />
        )}

        <CustomAnimatedModal
          visible={showModal}
          onClose={() => setShowModal(false)}
          title="Where Do I Find The Code?"
          scrollable={true}>
          <View style={styles.modalContent}>
            <View style={styles.instructionItem}>
              <Text style={styles.instructionNumber}>1.</Text>
              <Text style={styles.modalInstructionText}>
                On the desktop where Tally is installed, open your web
                browser and visit{' '}
                <Text
                  style={styles.highlightedText}
                  onPress={openTallyDekhoWebsite}>
                  www.tallydekho.com
                </Text>
              </Text>
            </View>

            <View style={styles.instructionItem}>
              <Text style={styles.instructionNumber}>2.</Text>
              <Text style={styles.modalInstructionText}>
                Download the{' '}
                <Text style={styles.boldText}>
                  TallyDekho Desktop Application.
                </Text>
              </Text>
            </View>

            <View style={styles.instructionItem}>
              <Text style={styles.instructionNumber}>3.</Text>
              <Text style={styles.modalInstructionText}>
                Run the setup file and complete the installation process.
              </Text>
            </View>

            <View style={styles.instructionItem}>
              <Text style={styles.instructionNumber}>4.</Text>
              <Text style={styles.modalInstructionText}>
                Open the application and{' '}
                <Text style={styles.boldText}>sync the company.</Text>
              </Text>
            </View>

            <View style={styles.instructionItem}>
              <Text style={styles.instructionNumber}>5.</Text>
              <Text style={styles.modalInstructionText}>
                Once the company is successfully synced, a{' '}
                <Text style={styles.boldText}>6-digit code</Text> will be
                displayed in the TallyDekho desktop application.
              </Text>
            </View>
          </View>

          {/* <CustomBottomButton buttonText="Download" /> */}
        </CustomAnimatedModal>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundColorPrimary,
  },
  scrollContent: {
    padding: 12,
    flexGrow: 1,
  },
  contentCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  instructionTitle: {
    fontSize: 14,
    fontWeight: '400',
    color: '#111827',
    alignSelf: 'flex-start',
    marginBottom: 18,
  },
  stepCard: {
    width: '100%',
    backgroundColor: Colors.white,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  stepLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  stepContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  desktopImage: {
    width: 100,
    height: 100,
    marginBottom: 2,
  },
  stepText: {
    fontSize: 14,
    fontWeight: '400',
    color: '#108f6f',
    textAlign: 'center',
    marginTop: 12,
    lineHeight: 20,
  },
  boldStepText: {
    fontWeight: '600',
  },
  pairingCard: {
    width: '100%',
  },
  pairingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#108f6f',
    marginBottom: 8,
  },
  pairingDivider: {
    height: 1,
    backgroundColor: Colors.border,
    marginBottom: 15,
  },
  codeDisplayContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 12,
    marginBottom: 12,
  },
  codeDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  hiddenCodeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  codeDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#111827',
  },
  revealedCode: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    letterSpacing: 4,
  },
  revealButton: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
  },
  revealButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#108f6f',
  },
  pairingInstruction: {
    fontSize: 14,
    fontWeight: '400',
    color: '#108f6f',
    lineHeight: 20,
  },
  pairLabel: {
    fontSize: 14,
    fontWeight: '400',
    color: '#111827',
    alignSelf: 'flex-start',
    marginTop: 10,
    marginBottom: 16,
  },
  codeInputContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
    marginTop:8
  },
  codeInput: {
    width: 60,
    height: 60,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    fontSize: 24,
    fontWeight: '600',
    color: '#111827',
  },
  instructionText: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
  },
  pairButton: {
    backgroundColor: '#07624C',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 16,
    width: '100%',
    alignItems: 'center',
  },
  pairButtonDisabled: {
    backgroundColor: '#D1D5DB',
  },
  pairButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  helpLink: {
    paddingVertical: 8,
  },
  helpLinkText: {
    color: '#108f6f',
    fontSize: 14,
    fontWeight: '500',
    textDecorationLine: 'underline',
    marginBottom:12
  },
  statusText: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 16,
    textAlign: 'center',
  },
  cancelButton: {
    backgroundColor: '#F7F9FC',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 16,
    width: '100%',
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#111111',
    fontSize: 14,
    fontWeight: '500',
  },
  loadingContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
  },
  loadingDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#10B981',
    marginHorizontal: 4,
  },
  modalContent: {
    paddingHorizontal: 4,
    paddingVertical: 4,
    marginBottom: 10,
  },
  instructionItem: {
    flexDirection: 'row',
    marginBottom: 10,
    alignItems: 'flex-start',
  },
  instructionNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: '#10B981',
    marginRight: 12,
    marginTop: 2,
  },
  modalInstructionText: {
    flex: 1,
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
  highlightedText: {
    color: '#10B981',
    fontWeight: '500',
    textDecorationLine: 'underline',
  },
  boldText: {
    fontWeight: '600',
  },
});

export default TallyERPSync;
