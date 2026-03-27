// import React, {useEffect, useState} from 'react';
// import {
//   Button,
//   PermissionsAndroid,
//   Platform,
//   Text,
//   View,
//   TouchableOpacity,
//   StyleSheet,
// } from 'react-native';

// let Voice;
// try {
//   Voice = require('@react-native-community/voice').default;
// } catch (e) {
//   console.error('Failed to load Voice module:', e);
// }

// const VoiceTest = () => {
//   const [isRecording, setIsRecording] = useState(false);
//   const [error, setError] = useState(null);
//   const [results, setResults] = useState([]);

//   // Request microphone permission
//   const requestMicPermission = async () => {
//     if (Platform.OS === 'android') {
//       try {
//         const granted = await PermissionsAndroid.request(
//           PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
//           {
//             title: 'Microphone Permission',
//             message: 'App needs microphone access for voice recognition',
//             buttonPositive: 'OK',
//           },
//         );
//         return granted === PermissionsAndroid.RESULTS.GRANTED;
//       } catch (err) {
//         console.warn('Permission error:', err);
//         return false;
//       }
//     }
//     return true;
//   };

//   useEffect(() => {
//     if (!Voice) {
//       setError('Voice module is not available');
//       return;
//     }

//     // Setup listeners
//     Voice.onSpeechStart = () => {
//       console.log('Speech started');
//       setIsRecording(true);
//       setError(null);
//     };

//     Voice.onSpeechEnd = () => {
//       console.log('Speech ended');
//       setIsRecording(false);
//     };

//     Voice.onSpeechResults = e => {
//       console.log('Speech Results:', e.value);
//       setResults(e.value || []);
//     };

//     Voice.onSpeechError = e => {
//       console.error('Speech Error:', e);
//       setError(e.error?.message || 'Speech recognition failed');
//       setIsRecording(false);
//     };

//     // Cleanup
//     return () => {
//       Voice.destroy()
//         .then(() => Voice.removeAllListeners())
//         .catch(err => console.error('Cleanup error:', err));
//     };
//   }, []);

//   const onStartButtonPress = async () => {
//     if (!Voice) {
//       setError('Voice recognition is not available on this device');
//       return;
//     }

//     try {
//       const hasPermission = await requestMicPermission();
//       if (!hasPermission) {
//         setError('Microphone permission denied');
//         return;
//       }

//       console.log('Starting voice recognition...');
//       await Voice.start('en-US');
//       setError(null);
//       setResults([]);
//     } catch (error) {
//       console.error('Voice start error:', error);
//       setError(error.message || 'Failed to start voice recognition');
//     }
//   };

//   const onStopButtonPress = async () => {
//     if (!Voice) return;

//     try {
//       await Voice.stop();
//     } catch (error) {
//       console.error('Stop error:', error);
//       setError(error.message || 'Failed to stop voice recognition');
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.statusText}>
//         Voice Module Status:
//         <Text style={{color: Voice ? 'green' : 'red'}}>
//           {Voice ? ' Loaded' : ' Not Loaded'}
//         </Text>
//       </Text>

//       <TouchableOpacity
//         style={[styles.button, isRecording && styles.buttonDisabled]}
//         onPress={onStartButtonPress}
//         disabled={isRecording || !Voice}>
//         <Text style={styles.buttonText}>
//           {isRecording ? 'Recording...' : 'Start Voice Recognition'}
//         </Text>
//       </TouchableOpacity>

//       {isRecording && (
//         <TouchableOpacity style={styles.stopButton} onPress={onStopButtonPress}>
//           <Text style={styles.stopButtonText}>Stop Recording</Text>
//         </TouchableOpacity>
//       )}

//       {error && <Text style={styles.errorText}>{error}</Text>}

//       {results.length > 0 && (
//         <View style={styles.resultContainer}>
//           <Text style={styles.resultTitle}>Results:</Text>
//           {results.map((result, index) => (
//             <Text key={index} style={styles.resultText}>
//               {result}
//             </Text>
//           ))}
//         </View>
//       )}
//     </View>
//   );
// };

// // **Updated Styles**
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     backgroundColor: '#f4f4f4',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   statusText: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginBottom: 20,
//   },
//   button: {
//     backgroundColor: '#007AFF',
//     paddingVertical: 12,
//     paddingHorizontal: 24,
//     borderRadius: 8,
//     alignItems: 'center',
//     marginBottom: 10,
//     width: '80%',
//   },
//   buttonDisabled: {
//     backgroundColor: '#AAB7B8',
//   },
//   buttonText: {
//     color: 'green',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   stopButton: {
//     backgroundColor: '#FF3B30',
//     paddingVertical: 12,
//     paddingHorizontal: 24,
//     borderRadius: 8,
//     alignItems: 'center',
//     width: '80%',
//   },
//   stopButtonText: {
//     color: 'green',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   errorText: {
//     color: 'red',
//     fontSize: 14,
//     marginTop: 10,
//   },
//   resultContainer: {
//     marginTop: 20,
//     width: '100%',
//     paddingHorizontal: 10,
//     alignItems: 'center',
//   },
//   resultTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginBottom: 5,
//   },
//   resultText: {
//     fontSize: 16,
//     padding: 5,
//     backgroundColor: 'red',
//     width: '90%',
//     textAlign: 'center',
//     borderRadius: 5,
//     marginVertical: 3,
//     shadowColor: Colors.black,
//     shadowOffset: {width: 0, height: 1},
//     shadowOpacity: 0.2,
//     shadowRadius: 1,
//     elevation: 2,
//   },
// });

// export default VoiceTest;

// import React, {useEffect, useState} from 'react';
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   StyleSheet,
//   PermissionsAndroid,
//   Platform,
// } from 'react-native';

// let Voice;
// try {
//   Voice = require('@react-native-community/voice').default;
// } catch (e) {
//   console.error('Failed to load Voice module:', e);
// }

// const VoiceTest = () => {
//   const [isRecording, setIsRecording] = useState(false);
//   const [error, setError] = useState(null);
//   const [results, setResults] = useState([]);

//   const requestMicPermission = async () => {
//     if (Platform.OS === 'android') {
//       try {
//         const granted = await PermissionsAndroid.request(
//           PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
//           {
//             title: 'Microphone Permission',
//             message: 'App needs microphone access for voice recognition',
//             buttonPositive: 'OK',
//           },
//         );
//         return granted === PermissionsAndroid.RESULTS.GRANTED;
//       } catch (err) {
//         console.warn('Permission error:', err);
//         return false;
//       }
//     }
//     return true;
//   };

//   useEffect(() => {
//     if (!Voice) {
//       setError('Voice module is not available');
//       return;
//     }

//     Voice.onSpeechStart = () => {
//       console.log('Speech started');
//       setIsRecording(true);
//       setError(null);
//     };

//     Voice.onSpeechEnd = () => {
//       console.log('Speech ended');
//       setIsRecording(false);
//     };

//     Voice.onSpeechResults = e => {
//       console.log('Speech Results:', e.value);
//       setResults(e.value || []);
//     };

//   Voice.onSpeechError = e => {
//     console.error('Speech Error:', e);
//     const message = e.error?.message || 'Speech recognition failed';

//     // Optional: Custom message for "no match"
//     if (e.error?.message?.includes('no match')) {
//       setError('No speech detected. Try speaking clearly.');
//     } else {
//       setError(message);
//     }

//     setIsRecording(false);
//   };

//     return () => {
//       Voice.destroy()
//         .then(() => Voice.removeAllListeners())
//         .catch(err => console.error('Cleanup error:', err));
//     };
//   }, []);

//  const onStartButtonPress = async () => {
//    if (!Voice) {
//      setError('Voice recognition is not available on this device');
//      return;
//    }

//    try {
//      const hasPermission = await requestMicPermission();
//      if (!hasPermission) {
//        setError('Microphone permission denied');
//        return;
//      }

//      // Ensure cleanup before starting again
//      await Voice.cancel(); // <-- Add this line

//      console.log('Starting voice recognition...');
//      await Voice.start('en-US');
//      setError(null);
//      setResults([]);
//    } catch (error) {
//      console.error('Voice start error:', error);
//      setError(error.message || 'Failed to start voice recognition');
//    }
//  };

//   const onStopButtonPress = async () => {
//     if (!Voice) return;

//     try {
//       await Voice.stop();
//     } catch (error) {
//       console.error('Stop error:', error);
//       setError(error.message || 'Failed to stop voice recognition');
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.statusText}>
//         Voice Module Status:{' '}
//         <Text style={{color: Voice ? 'green' : 'red'}}>
//           {Voice ? 'Loaded' : 'Not Loaded'}
//         </Text>
//       </Text>

//       <TouchableOpacity
//         style={[styles.micContainer, isRecording && styles.micActive]}
//         onPress={isRecording ? onStopButtonPress : onStartButtonPress}
//         disabled={!Voice}>
//         <Text style={styles.micText}>
//           {isRecording ? 'Stop Mic' : 'Start Mic'}
//         </Text>
//       </TouchableOpacity>

//       <View style={styles.resultContainer}>
//         <Text style={styles.resultTitle}>Result:</Text>
//         {results.length > 0 ? (
//           results.map((result, index) => (
//             <Text key={index} style={styles.resultText}>
//               {result}
//             </Text>
//           ))
//         ) : (
//           <Text style={styles.placeholderText}>Say something...</Text>
//         )}
//       </View>

//       {error && <Text style={styles.errorText}>{error}</Text>}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     backgroundColor: Colors.white,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   statusText: {
//     fontSize: 16,
//     marginBottom: 20,
//     fontWeight: 'bold',
//   },
//   micContainer: {
//     width: 120,
//     height: 120,
//     borderRadius: 60,
//     backgroundColor: '#e0e0e0',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: 30,
//     elevation: 5,
//   },
//   micActive: {
//     backgroundColor: '#FFCDD2',
//   },
//   micText: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#333',
//   },
//   resultContainer: {
//     width: '100%',
//     backgroundColor: '#F3F4F6',
//     padding: 16,
//     borderRadius: 12,
//     minHeight: 120,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   resultTitle: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     marginBottom: 10,
//   },
//   resultText: {
//     fontSize: 16,
//     color: '#444',
//     textAlign: 'center',
//   },
//   placeholderText: {
//     fontSize: 14,
//     color: '#aaa',
//   },
//   errorText: {
//     color: 'red',
//     marginTop: 10,
//   },
// });

// export default VoiceTest;

// import React, {useEffect, useState} from 'react';
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   StyleSheet,
//   PermissionsAndroid,
//   Platform,
// } from 'react-native';
// import Colors from '../utils/Colors';

// let Voice;
// try {
//   Voice = require('@react-native-community/voice').default;
// } catch (e) {
//   console.error('Failed to load Voice module:', e);
// }

// const VoiceTest = () => {
//   const [isRecording, setIsRecording] = useState(false);
//   const [results, setResults] = useState([]);
//   const [error, setError] = useState(null);
//   const [wordList, setWordList] = useState([
//     // Pretend these came from API
//     'apple',
//     'banana',
//     'orange',
//     'grape',
//   ]);

//   const requestMicPermission = async () => {
//     if (Platform.OS === 'android') {
//       const granted = await PermissionsAndroid.request(
//         PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
//         {
//           title: 'Microphone Permission',
//           message: 'App needs access to your microphone',
//           buttonPositive: 'OK',
//         },
//       );
//       return granted === PermissionsAndroid.RESULTS.GRANTED;
//     }
//     return true;
//   };

//   useEffect(() => {
//     if (!Voice) {
//       setError('Voice module not available');
//       return;
//     }

//     Voice.onSpeechStart = () => {
//       setIsRecording(true);
//       setError(null);
//     };

//     Voice.onSpeechEnd = () => {
//       setIsRecording(false);
//     };

//     Voice.onSpeechResults = e => {
//       const spokenWords = e.value || [];
//       const matched = spokenWords.filter(word =>
//         wordList.some(item => item.toLowerCase() === word.toLowerCase()),
//       );

//       if (matched.length > 0) {
//         setResults(matched);
//       } else {
//         setResults(['No match found']);
//       }
//     };

//     Voice.onSpeechError = e => {
//       setError(e.error?.message || 'Speech recognition error');
//       setIsRecording(false);
//     };

//     return () => {
//       Voice.destroy()
//         .then(() => Voice.removeAllListeners())
//         .catch(err => console.error('Cleanup error:', err));
//     };
//   }, [wordList]);

//   const startListening = async () => {
//     if (!Voice) return;
//     const hasPermission = await requestMicPermission();
//     if (!hasPermission) {
//       setError('Microphone permission denied');
//       return;
//     }

//     try {
//       setResults([]);
//       await Voice.start('en-US');
//     } catch (err) {
//       setError(err.message);
//     }
//   };

//   const stopListening = async () => {
//     if (!Voice) return;
//     try {
//       await Voice.stop();
//     } catch (err) {
//       setError(err.message);
//     }
//   };

//   const toggleMic = () => {
//     if (isRecording) {
//       stopListening();
//     } else {
//       startListening();
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <TouchableOpacity style={styles.micContainer} onPress={toggleMic}>
//         <Text style={styles.micText}>{isRecording ? 'Stop' : 'Mic'}</Text>
//       </TouchableOpacity>

//       <View style={styles.resultContainer}>
//         {results.map((res, idx) => (
//           <Text key={idx} style={styles.resultText}>
//             {res}
//           </Text>
//         ))}
//         {error && <Text style={styles.errorText}>{error}</Text>}
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#F2F2F2',
//     alignItems: 'center',
//     justifyContent: 'center',
//     padding: 20,
//   },
//   micContainer: {
//     backgroundColor: '#007AFF',
//     paddingVertical: 20,
//     paddingHorizontal: 40,
//     borderRadius: 100,
//     marginBottom: 30,
//   },
//   micText: {
//     color: Colors.white,
//     fontSize: 20,
//     fontWeight: 'bold',
//   },
//   resultContainer: {
//     backgroundColor: Colors.white,
//     padding: 20,
//     borderRadius: 12,
//     width: '100%',
//     alignItems: 'center',
//   },
//   resultText: {
//     fontSize: 18,
//     color: '#333',
//     marginVertical: 5,
//   },
//   errorText: {
//     color: 'red',
//     marginTop: 10,
//   },
// });

// export default VoiceTest;
