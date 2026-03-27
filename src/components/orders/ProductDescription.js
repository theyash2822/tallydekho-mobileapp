import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Colors from '../../utils/Colors';

const ProductDescription = () => {
  const [productDescription, setProductDescription] = useState('');
  const [quantity, setQuantity] = useState(0);
  const [unitPrice, setUnitPrice] = useState('');
  const [currency, setCurrency] = useState('INR');

  const increaseQty = () => setQuantity(prev => prev + 1);
  const decreaseQty = () => setQuantity(prev => (prev > 0 ? prev - 1 : 0));

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Product Description</Text>
      <View style={styles.descriptionWrapper}>
        <View style={styles.descriptionRow}>
          <TextInput
            style={styles.description}
            multiline
            maxLength={5000}
            value={productDescription}
            onChangeText={setProductDescription}
            placeholder="Enter description"
            placeholderTextColor="#8F939E"
          />
          <Text style={styles.charCount}>{productDescription.length}/5000</Text>
        </View>
      </View>

      <View style={styles.row}>
        <View style={[styles.inputWrapper, {marginRight: 8}]}>
          <Text style={styles.label}>Qty.</Text>
          <View style={styles.qtyWrapper}>
            <TouchableOpacity onPress={decreaseQty} style={styles.qtyBtn}>
              <Ionicons name="remove" size={20} color="#6F7C97" />
            </TouchableOpacity>

            <View style={styles.qtyTextWrapper}>
              <Text style={styles.qtyText}>{quantity}</Text>
            </View>

            <TouchableOpacity onPress={increaseQty} style={styles.qtyBtn}>
              <Ionicons name="add" size={20} color="#6F7C97" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={[styles.inputWrapper, {flex: 1}]}>
          <Text style={styles.label}>Unit Price</Text>
          <View style={styles.unitPriceWrapper}>
            <TextInput
              style={[styles.textInput, {flex: 1, paddingRight: 4}]}
              placeholder="₹ 5000"
              keyboardType="numeric"
              value={unitPrice}
              onChangeText={setUnitPrice}
              placeholderTextColor={Colors.secondaryText}
            />
            <Ionicons name="chevron-down" size={20} color="#6F7C97" />
            <Text style={styles.currency}>{currency}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  label: {
    color: Colors.secondaryText,
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 6,
  },
  descriptionWrapper: {
    backgroundColor: Colors.white,
    borderRadius: 10,
    borderColor: Colors.border,
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    justifyContent: 'center',
  },
  descriptionRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  description: {
    color: Colors.primaryTitle,
    flex: 1,
    paddingRight: 8,
  },
  charCount: {
    fontSize: 10,
    color: Colors.secondaryText,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputWrapper: {
    flex: 1,
  },
  qtyWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: Colors.border,
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: Colors.white,
    paddingHorizontal: 10,
    justifyContent: 'space-between',
    height: 45,
  },
  qtyBtn: {
    padding: 4,
  },
  qtyTextWrapper: {
    flex: 1,
    alignItems: 'center',
  },
  qtyText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.secondaryText,
  },
  textInput: {
    color: Colors.primaryText,
  },
  unitPriceWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: Colors.border,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: Colors.white,
    height: 45,
  },
  currency: {
    marginLeft: 6,
    color: Colors.secondaryText,
    fontWeight: '600',
  },
});

export default ProductDescription;
