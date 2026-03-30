/**
 * Pairing Event Handlers
 * Handles user interactions for pairing flow
 */

/**
 * Handle code input change
 * @param {string} text - Input text
 * @param {number} index - Input index
 * @param {Array} code - Current code array
 * @param {Function} setCode - Function to update code
 * @param {Array} inputRefs - Refs for input fields
 */
export const handleCodeChange = (text, index, code, setCode, inputRefs) => {
  // Only allow single digit
  if (text.length > 1) {
    // If user pastes multiple digits, take only the first one
    text = text.charAt(0);
  }

  const newCode = [...code];
  const previousValue = newCode[index];
  newCode[index] = text;
  setCode(newCode);

  // Move to next input if text is entered
  if (text && index < 3) {
    setTimeout(() => {
      inputRefs.current[index + 1]?.focus();
    }, 0);
  }
  // Move to previous input if text is cleared (backspace pressed)
  else if (!text && previousValue && index > 0) {
    setTimeout(() => {
      inputRefs.current[index - 1]?.focus();
    }, 0);
  }
};

/**
 * Handle key press in code input
 * @param {Object} e - Event object
 * @param {number} index - Input index
 * @param {Array} code - Current code array
 * @param {Function} setCode - Function to update code
 * @param {Array} inputRefs - Refs for input fields
 */
export const handleKeyPress = (e, index, code, setCode, inputRefs) => {
  // Handle backspace - if current field is empty, clear previous field and move to it
  if (e.nativeEvent.key === 'Backspace' && !code[index] && index > 0) {
    // Clear the previous field and move focus to it
    const newCode = [...code];
    newCode[index - 1] = '';
    setCode(newCode);
    setTimeout(() => {
      inputRefs.current[index - 1]?.focus();
    }, 0);
  }
};

/**
 * Handle cancel pairing
 * @param {Function} setIsPairing - Function to update pairing state
 * @param {Function} setCode - Function to clear code
 */
export const handleCancelPairing = (setIsPairing, setCode) => {
  setIsPairing(false);
  setCode(['', '', '', '', '', '']);
};

