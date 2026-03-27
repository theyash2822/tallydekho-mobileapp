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

const Payables = () => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('recent');
  const [selectedPeriod, setSelectedPeriod] = useState('Period');
  const [selectedFilter, setSelectedFilter] = useState('Period');

  // Custom payables cards data
  const payablesCards = [
    {
      id: 1,
      title: 'Total Due',
      value: '₹1,25,000',
      label: 'Payables',
      amount: '₹1,25,000',
      icon: Icons.CashOnHand,
      change: '+18%',
    },
    {
      id: 2,
      title: '1-30d',
      value: '₹45,000',
      label: 'Payables',
      amount: '₹45,000',
      icon: Icons.Calender,
      change: '+12%',
    },
    {
      id: 3,
      title: '31-60d',
      value: '₹65,000',
      label: 'Payables',
      amount: '₹65,000',
      icon: Icons.Calender,
      change: '+25%',
    },
    {
      id: 4,
      title: '61-90d',
      value: '₹55,000',
      label: 'Payables',
      amount: '₹55,000',
      icon: Icons.Calender,
      change: '-8%',
    },
    {
      id: 5,
      title: '90+d',
      value: '₹1,85,000',
      label: 'Payables',
      amount: '₹1,85,000',
      icon: Icons.Calender,
      change: '+28%',
    },
  ];

  // Mock data for recent payables with full date information
  const allRecentPayables = [{
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


  const filteredRecentPayables = filterDataByStatusAndPeriod(
    allRecentPayables,
    'All', // selectedStatus - not used in payables
    selectedPeriod,
    'date', // dateField - use 'date' field which is in "10 Jul" format
    'status', // statusField - not used in payables
    false, // useIsPaid = false
  );

  // Mock data for overdue payables
  const overduePayables = [
    {id: 1, name: 'Tech Solutions Ltd', daysOverdue: '28d', amount: '₹125 K'},
    {id: 2, name: 'Global Suppliers', daysOverdue: '35d', amount: '₹95 K'},
    {id: 3, name: 'Innovation Corp', daysOverdue: '42d', amount: '₹185 K'},
    {id: 4, name: 'Quality Imports', daysOverdue: '31d', amount: '₹75 K'},
    {id: 5, name: 'Smart Systems', daysOverdue: '38d', amount: '₹65 K'},
    {id: 6, name: 'Elite Trading', daysOverdue: '45d', amount: '₹55 K'},
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
          filters={['Period', 'Overdue', 'Payments']}
        />
        <View style={{paddingBottom:10}}>
          <FinancialMetricsSection
            cards={payablesCards}
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
              recentOutstandings={filteredRecentPayables}
              overdueParties={overduePayables}
              recentTabLabel="Recent Payables"
              overdueTabLabel="Overdue Parties"
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

export default Payables;
