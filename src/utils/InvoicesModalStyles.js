import {StyleSheet, Platform} from 'react-native';
import Colors from './Colors';
import {CommonInputStyles} from './CommonStyles';

// Shared modal styles for all sales-purchaseinvoice modals
export const InvoicesModalStyles = StyleSheet.create({
  // Modal Container Styles (same as ModalStyles but for invoices)
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#F6F9FC',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    maxHeight: '85%',
    flex: 1,
  },

  // Header Styles
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // paddingHorizontal: 12,
    paddingVertical: 6,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    // marginTop: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 4,
  },

  // Content Styles
  content: {
    paddingTop: 4,
  },
  scrollContent: {
    paddingBottom: 14,
  },

  // Common Text Styles
  subtext: {
    color: 'gray',
    fontSize: 12,
  },
  label: {
    marginTop: 6,
    marginBottom: 6,
    fontSize: 12,
    fontWeight: '400',
    color: '#8F939E',
  },

  // Input Styles
  input: {
    ...CommonInputStyles.textInput,
    borderRadius: 10,
    color: '#000',
  },
  input1: {
    flex: 1,
    fontSize: Platform.OS === 'ios' ? 13 : 14,
    color: '#000',
    ...(Platform.OS === 'ios' && {
      paddingVertical: 6,
    }),
  },
   input2: {
    flex: 1,
    fontSize: Platform.OS === 'ios' ? 13 : 14,
    color: '#000',
    ...(Platform.OS === 'ios' && {
      paddingVertical: 12,
    }),
  },

  // Layout Styles
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 6,
  },
  halfInput: {
    flex: 1,
  },
  formGroup: {
    marginBottom: 8,
  },

  // Dropdown Styles
  dropdownInput: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 10,
    backgroundColor: '#FFF',
    paddingHorizontal: 12,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownList: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 10,
    paddingVertical: 8,
  },
  dropdownItem: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  dropdownText: {
    fontSize: 14,
    color: '#333',
  },

  // Icon Styles
  iconLeft: {
    position: 'absolute',
    left: 12,
    color: '#888',
  },
  iconRight: {
    position: 'absolute',
    right: 12,
    color: '#888',
  },

  // Input with Icon Styles
  inputWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 10,
    backgroundColor: '#fff',
    paddingVertical: Platform.OS === 'ios' ? 10 : 6,
    paddingLeft: 20,
    minHeight: Platform.OS === 'ios' ? 40 : undefined,
    position: 'relative',
  },

  // Checkbox Styles (for VendorModal)
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  checkboxLabel: {
    fontSize: 14,
    color: '#8F939E',
  },
  checkboxBox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: '#F0EFF4',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },

  // Modern Dropdown Styles (for ProductModal)
  modernDropdownTrigger: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
  },
  modernDropdownText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
    marginRight: 8,
  },
  chevronIcon: {
    transform: [{rotate: '0deg'}],
  },
  chevronRotated: {
    transform: [{rotate: '180deg'}],
  },
  modernDropdownMenu: {
    position: 'absolute',
    top: 85,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    zIndex: 1000,
    overflow: 'hidden',
  },
  modernDropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
  },
  modernDropdownItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  modernDropdownItemText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  modernDropdownItemTextSelected: {
    color: '374151',
    fontWeight: '600',
  },

  // Product Modal Specific Styles
  smallInput: {
    flex: 1,
    minWidth: '49%',
    marginVertical: 2,
  },
  qtyUnitBox: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  qtyInput: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#333',
  },
  verticalDivider: {
    width: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 8,
  },

  // Barcode Button Styles
  barcodeBtn: {
    backgroundColor: '#E8EFF6',
    padding: 12,
    marginVertical: 12,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  scanText: {
    fontWeight: '600',
    fontSize: 14,
    color: '#000',
    marginRight: 10,
  },

  // Discount Row Styles
  discountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  discountDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#ccc',
    marginHorizontal: 8,
  },
  percentText: {
    color: '#8F939E',
    marginHorizontal: 4,
  },
  discountLabel: {
    marginLeft: 6,
    color: '#8F939E',
  },

  // Subtotal Row Styles
  subtotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    marginBottom: 10,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  label2: {
    fontSize: 14,
    fontWeight: '400',
    color: '#8F939E',
    padding: 14,
  },
  subtotalValue: {
    color: '#0A8F52',
    fontWeight: 'bold',
    fontSize: 14,
    padding: 14,
  },
});

export default InvoicesModalStyles;
