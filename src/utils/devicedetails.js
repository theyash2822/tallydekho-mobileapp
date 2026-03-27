// utils/deviceInfo.js
import DeviceInfo from 'react-native-device-info';
import {Platform} from 'react-native';

export const getDeviceDetails = async () => {
  return {
    manufacturer: await DeviceInfo.getManufacturer(),
    model: DeviceInfo.getModel(),
    isAndroid: Platform.OS === 'android',
    appVersion: DeviceInfo.getVersion(),
  };
};
