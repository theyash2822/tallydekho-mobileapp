import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Animated,
} from 'react-native';
import Header from '../common/Header';
import {useRoute, useNavigation} from '@react-navigation/native';
import {PieChart} from 'react-native-svg-charts';
import Colors from '../../utils/Colors';
import LedgerInformationModal from './LedgerInformationModal';
import LedgerTilesList from './LedgerTilesList';
import CustomCalendar from '../common/Calender';
import {CustomBottomButton} from '../common';
import apiService from '../../services/api/apiService';
import {Logger} from '../../services/utils/logger';
import {useAuth} from '../../hooks/useAuth';
import {formatTallyDate, groupVouchersByMonth} from './helper';

const LedgerDetails = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const {ledger} = route.params || {};
  const [infoVisible, setInfoVisible] = React.useState(false);
  const [ledgerData, setLedgerData] = useState(null);
  const [loading, setLoading] = useState(false);

  const {selectedGuid, companies, selectedFY} = useAuth();

  const fetchData = async () => {
    const fromDate = formatTallyDate(selectedFY?.yearStart);
    const toDate = formatTallyDate(selectedFY?.yearEnd);

    setLoading(true);
    try {
      const body = {
        companyGuid: selectedGuid,
        ledgerGuid: ledger?.guid,
        fromDate,
        toDate,
      };

      Logger.debug('Fetching ledger details', {
        companyGuid: body.companyGuid,
        ledgerGuid: body.ledgerGuid,
      });

      const response = await apiService.fetchLedgerDetails(body);

      Logger.debug('Ledger details received', {
        ledgerName: response?.data?.ledger?.name,
        vouchersCount: response?.data?.ledger?.vouchers?.length,
      });

      const ledgerObj = response?.data?.ledger;

      // Wait 1 second before showing data
      await new Promise(resolve => setTimeout(resolve, 10));

      setLedgerData(ledgerObj);
    } catch (err) {
      Logger.error('Ledger details fetch error', err);
      if (err.isNetworkError) {
        Logger.warn('Network error fetching ledger details');
      } else if (err.isTimeout) {
        Logger.warn('Request timed out');
      }
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  const pieData = [
    {
      key: 1,
      value: 33,
      svg: {fill: '#1DB39B'},
      label: 'INR 33K Cr',
    },
    {
      key: 2,
      value: 67,
      svg: {fill: '#F47B6E'},
      label: 'INR 67K Dr',
    },
  ];

  // Show loading state
  if (loading || !ledgerData) {
    return (
      <>
        <Header
          title={ledger?.name || 'Ledger Detail'}
          leftIcon="chevron-left"
          onLeftPress={() => navigation.goBack()}
          onRightPress={() => setInfoVisible(true)}
          rightIcon="info"
          rightIconType="Feather"
        />
      </>
    );
  }

  const grouped = ledgerData?.vouchers
    ? groupVouchersByMonth(ledgerData.vouchers)
    : [];

  return (
    <>
      <Header
        title={ledger?.name || 'Ledger Detail'}
        leftIcon="chevron-left"
        onLeftPress={() => navigation.goBack()}
        onRightPress={() => setInfoVisible(true)}
        rightIcon="info"
        rightIconType="Feather"
      />

      <View style={{flex: 1, backgroundColor: '#F6F8FA'}}>
        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: 12,
            paddingBottom: 10,
            paddingTop: 8,
          }}
          showsVerticalScrollIndicator={false}>
          <LedgerInformationModal
            visible={infoVisible}
            onClose={() => setInfoVisible(false)}
            data={ledgerData}
          />
          <View style={styles.section}>
            <View style={styles.detailHeaderRow}>
              <Text style={styles.detailTitle}> Detail</Text>
              <TouchableOpacity style={styles.filterRow}>
                <CustomCalendar label="Select Date Range" />
              </TouchableOpacity>
            </View>
            <View style={styles.card}>
              <View style={styles.infoRowSingle}>
                <Text style={styles.label}>Group</Text>
                <Text style={styles.value}>{ledgerData?.parent}</Text>
              </View>

              <View style={styles.infoRowSingle}>
                <Text style={styles.label}>Closing Balance</Text>
                <Text style={styles.amount}>
                  ₹ {Number(ledgerData?.closingBalance).toLocaleString('en-IN')}
                </Text>
              </View>

              <PieChart
                style={{height: 120, marginVertical: 10}}
                data={pieData}
                innerRadius={3}
                padAngle={0.05}
              />
              <View style={styles.pieLabelsRow}>
                <View style={styles.pieLabelItem}>
                  <View style={[styles.pieDot, {backgroundColor: '#1DB39B'}]} />
                  <Text style={styles.pieLabelText}>{pieData[0].label}</Text>
                </View>
                <View style={styles.pieLabelItem}>
                  <View style={[styles.pieDot, {backgroundColor: '#F47B6E'}]} />
                  <Text style={styles.pieLabelText}>{pieData[1].label}</Text>
                </View>
              </View>
            </View>
            <View style={styles.statsCard}>
              <View style={styles.statsRowSingle}>
                <Text style={styles.statsLabel}>Opening</Text>
                <Text style={styles.statsValue}>
                  {ledgerData?.openingBalance}
                </Text>
              </View>
              <View style={styles.statsRowSingle}>
                <Text style={styles.statsLabel}>Closing</Text>
                <Text style={styles.statsValue}>
                  ₹ {Number(ledgerData?.closingBalance).toLocaleString('en-IN')}
                </Text>
              </View>
              <View style={styles.statsRowSingle}>
                <Text style={styles.statsLabel}>Total Credit</Text>
                <Text style={styles.statsValue}>
                  ₹ {Number(ledgerData?.totalCredit).toLocaleString('en-IN')}
                </Text>
              </View>
              <View style={styles.statsRowSingle}>
                <Text style={styles.statsLabel}>Total Debit</Text>
                <Text style={styles.statsValue}>
                  ₹ {Number(ledgerData?.totalDebit).toLocaleString('en-IN')}
                </Text>
              </View>
              <View style={styles.statsRowSingle}>
                <Text style={styles.statsLabel}>Vouchers</Text>
                <Text style={styles.statsValue}>
                  {ledgerData?.totalVouchers}
                </Text>
              </View>
            </View>

            <LedgerTilesList tilesData={grouped} />
          </View>
        </ScrollView>
      </View>
      <CustomBottomButton buttonText="Share PDF/XLSX" />
    </>
  );
};

const styles = StyleSheet.create({
  section: {
    marginTop: 0,
  },
  detailHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 0,
  },
  detailTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.primaryText,
    flex: 1,
  },
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    zIndex:1000
  },
  filterText: {
    marginLeft: 4,
    color: Colors.primaryText,
    fontSize: 14,
  },
  card: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: '#fff',
    marginTop: 10,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoRowSingle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    color: Colors.secondaryText,
    fontSize: 13,
  },
  value: {
    color: Colors.primaryText,
    fontWeight: 'bold',
    fontSize: 15,
    marginTop: 2,
  },
  amount: {
    color: Colors.primaryText,
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 2,
  },
  pieLabelsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 8,
  },
  pieLabelItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 8,
  },
  pieDot: {
    width: 12,
    height: 12,
    borderRadius: 3,
    marginRight: 4,
  },
  pieLabelText: {
    fontSize: 13,
    color: Colors.primaryText,
  },
  statsCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  statsRowSingle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  statsCol: {
    flex: 1,
    alignItems: 'center',
  },
  statsLabel: {
    color: Colors.secondaryText,
    fontSize: 13,
  },
  statsValue: {
    color: Colors.primaryText,
    fontWeight: 'bold',
    fontSize: 15,
    marginTop: 2,
  },
});

export default LedgerDetails;





// use this with calender for api vocuher data with datewise

// import React, {useState} from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   TextInput,
//   ScrollView,
//   Animated,
//   Dimensions,
// } from 'react-native';
// import Header from '../common/Header';
// import {useRoute, useNavigation} from '@react-navigation/native';
// import {PieChart} from 'react-native-svg-charts';
// import Colors from '../../utils/Colors';
// import LedgerInformationModal from './LedgerInformationModal';
// import LedgerTilesList from './LedgerTilesList';
// import CustomCalendar from '../common/Calender';
// import {CustomBottomButton} from '../common';
// import apiService from '../../services/api/apiService';
// import {Logger} from '../../services/utils/logger';
// import {useAuth} from '../../hooks/useAuth';
// import {formatTallyDate, groupVouchersByMonth} from './helper';
// import ShimmerPlaceholder from '../common/ShimmerPlaceholder';

// const LedgerDetails = () => {
//   const route = useRoute();
//   const navigation = useNavigation();
//   const {ledger} = route.params || {};
//   const [infoVisible, setInfoVisible] = React.useState(false);
//   const [ledgerData, setLedgerData] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [selectedDateRange, setSelectedDateRange] = useState({
//     startDate: null,
//     endDate: null,
//   });

//   const {selectedGuid, companies, selectedFY} = useAuth();

//   // Helper function to convert YYYY-MM-DD to YYYYMMDD format (same as selectedFY format)
//   const formatDateForAPI = dateString => {
//     if (!dateString) return '';
//     // dateString is in YYYY-MM-DD format from calendar
//     // Convert to YYYYMMDD format (same format as selectedFY?.yearStart)
//     return dateString.replace(/-/g, ''); // "2025-01-15" -> "20250115"
//   };

//   const fetchData = async (customStartDate = null, customEndDate = null) => {
//     // Use custom dates if provided, otherwise use FY dates
//     // API expects YYYYMMDD format (same as selectedFY?.yearStart format)
//     const fromDate = customStartDate
//       ? formatDateForAPI(customStartDate) // Calendar returns YYYY-MM-DD, convert to YYYYMMDD
//       : selectedFY?.yearStart;
//     const toDate = customEndDate
//       ? formatDateForAPI(customEndDate) // Calendar returns YYYY-MM-DD, convert to YYYYMMDD
//       : selectedFY?.yearEnd;

//     setLoading(true);
//     try {
//       const body = {
//         companyGuid: selectedGuid,
//         ledgerGuid: ledger?.guid,
//         fromDate,
//         toDate,
//       };

//       Logger.debug('Fetching ledger details', {
//         companyGuid: body.companyGuid,
//         ledgerGuid: body.ledgerGuid,
//         fromDate: body.fromDate,
//         toDate: body.toDate,
//       });

//       const response = await apiService.fetchLedgerDetails(body);

//       Logger.debug('Ledger details received', {
//         ledgerName: response?.data?.ledger?.name,
//         vouchersCount: response?.data?.ledger?.vouchers?.length,
//       });

//       // ✅ Correct Extraction
//       const ledgerObj = response?.data?.ledger;

//       // Wait 1 second before showing data
//       await new Promise(resolve => setTimeout(resolve, 10));

//       setLedgerData(ledgerObj);
//     } catch (err) {
//       Logger.error('Ledger details fetch error', err);
//       // Better error handling with new API service
//       if (err.isNetworkError) {
//         Logger.warn('Network error fetching ledger details');
//       } else if (err.isTimeout) {
//         Logger.warn('Request timed out');
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   React.useEffect(() => {
//     fetchData();
//   }, []);

//   // Handle date range selection from calendar (stores dates for OK button)
//   const handleDateRangeChange = ({startDate, endDate}) => {
//     setSelectedDateRange({startDate, endDate});
//   };

//   // Handle OK button press - fetch data with selected dates
//   const handleDateConfirm = ({startDate, endDate}) => {
//     // Update selected date range state to persist the selected dates
//     setSelectedDateRange({startDate, endDate});
    
//     if (startDate && endDate) {
//       // Both dates selected - fetch with date range
//       fetchData(startDate, endDate);
//     } else if (startDate && !endDate) {
//       // Only start date - use it as both from and to date
//       fetchData(startDate, startDate);
//     } else if (!startDate && !endDate) {
//       // No dates selected - reset to FY dates
//       setSelectedDateRange({startDate: null, endDate: null});
//       fetchData();
//     }
//   };

//   const pieData = [
//     {
//       key: 1,
//       value: 33,
//       svg: {fill: '#1DB39B'},
//       label: 'INR 33K Cr',
//     },
//     {
//       key: 2,
//       value: 67,
//       svg: {fill: '#F47B6E'},
//       label: 'INR 67K Dr',
//     },
//   ];

//   const renderShimmerBlock = (width, height, style) => (
//     <ShimmerPlaceholder width={width} height={height} style={style} />
//   );
//   const screenWidth = Dimensions.get('window').width;
//   const shimmerFullWidth = Math.max(screenWidth - 24, 200); // account for horizontal padding
//   const shimmerPillWidth = Math.max((screenWidth - 24 - 8) / 3, 80); // three pills with small spacing

//   const renderMonthShimmer = (keySuffix = '') => (
//     <View
//       key={`month-${keySuffix}`}
//       style={{
//         marginBottom: 12,
//         backgroundColor: '#fff',
//         borderRadius: 10,
//         borderWidth: 1,
//         borderColor: Colors.border,
//         overflow: 'hidden',
//       }}>
//       <View
//         style={{
//           flexDirection: 'row',
//           justifyContent: 'space-between',
//           alignItems: 'center',
//           paddingHorizontal: 14,
//           paddingVertical: 12,
//         }}>
//         {renderShimmerBlock(120, 14, {borderRadius: 6})}
//         {renderShimmerBlock(22, 22, {borderRadius: 11})}
//       </View>
//       {Array.from({length: 3}).map((_, idx) => (
//         <View
//           key={`month-row-${keySuffix}-${idx}`}
//           style={{
//             paddingHorizontal: 14,
//             paddingVertical: 12,
//             borderTopWidth: idx === 0 ? 1 : 0,
//             borderBottomWidth: idx === 2 ? 0 : 1,
//             borderColor: '#E4E7EB',
//             flexDirection: 'row',
//             justifyContent: 'space-between',
//             alignItems: 'center',
//             backgroundColor: '#fff',
//           }}>
//           <View style={{flex: 1}}>
//             {renderShimmerBlock(150, 12, {borderRadius: 6, marginBottom: 6})}
//             {renderShimmerBlock(110, 10, {borderRadius: 6})}
//           </View>
//           {renderShimmerBlock(70, 12, {borderRadius: 6, marginLeft: 12})}
//         </View>
//       ))}
//     </View>
//   );

//   // Shimmer placeholder when loading (initial load or date change)
//   if (loading || !ledgerData) {
//     return (
//       <>
//         <Header
//           title={ledger?.name || 'Ledger Detail'}
//           leftIcon="chevron-left"
//           onLeftPress={() => navigation.goBack()}
//           onRightPress={() => setInfoVisible(true)}
//           rightIcon="info"
//           rightIconType="Feather"
//         />
//         <View style={{flex: 1, backgroundColor: '#F6F8FA'}}>
//           <ScrollView
//             showsVerticalScrollIndicator={false}
//             contentContainerStyle={{
//               paddingHorizontal: 12,
//               paddingBottom: 16,
//               paddingTop: 12,
//             }}>
//             <View style={[styles.section, {marginTop: 0}]}>
//               <View
//                 style={{
//                   flexDirection: 'row',
//                   alignItems: 'center',
//                   justifyContent: 'space-between',
//                   marginBottom: 8,
//                 }}>
//                 {renderShimmerBlock(120, 18, {borderRadius: 6})}
//                 {renderShimmerBlock(150, 36, {borderRadius: 10})}
//               </View>
//             </View>

//             <View style={styles.card}>
//               <View style={styles.infoRowSingle}>
//                 {renderShimmerBlock(90, 14, {borderRadius: 6})}
//                 {renderShimmerBlock(120, 16, {borderRadius: 6})}
//               </View>
//               <View style={[styles.infoRowSingle, {marginTop: 10}]}>
//                 {renderShimmerBlock(130, 14, {borderRadius: 6})}
//                 {renderShimmerBlock(140, 18, {borderRadius: 8})}
//               </View>
//               <View style={{alignItems: 'center', marginTop: 12}}>
//                 {renderShimmerBlock(220, 140, {borderRadius: 70})}
//               </View>
//               <View
//                 style={{
//                   flexDirection: 'row',
//                   justifyContent: 'space-around',
//                   marginTop: 14,
//                 }}>
//                 {renderShimmerBlock(80, 14, {borderRadius: 6})}
//                 {renderShimmerBlock(80, 14, {borderRadius: 6})}
//               </View>
//             </View>

//             <View style={[styles.card, {marginTop: 16}]}>
//               <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
//                 {renderShimmerBlock(110, 16, {borderRadius: 6})}
//                 {renderShimmerBlock(80, 16, {borderRadius: 6})}
//               </View>
//               <View style={{marginTop: 14}}>
//                 {Array.from({length: 5}).map((_, idx) => (
//                   <View
//                     key={`stat-${idx}`}
//                     style={{
//                       flexDirection: 'row',
//                       justifyContent: 'space-between',
//                       alignItems: 'center',
//                       paddingVertical: 10,
//                       borderBottomWidth: idx === 4 ? 0 : 1,
//                       borderColor: '#E4E7EB',
//                     }}>
//                     {renderShimmerBlock(140, 12, {borderRadius: 6})}
//                     {renderShimmerBlock(90, 12, {borderRadius: 6})}
//                   </View>
//                 ))}
//               </View>
//             </View>

//             {/* Voucher list shimmer */}
//             <View style={{marginTop: 4}}>
//               {renderShimmerBlock(shimmerFullWidth, 50, {
//                 borderRadius: 10,
//                 marginBottom: 12,
//               })}
//               <View style={{flexDirection: 'row', marginBottom: 12}}>
//                 {Array.from({length: 3}).map((_, idx) => (
//                   <View key={`pill-${idx}`} style={{flex: 1, paddingHorizontal: 4}}>
//                     {renderShimmerBlock(shimmerPillWidth, 34, {borderRadius: 18})}
//                   </View>
//                 ))}
//               </View>
//               {renderMonthShimmer('a')}
//               {renderMonthShimmer('b')}
//             </View>
//           </ScrollView>
//         </View>
//       </>
//     );
//   }

//   const grouped = ledgerData?.vouchers
//     ? groupVouchersByMonth(ledgerData.vouchers)
//     : [];

//   return (
//     <>
//       <Header
//         title={ledger?.name || 'Ledger Detail'}
//         leftIcon="chevron-left"
//         onLeftPress={() => navigation.goBack()}
//         onRightPress={() => setInfoVisible(true)}
//         rightIcon="info"
//         rightIconType="Feather"
//       />

//       <View style={{flex: 1, backgroundColor: '#F6F8FA'}}>
//         <ScrollView
//           contentContainerStyle={{
//             paddingHorizontal: 12,
//             paddingBottom: 10,
//             paddingTop: 8,
//           }}
//           showsVerticalScrollIndicator={false}>
//           <LedgerInformationModal
//             visible={infoVisible}
//             onClose={() => setInfoVisible(false)}
//             data={ledgerData}
//           />
//           <View style={styles.section}>
//             <View style={styles.detailHeaderRow}>
//               <Text style={styles.detailTitle}></Text>
//               <TouchableOpacity style={styles.filterRow}>
//                 <CustomCalendar
//                   label="Select Date Range"
//                   onDateRangeChange={handleDateRangeChange}
//                   onOk={handleDateConfirm}
//                   selectedStartDate={selectedDateRange.startDate}
//                   selectedEndDate={selectedDateRange.endDate}
//                 />
//               </TouchableOpacity>
//             </View>
//             <View style={styles.card}>
//               <View style={styles.infoRowSingle}>
//                 <Text style={styles.label}>Group</Text>
//                 <Text style={styles.value}>{ledgerData?.parent}</Text>
//               </View>

//               <View style={styles.infoRowSingle}>
//                 <Text style={styles.label}>Closing Balance</Text>
//                 <Text style={styles.amount}>
//                   ₹ {Number(ledgerData?.closingBalance).toLocaleString('en-IN')}
//                 </Text>
//               </View>

//               <PieChart
//                 style={{height: 120, marginVertical: 10}}
//                 data={pieData}
//                 innerRadius={30}
//                 padAngle={0.05}
//               />
//               <View style={styles.pieLabelsRow}>
//                 <View style={styles.pieLabelItem}>
//                   <View style={[styles.pieDot, {backgroundColor: '#1DB39B'}]} />
//                   <Text style={styles.pieLabelText}>INR 33K Cr</Text>
//                 </View>
//                 <View style={styles.pieLabelItem}>
//                   <View style={[styles.pieDot, {backgroundColor: '#F47B6E'}]} />
//                   <Text style={styles.pieLabelText}>INR 67K Dr</Text>
//                 </View>
//               </View>
//             </View>
//             <View style={styles.statsCard}>
//               <View style={styles.statsRowSingle}>
//                 <Text style={styles.statsLabel}>Opening</Text>
//                 <Text style={styles.statsValue}>
//                   {ledgerData?.openingBalance}
//                 </Text>
//               </View>
//               <View style={styles.statsRowSingle}>
//                 <Text style={styles.statsLabel}>Closing</Text>
//                 <Text style={styles.statsValue}>
//                   ₹ {Number(ledgerData?.closingBalance).toLocaleString('en-IN')}
//                 </Text>
//               </View>
//               <View style={styles.statsRowSingle}>
//                 <Text style={styles.statsLabel}>Total Credit</Text>
//                 <Text style={styles.statsValue}>
//                   ₹ {Number(ledgerData?.totalCredit).toLocaleString('en-IN')}
//                 </Text>
//               </View>
//               <View style={styles.statsRowSingle}>
//                 <Text style={styles.statsLabel}>Total Debit</Text>
//                 <Text style={styles.statsValue}>
//                   ₹ {Number(ledgerData?.totalDebit).toLocaleString('en-IN')}
//                 </Text>
//               </View>
//               <View style={styles.statsRowSingle}>
//                 <Text style={styles.statsLabel}>Vouchers</Text>
//                 <Text style={styles.statsValue}>
//                   {ledgerData?.totalVouchers}
//                 </Text>
//               </View>
//             </View>

//             <LedgerTilesList tilesData={grouped} />
//           </View>
//         </ScrollView>
//       </View>
//       <CustomBottomButton buttonText="Share PDF/XLSX" />
//     </>
//   );
// };

// const styles = StyleSheet.create({
//   section: {
//     marginTop: 8,
//   },
//   detailHeaderRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 8,
//   },
//   detailTitle: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: Colors.primaryText,
//     flex: 1,
//   },
//   filterRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   filterText: {
//     marginLeft: 4,
//     color: Colors.primaryText,
//     fontSize: 14,
//   },
//   card: {
//     borderRadius: 12,
//     padding: 16,
//     marginBottom: 12,
//     borderWidth: 1,
//     borderColor: Colors.border,
//     backgroundColor: '#fff',
//     marginTop: 10,
//   },
//   rowBetween: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   infoRowSingle: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 8,
//   },
//   label: {
//     color: Colors.secondaryText,
//     fontSize: 13,
//   },
//   value: {
//     color: Colors.primaryText,
//     fontWeight: 'bold',
//     fontSize: 15,
//     marginTop: 2,
//   },
//   amount: {
//     color: Colors.primaryText,
//     fontWeight: 'bold',
//     fontSize: 16,
//     marginTop: 2,
//   },
//   pieLabelsRow: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     marginTop: 8,
//   },
//   pieLabelItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginHorizontal: 8,
//   },
//   pieDot: {
//     width: 12,
//     height: 12,
//     borderRadius: 6,
//     marginRight: 4,
//   },
//   pieLabelText: {
//     fontSize: 13,
//     color: Colors.primaryText,
//   },
//   statsCard: {
//     backgroundColor: Colors.white,
//     borderRadius: 12,
//     padding: 16,
//     marginBottom: 16,
//     borderWidth: 1,
//     borderColor: Colors.border,
//   },
//   statsRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 8,
//   },
//   statsRowSingle: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 8,
//   },
//   statsCol: {
//     flex: 1,
//     alignItems: 'center',
//   },
//   statsLabel: {
//     color: Colors.secondaryText,
//     fontSize: 13,
//   },
//   statsValue: {
//     color: Colors.primaryText,
//     fontWeight: 'bold',
//     fontSize: 15,
//     marginTop: 2,
//   },
// });

// export default LedgerDetails;
