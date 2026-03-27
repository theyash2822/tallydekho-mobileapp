import {Linking, Alert} from 'react-native';

/**
 * Utility functions for phone calls and WhatsApp messaging
 */

/**
 * Makes a phone call to the specified number
 * @param {string} phoneNumber - The phone number to call
 */
export const makePhoneCall = phoneNumber => {
  if (phoneNumber) {
  const cleanPhone = phoneNumber.replace(/[^\d+]/g, '');
  const phoneUrl = `tel:${cleanPhone}`;
    Linking.canOpenURL(phoneUrl)
      .then(supported => {
        if (supported) {
          Linking.openURL(phoneUrl);
        } else {
          Alert.alert('Error', 'Phone calls are not supported on this device');
        }
      })
      .catch(err => {
        Alert.alert('Error', 'Unable to make phone call');
      });
  } else {
    Alert.alert(
      'No Phone Number',
      'Phone number not available for this contact',
    );
  }
};

/**
 * Opens WhatsApp chat with the specified phone number
 * @param {string} phoneNumber - The phone number to message
 */
export const openWhatsAppChat = phoneNumber => {
  if (phoneNumber) {
    // Remove spaces and special characters from phone number
    const cleanPhoneNumber = phoneNumber.replace(/[\s\-\(\)]/g, '');

    // Use the most reliable WhatsApp URL scheme
    const whatsappUrl = `https://wa.me/${cleanPhoneNumber}`;

    Linking.openURL(whatsappUrl)
      .then(() => {
        // Success - WhatsApp opened
      })
      .catch(error => {
        // If web URL fails, try the native app scheme
        const nativeWhatsappUrl = `whatsapp://send?phone=${cleanPhoneNumber}`;

        Linking.openURL(nativeWhatsappUrl)
          .then(() => {
            // Success - native WhatsApp opened
          })
          .catch(nativeError => {
            // Both methods failed
            Alert.alert(
              'WhatsApp Not Available',
              'WhatsApp is not installed or cannot be opened. Please install WhatsApp from the Play Store.',
              [
                {
                  text: 'OK',
                  style: 'default',
                },
              ],
            );
          });
      });
  } else {
    Alert.alert(
      'No Phone Number',
      'Phone number not available for this contact',
    );
  }
};

/**
 * Opens WhatsApp chat with a custom message
 * @param {string} phoneNumber - The phone number to message
 * @param {string} message - The message to send
 */
export const openWhatsAppWithMessage = (phoneNumber, message = '') => {
  if (phoneNumber) {
    // Remove spaces and special characters from phone number
    const cleanPhoneNumber = phoneNumber.replace(/[\s\-\(\)]/g, '');
    const encodedMessage = encodeURIComponent(message);

    // Use the most reliable WhatsApp URL scheme with message
    const whatsappUrl = `https://wa.me/${cleanPhoneNumber}?text=${encodedMessage}`;

    Linking.openURL(whatsappUrl)
      .then(() => {
        // Success - WhatsApp opened with message
      })
      .catch(error => {
        // If web URL fails, try the native app scheme
        const nativeWhatsappUrl = `whatsapp://send?phone=${cleanPhoneNumber}&text=${encodedMessage}`;

        Linking.openURL(nativeWhatsappUrl)
          .then(() => {
            // Success - native WhatsApp opened with message
          })
          .catch(nativeError => {
            // Both methods failed
            Alert.alert(
              'WhatsApp Not Available',
              'WhatsApp is not installed or cannot be opened. Please install WhatsApp from the Play Store.',
              [
                {
                  text: 'OK',
                  style: 'default',
                },
              ],
            );
          });
      });
  } else {
    Alert.alert(
      'No Phone Number',
      'Phone number not available for this contact',
    );
  }
};

/**
 * Opens email client with pre-filled recipient
 * @param {string} email - The email address
 * @param {string} subject - The email subject
 * @param {string} body - The email body
 */
export const openEmailClient = (email, subject = '', body = '') => {
  if (email) {
    const encodedSubject = encodeURIComponent(subject);
    const encodedBody = encodeURIComponent(body);
    const emailUrl = `mailto:${email}?subject=${encodedSubject}&body=${encodedBody}`;

    Linking.openURL(emailUrl)
      .then(() => {
        // Success - Email client opened
      })
      .catch(error => {
        Alert.alert('Error', 'Unable to open email client');
      });
  } else {
    Alert.alert('No Email', 'Email address not available for this contact');
  }
};

/**
 * Opens SMS app with pre-filled message
 * @param {string} phoneNumber - The phone number to message
 * @param {string} message - The message to send
 */
export const openSMS = (phoneNumber, message = '') => {
  if (phoneNumber) {
    const encodedMessage = encodeURIComponent(message);
    const smsUrl = `sms:${phoneNumber}?body=${encodedMessage}`;

    Linking.openURL(smsUrl)
      .then(() => {
        // Success - SMS app opened
      })
      .catch(error => {
        Alert.alert('Error', 'Unable to open SMS app');
      });
  } else {
    Alert.alert(
      'No Phone Number',
      'Phone number not available for this contact',
    );
  }
};
