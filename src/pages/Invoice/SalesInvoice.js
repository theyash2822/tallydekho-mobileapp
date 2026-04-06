import React, {useRef, useState} from 'react';
import {ScrollView, View, Alert} from 'react-native';
import Header from '../../components/common/Header';
import AddSection from '../../components/Sales-purchaseInvoice/AddSection';
import Summary from '../../components/Sales-purchaseInvoice/Summary';
import SalesInvoiceInfo from '../../components/Sales-purchaseInvoice/SalesInvoiceInfo';
import PaymentCollection from '../../components/Sales-purchaseInvoice/PaymentCollection';
import BottomArea from '../../components/common/BottomArea';
import {commonScreenStyles} from './ScreenStyles';
import {tallyWriteAPI} from '../../services/api/apiService';
import {useAuth} from '../../context/AuthContext';

const SalesInvoiceScreen = ({navigation}) => {
  const scrollViewRef = useRef(null);
  const summaryRef = useRef(null);
  const customerRef = useRef(null);
  const invoiceInfoRef = useRef(null);
  const [products, setProducts] = useState([]);
  const [logistics, setLogistics] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const {selectedCompany} = useAuth();

  const handleSummaryExpand = () => {
    setTimeout(() => {
      summaryRef.current?.measure((x, y, width, height, pageX, pageY) => {
        scrollViewRef.current?.scrollTo({y: y - 20, animated: true});
      });
    }, 200);
  };

  const handleSubmit = async (isOptional = false) => {
    const isValid = customerRef.current?.validate?.();
    if (isValid === false) {
      Alert.alert('Validation Error', 'Please enter a valid customer');
      return;
    }
    if (!products.length) {
      Alert.alert('Validation Error', 'Please add at least one product');
      return;
    }
    if (!selectedCompany) {
      Alert.alert('Error', 'No company selected');
      return;
    }

    const infoData = invoiceInfoRef.current?.getFormData?.() || {};
    const partyLedger = infoData.partyLedger || infoData.customer || '';
    if (!partyLedger) {
      Alert.alert('Validation Error', 'Please select a customer');
      return;
    }

    const items = products.map(p => ({
      itemName: p.name || p.stockItem || '',
      billedQty: parseFloat(p.qty?.replace?.(/[^\d.]/g, '') || p.qty || 1),
      rate: parseFloat(p.unitPrice?.replace?.(/[^\d.]/g, '') || p.rate || 0),
      amount: parseFloat(p.total?.replace?.(/[^\d.]/g, '') || p.amount || 0),
      godown: '',
      taxLedger: 'Output GST 18%',
      taxPercent: 18,
    }));

    setSubmitting(true);
    try {
      const result = await tallyWriteAPI.createSalesInvoice({
        companyGuid: selectedCompany.guid || selectedCompany.id,
        companyName: selectedCompany.name,
        date: infoData.date?.replace(/-/g, '') || new Date().toISOString().slice(0,10).replace(/-/g,''),
        partyLedger,
        salesLedger: infoData.salesLedger || 'Sales Accounts',
        items,
        narration: infoData.narration || '',
        isOptional,
      });

      if (result?.status) {
        const num = result?.voucherNumber || '';
        Alert.alert(
          isOptional ? 'Optional Entry Saved' : 'Sales Invoice Created in Tally!',
          `${num ? `Voucher No: ${num}\n` : ''}${partyLedger}\n${items.length} item(s)\n${isOptional ? 'Will not affect books until approved.' : 'Posted to Tally books.'}`,
          [{text: 'OK', onPress: () => navigation.goBack()}]
        );
      } else {
        Alert.alert('Tally Error', result?.message || 'Failed to create invoice');
      }
    } catch (e) {
      Alert.alert('Error', e.message || 'Failed to connect to Tally');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={commonScreenStyles.container}>
      <Header
        title="Create Invoice"
        leftIcon="chevron-left"
        onLeftPress={() => navigation.goBack()}
      />
      <ScrollView
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={commonScreenStyles.scrollContent}>
        <SalesInvoiceInfo
          ref={invoiceInfoRef}
          scrollViewRef={scrollViewRef}
          customerRef={customerRef}
        />
        <AddSection
          stockHeading="Item/Services"
          stockButtonText="Add Product +"
          products={products}
          setProducts={setProducts}
          logistics={logistics}
          setLogistics={setLogistics}
        />
        <PaymentCollection />
        <View ref={summaryRef}>
          <Summary
            showPaymentDropdown={true}
            onExpand={handleSummaryExpand}
            products={products}
            logistics={logistics}
          />
        </View>
        <View style={commonScreenStyles.bottomSpacer} />
      </ScrollView>
      <BottomArea
        buttonText={submitting ? 'Submitting...' : 'Submit Invoice'}
        showSecondButton={true}
        secondButtonText="Save as Optional"
        onPress={() => !submitting && handleSubmit(false)}
        onSecondPress={() => !submitting && handleSubmit(true)}
      />
    </View>
  );
};

export default SalesInvoiceScreen;
