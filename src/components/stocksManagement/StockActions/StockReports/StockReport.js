import React from 'react';
import {View, StyleSheet} from 'react-native';
import Header from '../../../common/Header';
import {useNavigation} from '@react-navigation/native';
import ReportBody from './ReportsBody';

const StockReports = () => {
  const navigation = useNavigation();
  return (
    <>
      {/* <Header /> */}
      <Header
        title="Report"
        leftIcon="chevron-left"
        onLeftPress={navigation.goBack}
        // rightIconType="Ionicons"
        // rightIcon="filter"
        // onLeftPress={() => navigation.navigate('dashboard')}
        // onRightPress={() => console.log('Open Settings')}
      />
      <View style={styles.container}>
        <ReportBody />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F6F8FA',
    flex:1
  },
});

export default StockReports;
