import React, {useState} from 'react';
import {View, ScrollView, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Colors from '../../utils/Colors';
import {
  FilterBar,
  FinancialMetricsSection,
  TransactionList,
} from '../../components/financial';
import {filterDataByStatusAndPeriod} from '../../components/Helper/DateFilterHelper';
import {Icons} from '../../utils/Icons';

const Receivables = () => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('recent');
  const [selectedPeriod, setSelectedPeriod] = useState('Period');
  const [selectedFilter, setSelectedFilter] = useState('Period');

  // Custom receivables cards data
  const receivablesCards = [
    {
      id: 1,
      title: 'Total Due',
      value: '₹75,000',
      icon: Icons.CashOnHand,
      label: 'Receivables',
      amount: '₹75,000',
      change: '+12%',
    },
    {
      id: 2,
      title: '1-30d',
      value: '₹25,000',
      icon: Icons.Calender,
      label: 'Receivables',
      amount: '₹25,000',
      change: '+8%',
    },
    {
      id: 3,
      title: '31-60d',
      value: '₹35,000',
      icon: Icons.Calender,
      label: 'Receivables',
      amount: '₹35,000',
      change: '+15%',
    },
    {
      id: 4,
      title: '61-90d',
      value: '₹45,000',
      icon: Icons.Calender,
      label: 'Receivables',
      amount: '₹45,000',
      change: '-5%',
    },
    {
      id: 5,
      title: '90+d',
      value: '₹95,000',
      icon: Icons.Calender,
      label: 'Receivables',
      amount: '₹95,000',
      change: '+22%',
    },
  ];

  // Mock data for recent outstandings with full dates
  const allRecentOutstandings = [
    {
      id: 1,
      name: 'ABC Traders',
      reference: 'RC-1578',
      date: '10 Nov',
      fullDate: '10/11/2025',
      amount: '₹54,000',
    },
    {
      id: 2,
      name: 'XYZ Retail',
      reference: 'RC-1579',
      date: '12 Dec',
      fullDate: '12/12/2025',
      amount: '₹54,000',
    },
    {
      id: 3,
      name: 'ABC Traders',
      reference: 'RC-1580',
      date: '15 Nov',
      fullDate: '15/11/2025',
      amount: '₹54,000',
    },
    {
      id: 4,
      name: 'XYZ Retail',
      reference: 'RC-1581',
      date: '18 Dec',
      fullDate: '18/12/2025',
      amount: '₹54,000',
    },
    {
      id: 5,
      name: 'ABC Traders',
      reference: 'RC-1582',
      date: '20 Sep',
      fullDate: '20/09/2025',
      amount: '₹54,000',
    },
    {
      id: 6,
      name: 'XYZ Retail',
      reference: 'RC-1583',
      date: '22 Jul',
      fullDate: '22/07/2025',
      amount: '₹54,000',
    },
    {
      id: 7,
      name: 'DEF Corp',
      reference: 'RC-1584',
      date: '25 Aug',
      fullDate: '25/08/2025',
      amount: '₹32,000',
    },
    {
      id: 8,
      name: 'GHI Ltd',
      reference: 'RC-1585',
      date: '25 Jul',
      fullDate: '25/07/2025',
      amount: '₹28,000',
    },
  ];

  // Filter data based on selected period using the helper function
  // console.log('Receivables - selectedPeriod:', selectedPeriod);
  // console.log('Receivables - allRecentOutstandings:', allRecentOutstandings);

  const filteredRecentOutstandings = filterDataByStatusAndPeriod(
    allRecentOutstandings,
    'All', // selectedStatus - not used in receivables
    selectedPeriod,
    'date', // dateField - use 'date' field which is in "10 Jul" format
    'status', // statusField - not used in receivables
    false, // useIsPaid = false
  );

  // Mock data for overdue parties
  const overdueParties = [
    {id: 1, name: 'ABC Traders', daysOverdue: '35d', amount: '₹375 K'},
    {id: 2, name: 'PQR Exports', daysOverdue: '42d', amount: '₹375 K'},
    {id: 3, name: 'XYZ Warehousing', daysOverdue: '28d', amount: '₹375 K'},
    {id: 4, name: 'LMN Distributors', daysOverdue: '55d', amount: '₹375 K'},
    {id: 5, name: 'RST Logistics', daysOverdue: '38d', amount: '₹375 K'},
    {id: 6, name: 'ABC Traders', daysOverdue: '45d', amount: '₹375 K'},
  ];

  const handleCardPress = card => {
    // Cards are not clickable - no navigation
    // navigation.navigate('CashDetailScreen', {
    //   label: card.title,
    //   amount: card.value,
    //   change: card.change,
    // });
  };

  return (
    <>
      <View style={{backgroundColor: '#fff'}}>
        <FilterBar
          selectedFilter={selectedFilter}
          setSelectedFilter={setSelectedFilter}
          selectedPeriod={selectedPeriod}
          setSelectedPeriod={setSelectedPeriod}
        />
        <View style={{paddingBottom: 10}}>
          <FinancialMetricsSection
            cards={receivablesCards}
            onCardPress={handleCardPress}
          />
        </View>
      </View>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={{padding: 12}}>
          <View style={{backgroundColor: '#fff', borderRadius: 10}}>
            <TransactionList
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              recentOutstandings={filteredRecentOutstandings}
              overdueParties={overdueParties}
            />
          </View>
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundColorPrimary,
  },
});

export default Receivables;
