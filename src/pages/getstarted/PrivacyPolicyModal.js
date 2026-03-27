import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import {globalStyles, Icons} from '../../utils/Constants';
import Colors from '../../utils/Colors';

const PrivacyPolicyModal = ({visible, onClose}) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.headerRow}>
            <Text
              style={[
                globalStyles.textSemibold(18),
                {flex: 1, textAlign: 'center', marginBottom: 10},
              ]}>
              Privacy Policy
            </Text>
            <TouchableOpacity onPress={onClose}>
              {Icons.Close(24, Colors.black)}
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.content}
            showsVerticalScrollIndicator={false}>
            <Text style={[globalStyles.textRegular(12), styles.date]}>
              Effective Date, 23 January 2025
            </Text>
            <Text style={[globalStyles.textRegular(12), styles.text]}>
              At Tallydekho, your privacy is important to us. This Privacy
              Policy explains how we collect, use, and protect your information.
            </Text>

            <Text style={[globalStyles.textSemibold(12), styles.sectionTitle]}>
              1. Information We Collect
            </Text>
            <View style={styles.bulletContainer}>
              <Text style={styles.bullet}>{'\u2022'}</Text>
              <Text style={[globalStyles.textRegular(12), styles.bulletText]}>
                <Text style={[globalStyles.textSemibold(12), styles.bold]}>
                  Personal Information:
                </Text>{' '}
                Name, email address, phone number, and other details you provide
                during registration.
              </Text>
            </View>
            <View style={styles.bulletContainer}>
              <Text style={styles.bullet}>{'\u2022'}</Text>
              <Text style={[globalStyles.textRegular(12), styles.bulletText]}>
                <Text style={[globalStyles.textSemibold(12), styles.bold]}>
                  Usage Data:
                </Text>{' '}
                Information about how you use the app, including logs, device
                information, and IP addresses.
              </Text>
            </View>

            <Text style={[globalStyles.textSemibold(12), styles.sectionTitle]}>
              2. How We Use Your Information
            </Text>
            {[
              'To provide and improve our services.',
              'To communicate with you about updates, features, and promotional offers.',
              'To ensure the security of our app and prevent fraud.',
            ].map((item, index) => (
              <View style={styles.bulletContainer} key={index}>
                <Text style={styles.bullet}>{'\u2022'}</Text>
                <Text style={[globalStyles.textRegular(12), styles.bulletText]}>
                  {item}
                </Text>
              </View>
            ))}

            <Text style={[globalStyles.textSemibold(12), styles.sectionTitle]}>
              3. Sharing Your Information
            </Text>
            {[
              'We do not sell your information to third parties.',
              'We may share your data with trusted partners and service providers who assist us in operating the app.',
              'We may disclose your information to comply with legal obligations.',
            ].map((item, index) => (
              <View style={styles.bulletContainer} key={index}>
                <Text style={styles.bullet}>{'\u2022'}</Text>
                <Text style={[globalStyles.textRegular(12), styles.bulletText]}>
                  {item}
                </Text>
              </View>
            ))}

            <Text style={[globalStyles.textSemibold(12), styles.sectionTitle]}>
              4. Data Security
            </Text>
            {[
              'We use industry-standard measures to protect your information.',
              'However, no method of transmission over the internet is completely secure.',
            ].map((item, index) => (
              <View style={styles.bulletContainer} key={index}>
                <Text style={styles.bullet}>{'\u2022'}</Text>
                <Text style={[globalStyles.textRegular(12), styles.bulletText]}>
                  {item}
                </Text>
              </View>
            ))}

            <Text style={[globalStyles.textSemibold(12), styles.sectionTitle]}>
              5. User Rights
            </Text>
            {[
              'You have the right to access, update, or delete your personal information.',
              'You can opt out of promotional communications at any time.',
            ].map((item, index) => (
              <View style={styles.bulletContainer} key={index}>
                <Text style={styles.bullet}>{'\u2022'}</Text>
                <Text style={[globalStyles.textRegular(12), styles.bulletText]}>
                  {item}
                </Text>
              </View>
            ))}

            <Text style={[globalStyles.textSemibold(12), styles.sectionTitle]}>
              6. Cookies
            </Text>
            <View style={styles.bulletContainer}>
              <Text style={styles.bullet}>{'\u2022'}</Text>
              <Text style={[globalStyles.textRegular(12), styles.bulletText]}>
                We use cookies to enhance your experience on the app. You can
                manage your cookie preferences through your browser settings.
              </Text>
            </View>

            <Text style={[globalStyles.textSemibold(12), styles.sectionTitle]}>
              7. Third-Party Links
            </Text>
            <View style={styles.bulletContainer}>
              <Text style={styles.bullet}>{'\u2022'}</Text>
              <Text style={[globalStyles.textRegular(12), styles.bulletText]}>
                Our app may contain links to third-party websites. We are not
                responsible for their privacy practices.
              </Text>
            </View>

            <Text style={[globalStyles.textSemibold(12), styles.sectionTitle]}>
              8. Children's Privacy
            </Text>
            <View style={styles.bulletContainer}>
              <Text style={styles.bullet}>{'\u2022'}</Text>
              <Text style={[globalStyles.textRegular(12), styles.bulletText]}>
                Tallydekho is not intended for children under 13. We do not
                knowingly collect information from children.
              </Text>
            </View>

            <Text style={[globalStyles.textSemibold(12), styles.sectionTitle]}>
              9. Changes to this Privacy Policy
            </Text>
            <View style={styles.bulletContainer}>
              <Text style={styles.bullet}>{'\u2022'}</Text>
              <Text style={[globalStyles.textRegular(12), styles.bulletText]}>
                We may update this policy from time to time. We will notify you
                of significant changes through the app or via email.
              </Text>
            </View>

            <Text style={[globalStyles.textRegular(12), styles.contactText]}>
              If you have any questions about these Terms and Conditions or our
              Privacy Policy, please contact us at{' '}
              <Text style={styles.bold}>+19349342239</Text>.
            </Text>

            <TouchableOpacity style={styles.contactButton}>
              {Icons.Phone(24, '#18D98D')}
              <Text
                style={[
                  globalStyles.textRegular(12),
                  styles.contactButtonText,
                ]}>
                Contact Us ( +19349342239 )
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: Colors.white,
    padding: 12,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  content: {padding: 4},
  date: {fontStyle: 'italic', marginBottom: 12, color: Colors.secondaryText},
  sectionTitle: {marginTop: 12, marginBottom: 4, color: Colors.primaryTitle},
  bulletContainer: {flexDirection: 'row', alignItems: 'flex-start'},
  bullet: {fontSize: 12, color: Colors.secondaryText, marginRight: 5},
  bulletText: {flex: 1, color: Colors.secondaryText, lineHeight: 20},
  text: {
    fontSize: 12,
    color: Colors.secondaryText,
    marginBottom: 10,
    lineHeight: 20,
  },
  bold: {color: Colors.primaryTitle, fontWeight: 'bold'},
  contactText: {color: Colors.secondaryText, marginTop: 20, lineHeight: 20},
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F3F7',
    padding: 12,
    borderRadius: 12,
    justifyContent: 'center',
    marginVertical: 20,
  },
  contactButtonText: {color: Colors.secondaryText, fontSize: 12, marginLeft: 8},
});

export default PrivacyPolicyModal;

