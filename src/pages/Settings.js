import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import Header from '../components/common/Header';
import Colors from '../utils/Colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { navigateNext } from '../navigation/FlowController';
import wsService from '../services/websocket/websocketService';
import { clearSession } from '../utils/sessionManager';
import { Icons } from '../utils/Icons';


const SettingsScreen = () => {
  const navigation = useNavigation();
  const [expandedSections, setExpandedSections] = useState({});

  const settingsData = [
    {
      id: 'account',
      title: 'Account & Organizations',
      icon: Icons.Account,
      subOptions: [
        { id: '1', name: 'Profile', icon: Icons.Profile, screen: 'profile' },
        {
          id: '2',
          name: 'Company Information',
          icon: Icons.CompanyInformation,
          screen: 'companyInformation',
        },
        {
          id: '3',
          name: 'License',
          icon: Icons.License,
          screen: 'license',
          // screen: 'scanner',
        },
      ],
    },
    {
      id: 'preferences',
      title: 'Preferences',
      icon: Icons.Preferences,
      subOptions: [
        {
          id: '5',
          name: 'Language & Region',
          icon: Icons.Language,
          screen: 'languageRegion',
        },
        {
          id: '6',
          name: 'Currency & Number Format',
          icon: Icons.Currency,
          screen: 'currencyNumberFormat',
        },
        {
          id: '7',
          name: 'Voucher Configuration',
          icon: Icons.Voucher,
          screen: 'VoucherConfig',
          // screen: 'dummyscreen',
        },
      ],
    },
    {
      id: 'notifications',
      title: 'Notifications',
      icon: Icons.Notification,
      subOptions: [
        {
          id: '9',
          name: 'Channels & Quiet Hours',
          icon: Icons.QuietHours,
          screen: 'NotificationChannels',
        },
        {
          id: '10',
          name: 'Low Stock & Expiry Alerts',
          icon: Icons.ExpiryAlert,
          screen: 'StockAlerts',
        },
        {
          id: '11',
          name: 'Compliance Reminders',
          icon: Icons.ComplianceReminder,
          screen: 'ComplianceReminders',
        },
        {
          id: '12',
          name: 'Payment Reminder',
          icon: Icons.PaymentReminder,
          screen: 'PaymentReminders',
        },
      ],
    },
    {
      id: 'integrations',
      title: 'Integrations',
      icon: Icons.Integration,
      subOptions: [
        {
          id: '13',
          name: 'Tally Prime Sync',
          icon: Icons.TallyerpSync,
          screen: 'tallyerp',
        },
        {
          id: '14',
          name: 'Bank Feeds',
          icon: Icons.BankFeeds,
          screen: 'BankFeeds',
        },
        {
          id: '15',
          name: 'E-way Bill',
          icon: Icons.EwayBill2,
          screen: 'eWayBill',
        },
        {
          id: '16',
          name: 'E-invoicing',
          icon: Icons.EInvoicing2,
          screen: 'EInvoice',
        },
      ],
    },
    {
      id: 'contact',
      title: 'Contact & Information',
      icon: Icons.Contact,
      subOptions: [
        {
          id: '17',
          name: 'About & Versions',
          icon: Icons.Version,
          screen: 'AboutVersions',
        },
        {
          id: '18',
          name: 'Data Security',
          icon: Icons.Security,
          screen: 'DataSecurity',
        },
        { id: '19', name: 'Support', icon: Icons.Support, screen: 'SupportOld' },
      ],
    },
  ];

  const toggleSection = sectionId => {
    setExpandedSections(prev => {
      // If the clicked section is already expanded, close it
      if (prev[sectionId]) {
        return {};
      }
      // Otherwise, close all sections and open only the clicked one
      return {
        [sectionId]: true,
      };
    });
  };

  const handleNavigation = screenName => {
    if (screenName) {
      navigation.navigate(screenName);
    } else {
      console.warn('No screen defined for this option');
    }
  };

  const handleLogout = async () => {
    try {
      // Disconnect WebSocket and notify server that this was a manual logout
      wsService.disconnect({ reason: 'manual' });

      // Clear session
      await clearSession();
      await AsyncStorage.setItem('loggedOut', 'true');
      await navigateNext(navigation, 'LOGOUT');
    } catch (e) {
      navigation.reset({
        index: 0,
        routes: [{ name: 'login' }],
      });
    }
  };

  // Helper function to render icon (supports both SVG and string icon names)
  const renderIcon = (icon, size = 20, color = "#8797C3") => {
    // Check if icon is an SVG component (has a render method or is a function/component)
    if (typeof icon === 'function' || (icon && typeof icon !== 'string')) {
      // It's an SVG component, render it directly
      const SvgIcon = icon;
      return <SvgIcon width={size} height={size} />;
    }
    // It's a string icon name, use Feather icon
    return <Icon name={icon} size={size} color={color} />;
  };

  const renderSectionHeader = section => (
    <TouchableOpacity
      style={styles.sectionHeader}
      onPress={() => toggleSection(section.id)}
      activeOpacity={0.7}>
      <View style={styles.sectionLeft}>
        <View style={styles.iconContainer}>
          {renderIcon(section.icon)}
        </View>
        <Text style={styles.sectionTitle}>{section.title}</Text>
      </View>
      <Icon
        name={expandedSections[section.id] ? 'chevron-up' : 'chevron-down'}
        size={20}
        color="#6F7C97"
      />
    </TouchableOpacity>
  );

  const renderSubOption = (option, index, totalOptions) => (
    <TouchableOpacity
      key={option.id}
      style={[
        styles.subOption,
        index !== totalOptions - 1 && styles.subOptionWithBorder,
      ]}
      onPress={() => handleNavigation(option.screen)}
      activeOpacity={0.7}>
      <View style={styles.subOptionLeft}>
        <View style={styles.subOptionIcon}>
          {renderIcon(option.icon, 16)}
        </View>
        <Text style={styles.subOptionText}>{option.name}</Text>
      </View>
      {/* <Icon name="chevron-right" size={16} color="#6F7C97" /> */}
    </TouchableOpacity>
  );

  const renderSection = section => (
    <View key={section.id} style={styles.sectionContainer}>
      {renderSectionHeader(section)}

      {expandedSections[section.id] && (
        <View style={styles.subOptionsContainer}>
          {section.subOptions.map((option, index) =>
            renderSubOption(option, index, section.subOptions.length),
          )}
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <Header title="Settings" leftIcon="chevron-left" />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        {/* Settings Sections */}
        <View style={styles.settingsContainer}>
          {settingsData.map(renderSection)}
        </View>

        {/* Made in India Section */}
        <View style={styles.madeInIndiaContainer}>
          <View style={styles.flagContainer}>
            <Image
              source={require('../assets/Flag.png')}
              style={{ height: 25, width: 40, borderRadius: 3 }}
            />
            {/* <Flag width={70} height={45} /> */}
          </View>

          <View style={styles.dividerContainer}>
            <View style={styles.dividerLine} />
            <Text style={styles.madeInIndiaText}>
              Made in <Text style={{ fontWeight: 800 }}>India</Text> with Love
            </Text>
            <View style={styles.dividerLine} />
          </View>

          <TouchableOpacity
            style={styles.logoutButton}
            onPress={() => handleLogout()}>
            <Icon name="log-out" size={16} color="#EF4444" />
            <Text style={styles.logoutText}>Log out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
    padding: 10,
    minHeight: '91%',
    flex: 1,
    justifyContent: 'space-between',
  },
  settingsContainer: {
    flex: 1,
  },
  sectionContainer: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    marginBottom: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: Colors.white,
  },
  sectionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F4F5FA',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primaryTitle,
    flex: 1,
  },
  subOptionsContainer: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  subOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
    paddingHorizontal: 12,
  },
  subOptionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  subOptionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F4F5FA',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  subOptionText: {
    fontSize: 14,
    color: Colors.secondaryText,
    fontWeight: '500',
  },
  subOptionWithBorder: {},
  madeInIndiaContainer: {
    alignItems: 'center',
    dispaly: 'flex',
    gap: 10,
  },
  flagContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '75%',
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E5E5',
  },
  madeInIndiaText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.primaryTitle,
    marginHorizontal: 10,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    // justifyContent: 'center',
    backgroundColor: '#FEE2E2',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FCA5A5',
    marginBottom: 10
  },
  logoutText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#EF4444',
    marginLeft: 4,
  },
});

export default SettingsScreen;
