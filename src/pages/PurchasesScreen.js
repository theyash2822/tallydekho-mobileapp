import React, {useState, useCallback, useEffect} from 'react';
import {
  View,
  StyleSheet,
  BackHandler,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Header from '../components/common/Header';
import {
  useNavigation,
  useRoute,
  useFocusEffect,
} from '@react-navigation/native';
import Colors from '../utils/Colors';
import Feather from 'react-native-vector-icons/Feather';
import ErrorBoundary from '../components/common/ErrorBoundary';
import TopSection from '../components/dashboard/common/TopSection';
import MainContent from '../components/dashboard/common/MainContent';
import {filterDataByStatusAndPeriod} from '../components/Helper/DateFilterHelper';
import apiService from '../services/api/apiService';
import {useAuth} from '../hooks/useAuth';
import {Icons} from '../utils/Icons';
import ScreenStyles from '../components/dashboard/css/ScreenStyles';
import { FinancialMetricsSection } from '../components/financial';
// import FinancialMetricsSection from '../components/financial/FinancialMetricsSection';

const PurchasesScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const data = route.params?.data ? [route.params.data] : [];
  const [selectedPeriod, setSelectedPeriod] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [activeTab, setActiveTab] = useState('recent');
  const [apiVouchers, setApiVouchers] = useState([]);
  const [apiTopVendors, setApiTopVendors] = useState([]);
  const {selectedGuid, selectedFY} = useAuth();

  useEffect(() => {
    if (!selectedGuid) return;
    const body = { companyGuid: selectedGuid, voucherType: 'Purchase GST', page: 1, pageSize: 50, fromDate: selectedFY?.startDate, toDate: selectedFY?.endDate };
    apiService.fetchVouchers(body).then(res => {
      const vouchers = res?.data?.vouchers || [];
      const mapped = vouchers.map(v => ({
        id: v.id, status: 'Paid', reference: v.voucher_number || v.id,
        vendor: v.party_name || '—',
        date: v.date ? new Date(v.date).toLocaleDateString('en-IN', {day:'numeric',month:'short'}) : '',
        fullDate: v.date || '', amount: '₹' + Math.round(v.amount||0).toLocaleString('en-IN'), isPaid: true,
      }));
      setApiVouchers(mapped);
      const vMap = {};
      vouchers.forEach(v => {
        if (!v.party_name) return;
        if (!vMap[v.party_name]) vMap[v.party_name] = { vendor: v.party_name, total: 0, count: 0, initial: v.party_name[0].toUpperCase(), color: '#526373' };
        vMap[v.party_name].total += (v.amount||0); vMap[v.party_name].count++;
      });
      setApiTopVendors(Object.values(vMap).sort((a,b)=>b.total-a.total).slice(0,10).map(p => ({ ...p, totalAmount: '₹'+Math.round(p.total).toLocaleString('en-IN'), transactionCount: p.count })));
    }).catch(()=>{});
  }, [selectedGuid, selectedFY?.uniqueId]);

  // Handle back button press safely
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        if (navigation.canGoBack()) {
          navigation.goBack();
        } else {
          navigation.navigate('MainTabs', {screen: 'dashboard'});
        }
        return true; // Prevent default behavior
      };

      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        onBackPress,
      );

      return () => backHandler.remove();
    }, [navigation]),
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Cleanup any subscriptions or timers here if needed
    };
  }, []);

  // Purchases-specific data for swipable cards
  const purchasesCards = [
    {
      id: 'purchase-today',
      title: 'Today',
      value: '₹92.000',
      change: '+12%',
      changeType: 'positive',
      icon: Icons.Calender,
    },
    {
      id: 'purchase-week',
      title: 'MTD',
      value: '₹245.500',
      change: '+8%',
      changeType: 'positive',
      icon: Icons.CalenderDate,
    },
    {
      id: 'purchase-month',
      title: 'YTD',
      value: '₹892.750',
      change: '+15%',
      changeType: 'positive',
      icon: Icons.CalenderYear,
    },
    {
      id: 'purchase-pending',
      title: 'Avg Ticket',
      value: '₹45.200',
      change: '-3%',
      changeType: 'negative',
      icon: Icons.Bill,
    },
    {
      id: 'purchase-overdue',
      title: 'Debit Notes',
      value: '₹18.500',
      change: '+5%',
      changeType: 'negative',
      icon: Icons.Checklist,
    },
    {
      id: 'purchase-total',
      title: 'Outstanding',
      value: '₹1,201.950',
      change: '+11%',
      changeType: 'positive',
      icon: Icons.Medal,
    },
  ];

  // Mock transaction data with full date information (includes dates from Nov 2025 to Jan 2026)
  const recentPurchases = [
    {
      id: 1,
      status: 'Unpaid',
      reference: 'CN-00712',
      vendor: 'ABC Traders',
      date: '1 Jan',
      fullDate: '01/01/2026', // DD/MM/YYYY format for display
      time: '09:00 AM',
      amount: '₹3,200',
      isPaid: false,
    },
    {
      id: 2,
      status: 'Paid',
      reference: 'INV-30974',
      vendor: 'PQR Exports',
      date: '31 Dec',
      fullDate: '31/12/2025',
      time: '08:30 AM',
      amount: '₹42,500',
      isPaid: true,
    },
    {
      id: 3,
      status: 'Paid',
      reference: 'CN-00712',
      vendor: 'XYZ Retail',
      date: '30 Dec',
      fullDate: '30/12/2025',
      time: '08:00 AM',
      amount: '₹42,500',
      isPaid: true,
    },
    {
      id: 4,
      status: 'Unpaid',
      reference: 'INV-30974',
      vendor: 'PQR Exports',
      date: '15 Dec',
      fullDate: '15/12/2025',
      time: '07:30 PM',
      amount: '₹42,500',
      isPaid: false,
    },
    {
      id: 5,
      status: 'Paid',
      reference: 'CN-00712',
      vendor: 'XYZ Retail',
      date: '10 Dec',
      fullDate: '10/12/2025',
      time: '10:15 AM',
      amount: '₹42,500',
      isPaid: true,
    },
    {
      id: 6,
      status: 'Unpaid',
      reference: 'INV-30975',
      vendor: 'Tech Solutions',
      date: '5 Dec',
      fullDate: '05/12/2025',
      time: '02:45 PM',
      amount: '₹18,750',
      isPaid: false,
    },
    {
      id: 7,
      status: 'Paid',
      reference: 'CN-00713',
      vendor: 'Global Imports',
      date: '25 Nov',
      fullDate: '25/11/2025',
      time: '11:20 AM',
      amount: '₹67,300',
      isPaid: true,
    },
    {
      id: 8,
      status: 'Unpaid',
      reference: 'INV-30976',
      vendor: 'Local Suppliers',
      date: '20 Nov',
      fullDate: '20/11/2025',
      time: '09:15 AM',
      amount: '₹12,800',
      isPaid: false,
    },
    {
      id: 9,
      status: 'Paid',
      reference: 'CN-00714',
      vendor: 'Premium Goods',
      date: '15 Nov',
      fullDate: '15/11/2025',
      time: '03:30 PM',
      amount: '₹89,400',
      isPaid: true,
    },
    {
      id: 10,
      status: 'Unpaid',
      reference: 'INV-30977',
      vendor: 'Quick Delivery',
      date: '10 Nov',
      fullDate: '10/11/2025',
      time: '01:00 PM',
      amount: '₹25,600',
      isPaid: false,
    },
  ];

  const topVendors = [
    {
      id: 1,
      vendor: 'ABC Traders',
      totalAmount: '₹125,000',
      transactionCount: 15,
      color: '#3B82F6',
    },
    {
      id: 2,
      vendor: 'PQR Exports',
      totalAmount: '₹89,500',
      transactionCount: 8,
      color: '#F59E0B',
    },
    {
      id: 3,
      vendor: 'XYZ Retail',
      totalAmount: '₹67,200',
      transactionCount: 12,
      color: '#10B981',
    },
    {
      id: 4,
      vendor: 'PQR Exports',
      totalAmount: '₹89,500',
      transactionCount: 8,
      color: '#F59E0B',
    },
    {
      id: 5,
      vendor: 'XYZ Retail',
      totalAmount: '₹67,200',
      transactionCount: 12,
      color: '#10B981',
    },
  ];

  const handleCardPress = card => {
    // Handle card press if needed
    console.log('Card pressed:', card.title);
  };
  const sourceData = apiVouchers.length > 0 ? apiVouchers : recentPurchases;
  const filteredRecentPurchases = filterDataByStatusAndPeriod(
    sourceData,
    selectedStatus,
    selectedPeriod,
    'date',
    'status',
    false,
  );

  const renderTransactionItem = item => (
    <View style={ScreenStyles.transactionCardWithStatus}>
      <View style={ScreenStyles.transactionHeader}>
        <View style={ScreenStyles.statusContainer}>
          <View
            style={[
              ScreenStyles.statusDot,
              {backgroundColor: item.isPaid ? '#10B981' : '#EF4444'},
            ]}
          />
          <Text
            style={[
              ScreenStyles.statusText,
              {color: item.isPaid ? '#10B981' : '#EF4444'},
            ]}>
            {item.status}
          </Text>
          <View style={ScreenStyles.dotSeparator} />
          <Text style={ScreenStyles.referenceText}>{item.reference}</Text>
        </View>
      </View>

      <View style={ScreenStyles.transactionContent}>
        <View style={ScreenStyles.transactionLeft}>
          <View style={ScreenStyles.transactionIcon}>
            <Feather name="arrow-down-left" size={16} color="#10B981" />
          </View>
          <View style={ScreenStyles.vendorInfo}>
            <Text style={ScreenStyles.vendorName}>{item.vendor}</Text>
            <Text style={ScreenStyles.transactionDate}>
              {item.fullDate} | {item.time}
            </Text>
          </View>
        </View>
        <View style={ScreenStyles.transactionRight}>
          <Text style={ScreenStyles.transactionAmount}>{item.amount}</Text>
        </View>
      </View>
    </View>
  );

  const renderVendorItem = item => (
    <View style={ScreenStyles.vendorCard}>
      <View style={ScreenStyles.vendorLeft}>
        <View style={[ScreenStyles.vendorIcon, {backgroundColor: item.color}]}>
          <Text style={ScreenStyles.vendorInitial}>
            {item.vendor.charAt(0)}
          </Text>
        </View>
        <View style={ScreenStyles.vendorInfo}>
          <Text style={ScreenStyles.vendorName}>{item.vendor}</Text>
          <Text style={ScreenStyles.vendorStats}>
            {item.transactionCount} transactions
          </Text>
        </View>
      </View>
      <Text style={ScreenStyles.vendorAmount}>{item.totalAmount}</Text>
    </View>
  );

  return (
    <View style={ScreenStyles.container}>
      <ErrorBoundary>
        <Header
          title="Purchase"
          leftIcon="chevron-left"
          rightIconType="Ionicons"
          onLeftPress={() => {
            if (navigation.canGoBack()) {
              navigation.goBack();
            } else {
              navigation.navigate('MainTabs', {screen: 'dashboard'});
            }
          }}
        />

        {/* Top white section with filters and metrics */}
        <View style={{zIndex: 1000}}>
          <TopSection
            selectedPeriod={selectedPeriod}
            setSelectedPeriod={setSelectedPeriod}
            selectedStatus={selectedStatus}
            setSelectedStatus={setSelectedStatus}
          />
        </View>
        <FinancialMetricsSection
          cards={purchasesCards}
          onCardPress={handleCardPress}
        />

        {/* Main content section with white background */}
        <ScrollView
          style={ScreenStyles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={ScreenStyles.scrollContent}>
          <MainContent
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            recentData={filteredRecentPurchases}
            topData={apiTopVendors.length > 0 ? apiTopVendors : topVendors}
            renderTransactionItem={renderTransactionItem}
            renderTopItem={renderVendorItem}
            tab1Name="Recent Purchases"
            tab2Name="Top Vendors"
            tab2Value="vendors"
            minHeight="96%"
            // onViewAllRecent={() => navigation.navigate('dummyscreen')}
            onViewAllRecent={() => navigation.navigate('purchaseRegister')}
            onViewAllTop={() =>
              navigation.navigate('MainTabs', {screen: 'ledger'})
            }
          />
        </ScrollView>
      </ErrorBoundary>
    </View>
  );
};

const styles = StyleSheet.create({
  
  // All styles moved to ScreenStyles.js
});

export default PurchasesScreen;
