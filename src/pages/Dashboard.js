import React, {useState, useCallback, useEffect, useRef} from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import {BackHandler} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetCashCard from '../components/dashboard/NetCashCard';
import {allItems} from '../utils/Constants';
import Feather from 'react-native-vector-icons/Feather';
import DateRangeSelector from '../components/dashboard/DateRangeSelector';
import DashboardHeader from '../components/dashboard/Header';
import SyncScrollable from '../components/dashboard/SyncScrollable';
import Header from '../components/common/Header';
import CustomCalendar from '../components/common/Calender';
import Colors from '../utils/Colors';
import SwipeableCards from '../components/common/SwipeableCards';
import FinancialMetricsCards from '../components/common/FinancialMetricsCards';
import RecentActivity from '../components/dashboard/RecentActivity';
import Banner from '../components/dashboard/banner';
import {useAuth} from '../hooks/useAuth';
import apiService from '../services/api/apiService';
import {Logger} from '../services/utils/logger';
import {Alert} from 'react-native';
import SearchVoiceField from '../components/common/VoiceFeature';
import {verifySessionToken} from '../utils/sessionManager';
import FinancialYearDropdown from '../components/dashboard/common/financialyeardropdown';
import {useFilters} from '../contexts/FilterContext';
import { FilterButton, FilterDrawer } from '../components/common';

const Dashboard = ({navigation}) => {
  const [selectedRange, setSelectedRange] = useState('7D');
  const [isBannerVisible, setBannerVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const refreshTimeoutRef = useRef(null);
  const {fetchCompaniesData, setCompanies, selectedCompany} = useAuth();
  
  // Shared state to manage dropdown visibility
  const [openDropdown, setOpenDropdown] = useState(null); // 'company' | 'fy' | null
  
  // Filter drawer state
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);
  const {filters} = useFilters();
  
  // Close dropdowns when company changes
  useEffect(() => {
    setOpenDropdown(null);
  }, [selectedCompany?.id]);

  // Apply filters when they change
  useEffect(() => {
    if (filters) {
      Logger.debug('Dashboard filters updated', {
        activeFiltersCount: Object.values(filters.transactionTypes).filter(Boolean).length,
        dateRange: filters.dateRange,
        sortBy: filters.sortBy,
      });
      // Here you can filter your dashboard data based on active filters
    }
  }, [filters]);

  useFocusEffect(
    useCallback(() => {
      // Close any open dropdowns when screen comes into focus
      setOpenDropdown(null);

      const onBackPress = () => {
        if (navigation.canGoBack()) {
          navigation.goBack();
        } else {
          navigation.navigate('MainTabs');
        }
        return false; // Allow default behavior if no navigation back is possible
      };

      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        onBackPress,
      );

      return () => backHandler.remove(); // Correct cleanup
    }, [navigation]),
  );

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const verifyOnFocus = async () => {
        const token = await AsyncStorage.getItem('authToken');
        if (!token || !isActive) {
          return;
        }

        const session = await verifySessionToken(token);
        if (!session?.valid && isActive) {
          Alert.alert(
            'Session expired',
            'Please login again.',
            [
              {
                text: 'OK',
                onPress: () => navigation.replace('login'),
              },
            ],
            {cancelable: false},
          );
        }
      };

      verifyOnFocus();

      return () => {
        isActive = false;
      };
    }, [navigation]),
  );

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const filteredItems = searchQuery
    ? allItems.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : [];

  const refreshPairingDetails = useCallback(async () => {
    try {
      const localPairingStatus = await AsyncStorage.getItem('isPaired');
      if (localPairingStatus !== 'true') {
        await AsyncStorage.removeItem('pairedDevice');
        return;
      }

      Logger.debug('Refreshing pairing details from dashboard');
      const response = await apiService.fetchPairingDetails();
      const device = response?.data?.device;

      if (!device) {
        Logger.warn(
          'No device in pairing response, preserving previous pairing state',
        );
        return;
      }

      const syncTime = device?.lastSync ?? null;
      const deviceCode = device?.code ?? null;

      const stored = await AsyncStorage.getItem('pairedDevice');
      const parsed = stored ? JSON.parse(stored) : {};

      const updated = {
        ...parsed,
        ...(deviceCode ? {code: deviceCode} : {}),
        lastSync: syncTime,
      };

      await AsyncStorage.setItem('pairedDevice', JSON.stringify(updated));
      await AsyncStorage.setItem('isPaired', 'true');
      Logger.debug('Dashboard pairing details refreshed', {
        deviceCode,
        syncTime,
      });
    } catch (error) {
      Logger.error('Dashboard pairing refresh error', error);

      // Handle 401 - Session expired, unpair device and clear companies
      if (
        error.isUnauthorized ||
        error.statusCode === 401 ||
        error.message?.includes('Session expired')
      ) {
        Logger.warn(
          'Received 401 - Session expired, unpairing device and clearing companies',
        );

        // Check if alert was already shown (stored in AsyncStorage to prevent duplicates across components)
        const alertShown = await AsyncStorage.getItem(
          'sessionExpiredAlertShown',
        );

        if (alertShown !== 'true') {
          // Mark alert as shown
          await AsyncStorage.setItem('sessionExpiredAlertShown', 'true');

          // Show alert
          Alert.alert(
            'Session Expired',
            'Your session has expired. Please pair your device again.',
            [
              {
                text: 'OK',
                onPress: async () => {
                  // Unpair device
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
                    await AsyncStorage.removeItem('sessionExpiredAlertShown');
                  }, 5000);

                  Logger.info(
                    'Device unpaired and companies cleared due to 401',
                  );
                },
              },
            ],
            {cancelable: false},
          );
        } else {
          // Alert already shown, just unpair silently
          await AsyncStorage.removeItem('pairedDevice');
          await AsyncStorage.setItem('isPaired', 'false');
          await AsyncStorage.removeItem('authToken');
          await AsyncStorage.removeItem('cachedCompanies');
          await AsyncStorage.removeItem('hasFetchedCompanies');

          if (setCompanies) {
            setCompanies([]);
          }
        }
      } else if (error.isNetworkError) {
        Logger.warn('Network error - pairing details not updated');
      }
    }
  }, [setCompanies]);

  useEffect(() => {
    return () => {
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
        refreshTimeoutRef.current = null;
      }
    };
  }, []);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);

    try {
      // Check if device is paired before refreshing companies
      const isPaired = await AsyncStorage.getItem('isPaired');

      const tasks = [];

      // Only fetch companies if device is paired
      if (isPaired === 'true') {
        tasks.push(fetchCompaniesData?.({force: true}));
        tasks.push(refreshPairingDetails());
      } else {
        // If not paired, clear companies and skip fetch
        Logger.debug('Device not paired - skipping companies fetch on refresh');
      }

      if (tasks.length > 0) {
        await Promise.allSettled(tasks.filter(Boolean));
      }
    } catch (error) { 
    }

    if (refreshTimeoutRef.current) {
      clearTimeout(refreshTimeoutRef.current);
    }

    refreshTimeoutRef.current = setTimeout(() => {
      setRefreshing(false);
      refreshTimeoutRef.current = null;
    }, 600);
  }, [fetchCompaniesData, refreshPairingDetails]);

  const SearchHeader = () => (
    <Header
      hideBottomBorder
      title="Search"
      leftIcon="chevron-left"
      style={{paddingVertical: 4}}
      onLeftPress={() => {
        if (isSearching) {
          setIsSearching(false); // Exit search mode
          setSearchQuery(''); // Clear the search query
        } else {
          navigation.navigate('MainTabs', {screen: 'dashboard'});
        }
      }}
    />
  );

  const onButtonPress = item => {
    switch (item.type.toLowerCase()) {
      case 'stock':
        navigation.navigate('stocks');
        break;
      case 'ledger':
        navigation.navigate('ledger');
        break;
      case 'narration':
        navigation.navigate('invoice2');
        break;
      default:
        console.warn(`No screen found for type: ${item.type}`);
        break;
    }
  };

  return (
    <>
      <View
        style={{backgroundColor: Colors.white, padding: 10, paddingTop: 20}}>
        {isSearching ? (
          <SearchHeader />
        ) : (
          <DashboardHeader
            openDropdown={openDropdown}
            onDropdownToggle={type => {
              setOpenDropdown(prev => (prev === type ? null : type));
            }}
          />
        )}

        <View style={styles.searchContainer}>
          <Icon
            name="search"
            size={20}
            color="#999"
            style={styles.searchIcon}
          />
          <TextInput
            placeholder="Search for recent transactions"
            style={styles.searchInput}
            placeholderTextColor="#8F939E"
            value={searchQuery}
            // onFocus={() => setIsSearching(true)}
            onFocus={() => {}} // Prevent setting isSearching to true on focus
            onBlur={() => !searchQuery && setIsSearching(false)}
            onChangeText={text => {
              setSearchQuery(text);
              setIsSearching(text.length > 2);
            }}
          />
          {/* <Icon name="mic" size={20} color="#898E9A" style={styles.micIcon} /> */}
        </View>
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled={false}
        style={{backgroundColor: Colors.backgroundColorPrimary}}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={Colors.primary}
            colors={[Colors.primary]}
            progressBackgroundColor={Colors.backgroundColorPrimary}
          />
        }>
        <View
          style={isSearching ? styles.searchingcontainer : styles.container}>
          {/* Conditional Rendering: Show Search Results or Dashboard */}
          {isSearching ? (
            <FlatList
              data={filteredItems}
              removeClippedSubviews={false}
              scrollEnabled={false}
              keyExtractor={item => item.id.toString()}
              style={styles.dropdown}
              renderItem={({item}) => (
                <View style={styles.dropdownItem}>
                  <Text style={styles.dropdownText}>{item.name}</Text>
                  <TouchableOpacity
                    style={styles.button}
                    onPress={() => onButtonPress(item)}>
                    <Text style={styles.buttonText}>{item.type}</Text>
                  </TouchableOpacity>
                </View>
              )}
            />
          ) : (
            <>
              <View style={{
                // flexDirection: 'row',
                // justifyContent: 'space-between',
                // alignItems: 'center',
                // gap: 8,
                marginRight: 0,
                marginBottom: 6,
              
              }}>
                {/* <FilterButton onPress={() => setShowFilterDrawer(true)} /> */}
                <FinancialYearDropdown
                  openDropdown={openDropdown}
                  onDropdownToggle={type => {
                    setOpenDropdown(prev => (prev === type ? null : type));
                  }}
                />
               
              </View>
              {/* <SyncScrollable /> */}

              {/* <View style={{marginTop: 10}}> */}
              <Banner
                onVisibilityChange={setBannerVisible}
                selectedCompany={selectedCompany}
              />

              {/* </View> */}

              <View
                style={[
                  styles.swipeableCardsContainer,
                  isBannerVisible && {marginTop: 8},
                ]}>
                <SwipeableCards
                  showPercentage={false}
                  removeHorizontalPadding={true}
                  showPaginationDots={false}
                />
              </View>

              {/* <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: 10,
                }}>
                <Text style={styles.sectionTitle}>Overview</Text>
                <TouchableOpacity>
                  <CustomCalendar />
                </TouchableOpacity>
              </View> */}

              {/* <View style={{marginBottom: 10}}>
                <FinancialYearDropdown />
              </View> */}

              <DateRangeSelector
                onRangeChange={range => {
                  setSelectedRange(range);
                  // Close all dropdowns when date range changes
                  setOpenDropdown(null);
                }}
              />
              {/* <SearchVoiceField/> */}

              <FinancialMetricsCards selectedRange={selectedRange} />
              <NetCashCard />
              <RecentActivity />
            </>
          )}
        </View>
      </ScrollView>

      {!isSearching}

      {/* Filter Drawer */}
      <FilterDrawer
        visible={showFilterDrawer}
        onClose={useCallback(() => setShowFilterDrawer(false), [])}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundColorPrimary,
    padding: 5,
  },
  searchingcontainer: {flex: 1, backgroundColor: Colors.white, padding: 12},
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7F9FC',
    borderRadius: 8,
    padding: Platform.OS === 'ios' ? 10 : 6,
    minHeight: Platform.OS === 'ios' ? 36 : undefined,
    borderWidth: 1,
    borderColor: Colors.border,
    marginTop: 14,
  },
  searchIcon: {marginRight: 8},
  searchInput: {
    flex: 1,
    color: Colors.black,
    ...(Platform.OS === 'ios' && {
      paddingVertical: 4,
      fontSize: 16,
    }),
  },
  micIcon: {marginLeft: 16},
  dropdown: {
    position: 'absolute',
    top: 1,
    left: 1,
    right: 1,
    backgroundColor: '#F7F9FC',
    borderRadius: 8,
  },
  dropdownItem: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dropdownText: {
    fontSize: 16,
    color: '#333',
  },
  button: {
    backgroundColor: '#16C47F',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: Colors.white,
    fontSize: 14,
  },
  swipeableCardsContainer: {
    paddingHorizontal: 6,
  },
});

export default Dashboard;
