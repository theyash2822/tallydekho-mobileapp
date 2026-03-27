/**
 * Helper functions for date filtering across different screens
 */

import {formatDateFilterDisplay} from '../../utils/dateUtils';

/**
 * Filters data based on selected status and period
 * @param {Array} data - Array of items to filter
 * @param {string} selectedStatus - Selected status filter ('All', 'Paid', 'Unpaid')
 * @param {string} selectedPeriod - Selected period filter (default: 'June 25')
 * @param {string} dateField - Field name containing the date (default: 'date')
 * @param {string} statusField - Field name containing the status (default: 'status')
 * @param {boolean} useIsPaid - Whether to use isPaid field for status filtering (default: false)
 * @returns {Array} Filtered data array
 */
export const filterDataByStatusAndPeriod = (
  data,
  selectedStatus,
  selectedPeriod,
  dateField = 'date',
  statusField = 'status',
  useIsPaid = false,
) => {
  return data.filter(item => {
    // Filter by status
    let matchesStatus = true;

    if (useIsPaid) {
      // For PurchaseScreen style filtering using isPaid field
      if (selectedStatus === 'Paid') {
        matchesStatus = item.isPaid === true;
      } else if (selectedStatus === 'Unpaid') {
        matchesStatus = item.isPaid === false;
      }
    } else {
      // For SalesScreen/ExpensesScreen style filtering using status field
      matchesStatus =
        selectedStatus === 'All' || item[statusField] === selectedStatus;
    }

    // Filter by period
    let matchesPeriod = true;
    // Only filter if selectedPeriod is a valid date format
    // Valid formats: 'YYYY-MM-DD' or 'YYYY-MM-DD to YYYY-MM-DD'
    // Invalid/empty: '', 'Period', or any text without '-' or ' to '
    if (
      selectedPeriod &&
      selectedPeriod !== 'Period' &&
      (selectedPeriod.includes('-') || selectedPeriod.includes(' to '))
    ) {
      const currentYear = new Date().getFullYear();

      // Handle date range selection
      if (selectedPeriod.includes(' to ')) {
        // Date range selection (format: "YYYY-MM-DD to YYYY-MM-DD")
        const [startDateStr, endDateStr] = selectedPeriod.split(' to ');


        // Parse start and end dates (format: "YYYY-MM-DD")
        const startDateParts = startDateStr.split('-');
        const endDateParts = endDateStr.split('-');

        if (startDateParts.length === 3 && endDateParts.length === 3) {
          const startYear = parseInt(startDateParts[0]);
          const startMonth = parseInt(startDateParts[1]) - 1; // Month is 0-indexed
          const startDay = parseInt(startDateParts[2]);

          const endYear = parseInt(endDateParts[0]);
          const endMonth = parseInt(endDateParts[1]) - 1; // Month is 0-indexed
          const endDay = parseInt(endDateParts[2]);

          // Parse item date (format: "10 Jul")
          const dateMatch = item[dateField].match(/(\d+)\s+(\w+)/);
          if (dateMatch) {
            const itemDay = parseInt(dateMatch[1]);
            const monthName = dateMatch[2];


            // Convert month name to number
            const monthMap = {
              Jan: 0,
              Feb: 1,
              Mar: 2,
              Apr: 3,
              May: 4,
              Jun: 5,
              Jul: 6,
              Aug: 7,
              Sep: 8,
              Oct: 9,
              Nov: 10,
              Dec: 11,
            };

            const itemMonth = monthMap[monthName];
            if (itemMonth !== undefined) {
              // Try to get year from fullDate field if available, otherwise use current year
              let itemYear = currentYear;
              if (item.fullDate) {
                // Parse fullDate format: "DD/MM/YYYY" or "D/M/YYYY"
                const fullDateParts = item.fullDate.split('/');
                if (fullDateParts.length === 3) {
                  itemYear = parseInt(fullDateParts[2]);
                }
              }

              const isAfterStart =
                itemYear > startYear ||
                (itemYear === startYear && itemMonth > startMonth) ||
                (itemYear === startYear &&
                  itemMonth === startMonth &&
                  itemDay >= startDay);

              const isBeforeEnd =
                itemYear < endYear ||
                (itemYear === endYear && itemMonth < endMonth) ||
                (itemYear === endYear &&
                  itemMonth === endMonth &&
                  itemDay <= endDay);

              matchesPeriod = isAfterStart && isBeforeEnd;

            } else {
              // If month name not found in map, don't filter out the item
              matchesPeriod = true;
            }
          } else {
            // If dateMatch fails, don't filter out the item
            matchesPeriod = true;
          }
        } else {
          // If date parts are not valid, show all data
          matchesPeriod = true;
        }
      } else {
        // Single date selection (format: "YYYY-MM-DD")

        // Parse the YYYY-MM-DD format
        const selectedDateParts = selectedPeriod.split('-');


        if (selectedDateParts.length === 3) {
          const selectedYear = parseInt(selectedDateParts[0]);
          const selectedMonth = parseInt(selectedDateParts[1]) - 1; // Month is 0-indexed
          const selectedDay = parseInt(selectedDateParts[2]);

          // Parse item date (format: "10 Jul")
          const dateMatch = item[dateField].match(/(\d+)\s+(\w+)/);
          if (dateMatch) {
            const itemDay = parseInt(dateMatch[1]);
            const monthName = dateMatch[2];

            // Convert month name to number
            const monthMap = {
              Jan: 0,
              Feb: 1,
              Mar: 2,
              Apr: 3,
              May: 4,
              Jun: 5,
              Jul: 6,
              Aug: 7,
              Sep: 8,
              Oct: 9,
              Nov: 10,
              Dec: 11,
            };

            const itemMonth = monthMap[monthName];
            if (itemMonth !== undefined) {
              // Try to get year from fullDate field if available, otherwise use current year
              let itemYear = currentYear;
              if (item.fullDate) {
                // Parse fullDate format: "DD/MM/YYYY" or "D/M/YYYY"
                const fullDateParts = item.fullDate.split('/');
                if (fullDateParts.length === 3) {
                  itemYear = parseInt(fullDateParts[2]);
                }
              }

              matchesPeriod =
                itemDay === selectedDay &&
                itemMonth === selectedMonth &&
                selectedYear === itemYear;

            } else {
              // If date parsing fails, don't filter out the item
              matchesPeriod = true;
            }
          } else {
            // If dateMatch fails, don't filter out the item
            matchesPeriod = true;
          }
        } else {
          // If selectedDateParts is not valid format, show all data
          matchesPeriod = true;
        }
      }
    } else {
      // If selectedPeriod is empty, 'Period', or invalid format, show all data
      matchesPeriod = true;
    }

    return matchesStatus && matchesPeriod;
  });
};

export const formatDateForDisplay = formatDateFilterDisplay;
