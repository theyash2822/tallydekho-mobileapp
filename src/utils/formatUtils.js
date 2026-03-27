/**
 * Shared currency and number formatting utilities.
 *
 * Each helper matches a formatting pattern that was previously duplicated
 * across multiple files. Outputs are intentionally kept identical to the
 * originals so existing UI stays the same.
 */

/**
 * Compact format using Indian units (₹1.2L / ₹3.5K / ₹500).
 * Used in charts, tooltips, and summary cards.
 *
 * @param {number} value
 * @returns {string} e.g. "₹1.2L", "₹3.5K", "₹500"
 */
export const formatCurrencyCompactINR = value => {
  if (value >= 100000) {
    return `₹${(value / 100000).toFixed(1)}L`;
  } else if (value >= 1000) {
    return `₹${(value / 1000).toFixed(1)}K`;
  }
  return `₹${value}`;
};

/**
 * Compact format without ₹ symbol, using M/K.
 * Used where the ₹ prefix is added separately in JSX.
 *
 * @param {number} amount
 * @returns {string} e.g. "1.2M", "5K", "200"
 */
export const formatCompactNumber = amount => {
  if (amount >= 1000000) {
    return `${(amount / 1000000).toFixed(1)}M`;
  } else if (amount >= 1000) {
    return `${Math.round(amount / 1000)}K`;
  }
  return `${amount}`;
};

/**
 * Compact format using L/K with whole-number K (no decimal).
 * Matches the CashRegister pattern.
 *
 * @param {number} amount
 * @returns {string} e.g. "₹1.2L", "₹5K", "₹200"
 */
export const formatCurrencyCompactRounded = amount => {
  if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(1)}L`;
  } else if (amount >= 1000) {
    return `₹${(amount / 1000).toFixed(0)}K`;
  }
  return `₹${amount.toLocaleString()}`;
};

/**
 * Full Indian locale formatted currency (₹1,23,456).
 * Handles non-number values gracefully.
 *
 * @param {*} value
 * @returns {string} e.g. "₹1,23,456" or "₹ --" for invalid input
 */
export const formatCurrencyINR = value => {
  if (typeof value !== 'number' || isNaN(value)) {
    return '₹ --';
  }
  return `₹${Number(value).toLocaleString('en-IN')}`;
};

/**
 * Full Indian locale formatted currency with max 2 decimal places.
 * Used in invoice summaries and totals.
 *
 * @param {number} value
 * @returns {string} e.g. "₹1,23,456.78"
 */
export const formatCurrencyINRDecimal = value => {
  if (typeof value !== 'number' || isNaN(value)) {
    return '₹0';
  }
  return `₹${value.toLocaleString('en-IN', {maximumFractionDigits: 2})}`;
};

/**
 * Ensures a value has the ₹ prefix. If already prefixed, returns as-is.
 *
 * @param {*} value
 * @returns {string}
 */
export const ensureCurrencyPrefix = value => {
  if (!value) return '₹0';
  return value.toString().startsWith('₹') ? value : `₹${value}`;
};
