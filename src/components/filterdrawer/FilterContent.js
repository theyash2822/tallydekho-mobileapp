import React, {useCallback, useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import {Calendar} from 'react-native-calendars';
import Feather from 'react-native-vector-icons/Feather';
import StockManagementFilters from './StockManagementFilters';
import {getCategoryOptions} from './FilterUtils';
import Colors from '../../utils/Colors';
import {CommonInputStyles} from '../../utils/CommonStyles';
import {formatDateDMY} from '../../utils/dateUtils';

const FilterContent = ({
  selectedCategory,
  searchQuery,
  setSearchQuery,
  selectedStockScreen,
  setSelectedStockScreen,
  filters,
  updateFilter,
  updateFilterCategory,
  stockFilters,
  onStockFilterChange,
  customFilters = null,
}) => {
  const renderFilterOption = useCallback((option) => {
    // Handle stock management screens
    if (option.isScreen) {
      return (
        <TouchableOpacity
          key={option.key}
          style={styles.filterOption}
          onPress={() => setSelectedStockScreen(option.key)}
          activeOpacity={0.7}>
          <Text style={styles.optionLabel}>{option.label}</Text>
          <Feather name="chevron-right" size={18} color="#94A3B8" />
        </TouchableOpacity>
      );
    }

    const isChecked = filters[selectedCategory]?.[option.key] || false;
    
    return (
      <TouchableOpacity
        key={option.key}
        style={styles.filterOption}
        onPress={() => {
          if (selectedCategory === 'amountRange' || selectedCategory === 'sort') {
            return;
          }
          updateFilter(selectedCategory, option.key, !isChecked);
        }}
        activeOpacity={0.7}>
        <View style={[styles.optionCheckbox, isChecked && styles.optionCheckboxChecked]}>
          {isChecked && <Feather name="check" size={14} color="#FFF" />}
        </View>
        <Text style={[styles.optionLabel, isChecked && styles.optionLabelChecked]}>
          {option.label}
        </Text>
        <Text style={styles.optionCount}>{option.count}</Text>
      </TouchableOpacity>
    );
  }, [selectedCategory, filters, updateFilter, setSelectedStockScreen]);

  const renderRadio = (label, selected, onPress) => (
    <TouchableOpacity
      style={styles.filterOption}
      onPress={onPress}
      activeOpacity={0.7}>
      <View style={[styles.radio, selected && styles.radioSelected]}>
        {selected && <View style={styles.radioInner} />}
      </View>
      <Text style={[styles.optionLabel, selected && styles.optionLabelChecked]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  // Get options - use customFilters if provided, otherwise use default
  const getFilteredOptions = () => {
    if (customFilters && customFilters[selectedCategory]) {
      const customFilter = customFilters[selectedCategory];
      let options = customFilter.options || [];
      
      // Filter by search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        options = options.filter(option => 
          option.label.toLowerCase().includes(query)
        );
      }
      
      return options;
    }
    return getCategoryOptions(selectedCategory, searchQuery);
  };

  const filteredOptions = getFilteredOptions();

  // Render custom filter option
  const renderCustomFilterOption = useCallback((option) => {
    if (!customFilters || !customFilters[selectedCategory]) {
      return renderFilterOption(option);
    }
    
    const customFilter = customFilters[selectedCategory];
    const isChecked = customFilter.selected?.includes(option.key) || false;
    
    return (
      <TouchableOpacity
        key={option.key}
        style={styles.filterOption}
        onPress={() => {
          if (isChecked) {
            customFilter.onDeselect?.(option.key);
          } else {
            customFilter.onSelect?.(option.key);
          }
        }}
        activeOpacity={0.7}>
        <View style={[styles.optionCheckbox, isChecked && styles.optionCheckboxChecked]}>
          {isChecked && <Feather name="check" size={14} color="#FFF" />}
        </View>
        <Text style={[styles.optionLabel, isChecked && styles.optionLabelChecked]}>
          {option.label}
        </Text>
      </TouchableOpacity>
    );
  }, [selectedCategory, customFilters, renderFilterOption]);

  return (
    <View style={styles.contentArea}>
      {/* Back button for stock management screens */}
      {selectedCategory === 'stockManagement' && selectedStockScreen && (
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => setSelectedStockScreen(null)}
          activeOpacity={0.7}>
          <Feather name="chevron-left" size={20} color="#3B82F6" />
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
      )}
      
      {/* Search Bar - Hide when using customFilters */}
      {!customFilters && selectedCategory !== 'amountRange' && 
       selectedCategory !== 'sort' && 
       selectedCategory !== 'stockManagement' && (
        <View style={styles.searchContainer}>
          <Feather name="search" size={18} color="#94A3B8" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search options..."
            placeholderTextColor="#64748B"
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCapitalize="none"
            autoCorrect={false}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => setSearchQuery('')}
              style={styles.clearButton}>
              <Feather name="x" size={16} color="#94A3B8" />
            </TouchableOpacity>
          )}
        </View>
      )}
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{flex: 1}}
        keyboardVerticalOffset={0}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.contentContainer}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="interactive">
          {selectedCategory === 'amountRange' ? (
            <View style={styles.specialFilterContainer}>
              <View style={styles.amountInputContainer}>
                <View style={styles.amountInputWrapper}>
                  <Text style={styles.amountLabel}>Min Amount</Text>
                  <TextInput
                    style={styles.amountInput}
                    placeholder="₹ 0"
                    keyboardType="numeric"
                    value={filters.amountRange.min}
                    onChangeText={text => updateFilter('amountRange', 'min', text)}
                  />
                </View>
                <Text style={styles.amountSeparator}>—</Text>
                <View style={styles.amountInputWrapper}>
                  <Text style={styles.amountLabel}>Max Amount</Text>
                  <TextInput
                    style={styles.amountInput}
                    placeholder="₹ 999999"
                    keyboardType="numeric"
                    value={filters.amountRange.max}
                    onChangeText={text => updateFilter('amountRange', 'max', text)}
                  />
                </View>
              </View>
            </View>
          ) : selectedCategory === 'sort' ? (
            <View style={styles.specialFilterContainer}>
              <Text style={styles.subSectionTitle}>Sort Field</Text>
              {renderRadio('Date', filters.sortBy === 'date', () => updateFilterCategory('sortBy', 'date'))}
              {renderRadio('Amount', filters.sortBy === 'amount', () => updateFilterCategory('sortBy', 'amount'))}
              {renderRadio('Name', filters.sortBy === 'name', () => updateFilterCategory('sortBy', 'name'))}
              <Text style={[styles.subSectionTitle, {marginTop: 16}]}>Order</Text>
              {renderRadio('Ascending', filters.sortOrder === 'asc', () => updateFilterCategory('sortOrder', 'asc'))}
              {renderRadio('Descending', filters.sortOrder === 'desc', () => updateFilterCategory('sortOrder', 'desc'))}
            </View>
          ) : selectedCategory === 'stockManagement' && selectedStockScreen ? (
            <View style={styles.specialFilterContainer}>
              <StockManagementFilters
                screenKey={selectedStockScreen}
                screenFilters={stockFilters[selectedStockScreen] || {}}
                onFilterChange={onStockFilterChange}
              />
            </View>
          ) : customFilters && customFilters[selectedCategory] ? (
            (() => {
              const customFilter = customFilters[selectedCategory];
              
              // Handle date range type
              if (customFilter.type === 'dateRange') {
                return (
                  <DateRangePicker
                    value={customFilter.value}
                    onChange={customFilter.onChange}
                  />
                );
              }
              
              // Handle text input type
              if (customFilter.type === 'textInput') {
                return (
                  <View style={styles.specialFilterContainer}>
                    <View style={styles.searchInputContainer}>
                      <Feather name="search" size={18} color="#94A3B8" style={styles.searchIcon} />
                      <TextInput
                        style={styles.textInputField}
                        placeholder={customFilter.placeholder || 'Search...'}
                        placeholderTextColor="#64748B"
                        value={customFilter.value || ''}
                        onChangeText={customFilter.onChange}
                        autoCapitalize="none"
                        autoCorrect={false}
                      />
                    </View>
                    {/* Show dropdown options if available */}
                    {customFilter.options && customFilter.options.length > 0 && (
                      <View style={styles.dropdownList}>
                        {customFilter.options.map(option => (
                          <TouchableOpacity
                            key={option.key}
                            style={styles.dropdownItem}
                            onPress={() => customFilter.onSelect?.(option.key)}>
                            <Text style={styles.dropdownItemText}>{option.label}</Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    )}
                  </View>
                );
              }
              
              // Handle radio type (single select)
              if (customFilter.type === 'radio') {
                return (
                  <View style={styles.specialFilterContainer}>
                    {customFilter.options?.map(option => {
                      const isSelected = customFilter.selected === option.key;
                      return (
                        <View key={option.key}>
                          {renderRadio(
                            option.label,
                            isSelected,
                            () => customFilter.onSelect?.(option.key)
                          )}
                        </View>
                      );
                    })}
                  </View>
                );
              }
              
              // Handle checkbox type (for boolean/switch-like filters)
              if (customFilter.type === 'checkbox') {
                return (
                  <View style={styles.specialFilterContainer}>
                    {customFilter.options?.map(option => {
                      const isChecked = customFilter.selected?.includes(option.key) || false;
                      return (
                        <TouchableOpacity
                          key={option.key}
                          style={styles.filterOption}
                          onPress={() => {
                            if (isChecked) {
                              customFilter.onDeselect?.(option.key);
                            } else {
                              customFilter.onSelect?.(option.key);
                            }
                          }}
                          activeOpacity={0.7}>
                          <View style={[styles.optionCheckbox, isChecked && styles.optionCheckboxChecked]}>
                            {isChecked && <Feather name="check" size={14} color="#FFF" />}
                          </View>
                          <Text style={[styles.optionLabel, isChecked && styles.optionLabelChecked]}>
                            {option.label}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                );
              }
              
              // Handle regular options (checkboxes)
              return (
                <View>
                  {filteredOptions.map(option => renderCustomFilterOption(option))}
                  {/* Render custom input field below options if it exists */}
                  {customFilter.customInput && (
                    <View style={styles.customInputContainer}>
                      <TextInput
                        style={styles.textInput}
                        placeholder={customFilter.customInput.placeholder || 'Enter value...'}
                        placeholderTextColor="#64748B"
                        value={customFilter.customInput.value || ''}
                        onChangeText={customFilter.customInput.onChange}
                        autoCapitalize="none"
                        autoCorrect={false}
                        keyboardType="numeric"
                      />
                    </View>
                  )}
                </View>
              );
            })()
          ) : (
            filteredOptions.map(option => renderFilterOption(option))
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  contentArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 8,
  },
  backButtonText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#3B82F6',
    marginLeft: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 8,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#E2E8F0',
    paddingVertical: 0,
  },
  clearButton: {
    padding: 4,
    marginLeft: 8,
  },
  contentContainer: {
    paddingVertical: 8,
  },
  specialFilterContainer: {
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  filterOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderColor: Colors.border,
  },
  optionCheckbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#475569',
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  optionCheckboxChecked: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  optionLabel: {
    flex: 1,
    fontSize: 14,
    color: '#8F939E',
    fontWeight: '400',
  },
  optionLabelChecked: {
    color: '#000',
    fontWeight: '500',
  },
  optionCount: {
    fontSize: 14,
    color: '#94A3B8',
    fontWeight: '400',
    marginLeft: 8,
  },
  subSectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#94A3B8',
    marginTop: 8,
    marginBottom: 12,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#475569',
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  radioSelected: {
    borderColor: '#10B981',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#10B981',
  },
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 8,
  },
  amountInputWrapper: {
    flex: 1,
  },
  amountLabel: {
    fontSize: 13,
    color: '#94A3B8',
    marginBottom: 8,
    fontWeight: '500',
  },
  amountInput: {
    borderWidth: 1,
    borderColor: '#475569',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 15,
    color: '#E2E8F0',
    backgroundColor: '#0F172A',
  },
  amountSeparator: {
    marginHorizontal: 12,
    fontSize: 18,
    color: '#64748B',
    marginTop: 28,
  },
  filterSectionTitle: {
    fontSize: 12,
    fontWeight: '400',
    color: '#94A3B8',
    marginTop: 16,
    marginBottom: 8,
  },
  textInput: {
    ...CommonInputStyles.textInput,
    backgroundColor: '#F0F2F9',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  customInputContainer: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 8,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F2F9',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 8,
  },
  textInputField: {
    flex: 1,
    fontSize: 14,
    color: '#1A1A1A',
    paddingVertical: 0,
    marginLeft: 8,
  },
  dropdownList: {
    backgroundColor: Colors.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    marginTop: 8,
    maxHeight: 200,
  },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  dropdownItemText: {
    fontSize: 15,
    color: '#1A1A1A',
  },
  dateInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F2F9',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 8,
  },
  dateInputText: {
    flex: 1,
    fontSize: 14,
    color: '#1A1A1A',
  },
  dateInputPlaceholder: {
    flex: 1,
    fontSize: 14,
    color: '#64748B',
  },
  calendarIcon: {
    marginRight: 8,
  },
  calendarModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  calendarModalContainer: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    width: '90%',
    maxWidth: 400,
  },
  calendarModalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 16,
    gap: 12,
  },
  calendarModalButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  calendarModalButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  calendarCloseButton: {
    backgroundColor: '#F0F2F9',
  },
  calendarCloseButtonText: {
    color: '#1A1A1A',
  },
  calendarOkButton: {
    backgroundColor: '#16C47F',
  },
  calendarOkButtonText: {
    color: '#FFFFFF',
  },
});

// Date Range Picker Component
const DateRangePicker = ({value, onChange}) => {
  const [showFromCalendar, setShowFromCalendar] = useState(false);
  const [showToCalendar, setShowToCalendar] = useState(false);
  const [tempFromDate, setTempFromDate] = useState(value?.startDate || '');
  const [tempToDate, setTempToDate] = useState(value?.endDate || '');

  // Sync with external value changes
  useEffect(() => {
    setTempFromDate(value?.startDate || '');
    setTempToDate(value?.endDate || '');
  }, [value]);

  const handleFromDateSelect = (day) => {
    const selectedDate = day.dateString;
    setTempFromDate(selectedDate);
    setShowFromCalendar(false);
    onChange({
      ...value,
      startDate: selectedDate,
      endDate: value?.endDate || '',
    });
  };

  const handleToDateSelect = (day) => {
    const selectedDate = day.dateString;
    setTempToDate(selectedDate);
    setShowToCalendar(false);
    onChange({
      ...value,
      startDate: value?.startDate || '',
      endDate: selectedDate,
    });
  };

  const getMarkedDates = (selectedDate) => {
    if (!selectedDate) return {};
    return {
      [selectedDate]: {
        selected: true,
        selectedColor: '#16C47F',
      },
    };
  };

  return (
    <View style={styles.specialFilterContainer}>
      <Text style={styles.filterSectionTitle}>From Date</Text>
      <TouchableOpacity
        style={styles.dateInputContainer}
        onPress={() => setShowFromCalendar(true)}
        activeOpacity={0.7}>
        <Feather name="calendar" size={18} color="#64748B" style={styles.calendarIcon} />
        {tempFromDate ? (
          <Text style={styles.dateInputText}>{formatDateDMY(tempFromDate)}</Text>
        ) : (
          <Text style={styles.dateInputPlaceholder}>Select From Date</Text>
        )}
      </TouchableOpacity>

      <Text style={styles.filterSectionTitle}>To Date</Text>
      <TouchableOpacity
        style={styles.dateInputContainer}
        onPress={() => setShowToCalendar(true)}
        activeOpacity={0.7}>
        <Feather name="calendar" size={18} color="#64748B" style={styles.calendarIcon} />
        {tempToDate ? (
          <Text style={styles.dateInputText}>{formatDateDMY(tempToDate)}</Text>
        ) : (
          <Text style={styles.dateInputPlaceholder}>Select To Date</Text>
        )}
      </TouchableOpacity>

      {/* From Date Calendar Modal */}
      <Modal
        transparent
        visible={showFromCalendar}
        animationType="fade"
        onRequestClose={() => setShowFromCalendar(false)}>
        <TouchableWithoutFeedback onPress={() => setShowFromCalendar(false)}>
          <View style={styles.calendarModalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.calendarModalContainer}>
                <Calendar
                  onDayPress={handleFromDateSelect}
                  markedDates={getMarkedDates(tempFromDate)}
                  maxDate={new Date().toISOString().split('T')[0]}
                  theme={{
                    todayTextColor: '#16C47F',
                    selectedDayBackgroundColor: '#16C47F',
                    arrowColor: '#16C47F',
                  }}
                />
                <View style={styles.calendarModalButtons}>
                  <TouchableOpacity
                    style={[styles.calendarModalButton, styles.calendarCloseButton]}
                    onPress={() => setShowFromCalendar(false)}>
                    <Text style={[styles.calendarModalButtonText, styles.calendarCloseButtonText]}>
                      Close
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* To Date Calendar Modal */}
      <Modal
        transparent
        visible={showToCalendar}
        animationType="fade"
        onRequestClose={() => setShowToCalendar(false)}>
        <TouchableWithoutFeedback onPress={() => setShowToCalendar(false)}>
          <View style={styles.calendarModalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.calendarModalContainer}>
                <Calendar
                  onDayPress={handleToDateSelect}
                  markedDates={getMarkedDates(tempToDate)}
                  maxDate={new Date().toISOString().split('T')[0]}
                  minDate={tempFromDate || undefined}
                  theme={{
                    todayTextColor: '#16C47F',
                    selectedDayBackgroundColor: '#16C47F',
                    arrowColor: '#16C47F',
                  }}
                />
                <View style={styles.calendarModalButtons}>
                  <TouchableOpacity
                    style={[styles.calendarModalButton, styles.calendarCloseButton]}
                    onPress={() => setShowToCalendar(false)}>
                    <Text style={[styles.calendarModalButtonText, styles.calendarCloseButtonText]}>
                      Close
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

export default FilterContent;

