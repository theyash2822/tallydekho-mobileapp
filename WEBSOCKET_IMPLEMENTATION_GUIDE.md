# WebSocket Implementation Guide

## 📋 Overview

WebSocket implementation for real-time device unpair detection. When desktop unpairs a device, the mobile app receives instant notification and shows alert immediately.

---

## ✅ What's Been Implemented (Mobile App)

### 1. **WebSocket Service** (`src/services/websocket/WebSocketService.js`)
- Handles WebSocket connection lifecycle
- Auto-reconnect with exponential backoff
- Heartbeat to keep connection alive
- Event-based message handling
- Device unpair notification handler

### 2. **WebSocket Provider** (`src/context/WebSocketProvider.js`)
- React Context for app-wide WebSocket access
- Auto-connects when device is paired
- Auto-disconnects in background (saves battery)
- Monitors pairing status changes

### 3. **App Integration** (`App.js`)
- Wrapped entire app with `WebSocketProvider`
- Now works globally across all screens

---

## 🚀 How It Works

```
┌──────────────┐         ┌──────────────┐         ┌──────────────┐
│   Desktop    │         │    Server    │         │  Mobile App  │
│     App      │         │  (WebSocket) │         │              │
└──────────────┘         └──────────────┘         └──────────────┘
       │                        │                        │
       │  1. User clicks unpair │                        │
       │───────────────────────>│                        │
       │                        │                        │
       │                        │  2. Push notification  │
       │                        │  {type: "DEVICE_       │
       │                        │   UNPAIRED"}           │
       │                        │───────────────────────>│
       │                        │                        │
       │                        │                 3. Alert shows! 🚨
       │                        │                 4. Clear data
       │                        │                 5. Disconnect
```

---

## 🔧 Server-Side Requirements

### **Message Format**

Your WebSocket server should send messages in this format:

```javascript
{
  "type": "DEVICE_UNPAIRED",
  "payload": {
    "message": "Device unpaired from desktop",
    "timestamp": "2024-01-15T10:30:00Z",
    "reason": "user_action" // optional
  }
}
```

### **Authentication**

Mobile app connects with auth token in URL:
```
wss://your-server.com/mobile?token=<authToken>
```

Or sends auth message after connection:
```javascript
{
  "type": "AUTH",
  "token": "<authToken>"
}
```

### **Message Types**

The mobile app handles these message types:

| Type | Description | Action |
|------|-------------|--------|
| `DEVICE_UNPAIRED` | Device unpaired from desktop | Shows alert, clears data, disconnects |
| `AUTH_SUCCESS` | Authentication successful | Logs success |
| `AUTH_FAILED` | Authentication failed | Disconnects |
| `PONG` | Heartbeat response | Keeps connection alive |
| `COMPANY_UPDATED` | Company data changed | Emits event for app to handle |
| `DATA_SYNCED` | Data sync completed | Emits event for app to handle |

### **Example Server Implementation (Node.js + Socket.io)**

```javascript
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Store mobile device connections
const mobileDevices = new Map(); // { authToken: socket }

io.on('connection', (socket) => {
  console.log('Mobile device connected:', socket.id);
  
  // Handle authentication
  socket.on('message', (message) => {
    const data = JSON.parse(message);
    
    if (data.type === 'AUTH') {
      // Verify token
      const userId = verifyAuthToken(data.token);
      
      if (userId) {
        socket.authToken = data.token;
        socket.userId = userId;
        mobileDevices.set(data.token, socket);
        
        // Send success response
        socket.send(JSON.stringify({
          type: 'AUTH_SUCCESS',
          payload: { userId }
        }));
        
        console.log('Mobile authenticated:', userId);
      } else {
        socket.send(JSON.stringify({
          type: 'AUTH_FAILED',
          payload: { message: 'Invalid token' }
        }));
        socket.close();
      }
    }
    
    // Handle heartbeat
    if (data.type === 'PING') {
      socket.send(JSON.stringify({ type: 'PONG' }));
    }
  });
  
  // Handle disconnect
  socket.on('disconnect', () => {
    if (socket.authToken) {
      mobileDevices.delete(socket.authToken);
      console.log('Mobile disconnected:', socket.userId);
    }
  });
});

// Desktop API endpoint to unpair device
app.post('/api/unpair-device', (req, res) => {
  const { authToken } = req.body;
  
  // Find mobile device connection
  const mobileSocket = mobileDevices.get(authToken);
  
  if (mobileSocket) {
    // Send unpair notification
    mobileSocket.send(JSON.stringify({
      type: 'DEVICE_UNPAIRED',
      payload: {
        message: 'Your device has been unpaired from desktop',
        timestamp: new Date().toISOString(),
        reason: 'user_action'
      }
    }));
    
    console.log('Sent unpair notification to mobile');
    
    // Remove from active connections
    mobileDevices.delete(authToken);
    
    // Close connection
    setTimeout(() => mobileSocket.close(), 1000);
  }
  
  // Delete token from database
  deleteAuthToken(authToken);
  
  res.json({ success: true });
});

server.listen(3000, () => {
  console.log('Server running on port 3000');
});
```

---

## 📱 Mobile App Usage

### **Accessing WebSocket in Components**

```javascript
import {useWebSocket} from '../context/WebSocketProvider';

const MyComponent = () => {
  const {ws} = useWebSocket();
  
  useEffect(() => {
    // Listen for custom events
    const handleDataSynced = (data) => {
      console.log('Data synced:', data);
      // Refresh your UI
    };
    
    ws.on('dataSynced', handleDataSynced);
    
    // Cleanup
    return () => {
      ws.off('dataSynced', handleDataSynced);
    };
  }, [ws]);
  
  return <View>...</View>;
};
```

### **Sending Messages**

```javascript
const {ws} = useWebSocket();

// Send custom message
ws.send({
  type: 'REFRESH_REQUEST',
  payload: { companyId: '123' }
});
```

### **Checking Connection Status**

```javascript
const {ws} = useWebSocket();

if (ws.isConnected()) {
  console.log('WebSocket is connected!');
}
```

---

## 🎯 Testing

### **1. Test Connection**

```javascript
// In any component
import wsService from '../services/websocket/WebSocketService';

useEffect(() => {
  wsService.on('connected', () => {
    console.log('✅ WebSocket connected successfully!');
  });
  
  wsService.on('disconnected', () => {
    console.log('❌ WebSocket disconnected');
  });
}, []);
```

### **2. Test Unpair Notification**

From your server, send this message:
```javascript
{
  "type": "DEVICE_UNPAIRED",
  "payload": {
    "message": "Test unpair",
    "timestamp": "2024-01-15T10:30:00Z"
  }
}
```

Expected behavior:
- Alert appears immediately
- User data is cleared
- WebSocket disconnects

### **3. Console Logs**

Look for these logs:
```
🔌 [WebSocket] Connecting to: wss://test.tallydekho.com
✅ [WebSocket] Connected successfully!
📩 [WebSocket] Message received: {type: "DEVICE_UNPAIRED"}
🚨 [WebSocket] DEVICE UNPAIRED notification received!
```

---

## 🔧 Configuration

### **WebSocket URL**

Edit `src/services/api/config.js`:

```javascript
const WS_BASE_URLS = {
  [ENV.DEV]: 'wss://test.tallydekho.com',
  [ENV.STAGING]: 'wss://staging.tallydekho.com',
  [ENV.PROD]: 'wss://api.tallydekho.com',
};
```

### **Reconnect Settings**

Edit `src/services/websocket/WebSocketService.js`:

```javascript
constructor() {
  this.maxReconnectAttempts = 5; // Max retry attempts
  this.reconnectDelay = 3000; // Initial delay (ms)
  // ...
}
```

### **Heartbeat Interval**

```javascript
startHeartbeat() {
  this.heartbeatInterval = setInterval(() => {
    this.send({type: 'PING'});
  }, 30000); // Change this value (ms)
}
```

---

## 🐛 Troubleshooting

### **WebSocket Not Connecting**

1. Check if device is paired:
   ```javascript
   const isPaired = await AsyncStorage.getItem('isPaired');
   console.log('Paired:', isPaired);
   ```

2. Check auth token:
   ```javascript
   const token = await AsyncStorage.getItem('authToken');
   console.log('Token:', token ? 'exists' : 'missing');
   ```

3. Verify WebSocket URL:
   ```javascript
   console.log('WS URL:', API_CONFIG.WS_URL);
   ```

### **Not Receiving Messages**

1. Check server is sending correct format
2. Look for parsing errors in logs
3. Verify message type matches expected types

### **Alert Not Showing**

1. Check if `DEVICE_UNPAIRED` message is received
2. Verify Alert is not blocked by another alert
3. Check AsyncStorage flags

---

## ⚡ Performance

### **Battery Optimization**

- Disconnects when app goes to background
- Reconnects when app returns to foreground
- Only connects when device is paired

### **Network Optimization**

- Single persistent connection (vs constant polling)
- Heartbeat every 30 seconds (configurable)
- Auto-reconnect with exponential backoff

---

## 🎉 Benefits Over Polling

| Feature | Polling | WebSocket |
|---------|---------|-----------|
| **Detection Speed** | 1-2 seconds | **Instant (milliseconds)** ✅ |
| **Battery Usage** | High (constant requests) | **Low (idle connection)** ✅ |
| **Server Load** | High (requests every second) | **Minimal** ✅ |
| **Network Usage** | High | **Low** ✅ |
| **Scalability** | Poor | **Excellent** ✅ |

---

## 📝 Next Steps

1. **Implement server-side WebSocket** (see example above)
2. **Test unpair flow** end-to-end
3. **Monitor logs** for connection issues
4. **Adjust settings** as needed (reconnect, heartbeat, etc.)

---

## 🔗 Additional Resources

- [WebSocket API Documentation](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)
- [Socket.io Documentation](https://socket.io/docs/)
- [React Native WebSocket](https://reactnative.dev/docs/network#websocket-support)

---

## 📞 Support

For issues or questions:
1. Check console logs for WebSocket messages
2. Verify server is sending correct message format
3. Test with mock WebSocket server first


