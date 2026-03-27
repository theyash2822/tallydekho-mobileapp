import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import Colors from '../../utils/Colors';
import { useAuth } from '../../hooks/useAuth';
import apiService from '../../services/api/apiService';
import { Logger } from '../../services/utils/logger';
import ShimmerPlaceholder from '../common/ShimmerPlaceholder';

const DashboardHeader = ({ openDropdown, onDropdownToggle }) => {
  const {
    companies,
    loading,
    error,
    selectedCompany,
    setSelectedCompany,
    saveGuid,
    setCompanies,
  } = useAuth();

  const navigation = useNavigation();

  // Use shared dropdown state
  const dropdownVisible = openDropdown === 'company';

  useEffect(() => {
    if (companies.length > 0 && !selectedCompany) {
      setSelectedCompany(companies[0]);
      saveGuid(companies[0].id);
    }
  }, [companies]);

  // ✅ Fetch pairing details with new API service (cached for better performance)
  useEffect(() => {
    const fetchPairing = async () => {
      try {
        Logger.info('Fetching pairing details in dashboard header');
        const response = await apiService.fetchPairingDetails();
        Logger.debug('Pairing details received', {
          deviceCode: response?.data?.device?.code,
          lastSync: response?.data?.device?.lastSync,
        });
      } catch (err) {
        Logger.error('Failed to fetch pairing details', err);
        // Better error handling with new API service
        if (err.isNetworkError) {
          Logger.warn('Network unavailable - pairing check skipped');
        } else if (
          err.isUnauthorized ||
          err.statusCode === 401 ||
          err.message?.includes('Session expired')
        ) {
          Logger.warn(
            'Unauthorized - Device was unpaired, showing alert and clearing companies',
          );

          // Check if alert was already shown (stored in AsyncStorage to prevent duplicates)
          const alertShown = await AsyncStorage.getItem(
            'deviceUnpairedAlertShown',
          );

          if (alertShown !== 'true') {
            // Mark alert as shown
            await AsyncStorage.setItem('deviceUnpairedAlertShown', 'true');

            // Show "Device Unpaired" alert on Dashboard
            Alert.alert(
              'Device Unpaired',
              'Your device has been unpaired. You will need to pair again to continue.',
              [
                {
                  text: 'OK',
                  onPress: async () => {
                    // Unpair device and clear companies
                    await AsyncStorage.removeItem('pairedDevice');
                    await AsyncStorage.setItem('isPaired', 'false');
                    await AsyncStorage.removeItem('authToken');
                    await AsyncStorage.removeItem('cachedCompanies');
                    await AsyncStorage.removeItem('hasFetchedCompanies');

                    // Clear companies from context
                    if (setCompanies) {
                      setCompanies([]);
                    }

                    // Reset alert flag after delay
                    setTimeout(async () => {
                      await AsyncStorage.removeItem('deviceUnpairedAlertShown');
                    }, 5000);

                    Logger.info(
                      'Device unpaired and companies cleared due to 401 in header',
                    );
                  },
                },
              ],
              { cancelable: false },
            );
          } else {
            // Alert already shown, just unpair silently
            await AsyncStorage.removeItem('pairedDevice');
            await AsyncStorage.setItem('isPaired', 'false');
            await AsyncStorage.removeItem('authToken');
            await AsyncStorage.removeItem('cachedCompanies');
            await AsyncStorage.removeItem('hasFetchedCompanies');

            // Clear companies from context
            if (setCompanies) {
              setCompanies([]);
            }

            Logger.info(
              'Device unpaired and companies cleared due to 401 in header (silent)',
            );
          }
        }
      }
    };

    fetchPairing();
  }, [setCompanies]);

  const toggleDropdown = () => {
    onDropdownToggle?.('company');
  };

  const selectCompany = company => {
    setSelectedCompany(company);
    saveGuid(company.id);
    onDropdownToggle?.(null); // Close dropdown after selection
  };

  return (
    <View style={styles.header}>
      {/* Company Selector (Left Side) */}
      <View style={styles.logoContainer}>
        {loading ? (
          <View style={styles.shimmerContainer}>
            <ShimmerPlaceholder width={150} height={20} borderRadius={4} />
          </View>
        ) : error || !companies.length ? (
          <TouchableOpacity style={styles.logoWrapper}>
            <Text style={styles.errorText}>
              {error || 'No companies available'}
            </Text>
            {/* <TouchableOpacity onPress={console.log('-----')}>
              <View style={{marginLeft: 10}}>
                <Icon name="refresh-cw" size={18} color="#FF6B6B" />
              </View>
            </TouchableOpacity> */}
          </TouchableOpacity>
        ) : (
          <>
            <TouchableOpacity
              onPress={toggleDropdown}
              style={styles.logoWrapper}>
              <Text style={styles.appName} numberOfLines={1}>
                {selectedCompany?.name}
              </Text>
              <Icon
                name={dropdownVisible ? 'chevron-up' : 'chevron-down'}
                size={22}
                color="#898E9A"
              />
            </TouchableOpacity>

            {dropdownVisible && (
              <View style={styles.dropdown}>
                <FlatList
                  data={companies}
                  keyExtractor={item => item.id}
                  scrollEnabled={false}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={[
                        styles.dropdownItem,
                        selectedCompany?.id === item.id && styles.selectedItem,
                      ]}
                      onPress={() => selectCompany(item)}>
                      <Text
                        style={[
                          styles.dropdownText,
                          selectedCompany?.id === item.id &&
                          styles.selectedText,
                        ]}>
                        {item.name}
                      </Text>
                    </TouchableOpacity>
                  )}
                />
              </View>
            )}
          </>
        )}
      </View>

      {/* Right Side Icons (Always Visible) */}
      <View style={styles.iconContainer}>
        <TouchableOpacity onPress={() => navigation.navigate('notification')}>
          <Icon name="bell" size={24} color="#898E9A" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('settings')}
          style={styles.iconSpacing}>
          {/* <Icon name="menu" size={24} color="#898E9A" /> */}
          <Icon name="settings" size={24} color="#898E9A" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.white,
    paddingVertical: 5,
  },
  dropdown: {
    position: 'absolute',
    top: 40,
    left: 0,
    right: 0,
    backgroundColor: Colors.white,
    borderRadius: 8,
    paddingVertical: 5,
    zIndex: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  dropdownItem: {
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  dropdownText: {
    fontSize: 14,
    color: Colors.black,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: Colors.white,
    flex: 1,
  },
  logoWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
  },
  shimmerContainer: {
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  appName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.black,
    marginRight: 8,
  },
  errorText: {
    fontSize: 13,
    color: '#FF6B6B',
    fontWeight: '500',
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconSpacing: {
    marginLeft: 15,
  },
});

export default DashboardHeader;
