// Stock Management Screens
export const STOCK_MANAGEMENT_SCREENS = [
  {key: 'stockLedger', label: 'Stock Ledger'},
  {key: 'valuationSummary', label: 'Valuation Summary'},
  {key: 'expirySchedule', label: 'Expiry Schedule'},
  {key: 'fastSlowMoving', label: 'Fast- vs Slow-Moving Analysis'},
  {key: 'transferHistory', label: 'Transfer History'},
  {key: 'stockSnapshot', label: 'Stock Snapshot (as-of date)'},
  {key: 'negativeStock', label: 'Negative Stock Exceptions'},
];

// Initial Stock Filter States
export const INITIAL_STOCK_FILTERS = {
  stockLedger: {
    warehouses: [],
    txnTypes: [],
    itemSku: '',
    batchSerial: '',
    dateRange: {startDate: '', endDate: ''},
  },
  valuationSummary: {
    warehouses: [],
    costing: 'fifo',
    dateRange: {startDate: '', endDate: ''},
  },
  expirySchedule: {
    warehouses: [],
    itemGroup: '',
  },
  fastSlowMoving: {
    warehouses: [],
    category: '',
    period: '30D',
    customDay: '',
  },
  transferHistory: {
    sourceWarehouse: '',
    destinationWarehouse: '',
    status: 'In Transit',
    dateRange: {startDate: '', endDate: ''},
  },
  stockSnapshot: {
    warehouses: [],
    asOfDate: '',
  },
  negativeStock: {
    warehouses: [],
  },
};

