import React from 'react';
import {View, StyleSheet, Platform} from 'react-native';
import Colors from '../../utils/Colors';
import CustomBottomButtonTwo from './CustomBottomButtonTwo';

const BottomArea = ({
  buttonText = 'Submit Credit Note',
  secondButtonColor = '#F7F9FC',
  secondButtonText = 'Share PDF',
  showSecondButton = true,
  onPress = () => console.log('Pressed'),
  onSecondPress,
}) => {
  return (
    <View style={[styles.container, Platform.OS === 'ios' && {paddingBottom: 16}]}>
      <CustomBottomButtonTwo
        onPress={onPress}
        buttonText={buttonText}
        buttonColor="#07624C"
        textColor="#FFFFFF"
        showSecondButton={showSecondButton}
        secondButtonText={secondButtonText}
        secondButtonColor={secondButtonColor}
        onSecondPress={onSecondPress}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    backgroundColor: Colors.white,
  },
});

export default BottomArea;
