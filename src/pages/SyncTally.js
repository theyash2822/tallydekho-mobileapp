import React, {useEffect} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Image} from 'react-native';
import {globalStyles} from '../utils/Constants';
import {TextMedium, TextRegular, TextSemibold} from '../utils/CustomText';
import Colors from '../utils/Colors';
import {BackgroundWrapper, Logo} from '../components/common';
import { getDeviceDetails } from '../utils/devicedetails';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {navigateNext} from '../navigation/FlowController';

const SyncTally = ({navigation}) => {
  // Set flag to indicate user is in onboarding flow
  useEffect(() => {
    const setOnboardingFlag = async () => {
      try {
        await AsyncStorage.setItem('isInOnboardingFlow', 'true');
      } catch (error) {
      }
    };
    setOnboardingFlag();
  }, []);

  const next = async () => {
    await navigateNext(navigation, 'AFTER_SYNC');
  };

   useEffect(() => {
      const loadDeviceDetails = async () => {
        try {
          const deviceData = await getDeviceDetails();
          await AsyncStorage.setItem('deviceInfo', JSON.stringify(deviceData));
        } catch (err) {
        }
      };
  
      loadDeviceDetails();
    }, []);

  const skip = async () => {
    await navigateNext(navigation, 'AFTER_PAIR_NEW');
  };

  return (
    <BackgroundWrapper>
      <Logo marginTop={50} marginBottom={20} textColor="#fff" />
      <TextSemibold fontSize={36} color={Colors.white} style={styles.heading}>
        Would you like to sync with Tally?
      </TextSemibold>
      <TextRegular fontSize={14} color={'#93b1a3'} style={styles.subText}>
        Syncing with Tally ensures accurate, real-time financial data
        integration, keeping records up-to-date and business operations smooth.
      </TextRegular>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.syncButton} onPress={next}>
          <TextMedium
            fontSize={16}
            fontWeight={500}
            color={'#00513B'}
            style={styles.syncButtonText}>
            Sync with Tally
          </TextMedium>
        </TouchableOpacity>
        <TouchableOpacity style={styles.skipButton} onPress={skip}>
          <TextRegular
            fontSize={16}
            color={Colors.white}
            style={styles.skipButtonText}>
            Skip
          </TextRegular>
        </TouchableOpacity>
      </View>
    </BackgroundWrapper>
  );
};

const styles = StyleSheet.create({
  heading: {
    marginTop: 20,
  },
  subText: {
    marginTop: 14,
    paddingRight: 20,
  },
  buttonContainer: {
    alignItems: 'center',
    marginTop: 30,
  },
  syncButton: {
    marginTop: 50,
    backgroundColor: Colors.white,
    paddingVertical: 15,
    width: '100%',
    borderRadius: 30,
    alignSelf: 'center',
  },
  syncButtonText: {
    textAlign: 'center',
  },
  skipButton: {
    marginTop: 25,
    alignSelf: 'center',
  },
  skipButtonText: {
    textDecorationLine: 'underline',
    textAlign: 'center',
  },
});

export default SyncTally;
