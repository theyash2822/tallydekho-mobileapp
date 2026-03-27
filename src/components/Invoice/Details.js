import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {getStatusStyle} from '../../utils/Constants';
import Colors from '../../utils/Colors';

const InvoiceComponent = ({status}) => {
  // Dummy Data
  const fromName = 'John Doe';
  const fromAddress = [
    '1234 Elm Street',
    'Apt. 567',
    'Springfield, IL 62704',
    'United States',
  ];
  const fromCompany = 'Samsung Electronics';
  const salesOrderNumber = 'ORD-#0111';
  const invoiceDate = '24/11/2024';
  const dueDate = '28/11/2024';
  const billTo = 'Samsung Electronics Company Limited';

  const statusStyle = getStatusStyle(status);

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <View style={styles.headerRow}>
          <Text style={styles.fromText}>From</Text>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{fromName[0]}</Text>
          </View>
          <View style={styles.salesOrderContainer}>
            <Text style={styles.salesOrder}>SALES ORDER</Text>
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.avatarcontainer}></View>
          <View style={styles.fromSection}>
            <Text style={styles.name}>{fromName}</Text>
            {fromAddress.map((address, index) => (
              <Text key={index} style={styles.address}>{address}</Text>
            ))}
          </View>
          <View style={styles.orderDetails}>
            <Text style={styles.orderNumber}>{salesOrderNumber}</Text>
            <Text style={styles.invoiceDetail}>
              Invoice date: <Text style={styles.boldText}>{invoiceDate}</Text>
            </Text>
            <Text style={styles.invoiceDetail}>
              Terms: <Text style={styles.boldText}>Net-123</Text>
            </Text>
            <Text style={styles.invoiceDetail}>
              Due date: <Text style={styles.boldText}>{dueDate}</Text>
            </Text>
          </View>
        </View>

        <View style={styles.billToContainer}>
          <Text style={{fontWeight: 'bold', fontSize: 14}}>Bill to</Text>
          <Text style={[styles.name, {marginLeft: 10, marginTop: 3}]}>{billTo}</Text>
        </View>

        <View style={{marginLeft: 15}}>
          <View style={styles.fromSection}>
            {fromAddress.map((address, index) => (
              <Text key={index} style={styles.address}>{address}</Text>
            ))}
          </View>
        </View>
      </View>

      <View style={styles.statuscontainer}>
        <Text style={styles.statuslabel}>Status</Text>
        <View
          style={[
            styles.statusbadge,
            {
              backgroundColor: statusStyle.backgroundColor,
              borderColor: statusStyle.borderColor,
            },
          ]}>
          <View
            style={[
              styles.statusdot,
              {
                backgroundColor: statusStyle.dotColor,
                borderColor: statusStyle.dotBorderColor,
              },
            ]}
          />
          <Text
            style={[styles.statusbadgeText, {color: statusStyle.textColor}]}>
            {status}
          </Text>
        </View>
      </View>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: Colors.white,
    borderRadius: 10,
    marginBottom: 20,
  },
  section: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  fromText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  salesOrderContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
  salesOrder: {
    color: '#16C47F',
    fontWeight: 'bold',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  avatarcontainer: {
    marginLeft: 15,
  },
  billToContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#8a63d2',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    marginLeft: 10,
  },
  avatarText: {
    color: Colors.white,
    fontWeight: 'bold',
    fontSize: 14,
  },
  fromSection: {
    flex: 1,
  },
  name: {
    fontSize: 12,
    marginBottom: 3,
    marginLeft: 30,
    color: Colors.secondaryText,
  },
  address: {
    fontSize: 12,
    color: Colors.secondaryText,
    marginBottom: 2,
    marginLeft: 30,
  },
  orderDetails: {
    alignItems: 'flex-end',
  },
  orderNumber: {
    fontSize: 12,
    color: Colors.secondaryText,
  },
  invoiceDetail: {
    fontSize: 12,
    color: Colors.secondaryText,
  },
  boldText: {
    fontWeight: 'bold',
    color: Colors.primaryTitle,
  },
  statuscontainer: {
    alignItems: 'flex-start',
  },
  statuslabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#3d3d3d',
    marginBottom: 8,
    marginTop: 10,
  },
  statusbadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  statusdot: {
    width: 8,
    height: 8,
    borderRadius: 6,
    marginRight: 8,
    borderWidth: 1,
  },
  statusbadgeText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default InvoiceComponent;
