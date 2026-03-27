import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import Colors from '../../utils/Colors';
import CustomAnimatedModal from '../common/CustomAnimatedModal';

const transformLedgerData = data => {
  if (!data) return {};

  return {
    GST: {
      GSTIN: data.gstNumber || '',
      'GST Rate': data.gstRate ? `${data.gstRate} %` : '',
      'GST Type': data.gstTypeOfSupply || '',
    },
    CONTACT: {
      'Contact Person': data.name || '',
      Mobile: data.mobile || '',
      Email: data.email || '',
      Address: data.address || '',
    },
    BANK: {
      Beneficiary: data.bankAccHolderName || '',
      'Bank Name': data.bankName || '',
      'Account Number': data.bankAccNumber || '',
      IFSC: data.ifscCode || '',
      Branch: data.bankBranchName || '',
      SWIFT: data.swiftCode || '',
    },
    NARRATION: {
      Notes: data.description || 'No additional notes.',
    },
  };
};

const LedgerInformationModal = ({visible, onClose, data}) => {
  const info = React.useMemo(() => transformLedgerData(data), [data]);

  return (
    <CustomAnimatedModal
      visible={visible}
      onClose={onClose}
      showCloseButton={false}
      scrollable={true}>
      <View style={styles.headerRow}>

        <Feather
          name="info"
          size={22}
          color={Colors.primaryText}
          style={{marginRight: 8}}
        />
        
        <Text style={styles.title}>Information</Text>
        <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
          <Feather name="x" size={22} color={Colors.secondaryText} />
        </TouchableOpacity>
      </View>

      <View style={{marginTop: 8}}>
        {Object.entries(info).map(([section, details]) => (
          <View key={section} style={styles.infoCard}>
            <Text style={styles.infoTitle}>{section}</Text>

            {section === 'NARRATION' ? (
              <Text style={styles.infoText}>
                {Object.values(details)[0]}
              </Text>
            ) : (
              Object.entries(details).map(([label, value]) => (
                <Text key={label} style={styles.infoText}>
                  {label}: {value}
                </Text>
              ))
            )}
          </View>
        ))}
      </View>

      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <Text style={styles.closeButtonText}>Close</Text>
      </TouchableOpacity>
    </CustomAnimatedModal>
  );
};

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.primaryText,
    flex: 1,
  },
  closeBtn: {
    padding: 4,
  },
  infoCard: {
    backgroundColor: Colors.white,
    borderRadius: 10,
    padding: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  infoTitle: {
    fontWeight: '500',
    fontSize: 15,
    color: Colors.primaryText,
    marginBottom: 4,
  },
  infoText: {
    color: Colors.secondaryText,
    fontSize: 13,
    marginBottom: 2,
  },
  closeButton: {
    backgroundColor: '#07624C',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default LedgerInformationModal;
