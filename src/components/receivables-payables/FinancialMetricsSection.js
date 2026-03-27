import React from 'react';
import {View, StyleSheet} from 'react-native';
import SwipeableCards from '../common/SwipeableCards';

const FinancialMetricsSection = ({cards, onCardPress}) => {
  return (
    <View style={styles.totalDueContainer}>
      <SwipeableCards
        cards={cards}
        showPercentage={true}
        onCardPress={onCardPress}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  totalDueContainer: {
    borderRadius: 12,
    overflow: 'hidden',
  },
});

export default FinancialMetricsSection;
