import React, {useState} from 'react';
import {View, ScrollView, StyleSheet, Text, Dimensions} from 'react-native';

const {width} = Dimensions.get('window');
const CARD_WIDTH = width * 0.85;
const CARD_SPACING = 16;

const BankAccountCards = ({bankAccounts = [], onBankChange}) => {
  const [activeBankIndex, setActiveBankIndex] = useState(0);

  const renderBankAccountCard = (bankAccount, index) => (
    <View
      key={bankAccount.id}
      style={[
        styles.bankCard,
        {
          backgroundColor: bankAccount.gradient[0],
          marginRight: index === bankAccounts.length - 1 ? 0 : CARD_SPACING,
        },
      ]}>
      <View style={styles.bankCardHeader}>
        <Text style={styles.bankName}>{bankAccount.bankName}</Text>
        <View style={styles.accountSeparator} />
        <Text style={styles.accountNumber}>{bankAccount.accountNumber}</Text>
      </View>

      <View style={styles.bankCardContent}>
        <Text style={styles.balanceLabel}>Balance</Text>
        <View style={styles.balanceRow}>
          <Text style={styles.balanceAmount}>{bankAccount.balance}</Text>
          <Text style={styles.lastFeedText}>
            Last feed {bankAccount.lastFeed}
          </Text>
        </View>
      </View>
    </View>
  );

  const handleScroll = event => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / (CARD_WIDTH + CARD_SPACING));
    const newIndex = Math.max(0, Math.min(index, bankAccounts.length - 1));
    setActiveBankIndex(newIndex);

    // Notify parent component about bank change
    if (onBankChange && newIndex !== activeBankIndex) {
      onBankChange(newIndex, bankAccounts[newIndex]);
    }
  };

  if (!bankAccounts || bankAccounts.length === 0) {
    return null;
  }

  return (
    <View style={styles.bankAccountsSection}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.bankCardsContainer}
        snapToInterval={CARD_WIDTH + CARD_SPACING}
        decelerationRate="fast"
        snapToAlignment="start"
        onScroll={handleScroll}
        scrollEventThrottle={16}>
        {bankAccounts.map((bankAccount, index) =>
          renderBankAccountCard(bankAccount, index),
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  bankAccountsSection: {
    paddingLeft: 18,
    borderRadius: 20,
    marginBottom: 12,
  },
  bankCardsContainer: {
    paddingRight: 14,
  },
  bankCard: {
    width: CARD_WIDTH,
    height: 155,
    borderRadius: 16,
    padding: 12,
    justifyContent: 'space-between',
  },
  bankCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  bankName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  accountSeparator: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#fff',
    marginHorizontal: 8,
    opacity: 0.7,
  },
  accountNumber: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.8,
  },
  bankCardContent: {
    justifyContent: 'center',
  },
  balanceLabel: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.8,
    marginBottom: 8,
  },
  balanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  balanceAmount: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
  },
  lastFeedText: {
    fontSize: 12,
    color: '#fff',
    opacity: 0.7,
    textAlign: 'right',
    flexShrink: 0,
  },
});

export default BankAccountCards;
