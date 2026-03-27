// If photo from gallery is opened

import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  PermissionsAndroid,
  Platform,
  Alert,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Image,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {Camera , CameraType} from 'react-native-camera-kit';
import {launchImageLibrary} from 'react-native-image-picker';

const ScannerScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {returnScreen, onScanComplete} = route.params || {};
  const [code, setCode] = useState(null);
  const [hasPermission, setHasPermission] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [flashOn, setFlashOn] = useState(false);
  const [scanRequested, setScanRequested] = useState(false);
  const [imageUri, setImageUri] = useState(null);
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    const requestCameraPermission = async () => {
      if (Platform.OS === 'android') {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.CAMERA,
            {
              title: 'Camera Permission',
              message: 'This app needs camera access to scan QR codes.',
              buttonNeutral: 'Ask Me Later',
              buttonNegative: 'Cancel',
              buttonPositive: 'OK',
            },
          );
          setHasPermission(granted === PermissionsAndroid.RESULTS.GRANTED);
        } catch (err) {
          console.warn(err);
          Alert.alert(
            'Permission Error',
            'Failed to request camera permission.',
          );
        }
      } else {
        setHasPermission(true);
      }
    };

    requestCameraPermission();
  }, []);

  const handleReadCode = event => {
    if (scanRequested && !scanned) {
      const scannedCode = event.nativeEvent.codeStringValue || 'No data found';
      setScanned(true);
      setCode(scannedCode);
      setScanRequested(false);
      
      // If there's a callback, call it and go back
      if (onScanComplete) {
        onScanComplete(scannedCode);
        navigation.goBack();
      } else if (returnScreen) {
        // Navigate back with the scanned code
        navigation.navigate(returnScreen, {scannedBarcode: scannedCode});
      }
    }
  };

  const handleGalleryScan = async () => {
    try {
      const result = await launchImageLibrary({mediaType: 'photo'});
      if (result?.assets?.length) {
        const uri = result.assets[0].uri;
        setImageUri(uri);
        setIsScanning(true);

        // Add a delay before scanning
        setTimeout(async () => {
          try {
            // Scan the image after the delay
            const scannedResult = await Camera.readBarcodeFromImage(uri);
            if (scannedResult) {
              setScanned(true);
              setCode(scannedResult);
              setIsScanning(false);
              
              // If there's a callback, call it and go back
              if (onScanComplete) {
                onScanComplete(scannedResult);
                navigation.goBack();
              } else if (returnScreen) {
                // Navigate back with the scanned code
                navigation.navigate(returnScreen, {scannedBarcode: scannedResult});
              }
            } else {
              // Delayed response when no QR code is found
              Alert.alert(
                'No QR code found',
                'No QR code detected in the selected image.',
              );
              setImageUri(null);
              setIsScanning(false);
            }
          } catch (err) {
            console.warn(err);
            Alert.alert('Error', 'Failed to scan from image.');
            setImageUri(null);
            setIsScanning(false);
          }
        }, 2000);
      }
    } catch (err) {
      console.warn(err);
      Alert.alert('Error', 'Failed to open image picker.');
    }
  };

  const toggleFlash = () => {
    if (!imageUri) {
      // Only allow flash toggle when using camera
      setFlashOn(prevState => !prevState);
    }
  };

  return (
    <View style={styles.container}>
      {!hasPermission ? (
        <Text style={styles.permissionText}>
          Requesting camera permission...
        </Text>
      ) : (
        <>
          {!scanned ? (
            <>
              {/* Camera/Image Preview Section - Reduced Height */}
              <View style={styles.scannerSection}>
                {imageUri ? (
                  <View style={styles.cameraWrapper}>
                    <Image
                      source={{uri: imageUri}}
                      style={styles.previewImage}
                      resizeMode="contain"
                    />
                    {isScanning && (
                      <View style={styles.scanningOverlay}>
                        <Text style={styles.scanningText}>Scanning...</Text>
                      </View>
                    )}
                  </View>
                ) : (
                  <Camera
                    style={styles.camera}
                    showFrame={false}
                    scanBarcode={true}
                    onReadCode={handleReadCode}
                    flashMode={flashOn ? 'on' : 'off'}
                    torchMode={flashOn ? 'on' : 'off'}
                    cameraType={CameraType.Back} // front/back(default)
                  />
                )}

                {/* Scanning overlay when scanning from gallery */}
                {isScanning && (
                  <View style={styles.scanningOverlay}>
                    <Text style={styles.scanningText}>Scanning...</Text>
                  </View>
                )}

                {/* Custom scanning frame */}
                <View style={styles.customFrame} pointerEvents="none">
                  <View style={styles.frameCorner} />
                  <View style={[styles.frameCorner, styles.topRight]} />
                  <View style={[styles.frameCorner, styles.bottomLeft]} />
                  <View style={[styles.frameCorner, styles.bottomRight]} />
                </View>
              </View>

              {/* Control Buttons */}
              <View style={styles.controlsSection}>
                <View style={styles.buttonRow}>
                  <TouchableOpacity
                    style={[
                      styles.button,
                      flashOn && styles.buttonActive,
                      imageUri && styles.buttonDisabled,
                    ]}
                    onPress={toggleFlash}
                    disabled={!!imageUri}>
                    <Text
                      style={[
                        styles.buttonText,
                        flashOn && styles.buttonTextActive,
                        imageUri && styles.buttonTextDisabled,
                      ]}>
                      {flashOn ? '🔦 ON' : '🔦 OFF'}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.button,
                      isScanning && styles.galleryScanningButton,
                    ]}
                    onPress={handleGalleryScan}>
                    <Text style={styles.buttonText}>📷 Gallery</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.button,
                      styles.scanButton,
                      scanRequested && styles.cameraScanningButton,
                    ]}
                    onPress={() => setScanRequested(true)}>
                    <Text style={styles.buttonText}>🔍 Scan</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Bottom Content Area */}
              <View style={styles.bottomSection}>
                <Text style={styles.instructionText}>
                  Position the QR code within the frame to scan
                </Text>
                <Text style={styles.hintText}>
                  Tap "Scan" when ready or choose from gallery
                </Text>
              </View>
            </>
          ) : (
            <View style={styles.resultContainer}>
              <Text style={styles.resultLabel}>Scanned QR Code:</Text>
              <TouchableOpacity
                onPress={() => {
                  if (code && code.startsWith('http')) {
                    Linking.openURL(code).catch(() =>
                      Alert.alert('Error', 'Failed to open link'),
                    );
                  } else {
                    Alert.alert(
                      'Invalid Link',
                      'Scanned data is not a valid URL.',
                    );
                  }
                }}>
                <Text style={styles.codeText}>{code}</Text>
              </TouchableOpacity>
              {returnScreen || onScanComplete ? (
                <TouchableOpacity
                  style={[styles.button, styles.useCodeButton]}
                  onPress={() => {
                    if (onScanComplete) {
                      onScanComplete(code);
                      navigation.goBack();
                    } else if (returnScreen) {
                      navigation.navigate(returnScreen, {scannedBarcode: code});
                    }
                  }}>
                  <Text style={styles.buttonText}>✓ Use This Code</Text>
                </TouchableOpacity>
              ) : null}
              <TouchableOpacity
                style={[styles.button, styles.scanAgainButton]}
                onPress={() => {
                  setScanned(false);
                  setCode(null);
                  setImageUri(null);
                  setScanRequested(false);
                  setIsScanning(false);
                  setFlashOn(false);
                }}>
                <Text style={styles.buttonText}>🔄 Scan Again</Text>
              </TouchableOpacity>
            </View>
          )}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  permissionText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
    color: '#fff',
  },

  // Scanner section with reduced height
  scannerSection: {
    height: '60%', // Reduced from flex: 1
    position: 'relative',
  },
  camera: {
    flex: 1,
  },
  cameraWrapper: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  previewImage: {
    width: '90%',
    height: '90%',
  },
  scanningOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanningText: {
    color: '#00ff88',
    fontSize: 18,
    fontWeight: 'bold',
  },

  // Custom frame with corner indicators
  customFrame: {
    position: 'absolute',
    top: '25%',
    left: '20%',
    height: 200,
    width: 200,
    zIndex: 1,
  },
  frameCorner: {
    position: 'absolute',
    width: 25,
    height: 25,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderColor: '#00ff88',
    top: 0,
    left: 0,
  },
  topRight: {
    top: 0,
    right: 0,
    left: 'auto',
    borderTopWidth: 3,
    borderRightWidth: 3,
    borderLeftWidth: 0,
  },
  bottomLeft: {
    bottom: 0,
    top: 'auto',
    borderBottomWidth: 3,
    borderLeftWidth: 3,
    borderTopWidth: 0,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    top: 'auto',
    left: 'auto',
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderTopWidth: 0,
    borderLeftWidth: 0,
  },

  // Controls section
  controlsSection: {
    height: '20%',
    justifyContent: 'center',
    backgroundColor: '#2a2a2a',
    paddingHorizontal: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#3a3a3a',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#555',
    minWidth: 80,
    alignItems: 'center',
  },
  buttonActive: {
    backgroundColor: '#ffa500',
    borderColor: '#ff8c00',
  },
  scanButton: {
    backgroundColor: '#00ff88',
    borderColor: '#00cc6a',
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  buttonTextActive: {
    color: '#000',
  },
  buttonDisabled: {
    backgroundColor: '#555',
    borderColor: '#333',
    opacity: 0.6,
  },
  buttonTextDisabled: {
    color: '#999',
  },
  galleryScanningButton: {
    backgroundColor: '#ff6b35',
    borderColor: '#e55a2b',
  },
  cameraScanningButton: {
    backgroundColor: '#ffd700',
    borderColor: '#e6c200',
  },

  // Bottom content section
  bottomSection: {
    height: '20%',
    backgroundColor: '#1a1a1a',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  instructionText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 8,
    fontWeight: '500',
  },
  hintText: {
    color: '#aaa',
    fontSize: 14,
    textAlign: 'center',
  },

  // Result screen styles
  resultContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#1a1a1a',
  },
  resultLabel: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#fff',
  },
  codeText: {
    fontSize: 18,
    color: '#00ff88',
    textAlign: 'center',
    textDecorationLine: 'underline',
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  useCodeButton: {
    backgroundColor: '#07624C',
    borderColor: '#065a47',
    paddingVertical: 15,
    paddingHorizontal: 30,
    marginBottom: 10,
  },
  scanAgainButton: {
    backgroundColor: '#00ff88',
    borderColor: '#00cc6a',
    paddingVertical: 15,
    paddingHorizontal: 30,
  },
});

export default ScannerScreen;
