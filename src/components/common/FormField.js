import React, {useRef, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Keyboard,
  Platform,
} from 'react-native';
import {CommonInputStyles, CommonLabelStyles} from '../../utils/CommonStyles';

/**
 * Reusable form field: label + TextInput + optional error.
 *
 * Supports required indicator, error display, multiline,
 * auto-scroll on focus, and input navigation (next/done).
 *
 * All extra props are forwarded to the underlying TextInput.
 */
const FormField = ({
  label,
  required = false,
  error,
  style,
  labelStyle,
  inputStyle,
  inputRef,
  nextInputRef,
  scrollViewRef,
  scrollToNextOnFocus = false,
  returnKeyType = 'next',
  onSubmitEditing,
  onFocus,
  keyboardType,
  containerRef: externalContainerRef,
  onLayout: externalOnLayout,
  multiline = false,
  ...props
}) => {
  const internalContainerRef = useRef(null);
  const containerRef = externalContainerRef || internalContainerRef;
  const [containerY, setContainerY] = useState(0);

  const handleFocus = () => {
    if (onFocus) onFocus();

    const SCROLL_THRESHOLD = 200;
    if (scrollViewRef?.current && containerY > SCROLL_THRESHOLD) {
      setTimeout(() => {
        const scrollOffset = scrollToNextOnFocus ? 200 : 100;
        scrollViewRef.current?.scrollTo({
          y: containerY - scrollOffset,
          animated: true,
        });
      }, 150);
    }
  };

  const handleContainerLayout = event => {
    const {y} = event.nativeEvent.layout;
    setContainerY(y);
    if (externalOnLayout) externalOnLayout(event);
  };

  const handleSubmit = () => {
    if (returnKeyType === 'done') {
      Keyboard.dismiss();
    } else if (onSubmitEditing) {
      onSubmitEditing();
    } else if (nextInputRef?.current) {
      setTimeout(() => {
        nextInputRef.current?.focus();
      }, 50);
    }
  };

  const effectiveKeyboardType =
    Platform.OS === 'ios' && keyboardType === 'numeric'
      ? 'numbers-and-punctuation'
      : keyboardType;

  return (
    <View ref={containerRef} onLayout={handleContainerLayout} style={style}>
      {label ? (
        <Text style={[styles.label, labelStyle]}>
          {label}
          {required ? <Text style={styles.required}> *</Text> : null}
        </Text>
      ) : null}
      <TextInput
        ref={inputRef}
        style={[
          styles.input,
          multiline && styles.multiline,
          error && styles.inputError,
          inputStyle,
        ]}
        placeholderTextColor="#8F939E"
        returnKeyType={returnKeyType}
        onSubmitEditing={handleSubmit}
        onFocus={handleFocus}
        blurOnSubmit={returnKeyType === 'done'}
        keyboardType={effectiveKeyboardType}
        textAlignVertical={multiline ? 'top' : 'center'}
        multiline={multiline}
        numberOfLines={multiline ? 3 : 1}
        {...props}
      />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    ...CommonLabelStyles.label,
  },
  required: {
    color: '#EF4444',
    fontWeight: '400',
  },
  input: {
    ...CommonInputStyles.textInput,
  },
  multiline: {
    minHeight: 80,
    paddingTop: 12,
    textAlignVertical: 'top',
  },
  inputError: {
    ...CommonInputStyles.textInputError,
  },
  errorText: {
    ...CommonInputStyles.errorText,
  },
});

export default FormField;
