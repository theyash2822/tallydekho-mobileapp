import React, {useState} from 'react';
import {ScrollView, View, Alert, Text, TextInput, StyleSheet} from 'react-native';
import Header from '../../components/common/Header';
import BottomArea from '../../components/common/BottomArea';
import {commonScreenStyles} from '../Invoice/ScreenStyles';
import {tallyWriteAPI} from '../../services/api/apiService';
import {useAuth} from '../../context/AuthContext';
import Colors from '../../utils/Colors';

const CreateStockForm = ({navigation}) => {
  const [name, setName] = useState('');
  const [group, setGroup] = useState('Primary');
  const [unit, setUnit] = useState('Nos');
  const [hsn, setHsn] = useState('');
  const [taxRate, setTaxRate] = useState('18');
  const [openingQty, setOpeningQty] = useState('0');
  const [openingRate, setOpeningRate] = useState('0');
  const [submitting, setSubmitting] = useState(false);
  const {selectedCompany} = useAuth();

  const handleSubmit = async () => {
    if (!name) { Alert.alert('Error', 'Stock item name is required'); return; }
    if (!selectedCompany) { Alert.alert('Error', 'No company selected'); return; }
    setSubmitting(true);
    try {
      const result = await tallyWriteAPI.createStockItem({
        companyGuid: selectedCompany.guid || selectedCompany.id,
        companyName: selectedCompany.name,
        name, group, unit, hsn,
        taxRate: parseFloat(taxRate) || 18,
        openingQty: parseFloat(openingQty) || 0,
        openingRate: parseFloat(openingRate) || 0,
        openingValue: (parseFloat(openingQty) || 0) * (parseFloat(openingRate) || 0),
      });
      if (result?.status) {
        Alert.alert('Stock Item Created!', `"${name}" added to Tally inventory`, [{text: 'OK', onPress: () => navigation.goBack()}]);
      } else { Alert.alert('Error', result?.message || 'Failed'); }
    } catch (e) { Alert.alert('Error', e.message); }
    finally { setSubmitting(false); }
  };

  return (
    <View style={commonScreenStyles.container}>
      <Header title="Create Stock Item" leftIcon="chevron-left" onLeftPress={() => navigation.goBack()} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[commonScreenStyles.scrollContent, {padding: 16}]}>
        <Text style={styles.label}>Item Name *</Text>
        <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Stock item name" placeholderTextColor="#9CA3AF" />

        <Text style={styles.label}>Stock Group</Text>
        <TextInput style={styles.input} value={group} onChangeText={setGroup} placeholder="e.g. Primary" placeholderTextColor="#9CA3AF" />

        <Text style={styles.label}>Unit of Measure</Text>
        <TextInput style={styles.input} value={unit} onChangeText={setUnit} placeholder="e.g. Nos, Kg, Ltr" placeholderTextColor="#9CA3AF" />

        <Text style={styles.label}>HSN Code</Text>
        <TextInput style={styles.input} value={hsn} onChangeText={setHsn} placeholder="HSN code" keyboardType="numeric" placeholderTextColor="#9CA3AF" />

        <Text style={styles.label}>GST Tax Rate (%)</Text>
        <TextInput style={styles.input} value={taxRate} onChangeText={setTaxRate} placeholder="e.g. 18" keyboardType="numeric" placeholderTextColor="#9CA3AF" />

        <Text style={styles.label}>Opening Quantity</Text>
        <TextInput style={styles.input} value={openingQty} onChangeText={setOpeningQty} placeholder="0" keyboardType="numeric" placeholderTextColor="#9CA3AF" />

        <Text style={styles.label}>Opening Rate (per unit)</Text>
        <TextInput style={styles.input} value={openingRate} onChangeText={setOpeningRate} placeholder="0" keyboardType="numeric" placeholderTextColor="#9CA3AF" />
        <View style={commonScreenStyles.bottomSpacer} />
      </ScrollView>
      <BottomArea buttonText={submitting ? 'Creating...' : 'Create in Tally'} showSecondButton={false} onPress={() => !submitting && handleSubmit()} />
    </View>
  );
};

const styles = StyleSheet.create({
  label: {fontSize: 13, fontWeight: '500', color: '#374151', marginBottom: 6, marginTop: 14},
  input: {borderWidth: 1, borderColor: '#D9DCE0', borderRadius: 8, padding: 10, fontSize: 14, color: '#1C2B3A', backgroundColor: Colors.white},
});
export default CreateStockForm;
