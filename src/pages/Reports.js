import React from 'react';
import {View, ScrollView, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Header from '../components/common/Header';
import {
  FinancialCard,
  ComplianceCard,
  AuditTrailCard,
  AIInsightsCard,
} from '../components/reports';
import Colors from '../utils/Colors';

const Reports = () => {
  const navigation = useNavigation();

  const cards = [
    {Component: FinancialCard, route: 'financial'},
    {Component: ComplianceCard, route: 'Compliance'},
    {Component: AuditTrailCard, route: 'audittrail'},
    {Component: AIInsightsCard, route: 'aiinsights'},
  ];

  return (
    <View style={styles.container}>
      <Header title="Reports Dashboard" />
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}>
        <View style={styles.cardsContainer}>
          {cards.map(({Component, route}, index) => (
            <Component key={index} onPress={() => navigation.navigate(route)} />
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundColorPrimary,
  },
  scrollView: {
    flex: 1,
  },
  cardsContainer: {
    paddingHorizontal: 12,
    paddingTop: 12,
  },
});

export default Reports;
