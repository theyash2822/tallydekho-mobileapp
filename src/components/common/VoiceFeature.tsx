import React, {useCallback, useEffect, useState, useRef} from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  PermissionsAndroid,
  Platform,
  Alert,
} from 'react-native';
// import Feather from 'react-native-vector-icons/Feather';
import debounce from 'lodash.debounce';
import {
  startListening,
  stopListening,
  addEventListener,
} from '@ascendtis/react-native-voice-to-text';
import type {EmitterSubscription} from 'react-native';
import { Icons } from '../../utils/Icons';

interface SearchVoiceFieldProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  micStyle?: ViewStyle;
}

const SearchVoiceField: React.FC<SearchVoiceFieldProps> = ({
  onSearch,
  placeholder = 'Search...',
  containerStyle,
  inputStyle,
  micStyle,
}) => {
  const [search, setSearch] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [loading, setLoading] = useState(false);
  const isMountedRef = useRef(true);
  const isRecordingRef = useRef(false);

  // 🔵 Debounce API calls
  const debouncedSearch = useCallback(
    debounce((text: string) => {
      if (text.trim().length > 0) {
        onSearch(text);
      }
    }, 500),
    [onSearch],
  );

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  // 🔐 Request microphone permission (Android)
  const requestMicrophonePermission = useCallback(async () => {
    if (Platform.OS !== 'android') {
      return true;
    }
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      {
        title: 'Microphone Permission',
        message: 'We need your permission to access the microphone',
        buttonNegative: 'Cancel',
        buttonPositive: 'Allow',
      },
    );
    const isGranted = granted === PermissionsAndroid.RESULTS.GRANTED;
    if (!isGranted) {
      Alert.alert(
        'Permission required',
        'Please enable microphone access to use voice search.',
      );
    }
    return isGranted;
  }, []);

  // Track component mount status
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // 🎧 Subscribe to native speech events
  useEffect(() => {
    const subs: EmitterSubscription[] = [];

      subs.push(
      addEventListener('onSpeechResults', (event: any) => {
        if (!isMountedRef.current) return;
        const finalText = event?.value ?? '';
        if (finalText) {
          setSearch(finalText);
          debouncedSearch(finalText);
        }
        setLoading(false);
        setIsRecording(false);
        isRecordingRef.current = false;
      }),
    );

    subs.push(
      addEventListener('onSpeechPartialResults', (event: any) => {
        if (!isMountedRef.current) return;
        const partial = event?.value ?? '';
        if (partial) {
          setSearch(partial);
        }
      }),
    );

    subs.push(
      addEventListener('onSpeechError', (event: any) => {
        if (!isMountedRef.current) return;
        console.log('Voice error:', event);
        const errorMessage = event?.message ?? '';
        
        // Filter out expected/acceptable errors that shouldn't show alerts
        const isExpectedError = 
          errorMessage.toLowerCase().includes('cancelled') ||
          errorMessage.toLowerCase().includes('recognition request was cancelled') ||
          errorMessage.toLowerCase().includes('no match') ||
          errorMessage.toLowerCase().includes('timeout') ||
          errorMessage.toLowerCase().includes('client disconnected');
        
        setIsRecording(false);
        isRecordingRef.current = false;
        setLoading(false);
        // Cancel any pending debounced searches on error
        debouncedSearch.cancel();
        
        // Clear search field if it was a cancellation
        if (isExpectedError) {
          setSearch('');
        }
        
        // Only show alert for unexpected errors
        if (!isExpectedError && errorMessage) {
          Alert.alert(
            'Voice recognition error',
            errorMessage,
          );
        }
      }),
    );

    subs.push(
      addEventListener('onSpeechEnd', () => {
        if (!isMountedRef.current) return;
        setIsRecording(false);
        isRecordingRef.current = false;
        setLoading(false);
        // Cancel any pending debounced searches when speech ends
        debouncedSearch.cancel();
      }),
    );

    // Cleanup: Stop listening if component unmounts while recording
    return () => {
      subs.forEach(sub => sub.remove());
      // Cancel any pending debounced searches
      debouncedSearch.cancel();
      // Stop listening if still recording when component unmounts
      if (isRecordingRef.current) {
        stopListening().catch(err => {
          console.log('Error stopping voice on unmount:', err);
        });
        isRecordingRef.current = false;
      }
    };
  }, [debouncedSearch]);

  // 🎤 Start Listening
  const handleStart = async () => {
    try {
      const hasPermission = await requestMicrophonePermission();
      if (!hasPermission || isRecording) {
        return;
      }
      setLoading(true);
      setIsRecording(true);
      isRecordingRef.current = true;
      await startListening();
    } catch (e) {
      console.log('Voice start error:', e);
      setIsRecording(false);
      isRecordingRef.current = false;
      setLoading(false);
    }
  };

  // 🛑 Stop Listening
  const handleStop = async () => {
    try {
      setLoading(true);
      isRecordingRef.current = false;
      setIsRecording(false);
      // Cancel any pending debounced searches when user stops
      debouncedSearch.cancel();
      // Clear search field when user cancels
      setSearch('');
      await stopListening();
    } catch (e) {
      console.log('Voice stop error:', e);
      setLoading(false);
      setIsRecording(false);
      isRecordingRef.current = false;
    }
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <TextInput
        value={search}
        placeholder={placeholder}
        style={[styles.input, inputStyle]}
        onChangeText={txt => {
          setSearch(txt);
          debouncedSearch(txt);
        }}
      />

      <TouchableOpacity
        style={[styles.micButton, micStyle, isRecording && styles.micButtonRecording]}
        onPress={isRecording ? handleStop : handleStart}>
        {loading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Icons.Account
            name={isRecording ? "square" : "mic"} 
            size={20} 
            color="#fff" 
          />
        )}
      </TouchableOpacity>
    </View>
  );
};

export default SearchVoiceField;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
    paddingHorizontal: 12,
    borderRadius: 10,
    height: Platform.OS === 'ios' ? 56 : 48,
    minHeight: Platform.OS === 'ios' ? 56 : 48,
  },
  input: {
    flex: 1,
    fontSize: Platform.OS === 'ios' ? 16 : 14,
    paddingVertical: Platform.OS === 'ios' ? 12 : 8,
    color: '#000',
  },
  micButton: {
    backgroundColor: '#CD0141',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  micButtonRecording: {
    backgroundColor: '#EF4444',
  },
});
