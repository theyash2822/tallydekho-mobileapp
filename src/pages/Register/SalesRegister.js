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
  IconContainer,
  StatusRow,
} from './common/RegisterComponent';

const SalesRegister = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedInvoices, setSelectedInvoices] = useState([]);

  // Mock data for sales invoices with full date information (includes dates from Nov 2025 to Jan 2026)
  const salesInvoices = [
    {
      id: 1,
      status: 'Paid',
      reference: 'INV-30975',
      customer: 'ABC Traders',
      date: '1 Jan',
      fullDate: '01/01/2026', // DD/MM/YYYY format for display
      time: '09:00 AM',
      amount: '₹42,500',
      isPaid: true,
      category: 'Electronics',
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
      category: 'Textiles',
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
      category: 'Electronics',
    },
    {
      id: 4,
      status: 'Unpaid',
      reference: 'INV-30978',
      customer: 'LMN Industries',
      date: '15 Dec',
      fullDate: '15/12/2025',
      time: '07:30 PM',
      amount: '₹28,900',
      isPaid: false,
      category: 'Machinery',
    },
    {
      id: 5,
      status: 'Paid',
      reference: 'INV-30979',
      customer: 'DEF Corporation',
      date: '10 Dec',
      fullDate: '10/12/2025',
      time: '06:45 PM',
      amount: '₹67,300',
      isPaid: true,
      category: 'Automotive',
    },
    {
      id: 6,
      status: 'Unpaid',
      reference: 'INV-30980',
      customer: 'GHI Solutions',
      date: '25 Nov',
      fullDate: '25/11/2025',
      time: '05:15 PM',
      amount: '₹23,400',
      isPaid: false,
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

  // Handle invoice selection
  const toggleInvoiceSelection = invoiceId => {
    setSelectedInvoices(prev => {
      if (prev.includes(invoiceId)) {
        return prev.filter(id => id !== invoiceId);
      } else {
        return [...prev, invoiceId];
      }
    });
  };

  // Handle long press selection
  const handleLongPress = invoiceId => {
    if (!selectedInvoices.includes(invoiceId)) {
      toggleInvoiceSelection(invoiceId);
    }
  };

  // Handle tap selection
  const handleTap = invoiceId => {
    if (selectedInvoices.length > 0) {
      // If in selection mode, toggle selection
      toggleInvoiceSelection(invoiceId);
    }
  };

  // Share selected invoices
  const shareSelectedInvoices = () => {
    console.log('Sharing invoices:', selectedInvoices);
    // Implement share functionality here
  };

  // Configuration objects
  const statusConfig = {
    getColor: status => (status === 'Paid' ? '#10B981' : '#EF4444'),
  };

  const iconConfig = {
    backgroundColor: '#F0F2F9',
  };

  // Render invoice card
  const renderInvoiceCard = invoice => {
    const isSelected = selectedInvoices.includes(invoice.id);

    return (
      <CommonCardRenderer
        key={invoice.id}
        item={invoice}
        isSelected={isSelected}
        onPress={handleTap}
        onLongPress={handleLongPress}
        statusConfig={statusConfig}
        iconConfig={iconConfig}>
        <View style={RegisterStyles.content}>
          {/* Top row: Status + Reference */}
          <View style={RegisterStyles.header}>
            <StatusRow
              status={invoice.status}
              reference={invoice.reference}
              statusConfig={statusConfig}
            />
          </View>

          {/* Second row: Icon + Customer + Amount */}
          <View style={RegisterStyles.mainRow}>
            <IconContainer iconConfig={iconConfig}>
              <Feather name="arrow-down-left" size={16} color="#10B981" />
            </IconContainer>
            <View style={RegisterStyles.info}>
              <Text style={RegisterStyles.title}>{invoice.customer}</Text>
              <Text style={RegisterStyles.date}>
                {invoice.fullDate} | {invoice.time}
              </Text>
            </View>
            <Text style={RegisterStyles.amount}>{invoice.amount}</Text>
          </View>
        </View>
      </CommonCardRenderer>
    );
  };

  // Configuration for common component
  const filters = ['Period', 'Status'];
  const summaryCards = [
    {label: 'Total', value: '₹1,274,560'},
    {label: 'Tax', value: '₹14,380'},
    {label: 'AVG', value: '₹138,240'},
    {label: 'Docs', value: '86'},
  ];

  return (
    <>
      <ErrorBoundary>
        <Header
          title="Sales Register"
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
          data={salesInvoices}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedItems={selectedInvoices}
          onItemPress={handleTap}
          onItemLongPress={handleLongPress}
          onShareSelected={shareSelectedInvoices}
          renderCard={renderInvoiceCard}
          filters={filters}
          summaryCards={summaryCards}
          sectionTitle="Sales Invoices"
          shareButtonText={`Share ${selectedInvoices.length} Invoice(s)`}
          shareButtonColor="#07624C"
        />
      </ErrorBoundary>
    </>
  );
};

const styles = StyleSheet.create({});

export default SalesRegister;
