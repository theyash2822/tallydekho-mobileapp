/**
 * WebSocket Debug Component
 * Use this to test and debug WebSocket connection
 * Add this to any screen to see connection status
 */

import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useWebSocket } from '../../context/WebSocketProvider';
import Colors from '../../utils/Colors';

const WebSocketDebug = () => {
  const { ws } = useWebSocket();
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState(null);
  const [messageCount, setMessageCount] = useState(0);

  useEffect(() => {
    // Check connection status
    const checkConnection = setInterval(() => {
      setIsConnected(ws.isConnected());
    }, 1000);

    // Listen for connected event
    const handleConnected = () => {
      setIsConnected(true);
    };

    // Listen for disconnected event
    const handleDisconnected = () => {
      setIsConnected(false);
    };

    // Listen for all message types (for debugging)
    const handleMessage = (data) => {
      setLastMessage(data);
      setMessageCount(prev => prev + 1);
    };

    ws.on('connected', handleConnected);
    ws.on('disconnected', handleDisconnected);

    // Listen for specific message types
    ws.on('deviceUnpaired', handleMessage);
    ws.on('companyUpdated', handleMessage);
    ws.on('dataSynced', handleMessage);

    return () => {
      clearInterval(checkConnection);
      ws.off('connected', handleConnected);
      ws.off('disconnected', handleDisconnected);
      ws.off('deviceUnpaired', handleMessage);
      ws.off('companyUpdated', handleMessage);
      ws.off('dataSynced', handleMessage);
    };
  }, [ws]);

  const handleConnect = () => {
    ws.connect();
  };

  const handleDisconnect = () => {
    ws.disconnect();
  };

  const handleTestMessage = () => {
    ws.send({
      type: 'TEST',
      payload: {
        message: 'Test from mobile app',
        timestamp: new Date().toISOString(),
      },
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>WebSocket Debug</Text>

      <View style={styles.statusRow}>
        <Text style={styles.label}>Status:</Text>
        <View style={[styles.indicator, isConnected ? styles.connected : styles.disconnected]} />
        <Text style={styles.statusText}>
          {isConnected ? 'Connected ✓' : 'Disconnected ✗'}
        </Text>
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.label}>Messages:</Text>
        <Text style={styles.value}>{messageCount}</Text>
      </View>

      {lastMessage && (
        <View style={styles.messageBox}>
          <Text style={styles.messageLabel}>Last Message:</Text>
          <Text style={styles.messageText}>
            {JSON.stringify(lastMessage, null, 2)}
          </Text>
        </View>
      )}

      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[styles.button, styles.connectButton]}
          onPress={handleConnect}
          disabled={isConnected}>
          <Text style={styles.buttonText}>Connect</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.disconnectButton]}
          onPress={handleDisconnect}
          disabled={!isConnected}>
          <Text style={styles.buttonText}>Disconnect</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[styles.button, styles.testButton]}
        onPress={handleTestMessage}
        disabled={!isConnected}>
        <Text style={styles.buttonText}>Send Test Message</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 8,
    margin: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginRight: 8,
    color: '#555',
  },
  value: {
    fontSize: 14,
    color: '#333',
  },
  indicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  connected: {
    backgroundColor: '#4CAF50',
  },
  disconnected: {
    backgroundColor: '#F44336',
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  messageBox: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 4,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  messageLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 5,
    color: '#555',
  },
  messageText: {
    fontSize: 11,
    fontFamily: 'monospace',
    color: '#333',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  connectButton: {
    backgroundColor: Colors.primary || '#4CAF50',
    flex: 1,
    marginRight: 5,
  },
  disconnectButton: {
    backgroundColor: '#F44336',
    flex: 1,
    marginLeft: 5,
  },
  testButton: {
    backgroundColor: '#2196F3',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default WebSocketDebug;

