import {StyleSheet} from 'react-native';
import Colors from '../../../../../utils/Colors';
import {CommonInputStyles, CommonLabelStyles} from '../../../../../utils/CommonStyles';

const StockSettingsStyles = StyleSheet.create({
  // Common container styles
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 12,
    overflow: 'hidden',
  },

  // Header styles
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#fff',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
  },

  // Content styles
  content: {
    padding: 16,
    gap: 16,
  },
  contentWithSmallPadding: {
    padding: 12,
    gap: 20,
  },
  contentWithMinimalPadding: {
    padding: 8,
    gap: 10,
  },

  // Row layouts
  row: {
    flexDirection: 'row',
    gap: 16,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 8,
  },

  // Input group styles
  inputGroup: {
    flex: 1,
  },
  inputSection: {
    marginTop: 4,
  },

  // Label styles
  label: CommonLabelStyles.label,
  labelWithSmallMargin: {
    fontSize: 11,
    fontWeight: '400',
    color: '#8F939E',
    marginBottom: 6,
  },

  // Input styles
  input: {
    ...CommonInputStyles.textInput,
    borderRadius: 6,
    paddingVertical: 10,
    color: '#1A1A1A',
  },
  combinedInput: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#FFFFFF',
  },
  numberInput: {
    flex: 1,
    fontSize: 14,
    color: '#1A1A1A',
    padding: 0,
  },
  unitText: {
    fontSize: 14,
    color: '#8F939E',
    marginLeft: 8,
    paddingLeft: 8,
    borderLeftWidth: 1,
    borderLeftColor: Colors.border,
  },
  unitTextSimple: {
    fontSize: 14,
    color: '#8F939E',
    marginLeft: 8,
  },
  separator: {
    width: 1,
    height: 20,
    backgroundColor: Colors.border,
    marginHorizontal: 8,
  },

  // Setting row styles (for ItemsSettings)
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settingInfo: {
    flex: 1,
    marginRight: 16,
  },
  settingTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 12,
    color: '#8F939E',
    lineHeight: 16,
  },

  // UoM/Chip styles (for GeneralSettings)
  uomSection: {
    marginTop: 8,
  },
  chipBox: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 6,
    padding: 8,
  },
  chipBoxHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  chipContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F4F9',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 6,
  },
  chipSmall: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F4F9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 6,
  },
  chipText: {
    fontSize: 10,
    color: '#1A1A1A',
  },
  chipRemove: {
    padding: 2,
  },
  chevronButton: {
    padding: 4,
    marginTop: 4,
  },
  chevronButtonSmall: {
    padding: 4,
    marginLeft: 8,
  },

  // Dropdown styles
  dropdownOptions: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 6,
    maxHeight: 550,
    overflow: 'hidden',
    marginTop: 4,
  },
  dropdownOptionsSmall: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 6,
    maxHeight: 250,
    overflow: 'hidden',
  },
  dropdownOption: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  dropdownOptionNoBorder: {
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  dropdownOptionText: {
    fontSize: 14,
    color: '#1A1A1A',
  },

  // Warehouse specific styles
  warehouseItem: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 6,
    overflow: 'hidden',
  },
  warehouseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#fff',
  },
  warehouseHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  warehouseIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#13A76D',
    justifyContent: 'center',
    alignItems: 'center',
  },
  warehouseInfo: {
    flex: 1,
  },
  warehouseName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1A1A1A',
  },
  warehouseLocation: {
    fontSize: 12,
    color: '#8F939E',
    marginTop: 2,
  },
  warehouseDetails: {
    padding: 8,
    gap: 10,
  },
  dropdownText: {
    fontSize: 14,
    color: '#1A1A1A',
  },

  // Add button styles
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E9EEF7',
    paddingVertical: 12,
    borderRadius: 6,
    gap: 8,
  },
  addButtonText: {
    color: '#111111',
    fontSize: 14,
    fontWeight: '500',
  },

  // Alert specific styles
  alertSection: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8F939E',
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default StockSettingsStyles;
