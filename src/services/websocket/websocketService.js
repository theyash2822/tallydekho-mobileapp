/**
 * WebSocket Service for Real-Time Communication using Socket.IO
 * Handles real-time notifications from server including device unpair events
 */

import {Alert} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {io} from 'socket.io-client';
import {API_CONFIG} from '../api/config';
import {Logger} from '../utils/logger';

class WebSocketService {
  constructor() {
    this.socket = null;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.isConnecting = false;
    this.isIntentionallyClosed = false;
    this.eventHandlers = new Map();
  }

  /**
   * Connect to Socket.IO server
   */
  async connect() {
    if (this.socket?.connected || this.isConnecting) {
      Logger.debug('[Socket.IO] Already connected or connecting');
      return;
    }

    try {
      this.isConnecting = true;
      this.isIntentionallyClosed = false;

      // Get auth token for authentication
      const authToken = await AsyncStorage.getItem('authToken');
      if (!authToken) {
        Logger.warn('[Socket.IO] No auth token - not connecting');
        this.isConnecting = false;
        return;
      }

      // Build Socket.IO URL (use https:// not wss://)
      const socketUrl = API_CONFIG.WS_URL.replace('wss://', 'https://').replace('ws://', 'http://');
      
      Logger.info('[Socket.IO] Connecting...', {
        baseUrl: socketUrl,
        hasToken: !!authToken,
      });

      // Create Socket.IO connection
      this.socket = io(socketUrl, {
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionAttempts: this.maxReconnectAttempts,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
      });

      // Connection opened
      this.socket.on('connect', () => {
    
        Logger.info('[Socket.IO] Connected', {socketId: this.socket.id});
        this.reconnectAttempts = 0;
        this.isConnecting = false;
        
        // Emit 'register' event after connection with token
        this.socket.emit('register', {
          type: 'mobile',
          token: authToken,
        });
     
        Logger.info('[Socket.IO] Register event emitted', {type: 'mobile'});
      });

      // Connection error
      this.socket.on('connect_error', (error) => {
     
        Logger.error('[Socket.IO] Connection Error', {
          error: error.message || error,
          connected: this.socket?.connected,
        });
        this.isConnecting = false;
      });

      // Disconnected
      this.socket.on('disconnect', (reason) => {
      
        Logger.warn('[Socket.IO] Disconnected', {reason});
        
        this.isConnecting = false;
        
        // Trigger disconnected event
        this.emit('disconnected');

        // Auto-reconnect if not intentionally closed
        if (!this.isIntentionallyClosed && reason !== 'io client disconnect') {
          this.reconnect();
        }
      });

      // Listen for 'synced' event
      this.socket.on('synced', (data) => {
     
        Logger.info('[Socket.IO] Synced event received', data);
        this.handleSynced(data);
      });

      // Listen for 'unpaired' event
      this.socket.on('unpaired', (data) => {
      
        Logger.warn('[Socket.IO] Unpaired event received', data);
        this.handleUnpaired(data);
      });

      // Listen for 'logout' event
      this.socket.on('logout', (data) => {
      
        Logger.warn('[Socket.IO] Logout event received', data);
        this.handleLogout(data);
      });

      // Reconnection attempt
      this.socket.on('reconnect_attempt', (attemptNumber) => {
      
        Logger.info('[Socket.IO] Reconnection attempt', {attempt: attemptNumber});
        this.reconnectAttempts = attemptNumber;
      });

      // Reconnected
      this.socket.on('reconnect', (attemptNumber) => {
      
        Logger.info('[Socket.IO] Reconnected', {attempts: attemptNumber});
        this.reconnectAttempts = 0;
        
        // Re-register after reconnection
        const token = authToken;
        if (token) {
          this.socket.emit('register', {
            type: 'mobile',
            token: token,
          });
          Logger.info('[Socket.IO] Re-registered after reconnection');
        }
      });

    } catch (error) {
    
      Logger.error('[Socket.IO] Connection failed', error);
      this.isConnecting = false;
      this.reconnect();
    }
  }

  /**
   * Handle synced event - when user syncs from desktop app
   */
  async handleSynced(payload) {
   
    Logger.info('[Socket.IO] Synced event received', payload);

    // Emit event for app to handle (e.g., refresh companies)
    this.emit('synced', payload);
  }

  /**
   * Handle unpaired event - when user unpairs from desktop app
   */
  async handleUnpaired(payload) {
  
    Logger.warn('[Socket.IO] Unpaired event received', payload);

    // Clear all pairing data immediately
    await AsyncStorage.removeItem('pairedDevice');
    await AsyncStorage.setItem('isPaired', 'false');
    await AsyncStorage.removeItem('cachedCompanies');
    await AsyncStorage.removeItem('hasFetchedCompanies');
    await AsyncStorage.removeItem('SELECTED_GUID');

    // Disconnect Socket.IO (but allow reconnection since token still exists)
    // Don't use disconnect() as it marks as intentionally closed
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    this.isConnected = false;
    this.isConnecting = false;
    // Don't set isIntentionallyClosed = true, so WebSocketProvider can reconnect

    // Show alert to user and navigate to pairing screen
    Alert.alert(
      'Device Unpaired',
      'Your device has been unpaired from the desktop. You will need to pair again to continue using the app.',
      [
        {
          text: 'OK',
          onPress: () => {
            Logger.info('[Socket.IO] User acknowledged unpair alert, navigating to PairTallywithPasskey');
            // Emit event for app to handle (e.g., clear companies)
            this.emit('unpaired', payload);
            
            // Navigate to PairTallywithPasskey screen
            // Use navigation ref if available
            if (this.navigationRef && this.navigationRef.current) {
              try {
                this.navigationRef.current.navigate('pairWithPassKey');
                Logger.info('[Socket.IO] Navigated to PairTallywithPasskey via navigation ref');
              } catch (navError) {
                Logger.error('[Socket.IO] Navigation error', navError);
                // Fallback: try using reset to ensure navigation works
                try {
                  this.navigationRef.current.reset({
                    index: 0,
                    routes: [{name: 'pairWithPassKey'}],
                  });
                  Logger.info('[Socket.IO] Navigated to PairTallywithPasskey via reset');
                } catch (resetError) {
                  Logger.error('[Socket.IO] Reset navigation error', resetError);
                }
              }
            } else {
              Logger.warn('[Socket.IO] Navigation ref not available, cannot navigate');
            }
          },
        },
      ],
      {cancelable: false},
    );
  }

  /**
   * Set navigation ref for programmatic navigation
   * @param {Object} navigationRef - React Navigation ref
   */
  setNavigationRef(navigationRef) {
    this.navigationRef = navigationRef;
  }

  /**
   * Handle logout event - when user logs in on another device
   * This is triggered by the server when a new login is detected on another device
   */
  async handleLogout(payload) {
   
    Logger.warn('[Socket.IO] Logout event received - user logged in on another device', payload);

    // Clear session and disconnect
    await AsyncStorage.removeItem('authToken');
    await AsyncStorage.removeItem('pairedDevice');
    await AsyncStorage.setItem('isPaired', 'false');
    await AsyncStorage.setItem('loggedOut', 'true');
    await AsyncStorage.removeItem('cachedCompanies');
    await AsyncStorage.removeItem('hasFetchedCompanies');
    await AsyncStorage.removeItem('onboardingDone');
    await AsyncStorage.removeItem('SELECTED_GUID');

    // Disconnect Socket.IO (don't emit disconnect event - this is automatic logout from server)
    this.isIntentionallyClosed = true;
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    Logger.info('[Socket.IO] Disconnected due to logout from another device');

    // Show alert to user
    Alert.alert(
      'Logged Out',
      'You have been logged out because you logged in on another device. Only one device can be logged in at a time.',
      [
        {
          text: 'OK',
          onPress: () => {
            Logger.info('[Socket.IO] User acknowledged logout alert');
            // Emit event for app to handle (e.g., navigate to login)
            this.emit('logout', payload);
            
            // Navigate to login screen
            if (this.navigationRef && this.navigationRef.current) {
              try {
                this.navigationRef.current.navigate('login');
                Logger.info('[Socket.IO] Navigated to login screen after logout');
              } catch (navError) {
                Logger.error('[Socket.IO] Navigation error after logout', navError);
              }
            }
          },
        },
      ],
      {cancelable: false},
    );
  }

  /**
   * Send message to server
   */
  send(data) {
    if (this.socket?.connected) {
      this.socket.emit(data.type || 'message', data);
      Logger.debug('[Socket.IO] Message sent', data);
    } else {
      Logger.warn('[Socket.IO] Cannot send - not connected');
    }
  }

  /**
   * Emit custom event to server
   */
  emitToServer(event, data) {
    if (this.socket?.connected) {
      this.socket.emit(event, data);
      Logger.debug('[Socket.IO] Event emitted to server', {event, data});
    } else {
      Logger.warn('[Socket.IO] Cannot emit - not connected', {event});
    }
  }

  /**
   * Disconnect from Socket.IO
   * @param {Object} options
   * @param {'manual'|'auto'} options.reason - reason for disconnect
   */
  disconnect(options = {}) {
    const reason = options.reason || 'auto';
  
    this.isIntentionallyClosed = true;

    const shouldNotifyServer = reason === 'manual';
    if (shouldNotifyServer && this.socket?.connected) {
      this.emitToServer('client-disconnect');
      Logger.info('[Socket.IO] client-disconnect event emitted before manual logout');
    }

    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }

    Logger.info(`[Socket.IO] Disconnected (${reason})`);
  }

  /**
   * Reconnect with exponential backoff
   */
  reconnect() {
    if (this.isIntentionallyClosed || this.isConnecting) {
      return;
    }

    this.reconnectAttempts++;

    if (this.reconnectAttempts > this.maxReconnectAttempts) {
   
      Logger.warn('[Socket.IO] Max reconnect attempts reached');
      return;
    }

    const delay = 1000 * Math.pow(2, this.reconnectAttempts - 1);
   

    setTimeout(() => {
    
      this.connect();
    }, delay);
  }

  /**
   * Register event handler (for internal event system)
   */
  on(event, handler) {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, []);
    }
    this.eventHandlers.get(event).push(handler);
  }

  /**
   * Unregister event handler
   */
  off(event, handler) {
    if (this.eventHandlers.has(event)) {
      const handlers = this.eventHandlers.get(event);
      const index = handlers.indexOf(handler);
      if (index > -1) {
        handlers.splice(index, 1);
      }
    }
  }

  /**
   * Emit event to all registered handlers (internal event system)
   */
  emit(event, data) {
    if (this.eventHandlers.has(event)) {
      this.eventHandlers.get(event).forEach(handler => {
        try {
          handler(data);
        } catch (error) {
          Logger.error('[Socket.IO] Event handler error', error);
        }
      });
    }
  }

  /**
   * Check if connected
   */
  isConnected() {
    const connected = this.socket?.connected === true;
    if (connected) {
      Logger.debug('[Socket.IO] Connection status: CONNECTED', {socketId: this.socket.id});
    } else {
      Logger.debug('[Socket.IO] Connection status: NOT CONNECTED', {
        connected: this.socket?.connected,
        disconnected: this.socket?.disconnected,
      });
    }
    return connected;
  }
}

// Export singleton instance
const wsService = new WebSocketService();
export default wsService;
