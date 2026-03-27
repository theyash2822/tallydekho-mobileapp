import ReactNativeBiometrics from 'react-native-biometrics';
import { Platform } from 'react-native';

const rnBiometrics = new ReactNativeBiometrics();

class BiometricService {
  /**
   * Check if biometric authentication is available on the device
   */
  async isAvailable() {
    try {
      const { available, biometryType } = await rnBiometrics.isSensorAvailable();
      return {
        available,
        type: biometryType,
      };
    } catch (error) {
      return {
        available: false,
        type: null,
      };
    }
  }

  /**
   * Get human-readable biometric type name
   */
  getBiometricTypeName(biometryType) {
    if (biometryType === ReactNativeBiometrics.TouchID) {
      return 'Touch ID';
    } else if (biometryType === ReactNativeBiometrics.FaceID) {
      return 'Face ID';
    } else if (biometryType === ReactNativeBiometrics.Biometrics) {
      return Platform.OS === 'ios' ? 'Face ID' : 'Fingerprint';
    }
    return 'Biometric';
  }

  /**
   * Authenticate using biometrics
   */
  async authenticate(reason = 'Authenticate to continue') {
    try {
      const { available } = await this.isAvailable();
      if (!available) {
        throw new Error('Biometric authentication is not available');
      }

      const { success, error } = await rnBiometrics.simplePrompt({
        promptMessage: reason,
        cancelButtonText: 'Cancel',
      });

      if (success) {
        return { success: true };
      } else {
        return {
          success: false,
          error: error || 'Biometric authentication failed',
        };
      }
    } catch (error) {

      return {
        success: false,
        error: error.message || 'Biometric authentication failed',
      };
    }
  }

  /**
   * Create biometric keys (for advanced usage)
   */
  async createKeys() {
    try {
      const { publicKey } = await rnBiometrics.createKeys();
      return { success: true, publicKey };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Delete biometric keys
   */
  async deleteKeys() {
    try {
      await rnBiometrics.deleteKeys();
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

export default new BiometricService();



