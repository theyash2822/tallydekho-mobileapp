// Network Monitor Utility
// Monitors network connectivity and provides status updates

import NetInfo from '@react-native-community/netinfo';
import {Logger} from './logger';

class NetworkMonitorClass {
  constructor() {
    this.isNetworkConnected = true;
    this.listeners = new Set();
    this.unsubscribe = null;
    this.connectionType = 'unknown';
  }

  /**
   * Initialize network monitoring
   */
  init() {
    if (this.unsubscribe) {
      return; // Already initialized
    }

    this.unsubscribe = NetInfo.addEventListener(state => {
      const wasConnected = this.isNetworkConnected;
      this.isNetworkConnected = state.isConnected ?? true;
      this.connectionType = state.type;

      // Connection status changed
      if (wasConnected !== this.isNetworkConnected) {
        Logger.info('Network status changed', {
          isConnected: this.isNetworkConnected,
          type: this.connectionType,
        });

        // Notify all listeners
        this.notifyListeners(this.isNetworkConnected, state);
      }
    });

    // Get initial state
    NetInfo.fetch().then(state => {
      this.isNetworkConnected = state.isConnected ?? true;
      this.connectionType = state.type;
      Logger.info('Network monitor initialized', {
        isConnected: this.isNetworkConnected,
        type: this.connectionType,
      });
    });
  }

  /**
   * Clean up network monitoring
   */
  cleanup() {
    if (this.unsubscribe) {
      this.unsubscribe();
      this.unsubscribe = null;
    }
    this.listeners.clear();
  }

  /**
   * Check if network is connected
   */
  async isConnected() {
    try {
      const state = await NetInfo.fetch();
      this.isNetworkConnected = state.isConnected ?? true;
      return this.isNetworkConnected;
    } catch (error) {
      Logger.error('Failed to check network status', error);
      return this.isNetworkConnected; // Return cached value
    }
  }

  /**
   * Get current connection type
   */
  async getConnectionType() {
    try {
      const state = await NetInfo.fetch();
      return state.type;
    } catch (error) {
      Logger.error('Failed to get connection type', error);
      return this.connectionType;
    }
  }

  /**
   * Check if connection is expensive (cellular data)
   */
  async isConnectionExpensive() {
    try {
      const state = await NetInfo.fetch();
      return state.details?.isConnectionExpensive ?? false;
    } catch (error) {
      Logger.error('Failed to check if connection is expensive', error);
      return false;
    }
  }

  /**
   * Add listener for network status changes
   */
  addListener(callback) {
    this.listeners.add(callback);
    
    // Return unsubscribe function
    return () => {
      this.listeners.delete(callback);
    };
  }

  /**
   * Notify all listeners of network status change
   */
  notifyListeners(isConnected, state) {
    this.listeners.forEach(callback => {
      try {
        callback(isConnected, state);
      } catch (error) {
        Logger.error('Error in network listener callback', error);
      }
    });
  }

  /**
   * Wait for network to be available
   */
  async waitForConnection(timeout = 30000) {
    const startTime = Date.now();
    
    while (Date.now() - startTime < timeout) {
      const isConnected = await this.isConnected();
      if (isConnected) {
        return true;
      }
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    return false;
  }
}

// Export singleton instance
export const NetworkMonitor = new NetworkMonitorClass();

// Auto-initialize on import
NetworkMonitor.init();

