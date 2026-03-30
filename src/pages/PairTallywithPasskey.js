/**
 * PairTallywithPasskey — Onboarding pairing screen
 * Uses the unified PairingScreen component
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { BackgroundWrapper, Logo } from '../components/common';
import PairingScreen from '../components/pairing/PairingScreen';
import { navigateNext } from '../navigation/FlowController';

const PairTallywithPasskey = ({ navigation }) => {
  const handleSuccess = async (deviceId) => {
    await navigateNext(navigation, 'AFTER_PAIR_WITH_PASSKEY');
  };

  const handleSkip = async () => {
    await navigateNext(navigation, 'AFTER_PAIR_NEW');
  };

  return (
    <View style={styles.container}>
      <Logo marginTop={40} marginBottom={10} />
      <PairingScreen
        onSuccess={handleSuccess}
        onSkip={handleSkip}
        showSkip={true}
        title="Connect to Tally Prime"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

export default PairTallywithPasskey;
