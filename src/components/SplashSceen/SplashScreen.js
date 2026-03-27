// VideoSplashScreen.js
import React, {useRef, useState} from 'react'; // Import useState
import {View, StyleSheet, Dimensions} from 'react-native';
import Video from 'react-native-video';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {navigateNext} from '../../navigation/FlowController';

const SplashScreen = ({navigation}) => {
  const videoRef = useRef(null);
  const [videoLoaded, setVideoLoaded] = useState(false); // 💡 State to track video load status

 const handleEnd = async () => {
   await AsyncStorage.setItem('splashShownOnce', 'true');
   await navigateNext(navigation, 'AFTER_SPLASH');
 };


  return (
    <View style={styles.container}>
      <Video
        source={require('../../assets/splash/splash.mp4')}
        ref={videoRef}
        // Apply opacity based on load status
        style={[styles.video, {opacity: videoLoaded ? 1 : 0}]}
        resizeMode="cover"
        onEnd={handleEnd}
        // Set the state to true once the video is loaded
        onLoad={() => setVideoLoaded(true)}
        muted
        repeat={false}
        controls={false}
        paused={false}
        ignoreSilentSwitch="ignore"
        disableFocus={true}
      />
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  video: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});




// // VideoSplashScreen.js
// import React, { useRef, useState, useEffect } from 'react';
// import { View, StyleSheet, Dimensions } from 'react-native';
// import Video from 'react-native-video';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// const SplashScreen = ({ navigation }) => {
//   const videoRef = useRef(null);
//   const [videoLoaded, setVideoLoaded] = useState(false);

//   useEffect(() => {
//     const checkSplash = async () => {
//       const hasSeenSplash = await AsyncStorage.getItem('hasSeenSplash');

//       // If already seen, skip video & go directly to login
//       if (hasSeenSplash === 'true') {
//         navigation.replace('login');
//       }
//     };

//     checkSplash();
//   }, []);

//   const handleEnd = async () => {
//     await AsyncStorage.setItem('hasSeenSplash', 'true');
//     navigation.replace('login'); // ✅ Always go to login
//   };

//   return (
//     <View style={styles.container}>
//       <Video
//         source={require('../../assets/splash/splash.mp4')}
//         ref={videoRef}
//         style={[styles.video, { opacity: videoLoaded ? 1 : 0 }]}
//         resizeMode="cover"
//         onEnd={handleEnd}
//         onLoad={() => setVideoLoaded(true)}
//         muted
//         repeat={false}
//         controls={false}
//         paused={false}
//         ignoreSilentSwitch="ignore"
//         disableFocus
//       />
//     </View>
//   );
// };

// export default SplashScreen;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: 'black',
//   },
//   video: {
//     width: Dimensions.get('window').width,
//     height: Dimensions.get('window').height,
//   },
// });
