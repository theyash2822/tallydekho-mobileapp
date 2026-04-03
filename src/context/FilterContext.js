import React, {createContext, useContext, useState} from 'react';

const FilterContext = createContext();

export const FilterProvider = ({children}) => {
  const [filters, setFilters] = useState({
    // Date Filters
    dateRange: {
      startDate: null,
      endDate: null,
    },

    // Transaction Type Filters
    transactionTypes: {
      sales: false,
      purchase: false,
      payment: false,
      receipt: false,
      journal: false,
      contra: false,
    },

    // Amount Range
    amountRange: {
      min: '',
      max: '',
    },

    // Status Filters
    status: {
      pending: false,
      completed: false,
      cancelled: false,
      overdue: false,
    },

    // Payment Mode
    paymentMode: {
      cash: false,
      bank: false,
      upi: false,
      card: false,
      cheque: false,
    },

    // Party Type
    partyType: {
      customer: false,
      supplier: false,
      employee: false,
      other: false,
    },

    // GST Status
    gstStatus: {
      registered: false,
      unregistered: false,
      composition: false,
    },

    // Voucher Status
    voucherStatus: {
      draft: false,
      finalized: false,
      approved: false,
    },

    // Sort Options
    sortBy: 'date', // date, amount, name
    sortOrder: 'desc', // asc, desc
  });

  const updateFilter = (category, key, value) => {
    setFilters(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value,
      },
    }));
  };

  const updateFilterCategory = (category, values) => {
    setFilters(prev => ({
      ...prev,
      [category]: values,
    }));
  };

  const resetFilters = () => {
    setFilters({
      dateRange: {startDate: null, endDate: null},
      transactionTypes: {sales: false, purchase: false, payment: false, receipt: false, journal: false, contra: false},
      amountRange: {min: '', max: ''},
      status: {pending: false, completed: false, cancelled: false, overdue: false},
      paymentMode: {cash: false, bank: false, upi: false, card: false, cheque: false},
      partyType: {customer: false, supplier: false, employee: false, other: false},
      gstStatus: {registered: false, unregistered: false, composition: false},
      voucherStatus: {draft: false, finalized: false, approved: false},
      sortBy: 'date',
      sortOrder: 'desc',
    });
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.dateRange.startDate || filters.dateRange.endDate) count++;
    count += Object.values(filters.transactionTypes).filter(Boolean).length;
    if (filters.amountRange.min || filters.amountRange.max) count++;
    count += Object.values(filters.status).filter(Boolean).length;
    count += Object.values(filters.paymentMode).filter(Boolean).length;
    count += Object.values(filters.partyType).filter(Boolean).length;
    count += Object.values(filters.gstStatus).filter(Boolean).length;
    count += Object.values(filters.voucherStatus).filter(Boolean).length;
    return count;
  };

  return (
    <FilterContext.Provider
      value={{
        filters,
        updateFilter,
        updateFilterCategory,
        resetFilters,
        getActiveFiltersCount,
      }}>
      {children}
    </FilterContext.Provider>
  );
};

export const useFilters = () => {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error('useFilters must be used within FilterProvider');
  }
  return context;
};
