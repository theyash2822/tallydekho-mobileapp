import {StyleSheet} from 'react-native';
import Colors from '../../../utils/Colors';

const ScreenStyles = StyleSheet.create({
  // Common scroll view styles
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundColorPrimary,
  },

  scrollView: {
    flex: 1,
    marginTop: 4,
  },
  scrollContent: {
    paddingBottom: 20,
  },

  // Common transaction card styles
  transactionCard: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    padding: 12,
    marginBottom: 6,
  },
  transactionContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  transactionRight: {
    alignItems: 'flex-end',
  },
  transactionAmount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },

  // Common icon styles
  transactionIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F0F2F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  // Common info styles
  transactionInfo: {
    flex: 1,
  },
  transactionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  transactionName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  transactionDate: {
    fontSize: 12,
    color: '#6B7280',
  },

  // Common separator styles
  dotSeparator: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#9CA3AF',
    marginHorizontal: 8,
  },
  referenceText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
  },

  // Common party/vendor/category card styles
  partyCard: {
    borderRadius: 12,
    padding: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  partyLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  partyIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  partyInitial: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  partyInfo: {
    flex: 1,
  },
  partyName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
  },
  partyAmount: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F1F1F',
  },

  // PurchasesScreen specific styles (with status)
  transactionCardWithStatus: {
    borderRadius: 12,
    padding: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },

  // Vendor specific styles
  vendorCard: {
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  vendorLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  vendorIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  vendorInitial: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  vendorInfo: {
    flex: 1,
  },
  vendorName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  vendorStats: {
    fontSize: 12,
    color: '#6B7280',
  },
  vendorAmount: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F1F1F',
  },

  // Category specific styles
  categoryCard: {
    borderRadius: 12,
    padding: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
  },
  categoryAmount: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F1F1F',
  },
});

export default ScreenStyles;
