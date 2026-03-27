/**
 * WebSocket Provider
 * Manages WebSocket connection lifecycle across the app
 * Automatically connects/disconnects based on pairing status and app state
 */

import React, {createContext, useEffect, useContext} from 'react';
import {AppState} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import wsService from '../services/websocket/websocketService';
import {Logger} from '../services/utils/logger';

export const WebSocketContext = createContext({
  ws: wsService,
  isConnected: false,
});

export const WebSocketProvider = ({children}) => {
  const appState = React.useRef(AppState.currentState);

  // Initialize WebSocket on mount
  useEffect(() => {
    const initWebSocket = async () => {
      const authToken = await AsyncStorage.getItem('authToken');
      const loggedOut = await AsyncStorage.getItem('loggedOut');
      
      if (authToken && loggedOut !== 'true') {
        Logger.info('[WS Provider] Auth token found - connecting WebSocket');
        wsService.connect().catch(error => {
          Logger.error('[WS Provider] Connection error', error);
        });
      } else {
        Logger.debug('[WS Provider] No auth token or logged out - skipping WebSocket', {
          hasToken: !!authToken,
          loggedOut: loggedOut === 'true',
        });
      }
    };

    // Small delay to ensure app is fully initialized
    const timer = setTimeout(() => {
      initWebSocket();
    }, 500);

    // Cleanup on unmount
    return () => {
      clearTimeout(timer);
      Logger.info('[WS Provider] Unmounting - disconnecting WebSocket');
      wsService.disconnect();
    };
  }, []);

  // Handle app state changes (foreground/background)
  useEffect(() => {
    const subscription = AppState.addEventListener('change', async nextAppState => {
      Logger.debug('[WS Provider] App state changed', {
        from: appState.current,
        to: nextAppState,
      });

      // App coming to foreground
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        const authToken = await AsyncStorage.getItem('authToken');
        if (authToken && !wsService.isConnected()) {
          Logger.info('[WS Provider] App active - reconnecting WebSocket');
          wsService.connect();
        }
      }
      // App going to background - disconnect to save battery
      else if (nextAppState.match(/inactive|background/)) {
        Logger.info('[WS Provider] App backgrounded - disconnecting WebSocket');
        wsService.disconnect();
      }

      appState.current = nextAppState;
    });

    return () => subscription.remove();
  }, []);

  // Monitor auth token changes
  useEffect(() => {
    const checkAuthStatus = setInterval(async () => {
      const authToken = await AsyncStorage.getItem('authToken');
      const loggedOut = await AsyncStorage.getItem('loggedOut');
      
      // Connect if token exists and not logged out
      if (authToken && loggedOut !== 'true' && !wsService.isConnected() && AppState.currentState === 'active') {
        Logger.info('[WS Provider] Auth token found - connecting WebSocket');
        wsService.connect();
      }
      // Disconnect if no token or logged out
      else if ((!authToken || loggedOut === 'true') && wsService.isConnected()) {
        Logger.info('[WS Provider] No auth token or logged out - disconnecting WebSocket');
        wsService.disconnect();
      }
    }, 5000); // Check every 5 seconds

    return () => clearInterval(checkAuthStatus);
  }, []);

  return (
    <WebSocketContext.Provider value={{ws: wsService}}>
      {children}
    </WebSocketContext.Provider>
  );
};

// Custom hook to use WebSocket
export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket must be used within WebSocketProvider');
  }
  return context;
};

export default WebSocketProvider;

