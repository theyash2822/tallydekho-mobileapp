import React from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Header from '../components/common/Header';
import StockOverview from '../components/stocksManagement/StockOverview';
import StockActions from '../components/stocksManagement/StockActions';
import Colors from '../utils/Colors';

const StocksManagement = () => {
  const navigation = useNavigation();

  return (
    <>
      <Header
        title="Stock Dashboard"
        leftIcon="chevron-left"
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.container}
        contentContainerStyle={styles.contentContainer}>
        <StockActions />
        <StockOverview />
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundColorPrimary,
  },
  contentContainer: {
    paddingHorizontal: 8,
    paddingTop: 10,
  },
});

export default StocksManagement;
