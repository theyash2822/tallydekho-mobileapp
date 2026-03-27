/**
 * @deprecated This WebSocket implementation is deprecated.
 * Please use src/services/websocket/WebSocketProvider.js instead.
 *
 * New implementation offers:
 * - Auto-reconnection with exponential backoff
 * - Message queuing when disconnected
 * - Heartbeat/ping-pong mechanism
 * - Event subscription system
 * - Better error recovery
 *
 * See MIGRATION_GUIDE.md for migration instructions.
 */

import React, {createContext, useEffect, useRef} from 'react';
import {Alert} from 'react-native';

export const WebSocketContext = createContext();

export const WebSocketProvider = ({children, onMessage}) => {
  const ws = useRef(null);

  useEffect(() => {
    // Replace with your WebSocket server URL
    ws.current = new WebSocket('ws://YOUR_SERVER_IP:PORT');

    ws.current.onopen = () => {
    };

    ws.current.onmessage = e => {
      const data = JSON.parse(e.data);

      // Trigger refresh callback
      onMessage && onMessage(data);
    };

    ws.current.onerror = error => {
    };

    ws.current.onclose = () => {
      setTimeout(() => {
        // Auto reconnect
        ws.current = new WebSocket('ws://YOUR_SERVER_IP:PORT');
      }, 3000);
    };

    return () => {
      ws.current && ws.current.close();
    };
  }, []);

  return (
    <WebSocketContext.Provider value={{}}>{children}</WebSocketContext.Provider>
  );
};
