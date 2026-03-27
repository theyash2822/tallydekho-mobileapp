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

const TermsModal = ({visible, onClose}) => {
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
              Terms & Conditions
            </Text>
            <TouchableOpacity onPress={onClose}>
              {Icons.Close(24, Colors.black)}
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.modalBody}
            showsVerticalScrollIndicator={false}>
            <ScrollView contentContainerStyle={styles.content}>
              <Text style={[globalStyles.textRegular(12), styles.date]}>
                Effective Date: 23 January 2025
              </Text>

              <Text style={[globalStyles.textRegular(12), styles.paragraph]}>
                Welcome to Tallydekho! By using our app, you agree to the
                following terms and conditions. Please read them carefully.
              </Text>

              <Text
                style={[globalStyles.textSemibold(12), styles.sectionTitle]}>
                1. Acceptance of Terms by accessing or using Tallydekho
              </Text>
              <Text style={[globalStyles.textRegular(12), styles.paragraph]}>
                You agree to be bound by these Terms and Conditions and our
                Privacy Policy. If you do not agree , please do not use our app.
              </Text>

              <Text
                style={[globalStyles.textSemibold(12), styles.sectionTitle]}>
                2. Use of the App
              </Text>
              <View style={styles.bulletContainer}>
                <Text style={styles.bullet}>•</Text>
                <Text style={[globalStyles.textRegular(12), styles.bulletText]}>
                  You must be at least 18 years old.
                </Text>
              </View>
              <View style={styles.bulletContainer}>
                <Text style={styles.bullet}>{'\u2022'}</Text>
                <Text style={[globalStyles.textRegular(12), styles.bulletText]}>
                  You agree to use the app for lawful purposes only.
                </Text>
              </View>
              <View style={styles.bulletContainer}>
                <Text style={styles.bullet}>{'\u2022'}</Text>
                <Text style={[globalStyles.textRegular(12), styles.bulletText]}>
                  You are responsible for maintaining the confidentiality of
                  your account credentials.
                </Text>
              </View>

              <Text
                style={[globalStyles.textSemibold(12), styles.sectionTitle]}>
                3. User Accounts
              </Text>
              <View style={styles.bulletContainer}>
                <Text style={styles.bullet}>{'\u2022'}</Text>
                <Text style={[globalStyles.textRegular(12), styles.bulletText]}>
                  You must provide accurate and complete information during
                  registration.
                </Text>
              </View>
              <View style={styles.bulletContainer}>
                <Text style={styles.bullet}>{'\u2022'}</Text>
                <Text style={[globalStyles.textRegular(12), styles.bulletText]}>
                  You are solely responsible for activities under your account.
                </Text>
              </View>
              <View style={styles.bulletContainer}>
                <Text style={styles.bullet}>{'\u2022'}</Text>
                <Text style={[globalStyles.textRegular(12), styles.bulletText]}>
                  Notify us immediately of any unauthorized use of your account.
                </Text>
              </View>

              <Text
                style={[globalStyles.textSemibold(12), styles.sectionTitle]}>
                4. Intellectual Property
              </Text>
              <View style={styles.bulletContainer}>
                <Text style={styles.bullet}>{'\u2022'}</Text>
                <Text style={[globalStyles.textRegular(12), styles.bulletText]}>
                  All content, trademarks, and intellectual property on
                  Tallydekho are owned by us or our licensors.
                </Text>
              </View>
              <View style={styles.bulletContainer}>
                <Text style={styles.bullet}>{'\u2022'}</Text>
                <Text style={[globalStyles.textRegular(12), styles.bulletText]}>
                  You may not reproduce,distribute or modify any part of the app
                  without our prior written consent.
                </Text>
              </View>

              <Text
                style={[globalStyles.textSemibold(12), styles.sectionTitle]}>
                5. Limitation of Liability
              </Text>
              <View style={styles.bulletContainer}>
                <Text style={styles.bullet}>{'\u2022'}</Text>
                <Text style={[globalStyles.textRegular(12), styles.bulletText]}>
                  Tallydekho is provided "as is" without warranties of any kind.
                </Text>
              </View>
              <View style={styles.bulletContainer}>
                <Text style={styles.bullet}>{'\u2022'}</Text>
                <Text style={[globalStyles.textRegular(12), styles.bulletText]}>
                  We are not liable for any damages arising from your use of the
                  app.
                </Text>
              </View>

              <Text
                style={[globalStyles.textSemibold(12), styles.sectionTitle]}>
                6. Third-Party Services
              </Text>
              <View style={styles.bulletContainer}>
                <Text style={styles.bullet}>{'\u2022'}</Text>
                <Text style={[globalStyles.textRegular(12), styles.bulletText]}>
                  The app may integrate with third-party services. We are not
                  responsible for the actions or content of these services.
                </Text>
              </View>

              <Text
                style={[globalStyles.textSemibold(12), styles.sectionTitle]}>
                7. Termination
              </Text>
              <View style={styles.bulletContainer}>
                <Text style={styles.bullet}>{'\u2022'}</Text>
                <Text style={[globalStyles.textRegular(12), styles.bulletText]}>
                  We may terminate or suspend your access to the app at our sole
                  discretion without any prior notice.
                </Text>
              </View>

              <Text
                style={[globalStyles.textSemibold(12), styles.sectionTitle]}>
                8. Governing Law
              </Text>
              <View style={styles.bulletContainer}>
                <Text style={styles.bullet}>{'\u2022'}</Text>
                <Text style={[globalStyles.textRegular(12), styles.bulletText]}>
                  These terms are governed by the laws of [Insert Jurisdiction].
                </Text>
              </View>

              <Text
                style={[globalStyles.textSemibold(12), styles.sectionTitle]}>
                9. Changes to Terms
              </Text>
              <View style={styles.bulletContainer}>
                <Text style={styles.bullet}>{'\u2022'}</Text>
                <Text style={[globalStyles.textRegular(12), styles.bulletText]}>
                  We reserve the right to modify these terms at any time.
                  Continue use of the app constitutes acceptance of the revised
                  terms.
                </Text>
              </View>
            </ScrollView>
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
  modalBody: {marginBottom: 20},
  content: {padding: 4},
  date: {fontStyle: 'italic', marginBottom: 12, color: Colors.secondaryText},
  sectionTitle: {marginTop: 12, marginBottom: 4, color: Colors.primaryTitle},
  bulletContainer: {flexDirection: 'row', alignItems: 'flex-start'},
  bullet: {fontSize: 12, color: Colors.secondaryText, marginRight: 5},
  bulletText: {flex: 1, color: Colors.secondaryText, lineHeight: 20},
  paragraph: {color: Colors.secondaryText, lineHeight: 20},
});

export default TermsModal;

