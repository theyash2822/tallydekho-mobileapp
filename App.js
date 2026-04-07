import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {Platform, Text, TextInput} from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AppNavigator from './src/navigation/AppNavigator';
import {navigationRef} from './src/navigation/navigationRef';
import {AuthProvider} from './src/context/AuthContext';
import {FilterProvider} from './src/context/FilterContext';
import NoInternetOverlay from './src/utils/NoInternet';
import LockScreen from './src/components/security/LockScreen';
import screenLockService from './src/services/security/screenLockService';


/* =====================================================
   🔒 Disable system font scaling globally
   ===================================================== */
if (Text.defaultProps == null) {
  Text.defaultProps = {};
}
Text.defaultProps.allowFontScaling = false;

if (TextInput.defaultProps == null) {
  TextInput.defaultProps = {};
}
TextInput.defaultProps.allowFontScaling = false;
/* ===================================================== */

export default function App() {
  const [initialRoute, setInitialRoute] = useState(null);
  const [isConnected, setIsConnected] = useState(null);
  const [isLocked, setIsLocked] = useState(true); // Start locked by default
  const [isCheckingLock, setIsCheckingLock] = useState(true);
  const [hasInitialized, setHasInitialized] = useState(false);

  useEffect(() => {
    Ionicons.loadFont?.();
    Feather.loadFont?.();
    MaterialIcons.loadFont?.();
    FontAwesome.loadFont?.();
  }, []);

  useEffect(() => {
    // Only initialize once, don't re-run when internet reconnects
    if (hasInitialized) return;

    const init = async () => {
      const splashShown = await AsyncStorage.getItem('splashShownOnce');
      const onboarded = await AsyncStorage.getItem('onboardingDone');
      const authToken = await AsyncStorage.getItem('authToken');
      const loggedOut = await AsyncStorage.getItem('loggedOut');
      const isInOnboardingFlow = await AsyncStorage.getItem('isInOnboardingFlow');
      const reachedGetStarted = await AsyncStorage.getItem('reachedGetStarted');


      if (!splashShown) {
        setInitialRoute('Splash');
      } else if (loggedOut === 'true') {
        setInitialRoute('login');
      } else if (reachedGetStarted === 'true') {  
        setInitialRoute('getStarted');
      } else if (isInOnboardingFlow === 'true') {
        // User is in onboarding flow, preserve SyncTally screen
        setInitialRoute('sync');
      } else if (onboarded === 'true' && authToken) {
        setInitialRoute('MainTabs');
      } else {
        setInitialRoute('login');
      }
      setHasInitialized(true);
    };

    init();
  }, [hasInitialized]);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
    });
    return unsubscribe;
  }, []);

  // Check screen lock status on app startup
  useEffect(() => {
    const checkScreenLock = async () => {
      try {
        const authToken = await AsyncStorage.getItem('authToken');
        const loggedOut = await AsyncStorage.getItem('loggedOut');

        if (authToken && loggedOut !== 'true') {
          const isEnabled = await screenLockService.isScreenLockEnabled();
          setIsLocked(!!isEnabled);
        } else {
          setIsLocked(false);
        }
      } catch (error) {
        setIsLocked(false);
      } finally {
        setIsCheckingLock(false);
      }
    };

    checkScreenLock();
  }, []);

  // Initialize screen lock service
  useEffect(() => {
    const initializeScreenLock = async () => {
      try {
        const isEnabled = await screenLockService.isScreenLockEnabled();

        if (isEnabled) {
          screenLockService.initialize(
            () => {
              setIsLocked(true);
            },
            () => {         
              setIsLocked(false);
            },
          );
        }
      } catch (error) {
      
      }
    };

    if (initialRoute && initialRoute !== 'login' && initialRoute !== 'Splash') {
      const timer = setTimeout(() => {
        initializeScreenLock();
      }, Platform.OS === 'ios' ? 500 : 200);

      return () => {
        clearTimeout(timer);
        screenLockService.cleanup();
      };
    }
  }, [initialRoute]);

  const handleRetry = () => {
    NetInfo.fetch().then(state => {
      setIsConnected(state.isConnected);
    });
  };

  // Don't render anything until we've initialized
  if (!hasInitialized || !initialRoute || isCheckingLock) {
    // Show NoInternetOverlay if internet is disconnected during initialization
    if (isConnected === false && hasInitialized) {
      return <NoInternetOverlay onRetry={handleRetry} />;
    }
    return null;
  }

  const handleUnlock = () => {
    setIsLocked(false);
  };

  return (
    <AuthProvider>
      <FilterProvider>
        <SafeAreaProvider>
          <SafeAreaView edges={['top']} style={{flex: 1}}>
            {isLocked ? (
              <LockScreen onUnlock={handleUnlock} />
            ) : (
              <>
                <NavigationContainer ref={navigationRef}>
                  <AppNavigator initialRoute={initialRoute} />
                </NavigationContainer>
                <Toast />
              </>
            )}
          </SafeAreaView>
        </SafeAreaProvider>
        {/* Show NoInternetOverlay as overlay when internet is disconnected, but keep NavigationContainer mounted */}
        {isConnected === false && (
          <NoInternetOverlay onRetry={handleRetry} />
        )}
      </FilterProvider>
    </AuthProvider>
  );
}
