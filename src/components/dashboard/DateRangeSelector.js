import React, {useState} from 'react';
import {View, Text, Pressable, StyleSheet} from 'react-native';
import Colors from '../../utils/Colors';

const DateRangeSelector = ({onRangeChange}) => {
  const [selectedRange, setSelectedRange] = useState('7D');
  const ranges = ['7D', '1M', '3M', '6M'];

  const handleSelect = range => {
    setSelectedRange(range);
    onRangeChange?.(range);
  };

  return (
    <View style={styles.container}>
      {ranges.map(range => {
        const isSelected = range === selectedRange;
        return (
          <Pressable
            key={range}
            onPress={() => handleSelect(range)}
            style={({pressed}) => [
              styles.button,
              isSelected ? styles.selectedButton : styles.unselectedButton,
              pressed && styles.pressedButton,
            ]}
            accessibilityRole="button"
            accessibilityState={{selected: isSelected}}
            testID={`range-button-${range}`}>
            <Text
              style={[
                styles.text,
                isSelected ? styles.selectedText : styles.unselectedText,
              ]}>
              {range}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
    backgroundColor: '#f4f5fa',
    padding: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  button: {
    paddingVertical: 8,
    width: '25%',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedButton: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  unselectedButton: {
    backgroundColor: 'transparent',
  },
  pressedButton: {
    opacity: 0.7,
  },
  text: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  selectedText: {
    color: Colors.black,
  },
  unselectedText: {
    color: '#838F9A',
  },
});

export default DateRangeSelector;
