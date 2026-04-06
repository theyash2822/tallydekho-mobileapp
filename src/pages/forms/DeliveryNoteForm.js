import React, {useRef, useState} from 'react';
import {ScrollView, View, Alert} from 'react-native';
import Header from '../../components/common/Header';
import AddSection from '../../components/Sales-purchaseInvoice/AddSection';
import SalesInvoiceInfo from '../../components/Sales-purchaseInvoice/SalesInvoiceInfo';
import BottomArea from '../../components/common/BottomArea';
import {commonScreenStyles} from '../Invoice/ScreenStyles';
import {tallyWriteAPI} from '../../services/api/apiService';
import {useAuth} from '../../context/AuthContext';

const DeliveryNoteForm = ({navigation}) => {
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
    if (!partyLedger) { Alert.alert('Error', 'Please select a customer'); return; }
    const items = products.map(p => ({
      itemName: p.name || '', billedQty: parseFloat(p.qty?.replace?.(/[^\d.]/g,'') || 1),
      rate: parseFloat(p.unitPrice?.replace?.(/[^\d.]/g,'') || 0), amount: parseFloat(p.total?.replace?.(/[^\d.]/g,'') || 0),
    }));
    setSubmitting(true);
    try {
      const result = await tallyWriteAPI.createDeliveryNote({
        companyGuid: selectedCompany.guid || selectedCompany.id, companyName: selectedCompany.name,
        date: infoData.date?.replace(/-/g,'') || new Date().toISOString().slice(0,10).replace(/-/g,''),
        partyLedger, items, narration: infoData.narration || '', isOptional,
      });
      if (result?.status) {
        Alert.alert('Delivery Note Created!', `${result.voucherNumber ? `Voucher: ${result.voucherNumber}\n` : ''}${partyLedger}`, [{text: 'OK', onPress: () => navigation.goBack()}]);
      } else { Alert.alert('Error', result?.message || 'Failed'); }
    } catch (e) { Alert.alert('Error', e.message); }
    finally { setSubmitting(false); }
  };

  return (
    <View style={commonScreenStyles.container}>
      <Header title="Delivery Note" leftIcon="chevron-left" onLeftPress={() => navigation.goBack()} />
      <ScrollView ref={scrollViewRef} showsVerticalScrollIndicator={false} contentContainerStyle={commonScreenStyles.scrollContent}>
        <SalesInvoiceInfo ref={invoiceInfoRef} scrollViewRef={scrollViewRef} />
        <AddSection stockHeading="Items" stockButtonText="Add Item +" products={products} setProducts={setProducts} logistics={logistics} setLogistics={setLogistics} />
        <View style={commonScreenStyles.bottomSpacer} />
      </ScrollView>
      <BottomArea buttonText={submitting ? 'Submitting...' : 'Create Delivery Note'} showSecondButton={true} secondButtonText="Save as Optional" onPress={() => !submitting && handleSubmit(false)} onSecondPress={() => !submitting && handleSubmit(true)} />
    </View>
  );
};
export default DeliveryNoteForm;
