import AsyncStorage from '@react-native-async-storage/async-storage';

export const isDevicePaired = async () => {
  const value = await AsyncStorage.getItem('isPaired');
  return value === 'true';
};



// const paired = await isDevicePaired();
// if (!paired) {
//   // load dummy data instead of API
// }