import AsyncStorage from '@react-native-async-storage/async-storage';

// Centralized app flow navigation. Aligns with AppNavigator route names and existing storage keys.
// Storage keys used elsewhere:
// - 'splashShownOnce': set in Splash screen after video ends
// - 'onboardingDone': set to 'true' when onboarding is completed
// - 'reachedGetStarted': set to 'true' when user completes OTP and reaches GetStarted screen

export const navigateNext = async (navigation, step, extra = {}) => {
  const splashShownOnce = await AsyncStorage.getItem('splashShownOnce');
  const onboardingDone = await AsyncStorage.getItem('onboardingDone');
  const authToken = await AsyncStorage.getItem('authToken');
  const loggedOut = await AsyncStorage.getItem('loggedOut');
  const reachedGetStarted = await AsyncStorage.getItem('reachedGetStarted');

  switch (step) {
    case 'APP_START': {
      if (!splashShownOnce) {
        return navigation.replace('Splash');
      }
      if (loggedOut === 'true') {
        return navigation.replace('login');
      }
      // ✅ PRIORITY: If user reached GetStarted from OTP → always return to GetStarted
      // This flag is set when OTP completes and user has no profile name
      // It persists until user completes GetStarted form
      if (reachedGetStarted === 'true') {
        return navigation.replace('getStarted');
      }
      // If onboarding is done AND token exists → MainTabs
      if (onboardingDone === 'true' && authToken) {
        return navigation.replace('MainTabs');
      }
      return navigation.replace('login');
    }

    case 'AFTER_SPLASH': {
      await AsyncStorage.setItem('splashShownOnce', 'true');
      const authTokenAfterSplash = await AsyncStorage.getItem('authToken');
      const loggedOutAfterSplash = await AsyncStorage.getItem('loggedOut');
      const onboardingAfterSplash = await AsyncStorage.getItem('onboardingDone');
      const reachedGetStartedAfterSplash = await AsyncStorage.getItem('reachedGetStarted');

      if (loggedOutAfterSplash === 'true') {
        return navigation.replace('login');
      }

      // ✅ PRIORITY: If user reached GetStarted from OTP → return to GetStarted
      if (reachedGetStartedAfterSplash === 'true') {
        return navigation.replace('getStarted');
      }

      // If onboarding done and has token → MainTabs
      if (onboardingAfterSplash === 'true' && authTokenAfterSplash) {
        return navigation.replace('MainTabs');
      }

      // No token → Login
      return navigation.replace('login');
    }

    case 'AFTER_LOGIN':
      return navigation.replace('otp', extra);

    case 'AFTER_OTP': {
      const {isPairedFromAPI} = extra;

      // First time installation → show Get Started
      if (onboardingDone !== 'true') {
        return navigation.replace('getStarted');
      }

      // If backend says paired → go directly to dashboard
      if (isPairedFromAPI === true) {
        return navigation.replace('MainTabs');
      }

      // Otherwise continue pairing process
      return navigation.replace('sync');
    }

    case 'AFTER_GET_STARTED': {
      await AsyncStorage.setItem('onboardingDone', 'true');
      // Clear the reachedGetStarted flag since user completed GetStarted
      await AsyncStorage.removeItem('reachedGetStarted');
      return navigation.replace('sync');
    }

    case 'AFTER_SYNC':
      return navigation.replace('pairWithPassKey');

    case 'AFTER_PAIR_WITH_PASSKEY':
      return navigation.replace('pairNew');

    case 'AFTER_PAIR_NEW':
      // Clear onboarding flow flag when user skips pairing
      await AsyncStorage.removeItem('isInOnboardingFlow');
      return navigation.replace('MainTabs');

    case 'LOGOUT':
      // Clear GetStarted flag on logout
      await AsyncStorage.removeItem('reachedGetStarted');
      return navigation.reset({
        index: 0,
        routes: [{name: 'login'}],
      });

    default:
      return navigation.replace('login');
  }
};
