import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Colors from '../../../utils/Colors';
import CustomAnimatedModal from '../../common/CustomAnimatedModal';

const WhatsNewModal = ({visible, onClose}) => {
  const newFeatures = [
    {
      title: 'Data Entry (All Types)',
      description: 'Record and manage every kind of transaction with ease.',
    },
    {
      title: 'AI Insights & Reports',
      description: 'Get automated business intelligence and trend analysis.',
    },
    {
      title: 'Data Backup',
      description: 'Secure cloud backup for worry-free data protection.',
    },
    {
      title: 'E-Way Bill Integration',
      description: 'Generate and manage e-way bills directly from the app.',
    },
    {
      title: 'E-Invoicing Integration',
      description: 'Create and validate e-invoices seamlessly.',
    }
  ];

  return (
    <CustomAnimatedModal
      visible={visible}
      onClose={onClose}
      showCloseButton={false}
      scrollable={true}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>What's New?</Text>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Ionicons name="close" size={24} color="#6B7280" />
        </TouchableOpacity>
      </View>

      {/* App Info */}
      <View style={styles.appInfo}>
        <View style={styles.logoContainer}>
          <View style={styles.logo}>
            <View style={styles.logoCheckmark1} />
            <View style={styles.logoCheckmark2} />
          </View>
        </View>
        <Text style={styles.appName}>Tally Dekho</Text>
        <Text style={styles.version}>Version : 3.7.2 (build 257)</Text>
        <Text style={styles.releaseDate}>05 Jul 25</Text>
      </View>

      {/* Features List */}
      <View style={styles.featuresContainer}>
        {newFeatures.map((feature, index) => (
          <View key={index} style={styles.featureItem}>
            <View style={styles.checkmarkContainer}>
              <Ionicons name="checkmark" size={16} color="#10B981" />
            </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>{feature.title}</Text>
              <Text style={styles.featureDescription}>
                {feature.description}
              </Text>
            </View>
          </View>
        ))}
      </View>

      {/* Close Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.closeButtonStyle} onPress={onClose}>
          <Text style={styles.closeButtonText}>Close</Text>
        </TouchableOpacity>
      </View>
    </CustomAnimatedModal>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    marginBottom: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  closeButton: {
    padding: 4,
  },
  appInfo: {
    alignItems: 'center',
    marginBottom: 10,
  },
  logoContainer: {
    marginBottom: 12,
  },
  logo: {
    width: 48,
    height: 48,
    position: 'relative',
  },
  logoCheckmark1: {
    position: 'absolute',
    width: 24,
    height: 24,
    backgroundColor: '#10B981',
    borderRadius: 12,
    top: 0,
    left: 0,
  },
  logoCheckmark2: {
    position: 'absolute',
    width: 24,
    height: 24,
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    bottom: 0,
    right: 0,
  },
  appName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  version: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
    marginBottom: 4,
  },
  releaseDate: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  featuresContainer: {
    marginBottom: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  checkmarkContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#111111',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 12,
    color: '#494D58',
    fontWeight: '400',
    lineHeight: 20,
  },
  buttonContainer: {
    marginTop: 16,
    marginBottom: 8,
  },
  closeButtonStyle: {
    backgroundColor: '#07624C',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default WhatsNewModal;
