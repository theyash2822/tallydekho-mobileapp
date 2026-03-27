import React from 'react';
import {View, Text, ScrollView, StyleSheet} from 'react-native';
import {useRoute, useNavigation} from '@react-navigation/native';
import Header from '../components/common/Header';
import Colors from '../utils/Colors';
import Receivables from './SwipableCardsScreens/Receivables';
import Payables from './SwipableCardsScreens/Payables';
import Payments from './SwipableCardsScreens/Payments';
import Receipts from './SwipableCardsScreens/Receipts';
import BankBalance from './SwipableCardsScreens/BankBalance';
import LoansODs from './SwipableCardsScreens/LoansODs';
import CashInHand from './SwipableCardsScreens/CashInHand';

const CashDetailScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const {label, amount, change} = route.params;

  let content = null;
  switch (label) {
    case 'Receivables':
      content = (
        <>
          <Receivables />
        </>
      );
      break;
    case 'Payments':
      content = (
        <>
          <Payments />
        </>
      );
      break;
    case 'Receipts':
      content = (
        <>
          <Receipts />
        </>
      );
      break;
    case 'Payables':
      content = (
        <>
          <Payables />
        </>
      );
      break;
    case 'Bank Balances':
      content = (
        <>
          <BankBalance />
        </>
      );
      break;
    case 'Cash in Hand':
      content = (
        <>
          <CashInHand />
        </>
      );
      break;
    case 'Loans/ODs':
      content = <LoansODs />;
      break;
    default:
      content = <Text>No details available.</Text>;
  }

  const needsScrollView = !['Payments', 'Receipts'].includes(label);

  return (
    <>
      <Header
        title={label}
        leftIcon="chevron-left"
        onLeftPress={() => navigation.goBack()}
      />
      {needsScrollView ? (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>{content}</ScrollView>
      ) : (
        <View style={styles.container}>{content}</View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundColorPrimary,
  },
});

export default CashDetailScreen;
