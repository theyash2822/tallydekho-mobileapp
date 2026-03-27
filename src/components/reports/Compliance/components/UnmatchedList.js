import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import Colors from '../../../../utils/Colors';
import Header from '../../../common/Header';
import {CustomBottomButton} from '../../../common';

const UnmatchedList = () => {
  const navigation = useNavigation();
  const [selectedItems, setSelectedItems] = useState([]); // <-- selected transactions

  const unmatchedTransactions = [
    {
      id: 1,
      transactionId: 'XYD-0909A',
      type: 'Sales',
      companyName: 'Netaji Industries',
      date: '25 July 2025',
      amount: '₹360,000',
      errorType: 'HSN error',
    },
    {
      id: 2,
      transactionId: 'XYD-0908B',
      type: 'Sales',
      companyName: 'ABC Corporation',
      date: '24 July 2025',
      amount: '₹280,000',
      errorType: 'HSN error',
    },
    {
      id: 3,
      transactionId: 'XYD-0907C',
      type: 'Sales',
      companyName: 'XYZ Limited',
      date: '23 July 2025',
      amount: '₹195,000',
      errorType: 'HSN error',
    },
    {
      id: 4,
      transactionId: 'XYD-0906D',
      type: 'Sales',
      companyName: 'Tech Solutions Ltd',
      date: '22 July 2025',
      amount: '₹420,000',
      errorType: 'HSN error',
    },
    {
      id: 5,
      transactionId: 'XYD-0905E',
      type: 'Sales',
      companyName: 'Global Industries',
      date: '21 July 2025',
      amount: '₹180,000',
      errorType: 'HSN error',
    },
    {
      id: 6,
      transactionId: 'XYD-0904F',
      type: 'Sales',
      companyName: 'Prime Services',
      date: '20 July 2025',
      amount: '₹320,000',
      errorType: 'HSN error',
    },
    {
      id: 7,
      transactionId: 'XYD-0903G',
      type: 'Sales',
      companyName: 'Innovation Corp',
      date: '19 July 2025',
      amount: '₹275,000',
      errorType: 'HSN error',
    },
    {
      id: 8,
      transactionId: 'XYD-0902H',
      type: 'Sales',
      companyName: 'Future Enterprises',
      date: '18 July 2025',
      amount: '₹450,000',
      errorType: 'HSN error',
    },
  ];

  // Toggle selection
  const toggleSelection = id => {
    setSelectedItems(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id],
    );
  };

  return (
    <>
      <Header title={'Unmatched List'} leftIcon={'chevron-left'} />

      <View style={styles.container}>
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={true}>
          <View style={styles.transactionsList}>
            {unmatchedTransactions.map(transaction => {
              const isSelected = selectedItems.includes(transaction.id);
              return (
                <TouchableOpacity
                  key={transaction.id}
                  activeOpacity={0.8}
                  onPress={() => toggleSelection(transaction.id)}
                  onLongPress={() => toggleSelection(transaction.id)}
                  style={[
                    styles.transactionCard,
                    isSelected && {borderColor: '#16C47F', borderWidth: 1},
                  ]}>
                  {/* Top Header Section */}
                  <View style={styles.cardHeader}>
                    <View style={styles.errorIndicator}>
                      <View style={styles.errorDot} />
                      <Text style={styles.errorType}>
                        {transaction.errorType}
                      </Text>
                    </View>
                    <Text style={styles.transactionId}>
                      {transaction.transactionId}
                    </Text>
                    <View style={styles.headerDot} />
                    <Text style={styles.transactionType}>
                      {transaction.type}
                    </Text>
                  </View>

                  {/* Main Content Section */}
                  <View style={styles.cardContent}>
                    <View style={styles.iconContainer}>
                      <Ionicons name="warning" size={16} color="#EF4444" />
                    </View>

                    <View style={styles.textBlock}>
                      <Text style={styles.companyName}>
                        {transaction.companyName}
                      </Text>
                      <Text style={styles.transactionDate}>
                        {transaction.date}
                      </Text>
                    </View>

                    <Text style={styles.transactionAmount}>
                      {transaction.amount}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>

        {/* Bottom Share PDF Button */}
        {selectedItems.length > 0 && (
          <CustomBottomButton buttonText="Share PDF / XLS" />
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F5FA',
  },
  scrollView: {
    flex: 1,
    padding: 12,
  },
  transactionsList: {
    gap: 10,
    paddingBottom: 20, // extra space for bottom button
  },
  transactionCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  errorIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
    backgroundColor: '#FEF2F2',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  errorDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#EF4444',
    marginRight: 4,
  },
  errorType: {
    fontSize: 12,
    color: '#EF4444',
    fontWeight: '500',
  },
  transactionId: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '400',
  },
  headerDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: '#9CA3AF',
    marginHorizontal: 6,
  },
  transactionType: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '400',
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    marginRight: 12,
    backgroundColor: '#F4F5FA',
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textBlock: {
    flex: 1,
  },
  companyName: {
    fontSize: 14,
    color: '#1F2937',
    fontWeight: '500',
    marginBottom: 2,
  },
  transactionDate: {
    fontSize: 12,
    color: '#667085',
    fontWeight: '400',
  },
  transactionAmount: {
    fontSize: 14,
    color: '#000000',
    fontWeight: '600',
  },
});

export default UnmatchedList;
