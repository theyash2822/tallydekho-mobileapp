import { StyleSheet } from 'react-native';
import Colors from '../../../utils/Colors';

const VoucherDisplayStyles = StyleSheet.create({
  // Common container styles
  mainContainer: {
    flex: 1,
    backgroundColor: Colors.backgroundColorPrimary,
  },
  container: {
    flex: 1,
    padding: 12,
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },

  // Common voucher/note container styles
  voucherContainer: {
    backgroundColor: '#FFFFFF',
  },
  noteContainer: {
    backgroundColor: '#FFFFFF',
  },

  // Common field container styles
  fieldContainerWithBg: {
    backgroundColor: '#F6F8FA',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  fieldContainerWhite: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },

  // Common field label and value styles
  fieldLabel: {
    fontSize: 12,
    fontWeight: '400',
    color: '#8F939E',
    marginBottom: 4,
  },
  fieldValue: {
    fontSize: 12,
    fontWeight: '500',
    color: '#111111',
  },

  // Common top row styles (for invoices/orders/quotations)
  topRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  topColumn: {
    flex: 1,
    gap: 10,

  },
  topLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
    marginBottom: 4,
    marginLeft: 8
  },
  topValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginLeft: 8
  },
  topValueContainer: {
    backgroundColor: '#F3F4F6',
   
    paddingVertical: 8,
    borderRadius: 6,
   
    gap: 4,
  },

  // Common detail row styles
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  detailLabel: {
    fontSize: 12,
    fontWeight: '400',
    color: '#8F939E',
    flex: 1,
  },
  detailValueNoBg: {
    fontSize: 12,
    fontWeight: '500',
    color: '#111',
    flex: 2,
    textAlign: 'right',
    marginRight: 10,
  },

  // Common table styles
  tableHeader: {
    flexDirection: 'row',
    paddingBottom: 12,
    paddingTop: 12,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    backgroundColor: '#F8F9FA',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },

  // Common table cell styles (for invoices/orders/quotations)
  headerCellId: {
    flex: 0.3,
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
    textAlign: 'center',
  },
  headerCellItem: {
    flex: 1.5,
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
    textAlign: 'center',
  },
  headerCellQty: {
    flex: 1.5,
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
    textAlign: 'center',
  },
  headerCellPrice: {
    flex: 0.8,
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
    textAlign: 'center',
  },
  cellId: {
    flex: 0.3,
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  cellItem: {
    flex: 1.5,
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  cellQty: {
    flex: 1.5,
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  cellPrice: {
    flex: 0.8,
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },

  // Common table styles (for notes)
  tableContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  tableHeaderSerial: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
    flex: 0.5,
  },
  tableHeaderItem: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
    flex: 3,
  },
  tableHeaderQty: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
    flex: 2,
  },
  tableHeaderPrice: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
    flex: 1.5,
  },
  tableCellSerial: {
    fontSize: 12,
    fontWeight: '400',
    color: '#111111',
    flex: 0.5,
  },
  tableCellItem: {
    fontSize: 12,
    fontWeight: '400',
    color: '#111111',
    flex: 3,
  },
  tableCellQty: {
    fontSize: 12,
    fontWeight: '400',
    color: '#111111',
    flex: 2,
  },
  tableCellPrice: {
    fontSize: 12,
    fontWeight: '400',
    color: '#111111',
    flex: 1.5,
  },

  // Common summary styles
  summarySection: {
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  summaryLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
  },
  summaryValue: {
    fontSize: 12,
    fontWeight: '500',
    color: '#111827',
  },
  divider: {
    color: '#8F939E',
    marginHorizontal: 8,
    fontWeight: '400',
  },
  grandTotalRow: {},
  grandTotalLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#8F939E',
  },

  // Common amount row styles
  amountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F6F8FA',
    borderRadius: 8,
    padding: 12,
  },
  amountRowWithBorder: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    padding: 12,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },

  // Common narration styles
  narrationSection: {
    marginTop: 10,
  },
  narrationSectionPadding: {
    paddingTop: 8,
  },
  narrationLabel: {
    fontSize: 12,
    fontWeight: '400',
    color: '#8F939E',
    marginBottom: 8,
  },
  narrationLabel14: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  narrationInput: {
    fontSize: 14,
    color: '#111827',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    padding: 12,
    minHeight: 40,
    textAlignVertical: 'top',
    backgroundColor: '#FFFFFF',
  },
  narrationInput40: {
    fontSize: 14,
    color: '#111827',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    padding: 12,
    minHeight: 40,
    textAlignVertical: 'top',
    backgroundColor: '#FFFFFF',
  },

  // Common separator styles
  dotSeparator: {
    color: '#9CA3AF',
    fontSize: 14,
    fontWeight: '400',
  },
  dashSeparator: {
    color: '#9CA3AF',
    fontSize: 14,
    fontWeight: '400',
  },

  // Common bottom spacer
  bottomSpacer: {
    height: 5,
  },
  bottomSpacer20: {
    height: 20,
  },
});

export default VoucherDisplayStyles;

