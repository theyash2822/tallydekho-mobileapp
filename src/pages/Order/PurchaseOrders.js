import React, {useRef, useState} from 'react';
import {ScrollView, View} from 'react-native';
import Header from '../../components/common/Header';
import Summary from '../../components/Sales-purchaseInvoice/Summary';
import PurchaseOrderInfo from '../../components/orders/PurchaseOrderInfo';
import AddOrderSection from '../../components/orders/AddOrders';
import BottomArea from '../../components/common/BottomArea';
import {commonScreenStyles} from '../Invoice/ScreenStyles';

const PurchaseOrders = ({navigation, route}) => {
  const scrollViewRef = useRef(null);
  const summaryRef = useRef(null);
  
  // Get initial products from route params (if navigating from reorder queue)
  const initialProducts = route?.params?.initialProducts || [];
  const [products, setProducts] = useState(initialProducts);
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
        title="Create Purchase Orders"
        leftIcon="chevron-left"
        onLeftPress={() => navigation.goBack()}
      />
      <ScrollView
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={commonScreenStyles.scrollContent}>
        <PurchaseOrderInfo scrollViewRef={scrollViewRef} />
        <AddOrderSection
          stockHeading="Item/Services"
          stockButtonText="Add Product ＋"
          showBarcodeAbove={false}
          showBarcodeBelow={false}
          label1="Receiving Warehouse"
          initialProducts={initialProducts}
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
        buttonText="Submit Invoice"
        showSecondButton={false}
        onPress={() => { const {Alert} = require('react-native'); Alert.alert('Info', 'Desktop App must be paired to submit'); }}
      />
    </View>
  );
};

export default PurchaseOrders;
