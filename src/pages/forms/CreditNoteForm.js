import React, {useRef, useState} from 'react';
import {ScrollView, View, Alert, Text, TextInput, StyleSheet} from 'react-native';
import Header from '../../components/common/Header';
import BottomArea from '../../components/common/BottomArea';
import {commonScreenStyles} from '../Invoice/ScreenStyles';
import {tallyWriteAPI} from '../../services/api/apiService';
import {useAuth} from '../../context/AuthContext';
import Colors from '../../utils/Colors';

const CreditNoteForm = ({navigation}) => {
  const [partyLedger, setPartyLedger] = useState('');
  const [amount, setAmount] = useState('');
  const [reason, setReason] = useState('');
  const [originalRef, setOriginalRef] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const {selectedCompany} = useAuth();

  const handleSubmit = async (isOptional = false) => {
    if (!partyLedger || !amount) { Alert.alert('Error', 'Party and amount are required'); return; }
    if (!selectedCompany) { Alert.alert('Error', 'No company selected'); return; }
    setSubmitting(true);
    try {
      const result = await tallyWriteAPI.createCreditNote({
        companyGuid: selectedCompany.guid || selectedCompany.id,
        companyName: selectedCompany.name,
        date: new Date().toISOString().slice(0,10).replace(/-/g,''),
        partyLedger,
        amount: parseFloat(amount) || 0,
        narration: reason,
        reference: originalRef,
        isOptional,
      });
      if (result?.status) {
        const num = result?.voucherNumber || '';
        Alert.alert('Credit Note Created!', `${num ? `Voucher: ${num}\n` : ''}₹${parseFloat(amount).toLocaleString('en-IN')}`, [{text: 'OK', onPress: () => navigation.goBack()}]);
      } else { Alert.alert('Error', result?.message || 'Failed'); }
    } catch (e) { Alert.alert('Error', e.message); }
    finally { setSubmitting(false); }
  };

  return (
    <View style={commonScreenStyles.container}>
      <Header title="Credit Note" leftIcon="chevron-left" onLeftPress={() => navigation.goBack()} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[commonScreenStyles.scrollContent, {padding: 16}]}>
        <Text style={styles.label}>Party / Customer *</Text>
        <TextInput style={styles.input} value={partyLedger} onChangeText={setPartyLedger} placeholder="Enter party name" placeholderTextColor="#9CA3AF" />

        <Text style={styles.label}>Amount *</Text>
        <TextInput style={styles.input} value={amount} onChangeText={setAmount} placeholder="Enter amount" keyboardType="numeric" placeholderTextColor="#9CA3AF" />

        <Text style={styles.label}>Original Invoice Reference</Text>
        <TextInput style={styles.input} value={originalRef} onChangeText={setOriginalRef} placeholder="e.g. INV-001" placeholderTextColor="#9CA3AF" />

        <Text style={styles.label}>Reason / Narration</Text>
        <TextInput style={[styles.input, {height: 80, textAlignVertical: 'top'}]} value={reason} onChangeText={setReason} placeholder="Reason for credit note" multiline placeholderTextColor="#9CA3AF" />
        <View style={commonScreenStyles.bottomSpacer} />
      </ScrollView>
      <BottomArea buttonText={submitting ? 'Submitting...' : 'Create Credit Note'} showSecondButton={true} secondButtonText="Save as Optional" onPress={() => !submitting && handleSubmit(false)} onSecondPress={() => !submitting && handleSubmit(true)} />
    </View>
  );
};

const styles = StyleSheet.create({
  label: {fontSize: 13, fontWeight: '500', color: '#374151', marginBottom: 6, marginTop: 12},
  input: {borderWidth: 1, borderColor: '#D9DCE0', borderRadius: 8, padding: 10, fontSize: 14, color: '#1C2B3A', backgroundColor: Colors.white},
});
export default CreditNoteForm;
