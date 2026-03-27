import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
  Linking,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import Header from '../../common/Header';
import Colors from '../../../utils/Colors';
import BuyCreditModal from './Components/BuyCreditModal';
import MultiUserAccessModal from './Components/MultiUserAccessModal';
import { Checkbox } from '../../Helper/HelperComponents';
import { Icons } from '../../../utils/Icons';

const LicenseScreen = () => {
  const navigation = useNavigation();
  const [creditPreferences, setCreditPreferences] = useState({
    email: true,
    whatsapp: false,
    sms: false,
  });
  const [isBuyCreditModalVisible, setIsBuyCreditModalVisible] = useState(false);
  const [selectedCreditOption, setSelectedCreditOption] = useState('500');
  const [isMultiUserAccessModalVisible, setIsMultiUserAccessModalVisible] =
    useState(false);

  const togglePreference = key => {
    setCreditPreferences(prev => {
      if (prev[key] === true) {
        return { ...prev, [key]: false };
      } else {
        return { ...prev, [key]: true };
      }
    });
  };

  const handleBuyCredit = async () => {
    if (Platform.OS === 'ios') {
      // For iOS, open website
      const url = 'https://www.tallydekho.com/tally-pricing-plans.html'; // Replace with your actual URL
      try {
        const supported = await Linking.canOpenURL(url);
        if (supported) {
          await Linking.openURL(url);
        } else {
          Alert.alert('Error', 'Cannot open the website');
        }
      } catch (error) {
        Alert.alert('Error', 'Failed to open website');
      }
    } else {
      // For Android, show modal
      setIsBuyCreditModalVisible(true);
    }
  };

  const closeBuyCreditModal = () => {
    setIsBuyCreditModalVisible(false);
  };

  const handleCreditOptionSelect = option => {
    setSelectedCreditOption(option);
  };

  const handleBuyNow = () => {
    // Handle purchase logic here
    closeBuyCreditModal();
  };

  const handleAddSeat = () => {
    setIsMultiUserAccessModalVisible(true);
  };

  const handleAddTeamSeat = () => {
    setIsMultiUserAccessModalVisible(true);
  };

  const handleNotifyMe = () => {
    // Handle notification signup logic here
    setIsMultiUserAccessModalVisible(false);
  };

  const purchaseHistoryData = [
    { invoice: 'INV-2025-0710-001', date: '23 July 20', amount: 0, description: 'Single User' },
    { invoice: 'INV-2025-0710-002', date: '22 July 20', amount: 2000, description: '100 Credits' },
    { invoice: 'INV-2025-0710-003', date: '21 July 20', amount: 0, description: 'Single User' },
  ];

  return (
    <View style={styles.container}>
      <Header title="License" leftIcon="chevron-left" />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        {/* Free Forever Card */}
        <View style={styles.freeForeverCard}>
          <Text style={styles.freeForeverTitle}>Free Forever</Text>

          <View style={styles.pricingContainer}>
            <Text style={styles.pricingSymbol}>₹</Text>
            <Text style={styles.pricingSymbol}>0</Text>
            <Text style={styles.pricingSymbol}>/-</Text>
          </View>

          <View style={styles.featuresContainer}>
            <View style={styles.featuresColumn}>
              <View style={styles.featureItem}>
                <View style={styles.checkmarkContainer}>
                  <Icons.Check height={18} width={18} />
                </View>
                <Text style={styles.featureText}>All-in-One Data Entry</Text>
              </View>
              <View style={styles.featureItem}>
                <View style={styles.checkmarkContainer}>
                  <Icons.Check height={18} width={18} />
                </View>
                <Text style={styles.featureText}>AI insight and reports</Text>
              </View>
              <View style={styles.featureItem}>
                <View style={styles.checkmarkContainer}>
                  <Icons.Check height={18} width={18} />
                </View>
                <Text style={styles.featureText}>E-Way Bill</Text>
              </View>
            </View>

            <View style={styles.featuresColumn1}>
              <View style={{ gap: 8, }}>
                <View style={styles.featureItem}>
                  <View style={styles.checkmarkContainer}>
                    <Icons.Check height={18} width={18} />
                  </View>
                  <Text style={styles.featureText}>Secure Data Backup</Text>
                </View>
                <View style={styles.featureItem}>
                  <View style={styles.checkmarkContainer}>
                    <Icons.Check height={18} width={18} />
                  </View>
                  <Text style={styles.featureText}>E-Invoicing</Text>
                </View>
                <View style={styles.featureItem}>
                  <View style={styles.checkmarkContainer}>
                    <Icons.Check height={18} width={18} />
                  </View>
                  <Text style={styles.featureText}>Multi-Warehouse</Text>
                </View>
              </View>

            </View>
          </View>
        </View>

        {/* Outer Container */}
        <View style={styles.outerContainer}>
          {/* Inner Box with Plan, Seats, etc. */}
          <View style={styles.innerBox}>
            {/* Plan Information */}
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Plan</Text>
              <Text style={styles.infoValue}>Free - 1 (1/1 Users)</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Seats</Text>
              <View style={styles.seatContainer}>
                <Text style={styles.infoValue}>1 Seat</Text>
                <TouchableOpacity
                  style={styles.addButton}
                  onPress={handleAddSeat}>
                  <Icon name="plus" size={16} color="#667085" />
                  <Text style={styles.addButtonText}>Add</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Notification Credits</Text>
              <Text style={styles.infoValue}>28/200 Available</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Expires</Text>
              <Text style={styles.infoValue}>Never</Text>
            </View>

            {/* Buy Credit Button */}
            <View style={styles.buyCreditContainer}>
              <TouchableOpacity
                style={styles.buyCreditButton}
                onPress={handleBuyCredit}>
                <Text style={styles.buyCreditText}>Buy Credit</Text>
                <Icon name="chevron-right" size={16} color={Colors.white} />
              </TouchableOpacity>
            </View>

            {/* Team Seats */}
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Team Seats</Text>
              <View style={styles.seatContainer}>
                <Text style={styles.infoValue}>1 Seat</Text>
                <TouchableOpacity
                  style={styles.addButton}
                  onPress={handleAddTeamSeat}>
                  <Icon name="plus" size={16} color="#667085" />
                  <Text style={styles.addButtonText}>Add</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Use Credits For Section - All in same row */}
          <View style={styles.creditsSection}>
            <Text style={styles.creditsSectionTitle}>Use Credits For</Text>

            <View style={styles.preferencesRow}>
              <Checkbox
                checked={creditPreferences.email}
                onPress={() => togglePreference('email')}
                label="Email"
                style={styles.preferenceCheckbox}
              />
              <Checkbox
                checked={creditPreferences.whatsapp}
                onPress={() => togglePreference('whatsapp')}
                label="WhatsApp"
                style={styles.preferenceCheckbox}
              />
              <Checkbox
                checked={creditPreferences.sms}
                onPress={() => togglePreference('sms')}
                label="SMS"
                style={styles.preferenceCheckbox}
              />
            </View>
          </View>

          {/* Purchase History - at bottom of License screen */}
          <View style={styles.purchaseHistorySection}>
            <Text style={styles.purchaseHistoryTitle}>Purchase History</Text>
            {purchaseHistoryData.map(item => (
              <View key={item.invoice} style={styles.purchaseItem}>
                <Icon name="file-text" size={20} color="#9CA3AF" />
                <View style={styles.purchaseInfo}>
                  <Text style={styles.invoiceNumber}>{item.invoice}</Text>
                  <Text style={styles.purchaseDate}>{item.date}</Text>
                </View>
                <View style={styles.purchaseAmount}>
                  <Text style={styles.amount}>₹{item.amount.toFixed(2)}</Text>
                  <Text style={styles.purchaseDescription}>{item.description}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Buy Credit Modal - Only show on Android */}
      {Platform.OS === 'android' && (
        <BuyCreditModal
          visible={isBuyCreditModalVisible}
          onClose={closeBuyCreditModal}
          selectedCreditOption={selectedCreditOption}
          onCreditOptionSelect={handleCreditOptionSelect}
          onBuyNow={handleBuyNow}
        />
      )}

      {/* Multi User Access Modal */}
      <MultiUserAccessModal
        visible={isMultiUserAccessModalVisible}
        onClose={() => setIsMultiUserAccessModalVisible(false)}
        onNotify={handleNotifyMe}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundColorPrimary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 12,
    paddingTop: 8,
  },
  outerContainer: {
    backgroundColor: Colors.white,
    padding: 12,
    marginTop: 4,
    paddingBottom: 10
  },
  innerBox: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  freeForeverCard: {
    backgroundColor: Colors.white,
    padding: 12,
    marginBottom: 4,
  },
  freeForeverTitle: {
    fontSize: 36,
    fontWeight: '700',
    color: '#07624C',
    textAlign: 'center',
  },
  pricingContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
  },
  pricingSymbol: {
    fontSize: 60,
    fontWeight: '600',
    color: '#10B981',
  },
  featuresContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,

    width: '100%',
  },
  featuresColumn: {
    flex: 1,
    gap: 8,
  },
  featuresColumn1: {
    flex: 1,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 0
  },
  featureText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#111827',
    flex: 1,
    marginLeft: 4
  },
  checkmarkContainer: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '400',
    color: '#667085',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111111',
  },
  seatContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#667085',
  },
  buyCreditContainer: {
    // paddingVertical: 10,
  },
  buyCreditButton: {
    backgroundColor: '#07624C',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
    marginTop: 4,
  },
  buyCreditText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.white,
  },
  creditsSection: {
    marginTop: 10,
  },
  creditsSectionTitle: {
    fontSize: 14,
    fontWeight: '400',
    color: '#667085',
    marginBottom: 12,
    marginTop: 6,
  },
  preferencesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 18,
  },
  preferenceCheckbox: {
    marginBottom: 2,
  },
  purchaseHistorySection: {
    marginTop: 6,
    paddingTop: 8,
  },
  purchaseHistoryTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  purchaseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: '#fff',
  },
  purchaseInfo: {
    flex: 1,
    marginLeft: 12,
  },
  invoiceNumber: {
    fontSize: 12,
    fontWeight: '600',
    color: '#111111',
    marginBottom: 2,
  },
  purchaseDate: {
    fontSize: 10,
    color: '#8F939E',
  },
  purchaseAmount: {
    alignItems: 'flex-end',
  },
  amount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111111',
    marginBottom: 2,
  },
  purchaseDescription: {
    fontSize: 10,
    color: '#8F939E',
  },
});

export default LicenseScreen;
