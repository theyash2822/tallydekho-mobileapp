import React, {useState, useRef} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  TextInput,
  Pressable,
  Platform,
} from 'react-native';
import Colors from '../../../utils/Colors';
import Feather from 'react-native-vector-icons/Feather';
import {SwipeListView} from 'react-native-swipe-list-view';
import CustomCalendar from '../../../components/common/Calender';
import {Icons} from '../../../utils/Icons';

const RegisterComponent = ({
  title,
  data,
  searchQuery,
  setSearchQuery,
  selectedItems,
  onItemPress,
  onItemLongPress,
  onShareSelected,
  renderCard,
  filters,
  summaryCards,
  sectionTitle,
  shareButtonText = 'Share',
  shareButtonColor = '#10B981',
  typeOptions = ['All', 'Inflow', 'Outflow'],
  additionalFilters = [],
}) => {
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [selectedType, setSelectedType] = useState('Type');
  const [selectedPeriod, setSelectedPeriod] = useState('Period');
  const [selectedStatus, setSelectedStatus] = useState('Status');
  const [dateRange, setDateRange] = useState({startDate: null, endDate: null});
  const [shouldCloseCalendar, setShouldCloseCalendar] = useState(false);
  const swipeListRef = useRef(null);

  // Filter data based on search, type, and date range
  const filteredData = data.filter(item => {
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = Object.values(item).some(
      value => value && value.toString().toLowerCase().includes(searchLower),
    );

    // Filter by type if not "All" or "Type"
    const matchesType =
      selectedType === 'All' ||
      selectedType === 'Type' ||
      (selectedType === 'Inflow' && item.type === 'receipt') ||
      (selectedType === 'Outflow' && item.type === 'payment') ||
      (selectedType === 'Direct' && item.type === 'Direct') ||
      (selectedType === 'Indirect' && item.type === 'Indirect');

    // Filter by status if not "Status" or "All"
    const matchesStatus =
      selectedStatus === 'Status' ||
      selectedStatus === 'All' ||
      !selectedStatus ||
      (selectedStatus === 'Paid' && item.status === 'Paid') ||
      (selectedStatus === 'Unpaid' && item.status === 'Unpaid');

    // Filter by date range
    let matchesDateRange = true;

    if (dateRange.startDate) {
      // Extract date from item.date (format: "10 Jul" or "9 Jul")
      const dateMatch = item.date.match(/(\d+)\s+(\w+)/);

      if (dateMatch) {
        const day = parseInt(dateMatch[1]);
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

        const month = monthMap[monthName];
        if (month !== undefined) {
          // Try to get year from fullDate field if available, otherwise use current year
          let itemYear = new Date().getFullYear();
          if (item.fullDate) {
            // Parse fullDate format: "DD/MM/YYYY" or "D/M/YYYY"
            const fullDateParts = item.fullDate.split('/');
            if (fullDateParts.length === 3) {
              itemYear = parseInt(fullDateParts[2]);
            }
          }

          const startDate = new Date(dateRange.startDate);

          if (dateRange.endDate) {
            // Date range selection - inclusive of both start and end dates
            const endDate = new Date(dateRange.endDate);

            // Create date objects for comparison using actual years from data
            const itemDateForRange = new Date(itemYear, month, day);
            const startDateForRange = new Date(
              startDate.getFullYear(),
              startDate.getMonth(),
              startDate.getDate(),
            );
            const endDateForRange = new Date(
              endDate.getFullYear(),
              endDate.getMonth(),
              endDate.getDate(),
            );

            // Inclusive range comparison
            matchesDateRange =
              itemDateForRange >= startDateForRange &&
              itemDateForRange <= endDateForRange;
          } else {
            // Single date selection - compare day, month, and year
            const selectedDay = startDate.getDate();
            const selectedMonth = startDate.getMonth();
            const selectedYear = startDate.getFullYear();

            // Compare day, month, and year
            matchesDateRange =
              day === selectedDay &&
              month === selectedMonth &&
              itemYear === selectedYear;
          }
        }
      }
    }

    return matchesSearch && matchesType && matchesStatus && matchesDateRange;
  });

  return (
    <View style={styles.container}>
      {/* Top Section with Filters and Summary */}
      <View style={styles.topSection}>
        {/* Filters */}
        <View style={styles.filtersContainer}>
          {filters.map((filter, index) => (
            <View key={index} style={styles.filterItemContainer}>
              {filter === 'Period' ? (
                <View style={styles.filterButton}>
                  <CustomCalendar
                    label={selectedPeriod}
                    style={{paddingHorizontal: 0, paddingVertical: 0, backgroundColor: 'transparent'}}
                    containerStyle={{backgroundColor: 'transparent', borderRadius: 0, paddingHorizontal: 0}}
                    width="auto"
                    onOpen={() => {
                      setShowTypeDropdown(false);
                      setShowStatusDropdown(false);
                    }}
                    shouldClose={shouldCloseCalendar}
                    onDateRangeChange={({startDate, endDate}) => {
                    setDateRange({startDate, endDate});
                    if (startDate && endDate) {
                      // Date range selection
                      const startDateObj = new Date(startDate);
                      const endDateObj = new Date(endDate);

                      const formattedStart = `${startDateObj.getDate()}/${
                        startDateObj.getMonth() + 1
                      }/${startDateObj.getFullYear()}`;
                      const formattedEnd = `${endDateObj.getDate()}/${
                        endDateObj.getMonth() + 1
                      }/${endDateObj.getFullYear()}`;
                      setSelectedPeriod(`${formattedStart} - ${formattedEnd}`);
                    } else if (startDate && !endDate) {
                      // Single date selection
                      const startDateObj = new Date(startDate);
                      const formattedDate = `${startDateObj.getDate()}/${
                        startDateObj.getMonth() + 1
                      }/${startDateObj.getFullYear()}`;
                      setSelectedPeriod(formattedDate);
                    } else if (!startDate && !endDate) {
                      // Reset to default when both dates are null (cancel pressed)
                      setSelectedPeriod('Period');
                    }
                  }}
                  />
                </View>
              ) : (
                <TouchableOpacity
                style={[styles.filterButton, { marginLeft:0 }]}
                  onPress={() => {
                    if (filter === 'Type') {
                      if (!showTypeDropdown) {
                        // Opening Type dropdown, close calendar
                        setShouldCloseCalendar(true);
                        setTimeout(() => setShouldCloseCalendar(false), 100);
                      }
                      setShowTypeDropdown(!showTypeDropdown);
                      setShowStatusDropdown(false);
                    } else if (filter === 'Status') {
                      if (!showStatusDropdown) {
                        // Opening Status dropdown, close calendar
                        setShouldCloseCalendar(true);
                        setTimeout(() => setShouldCloseCalendar(false), 100);
                      }
                      setShowStatusDropdown(!showStatusDropdown);
                      setShowTypeDropdown(false);
                    }
                  }}>
                  <Text style={styles.filterButtonText}>
                    {filter === 'Type'
                      ? selectedType
                      : filter === 'Status'
                      ? selectedStatus
                      : filter}
                  </Text>
                  <Feather
                    name={
                      (filter === 'Type' && showTypeDropdown) ||
                      (filter === 'Status' && showStatusDropdown)
                        ? 'chevron-up'
                        : 'chevron-down'
                    }
                    size={16}
                    color="#6B7280"
                  />
                </TouchableOpacity>
              )}

              {/* Type Dropdown */}
              {filter === 'Type' && showTypeDropdown && (
                <View style={styles.dropdownContainer}>
                  {typeOptions.map((option, idx) => (
                    <TouchableOpacity
                      key={option}
                      style={[
                        styles.dropdownItem,
                        idx === typeOptions.length - 1 && styles.lastDropdownItem,
                      ]}
                      onPress={() => {
                        setSelectedType(option);
                        setShowTypeDropdown(false);
                      }}>
                      <Text
                        style={[
                          styles.dropdownText,
                          selectedType === option &&
                            styles.dropdownTextSelected,
                        ]}>
                        {option}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              {/* Status Dropdown */}
              {filter === 'Status' && showStatusDropdown && (
                <View style={styles.dropdownContainer}>
                  {['All', 'Paid', 'Unpaid'].map((option, idx) => (
                    <TouchableOpacity
                      key={option}
                      style={[
                        styles.dropdownItem,
                        idx === 2 && styles.lastDropdownItem,
                      ]}
                      onPress={() => {
                        setSelectedStatus(option);
                        setShowStatusDropdown(false);
                      }}>
                      <Text
                        style={[
                          styles.dropdownText,
                          selectedStatus === option &&
                            styles.dropdownTextSelected,
                        ]}>
                        {option}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          ))}
        </View>

        {/* Additional Filters Row */}
        {additionalFilters.length > 0 && (
          <View style={styles.filtersContainer}>
            {additionalFilters.map((filter, index) => (
              <View
                key={`additional-${index}`}
                style={styles.filterItemContainer}>
                <TouchableOpacity
                  style={styles.filterButton}
                  onPress={() => {
                    if (filter === 'Status') {
                      if (!showStatusDropdown) {
                        // Opening Status dropdown, close calendar
                        setShouldCloseCalendar(true);
                        setTimeout(() => setShouldCloseCalendar(false), 100);
                      }
                      setShowStatusDropdown(!showStatusDropdown);
                      setShowTypeDropdown(false);
                    }
                  }}>
                  <Text style={styles.filterButtonText}>
                    {filter === 'Status' ? selectedStatus : filter}
                  </Text>
                  <Feather
                    name={
                      filter === 'Status' && showStatusDropdown
                        ? 'chevron-up'
                        : 'chevron-down'
                    }
                    size={16}
                    color="#6B7280"
                  />
                </TouchableOpacity>

                {/* Status Dropdown for Additional Filters */}
                {filter === 'Status' && showStatusDropdown && (
                  <View style={styles.dropdownContainer}>
                    {['All', 'Paid', 'Unpaid'].map((option, idx) => (
                      <TouchableOpacity
                        key={option}
                        style={[
                          styles.dropdownItem,
                          idx === 2 && styles.lastDropdownItem,
                        ]}
                        onPress={() => {
                          setSelectedStatus(option);
                          setShowStatusDropdown(false);
                        }}>
                        <Text
                          style={[
                            styles.dropdownText,
                            selectedStatus === option &&
                              styles.dropdownTextSelected,
                          ]}>
                          {option}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <Feather
              name="search"
              size={20}
              color="#6B7280"
              style={styles.searchIcon}
            />
            <TextInput
              style={styles.searchInput}
              placeholder="Search"
              placeholderTextColor="#9CA3AF"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        {/* Summary Cards */}
        <View style={styles.summaryCardsContainer}>
          {(typeof summaryCards === 'function'
            ? summaryCards(filteredData)
            : summaryCards
          ).map((card, index) => (
            <View key={index} style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>{card.label}</Text>
              <Text style={styles.summaryValue}>{card.value}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Section Title */}
      <View style={styles.sectionTitleContainer}>
        <Text style={styles.sectionTitle}>{sectionTitle}</Text>
      </View>

      {/* Data List */}
      <SwipeListView
        ref={swipeListRef}
        data={filteredData}
        removeClippedSubviews={false}
        keyExtractor={(item, index) => item.id?.toString() || index.toString()}
        renderItem={({item}) => renderCard(item)}
        renderHiddenItem={({item}) => (
          <View style={styles.rowBack}>
            <TouchableOpacity
              style={styles.editActionContainer}
              onPress={() =>
                console.log('Share PDF for:', item.reference || item.id)
              }>
              <View style={styles.editIconContainer}>
                <Icons.ShareGreen height={20} width={20} />
              </View>
              <Text style={styles.editActionText}>Share PDF</Text>
            </TouchableOpacity>
          </View>
        )}
        rightOpenValue={-100}
        disableRightSwipe
        closeOnRowOpen={true}
        closeOnRowBeginSwipe={false}
        closeOnScroll={true}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          filteredData.length === 0 && {
            flexGrow: 1,
            justifyContent: 'center',
            alignItems: 'center',
          },
        ]}
        ListEmptyComponent={
          <View style={styles.noDataContainer}>
            <Text style={styles.noDataText}>No vouchers found</Text>
          </View>
        }
      />

      {/* Share Button */}
      {selectedItems.length > 0 && (
        <View style={styles.shareButtonContainer}>
          <Pressable
            style={[styles.shareButton, {backgroundColor: shareButtonColor}]}
            onPress={onShareSelected}>
            <Feather name="share-2" size={20} color="#fff" />
            <Text style={styles.shareButtonText}>{shareButtonText}</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
};

// Common card renderer that can be customized
export const CommonCardRenderer = ({
  item,
  isSelected,
  onPress,
  onLongPress,
  statusConfig,
  iconConfig,
  renderHiddenRow,
  children,
}) => {
  return (
    <TouchableOpacity
      style={[styles.card, isSelected && styles.selectedCard]}
      onPress={() => onPress(item.id)}
      onLongPress={() => onLongPress(item.id)}
      activeOpacity={1}>
      {children}
    </TouchableOpacity>
  );
};

// Common status row component
export const StatusRow = ({
  status,
  reference,
  statusConfig,
  showStatus = true,
}) => (
  <View style={styles.statusRow}>
    {showStatus && status && statusConfig ? (
      <>
        <View
          style={[
            styles.statusDot,
            {
              backgroundColor: statusConfig.getColor(status),
            },
          ]}
        />
        <Text
          style={[styles.statusText, {color: statusConfig.getColor(status)}]}>
          {status}
        </Text>
        <View style={styles.dotSeparator} />
      </>
    ) : null}
    <Text style={styles.referenceText}>{reference}</Text>
  </View>
);

// Common icon container component
export const IconContainer = ({iconConfig, children}) => (
  <View
    style={[
      styles.iconContainer,
      {backgroundColor: iconConfig.backgroundColor},
    ]}>
    {children}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundColorPrimary,
  },
  topSection: {
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 8,
  },
  filtersContainer: {
    flexDirection: 'row',
    gap: 4,
    marginBottom: 6,
  },
  filterItemContainer: {
    position: 'relative',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F6F8FA',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    height: 41,
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  searchContainer: {
    marginBottom: 10,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7F9FC',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === 'ios' ? 10 : 14, // Increased padding for iOS
    minHeight: Platform.OS === 'ios' ? 44 : undefined, // Min height for iOS touch target
    borderWidth: 1,
    borderColor: Colors.border,
    marginTop:4
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: Platform.OS === 'ios' ? 16 : 16, // Increased font size for iOS to prevent auto-zoom
    color: '#111827',
    paddingVertical: Platform.OS === 'ios' ? 8 : 0, // Added vertical padding for iOS
  },
  summaryCardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  summaryCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryLabel: {
    fontSize: 12,
    fontWeight: '400',
    color: '#8F939E',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#494D58',
  },
  sectionTitleContainer: {
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 14,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#494D58',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 12,
    paddingBottom: 10,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  selectedCard: {
    borderColor: '#10B981',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    marginRight: 8,
  },
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
    color: '#8F939E',
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowBack: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    borderRadius: 16,
  },
  editActionContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  editActionText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    textAlign: 'center',
  },
  editIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#fff',
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
  },
  dropdownContainer: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    marginTop: 4,
    zIndex: 1000,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  lastDropdownItem: {
    borderBottomWidth: 0,
  },
  dropdownText: {
    fontSize: 12,
    color: '#6F7C97',
    fontWeight: '400',
  },
  dropdownTextSelected: {
    color: '#10B981',
    fontWeight: '600',
  },
  shareButtonContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  shareButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  noDataContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  noDataText: {
    fontSize: 16,
    color: Colors.gray,
    fontWeight: '500',
  },
});

export default RegisterComponent;
