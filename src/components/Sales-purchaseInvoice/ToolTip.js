// import React, {useState, useEffect, useRef} from 'react';
// import {View, Text, TouchableOpacity} from 'react-native';
// import Icon from 'react-native-vector-icons/Ionicons';

// const ToolTip = ({label = 'Optional/Regular'}) => {
//   const [showTooltip, setShowTooltip] = useState(false);
//   const timeoutRef = useRef(null);

//   useEffect(() => {
//     if (showTooltip) {
//       timeoutRef.current = setTimeout(() => {
//         setShowTooltip(false);
//       }, 3000);
//     }

//     return () => {
//       if (timeoutRef.current) {
//         clearTimeout(timeoutRef.current);
//       }
//     };
//   }, [showTooltip]);

//   const handleIconPress = () => {
//     if (timeoutRef.current) {
//       clearTimeout(timeoutRef.current);
//     }
//     setShowTooltip(prev => !prev);
//   };

//   return (
//     <View
//       style={{
//         flexDirection: 'row',
//         justifyContent: 'flex-end',
//         alignItems: 'center',
//       }}>
//       {/* Wrapper for icon and tooltip with relative positioning */}
//       <View style={{position: 'relative', marginRight: 3, zIndex: 1000}}>
//         <TouchableOpacity onPress={handleIconPress}>
//           <Icon name="alert-circle-outline" color={'#6F7C97'} size={20} />
//         </TouchableOpacity>

//         {/* Tooltip */}
//         {showTooltip && (
//           <View
//             style={{
//               position: 'absolute',
//               top: 25,
//               right: 0,
//               left: -60,
//               backgroundColor: '#F4F5FA',
//               padding: 10,
//               borderRadius: 6,
//               elevation: 10,
//               zIndex: 1000,
//               shadowColor: '#000',
//               shadowOffset: {width: 0, height: 2},
//               shadowOpacity: 0.25,
//               shadowRadius: 4,
//               width: 190,
//             }}>
//             <Text style={{fontSize: 12, color: '#8F939E'}}>
//               Enabling this option will send your entry directly to Tally as a
//               Regular Voucher. Disabling it will keep the entry as Optional.
//             </Text>
//           </View>
//         )}
//       </View>

//       <Text style={{fontSize: 13, color: '#8F939E'}}>{label}</Text>
//     </View>
//   );
// };

// export default ToolTip;

//Smooth animation

import React, {useState, useEffect, useRef} from 'react';
import {View, Text, TouchableOpacity, Animated, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const ToolTip = ({label = 'Optional/Regular'}) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const opacity = useRef(new Animated.Value(0)).current;
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (showTooltip) {
      // Fade In
      Animated.timing(opacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();

      // Auto-close tooltip after 2s
      timeoutRef.current = setTimeout(() => {
        fadeOutTooltip();
      }, 2000);
    } else {
      fadeOutTooltip();
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [showTooltip]);

  const fadeOutTooltip = () => {
    Animated.timing(opacity, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setShowTooltip(false);
    });
  };

  const handleIconPress = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (!showTooltip) setShowTooltip(true);
    else fadeOutTooltip();
  };

  return (
    <View style={styles.container}>
      <View style={styles.iconWrapper}>
        <TouchableOpacity onPress={handleIconPress}>
          <Icon name="alert-circle-outline" color={'#6F7C97'} size={20} />
        </TouchableOpacity>

        {showTooltip && (
          <Animated.View style={[styles.tooltipBox, {opacity}]}>
            <Text style={styles.tooltipText}>
              Enabling this option will send your entry directly to Tally as a
              Regular Voucher. Disabling it will keep the entry as Optional.
            </Text>
          </Animated.View>
        )}
      </View>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  iconWrapper: {
    position: 'relative',
    marginRight: 3,
    zIndex: 1000,
  },
  tooltipBox: {
    position: 'absolute',
    top: 25,
    right: 0,
    left: -60,
    backgroundColor: '#F4F5FA',
    padding: 10,
    borderRadius: 6,
    elevation: 10,
    zIndex: 1000,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 4,
    width: 190,
  },
  tooltipText: {
    fontSize: 12,
    color: '#8F939E',
  },
  label: {
    fontSize: 13,
    color: '#8F939E',
  },
});

export default ToolTip;
