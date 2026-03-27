import {useRef, useState} from 'react';
import {Keyboard, Platform} from 'react-native';

/**
 * Custom hook for managing input field navigation with smart scrolling
 * @param {number} fieldCount - Number of input fields
 * @param {object} scrollViewRef - Ref to the ScrollView component
 * @returns {object} Navigation utilities
 */
export const useInputNavigation = (fieldCount, scrollViewRef) => {
  const inputRefs = useRef([]);
  const containerRefs = useRef([]);
  const [containerYs, setContainerYs] = useState({});

  /**
   * Get ref for an input field by index
   * @param {number} index - Index of the field
   * @returns {object} Ref object
   */
  const getInputRef = index => {
    if (!inputRefs.current[index]) {
      inputRefs.current[index] = {current: null};
    }
    return inputRefs.current[index];
  };

  /**
   * Get ref for a container by index
   * @param {number} index - Index of the container
   * @returns {object} Ref object
   */
  const getContainerRef = index => {
    if (!containerRefs.current[index]) {
      containerRefs.current[index] = {current: null};
    }
    return containerRefs.current[index];
  };

  /**
   * Handle smart scrolling when input is focused
   * @param {number} index - Index of the focused field
   */
  const handleInputFocus = index => {
    const SCROLL_THRESHOLD = 200;
    const containerY = containerYs[index];
    if (scrollViewRef?.current && containerY && containerY > SCROLL_THRESHOLD) {
      setTimeout(() => {
        scrollViewRef.current?.scrollTo({
          y: containerY - 100,
          animated: true,
        });
      }, 150);
    }
  };

  /**
   * Handle container layout to track Y position
   * @param {number} index - Index of the container
   * @param {object} event - Layout event
   */
  const handleContainerLayout = (index, event) => {
    const {y} = event.nativeEvent.layout;
    setContainerYs(prev => ({...prev, [index]: y}));
  };

  /**
   * Clear all input refs and blur focused inputs
   */
  const clearInputRefs = () => {
    inputRefs.current.forEach(ref => {
      if (ref?.current) {
        ref.current.blur();
      }
    });
    inputRefs.current = [];
    containerRefs.current = [];
    setContainerYs({});
  };

  /**
   * Get keyboard type with iOS fix for numeric inputs
   * @param {string} keyboardType - Original keyboard type
   * @returns {string} Effective keyboard type
   */
  const getKeyboardType = keyboardType => {
    return Platform.OS === 'ios' && keyboardType === 'numeric'
      ? 'numbers-and-punctuation'
      : keyboardType;
  };

  /**
   * Handle submit editing - move to next field or dismiss keyboard
   * @param {number} currentIndex - Current field index
   * @param {number} nextIndex - Next field index (null for last field)
   * @param {string} returnKeyType - Return key type ('next' or 'done')
   */
  const handleSubmitEditing = (currentIndex, nextIndex, returnKeyType = 'next') => {
    if (returnKeyType === 'done') {
      Keyboard.dismiss();
    } else if (nextIndex !== null && nextIndex !== undefined) {
      const nextRef = getInputRef(nextIndex);
      if (nextRef?.current) {
        // Use requestAnimationFrame for smoother transition without keyboard flicker
        requestAnimationFrame(() => {
          nextRef.current?.focus();
        });
      }
    }
  };

  return {
    getInputRef,
    getContainerRef,
    handleInputFocus,
    handleContainerLayout,
    clearInputRefs,
    getKeyboardType,
    handleSubmitEditing,
  };
};

