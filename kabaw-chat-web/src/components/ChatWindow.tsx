import { useEffect, useRef, useState } from 'react';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import SettingsModal from './SettingsModal';
import infoIcon from '../assets/info.svg';
import downIcon from '../assets/down.png';

import type { ServerMessage } from '../types/Message';

interface Props {
  messages: ServerMessage[];
  onSend: (msg: string) => void;
  connected: boolean;
  username: string;
  channel: string;
  onConnect: (username: string, channel: string) => void;
  onDisconnect: () => void;
}

function ChatWindow({
  messages,
  onSend,
  connected,
  username,
  channel,
  onConnect,
  onDisconnect,
}: Props) {
  const scrollContainer = useRef<HTMLDivElement | null>(null);
  const forceScrollRef = useRef(false);
  const showScrollDownRef = useRef(false);
  const currentUserIdRef = useRef<string | null>(null);

  const [showScrollDown, setShowScrollDown] = useState(false);
  const [showSettings, setShowSettings] = useState(
    username === 'Anonymous' || channel === 'general'
  );
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  const bufferDistance = 100;

  const isNearBottom = () => {
    const container = scrollContainer.current;
    if (!container) return true;

    return (
      container.scrollTop + container.clientHeight >=
      container.scrollHeight - bufferDistance
    );
  };

  const handleScroll = () => setShowScrollDown(!isNearBottom());

  const handleSend = (msg: string) => {
    forceScrollRef.current = true;
    onSend(msg);
    setShowScrollDown(false);
  };

  const scrollToBottom = () => {
    scrollContainer.current?.scrollTo({
      top: scrollContainer.current.scrollHeight,
      behavior: 'smooth',
    });
    showScrollDownRef.current = false;
  };

  useEffect(() => {
    const container = scrollContainer.current;
    if (!container) return;

    if (forceScrollRef.current) {
      container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
      forceScrollRef.current = false;
      showScrollDownRef.current = false;
    } else {
      if (isNearBottom()) {
        container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
        showScrollDownRef.current = false;
      } else {
        showScrollDownRef.current = true;
      }
    }

    setShowScrollDown(showScrollDownRef.current);
  }, [messages]);

  useEffect(() => {
    if (!messages.length) return;
    const lastMsg = messages[messages.length - 1];

    if (
      lastMsg.type === 'user_connected' &&
      lastMsg.user_id &&
      lastMsg.user_id !== currentUserId
    ) {
      currentUserIdRef.current = lastMsg.user_id;
      setCurrentUserId(currentUserIdRef.current);
    }
  }, [messages, currentUserId]);

  return (
    <div className="flex flex-col h-full max-h-screen bg-gray-900">
      <header className="p-4 bg-gray-800 border-b border-gray-700 flex justify-between items-center">
        <h1 className="text-xl font-semibold">Kabaw Chat</h1>
        <div className="flex items-center space-x-4">
          <span
            className={`text-sm ${
              connected ? 'text-green-400' : 'text-red-400'
            }`}
          >
            {connected ? 'Connected' : 'Disconnected'}
          </span>
          <button
            className="cursor-pointer"
            onClick={() => setShowSettings(true)}
          >
            <img
              src={infoIcon}
              className="w-6 h-6 brightness-100 hover:brightness-50 transition duration-150"
              alt="Info"
            />
          </button>
        </div>
      </header>

      <div
        ref={scrollContainer}
        onScroll={handleScroll}
        className="flex-1 overflow-auto relative"
      >
        <MessageList messages={messages} currentUserId={currentUserId} />
      </div>

      {showScrollDown && (
        <button
          onClick={scrollToBottom}
          className="absolute bottom-20 left-1/2 -translate-x-1/2 bg-gray-700 hover:bg-gray-600 p-2 rounded-full shadow-lg transition"
        >
          <img src={downIcon} alt="Scroll down" className="w-5 h-5" />
        </button>
      )}

      <MessageInput onSend={handleSend} disabled={showSettings || !connected} />

      <SettingsModal
        isOpen={showSettings}
        connected={connected}
        username={username}
        channel={channel}
        onConnect={(u, c) => {
          onConnect(u, c);
          setShowSettings(false);
        }}
        onDisconnect={() => {
          onDisconnect();
          setShowSettings(false);
        }}
        onClose={() => setShowSettings(false)}
      />
    </div>
  );
}

export default ChatWindow;
