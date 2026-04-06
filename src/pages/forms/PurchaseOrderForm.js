import React, {useRef, useState} from 'react';
import {ScrollView, View, Alert} from 'react-native';
import Header from '../../components/common/Header';
import AddOrderSection from '../../components/orders/AddOrders';
import PurchaseInvoiceInfo from '../../components/Sales-purchaseInvoice/PurchaseInvoiceInfo';
import BottomArea from '../../components/common/BottomArea';
import {commonScreenStyles} from '../Invoice/ScreenStyles';
import {tallyWriteAPI} from '../../services/api/apiService';
import {useAuth} from '../../context/AuthContext';

const PurchaseOrderForm = ({navigation}) => {
  const scrollViewRef = useRef(null);
  const invoiceInfoRef = useRef(null);
  const [products, setProducts] = useState([]);
  const [logistics, setLogistics] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const {selectedCompany} = useAuth();

  const handleSubmit = async (isOptional = false) => {
    if (!products.length) { Alert.alert('Error', 'Add at least one product'); return; }
    if (!selectedCompany) { Alert.alert('Error', 'No company selected'); return; }
    const infoData = invoiceInfoRef.current?.getFormData?.() || {};
    const partyLedger = infoData.partyLedger || '';
    if (!partyLedger) { Alert.alert('Error', 'Please select a vendor'); return; }
    const items = products.map(p => ({
      itemName: p.name || '',
      billedQty: parseFloat(p.qty?.replace?.(/[^\d.]/g,'') || 1),
      rate: parseFloat(p.unitPrice?.replace?.(/[^\d.]/g,'') || 0),
      amount: parseFloat(p.total?.replace?.(/[^\d.]/g,'') || 0),
    }));
    setSubmitting(true);
    try {
      const result = await tallyWriteAPI.createPurchaseOrder({
        companyGuid: selectedCompany.guid || selectedCompany.id,
        companyName: selectedCompany.name,
        date: infoData.date?.replace(/-/g,'') || new Date().toISOString().slice(0,10).replace(/-/g,''),
        partyLedger,
        items,
        narration: infoData.narration || '',
        isOptional,
      });
      if (result?.status) {
        const num = result?.voucherNumber || '';
        Alert.alert('Purchase Order Created!', `${num ? `Voucher: ${num}\n` : ''}${partyLedger}`, [{text: 'OK', onPress: () => navigation.goBack()}]);
      } else { Alert.alert('Error', result?.message || 'Failed'); }
    } catch (e) { Alert.alert('Error', e.message); }
    finally { setSubmitting(false); }
  };

  return (
    <View style={commonScreenStyles.container}>
      <Header title="Purchase Order" leftIcon="chevron-left" onLeftPress={() => navigation.goBack()} />
      <ScrollView ref={scrollViewRef} showsVerticalScrollIndicator={false} contentContainerStyle={commonScreenStyles.scrollContent}>
        <PurchaseInvoiceInfo ref={invoiceInfoRef} scrollViewRef={scrollViewRef} />
        <AddOrderSection products={products} setProducts={setProducts} logistics={logistics} setLogistics={setLogistics} />
        <View style={commonScreenStyles.bottomSpacer} />
      </ScrollView>
      <BottomArea buttonText={submitting ? 'Submitting...' : 'Create Purchase Order'} showSecondButton={true} secondButtonText="Save as Optional" onPress={() => !submitting && handleSubmit(false)} onSecondPress={() => !submitting && handleSubmit(true)} />
    </View>
  );
};
export default PurchaseOrderForm;
