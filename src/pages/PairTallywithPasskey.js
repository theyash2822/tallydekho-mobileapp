// import React, { useRef, useState } from 'react';
// import { View, Text, TouchableOpacity, StyleSheet, Image, TextInput } from 'react-native';

// import { globalStyles, Icons } from '../../Utils/Constants';
// import BackgroundWrapper from '../../common/Backgroundwrapper';

// const PairTallywithPasskey = ({ navigation }) => {
//     const [pairKey, setPairKey] = useState(['', '', '', '']);
//     const inputRefs = [useRef(), useRef(), useRef(), useRef()];

//     const handleChange = (text, index) => {
//         if (text.length > 1) return;
//         const newPairKey = [...pairKey];
//         newPairKey[index] = text;
//         setPairKey(newPairKey);

//         if (text && index < 3) {
//             inputRefs[index + 1].current.focus();
//         }
//     };

//     const handleKeyPress = (e, index) => {
//         if (e.nativeEvent.key === 'Backspace' && !pairKey[index] && index > 0) {
//             inputRefs[index - 1].current.focus();
//         }
//     };

//     const next = () => {
//         navigation.navigate("pairnew");
//     };

//     return (
//         <BackgroundWrapper>
//             <TouchableOpacity
//                 style={styles.iconContainer}
//                 onPress={() => navigation.goBack()}
//             >
//                 <View style={styles.iconBackground}>
//                     {Icons.Left(24, '#07624c')}
//                 </View>
//             </TouchableOpacity>
//             <View style={styles.logoRow}>
//                 <Image source={require("../../../assets/Compnaylogo.png")} style={styles.logo} />
//                 <Text style={styles.tallyDekhoText}>Tallydekho</Text>
//             </View>
//             <Text style={[globalStyles.textSemibold(36), styles.heading]}>Input Your Tally Pair Key</Text>
//             <Text style={[globalStyles.textRegular(14), styles.subText]}>Please check your Tally application to see the pair key.</Text>
//             <View style={styles.inputContainer}>
//                 {pairKey.map((value, index) => (
//                     <TextInput
//                         key={index}
//                         ref={inputRefs[index]}
//                         style={styles.inputBox}
//                         value={value}
//                         maxLength={1}
//                         keyboardType="numeric"
//                         onChangeText={(text) => handleChange(text, index)}
//                         onKeyPress={(e) => handleKeyPress(e, index)}
//                     />
//                 ))}
//             </View>
//             <View style={styles.buttonContainer}>
//                 <TouchableOpacity style={styles.submitButton} onPress={next}>
//                     <Text style={[globalStyles.textMedium(14), styles.submitButtonText]}>Submit</Text>
//                 </TouchableOpacity>
//             </View>
//         </BackgroundWrapper>
//     );
// };

// const styles = StyleSheet.create({
//     iconContainer: {
//         marginTop: 15,
//     },
//     iconBackground: {
//         backgroundColor: Colors.white,
//         width: 50,
//         height: 50,
//         borderRadius: 25,
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
//     logoRow: {
//         marginTop: 17,
//         paddingTop: 20,
//         flexDirection: "row",
//         marginBottom: 20,
//     },
//     logo: {
//         width: 32,
//         height: 32,
//         resizeMode: "contain",
//     },
//     tallyDekhoText: {
//         marginLeft: 15,
//         fontSize: 24,
//         fontWeight: "500",
//         color: "#fff",
//     },
//     heading: {
//         color: Colors.white,
//         marginTop: 10,
//     },
//     subText: {
//         color: '#93b1a3',
//         marginTop: 10,
//         paddingRight: 20,
//     },
//     inputContainer: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         marginTop: 20,
//     },
//     inputBox: {
//         width: 75,
//         height: 72,
//         borderWidth: 1,
//         borderColor: '#3d8574',
//         textAlign: 'center',
//         fontSize: 24,
//         color: Colors.white,
//         borderRadius: 10,
//         backgroundColor: '#00513b'
//     },
//     buttonContainer: {
//         alignItems: 'center',
//         marginTop: 30,
//     },
//     submitButton: {
//         backgroundColor: Colors.white,
//         paddingVertical: 15,
//         width: '100%',
//         borderRadius: 30,
//         alignSelf: 'center',
//     },
//     submitButtonText: {
//         fontSize: 16,
//         fontWeight: '500',
//         color: '#00513B',
//         textAlign: 'center',
//     },
// });

// export default PairTallywithPasskey;

import React, {useRef, useState, useContext, useCallback} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  TextInput,
  Keyboard,
  BackHandler,
} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {globalStyles, Icons} from '../utils/Constants';
import {TextMedium, TextRegular, TextSemibold} from '../utils/CustomText';
import Colors from '../utils/Colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiService from '../services/api/apiService';
import {Logger} from '../services/utils/logger';
import {AuthContext} from '../context/AuthContext';
import { BackgroundWrapper } from '../components/common';

const PairTallywithPasskey = ({navigation}) => {
  const [pairKey, setPairKey] = useState(['', '', '', '']);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputRefs = [useRef(), useRef(), useRef(), useRef()];
  const backspaceRef = useRef(false);
  const {fetchCompaniesData} = useContext(AuthContext);

  // Handle back button - navigate back to SyncTally
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        // Replace current screen with SyncTally to prevent going back to PairTallyWithPasskey
        navigation.replace('sync');
        return true; // Prevent default behavior
      };

      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        onBackPress,
      );

      return () => backHandler.remove();
    }, [navigation]),
  );

  const handleChange = (text, index) => {
    if (text.length > 1) return;
    
    const newPairKey = [...pairKey];
    newPairKey[index] = text;
    setPairKey(newPairKey);
    setError(false);

    // If text is being added, move forward
    if (text && index < 3) {
      inputRefs[index + 1].current.focus();
    }
    // If text was deleted (backspace) and we were tracking it, move backward
    else if (!text && backspaceRef.current && index > 0) {
      backspaceRef.current = false;
      // Clear the previous field and move focus to it
      const prevIndex = index - 1;
      inputRefs[prevIndex].current?.focus();
    } else {
      // Reset backspaceRef if we're not moving
      backspaceRef.current = false;
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace') {
      e.preventDefault(); // Prevent default backspace behavior
      backspaceRef.current = true;
      
      const newPairKey = [...pairKey];
      
      // If current field has content, clear it
      if (pairKey[index]) {
        newPairKey[index] = '';
        setPairKey(newPairKey);
        // Stay on current field so user can type again
      }
      // If current field is empty, move to previous field
      else if (index > 0) {
        newPairKey[index - 1] = '';
        setPairKey(newPairKey);
        inputRefs[index - 1].current?.focus();
      }
      
      backspaceRef.current = false;
    } else {
      backspaceRef.current = false;
    }
  };

  const checkKeyAndProceed = async () => {
    Keyboard.dismiss();
    const enteredKey = pairKey.join('');

    if (enteredKey.length !== 4) {
      setError(true);
      return;
    }

    setLoading(true);

    try {
      const storedInfo = await AsyncStorage.getItem('deviceInfo');
      if (!storedInfo) {
        alert('⚠️ Device info missing. Restart the app.');
        setLoading(false);
        return;
      }

      const deviceData = JSON.parse(storedInfo);

      const requestBody = {
        pairingCode: enteredKey,
        manufacturer: deviceData.manufacturer,
        model: deviceData.model,
        isAndroid: deviceData.isAndroid,
        appVersion: deviceData.appVersion,
      };

      Logger.info('Pairing device with code', {code: enteredKey});
      const response = await apiService.pairDevice(requestBody);
      Logger.info('Pairing response', {
        status: response?.status,
        message: response?.message,
      });

      if (response?.status === true) {
        setError(false);
        await AsyncStorage.setItem('isPaired', 'true');

        // Prefetch companies but don't block UI
        fetchCompaniesData().catch(err => {
          Logger.error('Failed to prefetch companies', err);
        });

        setLoading(false);
        Logger.info('Navigating to pairNew screen');
        navigation.replace('pairNew');
      } else {
        Logger.warn('Pairing failed', {message: response?.message});
        setError(true);
        alert(response?.message || 'Pairing failed. Please try again.');
        setLoading(false);
      }
    } catch (err) {
      Logger.error('Pairing failed', err);
      // Better error handling with new API service
      if (err.isNetworkError) {
        alert('Network error. Please check your connection.');
      } else if (err.isTimeout) {
        alert('Request timed out. Please try again.');
      } else {
        alert(err.message || 'Pairing failed. Please try again.');
      }
      setError(true);
      setLoading(false);
    }
  };

  return (
    <BackgroundWrapper>
      <View style={styles.logoRow}>
        <Image source={require('../assets/logo.png')} style={styles.logo} />
        <Text style={styles.tallyDekhoText}>Tallydekho</Text>
      </View>
      <TextSemibold fontSize={36} color={Colors.white} style={styles.heading}>
        Input Your Tally Pair Key
      </TextSemibold>
      <TextRegular fontSize={14} color={'#93b1a3'} style={styles.subText}>
        Please check your Tally application to see the pair key.
      </TextRegular>
      <View style={styles.inputContainer}>
        {pairKey.map((value, index) => (
          <TextInput
            key={index}
            ref={inputRefs[index]}
            style={[styles.inputBox, error && styles.inputError]}
            value={value}
            maxLength={1}
            keyboardType="numeric"
            onChangeText={text => handleChange(text, index)}
            onKeyPress={e => handleKeyPress(e, index)}
            editable={!loading}
          />
        ))}
      </View>
      {error && <Text style={styles.errorText}>Key does not match</Text>}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.submitButton, loading && styles.submitButtonDisabled]}
          onPress={checkKeyAndProceed}
          disabled={loading}>
          <TextMedium
            fontSize={16}
            fontWeight={500}
            color={loading ? '#ccc' : '#00513B'}
            style={styles.submitButtonText}>
            {loading ? 'Verifying...' : 'Submit'}
          </TextMedium>
        </TouchableOpacity>
      </View>
    </BackgroundWrapper>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    marginTop: 15,
  },
  iconBackground: {
    backgroundColor: Colors.white,
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoRow: {
    marginTop: 50,
    paddingTop: 20,
    flexDirection: 'row',
    marginBottom: 20,
  },
  logo: {
    width: 32,
    height: 32,
    resizeMode: 'contain',
  },
  tallyDekhoText: {
    marginLeft: 15,
    fontSize: 24,
    fontWeight: '500',
    color: Colors.white,
  },
  heading: {
    marginTop: 10,
  },
  subText: {
    marginTop: 10,
    paddingRight: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 28,
  },
  inputBox: {
    width: 75,
    height: 72,
    borderWidth: 1,
    borderColor: '#3d8574',
    textAlign: 'center',
    fontSize: 24,
    color: Colors.white,
    borderRadius: 10,
    backgroundColor: '#00513b',
  },
  inputError: {
    borderColor: '#fff',
   
  },
  errorText: {
    color: '#fff',
    textAlign: 'start',
    marginTop: 15,
    marginLeft: 5,
  },
  buttonContainer: {
    alignItems: 'center',
    marginTop: 30,
  },
  submitButton: {
    backgroundColor: Colors.white,
    paddingVertical: 15,
    width: '100%',
    borderRadius: 30,
    alignSelf: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: '#e0e0e0',
  },
  submitButtonText: {
    textAlign: 'center',
  },
});

export default PairTallywithPasskey;
