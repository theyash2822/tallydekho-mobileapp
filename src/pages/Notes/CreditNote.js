import React, {useRef, useState} from 'react';
import {Alert} from 'react-native';
import {tallyWriteAPI} from '../../services/api/apiService';
import {useAuth} from '../../context/AuthContext';
import {ScrollView, View, StyleSheet, Platform} from 'react-native';
import Header from '../../components/common/Header';
import Summary from '../../components/Sales-purchaseInvoice/Summary';
import CreditNoteInfo from '../../components/notes/CreditNoteInfo';
import BottomArea from '../../components/common/BottomArea';
import {commonScreenStyles} from '../Invoice/ScreenStyles';
import useKeyboardVisibility from '../../hooks/useKeyboardVisibility';

const CreditNote = ({navigation}) => {
  const scrollViewRef = useRef(null);
  const infoRef = useRef(null);
  const [submitting, setSubmitting] = useState(false);
  const {selectedCompany} = useAuth();

  const handleSubmit = async (isOptional = false) => {
    const data = infoRef.current?.getFormData?.() || {};
    const party = data.partyLedger || '';
    if (!party) { Alert.alert('Error', 'Please select a party'); return; }
    if (!selectedCompany) { Alert.alert('Error', 'No company selected'); return; }
    setSubmitting(true);
    try {
      const result = await tallyWriteAPI.createCreditNote({
        companyGuid: selectedCompany.guid || selectedCompany.id,
        companyName: selectedCompany.name,
        date: new Date().toISOString().slice(0,10).replace(/-/g,''),
        partyLedger: party,
        amount: data.amount || 0,
        narration: data.narration || '',
        reference: data.reference || '',
        isOptional,
      });
      if (result?.status) {
        Alert.alert('Credit Note Created!', result.voucherNumber ? 'Voucher: ' + result.voucherNumber : 'Posted to Tally', [{text:'OK', onPress:()=>navigation.goBack()}]);
      } else { Alert.alert('Error', result?.message || 'Failed'); }
    } catch(e) { Alert.alert('Error', e.message); }
    finally { setSubmitting(false); }
  };
  const summaryRef = useRef(null);
  const isKeyboardVisible = useKeyboardVisibility();
  const [products, setProducts] = useState([]);
  const [logistics, setLogistics] = useState([]);

  const handleSummaryExpand = () => {
    // Auto-scroll to summary when expanded
    setTimeout(() => {
      summaryRef.current?.measure((x, y, width, height, pageX, pageY) => {
        scrollViewRef.current?.scrollTo({
          y: y - 20,
          animated: true,
        });
      });
    }, 200);
  };

  return (
    <View style={commonScreenStyles.container}>
      <Header
        title="Create Credit Note"
        leftIcon="chevron-left"
        onLeftPress={() => navigation.goBack()}
      />
      <ScrollView
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          commonScreenStyles.scrollContent,
          isKeyboardVisible && styles.keyboardPadding,
        ]}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="interactive">
        <CreditNoteInfo ref={infoRef} 
          scrollViewRef={scrollViewRef} 
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
      <BottomArea buttonText={submitting ? 'Submitting...' : 'Submit Credit Note'} showSecondButton={true} secondButtonText="Save as Optional" onPress={() => !submitting && handleSubmit(false)} onSecondPress={() => !submitting && handleSubmit(true)} />
    </View>
  );
};

const styles = StyleSheet.create({
  keyboardPadding: {
    paddingBottom: Platform.OS === 'ios' ? 250 : 150,
  },
});

export default CreditNote;
