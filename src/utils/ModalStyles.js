import { StyleSheet } from 'react-native';
import Colors from './Colors';
import {CommonInputStyles, CommonLabelStyles, CommonDropdownStyles} from './CommonStyles';

// Shared modal styles for all stock management modals
export const ModalStyles = StyleSheet.create({
  // Modal Container Styles
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
  },

  // Header Styles
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // paddingHorizontal: 12,
    paddingVertical: 8,
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

    paddingTop: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },

  // Section Styles
  section: {},
  inputGroup: {
    marginBottom: 12,
  },
  rowGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  halfInputGroup: {
    flex: 0.48,
  },

  // Label Styles
  inputLabel: CommonLabelStyles.label,
  required: {
    color: '#EF4444',
    fontWeight: '400',
  },

  // Input Styles
  textInput: CommonInputStyles.textInputWithHeight,
  narrationInput: {
    height: 80,
    textAlignVertical: 'top',
  },

  // Dropdown Styles
  dropdownField: {
    ...CommonDropdownStyles.dropdownInput,
    height: 50,
    position: 'relative',
  },
  dropdownText: CommonDropdownStyles.dropdownText,
  placeholderText: CommonDropdownStyles.placeholderText,
  dropdownList: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: '#FFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    marginTop: 4,
    maxHeight: 230,
    zIndex: 1000,
    overflow: 'hidden',
  },
  dropdownList2: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: '#FFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    marginTop: 4,
    maxHeight: 320,
    zIndex: 1000,
    overflow: 'hidden',
  },
  dropdownItem: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  lastDropdownOption: {
    borderBottomWidth: 0,
  },
  dropdownItemText: {
    fontSize: 14,
    color: '#111111',
  },
  // Item Card Styles
  itemCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  itemIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#07624c',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  itemDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  itemId: {
    fontSize: 12,
    color: '#666',
  },
  itemStatus: {
    alignItems: 'flex-end',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 4,
  },
  stockQty: {
    fontSize: 12,
    color: '#666',
  },

  // Search Styles
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 0,
    borderWidth: 1,
    borderColor: Colors.border,
    height: 50,
    justifyContent: 'center',
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: '#111111',
    paddingVertical: 0,
    paddingHorizontal: 0,
    textAlignVertical: 'center',
    includeFontPadding: false,
    textDecorationLine: 'none',
    textDecorationStyle: 'solid',
  },
  searchResultsDropdown: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    maxHeight: 135,
    marginTop: 8,
    zIndex: 1000,
  },
  searchResultsScroll: {
    maxHeight: 160,
  },
  searchResultItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingTop: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  searchResultContent: {
    flex: 1,
  },
  searchResultName: {
    fontSize: 13,
    color: '#111111',
    fontWeight: '500',
  },
  searchResultId: {
    fontSize: 12,
    color: '#8F939E',
    marginTop: 2,
  },

  // Selected Items Styles
  selectedItemsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
    justifyContent: 'space-between',
  },
  selectedItemChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E8',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#16C47F',
    marginTop: 8,
    width: '49%',
  },
  chipText: {
    fontSize: 12,
    color: '#16C47F',
    marginRight: 4,
    fontWeight: '500',
    flex: 1,
  },
  removeChipButton: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Quantity Input Styles
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    overflow: 'hidden',
  },
  quantityButton: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityInputContainer: {
    marginLeft: 10,
    height: 50,
    justifyContent: 'center',
    backgroundColor: '#FFF',
  },
  quantityInput: {
    fontSize: 16,
    color: '#111111',
    textAlign: 'center',
    padding: 0,
    width: '100%',
  },
  quantityTextInput: {
    flex: 1,
    fontSize: 14,
    color: '#111111',
    textAlign: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
    textDecorationLine: 'none',
    textDecorationStyle: 'solid',
  },

  // Price Input Styles
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  priceInput: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 14,
    color: '#111111',
    height: 50,
    borderRightWidth: 1,
    borderRightColor: Colors.border,
  },
  currencyLabel: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  currencyText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },

  // Toggle Switch Styles
  toggleSwitch: {
    width: 52,
    height: 30,
    backgroundColor: '#E0E0E0',
    borderRadius: 15,
    padding: 2,
    justifyContent: 'center',
  },
  toggleActive: {
    backgroundColor: '#16C47F',
  },
  toggleHandle: {
    width: 23,
    height: 23,
    backgroundColor: '#FFF',
    borderRadius: 13,
  },
  toggleHandleActive: {
    transform: [{ translateX: 22 }],
  },

  // Checkbox Styles
  checkboxRowGroup: {
    flexDirection: 'row',
    marginBottom: 2,
    marginTop: 6,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: Colors.border,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  checkboxChecked: {
    backgroundColor: '#16C47F',
    borderColor: '#16C47F',
  },
  checkboxLabel: {
    fontSize: 14,
    color: '#333',
  },

  // Item Section Styles (for BulkTransferModal)
  itemSection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  detailItem: {
    flex: 1,
    marginRight: 12,
  },
  detailItemLast: {
    flex: 1,
    marginRight: 0,
  },
  detailLabel: {
    fontSize: 12,
    fontWeight: '400',
    color: '#8F939E',
    marginBottom: 6,
  },

  // Dropdown Content Styles
  dropdownContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  dropdownOptions: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    marginTop: 2,
    maxHeight: 200,
    zIndex: 1000,
  },
  dropdownOption: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  dropdownOptionSelected: {
    // backgroundColor: '#F0F2F9',
  },
  dropdownOptionText: {
    fontSize: 14,
    color: '#666',
  },
});

export default ModalStyles;
