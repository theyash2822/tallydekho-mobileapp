import {useState, useEffect} from 'react';
import {Keyboard, Platform} from 'react-native';

/**
 * Custom hook to track keyboard visibility state
 * @returns {boolean} isKeyboardVisible - true when keyboard is visible, false otherwise
 */
const useKeyboardVisibility = () => {
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  useEffect(() => {
    // Use keyboardWillShow/Hide on iOS to sync with animation start
    // Use keyboardDidShow/Hide on Android for immediate response
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const keyboardShowListener = Keyboard.addListener(
      showEvent,
      () => {
        setIsKeyboardVisible(true);
      },
    );
    const keyboardHideListener = Keyboard.addListener(
      hideEvent,
      () => {
        setIsKeyboardVisible(false);
      },
    );

    return () => {
      keyboardHideListener?.remove();
      keyboardShowListener?.remove();
    };
  }, []);

  return isKeyboardVisible;
};

export default useKeyboardVisibility;


