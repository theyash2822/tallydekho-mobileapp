import React, { useRef, useState } from 'react';
import { ScrollView, View } from 'react-native';
import Summary from '../../components/Sales-purchaseInvoice/Summary';
import PurchaseInvoiceInfo from '../../components/Sales-purchaseInvoice/PurchaseInvoiceInfo';
import AddOrderSection from '../../components/orders/AddOrders';
import Header from '../../components/common/Header';
import BottomArea from '../../components/common/BottomArea';
import { commonScreenStyles } from './ScreenStyles';
import { Icons } from '../../utils/Icons';

const PurchaseInvoice = ({ navigation }) => {
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
        title=" Create Purchase Invoice"
        leftIcon="chevron-left"
        onLeftPress={() => navigation.goBack()}
        // rightIcon={Icons.InvoiceUpload}
      />
      <ScrollView
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={commonScreenStyles.scrollContent}>
        <PurchaseInvoiceInfo scrollViewRef={scrollViewRef} />
        <AddOrderSection 
          stockButtonText="Add Product ＋"
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
        buttonText='Submit Invoice'
        showSecondButton={false}
      />
    </View>
  );
};

export default PurchaseInvoice;
