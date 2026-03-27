import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import Colors from '../../../../utils/Colors';

const EInvoiceConnectionStatus = ({onUnpairIntegration}) => {
  const [isLogExpanded, setIsLogExpanded] = useState(true);

  return (
    <View style={styles.formContainer}>
      {/* Account Connected Section */}
      <Text style={styles.sectionTitle}>Account Connected</Text>

      {/* Outer Container with Border */}
      <View style={styles.outerStatusContainer}>
        {/* Paired Badge in Separate Box */}
        <View style={styles.pairedContainer}>
          <View style={styles.pairedBadge}>
            <Text style={styles.pairedText}>Paired</Text>
          </View>
        </View>

        {/* Token and Last IRN Section (Light Grey Background with Border) */}
        <View style={styles.tokenSection}>
          <View style={{padding: 10}}>
            <View
              style={{
                backgroundColor: '#F6F9FC',
                borderRadius: 10,
                paddingVertical: 12,
              }}>
              <Text style={styles.statusText}>
                Last IRN: 24 Jul 2025 10:12AM
              </Text>
            </View>
          </View>
          <View style={styles.detailsSection}>
            <View style={styles.statusRow}>
              <Text style={styles.statusLabel}>Token valid</Text>
              <Text style={styles.statusValue}>1h 43 min</Text>
            </View>

            <View style={styles.statusRow}>
              <Text style={styles.statusLabel}>Daily IRN quota:</Text>
              <Text style={styles.statusValue}>872/1000</Text>
            </View>

            <View style={styles.statusRow}>
              <Text style={styles.statusLabel}>Requests per min:</Text>
              <Text style={styles.statusValue}>50</Text>
            </View>
          </View>
        </View>

        {/* Provider, Daily IRN Quota, Requests per min Section (White Background) */}

        {/* LOG Section (Light Grey Background with Border) - Inside the same container */}
        <View style={styles.logSection}>
          <View style={styles.logHeader}>
            <Text style={styles.logTitle}>LOG (last 24 h)</Text>
            <TouchableOpacity onPress={() => setIsLogExpanded(!isLogExpanded)}>
              <Icon
                name={isLogExpanded ? 'chevron-up' : 'chevron-down'}
                size={20}
                color="#667085"
              />
            </TouchableOpacity>
          </View>

          {isLogExpanded && (
            <View style={styles.logContent}>
              <View style={styles.logRow}>
                <Text style={styles.logTime}>14:42</Text>
                <Text style={styles.logText}>14 IRNs generated</Text>
              </View>
              <View style={styles.logRow}>
                <Text style={styles.logTime}>14:41</Text>
                <Text style={styles.logText}>1 IRN error 2150</Text>
              </View>
              <View style={styles.logRow}>
                <Text style={styles.logTime}>02:00</Text>
                <Text style={styles.logText}>Token Refresh</Text>
              </View>
            </View>
          )}
        </View>
      </View>

      {/* Action Buttons - Inside the same white section */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.unpairButton}
          onPress={onUnpairIntegration}>
          <Text style={styles.unpairButtonText}>Unpair Integration</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.syncButton}
          onPress={() => console.log('Sync missed IRNs')}>
          <Text style={styles.syncButtonText}>Sync missed IRNs</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  formContainer: {
    backgroundColor: Colors.white,
    marginHorizontal: 12,
    marginTop: 10,
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '400',
    color: '#111111',
    marginBottom: 4,
  },
  statusText: {
    fontSize: 14,
    color: '#4B5563',
    marginBottom: 4,
    textAlign: 'center',
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  statusLabel: {
    fontSize: 14,
    color: '#8F939E',
    fontWeight: '400',
  },
  statusValue: {
    fontSize: 14,
    color: '#111827',
    fontWeight: '600',
  },
  logRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  logTime: {
    fontSize: 14,
    color: '#667085',
    fontWeight: '600',
  },
  logText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
    marginTop: 4,
  },
  buttonContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  syncButton: {
    width: '100%',
    backgroundColor: '#F7F9FC',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  syncButtonText: {
    color: '#374151',
    fontSize: 16,
    fontWeight: '600',
  },
  unpairButton: {
    width: '100%',
    backgroundColor: '#EF4444',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 8,
  },
  unpairButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  pairedBadge: {
    backgroundColor: '#34C759',
    borderRadius: 14,
    paddingVertical: 6,
    paddingHorizontal: 12,
    alignSelf: 'center',
    marginBottom: 8,
    marginTop: 8,
  },
  pairedText: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: '600',
  },
  outerStatusContainer: {
    backgroundColor: '#F7F9FC',
    borderRadius: 12,
    marginTop: 8,
    borderWidth: 0.5,
    borderColor: Colors.border,
  },
  pairedContainer: {
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: Colors.border,
    borderRadius: 8,
    backgroundColor: Colors.white,
  },
  tokenSection: {
    borderRadius: 8,
    borderWidth: 0.5,
    borderColor: Colors.border,
    backgroundColor: Colors.white,
  },
  tokenText: {
    fontSize: 14,
    color: '#111827',
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 4,
  },
  detailsSection: {
    backgroundColor: Colors.white,
    borderRadius: 8,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 10,
  },
  logSection: {
    padding: 10,
    borderBottomEndRadius: 8,
  },
  logHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logTitle: {
    fontSize: 14,
    fontWeight: '400',
    color: '#111111',
  },
  logContent: {
    marginTop: 8,
    // No specific styles needed here, just a container for log rows
  },
});

export default EInvoiceConnectionStatus;
