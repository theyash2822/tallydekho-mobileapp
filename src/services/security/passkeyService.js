import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Keychain from 'react-native-keychain';

const PASSKEY_STORAGE_KEY = 'user_passkey';
const PASSKEY_ENABLED_KEY = 'passkey_enabled';

class PasskeyService {
  /**
   * Set a 4-digit passkey
   */
  async setPasskey(passkey) {
    try {
      if (!passkey || passkey.length !== 4 || !/^\d{4}$/.test(passkey)) {
        throw new Error('Passkey must be exactly 4 digits');
      }

      // Store passkey securely in keychain
      await Keychain.setGenericPassword('passkey', passkey, {
        service: 'tally_dekho_passkey',
        accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED,
      });

      // Also store in AsyncStorage for quick access (less secure but faster)
      await AsyncStorage.setItem(PASSKEY_STORAGE_KEY, passkey);
      await AsyncStorage.setItem(PASSKEY_ENABLED_KEY, 'true');

      return { success: true };
    } catch (error) {

      return { success: false, error: error.message };
    }
  }

  /**
   * Verify a passkey
   */
  async verifyPasskey(passkey) {
    try {
      const storedPasskey = await AsyncStorage.getItem(PASSKEY_STORAGE_KEY);

      if (!storedPasskey) {
        // Try to get from keychain
        const credentials = await Keychain.getGenericPassword({
          service: 'tally_dekho_passkey',
        });

        if (credentials && credentials.password) {
          return credentials.password === passkey;
        }

        return false;
      }

      return storedPasskey === passkey;
    } catch (error) {

      return false;
    }
  }

  /**
   * Check if passkey is enabled
   */
  async isPasskeyEnabled() {
    try {
      const enabled = await AsyncStorage.getItem(PASSKEY_ENABLED_KEY);
      return enabled === 'true';
    } catch (error) {

      return false;
    }
  }

  /**
   * Disable passkey
   */
  async disablePasskey() {
    try {
      await AsyncStorage.setItem(PASSKEY_ENABLED_KEY, 'false');

      // Don't remove the passkey itself, just disable it
      // This allows users to re-enable without recreating

      return { success: true };
    } catch (error) {

      return { success: false, error: error.message };
    }
  }

  /**
   * Enable passkey (if it exists)
   */
  async enablePasskey() {
    try {
      const hasPasskey = await this.hasPasskey();
      if (!hasPasskey) {
        return { success: false, error: 'No passkey found. Please create one first.' };
      }

      await AsyncStorage.setItem(PASSKEY_ENABLED_KEY, 'true');
      return { success: true };
    } catch (error) {

      return { success: false, error: error.message };
    }
  }

  /**
   * Check if passkey exists
   */
  async hasPasskey() {
    try {
      const storedPasskey = await AsyncStorage.getItem(PASSKEY_STORAGE_KEY);
      if (storedPasskey) {
        return true;
      }

      // Check keychain
      const credentials = await Keychain.getGenericPassword({
        service: 'tally_dekho_passkey',
      });
      return !!credentials;
    } catch (error) {

      return false;
    }
  }
}

export default new PasskeyService();

