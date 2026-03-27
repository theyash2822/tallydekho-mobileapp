import { useState , useEffect} from "react";
import {formatTallyDate as formatTallyDateUtil} from '../../utils/dateUtils';

export const useDebounce = (value, delay = 1000) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timeout);
  }, [value, delay]);
  return debouncedValue;
};


////////////////////////////////////////////////////////////////

export const formatTallyDate = formatTallyDateUtil;

const MONTH_SHORT_TO_INDEX = {
  jan: 0,
  feb: 1,
  mar: 2,
  apr: 3,
  may: 4,
  jun: 5,
  jul: 6,
  aug: 7,
  sep: 8,
  oct: 9,
  nov: 10,
  dec: 11,
};

const parseMonthYear = str => {
  if (!str || typeof str !== 'string') return null;
  const s = str.trim();

  // 1) "August 2017" or "Aug 2017" (case insensitive)
  let m = s.match(/([A-Za-z]+)\s+(\d{4})/);
  if (m) {
    const mon = m[1].toLowerCase().slice(0, 3);
    const year = parseInt(m[2], 10);
    const monthIdx = MONTH_SHORT_TO_INDEX[mon];
    if (monthIdx !== undefined) return {year, monthIdx};
  }

  // 2) "2017-08" or "2017/08"
  m = s.match(/(\d{4})[-\/](\d{1,2})/);
  if (m) {
    const year = parseInt(m[1], 10);
    const monthIdx = parseInt(m[2], 10) - 1;
    return {year, monthIdx};
  }

  // 3) "08-2017" or "08/2017"
  m = s.match(/(\d{1,2})[-\/](\d{4})/);
  if (m) {
    const monthIdx = parseInt(m[1], 10) - 1;
    const year = parseInt(m[2], 10);
    return {year, monthIdx};
  }

  // Fallback: try Date parsing; if valid use it
  const d = new Date(s);
  if (!Number.isNaN(d.getTime()))
    return {year: d.getFullYear(), monthIdx: d.getMonth()};

  // If everything fails, return null
  return null;
};

export const groupVouchersByMonth = vouchers => {
  const grouped = {};

  vouchers.forEach(v => {
    const month = v.monthYear;
    if (!grouped[month]) grouped[month] = [];

    grouped[month].push({
      type: v.voucherTypeName,
      voucher: `#${v.voucherNumber}`,
      amountType: v.isCredit ? 'Cr' : 'Dr',
      amount: v.amount.toString(),
      bal: '',
      date: v.date,
    });
  });

  const keys = Object.keys(grouped);

  keys.sort((a, b) => {
    const pa = parseMonthYear(a);
    const pb = parseMonthYear(b);

    // If both parsed -> compare year then month
    if (pa && pb) {
      if (pb.year !== pa.year) return pb.year - pa.year; // newest first
      return pb.monthIdx - pa.monthIdx;
    }

    // If only one parsed, prefer the parsed one (put parsed first)
    if (pa && !pb) return -1;
    if (!pa && pb) return 1;

    // Both failed to parse -> fallback to localeCompare (stable)
    return b.localeCompare(a);
  });

  return keys.map(month => ({month, tiles: grouped[month]}));
};




