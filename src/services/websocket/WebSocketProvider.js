// WebSocket Context Provider
// React Context wrapper for WebSocket service

import React, {createContext, useEffect, useState, useCallback, useRef} from 'react';
import websocketService, {WS_STATES} from './websocketService';
import {Logger} from '../utils/logger';

export const WebSocketContext = createContext(null);

export const WebSocketProvider = ({children, url, autoConnect = false}) => {
  const [connectionState, setConnectionState] = useState(WS_STATES.DISCONNECTED);
  const [lastMessage, setLastMessage] = useState(null);
  const [error, setError] = useState(null);
  const unsubscribersRef = useRef([]);

  // Connect to WebSocket
  const connect = useCallback(async (wsUrl) => {
    try {
      const connected = await websocketService.connect(wsUrl || url);
      return connected;
    } catch (err) {
      Logger.error('Failed to connect WebSocket', err);
      setError(err);
      return false;
    }
  }, [url]);

  // Disconnect from WebSocket
  const disconnect = useCallback(() => {
    websocketService.disconnect();
  }, []);

  // Send message through WebSocket
  const send = useCallback((type, data, options) => {
    return websocketService.send(type, data, options);
  }, []);

  // Subscribe to specific message type
  const subscribe = useCallback((messageType, callback) => {
    return websocketService.on(messageType, callback);
  }, []);

  // Get connection status
  const getStatus = useCallback(() => {
    return websocketService.getStatus();
  }, []);

  useEffect(() => {
    // Subscribe to connection state changes
    const unsubConnected = websocketService.on('connected', () => {
      Logger.info('WebSocket connected (Context)');
      setConnectionState(WS_STATES.CONNECTED);
      setError(null);
    });

    const unsubDisconnected = websocketService.on('disconnected', (info) => {
      Logger.info('WebSocket disconnected (Context)', info);
      setConnectionState(WS_STATES.DISCONNECTED);
    });

    const unsubError = websocketService.on('error', (err) => {
      Logger.error('WebSocket error (Context)', err);
      setConnectionState(WS_STATES.ERROR);
      setError(err);
    });

    // Subscribe to all messages
    const unsubMessage = websocketService.on('message', (message) => {
      setLastMessage(message);
    });

    unsubscribersRef.current = [
      unsubConnected,
      unsubDisconnected,
      unsubError,
      unsubMessage,
    ];

    // Auto-connect if enabled
    if (autoConnect && url) {
      connect(url);
    }

    // Cleanup on unmount
    return () => {
      unsubscribersRef.current.forEach(unsub => unsub());
      if (autoConnect) {
        disconnect();
      }
    };
  }, [url, autoConnect, connect, disconnect]);

  const value = {
    connectionState,
    isConnected: connectionState === WS_STATES.CONNECTED,
    lastMessage,
    error,
    connect,
    disconnect,
    send,
    subscribe,
    getStatus,
  };

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
};

// Custom hook to use WebSocket context
export const useWebSocket = () => {
  const context = React.useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket must be used within WebSocketProvider');
  }
  return context;
};

