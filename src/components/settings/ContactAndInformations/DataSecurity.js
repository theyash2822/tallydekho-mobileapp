import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import Colors from '../../../utils/Colors';
import Header from '../../common/Header';
import Icon from 'react-native-vector-icons/Feather';
import CustomBottomButtons from '../../common/CustomBottomButtons';

// Reusable Security Setting Row Component
const SecuritySettingRow = ({setting, isEnabled, onToggle}) => (
  <View style={styles.settingRow}>
    {/* Text side (not clickable) */}
    <View style={styles.settingInfo}>
      <Text style={styles.settingLabel}>{setting.label}</Text>
      {setting.subtext && (
        <Text style={styles.settingSubtext}>{setting.subtext}</Text>
      )}
    </View>

    {/* Checkmark side (clickable only here) */}
    <TouchableOpacity onPress={() => onToggle(setting.key)} activeOpacity={0.7}>
      <View
        style={[
          styles.checkmarkContainer,
          isEnabled ? styles.checkmarkEnabled : styles.checkmarkDisabled,
        ]}>
        {isEnabled && <Icon name="check" size={16} color="#fff" />}
      </View>
    </TouchableOpacity>
  </View>
);

const DataSecurity = () => {
  const [saveState, setSaveState] = useState('save');

  // Security settings state
  const [securitySettings, setSecuritySettings] = useState({
    encryptDatabase: true,
    clearCacheOnLogout: true,
    allowOnlyHttps: true,
    anonymiseDeletedData: true,
    autoPurgeRecycleBin: true,
  });

  // Settings configuration data
  const settingsConfig = [
    {
      section: 'Data at rest',
      settings: [
        {
          key: 'encryptDatabase',
          label: 'Encrypt local database (AES-256)',
          // subtext: '(AES-256)',
        },
        {
          key: 'clearCacheOnLogout',
          label: 'Clear cache on logout',
        },
      ],
    },
    {
      section: 'Network',
      settings: [
        {
          key: 'allowOnlyHttps',
          label: 'Allow only HTTPS endpoints',
        },
      ],
    },
    {
      section: 'Data Retention',
      settings: [
        {
          key: 'anonymiseDeletedData',
          label: 'Anonymise deleted user data',
        },
        {
          key: 'autoPurgeRecycleBin',
          label: 'Auto-purge recycle bin after 30 days',
          // subtext: '30 days',
        },
      ],
    },
  ];

  const toggleSetting = settingKey => {
    setSecuritySettings(prev => ({
      ...prev,
      [settingKey]: !prev[settingKey],
    }));
  };

  const handleSave = async () => {
    setSaveState('saving');

    // Simulate API call
    setTimeout(() => {
      setSaveState('saved');
      Alert.alert('Success', 'Data security settings saved successfully');

      // Reset to save state after 2 seconds
      setTimeout(() => {
        setSaveState('save');
      }, 2000);
    }, 1500);
  };

  const handleCancel = () => {
    // Reset to original values
    setSecuritySettings({
      encryptDatabase: true,
      clearCacheOnLogout: true,
      allowOnlyHttps: true,
      anonymiseDeletedData: true,
      autoPurgeRecycleBin: true,
    });
    Alert.alert('Cancel', 'Changes discarded');
  };

  return (
    <View style={styles.container}>
      <Header title="Data Security" leftIcon="chevron-left" />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}>
        {/* Main Content Card */}
        <View style={styles.contentCard}>
          {settingsConfig.map((section, sectionIndex) => (
            <View key={sectionIndex} style={styles.section}>
              <Text style={styles.sectionTitle}>{section.section}</Text>

              {section.settings.map((setting, settingIndex) => (
                <SecuritySettingRow
                  key={setting.key}
                  setting={setting}
                  isEnabled={securitySettings[setting.key]}
                  onToggle={toggleSetting}
                />
              ))}
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Bottom Action Buttons */}
      <CustomBottomButtons
        onSave={handleSave}
        onCancel={handleCancel}
        saveState={saveState}
        saveButtonText="Save"
        cancelButtonText="Cancel"
        saveButtonColor="#07624C"
        cancelButtonColor="#F7F9FC"
        cancelTextColor="#374151"
        savingText="Saving..."
        savedText="Saved"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F5FA',
  },
  scrollView: {
    flex: 1,
  },
  contentCard: {
    backgroundColor: '#fff',
    marginHorizontal: 12,
    marginTop: 10,
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
  },
  section: {marginBottom: 8},
  sectionTitle: {
    fontSize: 14,
    fontWeight: '400',
    color: '#111111',
    marginBottom: 6,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  settingInfo: {
    flex: 1,
    marginRight: 12,
  },
  settingLabel: {
    fontSize: 12,
    color: '#8F939E',
    fontWeight: '400',
  },
  settingSubtext: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '400',
  },
  checkmarkContainer: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmarkEnabled: {
    backgroundColor: '#10B981',
  },
  checkmarkDisabled: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: Colors.border,
  },
});

export default DataSecurity;
