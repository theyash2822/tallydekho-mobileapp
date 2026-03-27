import React from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import Colors from '../../utils/Colors';
import QuotationStyles from './css/QuotationStyles';

const TermsAndConditions = () => {
  const terms = [
    'Installation cost will be extra.',
    'Delivery within 7 business days from order confirmation.',
    'Final freight will be confirmed at invoicing.',
    'Loading/Unloading will be taken care by party.',
  ];

  return (
    <ScrollView contentContainerStyle={QuotationStyles.scrollContainer}>
      <Text style={QuotationStyles.title}>Terms & Conditions</Text>
      <Text style={QuotationStyles.subtitle}>Predefined T&C (Optional)</Text>

      {terms.map((item, index) => (
        <View key={index} style={QuotationStyles.termBox}>
          <Text style={QuotationStyles.termText}>
            {index + 1}. {item}
          </Text>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  // All styles moved to QuotationStyles.js
});

export default TermsAndConditions;
