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
import AlertSwipeableCards from '../components/common/AlertSwipeableCards';
import {filterDataByStatusAndPeriod} from '../components/Helper/DateFilterHelper';
import apiService from '../services/api/apiService';
import {useAuth} from '../hooks/useAuth';
import {Icons} from '../utils/Icons';
import EwayBill from '../assets/icons/ewaybill.svg';
import ScreenStyles from '../components/dashboard/css/ScreenStyles';
import {FinancialMetricsSection} from '../components/financial';
// import ErrorBoundary from '../common/ErrorBoundary';

const SalesScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const data = route.params?.data ? [route.params.data] : [];
  const [selectedPeriod, setSelectedPeriod] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [activeTab, setActiveTab] = useState('recent');
  const [loading, setLoading] = useState(false);
  const [apiVouchers, setApiVouchers] = useState([]);
  const [apiTopParties, setApiTopParties] = useState([]);
  const {selectedGuid, selectedFY} = useAuth();

  const formatDisplayDate = value => {
    if (!value) return '';
    const dateObj = new Date(value);
    if (Number.isNaN(dateObj.getTime())) return '';
    const day = String(dateObj.getDate()).padStart(2, '0');
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const year = String(dateObj.getFullYear()).slice(-2);
    return `${day}/${month}/${year}`;
  };

  const formatDisplayTime = voucher => {
    const rawTime = voucher?.time || voucher?.voucher_time || voucher?.createdAt;
    if (!rawTime) return '';
    const dateObj = new Date(rawTime);
    if (Number.isNaN(dateObj.getTime())) return '';
    return dateObj.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  // Fetch real sales vouchers from Tally
  useEffect(() => {
    if (!selectedGuid) return;
    setLoading(true);
    const body = {
      companyGuid: selectedGuid,
      voucherType: 'Sales GST',
      page: 1, pageSize: 50,
      fromDate: selectedFY?.startDate,
      toDate: selectedFY?.endDate,
    };
    apiService.fetchVouchers(body).then(res => {
      const vouchers = res?.data?.vouchers || [];
      // Map to screen format
      const mapped = vouchers.map(v => ({
        id: v.id,
        status: v.amount > 0 ? 'Paid' : 'Unpaid',
        reference: v.voucher_number || v.id,
        customer: v.party_name || '—',
        date: v.date ? new Date(v.date).toLocaleDateString('en-IN', {day:'numeric',month:'short'}) : '',
        fullDate: formatDisplayDate(v.date),
        time: formatDisplayTime(v),
        amount: '₹' + Math.round(v.amount || 0).toLocaleString('en-IN'),
        isPaid: (v.amount || 0) > 0,
      }));
      setApiVouchers(mapped);
      // Compute top parties
      const partyMap = {};
      vouchers.forEach(v => {
        if (!v.party_name) return;
        if (!partyMap[v.party_name]) partyMap[v.party_name] = { customer: v.party_name, total: 0, count: 0, initial: v.party_name[0].toUpperCase(), color: '#3F5263' };
        partyMap[v.party_name].total += (v.amount || 0);
        partyMap[v.party_name].count++;
      });
      const top = Object.values(partyMap).sort((a,b) => b.total - a.total).slice(0,10).map(p => ({
        ...p, totalAmount: '₹' + Math.round(p.total).toLocaleString('en-IN'), transactionCount: p.count,
      }));
      setApiTopParties(top);
    }).catch(() => {}).finally(() => setLoading(false));
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

  // Sales-specific data for swipable cards
  const salesCards = [
    {
      id: 'sales-today',
      title: 'Today',
      value: '₹125.000',
      change: '+18%',
      changeType: 'positive',
      icon: Icons.Calender,
    },
    {
      id: 'sales-week',
      title: 'MTD',
      value: '₹345.500',
      change: '+12%',
      changeType: 'positive',
      icon: Icons.CalenderDate,
    },
    {
      id: 'sales-month',
      title: 'YTD',
      value: '₹1,192.750',
      change: '+22%',
      changeType: 'positive',
      icon: Icons.CalenderYear,
    },
    {
      id: 'sales-pending',
      title: 'Avg Ticket',
      value: '₹65.200',
      change: '-2%',
      changeType: 'negative',
      icon: Icons.Bill,
    },
    {
      id: 'sales-overdue',
      title: 'Credit Notes',
      value: '₹28.500',
      change: '+8%', 
      changeType: 'negative',
      icon: Icons.Cheque,
    },
    {
      id: 'sales-total',
      title: 'Outstanding',
      value: '₹1,756.950',
      icon: Icons.Medal,
      change: '+16%',
      changeType: 'positive',
    },
  ];

  // Mock transaction data for recent sales (includes dates from Nov 2025 to Jan 2026)
  const recentSales = [
    {
      id: 1,
      status: 'Paid',
      reference: 'INV-30975',
      customer: 'ABC Traders',
      date: '1 Jan',
      fullDate: '01/01/2026',
      time: '09:00 AM',
      amount: '₹42,500',
      isPaid: true,
    },
    {
      id: 2,
      status: 'Unpaid',
      reference: 'INV-30976',
      customer: 'PQR Exports',
      date: '31 Dec',
      fullDate: '31/12/2025',
      time: '08:30 AM',
      amount: '₹38,200',
      isPaid: false,
    },
    {
      id: 3,
      status: 'Paid',
      reference: 'INV-30977',
      customer: 'XYZ Retail',
      date: '30 Dec',
      fullDate: '30/12/2025',
      time: '08:00 AM',
      amount: '₹55,800',
      isPaid: true,
    },
    {
      id: 4,
      status: 'Paid',
      reference: 'INV-30978',
      customer: 'LMN Industries',
      date: '15 Dec',
      fullDate: '15/12/2025',
      time: '07:30 PM',
      amount: '₹28,900',
      isPaid: true,
    },
    {
      id: 5,
      status: 'Unpaid',
      reference: 'INV-30979',
      customer: 'DEF Corporation',
      date: '10 Dec',
      fullDate: '10/12/2025',
      time: '06:45 PM',
      amount: '₹67,300',
      isPaid: false,
    },
    {
      id: 6,
      status: 'Paid',
      reference: 'INV-30980',
      customer: 'GHI Solutions',
      date: '5 Dec',
      fullDate: '05/12/2025',
      time: '05:15 PM',
      amount: '₹23,400',
      isPaid: true,
    },
    {
      id: 7,
      status: 'Unpaid',
      reference: 'INV-30981',
      customer: 'JKL Enterprises',
      date: '25 Nov',
      fullDate: '25/11/2025',
      time: '04:30 PM',
      amount: '₹34,600',
      isPaid: false,
    },
    {
      id: 8,
      status: 'Paid',
      reference: 'INV-30982',
      customer: 'MNO Trading',
      date: '20 Nov',
      fullDate: '20/11/2025',
      time: '03:45 PM',
      amount: '₹19,800',
      isPaid: true,
    },
    {
      id: 9,
      status: 'Unpaid',
      reference: 'INV-30983',
      customer: 'RST Corporation',
      date: '15 Nov',
      fullDate: '15/11/2025',
      time: '02:20 PM',
      amount: '₹41,200',
      isPaid: false,
    },
    {
      id: 10,
      status: 'Paid',
      reference: 'INV-30984',
      customer: 'UVW Solutions',
      date: '10 Nov',
      fullDate: '10/11/2025',
      time: '01:15 PM',
      amount: '₹52,700',
      isPaid: true,
    },
  ];

  const topParties = [
    {
      id: 1,
      customer: 'ABC Traders',
      totalAmount: '₹19,000',
      transactionCount: 25,
      initial: 'A',
      color: '#3B82F6',
    },
    {
      id: 2,
      customer: 'PQR Exports',
      totalAmount: '₹12,546',
      transactionCount: 18,
      initial: 'P',
      color: '#F59E0B',
    },
    {
      id: 3,
      customer: 'Julia Martineze',
      totalAmount: '₹85,000',
      transactionCount: 12,
      initial: 'J',
      color: '#3B82F6',
    },
    {
      id: 4,
      customer: 'PQR Exports',
      totalAmount: '₹12,500',
      transactionCount: 18,
      initial: 'P',
      color: '#F59E0B',
    },
    {
      id: 5,
      customer: 'Julia Martineze',
      totalAmount: '₹89,986',
      transactionCount: 12,
      initial: 'J',
      color: '#3B82F6',
    },
     {
      id: 6,
      customer: 'Andrea gonzoliy',
      totalAmount: '₹54,908',
      transactionCount: 12,
      initial: 'J',
      color: '#F59E0B',
    },
  ];

  // Filter recent sales based on selected status and period
  // Use real API data if available, fall back to mock
  const sourceData = apiVouchers.length > 0 ? apiVouchers : recentSales;
  const filteredRecentSales = filterDataByStatusAndPeriod(
    sourceData,
    selectedStatus,
    selectedPeriod,
    'date',
    'status',
    false, // useIsPaid = false for SalesScreen
  );

  const handleCardPress = card => {
    // Handle card press if needed
    console.log('Card pressed:', card.title);
  };

  const renderTransactionItem = item => (
    <View style={ScreenStyles.transactionCard}>
      <View style={ScreenStyles.transactionContent}>
        <View style={ScreenStyles.transactionLeft}>
          <View style={ScreenStyles.transactionIcon}>
            <Feather name="arrow-down-left" size={16} color="#10B981" />
          </View>
          <View style={ScreenStyles.transactionInfo}>
            <View style={ScreenStyles.transactionRow}>
              <Text
                style={ScreenStyles.transactionName}
                numberOfLines={1}
                ellipsizeMode="tail">
                {item.customer}
              </Text>
              <View style={ScreenStyles.dotSeparator} />
              <Text
                style={ScreenStyles.referenceText}
                numberOfLines={1}
                ellipsizeMode="tail">
                {item.reference}
              </Text>
            </View>
            <Text style={ScreenStyles.transactionDate}>
              {[item.fullDate, item.time].filter(Boolean).join(' | ')}
            </Text>
          </View>
        </View>
        <View style={ScreenStyles.transactionRight}>
          <Text style={ScreenStyles.transactionAmount}>{item.amount}</Text>
        </View>
      </View>
    </View>
  );

  const renderPartyItem = item => (
    <View style={ScreenStyles.partyCard}>
      <View style={ScreenStyles.partyLeft}>
        <View style={[ScreenStyles.partyIcon, {backgroundColor: item.color}]}>
          <Text style={ScreenStyles.partyInitial}>{item.initial}</Text>
        </View>
        <View style={ScreenStyles.partyInfo}>
          <Text style={ScreenStyles.partyName}>{item.customer}</Text>
        </View>
      </View>
      <Text style={ScreenStyles.partyAmount}>{item.totalAmount}</Text>
    </View>
  );

  // Determine if the current tab is empty
  const isRecentEmpty =
    activeTab === 'recent' && filteredRecentSales.length === 0;
  const isTopEmpty = activeTab === 'parties' && topParties.length === 0;
  const showEmptyState = isRecentEmpty || isTopEmpty;

  return (
    <View style={ScreenStyles.container}>
      <ErrorBoundary>
        <Header
          title="Sales"
          leftIcon="chevron-left"
          rightText="E-way Bill"
          rightIcon={EwayBill}
          onLeftPress={() => {
            if (navigation.canGoBack()) {
              navigation.goBack();
            } else {
              navigation.navigate('MainTabs', {screen: 'dashboard'});
            }
          }}
          onRightPress={() => navigation.navigate('EWayBill')}
        />

        <View style={{zIndex: 1000}}>
          <TopSection
            selectedPeriod={selectedPeriod}
            setSelectedPeriod={setSelectedPeriod}
            selectedStatus={selectedStatus}
            setSelectedStatus={setSelectedStatus}
          />
        </View>

        <FinancialMetricsSection
          cards={salesCards}
          onCardPress={handleCardPress}
        />

        <ScrollView
          style={ScreenStyles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            ScreenStyles.scrollContent,
            showEmptyState && {paddingBottom: 120}, // space for bottom alert card
          ]}>
          <MainContent
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            recentData={filteredRecentSales}
            topData={apiTopParties.length > 0 ? apiTopParties : topParties}
            renderTransactionItem={renderTransactionItem}
            renderTopItem={renderPartyItem}
            tab1Name="Recent Sales"
            tab2Name="Top Parties"
            tab2Value="parties"
            minHeight="83%"
            onViewAllRecent={() => navigation.navigate('salesRegister')}
            onViewAllTop={() =>
              navigation.navigate('MainTabs', {
                screen: 'ledger',
                params: {filterType: 'Sundry Debtor'},
              })
            }
          />
          {/* AlertSwipeableCards stays normal in scroll if there is data */}
          {!showEmptyState && <AlertSwipeableCards />}
        </ScrollView>

        {/* Stick AlertSwipeableCards at bottom only if empty */}
        {showEmptyState && (
          <View style={styles.alertCardWrapper}>
            <AlertSwipeableCards />
          </View>
        )}
      </ErrorBoundary>
    </View>
  );
};

const styles = StyleSheet.create({
  alertCardWrapper: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    zIndex: 2000, // keep it above other content
  },
});

export default SalesScreen;
