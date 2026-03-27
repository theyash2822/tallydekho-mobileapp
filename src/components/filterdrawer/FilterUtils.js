import {STOCK_MANAGEMENT_SCREENS} from './FilterConstants';

export const getCategoryOptions = (categoryKey, searchQuery = '') => {
  let options = [];
  
  switch(categoryKey) {
    case 'transactionTypes':
      options = [
        {key: 'sales', label: 'Sales', count: 0},
        {key: 'purchase', label: 'Purchase', count: 32},
        {key: 'payment', label: 'Payment', count: 28},
        {key: 'receipt', label: 'Receipt', count: 19},
        {key: 'journal', label: 'Journal', count: 12},
        {key: 'contra', label: 'Contra', count: 8},
      ];
      break;
    case 'status':
      options = [
        {key: 'pending', label: 'Pending', count: 23},
        {key: 'completed', label: 'Completed', count: 156},
        {key: 'cancelled', label: 'Cancelled', count: 8},
        {key: 'overdue', label: 'Overdue', count: 5},
      ];
      break;
    case 'paymentMode':
      options = [
        {key: 'cash', label: 'Cash', count: 67},
        {key: 'bank', label: 'Bank Transfer', count: 89},
        {key: 'upi', label: 'UPI', count: 124},
        {key: 'card', label: 'Card', count: 45},
        {key: 'cheque', label: 'Cheque', count: 12},
      ];
      break;
    case 'partyType':
      options = [
        {key: 'customer', label: 'Customer', count: 234},
        {key: 'supplier', label: 'Supplier', count: 156},
        {key: 'employee', label: 'Employee', count: 45},
        {key: 'other', label: 'Other', count: 12},
      ];
      break;
    case 'gstStatus':
      options = [
        {key: 'registered', label: 'Registered', count: 189},
        {key: 'unregistered', label: 'Unregistered', count: 67},
        {key: 'composition', label: 'Composition Scheme', count: 23},
      ];
      break;
    case 'voucherStatus':
      options = [
        {key: 'draft', label: 'Draft', count: 34},
        {key: 'finalized', label: 'Finalized', count: 267},
        {key: 'approved', label: 'Approved', count: 189},
      ];
      break;
    case 'stockManagement':
      // Return stock management screens
      return STOCK_MANAGEMENT_SCREENS.map(screen => ({
        key: screen.key,
        label: screen.label,
        count: 0,
        isScreen: true,
      }));
    default:
      return [];
  }
  
  // Filter options based on search query
  if (searchQuery.trim()) {
    const query = searchQuery.toLowerCase();
    return options.filter(option => 
      option.label.toLowerCase().includes(query)
    );
  }
  
  return options;
};

