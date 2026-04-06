import React, {useState} from 'react';
import {ScrollView, View, Alert, Text, TextInput, StyleSheet} from 'react-native';
import Header from '../../components/common/Header';
import BottomArea from '../../components/common/BottomArea';
import {commonScreenStyles} from '../Invoice/ScreenStyles';
import {tallyWriteAPI} from '../../services/api/apiService';
import {useAuth} from '../../context/AuthContext';
import Colors from '../../utils/Colors';

const CreatePartyForm = ({navigation}) => {
  const [name, setName] = useState('');
  const [gstin, setGstin] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [group, setGroup] = useState('Sundry Debtors');
  const [submitting, setSubmitting] = useState(false);
  const {selectedCompany} = useAuth();

  const handleSubmit = async () => {
    if (!name) { Alert.alert('Error', 'Party name is required'); return; }
    if (!selectedCompany) { Alert.alert('Error', 'No company selected'); return; }
    setSubmitting(true);
    try {
      const result = await tallyWriteAPI.createParty({
        companyGuid: selectedCompany.guid || selectedCompany.id,
        companyName: selectedCompany.name,
        name, gstin, address, phone, email, group,
      });
      if (result?.status) {
        Alert.alert('Party Created in Tally!', `"${name}" added to ${group}`, [{text: 'OK', onPress: () => navigation.goBack()}]);
      } else { Alert.alert('Error', result?.message || 'Failed'); }
    } catch (e) { Alert.alert('Error', e.message); }
    finally { setSubmitting(false); }
  };

  const GROUPS = ['Sundry Debtors', 'Sundry Creditors', 'Bank Accounts', 'Cash-in-Hand', 'Loans & Advances'];

  return (
    <View style={commonScreenStyles.container}>
      <Header title="Create Party / Ledger" leftIcon="chevron-left" onLeftPress={() => navigation.goBack()} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[commonScreenStyles.scrollContent, {padding: 16}]}>
        <Text style={styles.label}>Party Name *</Text>
        <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Enter party name" placeholderTextColor="#9CA3AF" />

        <Text style={styles.label}>Group Under</Text>
        {GROUPS.map(g => (
          <Text key={g} onPress={() => setGroup(g)}
            style={[styles.groupBtn, group === g && styles.groupBtnActive]}>
            {g}
          </Text>
        ))}

        <Text style={styles.label}>GSTIN</Text>
        <TextInput style={styles.input} value={gstin} onChangeText={setGstin} placeholder="e.g. 23ABCDE1234F1Z5" autoCapitalize="characters" placeholderTextColor="#9CA3AF" />

        <Text style={styles.label}>Phone</Text>
        <TextInput style={styles.input} value={phone} onChangeText={setPhone} placeholder="Mobile number" keyboardType="phone-pad" placeholderTextColor="#9CA3AF" />

        <Text style={styles.label}>Email</Text>
        <TextInput style={styles.input} value={email} onChangeText={setEmail} placeholder="Email address" keyboardType="email-address" autoCapitalize="none" placeholderTextColor="#9CA3AF" />

        <Text style={styles.label}>Address</Text>
        <TextInput style={[styles.input, {height: 70, textAlignVertical: 'top'}]} value={address} onChangeText={setAddress} placeholder="Full address" multiline placeholderTextColor="#9CA3AF" />
        <View style={commonScreenStyles.bottomSpacer} />
      </ScrollView>
      <BottomArea buttonText={submitting ? 'Creating...' : 'Create in Tally'} showSecondButton={false} onPress={() => !submitting && handleSubmit()} />
    </View>
  );
};

const styles = StyleSheet.create({
  label: {fontSize: 13, fontWeight: '500', color: '#374151', marginBottom: 6, marginTop: 14},
  input: {borderWidth: 1, borderColor: '#D9DCE0', borderRadius: 8, padding: 10, fontSize: 14, color: '#1C2B3A', backgroundColor: Colors.white},
  groupBtn: {paddingVertical: 8, paddingHorizontal: 12, marginRight: 8, marginBottom: 6, borderRadius: 20, borderWidth: 1, borderColor: '#D9DCE0', color: '#6B7280', fontSize: 12, textAlign: 'center'},
  groupBtnActive: {backgroundColor: '#3F5263', borderColor: '#3F5263', color: Colors.white},
});
export default CreatePartyForm;
