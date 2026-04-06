import React, {useRef, useState} from 'react';
import {ScrollView, View, StyleSheet, Platform, Alert} from 'react-native';
import Header from '../../components/common/Header';
import VoucherInfo from '../../components/voucher/VoucherInfo';
import ContraVoucherForm from '../../components/voucher/ContraVoucherForm';
import BottomArea from '../../components/common/BottomArea';
import {commonScreenStyles} from '../Invoice/ScreenStyles';
import useKeyboardVisibility from '../../hooks/useKeyboardVisibility';
import {tallyWriteAPI} from '../../services/api/apiService';
import {useAuth} from '../../context/AuthContext';

const ContraVoucher = ({navigation}) => {
  const scrollViewRef = useRef(null);
  const formRef = useRef(null);
  const isKeyboardVisible = useKeyboardVisibility();
  const [submitting, setSubmitting] = useState(false);
  const {selectedCompany} = useAuth();

  const handleSubmit = async (isOptional = false) => {
    const formData = formRef.current?.getFormData?.();
    if (!formData) { Alert.alert('Error', 'Please fill required fields'); return; }
    if (!selectedCompany) { Alert.alert('Error', 'No company selected'); return; }
    setSubmitting(true);
    try {
      const result = await tallyWriteAPI.createContra({
        companyGuid: selectedCompany.guid || selectedCompany.id,
        companyName: selectedCompany.name,
        date: formData.date?.replace(/-/g, '') || new Date().toISOString().slice(0,10).replace(/-/g,''),
        fromLedger: formData.fromLedger,
        toLedger: formData.toLedger,
        amount: formData.amount,
        narration: formData.narration || '',
        isOptional,
      });
      if (result?.status) {
        const num = result?.data && typeof result.data === 'string'
          ? (result.data.match(/<VOUCHERNUMBER>(.*?)<\/VOUCHERNUMBER>/i)?.[1] || '') : '';
        Alert.alert(
          isOptional ? 'Optional Entry Saved' : 'Contra Entry Created in Tally',
          `${num ? `Voucher: ${num}\n` : ''}₹${parseFloat(formData.amount).toLocaleString('en-IN')}`,
          [{text: 'OK', onPress: () => navigation.goBack()}]
        );
      } else {
        Alert.alert('Tally Error', result?.message || 'Failed');
      }
    } catch (e) {
      Alert.alert('Error', e.message || 'Failed to connect to Tally');
    } finally { setSubmitting(false); }
  };

  return (
    <View style={commonScreenStyles.container}>
      <Header title="Contra Voucher" leftIcon="chevron-left" onLeftPress={() => navigation.goBack()} />
      <ScrollView ref={scrollViewRef} showsVerticalScrollIndicator={false}
        contentContainerStyle={[commonScreenStyles.scrollContent, isKeyboardVisible && styles.keyboardPadding]}
        keyboardShouldPersistTaps="handled" keyboardDismissMode="interactive">
        <VoucherInfo />
        <ContraVoucherForm ref={formRef} scrollViewRef={scrollViewRef} isKeyboardVisible={isKeyboardVisible} />
        <View style={commonScreenStyles.bottomSpacer} />
      </ScrollView>
      <BottomArea
        buttonText={submitting ? 'Submitting...' : 'Submit Contra'}
        showSecondButton={true}
        secondButtonText="Save as Optional"
        onPress={() => !submitting && handleSubmit(false)}
        onSecondPress={() => !submitting && handleSubmit(true)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  keyboardPadding: { paddingBottom: Platform.OS === 'ios' ? 250 : 200 },
});

export default ContraVoucher;
