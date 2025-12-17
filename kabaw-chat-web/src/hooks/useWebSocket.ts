import { useEffect, useRef, useState } from 'react';
import type { ServerMessage } from '../types/Message';

export function useWebSocket(
  url: string | null,
  username: string,
  channel: string,
  onDisconnectCallback: () => void
) {
  const wsRef = useRef<WebSocket | null>(null);
  const currentUserID = useRef<string | null>(null);

  const [messages, setMessages] = useState<ServerMessage[]>([]);
  const [connected, setConnected] = useState(false);

  const addMessage = (
    type: ServerMessage['type'],
    username: string,
    content: string,
    channel?: string
  ) => {
    setMessages((prev) => [
      ...prev,
      {
        type,
        username,
        user_id:
          type === 'system' ? 'system' : (currentUserID.current ?? undefined),
        content,
        timestamp: new Date().toISOString(),
        channel,
      },
    ]);
  };

  useEffect(() => {
    if (!url) {
      wsRef.current?.close();
      wsRef.current = null;
      return;
    }

    const connect = () => {
      if (wsRef.current) return;

      console.log('Attempting to connect to:', url);

      wsRef.current = new WebSocket(url);

      wsRef.current.onopen = () => {
        console.log('Connecting...');
        setMessages([]);
        setConnected(true);
        addMessage(
          'system',
          'System',
          `Connected as ${username} to channel ${channel}`
        );
      };

      wsRef.current.onmessage = (event) => {
        const msg = JSON.parse(event.data) as ServerMessage;

        if (msg.type === 'user_connected' && msg.user_id) {
          currentUserID.current = msg.user_id;
          addMessage(
            'system',
            'System',
            `Your user ID: ${currentUserID.current}`
          );
        }

        setMessages((prev) => [...prev, msg]);
      };

      wsRef.current.onclose = () => {
        console.log('Disconnected');
        wsRef.current?.close();
        wsRef.current = null;
        setConnected(false);
        addMessage('system', 'System', 'Connection disconnected');
        onDisconnectCallback();
      };

      wsRef.current.onerror = () => {
        console.log('Connection error');
        setConnected(false);
        addMessage('system', 'System', 'Connection error');
      };
    };

    connect();

    return () => {
      wsRef.current?.close();
    };
  }, [url, username, channel, onDisconnectCallback]);

  const sendMessage = (content: string) => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      console.warn('Cannot send message — WebSocket not open');
      return;
    }

    wsRef.current.send(
      JSON.stringify({
        type: 'message',
        content,
      })
    );
  };

  const disconnect = () => {
    if (!wsRef.current) return;
    console.log('Disconnecting...');
    wsRef.current?.close();
    wsRef.current = null;
    setConnected(false);
  };

  return { messages, connected, sendMessage, disconnect };
}
