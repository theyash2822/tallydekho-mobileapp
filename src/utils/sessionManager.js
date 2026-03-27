import AsyncStorage from '@react-native-async-storage/async-storage';
import apiService from '../services/api/apiService';
import {Logger} from '../services/utils/logger';

const PROFILE_NAME_KEY = 'onboardingDone';

const hasProfileName = name =>
  typeof name === 'string' && name.trim().length > 0;

const syncVerificationData = async data => {
  const name = data?.name;
  const isPaired = data?.isPaired === true;
  const profileCompleted = hasProfileName(name);

  console.log('🔍 [SessionManager] Syncing verification data:', {
    name,
    nameType: typeof name,
    isNull: name === null,
    isUndefined: name === undefined,
    profileCompleted,
  });

  // Always remove first, then set only if profile is completed
  await AsyncStorage.removeItem(PROFILE_NAME_KEY);
  if (profileCompleted) {
    await AsyncStorage.setItem(PROFILE_NAME_KEY, 'true');
    console.log('✅ [SessionManager] Onboarding marked as done');
  } else {
    console.log('❌ [SessionManager] Onboarding NOT done (no valid name)');
  }

  if (hasProfileName(name)) {
    await AsyncStorage.setItem('userName', name.trim());
  } else {
    await AsyncStorage.removeItem('userName');
  }

  await AsyncStorage.setItem('isPaired', isPaired ? 'true' : 'false');

  return {
    hasProfileName: profileCompleted,
    isPaired,
    name: name ?? '',
  };
};

export const clearSession = async () => {
  try {
    await AsyncStorage.multiRemove([
      'authToken',
      'cachedCompanies',
      'hasFetchedCompanies',
      'SELECTED_GUID',
      'isPaired',
      'userName',
    ]);
    await AsyncStorage.removeItem(PROFILE_NAME_KEY);
  } catch (error) {
    Logger.error('Failed to clear session', error);
  }
};

export const verifySessionToken = async tokenOverride => {
  const token = tokenOverride ?? (await AsyncStorage.getItem('authToken'));

  if (!token) {
    return {valid: false};
  }

  try {
    Logger.info('Verifying stored session token');
    const response = await apiService.verifyToken(token);
    Logger.info('Verify token response', response);
    if (response?.status) {
      const synced = await syncVerificationData(response?.data || {});
      return {
        valid: true,
        ...synced,
      };
    }

    Logger.warn('Token verification failed - clearing session');
    await clearSession();
    return {valid: false};
  } catch (error) {
    if (error.isNetworkError || error.isTimeout) {
      Logger.warn('Token verification skipped due to network issue', error);
      const onboardingDone = await AsyncStorage.getItem(PROFILE_NAME_KEY);
      const isPaired =
        (await AsyncStorage.getItem('isPaired')) === 'true';
      return {
        valid: true,
        hasProfileName: onboardingDone === 'true',
        isPaired,
        skipped: true,
      };
    }

    Logger.error('Token verification error - clearing session', error);
    await clearSession();
    return {valid: false};
  }
};

export default {
  verifySessionToken,
  clearSession,
};

