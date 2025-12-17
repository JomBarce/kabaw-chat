import { useMemo, useState, useCallback } from 'react';
import { useWebSocket } from './hooks/useWebSocket';
import ChatWindow from './components/ChatWindow';

function App() {
  const [username, setUsername] = useState('Anonymous');
  const [channel, setChannel] = useState('general');
  const [shouldConnect, setShouldConnect] = useState(false);

  // Unplanned disconnection handler
  const onDisconnectCallback = useCallback(() => {
    setShouldConnect(false);
  }, []);

  // Dynamic WebSocket URL
  const wsURL = useMemo(() => {
    if (!shouldConnect) return null;
    return `ws://localhost:8080/ws?username=${encodeURIComponent(username)}&channel=${encodeURIComponent(channel)}`;
  }, [username, channel, shouldConnect]);

  const { messages, connected, sendMessage, disconnect } = useWebSocket(
    wsURL,
    username,
    channel,
    onDisconnectCallback
  );

  // Reconnect handler
  const handleConnect = useCallback((u: string, c: string) => {
    setUsername(u);
    setChannel(c);
    setShouldConnect(true);
  }, []);

  // Disconnect handler
  const handleDisconnect = useCallback(() => {
    disconnect();
    setShouldConnect(false);
  }, [disconnect]);

  return (
    <div className="h-screen w-screen">
      <ChatWindow
        messages={messages}
        onSend={sendMessage}
        connected={connected}
        username={username}
        channel={channel}
        onConnect={handleConnect}
        onDisconnect={handleDisconnect}
      />
    </div>
  );
}

export default App;
