import React, {useState} from 'react';
import {View, ScrollView, StyleSheet} from 'react-native';
import Colors from '../../utils/Colors';
import {FilterBar, FinancialMetricsSection} from '../../components/financial';
import {
  LoanCard,
  OutstandingODSection,
  NearTermCalendar,
} from '../../components/loans';
import {Icons} from '../../utils/Icons';

const LoansODs = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('Period');
  const [selectedFilter, setSelectedFilter] = useState('Period');

  // Financial metrics cards data
  const loansCards = [
    {
      id: 1,
      title: 'Total Principal',
      value: '₹12.4 M',
      change: '+8.5%',
      icon: Icons.CashOnHand,
    },
    {
      id: 2,
      title: 'Utilised',
      value: '₹8.2 M',
      change: '+12.3%',
      icon: Icons.Calender,
    },
    {
      id: 3,
      title: 'EMI Due this Month',
      value: '₹4.2 M',
      change: '+5.7%',
      icon: Icons.Calender,
    },
    {
      id: 4,
      title: 'Avg Rate',
      value: '₹185 K',
      change: '+2.1%',
      icon: Icons.Payment,
    },
    {
      id: 5,
      title: 'Next Maturity',
      value: '8.5%',
      change: '-0.2%',
      icon: Icons.Bank,
    },
  ];

  // Loan cards data
  const loanData = [
    {
      id: 1,
      loanName: 'HDFC Term Loan',
      maturityDate: '14 Aug 26',
      principal: '₹5.30 M',
      rate: '8.5% fixed',
      emi: '₹185 K (next 14 Jul)',
      color: '#10B981', // green
    },
    {
      id: 2,
      loanName: 'Axis OD',
      maturityDate: '31 Dec 25',
      principal: '₹2.10 M',
      rate: '9.2% variable',
      emi: '₹75 K (next 20 Jul)',
      color: '#3B82F6', // blue
    },
    {
      id: 3,
      loanName: 'SBI Home Loan',
      maturityDate: '15 Mar 28',
      principal: '₹5.00 M',
      rate: '7.8% fixed',
      emi: '₹165 K (next 25 Jul)',
      color: '#F59E0B', // orange
    },
  ];

  // Outstanding data for 6 months
  const outstandingData = [
    {month: 'Jul 25', amount: '200 L', percentage: 59},
    {month: 'Jun 25', amount: '175 L', percentage: 63},
    {month: 'May 25', amount: '220 L', percentage: 66},
    {month: 'Apr 25', amount: '160 L', percentage: 70},
    {month: 'Mar 25', amount: '190 L', percentage: 74},
    {month: 'Feb 25', amount: '210 L', percentage: 78},
  ];

  // OD Utilization data for 30 days
  const odUtilizationData = [
    {id: 1, date: '3 Jun', amount: '200 L', percentage: 59},
    {id: 2, date: '20 Jun', amount: '175 L', percentage: 63},
    {id: 3, date: '27 Jun', amount: '220 L', percentage: 90},
    {id: 4, date: '04 Jul', amount: '160 L', percentage: 80},
    {id: 5, date: '11 Jul', amount: '190 L', percentage: 74},
  ];

  // Calendar events data
  const calendarEvents = [
    {
      id: 1,
      name: 'HDFC Term Loan',
      description: 'Jul EMI #18',
      dueDate: '10 Jul',
      amount: '₹185 K',
    },
    {
      id: 2,
      name: 'Axis OD',
      description: 'OD Interest',
      dueDate: '10 Jul',
      amount: '₹42 K',
    },
    {
      id: 3,
      name: 'HDFC Term Loan',
      description: 'Jul EMI #19',
      dueDate: '14 Jul',
      amount: '₹185 K',
    },
    {
      id: 4,
      name: 'SBI Home Loan',
      description: 'Jul EMI #12',
      dueDate: '25 Jul',
      amount: '₹165 K',
    },
  ];

  return (
    <>
      {/* Financial Metrics Section */}
      <View style={{backgroundColor: '#fff'}}>
        <FilterBar
          selectedFilter={selectedFilter}
          setSelectedFilter={setSelectedFilter}
          selectedPeriod={selectedPeriod}
          setSelectedPeriod={setSelectedPeriod}
          filters={['Period', 'Overdue']}
        />
        <View style={{paddingBottom: 10}}>
        <FinancialMetricsSection cards={loansCards} />
        </View>
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={{padding: 12}}>
          {/* Loan Cards Section */}
          <LoanCard loan={loanData} />

          {/* Outstanding/OD Utilization Section */}
          <OutstandingODSection
            outstandingData={outstandingData}
            odUtilizationData={odUtilizationData}
          />

          {/* Near Term Calendar Section */}
          <NearTermCalendar calendarEvents={calendarEvents} />
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundColorPrimary,
    marginTop: 10,
  },
});

export default LoansODs;
