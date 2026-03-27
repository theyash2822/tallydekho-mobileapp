import React from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import Colors from '../../utils/Colors';

const Table = () => {
  return (
    <ScrollView style={styles.table}>
      {/* Table Header */}
      <View style={styles.tableRowHeader}>
        <Text style={[styles.tableHeaderText, styles.shrink]}>#</Text>
        <Text style={styles.tableHeaderText}>Product/s...</Text>
        <Text style={styles.tableHeaderText}>Qty.</Text>
        <Text style={styles.tableHeaderText}>Taxes</Text>
        <Text style={styles.tableHeaderText}>Total</Text>
      </View>

      {/* Table Rows */}
      {[1, 2, 3, 4].map((item, index) => (
        <React.Fragment key={index}>
          <View style={styles.tableRow}>
            <Text style={[styles.tableText, styles.shrink]}>{item}</Text>
            <Text style={styles.tableText}>Services#1</Text>
            <Text style={styles.tableText}>1</Text>
            <Text style={styles.tableText}>₹12,000</Text>
            <Text style={styles.tableText}>₹12,000</Text>
          </View>
          {/* Divider */}
          <View style={styles.divider} />
        </React.Fragment>
      ))}

      {/* Invoice Summary */}
      <View style={styles.container}>
        <View style={styles.row}>
          <Text style={styles.grayText}>Sub total</Text>
          <Text style={styles.boldText}>₹96,000</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.grayText}>Discount</Text>
          <Text style={styles.boldText}>40%</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.grayText}>Tax</Text>
          <Text style={styles.boldText}>GST | 10.15%</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.grayText}>Logistics</Text>
          <Text style={styles.boldText}>₹96,000</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.grayText}>Validity period</Text>
          <Text style={styles.boldText}>30 days</Text>
        </View>
      </View>
    </ScrollView>
  );
};

// Updated Styles
const styles = StyleSheet.create({
  table: {
    backgroundColor: Colors.white,
    borderRadius: 10,
    marginBottom: 16,
  },
  tableRowHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    paddingVertical: 8,
    backgroundColor: Colors.border,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  tableHeaderText: {
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
    fontSize: 12,
  },
  shrink: {
    flex: 0.5,
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  tableText: {
    flex: 1,
    textAlign: 'center',
    fontSize: 12,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    width: '100%',
  },
  container: {
    padding: 10,
    backgroundColor: Colors.border,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    overflow: 'hidden',
  },
  boldText: {
    fontWeight: '600',
    fontSize: 12,
    marginRight: 8,
  },
  grayText: {
    marginLeft: 8,
    color: '#7C7C7C',
    fontSize: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
});

export default Table;




// Api example
 /*{
  "products": [
    {
      "id": 1,
      "product": "Service #1",
      "quantity": 1,
      "tax": 12000,
      "total": 12000
    },
    {
      "id": 2,
      "product": "Service #2",
      "quantity": 2,
      "tax": 15000,
      "total": 30000
    }
  ],
  "summary": {
    "subTotal": 96000,
    "discount": "40%",
    "tax": "GST | 10.15%",
    "logistics": 96000,
    "validity": "30 days"
  }
}*/

// import React, { useEffect, useState } from 'react';
// import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
// import Colors from '../../utils/Colors';

// const Table = () => {
//   const [products, setProducts] = useState([]);
//   const [summary, setSummary] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchInvoiceData = async () => {
//       try {
//         const res = await fetch('https://your-api-url.com/invoice');
//         const json = await res.json();
//         setProducts(json.products || []);
//         setSummary(json.summary || {});
//       } catch (error) {
//         console.error('Error fetching invoice data:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchInvoiceData();
//   }, []);

//   return (
//     <ScrollView style={styles.table}>
//       {/* Table Header */}
//       <View style={styles.tableRowHeader}>
//         <Text style={[styles.tableHeaderText, styles.shrink]}>#</Text>
//         <Text style={styles.tableHeaderText}>Product/s...</Text>
//         <Text style={styles.tableHeaderText}>Qty.</Text>
//         <Text style={styles.tableHeaderText}>Taxes</Text>
//         <Text style={styles.tableHeaderText}>Total</Text>
//       </View>

//       {loading ? (
//         <ActivityIndicator size="small" color={Colors.primary} style={{ marginVertical: 10 }} />
//       ) : (
//         products.map((item, index) => (
//           <React.Fragment key={item.id || index}>
//             <View style={styles.tableRow}>
//               <Text style={[styles.tableText, styles.shrink]}>{index + 1}</Text>
//               <Text style={styles.tableText}>{item.product}</Text>
//               <Text style={styles.tableText}>{item.quantity}</Text>
//               <Text style={styles.tableText}>₹{item.tax}</Text>
//               <Text style={styles.tableText}>₹{item.total}</Text>
//             </View>
//             <View style={styles.divider} />
//           </React.Fragment>
//         ))
//       )}

//       {/* Invoice Summary */}
//       {!loading && summary && (
//         <View style={styles.container}>
//           <View style={styles.row}>
//             <Text style={styles.grayText}>Sub total</Text>
//             <Text style={styles.boldText}>₹{summary.subTotal}</Text>
//           </View>
//           <View style={styles.row}>
//             <Text style={styles.grayText}>Discount</Text>
//             <Text style={styles.boldText}>{summary.discount}</Text>
//           </View>
//           <View style={styles.row}>
//             <Text style={styles.grayText}>Tax</Text>
//             <Text style={styles.boldText}>{summary.tax}</Text>
//           </View>
//           <View style={styles.row}>
//             <Text style={styles.grayText}>Logistics</Text>
//             <Text style={styles.boldText}>₹{summary.logistics}</Text>
//           </View>
//           <View style={styles.row}>
//             <Text style={styles.grayText}>Validity period</Text>
//             <Text style={styles.boldText}>{summary.validity}</Text>
//           </View>
//         </View>
//       )}
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   table: {
//     backgroundColor: Colors.white,
//     borderRadius: 10,
//     marginBottom: 16,
//   },
//   tableRowHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     borderBottomWidth: 1,
//     borderBottomColor: Colors.border,
//     paddingVertical: 8,
//     backgroundColor: Colors.border,
//     borderTopLeftRadius: 8,
//     borderTopRightRadius: 8,
//   },
//   tableHeaderText: {
//     fontWeight: 'bold',
//     flex: 1,
//     textAlign: 'center',
//     fontSize: 12,
//   },
//   shrink: {
//     flex: 0.5,
//   },
//   tableRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     paddingVertical: 8,
//   },
//   tableText: {
//     flex: 1,
//     textAlign: 'center',
//     fontSize: 12,
//   },
//   divider: {
//     height: 1,
//     backgroundColor: Colors.border,
//     width: '100%',
//   },
//   container: {
//     padding: 10,
//     backgroundColor: Colors.border,
//     borderBottomLeftRadius: 8,
//     borderBottomRightRadius: 8,
//     overflow: 'hidden',
//   },
//   boldText: {
//     fontWeight: '600',
//     fontSize: 12,
//     marginRight: 8,
//   },
//   grayText: {
//     marginLeft: 8,
//     color: '#7C7C7C',
//     fontSize: 12,
//   },
//   row: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 4,
//   },
// });

// export default Table;

