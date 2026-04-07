import React, {useRef, useState} from 'react';
import {ScrollView, View} from 'react-native';
import Header from '../../components/common/Header';
import Summary from '../../components/Sales-purchaseInvoice/Summary';
import SalesOrderInfo from '../../components/orders/SalesOrderInfo';
import AddOrderSection from '../../components/orders/AddOrders';
import BottomArea from '../../components/common/BottomArea';
import {commonScreenStyles} from '../Invoice/ScreenStyles';

const SaleOrders = ({navigation}) => {
  const scrollViewRef = useRef(null);
  const summaryRef = useRef(null);
  const [products, setProducts] = useState([]);
  const [logistics, setLogistics] = useState([]);

  const handleSummaryExpand = () => {
    // Auto-scroll to summary when expanded
    setTimeout(() => {
      summaryRef.current?.measure((x, y, width, height, pageX, pageY) => {
        scrollViewRef.current?.scrollTo({
          y: y - 20,
          animated: true,
        });
      });
    }, 200);
  };

  return (
    <View style={commonScreenStyles.container}>
      <Header
        title="Create Sales Orders"
        leftIcon="chevron-left"
        onLeftPress={() => navigation.goBack()}
      />
      <ScrollView
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={commonScreenStyles.scrollContent}>
        <SalesOrderInfo scrollViewRef={scrollViewRef} />

        <AddOrderSection
          stockHeading="Item/Products"
          stockButtonText="Add Product ＋"
          showBarcodeAbove={true}
          showBarcodeBelow={false}
          products={products}
          setProducts={setProducts}
          logistics={logistics}
          setLogistics={setLogistics}
        />

        <View ref={summaryRef}>
          <Summary 
            showPaymentDropdown={true} 
            onExpand={handleSummaryExpand}
            products={products}
            logistics={logistics}
          />
        </View>
        <View style={commonScreenStyles.bottomSpacer} />
      </ScrollView>
      <BottomArea
        buttonText="Submit Sales Order"
        showSecondButton={false}
        onPress={() => { const {Alert} = require('react-native'); Alert.alert('Info', 'Desktop App must be paired to submit'); }}
      />
    </View>
  );
};

export default SaleOrders;
