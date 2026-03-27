// import React from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   Modal,
//   TouchableOpacity,
//   FlatList,
//   TouchableWithoutFeedback,
// } from 'react-native';
// import Feather from 'react-native-vector-icons/Feather';
// import Colors from '../../../../utils/Colors';

// const WarehouseAvailabilityModal = ({visible, onClose, productName}) => {
//   // Dummy data for warehouse availability
//   const warehouseData = [
//     {
//       id: '1',
//       name: 'Volantis Depot',
//       location: 'New Delhi, India',
//       quantity: '333',
//       unit: 'pcs',
//     },
//     {
//       id: '2',
//       name: 'Volantis Depot',
//       location: 'New Delhi, India',
//       quantity: '184',
//       unit: 'pcs',
//     },
//     {
//       id: '3',
//       name: 'Volantis Depot',
//       location: 'New Delhi, India',
//       quantity: '953',
//       unit: 'pcs',
//     },
//     {
//       id: '4',
//       name: 'Volantis Depot',
//       location: 'New Delhi, India',
//       quantity: '758',
//       unit: 'pcs',
//     },
//     {
//       id: '5',
//       name: 'Volantis Depot',
//       location: 'New Delhi, India',
//       quantity: '692',
//       unit: 'pcs',
//     },
//     {
//       id: '6',
//       name: 'Volantis Depot',
//       location: 'New Delhi, India',
//       quantity: '475',
//       unit: 'pcs',
//     },
//     {
//       id: '7',
//       name: 'Volantis Depot',
//       location: 'New Delhi, India',
//       quantity: '819',
//       unit: 'pcs',
//     },
//     {
//       id: '8',
//       name: 'Volantis Depot',
//       location: 'New Delhi, India',
//       quantity: '250',
//       unit: 'pcs',
//     },
//     {
//       id: '9',
//       name: 'Mumbai Central',
//       location: 'Mumbai, India',
//       quantity: '445',
//       unit: 'pcs',
//     },
//     {
//       id: '10',
//       name: 'Bangalore Hub',
//       location: 'Bangalore, India',
//       quantity: '567',
//       unit: 'pcs',
//     },
//     {
//       id: '11',
//       name: 'Chennai Station',
//       location: 'Chennai, India',
//       quantity: '389',
//       unit: 'pcs',
//     },
//   ];

//   const renderWarehouseItem = ({item}) => (
//     <View style={styles.warehouseItem}>
//       <View style={styles.warehouseIcon}>
//         <Feather name="home" size={16} color="#FFF" />
//       </View>
//       <View style={styles.warehouseInfo}>
//         <Text style={styles.warehouseName}>{item.name}</Text>
//         <Text style={styles.warehouseLocation}>{item.location}</Text>
//       </View>
//       <View style={styles.quantityContainer}>
//         <Text style={styles.quantityText}>{item.quantity}</Text>
//         <Text style={styles.quantityText}>{item.unit}</Text>
//       </View>
//     </View>
//   );

//   return (
//     <Modal
//       visible={visible}
//       transparent={true}
//       animationType="slide"
//       onRequestClose={onClose}>
//       <View style={styles.modalOverlay}>
//         <TouchableWithoutFeedback onPress={onClose}>
//           <View style={styles.overlayTouchable} />
//         </TouchableWithoutFeedback>

//         <View style={styles.modalContent}>
//           {/* Header */}
//           <View style={styles.header}>
//             <Text style={styles.headerTitle}>Warehouse Availability</Text>
//             <TouchableOpacity onPress={onClose} style={styles.closeButton}>
//               <Feather name="x" size={24} color="#666" />
//             </TouchableOpacity>
//           </View>

//           <FlatList
//             data={warehouseData}
//             renderItem={renderWarehouseItem}
//             keyExtractor={item => item.id}
//             showsVerticalScrollIndicator={false}
//             contentContainerStyle={styles.listContainer}
//             scrollEventThrottle={16}
//             bounces={false}
//             overScrollMode="never"
//             removeClippedSubviews={false}
//           />
//         </View>
//       </View>
//     </Modal>
//   );
// };

// const styles = StyleSheet.create({
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//     justifyContent: 'flex-end',
//   },
//   overlayTouchable: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//   },
//   modalContent: {
//     backgroundColor: '#F8FBFD',
//     borderTopLeftRadius: 20,
//     borderTopRightRadius: 20,
//     width: '100%',
//     maxHeight: '85%',
//     padding: 10,
//     paddingBottom: 10,
//   },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 12,
//   },
//   headerTitle: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#333',
//   },
//   closeButton: {
//     padding: 4,
//   },
//   listContainer: {
//     paddingBottom: 10,
//   },
//   warehouseItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: 16,
//     paddingHorizontal: 12,
//     backgroundColor: Colors.white,
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: Colors.border,
//     marginBottom: 8,
//   },
//   warehouseIcon: {
//     width: 32,
//     height: 32,
//     borderRadius: 16,
//     backgroundColor: '#16C47F',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 8,
//   },
//   warehouseInfo: {
//     flex: 1,
//   },
//   warehouseName: {
//     fontSize: 12,
//     fontWeight: '600',
//     color: '#333',
//     marginBottom: 2,
//   },
//   warehouseLocation: {
//     fontSize: 10,
//     color: '#667085',
//     fontWeight: '400',
//   },
//   quantityContainer: {
//     flexDirection: 'row',
//     gap: 4,
//   },
//   quantityText: {
//     fontSize: 14,
//     fontWeight: '500',
//     color: '#000000',
//   },
// });

// export default WarehouseAvailabilityModal;

import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  FlatList,
  TouchableWithoutFeedback,
  Animated,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import Colors from '../../../../utils/Colors';

const WarehouseAvailabilityModal = ({ visible, onClose, productName }) => {
  const [isModalVisible, setIsModalVisible] = useState(visible);

  const fadeAnim = useState(new Animated.Value(0))[0];
  const slideAnim = useState(new Animated.Value(300))[0];

  useEffect(() => {
    if (visible) {
      setIsModalVisible(true);
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          tension: 50,
          friction: 10,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 300,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start(() => setIsModalVisible(false));
    }
  }, [visible]);

  const warehouseData = useMemo(
    () => [
      {
        id: '1',
        name: 'Volantis Depot',
        location: 'New Delhi, India',
        quantity: '333',
        unit: 'pcs',
      },
      {
        id: '2',
        name: 'Volantis Depot',
        location: 'New Delhi, India',
        quantity: '184',
        unit: 'pcs',
      },
      {
        id: '3',
        name: 'Volantis Depot',
        location: 'New Delhi, India',
        quantity: '953',
        unit: 'pcs',
      },
      {
        id: '4',
        name: 'Volantis Depot',
        location: 'New Delhi, India',
        quantity: '758',
        unit: 'pcs',
      },
      {
        id: '5',
        name: 'Volantis Depot',
        location: 'New Delhi, India',
        quantity: '692',
        unit: 'pcs',
      },
      {
        id: '6',
        name: 'Volantis Depot',
        location: 'New Delhi, India',
        quantity: '475',
        unit: 'pcs',
      },
      {
        id: '7',
        name: 'Volantis Depot',
        location: 'New Delhi, India',
        quantity: '819',
        unit: 'pcs',
      },
    ],
    [],
  );

  const renderWarehouseItem = ({ item }) => (
    <View style={styles.warehouseItem}>
      <View style={styles.warehouseIcon}>
        <Feather name="home" size={16} color="#FFF" />
      </View>
      <View style={styles.warehouseInfo}>
        <Text style={styles.warehouseName}>{item.name}</Text>
        <Text style={styles.warehouseLocation}>{item.location}</Text>
      </View>
      <View style={styles.quantityContainer}>
        <Text style={styles.quantityText}>{item.quantity}</Text>
        <Text style={styles.quantityText}>{item.unit}</Text>
      </View>
    </View>
  );

  return (
    <Modal visible={isModalVisible} transparent animationType="none">
      <TouchableWithoutFeedback onPress={onClose}>
        <Animated.View style={[styles.modalOverlay, { opacity: fadeAnim }]}>
          <TouchableWithoutFeedback>
            <Animated.View
              style={[
                styles.modalContent,
                { transform: [{ translateY: slideAnim }] },
              ]}>
              {/* Header */}
              <View style={styles.header}>
                <Text style={styles.headerTitle}>Warehouse Availability</Text>
                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                  <Feather name="x" size={24} color="#666" />
                </TouchableOpacity>
              </View>

              <FlatList
                data={warehouseData}
                renderItem={renderWarehouseItem}
                keyExtractor={item => item.id}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.listContainer}
                maxToRenderPerBatch={8}
                updateCellsBatchingPeriod={50}
                initialNumToRender={8}
                scrollEnabled={true}
                nestedScrollEnabled={true}
              />
            </Animated.View>
          </TouchableWithoutFeedback>
        </Animated.View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.backgroundColorPrimary,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    width: '100%',
    maxHeight: '83%',
    padding: 10,
    paddingBottom: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  closeButton: {
    padding: 4,
  },
  listContainer: { paddingBottom: 10 },
  warehouseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 12,
    backgroundColor: Colors.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 8,
  },
  warehouseIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#16C47F',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  warehouseInfo: { flex: 1 },
  warehouseName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  warehouseLocation: {
    fontSize: 10,
    color: '#667085',
    fontWeight: '400',
  },
  quantityContainer: { flexDirection: 'row', gap: 4 },
  quantityText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000',
  },
});

export default WarehouseAvailabilityModal;
