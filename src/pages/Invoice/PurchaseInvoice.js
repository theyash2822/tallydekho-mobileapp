import React, {useRef, useState} from 'react';
import {ScrollView, View, Alert} from 'react-native';
import Summary from '../../components/Sales-purchaseInvoice/Summary';
import PurchaseInvoiceInfo from '../../components/Sales-purchaseInvoice/PurchaseInvoiceInfo';
import AddOrderSection from '../../components/orders/AddOrders';
import Header from '../../components/common/Header';
import BottomArea from '../../components/common/BottomArea';
import {commonScreenStyles} from './ScreenStyles';
import {tallyWriteAPI} from '../../services/api/apiService';
import {useAuth} from '../../context/AuthContext';

const PurchaseInvoice = ({navigation}) => {
  const scrollViewRef = useRef(null);
  const summaryRef = useRef(null);
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
    if (!products.length) {
      Alert.alert('Validation Error', 'Please add at least one product');
      return;
    }
    if (!selectedCompany) {
      Alert.alert('Error', 'No company selected');
      return;
    }

    const infoData = invoiceInfoRef.current?.getFormData?.() || {};
    const partyLedger = infoData.partyLedger || infoData.vendor || '';
    if (!partyLedger) {
      Alert.alert('Validation Error', 'Please select a vendor/supplier');
      return;
    }

    const items = products.map(p => ({
      itemName: p.name || p.stockItem || '',
      billedQty: parseFloat(p.qty?.replace?.(/[^\d.]/g, '') || p.qty || 1),
      rate: parseFloat(p.unitPrice?.replace?.(/[^\d.]/g, '') || p.rate || 0),
      amount: parseFloat(p.total?.replace?.(/[^\d.]/g, '') || p.amount || 0),
      godown: '',
      taxLedger: 'Input GST 18%',
      taxPercent: 18,
    }));

    setSubmitting(true);
    try {
      const result = await tallyWriteAPI.createPurchaseInvoice({
        companyGuid: selectedCompany.guid || selectedCompany.id,
        companyName: selectedCompany.name,
        date: infoData.date?.replace(/-/g, '') || new Date().toISOString().slice(0,10).replace(/-/g,''),
        partyLedger,
        purchaseLedger: infoData.purchaseLedger || 'Purchase Accounts',
        items,
        narration: infoData.narration || '',
        isOptional,
      });

      if (result?.status) {
        const num = result?.voucherNumber || '';
        Alert.alert(
          isOptional ? 'Optional Entry Saved' : 'Purchase Invoice Created in Tally!',
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
        title="Purchase Invoice"
        leftIcon="chevron-left"
        onLeftPress={() => navigation.goBack()}
      />
      <ScrollView
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={commonScreenStyles.scrollContent}>
        <PurchaseInvoiceInfo ref={invoiceInfoRef} scrollViewRef={scrollViewRef} />
        <AddOrderSection
          products={products}
          setProducts={setProducts}
          logistics={logistics}
          setLogistics={setLogistics}
        />
        <View ref={summaryRef}>
          <Summary
            showPaymentDropdown={false}
            onExpand={handleSummaryExpand}
            products={products}
            logistics={logistics}
          />
        </View>
        <View style={commonScreenStyles.bottomSpacer} />
      </ScrollView>
      <BottomArea
        buttonText={submitting ? 'Submitting...' : 'Submit Purchase Invoice'}
        showSecondButton={true}
        secondButtonText="Save as Optional"
        onPress={() => !submitting && handleSubmit(false)}
        onSecondPress={() => !submitting && handleSubmit(true)}
      />
    </View>
  );
};

export default PurchaseInvoice;
