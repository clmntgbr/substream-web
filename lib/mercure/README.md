# Mercure Real-Time Integration

## Quick Start

This module provides real-time updates using Mercure SSE (Server-Sent Events).

### Setup

1. Add environment variables to `.env.local`:

```bash
NEXT_PUBLIC_MERCURE_URL=http://mercure/.well-known/mercure
NEXT_PUBLIC_MERCURE_JWT_SECRET=!ChangeThisMercureHubJWTSecretKey!
```

2. The integration is already active in:
   - **Stream Context**: Receives real-time stream updates
   - **Notification Context**: Receives real-time notification updates

### Usage

The `useMercure` hook automatically manages SSE connections:

```typescript
import { useMercure } from "@/lib/mercure";

const { isConnected, isReconnecting, disconnect, reconnect } = useMercure({
  topics: ["/streams", "/notifications"],
  onMessage: (message) => {
    console.log("Received:", message);
    // Handle message based on message.type
  },
  onError: (error) => console.error("Connection error:", error),
  onOpen: () => console.log("Connected!"),
  enabled: true, // Set to false to disable
});
```

### Message Types

#### Streams (`/streams` topic)

- `stream.created` - New stream added
- `stream.updated` - Stream metadata changed
- `stream.processing` - Processing in progress
- `stream.completed` - Processing finished successfully
- `stream.failed` - Processing failed
- `stream.deleted` - Stream removed

#### Notifications (`/notifications` topic)

- `notification.created` - New notification
- `notification.updated` - Notification status changed

### Features

✅ **Automatic Reconnection**: Exponential backoff on connection loss  
✅ **Authentication-Aware**: Only connects when user is authenticated  
✅ **Route-Aware**: Disconnects on public routes  
✅ **Type-Safe**: Full TypeScript support  
✅ **Error Handling**: Graceful degradation if Mercure is unavailable

### Architecture

```
useMercure Hook
    ↓
EventSource Connection
    ↓
Mercure Hub (Backend)
    ↓
Stream/Notification Updates
    ↓
Redux Dispatch → UI Update
```

### Debugging

Check browser console for connection logs:

- `"Connected to Mercure for stream updates"` - Connection successful
- `"Received Mercure message: ..."` - Message received
- `"Attempting to reconnect..."` - Reconnection in progress

Check Network tab in DevTools:

- Filter by "EventSource"
- Look for connection to `/.well-known/mercure`

### Documentation

- [Full Setup Guide](../../MERCURE_SETUP.md)
- [Backend Integration Examples](../../MERCURE_BACKEND_EXAMPLE.md)
