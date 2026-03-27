import React, { useState, useEffect } from 'react';
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
import WhatsNewModal from './WhatsNewModal';
import DeviceInfo from 'react-native-device-info';

const AboutVersions = () => {
  const [blockScreenCapture, setBlockScreenCapture] = useState(false);
  const [shredTempFiles, setShredTempFiles] = useState(false);
  const [showWhatsNewModal, setShowWhatsNewModal] = useState(false);

  const [deviceName, setDeviceName] = useState('');
  const [applicationName, setApplicationName] = useState('');

  // useEffect(() => {
  //   const fetchDeviceName = async () => {
  //     const name = await DeviceInfo.getDeviceName();
  //     setDeviceName(name);
  //   };
  //   fetchDeviceName();
  //   const fetchAppName = async () => {
  //     const appName = await DeviceInfo.getApplicationName();
  //     setApplicationName(appName);
  //   };
  //   fetchAppName();
  // }, []);

  useEffect(() => {
    const loadDeviceInfo = async () => {
      const name = await DeviceInfo.getDeviceName();
      const appName = DeviceInfo.getApplicationName();

      setDeviceName(name);
      setApplicationName(appName);
    };

    loadDeviceInfo();
  }, []);


  const handleCopyDiagnostics = () => {
    Alert.alert('Success', 'Diagnostics copied to clipboard');
  };

  const handleSendLogsToDev = () => {
    Alert.alert('Success', 'Logs sent to developer');
  };

  const toggleBlockScreenCapture = () => {
    setBlockScreenCapture(!blockScreenCapture);
  };

  const toggleShredTempFiles = () => {
    setShredTempFiles(!shredTempFiles);
  };

  return (
    <>
      <View style={styles.container}>
        <Header title="About & Versions" leftIcon="chevron-left" />

        <View style={styles.scrollView}>
          {/* Main Content Card */}
          <View style={styles.contentCard}>
            {/* Environment Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Environment</Text>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Device:</Text>
                <Text style={styles.infoValue}>{deviceName}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>App ID:</Text>
                <Text style={styles.infoValue}>{applicationName}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Current user:</Text>
                <Text style={styles.infoValue}>rajesh@maarujitech.in</Text>
              </View>
            </View>

            {/* Debug Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Debug</Text>

              <TouchableOpacity
                style={styles.button}
                onPress={handleCopyDiagnostics}>
                <Text style={styles.buttonText}>Copy diagnostics</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.button}
                onPress={handleSendLogsToDev}>
                <Text style={styles.buttonText}>Send logs to dev</Text>
              </TouchableOpacity>

              <View style={styles.checkboxRow}>
                <TouchableOpacity onPress={toggleBlockScreenCapture}>
                  <View
                    style={[
                      styles.checkbox,
                      blockScreenCapture && styles.checkboxChecked,
                    ]}>
                    {blockScreenCapture && (
                      <Icon name="check" size={16} color={Colors.white} />
                    )}
                  </View>
                </TouchableOpacity>
                <Text style={styles.checkboxLabel}>Block screen capture</Text>
              </View>

              <View style={styles.checkboxRow}>
                <TouchableOpacity onPress={toggleShredTempFiles}>
                  <View
                    style={[
                      styles.checkbox,
                      shredTempFiles && styles.checkboxChecked,
                    ]}>
                    {shredTempFiles && (
                      <Icon name="check" size={16} color={Colors.white} />
                    )}
                  </View>
                </TouchableOpacity>
                <Text style={styles.checkboxLabel}>Shred temp files</Text>
              </View>
            </View>
          </View>
        </View>
        <View style={styles.appInfoContainer}>
          <Text style={styles.appName}>Tally Dekho</Text>
          <Text style={styles.appVersion}>Version : 3.7.2 (build 257)</Text>
          <Text style={styles.appDate}>05 Jul 25</Text>

          <TouchableOpacity
            style={styles.whatsNewLink}
            onPress={() => setShowWhatsNewModal(true)}>
            <Text style={styles.whatsNewText}>What's new?</Text>
          </TouchableOpacity>
        </View>

        {/* Footer Links */}
        <View style={styles.footerLinks}>
          <TouchableOpacity>
            <Text style={styles.footerLink}>Terms of Service</Text>
          </TouchableOpacity>
          <Text style={styles.footerSeparator}>•</Text>
          <TouchableOpacity>
            <Text style={styles.footerLink}>Privacy Policy</Text>
          </TouchableOpacity>
          <Text style={styles.footerSeparator}>•</Text>
          <TouchableOpacity>
            <Text style={styles.footerLink}>Licences (OSS)</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* WhatsNew Modal */}
      <WhatsNewModal
        visible={showWhatsNewModal}
        onClose={() => setShowWhatsNewModal(false)}
      />
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
  },
  contentCard: {
    backgroundColor: '#fff',
    marginHorizontal: 12,
    marginTop: 10,
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  section: {
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  infoLabel: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '400',
  },
  infoValue: {
    fontSize: 14,
    color: '#111827',
    fontWeight: '500',
  },
  button: {
    backgroundColor: '#F7F9FC',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginBottom: 6,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: Colors.border,
    borderRadius: 4,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  checkboxLabel: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '400',
  },
  appInfoContainer: {
    alignItems: 'center',
    marginTop: 100,
    marginBottom: 20,
  },
  appName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  appVersion: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
    marginBottom: 4,
  },
  appDate: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
    marginBottom: 12,
  },
  whatsNewLink: {
    paddingHorizontal: 12,
  },
  whatsNewText: {
    fontSize: 16,
    color: '#10B981',
    fontWeight: '600',
  },
  footerLinks: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 20,
    backgroundColor: "#F4F5FA"
  },
  footerLink: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '400',
  },
  footerSeparator: {
    fontSize: 14,
    color: '#6B7280',
    marginHorizontal: 12,
  },
});

export default AboutVersions;
