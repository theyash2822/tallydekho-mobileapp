// import React from 'react';
// import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
// import {useNavigation} from '@react-navigation/native';
// import Feather from 'react-native-vector-icons/Feather';
// import Colors from '../../utils/Colors';
// import {Icons} from '../../utils/Icons';

// const FinancialMetricsCards = ({onCardPress}) => {
//   const navigation = useNavigation();

//   const metrics = [
//     {
//       id: 1,
//       title: 'Sales',
//       value: '₹130.00',
//       percentage: '5.1%',
//       icon: Icons.GraphUp,
//       iconColor: '#6F7C97',
//       backgroundColor: '#fff',
//       screen: 'sales',
//     },

//     {
//       id: 2,
//       title: 'Purchases',
//       value: '₹130.00',
//       percentage: '8.7%',
//       icon: Icons.Purchases,
//       iconColor: '#6F7C97',
//       backgroundColor: '#fff',
//       screen: 'purchases',
//     },
//     {
//       id: 3,
//       title: 'Expenses',
//       value: '₹130.00',
//       percentage: '12%',
//       icon: 'arrow-up-right',
//       iconColor: '#6F7C97',
//       backgroundColor: '#fff',
//       screen: 'expenses',
//     },
//   ];

//   const handleCardPress = metric => {
//     if (onCardPress) {
//       onCardPress(metric);
//     } else {
//       // Default navigation if no custom handler provided
//       navigation.navigate(metric.screen);
//     }
//     console.log(`Navigating to ${metric.screen}`);
//   };

//   return (
//     <View style={styles.container}>
//       <View style={{padding: 12}}>
//         {metrics.map((metric, index) => (
//           <TouchableOpacity
//             key={metric.id}
//             style={[
//               styles.card,
//               index === metrics.length - 1 && styles.lastCard,
//             ]}
//             onPress={() => handleCardPress(metric)}
//             activeOpacity={0.7}>
//             {/* Left Section - Icon */}
//             <View
//               style={[
//                 styles.iconContainer,
//                 {backgroundColor: metric.backgroundColor},
//               ]}>
//               {typeof metric.icon === 'string' ? (
//                 <Feather
//                   name={metric.icon}
//                   size={20}
//                   color={metric.iconColor}
//                 />
//               ) : metric.icon === Icons.GraphUp ? (
//                 <metric.icon width={15} height={16} />
//               ) : metric.icon === Icons.Purchases ? (
//                 <metric.icon width={20} height={20} />
//               ) : (
//                 <metric.icon width={22} height={22} />
//               )}
//             </View>

//             {/* Center Section - Title */}
//             <View style={styles.titleContainer}>
//               <Text style={styles.titleText}>{metric.title}</Text>
//             </View>

//             {/* Right Section - Value and Percentage in same row */}
//             <View style={styles.rightSection}>
//               <Text style={styles.valueText}>{metric.value}</Text>
//               <View
//                 style={[
//                   styles.percentageContainer,
//                   {
//                     backgroundColor: metric.percentage.startsWith('-')
//                       ? '#FEE2E2' // light red background
//                       : '#ECFDF5', // light green background
//                     borderColor: metric.percentage.startsWith('-')
//                       ? '#FCA5A5' // red border
//                       : '#D1FAE7', // green border
//                   },
//                 ]}>
//                 <Feather
//                   name={
//                     metric.percentage.startsWith('-')
//                       ? 'trending-down'
//                       : 'trending-up'
//                   }
//                   size={12}
//                   color={
//                     metric.percentage.startsWith('-') ? '#EF4444' : '#06A748'
//                   }
//                 />
//                 <Text
//                   style={[
//                     styles.percentageText,
//                     {
//                       color: metric.percentage.startsWith('-')
//                         ? '#EF4444'
//                         : '#06A748',
//                     },
//                   ]}>
//                   {metric.percentage}
//                 </Text>
//               </View>
//             </View>
//           </TouchableOpacity>
//         ))}
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     backgroundColor: '#fff',
//     borderRadius: 10,
//     borderWidth: 1,
//     borderColor: Colors.border,
//   },
//   card: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: Colors.white,
//     borderRadius: 12,
//     padding: 12,
//     marginBottom: 12,
//     borderWidth: 1,
//     borderColor: Colors.border,
//     justifyContent: 'space-between',
//   },
//   lastCard: {
//     marginBottom: 0,
//   },
//   iconContainer: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 16,
//     borderWidth: 1,
//     borderColor: Colors.border,
//   },
//   titleContainer: {
//     flex: 1,
//     marginRight: 16,
//   },
//   titleText: {
//     fontSize: 14,
//     fontWeight: '500',
//     color: '#111111',
//   },
//   rightSection: {
//     alignItems: 'flex-end',
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 12,
//   },
//   valueText: {
//     fontSize: 16,
//     fontWeight: '500',
//     color: '#494D58',
//   },
//   percentageContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//     borderRadius: 12,
//     gap: 4,
//     borderWidth: 1,
//   },
//   percentageText: {
//     fontSize: 12,
//     fontWeight: '600',
//   },
// });

// export default FinancialMetricsCards;

import React, {useRef} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Feather from 'react-native-vector-icons/Feather';
import Colors from '../../utils/Colors';
import {Icons} from '../../utils/Icons';

const FinancialMetricsCards = ({onCardPress, selectedRange}) => {
  const navigation = useNavigation();
  const isNavigatingRef = useRef(false);

  // Static Demo Data Based on Selected Range
  const metricsData = {
    '7D': [
      {
        id: 1,
        title: 'Sales',
        value: '₹120.00',
        percentage: '4.1%',
        screen: 'sales',
        icon: Icons.GraphUp,
        iconColor: '#6F7C97',
        backgroundColor: '#fff',
      },
      {
        id: 2,
        title: 'Purchases',
        value: '₹80.00',
        percentage: '-2.3%',
        screen: 'purchases',
        icon: Icons.Purchases,
        iconColor: '#6F7C97',
        backgroundColor: '#fff',
      },
      {
        id: 3,
        title: 'Expenses',
        value: '₹45.00',
        percentage: '1.6%',
        screen: 'expenses',
        icon: 'arrow-up-right',
        iconColor: '#6F7C97',
        backgroundColor: '#fff',
      },
    ],
    '1M': [
      {
        id: 1,
        title: 'Sales',
        value: '₹4,300.00',
        percentage: '8.2%',
        screen: 'sales',
        icon: Icons.GraphUp,
        iconColor: '#6F7C97',
        backgroundColor: '#fff',
      },
      {
        id: 2,
        title: 'Purchases',
        value: '₹2,700.00',
        percentage: '-3.5%',
        screen: 'purchases',
        icon: Icons.Purchases,
        iconColor: '#6F7C97',
        backgroundColor: '#fff',
      },
      {
        id: 3,
        title: 'Expenses',
        value: '₹1,900.00',
        percentage: '6%',
        screen: 'expenses',
        icon: 'arrow-up-right',
        iconColor: '#6F7C97',
        backgroundColor: '#fff',
      },
    ],
    '3M': [
      {
        id: 1,
        title: 'Sales',
        value: '₹12,400.00',
        percentage: '12.1%',
        screen: 'sales',
        icon: Icons.GraphUp,
        iconColor: '#6F7C97',
        backgroundColor: '#fff',
      },
      {
        id: 2,
        title: 'Purchases',
        value: '₹8,900.00',
        percentage: '2.7%',
        screen: 'purchases',
        icon: Icons.Purchases,
        iconColor: '#6F7C97',
        backgroundColor: '#fff',
      },
      {
        id: 3,
        title: 'Expenses',
        value: '₹6,300.00',
        percentage: '-1.1%',
        screen: 'expenses',
        icon: 'arrow-up-right',
        iconColor: '#6F7C97',
        backgroundColor: '#fff',
      },
    ],
    '6M': [
      {
        id: 1,
        title: 'Sales',
        value: '₹25,600.00',
        percentage: '22.4%',
        screen: 'sales',
        icon: Icons.GraphUp,
        iconColor: '#6F7C97',
        backgroundColor: '#fff',
      },
      {
        id: 2,
        title: 'Purchases',
        value: '₹18,900.00',
        percentage: '15.2%',
        screen: 'purchases',
        icon: Icons.Purchases,
        iconColor: '#6F7C97',
        backgroundColor: '#fff',
      },
      {
        id: 3,
        title: 'Expenses',
        value: '₹12,700.00',
        percentage: '3.4%',
        screen: 'expenses',
        icon: 'arrow-up-right',
        iconColor: '#6F7C97',
        backgroundColor: '#fff',
      },
    ],
  };

  // Pick correct metrics based on selectedRange
  const metrics = metricsData[selectedRange] || metricsData['7D'];
  const handleCardPress = metric => {
    // Prevent multiple simultaneous navigations
    if (isNavigatingRef.current) {
      return;
    }

    // Set flag to prevent other navigations
    isNavigatingRef.current = true;

    if (onCardPress) {
      onCardPress(metric);
    } else {
      // Default navigation if no custom handler provided
      navigation.navigate(metric.screen);
    }
    console.log(`Navigating to ${metric.screen}`);

    // Reset flag after navigation completes (allow new navigation after 500ms)
    setTimeout(() => {
      isNavigatingRef.current = false;
    }, 500);
  };

  return (
    <View style={styles.container}>
      <View style={{padding: 12}}>
        {metrics.map((metric, index) => (
          <TouchableOpacity
            key={metric.id}
            style={[
              styles.card,
              index === metrics.length - 1 && styles.lastCard,
            ]}
            onPress={() => handleCardPress(metric)}
            activeOpacity={0.7}>
            {/* Left Section - Icon */}
            <View
              style={[
                styles.iconContainer,
                {backgroundColor: metric.backgroundColor},
              ]}>
              {typeof metric.icon === 'string' ? (
                <Feather
                  name={metric.icon}
                  size={20}
                  color={metric.iconColor}
                />
              ) : metric.icon === Icons.GraphUp ? (
                <metric.icon width={15} height={16} />
              ) : metric.icon === Icons.Purchases ? (
                <metric.icon width={20} height={20} />
              ) : (
                <metric.icon width={22} height={22} />
              )}
            </View>

            {/* Center Section - Title */}
            <View style={styles.titleContainer}>
              <Text style={styles.titleText}>{metric.title}</Text>
            </View>

            {/* Right Section - Value and Percentage in same row */}
            <View style={styles.rightSection}>
              <Text style={styles.valueText}>{metric.value}</Text>
              <View
                style={[
                  styles.percentageContainer,
                  {
                    backgroundColor: metric.percentage.startsWith('-')
                      ? '#FEE2E2' // light red background
                      : '#ECFDF5', // light green background
                    borderColor: metric.percentage.startsWith('-')
                      ? '#FCA5A5' // red border
                      : '#D1FAE7', // green border
                  },
                ]}>
                <Feather
                  name={
                    metric.percentage.startsWith('-')
                      ? 'trending-down'
                      : 'trending-up'
                  }
                  size={12}
                  color={
                    metric.percentage.startsWith('-') ? '#EF4444' : '#06A748'
                  }
                />
                <Text
                  style={[
                    styles.percentageText,
                    {
                      color: metric.percentage.startsWith('-')
                        ? '#EF4444'
                        : '#06A748',
                    },
                  ]}>
                  {metric.percentage}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    justifyContent: 'space-between',
  },
  lastCard: {
    marginBottom: 0,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  titleContainer: {
    flex: 1,
    marginRight: 16,
  },
  titleText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111111',
  },
  rightSection: {
    alignItems: 'flex-end',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  valueText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#494D58',
  },
  percentageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
    borderWidth: 1,
  },
  percentageText: {
    fontSize: 12,
    fontWeight: '600',
  },
});

export default FinancialMetricsCards;
