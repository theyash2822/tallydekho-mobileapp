import React from 'react';
import {View, Image, StyleSheet, Text} from 'react-native';

const Logo = ({marginTop = 70, marginBottom = 40, textColor = '#07624c'}) => {
  return (
    <View style={[styles.logoRow, {marginTop, marginBottom}]}>
      <Image source={require('../../assets/logo.png')} style={styles.logo} />
      <Text style={[styles.tallyDekhoText, {color: textColor}]}>
        Tallydekho
      </Text>
    </View>
  );
};
const styles = StyleSheet.create({
  logoRow: {
    paddingTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
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
  },
});

export default Logo;
