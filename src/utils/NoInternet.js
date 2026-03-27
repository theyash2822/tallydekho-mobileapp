// NoInternetOverlay.js
import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import Colors from './Colors';

const NoInternetOverlay = ({onRetry}) => {
  return (
    <View style={styles.overlay}>
      <View style={styles.card}>
        {/* Icon Placeholder */}
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>📡</Text>
        </View>

        <Text style={styles.title}>You're Offline</Text>
        <Text style={styles.subtitle}>
          It looks like your internet connection is unavailable.
          Please check your network and try again.
        </Text>

        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.button}
          onPress={onRetry}>
          <Text style={styles.buttonText}>Try Again</Text>
        </TouchableOpacity>

        <Text style={styles.footerText}>
          We'll reconnect automatically once you're online.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.65)', // dark bluish overlay
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },

  card: {
    backgroundColor: '#FFFFFF',
    width: '85%',
    borderRadius: 16,
    paddingVertical: 28,
    paddingHorizontal: 22,
    alignItems: 'center',

    // Shadow (iOS)
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 10},
    shadowOpacity: 0.15,
    shadowRadius: 20,

    // Elevation (Android)
    elevation: 10,
  },

  iconContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#EAF6F1',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },

  icon: {
    fontSize: 32,
  },

  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 6,
    textAlign: 'center',
  },

  subtitle: {
    fontSize: 15,
    color: '#475569',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 18,
  },

  button: {
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 12,
    minWidth: 140,
    alignItems: 'center',
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },

  footerText: {
    marginTop: 14,
    fontSize: 12,
    color: '#94A3B8',
    textAlign: 'center',
  },
});

export default NoInternetOverlay;
