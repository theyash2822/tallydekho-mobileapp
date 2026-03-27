import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Feather from 'react-native-vector-icons/Feather';
import Colors from '../../../../utils/Colors';
import Header from '../../../common/Header';
import WarehouseAvailabilityModal from './WarehouseAvailabilityModal';
import apiService from '../../../../services/api/apiService';
import { Logger } from '../../../../services/utils/logger';
import { useAuth } from '../../../../hooks/useAuth';
import { Icons } from '../../../../utils/Icons';
import { formatCurrencyINR } from '../../../../utils/formatUtils';
import { formatDateLocaleIN } from '../../../../utils/dateUtils';

const ItemDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { item } = route.params || {};
  const [activeTab, setActiveTab] = useState('All');
  const [warehouseModalVisible, setWarehouseModalVisible] = useState(false);
  const [stockDetails, setStockDetails] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const { selectedGuid } = useAuth();

  useEffect(() => {
    if (!selectedGuid || !item?.guid) {
      setErrorMessage('Missing company or stock identifier');
      return;
    }

    let isMounted = true;
    const fetchDetails = async () => {
      try {
        setLoadingDetails(true);
        setErrorMessage(null);
        Logger.info('ItemDetailScreen: Fetching stock details', {
          companyGuid: selectedGuid,
          stockGuid: item.guid,
        });
        const response = await apiService.fetchStockDetails({
          companyGuid: selectedGuid,
          stockGuid: item.guid,
        });
        Logger.info('ItemDetailScreen: stock details response', response);
        const stock = response?.data?.stock;
        if (isMounted) {
          setStockDetails(stock || null);
          setTransactions(stock?.transactions || []);
        }
      } catch (error) {
        Logger.apiError('ItemDetailScreen: fetchStockDetails', error, {
          companyGuid: selectedGuid,
          stockGuid: item?.guid,
        });
        if (isMounted) {
          setErrorMessage(
            error?.message || 'Failed to load stock details. Please try again.',
          );
        }
      } finally {
        if (isMounted) {
          setLoadingDetails(false);
        }
      }
    };

    fetchDetails();

    return () => {
      isMounted = false;
    };
  }, [selectedGuid, item?.guid]);

  const displayStock = stockDetails || item || {};
  const displayQuantity =
    stockDetails?.currentQuantity ??
    item?.currentQuantity ??
    item?.actualQty ??
    '--';
  const displayAmount =
    stockDetails?.amount ?? item?.amount ?? item?.value ?? '--';
  const unitLabel = stockDetails?.unit || item?.unit || '';

  const filteredTransactions = useMemo(() => {
    if (!transactions?.length) {
      return [];
    }
    switch (activeTab) {
      case 'Sales':
        return transactions.filter(tr => tr.isPurchase === false);
      case 'Purchase':
        return transactions.filter(tr => tr.isPurchase === true);
      default:
        return transactions;
    }
  }, [transactions, activeTab]);

  const renderTransaction = ({ item: transaction, index }) => (
    <View
      style={[
        styles.transactionItem,
        index === filteredTransactions.length - 1 && styles.lastTransactionItem,
      ]}>
      <View style={styles.transactionLeft}>
        <View style={styles.transactionIcon}>
          <Feather name={'file'} size={16} color="#666" />
        </View>
        <View style={styles.transactionInfo}>
          <Text style={styles.transactionType}>
            {transaction?.partyName || 'Unknown party'}
          </Text>
          <Text style={styles.transactionDate}>
            {formatDateLocaleIN(transaction?.date)}
          </Text>
        </View>
      </View>
      <View style={{ alignItems: 'flex-end' }}>
        <Text
          style={[
            styles.transactionAmount,
            transaction?.isPurchase ? styles.purchaseText : styles.saleText,
          ]}>
          {formatCurrencyINR(transaction?.amount)}
        </Text>
        <Text style={styles.transactionQty}>
          {transaction?.actualQty ?? '--'} {unitLabel}
        </Text>
      </View>
    </View>
  );

  const tabs = ['All', 'Sales', 'Purchase'];

  return (
    <>
      <Header
        title={'Item Detail'}
        leftIcon="chevron-left"
        onLeftPress={() => navigation.goBack()}
      />
      <View style={styles.container}>
        {/* Header */}
        {/* <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Feather name="chevron-left" size={24} color="#666" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Item Detail</Text>
        <View style={styles.headerSpacer} />
      </View> */}

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Item Identification Card */}
          <View style={styles.card}>
            <View style={styles.itemHeader}>
              <View style={styles.itemIcon}>
                {/* <Feather name="box" size={20} color="#16C47F" /> */}
                <Icons.Box height={28} width={28} />
              </View>
            </View>

            <View style={styles.itemInfo}>
              <Text style={styles.itemName}>
                {displayStock?.name || 'Item'}
              </Text>
              {/* <Text style={styles.itemId}>
                {displayStock?.guid || '---'}
              </Text> */}
            </View>

            <View style={styles.barcodeContainer}>
              <View style={styles.barcode}>
                <Text style={styles.barcodeText}>
                  || || || || || || || || || || || ||
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.warehouseButton}
              onPress={() => setWarehouseModalVisible(true)}
              activeOpacity={0.7}>
              <Text style={styles.warehouseButtonText}>
                Warehouse Availability
              </Text>
            </TouchableOpacity>
          </View>

          {loadingDetails && (
            <View style={styles.loadingContainer}>
              {/* <ActivityIndicator size="small" color={Colors.primary} />
              <Text style={styles.loadingText}>Fetching latest data…</Text> */}
            </View>
          )}

          {errorMessage && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{errorMessage}</Text>
            </View>
          )}

          <View style={styles.card}>
            <View style={styles.sectionRow}>
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Total Quantity</Text>
                <View style={styles.dataRow}>
                  <Text style={styles.dataLabel}>On-Hand:</Text>
                  <Text style={styles.dataValue}>
                    {displayQuantity} {unitLabel}
                  </Text>
                </View>
                <View style={styles.dataRow}>
                  <Text style={styles.dataLabel}>Available:</Text>
                  <Text style={styles.dataValue}>--</Text>
                </View>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}></Text>
                <View style={styles.dataRow}>
                  <Text style={styles.dataLabel}>Committed</Text>
                  <Text style={styles.dataValue}>--</Text>
                </View>
                <View style={styles.dataRow}>
                  <Text style={styles.dataLabel}>Reserved</Text>
                  <Text style={styles.dataValue}>--</Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.card}>
            <View style={styles.sectionRow}>
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Valuation</Text>
                <View style={styles.dataRow}>
                  <Text style={styles.dataLabel}>Total INR</Text>
                  <Text style={styles.dataValue}>
                    {formatCurrencyINR(displayAmount)}
                  </Text>
                </View>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}></Text>
                <View style={styles.dataRow}>
                  <Text style={styles.dataLabel}>Quantity</Text>
                  <Text style={styles.dataValue}>
                    {displayQuantity} {unitLabel}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.card}>
            <View style={styles.sectionRow}>
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Batches Wise</Text>
                <View style={styles.dataRow}>
                  <Text style={styles.dataLabel}>Expiry</Text>
                  <Text style={styles.dataValue}>67</Text>
                </View>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}></Text>
                <View style={styles.dataRow}>
                  <Text style={styles.dataLabel}>Received qty</Text>
                  <Text style={styles.dataValue}>34</Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.card}>
            <View style={styles.sectionRow}>
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Re-order Level</Text>
                <View style={styles.dataRow}>
                  <Text style={styles.dataLabel}>-</Text>
                  <Text style={styles.dataValue}></Text>
                </View>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}></Text>
                <View style={styles.dataRow}>
                  <Text style={styles.dataLabel}></Text>
                  <Text style={styles.dataValue}>-</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Narration Card */}
          {displayStock?.narration ? (
            <View style={styles.card}>
              <Text style={styles.sectionTitle}>Narration</Text>
              <Text style={styles.narrationText}>
                {displayStock?.narration}
              </Text>
            </View>
          ) : null}

          {/* Recent Transactions Card */}
          <View style={{ marginBottom: 10 }}>
            <View style={styles.card}>
              <Text style={styles.transactionsTitle}>Recent Transactions</Text>

              {/* Tab Navigation */}
              <View style={styles.tabContainer}>
                {tabs.map(tab => (
                  <TouchableOpacity
                    key={tab}
                    style={[styles.tab, activeTab === tab && styles.activeTab]}
                    onPress={() => setActiveTab(tab)}>
                    <Text
                      style={[
                        styles.tabText,
                        activeTab === tab && styles.activeTabText,
                      ]}>
                      {tab}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {filteredTransactions.length === 0 ? (
                <Text style={styles.emptyStateText}>
                  No transactions available for this item.
                </Text>
              ) : (
                <FlatList
                  data={filteredTransactions}
                  removeClippedSubviews={false}
                  renderItem={renderTransaction}
                  keyExtractor={(transaction, index) =>
                    transaction?.guid
                      ? `${transaction.guid}-${index}`
                      : `${transaction?.id || 'txn'}-${index}`
                  }
                  scrollEnabled={false}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={styles.transactionsListContainer}
                />
              )}
            </View>
          </View>
        </ScrollView>
      </View>

      {/* Warehouse Availability Modal */}
      <WarehouseAvailabilityModal
        visible={warehouseModalVisible}
        onClose={() => setWarehouseModalVisible(false)}
        productName={item?.name || 'Black JBL'}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f8fa',
  },
  content: {
    flex: 1,
    padding: 12,
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
  },
  itemHeader: {
    alignItems: 'center',
    marginBottom: 16,
  },
  itemIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#07624C',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  itemInfo: {
    alignItems: 'center',
    marginBottom: 12,
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  itemId: {
    fontSize: 14,
    color: '#666',
  },
  barcodeContainer: {
    marginBottom: 12,
  },
  barcode: {
    backgroundColor: '#F8F8F8',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  barcodeText: {
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold',
  },
  warehouseButton: {
    backgroundColor: '#07624C',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 8,
  },
  warehouseButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  sectionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  section: {
    flex: 0.49,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  dataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  dataLabel: {
    fontSize: 14,
    color: '#8F939E',
    fontWeight: '400',
  },
  dataValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#494D58',
  },

  narrationText: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
    lineHeight: 20,
  },

  transactionsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    backgroundColor: '#F8F8F8',
    borderRadius: 8,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#FFF',
  },
  tabText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#333',
    fontWeight: '600',
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  lastTransactionItem: {
    borderBottomWidth: 0,
    paddingBottom: 0,
  },
  transactionsListContainer: {},
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  transactionIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F8F8F8',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionType: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 2,
  },
  transactionDate: {
    fontSize: 12,
    color: '#666',
  },
  transactionAmount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  saleText: {
    color: '#1F1F1F',
  },
  purchaseText: {
    color: '#1F1F1F',
  },
  transactionQty: {
    fontSize: 12,
    color: '#666',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 1,
    marginBottom: 1,
  },
  loadingText: {
    marginLeft: 8,
    color: '#666',
    fontSize: 13,
  },
  errorContainer: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#FDECEA',
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    color: '#C0392B',
    fontSize: 13,
  },
  emptyStateText: {
    textAlign: 'center',
    color: '#777',
    paddingVertical: 12,
  },
});

export default ItemDetailScreen;
