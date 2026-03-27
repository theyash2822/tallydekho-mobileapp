import React from 'react';
import {TouchableOpacity, Text, StyleSheet, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const GradientBorderButton = ({title, onPress}) => {
  return (
    <LinearGradient
      colors={['#199CFA', '#2654EE']} 
      style={styles.gradientBorder}>
      <TouchableOpacity style={styles.button} onPress={onPress}>
        <Text style={styles.text}>{title}</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradientBorder: {
    padding: 2,
    borderRadius: 25,
  },
  button: {
    backgroundColor: '#0F3E96',
    paddingVertical: 10,
    paddingHorizontal: 80,
    borderRadius: 25,
    alignItems: 'center',
  },
  text: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default GradientBorderButton;
