import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import Colors from '../../../utils/Colors';
import Header from '../../common/Header';
import CustomBottomButtons from '../../common/CustomBottomButtons';
import {Checkbox, NumberInput} from '../../Helper/HelperComponents';

const ComplianceReminders = () => {
  const navigation = useNavigation();
  const [saveStatus, setSaveStatus] = useState('save'); // 'save', 'saving', 'saved'
  const [gst, setGst] = useState({
    gstr1Filing: 3,
    gstr3bFiling: 3,
    autoPause: true,
    channels: {
      push: true,
      email: false,
      whatsapp: false,
      sms: false,
    },
  });
  const [eInvoice, setEInvoice] = useState({
    irnErrorDigest: 3,
    channels: {
      push: true,
      email: false,
      whatsapp: false,
      sms: false,
    },
  });
  const [eWayBill, setEWayBill] = useState({
    expiryReminder: 4,
    channels: {
      push: true,
      email: false,
      whatsapp: false,
      sms: false,
    },
  });
  const [otherTaxes, setOtherTaxes] = useState({
    tdsPayment: 3,
    vatReturn: 3,
    channels: {
      push: true,
      email: false,
      whatsapp: false,
      sms: false,
    },
  });

  const updateNumberInput = (section, field, increment) => {
    const newValue = section[field] + increment;
    if (newValue >= 0) {
      if (section === gst) {
        setGst(prev => ({...prev, [field]: newValue}));
      } else if (section === eInvoice) {
        setEInvoice(prev => ({...prev, [field]: newValue}));
      } else if (section === eWayBill) {
        setEWayBill(prev => ({...prev, [field]: newValue}));
      } else if (section === otherTaxes) {
        setOtherTaxes(prev => ({...prev, [field]: newValue}));
      }
    }
  };

  const toggleChannel = (section, channel) => {
    if (section === 'gst') {
      setGst(prev => ({
        ...prev,
        channels: {
          ...prev.channels,
          [channel]: !prev.channels[channel],
        },
      }));
    } else if (section === 'eInvoice') {
      setEInvoice(prev => ({
        ...prev,
        channels: {
          ...prev.channels,
          [channel]: !prev.channels[channel],
        },
      }));
    } else if (section === 'eWayBill') {
      setEWayBill(prev => ({
        ...prev,
        channels: {
          ...prev.channels,
          [channel]: !prev.channels[channel],
        },
      }));
    } else if (section === 'otherTaxes') {
      setOtherTaxes(prev => ({
        ...prev,
        channels: {
          ...prev.channels,
          [channel]: !prev.channels[channel],
        },
      }));
    }
  };

  const handleSave = async () => {
    setSaveStatus('saving');

    // Simulate API call
    setTimeout(() => {
      setSaveStatus('saved');

      // Reset to 'save' after 2 seconds
      setTimeout(() => {
        setSaveStatus('save');
      }, 2000);
    }, 1500);
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  const renderChannelToggles = (section, sectionKey) => {
    const channels = section.channels;
    const channelOptions = ['push', 'email', 'whatsapp', 'sms'];

    return (
      <View style={styles.channelsSection}>
        <Text style={styles.channelsLabel}>Channel</Text>
        <View style={styles.channelToggles}>
          {channelOptions.map(channel => (
            <Checkbox
              key={channel}
              checked={channels[channel]}
              onPress={() => toggleChannel(sectionKey, channel)}
              label={channel.charAt(0).toUpperCase() + channel.slice(1)}
              style={{marginBottom: 0}}
            />
          ))}
        </View>
      </View>
    );
  };

  const renderNumberInput = (section, field, label, unit) => {
    const handleValueChange = (value) => {
      if (section === gst) {
        setGst(prev => ({...prev, [field]: value}));
      } else if (section === eInvoice) {
        setEInvoice(prev => ({...prev, [field]: value}));
      } else if (section === eWayBill) {
        setEWayBill(prev => ({...prev, [field]: value}));
      } else if (section === otherTaxes) {
        setOtherTaxes(prev => ({...prev, [field]: value}));
      }
    };

    return (
      <View style={styles.numberInputSection}>
        <Text style={styles.numberInputLabel}>{label}</Text>
        <NumberInput
          value={section[field]}
          onIncrement={() => updateNumberInput(section, field, 1)}
          onDecrement={() => updateNumberInput(section, field, -1)}
          onChangeText={handleValueChange}
        />
        <Text style={styles.numberUnit}>{unit}</Text>
      </View>
    );
  };

  return (
    <>
      <Header
        title="Compliance Reminders"
        leftIcon="chevron-left"
        onLeftPress={() => navigation.goBack()}
      />
      <View style={styles.container}>
        {/* <StatusBar barStyle="dark-content" backgroundColor={Colors.white} /> */}
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}>
          {/* GST Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>GST</Text>

            <View style={styles.rowContainer}>
              {renderNumberInput(
                gst,
                'gstr1Filing',
                'GSTR-1 filing',
                'Days before due',
              )}
              {renderNumberInput(
                gst,
                'gstr3bFiling',
                'GSTR-3B filing',
                'Days before due',
              )}
            </View>
            <Text style={styles.channelsLabel}>Auto-pause</Text>
            <Checkbox
              checked={gst.autoPause}
              onPress={() =>
                setGst(prev => ({...prev, autoPause: !prev.autoPause}))
              }
              label="If No Sales"
            />

            {renderChannelToggles(gst, 'gst')}

            {/* E-Invoice Section */}
            <View style={styles.box}>
              <View style={{marginTop: 20}}>
                <Text style={styles.sectionTitle}>E-Invoice</Text>

                {renderNumberInput(
                  eInvoice,
                  'irnErrorDigest',
                  'IRN error digest',
                  'Days before due',
                )}

                {renderChannelToggles(eInvoice, 'eInvoice')}
              </View>
            </View>

            {/* E-Way Bill Section */}
            <View style={styles.box}>
              <View style={{marginTop: 20}}>
                <Text style={styles.sectionTitle}>E-Way Bill</Text>

                {renderNumberInput(
                  eWayBill,
                  'expiryReminder',
                  'Expiry reminder',
                  'Before validity end',
                )}

                {renderChannelToggles(eWayBill, 'eWayBill')}
              </View>
            </View>
            {/* Other Taxes Section */}
            <View style={styles.box}>
              <View style={{marginTop: 20}}>
                <Text style={styles.sectionTitle}>Other Taxes</Text>

                <View style={styles.rowContainer}>
                  {renderNumberInput(
                    otherTaxes,
                    'tdsPayment',
                    'TDS payment',
                    'Days before 7th',
                  )}
                  {renderNumberInput(
                    otherTaxes,
                    'vatReturn',
                    'VAT return',
                    'Days before due',
                  )}
                </View>
              </View>

              {renderChannelToggles(otherTaxes, 'otherTaxes')}
            </View>
          </View>
        </ScrollView>

        {/* Bottom Action Buttons */}
        <CustomBottomButtons
          onSave={handleSave}
          onCancel={handleCancel}
          saveState={saveStatus}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F5FA',
  },
  scrollView: {
    flex: 1,
    padding: 12,
  },
  scrollContent: {
    paddingBottom: 12, // Add padding to the bottom of the scroll content
  },

  // Section styles
  section: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111111',
    marginBottom: 12,
  },
  box: {
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    marginTop: 20,
  },

  // Number input styles
  numberInputSection: {
    flex: 1,
  },
  numberInputLabel: {
    fontSize: 12,
    color: '#8F939E',
    fontWeight: '400',
    marginBottom: 12,
  },
  numberUnit: {
    fontSize: 12,
    color: '#667085',
    fontWeight: '400',
    marginTop: 4,
  },

  // Channel styles
  channelsSection: {
    marginTop: 8,
  },
  channelsLabel: {
    fontSize: 12,
    color: '#8F939E',
    fontWeight: '400',
    marginBottom: 12,
  },
  channelToggles: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },

  // Row container for side-by-side inputs
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 12,
  },
});

export default ComplianceReminders;
