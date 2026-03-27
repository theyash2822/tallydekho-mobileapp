/**
 * Shared date formatting utilities.
 *
 * Each helper matches a formatting pattern that was previously duplicated
 * across multiple files. Outputs are intentionally kept identical to the
 * originals so existing UI stays the same.
 */

const MONTH_NAMES_SHORT = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

/**
 * Converts a YYYY-MM-DD string to DD/MM/YYYY.
 *
 * @param {string} dateStr - "YYYY-MM-DD"
 * @returns {string} "DD/MM/YYYY" or empty string
 */
export const formatDateDMY = dateStr => {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-');
  return `${day}/${month}/${year}`;
};

/**
 * Converts a Date object (or parseable value) to DD/MM/YYYY.
 *
 * @param {Date|string|number} date
 * @returns {string} "DD/MM/YYYY" or empty string
 */
export const formatDateObjectDMY = date => {
  if (!date) return '';
  const d = date instanceof Date ? date : new Date(date);
  if (isNaN(d.getTime())) return '';
  const day = d.getDate().toString().padStart(2, '0');
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
};

/**
 * Converts a YYYY-MM-DD string to "D Mon" or "D Mon YY".
 * Used in calendar range displays.
 *
 * @param {string} dateStr - "YYYY-MM-DD"
 * @param {boolean} [includeYear=true]
 * @returns {string} e.g. "23 Feb 26" or "23 Feb"
 */
export const formatDateShort = (dateStr, includeYear = true) => {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-');
  if (includeYear) {
    return `${parseInt(day)} ${MONTH_NAMES_SHORT[parseInt(month) - 1]} ${year.slice(-2)}`;
  }
  return `${parseInt(day)} ${MONTH_NAMES_SHORT[parseInt(month) - 1]}`;
};

/**
 * Formats a date value using the en-IN locale as "DD Mon YYYY".
 * Returns '--' for invalid/missing input.
 *
 * @param {*} value - Date object, ISO string, or any parseable date value
 * @returns {string} e.g. "23 Feb 2026" or "--"
 */
export const formatDateLocaleIN = value => {
  if (!value) return '--';
  const dateObj = new Date(value);
  if (isNaN(dateObj.getTime())) return typeof value === 'string' ? value : '--';
  return dateObj.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

/**
 * Formats an ISO timestamp as "DD Mon YYYY, HH:MM AM/PM" (en-IN).
 * Used for sync timestamps.
 *
 * @param {string} isoString
 * @returns {string} e.g. "23 Feb 2026, 10:30 am" or "Not synced yet"
 */
export const formatDateTimeLocaleIN = isoString => {
  try {
    if (!isoString) return 'Not synced yet';
    return new Date(isoString).toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return 'Not synced yet';
  }
};

/**
 * Converts a Tally-style YYYYMMDD string to DD-MM-YYYY.
 *
 * @param {string} inputDateString - "YYYYMMDD"
 * @returns {string} "DD-MM-YYYY" or empty string
 */
export const formatTallyDate = inputDateString => {
  if (!inputDateString) return '';
  const year = inputDateString.slice(0, 4);
  const month = inputDateString.slice(4, 6);
  const day = inputDateString.slice(6, 8);
  return `${('0' + day).slice(-2)}-${('0' + month).slice(-2)}-${year}`;
};

/**
 * Converts a "D Mon" string to DD/MM/YYYY.
 * Used by DateFilterHelper for display formatting.
 *
 * @param {string} dateStr - e.g. "10 Jul"
 * @param {number} [year] - defaults to current year
 * @returns {string} "DD/MM/YYYY" or original string if parsing fails
 */
export const formatDateFilterDisplay = (dateStr, year = new Date().getFullYear()) => {
  const MONTH_MAP = {
    Jan: 1, Feb: 2, Mar: 3, Apr: 4, May: 5, Jun: 6,
    Jul: 7, Aug: 8, Sep: 9, Oct: 10, Nov: 11, Dec: 12,
  };
  const dateMatch = dateStr.match(/(\d+)\s+(\w+)/);
  if (dateMatch) {
    const day = parseInt(dateMatch[1]);
    const monthName = dateMatch[2];
    const month = MONTH_MAP[monthName];
    if (month) {
      return `${day.toString().padStart(2, '0')}/${month
        .toString()
        .padStart(2, '0')}/${year}`;
    }
  }
  return dateStr;
};
