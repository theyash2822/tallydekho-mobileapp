import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Colors from '../../utils/Colors';

const Dummy = () => {
  const navigation = useNavigation();

  const navigateToVoucher = type => {
    navigation.navigate('vouchers', {type});
  };

  const navigateToInvoice = type => {
    navigation.navigate('invoices', {type});
  };

  const navigateToNote = type => {
    navigation.navigate('notes', {type});
  };

  const navigateToOrder = type => {
    navigation.navigate('orders', {type});
  };

  const navigateToQuotation = () => {
    navigation.navigate('quotations');
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Voucher Types</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigateToVoucher('payment')}>
        <Text style={styles.buttonText}>Payment Voucher</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigateToVoucher('receipt')}>
        <Text style={styles.buttonText}>Receipt Voucher</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigateToVoucher('contra')}>
        <Text style={styles.buttonText}>Contra Voucher</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigateToVoucher('journal')}>
        <Text style={styles.buttonText}>Journal Voucher</Text>
      </TouchableOpacity>

      <View style={styles.separator} />

      <Text style={styles.subtitle}>Invoice Types</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigateToInvoice('sales')}>
        <Text style={styles.buttonText}>Sales Invoice</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigateToInvoice('purchase')}>
        <Text style={styles.buttonText}>Purchase Invoice</Text>
      </TouchableOpacity>

      <View style={styles.separator} />

      <Text style={styles.subtitle}>Note Types</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigateToNote('credit')}>
        <Text style={styles.buttonText}>Credit Note</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigateToNote('debit')}>
        <Text style={styles.buttonText}>Debit Note</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigateToNote('delivery')}>
        <Text style={styles.buttonText}>Delivery Note</Text>
      </TouchableOpacity>

      <View style={styles.separator} />

      <Text style={styles.subtitle}>Order Types</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigateToOrder('sales')}>
        <Text style={styles.buttonText}>Sales Order</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigateToOrder('purchase')}>
        <Text style={styles.buttonText}>Purchase Order</Text>
      </TouchableOpacity>

      <View style={styles.separator} />

      <Text style={styles.subtitle}>Quotation</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigateToQuotation()}>
        <Text style={styles.buttonText}>Quotation</Text>
      </TouchableOpacity>

      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>
          Tap any button above to navigate to the corresponding voucher,
          invoice, note, order, or quotation type
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundColorPrimary,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 30,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#374151',
    textAlign: 'center',
    marginBottom: 20,
    marginTop: 10,
  },
  button: {
    backgroundColor: Colors.primary || '#0A8F52',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  separator: {
    height: 1,
    backgroundColor: Colors.border || '#E5E7EB',
    marginVertical: 20,
  },
  infoContainer: {
    marginTop: 30,
    padding: 16,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    paddingBottom: 50,
  },
  infoText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default Dummy;
