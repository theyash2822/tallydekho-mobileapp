import React, {useState, useCallback} from 'react';
import {
  View,
  StyleSheet,
  BackHandler,
  Text,
  TouchableOpacity,
} from 'react-native';
import Header from '../../components/common/Header';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import Colors from '../../utils/Colors';
import Feather from 'react-native-vector-icons/Feather';
import ErrorBoundary from '../../components/common/ErrorBoundary';
import RegisterStyles from './css/RegisterStyles';
import RegisterComponent, {
  CommonCardRenderer,
  StatusRow,
  IconContainer,
} from './common/RegisterComponent';

const PurchaseRegister = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPurchases, setSelectedPurchases] = useState([]);

  // Mock data for purchases with full date information (includes dates from Nov 2025 to Jan 2026)
  const purchases = [
    {
      id: 1,
      status: 'Paid',
      reference: 'PO-001',
      vendor: 'Tech Supplies Ltd.',
      date: '1 Jan',
      fullDate: '01/01/2026', // DD/MM/YYYY format for display
      time: '09:00 AM',
      amount: '₹45,000',
      isReceived: true,
      category: 'Electronics',
    },
    {
      id: 2,
      status: 'Paid',
      reference: 'PO-002',
      vendor: 'Raw Materials Co.',
      date: '31 Dec',
      fullDate: '31/12/2025',
      time: '08:30 AM',
      amount: '₹28,500',
      isReceived: false,
      category: 'Raw Materials',
    },
    {
      id: 3,
      status: 'Unpaid',
      reference: 'PO-003',
      vendor: 'Packaging Solutions',
      date: '30 Dec',
      fullDate: '30/12/2025',
      time: '08:00 AM',
      amount: '₹12,800',
      isReceived: true,
      category: 'Packaging',
    },
    {
      id: 4,
      status: 'Unpaid',
      reference: 'PO-004',
      vendor: 'Office Supplies Inc.',
      date: '15 Dec',
      fullDate: '15/12/2025',
      time: '07:30 PM',
      amount: '₹8,900',
      isReceived: false,
      category: 'Office Supplies',
    },
    {
      id: 5,
      status: 'Paid',
      reference: 'PO-005',
      vendor: 'Machinery Corp.',
      date: '10 Dec',
      fullDate: '10/12/2025',
      time: '06:45 PM',
      amount: '₹67,300',
      isReceived: true,
      category: 'Machinery',
    },
    {
      id: 6,
      status: 'Unpaid',
      reference: 'PO-006',
      vendor: 'Software Solutions',
      date: '25 Nov',
      fullDate: '25/11/2025',
      time: '05:15 PM',
      amount: '₹23,400',
      isReceived: false,
      category: 'Software',
    },
  ];

  // Handle back button press safely
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        if (navigation.canGoBack()) {
          navigation.goBack();
        } else {
          navigation.navigate('MainTabs', {screen: 'dashboard'});
        }
        return true;
      };

      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        onBackPress,
      );

      return () => backHandler.remove();
    }, [navigation]),
  );

  // Handle purchase selection
  const togglePurchaseSelection = purchaseId => {
    setSelectedPurchases(prev => {
      if (prev.includes(purchaseId)) {
        return prev.filter(id => id !== purchaseId);
      } else {
        return [...prev, purchaseId];
      }
    });
  };

  // Handle long press selection
  const handleLongPress = purchaseId => {
    if (!selectedPurchases.includes(purchaseId)) {
      togglePurchaseSelection(purchaseId);
    }
  };

  // Handle tap selection
  const handleTap = purchaseId => {
    if (selectedPurchases.length > 0) {
      // If in selection mode, toggle selection
      togglePurchaseSelection(purchaseId);
    }
  };

  // Share selected purchases
  const shareSelectedPurchases = () => {
    // Implement share functionality here
  };

  // Configuration objects
  const statusConfig = {
    getColor: status => (status === 'Paid' ? '#10B981' : '#EF4444'),
  };

  const iconConfig = {
    backgroundColor: '#F0F2F9',
  };

  // Render purchase card
  const renderPurchaseCard = purchase => {
    const isSelected = selectedPurchases.includes(purchase.id);

    return (
      <CommonCardRenderer
        key={purchase.id}
        item={purchase}
        isSelected={isSelected}
        onPress={handleTap}
        onLongPress={handleLongPress}
        statusConfig={statusConfig}
        iconConfig={iconConfig}>
        <View style={RegisterStyles.content}>
          {/* Top row: Status + Reference */}
          <View style={RegisterStyles.header}>
            <StatusRow
              status={purchase.status}
              reference={purchase.reference}
              statusConfig={statusConfig}
            />
          </View>

          {/* Second row: Icon + Vendor + Amount */}
          <View style={RegisterStyles.mainRow}>
            <IconContainer iconConfig={iconConfig}>
              <Feather name="arrow-down-left" size={16} color="#10B981" />
            </IconContainer>
            <View style={RegisterStyles.info}>
              <Text style={RegisterStyles.title}>{purchase.vendor}</Text>
              <Text style={RegisterStyles.date}>
                {purchase.fullDate} | {purchase.time}
              </Text>
            </View>
            <Text style={RegisterStyles.amount}>{purchase.amount}</Text>
          </View>
        </View>
      </CommonCardRenderer>
    );
  };

  // Configuration for common component
  const filters = ['Period', 'Status'];
  const summaryCards = [
    {label: 'Total', value: '₹95,200'},
    {label: 'Tax', value: '₹17,136'},
    {label: 'AVG', value: '₹23,800'},
    {label: 'Docs', value: '4'},
  ];

  return (
    <>
      <ErrorBoundary>
        <Header
          title="Purchase Register"
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

        <RegisterComponent
          data={purchases}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedItems={selectedPurchases}
          onItemPress={handleTap}
          onItemLongPress={handleLongPress}
          onShareSelected={shareSelectedPurchases}
          renderCard={renderPurchaseCard}
          filters={filters}
          summaryCards={summaryCards}
          sectionTitle="Purchase Orders"
          shareButtonText={`Share ${selectedPurchases.length} Purchase Order(s)`}
          shareButtonColor="#07624C"
        />
      </ErrorBoundary>
    </>
  );
};

const styles = StyleSheet.create({});

export default PurchaseRegister;
