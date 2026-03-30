/**
 * Pairing Utility Functions
 * Handles pairing, unpairing, and fetching pairing details
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import {Alert} from 'react-native';
import apiService from '../../../../services/api/apiService';
import {apiDelete} from '../../../../services/api/apiClient';
import {API_ENDPOINTS} from '../../../../services/api/config';
import {Logger} from '../../../../services/utils/logger';
import {getDeviceDetails} from '../../../../utils/devicedetails';
import wsService from '../../../../services/websocket/websocketService';

/**
 * Unpair device locally (preserves authToken)
 * @param {Function} setCompanies - Function to clear companies from context
 * @param {Function} fetchCompaniesData - Function to fetch companies
 * @param {Function} setIsPaired - Function to update paired state
 * @param {Function} setCode - Function to clear code
 */
export const unpairDevice = async ({
  setCompanies,
  fetchCompaniesData,
  setIsPaired,
  setCode,
}) => {
  try {
    await AsyncStorage.removeItem('pairedDevice');
    await AsyncStorage.setItem('isPaired', 'false');
    // DO NOT remove authToken - user is still logged in
    await AsyncStorage.removeItem('cachedCompanies');
    await AsyncStorage.removeItem('hasFetchedCompanies');
    await AsyncStorage.removeItem('SELECTED_GUID');

    // Clear companies from context to trigger fetchCompanies which will return demo company
    if (setCompanies) {
      setCompanies([]);
    }
    setIsPaired(false);
    setCode(['', '', '', '', '', '']);

    // Fetch companies to get demo company after unpairing
    if (fetchCompaniesData) {
      try {
        await fetchCompaniesData({force: true});
        Logger.info('Demo company fetched after unpairing');
      } catch (err) {
        Logger.error('Failed to fetch demo company after unpairing', err);
      }
    }

    Logger.info('Device unpaired successfully (authToken preserved, demo company fetched)');
  } catch (error) {
    Logger.error('Failed to unpair device', error);
  }
};

/**
 * Fetch pairing details from server
 * @param {Function} setLastSync - Function to update last sync time
 * @param {Function} setCompanies - Function to clear companies on error
 * @param {Function} fetchCompaniesData - Function to fetch companies
 * @param {Function} setIsPaired - Function to update paired state
 * @param {Function} setCode - Function to clear code
 */
export const fetchPairing = async ({
  setLastSync,
  setCompanies,
  fetchCompaniesData,
  setIsPaired,
  setCode,
}) => {
  try {
    Logger.info('Fetching pairing details for TallyPrimeSync');
    const res = await apiService.fetchPairingDetails();

    const syncTime = res?.data?.device?.lastSync ?? null;
    Logger.debug('Pairing details received', {syncTime});

    // Set the real sync time directly to UI
    setLastSync(syncTime);

    // Update stored sync time so next launch shows correct value immediately
    const stored = await AsyncStorage.getItem('pairedDevice');
    if (stored) {
      const parsed = JSON.parse(stored);
      parsed.lastSync = syncTime;
      await AsyncStorage.setItem('pairedDevice', JSON.stringify(parsed));
      Logger.info('Last sync time updated', {syncTime});
    }
  } catch (error) {
    Logger.error('Fetch Pairing Error', error);

    // Handle 401 - Session expired, unpair device and clear companies
    if (
      error.isUnauthorized ||
      error.statusCode === 401 ||
      error.message?.includes('Session expired')
    ) {
      Logger.warn('Received 401 - Session expired, unpairing device and clearing companies');

      // Check if alert was already shown
      const alertShown = await AsyncStorage.getItem('sessionExpiredAlertShown');

      if (alertShown !== 'true') {
        // Mark alert as shown
        await AsyncStorage.setItem('sessionExpiredAlertShown', 'true');

        // Show alert
        Alert.alert(
          'Session Expired',
          'Your session has expired. Please pair your device again.',
          [
            {
              text: 'OK',
              onPress: async () => {
                // Unpair device (but keep authToken)
                await AsyncStorage.removeItem('pairedDevice');
                await AsyncStorage.setItem('isPaired', 'false');
                await AsyncStorage.removeItem('cachedCompanies');
                await AsyncStorage.removeItem('hasFetchedCompanies');
                await AsyncStorage.removeItem('SELECTED_GUID');

                // Clear companies from context
                if (setCompanies) {
                  setCompanies([]);
                }

                // Update UI state
                setIsPaired(false);
                setCode(['', '', '', '', '', '']);

                // Fetch companies to get demo company
                if (fetchCompaniesData) {
                  try {
                    await fetchCompaniesData({force: true});
                    Logger.info('Demo company fetched after 401 unpairing');
                  } catch (err) {
                    Logger.error('Failed to fetch demo company after 401 unpairing', err);
                  }
                }

                // Reset alert flag after delay
                setTimeout(async () => {
                  await AsyncStorage.removeItem('sessionExpiredAlertShown');
                }, 5000);

                Logger.info('Device unpaired and companies cleared due to 401 in fetchPairing');
              },
            },
          ],
          {cancelable: false},
        );
      } else {
        // Alert already shown, just unpair silently (but keep authToken)
        await AsyncStorage.removeItem('pairedDevice');
        await AsyncStorage.setItem('isPaired', 'false');
        await AsyncStorage.removeItem('cachedCompanies');
        await AsyncStorage.removeItem('hasFetchedCompanies');
        await AsyncStorage.removeItem('SELECTED_GUID');

        // Clear companies from context
        if (setCompanies) {
          setCompanies([]);
        }

        // Update UI state
        setIsPaired(false);
        setCode(['', '', '', '', '', '']);

        // Fetch companies to get demo company
        if (fetchCompaniesData) {
          try {
            await fetchCompaniesData({force: true});
            Logger.info('Demo company fetched after 401 unpairing (silent)');
          } catch (err) {
            Logger.error('Failed to fetch demo company after 401 unpairing (silent)', err);
          }
        }

        Logger.info('Device unpaired and companies cleared due to 401 in fetchPairing (silent)');
      }
    }
  }
};

/**
 * Pair device with Tally
 * @param {string} fullCode - 6-digit pairing code
 * @param {Function} setIsPairing - Function to update pairing state
 * @param {Function} setLastSync - Function to update last sync time
 * @param {Function} setIsPaired - Function to update paired state
 * @param {Function} fetchPairingFn - Function to fetch pairing details (already bound with params)
 * @param {Function} fetchCompaniesData - Function to fetch companies
 * @param {Function} setCompanies - Function to set companies
 * @param {Function} setCode - Function to set code
 */
export const handlePairNow = async ({
  fullCode,
  setIsPairing,
  setLastSync,
  setIsPaired,
  fetchPairingFn,
  fetchCompaniesData,
  setCompanies,
  setCode,
}) => {
  Logger.info('handlePairNow called', {fullCode, length: fullCode.length});

  if (fullCode.length !== 6) {
    Alert.alert('Error', `Code must be 6 digits. Current length: ${fullCode.length}`);
    Logger.warn('Invalid code length', {length: fullCode.length});
    return;
  }

  try {
    setIsPairing(true);

    // Get device info for pairing request
    let deviceData = null;
    const storedInfo = await AsyncStorage.getItem('deviceInfo');

    if (storedInfo) {
      deviceData = JSON.parse(storedInfo);
    } else {
      // Fetch device info if not in storage
      Logger.info('TallyPrimeSync: Fetching device info');
      deviceData = await getDeviceDetails();
      // Save for future use
      await AsyncStorage.setItem('deviceInfo', JSON.stringify(deviceData));
      Logger.info('TallyPrimeSync: Device info saved', deviceData);
    }

    // Validate device data
    if (
      !deviceData.manufacturer ||
      !deviceData.model ||
      deviceData.isAndroid === undefined ||
      !deviceData.appVersion
    ) {
      Logger.error('TallyPrimeSync: Invalid device data', deviceData);
      Alert.alert('Error', 'Device information is incomplete. Please try again.');
      setIsPairing(false);
      return;
    }

    // Build request body with device info
    const requestBody = {
      pairingCode: fullCode,
      manufacturer: deviceData.manufacturer,
      model: deviceData.model,
      isAndroid: deviceData.isAndroid,
      appVersion: deviceData.appVersion,
    };

    Logger.info('TallyPrimeSync: Pair request body', requestBody);
    const response = await apiService.pairDevice(requestBody);
    Logger.info('Pair API Response', {status: response?.status, response});

    if (response?.status === true) {
      if (response?.data?.token) {
        await AsyncStorage.setItem('authToken', response.data.token);
      }

      // Prefer backend sync time if available
      const syncTime = response?.data?.device?.lastSync ?? null;

      // Save device pairing details
      await AsyncStorage.setItem(
        'pairedDevice',
        JSON.stringify({
          code: fullCode,
          lastSync: syncTime,
        }),
      );

      await AsyncStorage.setItem('isPaired', 'true');

      // Update UI state
      setLastSync(syncTime);
      setIsPaired(true);
      setIsPairing(false);

      // Fetch fresh updated pairing details
      if (fetchPairingFn) {
        await fetchPairingFn();
      }

      // Fetch companies immediately after pairing
      Logger.info('Fetching companies after successful pairing');
      if (fetchCompaniesData) {
        try {
          await fetchCompaniesData({force: true});
          Logger.info('Companies fetched successfully after pairing');
        } catch (err) {
          Logger.error('Failed to fetch companies after pairing', err);
        }
      }

      // Reconnect WebSocket after successful pairing
      Logger.info('Reconnecting WebSocket after successful pairing');
      try {
        wsService.isIntentionallyClosed = false;
        await wsService.connect();
        Logger.info('WebSocket reconnected after pairing');
      } catch (wsError) {
        Logger.error('Failed to reconnect WebSocket after pairing', wsError);
      }

      Alert.alert('Success', 'Paired Successfully!');
      Logger.info('Device paired successfully');
    } else {
      Alert.alert('Error', 'Invalid Code. Please try again.');
      Logger.warn('Invalid pairing code');
    }
  } catch (error) {
    Logger.error('Pairing failed', error);
    Alert.alert('Error', 'Pairing failed. Please try again.');
  } finally {
    setIsPairing(false);
  }
};

/**
 * Handle unpair action with API call
 * @param {Function} unpairDevice - Function to unpair device locally
 */
export const handleUnpair = async ({unpairDevice}) => {
  // Show confirmation alert before unpairing
  Alert.alert(
    'Unpair Device',
    'Are you sure you want to unpair this device? You will need to pair again to continue using the app.',
    [
      {
        text: 'Cancel',
        style: 'cancel',
        onPress: () => {
          Logger.info('Unpair cancelled by user');
        },
      },
      {
        text: 'Unpair',
        style: 'destructive',
        onPress: async () => {
          Logger.info('User confirmed unpair, proceeding with unpair process');

          try {
            // Call DELETE API when unpair button is clicked
            Logger.info('Calling deletePairedDevice API from unpair button');
            const response = await apiDelete(API_ENDPOINTS.PAIRED_DEVICE, null, {
              deduplicate: false,
              retryAttempts: 0,
            });
            Logger.info('deletePairedDevice API Response (from unpair button)', {response});

            // Unpair the device after successful API call
            await unpairDevice();

            // Show success message
            Alert.alert('Success', 'Device unpaired successfully.');
          } catch (error) {
            Logger.error('deletePairedDevice API Error (from unpair button)', error);

            // Even if API call fails, still unpair locally
            // Handle 401 response - device is already unpaired on server
            if (error.isUnauthorized || error.statusCode === 401) {
              Logger.warn('Received 401 - Device already unpaired on server');
              await unpairDevice();
              Alert.alert(
                'Device Unpaired',
                'Your device has been unpaired successfully.',
                [{text: 'OK'}],
                {cancelable: false},
              );
            } else {
              // For other errors, still unpair locally but show a message
              await unpairDevice();
              Alert.alert(
                'Unpair Device',
                'There was an issue connecting to the server, but the device has been unpaired locally.',
                [{text: 'OK'}],
                {cancelable: false},
              );
            }
          }
        },
      },
    ],
    {cancelable: true},
  );
};

