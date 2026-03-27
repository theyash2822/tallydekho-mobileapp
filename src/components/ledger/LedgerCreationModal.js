import React, {useState, useRef} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  Keyboard,
  ActivityIndicator,
} from 'react-native';
import Colors from '../../utils/Colors';
import {CommonLabelStyles} from '../../utils/CommonStyles';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Icon from 'react-native-vector-icons/Feather';
import CustomSwitch from '../common/CustomSwitch';
import {
  CollapsibleCard,
  CustomDropdown,
  CustomTextInput,
  PartyInput,
  TwoColumnRow,
} from './ledgerModalhelper';
import CustomAnimatedModal from '../common/CustomAnimatedModal';
import useKeyboardVisibility from '../../hooks/useKeyboardVisibility';
import { useInputNavigation } from '../stocksManagement/StockOverview/TotalStock/Components/inputNavigation';

const natureOptions = ['Assets', 'Liabilities', 'Income', 'Expense'];

const LedgerCreationModal = ({visible, onClose, onCreate}) => {
  const [ledgerName, setLedgerName] = useState('');
  const [selectedNature, setSelectedNature] = useState('Assets');
  const [groupSearch, setGroupSearch] = useState('');
  const [openingBalance, setOpeningBalance] = useState('');
  const [isCredit, setIsCredit] = useState(true);
  const [narration, setNarration] = useState('');
  const [saveState, setSaveState] = useState('save');
  const [expandedSections, setExpandedSections] = useState({
    nature: false,
    party: false,
    bank: false,
    duties: false,
  });

  const [formData, setFormData] = useState({
    party: {name: '', contact: '', email: '', address: '', creditLimit: ''},
    bank: {
      beneficiaryName: '',
      accountNumber: '',
      ifsc: '',
      swift: '',
      branch: '',
      bankName: '',
    },
    duties: {gstin: '', pan: '', vat: '', rate: ''},
  });
  const isKeyboardVisible = useKeyboardVisibility();
  const scrollViewRef = useRef(null);

  // Field names in order
  const fieldNames = [
    'ledgerName',
    'groupSearch',
    'openingBalance',
    'narration',
    'partyName',
    'partyContact',
    'partyEmail',
    'partyAddress',
    'partyCreditLimit',
    'bankBeneficiary',
    'bankAccount',
    'bankIfsc',
    'bankSwift',
    'bankBranch',
    'bankName',
    'dutiesGstin',
    'dutiesPan',
    'dutiesVat',
    'dutiesRate',
  ];

  const {
    getInputRef,
    getContainerRef,
    handleInputFocus,
    handleContainerLayout,
    clearInputRefs,
    getKeyboardType,
    handleSubmitEditing,
  } = useInputNavigation(fieldNames.length, scrollViewRef);

  const toggleSection = section => {
    setExpandedSections(prev => ({...prev, [section]: !prev[section]}));
  };

  const updateFormData = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {...prev[section], [field]: value},
    }));
  };


  const clearAllFields = () => {
    setLedgerName('');
    setSelectedNature('Assets');
    setGroupSearch('');
    setOpeningBalance('');
    setIsCredit(true);
    setNarration('');
    setFormData({
      party: {name: '', contact: '', email: '', address: '', creditLimit: ''},
      bank: {
        beneficiaryName: '',
        accountNumber: '',
        ifsc: '',
        swift: '',
        branch: '',
        bankName: '',
      },
      duties: {gstin: '', pan: '', vat: '', rate: ''},
    });
    setExpandedSections({
      nature: false,
      party: false,
      bank: false,
      duties: false,
    });
    clearInputRefs();
  };

  const handleClose = () => {
    clearAllFields();
    onClose();
  };

  const handleSave = async () => {
    setSaveState('saving');
    
    try {
      // Show saving state for at least 1.5 seconds
      const minDelay = new Promise(resolve => setTimeout(resolve, 1500));
      
      const savePromise = onCreate ? onCreate({
        ledgerName,
        selectedNature,
        groupSearch,
        openingBalance,
        isCredit,
        narration,
        ...formData,
      }) : Promise.resolve();
      
      // Wait for both the save operation and minimum delay
      await Promise.all([savePromise, minDelay]);
      
      setSaveState('saved');
      
      // Show saved state for 1.5 seconds before closing
      setTimeout(() => {
        setSaveState('save');
        clearAllFields();
        onClose();
      }, 1500);
    } catch (error) {
      setSaveState('save');
      // Handle error if needed
      console.error('Error saving ledger:', error);
    }
  };

  return (
    <CustomAnimatedModal
      visible={visible}
      onClose={handleClose}
      title="Ledger Creation"
      scrollable={false}
      statusBarTranslucent={true}
      maxHeight={isKeyboardVisible ? '90%' : '82%'}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
        style={{}}>
        <ScrollView
          ref={scrollViewRef}
          style={styles.content}
          contentContainerStyle={[
            styles.scrollContent,
            isKeyboardVisible && styles.keyboardPadding,
          ]}
          showsVerticalScrollIndicator={false}
          keyboardDismissMode="interactive"
          keyboardShouldPersistTaps="handled"
          nestedScrollEnabled={true}>
          <CustomTextInput
          label="Ledger Name"
          value={ledgerName}
          onChangeText={setLedgerName}
          placeholder="Enter ledger name"
          inputRef={getInputRef(0)}
          nextInputRef={getInputRef(1)}
          scrollViewRef={scrollViewRef}
          returnKeyType="next"
        />

        <CustomDropdown
          label="Nature"
          selectedValue={selectedNature}
          options={natureOptions}
          expanded={expandedSections.nature}
          onToggle={() => toggleSection('nature')}
          onSelect={option => {
            setSelectedNature(option);
            toggleSection('nature');
          }}
        />

        <Text style={styles.label}>Group</Text>
        <View style={styles.groupRow}>
          <MaterialIcons
            name="search"
            size={20}
            color={Colors.secondaryText}
            style={{marginRight: 8}}
          />
          <TextInput
            ref={getInputRef(1)}
            style={styles.groupInput}
            placeholder="Search Group"
            value={groupSearch}
            onChangeText={setGroupSearch}
            placeholderTextColor={Colors.secondaryText}
            returnKeyType="next"
            blurOnSubmit={false}
            onSubmitEditing={() => handleSubmitEditing(1, 2, 'next')}
          />
        </View>

        <Text style={styles.label}>Opening Balance</Text>
        <View style={styles.openingRow}>
          <TextInput
            ref={getInputRef(2)}
            style={styles.openingInput}
            placeholder="Enter Amount"
            value={openingBalance}
            onChangeText={setOpeningBalance}
            keyboardType={getKeyboardType('numeric')}
            placeholderTextColor={Colors.secondaryText}
            returnKeyType="next"
            blurOnSubmit={false}
            onSubmitEditing={() => handleSubmitEditing(2, 3, 'next')}
          />
          <Text style={[styles.drcrLabel, {marginRight: 10}]}>Dr</Text>
          <CustomSwitch />
          <Text style={styles.drcrLabel}>Cr</Text>
        </View>

        <CustomTextInput
          label="Narration"
          value={narration}
          onChangeText={setNarration}
          placeholder="Enter Notes"
          multiline={true}
          inputRef={getInputRef(3)}
          scrollViewRef={scrollViewRef}
          returnKeyType="done"
        />

        <CollapsibleCard
          title="Party"
          expanded={expandedSections.party}
          onToggle={() => toggleSection('party')}>
          <PartyInput
            label="Name"
            value={formData.party.name}
            onChangeText={text => updateFormData('party', 'name', text)}
            placeholder="Party A"
            inputRef={getInputRef(4)}
            nextInputRef={getInputRef(5)}
            scrollViewRef={scrollViewRef}
            returnKeyType="next"
          />
          <TwoColumnRow
            leftChild={
              <PartyInput
                label="Contact number"
                value={formData.party.contact}
                onChangeText={text => updateFormData('party', 'contact', text)}
                placeholder="Enter phone"
                keyboardType="phone-pad"
                inputRef={getInputRef(5)}
                nextInputRef={getInputRef(6)}
                scrollViewRef={scrollViewRef}
                returnKeyType="next"
              />
            }
            rightChild={
              <PartyInput
                label="Email"
                value={formData.party.email}
                onChangeText={text => updateFormData('party', 'email', text)}
                placeholder="Enter email"
                keyboardType="email-address"
                inputRef={getInputRef(6)}
                nextInputRef={getInputRef(7)}
                scrollViewRef={scrollViewRef}
                returnKeyType="next"
              />
            }
          />
          <PartyInput
            label="Address"
            value={formData.party.address}
            onChangeText={text => updateFormData('party', 'address', text)}
            placeholder="Enter address"
            inputRef={getInputRef(7)}
            nextInputRef={getInputRef(8)}
            scrollViewRef={scrollViewRef}
            returnKeyType="next"
          />
          <PartyInput
            label="Credit Limit"
            value={formData.party.creditLimit}
            onChangeText={text => updateFormData('party', 'creditLimit', text)}
            keyboardType={getKeyboardType('numeric')}
            placeholder="Enter Amount"
            inputRef={getInputRef(8)}
            scrollViewRef={scrollViewRef}
            returnKeyType="done"
          />
        </CollapsibleCard>

        <CollapsibleCard
          title="Bank"
          expanded={expandedSections.bank}
          onToggle={() => toggleSection('bank')}>
          <PartyInput
            label="Beneficiary Name"
            value={formData.bank.beneficiaryName}
            onChangeText={text =>
              updateFormData('bank', 'beneficiaryName', text)
            }
            placeholder="Enter beneficiary name"
            inputRef={getInputRef(9)}
            nextInputRef={getInputRef(10)}
            scrollViewRef={scrollViewRef}
            returnKeyType="next"
          />
          <PartyInput
            label="A/C Number"
            value={formData.bank.accountNumber}
            onChangeText={text => updateFormData('bank', 'accountNumber', text)}
            placeholder="Enter A/C number"
            keyboardType={getKeyboardType('numeric')}
            inputRef={getInputRef(10)}
            nextInputRef={getInputRef(11)}
            scrollViewRef={scrollViewRef}
            returnKeyType="next"
          />
          <TwoColumnRow
            leftChild={
              <PartyInput
                label="IFSC"
                value={formData.bank.ifsc}
                onChangeText={text => updateFormData('bank', 'ifsc', text)}
                placeholder="Enter IFSC number"
                inputRef={getInputRef(11)}
                nextInputRef={getInputRef(12)}
                scrollViewRef={scrollViewRef}
                returnKeyType="next"
              />
            }
            rightChild={
              <PartyInput
                label="SWIFT"
                value={formData.bank.swift}
                onChangeText={text => updateFormData('bank', 'swift', text)}
                placeholder="Enter SWIFT code"
                inputRef={getInputRef(12)}
                nextInputRef={getInputRef(13)}
                scrollViewRef={scrollViewRef}
                returnKeyType="next"
              />
            }
          />
          <TwoColumnRow
            leftChild={
              <PartyInput
                label="Branch"
                value={formData.bank.branch}
                onChangeText={text => updateFormData('bank', 'branch', text)}
                inputRef={getInputRef(13)}
                nextInputRef={getInputRef(14)}
                scrollViewRef={scrollViewRef}
                returnKeyType="next"
              />
            }
            rightChild={
              <PartyInput
                label="Bank Name"
                value={formData.bank.bankName}
                onChangeText={text => updateFormData('bank', 'bankName', text)}
                inputRef={getInputRef(14)}
                scrollViewRef={scrollViewRef}
                returnKeyType="done"
              />
            }
          />
        </CollapsibleCard>

        <CollapsibleCard
          title="Duties & Taxes"
          expanded={expandedSections.duties}
          onToggle={() => toggleSection('duties')}>
          <TwoColumnRow
            leftChild={
              <PartyInput
                label="GSTIN"
                value={formData.duties.gstin}
                onChangeText={text => updateFormData('duties', 'gstin', text)}
                placeholder="Enter GST"
                inputRef={getInputRef(15)}
                nextInputRef={getInputRef(16)}
                scrollViewRef={scrollViewRef}
                returnKeyType="next"
              />
            }
            rightChild={
              <PartyInput
                label="PAN"
                value={formData.duties.pan}
                onChangeText={text => updateFormData('duties', 'pan', text)}
                placeholder="Enter PAN"
                inputRef={getInputRef(16)}
                nextInputRef={getInputRef(17)}
                scrollViewRef={scrollViewRef}
                returnKeyType="next"
              />
            }
          />
          <TwoColumnRow
            leftChild={
              <PartyInput
                label="VAT"
                value={formData.duties.vat}
                onChangeText={text => updateFormData('duties', 'vat', text)}
                placeholder="Enter VAT"
                keyboardType={getKeyboardType('numeric')}
                inputRef={getInputRef(17)}
                nextInputRef={getInputRef(18)}
                scrollViewRef={scrollViewRef}
                returnKeyType="next"
              />
            }
            rightChild={
              <PartyInput
                label="Rate %"
                value={formData.duties.rate}
                onChangeText={text => updateFormData('duties', 'rate', text)}
                keyboardType={getKeyboardType('numeric')}
                inputRef={getInputRef(18)}
                scrollViewRef={scrollViewRef}
                returnKeyType="done"
              />
            }
          />
        </CollapsibleCard>

          <TouchableOpacity 
            style={[
              styles.saveBtn,
              saveState === 'saving' && styles.savingBtn,
              saveState === 'saved' && styles.savedBtn,
            ]} 
            onPress={handleSave}
            disabled={saveState === 'saving'}
          >
            {saveState === 'saving' ? (
              <View style={styles.buttonContent}>
                <ActivityIndicator size="small" color={Colors.white} />
                <Text style={styles.saveBtnText}>Saving...</Text>
              </View>
            ) : saveState === 'saved' ? (
              <View style={styles.buttonContent}>
                <Icon name="check" size={18} color={Colors.white} />
                <Text style={styles.saveBtnText}>Saved</Text>
              </View>
            ) : (
              <Text style={styles.saveBtnText}>Save</Text>
            )}
          </TouchableOpacity>
          {isKeyboardVisible && <View style={styles.bottomSpacer} />}
        </ScrollView>
      </KeyboardAvoidingView>
    </CustomAnimatedModal>
  );
};

const styles = StyleSheet.create({
  content: {
  },
  scrollContent: {
    paddingBottom: 20,
  },
  keyboardPadding: {
  paddingBottom: Platform.OS === 'ios' ? 120 : 20,
  },
  bottomSpacer: {
    height: 20,
  },
  label: {
    ...CommonLabelStyles.label,
    marginBottom: 6,
    marginTop: 10,
  },
  groupRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 2,
  },
  groupInput: {
    flex: 1,
    fontSize: 14,
    color: Colors.primaryText,
    backgroundColor: 'transparent',
    paddingVertical: 6,
  },
  openingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 2,
  },
  openingInput: {
    flex: 1,
    fontSize: 14,
    color: Colors.primaryText,
    backgroundColor: 'transparent',
    paddingVertical: 6,
  },
  drcrLabel: {
    fontSize: 14,
    color: Colors.secondaryText,
    marginLeft: 8,
  },
  saveBtn: {
    backgroundColor: '#07624C',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 18,
  },
  savingBtn: {
    backgroundColor: '#07624C',
  },
  savedBtn: {
    backgroundColor: '#07624C',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  saveBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 8,
  },
});

export default LedgerCreationModal;
