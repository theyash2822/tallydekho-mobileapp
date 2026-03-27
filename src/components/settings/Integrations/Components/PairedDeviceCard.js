import React, {useEffect, useMemo, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Pressable,
  Image,
} from 'react-native';
import Colors from '../../../../utils/Colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiService from '../../../../services/api/apiService';
import {Logger} from '../../../../services/utils/logger';
import {formatDate} from '../utils/pairingHelpers';

const PairedDeviceCard = ({lastSync, companies = [], onUnpair}) => {
  const [syncedAt, setSyncedAt] = useState(lastSync ?? null);
  const [loadingSync, setLoadingSync] = useState(false);
  const [isCodeRevealed, setIsCodeRevealed] = useState(false);

  useEffect(() => {
    if (lastSync) {
      setSyncedAt(lastSync);
      setLoadingSync(false);
    }
  }, [lastSync]);

  useEffect(() => {
    let isMounted = true;

    const hydrateFromStorage = async () => {
      try {
        const stored = await AsyncStorage.getItem('pairedDevice');
        if (!stored) {
          return null;
        }
        const parsed = JSON.parse(stored);
        return parsed?.lastSync || null;
      } catch (error) {
        Logger.warn('PairedDeviceCard: Failed to read stored lastSync', error);
        return null;
      }
    };

    const fetchLatestSync = async () => {
      try {
        const response = await apiService.fetchPairingDetails();
        const syncTime = response?.data?.device?.lastSync ?? null;

        if (isMounted && syncTime) {
          setSyncedAt(syncTime);
          await AsyncStorage.mergeItem(
            'pairedDevice',
            JSON.stringify({lastSync: syncTime}),
          ).catch(err => {
            Logger.warn('PairedDeviceCard: Failed to cache last sync', err);
          });
        }
      } catch (error) {
        Logger.error('PairedDeviceCard: Failed to fetch last sync', error);
      } finally {
        if (isMounted) {
          setLoadingSync(false);
        }
      }
    };

    const loadSyncInfo = async () => {
      setLoadingSync(true);
      const cached = await hydrateFromStorage();
      if (isMounted && cached) {
        setSyncedAt(cached);
      }
      await fetchLatestSync();
    };

    loadSyncInfo();

    return () => {
      isMounted = false;
    };
  }, []);

  const lastSyncLabel = useMemo(() => {
    if (loadingSync) {
      return 'Updating...';
    }
    if (!syncedAt) {
      return 'Not synced yet';
    }
    return formatDate(syncedAt);
  }, [loadingSync, syncedAt]);

  return (
    <View style={styles.card}>
      <Text style={styles.instructionTitle}>Follow the steps mention below</Text>

      <View style={styles.stepCard}>
        <Text style={styles.stepLabel}>Step 1</Text>
        <View style={styles.stepContent}>
          <Image
            source={require('../../../../assets/Desktop.png')}
            style={styles.desktopImage}
            resizeMode="contain"
          />
          <Text style={styles.stepText}>
            Download <Text style={styles.boldStepText}>TallyDekho</Text> Agent from https://www.tallydekho.com/download
          </Text>
        </View>
      </View>

      <View style={styles.stepCard}>
        <Text style={styles.stepLabel}>Step 2</Text>
        <View style={styles.pairingCard}>
          <Text style={styles.pairingTitle}>Pairing</Text>
          <View style={styles.pairingDivider} />
          <View style={styles.codeDisplayContainer}>
            <View style={styles.codeDisplay}>
              <View style={styles.hiddenCodeContainer}>
                <View style={styles.codeDot} />
                <View style={styles.codeDot} />
                <View style={styles.codeDot} />
                <View style={styles.codeDot} />
              </View>
            </View>
            <TouchableOpacity
              style={styles.revealButton}
              disabled={true}>
              <Text style={styles.revealButtonText}>
                Reveal code
              </Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.pairingInstruction}>
            Enter this code in the mobile app → Settings → Account Pairing
          </Text>
        </View>
      </View>

      <Text style={styles.title}>Paired Device</Text>

      {/* <Pressable style={styles.pairButton}>
        <Text style={styles.pairText}>Paired</Text>
      </Pressable> */}

      <View style={styles.infoContainer}>
        <Text style={styles.lastSyncText}>
          Last sync: <Text style={styles.bold}>{lastSyncLabel}</Text>
        </Text>

        <Text style={styles.sectionTitle}>Synced Companies</Text>
        {companies.map((company, index) => (
          <Text key={index} style={styles.companyText}>
            • {company}
          </Text>
        ))}
      </View>

      <TouchableOpacity style={styles.unpairButton} onPress={onUnpair}>
        <Text style={styles.unpairText}>Unpair</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 12,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  instructionTitle: {
    fontSize: 14,
    fontWeight: '400',
    color: '#111827',
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  stepCard: {
    width: '100%',
    backgroundColor: Colors.white,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  stepLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  stepContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  desktopImage: {
    width: 84,
    height: 84,
    marginBottom: 2,
  },
  stepText: {
    fontSize: 14,
    fontWeight: '400',
    color: '#108f6f',
    textAlign: 'center',
    marginTop: 12,
    lineHeight: 20,
  },
  boldStepText: {
    fontWeight: '600',
  },
  pairingCard: {
    width: '100%',
  },
  pairingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#108f6f',
    marginBottom: 8,
  },
  pairingDivider: {
    height: 1,
    backgroundColor: Colors.border,
    marginBottom: 16,
  },
  codeDisplayContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 12,
    marginBottom: 12,
  },
  codeDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  hiddenCodeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  codeDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#111827',
  },
  revealedCode: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    letterSpacing: 4,
  },
  revealButton: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
  },
  revealButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#108f6f',
  },
  pairingInstruction: {
    fontSize: 14,
    fontWeight: '400',
    color: '#108f6f',
    lineHeight: 20,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 8,
    marginBottom: 12,
  },

  infoContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    marginTop: 10,
  },
  lastSyncText: {
    color: '#888',
    marginBottom: 8,
  },
  bold: {
    fontWeight: 'bold',
    color: '#000',
  },
  sectionTitle: {
    fontWeight: '600',
    marginBottom: 4,
    color: '#000',
  },
  companyText: {
    marginLeft: 8,
    color: '#555',
    marginBottom: 2,
  },
  unpairButton: {
    backgroundColor: '#07624C',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  unpairText: {
    fontWeight: '600',
    color: '#fff',
    fontSize: 16,
  },
  pairButton: {
    backgroundColor: '#07624C',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  pairText: {
    fontWeight: '600',
    color: '#fff',
    fontSize: 16,
  },
});

export default PairedDeviceCard;
