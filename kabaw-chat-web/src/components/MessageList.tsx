import ChatMessage from './ChatMessage';
import type { ServerMessage } from '../types/Message';

interface Props {
  messages: ServerMessage[];
  currentUserId: string | null;
}

function MessageList({ messages, currentUserId }: Props) {
  return (
    <div className="flex flex-col gap-2 p-4">
      {messages.map((msg, i) => {
        const messageKey =
          msg.type === 'system'
            ? `${msg.user_id || 'system'}-${i}`
            : `${msg.timestamp || new Date().toISOString()}-${i}`;

        return (
          <ChatMessage
            key={messageKey}
            message={msg}
            isOwnMessage={msg.user_id === currentUserId}
          />
        );
      })}
    </div>
  );
}

export default MessageList;
