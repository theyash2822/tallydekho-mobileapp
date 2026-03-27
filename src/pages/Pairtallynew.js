import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Animated,
  AppState,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';
import {UIActivityIndicator} from 'react-native-indicators';
import {BackgroundWrapper} from '../components/common';
import {globalStyles} from '../utils/Constants';
import {TextRegular, TextSemibold} from '../utils/CustomText';
import Colors from '../utils/Colors';
import {Logo} from '../components/common';
import apiService from '../services/api/apiService';
import {Logger} from '../services/utils/logger';

const PairTallynew = ({navigation}) => {
  const progress = useRef(new Animated.Value(0)).current;
  const [progressText, setProgressText] = useState(0);
  const [loading, setLoading] = useState(false);
  const appState = useRef(AppState.currentState);
  const intervalRef = useRef(null);
  const isSyncingRef = useRef(false);
  const syncPromiseRef = useRef(null);

  const syncPairingDetails = async () => {
    if (isSyncingRef.current && syncPromiseRef.current) {
      return syncPromiseRef.current;
    }

    isSyncingRef.current = true;
    const syncPromise = (async () => {
      try {
        const localPairingStatus = await AsyncStorage.getItem('isPaired');
        if (localPairingStatus !== 'true') {
          await AsyncStorage.removeItem('pairedDevice');
          return;
        }

        Logger.info('Syncing pairing details');

        // Add timeout to prevent hanging
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Sync timeout')), 8000),
        );

        const response = await Promise.race([
          apiService.fetchPairingDetails(),
          timeoutPromise,
        ]);

        const device = response?.data?.device;

        if (!device) {
          Logger.warn('No device found in pairing response');
          // Don't block navigation, just skip sync
          return;
        }

        const syncTime = device?.lastSync ?? null;
        const deviceCode = device?.code ?? null;

        const stored = await AsyncStorage.getItem('pairedDevice');
        const parsed = stored ? JSON.parse(stored) : {};

        const updated = {
          ...parsed,
          ...(deviceCode ? {code: deviceCode} : {}),
          lastSync: syncTime,
        };

        await AsyncStorage.setItem('pairedDevice', JSON.stringify(updated));
        await AsyncStorage.setItem('isPaired', 'true');
        Logger.info('Pairing details synced successfully', {
          deviceCode,
          syncTime,
        });
      } catch (error) {
        Logger.error('Failed to sync pairing details', error);
        // Don't block navigation on sync failure
        if (error.message === 'Sync timeout') {
          Logger.warn('Sync timed out - continuing anyway');
        } else if (error.isNetworkError) {
          Logger.warn('Network error during pairing sync - continuing anyway');
        } else if (error.isUnauthorized || error.statusCode === 401) {
          Logger.warn('Unauthorized - Device has been unpaired');
          
          // Clear pairing data
          await AsyncStorage.removeItem('pairedDevice');
          await AsyncStorage.setItem('isPaired', 'false');
          await AsyncStorage.removeItem('authToken');
          await AsyncStorage.removeItem('cachedCompanies');
          await AsyncStorage.removeItem('hasFetchedCompanies');
          
          // Check if alert was already shown to prevent duplicates
          const alertShown = await AsyncStorage.getItem('deviceUnpairedAlertShown');
          
          if (alertShown !== 'true') {
            // Mark alert as shown
            await AsyncStorage.setItem('deviceUnpairedAlertShown', 'true');
            
            // Show alert to user
            Alert.alert(
              'Device Unpaired',
              'Your device has been unpaired. Please pair your device again to continue.',
              [
                {
                  text: 'OK',
                  onPress: () => {
                    // Reset alert flag after delay
                    setTimeout(async () => {
                      await AsyncStorage.removeItem('deviceUnpairedAlertShown');
                    }, 5000);
                    Logger.info('Device unpaired - user acknowledged');
                  },
                },
              ],
              {cancelable: false},
            );
          }
          
          // Stop the progress and prevent navigation
          throw error;
        }
        // Continue anyway - sync is not critical for navigation (except for 401)
      } finally {
        isSyncingRef.current = false;
        syncPromiseRef.current = null;
      }
    })();

    syncPromiseRef.current = syncPromise;
    return syncPromise;
  };

  // useEffect(() => {
  //     const backAction = () => {
  //         // Prevent going back
  //         return true;
  //     };

  //     const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);

  //     return () => backHandler.remove();
  // }, []);

  useEffect(() => {
    Animated.timing(progress, {
      toValue: 100,
      duration: 5000,
      useNativeDriver: false,
    }).start();

    const updateProgress = () => {
      intervalRef.current = setInterval(() => {
        setProgressText(prev => {
          if (prev >= 100) {
            clearInterval(intervalRef.current);
            setLoading(true);
            setTimeout(async () => {
              Logger.info(
                'Progress complete, syncing and navigating to MainTabs',
              );
              try {
                await syncPairingDetails();
                await AsyncStorage.setItem('onboardingDone', 'true');
                // Clear onboarding flow flag when onboarding completes
                await AsyncStorage.removeItem('isInOnboardingFlow');
                Logger.info('Onboarding complete, navigating to MainTabs');
                navigation.replace('MainTabs');
              } catch (error) {
                // If device was unpaired (401 error), don't navigate to MainTabs
                if (error.isUnauthorized || error.statusCode === 401) {
                  Logger.error('Cannot navigate - device was unpaired');
                  // Alert is already shown in syncPairingDetails
                  setLoading(false);
                  // Don't navigate, user needs to pair again
                } else {
                  // For other errors, continue to MainTabs
                  Logger.warn('Sync failed but continuing to MainTabs', error);
                  await AsyncStorage.setItem('onboardingDone', 'true');
                  // Clear onboarding flow flag when onboarding completes
                  await AsyncStorage.removeItem('isInOnboardingFlow');
                  navigation.replace('MainTabs');
                }
              }
            }, 2000);
            return 100;
          }

          return prev + 10;
        });
      }, 500);
    };

    updateProgress();

    const handleAppStateChange = nextAppState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        updateProgress();
      } else if (nextAppState === 'background') {
        clearInterval(intervalRef.current);
      }
      appState.current = nextAppState;
    };

    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );

    return () => {
      clearInterval(intervalRef.current);
      subscription.remove();
    };
  }, []);

  const progressWidth = progress.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  const progressTextPosition = progress.interpolate({
    inputRange: [0, 100],
    outputRange: ['5%', '85%'],
  });

  return (
    <BackgroundWrapper>
      <Logo marginTop={50} marginBottom={20} textColor="#fff" />
      <TextSemibold fontSize={36} color={Colors.white} style={styles.heading}>
        Pairing with Tally
      </TextSemibold>
      <TextRegular fontSize={14} color={'#93b1a3'} style={styles.subText}>
        This might take a few minutes...
      </TextRegular>

      {/* {/ Progress Bar /} */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBarBackground}>
          {Array.from({length: 50}).map((_, index) => (
            <View key={index} style={styles.stripedPattern} />
          ))}
        </View>

        <Animated.View style={[styles.progressBar, {width: progressWidth}]}>
          <LinearGradient
            colors={['#41ffb4', '#00ada3']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}
            style={styles.gradientFill}
          />
        </Animated.View>

        <Animated.Text
          style={[styles.progressText, {left: progressTextPosition}]}>
          {progressText}%
        </Animated.Text>
      </View>
      <View style={{marginTop: 20}} />
      {/* {/ Button with Loader /} */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.Button, loading && styles.ButtonLoading]}
          disabled={loading}>
          {loading ? (
            <Text style={[globalStyles.textMedium(14), styles.ButtonText]}>
              Next
            </Text>
          ) : (
            <UIActivityIndicator size={24} color="#00ada3" />
          )}
        </TouchableOpacity>
      </View>
    </BackgroundWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  content: {
    padding: 20,
    zIndex: 3,
  },
  heading: {
    marginTop: 20,
  },
  subText: {
    marginTop: 10,
    paddingRight: 20,
  },
  progressContainer: {
    width: '100%',
    height: 35,
    borderRadius: 15,
    backgroundColor: '#0c5f4b',
    overflow: 'hidden',
    marginTop: 60,
    position: 'relative',
    justifyContent: 'center',
  },
  progressBarBackground: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'row',
    alignItems: 'center',
  },
  stripedPattern: {
    width: 5,
    height: '100%',
    backgroundColor: '#00513b',
    transform: [{rotate: '16deg'}],
    marginRight: 3,
  },
  progressBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    height: '100%',
    borderRadius: 15,
  },
  gradientFill: {
    flex: 1,
    borderRadius: 15,
  },
  progressText: {
    position: 'absolute',
    top: '50%',
    transform: [{translateY: -10}],
    fontWeight: 'bold',
    color: Colors.white,
    fontSize: 14,
  },
  buttonContainer: {
    alignItems: 'center',
    marginTop: 12,
  },
  Button: {
    marginTop: 30,
    backgroundColor: Colors.white,
    paddingVertical: 10,
    width: '100%',
    borderRadius: 30,
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 50,
  },
  ButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#00513B',
    textAlign: 'center',
  },
});

export default PairTallynew;
