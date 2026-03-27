import React from 'react';
import {View, StyleSheet, Text, Dimensions, ScrollView} from 'react-native';

const {width} = Dimensions.get('window');
const CARD_WIDTH = width * 0.85;
const CARD_SPACING = 16;

const LoanCard = ({loan = {}}) => {
  const renderLoanCard = (loanItem, index) => (
    <View
      key={loanItem.id}
      style={[
        styles.loanCard,
        {
          backgroundColor: loanItem.color || '#10B981',
          marginRight: index === loan.length - 1 ? 0 : CARD_SPACING,
        },
      ]}>
      <View style={styles.loanCardHeader}>
        <View style={styles.loanInfo}>
          <View style={styles.bankIcon} />
          <Text style={styles.loanName}>{loanItem.loanName}</Text>
        </View>
        <Text style={styles.maturityDate}>
          Maturity: {loanItem.maturityDate}
        </Text>
      </View>

      <View style={styles.loanMetrics}>
        <View style={styles.metricItem}>
          <Text style={styles.metricLabel}>Principal</Text>
          <Text style={styles.metricValue}>{loanItem.principal}</Text>
        </View>
        <View style={styles.metricItem}>
          <Text style={styles.metricLabel}>Rate</Text>
          <Text style={styles.metricValue}>{loanItem.rate}</Text>
        </View>
        <View style={styles.metricItem}>
          <Text style={styles.metricLabel}>EMIs</Text>
          <Text style={styles.metricValue}>{loanItem.emi}</Text>
        </View>
      </View>
    </View>
  );

  if (!loan || loan.length === 0) {
    return null;
  }

  return (
    <View style={styles.loanCardsSection}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.loanCardsContainer}
        snapToInterval={CARD_WIDTH + CARD_SPACING}
        decelerationRate="fast"
        snapToAlignment="start">
        {loan.map((loanItem, index) => renderLoanCard(loanItem, index))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  loanCardsSection: {
    paddingLeft: 18,
    borderRadius: 20,
    marginBottom: 12,
  },
  loanCardsContainer: {
    paddingRight: 14,
  },
  loanCard: {
    width: CARD_WIDTH,
    height: 155,
    borderRadius: 16,
    padding: 12,
    backgroundColor: '#10B981',
    justifyContent: 'space-between',
  },
  loanCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  loanInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  // bankIcon: {
  //   width: 20,
  //   height: 20,
  //   backgroundColor: '#fff',
  //   borderRadius: 10,
  //   marginRight: 8,
  // },
  loanName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  maturityDate: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
  },
  loanMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  metricItem: {},
  metricLabel: {
    fontSize: 12,
    color: '#fff',
    opacity: 0.8,
  },
  metricValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
  },
});

export default LoanCard;
