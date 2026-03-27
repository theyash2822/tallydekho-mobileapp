import React from 'react';
import {View, Image, StyleSheet} from 'react-native';

const BackgroundWrapper = ({children}) => {
  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/Tally.png')}
        style={styles.backgroundImage}
      />
      <View style={styles.content}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  content: {
    flex: 1,
    padding: 20,
    paddingLeft: 24,
  },
});

export default BackgroundWrapper;
