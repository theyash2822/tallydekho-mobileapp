// import React from 'react';
// import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
// import {useNavigation} from '@react-navigation/native';
// import Feather from 'react-native-vector-icons/Feather';
// import Colors from '../../utils/Colors';

// // Action Button Component
// const ActionButton = ({icon, title, onPress}) => (
//   <TouchableOpacity
//     style={styles.actionButton}
//     onPress={onPress}
//     activeOpacity={0.7}>
//     <View style={styles.iconContainer}>
//       <Feather name={icon} size={24} color="#16C47F" />
//     </View>
//     <Text style={styles.actionTitle}>{title}</Text>
//   </TouchableOpacity>
// );

// const StockActions = () => {
//   const navigation = useNavigation();

//   // Config for all actions
//   const actions = [
//     {icon: 'bar-chart-2', title: 'Report', route: 'stockReports'},
//     {icon: 'sliders', title: 'Stock Settings', route: 'stockSettings'},
//     {icon: 'maximize-2', title: 'Barcode', route: 'stockBarcode'},
//   ];

//   return (
//     <View style={styles.container}>
//       <View style={styles.actionsGrid}>
//         {actions.map((action, idx) => (
//           <ActionButton
//             key={idx}
//             icon={action.icon}
//             title={action.title}
//             onPress={() => navigation.navigate(action.route)}
//           />
//         ))}
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     backgroundColor: Colors.white,
//     borderRadius: 10,
//     padding: 8,
//   },
//   actionsGrid: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     gap: 8,
//   },
//   actionButton: {
//     flex: 1,
//     alignItems: 'center',
//     padding: 16,
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: Colors.border,
//   },
//   iconContainer: {
//     width: 48,
//     height: 48,
//     borderRadius: 24,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: 8,
//     backgroundColor: Colors.white,
//     borderWidth: 1,
//     borderColor: Colors.border,
//   },
//   actionTitle: {
//     fontSize: 12,
//     fontWeight: '500',
//     color: '#666',
//     textAlign: 'center',
//   },
// });

// export default StockActions;

import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Colors from '../../utils/Colors';
import {Icons} from '../../utils/Icons';

// Action Button Component
const ActionButton = ({IconComponent, title, onPress}) => (
  <TouchableOpacity
    style={styles.actionButton}
    onPress={onPress}
    activeOpacity={0.7}>
    <View style={styles.iconContainer}>
      <IconComponent width={24} height={24} />
    </View>
    <Text style={styles.actionTitle}>{title}</Text>
  </TouchableOpacity>
);

const StockActions = () => {
  const navigation = useNavigation();

  const actions = [
    {Icon: Icons.Report, title: 'Report', route: 'stockReports'},
    {Icon: Icons.Settings, title: 'Stock Settings', route: 'stockSettings'},
    {Icon: Icons.Barcode, title: 'Barcode', route: 'stockBarcode'},
  ];

  return (
    <View style={styles.container}>
      <View style={styles.actionsGrid}>
        {actions.map((action, idx) => (
          <ActionButton
            key={idx}
            IconComponent={action.Icon}
            title={action.title}
            onPress={() => navigation.navigate(action.route)}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    borderRadius: 10,
    padding: 8,
  },
  actionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  actionTitle: {
    fontSize: 12,
    fontWeight: '500',
    color: '#666',
    textAlign: 'center',
  },
});

export default StockActions;
