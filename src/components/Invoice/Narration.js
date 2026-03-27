import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, FlatList} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Colors from '../../utils/Colors';

const Narration = () => {
  const payments = [
    {
      id: '1',
      type: 'Sales Revenue',
      date: '11/01/25 | 09:00 AM',
      amount: '₹475,000',
      method: 'Cash',
    },
    {
      id: '2',
      type: 'Sales Revenue',
      date: '11/01/25 | 09:00 AM',
      amount: '₹475,000',
      method: 'Bank transfer',
    },
    {
      id: '3',
      type: 'Sales Revenue',
      date: '11/01/25 | 09:00 AM',
      amount: '₹475,000',
      method: 'Bank transfer',
    },
  ];

  return (
    <View style={styles.container} contentContainerStyle={{paddingBottom: 20}}>
      <Text style={styles.sectionTitle}>Narration</Text>
      <View style={styles.narrationBox}>
        <Text style={styles.narrationText}>
          Sold goods to ABC Enterprises as per Invoice No. 12345 dated
          01/02/2025, including 50 units of product XYZ at the agreed price,
          with applicable taxes and discounts applied. Payment terms as per
          contract.
        </Text>
      </View>

      <Text style={styles.sectionTitle}>Payment History</Text>
      <View style={styles.paymentBox}>
        <FlatList
          data={payments}
          scrollEnabled={false}
          removeClippedSubviews={false}
          keyExtractor={item => item.id}
          renderItem={({item}) => (
            <View style={styles.paymentRow}>
              <View style={styles.arrowContainer}>
                <Feather name="arrow-up-right" size={20} color="#F56359" />
              </View>
              <View style={styles.paymentDetails}>
                <Text style={styles.paymentTitle}>{item.type}</Text>
                <Text style={styles.paymentDate}>{item.date}</Text>
              </View>
              <View style={styles.paymentAmount}>
                <Text style={styles.paymentMethod}>{item.method}</Text>
                <Text style={styles.paymentValue}>{item.amount}</Text>
              </View>
            </View>
          )}
        />
      </View>

      {/* <TouchableOpacity style={styles.button}>
        <FontAwesome name="check-circle" size={18} color="white" />
        <Text style={styles.buttonText}>Mark as paid</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.shareButton}>
        <Feather name="share-2" size={18} color="#6B7280" />
        <Text style={styles.shareText}>Share</Text>
      </TouchableOpacity> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 20,
  },
  narrationBox: {
    backgroundColor: Colors.border,
    padding: 12,
    borderRadius: 10,
    marginBottom: 16,
  },
  narrationText: {
    color: Colors.secondaryText,
    fontSize: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  paymentBox: {
    backgroundColor: Colors.white,
    padding: 12,
    borderRadius: 10,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  paymentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomColor: '#E5E7EB',
  },
  arrowContainer: {
    width: 40,
    height: 40,
    borderRadius: 24,
    backgroundColor: '#F6F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E8EFF6',
  },
  paymentDetails: {
    flex: 1,
    marginLeft: 12,
  },
  paymentTitle: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  paymentDate: {
    fontSize: 12,
    color: Colors.secondaryText,
  },
  paymentAmount: {
    alignItems: 'flex-end',
  },
  paymentMethod: {
    fontSize: 12,
    color: Colors.secondaryText,
  },
  paymentValue: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  // button: {
  //   backgroundColor: '#07624C',
  //   flexDirection: 'row',
  //   alignItems: 'center',
  //   justifyContent: 'center',
  //   paddingVertical: 12,
  //   borderRadius: 8,
  //   marginTop: 10,
  // },
  // buttonText: {
  //   color: Colors.white,
  //   fontSize: 14,
  //   fontWeight: 'bold',
  //   marginLeft: 6,
  // },
  // shareButton: {
  //   flexDirection: 'row',
  //   alignItems: 'center',
  //   justifyContent: 'center',
  //   marginTop: 12,
  //   backgroundColor: '#F7F9FC',
  //   paddingVertical: 12,
  //   borderRadius: 8,
  // },
  // shareText: {
  //   color: Colors.secondaryText,
  //   fontSize: 14,
  //   marginLeft: 6,
  // },
});

export default Narration;
