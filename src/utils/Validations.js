// Validation functions for form fields

/**
 * Validates a phone number
 * @param {string} phone - The phone number to validate
 * @returns {string} - Empty string if valid, error message if invalid
 */
export const validatePhoneNumber = (phone) => {
  if (!phone.trim()) {
    return ''; // Allow empty if optional
  }
  // Remove spaces, dashes, parentheses for validation
  const cleanedPhone = phone.replace(/[\s\-\(\)]/g, '');

  // Check if it contains only digits and optional + at start
  const phoneRegex = /^\+?\d{10,15}$/;

  if (!phoneRegex.test(cleanedPhone)) {
    return 'Please enter a valid phone number';
  }
  return '';
};

/**
 * Validates an email address
 * @param {string} emailValue - The email to validate
 * @returns {string} - Empty string if valid, error message if invalid
 */
export const validateEmail = (emailValue) => {
  if (!emailValue.trim()) {
    return ''; // Allow empty if optional
  }
  // Standard email regex pattern
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(emailValue)) {
    return 'Please enter a valid email';
  }
  return '';
};
