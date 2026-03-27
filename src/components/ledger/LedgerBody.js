import React, { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  TouchableWithoutFeedback,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { createShimmerPlaceholder } from 'react-native-shimmer-placeholder';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Feather from 'react-native-vector-icons/Feather';
import { SwipeListView } from 'react-native-swipe-list-view';
import Colors from '../../utils/Colors';
import { Icons } from '../../utils/Icons';
import { makePhoneCall, openWhatsAppChat } from '../Helper/CommunicationUtils';
import { useAuth } from '../../hooks/useAuth';
import apiService from '../../services/api/apiService';
import { Logger } from '../../services/utils/logger';
import { useDebounce } from './helper';
import { CustomSwitch } from '../common';


const LedgerBody = ({ filterData, filterType }) => {
  const [searchText, setSearchText] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [hideZero, setHideZero] = useState(false);
  const [sortType, setSortType] = useState(null);
  const [sortValue, setSortValue] = useState(1);
  const [ledgerList, setLedgerList] = useState([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [sortBy, setSortBy] = useState('name');

  const { selectedGuid, companies, selectedFY } = useAuth();
  const navigation = useNavigation();
  const debouncedSearchText = useDebounce(searchText, 1000);
  const swipeListRef = useRef(null);
  const requestInProgress = useRef(false);
  const previousFYRef = useRef(null);
  const Shimmer = useMemo(() => createShimmerPlaceholder(LinearGradient), []);

  const selectedCompany = companies.find(c => c.id === selectedGuid);

  const fetchLedgerData = useCallback(
    async pageNum => {
      if (!selectedCompany || requestInProgress.current) return;
      if (!hasMore && pageNum > 1) return;

      const isFirstPage = pageNum === 1;
      requestInProgress.current = true;
      isFirstPage ? setIsLoading(true) : setIsLoadingMore(true);

      const fromDate = selectedFY?.yearStart;
      const toDate = selectedFY?.yearEnd;
      let isCreditFilter = null;
      const apiType = getApiType();
      if (apiType === 'Credit') isCreditFilter = true;
      else if (apiType === 'Debit') isCreditFilter = false;

      const body = {
        companyGuid: selectedGuid,
        fromDate,
        toDate,
        page: pageNum,
        searchText: debouncedSearchText.trim(),
        isCredit: isCreditFilter,
        sortBy,
        sortValue,
        hideZero: hideZero,
        groupText: filterData?.group || '',
        nature: filterData?.nature || '',
      };

      Logger.debug('Fetching ledgers', {
        companyGuid: body.companyGuid,
        page: pageNum,
        searchText: body.searchText?.substring(0, 20),
        hideZero: body.hideZero, // Log the value being sent
      });


      try {
        const response = await apiService.fetchLedgers(body);
        if (response?.status && response?.data?.ledgers) {
          const newLedgers = response.data.ledgers;

          if (isFirstPage) {
            setLedgerList(newLedgers);
          } else {
            setLedgerList(prev => [...prev, ...newLedgers]);
          }

          setHasMore(newLedgers.length > 0);
          setPage(pageNum);
        } else {
          if (isFirstPage) setLedgerList([]);
          setHasMore(false);
        }
      } catch (err) {
        Logger.error('Ledger fetch error', err);
        // Better error handling with new API service
        if (err.isNetworkError) {
          Logger.warn('Network error fetching ledgers');
        } else if (err.isTimeout) {
          Logger.warn('Ledger fetch timed out');
        }
        if (isFirstPage) setLedgerList([]);
      } finally {
        requestInProgress.current = false;
        setIsLoading(false);
        setIsLoadingMore(false);
      }
    },
    [
      selectedCompany,
      selectedFY,
      selectedGuid,
      debouncedSearchText,
      selectedType, // This will trigger re-fetch when changed
      sortBy,
      sortValue,
      hideZero,
      filterData,
      hasMore,
    ],
  );

  // ✅ Fetch whenever inputs change

  useEffect(() => {
    const isFYValid =
      selectedCompany &&
      selectedFY &&
      selectedCompany?.years?.some(
        year => year.uniqueId === selectedFY?.uniqueId,
      );

    if (!selectedCompany || !isFYValid) {
      setLedgerList([]);
      setHasMore(true);
      setPage(1);
      setIsLoading(false);
      setIsLoadingMore(false);
      return;
    }

    setLedgerList([]);
    setPage(1);
    requestInProgress.current = false;
    fetchLedgerData(1);

    previousFYRef.current = selectedFY; // ✅ update ref after fetching
  }, [
    selectedCompany,
    selectedFY,
    debouncedSearchText,
    selectedType,
    sortBy,
    sortValue,
    filterType,
    hideZero,
    filterData?.nature,
  ]);

  // Reset state when selected company changes (e.g., unpaired)
  useEffect(() => {
    previousFYRef.current = null;
    setLedgerList([]);
    setHasMore(true);
    setPage(1);
  }, [selectedGuid]);

  useFocusEffect(
    useCallback(() => {
      return () => {
        // Close all open rows when navigating away
        if (swipeListRef.current) {
          swipeListRef.current.closeAllOpenRows();
        }
      };
    }, []),
  );

  const handleSortAlpha = () => {
    setSortBy('name');
    setSortType('alpha');
    setSortValue(prev => (sortType === 'alpha' ? -prev : 1));
  };

  const handleSortAmount = () => {
    setSortBy('closingBalance');
    setSortType('amount');
    setSortValue(prev => (sortType === 'amount' ? -prev : 1));
  };

  const handleSelectType = type => {
    setSelectedType(type);
    setShowTypeDropdown(false);
  };

  const typeOptions = [
    { label: 'All', value: 'All' },
    { label: 'Credit', value: 'Credit' },
    { label: 'Debit', value: 'Debit' },
  ];

  // Convert 'All' to empty string for API calls
  const getApiType = () => {
    if (selectedType === 'All') return '';
    return selectedType;
  };

  const handleLoadMore = () => {
    if (!isLoadingMore && hasMore && !requestInProgress.current) {
      fetchLedgerData(page + 1);
    }
  };

  // Render visible row (front)
  const renderItem = useCallback(
    ({ item, index }) => {
      const onOpenLedger = () =>
        navigation.navigate('ledgerDetails', { ledger: item });

      return (
        <TouchableWithoutFeedback onPress={onOpenLedger}>
          <View style={styles.card}>
            <View style={[styles.iconCircle]} />

            <View style={styles.ledgerInfo}>
              <Text style={styles.ledgerName}>{item.name}</Text>
              <Text style={styles.ledgerType}>{item.parent}</Text>
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={styles.amount}>
                ₹ {Math.abs(item.closingBalance).toLocaleString()}
              </Text>

              {item.closingBalance !== 0 && (
                <Text
                  style={[styles.crdr, item.isCredit ? styles.cr : styles.dr]}>
                  {item.isCredit ? ' Cr.' : ' Dr.'}
                </Text>
              )}
            </View>
          </View>
        </TouchableWithoutFeedback>
      );
    },
    [navigation],
  );

  // Render hidden row (back with action buttons)
  const renderHiddenItem = useCallback(({ item }) => {
    const onCall = () => makePhoneCall(item.phone);
    const onWhatsApp = () => openWhatsAppChat(item.phone);

    return (
      <View style={styles.rowBack}>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: '#fff' }]}
          onPress={onCall}>
          <MaterialIcons name="phone" size={22} color="#6F7C97" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: '#fff' }]}
          onPress={onWhatsApp}>
          <FontAwesome name="whatsapp" size={22} color="#25D366" />
        </TouchableOpacity>
      </View>
    );
  }, []);

  const renderShimmerRow = key => (
    <View key={key} style={styles.card}>
      {/* <Shimmer
        style={{width: 40, height: 40, borderRadius: 20}}
        shimmerColors={['#E9EDF3', '#F4F7FB', '#E9EDF3']}
      /> */}
      <View style={[styles.ledgerInfo]}>
        <Shimmer
          style={{ width: '60%', height: 12, borderRadius: 6, marginBottom: 6 }}
          shimmerColors={['#E9EDF3', '#F4F7FB', '#E9EDF3']}
        />
        <Shimmer
          style={{ width: '40%', height: 10, borderRadius: 6 }}
          shimmerColors={['#E9EDF3', '#F4F7FB', '#E9EDF3']}
        />
      </View>
      <View style={{ marginLeft: 'auto', alignItems: 'flex-end' }}>
        <Shimmer
          style={{ width: 80, height: 12, borderRadius: 6, marginBottom: 6 }}
          shimmerColors={['#E9EDF3', '#F4F7FB', '#E9EDF3']}
        />
        <Shimmer
          style={{ width: 30, height: 10, borderRadius: 6 }}
          shimmerColors={['#E9EDF3', '#F4F7FB', '#E9EDF3']}
        />
      </View>
    </View>
  );

  const renderHeaderLoader = () =>
    isLoading ? (
      <View style={{ paddingTop: 12 }}>
        {Array.from({ length: 8 }).map((_, i) => renderShimmerRow(`header-${i}`))}
      </View>
    ) : null;

  return (
    <View style={styles.container}>
      {/* 🔍 Search Bar */}
      <View style={styles.searchContainer}>
        {/* <MaterialIcons
          name="search"
          size={20}
          color="#999"
          style={{ marginLeft: 10, marginRight: 6 }}
        /> */}
        <Feather name="search" size={20} color="#999" style={{ marginLeft: 10, marginRight: 6 }} />
        <TextInput
          placeholder="Search Ledgers"
          placeholderTextColor="#999"
          style={styles.searchInput}
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>

      {/* 🔘 Filter & Sort */}
      <View style={styles.toggleRow}>
        {/* Type Dropdown */}
        <View style={styles.dropdownContainer}>
          <TouchableOpacity
            style={styles.dropdownField}
            onPress={() => setShowTypeDropdown(!showTypeDropdown)}>
            <View style={styles.dropdownContent}>
              {selectedType === 'All' && (
                <Icons.ListIconDark width={18} height={18} style={{ marginRight: 8 }} />
              )}
              {selectedType === 'Credit' && (
                <Icons.CreditDark width={18} height={18} style={{ marginRight: 8 }} />
              )}
              {selectedType === 'Debit' && (
                <Icons.DebitDark width={18} height={18} style={{ marginRight: 8 }} />
              )}
              <Text style={styles.dropdownText}>{selectedType}</Text>
            </View>
            <Feather
              name={showTypeDropdown ? 'chevron-up' : 'chevron-down'}
              size={18}
              color="#666"
            />
          </TouchableOpacity>
          {showTypeDropdown && (
            <View style={styles.dropdownList}>
              <ScrollView nestedScrollEnabled={true} showsVerticalScrollIndicator={false}>
                {typeOptions.map((option, index) => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.dropdownItem,
                      index === typeOptions.length - 1 && styles.lastDropdownItem,
                    ]}
                    onPress={() => handleSelectType(option.value)}>
                    <View style={styles.dropdownContent}>
                      {option.value === 'All' && (
                        <Icons.ListIconDark width={18} height={18} style={{ marginRight: 8 }} />
                      )}
                      {option.value === 'Credit' && (
                        <Icons.CreditDark width={18} height={18} style={{ marginRight: 8 }} />
                      )}
                      {option.value === 'Debit' && (
                        <Icons.DebitDark width={18} height={18} style={{ marginRight: 8 }} />
                      )}
                      <Text
                        style={[
                          styles.dropdownItemText,
                          selectedType === option.value && styles.dropdownItemTextSelected,
                        ]}>
                        {option.label}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
        </View>

        {/* Hide Zero Switch */}
        <View style={styles.hideZeroContainer}>
          <Text style={styles.hideZeroText}>Hide Zero</Text>
          <CustomSwitch
            value={hideZero}
            onValueChange={setHideZero}
          />
        </View>

        {/* Sort Controls */}
        <TouchableOpacity
          onPress={handleSortAmount}
          style={{ marginLeft: 'auto', marginRight: 12 }}>
          {sortType === 'amount' ? (
            <Icons.OnetoNineDark width={32} height={32} />
          ) : (
            <Icons.OnetoNineLight width={32} height={32} />
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={handleSortAlpha} style={{ marginRight: 12 }}>
          {sortType === 'alpha' ? (
            <Icons.AToZDark width={32} height={32} />
          ) : (
            <Icons.AToZLight width={32} height={32} />
          )}
        </TouchableOpacity>
      </View>

      <SwipeListView
        ref={swipeListRef}
        data={ledgerList}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={renderHeaderLoader()}
        removeClippedSubviews={false}
        keyExtractor={(item, index) => item.id?.toString() || index.toString()}
        renderItem={renderItem}
        renderHiddenItem={renderHiddenItem}
        rightOpenValue={-110}
        disableRightSwipe
        closeOnRowOpen={true}
        closeOnRowBeginSwipe={false}
        closeOnScroll={true}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListEmptyComponent={
          !isLoading && (
            <Text
              style={{ textAlign: 'center', marginTop: 20, color: Colors.gray }}>
              No ledgers found
            </Text>
          )
        }
        ListFooterComponent={
          isLoadingMore && (
            <View style={{ paddingVertical: 8 }}>
              {Array.from({ length: 3 }).map((_, i) =>
                renderShimmerRow(`footer-${i}`),
              )}
            </View>
          )
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F8FA',
    padding: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 16,
    color: '#000',
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 8,
  },
  dropdownContainer: {
    position: 'relative',
    marginRight: 10,
  },
  dropdownField: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    minWidth: 120,
  },
  dropdownContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  dropdownText: {
    fontSize: 14,
    color: '#000',
    fontWeight: '400',
  },
  dropdownList: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    marginTop: 4,
    maxHeight: 150,
    zIndex: 1000,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  lastDropdownItem: {
    borderBottomWidth: 0,
  },
  dropdownItemText: {
    fontSize: 14,
    color: '#666',
  },
  dropdownItemTextSelected: {
    color: '#000',
    fontWeight: '500',
  },
  hideZeroContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8
  },
  hideZeroText: {
    fontSize: 12,
    color: '#666',
    marginRight: 8,
    fontWeight: '500'
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  iconCircle: {
    // width: 40,
    // height: 40,
    // borderRadius: 20,
    // justifyContent: 'center',
    // alignItems: 'center',
  },
  ledgerInfo: {
    flex: 1
  },
  ledgerName: {
    fontSize: 14,
    fontWeight: '600'
  },
  ledgerType: {
    fontSize: 11,
    color: '#888',
    marginTop: 2
  },
  amount: {
    fontWeight: '600',
    fontSize: 13,
    color: '#000'
  },
  crdr: {
    fontWeight: 'bold',
    fontSize: 14,
    marginLeft: 2
  },
  cr: {
    color: '#0EA371'
  },
  dr: {
    color: '#F47B6E'
  },
  rowBack: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 12,
    paddingRight: 10,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
});

export default LedgerBody;
