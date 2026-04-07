import React, { useRef, useState } from 'react';
import { ScrollView, View, StyleSheet, Platform } from 'react-native';
import Header from '../../components/common/Header';
import Summary from '../../components/Sales-purchaseInvoice/Summary';
import DeliveryNoteInfo from '../../components/notes/DeliveryNoteInfo';
import BottomArea from '../../components/common/BottomArea';
import { commonScreenStyles } from '../Invoice/ScreenStyles';
import DispatchSummary from '../../components/notes/Summary';
import useKeyboardVisibility from '../../hooks/useKeyboardVisibility';

const DeliveryNote = ({ navigation }) => {
  const scrollViewRef = useRef(null);
  const summaryRef = useRef(null);
  const isKeyboardVisible = useKeyboardVisibility();
  const [isDispatchDropdownOpen, setIsDispatchDropdownOpen] = useState(false);
  const [dispatchItems, setDispatchItems] = useState([]);

  // const handleSummaryExpand = () => {
  //   // Auto-scroll to summary when expanded
  //   setTimeout(() => {
  //     summaryRef.current?.measure((x, y, width, height, pageX, pageY) => {
  //       scrollViewRef.current?.scrollTo({
  //         y: y - 20,
  //         animated: true,
  //       });
  //     });
  //   }, 200);
  // };

  return (
    <View style={commonScreenStyles.container}>
      <Header
        title="Create Delivery Note"
        leftIcon="chevron-left"
        onLeftPress={() => navigation.goBack()}
      />
      <ScrollView
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          commonScreenStyles.scrollContent,
          isKeyboardVisible && styles.keyboardPadding,
        ]}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="interactive"
        nestedScrollEnabled={true}>
        <DeliveryNoteInfo
          scrollViewRef={scrollViewRef}
          onDispatchDropdownToggle={setIsDispatchDropdownOpen}
          dispatchItems={dispatchItems}
          setDispatchItems={setDispatchItems}
        />
        <View ref={summaryRef}>
          <DispatchSummary dispatchItems={dispatchItems} />
        </View>
        <View style={commonScreenStyles.bottomSpacer} />
      </ScrollView>
      <BottomArea
        buttonText="Submit Delivery Note"
        secondButtonText='Submit & Share PDF'
        onPress={() => Alert.alert('Info', 'Please pair Desktop App to submit')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  keyboardPadding: {
    paddingBottom: Platform.OS === 'ios' ? 250 : 150,
  },
});

export default DeliveryNote;