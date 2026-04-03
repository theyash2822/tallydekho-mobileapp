import AsyncStorage from '@react-native-async-storage/async-storage';
import biometricService from './biometricService';
import passkeyService from './passkeyService';

const SCREEN_LOCK_ENABLED_KEY = 'screen_lock_enabled';

class ScreenLockService {
  constructor() {
    this.appStateSubscription = null;
    this.isLocked = false;
    this.onLockCallback = null;
    this.onUnlockCallback = null;
  }

  /**
   * Initialize screen lock service
   */
  async initialize(onLock, onUnlock) {
    this.onLockCallback = onLock;
    this.onUnlockCallback = onUnlock;

    // Screen lock only happens on app startup (handled in App.js)
    // No inactivity timer - app only locks when closed and reopened
  }

  /**
   * Check if screen lock is enabled
   * Screen lock is enabled if either biometric or passkey is enabled
   */
  async isScreenLockEnabled() {
    try {
      // Check explicit screen lock flag
      const explicitEnabled = await AsyncStorage.getItem(SCREEN_LOCK_ENABLED_KEY);
      if (explicitEnabled === 'true') {
        return true;
      }

      // Check if biometric is enabled
      const biometricEnabled = await AsyncStorage.getItem('profile_biometricEnabled');
      if (biometricEnabled === 'true') {
        return true;
      }

      // Check if passkey is enabled
      const passkeyEnabled = await passkeyService.isPasskeyEnabled();
      if (passkeyEnabled) {
        return true;
      }

      return false;
    } catch (error) {

      return false;
    }
  }

  /**
   * Enable screen lock
   */
  async enableScreenLock() {
    try {
      await AsyncStorage.setItem(SCREEN_LOCK_ENABLED_KEY, 'true');
      // Locking on app startup is handled in App.js
      return { success: true };
    } catch (error) {

      return { success: false, error: error.message };
    }
  }

  /**
   * Disable screen lock
   */
  async disableScreenLock() {
    try {
      await AsyncStorage.setItem(SCREEN_LOCK_ENABLED_KEY, 'false');
      return { success: true };
    } catch (error) {

      return { success: false, error: error.message };
    }
  }


  /**
   * Remove app state listener
   */
  removeAppStateListener() {
    if (this.appStateSubscription) {
      this.appStateSubscription.remove();
      this.appStateSubscription = null;
    }
  }


  /**
   * Lock the app
   */
  async lock() {
    if (this.isLocked) {
      return;
    }
    this.isLocked = true;
    if (this.onLockCallback) {
      this.onLockCallback();
    }
  }

  /**
   * Unlock the app
   */
  async unlock() {
    if (!this.isLocked) {
      return;
    }
    this.isLocked = false;

    if (this.onUnlockCallback) {
      this.onUnlockCallback();
    }
  }

  /**
   * Check if app is currently locked
   */
  getIsLocked() {
    return this.isLocked;
  }

  /**
   * Cleanup
   */
  cleanup() {
    this.removeAppStateListener();
  }
}

export default new ScreenLockService();

