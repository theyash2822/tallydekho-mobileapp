import React, {useState, useMemo, useRef} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Keyboard,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Colors from '../../utils/Colors';

const SearchReferenceDropdown = ({
  label,
  data = [],
  placeholder,
  onSelect,
  scrollViewRef,
  inputRef: externalInputRef,
  nextInputRef,
  returnKeyType = 'next',
}) => {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState('');
  const internalInputRef = useRef(null);
  const containerRef = useRef(null);
  const [containerY, setContainerY] = useState(0);
  
  // Use external ref if provided, otherwise use internal
  const inputRef = externalInputRef || internalInputRef;

  const filtered = useMemo(
    () => data.filter(item => item.toLowerCase().includes(query.toLowerCase())),
    [query, data],
  );

  const handleSelect = item => {
    setSelected(item);
    setQuery('');
    onSelect(item);
    // Move to next input after selection - keep keyboard open
    if (nextInputRef?.current) {
      setTimeout(() => {
        nextInputRef.current?.focus();
      }, 50);
    } else {
      Keyboard.dismiss();
    }
  };

  const handleFocus = () => {
    // Only scroll if field is below threshold (not at top of screen)
    const SCROLL_THRESHOLD = 200;
    if (scrollViewRef?.current && containerY > SCROLL_THRESHOLD) {
      setTimeout(() => {
        scrollViewRef.current?.scrollTo({
          y: containerY - 100,
          animated: true,
        });
      }, 150);
    }
  };

  const handleContainerLayout = event => {
    const {y} = event.nativeEvent.layout;
    setContainerY(y);
  };

  const iconName = selected ? 'document-text-outline' : 'search-outline';

  return (
    <View ref={containerRef} onLayout={handleContainerLayout} style={styles.section}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={styles.searchContainer}>
        <Icon
          name={iconName}
          size={20}
          color="#8F939E"
          style={styles.iconLeft}
        />
        <TextInput
          ref={inputRef}
          value={selected || query}
          onChangeText={t => {
            setQuery(t);
            setSelected('');
          }}
          placeholder={placeholder}
          placeholderTextColor="#8F939E"
          style={styles.input}
          returnKeyType={returnKeyType}
          blurOnSubmit={false}
          onSubmitEditing={() => {
            if (nextInputRef?.current) {
              setTimeout(() => {
                nextInputRef.current?.focus();
              }, 50);
            }
          }}
          onFocus={handleFocus}
        />
      </View>

      {query.trim().length > 0 &&
        (filtered.length > 0 ? (
          <ScrollView style={styles.dropdown} nestedScrollEnabled={true}>
            {filtered.map((item, idx) => (
              <TouchableOpacity
                key={`${item}-${idx}`}
                style={styles.item}
                onPress={() => handleSelect(item)}>
                <Text style={styles.itemText}>{item}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        ) : (
          <Text style={styles.noResult}>No results found</Text>
        ))}
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    marginTop: 12,
  },
  label: {
    marginBottom: 8,
    fontSize: 14,
    color: '#8F939E',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: Colors.white,
    height: 45,
  },
  iconLeft: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    color: '#000',
  },
  dropdown: {
    maxHeight: 4 * 47, // show up to 4 items
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    marginTop: 4,
    backgroundColor: Colors.white,
  },
  item: {
    padding: 12,
    borderBottomWidth: 1,
    borderColor: Colors.border,
  },
  itemText: {
    fontSize: 16,
    color: '#333',
  },
  noResult: {
    marginTop: 10,
    textAlign: 'center',
    color: '#999',
    fontStyle: 'italic',
  },
});

export default SearchReferenceDropdown;
